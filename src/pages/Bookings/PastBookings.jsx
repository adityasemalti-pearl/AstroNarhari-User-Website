import {
  CalendarDays,
  Clock3,
  MessageCircle,
  CheckCircle2,
  Star,
  RotateCcw,
  FileText,
} from "lucide-react";

export default function PastBookings({
  astrologer = {
    name: "Acharya Sharma",
    tag: "Vedic Expert",
    rating: 4.9,
    image: "https://i.pravatar.cc/150?img=12",
  },

  booking = {
    date: "20 July 2026",
    time: "10:30 AM",
    mode: "Chat",
    duration: "30 Mins",
  },

  onBookAgain = () => {},
  onViewDetails = () => {},
}) {
  return (
    <div className="overflow-hidden rounded-[30px]  border border-purple-100 bg-white shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl">

      {/* Header */}

      <div className="bg-gradient-to-r from-violet-700 via-purple-700 to-fuchsia-700 p-6 text-white">

        <div className="flex items-center justify-between">

          <div className="flex items-center gap-4">

            <img
              src={astrologer.image}
              alt={astrologer.name}
              className="h-16 w-16 rounded-full border-4 border-white/30 object-cover"
            />

            <div>

              <h2 className="text-xl font-bold">
                {astrologer.name}
              </h2>

              <p className="text-sm text-purple-100">
                {astrologer.tag}
              </p>

              <div className="mt-2 inline-flex items-center gap-1 rounded-full bg-white/20 px-3 py-1">

                <Star
                  size={14}
                  className="fill-yellow-300 text-yellow-300"
                />

                <span className="text-sm">
                  {astrologer.rating}
                </span>

              </div>

            </div>

          </div>

          {/* Status */}

          <div className="rounded-2xl bg-white/20 px-5 py-3 text-center">

            <CheckCircle2
              size={28}
              className="mx-auto"
            />

            <p className="mt-2 text-sm font-semibold">
              Completed
            </p>

          </div>

        </div>

      </div>

      {/* Body */}

      <div className="p-6">

        {/* Booking Details */}

        <div className="grid grid-cols-4 gap-3">

          <div className="rounded-2xl bg-purple-50 p-4 text-center">

            <CalendarDays
              size={22}
              className="mx-auto text-purple-700"
            />

            <p className="mt-2 text-xs text-gray-500">
              Date
            </p>

            <h3 className="mt-1 font-semibold">
              {booking.date}
            </h3>

          </div>

          <div className="rounded-2xl bg-purple-50 p-4 text-center">

            <Clock3
              size={22}
              className="mx-auto text-purple-700"
            />

            <p className="mt-2 text-xs text-gray-500">
              Time
            </p>

            <h3 className="mt-1 font-semibold">
              {booking.time}
            </h3>

          </div>

          <div className="rounded-2xl bg-purple-50 p-4 text-center">

            <MessageCircle
              size={22}
              className="mx-auto text-purple-700"
            />

            <p className="mt-2 text-xs text-gray-500">
              Mode
            </p>

            <h3 className="mt-1 font-semibold">
              {booking.mode}
            </h3>

          </div>

          <div className="rounded-2xl bg-purple-50 p-4 text-center">

            <Clock3
              size={22}
              className="mx-auto text-purple-700"
            />

            <p className="mt-2 text-xs text-gray-500">
              Duration
            </p>

            <h3 className="mt-1 font-semibold">
              {booking.duration}
            </h3>

          </div>

        </div>

        {/* Completed Message */}

        <div className="mt-6 rounded-2xl border border-purple-100 bg-purple-50 p-4">

          <div className="flex items-start gap-3">

            <CheckCircle2
              className="mt-1 text-purple-700"
              size={20}
            />

            <p className="text-sm text-gray-600 leading-6">
              Your consultation has been completed successfully.
              You can view the booking details or schedule another
              consultation with the same astrologer.
            </p>

          </div>

        </div>

        {/* Buttons */}

        <div className="mt-6 grid grid-cols-2 gap-4">

          <button
            onClick={onViewDetails}
            className="flex h-12 items-center justify-center gap-2 rounded-xl border border-purple-200 bg-purple-50 font-medium text-purple-700 transition hover:bg-purple-100"
          >

            <FileText size={18} />

            View Details

          </button>

          <button
            onClick={onBookAgain}
            className="flex h-12 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-700 via-purple-700 to-fuchsia-700 font-medium text-white shadow-lg transition hover:scale-[1.02]"
          >

            <RotateCcw size={18} />

            Book Again

          </button>

        </div>

      </div>

    </div>
  );
}