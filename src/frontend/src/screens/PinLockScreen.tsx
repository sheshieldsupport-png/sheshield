import { AlertTriangle, Fingerprint, Lock, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface PinLockScreenProps {
  onUnlock: () => void;
}

type SecurityData = {
  pin: string | null;
  biometricEnabled: boolean;
  credentialId?: string;
  credentialIds?: string[];
};

function loadSecurityData(): SecurityData {
  try {
    const raw = localStorage.getItem("sheshield_security");
    if (!raw) return { pin: null, biometricEnabled: false };
    return JSON.parse(raw) as SecurityData;
  } catch {
    return { pin: null, biometricEnabled: false };
  }
}

type BiometricState = "idle" | "scanning" | "success" | "error";

export default function PinLockScreen({ onUnlock }: PinLockScreenProps) {
  const [digits, setDigits] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [shake, setShake] = useState(false);
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [lockUntil, setLockUntil] = useState<number | null>(null);
  const [countdown, setCountdown] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const secData = loadSecurityData();

  const [bioState, setBioState] = useState<BiometricState>("idle");
  const [bioProgress, setBioProgress] = useState(0);
  const [scanY, setScanY] = useState(0);
  const progressIntervalRef = useRef<ReturnType<typeof setInterval> | null>(
    null,
  );
  const scanAnimRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // All credential IDs (support multiple fingerprints)
  const allCredentialIds: string[] = secData.credentialIds?.length
    ? secData.credentialIds
    : secData.credentialId
      ? [secData.credentialId]
      : [];

  useEffect(() => {
    if (!lockUntil) return;
    function tick() {
      const remaining = Math.ceil(((lockUntil ?? 0) - Date.now()) / 1000);
      if (remaining <= 0) {
        setLockUntil(null);
        setCountdown(0);
        setError(null);
        if (timerRef.current) clearInterval(timerRef.current);
      } else {
        setCountdown(remaining);
      }
    }
    tick();
    timerRef.current = setInterval(tick, 500);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [lockUntil]);

  function getLockDuration(attempts: number): number {
    const tier = Math.floor(attempts / 5);
    return tier * 10;
  }

  function recordFailed(next: number) {
    if (next % 5 === 0) {
      const lockSec = getLockDuration(next);
      if (lockSec > 0) {
        setLockUntil(Date.now() + lockSec * 1000);
        setError(`Too many attempts. Locked for ${lockSec}s.`);
        return;
      }
    }
    setError(
      `Wrong PIN. ${next % 5 === 0 ? "" : `${5 - (next % 5)} attempt(s) left before lockout.`}`,
    );
  }

  function triggerShake() {
    setShake(true);
    setTimeout(() => setShake(false), 500);
  }

  function handleDigit(d: string) {
    if (lockUntil && Date.now() < lockUntil) return;
    if (digits.length >= 4) return;
    setError(null);
    const next = [...digits, d];
    setDigits(next);
    if (next.length === 4) {
      setTimeout(() => {
        if (next.join("") === secData.pin) {
          onUnlock();
        } else {
          const nextFail = failedAttempts + 1;
          setFailedAttempts(nextFail);
          recordFailed(nextFail);
          triggerShake();
          setDigits([]);
        }
      }, 180);
    }
  }

  function handleDelete() {
    if (lockUntil && Date.now() < lockUntil) return;
    setError(null);
    setDigits((prev) => prev.slice(0, -1));
  }

  function stopScanAnimation() {
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current);
      progressIntervalRef.current = null;
    }
    if (scanAnimRef.current) {
      clearInterval(scanAnimRef.current);
      scanAnimRef.current = null;
    }
  }

  function startScanAnimation(onComplete: () => void) {
    setBioProgress(0);
    setScanY(0);

    let scanPos = 0;
    scanAnimRef.current = setInterval(() => {
      scanPos += 2;
      if (scanPos > 100) scanPos = 0;
      setScanY(scanPos);
    }, 20);

    let prog = 0;
    progressIntervalRef.current = setInterval(() => {
      prog += 10;
      setBioProgress(prog);
      if (prog >= 100) {
        stopScanAnimation();
        onComplete();
      }
    }, 200);
  }

  async function handleBiometric() {
    if (!secData.biometricEnabled || bioState === "scanning" || isLocked)
      return;

    setBioState("scanning");
    setBioProgress(0);
    setError(null);

    let webauthnSuccess = false;
    let webauthnError: Error | null = null;

    const webauthnPromise = (async () => {
      try {
        const challenge = new Uint8Array(32);
        crypto.getRandomValues(challenge);
        const publicKeyOptions: PublicKeyCredentialRequestOptions = {
          challenge,
          userVerification: "required",
          timeout: 60000,
        };
        if (allCredentialIds.length > 0) {
          publicKeyOptions.allowCredentials = allCredentialIds.map((id) => ({
            id: Uint8Array.from(atob(id), (c) => c.charCodeAt(0)),
            type: "public-key" as const,
            transports: ["internal" as AuthenticatorTransport],
          }));
        }
        await navigator.credentials.get({ publicKey: publicKeyOptions });
        webauthnSuccess = true;
      } catch (err) {
        webauthnError = err instanceof Error ? err : new Error(String(err));
      }
    })();

    startScanAnimation(async () => {
      await webauthnPromise;
      if (webauthnSuccess) {
        setBioState("success");
        setTimeout(() => {
          onUnlock();
        }, 600);
      } else {
        const msg = webauthnError?.message ?? "";
        if (
          !msg.toLowerCase().includes("cancel") &&
          !msg.toLowerCase().includes("abort")
        ) {
          const nextFail = failedAttempts + 1;
          setFailedAttempts(nextFail);
          recordFailed(nextFail);
        }
        setBioState("error");
        setBioProgress(0);
        setTimeout(() => {
          setBioState("idle");
        }, 2000);
      }
    });
  }

  const isLocked = lockUntil !== null && Date.now() < lockUntil;
  const keys = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "", "0", "del"];

  const glowColor =
    bioState === "success"
      ? "0 0 20px oklch(0.72 0.25 145), 0 0 40px oklch(0.55 0.20 145)"
      : bioState === "error"
        ? "0 0 20px oklch(0.65 0.25 25), 0 0 40px oklch(0.50 0.20 25)"
        : "0 0 20px oklch(0.65 0.25 235), 0 0 40px oklch(0.50 0.20 235), 0 0 60px oklch(0.35 0.15 235)";

  const borderColor =
    bioState === "success"
      ? "oklch(0.72 0.25 145)"
      : bioState === "error"
        ? "oklch(0.65 0.25 25)"
        : "oklch(0.65 0.25 235)";

  const iconColor =
    bioState === "success"
      ? "oklch(0.72 0.25 145)"
      : bioState === "error"
        ? "oklch(0.65 0.25 25)"
        : "oklch(0.75 0.22 235)";

  // Only show label for scanning, success, and error — NOT idle
  const bioLabel =
    bioState === "scanning"
      ? "Scanning..."
      : bioState === "success"
        ? "Verified!"
        : bioState === "error"
          ? "Failed"
          : null;

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center"
      style={{
        background:
          "linear-gradient(160deg, oklch(0.12 0.04 295) 0%, oklch(0.08 0.02 265) 100%)",
      }}
    >
      {/* Logo area */}
      <div className="flex flex-col items-center gap-3 mb-8">
        <div
          className="w-16 h-16 rounded-2xl flex items-center justify-center"
          style={{
            background:
              "linear-gradient(135deg, oklch(0.58 0.25 340) 0%, oklch(0.40 0.20 295) 100%)",
          }}
        >
          <Lock className="w-8 h-8 text-white" />
        </div>
        <p className="font-display font-bold text-xl text-white">SheShield</p>
        <p className="text-sm" style={{ color: "oklch(0.75 0.05 265)" }}>
          Enter your PIN to continue
        </p>
      </div>

      {/* Dots */}
      <div
        className="flex gap-4 mb-6"
        style={{
          animation: shake ? "shake 0.4s ease" : undefined,
        }}
      >
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            className="w-4 h-4 rounded-full border-2 transition-all duration-200"
            style={{
              background:
                digits.length > i ? "oklch(0.75 0.25 340)" : "transparent",
              borderColor: error
                ? "oklch(0.65 0.22 25)"
                : "oklch(0.75 0.25 340)",
            }}
          />
        ))}
      </div>

      {/* Error / lockout */}
      {isLocked ? (
        <div className="flex flex-col items-center gap-2 mb-6">
          <div
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm"
            style={{
              background: "oklch(0.20 0.04 25)",
              color: "oklch(0.75 0.22 25)",
            }}
          >
            <AlertTriangle className="w-4 h-4" />
            Locked — wait {countdown}s
          </div>
        </div>
      ) : error ? (
        <div
          className="flex items-center gap-2 px-4 py-2 mb-6 rounded-xl text-sm"
          style={{
            background: "oklch(0.18 0.04 25)",
            color: "oklch(0.75 0.22 25)",
          }}
        >
          <AlertTriangle className="w-4 h-4 flex-shrink-0" />
          {error}
        </div>
      ) : (
        <div className="mb-6 h-10" />
      )}

      {/* Keypad */}
      <div className="grid grid-cols-3 gap-3 w-64">
        {keys.map((k) => {
          if (k === "") return <div key="keypad-empty" />;
          if (k === "del")
            return (
              <button
                key="del"
                type="button"
                onClick={handleDelete}
                className="h-14 rounded-2xl flex items-center justify-center text-lg font-medium transition-all active:scale-95"
                style={{
                  background: "oklch(0.20 0.03 265)",
                  color: "oklch(0.70 0.05 265)",
                }}
              >
                <X className="w-5 h-5" />
              </button>
            );
          return (
            <button
              key={k}
              type="button"
              onClick={() => handleDigit(k)}
              disabled={isLocked}
              className="h-14 rounded-2xl flex items-center justify-center text-xl font-semibold transition-all active:scale-95 hover:brightness-110 disabled:opacity-40"
              style={{
                background: "oklch(0.18 0.03 265)",
                color: "white",
                border: "1px solid oklch(0.28 0.04 295)",
              }}
            >
              {k}
            </button>
          );
        })}
      </div>

      {/* Fingerprint area — only shown if biometric is enabled */}
      {secData.biometricEnabled && (
        <div className="mt-8 flex flex-col items-center gap-3">
          <button
            type="button"
            onClick={handleBiometric}
            disabled={isLocked || bioState === "scanning"}
            className="relative flex items-center justify-center disabled:opacity-50 transition-transform active:scale-95"
            style={{ width: 100, height: 100 }}
            aria-label="Use fingerprint to unlock"
          >
            {/* Pulse rings in idle */}
            {bioState === "idle" && (
              <>
                <span
                  className="absolute rounded-full"
                  style={{
                    width: 100,
                    height: 100,
                    border: "2px solid oklch(0.65 0.25 235)",
                    opacity: 0,
                    animation: "bioPulse 2s ease-out infinite",
                  }}
                />
                <span
                  className="absolute rounded-full"
                  style={{
                    width: 100,
                    height: 100,
                    border: "2px solid oklch(0.65 0.25 235)",
                    opacity: 0,
                    animation: "bioPulse 2s ease-out 0.7s infinite",
                  }}
                />
              </>
            )}

            {/* Main circle */}
            <div
              className="relative flex items-center justify-center rounded-full overflow-hidden transition-all duration-300"
              style={{
                width: 80,
                height: 80,
                background: "oklch(0.14 0.04 265)",
                border: `2px solid ${borderColor}`,
                boxShadow: glowColor,
                transition: "box-shadow 0.4s, border-color 0.4s",
              }}
            >
              <Fingerprint
                style={{
                  width: 44,
                  height: 44,
                  color: iconColor,
                  filter: `drop-shadow(0 0 8px ${iconColor})`,
                  transition: "color 0.3s, filter 0.3s",
                }}
              />

              {/* Scan sweep line */}
              {bioState === "scanning" && (
                <div
                  className="absolute left-0 right-0 pointer-events-none"
                  style={{
                    top: `${scanY}%`,
                    height: 2,
                    background:
                      "linear-gradient(90deg, transparent 0%, oklch(0.90 0.15 200) 20%, oklch(0.98 0.05 195) 50%, oklch(0.90 0.15 200) 80%, transparent 100%)",
                    boxShadow: "0 0 8px 2px oklch(0.75 0.20 220)",
                    borderRadius: 9999,
                    opacity: 0.95,
                  }}
                />
              )}
            </div>
          </button>

          {/* Progress bar — scanning only */}
          {bioState === "scanning" && (
            <div
              className="rounded-full overflow-hidden"
              style={{
                width: 160,
                height: 4,
                background: "oklch(0.22 0.04 265)",
              }}
            >
              <div
                className="h-full rounded-full transition-all duration-200"
                style={{
                  width: `${bioProgress}%`,
                  background:
                    "linear-gradient(90deg, oklch(0.55 0.25 235) 0%, oklch(0.75 0.22 215) 100%)",
                  boxShadow: "0 0 6px oklch(0.65 0.25 235)",
                }}
              />
            </div>
          )}

          {/* State label — only for scanning/success/error, NOT idle */}
          {bioLabel && (
            <span
              className="text-xs font-medium tracking-wide transition-colors duration-300"
              style={{
                color:
                  bioState === "error"
                    ? "oklch(0.72 0.22 25)"
                    : bioState === "success"
                      ? "oklch(0.72 0.22 145)"
                      : "oklch(0.65 0.15 235)",
              }}
            >
              {bioLabel}
            </span>
          )}
        </div>
      )}

      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          20% { transform: translateX(-8px); }
          40% { transform: translateX(8px); }
          60% { transform: translateX(-6px); }
          80% { transform: translateX(6px); }
        }
        @keyframes bioPulse {
          0% { transform: scale(1); opacity: 0.7; }
          100% { transform: scale(1.6); opacity: 0; }
        }
      `}</style>
    </div>
  );
}
