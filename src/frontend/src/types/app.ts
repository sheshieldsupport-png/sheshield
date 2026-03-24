export type Screen =
  | "home"
  | "book"
  | "active"
  | "emergency"
  | "contacts"
  | "history"
  | "safety"
  | "profile"
  | "location"
  | "feedback"
  | "rights"
  | "chatbot"
  | "scantaxi"
  | "fileshistory"
  | "fakecall"
  | "publicsafety"
  | "notifications"
  | "security"
  | "offlinesos"
  | "appearance"
  | "legal"
  | "mediahistory";

export type VehicleType = "taxi" | "bike" | "auto" | "car";

export interface UserProfile {
  name: string;
  phone: string;
  verified: boolean;
}

export interface Driver {
  name: string;
  phone: string;
  vehicle: string;
  vehicleType: VehicleType;
  rating: number;
  photo: string;
}

export interface Ride {
  id: string;
  driver: Driver;
  pickup: string;
  destination: string;
  startTime: Date;
  status: "active" | "completed" | "emergency";
}

export interface EmergencyContact {
  id: string;
  name: string;
  phone: string;
  relationship: "Family" | "Friend" | "Other";
}

export interface HistoryItem {
  id: string;
  date: string;
  type: "ride" | "emergency" | "home_safety" | "public_safety";
  description: string;
  status: "completed" | "resolved" | "cancelled";
  location?: string;
}

export interface AppNotification {
  id: string;
  title: string;
  time: string;
  read: boolean;
  type: "sos" | "location" | "alert" | "update";
}

export interface AppearancePrefs {
  themeMode: "light" | "dark" | "system";
  accentColor: "pink" | "blue" | "purple" | "red" | "green" | "orange";
  fontSize: "small" | "medium" | "large";
  roundedCorners: boolean;
  layoutStyle: "compact" | "comfortable";
  animationsEnabled: boolean;
}

export interface MediaItem {
  id: string;
  type: "video" | "photo" | "audio";
  timestamp: string;
  name: string;
  dataUrl?: string; // for photos
}
