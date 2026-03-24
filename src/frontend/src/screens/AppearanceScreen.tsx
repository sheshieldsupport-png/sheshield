import { Switch } from "@/components/ui/switch";
import {
  ArrowLeft,
  Layout,
  Monitor,
  Moon,
  Palette,
  Sun,
  Type,
  Zap,
} from "lucide-react";
import { useApp } from "../context/AppContext";
import type { AppearancePrefs } from "../types/app";

const ACCENT_COLORS: {
  key: AppearancePrefs["accentColor"];
  label: string;
  oklch: string;
}[] = [
  { key: "pink", label: "Pink", oklch: "oklch(0.58 0.25 340)" },
  { key: "blue", label: "Blue", oklch: "oklch(0.55 0.20 250)" },
  { key: "purple", label: "Purple", oklch: "oklch(0.50 0.22 295)" },
  { key: "red", label: "Red", oklch: "oklch(0.55 0.25 25)" },
  { key: "green", label: "Green", oklch: "oklch(0.55 0.18 145)" },
  { key: "orange", label: "Orange", oklch: "oklch(0.60 0.20 55)" },
];

function getAccentOklch(color: AppearancePrefs["accentColor"]): string {
  return (
    ACCENT_COLORS.find((c) => c.key === color)?.oklch ?? "oklch(0.58 0.25 340)"
  );
}

export default function AppearanceScreen() {
  const { setScreen, appearancePrefs, setAppearancePrefs } = useApp();

  function update<K extends keyof AppearancePrefs>(
    key: K,
    value: AppearancePrefs[K],
  ) {
    setAppearancePrefs({ ...appearancePrefs, [key]: value });
  }

  const accentOklch = getAccentOklch(appearancePrefs.accentColor);

  const pillBase =
    "px-4 py-2 rounded-full text-sm font-medium transition-all border cursor-pointer select-none";
  const pillSelected = "border-transparent text-white";
  const pillUnselected =
    "border-border text-muted-foreground hover:border-foreground/30";

  return (
    <div
      className="flex flex-col min-h-screen"
      style={{ background: "oklch(0.97 0.003 265)" }}
    >
      {/* Header */}
      <div
        className="sticky top-0 z-40 flex items-center gap-3 px-4 py-3"
        style={{
          background: "oklch(1 0 0 / 0.95)",
          backdropFilter: "blur(12px)",
          borderBottom: "1px solid oklch(0.88 0.005 265)",
          boxShadow: "0 1px 4px oklch(0 0 0 / 0.06)",
        }}
      >
        <button
          type="button"
          data-ocid="appearance.back.button"
          onClick={() => setScreen("profile")}
          className="w-9 h-9 rounded-full flex items-center justify-center hover:bg-muted transition-colors"
        >
          <ArrowLeft
            className="w-5 h-5"
            style={{ color: "oklch(0.35 0.01 265)" }}
          />
        </button>
        <div>
          <h1
            className="font-display font-bold text-base"
            style={{ color: "oklch(0.20 0.01 265)" }}
          >
            App Appearance
          </h1>
          <p className="text-xs text-muted-foreground">
            Customize look and feel
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-4 px-4 py-5 pb-10 max-w-md mx-auto w-full">
        {/* Hero card */}
        <div
          className="rounded-2xl p-5 flex items-center gap-4"
          style={{
            background: `linear-gradient(135deg, ${accentOklch} 0%, oklch(0.40 0.20 295) 100%)`,
          }}
        >
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center"
            style={{ background: "oklch(1 0 0 / 0.15)" }}
          >
            <Palette className="w-6 h-6 text-white" />
          </div>
          <div>
            <p className="text-white font-bold font-display text-lg">
              Personalize
            </p>
            <p className="text-white/80 text-sm">Changes apply instantly</p>
          </div>
        </div>

        {/* Section 1: Theme Mode */}
        <div
          className="rounded-xl border overflow-hidden"
          style={{
            background: "oklch(1 0 0)",
            borderColor: "oklch(0.88 0.005 265)",
          }}
        >
          <div
            className="flex items-center gap-3 px-4 py-3.5 border-b"
            style={{ borderColor: "oklch(0.88 0.005 265)" }}
          >
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ background: `${accentOklch}20` }}
            >
              {appearancePrefs.themeMode === "dark" ? (
                <Moon className="w-4 h-4" style={{ color: accentOklch }} />
              ) : appearancePrefs.themeMode === "light" ? (
                <Sun className="w-4 h-4" style={{ color: accentOklch }} />
              ) : (
                <Monitor className="w-4 h-4" style={{ color: accentOklch }} />
              )}
            </div>
            <p className="font-medium text-sm text-foreground">Theme Mode</p>
          </div>
          <div className="flex gap-2 px-4 py-3.5">
            {(["light", "dark", "system"] as const).map((mode) => (
              <button
                type="button"
                key={mode}
                data-ocid={`appearance.theme_${mode}.button`}
                onClick={() => update("themeMode", mode)}
                className={`${pillBase} flex-1 flex items-center justify-center gap-1.5 ${appearancePrefs.themeMode === mode ? pillSelected : pillUnselected}`}
                style={
                  appearancePrefs.themeMode === mode
                    ? { background: accentOklch }
                    : {}
                }
              >
                {mode === "light" && <Sun className="w-3.5 h-3.5" />}
                {mode === "dark" && <Moon className="w-3.5 h-3.5" />}
                {mode === "system" && <Monitor className="w-3.5 h-3.5" />}
                <span className="text-xs">
                  {mode === "system"
                    ? "Auto"
                    : mode.charAt(0).toUpperCase() + mode.slice(1)}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Section 2: Accent Color */}
        <div
          className="rounded-xl border overflow-hidden"
          style={{
            background: "oklch(1 0 0)",
            borderColor: "oklch(0.88 0.005 265)",
          }}
        >
          <div
            className="flex items-center gap-3 px-4 py-3.5 border-b"
            style={{ borderColor: "oklch(0.88 0.005 265)" }}
          >
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ background: `${accentOklch}20` }}
            >
              <Palette className="w-4 h-4" style={{ color: accentOklch }} />
            </div>
            <p className="font-medium text-sm text-foreground">Accent Color</p>
          </div>
          <div className="flex items-center gap-3 px-4 py-4">
            {ACCENT_COLORS.map((color) => (
              <button
                type="button"
                key={color.key}
                data-ocid={`appearance.accent_${color.key}.button`}
                onClick={() => update("accentColor", color.key)}
                aria-label={color.label}
                className="w-9 h-9 rounded-full transition-all flex items-center justify-center"
                style={{
                  background: color.oklch,
                  boxShadow:
                    appearancePrefs.accentColor === color.key
                      ? `0 0 0 3px white, 0 0 0 5px ${color.oklch}`
                      : "none",
                  transform:
                    appearancePrefs.accentColor === color.key
                      ? "scale(1.15)"
                      : "scale(1)",
                }}
              />
            ))}
          </div>
        </div>

        {/* Section 3: Font Settings */}
        <div
          className="rounded-xl border overflow-hidden"
          style={{
            background: "oklch(1 0 0)",
            borderColor: "oklch(0.88 0.005 265)",
          }}
        >
          <div
            className="flex items-center gap-3 px-4 py-3.5 border-b"
            style={{ borderColor: "oklch(0.88 0.005 265)" }}
          >
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ background: `${accentOklch}20` }}
            >
              <Type className="w-4 h-4" style={{ color: accentOklch }} />
            </div>
            <p className="font-medium text-sm text-foreground">Font Size</p>
          </div>
          <div className="flex gap-2 px-4 pt-3.5">
            {(["small", "medium", "large"] as const).map((size) => (
              <button
                type="button"
                key={size}
                data-ocid={`appearance.font_${size}.button`}
                onClick={() => update("fontSize", size)}
                className={`${pillBase} flex-1 text-center ${appearancePrefs.fontSize === size ? pillSelected : pillUnselected}`}
                style={
                  appearancePrefs.fontSize === size
                    ? { background: accentOklch }
                    : {}
                }
              >
                {size.charAt(0).toUpperCase() + size.slice(1)}
              </button>
            ))}
          </div>
          <div className="px-4 py-3">
            <p
              className="text-muted-foreground text-center rounded-lg py-2"
              style={{
                fontSize:
                  appearancePrefs.fontSize === "small"
                    ? "0.8rem"
                    : appearancePrefs.fontSize === "large"
                      ? "1.1rem"
                      : "0.925rem",
                background: "oklch(0.96 0.003 265)",
              }}
            >
              Preview text — Aa Bb Cc
            </p>
          </div>
        </div>

        {/* Section 4: UI Style */}
        <div
          className="rounded-xl border overflow-hidden"
          style={{
            background: "oklch(1 0 0)",
            borderColor: "oklch(0.88 0.005 265)",
          }}
        >
          <div
            className="flex items-center gap-3 px-4 py-3.5 border-b"
            style={{ borderColor: "oklch(0.88 0.005 265)" }}
          >
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ background: `${accentOklch}20` }}
            >
              <Layout className="w-4 h-4" style={{ color: accentOklch }} />
            </div>
            <p className="font-medium text-sm text-foreground">UI Style</p>
          </div>

          {/* Rounded corners toggle */}
          <div
            className="flex items-center gap-3 px-4 py-3.5 border-b"
            style={{ borderColor: "oklch(0.88 0.005 265)" }}
          >
            <div className="flex-1">
              <p className="text-sm font-medium text-foreground">
                Rounded Corners
              </p>
              <p className="text-xs text-muted-foreground">
                Softer, rounder card edges
              </p>
            </div>
            <Switch
              data-ocid="appearance.rounded_corners.switch"
              checked={appearancePrefs.roundedCorners}
              onCheckedChange={(val) => update("roundedCorners", val)}
            />
          </div>

          {/* Layout style */}
          <div className="px-4 pt-3 pb-3.5">
            <p className="text-xs text-muted-foreground mb-2">Layout Density</p>
            <div className="flex gap-2">
              {(["compact", "comfortable"] as const).map((ls) => (
                <button
                  type="button"
                  key={ls}
                  data-ocid={`appearance.layout_${ls}.button`}
                  onClick={() => update("layoutStyle", ls)}
                  className={`${pillBase} flex-1 text-center ${appearancePrefs.layoutStyle === ls ? pillSelected : pillUnselected}`}
                  style={
                    appearancePrefs.layoutStyle === ls
                      ? { background: accentOklch }
                      : {}
                  }
                >
                  {ls.charAt(0).toUpperCase() + ls.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Section 5: Animations */}
        <div
          className="rounded-xl border overflow-hidden"
          style={{
            background: "oklch(1 0 0)",
            borderColor: "oklch(0.88 0.005 265)",
          }}
        >
          <div
            className="flex items-center gap-3 px-4 py-3.5 border-b"
            style={{ borderColor: "oklch(0.88 0.005 265)" }}
          >
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ background: `${accentOklch}20` }}
            >
              <Zap className="w-4 h-4" style={{ color: accentOklch }} />
            </div>
            <p className="font-medium text-sm text-foreground">Animations</p>
          </div>
          <div className="flex items-center gap-3 px-4 py-4">
            <div className="flex-1">
              <p className="text-sm font-medium text-foreground">
                Enable Animations
              </p>
              <p className="text-xs text-muted-foreground">
                Smooth transitions and motion effects
              </p>
            </div>
            <Switch
              data-ocid="appearance.animations.switch"
              checked={appearancePrefs.animationsEnabled}
              onCheckedChange={(val) => update("animationsEnabled", val)}
            />
          </div>
        </div>

        <p className="text-xs text-muted-foreground text-center">
          Settings saved automatically
        </p>
      </div>
    </div>
  );
}
