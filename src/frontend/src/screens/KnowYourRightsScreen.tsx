import { ArrowLeft } from "lucide-react";
import { useApp } from "../context/AppContext";

const laws = [
  {
    section: "IPC Section 376",
    title: "Rape",
    searchQuery: "IPC Section 376 Rape details India",
    line1: "Forcefully sexual act bina consent ke karna serious crime hai.",
    line2: "Isme strict punishment hota hai (7 saal se life imprisonment).",
  },
  {
    section: "IPC Section 302",
    title: "Murder",
    searchQuery: "IPC Section 302 Murder details India",
    line1: "Kisi ki jaan lena sabse bada crime hai.",
    line2: "Isme life imprisonment ya death penalty ho sakti hai.",
  },
  {
    section: "IPC Section 364",
    title: "Kidnapping",
    searchQuery: "IPC Section 364 Kidnapping details India",
    line1: "Kisi ko zabardasti utha lena ya band karna illegal hai.",
    line2: "Ye serious crime hai aur heavy punishment hota hai.",
  },
  {
    section: "IPC Section 354",
    title: "Harassment",
    searchQuery: "IPC Section 354 Harassment women details India",
    line1: "Women ko touch ya disturb karna bina consent crime hai.",
    line2: "Isme jail aur fine dono ho sakta hai.",
  },
  {
    section: "IPC Section 307",
    title: "Attempt to Murder",
    searchQuery: "IPC Section 307 Attempt to Murder details India",
    line1: "Kisi ko maarne ki koshish karna bhi serious crime hai.",
    line2: "Chahe death na ho, phir bhi strict punishment milta hai.",
  },
  {
    section: "IPC Section 509",
    title: "Verbal Harassment",
    searchQuery: "IPC Section 509 Verbal Harassment details India",
    line1: "Gande comments, messages ya gestures illegal hai.",
    line2: "Online ya offline dono me punishment hota hai.",
  },
];

export default function KnowYourRightsScreen() {
  const { setScreen } = useApp();

  function handleCardClick(searchQuery: string) {
    const url = `https://www.google.com/search?q=${encodeURIComponent(searchQuery)}`;
    window.open(url, "_blank", "noopener,noreferrer");
  }

  return (
    <div className="flex flex-col gap-4 pb-6 animate-slide-up">
      <div
        className="rounded-2xl p-5"
        style={{
          background:
            "linear-gradient(135deg, oklch(0.40 0.20 295) 0%, oklch(0.58 0.25 340) 100%)",
        }}
      >
        <button
          type="button"
          onClick={() => setScreen("profile")}
          className="flex items-center gap-2 text-white/80 hover:text-white transition-colors mb-3"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="text-sm">Back to Profile</span>
        </button>
        <h1 className="font-display text-2xl font-bold text-white">
          Know Your Rights ⚖️
        </h1>
        <p className="text-white/75 text-sm mt-1">
          Important laws to protect yourself. Tap any card to learn more.
        </p>
      </div>

      <div className="flex flex-col gap-3">
        {laws.map((law) => (
          <button
            key={law.section}
            type="button"
            onClick={() => handleCardClick(law.searchQuery)}
            className="w-full text-left rounded-xl border overflow-hidden transition-all duration-200 active:scale-[0.98] hover:shadow-md group"
            style={{
              background: "oklch(1 0 0)",
              borderColor: "oklch(0.88 0.005 265)",
            }}
          >
            <div className="flex items-start gap-3 p-4">
              <div
                className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 text-xl"
                style={{
                  background:
                    "linear-gradient(135deg, oklch(0.93 0.06 295) 0%, oklch(0.95 0.05 340) 100%)",
                }}
              >
                ⚖️
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <span
                    className="text-xs font-semibold uppercase tracking-wide"
                    style={{ color: "oklch(0.50 0.22 295)" }}
                  >
                    {law.section}
                  </span>
                  <span
                    className="text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                    style={{ color: "oklch(0.60 0.15 250)" }}
                  >
                    Tap to learn more ↗
                  </span>
                </div>
                <p
                  className="font-semibold text-sm mt-0.5"
                  style={{ color: "oklch(0.20 0.01 265)" }}
                >
                  {law.title}
                </p>
                <p
                  className="text-xs mt-1 leading-relaxed"
                  style={{ color: "oklch(0.50 0.01 265)" }}
                >
                  {law.line1}
                </p>
                <p
                  className="text-xs mt-0.5 leading-relaxed"
                  style={{ color: "oklch(0.50 0.01 265)" }}
                >
                  {law.line2}
                </p>
              </div>
            </div>
            <div
              className="h-0.5 w-full opacity-0 group-hover:opacity-100 transition-opacity"
              style={{
                background:
                  "linear-gradient(90deg, oklch(0.58 0.25 340), oklch(0.40 0.20 295))",
              }}
            />
          </button>
        ))}
      </div>

      <p
        className="text-xs text-center"
        style={{ color: "oklch(0.60 0.01 265)" }}
      >
        Tap any card to view full details on Google
      </p>
    </div>
  );
}
