import React, { useMemo, useState } from "react";
import {
  ArrowLeft,
  Star,
  Sun,
  Cloud,
  Moon,
  MessageCircle,
  Phone,
  ArrowRight,
  CalendarDays,
} from "lucide-react";

import { scheduleBooking } from "../../../API/bookingApis";

/**
 * Available durations
 */
const DURATIONS = [15, 30, 45];

/**
 * Generate time slots for every selected date.
 * Same slots will be available for each date.
 */
const generateTimeSlots = () => {
  return [
    {
      label: "Morning",
      icon: Sun,
      slots: [
        "09:00 AM",
        "09:30 AM",
        "10:00 AM",
        "10:30 AM",
        "11:00 AM",
        "11:30 AM",
      ],
    },
    {
      label: "Afternoon",
      icon: Cloud,
      slots: [
        "12:00 PM",
        "12:30 PM",
        "01:00 PM",
        "01:30 PM",
        "02:00 PM",
        "02:30 PM",
        "03:00 PM",
        "03:30 PM",
        "04:00 PM",
        "04:30 PM",
        "05:00 PM",
        "05:30 PM",
      ],
    },
    {
      label: "Evening",
      icon: Moon,
      slots: [
        "06:00 PM",
        "06:30 PM",
        "07:00 PM",
        "07:30 PM",
        "08:00 PM",
        "08:30 PM",
        "09:00 PM",
        "09:30 PM",
      ],
    },
  ];
};

/**
 * Get today's date in YYYY-MM-DD format.
 */
const getTodayISO = () => {
  const today = new Date();

  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

/**
 * Convert YYYY-MM-DD into readable format.
 */
const formatDate = (dateString) => {
  if (!dateString) return "";

  const date = new Date(`${dateString}T00:00:00`);

  return date.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
};

/**
 * Get month/year from selected date.
 */
const getMonthYear = (dateString) => {
  if (!dateString) return "";

  const date = new Date(`${dateString}T00:00:00`);

  return date.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });
};

/**
 * Get day name.
 */
const getDayName = (dateString) => {
  if (!dateString) return "";

  const date = new Date(`${dateString}T00:00:00`);

  return date.toLocaleDateString("en-US", {
    weekday: "long",
  });
};

export default function BookAppointmentPopup({
  astrologer,
  month,
  fee,
  originalFee,
  balance,
  onClose,
  onProceedToPayment,
  setShowWallet,
}) {
  const today = getTodayISO();

  const [selectedDate, setSelectedDate] = useState(today);
  const [selectedTime, setSelectedTime] = useState("");
  const [selectedDuration, setSelectedDuration] = useState(30);
  const [consultationMode, setConsultationMode] = useState("Chat");

  const [loading, setLoading] = useState(false);

  /**
   * Generate slots for selected date.
   * This will remain same for every date.
   */
  const timeSlots = useMemo(() => {
    return generateTimeSlots();
  }, [selectedDate]);

  /**
   * Fee fallback
   */
  const displayFee = fee ?? astrologer?.minRate ?? 0;

  /**
   * Month displayed above calendar.
   */
  const displayMonth = selectedDate
    ? getMonthYear(selectedDate)
    : month ||
      new Date().toLocaleString("default", {
        month: "long",
        year: "numeric",
      });

  /**
   * Handle date selection.
   */
  const handleDateChange = (event) => {
    const date = event.target.value;

    if (!date) return;

    setSelectedDate(date);

    // Reset selected time whenever date changes
    setSelectedTime("");
  };

  /**
   * Handle time selection.
   */
  const handleTimeSelect = (time) => {
    setSelectedTime(time);
  };

  /**
   * Handle booking.
   */
  const handleProceed = async () => {
    try {
      const currentBalance = Number(balance) || 0;
      const minimumRate = Number(displayFee) || 0;

      if (currentBalance < minimumRate) {
        setShowWallet(true);
        return;
      }

      if (!astrologer?._id) {
        console.error("Partner ID is missing");
        alert("Astrologer information is missing.");
        return;
      }

      if (
        !selectedDate ||
        !selectedTime ||
        !selectedDuration ||
        !consultationMode
      ) {
        alert("Please select all booking details.");
        return;
      }

      setLoading(true);

      const payload = {
        partnerId: astrologer._id,
        date: selectedDate,
        timeSlot: selectedTime,
        duration: selectedDuration,
        mode: consultationMode,
      };

      const response = await scheduleBooking(payload);

      console.log("🔥 BOOKING API RESPONSE:", response);

      /**
       * Insufficient balance
       */
      if (response?.message === "Insufficient balance. Please recharge.") {
        setShowWallet(true);
        return;
      }

      /**
       * API failure
       */
      if (response?.success === false) {
        alert(response?.message || "Booking failed.");
        return;
      }

      /**
       * Proceed to payment
       */
      onProceedToPayment?.({
        astrologer,
        date: selectedDate,
        timeSlot: selectedTime,
        duration: selectedDuration,
        mode: payload.mode,
        minRate: displayFee,
      });

      onClose();
    } catch (error) {
      console.error("Booking API Error:", error);

      const backendMessage =
        error?.response?.data?.message || error?.message || "";

      if (backendMessage.toLowerCase().includes("insufficient balance")) {
        setShowWallet(true);
        return;
      }

      alert(backendMessage || "Something went wrong while booking.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-2 sm:p-4">
      <div className="flex max-h-[96vh] w-full max-w-[620px] flex-col overflow-hidden rounded-2xl sm:rounded-3xl bg-white shadow-2xl">

        {/* =====================================================
            HEADER
        ====================================================== */}
        <div className="flex flex-shrink-0 items-center justify-between border-b border-gray-100 px-3 py-3 sm:px-5 sm:py-4">

          <button
            onClick={onClose}
            aria-label="Close"
            className="flex h-9 w-9 items-center justify-center rounded-full text-gray-700 transition hover:bg-gray-100"
          >
            <ArrowLeft size={20} />
          </button>

          <h2 className="text-sm sm:text-base font-semibold text-gray-900">
            Book Appointment
          </h2>

          <img
            src={astrologer?.image || astrologer?.profilePic}
            alt={astrologer?.name || "Astrologer"}
            className="h-9 w-9 rounded-full object-cover"
          />
        </div>

        {/* =====================================================
            SCROLLABLE CONTENT
        ====================================================== */}
        <div className="overflow-y-auto">

          {/* =====================================================
              ASTROLOGER CARD
          ====================================================== */}
          <div className="mx-3 mb-4 mt-3 flex items-center gap-3 rounded-2xl bg-gray-50 p-3 sm:mx-5 sm:mb-5 sm:mt-4">

            <img
              src={astrologer?.profilePic || astrologer?.image}
              alt={astrologer?.name || "Astrologer"}
              className="h-12 w-12 sm:h-14 sm:w-14 flex-shrink-0 rounded-full object-cover"
            />

            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-gray-900 sm:text-base">
                {astrologer?.fullName}
              </p>

              {astrologer?.tag && (
                <span className="mt-1 inline-block max-w-full truncate rounded-full bg-pink-100 px-2 py-0.5 text-[10px] sm:text-xs font-medium text-pink-600">
                  {astrologer?.tag}
                </span>
              )}

              <div className="mt-1 flex items-center gap-1 text-xs font-medium text-gray-700">
                <Star
                  size={12}
                  className="fill-amber-400 text-amber-400"
                />

                {astrologer?.averageRating || "0.0"}
              </div>
            </div>
          </div>

          {/* =====================================================
              SELECT DATE
          ====================================================== */}
          <div className="mb-5 px-3 sm:px-5">

            <div className="mb-3 flex items-center justify-between gap-2">
              <h3 className="text-sm font-semibold text-gray-900">
                Select Date
              </h3>

              <span className="truncate text-xs text-gray-500">
                {displayMonth}
              </span>
            </div>

            {/* Date Input */}
            <div className="relative">

              <CalendarDays
                size={18}
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-purple-700"
              />

              <input
                type="date"
                value={selectedDate}
                min={today}
                onChange={handleDateChange}
                className="w-full cursor-pointer rounded-xl border border-gray-200 bg-gray-50 py-3 pl-10 pr-3 text-sm font-medium text-gray-700 outline-none transition focus:border-purple-500 focus:ring-2 focus:ring-purple-100"
              />

            </div>

            {/* Selected Date */}
            {selectedDate && (
              <div className="mt-3 rounded-xl bg-purple-50 px-3 py-2.5 sm:px-4 sm:py-3">

                <p className="text-[10px] sm:text-xs text-purple-600">
                  Selected Date
                </p>

                <p className="mt-1 text-xs sm:text-sm font-semibold text-purple-800">
                  {getDayName(selectedDate)}, {formatDate(selectedDate)}
                </p>

              </div>
            )}
          </div>

          {/* =====================================================
              TIME SLOTS
          ====================================================== */}
          <div className="mb-5 px-3 sm:px-5">

            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-sm font-semibold text-gray-900">
                Select Time Slot
              </h3>

              {selectedDate && (
                <span className="text-[10px] text-purple-600 sm:text-xs">
                  Available Slots
                </span>
              )}
            </div>

            <div className="space-y-4">

              {timeSlots.map(({ label, icon: Icon, slots }) => (
                <div key={label}>

                  {/* Session Heading */}
                  <div className="mb-2 flex items-center gap-1.5 text-xs font-semibold text-gray-500">
                    <Icon size={14} />
                    {label}
                  </div>

                  {/* Slots */}
                  <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">

                    {slots.map((time) => {
                      const isSelected = time === selectedTime;

                      return (
                        <button
                          key={time}
                          onClick={() => handleTimeSelect(time)}
                          className={`min-h-[40px] rounded-xl border px-2 py-2 text-[11px] sm:text-xs font-medium transition-all active:scale-95 ${
                            isSelected
                              ? "border-purple-700 bg-purple-700 text-white shadow-md shadow-purple-200"
                              : "border-gray-200 bg-white text-gray-700 hover:border-purple-300 hover:bg-purple-50"
                          }`}
                        >
                          {time}
                        </button>
                      );
                    })}

                  </div>
                </div>
              ))}

            </div>

            {/* Selected Slot Indicator */}
            {selectedTime && (
              <div className="mt-3 flex items-center justify-between rounded-xl border border-purple-100 bg-purple-50 px-3 py-2.5">

                <span className="text-xs text-purple-600">
                  Selected Time
                </span>

                <span className="text-xs font-bold text-purple-800">
                  {selectedTime}
                </span>

              </div>
            )}

          </div>

          {/* =====================================================
              DURATION
          ====================================================== */}
          <div className="mb-5 px-3 sm:px-5">

            <h3 className="mb-3 text-sm font-semibold text-gray-900">
              Select Duration
            </h3>

            <div className="grid grid-cols-3 gap-2">

              {DURATIONS.map((mins) => {
                const isSelected = mins === selectedDuration;

                return (
                  <button
                    key={mins}
                    onClick={() => setSelectedDuration(mins)}
                    className={`rounded-xl border py-2.5 text-xs sm:text-sm font-medium transition-all active:scale-95 ${
                      isSelected
                        ? "border-purple-700 bg-purple-700 text-white"
                        : "border-gray-200 bg-white text-gray-700 hover:border-purple-300 hover:bg-purple-50"
                    }`}
                  >
                    {mins} Mins
                  </button>
                );
              })}

            </div>
          </div>

          {/* =====================================================
              CONSULTATION MODE
          ====================================================== */}
          <div className="mb-5 px-3 sm:px-5">

            <h3 className="mb-3 text-sm font-semibold text-gray-900">
              Consultation Mode
            </h3>

            <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">

              {/* Chat */}
              <button
                onClick={() => setConsultationMode("Chat")}
                className={`flex items-center justify-center gap-2 rounded-xl border py-2.5 text-xs sm:text-sm font-medium transition-all active:scale-95 ${
                  consultationMode === "Chat"
                    ? "border-purple-700 bg-purple-700 text-white"
                    : "border-gray-200 bg-white text-gray-700 hover:border-purple-300 hover:bg-purple-50"
                }`}
              >
                <MessageCircle size={16} />
                Chat
              </button>

              {/* Voice */}
              <button
                onClick={() => setConsultationMode("Voice Call")}
                className={`flex items-center justify-center gap-2 rounded-xl border py-2.5 text-xs sm:text-sm font-medium transition-all active:scale-95 ${
                  consultationMode === "Voice Call"
                    ? "border-purple-700 bg-purple-700 text-white"
                    : "border-gray-200 bg-white text-gray-700 hover:border-purple-300 hover:bg-purple-50"
                }`}
              >
                <Phone size={16} />
                Voice Call
              </button>

              {/* Video */}
              <button
                onClick={() => setConsultationMode("Video Call")}
                className={`flex items-center justify-center gap-2 rounded-xl border py-2.5 text-xs sm:text-sm font-medium transition-all active:scale-95 ${
                  consultationMode === "Video Call"
                    ? "border-purple-700 bg-purple-700 text-white"
                    : "border-gray-200 bg-white text-gray-700 hover:border-purple-300 hover:bg-purple-50"
                }`}
              >
                <Phone size={16} />
                Video Call
              </button>

            </div>
          </div>

        </div>

        {/* =====================================================
            FOOTER
        ====================================================== */}
        <div className="flex-shrink-0 border-t border-gray-100 bg-white px-3 py-3 sm:px-5 sm:py-4">

          <div className="mb-3 flex items-center justify-between gap-3">

            {/* Fee */}
            <div className="min-w-0">

              <p className="text-[10px] sm:text-xs text-gray-500">
                Consultation Fee
              </p>

              <div className="flex items-baseline gap-1.5">

                {originalFee && (
                  <span className="text-[10px] sm:text-xs text-gray-400 line-through">
                    ₹{astrologer?.minRate}/min
                  </span>
                )}

                <span className="text-sm sm:text-base font-semibold text-gray-900">
                  ₹{displayFee}
                </span>

              </div>

            </div>

            {/* Selected Slot */}
            <div className="max-w-[55%] text-right">

              <p className="text-[10px] sm:text-xs text-gray-500">
                Selected Slot
              </p>

              <p className="truncate text-xs sm:text-sm font-medium text-gray-900">
                {selectedDate
                  ? `${formatDate(selectedDate)}, ${
                      selectedTime || "Select time"
                    }`
                  : "Select date"}
              </p>

            </div>

          </div>

          {/* Proceed */}
          <button
            onClick={handleProceed}
            disabled={loading || !selectedTime}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-purple-700 py-3 sm:py-3.5 text-xs sm:text-sm font-semibold text-white transition-all hover:bg-purple-800 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-70"
          >
            {loading ? "Booking..." : "Proceed to Payment"}

            {!loading && <ArrowRight size={16} />}
          </button>

        </div>

      </div>
    </div>
  );
}