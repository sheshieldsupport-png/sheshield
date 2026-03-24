import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Activity,
  ArrowLeft,
  CheckCircle2,
  Clock,
  Heart,
  Mic,
  Navigation,
  Phone,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useApp } from "../context/AppContext";

function useTimer(startTime: Date) {
  const [elapsed, setElapsed] = useState(0);
  useEffect(() => {
    const id = setInterval(() => {
      setElapsed(Math.floor((Date.now() - startTime.getTime()) / 1000));
    }, 1000);
    return () => clearInterval(id);
  }, [startTime]);
  const mins = Math.floor(elapsed / 60)
    .toString()
    .padStart(2, "0");
  const secs = (elapsed % 60).toString().padStart(2, "0");
  return `${mins}:${secs}`;
}

const H_LINES = ["h0", "h1", "h2", "h3", "h4", "h5"];
const V_LINES = ["v0", "v1", "v2", "v3", "v4", "v5", "v6", "v7"];

export default function ActiveRideScreen() {
  const {
    activeRide,
    setScreen,
    setActiveRide,
    setEmergencyActive,
    heartRate,
    bluetoothConnected,
    voiceDetectionActive,
  } = useApp();
  const timer = useTimer(activeRide?.startTime ?? new Date());

  const vEmoji: Record<string, string> = {
    taxi: "🚕",
    bike: "🛵",
    auto: "🛺",
    car: "🚗",
  };

  if (!activeRide) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-3">
        <p className="text-muted-foreground">No active ride.</p>
        <Button
          data-ocid="active.go_home.button"
          onClick={() => setScreen("home")}
          variant="outline"
        >
          Go Home
        </Button>
      </div>
    );
  }

  function handleSOS() {
    setEmergencyActive(true);
    setScreen("emergency");
  }
  function handleComplete() {
    setActiveRide(null);
    setScreen("home");
  }
  const heartAbnormal =
    heartRate !== null && (heartRate > 120 || heartRate < 50);

  return (
    <div className="flex flex-col gap-4 pb-4 animate-slide-up">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          data-ocid="active.back.button"
          onClick={() => setScreen("home")}
          className="p-2 rounded-lg hover:bg-muted transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="flex-1">
          <h2 className="font-display text-xl font-bold">Active Ride</h2>
        </div>
        <div className="flex gap-2">
          {voiceDetectionActive && (
            <Badge
              className="text-xs px-2 py-1"
              style={{
                background: "oklch(0.58 0.25 340 / 0.1)",
                color: "oklch(0.58 0.25 340)",
                border: "1px solid oklch(0.58 0.25 340 / 0.4)",
              }}
            >
              <Mic className="w-3 h-3 mr-1 inline" />
              Listening
            </Badge>
          )}
          <Badge
            className="text-xs px-3 py-1"
            style={{
              background: "oklch(0.55 0.18 145 / 0.1)",
              color: "oklch(0.55 0.18 145)",
              border: "1px solid oklch(0.55 0.18 145 / 0.5)",
            }}
          >
            <span
              className="inline-block w-1.5 h-1.5 rounded-full mr-1.5 animate-pulse"
              style={{ background: "oklch(0.55 0.18 145)" }}
            />
            SAFETY ON
          </Badge>
        </div>
      </div>

      {/* Driver banner */}
      <div
        className="rounded-2xl p-4 flex items-center gap-3 border"
        style={{
          background: "oklch(1 0 0)",
          borderColor: "oklch(0.88 0.005 265)",
          boxShadow: "0 1px 6px oklch(0 0 0 / 0.07)",
        }}
      >
        <img
          src={activeRide.driver.photo}
          alt={activeRide.driver.name}
          className="w-12 h-12 rounded-xl object-cover flex-shrink-0"
        />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-lg">
              {vEmoji[activeRide.driver.vehicleType]}
            </span>
            <span className="font-semibold text-sm">
              {activeRide.driver.name}
            </span>
          </div>
          <p className="text-xs text-muted-foreground font-mono">
            {activeRide.driver.vehicle}
          </p>
        </div>
        <a
          href={`tel:${activeRide.driver.phone}`}
          data-ocid="active.call_driver.button"
          className="w-9 h-9 rounded-xl flex items-center justify-center transition-colors hover:opacity-80"
          style={{ background: "oklch(0.58 0.25 340 / 0.1)" }}
        >
          <Phone
            className="w-4 h-4"
            style={{ color: "oklch(0.58 0.25 340)" }}
          />
        </a>
      </div>

      {/* Route */}
      <div
        className="rounded-xl p-3 border flex items-center gap-3"
        style={{
          background: "oklch(1 0 0)",
          borderColor: "oklch(0.88 0.005 265)",
        }}
      >
        <Navigation className="w-4 h-4 flex-shrink-0 text-muted-foreground" />
        <div className="flex-1 min-w-0 flex items-center gap-2 text-xs">
          <span className="text-foreground font-medium truncate">
            {activeRide.pickup}
          </span>
          <span className="text-muted-foreground">→</span>
          <span className="text-foreground font-medium truncate">
            {activeRide.destination}
          </span>
        </div>
      </div>

      {/* Mock GPS Map */}
      <div
        className="relative rounded-2xl overflow-hidden"
        style={{
          height: "180px",
          background:
            "linear-gradient(160deg, oklch(0.14 0.025 250) 0%, oklch(0.12 0.02 220) 100%)",
        }}
        data-ocid="active.map.canvas_target"
      >
        {H_LINES.map((k, i) => (
          <div
            key={k}
            className="absolute w-full"
            style={{
              top: `${i * 20}%`,
              height: "1px",
              background: "oklch(0.25 0.02 250 / 0.4)",
            }}
          />
        ))}
        {V_LINES.map((k, i) => (
          <div
            key={k}
            className="absolute h-full"
            style={{
              left: `${i * 14.28}%`,
              width: "1px",
              background: "oklch(0.25 0.02 250 / 0.4)",
            }}
          />
        ))}
        <svg
          className="absolute inset-0 w-full h-full"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <polyline
            points="10,75 25,60 40,52 55,38 70,26 88,14"
            fill="none"
            stroke="oklch(0.58 0.25 340 / 0.6)"
            strokeWidth="0.8"
            strokeDasharray="2 2"
          />
          <polyline
            points="10,75 25,60 40,52"
            fill="none"
            stroke="oklch(0.55 0.18 145)"
            strokeWidth="1.2"
          />
        </svg>
        <div
          className="absolute w-3 h-3 rounded-full border-2"
          style={{
            left: "8%",
            top: "calc(70% - 6px)",
            background: "oklch(0.58 0.25 340)",
            borderColor: "white",
          }}
        />
        <div
          className="absolute w-3 h-3 rounded-full border-2"
          style={{
            left: "calc(88% - 6px)",
            top: "calc(14% - 6px)",
            background: "oklch(0.55 0.18 145)",
            borderColor: "white",
          }}
        />
        <div
          className="absolute w-4 h-4 rounded-full border-2 border-white shadow-lg animate-dot-move"
          style={{ background: "oklch(0.55 0.18 145)" }}
        />
        <div
          className="absolute bottom-2 left-3 text-xs font-medium"
          style={{ color: "oklch(0.75 0.01 250)" }}
        >
          {activeRide.pickup.split(",")[0]}
        </div>
        <div
          className="absolute top-2 right-3 text-xs font-medium"
          style={{ color: "oklch(0.75 0.01 250)" }}
        >
          {activeRide.destination.split(",")[0]}
        </div>
      </div>

      {/* Safety indicators */}
      <div className="grid grid-cols-4 gap-2">
        {[
          {
            icon: CheckCircle2,
            label: "Route",
            value: "Normal",
            color: "oklch(0.55 0.18 145)",
          },
          {
            icon: Clock,
            label: "Time",
            value: timer,
            color: "oklch(0.65 0.18 55)",
          },
          {
            icon: Activity,
            label: "Drive",
            value: "Normal",
            color: "oklch(0.55 0.18 145)",
          },
          bluetoothConnected
            ? {
                icon: Heart,
                label: "Heart",
                value: heartRate ? `${heartRate}` : "--",
                color: heartAbnormal
                  ? "oklch(0.58 0.25 340)"
                  : "oklch(0.55 0.18 145)",
              }
            : {
                icon: Heart,
                label: "Heart",
                value: "N/A",
                color: "oklch(0.60 0.01 265)",
              },
        ].map((item) => (
          <div
            key={item.label}
            className="rounded-xl p-2.5 flex flex-col items-center gap-1 border text-center"
            style={{
              background: "oklch(1 0 0)",
              borderColor: "oklch(0.88 0.005 265)",
            }}
          >
            <item.icon
              className={`w-4 h-4 ${item.label === "Heart" && bluetoothConnected && heartRate ? "animate-heartbeat" : ""}`}
              style={{ color: item.color }}
            />
            <span className="text-[10px] text-muted-foreground">
              {item.label}
            </span>
            <span
              className="text-xs font-bold font-mono"
              style={{ color: item.color }}
            >
              {item.value}
            </span>
          </div>
        ))}
      </div>

      <button
        type="button"
        data-ocid="active.sos.button"
        onClick={handleSOS}
        className="w-full h-16 rounded-2xl font-display font-bold text-xl text-white animate-pulse-sos transition-transform active:scale-95"
        style={{
          background:
            "linear-gradient(135deg, oklch(0.55 0.22 22), oklch(0.42 0.20 18))",
        }}
      >
        🆘 SOS EMERGENCY
      </button>

      <Button
        data-ocid="active.complete_ride.button"
        onClick={handleComplete}
        variant="outline"
        className="w-full h-11 font-semibold"
      >
        ✓ Complete Ride
      </Button>
    </div>
  );
}
