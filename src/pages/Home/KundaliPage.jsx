import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { generateKundali } from '../../API/homeApis';

export default function KundliPage() {
  const [formData, setFormData] = useState({
    "fullName": "",
    "gender": "",
    "dateOfBirth": "",
    "timeOfBirth": "",
    "lat": null,
    "lon": null,
    "timezone": null
  });

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const response = await generateKundali({
        fullName: formData.fullName,
        gender: formData.gender,
        dateOfBirth: formData.dateOfBirth,
        timeOfBirth: formData.timeOfBirth,
        lat: formData.lat,
        lon: formData.lon,
        timezone: formData.timezone,
      });

      console.log(response.data);
      alert("Kundli Generated Successfully!");
    } catch (error) {
      console.error(error);
      alert(
        error?.response?.data?.message || "Something went wrong"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen py-10 px-4 sm:px-8 max-w-6xl mx-auto text-slate-800 selection:bg-purple-200 selection:text-purple-950">

      {/* Background Ambient Glows */}
      <div className="fixed top-20 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-gradient-to-b from-purple-200/30 via-amber-100/20 to-transparent rounded-full blur-[120px] pointer-events-none -z-10" />

      {/* --- PAGE HEADER --- */}
      <motion.div
        initial={{ opacity: 0, y: -15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center max-w-2xl mx-auto mb-10 space-y-2"
      >
        <h1
          className="text-3xl sm:text-4xl font-serif font-bold text-[#2D123A] tracking-tight"
          style={{ fontFamily: "'Cinzel', 'Playfair Display', Georgia, serif" }}
        >
          My Kundli
        </h1>
        <p className="text-sm text-slate-500 font-medium">
          Enter your exact birth details to generate your personal celestial map and planetary blueprint.
        </p>
      </motion.div>

      {/* --- DESKTOP 2-COLUMN LAYOUT --- */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

        {/* Left Column: Form Card (7 Cols) */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-purple-100/80 shadow-xl shadow-purple-900/5 relative overflow-hidden"
        >
          {/* Section Header Badge */}
          <div className="flex items-center gap-2 mb-6 text-[#52007A]">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
            </svg>
            <span className="text-xs font-bold uppercase tracking-wider">Individual Details</span>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Full Name */}
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-2">
                Full Name
              </label>
              <input
                type="text"
                placeholder="e.g. Arjun Sharma"
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                className="w-full px-4 py-3 text-sm bg-slate-50/60 border border-slate-200 rounded-2xl focus:bg-white focus:border-[#52007A] focus:ring-4 focus:ring-purple-100 outline-none transition-all font-medium text-slate-800 placeholder:text-slate-400"
                required
              />
            </div>

            {/* Gender Switcher */}
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-2">
                Gender
              </label>
              <div className="grid grid-cols-3 gap-2 p-1.5 bg-slate-100/80 rounded-2xl border border-slate-200/60">
                {['Male', 'Female', 'Other'].map((item) => {
                  const isSelected = formData.gender === item;
                  return (
                    <button
                      type="button"
                      key={item}
                      onClick={() => setFormData({ ...formData, gender: item })}
                      className={`py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${isSelected
                        ? 'bg-white text-[#52007A] shadow-sm'
                        : 'text-slate-500 hover:text-slate-800'
                        }`}
                    >
                      {item}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Date & Time Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Date of Birth */}
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-2">
                  Date of Birth
                </label>
                <div className="relative">
                  <input
                    type="date"
                    value={formData.dateOfBirth}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        dateOfBirth: e.target.value,
                      })
                    }
                    className="w-full px-4 py-3 text-sm bg-slate-50/60 border border-slate-200 rounded-2xl focus:bg-white focus:border-[#52007A] focus:ring-4 focus:ring-purple-100 outline-none transition-all font-medium text-slate-800"
                    required
                  />
                </div>
              </div>

              {/* Time of Birth */}
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-2">
                  Time of Birth
                </label>
                <div className="relative">
                  <input
                    type="time"
                    value={formData.timeOfBirth}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        timeOfBirth: e.target.value,
                      })
                    }
                    className="w-full px-4 py-3 text-sm bg-slate-50/60 border border-slate-200 rounded-2xl focus:bg-white focus:border-[#52007A] focus:ring-4 focus:ring-purple-100 outline-none transition-all font-medium text-slate-800"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Place of Birth */}
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-2">
                Place of Birth
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search city or town..."
                  value={formData.pob}
                  onChange={(e) => setFormData({ ...formData, pob: e.target.value })}
                  className="w-full pl-10 pr-4 py-3 text-sm bg-slate-50/60 border border-slate-200 rounded-2xl focus:bg-white focus:border-[#52007A] focus:ring-4 focus:ring-purple-100 outline-none transition-all font-medium text-slate-800 placeholder:text-slate-400"
                  required
                />
                <svg className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                </svg>
              </div>
            </div>

            {/* Submit Button */}
            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading}
              className="w-full py-4 px-6 bg-[#52007A] hover:bg-[#400060] text-white font-medium text-sm rounded-2xl shadow-lg shadow-purple-900/15 flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              {loading ? (
                <span>Aligning Stars...</span>
              ) : (
                <>
                  <span>Generate My Kundli</span>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                  </svg>
                </>
              )}
            </motion.button>

            <p className="text-[11px] text-center text-slate-400">
              Calculated using highly precise Swiss Ephemeris data.
            </p>
          </form>
        </motion.div>

        {/* Right Column: Vedic Insights Card (5 Cols) */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="lg:col-span-5 space-y-6"
        >
          <div className="bg-gradient-to-br from-[#FAEEFF] via-white to-[#FFF9EE] rounded-3xl p-6 sm:p-8 border border-amber-200/50 shadow-lg shadow-purple-900/5 relative overflow-hidden">

            {/* Celestial Sparkle Graphic Header */}
            <div className="w-12 h-12 rounded-2xl bg-purple-100 text-[#52007A] flex items-center justify-center text-xl mb-5 shadow-sm">
              ✨
            </div>

            <h2
              className="text-2xl font-serif font-bold text-[#2D123A] mb-4"
              style={{ fontFamily: "'Cinzel', 'Playfair Display', Georgia, serif" }}
            >
              Vedic Insights
            </h2>

            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed space-y-3 font-light">
              A <strong className="font-semibold text-purple-950">Janam Kundli</strong> is more than just a chart; it is a celestial blueprint of the heavens at the exact moment of your birth.
            </p>

            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mt-3 font-light">
              In Vedic astrology, this map reveals the position of the <em>Grahas</em> (planets) across the <em>Raashis</em> (zodiac signs) and <em>Bhavas</em> (houses), offering profound guidance on your life's purpose, destiny, and hidden potentials.
            </p>

            {/* Key Benefits List */}
            <div className="mt-6 pt-6 border-t border-purple-100/80 space-y-3">
              {[
                'Accurate D1 & D9 Navamsha Charts',
                'Comprehensive Vimshottari Dasha timeline',
                'Dosha analysis (Mangal, Kaal Sarp)',
              ].map((benefit, idx) => (
                <div key={idx} className="flex items-center gap-2 text-xs font-semibold text-[#52007A]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#E2B142]" />
                  <span>{benefit}</span>
                </div>
              ))}
            </div>

          </div>
        </motion.div>

      </div>
    </div>
  );
}