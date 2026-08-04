import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  CheckCircle2,
  XCircle,
  LoaderCircle,
  Sparkles,
  X,
} from "lucide-react";

const popupConfig = {
  success: {
    icon: CheckCircle2,
    iconBg: "bg-emerald-500",
    glow: "from-emerald-500/30 via-emerald-400/10 to-transparent",
    border: "border-emerald-300/30",
    button: "bg-emerald-500 hover:bg-emerald-600",
  },

  error: {
    icon: XCircle,
    iconBg: "bg-red-500",
    glow: "from-red-500/30 via-red-400/10 to-transparent",
    border: "border-red-300/30",
    button: "bg-red-500 hover:bg-red-600",
  },

  loading: {
    icon: LoaderCircle,
    iconBg: "bg-[#52007A]",
    glow: "from-purple-500/30 via-yellow-300/10 to-transparent",
    border: "border-purple-300/30",
    button: "bg-[#52007A]",
  },

  info: {
    icon: Sparkles,
    iconBg: "bg-[#C68E28]",
    glow: "from-yellow-400/30 via-yellow-300/10 to-transparent",
    border: "border-yellow-300/30",
    button: "bg-[#C68E28] hover:bg-[#b27f20]",
  },
};

export default function ResponseModal({
  open,
  type = "success",
  title,
  message,
  buttonText = "Continue",
  loading = false,
  onClose,
}) {
  const config = popupConfig[type];
  const Icon = config.icon;

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/45 backdrop-blur-md z-[999]"
          />

          {/* Popup */}

          <div className="fixed inset-0 z-[1000] flex items-center justify-center p-5">
            <motion.div
              initial={{
                opacity: 0,
                scale: 0.75,
                y: 40,
              }}
              animate={{
                opacity: 1,
                scale: 1,
                y: 0,
              }}
              exit={{
                opacity: 0,
                scale: 0.8,
                y: 30,
              }}
              transition={{
                duration: 0.35,
              }}
              className={`relative overflow-hidden w-full max-w-md rounded-3xl bg-white shadow-2xl border ${config.border}`}
            >
              {/* Glow */}

              <div
                className={`absolute -top-32 left-1/2 -translate-x-1/2 w-96 h-96 rounded-full bg-gradient-to-b ${config.glow} blur-3xl`}
              />

              {/* Floating Stars */}

              <motion.div
                animate={{
                  y: [0, -10, 0],
                  rotate: [0, 15, -15, 0],
                }}
                transition={{
                  repeat: Infinity,
                  duration: 4,
                }}
                className="absolute top-8 left-8 text-yellow-400"
              >
                ✨
              </motion.div>

              <motion.div
                animate={{
                  y: [0, 12, 0],
                  rotate: [0, -20, 20, 0],
                }}
                transition={{
                  repeat: Infinity,
                  duration: 5,
                }}
                className="absolute right-8 top-12 text-purple-500"
              >
                ⭐
              </motion.div>

              <motion.div
                animate={{
                  y: [0, -8, 0],
                }}
                transition={{
                  repeat: Infinity,
                  duration: 3,
                }}
                className="absolute bottom-10 left-10 text-amber-400"
              >
                🌙
              </motion.div>

              {/* Close */}

              {!loading && (
                <button
                  onClick={onClose}
                  className="absolute right-5 top-5 rounded-full p-2 hover:bg-slate-100 transition"
                >
                  <X size={18} />
                </button>
              )}

              <div className="relative px-8 py-10 text-center">
                {/* Icon */}

                <motion.div
                  initial={{
                    scale: 0,
                    rotate: -180,
                  }}
                  animate={{
                    scale: 1,
                    rotate: 0,
                  }}
                  transition={{
                    type: "spring",
                    stiffness: 220,
                  }}
                  className={`mx-auto flex h-20 w-20 items-center justify-center rounded-full text-white shadow-xl ${config.iconBg}`}
                >
                  {loading ? (
                    <LoaderCircle
                      className="animate-spin"
                      size={42}
                    />
                  ) : (
                    <Icon size={42} />
                  )}
                </motion.div>

                {/* Title */}

                <motion.h2
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15 }}
                  className="mt-6 text-3xl font-bold text-slate-800"
                >
                  {title}
                </motion.h2>

                {/* Message */}

                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.25 }}
                  className="mt-3 text-sm leading-7 text-slate-500"
                >
                  {message}
                </motion.p>

                {/* Button */}

                {!loading && (
                  <motion.button
                    whileHover={{
                      scale: 1.04,
                    }}
                    whileTap={{
                      scale: 0.96,
                    }}
                    onClick={onClose}
                    className={`mt-8 w-full rounded-2xl py-3.5 font-semibold text-white transition ${config.button}`}
                  >
                    {buttonText}
                  </motion.button>
                )}

                {/* Loading */}

                {loading && (
                  <div className="mt-8">
                    <div className="mx-auto h-2 w-full overflow-hidden rounded-full bg-slate-100">
                      <motion.div
                        animate={{
                          x: ["-100%", "250%"],
                        }}
                        transition={{
                          repeat: Infinity,
                          duration: 1.4,
                          ease: "linear",
                        }}
                        className="h-full w-1/3 rounded-full bg-gradient-to-r from-yellow-400 to-purple-700"
                      />
                    </div>

                    <p className="mt-4 text-xs text-slate-400">
                      Please wait...
                    </p>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}