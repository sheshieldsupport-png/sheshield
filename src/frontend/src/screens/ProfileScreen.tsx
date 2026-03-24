import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import {
  BookOpen,
  CheckCircle2,
  ChevronRight,
  Edit2,
  FolderOpen,
  Lock,
  LogOut,
  MapPin,
  MessageSquare,
  Palette,
  Phone,
  Save,
  Scale,
  Shield,
  ShieldCheck,
  Users,
  WifiOff,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useApp } from "../context/AppContext";

function loadSecurityData() {
  try {
    const raw = localStorage.getItem("sheshield_security");
    if (!raw) return { pin: null as string | null, biometricEnabled: false };
    return JSON.parse(raw) as { pin: string | null; biometricEnabled: boolean };
  } catch {
    return { pin: null as string | null, biometricEnabled: false };
  }
}

export default function ProfileScreen() {
  const { userProfile, setUserProfile, contacts, setScreen, logout } = useApp();
  const [editingName, setEditingName] = useState(false);
  const [offlineSmsEnabled, setOfflineSmsEnabled] = useState(() => {
    const raw = localStorage.getItem("sheshield_offline_sms");
    return raw === null ? true : raw === "true";
  });

  function handleOfflineSmsToggle(val: boolean) {
    setOfflineSmsEnabled(val);
    localStorage.setItem("sheshield_offline_sms", String(val));
  }
  const [newName, setNewName] = useState(userProfile?.name ?? "");
  const secData = loadSecurityData();

  if (!userProfile) return null;

  const initials = userProfile.name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  function handleSaveName() {
    if (!newName.trim()) {
      toast.error("Name cannot be empty");
      return;
    }
    setUserProfile({
      name: newName.trim(),
      phone: userProfile!.phone,
      verified: userProfile!.verified,
    });
    setEditingName(false);
    toast.success("Name updated!");
  }

  function handleSignOut() {
    logout();
    toast.success("Signed out successfully.");
  }

  return (
    <div className="flex flex-col gap-5 pb-6 animate-slide-up">
      <div
        className="rounded-2xl p-6 flex flex-col items-center gap-4"
        style={{
          background:
            "linear-gradient(135deg, oklch(0.58 0.25 340) 0%, oklch(0.40 0.20 295) 100%)",
        }}
      >
        <Avatar className="w-24 h-24 text-2xl">
          <AvatarFallback
            className="font-bold font-display text-3xl"
            style={{ background: "oklch(1 0 0 / 0.2)", color: "white" }}
          >
            {initials}
          </AvatarFallback>
        </Avatar>

        {editingName ? (
          <div className="flex gap-2 items-center w-full max-w-xs">
            <Input
              data-ocid="profile.name.input"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              className="h-10 text-center font-bold text-lg"
              style={{
                background: "oklch(1 0 0 / 0.15)",
                borderColor: "oklch(1 0 0 / 0.3)",
                color: "white",
              }}
            />
            <Button
              data-ocid="profile.save_name.button"
              size="icon"
              onClick={handleSaveName}
              className="h-10 w-10 flex-shrink-0"
              style={{ background: "oklch(0.55 0.18 145)" }}
            >
              <Save className="w-4 h-4" />
            </Button>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <h1 className="font-display text-2xl font-bold text-white">
              {userProfile.name}
            </h1>
            <button
              type="button"
              data-ocid="profile.edit_name.button"
              onClick={() => {
                setNewName(userProfile.name);
                setEditingName(true);
              }}
              className="text-red-100 hover:text-white transition-colors"
            >
              <Edit2 className="w-4 h-4" />
            </button>
          </div>
        )}

        <div className="flex items-center gap-2">
          <Phone className="w-3.5 h-3.5 text-red-100" />
          <span className="text-red-100 text-sm">+91 {userProfile.phone}</span>
          {userProfile.verified && (
            <Badge
              className="text-xs flex items-center gap-1"
              style={{
                background: "oklch(1 0 0 / 0.2)",
                color: "white",
                border: "1px solid oklch(1 0 0 / 0.3)",
              }}
            >
              <CheckCircle2 className="w-3 h-3" /> Verified
            </Badge>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div
          className="rounded-xl p-4 border flex flex-col gap-1"
          style={{
            background: "oklch(1 0 0)",
            borderColor: "oklch(0.88 0.005 265)",
          }}
        >
          <Users
            className="w-5 h-5 mb-1"
            style={{ color: "oklch(0.58 0.25 340)" }}
          />
          <span
            className="font-display text-2xl font-bold"
            style={{ color: "oklch(0.58 0.25 340)" }}
          >
            {contacts.length}
          </span>
          <span className="text-xs text-muted-foreground">
            Emergency Contacts
          </span>
        </div>
        <div
          className="rounded-xl p-4 border flex flex-col gap-1"
          style={{
            background: "oklch(1 0 0)",
            borderColor: "oklch(0.88 0.005 265)",
          }}
        >
          <Shield
            className="w-5 h-5 mb-1"
            style={{ color: "oklch(0.55 0.18 145)" }}
          />
          <span
            className="font-display text-2xl font-bold"
            style={{ color: "oklch(0.55 0.18 145)" }}
          >
            Active
          </span>
          <span className="text-xs text-muted-foreground">Safety System</span>
        </div>
      </div>

      <div
        className="rounded-xl border overflow-hidden"
        style={{ borderColor: "oklch(0.88 0.005 265)" }}
      >
        <button
          type="button"
          data-ocid="profile.know_rights.button"
          onClick={() => setScreen("rights")}
          className="w-full flex items-center gap-3 px-4 py-3.5 hover:bg-muted transition-colors border-b text-left"
          style={{ borderColor: "oklch(0.88 0.005 265)" }}
        >
          <Scale
            className="w-5 h-5"
            style={{ color: "oklch(0.50 0.22 295)" }}
          />
          <span className="text-sm font-medium text-foreground flex-1">
            Know Your Rights
          </span>
          <span className="text-xs" style={{ color: "oklch(0.65 0.10 295)" }}>
            6 laws
          </span>
        </button>

        <button
          type="button"
          data-ocid="profile.share_location.button"
          onClick={() => setScreen("location")}
          className="w-full flex items-center gap-3 px-4 py-3.5 hover:bg-muted transition-colors border-b text-left"
          style={{ borderColor: "oklch(0.88 0.005 265)" }}
        >
          <MapPin
            className="w-5 h-5"
            style={{ color: "oklch(0.60 0.15 250)" }}
          />
          <span className="text-sm font-medium text-foreground">
            Share My Location
          </span>
        </button>

        <button
          type="button"
          data-ocid="profile.feedback.button"
          onClick={() => setScreen("feedback")}
          className="w-full flex items-center gap-3 px-4 py-3.5 hover:bg-muted transition-colors border-b text-left"
          style={{ borderColor: "oklch(0.88 0.005 265)" }}
        >
          <MessageSquare
            className="w-5 h-5"
            style={{ color: "oklch(0.55 0.22 340)" }}
          />
          <span className="text-sm font-medium text-foreground">
            Give Feedback
          </span>
        </button>

        <button
          type="button"
          data-ocid="profile.manage_contacts.button"
          onClick={() => setScreen("contacts")}
          className="w-full flex items-center gap-3 px-4 py-3.5 hover:bg-muted transition-colors border-b text-left"
          style={{ borderColor: "oklch(0.88 0.005 265)" }}
        >
          <Users className="w-5 h-5 text-muted-foreground" />
          <span className="text-sm font-medium text-foreground">
            Manage Emergency Contacts
          </span>
        </button>

        <button
          type="button"
          data-ocid="profile.files_history.button"
          onClick={() => setScreen("fileshistory")}
          className="w-full flex items-center gap-3 px-4 py-3.5 hover:bg-muted transition-colors text-left"
          style={{ borderColor: "oklch(0.88 0.005 265)" }}
        >
          <FolderOpen
            className="w-5 h-5"
            style={{ color: "oklch(0.55 0.18 30)" }}
          />
          <span className="text-sm font-medium text-foreground flex-1">
            Files & History
          </span>
          <span className="text-xs" style={{ color: "oklch(0.65 0.10 295)" }}>
            4 types
          </span>
        </button>
      </div>

      {/* Security Section */}
      <div>
        <p
          className="text-xs font-semibold uppercase tracking-wider px-1 mb-2"
          style={{ color: "oklch(0.50 0.15 295)" }}
        >
          Security
        </p>
        <div
          className="rounded-xl border overflow-hidden"
          style={{ borderColor: "oklch(0.88 0.005 265)" }}
        >
          <button
            type="button"
            data-ocid="profile.security.button"
            onClick={() => setScreen("security")}
            className="w-full flex items-center gap-3 px-4 py-4 hover:bg-muted transition-colors text-left"
          >
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center"
              style={{
                background:
                  "linear-gradient(135deg, oklch(0.95 0.05 340) 0%, oklch(0.92 0.05 295) 100%)",
              }}
            >
              <ShieldCheck
                className="w-5 h-5"
                style={{ color: "oklch(0.50 0.22 295)" }}
              />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium">App Security</p>
              <p className="text-xs text-muted-foreground">
                {secData.pin
                  ? `PIN is set${secData.biometricEnabled ? " · Biometric ON" : ""}`
                  : "Set PIN & biometric lock"}
              </p>
            </div>
            <div className="flex items-center gap-1.5">
              <Lock
                className="w-4 h-4"
                style={{
                  color: secData.pin
                    ? "oklch(0.50 0.22 295)"
                    : "oklch(0.70 0.05 265)",
                }}
              />
              <span
                className="text-xs"
                style={{
                  color: secData.pin
                    ? "oklch(0.50 0.22 295)"
                    : "oklch(0.70 0.05 265)",
                }}
              >
                {secData.pin ? "Active" : "Off"}
              </span>
            </div>
          </button>
        </div>
      </div>

      {/* App Appearance Section */}
      <div>
        <p
          className="text-xs font-semibold uppercase tracking-wider px-1 mb-2"
          style={{ color: "oklch(0.50 0.15 295)" }}
        >
          App Appearance
        </p>
        <div
          className="rounded-xl border overflow-hidden"
          style={{ borderColor: "oklch(0.88 0.005 265)" }}
        >
          <button
            type="button"
            data-ocid="profile.appearance.button"
            onClick={() => setScreen("appearance")}
            className="w-full flex items-center gap-3 px-4 py-4 hover:bg-muted transition-colors text-left"
          >
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center"
              style={{
                background:
                  "linear-gradient(135deg, oklch(0.95 0.05 295) 0%, oklch(0.92 0.05 340) 100%)",
              }}
            >
              <Palette
                className="w-5 h-5"
                style={{ color: "oklch(0.50 0.22 295)" }}
              />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium">App Appearance</p>
              <p className="text-xs text-muted-foreground">
                Theme, colors, font, animations
              </p>
            </div>
            <ChevronRight className="w-4 h-4 text-muted-foreground" />
          </button>
        </div>
      </div>

      {/* Legal Section */}
      <div>
        <p
          className="text-xs font-semibold uppercase tracking-wider px-1 mb-2"
          style={{ color: "oklch(0.50 0.15 295)" }}
        >
          Legal
        </p>
        <div
          className="rounded-xl border overflow-hidden"
          style={{ borderColor: "oklch(0.88 0.005 265)" }}
        >
          <button
            type="button"
            data-ocid="profile.legal.button"
            onClick={() => setScreen("legal")}
            className="w-full flex items-center gap-3 px-4 py-4 hover:bg-muted transition-colors text-left"
          >
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center"
              style={{
                background:
                  "linear-gradient(135deg, oklch(0.95 0.05 250) 0%, oklch(0.92 0.05 280) 100%)",
              }}
            >
              <BookOpen
                className="w-5 h-5"
                style={{ color: "oklch(0.50 0.18 250)" }}
              />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium">Legal</p>
              <p className="text-xs text-muted-foreground">
                About, Help, Privacy & Terms
              </p>
            </div>
            <ChevronRight className="w-4 h-4 text-muted-foreground" />
          </button>
        </div>
      </div>

      {/* Offline Safety Settings */}
      <div>
        <p
          className="text-xs font-semibold uppercase tracking-wider px-1 mb-2"
          style={{ color: "oklch(0.50 0.15 295)" }}
        >
          Offline Safety
        </p>
        <div
          className="rounded-xl border overflow-hidden"
          style={{ borderColor: "oklch(0.88 0.005 265)" }}
        >
          <div className="w-full flex items-center gap-3 px-4 py-4">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{
                background:
                  "linear-gradient(135deg, oklch(0.95 0.05 25) 0%, oklch(0.92 0.05 50) 100%)",
              }}
            >
              <WifiOff
                className="w-5 h-5"
                style={{ color: "oklch(0.50 0.20 25)" }}
              />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground">
                Offline SMS Alerts
              </p>
              <p className="text-xs text-muted-foreground leading-tight mt-0.5">
                Send SMS to contacts when SOS triggered offline
              </p>
            </div>
            <Switch
              data-ocid="profile.offline_sms.toggle"
              checked={offlineSmsEnabled}
              onCheckedChange={handleOfflineSmsToggle}
            />
          </div>
        </div>
      </div>

      <Button
        data-ocid="profile.signout.button"
        variant="outline"
        onClick={handleSignOut}
        className="w-full h-11 border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground"
      >
        <LogOut className="w-4 h-4 mr-2" /> Sign Out
      </Button>

      <p className="text-xs text-muted-foreground text-center">
        © {new Date().getFullYear()}. Built with{" "}
        <a
          href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
          target="_blank"
          rel="noreferrer"
          className="underline"
        >
          caffeine.ai
        </a>
      </p>
    </div>
  );
}
