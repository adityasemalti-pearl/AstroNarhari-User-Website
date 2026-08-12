import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

import { auth } from "../../firebase/firebase";
import {
  RecaptchaVerifier,
  signInWithPhoneNumber,
} from "firebase/auth";
import { verifyOtp } from '../../API/authapis';
import ResponseModal from './ResponseModal';

export default function Login() {
  const [step, setStep] = useState('login'); // 'login' | 'otp'
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [timer, setTimer] = useState(57);
  const [isTimerActive, setIsTimerActive] = useState(false);
  const [popup, setPopup] = useState({
    open: false,
    type: "success",
    title: "",
    message: "",
    loading: false,
  });


  const navigate = useNavigate()

  const otpInputsRef = useRef([]);

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
        callback: () => { },
        "expired-callback": () => {
          console.log("reCAPTCHA expired");
        },
      }
    );

    return window.recaptchaVerifier;
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
        title: "Sending OTP",
        message: "Please wait while we verify your phone.",
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
        }, 1800);
      }, 700);

    } catch (err) {

      setPopup({
        open: true,
        type: "error",
        title: "OTP Failed",
        message:
          err?.message ||
          "Unable to send OTP.",
      });

      if (window.recaptchaVerifier) {
        try {
          window.recaptchaVerifier.clear();
        } catch { }

        window.recaptchaVerifier = null;
      }
    }
  };



  // Countdown timer handler for OTP
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
        } catch (e) { }

        window.recaptchaVerifier = null;
      }
    };
  }, []);





  const handleOtpChange = (value, index) => {
    if (isNaN(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value.substring(value.length - 1);
    setOtp(newOtp);

    // Auto-focus next input field
    if (value && index < 5) {
      otpInputsRef.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (e, index) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
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

      const confirmation =
        await signInWithPhoneNumber(
          auth,
          `+91${phoneNumber}`,
          appVerifier
        );

      window.confirmationResult =
        confirmation;

      setPopup({
        open: true,
        type: "success",
        title: "OTP Sent Again",
        message:
          "A new verification code has been sent.",
      });

      setTimer(57);
      setIsTimerActive(true);

      setOtp([
        "",
        "",
        "",
        "",
        "",
        "",
      ]);

    } catch (err) {

      setPopup({
        open: true,
        type: "error",
        title: "Failed",
        message:
          err.message,
      });
    }
  };


  const handleVerifyOtp = async () => {
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

      const idToken =
        await result.user.getIdToken();

      const response =
        await verifyOtp({
          idToken,
        });

      localStorage.setItem(
        "token",
        response.data.token
      );

      localStorage.setItem(
        "user",
        JSON.stringify(response.data.data)
      );

      setPopup({
        open: true,
        type: "success",
        title: "Welcome Back ✨",
        message:
          "Your account has been verified successfully.",
      });

      setTimeout(() => {
        navigate("/create-profile");
      }, 2200);

    } catch (err) {

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



  // const handleVerifyOtp = async () => {
  //   try {

  //     const code = otp.join("");

  //     const result =
  //       await window.confirmationResult.confirm(code);

  //     const idToken =
  //       await result.user.getIdToken();

  //     const response = await verifyOtp({
  //       idToken
  //     });

  //     localStorage.setItem(
  //       "token",
  //       response.data.token
  //     );

  //     localStorage.setItem(
  //       "user",
  //       JSON.stringify(response.data.data)
  //     );

  //     navigate("/dashboard");

  //   } catch (err) {

  //     console.log(err);

  //     alert(
  //       err?.response?.data?.message ||
  //       err.message
  //     );

  //   }
  // };

  const formatTimer = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#FAFAFC] p-4 font-sans text-slate-800 antialiased selection:bg-purple-100 selection:text-purple-900">

      {/* Background Celestial Aura */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-gradient-to-b from-purple-200/40 via-amber-100/30 to-transparent rounded-full blur-3xl opacity-70" />
      </div>

      {/* Main Card Container */}
      <div className="relative z-10 w-full max-w-md bg-white rounded-3xl shadow-[0_20px_50px_rgba(74,30,92,0.06)] border border-purple-50/60 overflow-hidden transition-all duration-500 ease-out">

        {/* Top Header & Branding */}
        <div className="pt-10 pb-6 px-8 text-center flex flex-col items-center">
          <h1
            className="text-2xl font-serif font-bold tracking-[0.2em] text-[#4A1E5C] uppercase"
            style={{ fontFamily: "'Cinzel', 'Playfair Display', Georgia, serif" }}
          >
            Namah-Astro
          </h1>

          {step === 'login' ? (
            <span className="mt-2 text-[10px] font-semibold tracking-[0.22em] text-[#C68E28] uppercase">
              Guidance From The Stars
            </span>
          ) : (
            <div className="mt-4 flex justify-center text-[#E2B142] animate-pulse">
              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5L12 2Z" />
              </svg>
            </div>
          )}

          {step === 'login' && (
            <p className="mt-4 text-xs text-slate-400 leading-relaxed max-w-xs">
              By continuing, you agree to our{' '}
              <a href="#" className="underline decoration-purple-300 hover:text-purple-900 transition-colors">Terms of Service</a> &{' '}
              <a href="#" className="underline decoration-purple-300 hover:text-purple-900 transition-colors">Privacy Policy</a>
            </p>
          )}
        </div>

        {/* Dynamic Animated Steps */}
        <div className="px-8 pb-10">

          {/* STEP 1: LOGIN / REGISTER */}
          {step === 'login' && (
            <div className="animate-fade-in space-y-6">
              <div className="text-center sm:text-left">
                <h2 className="text-2xl font-serif font-semibold text-[#2D123A]">Welcome Back</h2>
                <p className="text-sm text-slate-500 mt-1">
                  Log in to view your daily cosmic alignment.
                </p>
              </div>

              <form onSubmit={handleSendOtp} className="space-y-5">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">
                    Phone Number
                  </label>
                  <div className="flex items-center border border-slate-200 rounded-2xl p-1 bg-slate-50/50 focus-within:bg-white focus-within:border-[#52007A] focus-within:ring-4 focus-within:ring-purple-100 transition-all">
                    <span className="px-3.5 py-2.5 text-sm font-medium text-slate-600 border-r border-slate-200 flex items-center gap-1">
                      +91
                      <svg className="w-3.5 h-3.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                      </svg>
                    </span>
                    <input
                      type="tel"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      placeholder="Enter mobile number"
                      maxLength={10}
                      className="w-full px-3.5 py-2.5 text-sm bg-transparent outline-none text-slate-800 placeholder:text-slate-400 font-medium"
                      required
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 px-4 bg-[#52007A] hover:bg-[#400060] active:scale-[0.99] text-white font-medium text-sm rounded-2xl shadow-lg shadow-purple-900/15 transition-all duration-200 cursor-pointer"
                >
                  Send OTP
                </button>
              </form>

              {/* Social Login Divider */}
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-100" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white px-3 text-slate-400 tracking-wider text-[11px] font-medium">
                    Or continue with
                  </span>
                </div>
              </div>

              {/* Social Buttons */}
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  className="flex items-center justify-center gap-2 py-3 px-4 rounded-2xl border border-slate-200 hover:bg-slate-50 active:bg-slate-100 text-slate-700 font-medium text-xs transition-all"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                  </svg>
                  Google
                </button>

                <button
                  type="button"
                  className="flex items-center justify-center gap-2 py-3 px-4 rounded-2xl border border-slate-200 hover:bg-slate-50 active:bg-slate-100 text-slate-700 font-medium text-xs transition-all"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.85c.66-.8 1.11-1.92.99-3.04-.96.04-2.12.64-2.81 1.44-.61.71-1.15 1.86-1 2.97 1.07.08 2.16-.57 2.82-1.37z" />
                  </svg>
                  Apple
                </button>
              </div>

              <div className="pt-2 text-center text-xs text-slate-500">
                New to AstroHari?{' '}
                <a href="#" className="font-semibold text-[#52007A] hover:underline">
                  Create an Account
                </a>
              </div>
            </div>
          )}

          {/* STEP 2: OTP VERIFICATION */}
          {step === 'otp' && (
            <div className="animate-fade-in space-y-6">
              <div className="text-center">
                <h2 className="text-2xl font-serif font-semibold text-[#2D123A]">Verify Identity</h2>
                <p className="text-xs text-slate-500 mt-1">
                  Enter the code sent to <span className="font-semibold text-slate-700">+91 {phoneNumber}</span>
                </p>
              </div>

              {/* 6 Digit Input Group */}
              <div className="flex justify-between gap-2 my-6">
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
                    className="w-11 h-13 text-center text-xl font-bold text-slate-800 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-[#52007A] focus:ring-4 focus:ring-purple-100 outline-none transition-all duration-150"
                  />
                ))}
              </div>

              <button
              disabled={otp.join("").length!==6}
                type="button"
                onClick={handleVerifyOtp}
                className="w-full py-3.5 px-4 bg-[#52007A] hover:bg-[#400060] active:scale-[0.99] text-white font-medium text-sm rounded-2xl shadow-lg shadow-purple-900/15 flex items-center justify-center gap-2 transition-all duration-200 cursor-pointer"
              >
                <span>Verify & Proceed</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </button>

              {/* Resend & Timer */}
              <div className="text-center text-xs">
                {timer > 0 ? (
                  <p className="text-slate-400">
                    Resend code in <span className="font-semibold text-[#52007A]">{formatTimer(timer)}</span>
                  </p>
                ) : (
                  <button
                    onClick={handleResend}
                    disabled={phoneNumber.length!==10}
                    className="font-semibold text-[#52007A] hover:underline focus:outline-none"
                  >
                    Resend OTP Code
                  </button>
                )}
              </div>

              {/* Back to Phone Input */}
              <div className="pt-2 text-center">
                <button
                  type="button"
                  onClick={() => setStep('login')}
                  className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-700 transition-colors"
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

        {/* Footer Notice */}
        <div className="py-3 bg-slate-50/60 border-t border-slate-100 text-center">
          <p className="text-[10px] text-slate-400">
            © 2026 AstroNova. All rights reserved.
          </p>
        </div>

      </div>
      <div id="recaptcha-container"></div>
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