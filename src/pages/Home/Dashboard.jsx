import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Navbar from '../../components/Navbar';
import { getDailyHoroscope } from '../../API/homeApis';
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import {
  Sparkles, Stars, Compass, Moon, Sun, ShieldCheck,
  MessageCircle, PhoneCall, ShoppingBag, Eye, Clock,
  ChevronRight, ArrowUpRight, Flame, Heart, Radio
} from 'lucide-react';

import { EffectFade, Autoplay, Pagination } from "swiper/modules";

import video1 from '../../assets/videos/v1.mp4'
import video2 from '../../assets/videos/v2.mp4'
import video3 from '../../assets/videos/v3.mp4'

// --- MOCK DATA ---
const SERVICES = [
  { id: 'kundli', title: 'Kundli Matching', subtitle: 'Detailed birth chart analysis', icon: '✨', badge: 'Popular' },
  { id: 'matchmaking', title: 'Cosmic Matchmaking', subtitle: 'Find your astrological pair', icon: '💖' },
  { id: 'horoscope', title: 'Daily Horoscope', subtitle: 'Personalized planetary insights', icon: '📅' },
  { id: 'festivals', title: 'Panchang & Festivals', subtitle: 'Auspicious times & muhurats', icon: '🪔' },
];

const LIVE_ASTROLOGERS = [
  { id: 1, name: 'Pandit Ravi', spec: 'Vedic & Palmistry', exp: '18 Yrs', img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80' },
  { id: 2, name: 'Acharya Meena', spec: 'Tarot & Numerology', exp: '12 Yrs', img: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&auto=format&fit=crop&q=80' },
  { id: 3, name: 'Dr. Shastri', spec: 'Vastu & Astrology', exp: '22 Yrs', img: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80' },
  { id: 4, name: 'Tarot Priya', spec: 'Psychic Reader', exp: '9 Yrs', img: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&auto=format&fit=crop&q=80' },
];

const SHOP_ITEMS = [
  { id: 1, name: 'Healing Amethyst Cluster', price: '₹1,299', rating: '4.9', img: 'https://images.unsplash.com/photo-1515377905703-c4788e51af15?w=400&auto=format&fit=crop&q=80' },
  { id: 2, name: 'Yearly Destiny Horoscope Report', price: '₹499', rating: '5.0', img: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&auto=format&fit=crop&q=80' },
  { id: 3, name: 'Natural Yellow Sapphire (Pukhraj)', price: '₹4,999', rating: '4.8', img: 'https://images.unsplash.com/photo-1615109398623-88346a601842?w=400&auto=format&fit=crop&q=80' },
];

const INSIGHTS = [
  {
    id: 1,
    tag: 'RITUALS',
    title: 'How the Full Moon in Aries Impacts Your Career Alignment',
    readTime: '4 min read',
    img: 'https://images.unsplash.com/photo-1532693322450-2cb5c511067d?w=500&auto=format&fit=crop&q=80',
  },
  {
    id: 2,
    tag: 'TRANSITS',
    title: 'Surviving Saturn Return: A Complete Celestial Guide',
    readTime: '6 min read',
    img: 'https://images.unsplash.com/photo-1614728894747-a83421e2b9c9?w=500&auto=format&fit=crop&q=80',
  },
];

const BANNERS = [
  {
    title: "Unlock Your Destiny",
    subtitle: "Get personalized horoscope predictions.",
    button: "Explore Horoscope",
    video: video1,
  },
  {
    title: "Talk To Expert Astrologers",
    subtitle: "Connect instantly with verified astrologers.",
    button: "Consult Now",
    video: video2,
  },
  {
    title: "Your Stars Hold the Answers",
    subtitle: "Discover accurate daily predictions, lucky timings, and cosmic guidance tailored just for you.",
    button: "View Horoscope",
    video: video3,
  },
];

const ZODIAC = [
  { name: 'Aries', symbol: '♈', dates: 'Mar 21 - Apr 19', element: 'Fire' },
  { name: 'Taurus', symbol: '♉', dates: 'Apr 20 - May 20', element: 'Earth' },
  { name: 'Gemini', symbol: '♊', dates: 'May 21 - Jun 20', element: 'Air' },
  { name: 'Cancer', symbol: '♋', dates: 'Jun 21 - Jul 22', element: 'Water' },
  { name: 'Leo', symbol: '♌', dates: 'Jul 23 - Aug 22', element: 'Fire' },
  { name: 'Virgo', symbol: '♍', dates: 'Aug 23 - Sep 22', element: 'Earth' },
  { name: 'Libra', symbol: '♎', dates: 'Sep 23 - Oct 22', element: 'Air' },
  { name: 'Scorpio', symbol: '♏', dates: 'Oct 23 - Nov 21', element: 'Water' },
  { name: 'Sagittarius', symbol: '♐', dates: 'Nov 22 - Dec 21', element: 'Fire' },
];

export default function Dashboard() {
  const [dailyHoroscope, setDailyHoroscope] = useState(null);

  const [selectedSign, setSelectedSign] = useState('Leo');
  const [activeTab, setActiveTab] = useState('all');
  const [currentBanner, setCurrentBanner] = useState(0);
  const [animateText, setAnimateText] = useState(true);

  useEffect(() => {
    const fetchHoroscope = async () => {
      try {
        const res = await getDailyHoroscope();
        setDailyHoroscope(res?.data?.data);
      } catch (error) {
        console.error('Failed to fetch horoscope:', error);
      }
    };

    fetchHoroscope();
  }, []);


  useEffect(() => {
    const interval = setInterval(() => {

      setAnimateText(false);

      setTimeout(() => {
        setCurrentBanner((prev) => (prev + 1) % BANNERS.length);
        setAnimateText(true);
      }, 250);

    }, 7000);

    return () => clearInterval(interval);

  }, []);

  return (
    <div className="min-h-screen bg-[#FAF8FC] text-slate-800 font-sans antialiased selection:bg-purple-200 selection:text-purple-950">

      {/* Background Cosmic Gradient Effects */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute -top-40 -left-40 w-[600px] h-[600px] bg-purple-200/40 rounded-full blur-[120px]" />
        <div className="absolute top-1/3 -right-40 w-[500px] h-[500px] bg-amber-100/50 rounded-full blur-[140px]" />
      </div>

      {/* MAIN PAGE CONTENT CONTAINER */}
      <main className="relative z-10  mx-auto px-4 md:px-8 ">

        {/* Banner Carousel */}
        <section className="mb-8">

          <div className="relative h-[420px] md:h-[92vh] overflow-hidden rounded-[40px]">

            {/* Background Fade */}

            {BANNERS.map((banner, index) => (

              <div
                key={index}
                className={`absolute inset-0 transition-all duration-[1800ms] ease-in-out
        ${currentBanner === index
                    ? "opacity-100 scale-100 z-20"
                    : "opacity-0 scale-105 z-10"
                  }`}
              >

                <video
                  src={banner.video}
                  autoPlay
                  muted
                  loop
                  playsInline
                  preload="auto"
                  className="absolute inset-0 h-full w-full object-cover animate-slowZoom"
                />

                {/* Overlay */}

                <div className="absolute inset-0 bg-black/40" />

                <div className="absolute inset-0 bg-gradient-to-r from-[#14081d]/90 via-[#231036]/55 to-transparent" />

                <div className="absolute inset-x-0 bottom-0 h-52 bg-gradient-to-t from-black/70 to-transparent" />

                <div className="absolute -right-32 top-20 h-96 w-96 rounded-full bg-yellow-400/10 blur-[150px]" />

              </div>

            ))}

            {/* CONTENT */}

            <div className="relative z-30 h-full flex items-center px-6 md:px-10">

              <div
                key={currentBanner}
                className={`max-w-2xl rounded-[32px]
        border border-white/10
        bg-white/5
        backdrop-blur-2xl
        p-8 md:p-12
        shadow-[0_20px_80px_rgba(0,0,0,.45)]
        transition-all duration-700
        ${animateText
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-8"
                  }`}
              >

                <div className="inline-flex items-center gap-2 rounded-full border border-yellow-400/20 bg-yellow-400/10 px-4 py-2 mb-6">

                  <Stars
                    size={16}
                    className="text-yellow-300"
                  />

                  <span className="text-xs uppercase tracking-[3px] text-yellow-200">
                    Premium Astrology
                  </span>

                </div>

                <h1 className="text-4xl md:text-7xl font-extrabold text-white leading-[1.05]">

                  {BANNERS[currentBanner].title}

                </h1>

                <p className="mt-6 text-white/80 text-lg leading-8">

                  {BANNERS[currentBanner].subtitle}

                </p>

                <div className="mt-10 flex gap-4 flex-wrap">

                  <button className="rounded-full bg-white px-7 py-4 font-semibold text-black hover:bg-yellow-300 transition">

                    {BANNERS[currentBanner].button}

                  </button>

                  <button className="rounded-full border border-white/20 bg-white/5 px-7 py-4 text-white hover:bg-white/10">

                    Learn More

                  </button>

                </div>

              </div>

            </div>

            {/* Progress Bar */}

            {/* <div className="absolute bottom-0 left-0 h-[3px] w-full bg-white/10 z-40">

              <div
                key={currentBanner}
                className="h-full bg-yellow-400 animate-progress"
              />

            </div> */}

          </div>

        </section>

        {/* HERO BANNER & HOROSCOPE SECTION */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-8 rounded-3xl bg-gradient-to-br from-[#5A1F75] via-[#4A1E5C] to-[#2B0C39] p-8 text-white relative overflow-hidden shadow-2xl shadow-purple-950/15 flex flex-col justify-between"
          >
            <div className="absolute top-0 right-0 w-96 h-96 bg-amber-300/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />

            <div>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <span className="text-xs font-bold uppercase tracking-widest text-amber-300">Daily Alignment</span>
                  <h1 className="text-3xl font-serif font-bold text-white mt-1">Namaste, Mystic Traveler</h1>
                </div>
                <span className="bg-white/10 backdrop-blur-md text-amber-300 border border-amber-300/30 text-xs font-semibold px-4 py-1.5 rounded-full tracking-wider uppercase">
                  {dailyHoroscope?.zodiac || 'Leo'} • {dailyHoroscope?.alignment || 'Balanced'}
                </span>
              </div>

              <p className="text-slate-200/90 text-sm leading-relaxed max-w-2xl font-light mb-8">
                The Sun in your sign grants you unparalleled creative vitality today. Trust your intuition in matters of the heart—a cosmic alignment suggests a meaningful encounter is on the horizon. Radiate confidence, but remain grounded in your truth.
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                { label: 'Lucky Color', value: 'Celestial Gold' },
                { label: 'Lucky Number', value: '88' },
                { label: 'Rasi Planet', value: 'Sun' },
                { label: 'Element', value: 'Fire 🔥' },
              ].map((stat, idx) => (
                <div key={idx} className="bg-white/10 backdrop-blur-md border border-white/10 rounded-2xl p-3 text-center">
                  <span className="block text-[10px] uppercase font-semibold text-purple-200">{stat.label}</span>
                  <span className="text-sm font-bold text-amber-300 mt-0.5 block">{stat.value}</span>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="lg:col-span-4 bg-white rounded-3xl p-6 border border-purple-100/80 shadow-xl shadow-purple-900/5 flex flex-col justify-between"
          >
            <div>
              <h3 className="text-lg font-serif font-semibold text-[#2D123A] mb-2">Explore Zodiacs</h3>
              <p className="text-xs text-slate-500 mb-6">Select your sign for today’s tailored prediction.</p>

              <div className="grid grid-cols-3 gap-3">
                {['Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo', 'Libra', 'Scorpio', 'Sagitt.'].map((sign) => (
                  <button
                    key={sign}
                    onClick={() => setSelectedSign(sign)}
                    className={`p-3 rounded-2xl border text-xs font-semibold transition-all flex flex-col items-center gap-1 ${selectedSign === sign
                      ? 'border-[#52007A] bg-purple-50 text-[#52007A] shadow-sm'
                      : 'border-slate-100 hover:border-purple-200 text-slate-600 hover:bg-slate-50'
                      }`}
                  >
                    <span>✨</span>
                    <span>{sign}</span>
                  </button>
                ))}
              </div>
            </div>

            <button className="w-full mt-6 py-3 bg-[#52007A] hover:bg-[#400060] text-white font-medium text-xs rounded-xl shadow-md transition-colors">
              Read Full Horoscope
            </button>
          </motion.div>
        </section>

        {/* SERVICES GRID */}
        <section className="space-y-6">
          <div className="flex items-end justify-between">
            <div>
              <h2 className="text-2xl font-serif font-bold text-[#2D123A]">Cosmic Services</h2>
              <p className="text-xs text-slate-500 mt-1">Unlock answers through authentic ancient Vedic practices.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {SERVICES.map((service) => (
              <motion.div
                key={service.id}
                whileHover={{ y: -6 }}
                transition={{ duration: 0.2 }}
                className="bg-white p-6 rounded-3xl border border-purple-100/60 shadow-lg shadow-purple-900/5 hover:shadow-xl hover:shadow-purple-900/10 transition-all cursor-pointer group relative overflow-hidden"
              >
                {service.badge && (
                  <span className="absolute top-4 right-4 bg-amber-100 text-amber-800 text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                    {service.badge}
                  </span>
                )}
                <div className="w-14 h-14 rounded-2xl bg-purple-50 group-hover:bg-[#52007A] text-purple-900 group-hover:text-amber-300 flex items-center justify-center text-2xl transition-all duration-300 mb-4">
                  {service.icon}
                </div>
                <h3 className="text-base font-bold text-slate-800 group-hover:text-[#52007A] transition-colors">
                  {service.title}
                </h3>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  {service.subtitle}
                </p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* LIVE ASTROLOGERS SECTION */}
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-2xl font-serif font-bold text-[#2D123A]">Live Astrologers</h2>
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping" />
              </div>
              <p className="text-xs text-slate-500 mt-1">Connect immediately with verified experts online right now.</p>
            </div>
            <button className="text-xs font-semibold text-[#52007A] hover:underline">
              View All Astrologers →
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {LIVE_ASTROLOGERS.map((astro) => (
              <motion.div
                key={astro.id}
                whileHover={{ y: -4 }}
                className="bg-white p-5 rounded-3xl border border-purple-100/80 shadow-md flex flex-col items-center text-center relative"
              >
                <div className="relative mb-3">
                  <img
                    src={astro.img}
                    alt={astro.name}
                    className="w-20 h-20 rounded-full object-cover ring-4 ring-rose-500/20"
                  />
                  <span className="absolute bottom-0 left-1/2 -translate-x-1/2 bg-rose-600 text-white text-[9px] font-bold px-2 py-0.5 rounded-full border border-white tracking-widest uppercase">
                    LIVE
                  </span>
                </div>
                <h3 className="text-sm font-bold text-slate-800">{astro.name}</h3>
                <p className="text-xs text-slate-500 mt-0.5">{astro.spec}</p>
                <p className="text-[11px] font-medium text-amber-600 mt-1">★ 4.9 • {astro.exp} Exp</p>

                <button className="w-full mt-4 py-2.5 bg-[#52007A] hover:bg-[#400060] text-white font-medium text-xs rounded-xl transition-colors shadow-md shadow-purple-900/10">
                  Connect Now
                </button>
              </motion.div>
            ))}
          </div>
        </section>

        {/* COSMIC SHOP & INSIGHTS */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-7 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-serif font-bold text-[#2D123A]">Cosmic Store</h2>
              <button className="text-xs font-semibold text-[#52007A] hover:underline">
                Explore Store →
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {SHOP_ITEMS.map((item) => (
                <div key={item.id} className="bg-white rounded-2xl p-3 border border-purple-100/60 shadow-sm flex flex-col justify-between group">
                  <div>
                    <div className="h-32 rounded-xl overflow-hidden mb-3 bg-slate-50">
                      <img src={item.img} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                    </div>
                    <h4 className="text-xs font-semibold text-slate-800 line-clamp-1">{item.name}</h4>
                    <span className="text-[10px] text-amber-600 font-bold block mt-1">★ {item.rating}</span>
                  </div>
                  <div className="flex items-center justify-between mt-3 pt-2 border-t border-slate-100">
                    <span className="text-xs font-bold text-[#4A1E5C]">{item.price}</span>
                    <button className="px-3 py-1.5 bg-purple-50 hover:bg-purple-100 text-[#52007A] text-xs font-semibold rounded-lg transition-colors">
                      Buy
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-5 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-serif font-bold text-[#2D123A]">Cosmic Insights</h2>
              <button className="text-xs font-semibold text-[#52007A] hover:underline">
                Read Articles →
              </button>
            </div>

            <div className="space-y-4">
              {INSIGHTS.map((article) => (
                <div key={article.id} className="bg-white p-3.5 rounded-2xl border border-purple-100/60 shadow-sm flex items-center gap-4 group cursor-pointer">
                  <img src={article.img} alt={article.title} className="w-24 h-20 rounded-xl object-cover" />
                  <div>
                    <span className="text-[9px] font-bold tracking-widest text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md uppercase">
                      {article.tag}
                    </span>
                    <h4 className="text-xs font-bold text-slate-800 mt-1.5 line-clamp-2 group-hover:text-[#52007A] transition-colors">
                      {article.title}
                    </h4>
                    <p className="text-[10px] text-slate-400 mt-1">⏱ {article.readTime}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

      </main>

      {/* FOOTER */}
      <footer className="mt-20 border-t border-purple-100 bg-white">
        <div className="max-w-7xl mx-auto px-8 py-12 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-[#4A1E5C] text-amber-300 flex items-center justify-center font-serif text-base font-bold">
              ☾
            </div>
            <span className="text-sm font-serif font-bold tracking-widest text-[#4A1E5C] uppercase">
              Astronarhari
            </span>
          </div>

          <p className="text-xs text-slate-400">
            © 2026 Astronarhari. All rights reserved. Crafted for cosmic alignments.
          </p>

          <div className="flex items-center gap-6 text-xs text-slate-500 font-medium">
            <a href="#" className="hover:text-purple-900 transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-purple-900 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-purple-900 transition-colors">Support</a>
          </div>
        </div>
      </footer>

      {/* Floating Action Chat Button */}
      <motion.button
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.95 }}
        className="fixed bottom-8 right-8 z-50 px-5 py-3 bg-[#52007A] text-white rounded-full shadow-2xl shadow-purple-950/30 flex items-center gap-3 text-xs font-bold cursor-pointer"
      >
        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
        <span>Chat with Astrologer</span>
      </motion.button>
    </div>


  );
}