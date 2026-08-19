import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

import { auth } from "../../firebase/firebase";
import {
  RecaptchaVerifier,
  signInWithPhoneNumber,
} from "firebase/auth";
import { verifyOtp } from "../../API/authapis";
import ResponseModal from "./ResponseModal";

export default function Login() {
  const [authMode, setAuthMode] = useState("login"); // login | register
  const [step, setStep] = useState("login"); // login | otp

  const [phoneNumber, setPhoneNumber] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);

  const [timer, setTimer] = useState(57);
  const [isTimerActive, setIsTimerActive] = useState(false);

  const [popup, setPopup] = useState({
    open: false,
    type: "success",
    title: "",
    message: "",
    loading: false,
  });

  const navigate = useNavigate();
  const otpInputsRef = useRef([]);

  // =========================
  // RECAPTCHA
  // =========================

  const setupRecaptcha = () => {
    if (window.recaptchaVerifier) {
      try {
        window.recaptchaVerifier.clear();
      } catch (e) {
        console.error(e);
      }

      window.recaptchaVerifier = null;
    }

    window.recaptchaVerifier = new RecaptchaVerifier(
      auth,
      "recaptcha-container",
      {
        size: "invisible",
        callback: () => {},
        "expired-callback": () => {
          console.log("reCAPTCHA expired");
        },
      }
    );

    return window.recaptchaVerifier;
  };

  // =========================
  // SWITCH LOGIN / REGISTER
  // =========================

  const switchAuthMode = (mode) => {
    setAuthMode(mode);
    setStep("login");
    setOtp(["", "", "", "", "", ""]);
    setTimer(57);
    setIsTimerActive(false);
  };

  // =========================
  // SEND OTP
  // =========================

  const handleSendOtp = async (e) => {
    e.preventDefault();

    if (!/^[6-9]\d{9}$/.test(phoneNumber)) {
      return setPopup({
        open: true,
        type: "error",
        title: "Invalid Number",
        message: "Please enter a valid mobile number.",
      });
    }

    try {
      setPopup({
        open: true,
        type: "loading",
        title: authMode === "register" ? "Creating Account" : "Signing In",
        message: "Please wait while we send your verification code.",
        loading: true,
      });

      const appVerifier = setupRecaptcha();

      const confirmation = await signInWithPhoneNumber(
        auth,
        `+91${phoneNumber}`,
        appVerifier
      );

      window.confirmationResult = confirmation;

      setTimeout(() => {
        setPopup({
          open: true,
          type: "success",
          title: "OTP Sent",
          message: `Verification code sent to +91 ${phoneNumber}`,
        });

        setTimeout(() => {
          setPopup((prev) => ({
            ...prev,
            open: false,
          }));

          setStep("otp");
          setTimer(57);
          setIsTimerActive(true);
        }, 1500);
      }, 700);
    } catch (err) {
      console.error("Send OTP Error:", err);

      setPopup({
        open: true,
        type: "error",
        title: "OTP Failed",
        message: err?.message || "Unable to send OTP.",
      });

      if (window.recaptchaVerifier) {
        try {
          window.recaptchaVerifier.clear();
        } catch {}

        window.recaptchaVerifier = null;
      }
    }
  };

  // =========================
  // OTP TIMER
  // =========================

  useEffect(() => {
    let interval = null;

    if (isTimerActive && timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    } else if (timer === 0) {
      setIsTimerActive(false);
    }

    return () => clearInterval(interval);
  }, [isTimerActive, timer]);

  // =========================
  // CLEANUP RECAPTCHA
  // =========================

  useEffect(() => {
    return () => {
      if (window.recaptchaVerifier) {
        try {
          window.recaptchaVerifier.clear();
        } catch {}

        window.recaptchaVerifier = null;
      }
    };
  }, []);

  // =========================
  // OTP INPUT
  // =========================

  const handleOtpChange = (value, index) => {
    if (isNaN(value)) return;

    const newOtp = [...otp];

    newOtp[index] = value.substring(value.length - 1);

    setOtp(newOtp);

    if (value && index < 5) {
      otpInputsRef.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (e, index) => {
    if (
      e.key === "Backspace" &&
      !otp[index] &&
      index > 0
    ) {
      otpInputsRef.current[index - 1]?.focus();
    }
  };

  // =========================
  // RESEND OTP
  // =========================

  const handleResend = async () => {
    if (timer !== 0) return;

    setPopup({
      open: true,
      type: "loading",
      title: "Resending OTP",
      message: "Please wait...",
      loading: true,
    });

    try {
      const appVerifier = setupRecaptcha();

      const confirmation = await signInWithPhoneNumber(
        auth,
        `+91${phoneNumber}`,
        appVerifier
      );

      window.confirmationResult = confirmation;

      setPopup({
        open: true,
        type: "success",
        title: "OTP Sent Again",
        message: "A new verification code has been sent.",
      });

      setTimer(57);
      setIsTimerActive(true);
      setOtp(["", "", "", "", "", ""]);
    } catch (err) {
      console.error("Resend OTP Error:", err);

      setPopup({
        open: true,
        type: "error",
        title: "Failed",
        message: err?.message || "Unable to resend OTP.",
      });
    }
  };

  // =========================
  // VERIFY OTP
  // =========================

  const handleVerifyOtp = async () => {
    if (!window.confirmationResult) {
      return setPopup({
        open: true,
        type: "error",
        title: "Session Expired",
        message: "Please request a new OTP.",
      });
    }

    try {
      setPopup({
        open: true,
        type: "loading",
        title: "Verifying",
        message: "Checking your OTP...",
        loading: true,
      });

      const code = otp.join("");

      const result =
        await window.confirmationResult.confirm(code);

      const idToken = await result.user.getIdToken();

      const response = await verifyOtp({
        idToken,
      });

      console.log("Verify OTP Response:", response);

      localStorage.setItem(
        "token",
        response.data.token
      );

      localStorage.setItem(
        "user",
        JSON.stringify(response.data.data)
      );

      // =========================
      // REGISTER
      // =========================

      if (authMode === "register") {
        setPopup({
          open: true,
          type: "success",
          title: "Account Verified ✨",
          message:
            "Your account has been verified. Let's complete your profile.",
        });

        setTimeout(() => {
          navigate("/create-profile");
        }, 1800);

        return;
      }

      // =========================
      // LOGIN
      // =========================

      setPopup({
        open: true,
        type: "success",
        title: "Welcome Back ✨",
        message: "You have been logged in successfully.",
      });

      setTimeout(() => {
        navigate("/dashboard");
      }, 1800);
    } catch (err) {
      console.error("Verify OTP Error:", err);

      setPopup({
        open: true,
        type: "error",
        title: "Verification Failed",
        message:
          err?.response?.data?.message ||
          "Incorrect OTP. Please try again.",
      });
    }
  };

  // =========================
  // TIMER FORMAT
  // =========================

  const formatTimer = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;

    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  return (
    <div className="min-h-screen w-full flex bg-[#FAFAFC] relative font-sans text-slate-800 antialiased selection:bg-purple-100 selection:text-purple-900">

      {/* ================= LEFT SIDE ================= */}

      <div className="hidden lg:flex lg:w-1/2 relative flex-col justify-between p-12 xl:p-16 border-r border-purple-100/50 bg-white overflow-hidden">

        {/* Purple Glow */}

        <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[650px] bg-purple-200/50 rounded-full blur-[120px] opacity-70 animate-pulse" />
          <div className="absolute top-1/3 left-1/3 w-[350px] h-[350px] bg-violet-200/40 rounded-full blur-[100px]" />
          <div className="absolute bottom-0 right-0 w-[300px] h-[300px] bg-fuchsia-200/30 rounded-full blur-[100px]" />
        </div>

        {/* Logo & Heading */}

        <div className="relative z-10">

          <div className="flex items-center gap-3 mb-10">

            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-purple-100 to-violet-50 flex items-center justify-center shadow-inner border border-purple-200/60">

              <svg
                className="w-5 h-5 text-purple-600 animate-[spin_20s_linear_infinite]"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
              >
                <circle cx="12" cy="12" r="4" />
                <path
                  d="M12 2v2m0 16v2M4.93 4.93l1.41 1.41m11.32 11.32l1.41 1.41M2 12h2m16 0h2M4.93 19.07l1.41-1.41m11.32-11.32l1.41-1.41"
                  strokeLinecap="round"
                />
              </svg>

            </div>

            <h1 className="text-xl font-bold tracking-[0.2em] text-slate-950 uppercase font-serif">
              Namah-Astro
            </h1>

          </div>

          <h2 className="text-4xl xl:text-5xl font-extrabold font-serif text-slate-950 leading-tight tracking-tight">

            {authMode === "login" ? (
              <>
                Welcome <span className="text-purple-700">Back</span>
              </>
            ) : (
              <>
                Begin Your{" "}
                <span className="text-purple-700">
                  Cosmic Journey
                </span>
              </>
            )}

          </h2>

          <p className="mt-6 text-base text-slate-600 max-w-lg leading-relaxed">

            {authMode === "login"
              ? "Sign in to access personalized daily horoscopes, connect with verified astrologers, and explore the ancient wisdom written in the stars."
              : "Create your Namah-Astro account and connect with verified astrologers, personalized horoscopes, and ancient cosmic wisdom."}

          </p>

        </div>

        {/* Features */}

        <div className="relative z-10 grid grid-cols-2 gap-x-8 gap-y-6 my-12">

          {[
            {
              icon: "✨",
              title: "Personal Dasha",
              desc: "View detailed planetary periods.",
            },
            {
              icon: "🌙",
              title: "Daily Transit",
              desc: "How planets affect you today.",
            },
            {
              icon: "🤝",
              title: "Kundli Matching",
              desc: "Check compatibility reports.",
            },
            {
              icon: "🔮",
              title: "Live Consultation",
              desc: "Chat with expert astrologers.",
            },
          ].map((feat) => (
            <div
              key={feat.title}
              className="flex items-start gap-4 p-4 rounded-2xl bg-purple-50/50 border border-purple-100/50"
            >
              <div className="text-2xl mt-1">
                {feat.icon}
              </div>

              <div>
                <h4 className="font-semibold text-slate-900 text-sm">
                  {feat.title}
                </h4>

                <p className="text-xs text-slate-500 mt-0.5">
                  {feat.desc}
                </p>
              </div>
            </div>
          ))}

        </div>

        {/* Footer */}

        <div className="relative z-10 text-sm text-slate-500 flex gap-6">
          <a href="#" className="hover:text-purple-700">
            Help Center
          </a>

          <a href="#" className="hover:text-purple-700">
            Astrologer Partners
          </a>

          <a href="#" className="hover:text-purple-700">
            Blog
          </a>
        </div>

      </div>

      {/* ================= RIGHT SIDE ================= */}

      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-10 lg:p-16 xl:p-24 bg-[#FAFAFC]">

        {/* Premium Card */}

        <div className="relative z-10 w-full max-w-md bg-white rounded-3xl shadow-[0_20px_50px_-10px_rgba(74,0,224,0.06)] border border-purple-100/80 overflow-hidden transition-all duration-500 ease-out">

          {/* Header */}

          <div className="pt-9 pb-4 px-8 text-center flex flex-col items-center">

            {/* Mobile Logo */}

            <div className="lg:hidden mb-4 relative flex items-center justify-center">

              <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-purple-100 to-violet-50 flex items-center justify-center shadow-inner border border-purple-200/60">

                <svg
                  className="w-6 h-6 text-purple-600 animate-[spin_20s_linear_infinite]"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                >
                  <circle cx="12" cy="12" r="4" />

                  <path
                    d="M12 2v2m0 16v2M4.93 4.93l1.41 1.41m11.32 11.32l1.41 1.41M2 12h2m16 0h2M4.93 19.07l1.41-1.41m11.32-11.32l1.41-1.41"
                    strokeLinecap="round"
                  />
                </svg>

              </div>

            </div>

            {/* Dynamic Label */}

            <span className="lg:mt-0 mt-1.5 text-[11px] font-bold tracking-[0.25em] text-purple-600 uppercase">

              {step === "otp"
                ? "Cosmic Verification"
                : authMode === "login"
                ? "Secure Login"
                : "Create Account"}

            </span>

            {step === "login" && (
              <p className="mt-4 text-[11px] text-slate-400 leading-relaxed max-w-xs lg:hidden">

                By continuing, you agree to our{" "}

                <a
                  href="#"
                  className="underline decoration-purple-300 hover:text-purple-800 transition-colors"
                >
                  Terms
                </a>{" "}
                &{" "}

                <a
                  href="#"
                  className="underline decoration-purple-300 hover:text-purple-800 transition-colors"
                >
                  Privacy Policy
                </a>

              </p>
            )}

          </div>

          {/* ================= CONTENT ================= */}

          <div className="px-8 pb-8 pt-2">

            {/* ================= LOGIN / REGISTER ================= */}

            {step === "login" && (
              <div className="animate-fade-in space-y-5">

                <div className="text-center">

                  <h2 className="text-xl font-serif font-semibold text-slate-800">

                    {authMode === "login"
                      ? "Welcome Back to Namah-Astro"
                      : "Create Your Namah-Astro Account"}

                  </h2>

                  <p className="text-xs text-slate-500 mt-1">

                    {authMode === "login"
                      ? "Enter your mobile number to securely sign in."
                      : "Enter your mobile number to create your account."}

                  </p>

                </div>

                {/* Phone Form */}

                <form
                  onSubmit={handleSendOtp}
                  className="space-y-4"
                >

                  <div>

                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                      Phone Number
                    </label>

                    <div className="flex items-center border border-purple-100 rounded-2xl p-1 bg-purple-50/20 focus-within:bg-white focus-within:border-purple-400 focus-within:ring-4 focus-within:ring-purple-100/50 transition-all">

                      <span className="px-3.5 py-2.5 text-sm font-semibold text-slate-600 border-r border-purple-100 flex items-center gap-1">
                        +91

                        <svg
                          className="w-3.5 h-3.5 text-slate-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M19 9l-7 7-7-7"
                          />
                        </svg>

                      </span>

                      <input
                        type="tel"
                        value={phoneNumber}
                        onChange={(e) =>
                          setPhoneNumber(
                            e.target.value.replace(/\D/g, "")
                          )
                        }
                        placeholder="Enter mobile number"
                        maxLength={10}
                        className="w-full px-3.5 py-2.5 text-sm bg-transparent outline-none text-slate-800 placeholder:text-slate-400 font-medium tracking-wide"
                        required
                      />

                    </div>

                  </div>

                  <button
                    type="submit"
                    className="w-full py-3.5 px-4 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 active:scale-[0.99] text-white font-semibold text-sm rounded-2xl shadow-lg shadow-purple-500/20 transition-all duration-200 cursor-pointer flex items-center justify-center gap-2"
                  >

                    <span>
                      {authMode === "login"
                        ? "Send Login OTP"
                        : "Send Registration OTP"}
                    </span>

                    <span className="text-xs">
                      ✨
                    </span>

                  </button>

                </form>

                {/* SWITCH LOGIN / REGISTER */}

                <div className="pt-2 text-center text-xs text-slate-500">

                  {authMode === "login" ? (
                    <>
                      New to Namah-Astro?{" "}

                      <button
                        type="button"
                        onClick={() =>
                          switchAuthMode("register")
                        }
                        className="font-semibold text-purple-600 hover:text-purple-700 hover:underline"
                      >
                        Create an Account
                      </button>
                    </>
                  ) : (
                    <>
                      Already have an account?{" "}

                      <button
                        type="button"
                        onClick={() =>
                          switchAuthMode("login")
                        }
                        className="font-semibold text-purple-600 hover:text-purple-700 hover:underline"
                      >
                        Login
                      </button>
                    </>
                  )}

                </div>

              </div>
            )}

            {/* ================= OTP ================= */}

            {step === "otp" && (
              <div className="animate-fade-in space-y-5">

                <div className="text-center">

                  <h2 className="text-xl font-serif font-semibold text-slate-800">

                    {authMode === "login"
                      ? "Verify Login"
                      : "Verify Your Account"}

                  </h2>

                  <p className="text-xs text-slate-500 mt-1">

                    Enter the code sent to{" "}

                    <span className="font-semibold text-slate-700">
                      +91 {phoneNumber}
                    </span>

                  </p>

                </div>

                {/* OTP */}

                <div className="flex justify-between gap-1.5 my-5">

                  {otp.map((digit, idx) => (
                    <input
                      key={idx}
                      ref={(el) =>
                        (otpInputsRef.current[idx] = el)
                      }
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={(e) =>
                        handleOtpChange(
                          e.target.value,
                          idx
                        )
                      }
                      onKeyDown={(e) =>
                        handleOtpKeyDown(e, idx)
                      }
                      className="w-10 h-12 sm:w-11 sm:h-13 text-center text-lg font-bold text-slate-800 bg-purple-50/30 border border-purple-200/60 rounded-xl focus:bg-white focus:border-purple-500 focus:ring-4 focus:ring-purple-100 outline-none transition-all duration-150 shadow-inner"
                    />
                  ))}

                </div>

                {/* Verify */}

                <button
                  disabled={otp.join("").length !== 6}
                  type="button"
                  onClick={handleVerifyOtp}
                  className="w-full py-3.5 px-4 bg-gradient-to-r from-purple-500 to-purple-600 disabled:opacity-50 disabled:cursor-not-allowed hover:from-purple-600 hover:to-purple-700 active:scale-[0.99] text-white font-semibold text-sm rounded-2xl shadow-lg shadow-purple-500/20 flex items-center justify-center gap-2 transition-all duration-200 cursor-pointer"
                >

                  <span>
                    {authMode === "login"
                      ? "Verify & Login"
                      : "Verify & Create Account"}
                  </span>

                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M14 5l7 7m0 0l-7 7m7-7H3"
                    />
                  </svg>

                </button>

                {/* Timer */}

                <div className="text-center text-xs">

                  {timer > 0 ? (
                    <p className="text-slate-400">
                      Resend code in{" "}

                      <span className="font-semibold text-purple-600">
                        {formatTimer(timer)}
                      </span>
                    </p>
                  ) : (
                    <button
                      onClick={handleResend}
                      disabled={phoneNumber.length !== 10}
                      className="font-semibold text-purple-600 hover:underline focus:outline-none"
                    >
                      Resend OTP Code
                    </button>
                  )}

                </div>

                {/* Change Number */}

                <div className="pt-1 text-center">

                  <button
                    type="button"
                    onClick={() => setStep("login")}
                    className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-700 transition-colors"
                  >

                    <svg
                      className="w-3.5 h-3.5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M10 19l-7-7m0 0l7-7m-7 7h18"
                      />
                    </svg>

                    Change phone number

                  </button>

                </div>

              </div>
            )}

          </div>

          {/* Footer */}

          <div className="py-3 bg-purple-50/40 border-t border-purple-100/50 text-center lg:hidden">

            <p className="text-[10px] text-slate-400 font-medium">
              © 2026 Namah-Astro. All rights reserved.
            </p>

          </div>

        </div>

      </div>

      {/* Recaptcha */}

      <div id="recaptcha-container"></div>

      {/* Response Modal */}

      <ResponseModal
        open={popup.open}
        type={popup.type}
        title={popup.title}
        message={popup.message}
        loading={popup.loading}
        onClose={() =>
          setPopup((prev) => ({
            ...prev,
            open: false,
          }))
        }
      />

    </div>
  );
}