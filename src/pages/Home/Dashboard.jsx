import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { getAllAstrologers, getDailyHoroscope } from "../../API/homeApis";
import { useNavigate } from "react-router-dom";
import { getAllProducts, getCosmicInsights } from "../../API/cosmicApis";
import FullPageLoader from "./comp/FullPageLoader";
import AstrologerModal from "../../Models/AstrologerModal";
import BookAppointmentPopup from "./comp/BookingPopup";
import { myWallet } from "../../API/bookingApis";
import BookingConfirmedPopup from "./comp/BookingConfirmedPopup";

const SERVICES = [
  {
    id: "kundli",
    title: "Kundli Matching",
    subtitle: "Detailed birth chart analysis",
    icon: "✨",
    badge: "Popular",
    link: "/dashboard/kundali",
    bg: "from-amber-500/10 to-purple-500/10",
  },
  {
    id: "horoscope",
    title: "Daily Horoscope",
    subtitle: "Personalized planetary insights",
    icon: "📅",
    link: "/dashboard/horoscope",
    bg: "from-purple-500/10 to-indigo-500/10",
  },
];

const DUMMY_BANNERS = [
  {
    id: 1,
    image:
      "https://images.unsplash.com/photo-1532693322450-2cb5c511067d?w=1600&auto=format&fit=crop&q=80",
  },
  {
    id: 2,
    image:
      "https://images.unsplash.com/photo-1614728894747-a83421e2b9c9?w=1600&auto=format&fit=crop&q=80",
  },
  {
    id: 3,
    image:
      "https://images.unsplash.com/photo-1515377905703-c4788e51af15?w=1600&auto=format&fit=crop&q=80",
  },
];

export default function Dashboard() {
  const [dailyHoroscope, setDailyHoroscope] = useState(null);
  const [astrologers, setAstrologers] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [insights, setInsights] = useState([]);
  const [banners, setBanners] = useState(DUMMY_BANNERS);
  const [currentSlide, setCurrentSlide] = useState(0);

  const [astroSlide, setAstroSlide] = useState(0);
  const [insightSlide, setInsightSlide] = useState(0);
  const [selectedAstrologer, setSelectedAstrologer] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [confirmedBooking, setConfirmedBooking] = useState(null);
  const [isBookingConfirmedOpen, setIsBookingConfirmedOpen] = useState(false);

  const [walletBalance, setWalletBalance] = useState(null);

  const navigate = useNavigate();

  const fetchWallet = async () => {
    try {
      const res = await myWallet();

      console.log("🔥 FULL WALLET RESPONSE:", res);
      console.log("🔥 WALLET DATA:", res.data);
      console.log("🔥 WALLET BALANCE:", res.data?.walletBalance);

      const balance = Number(res.data?.walletBalance) || 0;

      setWalletBalance(balance);

      // Optional: keep localStorage in sync
      localStorage.setItem("walletBalance", balance);
    } catch (error) {
      console.log("❌ Wallet Error:", error);
      setWalletBalance(0);
    }
  };

  useEffect(() => {
    if (banners.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % banners.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [banners.length]);

  useEffect(() => {
    if (astrologers.length <= 1) return;
    const timer = setInterval(() => {
      setAstroSlide((prev) => (prev + 1) % astrologers.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [astrologers.length]);

  useEffect(() => {
    if (insights.length <= 1) return;
    const timer = setInterval(() => {
      setInsightSlide((prev) => (prev + 1) % insights.length);
    }, 4500);
    return () => clearInterval(timer);
  }, [insights.length]);

  useEffect(() => {
    const fetchHoroscope = async () => {
      try {
        const res = await getDailyHoroscope();
        setDailyHoroscope(res?.data?.data);
      } catch (error) {
        console.error("Failed to fetch horoscope:", error);
      }
    };

    fetchHoroscope();
  }, []);

  const fetchAllAstrologers = async () => {
    try {
      const res = await getAllAstrologers();
      if (res.success) {
        const onlineAstrologers = res.data.filter((item) => item.isOnline);
        setAstrologers(onlineAstrologers);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const fetchAllProducts = async () => {
    try {
      setLoading(true);
      const res = await getAllProducts();
      setProducts(res.data?.data.slice(0, 3) || []);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchInsights = async () => {
    try {
      const res = await getCosmicInsights();
      setInsights(res.data?.data.slice(0, 3) || []);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchAllProducts();
    fetchAllAstrologers();
    fetchInsights();
    fetchWallet();
  }, []);

  const handleOpenModal = (astro) => {
    console.log("🔥 ASTRO FROM DASHBOARD:", astro);
    console.log("🔥 ASTRO ID:", astro?._id);
    console.log("🔥 ASTRO MIN RATE:", astro?.minRate);
    setSelectedAstrologer(astro);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setSelectedAstrologer(null);
    setIsModalOpen(false);
  };

  const handleConnectNow = () => {
    console.log("🔥 SELECTED ASTRO BEFORE BOOKING:", selectedAstrologer);
    console.log("🔥 SELECTED ASTRO MIN RATE:", selectedAstrologer?.minRate);
    console.log("🔥 SELECTED ASTRO ID:", selectedAstrologer?._id);
    setIsModalOpen(false);
    setIsBookingOpen(true);
  };

  const handleCloseBooking = () => {
    setIsBookingOpen(false);
  };

  const handleProceedToPayment = (bookingData) => {
    console.log("🔥 BOOKING SUCCESS DATA:", bookingData);

    const minimumRate =
      Number(bookingData?.minRate) ||
      Number(bookingData?.fee) ||
      Number(selectedAstrologer?.minRate) ||
      0;

    const currentBalance = Number(walletBalance) || 0;

    console.log("🔥 WALLET BALANCE:", currentBalance);
    console.log("🔥 MINIMUM RATE:", minimumRate);

    // Insufficient wallet balance
    if (currentBalance < minimumRate) {
      console.log("❌ INSUFFICIENT BALANCE");

      setIsBookingOpen(false);
      navigate("/dashboard/wallet");
      return;
    }

    // Schedule API successful
    console.log("✅ BOOKING SUCCESSFUL - SHOWING CONFIRMATION POPUP");

    setConfirmedBooking(bookingData);
    setIsBookingOpen(false);
    setIsBookingConfirmedOpen(true);
  };

  if (loading) {
    return <FullPageLoader />;
  }

  return (
    <div className="min-h-screen bg-[#FAF8FC] text-slate-800 font-sans antialiased selection:bg-purple-200 selection:text-purple-950 overflow-x-hidden">
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute -top-40 -left-40 w-[600px] h-[600px] bg-purple-200/40 rounded-full blur-[120px]" />
        <div className="absolute top-1/3 -right-40 w-[500px] h-[500px] bg-amber-100/50 rounded-full blur-[140px]" />
      </div>

      <div className="w-full relative shadow-xl">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="relative w-full h-[280px] sm:h-[400px] md:h-[480px] bg-[#2B0C39] overflow-hidden"
        >
          {banners.length > 0 && (
            <div className="relative w-full h-full">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentSlide}
                  initial={{ opacity: 0, scale: 1.05 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.8 }}
                  className="absolute inset-0 w-full h-full"
                >
                  <img
                    src={banners[currentSlide]?.image}
                    alt="Banner Slide"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                </motion.div>
              </AnimatePresence>

              <div className="absolute bottom-6 left-0 right-0 flex justify-center items-center gap-2.5 z-20">
                {banners.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentSlide(idx)}
                    className={`h-2 rounded-full transition-all duration-300 ${currentSlide === idx ? "w-10 bg-amber-300" : "w-2.5 bg-white/50 hover:bg-white/80"}`}
                  />
                ))}
              </div>
            </div>
          )}
        </motion.div>
      </div>

      <main className="relative z-10 w-full px-4 sm:px-6 lg:px-10 py-10">
        <section className="space-y-6">
          <div className="flex items-end justify-between">
            <div>
              <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#2D123A]">
                Cosmic Services
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Unlock answers through authentic ancient Vedic practices.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-4xl">
            {SERVICES.map((service) => (
              <motion.div
                onClick={() => navigate(service.link)}
                key={service.id}
                whileHover={{ y: -6, scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                transition={{ duration: 0.2 }}
                className={`bg-gradient-to-br ${service.bg} bg-white p-8 rounded-3xl border border-purple-100 shadow-xl shadow-purple-950/5 hover:shadow-2xl hover:shadow-purple-950/15 transition-all cursor-pointer group relative overflow-hidden flex flex-col justify-between`}
              >
                <div className="absolute -right-6 -bottom-6 w-32 h-32 bg-purple-200/20 rounded-full blur-2xl group-hover:bg-purple-300/40 transition-all pointer-events-none" />

                {service.badge && (
                  <span className="absolute top-5 right-5 bg-amber-100 text-amber-800 text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-sm">
                    {service.badge}
                  </span>
                )}

                <div>
                  <div className="w-16 h-16 rounded-2xl bg-white shadow-md group-hover:bg-[#52007A] text-purple-900 group-hover:text-amber-300 flex items-center justify-center text-3xl transition-all duration-300 mb-6">
                    {service.icon}
                  </div>
                  <h3 className="text-xl font-bold text-slate-800 group-hover:text-[#52007A] transition-colors">
                    {service.title}
                  </h3>
                  <p className="text-sm text-slate-500 mt-2 leading-relaxed">
                    {service.subtitle}
                  </p>
                </div>

                <div className="flex items-center gap-2 mt-6 text-xs font-bold text-[#52007A] group-hover:translate-x-1 transition-transform">
                  <span>Explore Now</span>
                  <span>→</span>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        <section id="astrologers" className="space-y-6 pt-12">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#2D123A]">
                  Online Astrologers
                </h2>
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
              </div>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Connect immediately with verified experts available online right
                now.
              </p>
            </div>
            <button
              onClick={() => navigate("/dashboard/astrologers")}
              className="text-xs sm:text-sm font-semibold text-[#52007A] hover:underline cursor-pointer"
            >
              View All Astrologers
            </button>
          </div>

          <div className="hidden lg:grid grid-cols-5 gap-6">
            {astrologers?.slice(0, 5).map((astro) => (
              <motion.div
                key={astro._id}
                whileHover={{ y: -4 }}
                className="bg-white p-5 rounded-3xl border border-purple-100 shadow-md flex flex-col justify-between relative group"
              >
                <div>
                  <div className="flex justify-end mb-2">
                    <span className="inline-flex items-center gap-1.5 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                      <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
                      <span className="text-[10px] font-bold text-emerald-700 tracking-wider">
                        ONLINE
                      </span>
                    </span>
                  </div>

                  <div className="flex flex-col items-center text-center">
                    <img
                      src={
                        astro.profilePic ||
                        "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
                      }
                      alt={astro.fullName}
                      onClick={() => handleOpenModal(astro)}
                      className="w-20 h-20 rounded-full object-cover ring-4 ring-purple-100 group-hover:ring-purple-300 transition-all shadow-sm cursor-pointer"
                    />
                    <h3
                      onClick={() => handleOpenModal(astro)}
                      className="text-sm font-bold text-slate-800 mt-3 truncate w-full px-2 cursor-pointer hover:text-[#52007A]"
                    >
                      {astro.fullName}
                    </h3>
                    <p className="text-[11px] font-medium text-purple-600 mt-0.5">
                      {astro.experience} Years Exp.
                    </p>

                    <div className="flex flex-wrap justify-center items-center gap-1 mt-3 min-h-[32px] overflow-hidden">
                      {astro.specialties?.slice(0, 3).map((spec, index) => (
                        <span
                          key={index}
                          className="inline-block whitespace-nowrap text-[10px] bg-purple-50 text-purple-700 border border-purple-200 px-2 py-0.5 rounded-full font-semibold"
                        >
                          {spec}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="w-full border-t border-slate-100 my-3"></div>

                  <div className="flex items-center justify-between text-xs px-1">
                    <span className="font-bold text-slate-700">
                      ₹{astro.minRate ? astro.minRate : 0}/min
                    </span>
                    <span className="text-slate-500 truncate max-w-[110px] text-right">
                      {astro.languages?.join(", ")}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => handleOpenModal(astro)}
                  className="w-full mt-4 py-2.5 bg-[#52007A] hover:bg-[#400060] text-white font-semibold text-xs rounded-xl transition-colors shadow-md shadow-purple-900/10 cursor-pointer"
                >
                  Connect Now
                </button>
              </motion.div>
            ))}
          </div>

          <div className="block lg:hidden relative overflow-hidden py-2">
            <div className="flex justify-center">
              {astrologers.length > 0 && (
                <motion.div
                  key={astrologers[astroSlide]?._id}
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  transition={{ duration: 0.5 }}
                  className="bg-white p-5 rounded-3xl border border-purple-100 shadow-md flex flex-col justify-between relative group w-full max-w-xs"
                >
                  <div>
                    <div className="flex justify-end mb-2">
                      <span className="inline-flex items-center gap-1.5 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                        <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
                        <span className="text-[10px] font-bold text-emerald-700 tracking-wider">
                          ONLINE
                        </span>
                      </span>
                    </div>

                    <div className="flex flex-col items-center text-center">
                      <img
                        src={
                          astrologers[astroSlide]?.profilePic ||
                          "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
                        }
                        alt={astrologers[astroSlide]?.fullName}
                        onClick={() => handleOpenModal(astrologers[astroSlide])}
                        className="w-20 h-20 rounded-full object-cover ring-4 ring-purple-100 group-hover:ring-purple-300 transition-all shadow-sm cursor-pointer"
                      />
                      <h3
                        onClick={() => handleOpenModal(astrologers[astroSlide])}
                        className="text-sm font-bold text-slate-800 mt-3 truncate w-full px-2 cursor-pointer hover:text-[#52007A]"
                      >
                        {astrologers[astroSlide]?.fullName}
                      </h3>
                      <p className="text-[11px] font-medium text-purple-600 mt-0.5">
                        {astrologers[astroSlide]?.experience} Years Exp.
                      </p>

                      <div className="flex flex-wrap justify-center items-center gap-1 mt-3 min-h-[32px] overflow-hidden">
                        {astrologers[astroSlide]?.specialties
                          ?.slice(0, 3)
                          .map((spec, index) => (
                            <span
                              key={index}
                              className="inline-block whitespace-nowrap text-[10px] bg-purple-50 text-purple-700 border border-purple-200 px-2 py-0.5 rounded-full font-semibold"
                            >
                              {spec}
                            </span>
                          ))}
                      </div>
                    </div>

                    <div className="w-full border-t border-slate-100 my-3"></div>

                    <div className="flex items-center justify-between text-xs px-1">
                      <span className="font-bold text-slate-700">
                        ₹
                        {astrologers[astroSlide]?.minRate
                          ? astrologers[astroSlide]?.minRate
                          : 0}
                        /min
                      </span>
                      <span className="text-slate-500 truncate max-w-[110px] text-right">
                        {astrologers[astroSlide]?.languages?.join(", ")}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => handleOpenModal(astrologers[astroSlide])}
                    className="w-full mt-4 py-2.5 bg-[#52007A] hover:bg-[#400060] text-white font-semibold text-xs rounded-xl transition-colors shadow-md shadow-purple-900/10 cursor-pointer"
                  >
                    Connect Now
                  </button>
                </motion.div>
              )}
            </div>

            <div className="flex justify-center items-center gap-2 mt-4">
              {astrologers.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setAstroSlide(idx)}
                  className={`h-2 rounded-full transition-all duration-300 ${astroSlide === idx ? "w-8 bg-[#52007A]" : "w-2 bg-slate-300"}`}
                />
              ))}
            </div>
          </div>
        </section>

        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-12 items-start">
          <div className="lg:col-span-7 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#2D123A]">
                Cosmic Store
              </h2>
              <button
                onClick={() => navigate("/dashboard/products")}
                className="text-xs sm:text-sm font-semibold text-[#52007A] hover:underline cursor-pointer"
              >
                Explore Store
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {products?.map((item) => (
                <div
                  onClick={() =>
                    navigate(`/dashboard/cosmic-detail/${item._id}`)
                  }
                  key={item._id}
                  className="bg-white rounded-2xl p-3 border border-purple-100/60 shadow-sm flex flex-col justify-between group cursor-pointer hover:scale-105 duration-300 transition-all"
                >
                  <div>
                    <div className="h-32 rounded-xl overflow-hidden mb-3 bg-slate-50">
                      <img
                        src={item.images[0]}
                        alt={item.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <h4 className="text-xs font-semibold text-slate-800 line-clamp-1">
                      {item.name}
                    </h4>
                    <span className="text-[10px] text-amber-600 font-bold block mt-1">
                      ★ {item.rating}
                    </span>
                  </div>
                  <div className="flex items-center justify-between mt-3 pt-2 border-t border-slate-100">
                    <span className="text-xs font-bold text-[#4A1E5C]">
                      {item.price}
                    </span>
                    <button className="px-3 py-1.5 bg-purple-50 hover:bg-purple-100 text-[#52007A] text-xs font-semibold rounded-lg transition-colors cursor-pointer">
                      Buy
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-5 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#2D123A]">
                Cosmic Insights
              </h2>
              <button
                onClick={() => navigate("/dashboard/articles")}
                className="text-xs sm:text-sm font-semibold text-[#52007A] hover:underline cursor-pointer"
              >
                Read Articles
              </button>
            </div>

            <div className="space-y-4 w-full">
              {insights.map((article) => (
                <motion.div 
                  whileHover={{ y: -3 }}
                  key={article._id} 
                  className="bg-white p-3.5 rounded-2xl border border-purple-100/80 shadow-md flex items-center gap-3.5 group cursor-pointer relative overflow-hidden transition-all w-full"
                >
                  <div className="absolute top-0 right-0 w-20 h-20 bg-purple-50 rounded-bl-full -z-0 pointer-events-none group-hover:bg-purple-100 transition-colors" />
                  
                  <img src={article.thumbnail} alt={article.title} className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl object-cover shadow-sm shrink-0 z-10" />
                  
                  <div className="flex-1 min-w-0 z-10">
                    <div className="flex items-center justify-between mb-1 gap-2">
                      <span className="text-[9px] font-extrabold tracking-wider text-purple-700 bg-purple-50 border border-purple-200 px-2 py-0.5 rounded-full uppercase truncate max-w-[120px]">
                        {article.category}
                      </span>
                      <span className="text-[10px] font-medium text-slate-400 shrink-0">⏱ {article.readTime}</span>
                    </div>

                    <h4 className="text-xs sm:text-sm font-bold text-slate-800 truncate group-hover:text-[#52007A] transition-colors w-full">
                      {article.title}
                    </h4>
                    
                    <p className="text-[10px] sm:text-[11px] text-slate-500 truncate mt-0.5 w-full">
                      {article.subtitle}
                    </p>

                    <div className="flex items-center gap-2 mt-2 pt-2 border-t border-slate-100">
                      <img src={article.author?.profilePic} alt={article.author?.name} className="w-4 h-4 rounded-full object-cover shrink-0" />
                      <span className="text-[10px] font-semibold text-slate-600 truncate">{article.author?.name}</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer className="mt-20 border-t border-purple-100 bg-white w-full">
        <div className="w-full px-6 lg:px-12 py-12 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-[#4A1E5C] text-amber-300 flex items-center justify-center font-serif text-base font-bold">
              ☾
            </div>
            <span className="text-sm font-serif font-bold tracking-widest text-[#4A1E5C] uppercase">
              Astronarhari
            </span>
          </div>

          <p className="text-xs text-slate-400">
            © 2026 Astronarhari. All rights reserved. Crafted for cosmic
            alignments.
          </p>

          <div className="flex items-center gap-6 text-xs text-slate-500 font-medium">
            <a href="#" className="hover:text-purple-900 transition-colors">
              Terms of Service
            </a>
            <a href="#" className="hover:text-purple-900 transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="hover:text-purple-900 transition-colors">
              Support
            </a>
          </div>
        </div>
      </footer>

      <motion.button
        onClick={() => {
          document.getElementById("astrologers")?.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        }}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.95 }}
        className="fixed bottom-8 right-8 z-50 px-5 py-3 bg-[#52007A] text-white rounded-full shadow-2xl shadow-purple-950/30 flex items-center gap-3 text-xs font-bold cursor-pointer"
      >
        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
        <span>Chat with Astrologer</span>
      </motion.button>

      <AstrologerModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        astrologer={selectedAstrologer}
        onConnect={handleConnectNow}
      />

      {isBookingOpen && selectedAstrologer && (
        <>
          {console.log("🔥 ASTRO GOING TO BOOKING POPUP:", selectedAstrologer)}

          <BookAppointmentPopup
            astrologer={selectedAstrologer}
            month={new Date().toLocaleString("default", {
              month: "long",
              year: "numeric",
            })}
            fee={selectedAstrologer?.minRate || 0}
            originalFee={selectedAstrologer?.minRate || 0}
            balance={Number(walletBalance) || 0}
            onClose={handleCloseBooking}
            onProceedToPayment={handleProceedToPayment}
            setShowWallet={(value) => {
              if (value) {
                setIsBookingOpen(false);
                navigate("/dashboard/wallet");
              }
            }}
          />
        </>
      )}

      {isBookingConfirmedOpen && confirmedBooking && (
        <BookingConfirmedPopup
          astrologer={{
            name:
              selectedAstrologer?.fullName ||
              confirmedBooking?.astrologer?.fullName ||
              "Astrologer",

            tag: selectedAstrologer?.specialties?.join(" • ") || "Vedic Expert",

            rating:
              selectedAstrologer?.averageRating ??
              confirmedBooking?.astrologer?.averageRating ??
              0,

            image:
              selectedAstrologer?.profilePic ||
              confirmedBooking?.astrologer?.profilePic ||
              "https://i.pravatar.cc/150?img=12",
          }}
          booking={{
            date:
              confirmedBooking?.date ||
              confirmedBooking?.bookingDate ||
              confirmedBooking?.scheduledDate ||
              "Scheduled Date",

            time:
              confirmedBooking?.time ||
              confirmedBooking?.bookingTime ||
              confirmedBooking?.scheduledTime ||
              "Scheduled Time",

            mode:
              confirmedBooking?.mode ||
              confirmedBooking?.consultationType ||
              confirmedBooking?.type ||
              "Chat",
          }}
          onClose={() => {
            setIsBookingConfirmedOpen(false);
            setConfirmedBooking(null);
          }}
          onMyBookings={() => {
            setIsBookingConfirmedOpen(false);
            setConfirmedBooking(null);
            navigate("/dashboard/my-bookings");
          }}
        />
      )}
    </div>
  );
}
