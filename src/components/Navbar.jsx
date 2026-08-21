import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  User,
  LogOut,
  CalendarCheck,
  GitGraph,
  Wallet2,
  ShoppingCartIcon,
  ShoppingBag,X,
  PackageCheck,
  MessageCircle
} from "lucide-react";
import { getUserProfile } from "../API/authapis";
import {getCart} from '../API/cosmicApis'
import { myWallet } from "../API/bookingApis";

export default function Navbar({ activeNav, setActiveNav }) {
  const [showProfile, setShowProfile] = React.useState(false);
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);

  const [showLogoutPopup, setShowLogoutPopup] = useState(false);



  const [user, setUser] = useState();


  const fetchCart = async () => {
    try {

      setLoading(true);

      const res = await getCart();

      if (res.data.success) {
        setCartItems(res.data.data.items);
      }

    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUser = async () => {
    try {
      const res = await getUserProfile()
      setUser(res.data.data)

    } catch (error) {
      console.log(error);
    }
  };

  const handleLogout = () => {
  setShowLogoutPopup(true);
};

const confirmLogout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");

  setShowLogoutPopup(false);
  navigate("/login");
};

const cancelLogout = () => {
  setShowLogoutPopup(false);
};

const [balance,setBalance] = useState(null)


const fetchWallet = async()=>{
  try {
    const res = await myWallet()
    setBalance(res.data.walletBalance)
  } catch (error) {
    console.log(error)
  }
}



  useEffect(() => {
    fetchWallet();
    fetchUser();
    fetchCart();
  }, []);

  const menu = [
    {
      name: "Home",
      link: "/dashboard",
    },
    {
      name: "Horoscope",
      link: "/dashboard/horoscope",
    },
    // {
    //   name: "Live Astrologers",
    //   link: "/dashboard/astrologers"
    // },
    // {
    //   name: "About Us",
    //   link: "/dashboard/about"
    // },
    {
      name: "Cosmic Shop",
      link: "/dashboard/cosmic",
    },
    {
      name: "Livestream",
      link: "/dashboard/live",
    },
  ];

  const navigate = useNavigate();
  const location = useLocation();

  const options = [
    {
      icon: <User size={18} />,
      label: "My Profile",
      link: "/dashboard/profile-overview",
    },
    {
      icon: <GitGraph size={18} />,
      label: "Generate kundali",
      link: "/dashboard/kundali",
    },
    {
      icon: <CalendarCheck size={18} />,
      label: "My Bookings",
      link: "/dashboard/my-bookings",
    },
    {
      icon: <Wallet2 size={18} />,
      label: "My Wallet",
      link: "/dashboard/my-wallet",
    },
    // {
    //   icon: <Settings size={18} />,
    //   label: "Settings",
    //   link: "/dashboard/settings"

    // },
    {
      icon: <MessageCircle size={18} />,
      label: "My Chats",
      link: "/dashboard/chat-list"
    },
    {
      icon: <PackageCheck size={18} />,
      label: "My Orders",
      link: "/dashboard/orders"
    },
  ];

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
              Namah Astro
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
                onClick={() => {
                  navigate(item.link);
                  setActiveNav(item.name);
                }}
                className={`relative text-sm font-medium py-2 ${
                  isActive
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
          <div
            onClick={() => navigate("/dashboard/cart")}
            className="relative cursor-pointer hover:scale-105 duration-200">
            <ShoppingCartIcon className="w-6 h-6 text-gray-700" />

            <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-semibold text-white">
              {cartItems.length}
            </span>
          </div>

          <button
            onClick={() => navigate("/dashboard/wallet")}
            className="hidden sm:flex cursor-pointer items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-[#4A1E5C] bg-purple-50 hover:bg-purple-100 transition-colors">
            <span> Wallet: ₹ {balance}</span>
          </button>

          <div
            className="relative flex items-center gap-3 pl-4 border-l border-slate-200"
            onMouseEnter={() => setShowProfile(true)}
            onMouseLeave={() => setShowProfile(false)}
          >
            <div className="flex items-center gap-2 cursor-pointer">
              <img
              src={user?.profilePic || "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSlbbdPqXU3wwsJQPwkgU42saoIIg22ct8rNcFV_RU6PA&s=10"}
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
                        src={user?.profilePic || "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSlbbdPqXU3wwsJQPwkgU42saoIIg22ct8rNcFV_RU6PA&s=10"}
                        className="w-14 h-14 rounded-full border-2 border-white"
                      />

                      <div>
                        <h3 className="font-semibold text-lg">
                         {user?.fullName}
                        </h3>
                        <p className="text-sm text-purple-100">
                          {user?.email}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Menu */}
                  <div className="py-2">
                    {options.map((item) => (
                      <button
                        onClick={() => navigate(item.link)}
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

                    <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-5 py-3 hover:bg-red-50 text-red-500 transition-all">
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
      {showLogoutPopup && (
  <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
    <div className="relative w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl">

      {/* Close */}
      <button
        onClick={cancelLogout}
        className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full text-gray-400 transition hover:bg-purple-50 hover:text-purple-600"
      >
        <X size={18} />
      </button>

      {/* Icon */}
      <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-purple-100">
        <LogOut className="text-purple-600" size={26} />
      </div>

      {/* Content */}
      <div className="text-center">
        <h2 className="text-xl font-bold text-gray-900">
          Confirm Logout
        </h2>

        <p className="mt-2 text-sm text-gray-500">
          Are you sure you want to logout from your account?
        </p>
      </div>

      {/* Buttons */}
      <div className="mt-6 flex gap-3">
        <button
          onClick={cancelLogout}
          className="flex-1 rounded-xl border border-gray-200 bg-white px-4 py-3 font-semibold text-gray-700 transition hover:bg-gray-50"
        >
          Cancel
        </button>

        <button
          onClick={confirmLogout}
          className="flex-1 rounded-xl bg-purple-600 px-4 py-3 font-semibold text-white shadow-lg shadow-purple-200 transition hover:bg-purple-700"
        >
          Logout
        </button>
      </div>
    </div>
  </div>
)}
    </header>
  );
}
