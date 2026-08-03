import React from "react";
import { motion } from "framer-motion";
import {
  Sun,
  Moon,
  ArrowUpRight,
  CalendarClock,
  Package,
  UserCog,
  LifeBuoy,
  Languages,
  ChevronRight,
  Sparkles,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.5, ease: [0.215, 0.61, 0.355, 1] },
  }),
};

const SERVICES = [
  { id: "consultations", icon: CalendarClock, label: "My Consultations", desc: "Upcoming & past sessions" },
  { id: "orders", icon: Package, label: "My Orders", desc: "Gemstones, pujas & reports" },
  { id: "edit-profile", icon: UserCog, label: "Profile Settings", desc: "Birth details & identity" },
  { id: "support", icon: LifeBuoy, label: "Help & Support", desc: "We're here for you" },
  { id: "language", icon: Languages, label: "Language", desc: "English (India)" },
];

const user = {
  fullName: "Aditya Semalti",
  email: "aditya.semalti@gmail.com",
  phone: "+91 9876543210",

  sunSign: "Libra",
  moonSign: "Cancer",
  risingSign: "Scorpio",

  walletBalance: 2500,

  gender: "Male",
  dateOfBirth: "2001-10-18",
  timeOfBirth: "08:45 AM",
  placeOfBirth: "Dehradun, Uttarakhand",

  profileImage: "",

  consultations: 12,
  orders: 8,
  reports: 15,

  membership: "Premium",
  language: "English",
};

export default function ProfileDashboard() {
    const navigate = useNavigate();
  return (
    <div className="space-y-8">
      {/* Identity hero */}
      <motion.div
        custom={0}
        variants={fadeUp}
        initial="hidden"
        animate="show"
        className="rounded-3xl bg-white border border-purple-100 shadow-xl p-9 flex flex-col md:flex-row md:items-center gap-8"
      >
        <div className="relative shrink-0 mx-auto md:mx-0">
          <div className="h-28 w-28 rounded-full bg-gradient-to-br from-purple-100 to-white border-4 border-white shadow-lg flex items-center justify-center text-3xl font-serif font-bold text-purple-700">
            {user.fullName.split(" ").map((n) => n[0]).join("").slice(0, 2)}
          </div>
          <div className="absolute -bottom-1 -right-1 h-9 w-9 rounded-full bg-gradient-to-br from-amber-300 to-yellow-400 border-4 border-white flex items-center justify-center shadow-md">
            <Sparkles size={13} className="text-white" />
          </div>
        </div>

        <div className="flex-1 text-center md:text-left">
          <h2 className="text-2xl font-serif font-bold text-slate-950">{user.fullName}</h2>
          <p className="text-sm text-slate-500 mt-1">{user.email}</p>

          <div className="flex flex-wrap justify-center md:justify-start gap-2 mt-4">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-purple-50 text-purple-700 text-xs font-semibold px-3 py-1.5">
              <Sun size={13} /> {user.sunSign} Sun
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 text-amber-700 text-xs font-semibold px-3 py-1.5">
              <Moon size={13} /> {user.moonSign} Moon
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-sky-50 text-sky-700 text-xs font-semibold px-3 py-1.5">
              <ArrowUpRight size={13} /> {user.risingSign} Rising
            </span>
          </div>
        </div>

        <button
          type="button"
            onClick={() => navigate("/dashboard/profile/edit")}
          className="shrink-0 rounded-xl border border-purple-200 text-purple-700 text-sm font-semibold px-5 py-2.5 hover:bg-purple-50 transition-colors"
        >
          Edit Profile
        </button>
      </motion.div>

      {/* Wallet + quick stat row */}
      <motion.div
        custom={1}
        variants={fadeUp}
        initial="hidden"
        animate="show"
        className="grid md:grid-cols-3 gap-6"
      >
        <div className="md:col-span-2 rounded-3xl bg-gradient-to-r from-purple-700 to-violet-800 shadow-xl p-8 flex items-center justify-between text-white overflow-hidden relative">
          <div className="absolute -right-6 -top-6 h-32 w-32 rounded-full bg-white/10 blur-2xl" />
          <div className="relative">
            <p className="text-xs uppercase tracking-[3px] text-purple-200">Wallet Balance</p>
            <p className="text-4xl font-serif font-bold mt-2">
              &#8377;{user.walletBalance.toLocaleString("en-IN")}
            </p>
          </div>
          <button
            type="button"
            className="relative rounded-xl bg-white text-purple-800 text-sm font-bold px-6 py-3 hover:bg-purple-50 transition-colors shadow-lg"
          >
            + Recharge
          </button>
        </div>

        <div className="rounded-3xl bg-white border border-purple-100 shadow-lg p-7 flex flex-col justify-center">
          <p className="text-xs uppercase tracking-[2px] text-slate-400 font-semibold">Next Session</p>
          <p className="text-lg font-serif font-bold text-slate-950 mt-2">Oct 24, 4:30 PM</p>
          <p className="text-sm text-slate-500 mt-1">with Dr. Ananya Sharma</p>
          <button
            type="button"
            onClick={() => navigate("/dashboard/consultations")}
            className="mt-4 text-sm font-semibold text-purple-700 hover:text-purple-800 flex items-center gap-1 transition-colors"
          >
            View details <ChevronRight size={15} />
          </button>
        </div>
      </motion.div>

      {/* Astro services */}
      <motion.div custom={2} variants={fadeUp} initial="hidden" animate="show">
        <h3 className="text-sm font-semibold text-slate-700 mb-4">Astro Services</h3>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {SERVICES.map((s) => (
            <motion.button
              key={s.id}
              type="button"
              onClick={() => navigate('/dashboard/settings')}
              whileHover={{ y: -4, scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              className="text-left rounded-2xl bg-white border border-purple-100 shadow-md hover:shadow-xl p-6 flex items-start gap-4 transition-shadow"
            >
              <div className="h-11 w-11 rounded-xl bg-purple-50 flex items-center justify-center shrink-0">
                <s.icon size={19} className="text-purple-600" />
              </div>
              <div className="min-w-0">
                <p className="font-semibold text-slate-900">{s.label}</p>
                <p className="text-xs text-slate-500 mt-1">{s.desc}</p>
              </div>
            </motion.button>
          ))}
        </div>
      </motion.div>
    </div>
  );
}