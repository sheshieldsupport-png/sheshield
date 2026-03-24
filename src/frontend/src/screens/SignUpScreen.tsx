import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import {
  ArrowLeft,
  Calendar,
  Eye,
  EyeOff,
  Gift,
  Lock,
  MapPin,
  Phone,
  Shield,
  User,
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useApp } from "../context/AppContext";

interface SignUpScreenProps {
  onBack: () => void;
  onSuccess: () => void;
}

const particles = [
  {
    id: "p1",
    size: 6,
    top: "10%",
    left: "8%",
    duration: 8,
    delay: 0,
    color: "#e879a0",
  },
  {
    id: "p2",
    size: 4,
    top: "22%",
    left: "88%",
    duration: 11,
    delay: 1.5,
    color: "#9b59b6",
  },
  {
    id: "p3",
    size: 8,
    top: "45%",
    left: "5%",
    duration: 9,
    delay: 0.8,
    color: "#e91e8c",
  },
  {
    id: "p4",
    size: 5,
    top: "65%",
    left: "92%",
    duration: 13,
    delay: 2.5,
    color: "#e879a0",
  },
  {
    id: "p5",
    size: 7,
    top: "80%",
    left: "18%",
    duration: 7,
    delay: 1,
    color: "#9b59b6",
  },
  {
    id: "p6",
    size: 4,
    top: "15%",
    left: "65%",
    duration: 12,
    delay: 3,
    color: "#e879a0",
  },
];

const labelStyle: React.CSSProperties = {
  color: "rgba(255,255,255,0.7)",
  fontSize: "0.78rem",
  display: "block",
  marginBottom: "6px",
};

function GiftModal({ onClose }: { onClose: () => void }) {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setShow(true), 50);
    return () => clearTimeout(t);
  }, []);

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.75)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 9999,
        padding: "20px",
      }}
    >
      <div
        style={{
          background: "linear-gradient(135deg, #1a0030, #2d0050, #3d0040)",
          border: "1px solid rgba(232,121,160,0.5)",
          borderRadius: "24px",
          padding: "32px 24px",
          maxWidth: "340px",
          width: "100%",
          textAlign: "center",
          boxShadow:
            "0 0 60px rgba(232,121,160,0.3), 0 0 120px rgba(155,87,182,0.15)",
          opacity: show ? 1 : 0,
          transform: show
            ? "scale(1) translateY(0)"
            : "scale(0.85) translateY(20px)",
          transition: "opacity 0.5s ease, transform 0.5s ease",
        }}
      >
        {/* Animated gift icon */}
        <div
          style={{
            width: "80px",
            height: "80px",
            borderRadius: "50%",
            background: "linear-gradient(135deg, #e91e8c, #9b27af)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 16px",
            boxShadow:
              "0 0 30px rgba(233,30,140,0.5), 0 0 60px rgba(233,30,140,0.2)",
            animation: "pulse-glow 2s ease-in-out infinite",
          }}
        >
          <span style={{ fontSize: "2.2rem" }}>🎁</span>
        </div>

        <h2
          style={{
            color: "white",
            fontFamily: "'Bricolage Grotesque', sans-serif",
            fontSize: "1.4rem",
            fontWeight: 800,
            marginBottom: "8px",
            textShadow: "0 0 20px rgba(232,121,160,0.6)",
          }}
        >
          A Special Gift for You 💜
        </h2>

        <p
          style={{
            color: "rgba(232,121,160,0.9)",
            fontSize: "0.85rem",
            fontWeight: 600,
            marginBottom: "12px",
            letterSpacing: "0.05em",
          }}
        >
          From SheShield, With Love 🌸
        </p>

        <div
          style={{
            background: "rgba(232,121,160,0.08)",
            border: "1px solid rgba(232,121,160,0.2)",
            borderRadius: "14px",
            padding: "16px",
            marginBottom: "20px",
          }}
        >
          <p
            style={{
              color: "rgba(255,255,255,0.9)",
              fontSize: "0.92rem",
              lineHeight: 1.7,
              fontStyle: "italic",
            }}
          >
            "You are brave, you are strong, and you deserve to feel safe every
            single day. SheShield was created just for{" "}
            <strong style={{ color: "#e879a0" }}>you</strong>. Welcome to a
            world where your safety is our highest priority. You are never
            alone. 💪🌟"
          </p>
        </div>

        <div
          style={{
            display: "flex",
            gap: "8px",
            flexWrap: "wrap",
            justifyContent: "center",
            marginBottom: "20px",
          }}
        >
          {["🛡️ 24/7 Protection", "💜 Priority Support", "🌟 Safety Badge"].map(
            (badge) => (
              <span
                key={badge}
                style={{
                  background:
                    "linear-gradient(135deg, rgba(233,30,140,0.2), rgba(155,39,175,0.2))",
                  border: "1px solid rgba(232,121,160,0.3)",
                  borderRadius: "20px",
                  padding: "4px 12px",
                  fontSize: "0.75rem",
                  color: "rgba(255,255,255,0.85)",
                }}
              >
                {badge}
              </span>
            ),
          )}
        </div>

        <button
          type="button"
          onClick={onClose}
          style={{
            width: "100%",
            height: "48px",
            borderRadius: "14px",
            background: "linear-gradient(135deg, #e91e8c, #9b27af, #673ab7)",
            color: "white",
            fontWeight: 700,
            fontSize: "0.95rem",
            border: "none",
            cursor: "pointer",
            boxShadow: "0 4px 20px rgba(233,30,140,0.4)",
            fontFamily: "'Figtree', sans-serif",
          }}
        >
          Thank You SheShield! 💜
        </button>
      </div>
    </div>
  );
}

export default function SignUpScreen({ onBack, onSuccess }: SignUpScreenProps) {
  const { signUp } = useApp();
  const [mounted, setMounted] = useState(false);
  const [step, setStep] = useState<"form" | "otp">("form");
  const [showGift, setShowGift] = useState(false);
  const [giftShown, setGiftShown] = useState(false);

  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  // New fields
  const [address, setAddress] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [dob, setDob] = useState("");

  const [generatedOtp, setGeneratedOtp] = useState("");
  const [enteredOtp, setEnteredOtp] = useState("");
  const [otpError, setOtpError] = useState("");

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 50);
    return () => clearTimeout(t);
  }, []);

  // Auto-calculate age from DOB
  useEffect(() => {
    if (dob) {
      const birth = new Date(dob);
      const today = new Date();
      let calculatedAge = today.getFullYear() - birth.getFullYear();
      const m = today.getMonth() - birth.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < birth.getDate()))
        calculatedAge--;
      if (calculatedAge > 0 && calculatedAge < 120) {
        setAge(String(calculatedAge));
      }
      // Show gift for female users when DOB is filled
      if (gender === "female" && !giftShown) {
        setTimeout(() => {
          setShowGift(true);
          setGiftShown(true);
        }, 600);
      }
    }
  }, [dob, gender, giftShown]);

  // Also trigger gift when gender changes to female and DOB already filled
  useEffect(() => {
    if (gender === "female" && dob && !giftShown) {
      setTimeout(() => {
        setShowGift(true);
        setGiftShown(true);
      }, 400);
    }
  }, [gender, dob, giftShown]);

  const fadeStyle = (delay: number): React.CSSProperties => ({
    opacity: mounted ? 1 : 0,
    transform: mounted ? "translateY(0)" : "translateY(24px)",
    transition: `opacity 0.6s ease-out ${delay}s, transform 0.6s ease-out ${delay}s`,
  });

  function validateForm(): string | null {
    if (!fullName.trim()) return "Full name is required.";
    if (!username.trim()) return "Username is required.";
    if (!/^[a-zA-Z0-9_]+$/.test(username))
      return "Username can only contain letters, numbers, and underscores.";
    if (!phone.trim() || !/^[0-9]{10}$/.test(phone))
      return "Enter a valid 10-digit mobile number.";
    if (!address.trim()) return "Personal address is required.";
    if (!gender) return "Please select your gender.";
    if (!dob) return "Date of birth is required.";
    if (password.length < 6) return "Password must be at least 6 characters.";
    if (password !== confirmPassword) return "Passwords do not match.";
    return null;
  }

  function handleCreateAccount() {
    const err = validateForm();
    if (err) {
      toast.error(err);
      return;
    }
    const otp = String(Math.floor(100000 + Math.random() * 900000));
    setGeneratedOtp(otp);
    setEnteredOtp("");
    setOtpError("");
    setStep("otp");
  }

  function handleVerifyOtp() {
    if (enteredOtp.length !== 6) {
      setOtpError("Please enter the complete 6-digit OTP.");
      return;
    }
    if (enteredOtp !== generatedOtp) {
      setOtpError("Incorrect OTP. Please try again.");
      return;
    }
    signUp(username.trim(), fullName.trim(), phone.trim(), password);
    toast.success("Account created! Welcome to SheShield 💜");
    onSuccess();
  }

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

  const focusBorder = (
    e: React.FocusEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    e.currentTarget.style.borderColor = "rgba(232,121,160,0.8)";
  };
  const blurBorder = (
    e: React.FocusEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    e.currentTarget.style.borderColor = "rgba(232,121,160,0.3)";
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
      {showGift && <GiftModal onClose={() => setShowGift(false)} />}

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
        data-ocid="signup.back.button"
        onClick={step === "otp" ? () => setStep("form") : onBack}
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
        style={{ paddingTop: "60px", ...fadeStyle(0.1) }}
      >
        <div
          className="rounded-full p-2 mb-2"
          style={{
            background: "rgba(232,121,160,0.08)",
            border: "1px solid rgba(232,121,160,0.2)",
          }}
        >
          <img
            src="/assets/uploads/ChatGPT-Image-Mar-20-2026-06_43_53-PM-1.png"
            className="w-16 h-16 object-contain rounded-full"
            alt="SheShield Logo"
          />
        </div>
        <h1
          className="font-bold text-white text-center"
          style={{
            fontFamily: "'Bricolage Grotesque', sans-serif",
            fontSize: "1.7rem",
            textShadow: "0 0 20px rgba(232,121,160,0.5)",
          }}
        >
          {step === "otp" ? "Verify OTP" : "Create Account"}
        </h1>
        <p
          style={{
            color: "rgba(232,121,160,0.8)",
            fontSize: "0.8rem",
            marginTop: "4px",
          }}
        >
          {step === "otp"
            ? `Enter the code sent to +91 ${phone}`
            : "Join SheShield today"}
        </p>
      </div>

      <div
        style={{
          marginTop: "20px",
          width: "100%",
          maxWidth: "390px",
          padding: "0 16px",
          paddingBottom: "40px",
          ...fadeStyle(0.25),
        }}
      >
        {step === "form" ? (
          <>
            {/* Privacy Notice */}
            <div
              style={{
                background: "rgba(155,39,175,0.12)",
                border: "1px solid rgba(155,39,175,0.35)",
                borderRadius: "14px",
                padding: "14px 16px",
                marginBottom: "16px",
                display: "flex",
                gap: "10px",
                alignItems: "flex-start",
              }}
            >
              <Shield
                className="w-5 h-5 flex-shrink-0 mt-0.5"
                style={{ color: "#e879a0" }}
              />
              <div>
                <p
                  style={{
                    color: "rgba(232,121,160,0.95)",
                    fontSize: "0.78rem",
                    fontWeight: 700,
                    marginBottom: "4px",
                    letterSpacing: "0.04em",
                  }}
                >
                  🔒 Your Privacy is Protected
                </p>
                <p
                  style={{
                    color: "rgba(255,255,255,0.7)",
                    fontSize: "0.75rem",
                    lineHeight: 1.6,
                  }}
                >
                  All information you fill in this form is{" "}
                  <strong style={{ color: "rgba(232,121,160,0.9)" }}>
                    100% private and secure
                  </strong>
                  . Your personal data will never be shared with any third
                  party. SheShield is committed to keeping your identity,
                  location, and personal details completely confidential at all
                  times.
                </p>
              </div>
            </div>

            <div
              style={{
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(232,121,160,0.25)",
                borderRadius: "20px",
                padding: "20px 18px",
                boxShadow:
                  "0 8px 40px rgba(232,121,160,0.1), inset 0 1px 0 rgba(255,255,255,0.06)",
              }}
            >
              {/* Full Name */}
              <div style={{ marginBottom: "14px" }}>
                <label htmlFor="signup-name" style={labelStyle}>
                  Full Name
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
                    id="signup-name"
                    data-ocid="signup.name.input"
                    type="text"
                    placeholder="Your full name"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    style={inputStyle}
                    onFocus={focusBorder}
                    onBlur={blurBorder}
                  />
                </div>
              </div>

              {/* Username */}
              <div style={{ marginBottom: "14px" }}>
                <label htmlFor="signup-username" style={labelStyle}>
                  Username
                </label>
                <div style={{ position: "relative" }}>
                  <span
                    style={{
                      position: "absolute",
                      left: "14px",
                      top: "50%",
                      transform: "translateY(-50%)",
                      color: "rgba(232,121,160,0.7)",
                      fontSize: "0.9rem",
                    }}
                  >
                    @
                  </span>
                  <input
                    id="signup-username"
                    data-ocid="signup.username.input"
                    type="text"
                    placeholder="username (no spaces)"
                    value={username}
                    onChange={(e) =>
                      setUsername(e.target.value.replace(/\s/g, ""))
                    }
                    style={inputStyle}
                    onFocus={focusBorder}
                    onBlur={blurBorder}
                  />
                </div>
              </div>

              {/* Mobile */}
              <div style={{ marginBottom: "14px" }}>
                <label htmlFor="signup-phone" style={labelStyle}>
                  Mobile Number
                </label>
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
                    id="signup-phone"
                    data-ocid="signup.phone.input"
                    type="tel"
                    placeholder="10-digit number"
                    value={phone}
                    onChange={(e) =>
                      setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))
                    }
                    style={{ ...inputStyle, paddingLeft: "16px", flex: 1 }}
                    onFocus={focusBorder}
                    onBlur={blurBorder}
                  />
                </div>
              </div>

              {/* Personal Address */}
              <div style={{ marginBottom: "14px" }}>
                <label htmlFor="signup-address" style={labelStyle}>
                  Personal Address
                </label>
                <div style={{ position: "relative" }}>
                  <MapPin
                    className="w-4 h-4"
                    style={{
                      position: "absolute",
                      left: "14px",
                      top: "14px",
                      color: "rgba(232,121,160,0.7)",
                    }}
                  />
                  <textarea
                    id="signup-address"
                    data-ocid="signup.address.input"
                    placeholder="House no., Street, City, State..."
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    rows={2}
                    style={{
                      width: "100%",
                      background: "rgba(255,255,255,0.07)",
                      border: "1px solid rgba(232,121,160,0.3)",
                      borderRadius: "12px",
                      color: "white",
                      paddingLeft: "44px",
                      paddingRight: "16px",
                      paddingTop: "12px",
                      paddingBottom: "12px",
                      fontSize: "0.95rem",
                      fontFamily: "'Figtree', sans-serif",
                      outline: "none",
                      resize: "none",
                      transition: "border-color 0.2s",
                    }}
                    onFocus={focusBorder}
                    onBlur={blurBorder}
                  />
                </div>
              </div>

              {/* Gender */}
              <div style={{ marginBottom: "14px" }}>
                <label htmlFor="signup-gender" style={labelStyle}>
                  Gender
                </label>
                <div style={{ display: "flex", gap: "10px" }}>
                  {[
                    { val: "female", label: "👩 Female", emoji: "" },
                    { val: "male", label: "👨 Male", emoji: "" },
                    { val: "other", label: "🌈 Other", emoji: "" },
                  ].map((g) => (
                    <button
                      key={g.val}
                      type="button"
                      onClick={() => setGender(g.val)}
                      style={{
                        flex: 1,
                        height: "44px",
                        borderRadius: "12px",
                        border:
                          gender === g.val
                            ? "1.5px solid rgba(232,121,160,0.9)"
                            : "1px solid rgba(232,121,160,0.25)",
                        background:
                          gender === g.val
                            ? "linear-gradient(135deg, rgba(233,30,140,0.25), rgba(155,39,175,0.25))"
                            : "rgba(255,255,255,0.05)",
                        color:
                          gender === g.val ? "white" : "rgba(255,255,255,0.6)",
                        fontSize: "0.78rem",
                        fontWeight: gender === g.val ? 700 : 400,
                        cursor: "pointer",
                        transition: "all 0.2s",
                        fontFamily: "'Figtree', sans-serif",
                        boxShadow:
                          gender === g.val
                            ? "0 0 12px rgba(232,121,160,0.3)"
                            : "none",
                      }}
                    >
                      {g.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* DOB + Age row */}
              <div
                style={{ display: "flex", gap: "10px", marginBottom: "14px" }}
              >
                <div style={{ flex: 2 }}>
                  <label htmlFor="signup-dob" style={labelStyle}>
                    Date of Birth
                    {gender === "female" && dob && (
                      <span
                        style={{
                          marginLeft: "6px",
                          animation: "bounce 1s infinite",
                        }}
                      >
                        🎁
                      </span>
                    )}
                  </label>
                  <div style={{ position: "relative" }}>
                    <Calendar
                      className="w-4 h-4"
                      style={{
                        position: "absolute",
                        left: "14px",
                        top: "50%",
                        transform: "translateY(-50%)",
                        color: "rgba(232,121,160,0.7)",
                        zIndex: 1,
                      }}
                    />
                    <input
                      id="signup-dob"
                      data-ocid="signup.dob.input"
                      type="date"
                      value={dob}
                      onChange={(e) => setDob(e.target.value)}
                      max={new Date().toISOString().split("T")[0]}
                      style={{
                        ...inputStyle,
                        colorScheme: "dark",
                        paddingLeft: "44px",
                      }}
                      onFocus={focusBorder}
                      onBlur={blurBorder}
                    />
                  </div>
                </div>
                <div style={{ flex: 1 }}>
                  <label htmlFor="signup-age" style={labelStyle}>
                    Age
                  </label>
                  <div style={{ position: "relative" }}>
                    <input
                      id="signup-age"
                      data-ocid="signup.age.input"
                      type="number"
                      placeholder="--"
                      value={age}
                      readOnly
                      style={{
                        ...inputStyle,
                        paddingLeft: "16px",
                        textAlign: "center",
                        background: age
                          ? "rgba(232,121,160,0.1)"
                          : "rgba(255,255,255,0.04)",
                        color: age ? "#e879a0" : "rgba(255,255,255,0.4)",
                        fontWeight: age ? 700 : 400,
                        cursor: "default",
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Female DOB hint */}
              {gender === "female" && !dob && (
                <div
                  style={{
                    background: "rgba(232,121,160,0.08)",
                    border: "1px dashed rgba(232,121,160,0.4)",
                    borderRadius: "10px",
                    padding: "10px 14px",
                    marginBottom: "14px",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                  }}
                >
                  <Gift
                    className="w-4 h-4 flex-shrink-0"
                    style={{ color: "#e879a0" }}
                  />
                  <p
                    style={{
                      color: "rgba(232,121,160,0.85)",
                      fontSize: "0.75rem",
                    }}
                  >
                    Enter your Date of Birth to receive a special gift from
                    SheShield! 🎁✨
                  </p>
                </div>
              )}

              {/* Password */}
              <div style={{ marginBottom: "14px" }}>
                <label htmlFor="signup-password" style={labelStyle}>
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
                    id="signup-password"
                    data-ocid="signup.password.input"
                    type={showPassword ? "text" : "password"}
                    placeholder="Min 6 characters"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    style={{ ...inputStyle, paddingRight: "44px" }}
                    onFocus={focusBorder}
                    onBlur={blurBorder}
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
              </div>

              {/* Confirm Password */}
              <div style={{ marginBottom: "20px" }}>
                <label htmlFor="signup-confirm" style={labelStyle}>
                  Confirm Password
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
                    id="signup-confirm"
                    data-ocid="signup.confirm_password.input"
                    type={showConfirm ? "text" : "password"}
                    placeholder="Re-enter password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    style={{ ...inputStyle, paddingRight: "44px" }}
                    onFocus={focusBorder}
                    onBlur={blurBorder}
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
                data-ocid="signup.submit.button"
                onClick={handleCreateAccount}
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
                  transition: "transform 0.15s, box-shadow 0.15s",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "8px",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "scale(1.02)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "scale(1)";
                }}
              >
                <Shield className="w-4 h-4" />
                Create Account
              </button>
            </div>
          </>
        ) : (
          <div
            style={{
              background: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(232,121,160,0.25)",
              borderRadius: "20px",
              padding: "32px 20px",
              boxShadow:
                "0 8px 40px rgba(232,121,160,0.1), inset 0 1px 0 rgba(255,255,255,0.06)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "20px",
            }}
          >
            <div
              style={{
                background: "rgba(232,121,160,0.12)",
                border: "1px dashed rgba(232,121,160,0.5)",
                borderRadius: "12px",
                padding: "12px 20px",
                textAlign: "center",
                width: "100%",
              }}
            >
              <p
                style={{
                  color: "rgba(255,255,255,0.6)",
                  fontSize: "0.75rem",
                  marginBottom: "4px",
                }}
              >
                Demo OTP (for testing)
              </p>
              <p
                data-ocid="signup.otp_display.panel"
                style={{
                  color: "#e879a0",
                  fontSize: "1.8rem",
                  fontWeight: 800,
                  letterSpacing: "0.3em",
                  fontFamily: "'JetBrains Mono', monospace",
                  textShadow: "0 0 12px rgba(232,121,160,0.5)",
                }}
              >
                {generatedOtp}
              </p>
            </div>

            <p
              style={{
                color: "rgba(255,255,255,0.7)",
                fontSize: "0.9rem",
                textAlign: "center",
              }}
            >
              Enter the 6-digit OTP
            </p>

            <InputOTP
              maxLength={6}
              value={enteredOtp}
              onChange={(val) => {
                setEnteredOtp(val);
                setOtpError("");
              }}
              data-ocid="signup.otp.input"
            >
              <InputOTPGroup>
                {[0, 1, 2, 3, 4, 5].map((i) => (
                  <InputOTPSlot
                    key={i}
                    index={i}
                    style={{
                      background: "rgba(255,255,255,0.08)",
                      border: "1px solid rgba(232,121,160,0.4)",
                      color: "white",
                      fontSize: "1.2rem",
                      fontWeight: 700,
                    }}
                  />
                ))}
              </InputOTPGroup>
            </InputOTP>

            {otpError && (
              <p
                data-ocid="signup.otp.error_state"
                style={{
                  color: "#ff6b9d",
                  fontSize: "0.82rem",
                  textAlign: "center",
                }}
              >
                {otpError}
              </p>
            )}

            <button
              type="button"
              data-ocid="signup.verify_otp.button"
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
                transition: "transform 0.15s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "scale(1.02)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "scale(1)";
              }}
            >
              Verify &amp; Continue
            </button>
          </div>
        )}

        <p
          style={{
            color: "rgba(255,255,255,0.5)",
            textAlign: "center",
            fontSize: "0.8rem",
            marginTop: "16px",
            marginBottom: "32px",
          }}
        >
          Already have an account?{" "}
          <button
            type="button"
            data-ocid="signup.goto_login.button"
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
