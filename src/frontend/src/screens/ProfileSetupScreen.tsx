import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { Label } from "@/components/ui/label";
import { CheckCircle2, Shield, Smartphone } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useApp } from "../context/AppContext";

type Step = "details" | "otp" | "success";

function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export default function ProfileSetupScreen() {
  const { setUserProfile } = useApp();
  const [step, setStep] = useState<Step>("details");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [otpGenerated, setOtpGenerated] = useState("");
  const [otpEntered, setOtpEntered] = useState("");
  const [loading, setLoading] = useState(false);

  function handleSendOTP() {
    if (!name.trim()) {
      toast.error("Please enter your full name");
      return;
    }
    if (!/^[6-9]\d{9}$/.test(phone)) {
      toast.error("Enter a valid 10-digit Indian mobile number");
      return;
    }
    const otp = generateOTP();
    setOtpGenerated(otp);
    setStep("otp");
    toast.success(`OTP sent to +91 ${phone}`);
  }

  function handleVerifyOTP() {
    if (otpEntered.length !== 6) {
      toast.error("Please enter all 6 digits");
      return;
    }
    if (otpEntered !== otpGenerated) {
      toast.error("Incorrect OTP. Please try again.");
      setOtpEntered("");
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setStep("success");
      setTimeout(() => {
        setUserProfile({ name: name.trim(), phone, verified: true });
      }, 1200);
    }, 800);
  }

  function handleResendOTP() {
    const otp = generateOTP();
    setOtpGenerated(otp);
    setOtpEntered("");
    toast.success("New OTP generated");
  }

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-6 py-10"
      style={{ background: "oklch(0.14 0.012 265)" }}
    >
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <div
            className="w-20 h-20 rounded-2xl flex items-center justify-center mb-4 shadow-danger"
            style={{ background: "oklch(0.52 0.21 22)" }}
          >
            <Shield className="w-10 h-10 text-white" />
          </div>
          <h1 className="font-display text-3xl font-bold text-foreground">
            SheShield
          </h1>
          <p className="text-muted-foreground text-sm mt-1 text-center">
            Berhampur Smart Safety Platform
          </p>
        </div>

        {/* Step: Details */}
        {step === "details" && (
          <div className="animate-slide-up">
            <div
              className="rounded-2xl p-6 border"
              style={{
                background: "oklch(0.18 0.015 265)",
                borderColor: "oklch(0.26 0.018 265)",
              }}
            >
              <h2 className="font-display text-xl font-bold text-foreground mb-1">
                Create Your Profile
              </h2>
              <p className="text-muted-foreground text-sm mb-6">
                Enter your details to get started
              </p>

              <div className="space-y-4">
                <div>
                  <Label
                    htmlFor="name-input"
                    className="text-sm font-medium text-foreground mb-1.5 block"
                  >
                    Full Name
                  </Label>
                  <Input
                    id="name-input"
                    data-ocid="profile_setup.name.input"
                    type="text"
                    placeholder="e.g. Priya Sharma"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="h-12 bg-surface-2 border-border text-foreground placeholder:text-muted-foreground"
                  />
                </div>

                <div>
                  <Label
                    htmlFor="phone-input"
                    className="text-sm font-medium text-foreground mb-1.5 block"
                  >
                    Mobile Number
                  </Label>
                  <div className="flex gap-2">
                    <div
                      className="flex items-center justify-center px-3 h-12 rounded-md border text-sm font-semibold text-foreground flex-shrink-0"
                      style={{
                        background: "oklch(0.22 0.018 265)",
                        borderColor: "oklch(0.26 0.018 265)",
                      }}
                    >
                      🇮🇳 +91
                    </div>
                    <Input
                      id="phone-input"
                      data-ocid="profile_setup.phone.input"
                      type="tel"
                      inputMode="numeric"
                      maxLength={10}
                      placeholder="10-digit mobile"
                      value={phone}
                      onChange={(e) =>
                        setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))
                      }
                      className="h-12 bg-surface-2 border-border text-foreground placeholder:text-muted-foreground flex-1"
                    />
                  </div>
                </div>
              </div>

              <Button
                data-ocid="profile_setup.send_otp.button"
                onClick={handleSendOTP}
                className="w-full h-12 mt-6 font-semibold text-base"
                style={{ background: "oklch(0.52 0.21 22)", color: "white" }}
              >
                <Smartphone className="w-4 h-4 mr-2" />
                Send OTP
              </Button>
            </div>
          </div>
        )}

        {/* Step: OTP */}
        {step === "otp" && (
          <div className="animate-slide-up">
            <div
              className="rounded-2xl p-6 border"
              style={{
                background: "oklch(0.18 0.015 265)",
                borderColor: "oklch(0.26 0.018 265)",
              }}
            >
              <h2 className="font-display text-xl font-bold text-foreground mb-1">
                Verify OTP
              </h2>
              <p className="text-muted-foreground text-sm mb-4">
                Enter the 6-digit code for +91 {phone}
              </p>

              {/* Simulated OTP display */}
              <div
                className="rounded-xl p-4 mb-6 text-center border"
                style={{
                  background: "oklch(0.52 0.21 22 / 0.1)",
                  borderColor: "oklch(0.52 0.21 22 / 0.4)",
                }}
                data-ocid="profile_setup.otp_display.panel"
              >
                <p className="text-xs text-muted-foreground mb-1">
                  📱 Simulated OTP (shown for demo)
                </p>
                <p
                  className="font-mono text-3xl font-bold tracking-widest"
                  style={{ color: "oklch(0.72 0.22 22)" }}
                >
                  {otpGenerated}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Your OTP: {otpGenerated}
                </p>
              </div>

              <div className="flex flex-col items-center gap-4">
                <InputOTP
                  maxLength={6}
                  value={otpEntered}
                  onChange={setOtpEntered}
                  data-ocid="profile_setup.otp.input"
                >
                  <InputOTPGroup>
                    <InputOTPSlot
                      index={0}
                      className="w-11 h-14 text-xl font-bold"
                    />
                    <InputOTPSlot
                      index={1}
                      className="w-11 h-14 text-xl font-bold"
                    />
                    <InputOTPSlot
                      index={2}
                      className="w-11 h-14 text-xl font-bold"
                    />
                    <InputOTPSlot
                      index={3}
                      className="w-11 h-14 text-xl font-bold"
                    />
                    <InputOTPSlot
                      index={4}
                      className="w-11 h-14 text-xl font-bold"
                    />
                    <InputOTPSlot
                      index={5}
                      className="w-11 h-14 text-xl font-bold"
                    />
                  </InputOTPGroup>
                </InputOTP>
              </div>

              <Button
                data-ocid="profile_setup.verify_otp.button"
                onClick={handleVerifyOTP}
                disabled={loading || otpEntered.length !== 6}
                className="w-full h-12 mt-6 font-semibold text-base"
                style={{ background: "oklch(0.52 0.21 22)", color: "white" }}
              >
                {loading ? "Verifying..." : "Verify & Create Profile"}
              </Button>

              <div className="flex items-center justify-between mt-4">
                <button
                  type="button"
                  data-ocid="profile_setup.back.button"
                  onClick={() => setStep("details")}
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  ← Change Number
                </button>
                <button
                  type="button"
                  data-ocid="profile_setup.resend_otp.button"
                  onClick={handleResendOTP}
                  className="text-sm hover:opacity-80 transition-opacity"
                  style={{ color: "oklch(0.62 0.22 22)" }}
                >
                  Resend OTP
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Step: Success */}
        {step === "success" && (
          <div className="animate-fade-in flex flex-col items-center text-center gap-4">
            <div
              className="w-20 h-20 rounded-full flex items-center justify-center"
              style={{ background: "oklch(0.62 0.19 145 / 0.2)" }}
            >
              <CheckCircle2
                className="w-10 h-10"
                style={{ color: "oklch(0.62 0.19 145)" }}
              />
            </div>
            <h2 className="font-display text-2xl font-bold text-foreground">
              Profile Created!
            </h2>
            <p className="text-muted-foreground text-sm">
              Welcome, {name}. Your number +91 {phone} is verified.
            </p>
          </div>
        )}
      </div>

      {/* Footer */}
      <p className="text-xs text-muted-foreground mt-8 text-center">
        © {new Date().getFullYear()}. Built with love using{" "}
        <a
          href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
          target="_blank"
          rel="noreferrer"
          className="underline"
        >
          caffeine.ai
        </a>
      </p>
    </div>
  );
}
