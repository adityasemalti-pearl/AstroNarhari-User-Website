import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function AstrologerModal({ isOpen, onClose, astrologer }) {
  if (!isOpen || !astrologer) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 30 }}
          transition={{ duration: 0.35, type: "spring", damping: 28 }}
          className="bg-white rounded-[32px] shadow-2xl max-w-lg w-full overflow-hidden border border-purple-100/80 relative"
        >
          <div className="absolute top-0 left-0 right-0 h-40 bg-gradient-to-br from-[#2B0C39] via-[#400060] to-[#6B1199] overflow-hidden">
            <div className="absolute -right-10 -top-10 w-40 h-40 bg-purple-400/20 rounded-full blur-2xl pointer-events-none" />
            <div className="absolute left-10 bottom-0 w-32 h-32 bg-amber-400/10 rounded-full blur-xl pointer-events-none" />
          </div>

          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-20 w-9 h-9 rounded-full bg-black/20 hover:bg-black/40 backdrop-blur-md flex items-center justify-center text-white transition-all cursor-pointer shadow-lg"
          >
            ✕
          </button>

          <div className="relative pt-10 px-6 pb-6 z-10 flex flex-col items-center text-center">
            <div className="relative mb-3">
              <div className="absolute -inset-1 rounded-full bg-gradient-to-tr from-amber-300 to-purple-400 opacity-75 blur-sm animate-pulse" />
              <img
                src={astrologer.profilePic || "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"}
                alt={astrologer.fullName}
                className="relative w-24 h-24 rounded-full object-cover ring-4 ring-white shadow-xl bg-white"
              />
            </div>

            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-extrabold tracking-wider mb-2 shadow-sm bg-white border border-purple-100">
              <span className={`h-2 w-2 rounded-full ${astrologer.isOnline ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'}`} />
              <span className={astrologer.isOnline ? 'text-emerald-700' : 'text-rose-700'}>
                {astrologer.isOnline ? 'ONLINE & READY TO CHAT' : 'CURRENTLY OFFLINE'}
              </span>
            </div>

            <h3 className="text-2xl font-serif font-bold text-[#2B0C39] tracking-wide">{astrologer.fullName}</h3>
            <p className="text-xs font-semibold text-purple-600/90 mt-0.5 bg-purple-50 px-3 py-1 rounded-full border border-purple-100">
              ✨ {astrologer.experience} Years of Divine Experience
            </p>
          </div>

          <div className="px-6 pb-6 space-y-5">
            <div className="grid grid-cols-2 gap-4 bg-gradient-to-br from-purple-50/60 to-amber-50/40 p-4 rounded-2xl border border-purple-100/80 shadow-inner">
              <div className="text-center border-r border-purple-200/50 pr-2">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Consultation Fee</span>
                <span className="text-lg font-serif font-bold text-[#52007A] mt-0.5 block">
                  ₹{astrologer.minRate ? astrologer.minRate : 0} <span className="text-xs font-sans font-normal text-slate-500">/ min</span>
                </span>
              </div>
              <div className="text-center pl-2">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Client Ratings</span>
                <span className="text-lg font-serif font-bold text-amber-600 mt-0.5 block flex items-center justify-center gap-1">
                  ★ {astrologer.averageRating || 0} <span className="text-xs font-sans font-normal text-slate-500">({astrologer.totalReviews || 0})</span>
                </span>
              </div>
            </div>

            <div>
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                <span>🔮</span> Specialties
              </h4>
              <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto pr-1">
                {astrologer.specialties?.map((spec, index) => (
                  <span key={index} className="text-xs bg-purple-50/80 hover:bg-purple-100 text-purple-800 border border-purple-200/60 px-3 py-1 rounded-xl font-semibold transition-colors shadow-xs">
                    {spec}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                <span>🗣️</span> Languages Known
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {astrologer.languages?.map((lang, index) => (
                  <span key={index} className="text-xs bg-slate-100/80 text-slate-700 border border-slate-200/80 px-3 py-1 rounded-xl font-medium shadow-xs">
                    {lang}
                  </span>
                ))}
              </div>
            </div>

            <button
              onClick={onClose}
              className="w-full py-3.5 bg-gradient-to-r from-[#2B0C39] via-[#400060] to-[#52007A] hover:opacity-95 text-white font-bold text-xs uppercase tracking-widest rounded-2xl transition-all shadow-xl shadow-purple-950/20 cursor-pointer flex items-center justify-center gap-2"
            >
              <span>Connect with {astrologer.fullName.split(' ')[0]}</span>
              <span>→</span>
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}