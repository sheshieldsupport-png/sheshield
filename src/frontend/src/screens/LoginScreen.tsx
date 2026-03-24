import { ArrowLeft, Eye, EyeOff, Lock, Phone, User } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useApp } from "../context/AppContext";

interface LoginScreenProps {
  onForgotPassword?: () => void;
  onBack: () => void;
  onSuccess: () => void;
}

const particles = [
  {
    id: "p1",
    size: 6,
    top: "8%",
    left: "12%",
    duration: 9,
    delay: 0,
    color: "#e879a0",
  },
  {
    id: "p2",
    size: 4,
    top: "30%",
    left: "85%",
    duration: 11,
    delay: 1.2,
    color: "#9b59b6",
  },
  {
    id: "p3",
    size: 7,
    top: "55%",
    left: "6%",
    duration: 8,
    delay: 0.5,
    color: "#e91e8c",
  },
  {
    id: "p4",
    size: 5,
    top: "70%",
    left: "90%",
    duration: 13,
    delay: 3,
    color: "#e879a0",
  },
  {
    id: "p5",
    size: 9,
    top: "85%",
    left: "20%",
    duration: 7,
    delay: 1.8,
    color: "#9b59b6",
  },
];

const labelStyle: React.CSSProperties = {
  color: "rgba(255,255,255,0.7)",
  fontSize: "0.78rem",
  display: "block",
  marginBottom: "6px",
};

const errorStyle: React.CSSProperties = {
  color: "#ff6b8a",
  fontSize: "0.75rem",
  marginTop: "4px",
};

export default function LoginScreen({
  onBack,
  onSuccess,
  onForgotPassword,
}: LoginScreenProps) {
  const { login } = useApp();
  const [mounted, setMounted] = useState(false);
  const [phone, setPhone] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Field-level errors
  const [phoneError, setPhoneError] = useState<string | null>(null);
  const [usernameError, setUsernameError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 50);
    return () => clearTimeout(t);
  }, []);

  const fadeStyle = (delay: number): React.CSSProperties => ({
    opacity: mounted ? 1 : 0,
    transform: mounted ? "translateY(0)" : "translateY(24px)",
    transition: `opacity 0.6s ease-out ${delay}s, transform 0.6s ease-out ${delay}s`,
  });

  function handleLogin() {
    if (!phone.trim() || !username.trim() || !password) {
      toast.error("Please fill in all fields.");
      return;
    }
    setIsLoading(true);
    setTimeout(() => {
      const result = login(phone.trim(), username.trim(), password);
      setIsLoading(false);
      if (result === "success") {
        toast.success("Welcome back! Stay safe 💜");
        onSuccess();
      } else if (result === "invalid_phone") {
        setPhoneError("Invalid phone number");
      } else if (result === "invalid_username") {
        setUsernameError("Invalid username");
      } else if (result === "invalid_password") {
        setPasswordError("Password incorrect");
      }
    }, 600);
  }

  const inputStyle = (hasError: boolean): React.CSSProperties => ({
    width: "100%",
    height: "48px",
    background: "rgba(255,255,255,0.07)",
    border: `1px solid ${hasError ? "rgba(255,107,138,0.8)" : "rgba(232,121,160,0.3)"}`,
    borderRadius: "12px",
    color: "white",
    paddingLeft: "44px",
    paddingRight: "16px",
    fontSize: "0.95rem",
    fontFamily: "'Figtree', sans-serif",
    outline: "none",
    transition: "border-color 0.2s",
  });

  const focusBorder = (e: React.FocusEvent<HTMLInputElement>) => {
    e.currentTarget.style.borderColor = "rgba(232,121,160,0.8)";
  };
  const blurBorder = (
    e: React.FocusEvent<HTMLInputElement>,
    hasError: boolean,
  ) => {
    e.currentTarget.style.borderColor = hasError
      ? "rgba(255,107,138,0.8)"
      : "rgba(232,121,160,0.3)";
  };

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

      <button
        type="button"
        data-ocid="login.back.button"
        onClick={onBack}
        style={{
          position: "absolute",
          top: "20px",
          left: "20px",
          background: "rgba(255,255,255,0.08)",
          border: "1px solid rgba(232,121,160,0.3)",
          borderRadius: "50%",
          width: "40px",
          height: "40px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          color: "white",
          zIndex: 10,
        }}
      >
        <ArrowLeft className="w-5 h-5" />
      </button>

      <div
        className="flex flex-col items-center"
        style={{ paddingTop: "80px", ...fadeStyle(0.1) }}
      >
        <div
          className="rounded-full p-2 mb-3"
          style={{
            background: "rgba(232,121,160,0.08)",
            border: "1px solid rgba(232,121,160,0.2)",
          }}
        >
          <img
            src="/assets/uploads/ChatGPT-Image-Mar-20-2026-06_43_53-PM-1.png"
            className="w-20 h-20 object-contain rounded-full"
            alt="SheShield Logo"
          />
        </div>
        <h1
          className="font-bold text-white text-center"
          style={{
            fontFamily: "'Bricolage Grotesque', sans-serif",
            fontSize: "2rem",
            textShadow: "0 0 24px rgba(232,121,160,0.5)",
          }}
        >
          Welcome Back
        </h1>
        <p
          style={{
            color: "rgba(232,121,160,0.7)",
            fontSize: "0.85rem",
            marginTop: "4px",
          }}
        >
          Login to your SheShield account
        </p>
      </div>

      <div
        style={{
          marginTop: "32px",
          width: "100%",
          maxWidth: "380px",
          padding: "0 20px",
          ...fadeStyle(0.25),
        }}
      >
        <div
          style={{
            background: "rgba(255,255,255,0.05)",
            border: "1px solid rgba(232,121,160,0.25)",
            borderRadius: "20px",
            padding: "28px 20px",
            boxShadow:
              "0 8px 40px rgba(232,121,160,0.1), inset 0 1px 0 rgba(255,255,255,0.06)",
          }}
        >
          {/* Mobile */}
          <div style={{ marginBottom: "16px" }}>
            <label htmlFor="login-phone" style={labelStyle}>
              Mobile Number
            </label>
            <div style={{ position: "relative", display: "flex", gap: "8px" }}>
              <div
                style={{
                  height: "48px",
                  background: "rgba(232,121,160,0.12)",
                  border: "1px solid rgba(232,121,160,0.3)",
                  borderRadius: "12px",
                  display: "flex",
                  alignItems: "center",
                  padding: "0 12px",
                  color: "rgba(255,255,255,0.8)",
                  fontSize: "0.9rem",
                  whiteSpace: "nowrap",
                  flexShrink: 0,
                }}
              >
                <Phone
                  className="w-3.5 h-3.5 mr-1.5"
                  style={{ color: "#e879a0" }}
                />
                +91
              </div>
              <input
                id="login-phone"
                data-ocid="login.phone.input"
                type="tel"
                placeholder="10-digit number"
                value={phone}
                onChange={(e) => {
                  setPhone(e.target.value.replace(/\D/g, "").slice(0, 10));
                  setPhoneError(null);
                }}
                style={{
                  ...inputStyle(!!phoneError),
                  paddingLeft: "16px",
                  flex: 1,
                }}
                onFocus={focusBorder}
                onBlur={(e) => blurBorder(e, !!phoneError)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleLogin();
                }}
              />
            </div>
            {phoneError && (
              <p data-ocid="login.phone.error_state" style={errorStyle}>
                {phoneError}
              </p>
            )}
          </div>

          {/* Username */}
          <div style={{ marginBottom: "16px" }}>
            <label htmlFor="login-username" style={labelStyle}>
              Username
            </label>
            <div style={{ position: "relative" }}>
              <User
                className="w-4 h-4"
                style={{
                  position: "absolute",
                  left: "14px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  color: "rgba(232,121,160,0.7)",
                }}
              />
              <input
                id="login-username"
                data-ocid="login.username.input"
                type="text"
                placeholder="Your username"
                value={username}
                onChange={(e) => {
                  setUsername(e.target.value);
                  setUsernameError(null);
                }}
                style={inputStyle(!!usernameError)}
                onFocus={focusBorder}
                onBlur={(e) => blurBorder(e, !!usernameError)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleLogin();
                }}
              />
            </div>
            {usernameError && (
              <p data-ocid="login.username.error_state" style={errorStyle}>
                {usernameError}
              </p>
            )}
          </div>

          {/* Password */}
          <div style={{ marginBottom: "24px" }}>
            <label htmlFor="login-password" style={labelStyle}>
              Password
            </label>
            <div style={{ position: "relative" }}>
              <Lock
                className="w-4 h-4"
                style={{
                  position: "absolute",
                  left: "14px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  color: "rgba(232,121,160,0.7)",
                }}
              />
              <input
                id="login-password"
                data-ocid="login.password.input"
                type={showPassword ? "text" : "password"}
                placeholder="Your password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setPasswordError(null);
                }}
                style={{ ...inputStyle(!!passwordError), paddingRight: "44px" }}
                onFocus={focusBorder}
                onBlur={(e) => blurBorder(e, !!passwordError)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleLogin();
                }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: "absolute",
                  right: "12px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  color: "rgba(255,255,255,0.5)",
                }}
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
            {passwordError && (
              <p data-ocid="login.password.error_state" style={errorStyle}>
                {passwordError}
              </p>
            )}
          </div>

          <div
            style={{
              textAlign: "right",
              marginBottom: "20px",
              marginTop: "-8px",
            }}
          >
            <button
              type="button"
              onClick={onForgotPassword}
              data-ocid="login.forgot_password.button"
              style={{
                color: "#e879a0",
                background: "none",
                border: "none",
                cursor: "pointer",
                fontSize: "0.82rem",
                fontWeight: 600,
              }}
            >
              Forgot Password?
            </button>
          </div>

          <button
            type="button"
            data-ocid="login.submit.button"
            onClick={handleLogin}
            disabled={isLoading}
            style={{
              width: "100%",
              height: "50px",
              borderRadius: "14px",
              background: isLoading
                ? "rgba(233,30,140,0.4)"
                : "linear-gradient(135deg, #e91e8c, #9b27af, #673ab7)",
              color: "white",
              fontWeight: 700,
              fontSize: "1rem",
              border: "none",
              cursor: isLoading ? "not-allowed" : "pointer",
              boxShadow: isLoading ? "none" : "0 4px 20px rgba(233,30,140,0.4)",
              fontFamily: "'Figtree', sans-serif",
              transition: "transform 0.15s, box-shadow 0.15s",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
            }}
            onMouseEnter={(e) => {
              if (!isLoading) e.currentTarget.style.transform = "scale(1.02)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "scale(1)";
            }}
          >
            {isLoading ? (
              <span
                style={{ display: "flex", alignItems: "center", gap: "8px" }}
              >
                <span
                  style={{
                    width: "18px",
                    height: "18px",
                    border: "2px solid rgba(255,255,255,0.3)",
                    borderTopColor: "white",
                    borderRadius: "50%",
                    animation: "spin 0.7s linear infinite",
                    display: "inline-block",
                  }}
                />
                Logging in...
              </span>
            ) : (
              "Login"
            )}
          </button>
        </div>

        <p
          style={{
            color: "rgba(255,255,255,0.5)",
            textAlign: "center",
            fontSize: "0.8rem",
            marginTop: "16px",
            marginBottom: "32px",
          }}
        >
          Don&apos;t have an account?{" "}
          <button
            type="button"
            data-ocid="login.goto_signup.button"
            onClick={onBack}
            style={{
              color: "#e879a0",
              background: "none",
              border: "none",
              cursor: "pointer",
              fontWeight: 600,
            }}
          >
            Sign Up
          </button>
        </p>
      </div>
    </div>
  );
}
