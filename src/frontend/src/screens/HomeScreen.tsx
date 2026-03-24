import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import {
  Activity,
  Bluetooth,
  BluetoothOff,
  Camera,
  CheckCircle2,
  ChevronRight,
  Heart,
  MapPin,
  Mic,
  MicOff,
  Navigation,
  Phone,
  PhoneCall,
  ShieldCheck,
  Square,
  Video,
  X,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import OfflineBanner from "../components/OfflineBanner";
import { useApp } from "../context/AppContext";
import { useOfflineMode } from "../hooks/useOfflineMode";
import type { MediaItem } from "../types/app";

const STORAGE_KEY = "sheshield_media_history";

function loadMediaItems(): MediaItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as MediaItem[];
  } catch {
    return [];
  }
}

function saveMediaItems(items: MediaItem[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

function addMediaItem(item: MediaItem) {
  const current = loadMediaItems();
  saveMediaItems([item, ...current]);
}

const helplines = [
  {
    emoji: "🚨",
    label: "Emergency Helpline (All-in-One)",
    number: "112",
    desc: "Police + Fire + Ambulance (fast response)",
    primary: true,
  },
  {
    emoji: "👩",
    label: "Women Helpline (All India)",
    number: "1091",
    desc: "Direct women emergency helpline (police support)",
    primary: false,
  },
  {
    emoji: "👧",
    label: "Women Helpline (24x7 Support)",
    number: "181",
    desc: "Women distress helpline (state-wise active)",
    primary: false,
  },
  {
    emoji: "👶",
    label: "Child Helpline",
    number: "1098",
    desc: "Child safety & emergency",
    primary: false,
  },
  {
    emoji: "🚓",
    label: "Police Helpline",
    number: "100",
    desc: "Direct police control room",
    primary: false,
  },
  {
    emoji: "👮",
    label: "Odisha Police Emergency",
    number: "112",
    desc: "Best and fastest emergency response",
    primary: false,
    regional: true,
  },
  {
    emoji: "👩",
    label: "Women Helpline Odisha",
    number: "181",
    desc: "State-level women support",
    primary: false,
    regional: true,
  },
];

type RecordModal = "video" | "photo" | "audio" | null;
type PermissionState = "idle" | "requesting" | "denied" | "granted";

export default function HomeScreen() {
  const {
    setScreen,
    activeRide,
    userProfile,
    contacts,
    isLiveTracking,
    voiceDetectionEnabled,
    setVoiceDetectionEnabled,
    voiceDetectionActive,
    voiceSupported,
    lastVoiceAlert,
    voiceKeywordLog,
    heartRate,
    bluetoothConnected,
    bluetoothDeviceName,
    connectBluetooth,
    disconnectBluetooth,
    emergencyActive,
    blobUrlMap,
  } = useApp();

  const [showEmergencyCall, setShowEmergencyCall] = useState(false);
  const [tappedNumber, setTappedNumber] = useState<string | null>(null);

  // Record bottom sheet
  const [showRecordSheet, setShowRecordSheet] = useState(false);
  const [recordModal, setRecordModal] = useState<RecordModal>(null);

  // Permission state
  const [permState, setPermState] = useState<PermissionState>("idle");
  const [pendingModal, setPendingModal] = useState<RecordModal>(null);

  // Video recording state
  const videoPreviewRef = useRef<HTMLVideoElement | null>(null);
  const videoStreamRef = useRef<MediaStream | null>(null);
  const videoRecorderRef = useRef<MediaRecorder | null>(null);
  const videoChunksRef = useRef<Blob[]>([]);
  const [videoRecording, setVideoRecording] = useState(false);
  const [videoTimer, setVideoTimer] = useState(0);
  const videoTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Photo capture state
  const photoPreviewRef = useRef<HTMLVideoElement | null>(null);
  const photoStreamRef = useRef<MediaStream | null>(null);
  const [photoDataUrl, setPhotoDataUrl] = useState<string | null>(null);

  // Audio recording state
  const audioRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const [audioRecording, setAudioRecording] = useState(false);
  const [audioTimer, setAudioTimer] = useState(0);
  const audioTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // SOS auto-record
  const autoRecordRef = useRef<MediaRecorder | null>(null);
  const autoChunksRef = useRef<Blob[]>([]);
  const [autoRecordBanner, setAutoRecordBanner] = useState(false);

  const { isOnline } = useOfflineMode();

  // Voice alert display
  const [visibleVoiceAlert, setVisibleVoiceAlert] = useState<string | null>(
    null,
  );
  useEffect(() => {
    if (lastVoiceAlert) {
      setVisibleVoiceAlert(lastVoiceAlert);
      const t = setTimeout(() => setVisibleVoiceAlert(null), 5000);
      return () => clearTimeout(t);
    }
  }, [lastVoiceAlert]);

  const firstName = userProfile?.name.split(" ")[0] ?? "User";
  const heartAbnormal =
    heartRate !== null && (heartRate > 120 || heartRate < 50);

  // SOS auto video recording
  useEffect(() => {
    if (!emergencyActive) {
      // Stop auto recording if active
      if (autoRecordRef.current && autoRecordRef.current.state !== "inactive") {
        autoRecordRef.current.stop();
      }
      return;
    }
    // Start auto video recording on SOS
    (async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });
        const recorder = new MediaRecorder(stream);
        autoChunksRef.current = [];
        recorder.ondataavailable = (e) => {
          if (e.data.size > 0) autoChunksRef.current.push(e.data);
        };
        recorder.onstop = () => {
          const blob = new Blob(autoChunksRef.current, { type: "video/webm" });
          const id = `sos_video_${Date.now()}`;
          const blobUrl = URL.createObjectURL(blob);
          blobUrlMap?.set(id, blobUrl);
          const item: MediaItem = {
            id,
            type: "video",
            timestamp: new Date().toISOString(),
            name: `SOS Recording ${new Date().toLocaleTimeString()}`,
          };
          addMediaItem(item);
          stream.getTracks().map((t) => t.stop());
        };
        recorder.start();
        autoRecordRef.current = recorder;
        setAutoRecordBanner(true);
        setTimeout(() => setAutoRecordBanner(false), 4000);
      } catch {
        // Camera not available, silently fail
      }
    })();
  }, [emergencyActive, blobUrlMap]);

  function formatTime(seconds: number) {
    const m = Math.floor(seconds / 60)
      .toString()
      .padStart(2, "0");
    const s = (seconds % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  }

  // Request permission then open modal
  async function requestPermission(modal: RecordModal) {
    if (!modal) return;
    setShowRecordSheet(false);
    setPendingModal(modal);
    setPermState("requesting");
  }

  function handlePermAllow() {
    setPermState("granted");
    setRecordModal(pendingModal);
    setPendingModal(null);
  }

  function handlePermDeny() {
    setPermState("denied");
  }

  function closePermDialog() {
    setPermState("idle");
    setPendingModal(null);
  }

  // Start video stream
  useEffect(() => {
    if (recordModal === "video" || recordModal === "photo") {
      const ref = recordModal === "video" ? videoPreviewRef : photoPreviewRef;
      const streamRef =
        recordModal === "video" ? videoStreamRef : photoStreamRef;
      navigator.mediaDevices
        .getUserMedia({ video: true, audio: recordModal === "video" })
        .then((stream) => {
          streamRef.current = stream;
          if (ref.current) {
            ref.current.srcObject = stream;
          }
        })
        .catch(() => {
          toast.error("Camera access failed. Please check browser settings.");
          setRecordModal(null);
        });
      return () => {
        streamRef.current?.getTracks().map((t) => t.stop());
        streamRef.current = null;
      };
    }
  }, [recordModal]);

  // Video recording controls
  function startVideoRecording() {
    if (!videoStreamRef.current) return;
    videoChunksRef.current = [];
    const recorder = new MediaRecorder(videoStreamRef.current);
    recorder.ondataavailable = (e) => {
      if (e.data.size > 0) videoChunksRef.current.push(e.data);
    };
    recorder.onstop = () => {
      const blob = new Blob(videoChunksRef.current, { type: "video/webm" });
      const id = `video_${Date.now()}`;
      const blobUrl = URL.createObjectURL(blob);
      blobUrlMap?.set(id, blobUrl);
      const item: MediaItem = {
        id,
        type: "video",
        timestamp: new Date().toISOString(),
        name: `Video ${new Date().toLocaleTimeString()}`,
      };
      addMediaItem(item);
      toast.success("Video saved to Media History");
    };
    recorder.start();
    videoRecorderRef.current = recorder;
    setVideoRecording(true);
    setVideoTimer(0);
    videoTimerRef.current = setInterval(() => {
      setVideoTimer((t) => t + 1);
    }, 1000);
  }

  function stopVideoRecording() {
    videoRecorderRef.current?.stop();
    if (videoTimerRef.current) {
      clearInterval(videoTimerRef.current);
      videoTimerRef.current = null;
    }
    setVideoRecording(false);
  }

  function closeVideoModal() {
    if (videoRecording) stopVideoRecording();
    videoStreamRef.current?.getTracks().map((t) => t.stop());
    videoStreamRef.current = null;
    setRecordModal(null);
    setVideoTimer(0);
  }

  // Photo capture
  function capturePhoto() {
    if (!photoPreviewRef.current || !photoStreamRef.current) return;
    const canvas = document.createElement("canvas");
    canvas.width = photoPreviewRef.current.videoWidth || 640;
    canvas.height = photoPreviewRef.current.videoHeight || 480;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.drawImage(photoPreviewRef.current, 0, 0);
    const dataUrl = canvas.toDataURL("image/jpeg", 0.9);
    setPhotoDataUrl(dataUrl);
  }

  function savePhoto() {
    if (!photoDataUrl) return;
    const id = `photo_${Date.now()}`;
    const item: MediaItem = {
      id,
      type: "photo",
      timestamp: new Date().toISOString(),
      name: `Photo ${new Date().toLocaleTimeString()}`,
      dataUrl: photoDataUrl,
    };
    addMediaItem(item);
    toast.success("Photo saved to Media History");
    closePhotoModal();
  }

  function closePhotoModal() {
    photoStreamRef.current?.getTracks().map((t) => t.stop());
    photoStreamRef.current = null;
    setPhotoDataUrl(null);
    setRecordModal(null);
  }

  // Audio recording controls
  async function startAudioRecording() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioChunksRef.current = [];
      const recorder = new MediaRecorder(stream);
      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) audioChunksRef.current.push(e.data);
      };
      recorder.onstop = () => {
        const blob = new Blob(audioChunksRef.current, { type: "audio/webm" });
        const id = `audio_${Date.now()}`;
        const blobUrl = URL.createObjectURL(blob);
        blobUrlMap?.set(id, blobUrl);
        const item: MediaItem = {
          id,
          type: "audio",
          timestamp: new Date().toISOString(),
          name: `Audio ${new Date().toLocaleTimeString()}`,
        };
        addMediaItem(item);
        toast.success("Audio saved to Media History");
        stream.getTracks().map((t) => t.stop());
      };
      recorder.start();
      audioRecorderRef.current = recorder;
      setAudioRecording(true);
      setAudioTimer(0);
      audioTimerRef.current = setInterval(() => {
        setAudioTimer((t) => t + 1);
      }, 1000);
    } catch {
      toast.error("Microphone access failed.");
    }
  }

  function stopAudioRecording() {
    audioRecorderRef.current?.stop();
    if (audioTimerRef.current) {
      clearInterval(audioTimerRef.current);
      audioTimerRef.current = null;
    }
    setAudioRecording(false);
  }

  function closeAudioModal() {
    if (audioRecording) stopAudioRecording();
    setRecordModal(null);
    setAudioTimer(0);
  }

  const handleCall = (number: string) => {
    setTappedNumber(number);
    setTimeout(() => {
      window.location.href = `tel:${number}`;
      setTappedNumber(null);
    }, 150);
  };

  return (
    <div className="flex flex-col gap-4 pb-4 animate-slide-up">
      <OfflineBanner visible={!isOnline} />

      {/* Auto-record banner */}
      {autoRecordBanner && (
        <div
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl"
          style={{
            background: "oklch(0.50 0.22 25 / 0.12)",
            border: "1px solid oklch(0.50 0.22 25 / 0.3)",
          }}
        >
          <span
            className="w-2.5 h-2.5 rounded-full animate-pulse"
            style={{ background: "oklch(0.50 0.22 25)" }}
          />
          <span
            className="text-xs font-semibold"
            style={{ color: "oklch(0.50 0.22 25)" }}
          >
            Auto-recording started
          </span>
        </div>
      )}

      {/* Hero */}
      <div
        className="relative overflow-hidden rounded-2xl p-6"
        style={{
          background:
            "linear-gradient(135deg, oklch(0.58 0.25 340) 0%, oklch(0.40 0.20 295) 100%)",
        }}
      >
        <div
          className="absolute -top-6 -right-6 w-32 h-32 rounded-full opacity-20"
          style={{ background: "white" }}
        />
        <div
          className="absolute -bottom-4 -left-4 w-20 h-20 rounded-full opacity-10"
          style={{ background: "white" }}
        />
        <div className="relative flex items-center gap-4">
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0"
            style={{ background: "oklch(1 0 0 / 0.2)" }}
          >
            <img
              src="/assets/uploads/ChatGPT-Image-Mar-20-2026-06_43_53-PM-1.png"
              alt="SheShield"
              className="w-10 h-10 object-contain rounded-full"
            />
          </div>
          <div>
            <h1 className="font-display text-2xl font-bold text-white leading-tight">
              Hi, {firstName}!
            </h1>
            <p className="text-red-100 text-sm mt-0.5 flex items-center gap-1.5">
              SheShield
              {userProfile?.verified && (
                <span className="inline-flex items-center gap-0.5 text-xs font-medium text-white">
                  <CheckCircle2 className="w-3 h-3" /> Verified
                </span>
              )}
            </p>
          </div>
        </div>
        <div className="mt-4 flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-white animate-pulse" />
          <span className="text-xs text-white font-medium">
            Safety System Active
          </span>
          <Badge
            className="ml-auto text-xs"
            style={{
              background: "oklch(1 0 0 / 0.2)",
              color: "white",
              border: "1px solid oklch(1 0 0 / 0.3)",
            }}
          >
            v2.6
          </Badge>
        </div>
      </div>

      {/* Active ride banner */}
      {activeRide && (
        <button
          type="button"
          data-ocid="home.active_ride.card"
          onClick={() => setScreen("active")}
          className="w-full text-left rounded-xl p-4 border animate-fade-in flex items-center gap-3"
          style={{
            background: "oklch(0.55 0.18 145 / 0.08)",
            borderColor: "oklch(0.55 0.18 145 / 0.4)",
          }}
        >
          <Navigation
            className="w-5 h-5 flex-shrink-0"
            style={{ color: "oklch(0.55 0.18 145)" }}
          />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-foreground">
              Active Ride in Progress
            </p>
            <p className="text-xs text-muted-foreground truncate">
              {activeRide.pickup} → {activeRide.destination}
            </p>
          </div>
          <ChevronRight
            className="w-4 h-4"
            style={{ color: "oklch(0.55 0.18 145)" }}
          />
        </button>
      )}

      {/* AI Voice Detection Card */}

      <div
        className="rounded-xl p-4 border transition-all duration-500"
        style={{
          background: "oklch(1 0 0)",
          borderColor: voiceDetectionActive
            ? "oklch(0.68 0.22 340)"
            : "oklch(0.88 0.005 265)",
          boxShadow: voiceDetectionActive
            ? "0 0 0 2px oklch(0.58 0.25 340 / 0.15), 0 1px 4px oklch(0 0 0 / 0.06)"
            : "0 1px 4px oklch(0 0 0 / 0.06)",
          animation: voiceDetectionActive
            ? "voiceGlow 2s ease-in-out infinite"
            : "none",
        }}
      >
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{
              background: voiceDetectionEnabled
                ? "oklch(0.58 0.25 340 / 0.1)"
                : "oklch(0.94 0.005 265)",
            }}
          >
            {voiceDetectionActive ? (
              /* Animated waveform */
              <div
                className="flex items-center gap-[2px]"
                style={{ height: 24 }}
              >
                {[
                  { anim: "wave1", delay: "0s", color: "oklch(0.58 0.25 340)" },
                  {
                    anim: "wave2",
                    delay: "0.1s",
                    color: "oklch(0.55 0.22 310)",
                  },
                  {
                    anim: "wave3",
                    delay: "0.2s",
                    color: "oklch(0.52 0.20 285)",
                  },
                  {
                    anim: "wave4",
                    delay: "0.1s",
                    color: "oklch(0.55 0.22 310)",
                  },
                  { anim: "wave5", delay: "0s", color: "oklch(0.58 0.25 340)" },
                ].map((bar) => (
                  <div
                    key={bar.anim}
                    style={{
                      width: 3,
                      borderRadius: 2,
                      background: bar.color,
                      animation: `${bar.anim} 0.8s ease-in-out ${bar.delay} infinite`,
                      alignSelf: "center",
                    }}
                  />
                ))}
              </div>
            ) : voiceDetectionEnabled ? (
              <Mic
                className="w-5 h-5"
                style={{
                  color: "oklch(0.58 0.25 340)",
                  animation: "micPulse 1.5s ease-in-out infinite",
                }}
              />
            ) : (
              <MicOff className="w-5 h-5 text-muted-foreground" />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <p className="text-sm font-semibold text-foreground">
                AI Voice Detection
              </p>
              {voiceDetectionActive && (
                <span
                  className="w-2 h-2 rounded-full flex-shrink-0"
                  style={{
                    background: "oklch(0.65 0.22 145)",
                    boxShadow: "0 0 0 0 oklch(0.65 0.22 145)",
                    animation: "pulse 1.5s ease-in-out infinite",
                  }}
                />
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              {voiceDetectionActive
                ? "Listening... Say 'help' or 'bachao'"
                : voiceDetectionEnabled
                  ? "Starting microphone..."
                  : "Tap to enable AI voice detection"}
            </p>
            {visibleVoiceAlert && (
              <div
                className="mt-1 inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium"
                style={{
                  background: "oklch(0.85 0.12 60 / 0.3)",
                  color: "oklch(0.55 0.18 60)",
                  border: "1px solid oklch(0.75 0.15 60 / 0.4)",
                }}
              >
                Keyword: {visibleVoiceAlert}
              </div>
            )}
            {voiceKeywordLog.length > 0 &&
              voiceDetectionActive &&
              !visibleVoiceAlert && (
                <p
                  className="text-[10px] mt-0.5"
                  style={{ color: "oklch(0.65 0.01 265)" }}
                >
                  Last: &quot;{voiceKeywordLog[0]}&quot;
                </p>
              )}
            {!voiceSupported && (
              <p
                className="text-[10px] mt-0.5"
                style={{ color: "oklch(0.55 0.18 50)" }}
              >
                Use Chrome for best results
              </p>
            )}
          </div>
          <Switch
            checked={voiceDetectionEnabled}
            onCheckedChange={setVoiceDetectionEnabled}
            data-ocid="home.voice_detection.switch"
          />
        </div>
      </div>

      {/* Heart Rate Card */}
      <div
        className="rounded-xl p-4 border"
        style={{
          background: "oklch(1 0 0)",
          borderColor: "oklch(0.88 0.005 265)",
          boxShadow: "0 1px 4px oklch(0 0 0 / 0.06)",
        }}
      >
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{
              background: bluetoothConnected
                ? "oklch(0.58 0.25 340 / 0.1)"
                : "oklch(0.94 0.005 265)",
            }}
          >
            <Heart
              className="w-5 h-5"
              style={{
                color: bluetoothConnected
                  ? "oklch(0.58 0.25 340)"
                  : "oklch(0.65 0.01 265)",
              }}
            />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-foreground">
              Heart Rate Monitor
            </p>
            {bluetoothConnected ? (
              <div className="flex items-center gap-1.5 mt-0.5">
                <span
                  className="text-xs font-medium"
                  style={{ color: "oklch(0.45 0.01 265)" }}
                >
                  {bluetoothDeviceName ?? "Smartwatch"}
                </span>
                {heartRate !== null && (
                  <>
                    <span
                      className="text-sm font-bold"
                      style={{
                        color: heartAbnormal
                          ? "oklch(0.58 0.25 340)"
                          : "oklch(0.13 0.01 265)",
                      }}
                    >
                      {heartRate}
                    </span>
                    <span className="text-xs text-muted-foreground">BPM</span>
                    {heartAbnormal && (
                      <span
                        className="text-xs font-semibold"
                        style={{ color: "oklch(0.58 0.25 340)" }}
                      >
                        ⚠ Abnormal!
                      </span>
                    )}
                  </>
                )}
              </div>
            ) : (
              <p className="text-xs text-muted-foreground">
                Connect smartwatch via Bluetooth
              </p>
            )}
          </div>
          {bluetoothConnected ? (
            <button
              type="button"
              data-ocid="home.bluetooth.disconnect"
              onClick={disconnectBluetooth}
              className="p-2 rounded-lg"
              style={{ background: "oklch(0.94 0.005 265)" }}
            >
              <BluetoothOff className="w-4 h-4 text-muted-foreground" />
            </button>
          ) : (
            <button
              type="button"
              data-ocid="home.bluetooth.connect"
              onClick={connectBluetooth}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-white"
              style={{ background: "oklch(0.58 0.25 340)" }}
            >
              <Bluetooth className="w-3.5 h-3.5" />
              Connect
            </button>
          )}
        </div>
      </div>

      {/* Quick Actions — Grid */}
      <div>
        <h2 className="font-display text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-3">
          Quick Actions
        </h2>
        <div className="grid grid-cols-2 gap-3">
          {/* Emergency Call */}
          <button
            type="button"
            data-ocid="home.emergency_call.primary_button"
            onClick={() => setShowEmergencyCall(true)}
            className="flex flex-col items-center justify-center gap-2 py-5 px-3 rounded-2xl font-semibold text-sm text-white transition-all hover:scale-[1.03] active:scale-[0.97]"
            style={{
              background:
                "linear-gradient(135deg, oklch(0.50 0.22 25) 0%, oklch(0.42 0.20 10) 100%)",
              boxShadow:
                "0 0 20px oklch(0.50 0.22 25 / 0.40), 0 4px 10px oklch(0 0 0 / 0.10)",
            }}
          >
            <div
              className="w-11 h-11 rounded-xl flex items-center justify-center"
              style={{ background: "oklch(1 0 0 / 0.2)" }}
            >
              <PhoneCall className="w-5 h-5 text-white" />
            </div>
            Emergency Call
          </button>

          {/* Public Safety */}
          <button
            type="button"
            data-ocid="home.publicsafety.primary_button"
            onClick={() => setScreen("publicsafety")}
            className="flex flex-col items-center justify-center gap-2 py-5 px-3 rounded-2xl font-semibold text-sm text-white transition-all hover:scale-[1.03] active:scale-[0.97]"
            style={{
              background:
                "linear-gradient(135deg, oklch(0.42 0.20 295) 0%, oklch(0.35 0.18 280) 100%)",
              boxShadow:
                "0 0 20px oklch(0.42 0.20 295 / 0.40), 0 4px 10px oklch(0 0 0 / 0.10)",
            }}
          >
            <div
              className="w-11 h-11 rounded-xl flex items-center justify-center"
              style={{ background: "oklch(1 0 0 / 0.2)" }}
            >
              <ShieldCheck className="w-5 h-5 text-white" />
            </div>
            Public Safety
          </button>

          {/* Record */}
          <button
            type="button"
            data-ocid="home.record.primary_button"
            onClick={() => setShowRecordSheet(true)}
            className="flex flex-col items-center justify-center gap-2 py-5 px-3 rounded-2xl font-semibold text-sm text-white transition-all hover:scale-[1.03] active:scale-[0.97]"
            style={{
              background:
                "linear-gradient(135deg, oklch(0.58 0.25 340) 0%, oklch(0.48 0.22 320) 100%)",
              boxShadow:
                "0 0 20px oklch(0.58 0.25 340 / 0.40), 0 4px 10px oklch(0 0 0 / 0.10)",
            }}
          >
            <div
              className="w-11 h-11 rounded-xl flex items-center justify-center"
              style={{ background: "oklch(1 0 0 / 0.2)" }}
            >
              <Video className="w-5 h-5 text-white" />
            </div>
            Record
          </button>

          {/* Share Location */}
          <button
            type="button"
            data-ocid="home.share_location.primary_button"
            onClick={() => setScreen("location")}
            className="flex flex-col items-center justify-center gap-2 py-5 px-3 rounded-2xl font-semibold text-sm text-white transition-all hover:scale-[1.03] active:scale-[0.97]"
            style={{
              background:
                "linear-gradient(135deg, oklch(0.52 0.18 145) 0%, oklch(0.44 0.16 160) 100%)",
              boxShadow:
                "0 0 20px oklch(0.52 0.18 145 / 0.40), 0 4px 10px oklch(0 0 0 / 0.10)",
            }}
          >
            <div
              className="w-11 h-11 rounded-xl flex items-center justify-center"
              style={{ background: "oklch(1 0 0 / 0.2)" }}
            >
              <MapPin className="w-5 h-5 text-white" />
            </div>
            Share Location
          </button>
        </div>
      </div>

      {/* Safety Status */}
      <div
        className="rounded-xl p-4 border"
        style={{
          background: "oklch(1 0 0)",
          borderColor: "oklch(0.88 0.005 265)",
          boxShadow: "0 1px 4px oklch(0 0 0 / 0.05)",
        }}
      >
        <div className="flex items-center gap-2 mb-3">
          <Activity
            className="w-4 h-4"
            style={{ color: "oklch(0.58 0.25 340)" }}
          />
          <span className="text-sm font-semibold text-foreground">
            Safety Status
          </span>
        </div>
        <div className="space-y-2">
          {[
            {
              label: "AI Voice Detection",
              status: voiceDetectionActive
                ? "Listening"
                : voiceDetectionEnabled
                  ? "On"
                  : "Off",
              ok: voiceDetectionEnabled,
            },
            {
              label: "GPS Tracking",
              status: isLiveTracking ? "Active" : "Searching",
              ok: isLiveTracking,
            },
            {
              label: "Emergency Contacts",
              status: `${contacts.length} Saved`,
              ok: contacts.length > 0,
            },
            {
              label: "Heart Rate",
              status: bluetoothConnected
                ? heartRate
                  ? `${heartRate} BPM`
                  : "Connected"
                : "Not Connected",
              ok: bluetoothConnected,
            },
          ].map((item) => (
            <div key={item.label} className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">
                {item.label}
              </span>
              <span
                className="text-xs font-medium"
                style={{
                  color: item.ok
                    ? "oklch(0.55 0.18 145)"
                    : "oklch(0.55 0.01 265)",
                }}
              >
                {item.status}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Emergency Call Modal */}
      {showEmergencyCall && (
        <div
          className="fixed inset-0 z-50 flex flex-col"
          style={{ background: "oklch(0 0 0 / 0.6)" }}
        >
          <div
            className="mt-auto rounded-t-3xl flex flex-col max-h-[90vh]"
            style={{ background: "oklch(0.98 0.005 265)" }}
          >
            <div
              className="flex items-center justify-between px-5 pt-5 pb-3 rounded-t-3xl flex-shrink-0"
              style={{
                background:
                  "linear-gradient(135deg, oklch(0.50 0.22 25) 0%, oklch(0.42 0.20 350) 100%)",
              }}
            >
              <div>
                <h2 className="text-white font-bold text-xl leading-tight">
                  Emergency Help
                </h2>
                <p className="text-red-100 text-xs mt-0.5">
                  Tap any number to call instantly
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowEmergencyCall(false)}
                className="w-8 h-8 rounded-full flex items-center justify-center"
                style={{ background: "oklch(1 0 0 / 0.2)" }}
              >
                <X className="w-4 h-4 text-white" />
              </button>
            </div>
            <div className="overflow-y-auto flex-1 px-4 py-4 space-y-3">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">
                National Helplines
              </p>
              {helplines
                .filter((h) => !h.regional)
                .map((h) => (
                  <button
                    key={h.label}
                    type="button"
                    onClick={() => handleCall(h.number)}
                    className="w-full flex items-center gap-3 rounded-2xl p-4 border transition-all active:scale-95"
                    style={{
                      background: h.primary
                        ? "oklch(0.50 0.22 25)"
                        : tappedNumber === h.number
                          ? "oklch(0.50 0.22 25 / 0.08)"
                          : "oklch(1 0 0)",
                      borderColor: h.primary
                        ? "oklch(0.50 0.22 25)"
                        : "oklch(0.88 0.005 265)",
                      boxShadow: h.primary
                        ? "0 0 18px oklch(0.50 0.22 25 / 0.45)"
                        : "0 1px 4px oklch(0 0 0 / 0.05)",
                    }}
                  >
                    <span className="text-2xl flex-shrink-0">{h.emoji}</span>
                    <div className="flex-1 text-left min-w-0">
                      <p
                        className="text-xs font-medium leading-tight"
                        style={{
                          color: h.primary
                            ? "oklch(1 0 0 / 0.85)"
                            : "oklch(0.45 0.01 265)",
                        }}
                      >
                        {h.label}
                      </p>
                      <p
                        className="text-[11px] mt-0.5 leading-tight"
                        style={{
                          color: h.primary
                            ? "oklch(1 0 0 / 0.65)"
                            : "oklch(0.60 0.01 265)",
                        }}
                      >
                        {h.desc}
                      </p>
                    </div>
                    <div className="flex flex-col items-end gap-1 flex-shrink-0">
                      <span
                        className="font-display font-bold text-xl leading-none"
                        style={{
                          color: h.primary ? "white" : "oklch(0.50 0.22 25)",
                        }}
                      >
                        {h.number}
                      </span>
                      <span
                        className="text-[10px]"
                        style={{
                          color: h.primary
                            ? "oklch(1 0 0 / 0.7)"
                            : "oklch(0.60 0.01 265)",
                        }}
                      >
                        Tap to Call
                      </span>
                    </div>
                    <Phone
                      className="w-4 h-4 flex-shrink-0"
                      style={{
                        color: h.primary ? "white" : "oklch(0.50 0.22 25)",
                      }}
                    />
                  </button>
                ))}
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest pt-1">
                Odisha / Berhampur
              </p>
              {helplines
                .filter((h) => h.regional)
                .map((h) => (
                  <button
                    key={h.label}
                    type="button"
                    onClick={() => handleCall(h.number)}
                    className="w-full flex items-center gap-3 rounded-2xl p-4 border transition-all active:scale-95"
                    style={{
                      background:
                        tappedNumber === h.number
                          ? "oklch(0.55 0.17 300 / 0.08)"
                          : "oklch(1 0 0)",
                      borderColor: "oklch(0.55 0.17 300 / 0.3)",
                      boxShadow: "0 1px 4px oklch(0 0 0 / 0.05)",
                    }}
                  >
                    <span className="text-2xl flex-shrink-0">{h.emoji}</span>
                    <div className="flex-1 text-left min-w-0">
                      <p className="text-xs font-medium text-foreground leading-tight">
                        {h.label}
                      </p>
                      <p className="text-[11px] text-muted-foreground mt-0.5 leading-tight">
                        {h.desc}
                      </p>
                    </div>
                    <div className="flex flex-col items-end gap-1 flex-shrink-0">
                      <span
                        className="font-display font-bold text-xl leading-none"
                        style={{ color: "oklch(0.55 0.17 300)" }}
                      >
                        {h.number}
                      </span>
                      <span className="text-[10px] text-muted-foreground">
                        Tap to Call
                      </span>
                    </div>
                    <Phone
                      className="w-4 h-4 flex-shrink-0"
                      style={{ color: "oklch(0.55 0.17 300)" }}
                    />
                  </button>
                ))}
              <div className="h-4" />
            </div>
          </div>
        </div>
      )}

      {/* Record Bottom Sheet */}
      {showRecordSheet && (
        <div
          className="fixed inset-0 z-50 flex flex-col justify-end"
          style={{ background: "oklch(0 0 0 / 0.5)" }}
          onKeyDown={(e) => {
            if (e.key === "Escape") setShowRecordSheet(false);
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget) setShowRecordSheet(false);
          }}
        >
          <div
            data-ocid="record.sheet"
            className="rounded-t-3xl overflow-hidden"
            style={{ background: "oklch(0.98 0.005 265)" }}
          >
            {/* Handle */}
            <div className="flex justify-center pt-3 pb-1">
              <div
                className="w-10 h-1 rounded-full"
                style={{ background: "oklch(0.80 0.005 265)" }}
              />
            </div>
            <div className="px-5 pt-2 pb-3">
              <h2 className="font-bold text-xl text-foreground">Record</h2>
              <p className="text-xs text-muted-foreground">
                Choose what to capture
              </p>
            </div>
            <div className="px-4 pb-8 space-y-3">
              {[
                {
                  type: "video" as const,
                  icon: Video,
                  label: "Record Video",
                  desc: "Start video recording",
                  color: "oklch(0.50 0.22 25)",
                  bg: "oklch(0.50 0.22 25 / 0.12)",
                },
                {
                  type: "photo" as const,
                  icon: Camera,
                  label: "Capture Photo",
                  desc: "Take a photo",
                  color: "oklch(0.55 0.18 145)",
                  bg: "oklch(0.55 0.18 145 / 0.12)",
                },
                {
                  type: "audio" as const,
                  icon: Mic,
                  label: "Record Audio",
                  desc: "Record audio clip",
                  color: "oklch(0.55 0.17 300)",
                  bg: "oklch(0.55 0.17 300 / 0.12)",
                },
              ].map((opt) => (
                <button
                  key={opt.type}
                  type="button"
                  data-ocid={`record.${opt.type}.button`}
                  onClick={() => requestPermission(opt.type)}
                  className="w-full flex items-center gap-4 p-4 rounded-2xl border transition-all active:scale-95"
                  style={{
                    background: "oklch(1 0 0)",
                    borderColor: "oklch(0.88 0.005 265)",
                    boxShadow: "0 1px 4px oklch(0 0 0 / 0.05)",
                  }}
                >
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ background: opt.bg }}
                  >
                    <opt.icon
                      className="w-6 h-6"
                      style={{ color: opt.color }}
                    />
                  </div>
                  <div className="flex-1 text-left">
                    <p className="text-sm font-semibold text-foreground">
                      {opt.label}
                    </p>
                    <p className="text-xs text-muted-foreground">{opt.desc}</p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-muted-foreground" />
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Permission Dialog */}
      {permState === "requesting" && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center px-6"
          style={{ background: "oklch(0 0 0 / 0.55)" }}
        >
          <div
            data-ocid="record.dialog"
            className="w-full max-w-xs rounded-2xl p-6"
            style={{ background: "oklch(1 0 0)" }}
          >
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-4"
              style={{ background: "oklch(0.58 0.25 340 / 0.12)" }}
            >
              {pendingModal === "audio" ? (
                <Mic
                  className="w-6 h-6"
                  style={{ color: "oklch(0.58 0.25 340)" }}
                />
              ) : (
                <Camera
                  className="w-6 h-6"
                  style={{ color: "oklch(0.58 0.25 340)" }}
                />
              )}
            </div>
            <h3 className="font-bold text-lg text-foreground text-center mb-1">
              Permission Required
            </h3>
            <p className="text-sm text-muted-foreground text-center mb-5">
              SheShield needs{" "}
              {pendingModal === "audio" ? "microphone" : "camera"} access to
              {pendingModal === "audio" ? " record audio." : " capture media."}{" "}
              Allow?
            </p>
            <div className="flex gap-3">
              <button
                type="button"
                data-ocid="record.deny.button"
                onClick={handlePermDeny}
                className="flex-1 py-2.5 rounded-xl text-sm font-semibold"
                style={{
                  background: "oklch(0.94 0.005 265)",
                  color: "oklch(0.45 0.01 265)",
                }}
              >
                Deny
              </button>
              <button
                type="button"
                data-ocid="record.allow.button"
                onClick={handlePermAllow}
                className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white"
                style={{
                  background:
                    "linear-gradient(135deg, oklch(0.58 0.25 340), oklch(0.40 0.20 295))",
                }}
              >
                Allow
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Permission Denied */}
      {permState === "denied" && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center px-6"
          style={{ background: "oklch(0 0 0 / 0.55)" }}
        >
          <div
            data-ocid="record.denied.dialog"
            className="w-full max-w-xs rounded-2xl p-6"
            style={{ background: "oklch(1 0 0)" }}
          >
            <h3 className="font-bold text-lg text-foreground mb-2">
              Access Denied
            </h3>
            <p className="text-sm text-muted-foreground mb-5">
              Permission denied. Please allow access in your browser settings to
              use this feature.
            </p>
            <button
              type="button"
              data-ocid="record.denied.close_button"
              onClick={closePermDialog}
              className="w-full py-2.5 rounded-xl text-sm font-semibold text-white"
              style={{
                background:
                  "linear-gradient(135deg, oklch(0.58 0.25 340), oklch(0.40 0.20 295))",
              }}
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Video Recording Modal */}
      {recordModal === "video" && (
        <div
          className="fixed inset-0 z-[60] flex flex-col"
          style={{ background: "oklch(0.05 0.005 265)" }}
        >
          <div className="flex items-center gap-3 px-4 py-3">
            <button
              type="button"
              data-ocid="record.video.close_button"
              onClick={closeVideoModal}
              className="w-9 h-9 rounded-xl flex items-center justify-center"
              style={{ background: "oklch(1 0 0 / 0.15)" }}
            >
              <X className="w-5 h-5 text-white" />
            </button>
            <span className="text-white font-semibold text-sm flex-1">
              {videoRecording ? "Recording..." : "Video"}
            </span>
            {videoRecording && (
              <div className="flex items-center gap-2">
                <span
                  className="w-3 h-3 rounded-full animate-pulse"
                  style={{ background: "oklch(0.55 0.22 25)" }}
                />
                <span
                  className="text-sm font-mono font-bold"
                  style={{ color: "oklch(0.55 0.22 25)" }}
                >
                  REC {formatTime(videoTimer)}
                </span>
              </div>
            )}
          </div>

          <div className="flex-1 relative overflow-hidden">
            <video
              ref={videoPreviewRef}
              autoPlay
              muted
              playsInline
              className="w-full h-full object-cover"
            />
          </div>

          <div className="flex items-center justify-center pb-12 pt-6">
            {!videoRecording ? (
              <button
                type="button"
                data-ocid="record.video.primary_button"
                onClick={startVideoRecording}
                className="w-20 h-20 rounded-full flex items-center justify-center border-4 border-white transition-all active:scale-90"
                style={{ background: "oklch(0.55 0.22 25)" }}
              >
                <Video className="w-8 h-8 text-white" />
              </button>
            ) : (
              <button
                type="button"
                data-ocid="record.video.stop_button"
                onClick={stopVideoRecording}
                className="w-20 h-20 rounded-full flex items-center justify-center border-4 transition-all active:scale-90"
                style={{
                  background: "oklch(0.55 0.22 25)",
                  borderColor: "oklch(0.55 0.22 25 / 0.5)",
                  boxShadow: "0 0 24px oklch(0.55 0.22 25 / 0.5)",
                }}
              >
                <Square className="w-8 h-8 text-white" />
              </button>
            )}
          </div>
        </div>
      )}

      {/* Photo Capture Modal */}
      {recordModal === "photo" && (
        <div
          className="fixed inset-0 z-[60] flex flex-col"
          style={{ background: "oklch(0.05 0.005 265)" }}
        >
          <div className="flex items-center gap-3 px-4 py-3">
            <button
              type="button"
              data-ocid="record.photo.close_button"
              onClick={closePhotoModal}
              className="w-9 h-9 rounded-xl flex items-center justify-center"
              style={{ background: "oklch(1 0 0 / 0.15)" }}
            >
              <X className="w-5 h-5 text-white" />
            </button>
            <span className="text-white font-semibold text-sm">
              {photoDataUrl ? "Preview" : "Camera"}
            </span>
          </div>

          <div className="flex-1 relative overflow-hidden">
            {photoDataUrl ? (
              <img
                src={photoDataUrl}
                alt="Captured"
                className="w-full h-full object-cover"
              />
            ) : (
              <video
                ref={photoPreviewRef}
                autoPlay
                muted
                playsInline
                className="w-full h-full object-cover"
              />
            )}
          </div>

          <div className="flex items-center justify-center gap-6 pb-12 pt-6">
            {photoDataUrl ? (
              <>
                <button
                  type="button"
                  data-ocid="record.photo.retake_button"
                  onClick={() => setPhotoDataUrl(null)}
                  className="px-6 py-3 rounded-2xl text-sm font-semibold"
                  style={{ background: "oklch(1 0 0 / 0.15)", color: "white" }}
                >
                  Retake
                </button>
                <button
                  type="button"
                  data-ocid="record.photo.save_button"
                  onClick={savePhoto}
                  className="px-8 py-3 rounded-2xl text-sm font-bold text-white"
                  style={{
                    background:
                      "linear-gradient(135deg, oklch(0.58 0.25 340), oklch(0.40 0.20 295))",
                  }}
                >
                  Save Photo
                </button>
              </>
            ) : (
              <button
                type="button"
                data-ocid="record.photo.primary_button"
                onClick={capturePhoto}
                className="w-20 h-20 rounded-full flex items-center justify-center border-4 border-white transition-all active:scale-90"
                style={{ background: "white" }}
              >
                <Camera
                  className="w-8 h-8"
                  style={{ color: "oklch(0.20 0.01 265)" }}
                />
              </button>
            )}
          </div>
        </div>
      )}

      {/* Audio Recording Modal */}
      {recordModal === "audio" && (
        <div
          className="fixed inset-0 z-[60] flex flex-col"
          style={{
            background:
              "linear-gradient(135deg, oklch(0.15 0.05 295) 0%, oklch(0.10 0.04 340) 100%)",
          }}
        >
          <div className="flex items-center gap-3 px-4 py-3">
            <button
              type="button"
              data-ocid="record.audio.close_button"
              onClick={closeAudioModal}
              className="w-9 h-9 rounded-xl flex items-center justify-center"
              style={{ background: "oklch(1 0 0 / 0.15)" }}
            >
              <X className="w-5 h-5 text-white" />
            </button>
            <span className="text-white font-semibold text-sm">Audio</span>
          </div>

          <div className="flex-1 flex flex-col items-center justify-center gap-6">
            {/* Pulsing mic animation */}
            <div className="relative flex items-center justify-center">
              {audioRecording && (
                <>
                  <div
                    className="absolute w-36 h-36 rounded-full animate-ping"
                    style={{ background: "oklch(0.58 0.25 340 / 0.2)" }}
                  />
                  <div
                    className="absolute w-28 h-28 rounded-full animate-pulse"
                    style={{ background: "oklch(0.58 0.25 340 / 0.3)" }}
                  />
                </>
              )}
              <div
                className="w-24 h-24 rounded-full flex items-center justify-center relative z-10"
                style={{
                  background: audioRecording
                    ? "linear-gradient(135deg, oklch(0.58 0.25 340), oklch(0.40 0.20 295))"
                    : "oklch(1 0 0 / 0.15)",
                }}
              >
                <Mic className="w-10 h-10 text-white" />
              </div>
            </div>

            {audioRecording && (
              <div className="text-center">
                <p className="text-white text-xs mb-1 font-medium">Recording</p>
                <p
                  className="font-mono text-4xl font-bold"
                  style={{ color: "oklch(0.58 0.25 340)" }}
                >
                  {formatTime(audioTimer)}
                </p>
              </div>
            )}

            {!audioRecording && (
              <p className="text-white/60 text-sm">Tap to start recording</p>
            )}
          </div>

          <div className="flex items-center justify-center pb-12 pt-6">
            {!audioRecording ? (
              <button
                type="button"
                data-ocid="record.audio.primary_button"
                onClick={startAudioRecording}
                className="w-20 h-20 rounded-full flex items-center justify-center border-4 border-white transition-all active:scale-90"
                style={{
                  background:
                    "linear-gradient(135deg, oklch(0.58 0.25 340), oklch(0.40 0.20 295))",
                }}
              >
                <Mic className="w-8 h-8 text-white" />
              </button>
            ) : (
              <button
                type="button"
                data-ocid="record.audio.stop_button"
                onClick={stopAudioRecording}
                className="w-20 h-20 rounded-full flex items-center justify-center border-4 transition-all active:scale-90"
                style={{
                  background: "oklch(0.55 0.22 25)",
                  borderColor: "oklch(0.55 0.22 25 / 0.5)",
                  boxShadow: "0 0 24px oklch(0.55 0.22 25 / 0.5)",
                }}
              >
                <Square className="w-8 h-8 text-white" />
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
