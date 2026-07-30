import { useState } from "react";
import UpcomingBooking from "./UpComing";
import PastBookings from "./PastBookings";

export default function MyBookings() {
  const [activeTab, setActiveTab] = useState("upcoming");

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
      <div className="mx-auto mb-8 flex w-fit rounded-2xl bg-white p-1.5 shadow-lg border border-purple-100">

        {/* Upcoming */}
        <button
          onClick={() => setActiveTab("upcoming")}
          className={`min-w-[170px] rounded-xl px-6 py-3 text-sm font-semibold transition-all duration-300 ${activeTab === "upcoming"
            ? "bg-gradient-to-r from-violet-700 to-fuchsia-700 text-white shadow-lg"
            : "text-gray-600 hover:bg-purple-50"
            }`}
        >
          Upcoming
        </button>

        {/* Past */}
        <button
          onClick={() => setActiveTab("past")}
          className={`min-w-[170px] rounded-xl px-6 py-3 text-sm font-semibold transition-all duration-300 ${activeTab === "past"
            ? "bg-gradient-to-r from-violet-700 to-fuchsia-700 text-white shadow-lg"
            : "text-gray-600 hover:bg-purple-50"
            }`}
        >
          Past
        </button>

      </div>

      {/* Content */}

      {activeTab === "upcoming" ? (

        <div className="rounded-3xl max-w-4xl mx-auto border border-purple-100 bg-white p-8 shadow-md">

          <h2 className="mb-3 text-xl font-bold text-purple-700">
            Upcoming Bookings
          </h2>

          <UpcomingBooking
            astrologer={{
              name: "Acharya Sharma",
              tag: "Vedic Expert",
              rating: 4.9,
              image: "https://i.pravatar.cc/150?img=12",
            }}
            booking={{
              date: "28 July 2026",
              time: "10:30 AM",
              mode: "Chat",
              startsIn: "01h 24m",
            }}
            onJoin={() => console.log("Join")}
            onReschedule={() => console.log("Reschedule")}
            onCancel={() => console.log("Cancel")}
          />

        </div>

      ) : (

        <div className="rounded-3xl max-w-4xl mx-auto border border-purple-100 bg-white p-8 shadow-md">

          <h2 className="mb-3 text-xl font-bold text-purple-700">
            Past Bookings
          </h2>

          <PastBookings
            astrologer={{
              name: "Acharya Sharma",
              tag: "Vedic Expert",
              rating: 4.9,
              image: "https://i.pravatar.cc/150?img=12",
            }}
            booking={{
              date: "20 July 2026",
              time: "10:30 AM",
              mode: "Chat",
              duration: "30 Mins",
            }}
            onViewDetails={() => console.log("View Details")}
            onBookAgain={() => console.log("Book Again")}
          />

        </div>

      )}

    </div>
  );
}