
import React, { useState } from "react";
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
 * BookAppointmentPopup
 */

const TIME_SLOTS = [
  {
    label: "Morning",
    icon: Sun,
    slots: [
      { time: "09:00 AM", disabled: false },
      { time: "10:30 AM", disabled: false },
      { time: "11:30 AM", disabled: true },
    ],
  },
  {
    label: "Afternoon",
    icon: Cloud,
    slots: [
      { time: "01:00 PM", disabled: false },
      { time: "02:30 PM", disabled: true },
      { time: "04:00 PM", disabled: false },
    ],
  },
  {
    label: "Evening",
    icon: Moon,
    slots: [
      { time: "06:00 PM", disabled: false },
      { time: "07:30 PM", disabled: true },
      { time: "08:00 PM", disabled: false },
    ],
  },
];

const DURATIONS = [15, 30, 45];

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
 * Example:
 * 2026-08-24 -> August 24, 2026
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
 * Example:
 * 2026-08-24 -> August 2026
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
 * Example:
 * 2026-08-24 -> Monday
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
  /**
   * Default selected date = today.
   *
   * If you don't want same-day booking,
   * change this to tomorrow using the logic mentioned below.
   */
  const today = getTodayISO();

  const [selectedDate, setSelectedDate] = useState(today);
  const [selectedTime, setSelectedTime] = useState("10:30 AM");
  const [selectedDuration, setSelectedDuration] = useState(30);
  const [consultationMode, setConsultationMode] = useState("Chat");

  const [loading, setLoading] = useState(false);

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

    // Optional:
    // Reset time when date changes.
    setSelectedTime("");
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

        mode: consultationMode ,
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-[600px] max-h-[92vh] overflow-y-auto rounded-2xl bg-white shadow-xl">

        {/* ================= HEADER ================= */}
        <div className="flex items-center justify-between px-5 pt-5 pb-3">
          <button
            onClick={onClose}
            aria-label="Close"
            className="flex h-9 w-9 items-center justify-center rounded-full text-gray-700 hover:bg-gray-100"
          >
            <ArrowLeft size={20} />
          </button>

          <h2 className="text-base font-semibold text-gray-900">
            Book Appointment
          </h2>

          <img
            src={astrologer?.image || astrologer?.profilePic}
            alt={astrologer?.name || "Astrologer"}
            className="h-9 w-9 rounded-full object-cover"
          />
        </div>

        {/* ================= ASTROLOGER CARD ================= */}
        <div className="mx-5 mb-5 flex items-center gap-3 rounded-xl bg-gray-50 p-3">
          <img
            src={astrologer?.profilePic || astrologer?.image}
            alt={astrologer?.name || "Astrologer"}
            className="h-14 w-14 rounded-full object-cover"
          />

          <div>
            <p className="text-sm font-semibold text-gray-900">
              {astrologer?.fullName}
            </p>

            <span className="mt-1 inline-block rounded-full bg-pink-100 px-2 py-0.5 text-xs font-medium text-pink-600">
              {astrologer?.tag}
            </span>

            <div className="mt-1 flex items-center gap-1 text-xs font-medium text-gray-700">
              <Star size={12} className="fill-amber-400 text-amber-400" />

              {astrologer?.averageRating}
            </div>
          </div>
        </div>

        {/* ================= SELECT DATE ================= */}
        <div className="mb-5 px-5">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-gray-900">
              Select Date
            </h3>

            <span className="text-xs text-gray-500">
              {displayMonth}
            </span>
          </div>

          {/* Calendar */}
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

          {/* Selected Date Information */}
          {selectedDate && (
            <div className="mt-3 rounded-xl bg-purple-50 px-4 py-3">
              <p className="text-xs text-purple-600">
                Selected Date
              </p>

              <p className="mt-1 text-sm font-semibold text-purple-800">
                {getDayName(selectedDate)}, {formatDate(selectedDate)}
              </p>
            </div>
          )}
        </div>

        {/* ================= SELECT TIME SLOT ================= */}
        <div className="mb-5 px-5">
          <h3 className="mb-3 text-sm font-semibold text-gray-900">
            Select Time Slot
          </h3>

          <div className="space-y-3">
            {TIME_SLOTS.map(({ label, icon: Icon, slots }) => (
              <div key={label}>
                <div className="mb-2 flex items-center gap-1.5 text-xs font-medium text-gray-500">
                  <Icon size={13} />
                  {label}
                </div>

                <div className="grid grid-cols-3 gap-2">
                  {slots.map(({ time, disabled }) => {
                    const isSelected = time === selectedTime;

                    return (
                      <button
                        key={time}
                        disabled={disabled}
                        onClick={() => setSelectedTime(time)}
                        className={`rounded-lg border px-2 py-2 text-xs font-medium transition-colors ${
                          disabled
                            ? "cursor-not-allowed border-gray-100 bg-gray-50 text-gray-300"
                            : isSelected
                              ? "border-purple-700 bg-purple-700 text-white"
                              : "border-gray-200 bg-white text-gray-700 hover:border-purple-300"
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
        </div>

        {/* ================= SELECT DURATION ================= */}
        <div className="mb-5 px-5">
          <h3 className="mb-3 text-sm font-semibold text-gray-900">
            Select Duration
          </h3>

          <div className="flex gap-2">
            {DURATIONS.map((mins) => {
              const isSelected = mins === selectedDuration;

              return (
                <button
                  key={mins}
                  onClick={() => setSelectedDuration(mins)}
                  className={`flex-1 rounded-lg border py-2 text-xs font-medium transition-colors ${
                    isSelected
                      ? "border-purple-700 bg-purple-700 text-white"
                      : "border-gray-200 bg-white text-gray-700 hover:border-purple-300"
                  }`}
                >
                  {mins} Mins
                </button>
              );
            })}
          </div>
        </div>

        {/* ================= CONSULTATION MODE ================= */}
        <div className="mb-5 px-5">
          <h3 className="mb-3 text-sm font-semibold text-gray-900">
            Consultation Mode
          </h3>

          <div className="flex gap-2">

            {/* Chat */}
            <button
              onClick={() => setConsultationMode("Chat")}
              className={`flex flex-1 items-center justify-center gap-2 rounded-lg border py-2.5 text-sm font-medium transition-colors ${
                consultationMode === "Chat"
                  ? "border-purple-700 bg-purple-700 text-white"
                  : "border-gray-200 bg-white text-gray-700 hover:border-purple-300"
              }`}
            >
              <MessageCircle size={16} />
              Chat
            </button>

            {/* Voice */}
            <button
              onClick={() => setConsultationMode("Voice Call")}
              className={`flex flex-1 items-center justify-center gap-2 rounded-lg border py-2.5 text-sm font-medium transition-colors ${
                consultationMode === "Voice Call"
                  ? "border-purple-700 bg-purple-700 text-white"
                  : "border-gray-200 bg-white text-gray-700 hover:border-purple-300"
              }`}
            >
              <Phone size={16} />
              Voice Call
            </button>

             <button
              onClick={() => setConsultationMode("Video Call")}
              className={`flex flex-1 items-center justify-center gap-2 rounded-lg border py-2.5 text-sm font-medium transition-colors ${
                consultationMode === "Video Call"
                  ? "border-purple-700 bg-purple-700 text-white"
                  : "border-gray-200 bg-white text-gray-700 hover:border-purple-300"
              }`}
            >
              <Phone size={16} />
              Video Call
            </button>

          </div>
        </div>

        {/* ================= FOOTER ================= */}
        <div className="border-t border-gray-100 px-5 py-4">
          <div className="mb-3 flex items-center justify-between">

            {/* Fee */}
            <div>
              <p className="text-xs text-gray-500">
                Consultation Fee
              </p>

              <div className="flex items-baseline gap-1.5">

                {originalFee && (
                  <span className="text-xs text-gray-400 line-through">
                    ₹{astrologer?.minRate}/min
                  </span>
                )}

                <span className="text-base font-semibold text-gray-900">
                  ₹{displayFee}
                </span>

              </div>
            </div>

            {/* Selected Slot */}
            <div className="text-right">
              <p className="text-xs text-gray-500">
                Selected Slot
              </p>

              <p className="text-sm font-medium text-gray-900">
                {selectedDate
                  ? `${formatDate(selectedDate)}, ${selectedTime || "Select time"}`
                  : "Select date"}
              </p>
            </div>

          </div>

          {/* Proceed */}
          <button
            onClick={handleProceed}
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-purple-700 py-3 text-sm font-semibold text-white transition-colors hover:bg-purple-800 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {loading ? "Booking..." : "Proceed to Payment"}

            {!loading && <ArrowRight size={16} />}
          </button>
        </div>
      </div>
    </div>
  );
}