import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import logo from '../../assets/logo.png';

export default function SplashScreen() {
  const navigate = useNavigate();

  useEffect(() => {
    // Extended slightly to 3s for a full, elegant animation cycle
    const timer = setTimeout(() => {
      navigate('/home');
    }, 3000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.05 }}
      transition={{ duration: 0.8, ease: 'easeInOut' }}
      className="fixed inset-0 flex flex-col items-center justify-center bg-white text-slate-900 select-none overflow-hidden"
    >
      {/* Background Ambient Glow with Pulsing Motion */}
      <motion.div
        animate={{
          scale: [1, 1.25, 1],
          opacity: [0.3, 0.6, 0.3],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="absolute w-80 h-80 rounded-full bg-amber-100/50 blur-3xl pointer-events-none"
      />

      {/* Main Logo & Content Container */}
      <div className="relative z-10 flex flex-col items-center">
        
        {/* Animated Logo Image */}
        <motion.div
          initial={{ opacity: 0, scale: 0.7, y: -10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{
            duration: 1,
            ease: [0.16, 1, 0.3, 1], // Custom smooth cubic-bezier spring
          }}
          className="relative w-36 h-36 mb-6 flex items-center justify-center"
        >
          <img
            src={logo}
            alt="Astronarhari Logo"
            className="w-32 h-32 object-contain filter drop-shadow-[0_10px_20px_rgba(226,177,66,0.2)]"
          />
        </motion.div>

        {/* Brand Title with Staggered Entrance */}
        <motion.h1
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.8,
            delay: 0.3,
            ease: [0.16, 1, 0.3, 1],
          }}
          className="text-2xl sm:text-3xl font-serif font-semibold tracking-[0.25em] text-[#4A1E5C] uppercase mb-4 pl-[0.25em]"
          style={{ fontFamily: "'Cinzel', 'Playfair Display', Georgia, serif" }}
        >
          Namah-Astro
        </motion.h1>

        {/* Tagline & Divider Lines Animation */}
        <motion.div
          initial={{ opacity: 0, scaleX: 0.8 }}
          animate={{ opacity: 1, scaleX: 1 }}
          transition={{
            duration: 0.8,
            delay: 0.6,
            ease: 'easeOut',
          }}
          className="flex items-center gap-3 w-64 sm:w-72"
        >
          {/* Left Gold Line */}
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.6, delay: 0.7 }}
            className="flex-1 h-[1px] bg-gradient-to-r from-transparent via-[#E2B142] to-[#E2B142] origin-right"
          />

          <span className="text-[9px] sm:text-[10px] font-medium tracking-[0.2em] text-[#5C5C5C] uppercase whitespace-nowrap">
            Since The Dawn Of Time
          </span>

          {/* Right Gold Line */}
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.6, delay: 0.7 }}
            className="flex-1 h-[1px] bg-gradient-to-l from-transparent via-[#E2B142] to-[#E2B142] origin-left"
          />
        </motion.div>

      </div>
    </motion.div>
  );
}