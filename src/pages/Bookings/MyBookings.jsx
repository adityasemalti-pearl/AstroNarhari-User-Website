import { useState, useEffect } from "react";
import UpcomingBooking from "./UpComing";
import PastBookings from "./PastBookings";

import { getMyBookings, cancelBooking, rescheduleBooking } from "../../API/bookingApis";

export default function MyBookings() {
    const [activeTab, setActiveTab] = useState("upcoming");
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(false);

    const fetchBookings = async () => {
        try {
            setLoading(true);

            const res = await getMyBookings();

            console.log("My Bookings Response:", res);

            const bookingData = res?.data?.data || [];

            setBookings(bookingData);

        } catch (error) {
            console.error("Get My Bookings Error:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBookings();
    }, []);

    // =========================
    // FILTER BOOKINGS
    // =========================

    const upcomingBookings = bookings.filter((booking) => {
        return (
            booking.status === "pending" ||
            booking.status === "confirmed"
        );
    });

    const pastBookings = bookings.filter((booking) => {
        return (
            booking.status === "completed" ||
            booking.status === "cancelled" ||
            booking.status === "rejected"
        );
    });

    // =========================
    // FORMAT DATE
    // =========================

    const formatDate = (date) => {
        if (!date) return "";

        return new Date(date).toLocaleDateString("en-IN", {
            day: "numeric",
            month: "long",
            year: "numeric",
        });
    };

    // =========================
    // FORMAT DURATION
    // =========================

    const formatDuration = (duration) => {
        return `${duration || 0} Mins`;
    };

    return (
        <div className="min-h-screen bg-[#faf7ff] p-6">

            {/* Heading */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">
                    My Bookings
                </h1>

                <p className="mt-1 text-gray-500">
                    View and manage all your consultations.
                </p>
            </div>

            {/* Toggle */}
            <div className="mx-auto mb-8 flex w-fit rounded-2xl border border-purple-100 bg-white p-1.5 shadow-lg">

                <button
                    onClick={() => setActiveTab("upcoming")}
                    className={`min-w-[170px] rounded-xl px-6 py-3 text-sm font-semibold transition-all duration-300 ${
                        activeTab === "upcoming"
                            ? "bg-gradient-to-r from-violet-700 to-fuchsia-700 text-white shadow-lg"
                            : "text-gray-600 hover:bg-purple-50"
                    }`}
                >
                    Upcoming
                </button>

                <button
                    onClick={() => setActiveTab("past")}
                    className={`min-w-[170px] rounded-xl px-6 py-3 text-sm font-semibold transition-all duration-300 ${
                        activeTab === "past"
                            ? "bg-gradient-to-r from-violet-700 to-fuchsia-700 text-white shadow-lg"
                            : "text-gray-600 hover:bg-purple-50"
                    }`}
                >
                    Past
                </button>

            </div>

            {/* Loading */}
            {loading ? (
                <div className="py-20 text-center">
                    <p className="text-sm text-gray-500">
                        Loading bookings...
                    </p>
                </div>
            ) : (

                <>
                    {/* ================= UPCOMING ================= */}

                    {activeTab === "upcoming" && (
                        <div className="mx-auto max-w-4xl rounded-3xl border border-purple-100 bg-white p-8 shadow-md">

                            <h2 className="mb-5 text-xl font-bold text-purple-700">
                                Upcoming Bookings
                            </h2>

                            {upcomingBookings.length === 0 ? (
                                <div className="py-12 text-center">
                                    <p className="text-sm text-gray-500">
                                        No upcoming bookings found.
                                    </p>
                                </div>
                            ) : (
                                <div className="space-y-5">

                                    {upcomingBookings.map((booking) => (

                                        <UpcomingBooking
                                            key={booking._id}

                                            astrologer={{
                                                id: booking.partner?._id,
                                                name: booking.partner?.fullName,
                                                image: booking.partner?.profilePic,
                                                specialties:
                                                    booking.partner?.specialties || [],
                                                minRate:
                                                    booking.partner?.minRate || 0,
                                            }}

                                            booking={{
                                                id: booking._id,
                                                date: formatDate(booking.date),
                                                time: booking.timeSlot,
                                                mode: booking.mode,
                                                duration: formatDuration(
                                                    booking.duration
                                                ),
                                                status: booking.status,
                                                paymentStatus:
                                                    booking.paymentStatus,
                                                totalFee:
                                                    booking.totalFee,
                                                startTime:
                                                    booking.startTime,
                                                endTime:
                                                    booking.endTime,
                                            }}

                                            onJoin={() =>
                                                console.log(
                                                    "Join Booking:",
                                                    booking
                                                )
                                            }

                                            onReschedule={() =>
                                                console.log(
                                                    "Reschedule:",
                                                    booking
                                                )
                                            }

                                            onCancel={() =>
                                                console.log(
                                                    "Cancel:",
                                                    booking
                                                )
                                            }
                                        />

                                    ))}

                                </div>
                            )}

                        </div>
                    )}

                    {/* ================= PAST ================= */}

                    {activeTab === "past" && (
                        <div className="mx-auto max-w-4xl rounded-3xl border border-purple-100 bg-white p-8 shadow-md">

                            <h2 className="mb-5 text-xl font-bold text-purple-700">
                                Past Bookings
                            </h2>

                            {pastBookings.length === 0 ? (
                                <div className="py-12 text-center">
                                    <p className="text-sm text-gray-500">
                                        No past bookings found.
                                    </p>
                                </div>
                            ) : (
                                <div className="space-y-5">

                                    {pastBookings.map((booking) => (

                                        <PastBookings
                                            key={booking._id}

                                            astrologer={{
                                                id: booking.partner?._id,
                                                name: booking.partner?.fullName,
                                                image: booking.partner?.profilePic,
                                                specialties:
                                                    booking.partner?.specialties || [],
                                                minRate:
                                                    booking.partner?.minRate || 0,
                                            }}

                                            booking={{
                                                id: booking._id,
                                                date: formatDate(booking.date),
                                                time: booking.timeSlot,
                                                mode: booking.mode,
                                                duration: formatDuration(
                                                    booking.duration
                                                ),
                                                status: booking.status,
                                                paymentStatus:
                                                    booking.paymentStatus,
                                                totalFee:
                                                    booking.totalFee,
                                                actualDuration:
                                                    booking.actualDuration,
                                                rating: booking.rating,
                                                review: booking.review,
                                            }}

                                            onViewDetails={() =>
                                                console.log(
                                                    "View Details:",
                                                    booking
                                                )
                                            }

                                            onBookAgain={() =>
                                                console.log(
                                                    "Book Again:",
                                                    booking
                                                )
                                            }

                                        />

                                    ))}

                                </div>
                            )}

                        </div>
                    )}

                </>
            )}

        </div>
    );
}