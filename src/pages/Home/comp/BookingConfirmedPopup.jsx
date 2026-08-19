import React, { useEffect, useState } from "react";
import {
  Check,
  CalendarDays,
  Clock3,
  MessageCircle,
  Info,
  ArrowRight,
  Star,
  BookOpen,
} from "lucide-react";

export default function BookingConfirmedPopup({
  astrologer = {
    name: "Acharya Sharma",
    tag: "Vedic Expert",
    rating: 4.9,
    image: "https://i.pravatar.cc/150?img=12",
  },

  booking = {
    date: "24 July 2026",
    time: "10:30 AM",
    mode: "Chat",
  },

  onClose = () => {},
  onMyBookings = () => {},
}) {
  const [countdown, setCountdown] = useState(6);

  // ============================================
  // AUTO REDIRECT AFTER 6 SECONDS
  // ============================================
  useEffect(() => {
    if (countdown === 0) {
      onMyBookings();
      return;
    }

    const timer = setTimeout(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [countdown, onMyBookings]);

  // ============================================
  // SAFE ASTROLOGER DATA
  // ============================================

  const astrologerName =
    astrologer?.name || astrologer?.fullName || "Astrologer";

  const astrologerImage =
    astrologer?.image ||
    astrologer?.profilePic ||
    "https://i.pravatar.cc/150?img=12";

  const astrologerTag =
    astrologer?.tag ||
    astrologer?.specialties?.slice(0, 2)?.join(" • ") ||
    "Vedic Expert";

  const astrologerRating = astrologer?.rating || astrologer?.averageRating || 0;

  // ============================================
  // SAFE BOOKING DATA
  // ============================================

  const bookingDate =
    booking?.date ||
    booking?.bookingDate ||
    booking?.scheduledDate ||
    "Scheduled Date";

  const bookingTime =
    booking?.time ||
    booking?.bookingTime ||
    booking?.scheduledTime ||
    "Scheduled Time";

  const bookingMode = booking?.mode || booking?.type || "Chat";

  return (
    <div
      className=" fixed inset-0 z-[9999] flex  items-center justify-center
       bg-black/65 backdrop-blur-md px-3 py-4 overflow-hidden " >
   {/* ================================================= */}
      {/* MAIN MODAL */}
      {/* ================================================= */}

      <div
        className="  relative w-full max-w-[650px] overflow-hidden rounded-[30px]
          bg-white  shadow-[0_30px_100px_rgba(0,0,0,0.30)] " >
        {/* ================================================= */}
        {/* CLOSE BUTTON */}
        {/* ================================================= */}

        <button
          onClick={onClose}
          className="absolute right-4 top-4 z-40 flex h-9
            w-9 items-center justify-center  rounded-full bg-white/90 text-gray-700 shadow-lg transition-all duration-200  hover:scale-105 hover:bg-white
          "
        >
          ✕
        </button>

        {/* ================================================= */}
        {/* HEADER */}
        {/* ================================================= */}

        <div
          className="
            relative
            overflow-hidden
            bg-gradient-to-br
            from-[#3D075C]
            via-[#52007A]
            to-[#8E24AA]
            px-5
            pb-9
            pt-7
            sm:px-7
            sm:pb-10
            sm:pt-8
          "
        >
          {/* Decorative circles */}

          <div
            className="
              absolute
              -left-20
              -top-20
              h-56
              w-56
              rounded-full
              bg-white/10
            "
          />

          <div
            className="
              absolute
              -right-20
              -top-10
              h-64
              w-64
              rounded-full
              bg-fuchsia-300/10
            "
          />

          <div
            className="
              absolute bottom-0  left-1/2 h-32 w-32   -translate-x-1/2  rounded-full bg-white/10
              blur-3xl "
          />

          {/* ================================================= */}
          {/* SUCCESS ICON */}
          {/* ================================================= */}

          <div className="relative flex justify-center">
            {/* Outer pulse */}

            <div
              className="
                absolute
                h-24
                w-24
                rounded-full
                bg-white/10
                animate-pulse
              "
            />

            {/* Main circle */}

            <div
              className="
                relative
                flex
                h-24
                w-24
                items-center
                justify-center
                rounded-full
                bg-white
                shadow-2xl
              "
            >
              <div
                className="
                  flex
                  h-[68px]
                  w-[68px]
                  items-center
                  justify-center
                  rounded-full
                  bg-green-50
                "
              >
                <Check size={38} strokeWidth={3} className="text-green-600" />
              </div>
            </div>
          </div>

          {/* ================================================= */}
          {/* TITLE */}
          {/* ================================================= */}

          <div className="relative mt-5 text-center">
            <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
              Booking Confirmed 🎉
            </h1>

            <p className="mt-2 text-xs text-purple-100 sm:text-sm">
              Your consultation has been booked successfully.
            </p>
          </div>
        </div>

        {/* ================================================= */}
        {/* BODY */}
        {/* ================================================= */}

        <div className="bg-white px-4 pb-5 pt-5 sm:px-6 sm:pb-6">
          {/* ================================================= */}
          {/* BOOKING DETAILS */}
          {/* ================================================= */}

          <div
            className="
              rounded-2xl
              border
              border-green-100
              bg-gradient-to-r
              from-green-50
              to-emerald-50
              p-4
            "
          >
            <div className="grid grid-cols-3 gap-2 sm:gap-5">
              {/* DATE */}

              <div className="text-center">
                <div
                  className="
                    mx-auto
                    flex
                    h-10
                    w-10
                    items-center
                    justify-center
                    rounded-xl
                    bg-green-100
                    sm:h-11
                    sm:w-11
                  "
                >
                  <CalendarDays size={20} className="text-green-600" />
                </div>

                <p className="mt-2 text-[9px] font-medium uppercase tracking-wider text-gray-400 sm:text-[10px]">
                  Date
                </p>

                <h3 className="mt-1 text-[11px] font-semibold text-gray-900 sm:text-sm">
                  {bookingDate}
                </h3>
              </div>

              {/* TIME */}

              <div className="text-center">
                <div
                  className="
                    mx-auto
                    flex
                    h-10
                    w-10
                    items-center
                    justify-center
                    rounded-xl
                    bg-purple-100
                    sm:h-11
                    sm:w-11
                  "
                >
                  <Clock3 size={20} className="text-purple-600" />
                </div>

                <p className="mt-2 text-[9px] font-medium uppercase tracking-wider text-gray-400 sm:text-[10px]">
                  Time
                </p>

                <h3 className="mt-1 text-[11px] font-semibold text-gray-900 sm:text-sm">
                  {bookingTime}
                </h3>
              </div>

              {/* MODE */}

              <div className="text-center">
                <div
                  className="
                    mx-auto
                    flex
                    h-10
                    w-10
                    items-center
                    justify-center
                    rounded-xl
                    bg-blue-100
                    sm:h-11
                    sm:w-11
                  "
                >
                  <MessageCircle size={20} className="text-blue-600" />
                </div>

                <p className="mt-2 text-[9px] font-medium uppercase tracking-wider text-gray-400 sm:text-[10px]">
                  Mode
                </p>

                <h3 className="mt-1 text-[11px] font-semibold text-gray-900 sm:text-sm">
                  {bookingMode}
                </h3>
              </div>
            </div>
          </div>

          {/* ================================================= */}
          {/* ASTROLOGER */}
          {/* ================================================= */}

          <div
            className="
              mt-4
              rounded-2xl
              border
              border-purple-100
              bg-white
              p-4
              shadow-sm
            "
          >
            <div className="flex items-center gap-3">
              {/* IMAGE */}

              <div className="relative shrink-0">
                <img
                  src={astrologerImage}
                  alt={astrologerName}
                  className="
                    h-14
                    w-14
                    rounded-full
                    object-cover
                    ring-4
                    ring-purple-100
                    sm:h-16
                    sm:w-16
                  "
                />

                {/* Online / verified */}

                <div
                  className="
                    absolute
                    -bottom-1
                    -right-1
                    flex
                    h-6
                    w-6
                    items-center
                    justify-center
                    rounded-full
                    bg-green-500
                    ring-2
                    ring-white
                  "
                >
                  <Check size={13} strokeWidth={3} className="text-white" />
                </div>
              </div>

              {/* INFO */}

              <div className="min-w-0 flex-1">
                <h3 className="truncate text-base font-bold text-gray-900 sm:text-lg">
                  {astrologerName}
                </h3>

                <p className="mt-0.5 truncate text-xs text-gray-500 sm:text-sm">
                  {astrologerTag}
                </p>

                <div
                  className="
                    mt-2
                    inline-flex
                    items-center
                    gap-1
                    rounded-full
                    bg-amber-50
                    px-2.5
                    py-1
                  "
                >
                  <Star size={13} className="fill-yellow-400 text-yellow-400" />

                  <span className="text-xs font-semibold text-gray-700">
                    {astrologerRating}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* ================================================= */}
          {/* INFO */}
          {/* ================================================= */}

          <div
            className="
              mt-4
              flex
              items-center
              gap-3
              rounded-2xl
              border
              border-blue-100
              bg-blue-50
              px-3
              py-3
            "
          >
            <div
              className="
                flex
                h-9
                w-9
                shrink-0
                items-center
                justify-center
                rounded-full
                bg-blue-100
              "
            >
              <Info size={17} className="text-blue-600" />
            </div>

            <p className="text-[11px] leading-4 text-gray-600 sm:text-xs sm:leading-5">
              Please join your consultation at least{" "}
              <span className="font-semibold text-gray-800">
                5 minutes earlier
              </span>{" "}
              than your scheduled time.
            </p>
          </div>

          {/* ================================================= */}
          {/* REDIRECT COUNTDOWN */}
          {/* ================================================= */}

          <div className="mt-4 text-center">
            <div className="inline-flex items-center gap-2 rounded-full bg-purple-50 px-4 py-2">
              <span className="h-2 w-2 animate-pulse rounded-full bg-[#52007A]" />

              <span className="text-xs font-medium text-gray-600">
                Redirecting to My Bookings in
              </span>

              <span className="flex h-6 min-w-6 items-center justify-center rounded-full bg-[#52007A] px-1.5 text-xs font-bold text-white">
                {countdown}s
              </span>
            </div>
          </div>

          {/* ================================================= */}
          {/* BUTTON */}
          {/* ================================================= */}

          <button
            onClick={onMyBookings}
            className="
              group
              mt-4
              flex
              h-12
              w-full
              items-center
              justify-center
              gap-2.5
              rounded-2xl
              bg-gradient-to-r
              from-[#4C0875]
              via-[#52007A]
              to-[#8E24AA]
              text-white
              shadow-lg
              shadow-purple-900/20
              transition-all
              duration-300
              hover:scale-[1.01]
              hover:shadow-xl
              active:scale-[0.99]
            "
          >
            <BookOpen
              size={18}
              className="transition-transform duration-300 group-hover:rotate-6"
            />

            <span className="text-sm font-semibold">Go To My Bookings</span>

            <ArrowRight
              size={17}
              className="transition-transform duration-300 group-hover:translate-x-1"
            />
          </button>
        </div>
      </div>
    </div>
  );
}
