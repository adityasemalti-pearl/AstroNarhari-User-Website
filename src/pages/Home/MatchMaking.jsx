import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles,
  MapPin,
  HeartHandshake,
  Info,
  Loader2,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { checkCompatibility } from '../../API/homeApis';

const inputClass =
  "w-full bg-slate-50/60 border border-slate-200/80 rounded-xl px-4 py-3 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-600 transition-all";

const selectClass =
  "w-full bg-slate-50/60 border border-slate-200/80 rounded-xl px-3 py-3 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-600 transition-all";

const labelClass = "block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2";

export default function MatchingMaking() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState(null);

  const emptyPerson = {
    name: '',
    dob: '',
    tob: '',
    ampm: 'AM',
    placeText: '',
    lat: null,
    lon: null
  };

  const [boyData, setBoyData] = useState({ ...emptyPerson });
  const [girlData, setGirlData] = useState({ ...emptyPerson });

  // Independent search state so the two cards never clash
  const [boyLocations, setBoyLocations] = useState([]);
  const [girlLocations, setGirlLocations] = useState([]);
  const [boySearching, setBoySearching] = useState(false);
  const [girlSearching, setGirlSearching] = useState(false);

  const searchLocation = async (query) => {
    if (!query || query.trim().length < 2) return [];
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          query
        )}&limit=5`
      );
      const data = await response.json();
      return data.map((item) => ({
        displayName: item.display_name,
        lat: Number(item.lat),
        lon: Number(item.lon)
      }));
    } catch (err) {
      console.error('Location Search Error:', err);
      return [];
    }
  };

  // Simple debounce so we don't hammer the API on every keystroke
  const debounceRef = React.useRef({});
  const debouncedSearch = (key, value, onResult, setSearching) => {
    setSearching(true);
    if (debounceRef.current[key]) clearTimeout(debounceRef.current[key]);
    debounceRef.current[key] = setTimeout(async () => {
      const result = await searchLocation(value);
      onResult(result);
      setSearching(false);
    }, 350);
  };

  const handleBoySearch = (value) => {
    setBoyData((prev) => ({ ...prev, placeText: value, lat: null, lon: null }));
    debouncedSearch('boy', value, setBoyLocations, setBoySearching);
  };

  const handleGirlSearch = (value) => {
    setGirlData((prev) => ({ ...prev, placeText: value, lat: null, lon: null }));
    debouncedSearch('girl', value, setGirlLocations, setGirlSearching);
  };

  const selectBoyLocation = (item) => {
    setBoyData((prev) => ({ ...prev, placeText: item.displayName, lat: item.lat, lon: item.lon }));
    setBoyLocations([]);
  };

  const selectGirlLocation = (item) => {
    setGirlData((prev) => ({ ...prev, placeText: item.displayName, lat: item.lat, lon: item.lon }));
    setGirlLocations([]);
  };

  // Motion variants for smooth entrances
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15, delayChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 25 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] }
    }
  };

  const isFormValid = () => {
    const requiredFilled = (p) => p.name && p.dob && p.tob && p.lat && p.lon;
    return requiredFilled(boyData) && requiredFilled(girlData);
  };

  const handleCheckCompatibility = async () => {
    setError('');
    setResult(null);

    if (!isFormValid()) {
      setError('Please fill in both names, dates, times, and select a birthplace from the dropdown for each partner.');
      return;
    }

    try {
      setLoading(true);

      const payload = {
        boy: boyData,
        girl: girlData
      };

      const res = await checkCompatibility(payload);
      setResult(res.data);
    } catch (err) {
      console.error(err);
      setError(err?.response?.data?.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF8FF] text-slate-800 font-sans relative overflow-hidden flex flex-col justify-between">

      {/* Background Glows & Celestial Accents */}
      <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-purple-200/40 rounded-full blur-3xl pointer-events-none -translate-y-1/2" />
      <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-amber-100/50 rounded-full blur-3xl pointer-events-none translate-y-1/3" />

      {/* Main Page Layout */}
      <main className="max-w-6xl mx-auto px-6 py-12 w-full relative z-10 flex-1">

        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-2xl mx-auto space-y-3 mb-12"
        >
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-100/80 text-amber-800 text-xs font-semibold tracking-wider uppercase border border-amber-200/60">
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            <span>Milan Astrology</span>
          </div>

          <h1 className="text-4xl md:text-5xl font-serif font-bold text-indigo-950 tracking-tight">
            Vedic Compatibility Check
          </h1>

          <p className="text-sm md:text-base text-slate-500 leading-relaxed font-normal">
            Enter birth details for a comprehensive Ashta-koota Guna Milan report to find cosmic synergy.
          </p>
        </motion.div>

        {/* Side-by-Side Dual Column Form */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start mb-12"
        >

          {/* BOY'S DETAILS CARD */}
          <motion.div
            variants={itemVariants}
            className="bg-white/80 backdrop-blur-sm p-8 rounded-3xl border border-purple-100/80 shadow-xl shadow-purple-950/5 space-y-6 relative overflow-visible group hover:border-purple-200 transition-all duration-300"
          >
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-t-3xl" />

            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <h2 className="font-serif text-2xl font-bold text-indigo-950 flex items-center gap-2">
                Boy's Details
              </h2>
              <span className="text-xs px-2.5 py-1 bg-purple-50 text-purple-700 font-semibold rounded-full border border-purple-100">
                Partner 1
              </span>
            </div>

            <div className="space-y-5">
              {/* Full Name */}
              <div>
                <label className={labelClass}>Full Name</label>
                <input
                  type="text"
                  placeholder="e.g., Aryan Sharma"
                  value={boyData.name}
                  onChange={(e) => setBoyData({ ...boyData, name: e.target.value })}
                  className={inputClass}
                />
              </div>

              {/* Date of Birth */}
              <div>
                <label className={labelClass}>Date of Birth</label>
                <input
                  type="date"
                  value={boyData.dob}
                  onChange={(e) => setBoyData({ ...boyData, dob: e.target.value })}
                  className={inputClass}
                />
              </div>

              {/* Time of Birth & AM/PM */}
              <div className="grid grid-cols-3 gap-3">
                <div className="col-span-2">
                  <label className={labelClass}>Time of Birth</label>
                  <input
                    type="time"
                    value={boyData.tob}
                    onChange={(e) => setBoyData({ ...boyData, tob: e.target.value })}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className={labelClass}>Period</label>
                  <select
                    value={boyData.ampm}
                    onChange={(e) => setBoyData({ ...boyData, ampm: e.target.value })}
                    className={selectClass}
                  >
                    <option value="AM">AM</option>
                    <option value="PM">PM</option>
                  </select>
                </div>
              </div>

              {/* Place of Birth */}
              <div className="relative">
                <label className={labelClass}>Place of Birth</label>
                <div className="relative">
                  <MapPin className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2 z-10" />
                  <input
                    value={boyData.placeText}
                    onChange={(e) => handleBoySearch(e.target.value)}
                    type="text"
                    placeholder="Search city or town"
                    className={`${inputClass} pl-11`}
                  />
                  {boySearching && (
                    <Loader2 className="w-4 h-4 text-purple-400 animate-spin absolute right-4 top-1/2 -translate-y-1/2" />
                  )}
                </div>
                <AnimatePresence>
                  {boyLocations.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: -6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -6 }}
                      transition={{ duration: 0.15 }}
                      className="absolute z-20 mt-1 w-full bg-white rounded-xl border border-slate-200 shadow-lg overflow-hidden max-h-56 overflow-y-auto"
                    >
                      {boyLocations.map((item, index) => (
                        <div
                          key={index}
                          onClick={() => selectBoyLocation(item)}
                          className="px-4 py-2.5 text-sm text-slate-700 cursor-pointer hover:bg-purple-50 border-b border-slate-50 last:border-0 transition-colors"
                        >
                          {item.displayName}
                        </div>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
                {boyData.lat && (
                  <p className="mt-1.5 text-[11px] text-emerald-600 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> Location confirmed
                  </p>
                )}
              </div>
            </div>
          </motion.div>

          {/* GIRL'S DETAILS CARD */}
          <motion.div
            variants={itemVariants}
            className="bg-white/80 backdrop-blur-sm p-8 rounded-3xl border border-amber-100/80 shadow-xl shadow-amber-950/5 space-y-6 relative overflow-visible group hover:border-amber-200 transition-all duration-300"
          >
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-amber-500 to-rose-500 rounded-t-3xl" />

            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <h2 className="font-serif text-2xl font-bold text-indigo-950 flex items-center gap-2">
                Girl's Details
              </h2>
              <span className="text-xs px-2.5 py-1 bg-amber-50 text-amber-800 font-semibold rounded-full border border-amber-100">
                Partner 2
              </span>
            </div>

            <div className="space-y-5">
              {/* Full Name */}
              <div>
                <label className={labelClass}>Full Name</label>
                <input
                  type="text"
                  placeholder="e.g., Aryan Sharma"
                  value={girlData.name}
                  onChange={(e) => setGirlData({ ...girlData, name: e.target.value })}
                  className={inputClass}
                />
              </div>

              {/* Date of Birth */}
              <div>
                <label className={labelClass}>Date of Birth</label>
                <input
                  type="date"
                  value={girlData.dob}
                  onChange={(e) => setGirlData({ ...girlData, dob: e.target.value })}
                  className={inputClass}
                />
              </div>

              {/* Time of Birth & AM/PM */}
              <div className="grid grid-cols-3 gap-3">
                <div className="col-span-2">
                  <label className={labelClass}>Time of Birth</label>
                  <input
                    type="time"
                    value={girlData.tob}
                    onChange={(e) => setGirlData({ ...girlData, tob: e.target.value })}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className={labelClass}>Period</label>
                  <select
                    value={girlData.ampm}
                    onChange={(e) => setGirlData({ ...girlData, ampm: e.target.value })}
                    className={selectClass}
                  >
                    <option value="AM">AM</option>
                    <option value="PM">PM</option>
                  </select>
                </div>
              </div>

              {/* Place of Birth */}
              <div className="relative">
                <label className={labelClass}>Place of Birth</label>
                <div className="relative">
                  <MapPin className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2 z-10" />
                  <input
                    value={girlData.placeText}
                    onChange={(e) => handleGirlSearch(e.target.value)}
                    type="text"
                    placeholder="Search city or town"
                    className={`${inputClass} pl-11`}
                  />
                  {girlSearching && (
                    <Loader2 className="w-4 h-4 text-amber-400 animate-spin absolute right-4 top-1/2 -translate-y-1/2" />
                  )}
                </div>
                <AnimatePresence>
                  {girlLocations.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: -6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -6 }}
                      transition={{ duration: 0.15 }}
                      className="absolute z-20 mt-1 w-full bg-white rounded-xl border border-slate-200 shadow-lg overflow-hidden max-h-56 overflow-y-auto"
                    >
                      {girlLocations.map((item, index) => (
                        <div
                          key={index}
                          onClick={() => selectGirlLocation(item)}
                          className="px-4 py-2.5 text-sm text-slate-700 cursor-pointer hover:bg-amber-50 border-b border-slate-50 last:border-0 transition-colors"
                        >
                          {item.displayName}
                        </div>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
                {girlData.lat && (
                  <p className="mt-1.5 text-[11px] text-emerald-600 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> Location confirmed
                  </p>
                )}
              </div>
            </div>
          </motion.div>

        </motion.div>

        {/* Explanation Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white/60 backdrop-blur-sm border border-purple-100 rounded-2xl p-6 mb-10 flex flex-col sm:flex-row items-center gap-5 max-w-3xl mx-auto shadow-sm"
        >
          <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center flex-shrink-0 shadow-inner">
            <Info className="w-6 h-6" />
          </div>
          <div className="text-center sm:text-left space-y-1">
            <h3 className="font-serif text-lg font-bold text-indigo-950">
              What is Guna Milan?
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Based on the ancient system of Ashtakoota, Kundli Matching tests compatibility across 36 distinct planetary metrics ('Gunas') to assess emotional, physical, and financial synergy.
            </p>
          </div>
          <button className="text-xs font-bold text-purple-900 hover:text-purple-700 whitespace-nowrap transition-colors underline underline-offset-4">
            Learn More
          </button>
        </motion.div>

        {/* Error Message */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="max-w-xl mx-auto mb-6 flex items-start gap-3 bg-rose-50 border border-rose-200 text-rose-700 text-sm rounded-xl px-4 py-3"
            >
              <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
              <span>{error}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Result */}
        <AnimatePresence>
          {result && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10 }}
              className="max-w-xl mx-auto mb-10 bg-gradient-to-br from-indigo-950 to-purple-900 text-white rounded-2xl p-6 text-center shadow-xl"
            >
              <p className="text-xs uppercase tracking-widest text-amber-300 font-semibold mb-2">
                Compatibility Result
              </p>
              {result.score !== undefined ? (
                <p className="text-4xl font-serif font-bold">{result.score} / 36 Gunas</p>
              ) : (
                <pre className="text-xs text-left whitespace-pre-wrap bg-white/10 rounded-lg p-4 mt-2">
                  {JSON.stringify(result, null, 2)}
                </pre>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Action Button */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center space-y-3"
        >
          <motion.button
            onClick={handleCheckCompatibility}
            disabled={loading}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full sm:w-auto px-10 py-4 bg-gradient-to-r from-indigo-950 via-purple-900 to-indigo-900 text-white font-bold text-sm rounded-2xl shadow-xl flex items-center justify-center gap-3 mx-auto group disabled:opacity-60"
          >
            {loading ? (
              <Loader2 className="w-5 h-5 text-amber-300 animate-spin" />
            ) : (
              <HeartHandshake className="w-5 h-5 text-amber-300" />
            )}
            <span>{loading ? 'Checking...' : 'Check Compatibility Score'}</span>
          </motion.button>

          <p className="text-[11px] font-medium tracking-wider text-slate-400 uppercase">
            Secured 256-bit Cosmic Encryption
          </p>
        </motion.div>

      </main>

      {/* Page Footer */}
      <footer className="w-full text-center py-6 border-t border-slate-200/60 text-xs text-slate-400">
        &copy; {new Date().getFullYear()} Astronarhari. All rights reserved.
      </footer>

    </div>
  );
}