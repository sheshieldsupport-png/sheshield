import { Bot, Mic, MicOff, Send } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { useApp } from "../context/AppContext";

interface Message {
  id: string;
  sender: "user" | "bot";
  text: string;
  timestamp: Date;
  showSOS?: boolean;
  showScanTaxi?: boolean;
}

interface Report {
  id: string;
  incident: string;
  date: string;
  location: string;
  timestamp: Date;
}

type ReportStep = "idle" | "incident" | "date" | "location";

const QUICK_REPLIES = [
  "I feel unsafe 😨",
  "Report Incident 📝",
  "Safety Tips 🛡️",
];

const MOODS = [
  { emoji: "😔", label: "Sad" },
  { emoji: "😨", label: "Scared" },
  { emoji: "🙂", label: "Happy" },
  { emoji: "😠", label: "Angry" },
];

function detectIntent(text: string): {
  type:
    | "emergency"
    | "sad"
    | "scared"
    | "angry"
    | "report"
    | "safety"
    | "greeting"
    | "scantaxi"
    | "default";
} {
  const t = text.toLowerCase();
  if (
    ["help", "danger", "bachao", "bacho", "emergency", "madad"].some((k) =>
      t.includes(k),
    )
  )
    return { type: "emergency" };
  if (
    ["sad", "dukhi", "rona", "ro rahi", "depression", "lonely", "akela"].some(
      (k) => t.includes(k),
    )
  )
    return { type: "sad" };
  if (
    [
      "scared",
      "dar",
      "dara",
      "darr",
      "afraid",
      "fear",
      "unsafe",
      "khatra",
      "i feel unsafe",
    ].some((k) => t.includes(k))
  )
    return { type: "scared" };
  if (
    ["angry", "gussa", "krodh", "frustrated", "irritated", "pareshan"].some(
      (k) => t.includes(k),
    )
  )
    return { type: "angry" };
  if (
    ["report", "complain", "complaint", "case", "file", "incident"].some((k) =>
      t.includes(k),
    )
  )
    return { type: "report" };
  if (
    ["safety", "tips", "safe kaise", "protect", "suraksha"].some((k) =>
      t.includes(k),
    )
  )
    return { type: "safety" };
  if (
    ["hello", "hi", "hii", "namaste", "namaskar", "hey"].some((k) =>
      t.includes(k),
    )
  )
    return { type: "greeting" };
  if (
    ["scan taxi", "taxi scan", "scan vehicle", "scan car", "taxi check"].some(
      (k) => t.includes(k),
    )
  )
    return { type: "scantaxi" };
  return { type: "default" };
}

function getBotReply(
  intentType: string,
  reportStep: ReportStep,
  _pendingReport: Partial<Report>,
): {
  text: string;
  showSOS?: boolean;
  showScanTaxi?: boolean;
  nextReportStep?: ReportStep;
} {
  if (reportStep === "incident") {
    return {
      text: "Kab hua yeh incident? Date aur time batao:",
      nextReportStep: "date",
    };
  }
  if (reportStep === "date") {
    return {
      text: "Kahan hua? Location batao:",
      nextReportStep: "location",
    };
  }
  if (reportStep === "location") {
    const rptId = `#RPT-${Math.floor(1000 + Math.random() * 9000)}`;
    return {
      text: `✅ Aapki report safely save ho gayi hai.\nYour report ID: ${rptId}\n\nHum aapki privacy maintain karte hain. Report ko authorized personnel hi dekh sakte hain. 🔐`,
      nextReportStep: "idle",
    };
  }

  switch (intentType) {
    case "emergency":
      return {
        text: "🚨 Aap emergency me ho sakte ho!\nPlease turant SOS button press karo ya 112 par call karo.\nMain aapke saath hoon 💖",
        showSOS: true,
      };
    case "sad":
      return {
        text: "Main samajh sakti hoon 😔 Aap akele nahi ho.\nMain yahan hoon aapke saath 💖\nKya aap mujhe batana chahoge kya hua? Main sunna chahti hoon.",
      };
    case "scared":
      return {
        text: "Aapka darna bilkul samajh mein aata hai 😨\nAap safe hain abhi.\n\n🛡️ Safety tips:\n• Kisi trusted person ko location share karo\n• SOS button ready rakho\n• 112 par call karo agar danger ho\n\nKya main SOS activate karoon?",
        showSOS: true,
      };
    case "angry":
      return {
        text: "Main samajh sakti hoon ki aap bahut frustrated feel kar rahe ho 😠\nYeh bilkul natural hai.\n\nEk deep breath lo... Main yahan hoon aapke liye. 💖\nKya aap mujhe bata sakte hain kya hua?",
      };
    case "report":
      return {
        text: "📝 Main aapki report mein help karungi.\nKya hua? Please briefly batao incident ke baare mein:",
        nextReportStep: "incident",
      };
    case "safety":
      return {
        text: "🛡️ Safety Tips:\n\n1. 📍 Hamesha location share karo trusted contacts ke saath\n2. 🚨 SOS button ready rakho\n3. 📞 Emergency numbers yaad rakho: 112, 1091\n4. 🌙 Raat ko akele mat jao\n5. 📱 App active rakho\n6. 🔊 Awaaz uthao agar koi problem ho\n\nAur koi help chahiye? 💖",
      };
    case "greeting":
      return {
        text: "Hello! 😊 Kaise ho aap?\nMain Sakhi AI hoon -- aapki safety companion.\nAap mujhse kuch bhi pooch sakte hain. 💖",
      };
    case "scantaxi":
      return {
        text: "🚕 Taxi scan karna chahte ho?\nMain aapko Scan Taxi feature pe le jaati hoon!\n\nAp vehicle number plate scan karke driver details check kar sakte ho aur Ride Safety Mode activate kar sakte ho. 💖",
        showScanTaxi: true,
      };
    default:
      return {
        text: "Main samajh gayi 😊\nMain aapki help karna chahti hoon.\n\nAap in options mein se choose kar sakte hain:\n• 'Safety Tips' type karo\n• 'Report Incident' type karo\n• Ya apna mood batao: 😔 😨 🙂 😠",
      };
  }
}

function TypingDots() {
  return (
    <div className="flex items-center gap-1 px-4 py-3">
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          className="w-2 h-2 rounded-full"
          style={{ background: "oklch(0.72 0.18 330)" }}
          animate={{ y: [0, -5, 0] }}
          transition={{
            duration: 0.6,
            repeat: Number.POSITIVE_INFINITY,
            delay: i * 0.15,
          }}
        />
      ))}
    </div>
  );
}

function MessageBubble({ msg }: { msg: Message }) {
  const { setScreen } = useApp();
  const isUser = msg.sender === "user";
  const timeStr = msg.timestamp.toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex ${isUser ? "justify-end" : "justify-start"} mb-3`}
    >
      {!isUser && (
        <div
          className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 mr-2 mt-auto"
          style={{
            background: "linear-gradient(135deg, #e91e63, #9c27b0)",
          }}
        >
          <Bot className="w-4 h-4 text-white" />
        </div>
      )}
      <div
        className={`max-w-[78%] ${isUser ? "items-end" : "items-start"} flex flex-col`}
      >
        <div
          className="px-4 py-2.5 rounded-2xl text-sm leading-relaxed whitespace-pre-line"
          style={
            isUser
              ? {
                  background: "linear-gradient(135deg, #e91e63, #9c27b0)",
                  color: "white",
                  borderBottomRightRadius: "4px",
                  boxShadow: "0 2px 12px oklch(0.5 0.25 330 / 0.35)",
                }
              : {
                  background: "oklch(0.18 0.02 280)",
                  color: "oklch(0.92 0.01 280)",
                  border: "1px solid oklch(0.28 0.05 290)",
                  borderBottomLeftRadius: "4px",
                }
          }
        >
          {msg.text}
        </div>
        {msg.showSOS && (
          <motion.button
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            data-ocid="sakhi.sos.button"
            onClick={() => setScreen("emergency")}
            className="mt-2 px-4 py-2 rounded-xl text-xs font-bold text-white flex items-center gap-1.5"
            style={{
              background: "linear-gradient(135deg, #e91e63, #c62828)",
              boxShadow: "0 2px 12px oklch(0.4 0.25 25 / 0.5)",
            }}
          >
            🚨 SOS Emergency Screen Kholein
          </motion.button>
        )}
        {msg.showScanTaxi && (
          <motion.button
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            data-ocid="sakhi.scantaxi.button"
            onClick={() => setScreen("scantaxi")}
            className="mt-2 px-4 py-2 rounded-xl text-xs font-bold text-white flex items-center gap-1.5"
            style={{
              background: "linear-gradient(135deg, #1565c0, #0288d1)",
              boxShadow: "0 2px 12px oklch(0.4 0.22 230 / 0.5)",
            }}
          >
            🚕 Scan Taxi Kholein
          </motion.button>
        )}
        <span
          className="text-[10px] mt-1 px-1"
          style={{ color: "oklch(0.55 0.01 280)" }}
        >
          {timeStr}
        </span>
      </div>
    </motion.div>
  );
}

export default function SakhiAIScreen() {
  const { setScreen } = useApp();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [reportStep, setReportStep] = useState<ReportStep>("idle");
  const [pendingReport, setPendingReport] = useState<Partial<Report>>({});
  const [isListening, setIsListening] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);
  const messagesLenRef = useRef(0);

  const addBotMessage = useCallback(
    (text: string, opts?: { showSOS?: boolean; showScanTaxi?: boolean }) => {
      const msg: Message = {
        id: `bot-${Date.now()}-${Math.random()}`,
        sender: "bot",
        text,
        timestamp: new Date(),
        showSOS: opts?.showSOS,
        showScanTaxi: opts?.showScanTaxi,
      };
      setMessages((prev) => [...prev, msg]);
    },
    [],
  );

  // Welcome message on mount
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsTyping(true);
      setTimeout(() => {
        setIsTyping(false);
        addBotMessage(
          "Hello 👋\nMain Sakhi AI hoon 💖\nMain aapki safety aur support ke liye yahan hoon.\nAap kaisa feel kar rahe ho? 😊",
        );
      }, 1200);
    }, 500);
    return () => clearTimeout(timer);
  }, [addBotMessage]);

  // Auto scroll when messages change
  useEffect(() => {
    const len = messages.length;
    if (len !== messagesLenRef.current || isTyping) {
      messagesLenRef.current = len;
      chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  });

  const handleSend = useCallback(
    (text: string) => {
      const trimmed = text.trim();
      if (!trimmed) return;

      const userMsg: Message = {
        id: `user-${Date.now()}`,
        sender: "user",
        text: trimmed,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, userMsg]);
      setInputText("");

      // Handle report steps
      const currentReportStep = reportStep;
      const updatedReport = { ...pendingReport };

      if (currentReportStep === "incident") {
        updatedReport.incident = trimmed;
      } else if (currentReportStep === "date") {
        updatedReport.date = trimmed;
      } else if (currentReportStep === "location") {
        updatedReport.location = trimmed;
        setPendingReport({});
      }

      const { type } = detectIntent(trimmed);
      const reply = getBotReply(type, currentReportStep, updatedReport);

      if (reply.nextReportStep !== undefined) {
        setReportStep(reply.nextReportStep);
        if (reply.nextReportStep === "incident") {
          setPendingReport({});
        }
      }

      setIsTyping(true);
      const delay = 800 + Math.random() * 500;
      setTimeout(() => {
        setIsTyping(false);
        addBotMessage(reply.text, {
          showSOS: reply.showSOS,
          showScanTaxi: reply.showScanTaxi,
        });
      }, delay);
    },
    [reportStep, pendingReport, addBotMessage],
  );

  const handleVoice = useCallback(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Voice input is not supported in this browser.");
      return;
    }
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
      return;
    }
    const recognition = new SpeechRecognition();
    recognition.lang = "hi-IN";
    recognition.interimResults = false;
    recognition.onresult = (e: any) => {
      const transcript = e.results[0][0].transcript;
      setInputText(transcript);
      setIsListening(false);
    };
    recognition.onerror = () => setIsListening(false);
    recognition.onend = () => setIsListening(false);
    recognitionRef.current = recognition;
    recognition.start();
    setIsListening(true);
  }, [isListening]);

  return (
    <div
      className="flex flex-col h-screen"
      style={{ background: "oklch(0.11 0.02 280)", maxHeight: "100dvh" }}
    >
      {/* Header */}
      <div
        className="flex items-center gap-3 px-4 py-3 flex-shrink-0"
        style={{
          background:
            "linear-gradient(135deg, oklch(0.35 0.18 330) 0%, oklch(0.28 0.15 290) 100%)",
          boxShadow: "0 2px 16px oklch(0.3 0.2 330 / 0.4)",
        }}
      >
        <button
          type="button"
          data-ocid="sakhi.back.button"
          onClick={() => setScreen("home")}
          className="text-white/70 hover:text-white text-xl leading-none mr-1"
        >
          ←
        </button>
        <div
          className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
          style={{
            background: "linear-gradient(135deg, #e91e63, #9c27b0)",
            boxShadow: "0 0 12px oklch(0.5 0.25 330 / 0.6)",
          }}
        >
          <Bot className="w-5 h-5 text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <h1 className="text-white font-bold text-base leading-tight">
            💖 Sakhi AI
          </h1>
          <p className="text-white/60 text-xs">Your Safety Companion</p>
        </div>
        <div className="flex items-center gap-1.5">
          <span
            className="w-2 h-2 rounded-full animate-pulse"
            style={{ background: "#4caf50" }}
          />
          <span className="text-white/60 text-xs">Online</span>
        </div>
      </div>

      {/* Chat Area */}
      <div
        className="flex-1 overflow-y-auto px-3 py-4"
        style={{ background: "oklch(0.11 0.02 280)" }}
      >
        <AnimatePresence initial={false}>
          {messages.map((msg) => (
            <MessageBubble key={msg.id} msg={msg} />
          ))}
        </AnimatePresence>

        {isTyping && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="flex items-end gap-2 mb-3"
          >
            <div
              className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0"
              style={{
                background: "linear-gradient(135deg, #e91e63, #9c27b0)",
              }}
            >
              <Bot className="w-4 h-4 text-white" />
            </div>
            <div
              className="rounded-2xl rounded-bl-sm"
              style={{
                background: "oklch(0.18 0.02 280)",
                border: "1px solid oklch(0.28 0.05 290)",
              }}
            >
              <TypingDots />
            </div>
          </motion.div>
        )}
        <div ref={chatEndRef} />
      </div>

      {/* Mood Selector */}
      <div
        className="px-3 py-2 flex items-center gap-2 flex-shrink-0"
        style={{ borderTop: "1px solid oklch(0.2 0.03 280)" }}
      >
        <span className="text-xs" style={{ color: "oklch(0.55 0.05 280)" }}>
          Mood:
        </span>
        {MOODS.map((m) => (
          <button
            key={m.label}
            type="button"
            data-ocid={`sakhi.mood.${m.label.toLowerCase()}.button`}
            onClick={() => handleSend(`${m.emoji} ${m.label}`)}
            className="text-xl hover:scale-110 transition-transform active:scale-90"
            title={m.label}
          >
            {m.emoji}
          </button>
        ))}
      </div>

      {/* Quick Replies */}
      <div
        className="px-3 py-2 flex gap-2 overflow-x-auto flex-shrink-0"
        style={{ borderTop: "1px solid oklch(0.2 0.03 280)" }}
      >
        {QUICK_REPLIES.map((qr) => (
          <button
            key={qr}
            type="button"
            data-ocid="sakhi.quickreply.button"
            onClick={() => handleSend(qr)}
            className="flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-all active:scale-95"
            style={{
              background: "oklch(0.18 0.05 290)",
              border: "1px solid oklch(0.35 0.12 310)",
              color: "oklch(0.85 0.12 320)",
            }}
          >
            {qr}
          </button>
        ))}
      </div>

      {/* Input Area */}
      <div
        className="px-3 py-3 flex items-center gap-2 flex-shrink-0"
        style={{
          background: "oklch(0.14 0.02 280)",
          borderTop: "1px solid oklch(0.22 0.04 280)",
        }}
      >
        <button
          type="button"
          data-ocid="sakhi.voice.button"
          onClick={handleVoice}
          className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 transition-all active:scale-90"
          style={{
            background: isListening
              ? "linear-gradient(135deg, #e91e63, #c62828)"
              : "oklch(0.22 0.04 280)",
            boxShadow: isListening
              ? "0 0 12px oklch(0.5 0.25 25 / 0.6)"
              : "none",
          }}
        >
          {isListening ? (
            <MicOff className="w-4 h-4 text-white" />
          ) : (
            <Mic
              className="w-4 h-4"
              style={{ color: "oklch(0.72 0.12 310)" }}
            />
          )}
        </button>

        <input
          data-ocid="sakhi.chat.input"
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend(inputText)}
          placeholder="Kuch bhi poochhein... 💬"
          className="flex-1 px-4 py-2.5 rounded-full text-sm outline-none"
          style={{
            background: "oklch(0.18 0.02 280)",
            border: "1px solid oklch(0.28 0.05 290)",
            color: "oklch(0.92 0.01 280)",
          }}
        />

        <button
          type="button"
          data-ocid="sakhi.send.button"
          onClick={() => handleSend(inputText)}
          disabled={!inputText.trim()}
          className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 transition-all active:scale-90 disabled:opacity-40"
          style={{
            background: "linear-gradient(135deg, #e91e63, #9c27b0)",
            boxShadow: inputText.trim()
              ? "0 2px 12px oklch(0.5 0.25 330 / 0.4)"
              : "none",
          }}
        >
          <Send className="w-4 h-4 text-white" />
        </button>
      </div>
    </div>
  );
}
