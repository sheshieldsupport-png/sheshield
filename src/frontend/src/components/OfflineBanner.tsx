import { WifiOff } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";

interface OfflineBannerProps {
  visible: boolean;
}

export default function OfflineBanner({ visible }: OfflineBannerProps) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: -40, scaleY: 0.6 }}
          animate={{ opacity: 1, y: 0, scaleY: 1 }}
          exit={{ opacity: 0, y: -40, scaleY: 0.6 }}
          transition={{ type: "spring", stiffness: 420, damping: 30 }}
          className="w-full rounded-xl flex items-center gap-3 px-4 py-3"
          style={{
            background:
              "linear-gradient(90deg, oklch(0.38 0.18 25) 0%, oklch(0.44 0.16 50) 100%)",
            boxShadow: "0 2px 12px oklch(0.38 0.18 25 / 0.35)",
          }}
          data-ocid="home.offline_banner.panel"
        >
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
            style={{ background: "oklch(1 0 0 / 0.15)" }}
          >
            <WifiOff className="w-4 h-4 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-white text-xs font-bold leading-tight">
              No internet connection
            </p>
            <p className="text-orange-100 text-[11px] mt-0.5 leading-tight">
              Offline safety mode active. SOS works via SMS.
            </p>
          </div>
          <span
            className="text-[10px] font-bold px-2 py-0.5 rounded-full flex-shrink-0"
            style={{
              background: "oklch(1 0 0 / 0.18)",
              color: "oklch(1 0 0 / 0.9)",
            }}
          >
            OFFLINE
          </span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
