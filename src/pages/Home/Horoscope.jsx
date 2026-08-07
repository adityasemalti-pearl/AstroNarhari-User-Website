import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Heart,
  Briefcase,
  Activity,
  Wallet,
  Star,
  Sparkles,
  ArrowRight,
  Droplet,
  Lock,
  Calendar,
  Compass,
} from "lucide-react";
import { getDailyHoroscope } from "../../API/homeApis";

export default function Horoscope() {
  const metrics = [
    {
      label: "Love",
      percentage: 85,
      icon: Heart,
      description: "High compatibility today",
    },
    {
      label: "Career",
      percentage: 70,
      icon: Briefcase,
      description: "Great day for pitching",
    },
    {
      label: "Health",
      percentage: 90,
      icon: Activity,
      description: "Energy levels peaking",
    },
    {
      label: "Finance",
      percentage: 50,
      icon: Wallet,
      description: "Exercise caution",
    },
  ];

  const container = {
    hidden: {},
    show: {
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  const item = {
    hidden: {
      opacity: 0,
      y: 30,
    },
    show: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
      },
    },
  };


  const [horoscope , setHoroscope] = useState();

  const fetchHoroscope = async()=>{
    try {
      const res = await getDailyHoroscope()
      setHoroscope(res.data.data)
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(()=>{
    fetchHoroscope()
  },[])

  return (
    <div className="relative min-h-screen bg-white overflow-hidden">

      {/* Animated Background */}

      <motion.div
        animate={{
          x: [0, 80, 0],
          y: [0, -60, 0],
        }}
        transition={{
          duration: 14,
          repeat: Infinity,
        }}
        className="absolute top-0 left-0 w-[450px] h-[450px] rounded-full bg-indigo-100 blur-3xl opacity-40"
      />

      <motion.div
        animate={{
          x: [0, -100, 0],
          y: [0, 100, 0],
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
        }}
        className="absolute bottom-0 right-0 w-[500px] h-[500px] rounded-full bg-amber-100 blur-3xl opacity-30"
      />

      <motion.main
        variants={container}
        initial="hidden"
        animate="show"
        className="relative z-10 max-w-7xl mx-auto p-4"
      >

        {/* Header */}

        <motion.header
          variants={item}
          className="mb-10 flex flex-col md:flex-row justify-between items-end gap-4 border-b border-slate-200 pb-6"
        >
          <div>
            <div className="flex items-center gap-2 text-indigo-900 text-xs uppercase tracking-widest font-semibold mb-2">

              <motion.div
                animate={{
                  rotate: [0, 8, -8, 0],
                }}
                transition={{
                  repeat: Infinity,
                  duration: 3,
                }}
              >
                <Compass className="w-4 h-4" />
              </motion.div>

              Daily Horoscope Insights
            </div>

            <h1 className="text-5xl font-serif font-bold text-indigo-950">
              Leo Readings
            </h1>
          </div>

          <motion.div
            whileHover={{
              scale: 1.05,
            }}
            className="flex items-center gap-2 bg-white px-4 py-2 rounded-xl border border-slate-200 shadow-lg"
          >
            <Calendar className="w-4 h-4 text-indigo-700" />
            <span className="text-sm font-medium">
              October 24, 2023
            </span>
          </motion.div>
        </motion.header>

        <div className="grid lg:grid-cols-3 gap-8">

          {/* Left Side */}

          <div className="lg:col-span-2 space-y-8">

            {/* Metric Cards */}

            <motion.section
              variants={container}
              className="grid grid-cols-2 sm:grid-cols-4 gap-5"
            >
              {metrics.map((metric) => {
                const Icon = metric.icon;

                return (
                  <motion.div
                    key={metric.label}
                    variants={item}
                    whileHover={{
                      y: -8,
                      scale: 1.04,
                    }}
                    transition={{
                      type: "spring",
                      stiffness: 250,
                    }}
                    className="group rounded-3xl bg-white border border-slate-200 p-5 shadow-md hover:shadow-2xl hover:border-indigo-300 transition-all duration-500"
                  >

                    <div className="flex justify-between items-center">

                      <span className="uppercase text-xs font-bold tracking-widest text-slate-500">
                        {metric.label}
                      </span>

                      <Icon className="w-5 h-5 text-indigo-700 transition-all duration-500 group-hover:rotate-12 group-hover:scale-125" />

                    </div>

                    <motion.h2
                      initial={{
                        opacity: 0,
                      }}
                      animate={{
                        opacity: 1,
                      }}
                      transition={{
                        delay: 0.4,
                      }}
                      className="text-3xl font-bold mt-5 text-indigo-950"
                    >
                      {metric.percentage}%
                    </motion.h2>

                    <div className="mt-4 h-2 rounded-full bg-slate-100 overflow-hidden">

                      <motion.div
                        initial={{
                          width: 0,
                        }}
                        animate={{
                          width: `${metric.percentage}%`,
                        }}
                        transition={{
                          duration: 1.2,
                        }}
                        className="h-full rounded-full bg-indigo-900"
                      />

                    </div>

                    <p className="text-xs mt-4 text-slate-500 leading-relaxed">
                      {metric.description}
                    </p>

                  </motion.div>
                );
              })}
            </motion.section>

                        {/* Today's Forecast */}

            <motion.section
              variants={item}
              whileHover={{
                y: -5,
              }}
              className="relative overflow-hidden rounded-3xl border border-amber-200 bg-gradient-to-br from-amber-50 via-white to-white p-8 shadow-lg"
            >
              <motion.div
                animate={{
                  rotate: [0, 10, -10, 0],
                  scale: [1, 1.08, 1],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                }}
                className="absolute -top-5 -right-5 opacity-20"
              >
                <Sparkles className="w-36 h-36 text-amber-400" />
              </motion.div>

              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 rounded-2xl bg-amber-100">
                  <Star className="w-6 h-6 fill-amber-500 text-amber-500" />
                </div>

                <h2 className="text-3xl font-serif font-bold text-indigo-950">
                  Today's Forecast
                </h2>
              </div>

              <p className="leading-8 text-slate-600">
                The cosmos is aligning to bring a surge of creative energy into
                your life today, Leo. Your natural charisma is stronger than
                usual, making this the perfect day for meetings, networking and
                expressing your ideas confidently.

                <br />
                <br />

                Financially, avoid impulsive spending and trust your instincts
                before making long-term commitments. By evening, you'll find
                yourself feeling peaceful and inspired.
              </p>

              <motion.button
                whileHover={{
                  scale: 1.05,
                }}
                whileTap={{
                  scale: 0.95,
                }}
                animate={{
                  boxShadow: [
                    "0 0 0px rgba(79,70,229,.2)",
                    "0 0 20px rgba(79,70,229,.4)",
                    "0 0 0px rgba(79,70,229,.2)",
                  ],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                }}
                className="mt-8 flex items-center gap-2 rounded-xl bg-indigo-950 px-6 py-3 text-sm font-semibold text-white"
              >
                View Detailed Chart

                <motion.div
                  animate={{
                    x: [0, 5, 0],
                  }}
                  transition={{
                    repeat: Infinity,
                    duration: 1,
                  }}
                >
                  <ArrowRight className="w-4 h-4" />
                </motion.div>
              </motion.button>
            </motion.section>

          </div>

          {/* Right Sidebar */}

          <motion.div
            variants={container}
            className="space-y-6"
          >

            <motion.div
              variants={item}
              className="rounded-3xl border border-slate-200 bg-white p-6 shadow-lg"
            >
              <h3 className="mb-5 text-xs font-bold uppercase tracking-[3px] text-slate-400">
                Daily Highlights
              </h3>

              {[
                {
                  title: "Lucky Color",
                  value: "Golden Saffron",
                  icon: (
                    <div className="h-10 w-10 rounded-full bg-amber-400 border-2 border-indigo-900" />
                  ),
                },
                {
                  title: "Lucky Number",
                  value: "8",
                  icon: (
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-100 font-bold text-amber-700">
                      8
                    </div>
                  ),
                },
                {
                  title: "Remedy",
                  value: "Offer Water To Sun",
                  icon: (
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-100">
                      <Droplet className="text-indigo-700" />
                    </div>
                  ),
                },
              ].map((item, index) => (
                <motion.div
                  key={index}
                  whileHover={{
                    x: 6,
                    scale: 1.02,
                  }}
                  className="group mb-4 flex items-center gap-4 rounded-2xl border border-slate-100 bg-slate-50 p-4 transition-all"
                >
                  {item.icon}

                  <div>
                    <p className="text-[10px] uppercase tracking-widest text-slate-400">
                      {item.title}
                    </p>

                    <p className="font-semibold text-indigo-950">
                      {item.value}
                    </p>
                  </div>
                </motion.div>
              ))}
            </motion.div>

            {/* Premium Card */}

            <motion.div
              variants={item}
              animate={{
                y: [0, -8, 0],
              }}
              transition={{
                duration: 5,
                repeat: Infinity,
              }}
              className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-950 via-purple-900 to-slate-950 p-8 text-center text-white shadow-2xl"
            >
              <div className="absolute -top-12 -right-12 h-40 w-40 rounded-full bg-amber-400/10 blur-3xl" />

              <div className="inline-flex items-center gap-2 rounded-full bg-amber-400/20 px-4 py-2 text-xs uppercase tracking-widest text-amber-300">
                <Sparkles className="w-4 h-4" />
                Personalized Astrology
              </div>

              <h2 className="mt-6 font-serif text-3xl font-bold">
                Detailed Kundli Analysis
              </h2>

              <p className="mt-4 text-sm leading-7 text-indigo-200">
                Unlock a complete personalized report generated from your birth
                chart, planetary positions and life predictions.
              </p>

              <motion.button
                whileHover={{
                  scale: 1.05,
                }}
                whileTap={{
                  scale: 0.95,
                }}
                className="mt-8 flex w-full items-center justify-center gap-2 rounded-xl bg-white py-4 font-bold text-indigo-950 transition-all hover:bg-amber-400"
              >
                <Lock className="w-4 h-4" />
                Unlock Premium Report
              </motion.button>
            </motion.div>

          </motion.div>

        </div>

      </motion.main>

    </div>
  );
}