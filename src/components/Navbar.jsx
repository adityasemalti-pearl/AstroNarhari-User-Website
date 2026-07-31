import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  User,
  Wallet,
  Calendar,
  Settings,
  LogOut,
  ChevronDown,
  CalendarCheck,
  GitGraph,
  Wallet2,
  ShoppingBag
} from "lucide-react";

export default function Navbar({ activeNav, setActiveNav }) {

  const [showProfile, setShowProfile] = React.useState(false);

  const menu = [
    {
      name: "Home",
      link: "/dashboard"
    },
    {
      name: "Horoscope",
      link: "/dashboard/horoscope"
    },
    // {
    //   name: "Live Astrologers",
    //   link: "/dashboard/astrologers"
    // },
    {
      name: "About Us",
      link: "/dashboard/about"
    },
    {
      name: "Cosmic Shop",
      link: "/dashboard/cosmic"
    },
    {
      name: "Livestream",
      link: "/dashboard/live"
    },

  ]

  const navigate = useNavigate()
  const location = useLocation();


  const options = [
    {
      icon: <User size={18} />,
      label: "My Profile",
      link: "/dashboard/profile"
    },
    {
      icon: <GitGraph size={18} />,
      label: "Generate kundali",
      link: "/dashboard/kundali"
    },
    {
      icon: <CalendarCheck size={18} />,
      label: "My Bookings",
      link: "/dashboard/my-bookings"
    },
     {
      icon: <Wallet2 size={18} />,
      label: "My Wallet",
      link: "/dashboard/my-wallet"
    },
    // {
    //   icon: <Settings size={18} />,
    //   label: "Settings",
    //   link: "/dashboard/settings"

    // },
    {
      icon: <ShoppingBag size={18} />,
      label: "My Cart",
      link: "/dashboard/cart"

    },
  ]

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-purple-100/60 shadow-sm transition-all">
      <div className="max-w-7xl mx-auto px-8 h-20 flex items-center justify-between">

        {/* Logo */}
        <div className="flex items-center gap-3 cursor-pointer">
          <div className="w-10 h-10 rounded-full bg-[#4A1E5C] text-amber-300 flex items-center justify-center font-serif text-xl font-bold shadow-md shadow-purple-900/20">
            ☾
          </div>
          <div>
            <span
              className="text-xl font-serif font-bold tracking-[0.25em] text-[#4A1E5C] uppercase block"
              style={{ fontFamily: "'Cinzel', Georgia, serif" }}
            >
              Astronarhari
            </span>
            <span className="text-[9px] font-semibold tracking-[0.22em] text-[#C68E28] uppercase">
              Guidance From The Stars
            </span>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center gap-8">
          {menu.map((item) => {

            const isActive = activeNav == item.name;

            return (
              <button
                key={item.name}
                onClick={() => { navigate(item.link); setActiveNav(item.name) }}
                className={`relative text-sm font-medium py-2 ${isActive
                  ? "text-[#4A1E5C] font-semibold "
                  : "text-slate-500 hover:text-purple-900"
                  }`}
              >
                {item.name}

                {isActive && (
                  <motion.div
                    layoutId="navIndicator"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#E2B142] rounded-full"
                  />
                )}
              </button>
            );
          })}
        </nav>

        {/* Action / Profile CTA */}
        <div className="flex items-center gap-4">
          <button className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-[#4A1E5C] bg-purple-50 hover:bg-purple-100 transition-colors">
            <span> Wallet: ₹500</span>
          </button>

          <div
            className="relative flex items-center gap-3 pl-4 border-l border-slate-200"
            onMouseEnter={() => setShowProfile(true)}
            onMouseLeave={() => setShowProfile(false)}
          >
            <div className="flex items-center gap-2 cursor-pointer">
              <img
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80"
                alt="User"
                className="w-10 h-10 rounded-full object-cover ring-2 ring-[#E2B142]/60"
              />
            </div>

            <AnimatePresence>
              {showProfile && (
                <motion.div
                  initial={{ opacity: 0, y: 15, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  transition={{ duration: 0.25 }}
                  className="absolute right-0 top-14 w-72 overflow-hidden rounded-3xl bg-white shadow-2xl border border-purple-100"
                >
                  {/* Top */}
                  <div className="bg-gradient-to-r from-[#4A1E5C] to-[#7B3FA6] p-5 text-white">
                    <div className="flex items-center gap-3">
                      <img
                        src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80"
                        className="w-14 h-14 rounded-full border-2 border-white"
                      />

                      <div>
                        <h3 className="font-semibold text-lg">Aditya Semalti</h3>
                        <p className="text-sm text-purple-100">
                          aditya@email.com
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Menu */}
                  <div className="py-2">
                    {options.map((item) => (
                      <button
                      onClick={()=>navigate(item.link)}
                        key={item.label}
                        className="w-full flex items-center gap-3 px-5 py-3 hover:bg-purple-50 transition-all text-[#4A1E5C]"
                      >
                        <div className="w-9 h-9 rounded-xl bg-purple-100 flex items-center justify-center">
                          {item.icon}
                        </div>

                        <span className="font-medium">{item.label}</span>
                      </button>
                    ))}

                    <div className="border-t my-2"></div>

                    <button className="w-full flex items-center gap-3 px-5 py-3 hover:bg-red-50 text-red-500 transition-all">
                      <div className="w-9 h-9 rounded-xl bg-red-100 flex items-center justify-center">
                        <LogOut size={18} />
                      </div>

                      <span className="font-medium">Logout</span>
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

      </div>
    </header>
  );
}