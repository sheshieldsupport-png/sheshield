import { Button } from "@/components/ui/button";
import { AlertTriangle, ArrowLeft, Home, MapPin } from "lucide-react";
import { useState } from "react";
import { useApp } from "../context/AppContext";

const PUBLIC_LOCATIONS = [
  "College",
  "Temple",
  "Market",
  "Road",
  "University",
  "Other",
];

export default function SafetyModeScreen() {
  const { setScreen, setEmergencyActive, addHistory } = useApp();
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null);

  function triggerEmergency(type: "home" | "public") {
    setEmergencyActive(true);
    addHistory({
      id: Date.now().toString(),
      date: new Date().toLocaleDateString("en-IN", {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }),
      type: type === "home" ? "home_safety" : "public_safety",
      description:
        type === "home"
          ? "Home Safety Alert"
          : `Public Safety Alert — ${selectedLocation || "Location"}`,
      status: "resolved",
      location: "Berhampur, Odisha",
    });
    setScreen("emergency");
  }

  return (
    <div className="flex flex-col gap-5 pb-4 animate-slide-up">
      <div className="flex items-center gap-3">
        <button
          type="button"
          data-ocid="safety.back.button"
          onClick={() => setScreen("home")}
          className="p-2 rounded-lg hover:bg-muted transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h2 className="font-display text-xl font-bold">Safety Mode</h2>
          <p className="text-xs text-muted-foreground">
            Trigger emergency alert instantly
          </p>
        </div>
      </div>

      <div
        className="rounded-2xl border p-5"
        style={{
          background: "oklch(1 0 0)",
          borderColor: "oklch(0.88 0.005 265)",
          boxShadow: "0 1px 6px oklch(0 0 0 / 0.07)",
        }}
      >
        <div className="flex items-center gap-2 mb-3">
          <Home className="w-5 h-5" style={{ color: "oklch(0.55 0.18 145)" }} />
          <h3 className="font-display font-bold text-base">Home Safety</h3>
        </div>
        <p className="text-sm text-muted-foreground mb-4">
          If you face danger at home — domestic violence, intrusion, or any
          emergency — trigger an immediate alert.
        </p>
        <button
          type="button"
          data-ocid="safety.home_danger.button"
          onClick={() => triggerEmergency("home")}
          className="w-full h-14 rounded-xl font-display font-bold text-base text-white transition-transform active:scale-95 animate-pulse-sos"
          style={{
            background:
              "linear-gradient(135deg, oklch(0.55 0.22 22), oklch(0.40 0.20 18))",
          }}
        >
          🏠 I'm in Danger at Home
        </button>
      </div>

      <div
        className="rounded-2xl border p-5"
        style={{
          background: "oklch(1 0 0)",
          borderColor: "oklch(0.88 0.005 265)",
          boxShadow: "0 1px 6px oklch(0 0 0 / 0.07)",
        }}
      >
        <div className="flex items-center gap-2 mb-3">
          <MapPin
            className="w-5 h-5"
            style={{ color: "oklch(0.60 0.15 250)" }}
          />
          <h3 className="font-display font-bold text-base">
            Public Place Safety
          </h3>
        </div>
        <p className="text-sm text-muted-foreground mb-4">
          Select where you are and send an immediate alert to police and your
          contacts.
        </p>
        <div className="grid grid-cols-3 gap-2 mb-4">
          {PUBLIC_LOCATIONS.map((loc) => (
            <button
              type="button"
              key={loc}
              data-ocid={`safety.location_${loc.toLowerCase()}.toggle`}
              onClick={() => setSelectedLocation(loc)}
              className="py-2 px-3 rounded-xl text-xs font-semibold border transition-all"
              style={{
                background:
                  selectedLocation === loc
                    ? "oklch(0.60 0.15 250 / 0.1)"
                    : "oklch(0.97 0.003 265)",
                borderColor:
                  selectedLocation === loc
                    ? "oklch(0.60 0.15 250 / 0.7)"
                    : "oklch(0.88 0.005 265)",
                color:
                  selectedLocation === loc
                    ? "oklch(0.60 0.15 250)"
                    : "oklch(0.40 0.01 265)",
              }}
            >
              {loc}
            </button>
          ))}
        </div>
        <button
          type="button"
          data-ocid="safety.public_danger.button"
          onClick={() => selectedLocation && triggerEmergency("public")}
          className="w-full h-14 rounded-xl font-display font-bold text-base text-white transition-transform active:scale-95"
          style={{
            background: selectedLocation
              ? "linear-gradient(135deg, oklch(0.55 0.22 22), oklch(0.40 0.20 18))"
              : "oklch(0.88 0.005 265)",
            color: selectedLocation ? "white" : "oklch(0.60 0.01 265)",
            cursor: selectedLocation ? "pointer" : "default",
          }}
        >
          <AlertTriangle className="inline w-5 h-5 mr-2" />
          {selectedLocation
            ? `Alert from ${selectedLocation}`
            : "Select a Location First"}
        </button>
      </div>
    </div>
  );
}
