import React, { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Video,
    Phone,
    MessageCircle,
    Calendar,
    Clock3,
    Plus,
} from "lucide-react";

const MODE_ICON = { video: Video, call: Phone, chat: MessageCircle };

const HISTORY_FILTERS = ["All", "Calls", "Chats", "Reports"];

function ModeBadge({ mode }) {
    const Icon = MODE_ICON[mode] || Video;
    return (
        <span className="inline-flex items-center gap-1.5 rounded-full bg-white/90 text-purple-700 text-[11px] font-semibold px-2.5 py-1 shadow">
            <Icon size={11} />
            {mode.charAt(0).toUpperCase() + mode.slice(1)}
        </span>
    );
}

function UpcomingCard({ item }) {
    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-2xl bg-white border border-purple-100 shadow-md hover:shadow-xl transition-shadow p-6 flex items-center gap-6"
        >
            <div className="relative shrink-0">
                <div
                    className={`h-14 w-14 rounded-full bg-gradient-to-br ${item.avatarColor} flex items-center justify-center text-white font-serif font-bold text-lg`}
                >
                    {item.astrologer.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                </div>
                <div className="absolute -bottom-1 -right-1">
                    <ModeBadge mode={item.mode} />
                </div>
            </div>

            <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                    <p className="font-semibold text-slate-900">{item.astrologer}</p>
                    {item.status === "in3hours" && (
                        <span className="text-[10px] font-bold uppercase tracking-wide text-amber-700 bg-amber-100 rounded-full px-2 py-0.5">
                            In 3 hours
                        </span>
                    )}
                </div>
                <p className="text-xs text-slate-500 mt-0.5">{item.specialty}</p>
                <div className="flex items-center gap-4 mt-2 text-xs text-slate-500">
                    <span className="flex items-center gap-1.5">
                        <Calendar size={13} /> {item.date}
                    </span>
                    <span className="flex items-center gap-1.5">
                        <Clock3 size={13} /> {item.time}
                    </span>
                    <span>{item.topic}</span>
                </div>
            </div>

            <div className="flex flex-col items-end gap-2 shrink-0">
                <button
                    type="button"
                    className="rounded-xl bg-purple-700 text-white text-sm font-semibold px-5 py-2.5 hover:bg-purple-800 transition-colors shadow"
                >
                    Join Call
                </button>
                <button
                    type="button"
                    className="text-xs font-semibold text-slate-500 hover:text-purple-700 transition-colors"
                >
                    Reschedule
                </button>
            </div>
        </motion.div>
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
            <div
                className={`h-14 w-14 rounded-full bg-gradient-to-br ${item.avatarColor} flex items-center justify-center text-white font-serif font-bold text-lg shrink-0`}
            >
                {item.astrologer.split(" ").map((n) => n[0]).join("").slice(0, 2)}
            </div>

            <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                    <p className="font-semibold text-slate-900">{item.astrologer}</p>
                    <ModeBadge mode={item.mode} />
                </div>
                <p className="text-xs text-slate-500 mt-1">{item.date} &middot; {item.time}</p>
                <div className="flex items-center gap-4 mt-2 text-xs text-slate-500">
                    <span>Duration &middot; {item.duration}</span>
                    <span>Topic &middot; {item.topic}</span>
                </div>
            </div>

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
    const [tab, setTab] = useState("upcoming");
    const [historyFilter, setHistoryFilter] = useState("All");

    const data = {
        upcoming: [
            {
                id: 1,
                astrologer: "Dr. Ananya Sharma",
                specialty: "Vedic Astrology • Career Guidance",
                date: "24 Oct 2026",
                time: "4:30 PM",
                topic: "Career & Finance",
                mode: "video",
                status: "in3hours",
                avatarColor: "from-purple-500 to-indigo-600",
            },
            {
                id: 2,
                astrologer: "Acharya Rahul Joshi",
                specialty: "Kundli Matching",
                date: "28 Oct 2026",
                time: "11:00 AM",
                topic: "Marriage Consultation",
                mode: "call",
                status: "",
                avatarColor: "from-amber-500 to-orange-500",
            },
        ],

    history: [
            {
                id: 101,
                astrologer: "Pandit Vivek Mishra",
                mode: "video",
                date: "15 Sep 2026",
                time: "2:00 PM",
                duration: "45 mins",
                topic: "Business Growth",
                avatarColor: "from-purple-600 to-pink-500",
            },
            {
                id: 102,
                astrologer: "Dr. Meera Kapoor",
                mode: "call",
                date: "08 Sep 2026",
                time: "7:30 PM",
                duration: "30 mins",
                topic: "Health Guidance",
                avatarColor: "from-sky-500 to-cyan-500",
            },
            {
                id: 103,
                astrologer: "Acharya Sandeep",
                mode: "chat",
                date: "30 Aug 2026",
                time: "10:15 AM",
                duration: "25 mins",
                topic: "Love & Relationship",
                avatarColor: "from-emerald-500 to-green-600",
            },
            {
                id: 104,
                astrologer: "Guru Mahesh",
                mode: "video",
                date: "20 Aug 2026",
                time: "5:00 PM",
                duration: "60 mins",
                topic: "Kundli Analysis",
                avatarColor: "from-orange-500 to-red-500",
            },
        ],
    };

    const filteredHistory = useMemo(() => {
        if (historyFilter === "All") return data.history;

        const map = {
            Calls: ["call", "video"],
            Chats: ["chat"],
            Reports: [],
        };

        if (historyFilter === "Reports") return [];

        return data.history.filter((item) =>
            map[historyFilter].includes(item.mode)
        );
    }, [historyFilter]);





    return (
        <div className="space-y-7 my-10 max-w-6xl mx-auto">
            {/* Tabs + CTA */}
            <h1 className="text-center font-bold text-purple-700 text-5xl font-serif">My Consultations</h1>
            <div className="flex items-center justify-between">
                <div className="inline-flex rounded-xl bg-purple-50 p-1.5">
                    {["upcoming", "history"].map((t) => (
                        <button
                            key={t}
                            type="button"
                            onClick={() => setTab(t)}
                            className={`relative px-6 py-2.5 text-sm font-semibold rounded-lg transition-colors ${tab === t ? "text-white" : "text-purple-700/70 hover:text-purple-800"
                                }`}
                        >
                            {tab === t && (
                                <motion.div
                                    layoutId="consultation-tab"
                                    className="absolute inset-0 rounded-lg bg-purple-700 shadow"
                                    transition={{ type: "spring", stiffness: 350, damping: 28 }}
                                />
                            )}
                            <span className="relative z-10 capitalize">{t}</span>
                        </button>
                    ))}
                </div>

                <button
                    type="button"
                    className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-amber-300 to-yellow-400 text-white text-sm font-bold px-5 py-2.5 shadow-lg hover:shadow-xl transition-shadow"
                >
                    <Plus size={16} /> Book New
                </button>
            </div>

            {/* History filters */}
            {tab === "history" && (
                <div className="flex items-center gap-2">
                    {HISTORY_FILTERS.map((f) => (
                        <button
                            key={f}
                            type="button"
                            onClick={() => setHistoryFilter(f)}
                            className={`rounded-full px-4 py-1.5 text-xs font-semibold transition-colors ${historyFilter === f
                                    ? "bg-purple-700 text-white"
                                    : "bg-white border border-purple-100 text-slate-600 hover:border-purple-300"
                                }`}
                        >
                            {f}
                        </button>
                    ))}
                </div>
            )}

            <AnimatePresence mode="wait">
                {tab === "upcoming" ? (
                    <motion.div
                        key="upcoming"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="space-y-4"
                    >
                        {data.upcoming.length ? (
                            data.upcoming.map((item) => <UpcomingCard key={item.id} item={item} />)
                        ) : (
                            <EmptyState label="No upcoming consultations" />
                        )}
                    </motion.div>
                ) : (
                    <motion.div
                        key="history"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="space-y-4"
                    >
                        {filteredHistory.length ? (
                            filteredHistory.map((item) => <HistoryCard key={item.id} item={item} />)
                        ) : (
                            <EmptyState label="No consultations found for this filter" />
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
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