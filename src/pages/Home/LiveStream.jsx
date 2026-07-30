import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Radio, 
  Eye, 
  Star, 
  Play, 
  Plus, 
  Sparkles, 
  Filter, 
  Users, 
  Search,
  Video
} from 'lucide-react';

export default function LiveStream() {
  const [activeCategory, setActiveCategory] = useState('All Live');

  const categories = [
    'All Live', 
    'Vedic Astrology', 
    'Tarot Reading', 
    'Numerology', 
    'Palmistry', 
    'Manifestation'
  ];

  // Top Featured Stream Data
  const topChoice = {
    id: 'top-1',
    name: 'Acharya Vasudha',
    specialty: 'Specializing in Karma & Past Life Analysis',
    viewers: '1.2k',
    rating: '4.9',
    category: 'Vedic Astrology',
    image: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&q=80&w=1200',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200'
  };

  // Currently Streaming List
  const liveStreams = [
    {
      id: 1,
      name: 'Priya Sharma',
      specialty: 'Modern Tarot & Intuition',
      viewers: '432',
      rating: '5.0',
      tag: 'Love & Marriage',
      image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=800',
      avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=150'
    },
    {
      id: 2,
      name: 'Dr. R.K. Gupta',
      specialty: 'Advanced Numerology',
      viewers: '817',
      rating: '4.9',
      tag: 'Career Insight',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=800',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=150'
    },
    {
      id: 3,
      name: 'Meena Nair',
      specialty: 'Ancient Palmistry Insights',
      viewers: '259',
      rating: '4.8',
      tag: 'Health & Vitality',
      image: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&q=80&w=800',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=150'
    },
    {
      id: 4,
      name: 'Swami Anand',
      specialty: 'Spiritual Manifestation & Abundance',
      viewers: '561',
      rating: '5.0',
      tag: 'Abundance',
      image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=800',
      avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&q=80&w=150'
    }
  ];

  return (
    <div className="min-h-screen bg-[#FAF8FF] text-slate-800 font-sans relative flex flex-col justify-between pb-20">
      
      {/* Background Radial Glows */}
      <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-purple-200/30 rounded-full blur-3xl pointer-events-none -translate-y-1/2" />
      <div className="absolute top-1/2 left-0 w-[500px] h-[500px] bg-amber-100/40 rounded-full blur-3xl pointer-events-none -translate-y-1/2" />

      {/* Top Header */}
      <header className="w-full bg-white/80 backdrop-blur-md border-b border-purple-100/80 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-2xl bg-rose-600 text-white shadow-md shadow-rose-600/20">
              <Radio className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h1 className="font-serif tracking-widest text-xl font-bold text-indigo-950 uppercase">
                Live Now
              </h1>
              <p className="text-[11px] text-amber-700 font-semibold tracking-wide">
                Interactive Cosmic Sessions
              </p>
            </div>
          </div>

          {/* Search & Active Session Counter */}
          <div className="flex items-center gap-6">
            <div className="hidden md:flex items-center gap-2 bg-slate-100/80 border border-slate-200/80 rounded-2xl px-4 py-2 text-xs text-slate-600">
              <Search className="w-4 h-4 text-slate-400" />
              <input 
                type="text" 
                placeholder="Search astrologers or topics..." 
                className="bg-transparent outline-none w-48 placeholder-slate-400"
              />
            </div>

            <div className="flex items-center gap-2 bg-emerald-50 text-emerald-700 border border-emerald-200/80 px-3.5 py-1.5 rounded-full text-xs font-semibold">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              <span>24 Active Sessions</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-6 py-10 w-full relative z-10 flex-1 space-y-10">
        
        {/* Category Filters Bar */}
        <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-none">
          {categories.map((cat) => {
            const isActive = activeCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-5 py-2.5 rounded-2xl text-xs font-semibold transition-all whitespace-nowrap ${
                  isActive
                    ? 'bg-gradient-to-r from-purple-950 to-indigo-900 text-amber-300 shadow-lg shadow-purple-950/20 scale-105'
                    : 'bg-white/80 text-slate-600 hover:bg-white border border-purple-100/80 shadow-sm'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* TOP CHOICE / FEATURED LIVE STREAM HERO BANNER */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-500" />
              <h2 className="font-serif text-2xl font-bold text-indigo-950">
                Top Choice
              </h2>
            </div>
            <span className="text-xs font-semibold text-purple-900 bg-purple-50 px-3 py-1 rounded-full border border-purple-100">
              Featured Streamer
            </span>
          </div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative w-full h-[380px] md:h-[420px] rounded-3xl overflow-hidden shadow-2xl border border-purple-100/80 group cursor-pointer"
          >
            {/* Background Stream Image */}
            <img 
              src={topChoice.image} 
              alt={topChoice.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            />
            
            {/* Dark Overlay Gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />

            {/* Top Badges */}
            <div className="absolute top-6 left-6 right-6 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="bg-rose-600 text-white text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1.5 shadow-md">
                  <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
                  LIVE
                </span>
                <span className="bg-black/40 backdrop-blur-md text-white text-xs font-semibold px-3 py-1 rounded-full flex items-center gap-1.5 border border-white/20">
                  <Eye className="w-3.5 h-3.5 text-amber-300" />
                  {topChoice.viewers} Viewing
                </span>
              </div>

              <div className="w-10 h-10 rounded-full bg-amber-400 text-slate-950 flex items-center justify-center shadow-lg">
                <Star className="w-5 h-5 fill-slate-950" />
              </div>
            </div>

            {/* Bottom Stream Details */}
            <div className="absolute bottom-6 left-6 right-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div className="space-y-2 text-white max-w-xl">
                <h3 className="font-serif text-3xl md:text-4xl font-bold tracking-tight">
                  {topChoice.name}
                </h3>
                <p className="text-sm text-slate-200 font-normal">
                  {topChoice.specialty}
                </p>
              </div>

              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-6 py-3 bg-amber-400 hover:bg-amber-300 text-indigo-950 font-bold text-sm rounded-2xl shadow-xl flex items-center gap-2 self-start md:self-auto"
              >
                <Play className="w-4 h-4 fill-indigo-950" />
                <span>Join Stream</span>
              </motion.button>
            </div>
          </motion.div>
        </div>

        {/* CURRENTLY STREAMING GRID */}
        <div className="space-y-6">
          <div className="flex items-center justify-between border-b border-purple-100/80 pb-4">
            <h2 className="font-serif text-2xl font-bold text-indigo-950">
              Currently Streaming
            </h2>
            <span className="text-xs font-medium text-slate-500">
              Showing active broadcasts
            </span>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {liveStreams.map((stream, idx) => (
              <motion.div
                key={stream.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="bg-white/90 backdrop-blur-sm rounded-3xl overflow-hidden border border-purple-100/80 shadow-lg shadow-purple-950/5 hover:shadow-xl hover:border-purple-200 transition-all group flex flex-col justify-between"
              >
                {/* Stream Video Preview Frame */}
                <div className="relative h-48 w-full overflow-hidden">
                  <img 
                    src={stream.image} 
                    alt={stream.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  
                  {/* Floating Live Tag & Viewers */}
                  <div className="absolute top-3 left-3 flex items-center gap-2">
                    <span className="bg-rose-600 text-white text-[10px] font-bold px-2.5 py-0.5 rounded-md shadow-sm">
                      LIVE
                    </span>
                    <span className="bg-slate-950/60 backdrop-blur-md text-white text-[11px] font-medium px-2 py-0.5 rounded-md flex items-center gap-1">
                      <Eye className="w-3 h-3 text-amber-300" />
                      {stream.viewers}
                    </span>
                  </div>

                  {/* Play Hover Overlay */}
                  <div className="absolute inset-0 bg-slate-950/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <div className="w-12 h-12 rounded-full bg-purple-900/90 text-amber-300 flex items-center justify-center shadow-lg transform scale-90 group-hover:scale-100 transition-transform">
                      <Play className="w-5 h-5 fill-amber-300 ml-0.5" />
                    </div>
                  </div>
                </div>

                {/* Streamer Bio & Tag */}
                <div className="p-5 space-y-4 flex-1 flex flex-col justify-between">
                  <div className="flex items-center gap-3">
                    <img 
                      src={stream.avatar} 
                      alt={stream.name}
                      className="w-10 h-10 rounded-full object-cover ring-2 ring-purple-100"
                    />
                    <div className="overflow-hidden">
                      <h4 className="font-serif text-base font-bold text-indigo-950 truncate">
                        {stream.name}
                      </h4>
                      <p className="text-xs text-slate-500 truncate">
                        {stream.specialty}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                    <span className="text-[11px] font-semibold text-purple-800 bg-purple-50 px-2.5 py-1 rounded-full border border-purple-100">
                      {stream.tag}
                    </span>

                    <div className="flex items-center gap-1 text-xs font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded-lg border border-amber-200/60">
                      <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                      <span>{stream.rating}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

      </main>

      {/* FLOATING CIRCULAR YELLOW ACTION BUTTON (+) */}
      <motion.div 
        className="fixed bottom-8 right-8 z-50"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.5, type: 'spring', stiffness: 260, damping: 20 }}
      >
        <motion.button
          whileHover={{ scale: 1.1, rotate: 90 }}
          whileTap={{ scale: 0.9 }}
          className="w-16 h-16 rounded-full bg-amber-400 hover:bg-amber-300 text-slate-950 flex items-center justify-center shadow-2xl shadow-amber-500/40 border-2 border-white ring-4 ring-amber-400/20 group"
          title="Go Live / Schedule Session"
        >
          <Plus className="w-8 h-8 text-slate-950 stroke-[2.5]" />
        </motion.button>
      </motion.div>

      {/* Footer */}
      <footer className="w-full text-center py-6 border-t border-slate-200/60 text-xs text-slate-400 bg-white/40">
        &copy; {new Date().getFullYear()} Live Astro Network. All spiritual sessions are end-to-end encrypted.
      </footer>

    </div>
  );
}