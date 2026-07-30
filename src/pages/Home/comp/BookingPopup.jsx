import React, { useState } from "react";
import { ArrowLeft, Star, Sun, Cloud, Moon, MessageCircle, Phone, ArrowRight, Cross } from "lucide-react";
import InsufficientBalancePopup from "./InsufficientBalance";

/**
 * BookAppointmentPopup
 *
 * Usage in a parent component:
 *
 *   import BookAppointmentPopup from "./BookAppointmentPopup";
 *
 *   const [showBooking, setShowBooking] = useState(false);
 *
 *   {showBooking && (
 *     <BookAppointmentPopup
 *       astrologer={{
 *         name: "Acharya Sharma",
 *         tag: "Vedic Expert",
 *         rating: 4.9,
 *         image: "/path/to/photo.jpg",
 *       }}
 *       onClose={() => setShowBooking(false)}
 *       onProceedToPayment={(bookingDetails) => {
 *         console.log(bookingDetails);
 *       }}
 *     />
 *   )}
 */

const DATES = [
  { day: "Mon", date: 23 },
  { day: "Tue", date: 24 },
  { day: "Wed", date: 25 },
  { day: "Thu", date: 26 },
  { day: "Fri", date: 27 },
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

export default function BookAppointmentPopup({
  astrologer = {
    name: "Acharya Sharma",
    tag: "Vedic Expert",
    rating: 4.9,
    image: "https://i.pravatar.cc/100?img=12",
  },
  month = "October 2023",
  fee = 750,
  originalFee = 1000,
  onClose = () => { },
  onProceedToPayment = () => { },

}) {
  const [selectedDate, setSelectedDate] = useState(24);
  const [selectedTime, setSelectedTime] = useState("10:30 AM");
  const [selectedDuration, setSelectedDuration] = useState(30);
  const [consultationMode, setConsultationMode] = useState("chat");
  const [showWallet, setShowWallet] = useState(false);

  const selectedDateLabel = DATES.find((d) => d.date === selectedDate);

  const handleProceed = () => {
    onProceedToPayment({
      astrologer: astrologer.name,
      date: selectedDate,
      time: selectedTime,
      duration: selectedDuration,
      mode: consultationMode,
      fee,
    });
     setShowWallet(true) 
  };

  return (
    <div className="fixed  inset-0 z-50 flex items-center justify-center bg-black/50 p-4 hide">
      <div className="w-[600px] max-h-[92vh] overflow-y-auto rounded-2xl bg-white shadow-xl hide ">
        {/* Header */}
        <div className="flex items-center justify-between px-5 pt-5 pb-3">
          <button
            onClick={onClose}
            aria-label="Close"
            className="flex h-9 w-9 items-center justify-center rounded-full text-gray-700 hover:bg-gray-100"
          >
            <ArrowLeft size={20} />
          </button>
          <h2 className="text-base font-semibold text-gray-900">Book Appointment</h2>
          <img
            src={astrologer.image}
            alt=""
            className="h-9 w-9 rounded-full object-cover"
          />
        </div>

        {/* Astrologer card */}
        <div className="mx-5 mb-5 flex items-center gap-3 rounded-xl bg-gray-50 p-3">
          <img
            src={astrologer.image}
            alt={astrologer.name}
            className="h-14 w-14 rounded-full object-cover"
          />
          <div>
            <p className="text-sm font-semibold text-gray-900">{astrologer.name}</p>
            <span className="mt-1 inline-block rounded-full bg-pink-100 px-2 py-0.5 text-xs font-medium text-pink-600">
              {astrologer.tag}
            </span>
            <div className="mt-1 flex items-center gap-1 text-xs font-medium text-gray-700">
              <Star size={12} className="fill-amber-400 text-amber-400" />
              {astrologer.rating}
            </div>
          </div>
        </div>

        {/* Select Date */}
        <div className="px-5 mb-5">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-gray-900">Select Date</h3>
            <span className="text-xs text-gray-500">{month}</span>
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
                  <span className="text-sm font-semibold">{d.date}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Select Time Slot */}
        <div className="px-5 mb-5">
          <h3 className="mb-3 text-sm font-semibold text-gray-900">Select Time Slot</h3>
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
        <div className="px-5 mb-5">
          <h3 className="mb-3 text-sm font-semibold text-gray-900">Select Duration</h3>
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
        <div className="px-5 mb-5">
          <h3 className="mb-3 text-sm font-semibold text-gray-900">Consultation Mode</h3>
          <div className="flex gap-2">
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
              <p className="text-xs text-gray-500">Consultation Fee</p>
              <div className="flex items-baseline gap-1.5">
                {originalFee && (
                  <span className="text-xs text-gray-400 line-through">₹{originalFee}</span>
                )}
                <span className="text-base font-semibold text-gray-900">₹{fee}</span>
              </div>
            </div>
            <div className="text-right">
              <p className="text-xs text-gray-500">Selected Slot</p>
              <p className="text-sm font-medium text-gray-900">
                Oct {selectedDate}, {selectedTime}
              </p>
            </div>
          </div>
          <button
            onClick={ handleProceed}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-purple-700 py-3 text-sm font-semibold text-white transition-colors hover:bg-purple-800"
          >
            Proceed to Payment
            <ArrowRight size={16} />
          </button>
        </div>
      </div>
     
    </div>
  );
}