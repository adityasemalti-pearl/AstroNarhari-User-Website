import React, { useEffect, useState } from "react";
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
import { getUserProfile } from "../../API/authapis";
import Loader from "../../components/Loader";

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




export default function ProfileDashboard() {
  const navigate = useNavigate();

  const [loading,setLoading] = useState(false)

  const [user, setUser] = useState({});
  const fetchProfile = async () => {
    try {
      setLoading(true)
      const res = await getUserProfile()
      setUser(res.data.data)
      setLoading(false)
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    fetchProfile()
  }, [])


  if(loading){
    return (
      <Loader/>
    )
  }
  return (
    <div className="space-y-8 my-10">
      {/* Identity hero */}
      <motion.div
        custom={0}
        variants={fadeUp}
        initial="hidden"
        animate="show"
        className="rounded-3xl bg-white border border-purple-100 shadow-xl p-9 flex flex-col md:flex-row md:items-center gap-8"
      >
        <div className="relative shrink-0 mx-auto md:mx-0">
          <div className="h-28 w-28 rounded-full bg-gradient-to-br from-purple-100 to-white border-4 border-white shadow-lg flex items-center justify-center">
            <img
              src={user?.profilePic || "data:image/jpeg;base64,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"}
              alt="logo"
              className="h-full w-full object-cover"
            />
          </div>
          <div className="absolute -bottom-1 -right-1 h-9 w-9 rounded-full bg-gradient-to-br from-amber-300 to-yellow-400 border-4 border-white flex items-center justify-center shadow-md">
            <Sparkles size={13} className="text-white" />
          </div>
        </div>

        <div className="flex-1 text-center md:text-left">
          <h2 className="text-2xl font-serif font-bold text-slate-950">
            {user?.fullName || user?.name || "N/A"}
          </h2>

          <p className="text-sm text-slate-500 mt-1">
            {user?.email || user?.mobile || "No email available"}
          </p>

          <div className="flex flex-wrap justify-center md:justify-start gap-2 mt-4">
            <div className="flex flex-wrap justify-center md:justify-start gap-2 mt-4">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-purple-50 text-purple-700 text-xs font-semibold px-3 py-1.5">
                <Sun size={13} /> {user?.zodiac || "N/A"}
              </span>

              <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 text-amber-700 text-xs font-semibold px-3 py-1.5">
                <Moon size={13} /> {user?.gender || "N/A"}
              </span>

              <span className="inline-flex items-center gap-1.5 rounded-full bg-sky-50 text-sky-700 text-xs font-semibold px-3 py-1.5">
                <ArrowUpRight size={13} /> {user?.placeOfBirth || "N/A"}
              </span>
            </div>
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
              ₹{Number(user?.walletBalance || 0).toLocaleString("en-IN")}
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