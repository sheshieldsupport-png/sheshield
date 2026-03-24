import {
  type ReactNode,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import type {
  AppNotification,
  AppearancePrefs,
  EmergencyContact,
  HistoryItem,
  Ride,
  Screen,
  UserProfile,
} from "../types/app";

interface GeoCoords {
  lat: number;
  lng: number;
}

interface SpeechRecognitionLike {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  onstart: (() => void) | null;
  onend: (() => void) | null;
  onerror: (() => void) | null;
  onresult:
    | ((event: {
        resultIndex: number;
        results: {
          length: number;
          [i: number]: {
            [j: number]: { transcript: string; confidence: number };
          };
        };
      }) => void)
    | null;
  start(): void;
  stop(): void;
}

interface BluetoothDeviceLike {
  name?: string;
  gatt?: {
    connected: boolean;
    connect(): Promise<BluetoothGATTServerLike>;
    disconnect(): void;
  };
  addEventListener(type: string, listener: () => void): void;
}

interface BluetoothGATTServerLike {
  getPrimaryService(service: string): Promise<BluetoothGATTServiceLike>;
}

interface BluetoothGATTServiceLike {
  getCharacteristic(char: string): Promise<BluetoothCharacteristicLike>;
}

interface BluetoothCharacteristicLike {
  value?: DataView;
  startNotifications(): Promise<void>;
  addEventListener(type: string, listener: (event: Event) => void): void;
}

export interface AuthCredentials {
  username: string;
  name: string;
  phone: string;
  password: string;
}

export type LoginResult =
  | "invalid_phone"
  | "invalid_username"
  | "invalid_password"
  | "success"
  | "admin_success";

const DEFAULT_APPEARANCE: AppearancePrefs = {
  themeMode: "system",
  accentColor: "pink",
  fontSize: "medium",
  roundedCorners: true,
  layoutStyle: "comfortable",
  animationsEnabled: true,
};

function loadAppearancePrefs(): AppearancePrefs {
  try {
    const raw = localStorage.getItem("sheshield_appearance");
    return raw
      ? { ...DEFAULT_APPEARANCE, ...JSON.parse(raw) }
      : DEFAULT_APPEARANCE;
  } catch {
    return DEFAULT_APPEARANCE;
  }
}

interface AppContextType {
  screen: Screen;
  setScreen: (s: Screen) => void;
  activeRide: Ride | null;
  setActiveRide: (r: Ride | null) => void;
  emergencyActive: boolean;
  setEmergencyActive: (v: boolean) => void;
  contacts: EmergencyContact[];
  setContacts: (c: EmergencyContact[]) => void;
  history: HistoryItem[];
  setHistory: (h: HistoryItem[]) => void;
  addHistory: (item: HistoryItem) => void;
  userProfile: UserProfile | null;
  setUserProfile: (p: UserProfile | null) => void;
  currentLocation: GeoCoords | null;
  setCurrentLocation: (l: GeoCoords | null) => void;
  isLiveTracking: boolean;
  locationAccuracy: number | null;
  locationError: string | null;
  retryGPS: () => void;
  // Auth
  authSession: boolean;
  authCredentials: AuthCredentials | null;
  isAdmin: boolean;
  login: (phone: string, username: string, password: string) => LoginResult;
  logout: () => void;
  resetPassword: (phone: string, newPassword: string) => void;
  signUp: (
    username: string,
    name: string,
    phone: string,
    password: string,
  ) => void;
  // Voice detection
  voiceDetectionEnabled: boolean;
  setVoiceDetectionEnabled: (v: boolean) => void;
  voiceDetectionActive: boolean;
  voiceSupported: boolean;
  lastVoiceAlert: string | null;
  voiceKeywordLog: string[];
  clearVoiceLog: () => void;
  // Bluetooth heart rate
  heartRate: number | null;
  bluetoothConnected: boolean;
  bluetoothDeviceName: string | null;
  connectBluetooth: () => Promise<void>;
  disconnectBluetooth: () => void;
  // Notifications
  notifications: AppNotification[];
  unreadNotificationsCount: number;
  markAllNotificationsRead: () => void;
  // Appearance
  appearancePrefs: AppearancePrefs;
  setAppearancePrefs: (prefs: AppearancePrefs) => void;
  blobUrlMap: Map<string, string>;
}

const AppContext = createContext<AppContextType | null>(null);

const mockContacts: EmergencyContact[] = [
  {
    id: "1",
    name: "Priya Sharma",
    phone: "9876500001",
    relationship: "Family",
  },
  { id: "2", name: "Amit Kumar", phone: "9876500002", relationship: "Friend" },
];

const mockHistory: HistoryItem[] = [
  {
    id: "h1",
    date: "Mar 14, 2026 • 09:22 AM",
    type: "ride",
    description: "Auto Ride — Station Rd → Gandhi Market",
    status: "completed",
    location: "Berhampur, Odisha",
  },
  {
    id: "h2",
    date: "Mar 12, 2026 • 07:45 PM",
    type: "emergency",
    description: "SOS Alert — Ride with Rajesh Kumar",
    status: "resolved",
    location: "NH-16, Berhampur",
  },
  {
    id: "h3",
    date: "Mar 10, 2026 • 02:10 PM",
    type: "ride",
    description: "Taxi Ride — Home → City Mall",
    status: "completed",
    location: "Berhampur, Odisha",
  },
  {
    id: "h4",
    date: "Mar 08, 2026 • 11:30 AM",
    type: "ride",
    description: "Bike Ride — College → Bus Stand",
    status: "completed",
    location: "Berhampur, Odisha",
  },
];

const initialNotifications: AppNotification[] = [
  {
    id: "n1",
    title: "SOS alert sent successfully",
    time: "2 minutes ago",
    read: false,
    type: "sos",
  },
  {
    id: "n2",
    title: "Live location shared with emergency contacts",
    time: "30 minutes ago",
    read: false,
    type: "location",
  },
  {
    id: "n3",
    title: "Safety alert: Stay safe in your area",
    time: "1 hour ago",
    read: false,
    type: "alert",
  },
  {
    id: "n4",
    title: "App updated to latest version",
    time: "2 hours ago",
    read: true,
    type: "update",
  },
];

function loadCredentials(): AuthCredentials | null {
  try {
    const raw = localStorage.getItem("sheshield_credentials");
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function loadSession(): boolean {
  return localStorage.getItem("sheshield_session") === "true";
}

const DISTRESS_KEYWORDS = [
  // English
  "help",
  "help me",
  "save me",
  "emergency",
  "danger",
  "sos",
  "police",
  "fire",
  "attack",
  // Hindi
  "bachao",
  "bacho",
  "madad",
  "madad karo",
  "madad karo mujhe",
  "chillao",
  "chhod do",
  "chodo",
  "chhodo",
  "police bulao",
  "police ko bulao",
  "bachane wala",
  "koi hai",
  "mujhe bachao",
  "mujhe chod do",
];

function getSpeechRecognitionClass(): (new () => SpeechRecognitionLike) | null {
  const w = window as unknown as Record<string, unknown>;
  const SR = (w.SpeechRecognition ?? w.webkitSpeechRecognition) as
    | (new () => SpeechRecognitionLike)
    | undefined;
  return SR ?? null;
}

function getBluetoothAPI(): {
  requestDevice: (opts: object) => Promise<BluetoothDeviceLike>;
} | null {
  const nav = navigator as unknown as Record<string, unknown>;
  return (
    (nav.bluetooth as
      | { requestDevice: (opts: object) => Promise<BluetoothDeviceLike> }
      | undefined) ?? null
  );
}

function getGPSErrorMessage(code: number): string {
  switch (code) {
    case 1:
      return "Location permission denied. Please allow location access in your browser settings.";
    case 2:
      return "GPS signal unavailable. Please check your device location settings.";
    case 3:
      return "GPS request timed out. Please try again.";
    default:
      return "Unable to get GPS location.";
  }
}

export function AppProvider({ children }: { children: ReactNode }) {
  const storedCreds = loadCredentials();
  const storedSession = loadSession();

  const [screen, setScreen] = useState<Screen>("home");
  const [activeRide, setActiveRide] = useState<Ride | null>(null);
  const [emergencyActive, setEmergencyActive] = useState(false);
  const [contacts, setContacts] = useState<EmergencyContact[]>(mockContacts);
  const [history, setHistory] = useState<HistoryItem[]>(mockHistory);
  const [authCredentials, setAuthCredentials] =
    useState<AuthCredentials | null>(storedCreds);
  const [authSession, setAuthSession] = useState<boolean>(
    storedSession && !!storedCreds,
  );
  const [isAdmin, setIsAdmin] = useState<boolean>(
    localStorage.getItem("sheshield_admin") === "true",
  );

  const initialProfile =
    storedSession && storedCreds
      ? { name: storedCreds.name, phone: storedCreds.phone, verified: true }
      : null;

  const [userProfile, setUserProfileState] = useState<{
    name: string;
    phone: string;
    verified: boolean;
  } | null>(initialProfile);

  const [currentLocation, setCurrentLocation] = useState<GeoCoords | null>(
    null,
  );
  const [isLiveTracking, setIsLiveTracking] = useState(false);
  const [locationAccuracy, setLocationAccuracy] = useState<number | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);
  const watchIdRef = useRef<number | null>(null);
  const [gpsRetryKey, setGpsRetryKey] = useState(0);

  // Voice detection
  const [voiceDetectionEnabled, setVoiceDetectionEnabledState] =
    useState(false);
  const [voiceDetectionActive, setVoiceDetectionActive] = useState(false);
  const [voiceSupported, setVoiceSupported] = useState(false);
  const [lastVoiceAlert, setLastVoiceAlert] = useState<string | null>(null);
  const recognitionRef = useRef<SpeechRecognitionLike | null>(null);
  const recognitionRef2 = useRef<SpeechRecognitionLike | null>(null);
  const shouldListenRef = useRef(false);
  const retryDelayRef = useRef(1000);
  const retryDelayRef2 = useRef(1000);
  const [voiceKeywordLog, setVoiceKeywordLog] = useState<string[]>([]);

  // Bluetooth heart rate
  const [heartRate, setHeartRate] = useState<number | null>(null);
  const [bluetoothConnected, setBluetoothConnected] = useState(false);
  const [bluetoothDeviceName, setBluetoothDeviceName] = useState<string | null>(
    null,
  );
  const bluetoothDeviceRef = useRef<BluetoothDeviceLike | null>(null);

  // Notifications
  const [notifications, setNotifications] =
    useState<AppNotification[]>(initialNotifications);

  const unreadNotificationsCount = notifications.filter((n) => !n.read).length;

  const markAllNotificationsRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  }, []);

  // Blob URL map for media recordings
  const blobUrlMap = useRef<Map<string, string>>(new Map()).current;

  // Appearance
  const [appearancePrefs, setAppearancePrefsState] =
    useState<AppearancePrefs>(loadAppearancePrefs);

  function setAppearancePrefs(prefs: AppearancePrefs) {
    setAppearancePrefsState(prefs);
    localStorage.setItem("sheshield_appearance", JSON.stringify(prefs));
  }

  // biome-ignore lint/correctness/useExhaustiveDependencies: gpsRetryKey intentionally triggers GPS restart
  useEffect(() => {
    if (!navigator.geolocation) {
      setLocationError("Geolocation is not supported by your browser.");
      return;
    }

    setLocationError(null);

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setCurrentLocation({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        });
        setLocationAccuracy(pos.coords.accuracy ?? null);
        setIsLiveTracking(true);
        setLocationError(null);
      },
      (err) => {
        setLocationError(getGPSErrorMessage(err.code));
        setIsLiveTracking(false);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 },
    );

    const watchId = navigator.geolocation.watchPosition(
      (pos) => {
        setCurrentLocation({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        });
        setLocationAccuracy(pos.coords.accuracy ?? null);
        setIsLiveTracking(true);
        setLocationError(null);
      },
      (err) => {
        setIsLiveTracking(false);
        setLocationError(getGPSErrorMessage(err.code));
      },
      { enableHighAccuracy: true, timeout: 20000, maximumAge: 3000 },
    );
    watchIdRef.current = watchId;
    return () => {
      navigator.geolocation.clearWatch(watchId);
    };
  }, [gpsRetryKey]);

  function retryGPS() {
    setCurrentLocation(null);
    setIsLiveTracking(false);
    setLocationError(null);
    setLocationAccuracy(null);
    if (watchIdRef.current !== null) {
      navigator.geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
    }
    setGpsRetryKey((k) => k + 1);
  }

  useEffect(() => {
    setVoiceSupported(!!getSpeechRecognitionClass());
  }, []);

  useEffect(() => {
    const SR = getSpeechRecognitionClass();
    if (!SR || !voiceDetectionEnabled) {
      shouldListenRef.current = false;
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch {
          /* ignore */
        }
        recognitionRef.current = null;
      }
      if (recognitionRef2.current) {
        try {
          recognitionRef2.current.stop();
        } catch {
          /* ignore */
        }
        recognitionRef2.current = null;
      }
      setVoiceDetectionActive(false);
      return;
    }

    shouldListenRef.current = true;

    function handleResult(event: {
      resultIndex: number;
      results: {
        length: number;
        [i: number]: {
          [j: number]: { transcript: string; confidence: number };
        };
      };
    }) {
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const conf = event.results[i][0].confidence;
        // Skip very low confidence results (but allow 0 = interim)
        if (conf > 0 && conf < 0.25) continue;
        const transcript = event.results[i][0].transcript.toLowerCase().trim();
        if (!transcript) continue;
        // Log keyword attempts (cap at 3)
        setVoiceKeywordLog((prev) =>
          [transcript.slice(0, 30), ...prev].slice(0, 3),
        );
        const detected = DISTRESS_KEYWORDS.find((kw) =>
          transcript.includes(kw),
        );
        if (detected) {
          setLastVoiceAlert(`"${detected}" detected`);
          setEmergencyActive(true);
          setScreen("emergency");
          break;
        }
      }
    }

    // Primary instance: hi-IN (handles Hinglish well)
    const recognition = new SR();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "hi-IN";
    recognition.onstart = () => {
      retryDelayRef.current = 1000; // reset backoff on successful start
      setVoiceDetectionActive(true);
    };
    recognition.onend = () => {
      if (shouldListenRef.current) {
        try {
          recognition.start();
        } catch {
          /* ignore */
        }
      } else {
        setVoiceDetectionActive(false);
      }
    };
    recognition.onerror = () => {
      setVoiceDetectionActive(false);
      if (shouldListenRef.current) {
        const delay = retryDelayRef.current;
        retryDelayRef.current = Math.min(delay * 2, 8000);
        setTimeout(() => {
          if (shouldListenRef.current) {
            try {
              recognition.start();
            } catch {
              /* ignore */
            }
          }
        }, delay);
      }
    };
    recognition.onresult = handleResult;
    recognitionRef.current = recognition;
    try {
      recognition.start();
    } catch {
      /* ignore */
    }

    // Secondary instance: en-US for English keyword detection
    const recognition2 = new SR();
    recognition2.continuous = true;
    recognition2.interimResults = true;
    recognition2.lang = "en-US";
    recognition2.onstart = () => {
      retryDelayRef2.current = 1000;
    };
    recognition2.onend = () => {
      if (shouldListenRef.current) {
        try {
          recognition2.start();
        } catch {
          /* ignore */
        }
      }
    };
    recognition2.onerror = () => {
      if (shouldListenRef.current) {
        const delay = retryDelayRef2.current;
        retryDelayRef2.current = Math.min(delay * 2, 8000);
        setTimeout(() => {
          if (shouldListenRef.current) {
            try {
              recognition2.start();
            } catch {
              /* ignore */
            }
          }
        }, delay);
      }
    };
    recognition2.onresult = handleResult;
    recognitionRef2.current = recognition2;
    // Stagger second instance start slightly to avoid conflict
    setTimeout(() => {
      if (shouldListenRef.current) {
        try {
          recognition2.start();
        } catch {
          /* ignore */
        }
      }
    }, 300);

    return () => {
      shouldListenRef.current = false;
      try {
        recognition.stop();
      } catch {
        /* ignore */
      }
      try {
        recognition2.stop();
      } catch {
        /* ignore */
      }
      recognitionRef2.current = null;
      setVoiceDetectionActive(false);
    };
  }, [voiceDetectionEnabled]);

  async function connectBluetooth() {
    const bluetooth = getBluetoothAPI();
    if (!bluetooth) {
      alert(
        "Web Bluetooth is not supported in this browser. Try Chrome on Android/Desktop.",
      );
      return;
    }
    try {
      const device = await bluetooth.requestDevice({
        filters: [{ services: ["heart_rate"] }],
        optionalServices: ["heart_rate"],
      });
      bluetoothDeviceRef.current = device;
      setBluetoothDeviceName(device.name ?? "Unknown Watch");
      device.addEventListener("gattserverdisconnected", () => {
        setBluetoothConnected(false);
        setHeartRate(null);
        setBluetoothDeviceName(null);
      });
      const server = await device.gatt!.connect();
      const service = await server.getPrimaryService("heart_rate");
      const characteristic = await service.getCharacteristic(
        "heart_rate_measurement",
      );
      await characteristic.startNotifications();
      characteristic.addEventListener(
        "characteristicvaluechanged",
        (event: Event) => {
          const char = event.target as unknown as BluetoothCharacteristicLike;
          if (!char.value) return;
          const flags = char.value.getUint8(0);
          const rate16Bits = flags & 0x1;
          const hr = rate16Bits
            ? char.value.getUint16(1, true)
            : char.value.getUint8(1);
          setHeartRate(hr);
        },
      );
      setBluetoothConnected(true);
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      if (!msg.toLowerCase().includes("cancel")) {
        alert(`Bluetooth connection failed: ${msg}`);
      }
    }
  }

  function disconnectBluetooth() {
    if (bluetoothDeviceRef.current?.gatt?.connected) {
      bluetoothDeviceRef.current.gatt.disconnect();
    }
    setBluetoothConnected(false);
    setHeartRate(null);
    setBluetoothDeviceName(null);
  }

  function setUserProfile(p: UserProfile | null) {
    setUserProfileState(p);
  }

  function addHistory(item: HistoryItem) {
    setHistory((prev) => [item, ...prev]);
  }

  function setVoiceDetectionEnabled(v: boolean) {
    setVoiceDetectionEnabledState(v);
  }

  function clearVoiceLog() {
    setVoiceKeywordLog([]);
  }

  function login(
    phone: string,
    username: string,
    password: string,
  ): LoginResult {
    if (
      phone.replace(/^\+91/, "").trim() === "9861348969" &&
      username.trim() === "asutosh67" &&
      password === "123456"
    ) {
      localStorage.setItem("sheshield_session", "true");
      localStorage.setItem("sheshield_admin", "true");
      setAuthSession(true);
      setIsAdmin(true);
      setUserProfileState({
        name: "ASUTOSH",
        phone: "9861348969",
        verified: true,
      });
      return "admin_success";
    }

    const creds = loadCredentials();
    if (!creds) return "invalid_phone";

    if (creds.phone !== phone.replace(/^\+91/, "").trim())
      return "invalid_phone";
    if (creds.username !== username.trim()) return "invalid_username";
    if (creds.password !== password) return "invalid_password";

    localStorage.setItem("sheshield_session", "true");
    setAuthSession(true);
    setUserProfileState({
      name: creds.name,
      phone: creds.phone,
      verified: true,
    });
    return "success";
  }

  function logout() {
    localStorage.removeItem("sheshield_session");
    localStorage.removeItem("sheshield_admin");
    setAuthSession(false);
    setIsAdmin(false);
    setUserProfileState(null);
    setScreen("home");
    window.history.replaceState(null, "", window.location.href);
  }

  function resetPassword(phone: string, newPassword: string) {
    const creds = loadCredentials();
    if (creds && creds.phone === phone) {
      const updated = { ...creds, password: newPassword };
      localStorage.setItem("sheshield_credentials", JSON.stringify(updated));
      setAuthCredentials(updated);
    }
  }

  function signUp(
    username: string,
    name: string,
    phone: string,
    password: string,
  ) {
    const creds: AuthCredentials = { username, name, phone, password };
    localStorage.setItem("sheshield_credentials", JSON.stringify(creds));
    localStorage.setItem("sheshield_session", "true");
    setAuthCredentials(creds);
    setAuthSession(true);
    setUserProfileState({ name, phone, verified: true });
  }

  return (
    <AppContext.Provider
      value={{
        screen,
        setScreen,
        activeRide,
        setActiveRide,
        emergencyActive,
        setEmergencyActive,
        contacts,
        setContacts,
        history,
        setHistory,
        addHistory,
        userProfile,
        setUserProfile,
        currentLocation,
        setCurrentLocation,
        isLiveTracking,
        locationAccuracy,
        locationError,
        retryGPS,
        authSession,
        authCredentials,
        isAdmin,
        login,
        logout,
        signUp,
        resetPassword,
        voiceDetectionEnabled,
        setVoiceDetectionEnabled,
        voiceDetectionActive,
        voiceSupported,
        lastVoiceAlert,
        voiceKeywordLog,
        clearVoiceLog,
        heartRate,
        bluetoothConnected,
        bluetoothDeviceName,
        connectBluetooth,
        disconnectBluetooth,
        notifications,
        unreadNotificationsCount,
        markAllNotificationsRead,
        appearancePrefs,
        setAppearancePrefs,
        blobUrlMap,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}
