import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import {
  AlertTriangle,
  BarChart3,
  Bell,
  BookOpen,
  Car,
  FileText,
  FolderOpen,
  Lock,
  LogOut,
  MapPin,
  Menu,
  MessageCircle,
  Shield,
  Users,
  X,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useApp } from "../context/AppContext";

type PanelId =
  | "users"
  | "sos"
  | "rides"
  | "location"
  | "files"
  | "ai-logs"
  | "reports"
  | "analytics"
  | "safemap"
  | "notifications"
  | "legal"
  | "security";

const NAV_ITEMS: { id: PanelId; label: string; icon: React.ReactNode }[] = [
  { id: "analytics", label: "Analytics", icon: <BarChart3 size={16} /> },
  { id: "users", label: "User Management", icon: <Users size={16} /> },
  { id: "sos", label: "SOS Monitoring", icon: <AlertTriangle size={16} /> },
  { id: "rides", label: "Ride & Taxi", icon: <Car size={16} /> },
  { id: "location", label: "Live Location", icon: <MapPin size={16} /> },
  { id: "files", label: "Files & Evidence", icon: <FolderOpen size={16} /> },
  { id: "ai-logs", label: "Sakhi AI Logs", icon: <MessageCircle size={16} /> },
  { id: "reports", label: "Reports", icon: <FileText size={16} /> },
  { id: "safemap", label: "Safe Map Control", icon: <Shield size={16} /> },
  { id: "notifications", label: "Notifications", icon: <Bell size={16} /> },
  { id: "legal", label: "Legal & Content", icon: <BookOpen size={16} /> },
  { id: "security", label: "Security Control", icon: <Lock size={16} /> },
];

// ── Styles ──────────────────────────────────────────────────────────────────
const S = {
  page: {
    background: "#0a0a14",
    minHeight: "100dvh",
    display: "flex" as const,
    fontFamily: "'Plus Jakarta Sans', sans-serif",
  },
  sidebar: {
    background: "#1a1a2e",
    borderRight: "1px solid rgba(155,39,175,0.25)",
    width: 240,
    flexShrink: 0 as const,
    display: "flex" as const,
    flexDirection: "column" as const,
    position: "fixed" as const,
    top: 0,
    left: 0,
    bottom: 0,
    zIndex: 50,
  },
  card: {
    background: "#0f0f20",
    border: "1px solid rgba(155,39,175,0.3)",
    borderRadius: 12,
    padding: "16px 20px",
  },
  statCard: {
    background: "#0f0f20",
    border: "1px solid rgba(155,39,175,0.25)",
    borderRadius: 12,
    padding: "20px",
    flex: 1,
  },
};

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { bg: string; color: string }> = {
    Active: { bg: "rgba(34,197,94,0.15)", color: "#4ade80" },
    active: { bg: "rgba(34,197,94,0.15)", color: "#4ade80" },
    Blocked: { bg: "rgba(239,68,68,0.15)", color: "#f87171" },
    blocked: { bg: "rgba(239,68,68,0.15)", color: "#f87171" },
    Suspicious: { bg: "rgba(234,179,8,0.15)", color: "#facc15" },
    suspicious: { bg: "rgba(234,179,8,0.15)", color: "#facc15" },
    Resolved: { bg: "rgba(34,197,94,0.15)", color: "#4ade80" },
    resolved: { bg: "rgba(34,197,94,0.15)", color: "#4ade80" },
    Emergency: { bg: "rgba(239,68,68,0.2)", color: "#f87171" },
    emergency: { bg: "rgba(239,68,68,0.2)", color: "#f87171" },
    Pending: { bg: "rgba(234,179,8,0.15)", color: "#facc15" },
    pending: { bg: "rgba(234,179,8,0.15)", color: "#facc15" },
    "In Progress": { bg: "rgba(59,130,246,0.15)", color: "#60a5fa" },
    High: { bg: "rgba(239,68,68,0.15)", color: "#f87171" },
    Medium: { bg: "rgba(234,179,8,0.15)", color: "#facc15" },
    Low: { bg: "rgba(34,197,94,0.15)", color: "#4ade80" },
  };
  const style = map[status] ?? { bg: "rgba(255,255,255,0.1)", color: "#ccc" };
  return (
    <span
      style={{
        background: style.bg,
        color: style.color,
        borderRadius: 6,
        padding: "2px 10px",
        fontSize: 11,
        fontWeight: 600,
        letterSpacing: 0.3,
      }}
    >
      {status}
    </span>
  );
}

// ── Panel: Analytics ────────────────────────────────────────────────────────
function AnalyticsPanel() {
  const stats = [
    { label: "Total Users", value: 247, color: "#9b27af" },
    { label: "SOS Alerts", value: 34, color: "#e91e8c" },
    { label: "Active Cases", value: 8, color: "#ef4444" },
    { label: "High-Risk Areas", value: 5, color: "#f59e0b" },
  ];
  const areas = [
    { name: "Berhampur Bus Stand", level: 92 },
    { name: "NH-16 Stretch", level: 78 },
    { name: "Old Town Area", level: 65 },
    { name: "Railway Station Road", level: 58 },
    { name: "Gandhi Market", level: 43 },
  ];
  return (
    <div className="space-y-6">
      <h2 style={{ color: "#fff", fontSize: 22, fontWeight: 700, margin: 0 }}>
        Analytics Dashboard
      </h2>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(160px,1fr))",
          gap: 16,
        }}
      >
        {stats.map((s) => (
          <div key={s.label} style={{ ...S.statCard }}>
            <div style={{ fontSize: 36, fontWeight: 800, color: s.color }}>
              {s.value}
            </div>
            <div
              style={{
                color: "rgba(255,255,255,0.6)",
                fontSize: 13,
                marginTop: 4,
              }}
            >
              {s.label}
            </div>
            <div
              style={{
                height: 3,
                borderRadius: 2,
                background: s.color,
                marginTop: 12,
                opacity: 0.7,
              }}
            />
          </div>
        ))}
      </div>
      <div style={S.card}>
        <div
          style={{
            color: "rgba(255,255,255,0.7)",
            fontSize: 12,
            fontWeight: 600,
            marginBottom: 12,
            textTransform: "uppercase",
            letterSpacing: 1,
          }}
        >
          High-Risk Areas
        </div>
        {areas.map((a) => (
          <div key={a.name} style={{ marginBottom: 10 }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: 4,
              }}
            >
              <span style={{ color: "#fff", fontSize: 13 }}>{a.name}</span>
              <span
                style={{
                  color:
                    a.level > 70
                      ? "#f87171"
                      : a.level > 50
                        ? "#facc15"
                        : "#4ade80",
                  fontSize: 13,
                  fontWeight: 600,
                }}
              >
                {a.level}%
              </span>
            </div>
            <div
              style={{
                height: 6,
                background: "rgba(255,255,255,0.08)",
                borderRadius: 3,
              }}
            >
              <div
                style={{
                  height: "100%",
                  width: `${a.level}%`,
                  background:
                    a.level > 70
                      ? "#ef4444"
                      : a.level > 50
                        ? "#f59e0b"
                        : "#22c55e",
                  borderRadius: 3,
                  transition: "width 0.5s",
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Panel: User Management ──────────────────────────────────────────────────
function UserManagementPanel() {
  const [users, setUsers] = useState([
    { id: 1, name: "Priya Sharma", phone: "9876500001", status: "Active" },
    { id: 2, name: "Anjali Singh", phone: "9876500002", status: "Active" },
    { id: 3, name: "Rekha Devi", phone: "9876500003", status: "Suspicious" },
    { id: 4, name: "Meera Patel", phone: "9876500004", status: "Blocked" },
    { id: 5, name: "Sunita Roy", phone: "9876500005", status: "Active" },
    { id: 6, name: "Kavita Nanda", phone: "9876500006", status: "Active" },
  ]);

  function setStatus(id: number, status: string) {
    setUsers((prev) => prev.map((u) => (u.id === id ? { ...u, status } : u)));
    toast.success(`User status updated to ${status}`);
  }

  const stats = [
    { label: "Total", value: 247, color: "#9b27af" },
    { label: "Active", value: 198, color: "#4ade80" },
    { label: "Blocked", value: 12, color: "#f87171" },
    { label: "Suspicious", value: 8, color: "#facc15" },
  ];

  return (
    <div className="space-y-6">
      <h2 style={{ color: "#fff", fontSize: 22, fontWeight: 700, margin: 0 }}>
        User Management
      </h2>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(120px,1fr))",
          gap: 12,
        }}
      >
        {stats.map((s) => (
          <div key={s.label} style={S.statCard}>
            <div style={{ fontSize: 28, fontWeight: 800, color: s.color }}>
              {s.value}
            </div>
            <div style={{ color: "rgba(255,255,255,0.55)", fontSize: 12 }}>
              {s.label}
            </div>
          </div>
        ))}
      </div>
      <div style={S.card}>
        {users.map((u, idx) => (
          <div
            key={u.id}
            data-ocid={`admin.users.row.${idx + 1}`}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "12px 0",
              borderBottom:
                idx < users.length - 1
                  ? "1px solid rgba(255,255,255,0.06)"
                  : "none",
            }}
          >
            <div>
              <div
                style={{
                  color:
                    u.status === "Suspicious"
                      ? "#facc15"
                      : u.status === "Blocked"
                        ? "#f87171"
                        : "#fff",
                  fontWeight: 600,
                  fontSize: 14,
                }}
              >
                {u.name}
              </div>
              <div style={{ color: "rgba(255,255,255,0.4)", fontSize: 12 }}>
                {u.phone}
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <StatusBadge status={u.status} />
              <div style={{ display: "flex", gap: 6 }}>
                {u.status !== "Blocked" && (
                  <button
                    type="button"
                    data-ocid={`admin.users.delete_button.${idx + 1}`}
                    onClick={() => setStatus(u.id, "Blocked")}
                    style={{
                      background: "rgba(239,68,68,0.15)",
                      color: "#f87171",
                      border: "none",
                      borderRadius: 6,
                      padding: "4px 10px",
                      fontSize: 11,
                      cursor: "pointer",
                      fontWeight: 600,
                    }}
                  >
                    Block
                  </button>
                )}
                {u.status === "Blocked" && (
                  <button
                    type="button"
                    data-ocid={`admin.users.secondary_button.${idx + 1}`}
                    onClick={() => setStatus(u.id, "Active")}
                    style={{
                      background: "rgba(34,197,94,0.15)",
                      color: "#4ade80",
                      border: "none",
                      borderRadius: 6,
                      padding: "4px 10px",
                      fontSize: 11,
                      cursor: "pointer",
                      fontWeight: 600,
                    }}
                  >
                    Unblock
                  </button>
                )}
                {u.status !== "Suspicious" && u.status !== "Blocked" && (
                  <button
                    type="button"
                    onClick={() => setStatus(u.id, "Suspicious")}
                    style={{
                      background: "rgba(234,179,8,0.12)",
                      color: "#facc15",
                      border: "none",
                      borderRadius: 6,
                      padding: "4px 10px",
                      fontSize: 11,
                      cursor: "pointer",
                      fontWeight: 600,
                    }}
                  >
                    Flag
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Panel: SOS Monitoring ───────────────────────────────────────────────────
function SOSPanel() {
  const alerts = [
    {
      id: 1,
      name: "Priya Sharma",
      phone: "9876500001",
      lat: 19.3149,
      lng: 84.7941,
      time: "10:32 AM",
      status: "Emergency",
    },
    {
      id: 2,
      name: "Anjali Singh",
      phone: "9876500002",
      lat: 19.308,
      lng: 84.79,
      time: "10:18 AM",
      status: "Emergency",
    },
    {
      id: 3,
      name: "Rekha Devi",
      phone: "9876500003",
      lat: 19.32,
      lng: 84.801,
      time: "09:55 AM",
      status: "Resolved",
    },
    {
      id: 4,
      name: "Meera Patel",
      phone: "9876500004",
      lat: 19.31,
      lng: 84.785,
      time: "09:10 AM",
      status: "Resolved",
    },
    {
      id: 5,
      name: "Sunita Roy",
      phone: "9876500005",
      lat: 19.325,
      lng: 84.805,
      time: "08:45 AM",
      status: "Resolved",
    },
  ];
  return (
    <div className="space-y-6">
      <h2 style={{ color: "#fff", fontSize: 22, fontWeight: 700, margin: 0 }}>
        SOS Monitoring
      </h2>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        <div style={{ ...S.statCard, border: "1px solid rgba(239,68,68,0.4)" }}>
          <div style={{ fontSize: 28, fontWeight: 800, color: "#f87171" }}>
            2
          </div>
          <div style={{ color: "rgba(255,255,255,0.55)", fontSize: 12 }}>
            Active Emergencies
          </div>
        </div>
        <div style={{ ...S.statCard, border: "1px solid rgba(34,197,94,0.3)" }}>
          <div style={{ fontSize: 28, fontWeight: 800, color: "#4ade80" }}>
            3
          </div>
          <div style={{ color: "rgba(255,255,255,0.55)", fontSize: 12 }}>
            Resolved
          </div>
        </div>
      </div>
      <div className="space-y-3">
        {alerts.map((a, idx) => (
          <div
            key={a.id}
            data-ocid={`admin.sos.row.${idx + 1}`}
            style={{
              ...S.card,
              border:
                a.status === "Emergency"
                  ? "1px solid rgba(239,68,68,0.6)"
                  : "1px solid rgba(155,39,175,0.25)",
              boxShadow:
                a.status === "Emergency"
                  ? "0 0 12px rgba(239,68,68,0.15)"
                  : "none",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
              }}
            >
              <div>
                <div style={{ color: "#fff", fontWeight: 600 }}>{a.name}</div>
                <div style={{ color: "rgba(255,255,255,0.4)", fontSize: 12 }}>
                  {a.phone}
                </div>
                <div
                  style={{
                    color: "rgba(255,255,255,0.5)",
                    fontSize: 11,
                    marginTop: 4,
                  }}
                >
                  Lat: {a.lat}, Lng: {a.lng}
                </div>
              </div>
              <div style={{ textAlign: "right" }}>
                <StatusBadge status={a.status} />
                <div
                  style={{
                    color: "rgba(255,255,255,0.4)",
                    fontSize: 11,
                    marginTop: 4,
                  }}
                >
                  {a.time}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Panel: Ride & Taxi ──────────────────────────────────────────────────────
function RidePanel() {
  const rides = [
    {
      id: 1,
      user: "Priya Sharma",
      driver: "Rajesh Kumar",
      vehicle: "OD07 AB 1234",
      type: "Auto",
      status: "Active",
      time: "10:05 AM",
    },
    {
      id: 2,
      user: "Anjali Singh",
      driver: "Suresh Rao",
      vehicle: "OD09 CD 5678",
      type: "Taxi",
      status: "Active",
      time: "09:48 AM",
    },
    {
      id: 3,
      user: "Kavita Nanda",
      driver: "Mohan Das",
      vehicle: "OD07 EF 9012",
      type: "Bike",
      status: "Active",
      time: "09:30 AM",
    },
  ];
  return (
    <div className="space-y-6">
      <h2 style={{ color: "#fff", fontSize: 22, fontWeight: 700, margin: 0 }}>
        Ride & Taxi Monitoring
      </h2>
      <div style={S.card}>
        <div
          style={{
            color: "rgba(255,255,255,0.5)",
            fontSize: 11,
            textTransform: "uppercase",
            letterSpacing: 1,
            marginBottom: 12,
          }}
        >
          Active Rides
        </div>
        {rides.map((r, idx) => (
          <div
            key={r.id}
            data-ocid={`admin.rides.row.${idx + 1}`}
            style={{
              padding: "12px 0",
              borderBottom:
                idx < rides.length - 1
                  ? "1px solid rgba(255,255,255,0.06)"
                  : "none",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: 6,
              }}
            >
              <span style={{ color: "#fff", fontWeight: 600 }}>{r.user}</span>
              <StatusBadge status={r.status} />
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 4,
                fontSize: 12,
              }}
            >
              <span style={{ color: "rgba(255,255,255,0.4)" }}>
                Driver:{" "}
                <span style={{ color: "rgba(255,255,255,0.7)" }}>
                  {r.driver}
                </span>
              </span>
              <span style={{ color: "rgba(255,255,255,0.4)" }}>
                Vehicle:{" "}
                <span style={{ color: "rgba(255,255,255,0.7)" }}>
                  {r.vehicle}
                </span>
              </span>
              <span style={{ color: "rgba(255,255,255,0.4)" }}>
                Type:{" "}
                <span style={{ color: "rgba(255,255,255,0.7)" }}>{r.type}</span>
              </span>
              <span style={{ color: "rgba(255,255,255,0.4)" }}>
                Started:{" "}
                <span style={{ color: "rgba(255,255,255,0.7)" }}>{r.time}</span>
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Panel: Live Location ────────────────────────────────────────────────────
function LiveLocationPanel() {
  const users = [
    { name: "Priya Sharma", lat: 19.3149, lng: 84.7941, status: "Emergency" },
    { name: "Anjali Singh", lat: 19.308, lng: 84.79, status: "Emergency" },
    { name: "Rekha Devi", lat: 19.32, lng: 84.801, status: "Active" },
    { name: "Meera Patel", lat: 19.31, lng: 84.785, status: "Active" },
    { name: "Sunita Roy", lat: 19.325, lng: 84.805, status: "Active" },
  ];
  return (
    <div className="space-y-6">
      <h2 style={{ color: "#fff", fontSize: 22, fontWeight: 700, margin: 0 }}>
        Live Location Dashboard
      </h2>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3,1fr)",
          gap: 12,
        }}
      >
        {[
          { label: "On Map", value: 45, color: "#9b27af" },
          { label: "Emergency", value: 2, color: "#ef4444" },
          { label: "Total Tracked", value: 198, color: "#4ade80" },
        ].map((s) => (
          <div key={s.label} style={S.statCard}>
            <div style={{ fontSize: 26, fontWeight: 800, color: s.color }}>
              {s.value}
            </div>
            <div style={{ color: "rgba(255,255,255,0.5)", fontSize: 12 }}>
              {s.label}
            </div>
          </div>
        ))}
      </div>
      {/* Simulated map */}
      <div
        style={{
          ...S.card,
          padding: 0,
          overflow: "hidden",
          position: "relative",
          height: 200,
        }}
      >
        <div
          style={{
            width: "100%",
            height: "100%",
            backgroundImage:
              "linear-gradient(rgba(155,39,175,0.07) 1px, transparent 1px), linear-gradient(90deg, rgba(155,39,175,0.07) 1px, transparent 1px)",
            backgroundSize: "32px 32px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div style={{ textAlign: "center" }}>
            <MapPin
              size={32}
              color="#9b27af"
              style={{ margin: "0 auto 8px" }}
            />
            <div style={{ color: "rgba(255,255,255,0.4)", fontSize: 13 }}>
              Live Map — Berhampur, Odisha
            </div>
            <div
              style={{
                color: "rgba(255,255,255,0.25)",
                fontSize: 11,
                marginTop: 4,
              }}
            >
              45 active users tracked
            </div>
          </div>
        </div>
        {/* Emergency pulse dots */}
        <div
          style={{
            position: "absolute",
            top: 40,
            left: "30%",
            width: 12,
            height: 12,
            borderRadius: "50%",
            background: "#ef4444",
            animation: "pulse 1.5s infinite",
            boxShadow: "0 0 8px #ef4444",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: 90,
            left: "60%",
            width: 10,
            height: 10,
            borderRadius: "50%",
            background: "#ef4444",
            animation: "pulse 1.5s infinite 0.5s",
            boxShadow: "0 0 8px #ef4444",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: 120,
            left: "45%",
            width: 8,
            height: 8,
            borderRadius: "50%",
            background: "#9b27af",
          }}
        />
      </div>
      <div style={S.card}>
        {users.map((u, idx) => (
          <div
            key={u.name}
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "8px 0",
              borderBottom:
                idx < users.length - 1
                  ? "1px solid rgba(255,255,255,0.06)"
                  : "none",
            }}
          >
            <div>
              <div
                style={{
                  color: u.status === "Emergency" ? "#f87171" : "#fff",
                  fontWeight: 600,
                  fontSize: 13,
                }}
              >
                {u.name}
              </div>
              <div style={{ color: "rgba(255,255,255,0.35)", fontSize: 11 }}>
                {u.lat.toFixed(4)}, {u.lng.toFixed(4)}
              </div>
            </div>
            <StatusBadge status={u.status} />
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Panel: Files & Evidence ─────────────────────────────────────────────────
function FilesPanel() {
  const images = [
    {
      name: "evidence_001.jpg",
      user: "Priya Sharma",
      date: "Mar 20",
      size: "2.1 MB",
    },
    {
      name: "scene_capture.jpg",
      user: "Anjali Singh",
      date: "Mar 19",
      size: "1.8 MB",
    },
    {
      name: "ride_snap.jpg",
      user: "Rekha Devi",
      date: "Mar 18",
      size: "0.9 MB",
    },
  ];
  const videos = [
    {
      name: "sos_record_01.mp4",
      user: "Priya Sharma",
      date: "Mar 20",
      size: "14 MB",
    },
    {
      name: "trip_record.mp4",
      user: "Kavita Nanda",
      date: "Mar 17",
      size: "22 MB",
    },
  ];
  const voice = [
    {
      name: "voice_sos_001.m4a",
      user: "Priya Sharma",
      date: "Mar 20",
      duration: "0:42",
    },
    {
      name: "voice_alert.m4a",
      user: "Sunita Roy",
      date: "Mar 16",
      duration: "1:05",
    },
  ];
  const history = [
    {
      event: "SOS Alert",
      user: "Priya Sharma",
      date: "Mar 20, 10:32 AM",
      location: "Bus Stand, Berhampur",
    },
    {
      event: "Scan Taxi",
      user: "Anjali Singh",
      date: "Mar 19, 09:15 AM",
      location: "NH-16, Berhampur",
    },
    {
      event: "SOS Alert",
      user: "Rekha Devi",
      date: "Mar 18, 07:55 PM",
      location: "Old Town Area",
    },
  ];

  function FileRow({
    name,
    user,
    date,
    extra,
  }: { name: string; user: string; date: string; extra: string }) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "10px 0",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        <div>
          <div style={{ color: "#fff", fontSize: 13, fontWeight: 500 }}>
            {name}
          </div>
          <div style={{ color: "rgba(255,255,255,0.4)", fontSize: 11 }}>
            {user} · {date} · {extra}
          </div>
        </div>
        <div style={{ display: "flex", gap: 6 }}>
          <button
            type="button"
            onClick={() => toast.success("Viewing file...")}
            style={{
              background: "rgba(155,39,175,0.15)",
              color: "#c084fc",
              border: "none",
              borderRadius: 6,
              padding: "4px 10px",
              fontSize: 11,
              cursor: "pointer",
            }}
          >
            View
          </button>
          <button
            type="button"
            onClick={() => toast.success("Downloading...")}
            style={{
              background: "rgba(59,130,246,0.15)",
              color: "#60a5fa",
              border: "none",
              borderRadius: 6,
              padding: "4px 10px",
              fontSize: 11,
              cursor: "pointer",
            }}
          >
            Download
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 style={{ color: "#fff", fontSize: 22, fontWeight: 700, margin: 0 }}>
        Files & Evidence
      </h2>
      <Tabs defaultValue="images">
        <TabsList
          style={{ background: "rgba(255,255,255,0.06)", borderRadius: 8 }}
        >
          <TabsTrigger value="images" data-ocid="admin.files.tab">
            Images
          </TabsTrigger>
          <TabsTrigger value="videos" data-ocid="admin.files.tab">
            Videos
          </TabsTrigger>
          <TabsTrigger value="voice" data-ocid="admin.files.tab">
            Voice
          </TabsTrigger>
          <TabsTrigger value="history" data-ocid="admin.files.tab">
            SOS History
          </TabsTrigger>
        </TabsList>
        <TabsContent value="images">
          <div style={S.card}>
            {images.map((f) => (
              <FileRow
                key={f.name}
                name={f.name}
                user={f.user}
                date={f.date}
                extra={f.size}
              />
            ))}
          </div>
        </TabsContent>
        <TabsContent value="videos">
          <div style={S.card}>
            {videos.map((f) => (
              <FileRow
                key={f.name}
                name={f.name}
                user={f.user}
                date={f.date}
                extra={f.size}
              />
            ))}
          </div>
        </TabsContent>
        <TabsContent value="voice">
          <div style={S.card}>
            {voice.map((f) => (
              <FileRow
                key={f.name}
                name={f.name}
                user={f.user}
                date={f.date}
                extra={f.duration}
              />
            ))}
          </div>
        </TabsContent>
        <TabsContent value="history">
          <div style={S.card}>
            {history.map((h, idx) => (
              <div
                key={h.date + h.event}
                style={{
                  padding: "10px 0",
                  borderBottom:
                    idx < history.length - 1
                      ? "1px solid rgba(255,255,255,0.06)"
                      : "none",
                }}
              >
                <div
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <span
                    style={{
                      color: h.event === "SOS Alert" ? "#f87171" : "#c084fc",
                      fontWeight: 600,
                      fontSize: 13,
                    }}
                  >
                    {h.event}
                  </span>
                  <span
                    style={{ color: "rgba(255,255,255,0.4)", fontSize: 11 }}
                  >
                    {h.date}
                  </span>
                </div>
                <div
                  style={{
                    color: "rgba(255,255,255,0.5)",
                    fontSize: 12,
                    marginTop: 2,
                  }}
                >
                  {h.user} · {h.location}
                </div>
              </div>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

// ── Panel: Sakhi AI Logs ────────────────────────────────────────────────────
function AILogsPanel() {
  const logs = [
    {
      user: "Priya Sharma",
      messages: [
        { from: "user", text: "help me please bachao" },
        { from: "bot", text: "SOS detected! Sending alert..." },
      ],
      flagged: true,
      keyword: "bachao",
    },
    {
      user: "Anjali Singh",
      messages: [
        { from: "user", text: "I feel scared right now" },
        { from: "bot", text: "You are safe, I am here for you." },
      ],
      flagged: false,
      keyword: null,
    },
    {
      user: "Rekha Devi",
      messages: [
        { from: "user", text: "someone is following me help" },
        { from: "bot", text: "Emergency mode activated. Press SOS." },
      ],
      flagged: true,
      keyword: "help",
    },
    {
      user: "Kavita Nanda",
      messages: [
        { from: "user", text: "How do I report a crime?" },
        {
          from: "bot",
          text: "I can help you file a report. Please share details.",
        },
      ],
      flagged: false,
      keyword: null,
    },
  ];
  return (
    <div className="space-y-6">
      <h2 style={{ color: "#fff", fontSize: 22, fontWeight: 700, margin: 0 }}>
        Sakhi AI Chat Logs
      </h2>
      <div className="space-y-4">
        {logs.map((log, idx) => (
          <div
            key={log.user}
            data-ocid={`admin.ai_logs.row.${idx + 1}`}
            style={{
              ...S.card,
              border: log.flagged
                ? "1px solid rgba(249,115,22,0.5)"
                : "1px solid rgba(155,39,175,0.25)",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: 10,
              }}
            >
              <span style={{ color: "#fff", fontWeight: 600 }}>{log.user}</span>
              {log.flagged && (
                <span
                  style={{
                    background: "rgba(249,115,22,0.2)",
                    color: "#fb923c",
                    borderRadius: 6,
                    padding: "2px 10px",
                    fontSize: 11,
                    fontWeight: 600,
                  }}
                >
                  Flagged: "{log.keyword}"
                </span>
              )}
            </div>
            {log.messages.map((m) => (
              <div
                key={m.from + m.text.slice(0, 12)}
                style={{
                  marginBottom: 6,
                  display: "flex",
                  justifyContent: m.from === "user" ? "flex-end" : "flex-start",
                }}
              >
                <div
                  style={{
                    background:
                      m.from === "user"
                        ? "rgba(155,39,175,0.25)"
                        : "rgba(255,255,255,0.07)",
                    color:
                      m.from === "user" && log.flagged
                        ? "#fb923c"
                        : "rgba(255,255,255,0.8)",
                    borderRadius: 8,
                    padding: "6px 12px",
                    fontSize: 13,
                    maxWidth: "80%",
                  }}
                >
                  {m.text}
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Panel: Reports ──────────────────────────────────────────────────────────
function ReportsPanel() {
  const [reports, setReports] = useState([
    {
      id: 1,
      type: "Harassment",
      user: "Priya Sharma",
      desc: "Man followed me on NH-16 near bus stand.",
      date: "Mar 20",
      status: "Pending",
    },
    {
      id: 2,
      type: "Crime",
      user: "Rekha Devi",
      desc: "Theft at Gandhi Market, items stolen.",
      date: "Mar 19",
      status: "In Progress",
    },
    {
      id: 3,
      type: "Harassment",
      user: "Anjali Singh",
      desc: "Verbal harassment near railway station.",
      date: "Mar 18",
      status: "Resolved",
    },
    {
      id: 4,
      type: "Crime",
      user: "Meera Patel",
      desc: "Physical assault at Old Town area.",
      date: "Mar 17",
      status: "Pending",
    },
    {
      id: 5,
      type: "Harassment",
      user: "Sunita Roy",
      desc: "Online harassment via social media.",
      date: "Mar 16",
      status: "Resolved",
    },
  ]);

  function updateStatus(id: number, status: string) {
    setReports((prev) => prev.map((r) => (r.id === id ? { ...r, status } : r)));
    toast.success(`Report status updated to ${status}`);
  }

  return (
    <div className="space-y-6">
      <h2 style={{ color: "#fff", fontSize: 22, fontWeight: 700, margin: 0 }}>
        Report Management
      </h2>
      <div className="space-y-3">
        {reports.map((r, idx) => (
          <div
            key={r.id}
            data-ocid={`admin.reports.row.${idx + 1}`}
            style={S.card}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                marginBottom: 8,
              }}
            >
              <div>
                <span
                  style={{
                    color: r.type === "Crime" ? "#f87171" : "#c084fc",
                    fontWeight: 700,
                    fontSize: 13,
                  }}
                >
                  {r.type}
                </span>
                <span
                  style={{
                    color: "rgba(255,255,255,0.4)",
                    fontSize: 12,
                    marginLeft: 8,
                  }}
                >
                  by {r.user}
                </span>
              </div>
              <span style={{ color: "rgba(255,255,255,0.35)", fontSize: 11 }}>
                {r.date}
              </span>
            </div>
            <p
              style={{
                color: "rgba(255,255,255,0.65)",
                fontSize: 13,
                margin: "0 0 12px",
              }}
            >
              {r.desc}
            </p>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <StatusBadge status={r.status} />
              <select
                data-ocid={`admin.reports.select.${idx + 1}`}
                value={r.status}
                onChange={(e) => updateStatus(r.id, e.target.value)}
                style={{
                  background: "rgba(255,255,255,0.08)",
                  color: "#fff",
                  border: "1px solid rgba(155,39,175,0.3)",
                  borderRadius: 6,
                  padding: "4px 8px",
                  fontSize: 12,
                  cursor: "pointer",
                }}
              >
                <option value="Pending">Pending</option>
                <option value="In Progress">In Progress</option>
                <option value="Resolved">Resolved</option>
              </select>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Panel: Safe Map Control ─────────────────────────────────────────────────
function SafeMapPanel() {
  const [zones, setZones] = useState([
    { id: 1, name: "Berhampur Bus Stand", risk: "High", active: true },
    { id: 2, name: "NH-16 Stretch", risk: "Medium", active: true },
    { id: 3, name: "Old Town Area", risk: "Medium", active: true },
    { id: 4, name: "Railway Station", risk: "Low", active: false },
  ]);

  function removeZone(id: number) {
    setZones((prev) => prev.filter((z) => z.id !== id));
    toast.success("Zone removed");
  }

  function pushAlert(name: string) {
    toast.success(`Alert pushed for zone: ${name}`);
  }

  return (
    <div className="space-y-6">
      <h2 style={{ color: "#fff", fontSize: 22, fontWeight: 700, margin: 0 }}>
        Safe Map Control
      </h2>
      <div className="space-y-3">
        {zones.map((z, idx) => (
          <div
            key={z.id}
            data-ocid={`admin.safemap.row.${idx + 1}`}
            style={{
              ...S.card,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div>
              <div style={{ color: "#fff", fontWeight: 600 }}>{z.name}</div>
              <StatusBadge status={z.risk} />
            </div>
            <div style={{ display: "flex", gap: 6 }}>
              <button
                type="button"
                onClick={() => pushAlert(z.name)}
                style={{
                  background: "rgba(234,179,8,0.15)",
                  color: "#facc15",
                  border: "none",
                  borderRadius: 6,
                  padding: "5px 12px",
                  fontSize: 12,
                  cursor: "pointer",
                  fontWeight: 600,
                }}
              >
                Push Alert
              </button>
              <button
                type="button"
                onClick={() => removeZone(z.id)}
                data-ocid={`admin.safemap.delete_button.${idx + 1}`}
                style={{
                  background: "rgba(239,68,68,0.15)",
                  color: "#f87171",
                  border: "none",
                  borderRadius: 6,
                  padding: "5px 12px",
                  fontSize: 12,
                  cursor: "pointer",
                  fontWeight: 600,
                }}
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>
      <button
        type="button"
        data-ocid="admin.safemap.primary_button"
        onClick={() => toast.success("New danger zone added")}
        style={{
          background: "linear-gradient(135deg,#9b27af,#e91e8c)",
          color: "#fff",
          border: "none",
          borderRadius: 8,
          padding: "10px 24px",
          fontSize: 14,
          cursor: "pointer",
          fontWeight: 600,
          width: "100%",
        }}
      >
        Add New Danger Zone
      </button>
    </div>
  );
}

// ── Panel: Notifications ────────────────────────────────────────────────────
function NotificationsPanel() {
  const [message, setMessage] = useState("");
  const [type, setType] = useState("Safety");
  const [sent, setSent] = useState([
    {
      msg: "Stay alert near Bus Stand area tonight.",
      type: "Safety",
      time: "Mar 20, 08:00 AM",
    },
    {
      msg: "Emergency advisory: Avoid NH-16 after 10 PM.",
      type: "Emergency",
      time: "Mar 19, 09:30 PM",
    },
    {
      msg: "New safety features added! Update your app.",
      type: "General",
      time: "Mar 18, 12:00 PM",
    },
  ]);

  function sendNotification() {
    if (!message.trim()) {
      toast.error("Please enter a message");
      return;
    }
    setSent((prev) => [{ msg: message, type, time: "Just now" }, ...prev]);
    setMessage("");
    toast.success("Notification sent to all users!");
  }

  return (
    <div className="space-y-6">
      <h2 style={{ color: "#fff", fontSize: 22, fontWeight: 700, margin: 0 }}>
        Notification System
      </h2>
      <div style={S.card}>
        <div
          style={{
            color: "rgba(255,255,255,0.5)",
            fontSize: 12,
            textTransform: "uppercase",
            letterSpacing: 1,
            marginBottom: 12,
          }}
        >
          Compose Notification
        </div>
        <Textarea
          data-ocid="admin.notifications.textarea"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Enter safety message or emergency warning..."
          rows={3}
          style={{
            background: "rgba(255,255,255,0.06)",
            border: "1px solid rgba(155,39,175,0.3)",
            color: "#fff",
            borderRadius: 8,
            marginBottom: 12,
          }}
        />
        <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
          {["Safety", "Emergency", "General"].map((t) => (
            <button
              type="button"
              key={t}
              onClick={() => setType(t)}
              style={{
                background:
                  type === t
                    ? "rgba(155,39,175,0.3)"
                    : "rgba(255,255,255,0.06)",
                color: type === t ? "#c084fc" : "rgba(255,255,255,0.5)",
                border: "1px solid",
                borderColor:
                  type === t ? "rgba(155,39,175,0.5)" : "transparent",
                borderRadius: 6,
                padding: "5px 14px",
                fontSize: 12,
                cursor: "pointer",
                fontWeight: 600,
              }}
            >
              {t}
            </button>
          ))}
        </div>
        <button
          type="button"
          data-ocid="admin.notifications.primary_button"
          onClick={sendNotification}
          style={{
            background: "linear-gradient(135deg,#9b27af,#e91e8c)",
            color: "#fff",
            border: "none",
            borderRadius: 8,
            padding: "10px 24px",
            fontSize: 14,
            cursor: "pointer",
            fontWeight: 600,
            width: "100%",
          }}
        >
          Send to All Users
        </button>
      </div>
      <div style={S.card}>
        <div
          style={{
            color: "rgba(255,255,255,0.5)",
            fontSize: 12,
            textTransform: "uppercase",
            letterSpacing: 1,
            marginBottom: 12,
          }}
        >
          Sent Notifications
        </div>
        {sent.map((n, idx) => (
          <div
            key={n.time}
            data-ocid={`admin.notifications.row.${idx + 1}`}
            style={{
              padding: "10px 0",
              borderBottom:
                idx < sent.length - 1
                  ? "1px solid rgba(255,255,255,0.06)"
                  : "none",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: 3,
              }}
            >
              <span
                style={{
                  background:
                    n.type === "Emergency"
                      ? "rgba(239,68,68,0.15)"
                      : n.type === "Safety"
                        ? "rgba(155,39,175,0.15)"
                        : "rgba(59,130,246,0.15)",
                  color:
                    n.type === "Emergency"
                      ? "#f87171"
                      : n.type === "Safety"
                        ? "#c084fc"
                        : "#60a5fa",
                  borderRadius: 4,
                  padding: "1px 8px",
                  fontSize: 11,
                  fontWeight: 600,
                }}
              >
                {n.type}
              </span>
              <span style={{ color: "rgba(255,255,255,0.3)", fontSize: 11 }}>
                {n.time}
              </span>
            </div>
            <p
              style={{
                color: "rgba(255,255,255,0.65)",
                fontSize: 13,
                margin: 0,
              }}
            >
              {n.msg}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Panel: Legal & Content ──────────────────────────────────────────────────
function LegalPanel() {
  const [sections, setSections] = useState([
    {
      id: 376,
      title: "IPC Section 376 — Rape",
      content:
        "Forcefully sexual act bina consent ke karna serious crime hai. Isme strict punishment hota hai (7 saal se life imprisonment).",
      editing: false,
    },
    {
      id: 302,
      title: "IPC Section 302 — Murder",
      content:
        "Kisi ki jaan lena sabse bada crime hai. Isme life imprisonment ya death penalty ho sakti hai.",
      editing: false,
    },
    {
      id: 364,
      title: "IPC Section 364 — Kidnapping",
      content:
        "Kisi ko zabardasti utha lena ya band karna illegal hai. Ye serious crime hai aur heavy punishment hota hai.",
      editing: false,
    },
    {
      id: 354,
      title: "IPC Section 354 — Harassment",
      content:
        "Women ko touch ya disturb karna bina consent crime hai. Isme jail aur fine dono ho sakta hai.",
      editing: false,
    },
    {
      id: 307,
      title: "IPC Section 307 — Attempt to Murder",
      content:
        "Kisi ko maarne ki koshish karna bhi serious crime hai. Chahe death na ho, phir bhi strict punishment milta hai.",
      editing: false,
    },
    {
      id: 509,
      title: "IPC Section 509 — Verbal Harassment",
      content:
        "Gande comments, messages ya gestures illegal hai. Online ya offline dono me punishment hota hai.",
      editing: false,
    },
  ]);

  function toggleEdit(id: number) {
    setSections((prev) =>
      prev.map((s) => (s.id === id ? { ...s, editing: !s.editing } : s)),
    );
  }

  function updateContent(id: number, content: string) {
    setSections((prev) =>
      prev.map((s) => (s.id === id ? { ...s, content } : s)),
    );
  }

  function save(id: number) {
    setSections((prev) =>
      prev.map((s) => (s.id === id ? { ...s, editing: false } : s)),
    );
    toast.success("Content saved");
  }

  return (
    <div className="space-y-4">
      <h2 style={{ color: "#fff", fontSize: 22, fontWeight: 700, margin: 0 }}>
        Legal & Content Management
      </h2>
      {sections.map((s, idx) => (
        <div key={s.id} data-ocid={`admin.legal.row.${idx + 1}`} style={S.card}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 8,
            }}
          >
            <span style={{ color: "#c084fc", fontWeight: 700, fontSize: 13 }}>
              {s.title}
            </span>
            <button
              type="button"
              data-ocid={`admin.legal.edit_button.${idx + 1}`}
              onClick={() => (s.editing ? save(s.id) : toggleEdit(s.id))}
              style={{
                background: s.editing
                  ? "rgba(34,197,94,0.15)"
                  : "rgba(155,39,175,0.15)",
                color: s.editing ? "#4ade80" : "#c084fc",
                border: "none",
                borderRadius: 6,
                padding: "4px 12px",
                fontSize: 11,
                cursor: "pointer",
                fontWeight: 600,
              }}
            >
              {s.editing ? "Save" : "Edit"}
            </button>
          </div>
          {s.editing ? (
            <Textarea
              value={s.content}
              onChange={(e) => updateContent(s.id, e.target.value)}
              style={{
                background: "rgba(255,255,255,0.06)",
                border: "1px solid rgba(155,39,175,0.3)",
                color: "#fff",
                borderRadius: 8,
              }}
              rows={3}
            />
          ) : (
            <p
              style={{
                color: "rgba(255,255,255,0.6)",
                fontSize: 13,
                margin: 0,
              }}
            >
              {s.content}
            </p>
          )}
        </div>
      ))}
    </div>
  );
}

// ── Panel: Security Control ─────────────────────────────────────────────────
function SecurityPanel() {
  const activities = [
    {
      user: "Rekha Devi",
      activity: "Multiple failed login attempts",
      time: "10:42 AM",
      risk: "High",
    },
    {
      user: "Unknown",
      activity: "Unauthorized API access attempt",
      time: "10:15 AM",
      risk: "High",
    },
    {
      user: "Meera Patel",
      activity: "Unusual location jump detected",
      time: "09:50 AM",
      risk: "Medium",
    },
    {
      user: "Anjali Singh",
      activity: "Mass message send attempt",
      time: "09:30 AM",
      risk: "Medium",
    },
    {
      user: "Sunita Roy",
      activity: "Profile accessed from new device",
      time: "09:00 AM",
      risk: "Low",
    },
  ];
  const privacyStats = [
    { label: "Encrypted Records", value: "2,847", color: "#4ade80" },
    { label: "Flagged Activities", value: "23", color: "#facc15" },
    { label: "Resolved Threats", value: "18", color: "#60a5fa" },
  ];
  return (
    <div className="space-y-6">
      <h2 style={{ color: "#fff", fontSize: 22, fontWeight: 700, margin: 0 }}>
        Security Control
      </h2>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3,1fr)",
          gap: 12,
        }}
      >
        {privacyStats.map((s) => (
          <div key={s.label} style={S.statCard}>
            <div style={{ fontSize: 24, fontWeight: 800, color: s.color }}>
              {s.value}
            </div>
            <div
              style={{
                color: "rgba(255,255,255,0.5)",
                fontSize: 11,
                marginTop: 2,
              }}
            >
              {s.label}
            </div>
          </div>
        ))}
      </div>
      <div style={S.card}>
        <div
          style={{
            color: "rgba(255,255,255,0.5)",
            fontSize: 12,
            textTransform: "uppercase",
            letterSpacing: 1,
            marginBottom: 12,
          }}
        >
          Suspicious Activity Log
        </div>
        {activities.map((a, idx) => (
          <div
            key={a.user + a.time}
            data-ocid={`admin.security.row.${idx + 1}`}
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "10px 0",
              borderBottom:
                idx < activities.length - 1
                  ? "1px solid rgba(255,255,255,0.06)"
                  : "none",
            }}
          >
            <div>
              <div
                style={{
                  color: a.risk === "High" ? "#f87171" : "#fff",
                  fontWeight: 600,
                  fontSize: 13,
                }}
              >
                {a.user}
              </div>
              <div style={{ color: "rgba(255,255,255,0.45)", fontSize: 12 }}>
                {a.activity}
              </div>
            </div>
            <div style={{ textAlign: "right" }}>
              <StatusBadge status={a.risk} />
              <div
                style={{
                  color: "rgba(255,255,255,0.3)",
                  fontSize: 11,
                  marginTop: 2,
                }}
              >
                {a.time}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Main Component ───────────────────────────────────────────────────────────
export default function AdminDashboardScreen() {
  const { logout } = useApp();
  const [activePanel, setActivePanel] = useState<PanelId>("analytics");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  function renderPanel() {
    switch (activePanel) {
      case "analytics":
        return <AnalyticsPanel />;
      case "users":
        return <UserManagementPanel />;
      case "sos":
        return <SOSPanel />;
      case "rides":
        return <RidePanel />;
      case "location":
        return <LiveLocationPanel />;
      case "files":
        return <FilesPanel />;
      case "ai-logs":
        return <AILogsPanel />;
      case "reports":
        return <ReportsPanel />;
      case "safemap":
        return <SafeMapPanel />;
      case "notifications":
        return <NotificationsPanel />;
      case "legal":
        return <LegalPanel />;
      case "security":
        return <SecurityPanel />;
      default:
        return <AnalyticsPanel />;
    }
  }

  const SidebarContent = () => (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      {/* Header */}
      <div
        style={{
          padding: "20px 16px",
          borderBottom: "1px solid rgba(155,39,175,0.2)",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            marginBottom: 14,
          }}
        >
          <div
            style={{
              background: "linear-gradient(135deg,#9b27af,#e91e8c)",
              borderRadius: 8,
              padding: 6,
              display: "flex",
            }}
          >
            <Shield size={18} color="#fff" />
          </div>
          <span
            style={{
              color: "#fff",
              fontWeight: 800,
              fontSize: 15,
              letterSpacing: 0.3,
            }}
          >
            SheShield Admin
          </span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div
            style={{
              width: 34,
              height: 34,
              borderRadius: "50%",
              background: "linear-gradient(135deg,#9b27af,#e91e8c)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: 800,
              color: "#fff",
              fontSize: 14,
            }}
          >
            A
          </div>
          <div>
            <div style={{ color: "#fff", fontWeight: 700, fontSize: 13 }}>
              ASUTOSH
            </div>
            <span
              style={{
                background: "rgba(155,39,175,0.3)",
                color: "#c084fc",
                borderRadius: 4,
                padding: "1px 7px",
                fontSize: 10,
                fontWeight: 700,
              }}
            >
              ADMIN
            </span>
          </div>
        </div>
      </div>
      {/* Nav Items */}
      <ScrollArea style={{ flex: 1 }}>
        <nav style={{ padding: "8px 8px" }}>
          {NAV_ITEMS.map((item) => (
            <button
              type="button"
              key={item.id}
              data-ocid={`admin.nav.${item.id}.button`}
              onClick={() => {
                setActivePanel(item.id);
                setSidebarOpen(false);
              }}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                width: "100%",
                padding: "9px 12px",
                borderRadius: 8,
                border: "none",
                cursor: "pointer",
                textAlign: "left",
                background:
                  activePanel === item.id
                    ? "rgba(155,39,175,0.25)"
                    : "transparent",
                color:
                  activePanel === item.id ? "#c084fc" : "rgba(255,255,255,0.6)",
                fontSize: 13,
                fontWeight: activePanel === item.id ? 700 : 500,
                marginBottom: 2,
                transition: "all 0.15s",
                borderLeft:
                  activePanel === item.id
                    ? "3px solid #9b27af"
                    : "3px solid transparent",
              }}
            >
              {item.icon}
              {item.label}
            </button>
          ))}
        </nav>
      </ScrollArea>
      {/* Logout */}
      <div
        style={{
          padding: "12px 8px",
          borderTop: "1px solid rgba(155,39,175,0.2)",
        }}
      >
        <button
          type="button"
          data-ocid="admin.logout.button"
          onClick={() => setShowLogoutConfirm(true)}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            width: "100%",
            padding: "10px 12px",
            borderRadius: 8,
            border: "none",
            background: "linear-gradient(135deg, #ef4444, #dc2626)",
            color: "#ffffff",
            fontSize: 13,
            fontWeight: 700,
            cursor: "pointer",
            boxShadow: "0 2px 8px rgba(239,68,68,0.4)",
          }}
        >
          <LogOut size={15} />
          Sign Out
        </button>
      </div>
    </div>
  );

  return (
    <div style={S.page}>
      {/* Desktop Sidebar */}
      <div style={{ ...S.sidebar, display: "flex" }} className="hidden md:flex">
        <SidebarContent />
      </div>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          style={{ position: "fixed", inset: 0, zIndex: 60, display: "flex" }}
          className="md:hidden"
        >
          <div
            onClick={() => setSidebarOpen(false)}
            onKeyDown={(e) => e.key === "Escape" && setSidebarOpen(false)}
            role="presentation"
            style={{
              position: "absolute",
              inset: 0,
              background: "rgba(0,0,0,0.7)",
            }}
          />
          <div style={{ ...S.sidebar, position: "relative", zIndex: 1 }}>
            <div style={{ position: "absolute", top: 12, right: 12 }}>
              <button
                type="button"
                onClick={() => setSidebarOpen(false)}
                style={{
                  background: "none",
                  border: "none",
                  color: "rgba(255,255,255,0.5)",
                  cursor: "pointer",
                }}
              >
                <X size={20} />
              </button>
            </div>
            <SidebarContent />
          </div>
        </div>
      )}

      {/* Main Content */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
        className="md:ml-[240px]"
      >
        {/* Top bar (mobile) */}
        <div
          style={{
            background: "#0f0f20",
            borderBottom: "1px solid rgba(155,39,175,0.2)",
            padding: "12px 16px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            position: "sticky",
            top: 0,
            zIndex: 40,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <button
              type="button"
              data-ocid="admin.sidebar.toggle"
              onClick={() => setSidebarOpen(true)}
              className="md:hidden"
              style={{
                background: "rgba(155,39,175,0.15)",
                border: "none",
                color: "#c084fc",
                borderRadius: 6,
                padding: 6,
                cursor: "pointer",
                display: "flex",
              }}
            >
              <Menu size={18} />
            </button>
            <div>
              <span style={{ color: "#fff", fontWeight: 700, fontSize: 15 }}>
                {NAV_ITEMS.find((n) => n.id === activePanel)?.label ??
                  "Dashboard"}
              </span>
              <div style={{ color: "rgba(255,255,255,0.35)", fontSize: 11 }}>
                SheShield Admin Panel
              </div>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <Badge
              style={{
                background: "rgba(155,39,175,0.2)",
                color: "#c084fc",
                borderColor: "rgba(155,39,175,0.3)",
                fontSize: 11,
              }}
            >
              v1.0
            </Badge>
            <button
              type="button"
              data-ocid="admin.appbar.logout.button"
              onClick={() => setShowLogoutConfirm(true)}
              title="Sign Out"
              style={{
                background: "rgba(239,68,68,0.15)",
                border: "1px solid rgba(239,68,68,0.3)",
                color: "#f87171",
                borderRadius: 8,
                padding: "6px 8px",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: 4,
                fontSize: 12,
                fontWeight: 600,
              }}
            >
              <LogOut size={14} />
              <span className="hidden sm:inline">Sign Out</span>
            </button>
          </div>
        </div>

        {/* Panel Content */}
        <ScrollArea style={{ flex: 1 }}>
          <div style={{ padding: "24px", maxWidth: 900 }}>{renderPanel()}</div>
          {/* Footer */}
          <div
            style={{
              textAlign: "center",
              padding: "16px",
              color: "rgba(255,255,255,0.2)",
              fontSize: 11,
              borderTop: "1px solid rgba(155,39,175,0.1)",
            }}
          >
            © {new Date().getFullYear()}. Built with love using{" "}
            <a
              href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
              target="_blank"
              rel="noreferrer"
              style={{ color: "rgba(155,39,175,0.5)" }}
            >
              caffeine.ai
            </a>
          </div>
        </ScrollArea>
      </div>

      {/* Logout Confirmation Dialog */}
      {showLogoutConfirm && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.8)",
            zIndex: 200,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 24,
          }}
        >
          <div
            style={{
              background: "linear-gradient(135deg, #1a1a2e, #16213e)",
              border: "1px solid rgba(155,39,175,0.4)",
              borderRadius: 16,
              padding: 28,
              maxWidth: 340,
              width: "100%",
              boxShadow: "0 20px 60px rgba(0,0,0,0.6)",
              textAlign: "center",
            }}
          >
            <div
              style={{
                width: 56,
                height: 56,
                borderRadius: "50%",
                background: "rgba(239,68,68,0.15)",
                border: "2px solid rgba(239,68,68,0.4)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 16px",
              }}
            >
              <LogOut size={24} style={{ color: "#f87171" }} />
            </div>
            <h3
              style={{
                color: "#ffffff",
                fontSize: 18,
                fontWeight: 700,
                marginBottom: 8,
              }}
            >
              Sign Out
            </h3>
            <p
              style={{
                color: "rgba(255,255,255,0.6)",
                fontSize: 14,
                marginBottom: 24,
                lineHeight: 1.5,
              }}
            >
              Are you sure you want to logout?
            </p>
            <div style={{ display: "flex", gap: 12 }}>
              <button
                type="button"
                data-ocid="admin.logout.cancel_button"
                onClick={() => setShowLogoutConfirm(false)}
                style={{
                  flex: 1,
                  padding: "10px 0",
                  borderRadius: 10,
                  border: "1px solid rgba(255,255,255,0.2)",
                  background: "rgba(255,255,255,0.05)",
                  color: "rgba(255,255,255,0.8)",
                  fontSize: 14,
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                Cancel
              </button>
              <button
                type="button"
                data-ocid="admin.logout.confirm_button"
                onClick={() => {
                  setShowLogoutConfirm(false);
                  logout();
                }}
                style={{
                  flex: 1,
                  padding: "10px 0",
                  borderRadius: 10,
                  border: "none",
                  background: "linear-gradient(135deg, #ef4444, #dc2626)",
                  color: "#ffffff",
                  fontSize: 14,
                  fontWeight: 700,
                  cursor: "pointer",
                  boxShadow: "0 4px 12px rgba(239,68,68,0.4)",
                }}
              >
                Yes, Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
