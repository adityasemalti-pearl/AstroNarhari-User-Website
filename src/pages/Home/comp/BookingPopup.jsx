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
} from "lucide-react";

import { scheduleBooking } from "../../../API/bookingApis";

/**
 * BookAppointmentPopup
 */

const DATES = [
  { day: "Mon", date: 10 },
  { day: "Tue", date: 11 },
  { day: "Wed", date: 12 },
  { day: "Thu", date: 13 },
  { day: "Fri", date: 14 },
];

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

// Builds "YYYY-MM-DD" from the selected day + the month label (e.g. "August 2026"),
// instead of always assuming August 2026 like the original hardcoded string.
const buildISODate = (day, monthLabel) => {
  const fallbackYear = new Date().getFullYear();
  const [monthName, yearStr] = (monthLabel || `August ${fallbackYear}`).split(" ");
  const year = yearStr || fallbackYear;

  const parsedMonth = new Date(`${monthName} 1, ${year}`);
  const monthIndex = isNaN(parsedMonth.getTime()) ? 7 : parsedMonth.getMonth(); // fallback: August (index 7)

  return `${year}-${String(monthIndex + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
};

export default function BookAppointmentPopup({
  astrologer,
  month,
  fee,
  originalFee,
  onClose,
  onProceedToPayment,
  setShowWallet,
}) {
  const [selectedDate, setSelectedDate] = useState(11);
  const [selectedTime, setSelectedTime] = useState("10:30 AM");
  const [selectedDuration, setSelectedDuration] = useState(30);
  const [consultationMode, setConsultationMode] = useState("chat");

  const [loading, setLoading] = useState(false);

  // Fall back to the astrologer's own rate if no fee prop was passed in,
  // so the footer never shows "₹undefined".
  const displayMonth = month || new Date().toLocaleString("default", { month: "long", year: "numeric" });
  const displayFee = fee ?? astrologer?.minRate ?? 0;

 const handleProceed = async () => {
    try {
      if (!astrologer?._id) {
        console.error("Partner ID is missing");
        alert("Astrologer information is missing.");
        return;
      }

      if (!selectedDate || !selectedTime || !selectedDuration || !consultationMode) {
        alert("Please select all booking details.");
        return;
      }

      setLoading(true);

      const payload = {
        partnerId: astrologer._id,
        date: buildISODate(selectedDate, displayMonth),
        timeSlot: selectedTime,
        duration: selectedDuration,
        mode: consultationMode === "voice" ? "Voice Call" : "Chat",
      };

      console.log("Booking Payload:", payload);

      const response = await scheduleBooking(payload);

      if (response?.message === "Insufficient balance. Please recharge.") {
        setShowWallet(true);
        return;
      }

      if (response?.success === false) {
        alert(response?.message || "Booking failed.");
        return;
      }

      

      onProceedToPayment?.({
        astrologer,
        date: payload.date,
        timeSlot: selectedTime,
        duration: selectedDuration,
        mode: payload.mode,
      });

      onClose();
    } catch (error) {
      console.error("Booking API Error:", error);

      // Backend often sends "insufficient balance" as an error response
      // (e.g. 400/402 status), not inside a success `response` object.
      // Catch that case here too, or the wallet popup never shows.
      const backendMessage = error?.response?.data?.message || error?.message || "";

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
        {/* Header */}
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
            src={astrologer?.image}
            alt={astrologer?.name || "Astrologer"}
            className="h-9 w-9 rounded-full object-cover"
          />
        </div>

        {/* Astrologer Card */}
        <div className="mx-5 mb-5 flex items-center gap-3 rounded-xl bg-gray-50 p-3">
          <img
            src={astrologer?.profilePic}
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
              <Star
                size={12}
                className="fill-amber-400 text-amber-400"
              />
              {astrologer?.averageRating}
            </div>
          </div>
        </div>

        {/* Select Date */}
        <div className="mb-5 px-5">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-gray-900">
              Select Date
            </h3>

            <span className="text-xs text-gray-500">{displayMonth}</span>
          </div>

          <div className="flex justify-between gap-2">
            {DATES.map((d) => {
              const isSelected = d.date === selectedDate;

              return (
                <button
                  key={d.date}
                  onClick={() => setSelectedDate(d.date)}
                  className={`flex flex-1 flex-col items-center gap-1 rounded-xl py-2.5 text-xs font-medium transition-colors ${isSelected
                      ? "bg-purple-700 text-white"
                      : "bg-gray-50 text-gray-600 hover:bg-gray-100"
                    }`}
                >
                  <span>{d.day}</span>
                  <span className="text-sm font-semibold">
                    {d.date}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Select Time Slot */}
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
                        className={`rounded-lg border px-2 py-2 text-xs font-medium transition-colors ${disabled
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

        {/* Select Duration */}
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
                  className={`flex-1 rounded-lg border py-2 text-xs font-medium transition-colors ${isSelected
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

        {/* Consultation Mode */}
        <div className="mb-5 px-5">
          <h3 className="mb-3 text-sm font-semibold text-gray-900">
            Consultation Mode
          </h3>

          <div className="flex gap-2">
            {/* Chat */}
            <button
              onClick={() => setConsultationMode("chat")}
              className={`flex flex-1 items-center justify-center gap-2 rounded-lg border py-2.5 text-sm font-medium transition-colors ${consultationMode === "chat"
                  ? "border-purple-700 bg-purple-700 text-white"
                  : "border-gray-200 bg-white text-gray-700 hover:border-purple-300"
                }`}
            >
              <MessageCircle size={16} />
              Chat
            </button>

            {/* Voice */}
            <button
              onClick={() => setConsultationMode("voice")}
              className={`flex flex-1 items-center justify-center gap-2 rounded-lg border py-2.5 text-sm font-medium transition-colors ${consultationMode === "voice"
                  ? "border-purple-700 bg-purple-700 text-white"
                  : "border-gray-200 bg-white text-gray-700 hover:border-purple-300"
                }`}
            >
              <Phone size={16} />
              Voice Call
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-100 px-5 py-4">
          <div className="mb-3 flex items-center justify-between">
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

            <div className="text-right">
              <p className="text-xs text-gray-500">
                Selected Slot
              </p>

              <p className="text-sm font-medium text-gray-900">
                {displayMonth.split(" ")[0]} {selectedDate}, {selectedTime}
              </p>
            </div>
          </div>

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