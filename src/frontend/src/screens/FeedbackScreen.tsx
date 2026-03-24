import { Button } from "@/components/ui/button";
import { MessageSquare, Send, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface FeedbackEntry {
  id: string;
  emoji: string;
  message: string;
  email?: string;
  time: string;
}

const EMOJIS = [
  { icon: "😡", label: "Very Bad" },
  { icon: "😕", label: "Bad" },
  { icon: "😐", label: "Okay" },
  { icon: "🙂", label: "Good" },
  { icon: "😍", label: "Love it" },
];

const INITIAL_FEEDBACKS: FeedbackEntry[] = [
  {
    id: "1",
    emoji: "😍",
    message: "Feeling safe using this app",
    time: "2 days ago",
  },
  { id: "2", emoji: "🙂", message: "Very helpful app!", time: "3 days ago" },
  {
    id: "3",
    emoji: "😍",
    message: "Amazing safety features. I feel protected!",
    time: "5 days ago",
  },
  {
    id: "4",
    emoji: "🙂",
    message: "SOS button works perfectly. Good job team SheShield!",
    time: "1 week ago",
  },
];

export default function FeedbackScreen() {
  const [message, setMessage] = useState("");
  const [email, setEmail] = useState("");
  const [selectedEmoji, setSelectedEmoji] = useState<number | null>(null);
  const [feedbacks, setFeedbacks] =
    useState<FeedbackEntry[]>(INITIAL_FEEDBACKS);
  const [showSuccess, setShowSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const successTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (successTimerRef.current) clearTimeout(successTimerRef.current);
    };
  }, []);

  function handleSubmit() {
    if (!message.trim() || selectedEmoji === null) return;
    setSubmitting(true);
    setTimeout(() => {
      const newEntry: FeedbackEntry = {
        id: Date.now().toString(),
        emoji: EMOJIS[selectedEmoji].icon,
        message: message.trim(),
        email: email.trim() || undefined,
        time: "Just now",
      };
      setFeedbacks((prev) => [newEntry, ...prev]);
      setMessage("");
      setEmail("");
      setSelectedEmoji(null);
      setSubmitting(false);
      setShowSuccess(true);
      successTimerRef.current = setTimeout(() => setShowSuccess(false), 4000);
    }, 900);
  }

  const canSubmit = message.trim().length > 0 && selectedEmoji !== null;

  return (
    <div className="flex flex-col gap-5 pb-8 animate-slide-up">
      {/* Header */}
      <div
        className="rounded-2xl p-6 flex flex-col items-center gap-2 text-center relative overflow-hidden"
        style={{
          background:
            "linear-gradient(135deg, oklch(0.58 0.25 340) 0%, oklch(0.45 0.22 295) 55%, oklch(0.40 0.18 265) 100%)",
          boxShadow: "0 4px 24px oklch(0.58 0.25 340 / 0.35)",
        }}
      >
        {/* Decorative blobs */}
        <div
          className="absolute top-0 right-0 w-32 h-32 rounded-full opacity-20"
          style={{
            background:
              "radial-gradient(circle, oklch(0.90 0.10 60), transparent)",
            transform: "translate(30%, -30%)",
          }}
        />
        <div
          className="absolute bottom-0 left-0 w-24 h-24 rounded-full opacity-15"
          style={{
            background:
              "radial-gradient(circle, oklch(0.85 0.12 340), transparent)",
            transform: "translate(-30%, 30%)",
          }}
        />
        <div
          className="w-14 h-14 rounded-full flex items-center justify-center mb-1"
          style={{ background: "oklch(1 0 0 / 0.18)" }}
        >
          <MessageSquare className="w-7 h-7 text-white" />
        </div>
        <h1 className="font-display text-2xl font-bold text-white">
          We Value Your Feedback 💬
        </h1>
        <p className="text-sm" style={{ color: "oklch(1 0 0 / 0.85)" }}>
          Help us improve SheShield
        </p>
      </div>

      {/* Form Card */}
      <div
        className="rounded-2xl p-5 border flex flex-col gap-4"
        style={{
          background: "oklch(1 0 0)",
          borderColor: "oklch(0.88 0.005 265)",
          boxShadow: "0 2px 12px oklch(0 0 0 / 0.06)",
        }}
      >
        {/* Emoji Rating */}
        <div>
          <p className="text-sm font-semibold text-foreground mb-3">
            How was your experience?
          </p>
          <div className="flex justify-between gap-2">
            {EMOJIS.map((e, i) => (
              <button
                key={e.icon}
                type="button"
                onClick={() => setSelectedEmoji(i)}
                className="flex flex-col items-center gap-1 flex-1 rounded-xl py-2.5 transition-all duration-200"
                style={{
                  background:
                    selectedEmoji === i
                      ? "linear-gradient(135deg, oklch(0.58 0.25 340 / 0.12), oklch(0.45 0.22 295 / 0.12))"
                      : "oklch(0.97 0.003 265)",
                  border:
                    selectedEmoji === i
                      ? "2px solid oklch(0.58 0.25 340 / 0.6)"
                      : "2px solid transparent",
                  transform: selectedEmoji === i ? "scale(1.08)" : "scale(1)",
                  boxShadow:
                    selectedEmoji === i
                      ? "0 2px 10px oklch(0.58 0.25 340 / 0.25)"
                      : "none",
                }}
              >
                <span className="text-2xl" style={{ lineHeight: 1 }}>
                  {e.icon}
                </span>
                <span
                  className="text-xs"
                  style={{
                    color:
                      selectedEmoji === i
                        ? "oklch(0.50 0.22 340)"
                        : "oklch(0.55 0.01 265)",
                    fontWeight: selectedEmoji === i ? 600 : 400,
                  }}
                >
                  {e.label}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Message */}
        <div>
          <p className="text-sm font-semibold text-foreground mb-1.5">
            Your Message
          </p>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Tell us more about your experience..."
            rows={4}
            className="w-full rounded-xl px-4 py-3 text-sm resize-none outline-none transition-all duration-200"
            style={{
              background: "oklch(0.97 0.003 265)",
              border: "1.5px solid oklch(0.88 0.005 265)",
              color: "oklch(0.20 0.005 265)",
              lineHeight: "1.6",
            }}
            onFocus={(e) => {
              e.currentTarget.style.borderColor = "oklch(0.58 0.25 340 / 0.6)";
              e.currentTarget.style.boxShadow =
                "0 0 0 3px oklch(0.58 0.25 340 / 0.08)";
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = "oklch(0.88 0.005 265)";
              e.currentTarget.style.boxShadow = "none";
            }}
          />
        </div>

        {/* Email */}
        <div>
          <p className="text-sm font-semibold text-foreground mb-1.5">
            Email (Optional)
          </p>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email (optional)"
            className="w-full rounded-xl px-4 py-3 text-sm outline-none transition-all duration-200"
            style={{
              background: "oklch(0.97 0.003 265)",
              border: "1.5px solid oklch(0.88 0.005 265)",
              color: "oklch(0.20 0.005 265)",
            }}
            onFocus={(e) => {
              e.currentTarget.style.borderColor = "oklch(0.58 0.25 340 / 0.6)";
              e.currentTarget.style.boxShadow =
                "0 0 0 3px oklch(0.58 0.25 340 / 0.08)";
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = "oklch(0.88 0.005 265)";
              e.currentTarget.style.boxShadow = "none";
            }}
          />
        </div>

        {/* Submit */}
        <button
          type="button"
          onClick={handleSubmit}
          disabled={!canSubmit || submitting}
          className="w-full h-12 rounded-xl font-bold text-base text-white transition-all duration-200 flex items-center justify-center gap-2"
          style={{
            background:
              canSubmit && !submitting
                ? "linear-gradient(135deg, oklch(0.58 0.25 340) 0%, oklch(0.45 0.22 295) 100%)"
                : "oklch(0.85 0.01 265)",
            boxShadow:
              canSubmit && !submitting
                ? "0 4px 18px oklch(0.58 0.25 340 / 0.40), 0 0 0 0px oklch(0.58 0.25 340 / 0.2)"
                : "none",
            cursor: canSubmit && !submitting ? "pointer" : "not-allowed",
            transform: canSubmit && !submitting ? "translateY(0)" : undefined,
          }}
        >
          {submitting ? (
            <span className="flex items-center gap-2">
              <span className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
              Submitting...
            </span>
          ) : (
            <>
              <Send className="w-4 h-4" />
              Submit Feedback 🚀
            </>
          )}
        </button>
      </div>

      {/* Feedback list */}
      {feedbacks.length > 0 && (
        <div className="flex flex-col gap-3">
          <h2 className="font-display text-base font-bold text-foreground">
            Community Feedback
          </h2>
          {feedbacks.map((fb) => (
            <div
              key={fb.id}
              className="rounded-2xl p-4 border flex items-start gap-3 transition-all"
              style={{
                background: "oklch(1 0 0)",
                borderColor: "oklch(0.88 0.005 265)",
                boxShadow: "0 1px 6px oklch(0 0 0 / 0.05)",
              }}
            >
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 text-xl"
                style={{
                  background:
                    "linear-gradient(135deg, oklch(0.58 0.25 340 / 0.10), oklch(0.45 0.22 295 / 0.10))",
                  border: "1px solid oklch(0.58 0.25 340 / 0.15)",
                }}
              >
                {fb.emoji}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-foreground leading-relaxed">
                  "{fb.message}"
                </p>
                <p className="text-xs text-muted-foreground mt-1">{fb.time}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Success Popup */}
      {showSuccess && (
        <div
          className="fixed inset-0 flex items-center justify-center z-50 px-6"
          style={{ background: "oklch(0 0 0 / 0.45)" }}
          onClick={() => setShowSuccess(false)}
          onKeyDown={(e) => e.key === "Escape" && setShowSuccess(false)}
        >
          <div
            className="rounded-3xl p-8 flex flex-col items-center gap-4 text-center max-w-sm w-full relative"
            style={{
              background: "oklch(1 0 0)",
              boxShadow: "0 20px 60px oklch(0.58 0.25 340 / 0.30)",
              animation: "slideUp 0.3s ease-out",
            }}
            onClick={(e) => e.stopPropagation()}
            onKeyDown={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setShowSuccess(false)}
              className="absolute top-4 right-4 text-muted-foreground hover:text-foreground"
            >
              <X className="w-5 h-5" />
            </button>
            <div
              className="w-20 h-20 rounded-full flex items-center justify-center text-4xl"
              style={{
                background:
                  "linear-gradient(135deg, oklch(0.58 0.25 340 / 0.15), oklch(0.45 0.22 295 / 0.15))",
              }}
            >
              💖
            </div>
            <div>
              <h3 className="font-display text-xl font-bold text-foreground mb-2">
                Thank you for your feedback 💖
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Your response helps us make SheShield safer for everyone.
              </p>
            </div>
            <div
              className="w-full rounded-xl p-4 text-left"
              style={{
                background:
                  "linear-gradient(135deg, oklch(0.58 0.25 340 / 0.06), oklch(0.45 0.22 295 / 0.06))",
                border: "1px solid oklch(0.58 0.25 340 / 0.15)",
              }}
            >
              <p
                className="text-xs font-semibold mb-1"
                style={{ color: "oklch(0.50 0.22 340)" }}
              >
                📩 Auto Email Sent:
              </p>
              <p className="text-xs text-muted-foreground leading-relaxed">
                "Hello, thank you for sharing your valuable feedback with
                SheShield 💖 We are continuously working to make the app better
                and safer. Stay safe, Team SheShield 🛡️"
              </p>
            </div>
            <Button
              onClick={() => setShowSuccess(false)}
              className="w-full h-11 font-bold"
              style={{
                background:
                  "linear-gradient(135deg, oklch(0.58 0.25 340), oklch(0.45 0.22 295))",
                color: "white",
                border: "none",
                boxShadow: "0 4px 14px oklch(0.58 0.25 340 / 0.35)",
              }}
            >
              Done ✨
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
