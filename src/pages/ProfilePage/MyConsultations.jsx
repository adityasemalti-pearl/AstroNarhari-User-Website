import React, { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
    Video,
    Phone,
    MessageCircle,
    Calendar,
    Clock3,
    Plus,
} from "lucide-react";

import { getMyBookings } from "../../API/bookingApis";

const MODE_ICON = {
    video: Video,
    call: Phone,
    chat: MessageCircle,
};

const HISTORY_FILTERS = ["All", "Calls", "Chats", "Reports"];

const AVATAR_COLORS = [
    "from-purple-500 to-indigo-600",
    "from-amber-500 to-orange-500",
    "from-purple-600 to-pink-500",
    "from-sky-500 to-cyan-500",
    "from-emerald-500 to-green-600",
    "from-orange-500 to-red-500",
];

function ModeBadge({ mode }) {
    const normalizedMode = mode?.toLowerCase() || "video";
    const Icon = MODE_ICON[normalizedMode] || Video;

    return (
        <span className="inline-flex items-center gap-1.5 rounded-full bg-white/90 text-purple-700 text-[11px] font-semibold px-2.5 py-1 shadow">
            <Icon size={11} />
            {normalizedMode.charAt(0).toUpperCase() +
                normalizedMode.slice(1)}
        </span>
    );
}

function HistoryCard({ item }) {
    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-2xl bg-white border border-purple-100 shadow-md hover:shadow-xl transition-shadow p-6 flex items-center gap-6"
        >
            {/* Profile */}
            <div
                className={`h-14 w-14 rounded-full bg-gradient-to-br ${item.avatarColor} flex items-center justify-center text-white font-serif font-bold text-lg shrink-0 overflow-hidden`}
            >
                {item.profilePic ? (
                    <img
                        src={item.profilePic}
                        alt={item.astrologer}
                        className="h-full w-full object-cover"
                    />
                ) : (
                    item.astrologer
                        ?.split(" ")
                        .map((n) => n[0])
                        .join("")
                        .slice(0, 2)
                        .toUpperCase()
                )}
            </div>

            {/* Details */}
            <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                    <p className="font-semibold text-slate-900">
                        {item.astrologer}
                    </p>

                    <ModeBadge mode={item.mode} />
                </div>

                <p className="text-xs text-slate-500 mt-1">
                    {item.date} &middot; {item.time}
                </p>

                <p className="text-xs text-slate-500 mt-1">
                    {item.specialty}
                </p>

                <div className="flex items-center gap-4 mt-2 text-xs text-slate-500 flex-wrap">
                    <span className="flex items-center gap-1.5">
                        <Clock3 size={13} />
                        {item.duration} mins
                    </span>

                    <span>
                        Rate &middot; ₹{item.ratePerMinute}/min
                    </span>

                    <span>
                        Total &middot; ₹{item.totalFee}
                    </span>
                </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col items-end gap-2 shrink-0">
                <button
                    type="button"
                    className="rounded-xl bg-purple-700 text-white text-sm font-semibold px-5 py-2.5 hover:bg-purple-800 transition-colors shadow"
                >
                    Re-book
                </button>

                <button
                    type="button"
                    className="text-xs font-semibold text-slate-500 hover:text-purple-700 transition-colors"
                >
                    View Summary
                </button>
            </div>
        </motion.div>
    );
}

export default function MyConsultations() {
    const [historyFilter, setHistoryFilter] = useState("All");
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchBookings = async () => {
        try {
            setLoading(true);

            const res = await getMyBookings();

            console.log("Bookings fetched:", res.data);

            const apiData = res?.data?.data || [];

            setBookings(Array.isArray(apiData) ? apiData : []);
        } catch (error) {
            console.log("Error fetching bookings:", error);
            setBookings([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBookings();
    }, []);

    /*
     * ONLY COMPLETED BOOKINGS
     */
    const completedBookings = useMemo(() => {
        return bookings
            .filter(
                (booking) =>
                    booking?.status?.toLowerCase() === "completed"
            )
            .map((booking, index) => {
                const partner = booking?.partner || {};

                const bookingDate = booking?.date
                    ? new Date(booking.date)
                    : null;

                return {
                    id: booking?._id,

                    astrologer:
                        partner?.fullName || "Astrologer",

                    specialty:
                        partner?.specialties?.length
                            ? partner.specialties.join(" • ")
                            : "Astrology Consultation",

                    date: bookingDate
                        ? bookingDate.toLocaleDateString("en-IN", {
                              day: "2-digit",
                              month: "short",
                              year: "numeric",
                          })
                        : "-",

                    time:
                        booking?.timeSlot ||
                        (bookingDate
                            ? bookingDate.toLocaleTimeString("en-IN", {
                                  hour: "2-digit",
                                  minute: "2-digit",
                              })
                            : "-"),

                    duration: booking?.duration || 0,

                    mode:
                        booking?.mode?.toLowerCase() || "video",

                    ratePerMinute:
                        booking?.ratePerMinute || 0,

                    totalFee:
                        booking?.totalFee || 0,

                    profilePic:
                        partner?.profilePic || null,

                    avatarColor:
                        AVATAR_COLORS[
                            index % AVATAR_COLORS.length
                        ],

                    actualDuration:
                        booking?.actualDuration || 0,

                    rating:
                        booking?.rating || null,

                    review:
                        booking?.review || null,
                };
            });
    }, [bookings]);

    /*
     * History filters
     */
    const filteredHistory = useMemo(() => {
        if (historyFilter === "All") {
            return completedBookings;
        }

        if (historyFilter === "Calls") {
            return completedBookings.filter(
                (item) =>
                    item.mode === "call" ||
                    item.mode === "video"
            );
        }

        if (historyFilter === "Chats") {
            return completedBookings.filter(
                (item) => item.mode === "chat"
            );
        }

        if (historyFilter === "Reports") {
            return [];
        }

        return completedBookings;
    }, [completedBookings, historyFilter]);

    return (
        <div className="space-y-7 my-10 max-w-6xl mx-auto">
            {/* Heading */}
            <h1 className="text-center font-bold text-purple-700 text-5xl font-serif">
                My Consultations
            </h1>

            {/* Header */}
            <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-slate-800">
                    Consultation History
                </h2>

                <button
                    type="button"
                    className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-amber-300 to-yellow-400 text-white text-sm font-bold px-5 py-2.5 shadow-lg hover:shadow-xl transition-shadow"
                >
                    <Plus size={16} />
                    Book New
                </button>
            </div>

            {/* Filters */}
            <div className="flex items-center gap-2">
                {HISTORY_FILTERS.map((filter) => (
                    <button
                        key={filter}
                        type="button"
                        onClick={() => setHistoryFilter(filter)}
                        className={`rounded-full px-4 py-1.5 text-xs font-semibold transition-colors ${
                            historyFilter === filter
                                ? "bg-purple-700 text-white"
                                : "bg-white border border-purple-100 text-slate-600 hover:border-purple-300"
                        }`}
                    >
                        {filter}
                    </button>
                ))}
            </div>

            {/* Completed Consultations */}
            <div className="space-y-4">
                {loading ? (
                    <EmptyState label="Loading consultations..." />
                ) : filteredHistory.length > 0 ? (
                    filteredHistory.map((item) => (
                        <HistoryCard
                            key={item.id}
                            item={item}
                        />
                    ))
                ) : (
                    <EmptyState label="No completed consultations found" />
                )}
            </div>
        </div>
    );
}

function EmptyState({ label }) {
    return (
        <div className="rounded-2xl border border-dashed border-purple-200 py-16 text-center text-sm text-slate-400">
            {label}
        </div>
    );
}