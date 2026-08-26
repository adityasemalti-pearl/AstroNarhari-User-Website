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
  X,
  PackageCheck,
  MessageCircle,
  Menu,
} from "lucide-react";

import { getUserProfile } from "../API/authapis";
import { getCart } from "../API/cosmicApis";
import { myWallet } from "../API/bookingApis";

export default function Navbar({ activeNav, setActiveNav }) {
  const navigate = useNavigate();
  const location = useLocation();

  const [showProfile, setShowProfile] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showLogoutPopup, setShowLogoutPopup] = useState(false);

  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);
  const [balance, setBalance] = useState(null);

  const fetchCart = async () => {
    try {
      setLoading(true);

      const res = await getCart();

      if (res.data.success) {
        setCartItems(res.data.data.items || []);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUser = async () => {
    try {
      const res = await getUserProfile();
      setUser(res.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchWallet = async () => {
    try {
      const res = await myWallet();
      setBalance(res.data.walletBalance);
    } catch (error) {
      console.log(error);
    }
  };

  const handleLogout = () => {
    setShowProfile(false);
    setShowMobileMenu(false);
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

  const menu = [
    {
      name: "Home",
      link: "/dashboard",
    },
    {
      name: "Horoscope",
      link: "/dashboard/horoscope",
    },
    {
      name: "Cosmic Shop",
      link: "/dashboard/cosmic",
    },
    {
      name: "Livestream",
      link: "/dashboard/live",
    },
  ];

  const options = [
    {
      icon: <User size={18} />,
      label: "My Profile",
      link: "/dashboard/profile-overview",
    },
    {
      icon: <GitGraph size={18} />,
      label: "Generate Kundali",
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
    {
      icon: <MessageCircle size={18} />,
      label: "My Chats",
      link: "/dashboard/chat-list",
    },
    {
      icon: <PackageCheck size={18} />,
      label: "My Orders",
      link: "/dashboard/orders",
    },
  ];

  const handleNavigation = (item) => {
    navigate(item.link);
    setActiveNav(item.name);
    setShowMobileMenu(false);
    setShowProfile(false);
  };

  useEffect(() => {
    fetchWallet();
    fetchUser();
    fetchCart();
  }, []);

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b border-purple-100/60 bg-white/90 shadow-sm backdrop-blur-xl">
        <div className="mx-auto flex h-[68px] w-full max-w-7xl items-center justify-between px-4 sm:h-20 sm:px-6 lg:px-8">

          {/* ================= LOGO ================= */}
          <div
            onClick={() => navigate("/dashboard")}
            className="flex min-w-0 cursor-pointer items-center gap-2 sm:gap-3"
          >
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#4A1E5C] text-lg font-bold text-amber-300 shadow-md shadow-purple-900/20 sm:h-10 sm:w-10 sm:text-xl">
              ☾
            </div>

            <div className="min-w-0">
              <span
                className="block truncate text-[15px] font-bold uppercase tracking-[0.14em] text-[#4A1E5C] sm:text-xl sm:tracking-[0.25em]"
                style={{
                  fontFamily: "'Cinzel', Georgia, serif",
                }}
              >
                Namah Astro
              </span>

              <span className="hidden text-[9px] font-semibold uppercase tracking-[0.18em] text-[#C68E28] sm:block sm:tracking-[0.22em]">
                Guidance From The Stars
              </span>
            </div>
          </div>

          {/* ================= DESKTOP NAV ================= */}
          <nav className="hidden items-center gap-6 md:flex lg:gap-8">
            {menu.map((item) => {
              const isActive = activeNav === item.name;

              return (
                <button
                  key={item.name}
                  onClick={() => handleNavigation(item)}
                  className={`relative py-2 text-sm font-medium transition-colors ${
                    isActive
                      ? "font-semibold text-[#4A1E5C]"
                      : "text-slate-500 hover:text-purple-900"
                  }`}
                >
                  {item.name}

                  {isActive && (
                    <motion.div
                      layoutId="navIndicator"
                      className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full bg-[#E2B142]"
                    />
                  )}
                </button>
              );
            })}
          </nav>

          {/* ================= RIGHT ACTIONS ================= */}
          <div className="flex items-center gap-2 sm:gap-4">

            {/* CART */}
            <button
              onClick={() => navigate("/dashboard/cart")}
              className="relative flex h-9 w-9 items-center justify-center rounded-full transition hover:bg-purple-50 sm:h-10 sm:w-10"
            >
              <ShoppingCartIcon className="h-5 w-5 text-gray-700 sm:h-6 sm:w-6" />

              {cartItems.length > 0 && (
                <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[9px] font-bold text-white sm:-right-1 sm:-top-1 sm:h-5 sm:min-w-5 sm:text-xs">
                  {cartItems.length}
                </span>
              )}
            </button>

            {/* WALLET DESKTOP */}
            <button
              onClick={() => navigate("/dashboard/wallet")}
              className="hidden items-center gap-2 rounded-xl bg-purple-50 px-3 py-2 text-xs font-semibold text-[#4A1E5C] transition-colors hover:bg-purple-100 sm:flex lg:px-4"
            >
              <Wallet2 size={16} />
              <span>
                Wallet: ₹ {balance ?? 0}
              </span>
            </button>

            {/* PROFILE */}
            <div className="relative">

              <button
                onClick={() => {
                  setShowProfile((prev) => !prev);
                  setShowMobileMenu(false);
                }}
                className="flex items-center gap-2 rounded-full p-1 transition hover:bg-purple-50"
              >
                <img
                  src={
                    user?.profilePic ||
                    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSlbbdPqXU3wwsJQPwkgU42saoIIg22ct8rNcFV_RU6PA&s=10"
                  }
                  alt="User"
                  className="h-9 w-9 rounded-full object-cover ring-2 ring-[#E2B142]/60 sm:h-10 sm:w-10"
                />
              </button>

              {/* DESKTOP / PROFILE DROPDOWN */}
              <AnimatePresence>
                {showProfile && (
                  <motion.div
                    initial={{
                      opacity: 0,
                      y: 10,
                      scale: 0.97,
                    }}
                    animate={{
                      opacity: 1,
                      y: 0,
                      scale: 1,
                    }}
                    exit={{
                      opacity: 0,
                      y: 10,
                      scale: 0.97,
                    }}
                    className="absolute right-0 top-12 z-[100] w-[calc(100vw-24px)] max-w-[340px] overflow-hidden rounded-2xl border border-purple-100 bg-white shadow-2xl sm:top-14 sm:w-72 sm:rounded-3xl"
                  >

                    {/* PROFILE HEADER */}
                    <div className="bg-gradient-to-r from-[#4A1E5C] to-[#7B3FA6] p-4 text-white sm:p-5">
                      <div className="flex items-center gap-3">
                        <img
                          src={
                            user?.profilePic ||
                            "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSlbbdPqXU3wwsJQPwkgU42saoIIg22ct8rNcFV_RU6PA&s=10"
                          }
                          alt="User"
                          className="h-12 w-12 shrink-0 rounded-full border-2 border-white object-cover sm:h-14 sm:w-14"
                        />

                        <div className="min-w-0">
                          <h3 className="truncate text-base font-semibold sm:text-lg">
                            {user?.fullName || "User"}
                          </h3>

                          <p className="truncate text-xs text-purple-100 sm:text-sm">
                            {user?.email || ""}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* MOBILE WALLET */}
                    <button
                      onClick={() => {
                        navigate("/dashboard/wallet");
                        setShowProfile(false);
                      }}
                      className="flex w-full items-center gap-3 border-b border-gray-100 px-4 py-3 text-left sm:hidden"
                    >
                      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-purple-100 text-[#4A1E5C]">
                        <Wallet2 size={18} />
                      </div>

                      <div>
                        <p className="text-xs text-gray-400">
                          Wallet Balance
                        </p>

                        <p className="font-semibold text-[#4A1E5C]">
                          ₹ {balance ?? 0}
                        </p>
                      </div>
                    </button>

                    {/* MENU */}
                    <div className="max-h-[55vh] overflow-y-auto py-2">
                      {options.map((item) => (
                        <button
                          key={item.label}
                          onClick={() => {
                            navigate(item.link);
                            setShowProfile(false);
                          }}
                          className="flex w-full items-center gap-3 px-4 py-3 text-left text-[#4A1E5C] transition hover:bg-purple-50 sm:px-5"
                        >
                          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-purple-100">
                            {item.icon}
                          </div>

                          <span className="text-sm font-medium">
                            {item.label}
                          </span>
                        </button>
                      ))}

                      <div className="my-2 border-t" />

                      <button
                        onClick={handleLogout}
                        className="flex w-full items-center gap-3 px-4 py-3 text-left text-red-500 transition hover:bg-red-50 sm:px-5"
                      >
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-red-100">
                          <LogOut size={18} />
                        </div>

                        <span className="text-sm font-medium">
                          Logout
                        </span>
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* MOBILE MENU BUTTON */}
            <button
              onClick={() => {
                setShowMobileMenu((prev) => !prev);
                setShowProfile(false);
              }}
              className="flex h-9 w-9 items-center justify-center rounded-full text-[#4A1E5C] transition hover:bg-purple-50 md:hidden"
            >
              {showMobileMenu ? (
                <X size={22} />
              ) : (
                <Menu size={22} />
              )}
            </button>
          </div>
        </div>

        {/* ================= MOBILE NAV ================= */}
        <AnimatePresence>
          {showMobileMenu && (
            <motion.div
              initial={{
                opacity: 0,
                height: 0,
              }}
              animate={{
                opacity: 1,
                height: "auto",
              }}
              exit={{
                opacity: 0,
                height: 0,
              }}
              className="overflow-hidden border-t border-purple-100 bg-white md:hidden"
            >
              <div className="px-4 pb-4 pt-2">

                {menu.map((item) => {
                  const isActive = activeNav === item.name;

                  return (
                    <button
                      key={item.name}
                      onClick={() => handleNavigation(item)}
                      className={`flex w-full items-center justify-between rounded-xl px-4 py-3 text-left text-sm font-medium transition ${
                        isActive
                          ? "bg-purple-50 font-semibold text-[#4A1E5C]"
                          : "text-slate-600 hover:bg-purple-50"
                      }`}
                    >
                      <span>{item.name}</span>

                      {isActive && (
                        <span className="h-2 w-2 rounded-full bg-[#E2B142]" />
                      )}
                    </button>
                  );
                })}

                {/* MOBILE WALLET */}
                <button
                  onClick={() => {
                    navigate("/dashboard/wallet");
                    setShowMobileMenu(false);
                  }}
                  className="mt-2 flex w-full items-center justify-between rounded-xl bg-purple-50 px-4 py-3 text-sm font-semibold text-[#4A1E5C]"
                >
                  <div className="flex items-center gap-3">
                    <Wallet2 size={18} />
                    <span>Wallet</span>
                  </div>

                  <span>₹ {balance ?? 0}</span>
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* ================= LOGOUT POPUP ================= */}
      <AnimatePresence>
        {showLogoutPopup && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 px-4 backdrop-blur-sm"
          >
            <motion.div
              initial={{
                opacity: 0,
                scale: 0.95,
                y: 10,
              }}
              animate={{
                opacity: 1,
                scale: 1,
                y: 0,
              }}
              className="relative w-full max-w-sm rounded-2xl bg-white p-5 shadow-2xl sm:p-6"
            >
              {/* CLOSE */}
              <button
                onClick={cancelLogout}
                className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full text-gray-400 transition hover:bg-purple-50 hover:text-purple-600 sm:right-4 sm:top-4"
              >
                <X size={18} />
              </button>

              {/* ICON */}
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-purple-100">
                <LogOut
                  className="text-purple-600"
                  size={26}
                />
              </div>

              {/* CONTENT */}
              <div className="text-center">
                <h2 className="text-lg font-bold text-gray-900 sm:text-xl">
                  Confirm Logout
                </h2>

                <p className="mt-2 text-sm leading-5 text-gray-500">
                  Are you sure you want to logout from your account?
                </p>
              </div>

              {/* BUTTONS */}
              <div className="mt-6 flex gap-3">
                <button
                  onClick={cancelLogout}
                  className="flex-1 rounded-xl border border-gray-200 bg-white px-3 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
                >
                  Cancel
                </button>

                <button
                  onClick={confirmLogout}
                  className="flex-1 rounded-xl bg-purple-600 px-3 py-3 text-sm font-semibold text-white shadow-lg shadow-purple-200 transition hover:bg-purple-700"
                >
                  Logout
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}