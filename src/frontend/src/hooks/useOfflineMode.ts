import { useCallback, useEffect, useState } from "react";

export interface GeoCoords {
  lat: number;
  lng: number;
  accuracy?: number;
  timestamp?: number;
}

export interface OfflineAction {
  id: string;
  type: "sos" | "alert" | "log";
  timestamp: number;
  data: Record<string, unknown>;
  synced: boolean;
}

const LOCATION_KEY = "sheshield_last_location";
const QUEUE_KEY = "sheshield_offline_queue";

function loadLastLocation(): GeoCoords | null {
  try {
    const raw = localStorage.getItem(LOCATION_KEY);
    return raw ? (JSON.parse(raw) as GeoCoords) : null;
  } catch {
    return null;
  }
}

function loadQueue(): OfflineAction[] {
  try {
    const raw = localStorage.getItem(QUEUE_KEY);
    return raw ? (JSON.parse(raw) as OfflineAction[]) : [];
  } catch {
    return [];
  }
}

function saveQueue(queue: OfflineAction[]) {
  localStorage.setItem(QUEUE_KEY, JSON.stringify(queue));
}

export function useOfflineMode() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [lastKnownLocation, setLastKnownLocation] = useState<GeoCoords | null>(
    loadLastLocation,
  );
  const [offlineQueue, setOfflineQueue] = useState<OfflineAction[]>(loadQueue);

  // Network event listeners
  useEffect(() => {
    function handleOnline() {
      setIsOnline(true);
      syncOfflineData();
    }
    function handleOffline() {
      setIsOnline(false);
    }
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);
    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  // Watch geolocation and store last known
  useEffect(() => {
    if (!navigator.geolocation) return;
    const watchId = navigator.geolocation.watchPosition(
      (pos) => {
        const coords: GeoCoords = {
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
          accuracy: pos.coords.accuracy,
          timestamp: pos.timestamp,
        };
        setLastKnownLocation(coords);
        localStorage.setItem(LOCATION_KEY, JSON.stringify(coords));
      },
      () => {
        // Silently ignore errors; use cached location
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 30000 },
    );
    return () => navigator.geolocation.clearWatch(watchId);
  }, []);

  const addToOfflineQueue = useCallback(
    (action: Omit<OfflineAction, "id" | "synced">) => {
      const entry: OfflineAction = {
        ...action,
        id: `offline_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
        synced: false,
      };
      setOfflineQueue((prev) => {
        const updated = [...prev, entry];
        saveQueue(updated);
        return updated;
      });
      return entry;
    },
    [],
  );

  const syncOfflineData = useCallback(() => {
    setOfflineQueue((prev) => {
      const synced = prev.map((item) => ({ ...item, synced: true }));
      saveQueue(synced);
      // After marking synced, clear queue after a brief delay
      setTimeout(() => {
        saveQueue([]);
        setOfflineQueue([]);
      }, 3000);
      return synced;
    });
  }, []);

  return {
    isOnline,
    lastKnownLocation,
    offlineQueue,
    addToOfflineQueue,
    syncOfflineData,
  };
}
