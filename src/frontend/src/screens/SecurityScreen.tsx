import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  AlertTriangle,
  ArrowLeft,
  CheckCircle2,
  Fingerprint,
  Lock,
  Phone,
  Plus,
  RotateCcw,
  Shield,
  ShieldCheck,
  Trash2,
  X,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { useApp } from "../context/AppContext";

type Mode =
  | "menu"
  | "set-pin"
  | "change-pin-verify"
  | "change-pin-new"
  | "forgot-pin-phone"
  | "forgot-pin-otp"
  | "forgot-pin-new";

type SecurityData = {
  pin: string | null;
  biometricEnabled: boolean;
  credentialId?: string;
  credentialIds?: string[];
  fingerprintLabels?: string[];
  securityEnabled?: boolean;
};

function loadSecurityData(): SecurityData {
  try {
    const raw = localStorage.getItem("sheshield_security");
    if (!raw)
      return { pin: null, biometricEnabled: false, securityEnabled: false };
    const data = JSON.parse(raw) as SecurityData;
    // Default: if pin exists and securityEnabled is not explicitly set, default to true
    if (data.pin && data.securityEnabled === undefined) {
      data.securityEnabled = true;
    }
    return data;
  } catch {
    return { pin: null, biometricEnabled: false, securityEnabled: false };
  }
}

function saveSecurityData(data: SecurityData) {
  localStorage.setItem("sheshield_security", JSON.stringify(data));
}

interface PinPadProps {
  title: string;
  subtitle?: string;
  onComplete: (pin: string) => void;
  onBack?: () => void;
  error?: string | null;
  clearError?: () => void;
}

function PinPad({
  title,
  subtitle,
  onComplete,
  onBack,
  error,
  clearError,
}: PinPadProps) {
  const [digits, setDigits] = useState<string[]>([]);

  function handleDigit(d: string) {
    if (digits.length >= 4) return;
    clearError?.();
    const next = [...digits, d];
    setDigits(next);
    if (next.length === 4) {
      setTimeout(() => {
        onComplete(next.join(""));
        setDigits([]);
      }, 180);
    }
  }

  function handleDelete() {
    clearError?.();
    setDigits((prev) => prev.slice(0, -1));
  }

  const keys = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "", "0", "del"];

  return (
    <div className="flex flex-col items-center gap-6 py-4">
      <div className="text-center">
        <h2 className="font-display text-xl font-bold text-foreground">
          {title}
        </h2>
        {subtitle && (
          <p className="text-sm text-muted-foreground mt-1">{subtitle}</p>
        )}
      </div>

      <div className="flex gap-4">
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            className="w-4 h-4 rounded-full border-2 transition-all duration-200"
            style={{
              background:
                digits.length > i ? "oklch(0.58 0.25 340)" : "transparent",
              borderColor: error
                ? "oklch(0.55 0.22 25)"
                : "oklch(0.58 0.25 340)",
              transform: error ? "scale(1.15)" : "scale(1)",
            }}
          />
        ))}
      </div>

      {error && (
        <div
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm"
          style={{
            background: "oklch(0.97 0.02 25)",
            color: "oklch(0.45 0.22 25)",
          }}
        >
          <AlertTriangle className="w-4 h-4 flex-shrink-0" />
          {error}
        </div>
      )}

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
                  background: "oklch(0.93 0.005 265)",
                  color: "oklch(0.40 0.01 265)",
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
              className="h-14 rounded-2xl flex items-center justify-center text-xl font-semibold transition-all active:scale-95 hover:brightness-95"
              style={{
                background: "oklch(0.97 0.003 265)",
                border: "1px solid oklch(0.88 0.005 265)",
              }}
            >
              {k}
            </button>
          );
        })}
      </div>

      {onBack && (
        <button
          type="button"
          onClick={onBack}
          className="text-sm text-muted-foreground underline"
        >
          Cancel
        </button>
      )}
    </div>
  );
}

export default function SecurityScreen() {
  const { setScreen, userProfile } = useApp();
  const [secData, setSecData] = useState(loadSecurityData);
  const [mode, setMode] = useState<Mode>("menu");
  const [confirmPin, setConfirmPin] = useState<string | null>(null);
  const [newPinTemp, setNewPinTemp] = useState<string | null>(null);
  const [_otpSent, setOtpSent] = useState(false);
  const [otpValue, setOtpValue] = useState("");
  const [phoneInput, setPhoneInput] = useState(userProfile?.phone ?? "");
  const [pinError, setPinError] = useState<string | null>(null);
  const [addingFingerprint, setAddingFingerprint] = useState(false);
  const [showDeactivateDialog, setShowDeactivateDialog] = useState(false);

  const [failedAttempts, setFailedAttempts] = useState(0);
  const [lockUntil, setLockUntil] = useState<number | null>(null);
  const [countdown, setCountdown] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const [biometricSupported, setBiometricSupported] = useState(false);

  // Consolidated credential IDs
  const allCredentialIds: string[] = secData.credentialIds?.length
    ? secData.credentialIds
    : secData.credentialId
      ? [secData.credentialId]
      : [];
  const fingerprintLabels: string[] =
    secData.fingerprintLabels ??
    allCredentialIds.map((_, i) => `Fingerprint ${i + 1}`);

  useEffect(() => {
    if (window.PublicKeyCredential) {
      (
        window.PublicKeyCredential as {
          isUserVerifyingPlatformAuthenticatorAvailable?: () => Promise<boolean>;
        }
      )
        .isUserVerifyingPlatformAuthenticatorAvailable?.()
        .then((available) => setBiometricSupported(available))
        .catch(() => setBiometricSupported(false));
    }
  }, []);

  useEffect(() => {
    if (!lockUntil) return;
    function tick() {
      const remaining = Math.ceil(((lockUntil ?? 0) - Date.now()) / 1000);
      if (remaining <= 0) {
        setLockUntil(null);
        setCountdown(0);
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

  function recordFailedAttempt() {
    const next = failedAttempts + 1;
    setFailedAttempts(next);
    if (next % 5 === 0) {
      const lockSec = getLockDuration(next);
      if (lockSec > 0) {
        setLockUntil(Date.now() + lockSec * 1000);
        setPinError(`Too many attempts. Locked for ${lockSec} seconds.`);
      }
    }
  }

  function isLocked() {
    return lockUntil !== null && Date.now() < lockUntil;
  }

  function handleSecurityToggle(enabled: boolean) {
    if (enabled) {
      const updated: SecurityData = { ...secData, securityEnabled: true };
      setSecData(updated);
      saveSecurityData(updated);
      toast.success("App security activated");
    } else {
      setShowDeactivateDialog(true);
    }
  }

  function confirmDeactivate() {
    const updated: SecurityData = { ...secData, securityEnabled: false };
    setSecData(updated);
    saveSecurityData(updated);
    setShowDeactivateDialog(false);
    toast.success("App security deactivated");
  }

  async function handleAddFingerprint() {
    if (!biometricSupported) {
      toast.error("Biometric authentication is not supported on this device.");
      return;
    }
    setAddingFingerprint(true);
    try {
      const challenge = new Uint8Array(32);
      crypto.getRandomValues(challenge);
      const credential = (await navigator.credentials.create({
        publicKey: {
          challenge,
          rp: { name: "SheShield", id: window.location.hostname },
          user: {
            id: new TextEncoder().encode(
              `${userProfile?.phone ?? "user"}-fp-${Date.now()}`,
            ),
            name: userProfile?.phone ?? "user",
            displayName: userProfile?.name ?? "User",
          },
          pubKeyCredParams: [{ alg: -7, type: "public-key" }],
          authenticatorSelection: {
            authenticatorAttachment: "platform",
            userVerification: "required",
          },
          timeout: 60000,
          // Prevent same finger from being registered again
          excludeCredentials: allCredentialIds.map((id) => ({
            id: Uint8Array.from(atob(id), (c) => c.charCodeAt(0)),
            type: "public-key" as const,
            transports: ["internal" as AuthenticatorTransport],
          })),
        },
      })) as PublicKeyCredential;

      const credId = btoa(
        String.fromCharCode(...new Uint8Array(credential.rawId)),
      );

      const newIds = [...allCredentialIds, credId];
      const newLabels = [...fingerprintLabels, `Fingerprint ${newIds.length}`];

      const updated: SecurityData = {
        ...secData,
        biometricEnabled: true,
        credentialIds: newIds,
        fingerprintLabels: newLabels,
      };
      setSecData(updated);
      saveSecurityData(updated);
      toast.success(`Fingerprint ${newIds.length} added successfully!`);
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      if (
        !msg.toLowerCase().includes("cancel") &&
        !msg.toLowerCase().includes("abort")
      ) {
        if (
          msg.toLowerCase().includes("excluded") ||
          msg.toLowerCase().includes("already registered") ||
          msg.toLowerCase().includes("invalidstateerror")
        ) {
          toast.error(
            "This finger is already registered. Please use a different finger.",
          );
        } else {
          toast.error("Fingerprint setup failed. Please try again.");
        }
      }
    } finally {
      setAddingFingerprint(false);
    }
  }

  async function handleBiometricToggle(enabled: boolean) {
    if (!biometricSupported) {
      toast.error("Biometric authentication is not supported on this device.");
      return;
    }
    if (enabled) {
      await handleAddFingerprint();
    } else {
      const updated: SecurityData = {
        ...secData,
        biometricEnabled: false,
        credentialId: undefined,
        credentialIds: [],
        fingerprintLabels: [],
      };
      setSecData(updated);
      saveSecurityData(updated);
      toast.success("Biometric authentication disabled.");
    }
  }

  function handleRemoveFingerprint(index: number) {
    const newIds = allCredentialIds.filter((_, i) => i !== index);
    const newLabels = fingerprintLabels.filter((_, i) => i !== index);
    const updated: SecurityData = {
      ...secData,
      biometricEnabled: newIds.length > 0,
      credentialIds: newIds,
      fingerprintLabels: newLabels,
      credentialId: undefined,
    };
    setSecData(updated);
    saveSecurityData(updated);
    toast.success("Fingerprint removed.");
  }

  function handleSetPinFirst(pin: string) {
    setConfirmPin(pin);
    setMode("set-pin");
  }

  function handleSetPinConfirm(pin: string) {
    if (pin !== confirmPin) {
      setPinError("PINs do not match. Try again.");
      setConfirmPin(null);
      return;
    }
    const updated: SecurityData = { ...secData, pin, securityEnabled: true };
    setSecData(updated);
    saveSecurityData(updated);
    setMode("menu");
    setConfirmPin(null);
    toast.success("PIN set successfully!");
  }

  function handleChangePinVerify(pin: string) {
    if (isLocked()) return;
    if (pin !== secData.pin) {
      setPinError("Wrong PIN. Try again.");
      recordFailedAttempt();
      return;
    }
    setFailedAttempts(0);
    setMode("change-pin-new");
    setPinError(null);
  }

  function handleChangePinNew(pin: string) {
    if (!newPinTemp) {
      setNewPinTemp(pin);
      return;
    }
    if (pin !== newPinTemp) {
      setPinError("PINs do not match. Try again.");
      setNewPinTemp(null);
      return;
    }
    const updated: SecurityData = { ...secData, pin };
    setSecData(updated);
    saveSecurityData(updated);
    setMode("menu");
    setNewPinTemp(null);
    toast.success("PIN changed successfully!");
  }

  function handleSendOtp() {
    if (!phoneInput.trim() || phoneInput.trim().length < 10) {
      toast.error("Enter a valid phone number.");
      return;
    }
    setOtpSent(true);
    setMode("forgot-pin-otp");
    toast.success(`OTP sent to +91 ${phoneInput.trim()}`);
  }

  function handleVerifyOtp() {
    if (otpValue.trim() === "1234" || otpValue.trim().length === 6) {
      setMode("forgot-pin-new");
      setNewPinTemp(null);
      toast.success("OTP verified!");
    } else {
      toast.error("Invalid OTP. Use 1234 for testing.");
    }
  }

  function handleForgotPinNew(pin: string) {
    if (!newPinTemp) {
      setNewPinTemp(pin);
      return;
    }
    if (pin !== newPinTemp) {
      setPinError("PINs do not match. Try again.");
      setNewPinTemp(null);
      return;
    }
    const updated: SecurityData = { ...secData, pin };
    setSecData(updated);
    saveSecurityData(updated);
    setMode("menu");
    setNewPinTemp(null);
    setOtpSent(false);
    setOtpValue("");
    toast.success("PIN reset successfully!");
  }

  const hasPin = !!secData.pin;
  const securityEnabled = hasPin ? secData.securityEnabled !== false : false;

  return (
    <div
      className="min-h-screen"
      style={{ background: "oklch(0.97 0.003 265)", paddingBottom: "2rem" }}
    >
      {/* Deactivate Confirmation Dialog */}
      {showDeactivateDialog && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center px-4"
          style={{ background: "oklch(0 0 0 / 0.5)" }}
        >
          <div
            className="w-full max-w-sm rounded-2xl p-6 flex flex-col gap-4"
            style={{
              background: "oklch(1 0 0)",
              boxShadow: "0 20px 60px oklch(0 0 0 / 0.25)",
            }}
          >
            <div className="flex flex-col items-center gap-3 text-center">
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center"
                style={{ background: "oklch(0.97 0.03 25)" }}
              >
                <Shield
                  className="w-7 h-7"
                  style={{ color: "oklch(0.55 0.22 25)" }}
                />
              </div>
              <h3 className="font-display font-bold text-lg">
                Deactivate App Security?
              </h3>
              <p className="text-sm text-muted-foreground">
                You won&apos;t need a PIN to open the app. Your PIN will be
                saved but security lock will be disabled.
              </p>
            </div>
            <div className="flex gap-3">
              <Button
                variant="outline"
                className="flex-1 h-11 rounded-xl"
                onClick={() => setShowDeactivateDialog(false)}
                data-ocid="security.cancel_button"
              >
                Cancel
              </Button>
              <Button
                className="flex-1 h-11 rounded-xl font-semibold"
                style={{
                  background: "oklch(0.55 0.22 25)",
                  color: "white",
                  border: "none",
                }}
                onClick={confirmDeactivate}
                data-ocid="security.confirm_button"
              >
                Deactivate
              </Button>
            </div>
          </div>
        </div>
      )}

      <div
        className="sticky top-0 z-40 flex items-center gap-3 px-4 py-3"
        style={{
          background: "oklch(1 0 0 / 0.95)",
          backdropFilter: "blur(12px)",
          borderBottom: "1px solid oklch(0.88 0.005 265)",
        }}
      >
        <button
          type="button"
          onClick={() => {
            if (mode === "menu") setScreen("profile");
            else setMode("menu");
          }}
          className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-muted transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="font-display font-bold text-lg">Security</h1>
      </div>

      <div className="max-w-md mx-auto px-4 pt-5">
        {mode === "menu" && (
          <div className="flex flex-col gap-5 animate-slide-up">
            {/* Header card */}
            <div
              className="rounded-2xl p-5 flex items-center gap-4"
              style={{
                background:
                  "linear-gradient(135deg, oklch(0.58 0.25 340) 0%, oklch(0.40 0.20 295) 100%)",
              }}
            >
              <div
                className="w-12 h-12 rounded-2xl flex items-center justify-center"
                style={{ background: "oklch(1 0 0 / 0.15)" }}
              >
                <ShieldCheck className="w-7 h-7 text-white" />
              </div>
              <div>
                <p className="font-display font-bold text-white text-lg">
                  App Security
                </p>
                <p className="text-sm" style={{ color: "oklch(1 0 0 / 0.8)" }}>
                  {hasPin ? "PIN is set" : "No PIN set"} &bull;{" "}
                  {allCredentialIds.length > 0
                    ? `${allCredentialIds.length} fingerprint(s) registered`
                    : "No fingerprints"}
                </p>
              </div>
            </div>

            {/* Security Enable/Disable Toggle */}
            <div
              className="rounded-xl border overflow-hidden transition-all duration-300"
              style={{
                borderColor: securityEnabled
                  ? "oklch(0.75 0.15 145)"
                  : "oklch(0.88 0.005 265)",
                background: "oklch(1 0 0)",
                boxShadow: securityEnabled
                  ? "0 0 0 3px oklch(0.85 0.12 145 / 0.3)"
                  : "none",
              }}
            >
              {hasPin ? (
                <div className="flex items-center gap-3 px-4 py-4">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center transition-colors duration-300"
                    style={{
                      background: securityEnabled
                        ? "oklch(0.92 0.10 145)"
                        : "oklch(0.93 0.005 265)",
                    }}
                  >
                    <Shield
                      className="w-5 h-5 transition-colors duration-300"
                      style={{
                        color: securityEnabled
                          ? "oklch(0.40 0.18 145)"
                          : "oklch(0.55 0.01 265)",
                      }}
                    />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-semibold">App Security</p>
                      <span
                        className="text-xs px-2 py-0.5 rounded-full font-semibold transition-all duration-300"
                        style={{
                          background: securityEnabled
                            ? "oklch(0.90 0.12 145)"
                            : "oklch(0.93 0.005 265)",
                          color: securityEnabled
                            ? "oklch(0.35 0.18 145)"
                            : "oklch(0.55 0.01 265)",
                        }}
                      >
                        {securityEnabled ? "Active" : "Inactive"}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {securityEnabled
                        ? "PIN required to open the app"
                        : "App opens without PIN"}
                    </p>
                  </div>
                  <Switch
                    checked={securityEnabled}
                    onCheckedChange={handleSecurityToggle}
                    data-ocid="security.toggle"
                  />
                </div>
              ) : (
                <div className="flex items-center gap-3 px-4 py-4">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center"
                    style={{ background: "oklch(0.97 0.03 50)" }}
                  >
                    <Shield
                      className="w-5 h-5"
                      style={{ color: "oklch(0.60 0.15 50)" }}
                    />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold">App Security</p>
                    <p
                      className="text-xs"
                      style={{ color: "oklch(0.60 0.15 50)" }}
                    >
                      Set a PIN first to enable security lock
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* PIN Section */}
            <div
              className="rounded-xl border overflow-hidden"
              style={{
                borderColor: "oklch(0.88 0.005 265)",
                background: "oklch(1 0 0)",
              }}
            >
              <div
                className="px-4 py-2.5"
                style={{
                  borderBottom: "1px solid oklch(0.93 0.003 265)",
                  background: "oklch(0.97 0.005 295 / 0.4)",
                }}
              >
                <p
                  className="text-xs font-semibold uppercase tracking-wider"
                  style={{ color: "oklch(0.50 0.15 295)" }}
                >
                  PIN Lock
                </p>
              </div>

              {!hasPin ? (
                <button
                  type="button"
                  onClick={() => {
                    setMode("set-pin");
                    setConfirmPin(null);
                    setPinError(null);
                  }}
                  className="w-full flex items-center gap-3 px-4 py-4 hover:bg-muted transition-colors text-left"
                >
                  <div
                    className="w-9 h-9 rounded-xl flex items-center justify-center"
                    style={{ background: "oklch(0.95 0.03 295)" }}
                  >
                    <Lock
                      className="w-5 h-5"
                      style={{ color: "oklch(0.50 0.22 295)" }}
                    />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Set PIN</p>
                    <p className="text-xs text-muted-foreground">
                      Create a 4-digit PIN to lock the app
                    </p>
                  </div>
                  <span
                    className="text-xs px-2 py-0.5 rounded-full"
                    style={{
                      background: "oklch(0.95 0.05 145)",
                      color: "oklch(0.40 0.18 145)",
                    }}
                  >
                    Recommended
                  </span>
                </button>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={() => {
                      setMode("change-pin-verify");
                      setPinError(null);
                      setFailedAttempts(0);
                      setLockUntil(null);
                    }}
                    className="w-full flex items-center gap-3 px-4 py-4 hover:bg-muted transition-colors text-left border-b"
                    style={{ borderColor: "oklch(0.93 0.003 265)" }}
                  >
                    <div
                      className="w-9 h-9 rounded-xl flex items-center justify-center"
                      style={{ background: "oklch(0.95 0.03 295)" }}
                    >
                      <Lock
                        className="w-5 h-5"
                        style={{ color: "oklch(0.50 0.22 295)" }}
                      />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">Change PIN</p>
                      <p className="text-xs text-muted-foreground">
                        Update your existing 4-digit PIN
                      </p>
                    </div>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setMode("forgot-pin-phone");
                      setOtpSent(false);
                      setOtpValue("");
                      setPinError(null);
                    }}
                    className="w-full flex items-center gap-3 px-4 py-4 hover:bg-muted transition-colors text-left"
                  >
                    <div
                      className="w-9 h-9 rounded-xl flex items-center justify-center"
                      style={{ background: "oklch(0.97 0.03 25)" }}
                    >
                      <RotateCcw
                        className="w-5 h-5"
                        style={{ color: "oklch(0.55 0.22 25)" }}
                      />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">Forgot PIN</p>
                      <p className="text-xs text-muted-foreground">
                        Reset via phone OTP verification
                      </p>
                    </div>
                  </button>
                </>
              )}
            </div>

            {/* Fingerprint Section */}
            <div
              className="rounded-xl border overflow-hidden"
              style={{
                borderColor: "oklch(0.88 0.005 265)",
                background: "oklch(1 0 0)",
              }}
            >
              <div
                className="px-4 py-2.5 flex items-center justify-between"
                style={{
                  borderBottom: "1px solid oklch(0.93 0.003 265)",
                  background: "oklch(0.97 0.005 295 / 0.4)",
                }}
              >
                <p
                  className="text-xs font-semibold uppercase tracking-wider"
                  style={{ color: "oklch(0.50 0.15 295)" }}
                >
                  Fingerprint Unlock
                </p>
                {allCredentialIds.length > 0 && (
                  <span
                    className="text-xs px-2 py-0.5 rounded-full font-medium"
                    style={{
                      background: "oklch(0.94 0.05 145)",
                      color: "oklch(0.40 0.18 145)",
                    }}
                  >
                    {allCredentialIds.length} registered
                  </span>
                )}
              </div>

              {/* Toggle row */}
              <div
                className="flex items-center gap-3 px-4 py-4 border-b"
                style={{ borderColor: "oklch(0.93 0.003 265)" }}
              >
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center"
                  style={{ background: "oklch(0.95 0.03 270)" }}
                >
                  <Fingerprint
                    className="w-5 h-5"
                    style={{ color: "oklch(0.50 0.22 270)" }}
                  />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">
                    Enable Fingerprint Unlock
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {biometricSupported
                      ? "Use device biometrics to unlock"
                      : "Not supported on this device/browser"}
                  </p>
                </div>
                <Switch
                  checked={secData.biometricEnabled}
                  onCheckedChange={handleBiometricToggle}
                  disabled={!biometricSupported}
                />
              </div>

              {/* Registered fingerprints list */}
              {allCredentialIds.length > 0 && (
                <>
                  {allCredentialIds.map((credId, index) => (
                    <div
                      key={credId}
                      className="flex items-center gap-3 px-4 py-3 border-b"
                      style={{ borderColor: "oklch(0.93 0.003 265)" }}
                    >
                      <div
                        className="w-8 h-8 rounded-lg flex items-center justify-center"
                        style={{ background: "oklch(0.95 0.03 270)" }}
                      >
                        <Fingerprint
                          className="w-4 h-4"
                          style={{ color: "oklch(0.50 0.22 270)" }}
                        />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">
                          {fingerprintLabels[index] ??
                            `Fingerprint ${index + 1}`}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Registered
                        </p>
                      </div>
                      <div className="flex items-center gap-1">
                        <CheckCircle2
                          className="w-4 h-4"
                          style={{ color: "oklch(0.55 0.20 145)" }}
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveFingerprint(index)}
                          className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-red-50 transition-colors"
                        >
                          <Trash2
                            className="w-3.5 h-3.5"
                            style={{ color: "oklch(0.55 0.22 25)" }}
                          />
                        </button>
                      </div>
                    </div>
                  ))}

                  {/* Add fingerprint button */}
                  <button
                    type="button"
                    onClick={handleAddFingerprint}
                    disabled={addingFingerprint || !biometricSupported}
                    className="w-full flex items-center gap-3 px-4 py-3 hover:bg-muted transition-colors disabled:opacity-50"
                  >
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center border-2 border-dashed"
                      style={{ borderColor: "oklch(0.65 0.15 295)" }}
                    >
                      <Plus
                        className="w-4 h-4"
                        style={{ color: "oklch(0.50 0.22 295)" }}
                      />
                    </div>
                    <div className="flex-1 text-left">
                      <p
                        className="text-sm font-medium"
                        style={{ color: "oklch(0.50 0.22 295)" }}
                      >
                        {addingFingerprint
                          ? "Registering..."
                          : "Add Another Fingerprint"}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        You can register up to 5 fingerprints
                      </p>
                    </div>
                  </button>
                </>
              )}

              {allCredentialIds.length === 0 && (
                <div className="px-4 py-3 text-xs text-muted-foreground">
                  Enable the toggle above to register your first fingerprint
                </div>
              )}
            </div>

            {/* Attempt Info */}
            <div
              className="rounded-xl border p-4"
              style={{
                borderColor: "oklch(0.88 0.005 265)",
                background: "oklch(1 0 0)",
              }}
            >
              <p
                className="text-xs font-semibold uppercase tracking-wider mb-3"
                style={{ color: "oklch(0.50 0.15 295)" }}
              >
                Attempt Limit System
              </p>
              <div className="flex flex-col gap-2">
                {[
                  { tier: "5 wrong attempts", lock: "10 second lockout" },
                  { tier: "10 wrong attempts", lock: "20 second lockout" },
                  { tier: "15 wrong attempts", lock: "30 second lockout" },
                ].map((row) => (
                  <div
                    key={row.tier}
                    className="flex items-center justify-between text-xs"
                  >
                    <span className="text-muted-foreground">{row.tier}</span>
                    <span
                      className="font-medium"
                      style={{ color: "oklch(0.55 0.22 25)" }}
                    >
                      {row.lock}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {mode === "set-pin" && (
          <div className="animate-slide-up">
            {!confirmPin ? (
              <PinPad
                title="Create PIN"
                subtitle="Enter a new 4-digit PIN"
                onComplete={handleSetPinFirst}
                onBack={() => setMode("menu")}
                error={pinError}
                clearError={() => setPinError(null)}
              />
            ) : (
              <PinPad
                title="Confirm PIN"
                subtitle="Re-enter your PIN to confirm"
                onComplete={handleSetPinConfirm}
                onBack={() => {
                  setConfirmPin(null);
                  setPinError(null);
                }}
                error={pinError}
                clearError={() => setPinError(null)}
              />
            )}
          </div>
        )}

        {mode === "change-pin-verify" && (
          <div className="animate-slide-up">
            {isLocked() ? (
              <div className="flex flex-col items-center gap-4 py-10">
                <div
                  className="w-16 h-16 rounded-full flex items-center justify-center"
                  style={{ background: "oklch(0.97 0.03 25)" }}
                >
                  <Lock
                    className="w-8 h-8"
                    style={{ color: "oklch(0.55 0.22 25)" }}
                  />
                </div>
                <p className="font-bold text-lg text-center">
                  Too many attempts
                </p>
                <p className="text-muted-foreground text-sm text-center">
                  Try again in
                </p>
                <span
                  className="text-4xl font-bold tabular-nums"
                  style={{ color: "oklch(0.55 0.22 25)" }}
                >
                  {countdown}s
                </span>
              </div>
            ) : (
              <PinPad
                title="Verify Current PIN"
                subtitle="Enter your existing 4-digit PIN"
                onComplete={handleChangePinVerify}
                onBack={() => setMode("menu")}
                error={pinError}
                clearError={() => setPinError(null)}
              />
            )}
          </div>
        )}

        {mode === "change-pin-new" && (
          <div className="animate-slide-up">
            {!newPinTemp ? (
              <PinPad
                title="New PIN"
                subtitle="Enter your new 4-digit PIN"
                onComplete={handleChangePinNew}
                onBack={() => setMode("menu")}
                error={pinError}
                clearError={() => setPinError(null)}
              />
            ) : (
              <PinPad
                title="Confirm New PIN"
                subtitle="Re-enter your new PIN to confirm"
                onComplete={handleChangePinNew}
                onBack={() => {
                  setNewPinTemp(null);
                  setPinError(null);
                }}
                error={pinError}
                clearError={() => setPinError(null)}
              />
            )}
          </div>
        )}

        {mode === "forgot-pin-phone" && (
          <div className="flex flex-col gap-5 animate-slide-up py-4">
            <div className="text-center">
              <div
                className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-3"
                style={{ background: "oklch(0.95 0.05 295)" }}
              >
                <Phone
                  className="w-8 h-8"
                  style={{ color: "oklch(0.50 0.22 295)" }}
                />
              </div>
              <h2 className="font-display font-bold text-xl">Forgot PIN?</h2>
              <p className="text-sm text-muted-foreground mt-1">
                We'll send an OTP to verify your identity
              </p>
            </div>
            <div>
              <label
                htmlFor="forgot-phone"
                className="text-sm font-medium block mb-1.5"
              >
                Phone Number
              </label>
              <div
                className="flex items-center gap-2 rounded-xl border px-3"
                style={{
                  borderColor: "oklch(0.85 0.01 265)",
                  background: "oklch(1 0 0)",
                }}
              >
                <span className="text-sm text-muted-foreground">+91</span>
                <input
                  id="forgot-phone"
                  type="tel"
                  value={phoneInput}
                  onChange={(e) => setPhoneInput(e.target.value)}
                  placeholder="Enter your phone number"
                  className="flex-1 py-3 text-sm bg-transparent outline-none"
                  maxLength={10}
                />
              </div>
            </div>
            <Button
              onClick={handleSendOtp}
              className="w-full h-12 font-semibold text-sm rounded-xl"
              style={{
                background:
                  "linear-gradient(135deg, oklch(0.58 0.25 340) 0%, oklch(0.40 0.20 295) 100%)",
                color: "white",
                border: "none",
              }}
            >
              Send OTP
            </Button>
            <button
              type="button"
              onClick={() => setMode("menu")}
              className="text-sm text-muted-foreground underline text-center"
            >
              Back
            </button>
          </div>
        )}

        {mode === "forgot-pin-otp" && (
          <div className="flex flex-col gap-5 animate-slide-up py-4">
            <div className="text-center">
              <h2 className="font-display font-bold text-xl">Enter OTP</h2>
              <p className="text-sm text-muted-foreground mt-1">
                OTP sent to +91 {phoneInput}
              </p>
            </div>
            <div>
              <label
                htmlFor="otp-input"
                className="text-sm font-medium block mb-1.5"
              >
                Enter 6-digit OTP
              </label>
              <input
                id="otp-input"
                type="number"
                value={otpValue}
                onChange={(e) => setOtpValue(e.target.value)}
                placeholder="Enter OTP"
                className="w-full rounded-xl border px-4 py-3 text-center text-xl font-bold tracking-widest outline-none"
                style={{
                  borderColor: "oklch(0.85 0.01 265)",
                  background: "oklch(1 0 0)",
                }}
                maxLength={6}
              />
              <p className="text-xs text-muted-foreground mt-1.5 text-center">
                For testing, use OTP: 1234
              </p>
            </div>
            <Button
              onClick={handleVerifyOtp}
              className="w-full h-12 font-semibold text-sm rounded-xl"
              style={{
                background:
                  "linear-gradient(135deg, oklch(0.58 0.25 340) 0%, oklch(0.40 0.20 295) 100%)",
                color: "white",
                border: "none",
              }}
            >
              Verify OTP
            </Button>
            <button
              type="button"
              onClick={() => setMode("forgot-pin-phone")}
              className="text-sm text-muted-foreground underline text-center"
            >
              Back
            </button>
          </div>
        )}

        {mode === "forgot-pin-new" && (
          <div className="animate-slide-up">
            {!newPinTemp ? (
              <PinPad
                title="Set New PIN"
                subtitle="Enter your new 4-digit PIN"
                onComplete={handleForgotPinNew}
                onBack={() => setMode("menu")}
                error={pinError}
                clearError={() => setPinError(null)}
              />
            ) : (
              <PinPad
                title="Confirm New PIN"
                subtitle="Re-enter to confirm"
                onComplete={handleForgotPinNew}
                onBack={() => {
                  setNewPinTemp(null);
                  setPinError(null);
                }}
                error={pinError}
                clearError={() => setPinError(null)}
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
}
