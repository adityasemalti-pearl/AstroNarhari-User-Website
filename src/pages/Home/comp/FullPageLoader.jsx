import React from "react";

export default function FullPageLoader() {
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-white">
      {/* Background Glow */}
      <div className="absolute w-80 h-80 rounded-full bg-purple-200/40 blur-3xl animate-pulse"></div>

      <div className="relative flex flex-col items-center">
        {/* Outer Ring */}
        <div className="relative h-28 w-28">
          {/* Static Ring */}
          <div className="absolute inset-0 rounded-full border-[6px] border-purple-100"></div>

          {/* Animated Ring */}
          <div className="absolute inset-0 rounded-full border-[6px] border-transparent border-t-purple-700 border-r-fuchsia-500 animate-spin"></div>

          {/* Inner Circle */}
          <div className="absolute inset-3 flex items-center justify-center rounded-full bg-gradient-to-br from-purple-700 to-fuchsia-600 shadow-2xl">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-10 w-10 text-white animate-pulse"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.8}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 3v2m0 14v2M3 12h2m14 0h2M5.6 5.6l1.4 1.4m10 10l1.4 1.4M5.6 18.4l1.4-1.4m10-10l1.4-1.4"
              />
              <circle cx="12" cy="12" r="3" />
            </svg>
          </div>
        </div>

        {/* Text */}
        <h2 className="mt-8 text-2xl font-bold bg-gradient-to-r from-purple-700 to-fuchsia-600 bg-clip-text text-transparent">
          Loading...
        </h2>

        <p className="mt-2 text-sm text-gray-500">
          Please wait while we prepare everything for you.
        </p>

        {/* Dots */}
        <div className="mt-6 flex gap-2">
          <span className="h-3 w-3 rounded-full bg-purple-600 animate-bounce"></span>
          <span
            className="h-3 w-3 rounded-full bg-fuchsia-500 animate-bounce"
            style={{ animationDelay: "0.2s" }}
          ></span>
          <span
            className="h-3 w-3 rounded-full bg-purple-400 animate-bounce"
            style={{ animationDelay: "0.4s" }}
          ></span>
        </div>
      </div>
    </div>
  );
}