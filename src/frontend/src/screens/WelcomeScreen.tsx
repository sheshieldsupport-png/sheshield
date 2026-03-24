import { useEffect, useState } from "react";

interface WelcomeScreenProps {
  onLogin: () => void;
  onSignUp: () => void;
}

const particles = [
  {
    id: "p1",
    size: 6,
    top: "12%",
    left: "8%",
    duration: 8,
    delay: 0,
    color: "#e879a0",
  },
  {
    id: "p2",
    size: 4,
    top: "25%",
    left: "88%",
    duration: 11,
    delay: 1.5,
    color: "#9b59b6",
  },
  {
    id: "p3",
    size: 8,
    top: "40%",
    left: "5%",
    duration: 9,
    delay: 0.8,
    color: "#e91e8c",
  },
  {
    id: "p4",
    size: 5,
    top: "60%",
    left: "92%",
    duration: 13,
    delay: 2.5,
    color: "#e879a0",
  },
  {
    id: "p5",
    size: 10,
    top: "75%",
    left: "15%",
    duration: 7,
    delay: 1,
    color: "#9b59b6",
  },
  {
    id: "p6",
    size: 4,
    top: "18%",
    left: "65%",
    duration: 12,
    delay: 3,
    color: "#e879a0",
  },
  {
    id: "p7",
    size: 7,
    top: "50%",
    left: "78%",
    duration: 10,
    delay: 0.3,
    color: "#e91e8c",
  },
  {
    id: "p8",
    size: 5,
    top: "85%",
    left: "55%",
    duration: 8.5,
    delay: 4,
    color: "#9b59b6",
  },
  {
    id: "p9",
    size: 6,
    top: "33%",
    left: "30%",
    duration: 14,
    delay: 2,
    color: "#e879a0",
  },
  {
    id: "p10",
    size: 9,
    top: "68%",
    left: "42%",
    duration: 6,
    delay: 1.2,
    color: "#e91e8c",
  },
];

export default function WelcomeScreen({
  onLogin,
  onSignUp,
}: WelcomeScreenProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 50);
    return () => clearTimeout(t);
  }, []);

  const fadeStyle = (delay: number): React.CSSProperties => ({
    opacity: mounted ? 1 : 0,
    transform: mounted ? "translateY(0)" : "translateY(30px)",
    transition: `opacity 0.7s ease-out ${delay}s, transform 0.7s ease-out ${delay}s`,
  });

  return (
    <div
      className="relative min-h-screen flex flex-col items-center overflow-hidden"
      style={{
        background:
          "linear-gradient(135deg, #0d0015, #1a0030, #2d0040, #3d0030, #1a0010)",
        backgroundSize: "300% 300%",
        animation: "gradient-shift 8s ease infinite",
      }}
    >
      {/* Floating particles */}
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute rounded-full animate-float-up"
          style={{
            width: p.size,
            height: p.size,
            top: p.top,
            left: p.left,
            backgroundColor: p.color,
            boxShadow: `0 0 ${p.size * 2}px ${p.color}, 0 0 ${p.size * 4}px ${p.color}80`,
            filter: "blur(0.5px)",
            animationDuration: `${p.duration}s`,
            animationDelay: `${p.delay}s`,
          }}
        />
      ))}

      {/* Top Section — Logo */}
      <div
        className="flex flex-col items-center"
        style={{ paddingTop: "64px", ...fadeStyle(0.1) }}
      >
        <div
          className="animate-glow-pulse-shield rounded-full p-3 mb-3"
          style={{
            background: "rgba(232,121,160,0.08)",
            border: "1px solid rgba(232,121,160,0.2)",
          }}
        >
          <img
            src="/assets/uploads/ChatGPT-Image-Mar-20-2026-06_43_53-PM-1.png"
            className="w-24 h-24 object-contain rounded-full"
            alt="SheShield Logo"
          />
        </div>
        <h1
          className="font-bold text-white text-center"
          style={{
            fontFamily: "'Bricolage Grotesque', sans-serif",
            fontSize: "2.5rem",
            letterSpacing: "0.04em",
            textShadow: "0 0 30px rgba(232,121,160,0.6)",
          }}
        >
          SheShield
        </h1>
        <p
          className="text-sm italic text-center animate-shimmer-text"
          style={{
            color: "#e879a0",
            letterSpacing: "0.06em",
            marginTop: "4px",
          }}
        >
          Her Safety, Our Priority
        </p>
      </div>

      {/* Middle Section — Illustration */}
      <div
        className="flex flex-col items-center px-8"
        style={{ marginTop: "32px", ...fadeStyle(0.3) }}
      >
        <svg
          width="200"
          height="220"
          viewBox="0 0 200 220"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          role="img"
          aria-label="Woman protected by SheShield"
        >
          <title>Woman protected by SheShield</title>
          <defs>
            <linearGradient id="shieldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#e879a0" stopOpacity="0.85" />
              <stop offset="100%" stopColor="#6c3483" stopOpacity="0.95" />
            </linearGradient>
            <linearGradient
              id="shieldInner"
              x1="0%"
              y1="0%"
              x2="100%"
              y2="100%"
            >
              <stop offset="0%" stopColor="#e879a0" stopOpacity="0.2" />
              <stop offset="100%" stopColor="#9b59b6" stopOpacity="0.3" />
            </linearGradient>
            <filter id="glow" x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur stdDeviation="4" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            <filter id="softGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="2" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
          {/* Outer glow ring */}
          <ellipse
            cx="100"
            cy="110"
            rx="72"
            ry="80"
            fill="#e879a0"
            opacity="0.06"
          />
          {/* Shield body */}
          <path
            d="M100 22 L168 52 L168 114 Q168 164 100 198 Q32 164 32 114 L32 52 Z"
            fill="url(#shieldGrad)"
            filter="url(#glow)"
            opacity="0.92"
          />
          {/* Shield inner highlight */}
          <path
            d="M100 32 L158 58 L158 112 Q158 156 100 186 Q42 156 42 112 L42 58 Z"
            fill="url(#shieldInner)"
          />
          {/* Shield border */}
          <path
            d="M100 22 L168 52 L168 114 Q168 164 100 198 Q32 164 32 114 L32 52 Z"
            stroke="#e879a0"
            strokeWidth="1.5"
            fill="none"
            opacity="0.6"
          />
          {/* Woman head */}
          <circle
            cx="100"
            cy="82"
            r="17"
            fill="white"
            opacity="0.92"
            filter="url(#softGlow)"
          />
          {/* Woman hair */}
          <path
            d="M83 78 Q84 65 100 64 Q116 65 117 78 Q112 70 100 69 Q88 70 83 78Z"
            fill="#e879a0"
            opacity="0.8"
          />
          {/* Woman body */}
          <path
            d="M80 112 Q80 100 100 97 Q120 100 120 112 L116 148 L84 148 Z"
            fill="white"
            opacity="0.88"
            filter="url(#softGlow)"
          />
          {/* Checkmark */}
          <path
            d="M87 130 L95 139 L115 117"
            stroke="#e879a0"
            strokeWidth="4.5"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            opacity="0.9"
          />
          {/* Sparkle dots */}
          <circle cx="54" cy="68" r="3" fill="#e879a0" opacity="0.7" />
          <circle cx="146" cy="68" r="2" fill="#9b59b6" opacity="0.7" />
          <circle cx="48" cy="130" r="2" fill="#e879a0" opacity="0.5" />
          <circle cx="152" cy="130" r="3" fill="#9b59b6" opacity="0.5" />
        </svg>
      </div>

      {/* Emotional message */}
      <div
        className="px-8 text-center"
        style={{ marginTop: "20px", maxWidth: "320px", ...fadeStyle(0.5) }}
      >
        <p
          style={{
            color: "rgba(255,255,255,0.88)",
            fontSize: "1rem",
            lineHeight: "1.7",
            fontFamily: "'Figtree', sans-serif",
          }}
        >
          Your safety matters.{" "}
          <span style={{ color: "#e879a0", fontWeight: 600 }}>
            Stay protected
          </span>{" "}
          anytime, anywhere with SheShield.
        </p>
      </div>

      {/* Bottom Section — Buttons */}
      <div
        className="flex flex-col items-center w-full px-8"
        style={{ marginTop: "36px", maxWidth: "360px", ...fadeStyle(0.7) }}
      >
        <button
          type="button"
          data-ocid="welcome.login.primary_button"
          onClick={onLogin}
          style={{
            width: "100%",
            maxWidth: "320px",
            height: "52px",
            borderRadius: "26px",
            background: "linear-gradient(135deg, #e91e8c, #9b27af, #673ab7)",
            color: "white",
            fontWeight: 700,
            fontSize: "1rem",
            letterSpacing: "0.04em",
            border: "none",
            cursor: "pointer",
            boxShadow:
              "0 4px 20px rgba(233, 30, 140, 0.5), 0 2px 8px rgba(103, 58, 183, 0.3)",
            fontFamily: "'Figtree', sans-serif",
            transition: "transform 0.18s, box-shadow 0.18s",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "scale(1.03)";
            e.currentTarget.style.boxShadow =
              "0 6px 28px rgba(233, 30, 140, 0.7), 0 4px 12px rgba(103, 58, 183, 0.5)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "scale(1)";
            e.currentTarget.style.boxShadow =
              "0 4px 20px rgba(233, 30, 140, 0.5), 0 2px 8px rgba(103, 58, 183, 0.3)";
          }}
        >
          Login
        </button>

        <button
          type="button"
          data-ocid="welcome.signup.secondary_button"
          onClick={onSignUp}
          style={{
            width: "100%",
            maxWidth: "320px",
            height: "52px",
            borderRadius: "26px",
            background: "transparent",
            color: "white",
            fontWeight: 600,
            fontSize: "1rem",
            letterSpacing: "0.04em",
            border: "2px solid rgba(233, 30, 140, 0.7)",
            cursor: "pointer",
            marginTop: "12px",
            fontFamily: "'Figtree', sans-serif",
            transition: "background 0.18s, border-color 0.18s",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "rgba(233,30,140,0.12)";
            e.currentTarget.style.borderColor = "rgba(233,30,140,1)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "transparent";
            e.currentTarget.style.borderColor = "rgba(233,30,140,0.7)";
          }}
        >
          Sign Up
        </button>

        <p
          className="text-xs text-center"
          style={{
            color: "rgba(232,121,160,0.6)",
            marginTop: "16px",
            marginBottom: "32px",
            letterSpacing: "0.02em",
          }}
        >
          Trusted by thousands of women across India
        </p>
      </div>
    </div>
  );
}
