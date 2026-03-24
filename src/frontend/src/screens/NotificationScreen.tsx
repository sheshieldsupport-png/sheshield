import {
  ArrowLeft,
  Bell,
  MapPin,
  Shield,
  Smartphone,
  TriangleAlert,
} from "lucide-react";
import { motion } from "motion/react";
import { useEffect } from "react";
import { useApp } from "../context/AppContext";
import type { AppNotification } from "../types/app";

function NotifIcon({ type }: { type: AppNotification["type"] }) {
  if (type === "sos") {
    return (
      <div
        className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
        style={{ background: "oklch(0.50 0.22 25 / 0.15)" }}
      >
        <TriangleAlert
          className="w-5 h-5"
          style={{ color: "oklch(0.55 0.22 25)" }}
        />
      </div>
    );
  }
  if (type === "location") {
    return (
      <div
        className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
        style={{ background: "oklch(0.55 0.18 145 / 0.15)" }}
      >
        <MapPin className="w-5 h-5" style={{ color: "oklch(0.50 0.18 145)" }} />
      </div>
    );
  }
  if (type === "alert") {
    return (
      <div
        className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
        style={{ background: "oklch(0.55 0.17 300 / 0.15)" }}
      >
        <Shield className="w-5 h-5" style={{ color: "oklch(0.50 0.17 300)" }} />
      </div>
    );
  }
  return (
    <div
      className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
      style={{ background: "oklch(0.60 0.15 250 / 0.15)" }}
    >
      <Smartphone
        className="w-5 h-5"
        style={{ color: "oklch(0.55 0.15 250)" }}
      />
    </div>
  );
}

export default function NotificationScreen() {
  const { setScreen, notifications, markAllNotificationsRead } = useApp();

  useEffect(() => {
    markAllNotificationsRead();
  }, [markAllNotificationsRead]);

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ background: "oklch(0.97 0.003 265)" }}
    >
      <div
        className="sticky top-0 z-40 flex items-center gap-3 px-4 py-3"
        style={{
          background: "oklch(1 0 0 / 0.96)",
          backdropFilter: "blur(12px)",
          borderBottom: "1px solid oklch(0.88 0.005 265)",
          boxShadow: "0 1px 4px oklch(0 0 0 / 0.06)",
        }}
      >
        <button
          type="button"
          data-ocid="notifications.back.button"
          onClick={() => setScreen("home")}
          className="w-9 h-9 rounded-full flex items-center justify-center transition-all active:scale-95"
          style={{ background: "oklch(0.94 0.005 265)" }}
        >
          <ArrowLeft
            className="w-4 h-4"
            style={{ color: "oklch(0.30 0.01 265)" }}
          />
        </button>
        <h1 className="font-display font-bold text-lg text-foreground flex-1">
          Notifications
        </h1>
        <Bell className="w-5 h-5" style={{ color: "oklch(0.58 0.25 340)" }} />
      </div>

      <main className="flex-1 px-4 py-4 pb-28">
        {notifications.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="flex flex-col items-center justify-center py-24 text-center"
            data-ocid="notifications.empty_state"
          >
            <div
              className="w-20 h-20 rounded-full flex items-center justify-center mb-5"
              style={{ background: "oklch(0.94 0.005 265)" }}
            >
              <Bell
                className="w-9 h-9"
                style={{ color: "oklch(0.70 0.01 265)" }}
              />
            </div>
            <p className="text-sm font-semibold text-foreground mb-2">
              No notifications
            </p>
            <p className="text-xs text-muted-foreground max-w-xs leading-relaxed">
              You&apos;ll see your notifications here when you receive them.
            </p>
          </motion.div>
        ) : (
          <div className="space-y-2" data-ocid="notifications.list">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-3">
              Recent
            </p>
            {notifications.map((notif, index) => (
              <motion.div
                key={notif.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.06 }}
                data-ocid={`notifications.item.${index + 1}`}
                className="flex items-start gap-3 rounded-2xl p-4 border relative overflow-hidden"
                style={{
                  background: notif.read
                    ? "oklch(1 0 0)"
                    : "oklch(0.99 0.006 320)",
                  borderColor: notif.read
                    ? "oklch(0.88 0.005 265)"
                    : "oklch(0.80 0.08 320 / 0.5)",
                  boxShadow: notif.read
                    ? "0 1px 4px oklch(0 0 0 / 0.04)"
                    : "0 2px 8px oklch(0.58 0.25 340 / 0.08)",
                }}
              >
                {!notif.read && (
                  <div
                    className="absolute left-0 top-0 bottom-0 w-1 rounded-l-2xl"
                    style={{
                      background:
                        "linear-gradient(180deg, oklch(0.58 0.25 340) 0%, oklch(0.50 0.20 295) 100%)",
                    }}
                  />
                )}
                <NotifIcon type={notif.type} />
                <div className="flex-1 min-w-0">
                  <p
                    className="text-sm leading-snug"
                    style={{
                      fontWeight: notif.read ? 400 : 600,
                      color: "oklch(0.15 0.01 265)",
                    }}
                  >
                    {notif.title}
                  </p>
                  <p
                    className="text-xs mt-1"
                    style={{ color: "oklch(0.60 0.01 265)" }}
                  >
                    {notif.time}
                  </p>
                </div>
                {!notif.read && (
                  <span
                    className="w-2 h-2 rounded-full flex-shrink-0 mt-1.5"
                    style={{ background: "oklch(0.58 0.25 340)" }}
                  />
                )}
              </motion.div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
