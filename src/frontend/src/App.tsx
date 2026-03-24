import { Toaster } from "@/components/ui/sonner";
import { Bell } from "lucide-react";
import { useEffect, useState } from "react";
import BottomNav from "./components/BottomNav";
import { AppProvider, useApp } from "./context/AppContext";
import ActiveRideScreen from "./screens/ActiveRideScreen";
import AdminDashboardScreen from "./screens/AdminDashboardScreen";
import AppearanceScreen from "./screens/AppearanceScreen";
import BookRideScreen from "./screens/BookRideScreen";
import ContactsScreen from "./screens/ContactsScreen";
import EmergencyScreen from "./screens/EmergencyScreen";
import FeedbackScreen from "./screens/FeedbackScreen";
import FilesHistoryScreen from "./screens/FilesHistoryScreen";
import ForgotPasswordScreen from "./screens/ForgotPasswordScreen";
import HistoryScreen from "./screens/HistoryScreen";
import HomeScreen from "./screens/HomeScreen";
import KnowYourRightsScreen from "./screens/KnowYourRightsScreen";
import LegalScreen from "./screens/LegalScreen";
import LocationShareScreen from "./screens/LocationShareScreen";
import LoginScreen from "./screens/LoginScreen";
import MediaHistoryScreen from "./screens/MediaHistoryScreen";
import NotificationScreen from "./screens/NotificationScreen";
import OfflineSOSScreen from "./screens/OfflineSOSScreen";
import PinLockScreen from "./screens/PinLockScreen";
import ProfileScreen from "./screens/ProfileScreen";
import PublicSafetyScreen from "./screens/PublicSafetyScreen";
import SafetyModeScreen from "./screens/SafetyModeScreen";
import SakhiAIScreen from "./screens/SakhiAIScreen";
import ScanTaxiScreen from "./screens/ScanTaxiScreen";
import SecurityScreen from "./screens/SecurityScreen";
import SignUpScreen from "./screens/SignUpScreen";
import WelcomeScreen from "./screens/WelcomeScreen";

type AuthScreen = "welcome" | "login" | "signup" | "forgotpassword";

function loadSecurityData() {
  try {
    const raw = localStorage.getItem("sheshield_security");
    if (!raw) return { pin: null as string | null, biometricEnabled: false };
    return JSON.parse(raw) as {
      pin: string | null;
      biometricEnabled: boolean;
      securityEnabled?: boolean;
    };
  } catch {
    return { pin: null as string | null, biometricEnabled: false };
  }
}

function AppShell() {
  const {
    screen,
    setScreen,
    authSession,
    isAdmin,
    unreadNotificationsCount,
    appearancePrefs,
  } = useApp();
  const [authScreen, setAuthScreen] = useState<AuthScreen>("welcome");
  const [pinUnlocked, setPinUnlocked] = useState(false);

  // Apply theme mode
  useEffect(() => {
    const root = document.documentElement;
    if (appearancePrefs.themeMode === "dark") {
      root.classList.add("dark");
    } else if (appearancePrefs.themeMode === "light") {
      root.classList.remove("dark");
    } else {
      // system
      const prefersDark = window.matchMedia(
        "(prefers-color-scheme: dark)",
      ).matches;
      if (prefersDark) {
        root.classList.add("dark");
      } else {
        root.classList.remove("dark");
      }
    }
  }, [appearancePrefs.themeMode]);

  const fontScale =
    appearancePrefs.fontSize === "small"
      ? 0.875
      : appearancePrefs.fontSize === "large"
        ? 1.125
        : 1;

  const rootClasses = [
    !appearancePrefs.animationsEnabled ? "no-animations" : "",
    !appearancePrefs.roundedCorners ? "rounded-none-override" : "",
    appearancePrefs.layoutStyle === "compact" ? "layout-compact" : "",
  ]
    .filter(Boolean)
    .join(" ");

  // Check if PIN lock is required on app open
  const secData = loadSecurityData();
  const requiresPinLock =
    authSession &&
    !!secData.pin &&
    secData.securityEnabled !== false &&
    !pinUnlocked;

  if (!authSession) {
    if (authScreen === "forgotpassword") {
      return (
        <ForgotPasswordScreen
          onBack={() => setAuthScreen("login")}
          onSuccess={() => setAuthScreen("login")}
        />
      );
    }
    if (authScreen === "login") {
      return (
        <LoginScreen
          onBack={() => setAuthScreen("welcome")}
          onSuccess={() => {}}
          onForgotPassword={() => setAuthScreen("forgotpassword")}
        />
      );
    }
    if (authScreen === "signup") {
      return (
        <SignUpScreen
          onBack={() => setAuthScreen("welcome")}
          onSuccess={() => {}}
        />
      );
    }
    return (
      <WelcomeScreen
        onLogin={() => setAuthScreen("login")}
        onSignUp={() => setAuthScreen("signup")}
      />
    );
  }

  // PIN lock screen (before any content is shown)
  if (requiresPinLock) {
    return (
      <>
        <PinLockScreen onUnlock={() => setPinUnlocked(true)} />
        <Toaster />
      </>
    );
  }

  // Admin dashboard — full screen, no nav
  if (authSession && isAdmin) {
    return (
      <>
        <AdminDashboardScreen />
        <Toaster />
      </>
    );
  }

  // Full-screen routes (no shared header/nav)
  if (screen === "notifications") {
    return (
      <div
        className={`max-w-md mx-auto relative ${rootClasses}`}
        style={{ minHeight: "100dvh", fontSize: `${fontScale}rem` }}
      >
        <NotificationScreen />
        <Toaster />
      </div>
    );
  }

  if (screen === "chatbot") {
    return (
      <div
        className={`max-w-md mx-auto relative ${rootClasses}`}
        style={{
          height: "100dvh",
          overflow: "hidden",
          fontSize: `${fontScale}rem`,
        }}
      >
        <SakhiAIScreen />
        <Toaster />
      </div>
    );
  }

  if (screen === "scantaxi") {
    return (
      <div
        className={`max-w-md mx-auto relative ${rootClasses}`}
        style={{
          height: "100dvh",
          overflow: "hidden",
          fontSize: `${fontScale}rem`,
        }}
      >
        <ScanTaxiScreen />
        <Toaster />
      </div>
    );
  }

  if (screen === "fileshistory") {
    return (
      <div
        className={`max-w-md mx-auto relative ${rootClasses}`}
        style={{
          minHeight: "100dvh",
          overflow: "auto",
          fontSize: `${fontScale}rem`,
        }}
      >
        <FilesHistoryScreen />
        <Toaster />
      </div>
    );
  }

  if (screen === "offlinesos") {
    return (
      <div
        className={`max-w-md mx-auto relative ${rootClasses}`}
        style={{
          minHeight: "100dvh",
          overflow: "auto",
          fontSize: `${fontScale}rem`,
        }}
      >
        <OfflineSOSScreen onBack={() => setScreen("home")} />
        <Toaster />
      </div>
    );
  }

  if (screen === "security") {
    return (
      <div
        className={`max-w-md mx-auto relative ${rootClasses}`}
        style={{ minHeight: "100dvh", fontSize: `${fontScale}rem` }}
      >
        <SecurityScreen />
        <Toaster />
      </div>
    );
  }

  if (screen === "appearance") {
    return (
      <div
        className={`max-w-md mx-auto relative ${rootClasses}`}
        style={{ minHeight: "100dvh", fontSize: `${fontScale}rem` }}
      >
        <AppearanceScreen />
        <Toaster />
      </div>
    );
  }

  if (screen === "legal") {
    return (
      <div
        className={`max-w-md mx-auto relative ${rootClasses}`}
        style={{ minHeight: "100dvh", fontSize: `${fontScale}rem` }}
      >
        <LegalScreen />
        <Toaster />
      </div>
    );
  }

  if (screen === "mediahistory") {
    return (
      <div
        className={`max-w-md mx-auto relative ${rootClasses}`}
        style={{ minHeight: "100dvh", fontSize: `${fontScale}rem` }}
      >
        <MediaHistoryScreen />
        <Toaster />
      </div>
    );
  }

  const renderScreen = () => {
    switch (screen) {
      case "home":
        return <HomeScreen />;
      case "book":
        return <BookRideScreen />;
      case "active":
        return <ActiveRideScreen />;
      case "emergency":
        return <EmergencyScreen />;
      case "contacts":
        return <ContactsScreen />;
      case "history":
        return <HistoryScreen />;
      case "safety":
        return <SafetyModeScreen />;
      case "profile":
        return <ProfileScreen />;
      case "location":
        return <LocationShareScreen />;
      case "feedback":
        return <FeedbackScreen />;
      case "rights":
        return <KnowYourRightsScreen />;
      case "publicsafety":
        return <PublicSafetyScreen />;
      default:
        return <HomeScreen />;
    }
  };

  return (
    <div
      className={`min-h-screen ${rootClasses}`}
      style={{
        background: "oklch(0.97 0.003 265)",
        fontSize: `${fontScale}rem`,
      }}
    >
      <div className="max-w-md mx-auto relative">
        <div
          className="sticky top-0 z-40 flex items-center justify-between px-5 py-2.5 text-xs"
          style={{
            background: "oklch(1 0 0 / 0.95)",
            backdropFilter: "blur(12px)",
            borderBottom: "1px solid oklch(0.88 0.005 265)",
            boxShadow: "0 1px 4px oklch(0 0 0 / 0.06)",
          }}
        >
          <span
            className="font-bold font-display text-sm"
            style={{ color: "oklch(0.50 0.22 22)" }}
          >
            SheShield
          </span>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              <span className="text-muted-foreground text-xs">GPS</span>
              <span
                className="w-1.5 h-1.5 rounded-full animate-pulse"
                style={{ background: "oklch(0.55 0.18 145)" }}
              />
            </div>
            {/* Bell icon with badge */}
            <button
              type="button"
              data-ocid="home.notifications.button"
              onClick={() => setScreen("notifications")}
              className="relative w-8 h-8 rounded-full flex items-center justify-center transition-all active:scale-90 hover:bg-black/5"
              aria-label="Notifications"
            >
              <Bell
                className="w-4.5 h-4.5"
                style={{ color: "oklch(0.35 0.01 265)" }}
              />
              {unreadNotificationsCount > 0 && (
                <span
                  className="absolute top-1 right-1 w-2 h-2 rounded-full border border-white"
                  style={{ background: "oklch(0.55 0.22 25)" }}
                />
              )}
            </button>
          </div>
        </div>
        <main className="px-4 pt-4 pb-28">{renderScreen()}</main>
        <BottomNav />
      </div>
      <Toaster />
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppShell />
    </AppProvider>
  );
}
