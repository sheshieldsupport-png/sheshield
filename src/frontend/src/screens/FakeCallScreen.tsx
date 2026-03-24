import { useEffect, useRef, useState } from "react";
import { useApp } from "../context/AppContext";

type CallStage = "incoming" | "active";

function PhoneOffIcon({ size = 28 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="white"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-label="End call"
      role="img"
    >
      <path d="M10.68 13.31a16 16 0 0 0 3.41 2.6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7 2 2 0 0 1 1.72 2v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.42 19.42 0 0 1 4.43 9.68 19.79 19.79 0 0 1 1.36 1a2 2 0 0 1 2-2.18h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L7.27 6.6" />
      <line x1="23" y1="1" x2="1" y2="23" />
    </svg>
  );
}

function PhoneIcon({ size = 28 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="white"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-label="Accept call"
      role="img"
    >
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 15.1 19.79 19.79 0 0 1 1.62 6.57 2 2 0 0 1 3.58 4.4h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L7.91 12.4a16 16 0 0 0 6.09 6.09l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 19.42z" />
    </svg>
  );
}

function playRingtone(): (() => void) | null {
  try {
    const AudioCtx =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext })
        .webkitAudioContext;
    if (!AudioCtx) return null;
    const ctx = new AudioCtx();
    let running = true;

    const ring = () => {
      if (!running) return;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.frequency.value = 880;
      osc.type = "sine";
      gain.gain.setValueAtTime(0, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.15, ctx.currentTime + 0.05);
      gain.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.5);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.6);
    };

    ring();
    if (navigator.vibrate) navigator.vibrate([500, 300, 500, 300, 500]);
    const interval = setInterval(() => {
      if (!running) return;
      ring();
      if (navigator.vibrate) navigator.vibrate([500, 300, 500]);
    }, 1800);

    return () => {
      running = false;
      clearInterval(interval);
      ctx.close();
    };
  } catch {
    return null;
  }
}

const CALLER_NAME = "Mom";
const CALLER_NUMBER = "98765 43210";

export default function FakeCallScreen({
  onClose,
}: {
  instantCall?: boolean;
  onClose?: () => void;
}) {
  const { setScreen } = useApp();
  const [stage, setStage] = useState<CallStage>("incoming");
  const [callSeconds, setCallSeconds] = useState(0);
  const [showVoiceMsg, setShowVoiceMsg] = useState(false);
  const stopRingtoneRef = useRef<(() => void) | null>(null);

  const goHome = () => {
    if (onClose) onClose();
    else setScreen("home");
  };

  useEffect(() => {
    if (stage !== "incoming") return;
    const stop = playRingtone();
    stopRingtoneRef.current = stop;
    return () => {
      stop?.();
      if (navigator.vibrate) navigator.vibrate(0);
    };
  }, [stage]);

  useEffect(() => {
    if (stage !== "active") return;
    setCallSeconds(0);
    const t = setInterval(() => setCallSeconds((s) => s + 1), 1000);
    const msgTimer = setTimeout(() => setShowVoiceMsg(true), 3000);
    return () => {
      clearInterval(t);
      clearTimeout(msgTimer);
    };
  }, [stage]);

  const handleAccept = () => {
    stopRingtoneRef.current?.();
    if (navigator.vibrate) navigator.vibrate(0);
    setStage("active");
  };

  const handleDecline = () => {
    stopRingtoneRef.current?.();
    if (navigator.vibrate) navigator.vibrate(0);
    goHome();
  };

  const callTime = `${String(Math.floor(callSeconds / 60)).padStart(2, "0")}:${String(callSeconds % 60).padStart(2, "0")}`;

  // INCOMING CALL
  if (stage === "incoming") {
    return (
      <div
        className="fixed inset-0 z-50 flex flex-col"
        data-ocid="fakecall.dialog"
        style={{
          background:
            "linear-gradient(180deg, oklch(0.08 0.03 160) 0%, oklch(0.04 0.01 160) 100%)",
        }}
      >
        <div
          className="absolute top-0 left-0 right-0 h-64 opacity-20 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse at 50% 0%, oklch(0.55 0.18 145) 0%, transparent 70%)",
          }}
        />
        <div className="flex flex-col items-center justify-between h-full px-8 py-16 relative z-10">
          <p
            className="text-sm font-medium tracking-widest uppercase animate-pulse"
            style={{ color: "oklch(0.70 0.15 145)" }}
          >
            Incoming Call
          </p>

          <div className="flex flex-col items-center gap-6">
            <div className="relative">
              <div
                className="absolute -inset-4 rounded-full animate-ping opacity-20"
                style={{ background: "oklch(0.55 0.18 145)" }}
              />
              <div
                className="absolute -inset-2 rounded-full animate-ping opacity-15"
                style={{
                  background: "oklch(0.55 0.18 145)",
                  animationDelay: "0.5s",
                }}
              />
              <div
                className="relative w-28 h-28 rounded-full flex items-center justify-center"
                style={{
                  background:
                    "linear-gradient(135deg, oklch(0.40 0.18 145) 0%, oklch(0.25 0.12 145) 100%)",
                  border: "3px solid oklch(0.55 0.18 145 / 0.6)",
                  boxShadow: "0 0 40px oklch(0.55 0.18 145 / 0.4)",
                }}
              >
                <span className="font-display text-5xl font-black text-white">
                  M
                </span>
              </div>
            </div>

            <div className="text-center">
              <h2 className="font-display text-4xl font-black text-white leading-tight">
                {CALLER_NAME}
              </h2>
              <p
                className="text-lg mt-2"
                style={{ color: "oklch(0.65 0.10 145)" }}
              >
                {CALLER_NUMBER}
              </p>
              <p
                className="text-xs mt-3 font-medium"
                style={{ color: "oklch(0.45 0.08 145)" }}
              >
                Mobile
              </p>
            </div>
          </div>

          <div className="flex items-end justify-between w-full max-w-xs">
            <div className="flex flex-col items-center gap-3">
              <button
                type="button"
                data-ocid="fakecall.cancel_button"
                onClick={handleDecline}
                aria-label="Decline call"
                className="rounded-full flex items-center justify-center transition-all active:scale-90"
                style={{
                  width: "72px",
                  height: "72px",
                  background: "oklch(0.45 0.22 25)",
                  boxShadow: "0 4px 20px oklch(0.45 0.22 25 / 0.5)",
                }}
              >
                <PhoneOffIcon />
              </button>
              <span
                className="text-sm font-medium"
                style={{ color: "oklch(0.65 0.10 25)" }}
              >
                Decline
              </span>
            </div>

            <div className="flex flex-col items-center gap-3">
              <button
                type="button"
                data-ocid="fakecall.confirm_button"
                onClick={handleAccept}
                aria-label="Accept call"
                className="rounded-full flex items-center justify-center transition-all active:scale-90"
                style={{
                  width: "72px",
                  height: "72px",
                  background: "oklch(0.55 0.18 145)",
                  boxShadow: "0 4px 20px oklch(0.55 0.18 145 / 0.6)",
                }}
              >
                <PhoneIcon />
              </button>
              <span
                className="text-sm font-medium"
                style={{ color: "oklch(0.70 0.15 145)" }}
              >
                Accept
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ACTIVE CALL
  return (
    <div
      className="fixed inset-0 z-50 flex flex-col"
      data-ocid="fakecall.modal"
      style={{
        background:
          "linear-gradient(180deg, oklch(0.08 0.03 160) 0%, oklch(0.04 0.01 160) 100%)",
      }}
    >
      <div
        className="absolute top-0 left-0 right-0 h-48 opacity-15 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at 50% 0%, oklch(0.55 0.18 145) 0%, transparent 70%)",
        }}
      />
      <div className="flex flex-col items-center justify-between h-full px-8 py-16 relative z-10">
        <div className="flex flex-col items-center gap-1">
          <p
            className="text-sm font-medium tracking-widest uppercase"
            style={{ color: "oklch(0.70 0.15 145)" }}
          >
            Active Call
          </p>
          <p
            className="font-display text-3xl font-black"
            style={{ color: "oklch(0.80 0.12 145)" }}
          >
            {callTime}
          </p>
        </div>

        <div className="flex flex-col items-center gap-5">
          <div
            className="w-28 h-28 rounded-full flex items-center justify-center"
            style={{
              background:
                "linear-gradient(135deg, oklch(0.40 0.18 145) 0%, oklch(0.25 0.12 145) 100%)",
              border: "3px solid oklch(0.55 0.18 145 / 0.5)",
              boxShadow: "0 0 30px oklch(0.55 0.18 145 / 0.3)",
            }}
          >
            <span className="font-display text-5xl font-black text-white">
              M
            </span>
          </div>
          <div className="text-center">
            <h2 className="font-display text-3xl font-black text-white">
              {CALLER_NAME}
            </h2>
            <p
              className="text-base mt-1"
              style={{ color: "oklch(0.60 0.08 145)" }}
            >
              {CALLER_NUMBER}
            </p>
          </div>
          {showVoiceMsg && (
            <div
              className="px-5 py-3 rounded-2xl border"
              style={{
                background: "oklch(0.55 0.18 145 / 0.1)",
                borderColor: "oklch(0.55 0.18 145 / 0.3)",
              }}
            >
              <p
                className="text-sm font-medium text-center"
                style={{ color: "oklch(0.75 0.15 145)" }}
              >
                &ldquo;Where are you? Come fast!&rdquo;
              </p>
            </div>
          )}
        </div>

        <div className="flex flex-col items-center gap-3">
          <button
            type="button"
            data-ocid="fakecall.delete_button"
            onClick={handleDecline}
            aria-label="End call"
            className="rounded-full flex items-center justify-center transition-all active:scale-90"
            style={{
              width: "72px",
              height: "72px",
              background: "oklch(0.45 0.22 25)",
              boxShadow: "0 4px 20px oklch(0.45 0.22 25 / 0.5)",
            }}
          >
            <PhoneOffIcon />
          </button>
          <span
            className="text-sm font-medium"
            style={{ color: "oklch(0.65 0.10 25)" }}
          >
            End Call
          </span>
        </div>
      </div>
    </div>
  );
}
