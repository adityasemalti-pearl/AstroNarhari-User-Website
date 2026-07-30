import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronLeft, 
  ChevronRight, 
  Calendar as CalendarIcon, 
  Sparkles, 
  Clock, 
  BookOpen, 
  Bell, 
  Share2, 
  Filter,
  ArrowRight
} from 'lucide-react';

export default function FestivalCalendar() {
  const [selectedMonth, setSelectedMonth] = useState('October');
  const [activeCategory, setActiveCategory] = useState('All Events');
  const [selectedDate, setSelectedDate] = useState(15);

  const months = ['August', 'September', 'October', 'November', 'December'];
  const categories = ['All Events', 'Religious', 'Auspicious', 'Fast / Vrat', 'Regional'];

  // Festival Data
  const festivalEvents = [
    {
      id: 1,
      date: 15,
      day: 'SUNDAY',
      fullDate: 'OCTOBER 15, 2023',
      title: 'Navratri Begins',
      category: 'Auspicious',
      tithi: 'Pratipada Tithi',
      hinduMonth: 'Ashwin Shukla',
      description: 'Commencement of the nine-day divine celebration honoring Goddess Durga and her nine sacred manifestations.',
      image: 'https://images.unsplash.com/photo-1609137144813-7d9921338f21?auto=format&fit=crop&q=80&w=600',
      actionText: 'Rituals & Muhurat',
      tagColor: 'bg-amber-100 text-amber-800 border-amber-200'
    },
    {
      id: 2,
      date: 24,
      day: 'TUESDAY',
      fullDate: 'OCTOBER 24, 2023',
      title: 'Dussehra (Vijayadashami)',
      category: 'Religious',
      tithi: 'Dashami Tithi',
      hinduMonth: 'Ashwin Shukla',
      description: 'Vijayadashami marks the triumph of Lord Rama over Ravana, symbolizing the eternal victory of good over evil.',
      image: 'https://images.unsplash.com/photo-1567157577867-05ccb1388e66?auto=format&fit=crop&q=80&w=600',
      actionText: 'Story & Significance',
      tagColor: 'bg-purple-100 text-purple-800 border-purple-200'
    },
    {
      id: 3,
      date: 28,
      day: 'SATURDAY',
      fullDate: 'OCTOBER 28, 2023',
      title: 'Sharad Purnima',
      category: 'Regional',
      tithi: 'Purnima Tithi',
      hinduMonth: 'Ashwin',
      description: 'A harvest festival celebrated on the full moon day, believed to be the night when Goddess Lakshmi showers blessings.',
      image: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&q=80&w=600',
      actionText: 'Kheer Prasad Time',
      tagColor: 'bg-sky-100 text-sky-800 border-sky-200'
    }
  ];

  // Days with festival indicators
  const festivalDays = [4, 10, 15, 23, 24, 28];

  return (
    <div className="min-h-screen bg-[#FAF8FF] text-slate-800 font-sans relative overflow-hidden flex flex-col justify-between">
      
      {/* Background Decorative Glows */}
      <div className="absolute top-0 left-1/3 w-[700px] h-[700px] bg-purple-200/30 rounded-full blur-3xl pointer-events-none -translate-y-1/2" />
      <div className="absolute bottom-0 right-10 w-[500px] h-[500px] bg-amber-100/40 rounded-full blur-3xl pointer-events-none translate-y-1/3" />

      {/* Top Header */}
      <header className="w-full bg-white/80 backdrop-blur-md border-b border-purple-100/80 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-gradient-to-br from-purple-900 to-indigo-950 text-amber-300 shadow-md">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <span className="font-serif tracking-widest text-xl font-bold text-indigo-950 uppercase block">
                Festival Calendar
              </span>
              <span className="text-[10px] tracking-wider text-amber-700 font-semibold uppercase">
                Vikram Samvat 2080
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-2 bg-slate-100/80 p-1 rounded-2xl border border-slate-200/60">
              <button className="px-4 py-1.5 text-xs font-semibold rounded-xl bg-white text-indigo-950 shadow-sm">
                Solar Calendar
              </button>
              <button className="px-4 py-1.5 text-xs font-semibold rounded-xl text-slate-500 hover:text-slate-800 transition">
                Lunar / Panchang
              </button>
            </div>
            <button className="p-2.5 rounded-full hover:bg-purple-50 text-slate-600 border border-slate-200/60 transition-all">
              <Bell className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Dashboard */}
      <main className="max-w-7xl mx-auto px-6 py-10 w-full relative z-10 flex-1 space-y-8">
        
        {/* Controls Section: Month Tabs & Category Filters */}
        <div className="space-y-6">
          
          {/* Month Selector Bar */}
          <div className="flex items-center justify-between gap-4 overflow-x-auto pb-2 scrollbar-none">
            <div className="flex items-center gap-2">
              {months.map((month) => {
                const isActive = selectedMonth === month;
                return (
                  <motion.button
                    key={month}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => setSelectedMonth(month)}
                    className={`px-6 py-2.5 rounded-2xl text-sm font-semibold transition-all whitespace-nowrap ${
                      isActive
                        ? 'bg-gradient-to-r from-purple-900 to-indigo-900 text-amber-300 shadow-lg shadow-purple-950/15'
                        : 'bg-white/80 text-slate-600 hover:bg-white border border-purple-100/80 shadow-sm'
                    }`}
                  >
                    {month}
                  </motion.button>
                );
              })}
            </div>

            <div className="hidden lg:flex items-center gap-2 text-xs font-bold text-indigo-950 bg-amber-100/60 px-4 py-2 rounded-2xl border border-amber-200/80">
              <CalendarIcon className="w-4 h-4 text-amber-700" />
              <span>Current Season: Hemanta Ritu</span>
            </div>
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none border-b border-purple-100/60 pb-4">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mr-2 flex items-center gap-1.5">
              <Filter className="w-3.5 h-3.5" /> Filter:
            </span>
            {categories.map((cat) => {
              const isActive = activeCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-amber-400 text-slate-950 font-bold shadow-md shadow-amber-400/20'
                      : 'bg-white/60 text-slate-600 hover:bg-white border border-slate-200/60'
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>

        </div>

        {/* Desktop Split View: Calendar Card (Left) vs Festival Cards (Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT: Calendar Grid Widget (5 Cols on Desktop) */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-5 bg-white/80 backdrop-blur-sm p-6 md:p-8 rounded-3xl border border-purple-100/80 shadow-xl shadow-purple-950/5 space-y-6"
          >
            {/* Calendar Month Header */}
            <div className="flex items-center justify-between">
              <button className="p-2 rounded-xl hover:bg-purple-50 text-slate-600 transition">
                <ChevronLeft className="w-5 h-5" />
              </button>
              <div className="text-center">
                <h2 className="font-serif text-2xl font-bold text-indigo-950">
                  {selectedMonth} 2023
                </h2>
                <p className="text-xs text-amber-700 font-medium">Ashwin - Kartik 2080</p>
              </div>
              <button className="p-2 rounded-xl hover:bg-purple-50 text-slate-600 transition">
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>

            {/* Days of Week Header */}
            <div className="grid grid-cols-7 text-center text-xs font-bold text-slate-400 uppercase tracking-wider py-2">
              <span>Sun</span>
              <span>Mon</span>
              <span>Tue</span>
              <span>Wed</span>
              <span>Thu</span>
              <span>Fri</span>
              <span>Sat</span>
            </div>

            {/* Date Grid */}
            <div className="grid grid-cols-7 gap-2 text-center text-sm font-semibold">
              {/* Previous Month Trailing Days */}
              {[24, 25, 26, 27, 28, 29, 30].map((day) => (
                <div key={`prev-${day}`} className="py-3 text-slate-300 font-normal">
                  {day}
                </div>
              ))}

              {/* Current Month Days */}
              {Array.from({ length: 31 }, (_, i) => i + 1).map((day) => {
                const isSelected = selectedDate === day;
                const hasFestival = festivalDays.includes(day);

                return (
                  <button
                    key={day}
                    onClick={() => setSelectedDate(day)}
                    className={`py-3 rounded-2xl relative transition-all flex flex-col items-center justify-center ${
                      isSelected
                        ? 'bg-purple-950 text-amber-300 shadow-lg shadow-purple-950/25 font-bold scale-105'
                        : 'hover:bg-purple-50/80 text-slate-700'
                    }`}
                  >
                    <span>{day}</span>
                    
                    {/* Event Indicator Dot */}
                    {hasFestival && (
                      <span 
                        className={`w-1.5 h-1.5 rounded-full mt-1 ${
                          isSelected ? 'bg-amber-300' : 'bg-purple-600'
                        }`} 
                      />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Legend & Stats */}
            <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-purple-600" />
                <span>Festival / Vrat</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-slate-300" />
                <span>Regular Day</span>
              </div>
            </div>

          </motion.div>

          {/* RIGHT: Festival List / Highlights (7 Cols on Desktop) */}
          <div className="lg:col-span-7 space-y-6">
            
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-serif text-2xl font-bold text-indigo-950">
                  Upcoming Highlights
                </h2>
                <p className="text-xs text-slate-500">Key auspicious events in {selectedMonth}</p>
              </div>
              <button className="text-xs font-bold text-purple-900 hover:text-purple-700 flex items-center gap-1 transition-colors">
                <span>View All (12)</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Festival Cards Stream */}
            <div className="space-y-4">
              <AnimatePresence mode="wait">
                {festivalEvents.map((event, idx) => (
                  <motion.div
                    key={event.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1, duration: 0.4 }}
                    className="bg-white/90 backdrop-blur-sm rounded-3xl p-6 border border-purple-100/80 shadow-lg shadow-purple-950/5 hover:shadow-xl hover:border-purple-200 transition-all group flex flex-col md:flex-row gap-6 items-start"
                  >
                    {/* Event Banner Image */}
                    <div className="w-full md:w-36 h-36 md:h-full rounded-2xl overflow-hidden flex-shrink-0 relative">
                      <img 
                        src={event.image} 
                        alt={event.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute top-2 left-2 bg-indigo-950/80 backdrop-blur-md text-amber-300 px-2.5 py-1 rounded-xl text-[10px] font-bold uppercase tracking-wider">
                        {event.day}, OCT {event.date}
                      </div>
                    </div>

                    {/* Event Details */}
                    <div className="flex-1 space-y-3 w-full">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h3 className="font-serif text-xl font-bold text-indigo-950 group-hover:text-purple-900 transition-colors">
                            {event.title}
                          </h3>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-[11px] font-semibold text-purple-800 bg-purple-50 px-2.5 py-0.5 rounded-md border border-purple-100">
                              {event.tithi}
                            </span>
                            <span className="text-[11px] text-slate-400">•</span>
                            <span className="text-[11px] text-slate-500 font-medium">
                              {event.hinduMonth}
                            </span>
                          </div>
                        </div>

                        <span className={`text-[10px] uppercase font-bold px-3 py-1 rounded-full border ${event.tagColor}`}>
                          {event.category}
                        </span>
                      </div>

                      <p className="text-xs text-slate-600 leading-relaxed">
                        {event.description}
                      </p>

                      {/* Card Action Bar */}
                      <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                        <button className="text-xs font-bold text-indigo-950 hover:text-purple-700 flex items-center gap-1.5 transition-colors">
                          <Clock className="w-3.5 h-3.5 text-amber-600" />
                          <span>{event.actionText}</span>
                        </button>

                        <div className="flex items-center gap-2">
                          <button className="p-2 rounded-xl hover:bg-purple-50 text-slate-400 hover:text-purple-700 transition">
                            <Share2 className="w-4 h-4" />
                          </button>
                          <button className="p-2 rounded-xl hover:bg-purple-50 text-slate-400 hover:text-purple-700 transition">
                            <BookOpen className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

          </div>

        </div>

      </main>

      {/* Footer */}
      <footer className="w-full text-center py-6 border-t border-slate-200/60 text-xs text-slate-400 bg-white/40">
        &copy; {new Date().getFullYear()} Festival & Panchang Calendar. All cosmic insights reserved.
      </footer>

    </div>
  );
}