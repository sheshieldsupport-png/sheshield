import { Button } from "@/components/ui/button";
import {
  AlertOctagon,
  ArrowLeft,
  CheckCircle2,
  MapPin,
  MessageSquare,
  Phone,
} from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { useApp } from "../context/AppContext";
import type { GeoCoords } from "../hooks/useOfflineMode";
import { useOfflineMode } from "../hooks/useOfflineMode";

function loadContacts() {
  try {
    const raw = localStorage.getItem("sheshield_contacts");
    if (raw) return JSON.parse(raw) as { name: string; phone: string }[];
  } catch {}
  return [
    { name: "Priya Sharma", phone: "9876500001" },
    { name: "Amit Kumar", phone: "9876500002" },
  ];
}

function buildSMSBody(location: GeoCoords | null, userName: string) {
  const locStr = location
    ? `${location.lat.toFixed(5)},${location.lng.toFixed(5)}`
    : "unknown";
  return `EMERGENCY SOS from SheShield! ${userName} needs immediate help. Last known location: ${locStr}. Please call them immediately or contact police: 112. https://maps.google.com/?q=${locStr}`;
}

interface Props {
  onBack: () => void;
}

export default function OfflineSOSScreen({ onBack }: Props) {
  const { userProfile, contacts } = useApp();
  const { lastKnownLocation, addToOfflineQueue } = useOfflineMode();
  const [smsSent, setSmsSent] = useState(false);
  const [smsContacts] = useState(() => {
    const saved = loadContacts();
    return contacts.length > 0
      ? contacts.map((c) => ({ name: c.name, phone: c.phone }))
      : saved;
  });

  const userName = userProfile?.name ?? "SheShield User";
  const location = lastKnownLocation;
  const smsBody = buildSMSBody(location, userName);

  // Log to offline queue on mount
  useEffect(() => {
    addToOfflineQueue({
      type: "sos",
      timestamp: Date.now(),
      data: {
        userName,
        location,
        contacts: smsContacts,
        message: smsBody,
      },
    });
  }, [addToOfflineQueue, userName, location, smsContacts, smsBody]);

  function handleSendSMS() {
    const numbers = smsContacts.map((c) => c.phone).join(",");
    window.location.href = `sms:${numbers}?body=${encodeURIComponent(smsBody)}`;
    setSmsSent(true);
  }

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ background: "oklch(0.08 0.005 265)" }}
      data-ocid="offline_sos.page"
    >
      {/* Header */}
      <div
        className="relative flex items-center justify-center px-4 pt-14 pb-8 overflow-hidden"
        style={{
          background:
            "linear-gradient(180deg, oklch(0.22 0.12 25) 0%, oklch(0.08 0.005 265) 100%)",
        }}
      >
        <button
          type="button"
          data-ocid="offline_sos.back.button"
          onClick={onBack}
          className="absolute left-4 top-14 p-2 rounded-full"
          style={{ background: "oklch(1 0 0 / 0.08)" }}
        >
          <ArrowLeft className="w-5 h-5 text-white" />
        </button>

        {/* Pulsing SOS icon */}
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <motion.div
              className="absolute inset-0 rounded-full"
              style={{ background: "oklch(0.50 0.22 25 / 0.25)" }}
              animate={{ scale: [1, 1.6, 1], opacity: [0.7, 0, 0.7] }}
              transition={{
                duration: 2,
                repeat: Number.POSITIVE_INFINITY,
                ease: "easeInOut",
              }}
            />
            <motion.div
              className="absolute inset-0 rounded-full"
              style={{ background: "oklch(0.50 0.22 25 / 0.15)" }}
              animate={{ scale: [1, 2, 1], opacity: [0.5, 0, 0.5] }}
              transition={{
                duration: 2,
                repeat: Number.POSITIVE_INFINITY,
                ease: "easeInOut",
                delay: 0.5,
              }}
            />
            <div
              className="relative w-24 h-24 rounded-full flex items-center justify-center"
              style={{
                background: "oklch(0.50 0.22 25)",
                boxShadow: "0 0 30px oklch(0.50 0.22 25 / 0.5)",
              }}
            >
              <AlertOctagon className="w-12 h-12 text-white" />
            </div>
          </div>
          <div className="text-center">
            <h1 className="text-white text-2xl font-bold font-display">
              SOS Alert Sent Offline
            </h1>
            <p className="text-red-300 text-sm mt-1">
              Emergency SMS ready for your contacts
            </p>
          </div>
        </div>
      </div>

      <div className="flex-1 px-4 py-4 space-y-4 overflow-y-auto">
        {/* Location */}
        <div
          className="rounded-xl p-4 border"
          style={{
            background: "oklch(0.13 0.01 265)",
            borderColor: "oklch(1 0 0 / 0.08)",
          }}
        >
          <div className="flex items-center gap-2 mb-2">
            <MapPin
              className="w-4 h-4"
              style={{ color: "oklch(0.60 0.15 250)" }}
            />
            <span className="text-xs font-semibold text-white uppercase tracking-wider">
              Last Known Location
            </span>
          </div>
          {location ? (
            <div className="space-y-1">
              <p
                className="font-mono text-sm font-bold"
                style={{ color: "oklch(0.60 0.15 250)" }}
              >
                {location.lat.toFixed(6)}, {location.lng.toFixed(6)}
              </p>
              {location.accuracy && (
                <p className="text-xs text-muted-foreground">
                  Accuracy: ±{Math.round(location.accuracy)}m
                </p>
              )}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">
              GPS location unavailable — open the app when online to get
              location.
            </p>
          )}
        </div>

        {/* Contacts who will be messaged */}
        <div
          className="rounded-xl p-4 border"
          style={{
            background: "oklch(0.13 0.01 265)",
            borderColor: "oklch(1 0 0 / 0.08)",
          }}
        >
          <div className="flex items-center gap-2 mb-3">
            <MessageSquare
              className="w-4 h-4"
              style={{ color: "oklch(0.58 0.25 340)" }}
            />
            <span className="text-xs font-semibold text-white uppercase tracking-wider">
              Emergency Contacts
            </span>
          </div>
          <div className="space-y-2">
            {smsContacts.map((contact) => (
              <div
                key={contact.phone}
                className="flex items-center gap-3 py-2 border-b"
                style={{ borderColor: "oklch(1 0 0 / 0.06)" }}
              >
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white"
                  style={{ background: "oklch(0.58 0.25 340 / 0.3)" }}
                >
                  {contact.name.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white">
                    {contact.name}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    +91 {contact.phone}
                  </p>
                </div>
                {smsSent && (
                  <CheckCircle2
                    className="w-4 h-4 flex-shrink-0"
                    style={{ color: "oklch(0.55 0.18 145)" }}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* SMS preview */}
        <div
          className="rounded-xl p-4 border"
          style={{
            background: "oklch(0.13 0.01 265)",
            borderColor: "oklch(1 0 0 / 0.08)",
          }}
        >
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
            SMS Message Preview
          </p>
          <p className="text-xs text-white leading-relaxed">{smsBody}</p>
        </div>

        {/* Success state */}
        {smsSent && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="rounded-xl p-4 border flex items-center gap-3"
            style={{
              background: "oklch(0.55 0.18 145 / 0.12)",
              borderColor: "oklch(0.55 0.18 145 / 0.4)",
            }}
            data-ocid="offline_sos.success_state"
          >
            <CheckCircle2
              className="w-5 h-5 flex-shrink-0"
              style={{ color: "oklch(0.55 0.18 145)" }}
            />
            <div>
              <p
                className="text-sm font-bold"
                style={{ color: "oklch(0.55 0.18 145)" }}
              >
                SMS app opened
              </p>
              <p className="text-xs text-muted-foreground">
                Complete sending from your SMS app. Message is pre-filled.
              </p>
            </div>
          </motion.div>
        )}

        {/* Fallback note */}
        <div
          className="rounded-xl p-3 flex items-center gap-2"
          style={{ background: "oklch(0.50 0.22 25 / 0.12)" }}
        >
          <Phone
            className="w-4 h-4 flex-shrink-0"
            style={{ color: "oklch(0.65 0.20 25)" }}
          />
          <p className="text-xs" style={{ color: "oklch(0.70 0.10 25)" }}>
            If SMS fails, call <strong className="text-white">112</strong>{" "}
            immediately
          </p>
        </div>
      </div>

      {/* Action buttons */}
      <div className="px-4 pb-8 pt-2 space-y-3">
        <Button
          data-ocid="offline_sos.send_sms.button"
          onClick={handleSendSMS}
          className="w-full h-13 text-white font-bold text-base rounded-2xl"
          style={{
            background:
              "linear-gradient(135deg, oklch(0.50 0.22 25) 0%, oklch(0.42 0.20 350) 100%)",
            boxShadow: "0 0 24px oklch(0.50 0.22 25 / 0.45)",
            height: "52px",
          }}
        >
          <MessageSquare className="w-5 h-5 mr-2" />
          Send SMS Now
        </Button>

        <Button
          data-ocid="offline_sos.back_safety.button"
          variant="outline"
          onClick={onBack}
          className="w-full h-12 rounded-2xl font-semibold"
          style={{
            borderColor: "oklch(1 0 0 / 0.15)",
            color: "oklch(0.85 0.005 265)",
            background: "oklch(1 0 0 / 0.04)",
          }}
        >
          Back to Safety
        </Button>
      </div>
    </div>
  );
}
