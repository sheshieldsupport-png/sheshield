import {
  AlertCircle,
  ArrowLeft,
  Bell,
  Car,
  Download,
  FileText,
  FolderOpen,
  Image as ImageIcon,
  Mic,
  Pause,
  Play,
  Search,
  Share2,
  Shield,
  Trash2,
  Video,
  X,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useApp } from "../context/AppContext";

type FileTab = "images" | "videos" | "voice" | "history";
type FilterType = "all" | "images" | "videos" | "audio" | "sos";

interface FileItem {
  id: string;
  name: string;
  time: string;
  location?: string;
  type: "image" | "video" | "voice" | "history";
  eventType?: "SOS Alert" | "Scan Taxi" | "Voice Alert" | "Manual Alert";
  duration?: string;
  gradient?: string;
}

const MOCK_IMAGES: FileItem[] = [
  {
    id: "img1",
    name: "SOS_Capture_001.jpg",
    time: "Mar 20, 2026 • 14:32",
    location: "Berhampur, Odisha",
    type: "image",
    eventType: "SOS Alert",
    gradient:
      "linear-gradient(135deg, oklch(0.58 0.25 340) 0%, oklch(0.40 0.20 295) 100%)",
  },
  {
    id: "img2",
    name: "Scan_Evidence_002.jpg",
    time: "Mar 18, 2026 • 09:12",
    location: "NH-16, Berhampur",
    type: "image",
    eventType: "Scan Taxi",
    gradient:
      "linear-gradient(135deg, oklch(0.50 0.22 295) 0%, oklch(0.40 0.18 250) 100%)",
  },
  {
    id: "img3",
    name: "SOS_Capture_003.jpg",
    time: "Mar 15, 2026 • 20:47",
    location: "Gandhi Market",
    type: "image",
    eventType: "SOS Alert",
    gradient:
      "linear-gradient(135deg, oklch(0.55 0.20 22) 0%, oklch(0.45 0.22 340) 100%)",
  },
  {
    id: "img4",
    name: "Alert_Photo_004.jpg",
    time: "Mar 12, 2026 • 19:31",
    location: "Home, Berhampur",
    type: "image",
    eventType: "Voice Alert",
    gradient:
      "linear-gradient(135deg, oklch(0.52 0.18 250) 0%, oklch(0.42 0.15 220) 100%)",
  },
];

const MOCK_VIDEOS: FileItem[] = [
  {
    id: "vid1",
    name: "SOS_Video_001.mp4",
    time: "Mar 20, 2026 • 14:30",
    location: "Berhampur, Odisha",
    type: "video",
    eventType: "SOS Alert",
    gradient:
      "linear-gradient(135deg, oklch(0.20 0.05 265) 0%, oklch(0.30 0.08 295) 100%)",
  },
  {
    id: "vid2",
    name: "Ride_Recording_002.mp4",
    time: "Mar 18, 2026 • 09:10",
    location: "NH-16, Berhampur",
    type: "video",
    eventType: "Scan Taxi",
    gradient:
      "linear-gradient(135deg, oklch(0.22 0.06 250) 0%, oklch(0.28 0.08 280) 100%)",
  },
  {
    id: "vid3",
    name: "Alert_Clip_003.mp4",
    time: "Mar 15, 2026 • 20:45",
    location: "Gandhi Market",
    type: "video",
    eventType: "Voice Alert",
    gradient:
      "linear-gradient(135deg, oklch(0.18 0.04 295) 0%, oklch(0.25 0.07 340) 100%)",
  },
];

const MOCK_VOICE: FileItem[] = [
  {
    id: "aud1",
    name: "Voice_Recording_001.mp3",
    time: "Mar 20, 2026 • 14:31",
    location: "Berhampur, Odisha",
    type: "voice",
    duration: "0:45",
  },
  {
    id: "aud2",
    name: "Voice_Recording_002.mp3",
    time: "Mar 18, 2026 • 09:15",
    location: "NH-16, Berhampur",
    type: "voice",
    duration: "1:12",
  },
  {
    id: "aud3",
    name: "Emergency_Audio_003.mp3",
    time: "Mar 15, 2026 • 20:48",
    type: "voice",
    duration: "0:28",
  },
];

const MOCK_HISTORY: FileItem[] = [
  {
    id: "his1",
    name: "SOS Alert",
    time: "Mar 20, 2026 • 14:30",
    location: "Berhampur, Odisha",
    type: "history",
    eventType: "SOS Alert",
  },
  {
    id: "his2",
    name: "Scan Taxi",
    time: "Mar 18, 2026 • 09:10",
    location: "NH-16, Berhampur",
    type: "history",
    eventType: "Scan Taxi",
  },
  {
    id: "his3",
    name: "SOS Alert",
    time: "Mar 15, 2026 • 20:45",
    location: "Gandhi Market, Berhampur",
    type: "history",
    eventType: "SOS Alert",
  },
  {
    id: "his4",
    name: "Voice Alert",
    time: "Mar 12, 2026 • 19:30",
    location: "Home, Berhampur",
    type: "history",
    eventType: "Voice Alert",
  },
];

function EventBadge({ type }: { type: string }) {
  const config: Record<
    string,
    { bg: string; color: string; icon: React.ReactNode }
  > = {
    "SOS Alert": {
      bg: "oklch(0.95 0.04 22)",
      color: "oklch(0.50 0.22 22)",
      icon: <Shield className="w-3 h-3" />,
    },
    "Scan Taxi": {
      bg: "oklch(0.93 0.04 295)",
      color: "oklch(0.45 0.20 295)",
      icon: <Car className="w-3 h-3" />,
    },
    "Voice Alert": {
      bg: "oklch(0.95 0.06 80)",
      color: "oklch(0.50 0.20 60)",
      icon: <Bell className="w-3 h-3" />,
    },
    "Manual Alert": {
      bg: "oklch(0.94 0.04 250)",
      color: "oklch(0.48 0.18 250)",
      icon: <AlertCircle className="w-3 h-3" />,
    },
  };
  const c = config[type] ?? config["Manual Alert"];
  return (
    <span
      className="inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full"
      style={{ background: c.bg, color: c.color }}
    >
      {c.icon} {type}
    </span>
  );
}

function HistoryEventIcon({ type }: { type: string }) {
  if (type === "SOS Alert")
    return (
      <Shield className="w-5 h-5" style={{ color: "oklch(0.50 0.22 22)" }} />
    );
  if (type === "Scan Taxi")
    return (
      <Car className="w-5 h-5" style={{ color: "oklch(0.45 0.20 295)" }} />
    );
  return <Bell className="w-5 h-5" style={{ color: "oklch(0.50 0.20 60)" }} />;
}

export default function FilesHistoryScreen() {
  const { setScreen } = useApp();
  const [activeTab, setActiveTab] = useState<FileTab>("images");
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<FilterType>("all");
  const [images, setImages] = useState<FileItem[]>(MOCK_IMAGES);
  const [videos, setVideos] = useState<FileItem[]>(MOCK_VIDEOS);
  const [voice, setVoice] = useState<FileItem[]>(MOCK_VOICE);
  const [history, setHistory] = useState<FileItem[]>(MOCK_HISTORY);
  const [preview, setPreview] = useState<FileItem | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<FileItem | null>(null);
  const [playingId, setPlayingId] = useState<string | null>(null);
  const [audioProgress, setAudioProgress] = useState(0);

  const filterMap: Record<FilterType, FileTab[]> = {
    all: ["images", "videos", "voice", "history"],
    images: ["images"],
    videos: ["videos"],
    audio: ["voice"],
    sos: ["history"],
  };

  function getItems(): FileItem[] {
    const map: Record<FileTab, FileItem[]> = { images, videos, voice, history };
    return map[activeTab].filter(
      (item) =>
        item.name.toLowerCase().includes(search.toLowerCase()) ||
        (item.location ?? "").toLowerCase().includes(search.toLowerCase()),
    );
  }

  function handleDelete(item: FileItem) {
    if (item.type === "image")
      setImages((p) => p.filter((x) => x.id !== item.id));
    else if (item.type === "video")
      setVideos((p) => p.filter((x) => x.id !== item.id));
    else if (item.type === "voice")
      setVoice((p) => p.filter((x) => x.id !== item.id));
    else setHistory((p) => p.filter((x) => x.id !== item.id));
    setDeleteTarget(null);
    setPreview(null);
    toast.success("File deleted");
  }

  function togglePlay(id: string) {
    if (playingId === id) {
      setPlayingId(null);
    } else {
      setPlayingId(id);
      setAudioProgress(0);
      // Simulate progress
      let p = 0;
      const interval = setInterval(() => {
        p += 2;
        setAudioProgress(p);
        if (p >= 100) {
          clearInterval(interval);
          setPlayingId(null);
          setAudioProgress(0);
        }
      }, 200);
    }
  }

  const tabs: { id: FileTab; label: string; icon: React.ReactNode }[] = [
    { id: "images", label: "Images", icon: <ImageIcon className="w-4 h-4" /> },
    { id: "videos", label: "Videos", icon: <Video className="w-4 h-4" /> },
    { id: "voice", label: "Voice", icon: <Mic className="w-4 h-4" /> },
    { id: "history", label: "History", icon: <FileText className="w-4 h-4" /> },
  ];

  const filters: { id: FilterType; label: string }[] = [
    { id: "all", label: "All" },
    { id: "images", label: "📸 Images" },
    { id: "videos", label: "🎥 Videos" },
    { id: "audio", label: "🎙️ Audio" },
    { id: "sos", label: "🚨 SOS" },
  ];

  const items = getItems();

  return (
    <div
      className="flex flex-col"
      style={{ minHeight: "100dvh", background: "oklch(0.97 0.003 265)" }}
    >
      {/* Header */}
      <div
        className="sticky top-0 z-30 px-4 pt-3 pb-0"
        style={{
          background:
            "linear-gradient(135deg, oklch(0.58 0.25 340) 0%, oklch(0.40 0.20 295) 100%)",
          boxShadow: "0 2px 12px oklch(0.40 0.20 295 / 0.3)",
        }}
      >
        <div className="flex items-center gap-3 pb-3">
          <button
            type="button"
            data-ocid="fileshistory.back.button"
            onClick={() => setScreen("profile")}
            className="w-9 h-9 rounded-full flex items-center justify-center transition-opacity hover:opacity-80"
            style={{ background: "oklch(1 0 0 / 0.15)" }}
          >
            <ArrowLeft className="w-5 h-5 text-white" />
          </button>
          <h1 className="font-display text-xl font-bold text-white flex-1">
            Files & History 📂
          </h1>
        </div>

        {/* Tabs */}
        <div className="flex">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              data-ocid={`fileshistory.${tab.id}.tab`}
              onClick={() => setActiveTab(tab.id)}
              className="flex-1 flex flex-col items-center gap-0.5 py-2 text-xs font-semibold transition-all"
              style={{
                color: activeTab === tab.id ? "white" : "oklch(1 0 0 / 0.6)",
                borderBottom:
                  activeTab === tab.id
                    ? "2px solid white"
                    : "2px solid transparent",
              }}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Search + Filter */}
      <div
        className="sticky z-20 px-4 py-3 flex flex-col gap-2"
        style={{ top: "105px", background: "oklch(0.97 0.003 265)" }}
      >
        <div
          className="flex items-center gap-2 px-3 rounded-xl border"
          style={{
            background: "oklch(1 0 0)",
            borderColor: "oklch(0.88 0.005 265)",
          }}
        >
          <Search
            className="w-4 h-4"
            style={{ color: "oklch(0.65 0.05 265)" }}
          />
          <input
            data-ocid="fileshistory.search.input"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search files..."
            className="flex-1 py-2.5 text-sm bg-transparent outline-none text-foreground placeholder:text-muted-foreground"
          />
          {search && (
            <button type="button" onClick={() => setSearch("")}>
              <X
                className="w-4 h-4"
                style={{ color: "oklch(0.65 0.05 265)" }}
              />
            </button>
          )}
        </div>

        {/* Filter chips */}
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
          {filters.map((f) => {
            const isActive = filter === f.id;
            return (
              <button
                key={f.id}
                type="button"
                data-ocid={`fileshistory.filter.${f.id}.toggle`}
                onClick={() => {
                  setFilter(f.id);
                  if (f.id !== "all" && filterMap[f.id].length > 0) {
                    setActiveTab(filterMap[f.id][0]);
                  }
                }}
                className="flex-shrink-0 text-xs font-semibold px-3 py-1.5 rounded-full border transition-all"
                style={{
                  background: isActive
                    ? "oklch(0.58 0.25 340)"
                    : "oklch(1 0 0)",
                  color: isActive ? "white" : "oklch(0.50 0.10 265)",
                  borderColor: isActive
                    ? "oklch(0.58 0.25 340)"
                    : "oklch(0.88 0.005 265)",
                }}
              >
                {f.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 px-4 pb-28">
        {items.length === 0 ? (
          <div
            data-ocid="fileshistory.empty_state"
            className="flex flex-col items-center justify-center py-20 gap-4"
          >
            <FolderOpen
              className="w-16 h-16"
              style={{ color: "oklch(0.75 0.05 265)" }}
            />
            <p className="text-sm text-muted-foreground text-center">
              No files found
              <br />
              <span className="text-xs">
                Try adjusting your search or filter
              </span>
            </p>
          </div>
        ) : activeTab === "images" || activeTab === "videos" ? (
          <div className="grid grid-cols-2 gap-3">
            {items.map((item, idx) => (
              <button
                key={item.id}
                type="button"
                data-ocid={`fileshistory.${activeTab}.item.${idx + 1}`}
                onClick={() => setPreview(item)}
                className="relative rounded-xl overflow-hidden border aspect-square flex flex-col items-center justify-center text-white transition-transform active:scale-95"
                style={{
                  borderColor: "oklch(0.88 0.005 265)",
                  background: item.gradient,
                }}
              >
                {activeTab === "images" ? (
                  <ImageIcon className="w-10 h-10 opacity-60" />
                ) : (
                  <div className="flex flex-col items-center gap-1">
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center"
                      style={{ background: "oklch(1 0 0 / 0.2)" }}
                    >
                      <Play className="w-5 h-5" />
                    </div>
                  </div>
                )}
                {item.eventType && (
                  <div
                    className="absolute top-2 right-2 text-xs font-bold px-1.5 py-0.5 rounded-full"
                    style={{ background: "oklch(0 0 0 / 0.5)" }}
                  >
                    {item.eventType === "SOS Alert"
                      ? "🚨"
                      : item.eventType === "Scan Taxi"
                        ? "🚕"
                        : "🎙️"}
                  </div>
                )}
                <div
                  className="absolute bottom-0 left-0 right-0 px-2 py-1.5 text-left"
                  style={{
                    background:
                      "linear-gradient(0deg, oklch(0 0 0 / 0.7) 0%, transparent 100%)",
                  }}
                >
                  <p className="text-xs font-medium leading-tight">
                    {item.time}
                  </p>
                  {item.location && (
                    <p className="text-xs opacity-75 truncate">
                      {item.location}
                    </p>
                  )}
                </div>
              </button>
            ))}
          </div>
        ) : activeTab === "voice" ? (
          <div className="flex flex-col gap-3">
            {items.map((item, idx) => (
              <div
                key={item.id}
                data-ocid={`fileshistory.voice.item.${idx + 1}`}
                className="rounded-xl border p-4 flex items-center gap-3"
                style={{
                  background: "oklch(1 0 0)",
                  borderColor: "oklch(0.88 0.005 265)",
                }}
              >
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{ background: "oklch(0.95 0.05 340)" }}
                >
                  <Mic
                    className="w-5 h-5"
                    style={{ color: "oklch(0.58 0.25 340)" }}
                  />
                </div>
                <button
                  type="button"
                  className="flex-1 min-w-0 text-left"
                  onClick={() => setPreview(item)}
                >
                  <p className="text-sm font-medium text-foreground truncate">
                    {item.name}
                  </p>
                  <p className="text-xs text-muted-foreground">{item.time}</p>
                  {item.location && (
                    <p
                      className="text-xs"
                      style={{ color: "oklch(0.60 0.10 295)" }}
                    >
                      {item.location}
                    </p>
                  )}
                  {playingId === item.id && (
                    <div className="mt-2">
                      <div
                        className="w-full h-1.5 rounded-full"
                        style={{ background: "oklch(0.90 0.01 265)" }}
                      >
                        <div
                          className="h-1.5 rounded-full transition-all"
                          style={{
                            width: `${audioProgress}%`,
                            background: "oklch(0.58 0.25 340)",
                          }}
                        />
                      </div>
                    </div>
                  )}
                </button>
                <div className="flex flex-col items-end gap-1">
                  {item.duration && (
                    <span className="text-xs text-muted-foreground">
                      {item.duration}
                    </span>
                  )}
                  <button
                    type="button"
                    data-ocid={`fileshistory.voice.play.${idx + 1}`}
                    onClick={() => togglePlay(item.id)}
                    className="w-9 h-9 rounded-full flex items-center justify-center transition-transform active:scale-90"
                    style={{
                      background:
                        "linear-gradient(135deg, oklch(0.58 0.25 340) 0%, oklch(0.40 0.20 295) 100%)",
                    }}
                  >
                    {playingId === item.id ? (
                      <Pause className="w-4 h-4 text-white" />
                    ) : (
                      <Play className="w-4 h-4 text-white" />
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {items.map((item, idx) => (
              <button
                key={item.id}
                type="button"
                data-ocid={`fileshistory.history.item.${idx + 1}`}
                onClick={() => setPreview(item)}
                className="rounded-xl border p-4 flex items-center gap-3 w-full text-left transition-colors hover:bg-muted"
                style={{
                  background: "oklch(1 0 0)",
                  borderColor: "oklch(0.88 0.005 265)",
                }}
              >
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{
                    background:
                      item.eventType === "SOS Alert"
                        ? "oklch(0.95 0.04 22)"
                        : item.eventType === "Scan Taxi"
                          ? "oklch(0.93 0.04 295)"
                          : "oklch(0.95 0.06 80)",
                  }}
                >
                  <HistoryEventIcon type={item.eventType ?? ""} />
                </div>
                <div className="flex-1 min-w-0">
                  {item.eventType && <EventBadge type={item.eventType} />}
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {item.time}
                  </p>
                  {item.location && (
                    <p className="text-xs font-medium text-foreground truncate">
                      {item.location}
                    </p>
                  )}
                </div>
                <span
                  className="text-xs"
                  style={{ color: "oklch(0.65 0.10 295)" }}
                >
                  ›
                </span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Preview Modal */}
      {preview && (
        <div
          data-ocid="fileshistory.preview.modal"
          className="fixed inset-0 z-50 flex items-end justify-center"
          style={{ background: "oklch(0 0 0 / 0.6)" }}
          onClick={() => setPreview(null)}
          onKeyUp={(e) => e.key === "Escape" && setPreview(null)}
          role="presentation"
        >
          <div
            className="w-full max-w-md rounded-t-3xl p-6 flex flex-col gap-4"
            style={{ background: "oklch(0.97 0.003 265)" }}
            onClick={(e) => e.stopPropagation()}
            onKeyUp={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <h3 className="font-display font-bold text-foreground text-lg">
                File Details
              </h3>
              <button
                type="button"
                data-ocid="fileshistory.preview.close.button"
                onClick={() => setPreview(null)}
                className="w-8 h-8 rounded-full flex items-center justify-center"
                style={{ background: "oklch(0.90 0.01 265)" }}
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Preview area */}
            {(preview.type === "image" || preview.type === "video") && (
              <div
                className="w-full h-40 rounded-2xl flex items-center justify-center"
                style={{ background: preview.gradient }}
              >
                {preview.type === "image" ? (
                  <ImageIcon className="w-14 h-14 text-white opacity-70" />
                ) : (
                  <div
                    className="w-14 h-14 rounded-full flex items-center justify-center"
                    style={{ background: "oklch(1 0 0 / 0.2)" }}
                  >
                    <Play className="w-8 h-8 text-white" />
                  </div>
                )}
              </div>
            )}

            {preview.type === "voice" && (
              <div
                className="w-full rounded-2xl p-4 flex flex-col gap-3"
                style={{
                  background: "oklch(1 0 0)",
                  border: "1px solid oklch(0.88 0.005 265)",
                }}
              >
                <div className="flex items-center gap-3">
                  <Mic
                    className="w-6 h-6"
                    style={{ color: "oklch(0.58 0.25 340)" }}
                  />
                  <span className="text-sm font-medium text-foreground">
                    {preview.name}
                  </span>
                  <span className="text-xs text-muted-foreground ml-auto">
                    {preview.duration}
                  </span>
                </div>
                <div
                  className="w-full h-2 rounded-full"
                  style={{ background: "oklch(0.90 0.01 265)" }}
                >
                  <div
                    className="h-2 rounded-full w-1/3"
                    style={{ background: "oklch(0.58 0.25 340)" }}
                  />
                </div>
                <button
                  type="button"
                  onClick={() => togglePlay(preview.id)}
                  className="self-center w-12 h-12 rounded-full flex items-center justify-center"
                  style={{
                    background:
                      "linear-gradient(135deg, oklch(0.58 0.25 340) 0%, oklch(0.40 0.20 295) 100%)",
                  }}
                >
                  {playingId === preview.id ? (
                    <Pause className="w-5 h-5 text-white" />
                  ) : (
                    <Play className="w-5 h-5 text-white" />
                  )}
                </button>
              </div>
            )}

            {/* Details */}
            <div className="flex flex-col gap-1">
              <p className="text-sm font-semibold text-foreground truncate">
                {preview.name}
              </p>
              <p className="text-xs text-muted-foreground">{preview.time}</p>
              {preview.location && (
                <p
                  className="text-xs"
                  style={{ color: "oklch(0.55 0.15 295)" }}
                >
                  📍 {preview.location}
                </p>
              )}
              {preview.eventType && <EventBadge type={preview.eventType} />}
            </div>

            {/* Actions */}
            <div className="flex gap-2">
              <button
                type="button"
                data-ocid="fileshistory.preview.share.button"
                onClick={() => toast.success("Sharing...")}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold text-white transition-opacity hover:opacity-90"
                style={{
                  background:
                    "linear-gradient(135deg, oklch(0.58 0.25 340) 0%, oklch(0.40 0.20 295) 100%)",
                }}
              >
                <Share2 className="w-4 h-4" /> Share
              </button>
              <button
                type="button"
                data-ocid="fileshistory.preview.download.button"
                onClick={() => toast.success("Downloading...")}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition-colors"
                style={{
                  background: "oklch(1 0 0)",
                  border: "1px solid oklch(0.88 0.005 265)",
                  color: "oklch(0.40 0.20 295)",
                }}
              >
                <Download className="w-4 h-4" /> Download
              </button>
              <button
                type="button"
                data-ocid="fileshistory.preview.delete.button"
                onClick={() => {
                  setDeleteTarget(preview);
                }}
                className="w-10 h-10 flex items-center justify-center rounded-xl flex-shrink-0"
                style={{
                  background: "oklch(0.95 0.04 22)",
                  color: "oklch(0.50 0.22 22)",
                }}
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      {deleteTarget && (
        <div
          data-ocid="fileshistory.delete.dialog"
          className="fixed inset-0 z-[60] flex items-center justify-center px-6"
          style={{ background: "oklch(0 0 0 / 0.6)" }}
        >
          <div
            className="w-full max-w-xs rounded-2xl p-6 flex flex-col gap-4"
            style={{ background: "oklch(0.97 0.003 265)" }}
          >
            <div className="text-center">
              <Trash2
                className="w-10 h-10 mx-auto mb-2"
                style={{ color: "oklch(0.50 0.22 22)" }}
              />
              <h4 className="font-bold text-foreground">Delete File?</h4>
              <p className="text-sm text-muted-foreground mt-1">
                Are you sure you want to delete this file? This action cannot be
                undone.
              </p>
            </div>
            <div className="flex gap-3">
              <button
                type="button"
                data-ocid="fileshistory.delete.cancel.button"
                onClick={() => setDeleteTarget(null)}
                className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-foreground border transition-colors hover:bg-muted"
                style={{ borderColor: "oklch(0.88 0.005 265)" }}
              >
                Cancel
              </button>
              <button
                type="button"
                data-ocid="fileshistory.delete.confirm.button"
                onClick={() => handleDelete(deleteTarget)}
                className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white"
                style={{ background: "oklch(0.50 0.22 22)" }}
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
