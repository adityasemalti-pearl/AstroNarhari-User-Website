import { useEffect, useState } from "react";
import { ChevronUp } from "lucide-react";

export default function BackToTop() {
  const [visible, setVisible] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const height =
        document.documentElement.scrollHeight - window.innerHeight;

      setProgress((scrollTop / height) * 100);
      setVisible(scrollTop > 350);
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const radius = 26;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (progress / 100) * circumference;

  return (
    <button
      onClick={scrollTop}
      className={`fixed bottom-8 right-8 z-[9999] transition-all duration-500
      ${
        visible
          ? "opacity-100 translate-y-0 scale-100"
          : "opacity-0 translate-y-10 scale-75 pointer-events-none"
      }`}
    >
      <div className="relative group">
        {/* Glow */}
        <div className="absolute inset-0 rounded-full bg-yellow-400 blur-xl opacity-40 group-hover:opacity-70 transition duration-500 animate-pulse" />

        {/* Progress Ring */}
        <svg
          className="absolute inset-0 -rotate-90"
          width="64"
          height="64"
        >
          <circle
            cx="32"
            cy="32"
            r={radius}
            stroke="rgba(255,255,255,.15)"
            strokeWidth="3"
            fill="transparent"
          />

          <circle
            cx="32"
            cy="32"
            r={radius}
            stroke="#FBBF24"
            strokeWidth="3"
            fill="transparent"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            style={{
              transition: "stroke-dashoffset .2s linear",
            }}
          />
        </svg>

        {/* Button */}
        <div
          className="
          w-16 h-16
          rounded-full
          bg-gradient-to-br
          from-yellow-500
          via-yellow-400
          to-orange-500
          flex
          items-center
          justify-center
          shadow-[0_0_35px_rgba(251,191,36,.55)]
          border
          border-yellow-300/40
          backdrop-blur-xl
          hover:scale-110
          active:scale-95
          transition-all
          duration-300
          animate-bounce
        "
        >
          <ChevronUp
            className="text-black"
            size={28}
            strokeWidth={3}
          />
        </div>
      </div>
    </button>
  );
}