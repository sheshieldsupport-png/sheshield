import {
  ChevronLeft,
  Download,
  Film,
  Image,
  Mic,
  Play,
  Trash2,
  X,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { useApp } from "../context/AppContext";
import type { MediaItem } from "../types/app";

const STORAGE_KEY = "sheshield_media_history";

function loadMedia(): MediaItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as MediaItem[];
  } catch {
    return [];
  }
}

function saveMedia(items: MediaItem[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

type Tab = "all" | "video" | "photo" | "audio";

export default function MediaHistoryScreen() {
  const { setScreen, blobUrlMap } = useApp();
  const [items, setItems] = useState<MediaItem[]>(loadMedia);
  const [tab, setTab] = useState<Tab>("all");
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [playingId, setPlayingId] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    setItems(loadMedia());
  }, []);

  const filtered = items.filter((i) => tab === "all" || i.type === tab);

  function confirmDelete(id: string) {
    setDeleteId(id);
  }

  function doDelete(id: string) {
    const next = items.filter((i) => i.id !== id);
    setItems(next);
    saveMedia(next);
    setDeleteId(null);
    toast.success("File deleted");
  }

  function handleDownload(item: MediaItem) {
    if (item.type === "photo" && item.dataUrl) {
      const a = document.createElement("a");
      a.href = item.dataUrl;
      a.download = item.name;
      a.click();
    } else {
      const blobUrl = blobUrlMap?.get(item.id);
      if (blobUrl) {
        const a = document.createElement("a");
        a.href = blobUrl;
        a.download = item.name;
        a.click();
      } else {
        toast.error("File not available in this session");
      }
    }
  }

  function handlePlay(item: MediaItem) {
    if (playingId === item.id) {
      setPlayingId(null);
      return;
    }
    const blobUrl =
      item.type === "photo" ? item.dataUrl : blobUrlMap?.get(item.id);
    if (!blobUrl) {
      toast.error("Recording not available in this session");
      return;
    }
    setPlayingId(item.id);
  }

  function formatTs(ts: string) {
    try {
      return new Date(ts).toLocaleString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return ts;
    }
  }

  const iconFor = (type: MediaItem["type"]) => {
    if (type === "video") return Film;
    if (type === "photo") return Image;
    return Mic;
  };

  const colorFor = (type: MediaItem["type"]) => {
    if (type === "video") return "oklch(0.50 0.22 25)";
    if (type === "photo") return "oklch(0.55 0.18 145)";
    return "oklch(0.55 0.17 300)";
  };

  const bgFor = (type: MediaItem["type"]) => {
    if (type === "video") return "oklch(0.50 0.22 25 / 0.1)";
    if (type === "photo") return "oklch(0.55 0.18 145 / 0.1)";
    return "oklch(0.55 0.17 300 / 0.1)";
  };

  const tabs: { id: Tab; label: string }[] = [
    { id: "all", label: "All" },
    { id: "video", label: "Videos" },
    { id: "photo", label: "Photos" },
    { id: "audio", label: "Audio" },
  ];

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ background: "oklch(0.97 0.003 265)" }}
    >
      {/* Header */}
      <div
        className="sticky top-0 z-30 flex items-center gap-3 px-4 py-3"
        style={{
          background: "oklch(1 0 0 / 0.95)",
          backdropFilter: "blur(12px)",
          borderBottom: "1px solid oklch(0.88 0.005 265)",
          boxShadow: "0 1px 4px oklch(0 0 0 / 0.06)",
        }}
      >
        <button
          type="button"
          data-ocid="media.back.button"
          onClick={() => setScreen("home")}
          className="w-9 h-9 rounded-xl flex items-center justify-center transition-all active:scale-90"
          style={{ background: "oklch(0.94 0.005 265)" }}
        >
          <ChevronLeft className="w-5 h-5 text-foreground" />
        </button>
        <div className="flex-1">
          <h1 className="font-display font-bold text-lg text-foreground">
            Media History
          </h1>
          <p className="text-xs text-muted-foreground">
            {items.length} file{items.length !== 1 ? "s" : ""} saved
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 px-4 pt-4 pb-2 overflow-x-auto">
        {tabs.map((t) => (
          <button
            key={t.id}
            type="button"
            data-ocid={`media.${t.id}.tab`}
            onClick={() => setTab(t.id)}
            className="flex-shrink-0 px-4 py-1.5 rounded-full text-xs font-semibold transition-all"
            style={{
              background:
                tab === t.id
                  ? "linear-gradient(135deg, oklch(0.58 0.25 340), oklch(0.40 0.20 295))"
                  : "oklch(0.94 0.005 265)",
              color: tab === t.id ? "white" : "oklch(0.45 0.01 265)",
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* List */}
      <div className="flex-1 px-4 py-2 space-y-3 pb-8">
        {filtered.length === 0 && (
          <div
            data-ocid="media.empty_state"
            className="flex flex-col items-center justify-center py-20 gap-3"
          >
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center"
              style={{ background: "oklch(0.58 0.25 340 / 0.1)" }}
            >
              <Film
                className="w-8 h-8"
                style={{ color: "oklch(0.58 0.25 340)" }}
              />
            </div>
            <p className="text-sm font-semibold text-foreground">
              No recordings yet
            </p>
            <p className="text-xs text-muted-foreground text-center">
              Tap Record on the home screen to capture videos, photos, or audio.
            </p>
          </div>
        )}

        {filtered.map((item, idx) => {
          const Icon = iconFor(item.type);
          const blobUrl =
            item.type === "photo" ? item.dataUrl : blobUrlMap?.get(item.id);
          const isPlaying = playingId === item.id;

          return (
            <div
              key={item.id}
              data-ocid={`media.item.${idx + 1}`}
              className="rounded-2xl border overflow-hidden"
              style={{
                background: "oklch(1 0 0)",
                borderColor: "oklch(0.88 0.005 265)",
                boxShadow: "0 1px 4px oklch(0 0 0 / 0.05)",
              }}
            >
              {/* Photo thumbnail */}
              {item.type === "photo" && item.dataUrl && (
                <img
                  src={item.dataUrl}
                  alt={item.name}
                  className="w-full h-40 object-cover"
                />
              )}

              {/* Video player (when playing) */}
              {item.type === "video" && isPlaying && blobUrl && (
                <video
                  ref={videoRef}
                  src={blobUrl}
                  controls
                  autoPlay
                  className="w-full max-h-48 bg-black"
                >
                  <track kind="captions" />
                </video>
              )}

              {/* Audio player (when playing) */}
              {item.type === "audio" && isPlaying && blobUrl && (
                <div className="p-4 pb-0">
                  <audio
                    ref={audioRef}
                    src={blobUrl}
                    controls
                    autoPlay
                    className="w-full"
                  >
                    <track kind="captions" />
                  </audio>
                </div>
              )}

              <div className="p-4 flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: bgFor(item.type) }}
                >
                  <Icon
                    className="w-5 h-5"
                    style={{ color: colorFor(item.type) }}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-foreground truncate">
                    {item.name}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {formatTs(item.timestamp)}
                  </p>
                  {!blobUrl && item.type !== "photo" && (
                    <p
                      className="text-[10px] mt-0.5"
                      style={{ color: "oklch(0.55 0.18 50)" }}
                    >
                      Not available in this session
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-1 flex-shrink-0">
                  {/* Play button for video/audio */}
                  {item.type !== "photo" && (
                    <button
                      type="button"
                      data-ocid="media.play.button"
                      onClick={() => handlePlay(item)}
                      className="w-8 h-8 rounded-lg flex items-center justify-center transition-all active:scale-90"
                      style={{
                        background: isPlaying
                          ? "oklch(0.58 0.25 340 / 0.15)"
                          : "oklch(0.94 0.005 265)",
                      }}
                    >
                      {isPlaying ? (
                        <X
                          className="w-4 h-4"
                          style={{ color: "oklch(0.58 0.25 340)" }}
                        />
                      ) : (
                        <Play className="w-4 h-4 text-foreground" />
                      )}
                    </button>
                  )}
                  {/* Download */}
                  <button
                    type="button"
                    data-ocid="media.download.button"
                    onClick={() => handleDownload(item)}
                    className="w-8 h-8 rounded-lg flex items-center justify-center transition-all active:scale-90"
                    style={{ background: "oklch(0.94 0.005 265)" }}
                  >
                    <Download className="w-4 h-4 text-foreground" />
                  </button>
                  {/* Delete */}
                  <button
                    type="button"
                    data-ocid={`media.delete_button.${idx + 1}`}
                    onClick={() => confirmDelete(item.id)}
                    className="w-8 h-8 rounded-lg flex items-center justify-center transition-all active:scale-90"
                    style={{ background: "oklch(0.50 0.22 25 / 0.08)" }}
                  >
                    <Trash2
                      className="w-4 h-4"
                      style={{ color: "oklch(0.50 0.22 25)" }}
                    />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Delete confirm dialog */}
      {deleteId && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center px-6"
          style={{ background: "oklch(0 0 0 / 0.5)" }}
        >
          <div
            data-ocid="media.dialog"
            className="w-full max-w-xs rounded-2xl p-6"
            style={{ background: "oklch(1 0 0)" }}
          >
            <h3 className="font-bold text-lg text-foreground mb-2">
              Delete File?
            </h3>
            <p className="text-sm text-muted-foreground mb-5">
              This will permanently delete the recording from your device.
            </p>
            <div className="flex gap-3">
              <button
                type="button"
                data-ocid="media.cancel_button"
                onClick={() => setDeleteId(null)}
                className="flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all"
                style={{
                  background: "oklch(0.94 0.005 265)",
                  color: "oklch(0.35 0.01 265)",
                }}
              >
                Cancel
              </button>
              <button
                type="button"
                data-ocid="media.confirm_button"
                onClick={() => doDelete(deleteId)}
                className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white transition-all"
                style={{ background: "oklch(0.50 0.22 25)" }}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
