import { Button } from "@/components/ui/button";
import {
  Camera,
  CheckCircle2,
  MapPin,
  Mic,
  PhoneCall,
  Radio,
  Users,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useApp } from "../context/AppContext";

const NEARBY_USERS = [
  { name: "Priya", dist: "0.3 km" },
  { name: "Anjali", dist: "0.7 km" },
  { name: "Sunita", dist: "0.9 km" },
  { name: "Kavya", dist: "1.0 km" },
];

export default function EmergencyScreen() {
  const {
    activeRide,
    setScreen,
    setEmergencyActive,
    setActiveRide,
    addHistory,
    currentLocation,
    userProfile,
  } = useApp();
  const [elapsed, setElapsed] = useState(0);
  const [nearbySending, setNearbySending] = useState(true);

  useEffect(() => {
    const timerId = setInterval(() => setElapsed((prev) => prev + 1), 1000);
    return () => clearInterval(timerId);
  }, []);

  useEffect(() => {
    const t = setTimeout(() => setNearbySending(false), 2500);
    return () => clearTimeout(t);
  }, []);

  function handleMarkSafe() {
    setEmergencyActive(false);
    setActiveRide(null);
    addHistory({
      id: Date.now().toString(),
      date: new Date().toLocaleDateString("en-IN", {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }),
      type: "emergency",
      description: activeRide
        ? `SOS Alert — Ride with ${activeRide.driver.name}`
        : "SOS Alert — Manual trigger",
      status: "resolved",
      location: "Berhampur, Odisha",
    });
    setScreen("home");
  }

  const mins = Math.floor(elapsed / 60)
    .toString()
    .padStart(2, "0");
  const secs = (elapsed % 60).toString().padStart(2, "0");
  const displayLat = currentLocation?.lat;
  const displayLng = currentLocation?.lng;
  const mapsLink = currentLocation
    ? `https://maps.google.com/?q=${currentLocation.lat},${currentLocation.lng}`
    : null;
  const userName = userProfile?.name || "User";
  const gpsStr =
    displayLat !== undefined && displayLng !== undefined
      ? `${displayLat.toFixed(5)}°N, ${displayLng.toFixed(5)}°E`
      : "GPS acquiring...";

  return (
    <div className="flex flex-col gap-4 pb-6 animate-fade-in animate-emergency-bg min-h-screen">
      {/* Big header */}
      <div
        className="rounded-2xl p-6 text-center relative overflow-hidden"
        style={{
          background:
            "linear-gradient(180deg, oklch(0.45 0.22 22) 0%, oklch(0.32 0.18 22) 100%)",
        }}
      >
        <div
          className="absolute inset-0 opacity-10"
          style={{
            background:
              "repeating-linear-gradient(45deg, transparent, transparent 8px, white 8px, white 10px)",
          }}
        />
        <div className="relative">
          <div className="text-5xl mb-2">🆘</div>
          <h1 className="font-display text-2xl font-bold text-white">
            EMERGENCY ACTIVATED
          </h1>
          <p className="text-sm text-red-100 mt-1">
            All emergency services have been alerted
          </p>
          <div className="mt-3 text-3xl font-mono font-bold text-white">
            {mins}:{secs}
          </div>
          <p className="text-xs text-red-100">Time since activation</p>
        </div>
      </div>

      {/* Alert message */}
      <div
        className="rounded-xl p-4 border font-mono text-xs leading-relaxed"
        style={{
          background: "oklch(1 0 0)",
          borderColor: "oklch(0.50 0.22 22 / 0.3)",
        }}
        data-ocid="emergency.alert_message.panel"
      >
        <p
          className="font-bold text-sm mb-2"
          style={{ color: "oklch(0.50 0.22 22)" }}
        >
          📨 EMERGENCY ALERT
        </p>
        <p className="text-muted-foreground">
          A person may be in danger during ride.
        </p>
        {activeRide && (
          <>
            <p className="mt-1 text-foreground">
              Driver:{" "}
              <span style={{ color: "oklch(0.50 0.22 22)" }}>
                {activeRide.driver.name}
              </span>
            </p>
            <p>
              Vehicle:{" "}
              <span style={{ color: "oklch(0.50 0.22 22)" }}>
                {activeRide.driver.vehicle.replace(/ /g, "")}
              </span>
            </p>
            <p>
              Type:{" "}
              <span
                style={{ color: "oklch(0.50 0.22 22)" }}
                className="capitalize"
              >
                {activeRide.driver.vehicleType}
              </span>
            </p>
          </>
        )}
        <p className="mt-1">
          GPS:{" "}
          {displayLat !== undefined && displayLng !== undefined ? (
            <span style={{ color: "oklch(0.55 0.18 145)" }}>
              {displayLat.toFixed(5)}°N, {displayLng.toFixed(5)}°E
            </span>
          ) : (
            <span className="text-muted-foreground">Acquiring GPS...</span>
          )}
        </p>
        <p className="mt-1" style={{ color: "oklch(0.50 0.22 22)" }}>
          Please respond immediately.
        </p>
      </div>

      {/* Live location */}
      <div
        className="rounded-xl p-4 border flex items-center gap-3"
        style={{
          background: "oklch(1 0 0)",
          borderColor: "oklch(0.55 0.18 145 / 0.4)",
        }}
        data-ocid="emergency.location.panel"
      >
        <MapPin
          className="w-5 h-5 flex-shrink-0"
          style={{ color: "oklch(0.55 0.18 145)" }}
        />
        <div className="flex-1">
          <p className="text-xs text-muted-foreground">Live GPS Location</p>
          {displayLat !== undefined && displayLng !== undefined ? (
            <>
              <p className="text-xs font-mono font-semibold text-foreground">
                {displayLat.toFixed(6)}°N, {displayLng.toFixed(6)}°E
              </p>
              {mapsLink && (
                <a
                  href={mapsLink}
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs underline"
                  style={{ color: "oklch(0.55 0.18 145)" }}
                >
                  Open in Google Maps
                </a>
              )}
            </>
          ) : (
            <p className="text-xs text-muted-foreground">
              Acquiring GPS fix...
            </p>
          )}
        </div>
        <Radio
          className="w-4 h-4 ml-auto animate-pulse flex-shrink-0"
          style={{ color: "oklch(0.55 0.18 145)" }}
        />
      </div>

      {/* Status cards — 2x2 grid */}
      <div className="grid grid-cols-2 gap-2">
        {[
          { icon: PhoneCall, label: "Police", sublabel: "Notified" },
          { icon: CheckCircle2, label: "Contacts", sublabel: "Alerted" },
          { icon: MapPin, label: "Location", sublabel: "Shared" },
          { icon: Users, label: "Nearby (4)", sublabel: "Alerted" },
        ].map((item) => (
          <div
            key={item.label}
            className="rounded-xl p-3 flex flex-col items-center gap-1.5 border text-center"
            style={{
              background: "oklch(0.50 0.22 22 / 0.06)",
              borderColor: "oklch(0.50 0.22 22 / 0.3)",
            }}
          >
            <item.icon
              className="w-5 h-5"
              style={{ color: "oklch(0.50 0.22 22)" }}
            />
            <span className="text-xs font-bold text-foreground">
              {item.label}
            </span>
            <span className="text-xs" style={{ color: "oklch(0.50 0.22 22)" }}>
              ✓ {item.sublabel}
            </span>
          </div>
        ))}
      </div>

      {/* Nearby SheShield Users Alert */}
      <div
        className="rounded-xl p-4 border"
        style={{
          background: "oklch(0.50 0.22 22 / 0.06)",
          borderColor: "oklch(0.50 0.22 22 / 0.3)",
        }}
        data-ocid="emergency.nearby_alert.panel"
      >
        <div className="flex items-center gap-2 mb-3">
          <Users className="w-5 h-5" style={{ color: "oklch(0.50 0.22 22)" }} />
          <span className="text-sm font-bold text-foreground">
            📡 Nearby Alert Broadcast
          </span>
          {nearbySending && (
            <span
              className="ml-auto text-xs animate-pulse font-medium"
              style={{ color: "oklch(0.50 0.22 22)" }}
            >
              Sending...
            </span>
          )}
          {!nearbySending && (
            <span
              className="ml-auto text-xs font-semibold"
              style={{ color: "oklch(0.55 0.18 145)" }}
              data-ocid="emergency.nearby_alert.success_state"
            >
              ✓ Sent
            </span>
          )}
        </div>

        {/* Alert message preview */}
        <div
          className="rounded-lg p-3 mb-3 text-xs font-mono"
          style={{
            background: "oklch(0.50 0.22 22 / 0.1)",
            borderLeft: "3px solid oklch(0.50 0.22 22)",
          }}
        >
          <span style={{ color: "oklch(0.50 0.22 22)" }} className="font-bold">
            Message:{" "}
          </span>
          <span className="text-foreground">
            &quot;{userName} danger mein hai! Unhe turant madad ki zaroorat hai.
            Location: {gpsStr}&quot;
          </span>
        </div>

        {/* Nearby users list */}
        {nearbySending ? (
          <div
            className="text-xs text-center py-2 animate-pulse"
            style={{ color: "oklch(0.50 0.22 22)" }}
            data-ocid="emergency.nearby_alert.loading_state"
          >
            Sending alert to nearby SheShield users within 1km...
          </div>
        ) : (
          <div
            className="flex flex-col gap-1.5"
            data-ocid="emergency.nearby_alert.list"
          >
            {NEARBY_USERS.map((u, i) => (
              <div
                key={u.name}
                className="flex items-center justify-between rounded-lg px-3 py-2 text-xs"
                style={{ background: "oklch(0.55 0.18 145 / 0.08)" }}
                data-ocid={`emergency.nearby_alert.item.${i + 1}`}
              >
                <span className="font-medium text-foreground">
                  👩 {u.name} ({u.dist})
                </span>
                <span
                  className="font-bold"
                  style={{ color: "oklch(0.55 0.18 145)" }}
                >
                  ✓ Received
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Evidence recording */}
      <div
        className="rounded-xl p-4 border flex items-center gap-3"
        style={{
          background: "oklch(0.50 0.22 22 / 0.06)",
          borderColor: "oklch(0.50 0.22 22 / 0.3)",
        }}
        data-ocid="emergency.evidence.panel"
      >
        <div className="flex items-center gap-2">
          <div
            className="w-2 h-2 rounded-full animate-pulse"
            style={{ background: "oklch(0.50 0.22 22)" }}
          />
          <span className="text-sm font-semibold text-foreground">
            Evidence Recording: Active
          </span>
        </div>
        <div className="ml-auto flex items-center gap-3">
          <Mic className="w-5 h-5" style={{ color: "oklch(0.50 0.22 22)" }} />
          <Camera
            className="w-5 h-5"
            style={{ color: "oklch(0.50 0.22 22)" }}
          />
        </div>
      </div>

      <Button
        data-ocid="emergency.mark_safe.button"
        onClick={handleMarkSafe}
        className="w-full h-12 font-semibold text-sm mt-2"
        style={{ background: "oklch(0.55 0.18 145)", color: "white" }}
      >
        <CheckCircle2 className="w-4 h-4 mr-2" /> I&apos;m Safe — Cancel
        Emergency
      </Button>

      <Button
        data-ocid="emergency.back.button"
        variant="ghost"
        onClick={() => setScreen("home")}
        className="w-full text-muted-foreground"
      >
        Return to Home (Keep Emergency Active)
      </Button>
    </div>
  );
}
