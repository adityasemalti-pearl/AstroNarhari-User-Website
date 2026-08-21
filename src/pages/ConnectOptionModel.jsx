import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

/**
 * ConnectOptionsModal
 * -------------------
 * Shown right after the astrologer profile modal's "Connect Now" is tapped.
 * Replaces the old direct jump into the booking/payment popup with a clean
 * choice between an Instant Chat and an Instant Call.
 *
 * Props:
 *  - astrologer        the selected astrologer object
 *  - walletBalance     number, current wallet balance
 *  - onClose           () => void
 *  - onSelectChat       async () => void   // parent triggers initiateChat + navigation
 *  - onSelectCall       async () => void   // parent triggers quickBooking + initiateCall + navigation
 *  - connectingType     'chat' | 'call' | null   // which action is currently in-flight
 *  - errorMessage       string | null      // surfaced from the parent if a call fails
 */
export default function ConnectOptionsModal({
  astrologer,
  walletBalance = 0,
  onClose,
  onSelectChat,
  onSelectCall,
  connectingType = null,
  errorMessage = null,
}) {
  const [hovered, setHovered] = useState(null);

  if (!astrologer) return null;

  const rate = Number(astrologer?.minRate) || 0;
  const isBusy = astrologer?.isBusy;
  const isAccepting = astrologer?.isAcceptingRequests !== false;
  const canAfford = walletBalance >= rate;
  const isConnecting = Boolean(connectingType);

  const OPTIONS = [
    {
      key: "chat",
      label: "Instant Chat",
      sub: "Text conversation, right now",
      icon: "💬",
      accent: "#52007A",
      glow: "rgba(82,0,122,0.18)",
      onClick: onSelectChat,
    },
    {
      key: "call",
      label: "Instant Call",
      sub: "Voice call, connects in seconds",
      icon: "📞",
      accent: "#B45309",
      glow: "rgba(217,119,6,0.18)",
      onClick: onSelectCall,
    },
  ];

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[70] flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm px-0 sm:px-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={!isConnecting ? onClose : undefined}
      >
        <motion.div
          onClick={(e) => e.stopPropagation()}
          initial={{ opacity: 0, y: 60, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 40, scale: 0.98 }}
          transition={{ type: "spring", damping: 28, stiffness: 300 }}
          className="relative w-full sm:max-w-lg bg-[#FDFBF9] rounded-t-[32px] sm:rounded-[32px] overflow-hidden shadow-2xl shadow-purple-950/30"
        >
          {/* ambient glow */}
          <div className="absolute -top-24 -right-16 w-64 h-64 bg-purple-200/40 rounded-full blur-[90px] pointer-events-none" />
          <div className="absolute -bottom-24 -left-16 w-64 h-64 bg-amber-100/50 rounded-full blur-[90px] pointer-events-none" />

          {/* drag handle (mobile) */}
          <div className="flex sm:hidden justify-center pt-3">
            <div className="w-10 h-1.5 rounded-full bg-slate-300" />
          </div>

          {!isConnecting && (
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full bg-white/80 hover:bg-white shadow-sm flex items-center justify-center text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
              aria-label="Close"
            >
              ✕
            </button>
          )}

          <div className="relative px-6 sm:px-8 pt-6 pb-8">
            {/* astrologer header */}
            <div className="flex items-center gap-4">
              <div className="relative shrink-0">
                <img
                  src={
                    astrologer.profilePic ||
                    "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
                  }
                  alt={astrologer.fullName}
                  className="w-16 h-16 rounded-full object-cover ring-4 ring-purple-100"
                />
                <span
                  className={`absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full border-2 border-white ${
                    isAccepting && !isBusy ? "bg-emerald-500" : "bg-slate-400"
                  }`}
                />
              </div>
              <div className="min-w-0">
                <h3 className="text-lg font-serif font-bold text-[#2D123A] truncate">
                  {astrologer.fullName}
                </h3>
                <p className="text-xs text-purple-600 font-medium mt-0.5">
                  {astrologer.specialties?.slice(0, 2).join(" • ") || "Vedic Expert"}
                </p>
                <p className="text-xs font-bold text-slate-700 mt-1">
                  ₹{rate}/min
                  <span className="text-slate-400 font-medium">
                    {" "}
                    · Wallet ₹{walletBalance}
                  </span>
                </p>
              </div>
            </div>

            <p className="text-sm text-slate-500 mt-5 mb-4">
              How would you like to connect with {astrologer.fullName?.split(" ")[0]}?
            </p>

            {/* availability / balance warnings */}
            {!isAccepting && (
              <div className="mb-4 text-xs font-semibold text-amber-800 bg-amber-50 border border-amber-200 rounded-2xl px-4 py-3">
                {astrologer.fullName} is offline right now. Try again shortly.
              </div>
            )}
            {isBusy && (
              <div className="mb-4 text-xs font-semibold text-amber-800 bg-amber-50 border border-amber-200 rounded-2xl px-4 py-3">
                {astrologer.fullName} is on another session. Please wait a moment.
              </div>
            )}
            {!canAfford && (
              <div className="mb-4 text-xs font-semibold text-rose-800 bg-rose-50 border border-rose-200 rounded-2xl px-4 py-3">
                Low balance — you need at least ₹{rate} to start. Please recharge your
                wallet.
              </div>
            )}
            {errorMessage && (
              <div className="mb-4 text-xs font-semibold text-rose-800 bg-rose-50 border border-rose-200 rounded-2xl px-4 py-3">
                {errorMessage}
              </div>
            )}

            {/* two option cards */}
            <div className="grid grid-cols-2 gap-4">
              {OPTIONS.map((opt) => {
                const disabled =
                  isConnecting || !isAccepting || isBusy || !canAfford;
                const thisLoading = connectingType === opt.key;

                return (
                  <motion.button
                    key={opt.key}
                    disabled={disabled}
                    onClick={opt.onClick}
                    onMouseEnter={() => setHovered(opt.key)}
                    onMouseLeave={() => setHovered(null)}
                    whileHover={!disabled ? { y: -4, scale: 1.02 } : {}}
                    whileTap={!disabled ? { scale: 0.97 } : {}}
                    className={`relative flex flex-col items-center justify-center gap-2 rounded-3xl border py-7 px-3 text-center transition-colors duration-200 ${
                      disabled
                        ? "border-slate-200 bg-slate-50 opacity-60 cursor-not-allowed"
                        : "border-purple-100 bg-white shadow-md shadow-purple-950/5 hover:shadow-xl cursor-pointer"
                    }`}
                    style={
                      hovered === opt.key && !disabled
                        ? { boxShadow: `0 20px 40px -12px ${opt.glow}` }
                        : undefined
                    }
                  >
                    <div
                      className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl mb-1"
                      style={{
                        backgroundColor: `${opt.accent}14`,
                        color: opt.accent,
                      }}
                    >
                      {thisLoading ? (
                        <span className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
                      ) : (
                        opt.icon
                      )}
                    </div>
                    <span
                      className="text-sm font-bold"
                      style={{ color: opt.accent }}
                    >
                      {thisLoading ? "Connecting…" : opt.label}
                    </span>
                    <span className="text-[10px] text-slate-500 leading-snug">
                      {opt.sub}
                    </span>
                  </motion.button>
                );
              })}
            </div>

            <p className="text-[10px] text-slate-400 text-center mt-6">
              Billing starts only once the session actually connects.
            </p>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}