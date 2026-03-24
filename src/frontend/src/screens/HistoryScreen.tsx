import {
  AlertTriangle,
  ArrowLeft,
  Car,
  CheckCircle2,
  Home,
  MapPin,
} from "lucide-react";
import type { ReactElement } from "react";
import { useApp } from "../context/AppContext";

export default function HistoryScreen() {
  const { history, setScreen } = useApp();

  const typeIcon: Record<string, ReactElement> = {
    ride: <Car className="w-4 h-4" />,
    emergency: <AlertTriangle className="w-4 h-4" />,
    home_safety: <Home className="w-4 h-4" />,
    public_safety: <MapPin className="w-4 h-4" />,
  };

  const typeColor: Record<string, string> = {
    ride: "oklch(0.60 0.15 250)",
    emergency: "oklch(0.58 0.25 340)",
    home_safety: "oklch(0.55 0.18 145)",
    public_safety: "oklch(0.65 0.18 55)",
  };

  const statusStyle: Record<string, { bg: string; text: string }> = {
    completed: {
      bg: "oklch(0.55 0.18 145 / 0.12)",
      text: "oklch(0.45 0.16 145)",
    },
    resolved: {
      bg: "oklch(0.60 0.15 250 / 0.12)",
      text: "oklch(0.50 0.13 250)",
    },
    cancelled: { bg: "oklch(0.88 0.005 265)", text: "oklch(0.50 0.01 265)" },
  };

  return (
    <div className="flex flex-col gap-5 pb-4 animate-slide-up">
      <div className="flex items-center gap-3">
        <button
          type="button"
          data-ocid="history.back.button"
          onClick={() => setScreen("home")}
          className="p-2 rounded-lg hover:bg-muted transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h2 className="font-display text-xl font-bold">Safety History</h2>
          <p className="text-xs text-muted-foreground">
            {history.length} records
          </p>
        </div>
      </div>

      {history.length === 0 && (
        <div
          data-ocid="history.list.empty_state"
          className="text-center py-12 text-muted-foreground"
        >
          <CheckCircle2 className="w-10 h-10 mx-auto mb-3 opacity-20" />
          <p className="text-sm">No history yet.</p>
        </div>
      )}

      <div className="space-y-2" data-ocid="history.list">
        {history.map((item, i) => {
          const s = statusStyle[item.status];
          const color = typeColor[item.type];
          const bgWithAlpha = color.replace(")", " / 0.1)");
          return (
            <div
              key={item.id}
              data-ocid={`history.item.${i + 1}`}
              className="rounded-xl border p-4 flex gap-3"
              style={{
                background: "oklch(1 0 0)",
                borderColor: "oklch(0.88 0.005 265)",
                boxShadow: "0 1px 3px oklch(0 0 0 / 0.05)",
              }}
            >
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ background: bgWithAlpha }}
              >
                <span style={{ color }}>{typeIcon[item.type]}</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-foreground leading-tight">
                  {item.description}
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {item.date}
                </p>
                {item.location && (
                  <p className="text-xs text-muted-foreground">
                    {item.location}
                  </p>
                )}
              </div>
              <div
                className="text-xs font-medium px-2 py-1 rounded-lg self-start whitespace-nowrap"
                style={{ background: s.bg, color: s.text }}
              >
                {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
