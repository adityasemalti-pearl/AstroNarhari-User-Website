import React from "react";
import { ArrowRight, CheckCircle2, Sparkles, Star, Users, ShieldCheck, Heart, PhoneCall } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function AboutUs() {
  const navigate = useNavigate();

  const features = [
    {
      icon: <ShieldCheck size={24} />,
      title: "Verified Astrologers",
      description: "Connect with experienced and verified astrology professionals."
    },
    {
      icon: <PhoneCall size={24} />,
      title: "Live Consultation",
      description: "Get personalized guidance through live calls and chat sessions."
    },
    {
      icon: <Users size={24} />,
      title: "Personalized Guidance",
      description: "Receive insights based on your unique birth details and questions."
    },
    {
      icon: <Heart size={24} />,
      title: "Trusted Experience",
      description: "A simple, secure and comfortable platform for every seeker."
    }
  ];

  const stats = [
    { value: "10K+", label: "Happy Seekers" },
    { value: "500+", label: "Verified Astrologers" },
    { value: "50K+", label: "Consultations" },
    { value: "4.9/5", label: "Average Rating" }
  ];

  return (
    <div className="min-h-screen bg-[#FAFAFC] text-slate-800">

      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-violet-950 via-purple-900 to-fuchsia-900 text-white">
        
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-40 -left-40 h-96 w-96 rounded-full bg-purple-500/20 blur-3xl" />
          <div className="absolute -bottom-40 -right-40 h-96 w-96 rounded-full bg-fuchsia-500/20 blur-3xl" />
          <div className="absolute top-1/2 left-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/10" />
          <div className="absolute top-1/2 left-1/2 h-[380px] w-[380px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/10" />
        </div>

        <div className="relative mx-auto max-w-7xl px-6 py-24 sm:px-8 lg:px-12 lg:py-32">
          
          <div className="max-w-3xl">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm backdrop-blur">
              <Sparkles size={16} className="text-purple-200" />
              About Namah-Astro
            </div>

            <h1 className="text-4xl font-bold leading-tight sm:text-5xl lg:text-6xl">
              Guiding You Through
              <span className="block text-purple-200">
                Your Cosmic Journey
              </span>
            </h1>

            <p className="mt-6 max-w-2xl text-base leading-8 text-purple-100 sm:text-lg">
              Namah-Astro is a modern astrology platform created to connect
              seekers with trusted and verified astrologers for personalized
              guidance, meaningful conversations and deeper cosmic insights.
            </p>

            <button
              onClick={() => navigate("/astrologers")}
              className="mt-8 inline-flex items-center gap-3 rounded-2xl bg-white px-6 py-3.5 font-semibold text-purple-800 shadow-xl transition hover:-translate-y-0.5 hover:bg-purple-50"
            >
              Explore Astrologers
              <ArrowRight size={18} />
            </button>
          </div>

        </div>
      </section>

      {/* Introduction */}
      <section className="mx-auto max-w-7xl px-6 py-20 sm:px-8 lg:px-12">
        
        <div className="grid items-center gap-14 lg:grid-cols-2">

          <div>
            <div className="mb-4 inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-purple-700">
              <Sparkles size={17} />
              Who We Are
            </div>

            <h2 className="text-3xl font-bold leading-tight text-slate-900 sm:text-4xl">
              Ancient Wisdom,
              <span className="text-purple-700"> Modern Connection</span>
            </h2>

            <p className="mt-6 leading-8 text-slate-600">
              At Namah-Astro, we believe astrology is more than predictions.
              It is a tool for self-reflection, clarity and understanding the
              different phases of life.
            </p>

            <p className="mt-4 leading-8 text-slate-600">
              Our platform makes it easier to find the right astrologer,
              understand your concerns and receive personalized guidance
              whenever you need it.
            </p>

            <div className="mt-7 space-y-4">
              {[
                "Experienced and verified astrologers",
                "Personalized astrology consultations",
                "Easy call and chat experience",
                "Secure and user-friendly platform"
              ].map((item) => (
                <div key={item} className="flex items-center gap-3">
                  <CheckCircle2
                    size={20}
                    className="shrink-0 text-purple-600"
                  />
                  <span className="text-sm font-medium text-slate-700">
                    {item}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Visual Card */}
          <div className="relative">
            <div className="absolute -inset-5 rounded-[40px] bg-purple-200/40 blur-3xl" />

            <div className="relative overflow-hidden rounded-[32px] border border-purple-100 bg-white p-8 shadow-2xl">
              
              <div className="flex min-h-[390px] items-center justify-center rounded-[25px] bg-gradient-to-br from-purple-50 via-fuchsia-50 to-violet-100">
                
                <div className="text-center">
                  <div className="mx-auto flex h-28 w-28 items-center justify-center rounded-full bg-gradient-to-br from-violet-600 to-fuchsia-600 shadow-2xl shadow-purple-300">
                    <Sparkles size={48} className="text-white" />
                  </div>

                  <h3 className="mt-7 text-2xl font-bold text-slate-900">
                    Your Cosmic Path
                  </h3>

                  <p className="mx-auto mt-3 max-w-xs text-sm leading-6 text-slate-500">
                    Discover clarity, confidence and meaningful guidance
                    through astrology.
                  </p>

                  <div className="mt-6 flex justify-center gap-1">
                    {[1, 2, 3, 4, 5].map((item) => (
                      <Star
                        key={item}
                        size={18}
                        className="fill-yellow-400 text-yellow-400"
                      />
                    ))}
                  </div>
                </div>

              </div>
            </div>
          </div>

        </div>
      </section>

      {/* Stats */}
      <section className="border-y border-purple-100 bg-white">
        <div className="mx-auto grid max-w-7xl grid-cols-2 divide-x divide-purple-100 sm:grid-cols-4">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="px-5 py-9 text-center"
            >
              <h3 className="text-3xl font-bold text-purple-700">
                {stat.value}
              </h3>
              <p className="mt-2 text-xs font-medium uppercase tracking-wide text-slate-500">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="mx-auto max-w-7xl px-6 py-20 sm:px-8 lg:px-12">
        
        <div className="mx-auto max-w-2xl text-center">
          <span className="text-sm font-semibold uppercase tracking-wider text-purple-600">
            Why Namah-Astro
          </span>

          <h2 className="mt-3 text-3xl font-bold text-slate-900 sm:text-4xl">
            A Better Way to Connect With Astrology
          </h2>

          <p className="mt-4 leading-7 text-slate-500">
            Everything you need to make your astrology journey simple,
            personal and meaningful.
          </p>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="group rounded-3xl border border-purple-100 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-purple-200 hover:shadow-xl"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-purple-50 text-purple-700 transition group-hover:bg-purple-700 group-hover:text-white">
                {feature.icon}
              </div>

              <h3 className="mt-5 text-lg font-bold text-slate-900">
                {feature.title}
              </h3>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Mission */}
      <section className="px-6 pb-20 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-7xl overflow-hidden rounded-[35px] bg-gradient-to-r from-violet-800 via-purple-700 to-fuchsia-700 px-7 py-14 text-center text-white shadow-2xl sm:px-12">
          
          <div className="mx-auto max-w-3xl">
            <Sparkles size={30} className="mx-auto text-purple-200" />

            <h2 className="mt-5 text-3xl font-bold sm:text-4xl">
              Our Mission
            </h2>

            <p className="mt-5 text-sm leading-7 text-purple-100 sm:text-base">
              Our mission is to make authentic astrological guidance
              accessible to everyone. We want to create a trusted space where
              people can openly discuss their questions, connect with the
              right experts and find greater clarity in their journey.
            </p>

            <button
              onClick={() => navigate("/astrologers")}
              className="mt-8 inline-flex items-center gap-2 rounded-2xl bg-white px-6 py-3 font-semibold text-purple-800 transition hover:bg-purple-50"
            >
              Start Your Journey
              <ArrowRight size={18} />
            </button>
          </div>

        </div>
      </section>

      {/* Bottom Quote */}
      <section className="bg-purple-50 px-6 py-16 text-center">
        <div className="mx-auto max-w-3xl">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-purple-100 text-purple-700">
            <Star size={22} className="fill-purple-200" />
          </div>

          <blockquote className="mt-6 text-2xl font-serif font-semibold leading-relaxed text-slate-800 sm:text-3xl">
            "The stars may guide the way, but your choices shape the journey."
          </blockquote>

          <p className="mt-5 text-sm text-slate-500">
            — Namah-Astro
          </p>
        </div>
      </section>

    </div>
  );
}