import {
  CalendarDays,
  Clock3,
  MessageCircle,
  Sparkles,
  ArrowRight,
  RotateCcw,
  XCircle,
  Star,
} from "lucide-react";

export default function UpcomingBooking({
  astrologer = {
    name: "Acharya Sharma",
    tag: "Vedic Expert",
    rating: 4.9,
    image: "https://i.pravatar.cc/150?img=12",
  },

  booking = {
    date: "28 July 2026",
    time: "10:30 AM",
    mode: "Chat",
    startsIn: "01h 24m",
  },

  onJoin = () => {},
  onReschedule = () => {},
  onCancel = () => {},
}) {
  return (
    <div className="overflow-hidden rounded-[30px] border border-purple-100 bg-white shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl">

      {/* Top */}
      <div className="bg-gradient-to-r from-violet-700 via-purple-700 to-fuchsia-700 p-6 text-white">

        <div className="flex items-center justify-between">

          {/* Astrologer */}
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

                <span className="text-sm font-medium">
                  {astrologer.rating}
                </span>

              </div>

            </div>

          </div>

          {/* Starts In */}

          <div className="rounded-2xl bg-white/15 px-5 py-3 text-center backdrop-blur">

            <p className="text-xs uppercase tracking-wider text-purple-100">
              Starts In
            </p>

            <h2 className="mt-1 text-2xl font-bold">
              {booking.startsIn}
            </h2>

          </div>

        </div>

      </div>

      {/* Body */}

      <div className="p-6">

        {/* Details */}

        <div className="grid grid-cols-3 gap-4">

          <div className="rounded-2xl bg-purple-50 p-4 text-center">

            <CalendarDays
              size={22}
              className="mx-auto text-purple-700"
            />

            <p className="mt-2 text-xs uppercase text-gray-500">
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

            <p className="mt-2 text-xs uppercase text-gray-500">
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

            <p className="mt-2 text-xs uppercase text-gray-500">
              Mode
            </p>

            <h3 className="mt-1 font-semibold">
              {booking.mode}
            </h3>

          </div>

        </div>

        {/* Join */}

        <button
          onClick={onJoin}
          className="group mt-7 flex h-14 w-full items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-violet-700 via-purple-700 to-fuchsia-700 text-white shadow-lg transition-all hover:scale-[1.02]"
        >

          <Sparkles
            size={20}
            className="group-hover:rotate-12 transition"
          />

          <span className="font-semibold">
            Join Conversation
          </span>

          <ArrowRight
            size={18}
            className="group-hover:translate-x-1 transition"
          />

        </button>

        {/* Bottom Buttons */}

        <div className="mt-5 grid grid-cols-2 gap-4">

          <button
            onClick={onReschedule}
            className="flex h-12 items-center justify-center gap-2 rounded-xl border border-purple-200 bg-purple-50 font-medium text-purple-700 transition hover:bg-purple-100"
          >

            <RotateCcw size={18} />

            Reschedule

          </button>

          <button
            onClick={onCancel}
            className="flex h-12 items-center justify-center gap-2 rounded-xl border border-red-200 bg-red-50 font-medium text-red-600 transition hover:bg-red-100"
          >

            <XCircle size={18} />

            Cancel

          </button>

        </div>

      </div>
    </div>
  );
}