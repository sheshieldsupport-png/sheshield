import {
  BookOpen,
  ChevronDown,
  ChevronLeft,
  FileText,
  HelpCircle,
  Info,
  MessageCircle,
  Phone,
  Shield,
} from "lucide-react";
import { useState } from "react";
import { useApp } from "../context/AppContext";

const legalItems = [
  {
    id: "about",
    icon: Info,
    title: "About",
    color: "oklch(0.50 0.22 295)",
    content: `SheShield is a smart women safety application designed to provide quick help and protection in emergency situations.

The app offers powerful features like SOS alerts, live location sharing, emergency contacts, offline SMS support, and real-time safety tools to ensure user security anytime, anywhere.

Our mission is to empower women with technology and create a safer environment by enabling instant access to help and support.

With a clean interface and reliable features, SheShield acts as a trusted companion for personal safety.`,
  },
  {
    id: "help",
    icon: HelpCircle,
    title: "Help",
    color: "oklch(0.50 0.22 145)",
    content: `Welcome to SheShield Help Center.

How to use the app:

1. SOS Button
Press and hold the SOS button to send an emergency alert along with your live location to your saved contacts.

2. Emergency Contacts
Add trusted contacts in the app so they can receive alerts during emergencies.

3. Live Location
You can share your real-time location with contacts for better safety tracking.

4. Offline Mode
If there is no internet connection, the app will send an SMS with your last known location.

5. Notifications
Check recent alerts and updates using the notification icon on the home screen.

6. Security
Enable PIN or biometric lock to protect your app from unauthorized access.

Tips:
- Always keep your location services ON
- Keep your emergency contacts updated
- Allow necessary permissions for smooth functioning

If you need further assistance, please contact support through the app.`,
  },
  {
    id: "contact",
    icon: Phone,
    title: "Contact Us",
    color: "oklch(0.55 0.22 25)",
    content: `We're here to help you anytime.

Email: sheshield.support@gmail.com
Phone: +91 8456916064`,
  },
  {
    id: "terms",
    icon: FileText,
    title: "Terms & Conditions",
    color: "oklch(0.50 0.15 250)",
    content: `Welcome to SheShield. By using this application, you agree to the following terms:

1. Usage
SheShield is designed for personal safety assistance. Users must use the app responsibly.

2. Emergency Services
SheShield does not replace official emergency services.

3. Data & Privacy
The app may collect location and basic data for functionality.

4. User Responsibility
Users must keep contacts updated and permissions enabled.

5. Limitation of Liability
SheShield is not liable for emergency failures.

6. Updates
Terms may be updated anytime.

7. Acceptance
Using the app means you agree to these terms.`,
  },
  {
    id: "privacy",
    icon: Shield,
    title: "Privacy Policy",
    color: "oklch(0.50 0.22 295)",
    content: `SheShield respects your privacy.

- Collects basic info (name, phone, location)
- Location used only for safety features
- Data is secure and not shared without consent
- Users can control permissions
- No data misuse`,
  },
  {
    id: "disclaimer",
    icon: BookOpen,
    title: "Disclaimer",
    color: "oklch(0.55 0.18 40)",
    content: `SheShield is a safety support app and does not guarantee emergency response.

- Not a replacement for police/ambulance
- Accuracy not guaranteed
- Depends on device/network
- No liability for failures`,
  },
  {
    id: "faq",
    icon: MessageCircle,
    title: "FAQ",
    color: "oklch(0.50 0.22 145)",
    content: `Q1. How does SOS work?
Press and hold SOS to send alert + location.

Q2. Works without internet?
Yes, via SMS.

Q3. Add contacts?
Use emergency contacts section.

Q4. Is data safe?
Yes, secure and private.

Q5. Forgot PIN?
Reset via OTP.

Q6. Biometric supported?
Yes.

Q7. Auto video recording?
Yes, if enabled.

Q8. Customize SOS message?
Yes.

Q9. Who to contact?
Email: sheshield.support@gmail.com
Phone: +91 8456916064`,
  },
];

export default function LegalScreen() {
  const { setScreen } = useApp();
  const [openId, setOpenId] = useState<string | null>(null);

  function toggle(id: string) {
    setOpenId((prev) => (prev === id ? null : id));
  }

  return (
    <div
      className="min-h-screen"
      style={{ background: "oklch(0.97 0.003 265)" }}
    >
      {/* Header */}
      <div
        className="sticky top-0 z-40 flex items-center gap-3 px-4 py-3"
        style={{
          background: "oklch(1 0 0 / 0.95)",
          backdropFilter: "blur(12px)",
          borderBottom: "1px solid oklch(0.88 0.005 265)",
        }}
      >
        <button
          type="button"
          onClick={() => setScreen("profile")}
          className="w-9 h-9 rounded-full flex items-center justify-center hover:bg-muted transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="font-bold text-base text-foreground">Legal</h1>
          <p className="text-xs text-muted-foreground">
            About, Help & Policies
          </p>
        </div>
      </div>

      <div className="max-w-md mx-auto px-4 py-5 flex flex-col gap-3">
        <div
          className="rounded-2xl border overflow-hidden"
          style={{
            borderColor: "oklch(0.88 0.005 265)",
            background: "oklch(1 0 0)",
          }}
        >
          {legalItems.map((item, idx) => {
            const Icon = item.icon;
            const isOpen = openId === item.id;
            const isLast = idx === legalItems.length - 1;

            return (
              <div key={item.id}>
                <button
                  type="button"
                  onClick={() => toggle(item.id)}
                  className="w-full flex items-center gap-3 px-4 py-4 hover:bg-muted transition-colors text-left"
                  style={{
                    borderBottom:
                      isLast && !isOpen
                        ? "none"
                        : "1px solid oklch(0.92 0.005 265)",
                  }}
                >
                  <div
                    className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ background: `${item.color}18` }}
                  >
                    <Icon className="w-5 h-5" style={{ color: item.color }} />
                  </div>
                  <span className="text-sm font-medium text-foreground flex-1">
                    {item.title}
                  </span>
                  <ChevronDown
                    className="w-4 h-4 text-muted-foreground transition-transform duration-200"
                    style={{
                      transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
                    }}
                  />
                </button>

                {isOpen && (
                  <div
                    className="px-5 pb-5 pt-2"
                    style={{
                      borderBottom: isLast
                        ? "none"
                        : "1px solid oklch(0.92 0.005 265)",
                      background: "oklch(0.985 0.003 265)",
                    }}
                  >
                    <p
                      className="text-sm leading-relaxed whitespace-pre-line"
                      style={{ color: "oklch(0.40 0.01 265)" }}
                    >
                      {item.content}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
