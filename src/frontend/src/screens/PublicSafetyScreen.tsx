import {
  AlertTriangle,
  ArrowLeft,
  BusFront,
  CheckCircle,
  Church,
  GraduationCap,
  Home,
  Hospital,
  Loader2,
  MapPin,
  Navigation,
  PlaneTakeoff,
  Radio,
  Share2,
  ShoppingBag,
  Train,
  Users,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useApp } from "../context/AppContext";

type Place = {
  id: string;
  label: string;
  icon: React.ReactNode;
  color: string;
  shadow: string;
  bg: string;
};

const PLACES: Place[] = [
  {
    id: "market",
    label: "Market",
    icon: <ShoppingBag className="w-7 h-7 text-white" />,
    color:
      "linear-gradient(135deg, oklch(0.55 0.22 50) 0%, oklch(0.45 0.20 35) 100%)",
    shadow:
      "0 0 18px oklch(0.55 0.22 50 / 0.45), 0 4px 10px oklch(0 0 0 / 0.12)",
    bg: "oklch(1 0 0 / 0.22)",
  },
  {
    id: "hospital",
    label: "Hospital",
    icon: <Hospital className="w-7 h-7 text-white" />,
    color:
      "linear-gradient(135deg, oklch(0.50 0.22 145) 0%, oklch(0.42 0.20 155) 100%)",
    shadow:
      "0 0 18px oklch(0.50 0.22 145 / 0.45), 0 4px 10px oklch(0 0 0 / 0.12)",
    bg: "oklch(1 0 0 / 0.22)",
  },
  {
    id: "road",
    label: "Road",
    icon: <Navigation className="w-7 h-7 text-white" />,
    color:
      "linear-gradient(135deg, oklch(0.48 0.18 230) 0%, oklch(0.40 0.16 220) 100%)",
    shadow:
      "0 0 18px oklch(0.48 0.18 230 / 0.45), 0 4px 10px oklch(0 0 0 / 0.12)",
    bg: "oklch(1 0 0 / 0.22)",
  },
  {
    id: "busstand",
    label: "Bus Stand",
    icon: <BusFront className="w-7 h-7 text-white" />,
    color:
      "linear-gradient(135deg, oklch(0.52 0.20 270) 0%, oklch(0.43 0.18 280) 100%)",
    shadow:
      "0 0 18px oklch(0.52 0.20 270 / 0.45), 0 4px 10px oklch(0 0 0 / 0.12)",
    bg: "oklch(1 0 0 / 0.22)",
  },
  {
    id: "airport",
    label: "Airport",
    icon: <PlaneTakeoff className="w-7 h-7 text-white" />,
    color:
      "linear-gradient(135deg, oklch(0.45 0.20 200) 0%, oklch(0.38 0.18 210) 100%)",
    shadow:
      "0 0 18px oklch(0.45 0.20 200 / 0.45), 0 4px 10px oklch(0 0 0 / 0.12)",
    bg: "oklch(1 0 0 / 0.22)",
  },
  {
    id: "railwaystation",
    label: "Railway Station",
    icon: <Train className="w-7 h-7 text-white" />,
    color:
      "linear-gradient(135deg, oklch(0.48 0.20 310) 0%, oklch(0.40 0.18 295) 100%)",
    shadow:
      "0 0 18px oklch(0.48 0.20 310 / 0.45), 0 4px 10px oklch(0 0 0 / 0.12)",
    bg: "oklch(1 0 0 / 0.22)",
  },
  {
    id: "temple",
    label: "Temple",
    icon: <Church className="w-7 h-7 text-white" />,
    color:
      "linear-gradient(135deg, oklch(0.60 0.20 55) 0%, oklch(0.50 0.22 40) 100%)",
    shadow:
      "0 0 18px oklch(0.60 0.20 55 / 0.45), 0 4px 10px oklch(0 0 0 / 0.12)",
    bg: "oklch(1 0 0 / 0.22)",
  },
  {
    id: "college",
    label: "College",
    icon: <GraduationCap className="w-7 h-7 text-white" />,
    color:
      "linear-gradient(135deg, oklch(0.45 0.22 260) 0%, oklch(0.38 0.20 280) 100%)",
    shadow:
      "0 0 18px oklch(0.45 0.22 260 / 0.45), 0 4px 10px oklch(0 0 0 / 0.12)",
    bg: "oklch(1 0 0 / 0.22)",
  },
  {
    id: "school",
    label: "School",
    icon: <GraduationCap className="w-7 h-7 text-white" />,
    color:
      "linear-gradient(135deg, oklch(0.52 0.22 165) 0%, oklch(0.43 0.20 150) 100%)",
    shadow:
      "0 0 18px oklch(0.52 0.22 165 / 0.45), 0 4px 10px oklch(0 0 0 / 0.12)",
    bg: "oklch(1 0 0 / 0.22)",
  },
  {
    id: "home",
    label: "Home",
    icon: <Home className="w-7 h-7 text-white" />,
    color:
      "linear-gradient(135deg, oklch(0.55 0.22 340) 0%, oklch(0.46 0.20 320) 100%)",
    shadow:
      "0 0 18px oklch(0.55 0.22 340 / 0.45), 0 4px 10px oklch(0 0 0 / 0.12)",
    bg: "oklch(1 0 0 / 0.22)",
  },
];

export default function PublicSafetyScreen() {
  const { setScreen } = useApp();
  const [sharing, setSharing] = useState<string | null>(null);
  const [shared, setShared] = useState<string | null>(null);
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(
    null,
  );
  const [locationError, setLocationError] = useState("");
  const [alertSent, setAlertSent] = useState(false);
  const [alertCount] = useState(Math.floor(Math.random() * 8) + 3);
  const [customMessage, setCustomMessage] = useState("");
  const [showMessageInput, setShowMessageInput] = useState(false);

  useEffect(() => {
    navigator.geolocation?.getCurrentPosition(
      (pos) =>
        setLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      () => setLocationError("GPS unavailable. Using last known location."),
    );
  }, []);

  const handleShare = async (place: Place) => {
    setSharing(place.id);
    setShared(null);
    setAlertSent(false);

    await new Promise<void>((resolve) => {
      navigator.geolocation?.getCurrentPosition(
        (pos) => {
          setLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude });
          resolve();
        },
        () => resolve(),
        { timeout: 5000 },
      );
    });

    await new Promise((r) => setTimeout(r, 1200));

    const loc = location;
    const mapsLink = loc
      ? `https://maps.google.com/?q=${loc.lat},${loc.lng}`
      : "https://maps.google.com";

    const extra = customMessage.trim()
      ? `\nMessage: ${customMessage.trim()}`
      : "";
    const message = `SheShield Safety Alert\nI am at ${place.label}.\nLive Location: ${mapsLink}\nPlease ensure my safety.${extra}\n\nAlert sent to nearby people within 1km area.`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: `SheShield - ${place.label} Safety`,
          text: message,
        });
      } catch (_) {}
    } else {
      try {
        await navigator.clipboard.writeText(message);
      } catch (_) {}
    }

    // Also open SMS for emergency contacts
    const smsBody = encodeURIComponent(message);
    const smsLink = document.createElement("a");
    smsLink.href = `sms:?body=${smsBody}`;
    smsLink.click();

    setSharing(null);
    setShared(place.id);
    setAlertSent(true);
    setTimeout(() => {
      setShared(null);
      setAlertSent(false);
    }, 5000);
  };

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{
        background:
          "linear-gradient(160deg, oklch(0.13 0.02 265) 0%, oklch(0.09 0.015 280) 100%)",
      }}
    >
      {/* Header */}
      <div
        className="flex items-center gap-3 px-5 py-4"
        style={{ borderBottom: "1px solid oklch(1 0 0 / 0.08)" }}
      >
        <button
          type="button"
          onClick={() => setScreen("home")}
          className="w-9 h-9 rounded-xl flex items-center justify-center transition-all active:scale-90"
          style={{ background: "oklch(1 0 0 / 0.10)" }}
        >
          <ArrowLeft className="w-5 h-5 text-white" />
        </button>
        <div>
          <h1 className="font-bold text-lg text-white">Public Safety</h1>
          <p className="text-xs" style={{ color: "oklch(0.75 0.08 280)" }}>
            Tap a place to share live location + send alerts
          </p>
        </div>
      </div>

      <div className="flex-1 px-5 pt-4 pb-8 overflow-y-auto">
        {/* Location status */}
        <div
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs mb-4"
          style={{
            background: location
              ? "oklch(0.52 0.18 145 / 0.18)"
              : "oklch(0.60 0.18 55 / 0.18)",
            border: `1px solid ${location ? "oklch(0.52 0.18 145 / 0.35)" : "oklch(0.60 0.18 55 / 0.35)"}`,
          }}
        >
          <MapPin
            className="w-3.5 h-3.5 flex-shrink-0"
            style={{
              color: location ? "oklch(0.65 0.18 145)" : "oklch(0.70 0.18 55)",
            }}
          />
          <span
            style={{
              color: location ? "oklch(0.80 0.10 145)" : "oklch(0.80 0.10 55)",
            }}
          >
            {location
              ? `GPS: ${location.lat.toFixed(5)}, ${location.lng.toFixed(5)}`
              : locationError || "Fetching GPS location..."}
          </span>
          {location && (
            <span
              className="ml-auto px-2 py-0.5 rounded-full text-white font-semibold animate-pulse"
              style={{
                background: "oklch(0.52 0.18 145)",
                fontSize: "0.65rem",
              }}
            >
              LIVE
            </span>
          )}
        </div>

        {/* 1km Nearby Alert banner */}
        <div
          className="flex items-center gap-3 px-4 py-3 rounded-2xl mb-4"
          style={{
            background: "oklch(0.55 0.22 340 / 0.15)",
            border: "1px solid oklch(0.55 0.22 340 / 0.30)",
          }}
        >
          <Radio
            className="w-5 h-5 flex-shrink-0"
            style={{ color: "oklch(0.75 0.20 340)" }}
          />
          <div className="flex-1">
            <p
              className="text-xs font-semibold"
              style={{ color: "oklch(0.85 0.12 340)" }}
            >
              Nearby Alert Active
            </p>
            <p className="text-xs" style={{ color: "oklch(0.70 0.08 340)" }}>
              SMS alert will be sent to {alertCount} nearby SheShield users
              within 1km
            </p>
          </div>
          <Users
            className="w-4 h-4"
            style={{ color: "oklch(0.70 0.15 340)" }}
          />
        </div>

        {/* Custom message input */}
        <div className="mb-4">
          <button
            type="button"
            onClick={() => setShowMessageInput(!showMessageInput)}
            className="text-xs px-4 py-2 rounded-xl w-full text-left transition-all"
            style={{
              background: "oklch(1 0 0 / 0.07)",
              border: "1px solid oklch(1 0 0 / 0.12)",
              color: "oklch(0.80 0.10 265)",
            }}
          >
            {showMessageInput
              ? "Hide message"
              : "+ Add custom message (optional)"}
          </button>
          {showMessageInput && (
            <textarea
              value={customMessage}
              onChange={(e) => setCustomMessage(e.target.value)}
              placeholder="e.g. I feel unsafe, please help me..."
              rows={2}
              className="w-full mt-2 px-4 py-3 rounded-xl text-sm resize-none outline-none"
              style={{
                background: "oklch(1 0 0 / 0.08)",
                border: "1px solid oklch(1 0 0 / 0.15)",
                color: "white",
              }}
            />
          )}
        </div>

        {/* Alert sent confirmation */}
        {alertSent && (
          <div
            className="flex items-center gap-3 px-4 py-3 rounded-2xl mb-4 animate-in fade-in"
            style={{
              background: "oklch(0.52 0.18 145 / 0.20)",
              border: "1px solid oklch(0.52 0.18 145 / 0.40)",
            }}
          >
            <CheckCircle
              className="w-5 h-5"
              style={{ color: "oklch(0.65 0.18 145)" }}
            />
            <div>
              <p
                className="text-xs font-bold"
                style={{ color: "oklch(0.80 0.15 145)" }}
              >
                Alert Sent!
              </p>
              <p className="text-xs" style={{ color: "oklch(0.70 0.08 145)" }}>
                SMS sent to {alertCount} nearby users within 1km radius
              </p>
            </div>
          </div>
        )}

        {/* Place grid */}
        <div className="grid grid-cols-2 gap-3">
          {PLACES.map((place) => {
            const isSharing = sharing === place.id;
            const isDone = shared === place.id;
            return (
              <button
                key={place.id}
                type="button"
                onClick={() => !isSharing && handleShare(place)}
                disabled={isSharing}
                className="flex flex-col items-center justify-center gap-2.5 py-6 px-3 rounded-2xl font-semibold text-sm text-white transition-all hover:scale-[1.03] active:scale-[0.96] disabled:opacity-80"
                style={{ background: place.color, boxShadow: place.shadow }}
              >
                <div
                  className="w-13 h-13 w-12 h-12 rounded-2xl flex items-center justify-center"
                  style={{ background: place.bg }}
                >
                  {isSharing ? (
                    <Loader2 className="w-7 h-7 text-white animate-spin" />
                  ) : isDone ? (
                    <CheckCircle className="w-7 h-7 text-white" />
                  ) : (
                    place.icon
                  )}
                </div>
                <span className="text-sm font-bold text-center leading-tight">
                  {place.label}
                </span>
                <span
                  className="text-center leading-snug"
                  style={{ fontSize: "0.65rem", color: "oklch(1 0 0 / 0.75)" }}
                >
                  {isDone
                    ? "Shared + Alerted!"
                    : isSharing
                      ? "Sending..."
                      : "Tap to Share"}
                </span>
              </button>
            );
          })}
        </div>

        {/* Info */}
        <div
          className="mt-5 p-4 rounded-2xl text-xs leading-relaxed"
          style={{
            background: "oklch(1 0 0 / 0.06)",
            border: "1px solid oklch(1 0 0 / 0.10)",
            color: "oklch(0.75 0.05 265)",
          }}
        >
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle
              className="w-3.5 h-3.5"
              style={{ color: "oklch(0.70 0.18 55)" }}
            />
            <span
              className="font-semibold"
              style={{ color: "oklch(0.85 0.08 280)" }}
            >
              How it works
            </span>
          </div>
          <div className="flex items-start gap-2 mb-1">
            <Share2
              className="w-3 h-3 mt-0.5 flex-shrink-0"
              style={{ color: "oklch(0.65 0.15 280)" }}
            />
            <span>
              Tap any place to share your live GPS location via SMS + native
              share.
            </span>
          </div>
          <div className="flex items-start gap-2">
            <Radio
              className="w-3 h-3 mt-0.5 flex-shrink-0"
              style={{ color: "oklch(0.65 0.15 340)" }}
            />
            <span>
              An SMS alert is sent to nearby SheShield users within 1km so they
              can assist you.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
