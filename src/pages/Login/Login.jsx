import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../../firebase/firebase";
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import { verifyOtp } from "../../API/authapis";
import ResponseModal from "./ResponseModal";

export default function Login() {
  const [authMode, setAuthMode] = useState("login");
  const [step, setStep] = useState("login");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [timer, setTimer] = useState(57);
  const [isTimerActive, setIsTimerActive] = useState(false);
  const [activeSlide, setActiveSlide] = useState(0);

  const [popup, setPopup] = useState({
    open: false,
    type: "success",
    title: "",
    message: "",
    loading: false,
  });

  const navigate = useNavigate();
  const otpInputsRef = useRef([]);

  const astrologersData = [
    {
      title: "Acharya Devendra Shastri",
      specialty: "Vedic & Kundli Specialist",
      experience: "21+ Years Exp",
      rating: "4.9 ★ (12k+ Consults)",
      image: "https://images.unsplash.com/photo-1566492031773-4f4e44671857?auto=format&fit=crop&q=80&w=800",
      quote: "Planetary alignments guide your path, but wisdom and karma shape your ultimate destiny."
    },
    {
      title: "Dr. Kalyani Upadhyay",
      specialty: "Tarot Reader & Numerologist",
      experience: "16+ Years Exp",
      rating: "5.0 ★ (8.5k+ Consults)",
      image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=800",
      quote: "Understand the subtle cosmic vibrations impacting your career, love, and spiritual growth."
    },
    {
      title: "Pandit Ramanath Iyer",
      specialty: "Nadi Astrologer & Gemologist",
      experience: "25+ Years Exp",
      rating: "4.9 ★ (15k+ Consults)",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=800",
      quote: "Ancient palm leaves and planetary dashas hold direct answers to your deepest questions."
    }
  ];

  useEffect(() => {
    const slideInterval = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % astrologersData.length);
    }, 4500);
    return () => clearInterval(slideInterval);
  }, [astrologersData.length]);

  const setupRecaptcha = () => {
    if (window.recaptchaVerifier) {
      try {
        window.recaptchaVerifier.clear();
      } catch (e) {
        console.error(e);
      }
      window.recaptchaVerifier = null;
    }

    window.recaptchaVerifier = new RecaptchaVerifier(auth, "recaptcha-container", {
      size: "invisible",
      callback: () => {},
      "expired-callback": () => {},
    });

    return window.recaptchaVerifier;
  };

  const switchAuthMode = (mode) => {
    setAuthMode(mode);
    setStep("login");
    setOtp(["", "", "", "", "", ""]);
    setTimer(57);
    setIsTimerActive(false);
  };

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
      const confirmation = await signInWithPhoneNumber(auth, `+91${phoneNumber}`, appVerifier);
      window.confirmationResult = confirmation;

      setTimeout(() => {
        setPopup({
          open: true,
          type: "success",
          title: "OTP Sent",
          message: `Verification code sent to +91 ${phoneNumber}`,
        });

        setTimeout(() => {
          setPopup((prev) => ({ ...prev, open: false }));
          setStep("otp");
          setTimer(57);
          setIsTimerActive(true);
        }, 1500);
      }, 700);
    } catch (err) {
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
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      otpInputsRef.current[index - 1]?.focus();
    }
  };

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
      const confirmation = await signInWithPhoneNumber(auth, `+91${phoneNumber}`, appVerifier);
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
      setPopup({
        open: true,
        type: "error",
        title: "Failed",
        message: err?.message || "Unable to resend OTP.",
      });
    }
  };

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
      const result = await window.confirmationResult.confirm(code);
      const idToken = await result.user.getIdToken();
      const response = await verifyOtp({ idToken });

      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.data));

      if (authMode === "register") {
        setPopup({
          open: true,
          type: "success",
          title: "Account Verified ✨",
          message: "Your account has been verified. Let's complete your profile.",
        });

        setTimeout(() => {
          navigate("/create-profile");
        }, 1800);

        return;
      }

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
      setPopup({
        open: true,
        type: "error",
        title: "Verification Failed",
        message: err?.response?.data?.message || "Incorrect OTP. Please try again.",
      });
    }
  };

  const formatTimer = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#F4F2F8] relative font-sans text-slate-800 antialiased selection:bg-purple-200 selection:text-purple-950 p-4 sm:p-6 lg:p-8 overflow-hidden">
      
      <div className="absolute inset-0 pointer-events-none overflow-hidden flex items-center justify-center">
        <div className="absolute top-10 left-1/4 w-[500px] h-[500px] bg-purple-200/50 rounded-full blur-[140px] animate-pulse" />
        <div className="absolute bottom-10 right-1/4 w-[500px] h-[500px] bg-violet-200/50 rounded-full blur-[140px] animate-pulse" style={{ animationDuration: "5s" }} />
      </div>

      <div className="relative z-10 w-full max-w-5xl bg-white rounded-[2.5rem] shadow-[0_20px_60px_-15px_rgba(109,40,217,0.14)] border border-purple-100/80 overflow-hidden flex flex-col lg:flex-row transition-all duration-500">
        
        <div className="lg:w-1/2 relative flex flex-col justify-between p-8 sm:p-12 lg:p-12 bg-gradient-to-br from-white via-purple-50/40 to-violet-50/60 border-b lg:border-b-0 lg:border-r border-purple-100/80 overflow-hidden">
          
          <div>
            <div className="flex items-center gap-3.5 mb-8">
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-purple-600 to-violet-600 flex items-center justify-center shadow-lg shadow-purple-500/30 text-white transform hover:scale-105 transition-transform duration-300">
                <svg className="w-6 h-6 animate-[spin_25s_linear_infinite]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
                  <circle cx="12" cy="12" r="4" />
                  <path d="M12 2v2m0 16v2M4.93 4.93l1.41 1.41m11.32 11.32l1.41 1.41M2 12h2m16 0h2M4.93 19.07l1.41-1.41m11.32-11.32l1.41-1.41" strokeLinecap="round" />
                </svg>
              </div>
              <h1 onClick={()=>navigate('/home')} className="text-xl font-bold tracking-[0.25em] text-slate-900 uppercase font-serif">
                Namah-Astro
              </h1>
            </div>

            <h2 className="text-3xl font-extrabold font-serif text-slate-950 leading-[1.2] tracking-tight">
              {authMode === "login" ? (
                <>
                  Welcome <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-700 to-violet-600">Back</span>
                </>
              ) : (
                <>
                  Begin Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-700 to-violet-600">Cosmic Journey</span>
                </>
              )}
            </h2>

            <p className="mt-3 text-sm text-slate-600 leading-relaxed font-normal">
              {authMode === "login"
                ? "Sign in to access personalized daily horoscopes, connect with verified astrologers, and explore ancient cosmic wisdom."
                : "Create your Namah-Astro account and connect with verified astrologers, personalized horoscopes, and cosmic wisdom."}
            </p>
          </div>

          <div className="my-6 bg-white/95 backdrop-blur-md rounded-2xl p-4 sm:p-5 border border-purple-100 shadow-[0_4px_20px_-4px_rgba(109,40,217,0.08)] relative overflow-hidden transition-all duration-300">
            <div className="relative h-[195px] overflow-hidden">
              {astrologersData.map((item, index) => (
                <div
                  key={item.title}
                  className={`absolute inset-0 flex flex-col justify-between transition-all duration-700 ease-out transform ${
                    index === activeSlide
                      ? "opacity-100 translate-y-0 scale-100"
                      : "opacity-0 translate-y-4 scale-95 pointer-events-none"
                  }`}
                >
                  <div className="flex items-center gap-3.5">
                    <div className="relative flex-shrink-0">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-14 h-14 rounded-2xl object-cover border-2 border-purple-200/80 shadow-sm"
                      />
                      <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-500 border-2 border-white rounded-full"></span>
                    </div>
                    <div className="min-w-0">
                      <h4 className="font-bold text-slate-900 text-sm font-serif truncate">{item.title}</h4>
                      <p className="text-xs text-purple-700 font-medium truncate">{item.specialty}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="px-2 py-0.5 bg-purple-50 text-purple-700 text-[10px] font-bold rounded-md border border-purple-100">
                          {item.experience}
                        </span>
                        <span className="text-[10px] text-slate-500 font-semibold">{item.rating}</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-purple-50/50 p-3 rounded-xl border border-purple-100/60 mt-2">
                    <p className="text-xs italic text-slate-700 leading-relaxed font-serif">
                      "{item.quote}"
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-center items-center gap-1.5 mt-3">
              {astrologersData.map((_, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => setActiveSlide(index)}
                  className={`transition-all duration-300 rounded-full cursor-pointer ${
                    index === activeSlide
                      ? "w-5 h-1.5 bg-purple-600"
                      : "w-1.5 h-1.5 bg-purple-200 hover:bg-purple-300"
                  }`}
                  aria-label={`Astrologer ${index + 1}`}
                />
              ))}
            </div>
          </div>

          <div className="text-xs font-medium text-slate-400 flex gap-6">
            <a href="#" className="hover:text-purple-700 transition-colors">Help Center</a>
            <a href="#" className="hover:text-purple-700 transition-colors">Verified Astrologers</a>
            <a href="#" className="hover:text-purple-700 transition-colors">Terms</a>
          </div>

        </div>

        <div className="lg:w-1/2 flex items-center justify-center p-8 sm:p-12 lg:p-14 bg-white">
          <div className="w-full max-w-sm">

            <div className="text-center mb-8">
              <span className="text-[11px] font-bold tracking-[0.3em] text-purple-600 uppercase">
                {step === "otp" ? "Cosmic Verification" : authMode === "login" ? "Secure Portal" : "New Account"}
              </span>
              <h2 className="text-2xl font-serif font-bold text-slate-900 tracking-tight mt-2">
                {step === "otp" ? "Verify Code" : authMode === "login" ? "Welcome Back" : "Create Account"}
              </h2>
              <p className="text-xs text-slate-500 mt-1 font-normal">
                {step === "otp"
                  ? `Enter the 6-digit code sent to +91 ${phoneNumber}`
                  : authMode === "login"
                  ? "Enter your mobile number to sign in."
                  : "Enter your mobile number to register."}
              </p>
            </div>

            {step === "login" && (
              <div className="space-y-5 transition-opacity duration-300">
                <form onSubmit={handleSendOtp} className="space-y-4">
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">
                      Phone Number
                    </label>
                    <div className="flex items-center border border-purple-200/80 rounded-2xl p-1 bg-purple-50/30 focus-within:bg-white focus-within:border-purple-600 focus-within:ring-4 focus-within:ring-purple-100 transition-all duration-300">
                      <span className="px-3.5 py-3 text-sm font-bold text-slate-700 border-r border-purple-200/60 bg-white/50 rounded-xl">
                        +91
                      </span>
                      <input
                        type="tel"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, ""))}
                        placeholder="98765 43210"
                        maxLength={10}
                        className="w-full px-4 py-3 text-sm bg-transparent outline-none text-slate-900 placeholder:text-slate-400 font-semibold tracking-wide"
                        required
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-4 px-4 bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-700 hover:to-violet-700 active:scale-[0.99] text-white font-bold text-sm rounded-2xl shadow-xl shadow-purple-600/25 transition-all duration-300 cursor-pointer flex items-center justify-center gap-2 group"
                  >
                    <span>{authMode === "login" ? "Send Login OTP" : "Send Registration OTP"}</span>
                    <span className="text-xs group-hover:translate-x-0.5 transition-transform">✨</span>
                  </button>
                </form>

                <div className="text-center text-xs text-slate-500 font-medium pt-2">
                  {authMode === "login" ? (
                    <>
                      New to Namah-Astro?{" "}
                      <button
                        type="button"
                        onClick={() => switchAuthMode("register")}
                        className="font-bold text-purple-600 hover:text-purple-700 hover:underline cursor-pointer"
                      >
                        Create an Account
                      </button>
                    </>
                  ) : (
                    <>
                      Already have an account?{" "}
                      <button
                        type="button"
                        onClick={() => switchAuthMode("login")}
                        className="font-bold text-purple-600 hover:text-purple-700 hover:underline cursor-pointer"
                      >
                        Login
                      </button>
                    </>
                  )}
                </div>
              </div>
            )}

            {step === "otp" && (
              <div className="space-y-6 transition-opacity duration-300">
                <div className="flex justify-between gap-2 my-2">
                  {otp.map((digit, idx) => (
                    <input
                      key={idx}
                      ref={(el) => (otpInputsRef.current[idx] = el)}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleOtpChange(e.target.value, idx)}
                      onKeyDown={(e) => handleOtpKeyDown(e, idx)}
                      className="w-11 h-13 sm:w-12 sm:h-14 text-center text-xl font-extrabold text-slate-900 bg-purple-50/40 border border-purple-200/80 rounded-2xl focus:bg-white focus:border-purple-600 focus:ring-4 focus:ring-purple-100 outline-none transition-all duration-200 shadow-sm"
                    />
                  ))}
                </div>

                <button
                  disabled={otp.join("").length !== 6}
                  type="button"
                  onClick={handleVerifyOtp}
                  className="w-full py-4 px-4 bg-gradient-to-r from-purple-600 to-violet-600 disabled:opacity-40 disabled:cursor-not-allowed hover:from-purple-700 hover:to-violet-700 active:scale-[0.99] text-white font-bold text-sm rounded-2xl shadow-xl shadow-purple-600/25 flex items-center justify-center gap-2 transition-all duration-300 cursor-pointer"
                >
                  <span>{authMode === "login" ? "Verify & Login" : "Verify & Register"}</span>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </button>

                <div className="text-center text-xs">
                  {timer > 0 ? (
                    <p className="text-slate-400 font-medium">
                      Resend code in <span className="font-bold text-purple-600">{formatTimer(timer)}</span>
                    </p>
                  ) : (
                    <button
                      type="button"
                      onClick={handleResend}
                      disabled={phoneNumber.length !== 10}
                      className="font-bold text-purple-600 hover:underline cursor-pointer focus:outline-none"
                    >
                      Resend OTP Code
                    </button>
                  )}
                </div>

                <div className="text-center pt-2">
                  <button
                    type="button"
                    onClick={() => setStep("login")}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    Change phone number
                  </button>
                </div>
              </div>
            )}

          </div>
        </div>

      </div>

      <div id="recaptcha-container"></div>

      <ResponseModal
        open={popup.open}
        type={popup.type}
        title={popup.title}
        message={popup.message}
        loading={popup.loading}
        onClose={() => setPopup((prev) => ({ ...prev, open: false }))}
      />

    </div>
  );
}