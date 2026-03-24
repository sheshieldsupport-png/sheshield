import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { useApp } from "../context/AppContext";

type ScanStep = "scan" | "details" | "ridemode";

const VEHICLE = {
  number: "OD07 AB 1234",
  driver: "Rajesh Kumar",
  type: "Auto Rickshaw",
  color: "Yellow & Black",
};

function useTimer(active: boolean) {
  const [elapsed, setElapsed] = useState(0);
  useEffect(() => {
    if (!active) {
      setElapsed(0);
      return;
    }
    const id = setInterval(() => setElapsed((e) => e + 1), 1000);
    return () => clearInterval(id);
  }, [active]);
  const h = String(Math.floor(elapsed / 3600)).padStart(2, "0");
  const m = String(Math.floor((elapsed % 3600) / 60)).padStart(2, "0");
  const s = String(elapsed % 60).padStart(2, "0");
  return `${h}:${m}:${s}`;
}

function ScanStep({ onDetected }: { onDetected: (plate: string) => void }) {
  const { setScreen } = useApp();
  const [manual, setManual] = useState(false);
  const [manualText, setManualText] = useState("");
  const [scanning, setScanning] = useState(true);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    timerRef.current = setTimeout(() => {
      setScanning(false);
      onDetected(VEHICLE.number);
    }, 3000);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [onDetected]);

  return (
    <div
      className="flex flex-col h-full"
      style={{ background: "oklch(0.11 0.02 280)", minHeight: "100dvh" }}
    >
      {/* Header */}
      <div
        className="flex items-center gap-3 px-4 py-3 flex-shrink-0"
        style={{
          background:
            "linear-gradient(135deg, oklch(0.30 0.18 200) 0%, oklch(0.25 0.15 260) 100%)",
          boxShadow: "0 2px 16px oklch(0.2 0.15 220 / 0.5)",
        }}
      >
        <button
          type="button"
          data-ocid="scantaxi.back.button"
          onClick={() => setScreen("home")}
          className="text-white/70 hover:text-white text-xl leading-none"
        >
          ←
        </button>
        <div className="flex-1">
          <h1 className="text-white font-bold text-base">🚕 Scan Taxi</h1>
          <p className="text-white/60 text-xs">Vehicle Safety Check</p>
        </div>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center px-6 gap-8">
        {/* Viewfinder */}
        <div className="relative">
          <div
            className="w-72 h-48 rounded-2xl overflow-hidden relative"
            style={{
              background: "oklch(0.08 0.02 280)",
              border: "2px solid oklch(0.45 0.18 280 / 0.5)",
            }}
          >
            {/* Corner brackets */}
            {[
              ["top-0 left-0", "border-t-2 border-l-2 rounded-tl-xl"],
              ["top-0 right-0", "border-t-2 border-r-2 rounded-tr-xl"],
              ["bottom-0 left-0", "border-b-2 border-l-2 rounded-bl-xl"],
              ["bottom-0 right-0", "border-b-2 border-r-2 rounded-br-xl"],
            ].map(([pos, cls]) => (
              <div
                key={pos}
                className={`absolute w-8 h-8 ${pos} ${cls}`}
                style={{ borderColor: "oklch(0.72 0.22 320)" }}
              />
            ))}
            {/* Simulated camera bg */}
            <div
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(180deg, oklch(0.12 0.02 260) 0%, oklch(0.08 0.02 280) 100%)",
              }}
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <span
                className="text-3xl opacity-20"
                style={{ userSelect: "none" }}
              >
                📷
              </span>
            </div>
            {/* Scan line */}
            {scanning && (
              <motion.div
                className="absolute left-4 right-4 h-0.5 rounded-full"
                style={{
                  background:
                    "linear-gradient(90deg, transparent, oklch(0.72 0.22 320), oklch(0.62 0.22 260), transparent)",
                  boxShadow: "0 0 8px oklch(0.72 0.22 320)",
                }}
                animate={{ top: ["15%", "80%", "15%"] }}
                transition={{
                  duration: 2,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "easeInOut",
                }}
              />
            )}
          </div>
        </div>

        <div className="text-center">
          <p className="text-white font-semibold text-base">
            Scanning vehicle number plate...
          </p>
          <p className="text-white/50 text-sm mt-1">
            Hold camera steady near the plate
          </p>
          {scanning && (
            <motion.div
              className="flex items-center justify-center gap-1.5 mt-3"
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY }}
            >
              {[0, 1, 2].map((i) => (
                <span
                  key={i}
                  className="w-1.5 h-1.5 rounded-full"
                  style={{ background: "oklch(0.72 0.22 320)" }}
                />
              ))}
            </motion.div>
          )}
        </div>

        {/* Manual entry */}
        {!manual ? (
          <button
            type="button"
            data-ocid="scantaxi.manual.button"
            onClick={() => {
              if (timerRef.current) clearTimeout(timerRef.current);
              setScanning(false);
              setManual(true);
            }}
            className="px-6 py-2.5 rounded-full text-sm font-medium transition-all active:scale-95"
            style={{
              background: "oklch(0.18 0.04 280)",
              border: "1px solid oklch(0.35 0.12 300)",
              color: "oklch(0.80 0.12 310)",
            }}
          >
            Enter Manually
          </button>
        ) : (
          <div className="w-full flex flex-col gap-3">
            <input
              data-ocid="scantaxi.plate.input"
              type="text"
              value={manualText}
              onChange={(e) => setManualText(e.target.value)}
              placeholder="e.g. OD07 AB 1234"
              className="w-full px-4 py-3 rounded-xl text-center text-white text-lg font-bold tracking-widest outline-none"
              style={{
                background: "oklch(0.16 0.03 280)",
                border: "1px solid oklch(0.40 0.18 310)",
              }}
            />
            <button
              type="button"
              data-ocid="scantaxi.plate.submit_button"
              onClick={() => manualText.trim() && onDetected(manualText.trim())}
              disabled={!manualText.trim()}
              className="w-full py-3 rounded-xl font-bold text-white transition-all active:scale-95 disabled:opacity-40"
              style={{
                background: "linear-gradient(135deg, #e91e63, #9c27b0)",
                boxShadow: "0 2px 16px oklch(0.5 0.25 330 / 0.4)",
              }}
            >
              Scan Karo →
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function DetailsStep({
  plate,
  onYes,
  onNo,
}: {
  plate: string;
  onYes: () => void;
  onNo: () => void;
}) {
  const { setScreen } = useApp();
  const [choice, setChoice] = useState<"yes" | "no" | null>(null);

  return (
    <div
      className="flex flex-col h-full"
      style={{ background: "oklch(0.11 0.02 280)", minHeight: "100dvh" }}
    >
      {/* Header */}
      <div
        className="flex items-center gap-3 px-4 py-3 flex-shrink-0"
        style={{
          background:
            "linear-gradient(135deg, oklch(0.30 0.18 200) 0%, oklch(0.25 0.15 260) 100%)",
          boxShadow: "0 2px 16px oklch(0.2 0.15 220 / 0.5)",
        }}
      >
        <button
          type="button"
          data-ocid="scantaxi.details.back.button"
          onClick={() => setScreen("home")}
          className="text-white/70 hover:text-white text-xl leading-none"
        >
          ←
        </button>
        <div className="flex-1">
          <h1 className="text-white font-bold text-base">🚕 Vehicle Details</h1>
          <p className="text-white/60 text-xs">Verify before boarding</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-6 flex flex-col gap-5">
        {/* Vehicle card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl p-5"
          style={{
            background: "oklch(0.15 0.03 280)",
            border: "1px solid oklch(0.28 0.08 300)",
            boxShadow: "0 4px 24px oklch(0.4 0.18 300 / 0.2)",
          }}
        >
          <div className="flex items-center gap-2 mb-4">
            <span className="text-xl">✅</span>
            <h2 className="text-white font-bold text-base">Vehicle Detected</h2>
          </div>

          {/* Plate number */}
          <div className="mb-5 text-center">
            <p
              className="text-3xl font-black tracking-widest"
              style={{
                background:
                  "linear-gradient(135deg, #e91e63, #9c27b0, #2196f3)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              {plate}
            </p>
          </div>

          {/* Details */}
          {[
            { label: "Driver Name", value: VEHICLE.driver, icon: "👤" },
            { label: "Vehicle Type", value: VEHICLE.type, icon: "🚕" },
            { label: "Vehicle Color", value: VEHICLE.color, icon: "🎨" },
          ].map((row) => (
            <div
              key={row.label}
              className="flex items-center gap-3 py-3"
              style={{ borderBottom: "1px solid oklch(0.22 0.04 280)" }}
            >
              <span className="text-lg w-6 text-center">{row.icon}</span>
              <div>
                <p
                  className="text-xs"
                  style={{ color: "oklch(0.55 0.05 280)" }}
                >
                  {row.label}
                </p>
                <p className="text-white font-semibold text-sm">{row.value}</p>
              </div>
            </div>
          ))}

          <div className="flex items-center gap-2 mt-4">
            <span className="text-sm">🔒</span>
            <span className="text-xs" style={{ color: "oklch(0.60 0.12 145)" }}>
              Details fetched securely
            </span>
          </div>
        </motion.div>

        {/* Choice */}
        <AnimatePresence>
          {choice === null && (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="rounded-2xl p-5"
              style={{
                background: "oklch(0.15 0.03 280)",
                border: "1px solid oklch(0.28 0.08 300)",
              }}
            >
              <p className="text-white font-semibold text-center text-base mb-5">
                Are you travelling with this vehicle?
              </p>
              <div className="flex gap-3">
                <button
                  type="button"
                  data-ocid="scantaxi.confirm.yes.button"
                  onClick={() => {
                    setChoice("yes");
                    onYes();
                  }}
                  className="flex-1 py-4 rounded-xl font-bold text-white text-base transition-all active:scale-95"
                  style={{
                    background: "linear-gradient(135deg, #e91e63, #9c27b0)",
                    boxShadow: "0 2px 16px oklch(0.5 0.25 330 / 0.4)",
                  }}
                >
                  ✅ YES
                </button>
                <button
                  type="button"
                  data-ocid="scantaxi.confirm.no.button"
                  onClick={() => setChoice("no")}
                  className="flex-1 py-4 rounded-xl font-bold text-base transition-all active:scale-95"
                  style={{
                    background: "transparent",
                    border: "2px solid oklch(0.55 0.15 310)",
                    color: "oklch(0.80 0.15 310)",
                  }}
                >
                  ❌ NO
                </button>
              </div>
            </motion.div>
          )}

          {choice === "no" && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="rounded-2xl p-5 text-center"
              style={{
                background: "oklch(0.15 0.03 280)",
                border: "1px solid oklch(0.28 0.08 300)",
              }}
            >
              <p className="text-2xl mb-3">🛡️</p>
              <p className="text-white font-semibold text-base mb-2">
                Stay safe!
              </p>
              <p
                className="text-sm mb-5"
                style={{ color: "oklch(0.65 0.05 280)" }}
              >
                You can go back anytime. No tracking activated.
              </p>
              <button
                type="button"
                data-ocid="scantaxi.no.back.button"
                onClick={() => {
                  onNo();
                }}
                className="px-8 py-3 rounded-xl font-semibold text-white transition-all active:scale-95"
                style={{
                  background: "oklch(0.22 0.06 280)",
                  border: "1px solid oklch(0.38 0.12 300)",
                }}
              >
                ← Go Back
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

function RideModeStep({
  plate,
  onEndTrip,
}: {
  plate: string;
  onEndTrip: () => void;
}) {
  const timer = useTimer(true);
  const [sosVisible, setSosVisible] = useState(false);

  return (
    <div
      className="flex flex-col h-full"
      style={{ background: "oklch(0.09 0.02 280)", minHeight: "100dvh" }}
    >
      {/* Header */}
      <div
        className="flex items-center gap-3 px-4 py-3 flex-shrink-0"
        style={{
          background:
            "linear-gradient(135deg, oklch(0.32 0.18 150) 0%, oklch(0.25 0.15 180) 100%)",
          boxShadow: "0 2px 16px oklch(0.3 0.18 150 / 0.5)",
        }}
      >
        <button
          type="button"
          data-ocid="scantaxi.ridemode.back.button"
          onClick={onEndTrip}
          className="text-white/70 hover:text-white text-xl leading-none"
        >
          ←
        </button>
        <div className="flex-1">
          <h1 className="text-white font-bold text-base">
            🛡️ Ride Safety Mode Active
          </h1>
        </div>
        <div
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-full"
          style={{ background: "oklch(0.22 0.14 150)" }}
        >
          <span
            className="w-2 h-2 rounded-full animate-pulse"
            style={{ background: "oklch(0.72 0.22 145)" }}
          />
          <span
            className="text-xs font-bold"
            style={{ color: "oklch(0.72 0.22 145)" }}
          >
            Trip Active
          </span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-4">
        {/* Timer card */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl p-4 text-center"
          style={{
            background: "oklch(0.14 0.03 280)",
            border: "1px solid oklch(0.26 0.08 300)",
          }}
        >
          <p className="text-xs mb-1" style={{ color: "oklch(0.55 0.05 280)" }}>
            ⏱️ Trip Duration
          </p>
          <p
            className="text-4xl font-black tracking-widest"
            style={{
              background: "linear-gradient(135deg, #e91e63, #9c27b0, #2196f3)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            {timer}
          </p>
        </motion.div>

        {/* GPS card */}
        <div
          className="rounded-2xl p-4"
          style={{
            background: "oklch(0.14 0.03 280)",
            border: "1px solid oklch(0.26 0.08 300)",
          }}
        >
          <div className="flex items-center gap-2 mb-2">
            <span>📍</span>
            <span className="text-white font-semibold text-sm">
              Live Location
            </span>
            <span
              className="ml-auto w-2 h-2 rounded-full animate-pulse"
              style={{ background: "oklch(0.72 0.22 145)" }}
            />
          </div>
          <p className="text-xs" style={{ color: "oklch(0.62 0.08 200)" }}>
            Tracking GPS...
          </p>
          <p className="text-xs mt-1" style={{ color: "oklch(0.50 0.04 280)" }}>
            19.3149° N, 84.7941° E (Berhampur)
          </p>
        </div>

        {/* Auto share info */}
        <div
          className="rounded-xl px-4 py-3 flex items-start gap-2"
          style={{
            background: "oklch(0.16 0.06 200 / 0.5)",
            border: "1px solid oklch(0.30 0.12 200 / 0.5)",
          }}
        >
          <span className="text-base mt-0.5">📤</span>
          <p className="text-xs" style={{ color: "oklch(0.72 0.14 200)" }}>
            Location shared with emergency contacts &amp; police (demo)
          </p>
        </div>

        {/* SOS Button */}
        <div className="flex flex-col items-center gap-3 py-2">
          <motion.button
            type="button"
            data-ocid="scantaxi.sos.button"
            onClick={() => setSosVisible(true)}
            className="w-28 h-28 rounded-full flex flex-col items-center justify-center text-white font-black text-xl shadow-2xl"
            style={{
              background: "linear-gradient(135deg, #e91e63, #c62828)",
              boxShadow: "0 0 32px oklch(0.5 0.28 25 / 0.7)",
            }}
            animate={{
              boxShadow: [
                "0 0 20px oklch(0.5 0.28 25 / 0.5)",
                "0 0 40px oklch(0.5 0.28 25 / 0.9)",
                "0 0 20px oklch(0.5 0.28 25 / 0.5)",
              ],
            }}
            transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY }}
          >
            🚨<span className="text-sm font-black">SOS</span>
          </motion.button>
          <p className="text-xs" style={{ color: "oklch(0.55 0.05 280)" }}>
            🎤 Say "Help" or "Bachao" to trigger SOS
          </p>
        </div>

        {/* Driver card */}
        <div
          className="rounded-2xl p-4"
          style={{
            background: "oklch(0.14 0.03 280)",
            border: "1px solid oklch(0.26 0.08 300)",
          }}
        >
          <p className="text-xs mb-3" style={{ color: "oklch(0.55 0.05 280)" }}>
            🚗 Driver Details
          </p>
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center text-xl"
              style={{ background: "oklch(0.20 0.06 280)" }}
            >
              👤
            </div>
            <div>
              <p className="text-white font-bold text-sm">{VEHICLE.driver}</p>
              <p className="text-xs" style={{ color: "oklch(0.62 0.08 280)" }}>
                {plate} · {VEHICLE.type}
              </p>
            </div>
          </div>
        </div>

        {/* End Trip */}
        <button
          type="button"
          data-ocid="scantaxi.endtrip.button"
          onClick={onEndTrip}
          className="w-full py-4 rounded-xl font-bold text-base transition-all active:scale-95 mb-4"
          style={{
            background: "transparent",
            border: "2px solid oklch(0.45 0.15 310)",
            color: "oklch(0.72 0.15 310)",
          }}
        >
          End Trip
        </button>
      </div>

      {/* SOS Overlay */}
      <AnimatePresence>
        {sosVisible && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-50 flex flex-col items-center justify-center p-6"
            data-ocid="scantaxi.sos.dialog"
            style={{
              background: "oklch(0.08 0.02 15 / 0.96)",
              backdropFilter: "blur(8px)",
            }}
          >
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              className="rounded-3xl p-8 w-full max-w-sm text-center"
              style={{
                background: "oklch(0.16 0.04 15)",
                border: "1px solid oklch(0.40 0.22 25)",
                boxShadow: "0 0 40px oklch(0.4 0.22 25 / 0.5)",
              }}
            >
              <p className="text-5xl mb-4">🚨</p>
              <h2 className="text-white font-black text-xl mb-2">
                Emergency Detected!
              </h2>
              <p
                className="text-sm mb-6"
                style={{ color: "oklch(0.75 0.10 30)" }}
              >
                Sharing your location and trip details...
              </p>
              <div className="flex flex-col gap-3">
                <a
                  href="tel:112"
                  data-ocid="scantaxi.sos.call112.button"
                  className="block w-full py-3.5 rounded-xl font-bold text-white text-center transition-all active:scale-95"
                  style={{
                    background: "linear-gradient(135deg, #e91e63, #c62828)",
                    boxShadow: "0 2px 16px oklch(0.4 0.28 25 / 0.5)",
                  }}
                >
                  📞 Call 112
                </a>
                <button
                  type="button"
                  data-ocid="scantaxi.sos.close.button"
                  onClick={() => setSosVisible(false)}
                  className="w-full py-3 rounded-xl font-semibold transition-all active:scale-95"
                  style={{
                    background: "oklch(0.20 0.04 280)",
                    border: "1px solid oklch(0.35 0.08 280)",
                    color: "oklch(0.75 0.05 280)",
                  }}
                >
                  Close Alert
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function ScanTaxiScreen() {
  const [step, setStep] = useState<ScanStep>("scan");
  const [detectedPlate, setDetectedPlate] = useState("");

  const handleDetected = (plate: string) => {
    setDetectedPlate(plate);
    setStep("details");
  };

  const handleYes = () => setStep("ridemode");

  const handleNo = () => setStep("scan");

  const handleEndTrip = () => {
    setDetectedPlate("");
    setStep("scan");
  };

  return (
    <div style={{ position: "relative", height: "100dvh" }}>
      <AnimatePresence mode="wait">
        {step === "scan" && (
          <motion.div
            key="scan"
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -40 }}
            style={{ position: "absolute", inset: 0 }}
          >
            <ScanStep onDetected={handleDetected} />
          </motion.div>
        )}
        {step === "details" && (
          <motion.div
            key="details"
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -40 }}
            style={{ position: "absolute", inset: 0 }}
          >
            <DetailsStep
              plate={detectedPlate}
              onYes={handleYes}
              onNo={handleNo}
            />
          </motion.div>
        )}
        {step === "ridemode" && (
          <motion.div
            key="ridemode"
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -40 }}
            style={{ position: "absolute", inset: 0 }}
          >
            <RideModeStep plate={detectedPlate} onEndTrip={handleEndTrip} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
