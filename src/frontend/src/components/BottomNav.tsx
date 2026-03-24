import { AlertOctagon, Bot, Car, Home, User } from "lucide-react";
import { useApp } from "../context/AppContext";
import { useOfflineMode } from "../hooks/useOfflineMode";
import type { Screen } from "../types/app";

const LEFT_ITEMS: { screen: Screen; icon: typeof Home; label: string }[] = [
  { screen: "home", icon: Home, label: "Home" },
  { screen: "chatbot", icon: Bot, label: "Sakhi AI" },
];

const RIGHT_ITEMS: { screen: Screen; icon: typeof Home; label: string }[] = [
  { screen: "scantaxi", icon: Car, label: "Scan Taxi" },
  { screen: "profile", icon: User, label: "Profile" },
];

export default function BottomNav() {
  const { screen, setScreen, emergencyActive } = useApp();
  const { isOnline } = useOfflineMode();

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 border-t flex items-stretch max-w-md mx-auto"
      style={{
        background: "oklch(1 0 0 / 0.97)",
        backdropFilter: "blur(16px)",
        borderColor: "oklch(0.88 0.005 265)",
        boxShadow: "0 -2px 12px oklch(0 0 0 / 0.06)",
      }}
    >
      <div className="flex-1 flex items-center justify-around">
        {LEFT_ITEMS.map((item) => (
          <NavBtn
            key={item.screen}
            item={item}
            current={screen}
            setScreen={setScreen}
          />
        ))}
      </div>

      <div className="flex-shrink-0 flex items-center justify-center px-2 py-2">
        <button
          type="button"
          data-ocid="nav.sos.button"
          onClick={() => setScreen(isOnline ? "emergency" : "offlinesos")}
          className="w-14 h-14 rounded-full flex flex-col items-center justify-center text-white shadow-lg transition-transform active:scale-90"
          style={{
            background: "linear-gradient(135deg, #e91e63, #9c27b0, #2196f3)",
            animation: emergencyActive
              ? "pulse-sos 1s ease-in-out infinite"
              : "pulse-sos 2.5s ease-in-out infinite",
          }}
        >
          <AlertOctagon className="w-5 h-5" />
          <span className="text-xs font-bold leading-none mt-0.5">SOS</span>
        </button>
      </div>

      <div className="flex-1 flex items-center justify-around">
        {RIGHT_ITEMS.map((item) => (
          <NavBtn
            key={item.screen}
            item={item}
            current={screen}
            setScreen={setScreen}
          />
        ))}
      </div>
    </nav>
  );
}

function NavBtn({
  item,
  current,
  setScreen,
}: {
  item: { screen: Screen; icon: typeof Home; label: string };
  current: Screen;
  setScreen: (s: Screen) => void;
}) {
  const active = current === item.screen;
  return (
    <button
      type="button"
      data-ocid={`nav.${item.screen}.link`}
      onClick={() => setScreen(item.screen)}
      className="flex flex-col items-center gap-0.5 p-2 rounded-xl transition-all min-w-[44px]"
      style={{
        color: active ? "oklch(0.58 0.25 340)" : "oklch(0.55 0.01 265)",
      }}
    >
      <item.icon className="w-5 h-5" />
      <span className="text-[10px] font-medium">{item.label}</span>
      {active && (
        <span
          className="w-1 h-1 rounded-full"
          style={{ background: "oklch(0.58 0.25 340)" }}
        />
      )}
    </button>
  );
}
