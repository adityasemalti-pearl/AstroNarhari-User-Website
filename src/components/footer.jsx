import { Link } from "react-router-dom";
import {
  FaFacebookF,
  FaInstagram,
  FaTwitter,
  FaYoutube,
} from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import { IoArrowForward } from "react-icons/io5";

export default function Footer() {
  return (
    <footer className="relative overflow-hidden bg-[#0B0616] text-white">
      <div className="absolute -left-32 top-0 h-80 w-80 rounded-full bg-purple-700/20 blur-[120px]" />
      <div className="absolute -right-32 bottom-0 h-80 w-80 rounded-full bg-fuchsia-600/20 blur-[120px]" />

      <div className="relative mx-auto max-w-7xl px-6 py-20">
        <div className="mb-16 rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl">
          <div className="flex flex-col items-center justify-between gap-6 lg:flex-row">
            <div>
              <h2 className="text-3xl font-bold">
                Stay Connected With The Cosmos ✨
              </h2>
              <p className="mt-2 text-gray-300">
                Get daily horoscopes, astrology insights & exclusive offers.
              </p>
            </div>

            <div className="flex w-full max-w-xl overflow-hidden rounded-full bg-white lg:w-auto">
              <input
                type="email"
                placeholder="Enter your email..."
                className="w-full bg-transparent px-6 py-4 text-black outline-none"
              />

              <button className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-fuchsia-600 px-8 font-semibold text-white transition hover:scale-105">
                Subscribe
                <IoArrowForward size={18} />
              </button>
            </div>
          </div>
        </div>

        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <h2 className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-3xl font-extrabold text-transparent">
              Namah-Astro
            </h2>

            <p className="mt-5 leading-7 text-gray-400">
              Discover your destiny through astrology, numerology, Vastu,
              tarot, and expert consultations with trusted astrologers.
            </p>

            <div className="mt-6 flex gap-4">
              {[FaFacebookF, FaInstagram, FaTwitter, FaYoutube].map(
                (Icon, i) => (
                  <div
                    key={i}
                    className="flex h-11 w-11 cursor-pointer items-center justify-center rounded-full border border-white/10 bg-white/5 transition-all duration-300 hover:scale-110 hover:bg-gradient-to-r hover:from-purple-600 hover:to-fuchsia-600"
                  >
                    <Icon size={18} />
                  </div>
                )
              )}
            </div>
          </div>

          <div>
            <h3 className="mb-6 text-xl font-bold">Quick Links</h3>

            <ul className="space-y-4 text-gray-400">
              {[
                { name: "Home", to: "/home" },
                { name: "Astrologers", to: "/dashboard/astrologers" },
                { name: "Kundli", to: "/dashboard/kundali" },
                { name: "Horoscope", to: "/dashboard/horoscope" },
                { name: "Careers", to: "/careers" },
                { name: "Blogs", to: "/dashboard/articles" },
              ].map((item) => (
                <li key={item.name}>
                  <Link
                    to={item.to}
                    className="transition hover:translate-x-2 hover:text-purple-400 inline-block"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-6 text-xl font-bold">Services</h3>

            <ul className="space-y-4 text-gray-400">
              {[
                "Live Consultation",
                "Chat with Astrologer",
                "Video Call",
                "Tarot Reading",
                "Palm Reading",
                "Numerology",
              ].map((item) => (
                <li
                  key={item}
                  className="cursor-pointer transition hover:translate-x-2 hover:text-purple-400"
                >
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-6 text-xl font-bold">Contact Us</h3>

            <div className="space-y-5 text-gray-400">
              <div className="flex items-center gap-3">
                <MdEmail className="text-xl text-purple-400" />
                <span>Admin@namahastro.com</span>
              </div>
            </div>
          </div>
        </div>

        <div className="my-10 h-px bg-gradient-to-r from-transparent via-purple-500/50 to-transparent" />

        <div className="flex flex-col items-center justify-between gap-5 text-sm text-gray-400 lg:flex-row">
          <p>© 2026 Namah-Astro. All Rights Reserved.</p>
        </div>
      </div>
    </footer>
  );
}