import { ArrowLeft, Eye, EyeOff, Lock, Phone } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { useApp } from "../context/AppContext";

interface ForgotPasswordScreenProps {
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

const OTP_LENGTH = 6;

export default function ForgotPasswordScreen({
  onBack,
  onSuccess,
}: ForgotPasswordScreenProps) {
  const { resetPassword } = useApp();
  const [mounted, setMounted] = useState(false);
  const [step, setStep] = useState<"phone" | "otp" | "newpass">("phone");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState<string[]>(Array(OTP_LENGTH).fill(""));
  const [generatedOtp, setGeneratedOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 50);
    return () => clearTimeout(t);
  }, []);

  const fadeStyle = (delay: number): React.CSSProperties => ({
    opacity: mounted ? 1 : 0,
    transform: mounted ? "translateY(0)" : "translateY(24px)",
    transition: `opacity 0.6s ease-out ${delay}s, transform 0.6s ease-out ${delay}s`,
  });

  const inputStyle: React.CSSProperties = {
    width: "100%",
    height: "48px",
    background: "rgba(255,255,255,0.07)",
    border: "1px solid rgba(232,121,160,0.3)",
    borderRadius: "12px",
    color: "white",
    paddingLeft: "44px",
    paddingRight: "16px",
    fontSize: "0.95rem",
    fontFamily: "'Figtree', sans-serif",
    outline: "none",
    transition: "border-color 0.2s",
  };

  const focusBorder = (e: React.FocusEvent<HTMLInputElement>) => {
    e.currentTarget.style.borderColor = "rgba(232,121,160,0.8)";
  };
  const blurBorder = (e: React.FocusEvent<HTMLInputElement>) => {
    e.currentTarget.style.borderColor = "rgba(232,121,160,0.3)";
  };

  function handleSendOtp() {
    if (phone.length !== 10) {
      toast.error("Please enter a valid 10-digit mobile number.");
      return;
    }
    // Check if account exists
    const creds = JSON.parse(
      localStorage.getItem("sheshield_credentials") || "null",
    );
    if (!creds || creds.phone !== phone) {
      toast.error("No account found with this phone number.");
      return;
    }
    setIsLoading(true);
    setTimeout(() => {
      const code = String(Math.floor(100000 + Math.random() * 900000));
      setGeneratedOtp(code);
      setIsLoading(false);
      setStep("otp");
      toast.success(`OTP sent! (Demo code: ${code})`, { duration: 8000 });
    }, 800);
  }

  function handleOtpChange(index: number, value: string) {
    const digit = value.replace(/\D/g, "").slice(-1);
    const updated = [...otp];
    updated[index] = digit;
    setOtp(updated);
    if (digit && index < OTP_LENGTH - 1) {
      otpRefs.current[index + 1]?.focus();
    }
  }

  function handleOtpKeyDown(
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>,
  ) {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  }

  function handleVerifyOtp() {
    const entered = otp.join("");
    if (entered.length !== OTP_LENGTH) {
      toast.error("Please enter all 6 digits.");
      return;
    }
    if (entered !== generatedOtp) {
      toast.error("Incorrect OTP. Please try again.");
      return;
    }
    setStep("newpass");
    toast.success("OTP verified! Set your new password.");
  }

  function handleResetPassword() {
    if (newPassword.length < 6) {
      toast.error("Password must be at least 6 characters.");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }
    setIsLoading(true);
    setTimeout(() => {
      resetPassword(phone, newPassword);
      setIsLoading(false);
      toast.success("Password reset successful! Please login.");
      onSuccess();
    }, 600);
  }

  const stepTitle =
    step === "phone"
      ? "Forgot Password"
      : step === "otp"
        ? "Verify OTP"
        : "New Password";
  const stepSub =
    step === "phone"
      ? "Enter your registered phone number"
      : step === "otp"
        ? `Enter OTP sent to +91 ${phone}`
        : "Set a strong new password";

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
            fontSize: "1.8rem",
            textShadow: "0 0 24px rgba(232,121,160,0.5)",
          }}
        >
          {stepTitle}
        </h1>
        <p
          style={{
            color: "rgba(232,121,160,0.7)",
            fontSize: "0.85rem",
            marginTop: "4px",
          }}
        >
          {stepSub}
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
          {step === "phone" && (
            <div>
              <div style={{ marginBottom: "24px" }}>
                <span style={labelStyle}>Mobile Number</span>
                <div
                  style={{ position: "relative", display: "flex", gap: "8px" }}
                >
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
                    type="tel"
                    placeholder="10-digit number"
                    value={phone}
                    onChange={(e) =>
                      setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))
                    }
                    style={{ ...inputStyle, paddingLeft: "16px", flex: 1 }}
                    onFocus={focusBorder}
                    onBlur={blurBorder}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleSendOtp();
                    }}
                  />
                </div>
              </div>
              <button
                type="button"
                onClick={handleSendOtp}
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
                  boxShadow: isLoading
                    ? "none"
                    : "0 4px 20px rgba(233,30,140,0.4)",
                  fontFamily: "'Figtree', sans-serif",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "8px",
                }}
              >
                {isLoading ? (
                  <span
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                    }}
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
                    Sending OTP...
                  </span>
                ) : (
                  "Send OTP"
                )}
              </button>
            </div>
          )}

          {step === "otp" && (
            <div>
              <div style={{ marginBottom: "24px" }}>
                <span style={{ ...labelStyle, marginBottom: "12px" }}>
                  Enter 6-digit OTP
                </span>
                <div
                  style={{
                    display: "flex",
                    gap: "8px",
                    justifyContent: "center",
                  }}
                >
                  {otp.map((digit, i) => (
                    <input
                      key={`otp-slot-${["a", "b", "c", "d", "e", "f"][i]}`}
                      ref={(el) => {
                        otpRefs.current[i] = el;
                      }}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleOtpChange(i, e.target.value)}
                      onKeyDown={(e) => handleOtpKeyDown(i, e)}
                      style={{
                        width: "44px",
                        height: "52px",
                        background: digit
                          ? "rgba(232,121,160,0.15)"
                          : "rgba(255,255,255,0.07)",
                        border: `1px solid ${digit ? "rgba(232,121,160,0.7)" : "rgba(232,121,160,0.3)"}`,
                        borderRadius: "12px",
                        color: "white",
                        textAlign: "center",
                        fontSize: "1.3rem",
                        fontWeight: 700,
                        fontFamily: "'Figtree', sans-serif",
                        outline: "none",
                        transition: "border-color 0.2s, background 0.2s",
                      }}
                    />
                  ))}
                </div>
              </div>
              <button
                type="button"
                onClick={handleVerifyOtp}
                style={{
                  width: "100%",
                  height: "50px",
                  borderRadius: "14px",
                  background:
                    "linear-gradient(135deg, #e91e8c, #9b27af, #673ab7)",
                  color: "white",
                  fontWeight: 700,
                  fontSize: "1rem",
                  border: "none",
                  cursor: "pointer",
                  boxShadow: "0 4px 20px rgba(233,30,140,0.4)",
                  fontFamily: "'Figtree', sans-serif",
                }}
              >
                Verify OTP
              </button>
              <button
                type="button"
                onClick={() => {
                  setStep("phone");
                  setOtp(Array(OTP_LENGTH).fill(""));
                }}
                style={{
                  background: "none",
                  border: "none",
                  color: "rgba(232,121,160,0.7)",
                  cursor: "pointer",
                  marginTop: "12px",
                  width: "100%",
                  fontSize: "0.85rem",
                }}
              >
                Change Phone Number
              </button>
            </div>
          )}

          {step === "newpass" && (
            <div>
              <div style={{ marginBottom: "16px" }}>
                <span style={labelStyle}>New Password</span>
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
                    type={showNew ? "text" : "password"}
                    placeholder="Min 6 characters"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    style={{ ...inputStyle, paddingRight: "44px" }}
                    onFocus={focusBorder}
                    onBlur={blurBorder}
                  />
                  <button
                    type="button"
                    onClick={() => setShowNew(!showNew)}
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
                    {showNew ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>
              <div style={{ marginBottom: "24px" }}>
                <span style={labelStyle}>Confirm Password</span>
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
                    type={showConfirm ? "text" : "password"}
                    placeholder="Re-enter password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    style={{ ...inputStyle, paddingRight: "44px" }}
                    onFocus={focusBorder}
                    onBlur={blurBorder}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleResetPassword();
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm(!showConfirm)}
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
                    {showConfirm ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>
              <button
                type="button"
                onClick={handleResetPassword}
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
                  boxShadow: isLoading
                    ? "none"
                    : "0 4px 20px rgba(233,30,140,0.4)",
                  fontFamily: "'Figtree', sans-serif",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "8px",
                }}
              >
                {isLoading ? (
                  <span
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                    }}
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
                    Resetting...
                  </span>
                ) : (
                  "Reset Password"
                )}
              </button>
            </div>
          )}
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
          Remembered your password?{" "}
          <button
            type="button"
            onClick={onBack}
            style={{
              color: "#e879a0",
              background: "none",
              border: "none",
              cursor: "pointer",
              fontWeight: 600,
            }}
          >
            Login
          </button>
        </p>
      </div>
    </div>
  );
}
