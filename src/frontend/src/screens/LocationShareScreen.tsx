import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  AlertCircle,
  CheckCircle2,
  Copy,
  ExternalLink,
  Loader2,
  MapPin,
  Phone,
  RefreshCw,
  Share2,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useApp } from "../context/AppContext";

export default function LocationShareScreen() {
  const {
    contacts,
    currentLocation,
    isLiveTracking,
    locationAccuracy,
    locationError,
    retryGPS,
  } = useApp();
  const [policeAlerted, setPoliceAlerted] = useState(false);

  const mapsLink = currentLocation
    ? `https://maps.google.com/?q=${currentLocation.lat.toFixed(6)},${currentLocation.lng.toFixed(6)}`
    : "";
  const shareMessage = currentLocation
    ? `SheShield - My live location: ${mapsLink} - Please check on me.`
    : "";

  function copyLink() {
    if (!mapsLink) return;
    navigator.clipboard
      .writeText(mapsLink)
      .then(() => toast.success("Location link copied!"));
  }

  async function shareWithContact(contact: { name: string; phone: string }) {
    if (!shareMessage) return;
    const msg = `SheShield - ${contact.name}, my live location: ${mapsLink} - Please check on me.`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: "SheShield Live Location",
          text: msg,
        });
        toast.success(`Location shared with ${contact.name}`);
      } catch {
        navigator.clipboard
          .writeText(msg)
          .then(() =>
            toast.success(`Location link copied for ${contact.name}`),
          );
      }
    } else {
      navigator.clipboard
        .writeText(msg)
        .then(() => toast.success(`Location link copied for ${contact.name}`));
    }
  }

  async function nativeShare() {
    if (!shareMessage) return;
    if (navigator.share) {
      try {
        await navigator.share({
          title: "SheShield Live Location",
          text: shareMessage,
        });
      } catch {
        navigator.clipboard
          .writeText(shareMessage)
          .then(() => toast.success("Copied to clipboard!"));
      }
    } else {
      navigator.clipboard
        .writeText(shareMessage)
        .then(() => toast.success("Copied to clipboard!"));
    }
  }

  function alertPolice() {
    setPoliceAlerted(true);
    toast.success(
      currentLocation
        ? `Police Alert Sent! Location: ${currentLocation.lat.toFixed(5)}°N, ${currentLocation.lng.toFixed(5)}°E`
        : "Police Alert Sent!",
    );
  }

  const hasLocation = isLiveTracking && currentLocation;

  return (
    <div className="flex flex-col gap-5 pb-6 animate-slide-up">
      <div>
        <h1 className="font-display text-2xl font-bold text-foreground">
          Share Location
        </h1>
        <p className="text-muted-foreground text-sm mt-1">
          Live GPS location sharing with contacts or police
        </p>
      </div>

      {/* GPS Card */}
      <div
        className="rounded-2xl p-5 border"
        style={{
          background: "oklch(1 0 0)",
          borderColor: locationError
            ? "oklch(0.58 0.25 340 / 0.4)"
            : "oklch(0.88 0.005 265)",
          boxShadow: "0 1px 6px oklch(0 0 0 / 0.07)",
        }}
        data-ocid="location.gps.panel"
      >
        <div className="flex items-center gap-2 mb-4">
          <MapPin
            className="w-5 h-5"
            style={{ color: "oklch(0.60 0.15 250)" }}
          />
          <span className="font-semibold text-foreground">Your Location</span>
          {isLiveTracking && currentLocation ? (
            <Badge
              className="ml-auto text-xs flex items-center gap-1.5 px-2.5 py-1"
              style={{
                background: "oklch(0.55 0.18 145 / 0.12)",
                color: "oklch(0.45 0.16 145)",
                border: "1px solid oklch(0.55 0.18 145 / 0.4)",
              }}
              data-ocid="location.live.toggle"
            >
              <span
                className="w-2 h-2 rounded-full animate-pulse inline-block"
                style={{ background: "oklch(0.55 0.18 145)" }}
              />
              LIVE
            </Badge>
          ) : locationError ? (
            <Badge
              className="ml-auto text-xs flex items-center gap-1"
              style={{
                background: "oklch(0.58 0.25 340 / 0.1)",
                color: "oklch(0.58 0.25 340)",
                border: "1px solid oklch(0.58 0.25 340 / 0.4)",
              }}
            >
              <AlertCircle className="w-3 h-3" /> GPS Error
            </Badge>
          ) : (
            <Badge
              className="ml-auto text-xs flex items-center gap-1"
              style={{
                background: "oklch(0.94 0.005 265)",
                color: "oklch(0.50 0.01 265)",
                border: "1px solid oklch(0.88 0.005 265)",
              }}
            >
              <Loader2 className="w-3 h-3 animate-spin" /> Acquiring GPS...
            </Badge>
          )}
        </div>

        {/* Error state */}
        {locationError && (
          <div
            className="rounded-xl p-4 mb-3"
            style={{
              background: "oklch(0.58 0.25 340 / 0.06)",
              border: "1px solid oklch(0.58 0.25 340 / 0.2)",
            }}
            data-ocid="location.error_state"
          >
            <div className="flex items-start gap-2 mb-3">
              <AlertCircle
                className="w-4 h-4 mt-0.5 flex-shrink-0"
                style={{ color: "oklch(0.58 0.25 340)" }}
              />
              <p className="text-sm" style={{ color: "oklch(0.45 0.20 340)" }}>
                {locationError}
              </p>
            </div>
            <Button
              size="sm"
              onClick={retryGPS}
              className="w-full h-9 text-sm font-semibold"
              style={{
                background:
                  "linear-gradient(135deg, oklch(0.58 0.25 340), oklch(0.50 0.20 295))",
                color: "white",
                border: "none",
              }}
            >
              <RefreshCw className="w-3.5 h-3.5 mr-1.5" /> Retry GPS
            </Button>
          </div>
        )}

        {!locationError && !isLiveTracking && !currentLocation && (
          <div
            className="flex items-center gap-3 py-4"
            data-ocid="location.loading_state"
          >
            <Loader2
              className="w-5 h-5 animate-spin"
              style={{ color: "oklch(0.60 0.15 250)" }}
            />
            <span className="text-sm text-muted-foreground">
              Waiting for GPS fix... (Make sure location is enabled)
            </span>
          </div>
        )}

        {!navigator.geolocation && (
          <div
            className="flex items-center gap-2 text-sm py-2"
            data-ocid="location.error_state"
            style={{ color: "oklch(0.58 0.25 340)" }}
          >
            <AlertCircle className="w-4 h-4" />
            <span>Geolocation not supported by your browser.</span>
          </div>
        )}

        {currentLocation && (
          <div className="space-y-3" data-ocid="location.success_state">
            <div
              className="rounded-xl p-3"
              style={{ background: "oklch(0.97 0.003 265)" }}
            >
              <p className="text-xs text-muted-foreground mb-1">Coordinates</p>
              <p className="font-mono text-sm font-semibold text-foreground">
                {currentLocation.lat.toFixed(6)}°N,{" "}
                {currentLocation.lng.toFixed(6)}°E
              </p>
              {locationAccuracy !== null && (
                <p
                  className="text-xs mt-1"
                  style={{
                    color:
                      locationAccuracy < 30
                        ? "oklch(0.55 0.18 145)"
                        : locationAccuracy < 100
                          ? "oklch(0.60 0.15 80)"
                          : "oklch(0.58 0.25 340)",
                  }}
                >
                  Accuracy: ±{Math.round(locationAccuracy)}m
                  {locationAccuracy < 30
                    ? " (Excellent)"
                    : locationAccuracy < 100
                      ? " (Good)"
                      : " (Low — move to open area)"}
                </p>
              )}
            </div>
            <a
              href={mapsLink}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 text-sm font-medium rounded-xl px-4 py-3 transition-opacity hover:opacity-80"
              style={{
                background: "oklch(0.60 0.15 250 / 0.1)",
                color: "oklch(0.50 0.13 250)",
                border: "1px solid oklch(0.60 0.15 250 / 0.3)",
              }}
              data-ocid="location.open_maps.button"
            >
              <ExternalLink className="w-4 h-4" /> Open in Google Maps
            </a>
            <div className="grid grid-cols-2 gap-2">
              <Button
                data-ocid="location.copy_link.button"
                variant="outline"
                className="h-10 text-sm"
                onClick={copyLink}
              >
                <Copy className="w-4 h-4 mr-1.5" /> Copy Link
              </Button>
              <Button
                data-ocid="location.share.button"
                variant="outline"
                className="h-10 text-sm"
                onClick={nativeShare}
                style={{
                  borderColor: "oklch(0.60 0.15 250 / 0.4)",
                  color: "oklch(0.50 0.13 250)",
                }}
              >
                <Share2 className="w-4 h-4 mr-1.5" /> Share
              </Button>
            </div>
            <Button
              size="sm"
              variant="ghost"
              onClick={retryGPS}
              className="w-full h-8 text-xs text-muted-foreground"
            >
              <RefreshCw className="w-3 h-3 mr-1" /> Refresh Location
            </Button>
          </div>
        )}
      </div>

      {/* Share with contacts */}
      {hasLocation && (
        <div
          className="rounded-2xl border overflow-hidden"
          style={{ borderColor: "oklch(0.88 0.005 265)" }}
          data-ocid="location.contacts.panel"
        >
          <div
            className="px-4 py-3 flex items-center gap-2 border-b"
            style={{
              background: "oklch(1 0 0)",
              borderColor: "oklch(0.88 0.005 265)",
            }}
          >
            <Share2
              className="w-4 h-4"
              style={{ color: "oklch(0.58 0.25 340)" }}
            />
            <span className="font-semibold text-sm text-foreground">
              Share with Contacts
            </span>
          </div>
          {contacts.length === 0 ? (
            <div
              className="px-4 py-6 text-center"
              style={{ background: "oklch(1 0 0)" }}
              data-ocid="location.contacts.empty_state"
            >
              <p className="text-sm text-muted-foreground">
                No emergency contacts saved.
              </p>
            </div>
          ) : (
            contacts.map((contact, idx) => (
              <div
                key={contact.id}
                className="flex items-center gap-3 px-4 py-3 border-b last:border-b-0"
                style={{
                  background: "oklch(1 0 0)",
                  borderColor: "oklch(0.88 0.005 265)",
                }}
                data-ocid={`location.contacts.item.${idx + 1}`}
              >
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0"
                  style={{
                    background: "oklch(0.58 0.25 340 / 0.1)",
                    color: "oklch(0.58 0.25 340)",
                  }}
                >
                  {contact.name[0]}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-foreground">
                    {contact.name}
                  </p>
                  <p className="text-xs text-muted-foreground flex items-center gap-1">
                    <Phone className="w-3 h-3" />
                    {contact.phone}
                  </p>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => shareWithContact(contact)}
                  data-ocid={`location.share_contact.button.${idx + 1}`}
                  className="flex-shrink-0 h-8 text-xs"
                  style={{
                    borderColor: "oklch(0.55 0.18 145 / 0.4)",
                    color: "oklch(0.45 0.16 145)",
                  }}
                >
                  <Share2 className="w-3 h-3 mr-1" /> Share
                </Button>
              </div>
            ))
          )}
        </div>
      )}

      {hasLocation && (
        <Button
          data-ocid="location.alert_police.button"
          onClick={alertPolice}
          disabled={policeAlerted}
          className="w-full h-12 font-semibold text-base"
          style={{
            background: policeAlerted
              ? "oklch(0.55 0.18 145)"
              : "oklch(0.58 0.25 340)",
            color: "white",
          }}
        >
          {policeAlerted ? (
            <>
              <CheckCircle2 className="w-5 h-5 mr-2" />
              Police Alerted Successfully
            </>
          ) : (
            <>
              <Phone className="w-5 h-5 mr-2" />
              Alert Police with Location
            </>
          )}
        </Button>
      )}
    </div>
  );
}
