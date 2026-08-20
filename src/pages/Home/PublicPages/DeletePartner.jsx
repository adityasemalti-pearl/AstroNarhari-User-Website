
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Phone,
  ShieldCheck,
  Send,
  CheckCircle2,
  X,
  Sparkles,
  UserRoundX,
  Loader2,
  Star,
  Moon,
  ArrowRight,
  LockKeyhole,
  CircleCheck,
} from "lucide-react";
import { deletePartnerByMobile } from "../../../API/homeApis";

export default function DeletePartner() {
  const [mobile, setMobile] = useState("");
  const [loading, setLoading] = useState(false);
  const [popup, setPopup] = useState(false);
  const [error, setError] = useState("");

  const formatNumber = (value) => {
    let cleaned = value.replace(/\D/g, "");

    if (cleaned.startsWith("91") && cleaned.length > 10) {
      cleaned = cleaned.substring(2);
    }

    return cleaned.slice(0, 10);
  };

  const handleMobileChange = (e) => {
    setMobile(formatNumber(e.target.value));
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!mobile) {
      setError("Please enter your mobile number.");
      return;
    }

    if (mobile.length !== 10) {
      setError("Please enter a valid 10-digit mobile number.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const finalNumber = `+91${mobile}`;

      await deletePartnerByMobile(finalNumber);

      setPopup(true);
      setMobile("");
    } catch (err) {
      console.error("Delete Partner Request Error:", err);

      setError(
        err?.response?.data?.message ||
          "Unable to send your request. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#faf9ff] text-slate-800 relative overflow-hidden">

      {/* ================= BACKGROUND ================= */}

      <div className="absolute inset-0 pointer-events-none overflow-hidden">

        <motion.div
          animate={{
            rotate: [0, 360],
          }}
          transition={{
            duration: 45,
            repeat: Infinity,
            ease: "linear",
          }}
          className="absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full border border-purple-200/40"
        />

        <motion.div
          animate={{
            rotate: [360, 0],
          }}
          transition={{
            duration: 55,
            repeat: Infinity,
            ease: "linear",
          }}
          className="absolute -top-24 -left-24 w-[450px] h-[450px] rounded-full border border-violet-200/40"
        />

        <motion.div
          animate={{
            scale: [1, 1.15, 1],
            opacity: [0.25, 0.45, 0.25],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute top-[-150px] right-[-150px] w-[600px] h-[600px] rounded-full bg-purple-300/30 blur-3xl"
        />

        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute bottom-[-200px] left-[-150px] w-[600px] h-[600px] rounded-full bg-violet-300/25 blur-3xl"
        />

        {/* Stars */}
        <motion.div
          animate={{ y: [0, -15, 0], opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 3, repeat: Infinity }}
          className="absolute top-28 left-[15%]"
        >
          <Star className="w-4 h-4 text-purple-400 fill-purple-200" />
        </motion.div>

        <motion.div
          animate={{ y: [0, 12, 0], opacity: [0.3, 1, 0.3] }}
          transition={{ duration: 4, repeat: Infinity }}
          className="absolute top-[30%] right-[12%]"
        >
          <Sparkles className="w-5 h-5 text-violet-400" />
        </motion.div>

        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 3.5, repeat: Infinity }}
          className="absolute bottom-[20%] left-[8%]"
        >
          <Star className="w-3 h-3 text-purple-300 fill-purple-100" />
        </motion.div>
      </div>

      {/* ================= HEADER ================= */}

      <header className="relative z-10 border-b border-purple-100/70 bg-white/70 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 h-20 flex items-center justify-between">

          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-purple-800 to-violet-600 flex items-center justify-center shadow-lg shadow-purple-500/20">
              <Sparkles className="w-5 h-5 text-white" />
            </div>

            <div>
              <h1 className="text-lg font-serif font-bold tracking-wide text-purple-950">
                ASTROLOGY
              </h1>
              <p className="text-[10px] uppercase tracking-[0.25em] text-purple-500 font-semibold">
                Partner Portal
              </p>
            </div>
          </div>

          <div className="hidden sm:flex items-center gap-2 text-xs font-semibold text-slate-500">
            <LockKeyhole className="w-4 h-4 text-purple-600" />
            Secure & Confidential
          </div>
        </div>
      </header>

      {/* ================= HERO ================= */}

      <main className="relative z-10 max-w-7xl mx-auto px-6 lg:px-10 py-12 lg:py-20">

        <div className="grid lg:grid-cols-[1.05fr_0.95fr] gap-12 xl:gap-20 items-center">

          {/* ================= LEFT ================= */}

          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
            className="relative"
          >

            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-50 border border-purple-100 text-purple-700 text-xs font-bold uppercase tracking-wider">
              <ShieldCheck className="w-4 h-4" />
              Account Privacy Center
            </div>

            <h2 className="mt-7 text-4xl md:text-5xl xl:text-6xl font-serif font-bold text-purple-950 leading-[1.08]">
              Take Control of
              <span className="block bg-gradient-to-r from-purple-700 via-violet-600 to-purple-500 bg-clip-text text-transparent">
                Your Account
              </span>
            </h2>

            <p className="mt-6 text-slate-500 text-base md:text-lg leading-8 max-w-xl">
              If you wish to permanently delete your partner account, submit
              your registered mobile number below. Our team will securely
              review and process your request.
            </p>

            {/* Benefits */}

            <div className="mt-9 grid sm:grid-cols-2 gap-4 max-w-xl">

              <div className="bg-white/80 backdrop-blur-sm border border-purple-100 rounded-2xl p-5 shadow-sm">
                <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center mb-3">
                  <ShieldCheck className="w-5 h-5 text-purple-700" />
                </div>

                <h3 className="font-bold text-purple-950 text-sm">
                  Secure Request
                </h3>

                <p className="mt-1 text-xs text-slate-500 leading-5">
                  Your request is handled securely and confidentially.
                </p>
              </div>

              <div className="bg-white/80 backdrop-blur-sm border border-purple-100 rounded-2xl p-5 shadow-sm">
                <div className="w-10 h-10 rounded-xl bg-violet-50 flex items-center justify-center mb-3">
                  <UserRoundX className="w-5 h-5 text-violet-700" />
                </div>

                <h3 className="font-bold text-purple-950 text-sm">
                  Easy Process
                </h3>

                <p className="mt-1 text-xs text-slate-500 leading-5">
                  Just enter your registered number and send the request.
                </p>
              </div>

            </div>

            {/* Decorative Astrology Card */}

            <motion.div
              animate={{
                y: [0, -8, 0],
              }}
              transition={{
                duration: 5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="hidden md:flex absolute -bottom-20 right-0 xl:right-10 w-44 h-44 rounded-full border border-purple-200/60 items-center justify-center"
            >
              <div className="w-32 h-32 rounded-full border border-violet-200/60 flex items-center justify-center">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-purple-700 to-violet-500 flex items-center justify-center shadow-xl shadow-purple-500/30">
                  <Moon className="w-9 h-9 text-white" />
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* ================= RIGHT FORM ================= */}

          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="relative"
          >

            <div className="absolute -inset-3 bg-gradient-to-r from-purple-200/30 to-violet-200/30 rounded-[2.5rem] blur-xl" />

            <div className="relative bg-white rounded-[2rem] border border-purple-100 shadow-2xl shadow-purple-900/10 overflow-hidden">

              {/* Form Header */}

              <div className="bg-gradient-to-br from-purple-950 via-purple-900 to-violet-800 px-8 md:px-10 py-8 text-white relative overflow-hidden">

                <div className="absolute right-[-40px] top-[-50px] w-44 h-44 rounded-full border border-white/10" />
                <div className="absolute right-[-10px] top-[-20px] w-24 h-24 rounded-full border border-white/10" />

                <div className="relative flex items-start gap-4">

                  <div className="w-12 h-12 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center shrink-0">
                    <UserRoundX className="w-6 h-6 text-purple-100" />
                  </div>

                  <div>
                    <p className="text-xs uppercase tracking-[0.2em] text-purple-300 font-bold">
                      Delete Account
                    </p>

                    <h3 className="mt-1 text-2xl font-serif font-bold">
                      Submit Your Request
                    </h3>

                    <p className="mt-2 text-sm text-purple-200 leading-5">
                      Enter your registered mobile number to continue.
                    </p>
                  </div>

                </div>
              </div>

              {/* Form Body */}

              <div className="p-8 md:p-10">

                <form onSubmit={handleSubmit}>

                  <label className="block text-sm font-bold text-slate-700 mb-3">
                    Registered Mobile Number
                  </label>

                  <div
                    className={`flex h-16 rounded-2xl border bg-slate-50/70 overflow-hidden transition-all ${
                      error
                        ? "border-red-300 ring-4 ring-red-50"
                        : "border-purple-100 focus-within:border-purple-500 focus-within:ring-4 focus-within:ring-purple-100"
                    }`}
                  >

                    <div className="px-5 flex items-center gap-2 border-r border-purple-100 text-purple-900 font-bold text-sm bg-purple-50/50">
                      <Phone className="w-4 h-4" />
                      +91
                    </div>

                    <input
                      type="tel"
                      value={mobile}
                      onChange={handleMobileChange}
                      placeholder="98765 43210"
                      maxLength={10}
                      className="flex-1 min-w-0 bg-transparent outline-none px-5 text-base font-semibold text-slate-800 placeholder:text-slate-400"
                    />
                  </div>

                  {error && (
                    <motion.p
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-2 text-xs text-red-500 font-semibold"
                    >
                      {error}
                    </motion.p>
                  )}

                  {/* Privacy Notice */}

                  <div className="mt-6 rounded-2xl bg-purple-50/70 border border-purple-100 p-5">

                    <div className="flex gap-3">
                      <div className="w-9 h-9 rounded-xl bg-white flex items-center justify-center shrink-0 shadow-sm">
                        <ShieldCheck className="w-4 h-4 text-purple-700" />
                      </div>

                      <div>
                        <p className="text-sm font-bold text-purple-950">
                          Your information is protected
                        </p>

                        <p className="mt-1 text-xs text-slate-500 leading-5">
                          We use your mobile number only to identify your
                          partner account and process your deletion request.
                        </p>
                      </div>
                    </div>

                  </div>

                  {/* Submit */}

                  <motion.button
                    type="submit"
                    disabled={loading}
                    whileHover={{ scale: loading ? 1 : 1.015 }}
                    whileTap={{ scale: loading ? 1 : 0.98 }}
                    className="mt-6 w-full h-14 rounded-2xl bg-gradient-to-r from-purple-800 via-purple-700 to-violet-600 hover:from-purple-900 hover:to-violet-700 text-white font-bold text-sm shadow-xl shadow-purple-500/20 flex items-center justify-center gap-2 transition-all disabled:opacity-70"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Sending Request...
                      </>
                    ) : (
                      <>
                        Send Deletion Request
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </motion.button>

                </form>

                {/* Bottom Trust */}

                <div className="mt-7 pt-6 border-t border-slate-100 flex items-center justify-between">

                  <div className="flex items-center gap-2">
                    <LockKeyhole className="w-4 h-4 text-purple-500" />
                    <span className="text-[11px] font-semibold text-slate-400">
                      Secure & Confidential
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <CircleCheck className="w-4 h-4 text-emerald-500" />
                    <span className="text-[11px] font-semibold text-slate-400">
                      Verified Process
                    </span>
                  </div>

                </div>

              </div>
            </div>
          </motion.div>
        </div>

        {/* ================= BOTTOM STEPS ================= */}

        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-20"
        >

          <div className="text-center mb-8">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-purple-500">
              Simple & Secure
            </p>

            <h3 className="mt-2 text-2xl md:text-3xl font-serif font-bold text-purple-950">
              How the Process Works
            </h3>
          </div>

          <div className="grid md:grid-cols-3 gap-5">

            {[
              {
                number: "01",
                title: "Enter Number",
                text: "Provide the mobile number registered with your partner account.",
              },
              {
                number: "02",
                title: "Send Request",
                text: "Submit your account deletion request securely through our platform.",
              },
              {
                number: "03",
                title: "We Review",
                text: "Our team reviews the request and processes it after verification.",
              },
            ].map((step, index) => (
              <motion.div
                key={step.number}
                whileHover={{ y: -5 }}
                className="relative bg-white border border-purple-100 rounded-3xl p-7 shadow-sm hover:shadow-lg hover:shadow-purple-900/5 transition-all"
              >
                <div className="flex items-center gap-4">

                  <div className="w-12 h-12 rounded-2xl bg-purple-50 border border-purple-100 flex items-center justify-center text-purple-700 font-bold">
                    {step.number}
                  </div>

                  <div>
                    <h4 className="font-bold text-purple-950">
                      {step.title}
                    </h4>

                    <p className="mt-1 text-xs text-slate-500 leading-5">
                      {step.text}
                    </p>
                  </div>

                </div>

                {index < 2 && (
                  <div className="hidden md:block absolute top-1/2 -right-4 w-8 h-px bg-purple-200" />
                )}
              </motion.div>
            ))}

          </div>
        </motion.div>

      </main>

      {/* ================= FOOTER ================= */}

      <footer className="relative z-10 border-t border-purple-100 bg-white/70 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 py-7 flex flex-col md:flex-row items-center justify-between gap-3">

          <p className="text-xs text-slate-400">
            © {new Date().getFullYear()} Astrology Partner Portal. All rights
            reserved.
          </p>

          <div className="flex items-center gap-2 text-xs text-slate-400">
            <Sparkles className="w-3.5 h-3.5 text-purple-400" />
            Your privacy matters to us
          </div>

        </div>
      </footer>

      {/* ================= SUCCESS POPUP ================= */}

      <AnimatePresence>
        {popup && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-purple-950/50 backdrop-blur-md flex items-center justify-center px-5"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.75, y: 40 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 30 }}
              transition={{
                type: "spring",
                stiffness: 260,
                damping: 22,
              }}
              className="relative w-full max-w-lg bg-white rounded-[2rem] shadow-2xl overflow-hidden"
            >

              {/* Purple Top */}

              <div className="h-2 bg-gradient-to-r from-purple-800 via-violet-500 to-purple-800" />

              <button
                onClick={() => setPopup(false)}
                className="absolute top-5 right-5 w-9 h-9 rounded-full bg-slate-100 hover:bg-purple-50 flex items-center justify-center text-slate-500 hover:text-purple-700 transition"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="px-8 md:px-12 py-10 text-center">

                {/* Animated Check */}

                <div className="relative mx-auto w-24 h-24 flex items-center justify-center">

                  <motion.div
                    animate={{
                      scale: [1, 1.15, 1],
                      opacity: [0.5, 0.2, 0.5],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                    }}
                    className="absolute inset-0 rounded-full bg-purple-200"
                  />

                  <motion.div
                    initial={{ scale: 0, rotate: -30 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{
                      delay: 0.1,
                      type: "spring",
                      stiffness: 220,
                    }}
                    className="relative w-16 h-16 rounded-full bg-gradient-to-br from-purple-700 to-violet-500 flex items-center justify-center shadow-xl shadow-purple-500/30"
                  >
                    <CheckCircle2 className="w-9 h-9 text-white" />
                  </motion.div>

                </div>

                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.25 }}
                >

                  <div className="mt-7 inline-flex items-center gap-2 bg-emerald-50 text-emerald-700 border border-emerald-100 px-4 py-2 rounded-full text-xs font-bold">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Successfully Submitted
                  </div>

                  <h2 className="mt-5 text-3xl font-serif font-bold text-purple-950">
                    Request Sent!
                  </h2>

                  <p className="mt-3 text-sm text-slate-500 leading-6 max-w-sm mx-auto">
                    Your account deletion request has been received. Our team
                    will review your request and contact you if verification
                    is required.
                  </p>

                  <div className="mt-7 rounded-2xl bg-purple-50 border border-purple-100 p-4 text-left">
                    <div className="flex gap-3">
                      <ShieldCheck className="w-5 h-5 text-purple-700 shrink-0" />

                      <p className="text-xs text-purple-900/70 leading-5">
                        Please keep your registered mobile number available in
                        case our support team needs to verify your request.
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => setPopup(false)}
                    className="mt-7 w-full h-13 py-3.5 rounded-2xl bg-purple-900 hover:bg-purple-800 text-white text-sm font-bold shadow-lg shadow-purple-900/20 transition"
                  >
                    Done
                  </button>

                </motion.div>

              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}

