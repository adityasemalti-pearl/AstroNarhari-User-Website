import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Stars } from "lucide-react";

import video1 from "../../../assets/videos/v1.mp4";
import video2 from "../../../assets/videos/v2.mp4";
import video3 from "../../../assets/videos/v3.mp4";

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
        subtitle:
            "Discover accurate daily predictions, lucky timings, and cosmic guidance tailored just for you.",
        button: "View Horoscope",
        video: video3,
    },
];

export default function HeroBanner() {
    const [current, setCurrent] = useState(0);

    const videoRefs = useRef([]);

    useEffect(() => {
        videoRefs.current.forEach((video) => {
            if (!video) return;

            video.muted = true;
            video.playsInline = true;

            video.play().catch(() => { });
        });
    }, []);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrent((prev) => (prev + 1) % BANNERS.length);
        }, 5000);

        return () => clearInterval(interval);
    }, []);

    return (
        <section className="mb-10">

            <div className="relative h-[420px] md:h-[92vh] rounded-[40px] overflow-hidden">

                {BANNERS.map((banner, index) => (

                    <motion.video

                        key={index}

                        ref={(el) => videoRefs.current[index] = el}

                        src={banner.video}

                        autoPlay

                        muted

                        loop

                        playsInline

                        initial={false}

                        animate={{

                            opacity: current === index ? 1 : 0,

                            scale: current === index ? 1 : 1.06

                        }}

                        transition={{

                            opacity: {
                                duration: 2,
                                ease: "easeInOut"
                            },

                            scale: {
                                duration: 7,
                                ease: "linear"
                            }

                        }}

                        className="absolute inset-0 h-full w-full object-cover"

                    />

                ))}


                <div className="absolute inset-0 bg-black/35 z-10" />
                <div className="absolute inset-0 bg-gradient-to-r from-[#14081d]/90 via-[#231036]/50 to-transparent z-10" />
                <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-black/70 to-transparent z-10" />
                <div className="absolute -right-40 top-10 h-[420px] w-[420px] rounded-full bg-yellow-400/10 blur-[170px] z-10" />

                {/* ================= CONTENT ================= */}

                <div className="absolute inset-0 z-30 flex items-center">
                  <div className="container mx-auto px-6 md:px-10">
                        <AnimatePresence mode="wait">
                            <motion.div
                            key={current}
                                initial={{
                                    opacity: 0,
                                    y: 50,
                                    filter: "blur(10px)"
                                }}
                                animate={{
                                    opacity: 1,
                                    y: 0,
                                    filter: "blur(0px)"
                                }}
                                exit={{
                                    opacity: 0,
                                    y: -40,
                                    filter: "blur(8px)"
                                }}
                                transition={{
                                    duration: 1,
                                    ease: [0.22, 1, 0.36, 1]
                                }}
                                className="max-w-2xl rounded-[34px] border border-white/10 bg-white/5 backdrop-blur-2xl  p-8 md:p-12 shadow-[0_30px_80px_rgba(0,0,0,.45)]" >

                                {/* Badge */}

                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: .15 }}
                                    className="inline-flex items-center gap-2 rounded-full border border-yellow-400/20  bg-yellow-400/10  px-4   py-2 mb-7"  >
                                    <Stars size={16} className="text-yellow-300" />
                                    <span className="text-xs uppercase tracking-[3px] text-yellow-200">
                                        Premium Astrology
                                    </span>
                                </motion.div>

                                {/* Heading */}
                                <motion.h1
                                    initial={{ opacity: 0, y: 25 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: .3 }}
                                    className="text-5xl md:text-7xl font-extrabold  leading-[1.05] tracking-tight text-white" >

                                    {BANNERS[current].title}

                                </motion.h1>

                                {/* Subtitle */}

                                <motion.p
                                    initial={{ opacity: 0, y: 25 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: .45 }}
                                    className="mt-6  text-white/80 text-lg leading-8"  >
                                    {BANNERS[current].subtitle}
                                </motion.p>

                                {/* Buttons */}

                                <motion.div

                                    initial={{ opacity: 0, y: 25 }}

                                    animate={{ opacity: 1, y: 0 }}

                                    transition={{ delay: .6 }}

                                    className="mt-10 flex flex-wrap gap-4"

                                >

                                    <button className="group rounded-full bg-white px-8 py-4 font-semibold text-black transition-all duration-300 hover:scale-105 hover:bg-yellow-300">

                                        <span className="flex items-center gap-2">

                                            <Sparkles size={18} />

                                            {BANNERS[current].button}

                                        </span>

                                    </button>

                                    <button className="rounded-full border border-white/20 bg-white/5 px-8 py-4 text-white backdrop-blur-xl transition-all duration-300 hover:bg-white/10">

                                        Learn More

                                    </button>

                                </motion.div>

                            </motion.div>

                        </AnimatePresence>

                    </div>

                </div>

                <div className="absolute inset-0 pointer-events-none z-20">

                    <motion.div

                        animate={{
                            y: [0, -40, 0],
                            x: [0, 20, 0]
                        }}

                        transition={{
                            repeat: Infinity,
                            duration: 12,
                            ease: "easeInOut"
                        }}

                        className="absolute left-20 top-24
    h-3
    w-3
    rounded-full
    bg-yellow-300
    blur-sm"

                    />

                    <motion.div

                        animate={{
                            y: [0, 35, 0],
                            x: [0, -30, 0]
                        }}

                        transition={{
                            repeat: Infinity,
                            duration: 15,
                            ease: "easeInOut"
                        }}

                        className="absolute right-32 bottom-40
    h-4
    w-4
    rounded-full
    bg-purple-300
    blur-md"

                    />

                </div>
            </div>
        </section>
    )
}