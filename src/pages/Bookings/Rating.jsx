import { useState } from "react";
import {
  X,
  Star,
  Download,
  Home,
  CheckCircle2,
} from "lucide-react";

export default function ConsultationRatingPopup({
  onClose = () => {},
  onSubmit = () => {},
  onDownload = () => {},
  onHome = () => {},
}) {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">

      <div className="w-full max-w-[560px] overflow-hidden rounded-[32px] bg-white shadow-[0_25px_80px_rgba(0,0,0,.18)]">

        {/* Header */}

        <div className="relative bg-gradient-to-r from-violet-700 via-purple-700 to-fuchsia-700 px-8 pb-20 pt-8">

          <button
            onClick={onClose}
            className="absolute right-5 top-5 flex h-10 w-10 items-center justify-center rounded-full bg-white/20 text-white hover:bg-white/30"
          >
            <X size={20} />
          </button>

          <div className="flex justify-center">

            <div className="flex h-24 w-24 items-center justify-center rounded-full bg-white shadow-xl">

              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-purple-100">

                <CheckCircle2
                  size={34}
                  className="text-purple-700"
                />

              </div>

            </div>

          </div>

          <h2 className="mt-6 text-center text-3xl font-bold text-white">
            Consultation Ended
          </h2>

          <p className="mt-2 text-center text-purple-100">
            Thank you for consulting with us.
          </p>

        </div>

        {/* Body */}

        <div className="-mt-12 rounded-t-[34px] bg-white px-8 pb-8 pt-8">

          {/* Rating */}

          <div className="rounded-3xl border border-purple-100 bg-purple-50 p-6">

            <h3 className="text-center text-xl font-bold text-gray-900">
              Rate Your Experience
            </h3>

            <p className="mt-2 text-center text-sm text-gray-500">
              Your feedback helps us improve our services.
            </p>

            <div className="mt-6 flex justify-center gap-3">

              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onMouseEnter={() => setHover(star)}
                  onMouseLeave={() => setHover(0)}
                  onClick={() => setRating(star)}
                >
                  <Star
                    size={42}
                    className={`transition-all duration-200 ${
                      star <= (hover || rating)
                        ? "fill-yellow-400 text-yellow-400 scale-110"
                        : "text-gray-300"
                    }`}
                  />
                </button>
              ))}

            </div>

          </div>

          {/* Download */}

          <button
            onClick={onDownload}
            className="mt-7 flex h-14 w-full items-center justify-center gap-3 rounded-2xl border border-purple-200 bg-purple-50 font-semibold text-purple-700 transition hover:bg-purple-100"
          >

            <Download size={20} />

            Download Chat / Recording

          </button>

          {/* Home */}

          <button
            onClick={() => {
              onSubmit(rating);
              onHome();
            }}
            className="mt-4 flex h-14 w-full items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-violet-700 via-purple-700 to-fuchsia-700 font-semibold text-white shadow-xl transition hover:scale-[1.02]"
          >

            <Home size={20} />

            Back To Home

          </button>

        </div>

      </div>

    </div>
  );
}