import React from "react";
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

    onClose = () => { },
    onMyBookings = () => { },
}) {


    
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">

            <div className="relative w-full max-w-[620px] h-[600px] overflow-scroll hide  rounded-[34px] bg-white shadow-[0_30px_80px_rgba(0,0,0,.18)]">

                {/* Close */}

                <button
                    onClick={onClose}
                    className="absolute right-5 text-black top-5 z-20 flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 transition hover:bg-gray-200"
                >
                    ✕
                </button>

                {/* Top Background */}

                <div className="relative overflow-hidden bg-gradient-to-r from-purple-500 via-purple-500 to-purple-600 pb-20 pt-6">

                    <div className="absolute -left-12 -top-12 h-44 w-44 rounded-full bg-white/10"></div>

                    <div className="absolute -right-16 top-0 h-52 w-52 rounded-full bg-white/10"></div>

                    {/* Animated Tick */}

                    <div className="relative flex justify-center">

                        <div className="absolute h-28 w-28 rounded-full bg-white/20 animate-ping"></div>

                        <div className="absolute h-24 w-24 rounded-full bg-white/20 animate-pulse"></div>

                        <div className="relative flex h-24 w-24 items-center justify-center rounded-full bg-white shadow-2xl">

                            <Check
                                size={48}
                                strokeWidth={3}
                                className="text-green-600 animate-bounce"
                            />

                        </div>

                    </div>

                    <div className="mt-6 text-center">

                        <h1 className="text-3xl font-bold text-white">
                            Booking Confirmed 🎉
                        </h1>

                        <p className="mt-2 text-green-50">
                            Your consultation has been booked successfully.
                        </p>

                    </div>

                </div>

                {/* White Body */}

                <div className="-mt-14 rounded-t-[38px] bg-white px-7 pb-8 pt-8">

                    {/* Booking Details */}

                    <div className="rounded-3xl border border-green-100 bg-gradient-to-r from-green-50 to-emerald-50 p-5 shadow-sm">

                        <div className="grid grid-cols-3 gap-5">

                            {/* Date */}

                            <div className="text-center">

                                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-green-100">

                                    <CalendarDays
                                        className="text-green-600"
                                        size={22}
                                    />

                                </div>

                                <p className="mt-3 text-xs uppercase text-gray-500">
                                    Date
                                </p>

                                <h3 className="mt-1 font-semibold text-gray-900">
                                    {booking.date}
                                </h3>

                            </div>

                            {/* Time */}

                            <div className="text-center">

                                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-purple-100">

                                    <Clock3
                                        className="text-purple-600"
                                        size={22}
                                    />

                                </div>

                                <p className="mt-3 text-xs uppercase text-gray-500">
                                    Time
                                </p>

                                <h3 className="mt-1 font-semibold text-gray-900">
                                    {booking.time}
                                </h3>

                            </div>

                            {/* Mode */}

                            <div className="text-center">

                                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100">

                                    <MessageCircle
                                        className="text-blue-600"
                                        size={22}
                                    />

                                </div>

                                <p className="mt-3 text-xs uppercase text-gray-500">
                                    Mode
                                </p>

                                <h3 className="mt-1 font-semibold text-gray-900">
                                    {booking.mode}
                                </h3>

                            </div>

                        </div>

                    </div>

                    {/* Info Box */}

                    <div className="mt-6 flex gap-4 rounded-2xl border border-blue-100 bg-blue-50 p-4">

                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100">

                            <Info
                                className="text-blue-600"
                                size={18}
                            />

                        </div>

                        <p className="text-sm leading-6 text-gray-600">
                            Please join your consultation at least
                            <span className="font-semibold text-gray-800">
                                {" "}5 minutes earlier{" "}
                            </span>
                            than your scheduled time. We'll send you a reminder before your session begins.
                        </p>

                    </div>
                    {/* Astrologer Card */}

                    <div className="mt-7 rounded-3xl border border-gray-100 bg-white p-5 shadow-sm">

                        <div className="flex items-center gap-4">

                            <div className="relative">

                                <img
                                    src={astrologer.image}
                                    alt={astrologer.name}
                                    className="h-16 w-16 rounded-full object-cover ring-4 ring-purple-100"
                                />

                                <div className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-green-500 ring-2 ring-white">
                                    <Check
                                        size={13}
                                        className="text-white"
                                        strokeWidth={3}
                                    />
                                </div>

                            </div>

                            <div className="flex-1">

                                <h3 className="text-lg font-bold text-gray-900">
                                    {astrologer.name}
                                </h3>

                                <p className="mt-1 text-sm text-gray-500">
                                    {astrologer.tag}
                                </p>

                                <div className="mt-2 inline-flex items-center gap-1 rounded-full bg-amber-50 px-3 py-1">

                                    <Star
                                        size={14}
                                        className="fill-yellow-400 text-yellow-400"
                                    />

                                    <span className="text-sm font-semibold text-gray-700">
                                        {astrologer.rating}
                                    </span>

                                </div>

                            </div>

                        </div>

                    </div>

                    {/* Divider */}

                    <div className="my-7 h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent"></div>

                    {/* Success Text */}

                    <div className="text-center">

                        <p className="text-sm text-gray-500">
                            You can view your appointment details,
                            reschedule or join the consultation anytime
                            from your bookings.
                        </p>

                    </div>

                    {/* Button */}

                    <button
                        onClick={onMyBookings}
                        className="group mt-7 flex h-14 w-full items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-violet-700 via-purple-700 to-fuchsia-700 text-white shadow-xl transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl"
                    >

                        <BookOpen
                            size={20}
                            className="transition-transform duration-300 group-hover:rotate-6"
                        />

                        <span className="text-[15px] font-semibold tracking-wide">
                            Go To My Bookings
                        </span>

                        <ArrowRight
                            size={18}
                            className="transition-transform duration-300 group-hover:translate-x-1"
                        />

                    </button>

                </div>

            </div>

        </div>
    );
}