import { useState, useEffect } from "react";
import { getMyBookings } from "../../API/bookingApis";
import { initiateCall, terminateCall } from "../../API/callApi";

export default function MyBookings() {
    const [activeTab, setActiveTab] = useState("all");
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(false);
    const [activeCallModal, setActiveCallModal] = useState(null);

    const fetchBookings = async () => {
        try {
            setLoading(true);
            const res = await getMyBookings();
            setBookings(res?.data?.data || []);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBookings();
    }, []);

    const formatDate = (date) => {
        if (!date) return "";
        return new Date(date).toLocaleDateString("en-IN", {
            day: "numeric",
            month: "short",
            year: "numeric",
        });
    };

    const handleAction = async (booking, actionType) => {
        try {
            const payload = { bookingId: booking._id, action: actionType };
            await initiateCall(payload);
            
            if (actionType === "voice_call") {
                setActiveCallModal(booking);
            }
        } catch (error) {
            console.error(error);
        }
    };

    const handleEndCall = async (bookingId) => {
        try {
            const payload = { bookingId };
            await terminateCall(payload);
            setActiveCallModal(null);
        } catch (error) {
            console.error(error);
        }
    };

    const filterBookings = (tab, list) => {
        if (tab === "all") return list;
        if (tab === "pending") return list.filter((b) => b.status === "pending");
        if (tab === "accepted") return list.filter((b) => ["accepted", "confirmed"].includes(b.status));
        if (tab === "completed") return list.filter((b) => b.status === "completed");
        if (tab === "cancelled") return list.filter((b) => ["cancelled", "rejected"].includes(b.status));
        return list;
    };

    const currentList = filterBookings(activeTab, bookings);

    const renderBookingsList = (list) => {
        if (list.length === 0) {
            return (
                <div className="py-16 text-center">
                    <p className="text-gray-400 font-medium">No bookings found</p>
                </div>
            );
        }

        return (
            <div className="grid gap-6">
                {list.map((booking) => {
                    const isPast = ["completed", "cancelled", "rejected"].includes(booking.status);
                    const partner = booking.partner || {};

                    return (
                        <div 
                            key={booking._id} 
                            className="group relative overflow-hidden rounded-3xl border border-purple-100/80 bg-white p-6 shadow-xl shadow-purple-900/5 transition-all duration-300 hover:shadow-2xl hover:shadow-purple-900/10"
                        >
                            <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
                                <div className="flex items-start gap-4">
                                    <div className="relative">
                                        <img 
                                            src={partner.profilePic || "https://via.placeholder.com/150"} 
                                            alt={partner.fullName || "Astrologer"} 
                                            className="h-16 w-16 rounded-2xl object-cover ring-4 ring-purple-50"
                                        />
                                        <span className="absolute -bottom-1 -right-1 h-4 w-4 rounded-full border-2 border-white bg-emerald-500"></span>
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <h3 className="text-lg font-bold text-gray-900">{partner.fullName || "Astrologer"}</h3>
                                            <span className="rounded-full bg-purple-50 px-2.5 py-0.5 text-xs font-semibold text-purple-700 capitalize">
                                                {booking.mode?.replace("_", " ") || "Call"}
                                            </span>
                                        </div>
                                        <p className="mt-0.5 text-xs text-purple-600 font-medium">
                                            {partner.specialties?.join(", ") || "General Consultation"}
                                        </p>
                                        
                                        <div className="mt-3 flex flex-wrap items-center gap-4 text-xs font-medium text-gray-500">
                                            <span className="flex items-center gap-1.5 bg-gray-50 px-3 py-1.5 rounded-xl">
                                                📅 {formatDate(booking.date)}
                                            </span>
                                            <span className="flex items-center gap-1.5 bg-gray-50 px-3 py-1.5 rounded-xl">
                                                ⏰ {booking.timeSlot}
                                            </span>
                                            <span className="flex items-center gap-1.5 bg-gray-50 px-3 py-1.5 rounded-xl">
                                                ⏳ {booking.duration || 0} Mins
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex flex-col items-end justify-between gap-4 border-t border-gray-100 pt-4 md:border-t-0 md:pt-0">
                                    <div className="text-right">
                                        <span className="text-xs text-gray-400 font-medium">Total Amount</span>
                                        <p className="text-lg font-extrabold text-gray-900">₹{booking.totalFee || 0}</p>
                                        <span className={`inline-block mt-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                                            booking.status === "confirmed" || booking.status === "accepted" ? "bg-emerald-50 text-emerald-600" :
                                            booking.status === "pending" ? "bg-amber-50 text-amber-600" : "bg-gray-100 text-gray-600"
                                        }`}>
                                            {booking.status}
                                        </span>
                                    </div>

                                    {!isPast && (
                                        <div className="flex w-full items-center gap-3 md:w-auto">
                                            <button 
                                                onClick={() => handleAction(booking, "chat")}
                                                className="flex-1 md:flex-none inline-flex items-center justify-center gap-2 rounded-2xl bg-purple-50 px-5 py-3 text-sm font-bold text-purple-700 transition-all hover:bg-purple-100 active:scale-95"
                                            >
                                                💬 Chat
                                            </button>
                                            <button 
                                                onClick={() => handleAction(booking, "voice_call")}
                                                className="flex-1 md:flex-none inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-violet-600 to-fuchsia-600 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-purple-600/30 transition-all hover:opacity-95 active:scale-95"
                                            >
                                                📞 Voice Call
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-[#faf7ff] px-4 py-8 md:px-8">
            <div className="mx-auto max-w-4xl">
                <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-black tracking-tight text-gray-900">My Bookings</h1>
                        <p className="mt-1 text-sm text-gray-500 font-medium">Manage your consultation sessions with experts.</p>
                    </div>

                    <div className="flex flex-wrap rounded-2xl border border-purple-100 bg-white p-1.5 shadow-sm">
                        {["all", "pending", "accepted", "completed", "cancelled"].map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`rounded-xl px-4 py-2 text-xs font-bold capitalize transition-all duration-300 ${
                                    activeTab === tab
                                        ? "bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white shadow-md"
                                        : "text-gray-500 hover:text-purple-700"
                                }`}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>
                </div>

                {loading ? (
                    <div className="py-24 text-center">
                        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-purple-600 border-r-transparent"></div>
                        <p className="mt-2 text-sm text-gray-400 font-medium">Loading your bookings...</p>
                    </div>
                ) : (
                    renderBookingsList(currentList)
                )}
            </div>

            {activeCallModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md px-4">
                    <div className="relative w-full max-w-md overflow-hidden rounded-3xl bg-gradient-to-b from-purple-900 via-gray-900 to-black p-8 text-center text-white shadow-2xl border border-purple-500/20">
                        <div className="absolute -top-24 -left-24 h-48 w-48 rounded-full bg-purple-600/30 blur-3xl"></div>
                        <div className="absolute -bottom-24 -right-24 h-48 w-48 rounded-full bg-fuchsia-600/30 blur-3xl"></div>

                        <div className="relative z-10 flex flex-col items-center">
                            <div className="relative mb-6">
                                <div className="absolute -inset-4 rounded-full bg-gradient-to-r from-violet-500 to-fuchsia-500 opacity-75 blur-lg animate-pulse"></div>
                                <img 
                                    src={activeCallModal.partner?.profilePic || "https://via.placeholder.com/150"} 
                                    alt={activeCallModal.partner?.fullName || "Astrologer"} 
                                    className="relative h-28 w-28 rounded-full object-cover ring-4 ring-white/20 shadow-2xl"
                                />
                            </div>

                            <h2 className="text-2xl font-black tracking-tight text-white">
                                {activeCallModal.partner?.fullName || "Astrologer"}
                            </h2>
                            <p className="mt-1 text-sm text-purple-300 font-medium">
                                {activeCallModal.partner?.specialties?.join(", ") || "General Consultation"}
                            </p>

                            <div className="my-8 flex items-center justify-center gap-2">
                                <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping"></span>
                                <p className="text-xs font-bold uppercase tracking-widest text-emerald-400">
                                    Calling Astrologer...
                                </p>
                            </div>

                            <div className="flex w-full justify-center">
                                <button 
                                    onClick={() => handleEndCall(activeCallModal._id)}
                                    className="inline-flex items-center justify-center gap-2 rounded-2xl bg-red-600 px-8 py-4 text-sm font-bold text-white shadow-lg shadow-red-600/40 transition-all hover:bg-red-700 active:scale-95"
                                >
                                    🔴 End Call
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}