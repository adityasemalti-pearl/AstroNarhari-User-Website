import  { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  Search,
  ShieldAlert,
  FileText,
  UserCheck,
  CreditCard,
  Lock,
  Scale,
  Globe,
  HelpCircle,
  ChevronRight,
  Printer,
 
  BookOpen,
  Mail,
  CheckCircle2,
} from "lucide-react";

import logo from '../../../assets/logo.png'

const sections = [
  {
    id: "acceptance",
    title: "1. Acceptance of Terms",
    icon: UserCheck,
    summary: "By accessing Namahastro, you agree to comply with and be bound by these Terms.",
    content: (
      <div className="space-y-4 text-slate-600 leading-relaxed">
        <p>
          Welcome to <span className="font-semibold text-purple-900">Namahastro</span>. By accessing or using our website, mobile application, virtual astrology consultations, birth chart calculations, and related services (collectively, "Services"), you acknowledge that you have read, understood, and agree to be legally bound by these Terms and Conditions.
        </p>
        <p>
          If you do not agree to these terms, please refrain from using our Services. We reserve the right to modify these terms at any time without prior individual notice. Continued usage of Namahastro following updates constitutes full acceptance of the revised terms.
        </p>
      </div>
    ),
  },
  {
    id: "disclaimer",
    title: "2. Astrological Disclaimer & Guidance",
    icon: ShieldAlert,
    summary: "Astrology insights are for guidance and spiritual exploration only.",
    content: (
      <div className="space-y-4 text-slate-600 leading-relaxed">
        <div className="p-4 bg-purple-50 rounded-xl border border-purple-200 flex gap-3 text-purple-900">
          <Sparkles className="w-6 h-6 flex-shrink-0 text-purple-600 mt-1" />
          <p className="text-sm font-medium">
            <strong>Important Notice:</strong> Astrology predictions, Kundli reports, gemstone suggestions, and horoscope readings provided by Namahastro are subjective spiritual tools intended solely for personal reflection and guidance.
          </p>
        </div>
        <ul className="list-disc pl-5 space-y-2">
          <li>
            <strong>No Professional Advice:</strong> Readings do not constitute certified medical, psychiatric, legal, financial, or tax advice. Always consult a qualified professional for critical health, legal, or financial decisions.
          </li>
          <li>
            <strong>No Guaranteed Outcomes:</strong> Cosmic alignments and planetary influences are interpreted based on Vedic and traditional practices. Namahastro makes no guarantee regarding the absolute accuracy or exact realization of future predictions.
          </li>
        </ul>
      </div>
    ),
  },
  {
    id: "eligibility",
    title: "3. Eligibility & Account Responsibilities",
    icon: Lock,
    summary: "Requirements for account creation and user verification.",
    content: (
      <div className="space-y-4 text-slate-600 leading-relaxed">
        <p>
          To access certain personalized astrological consultations and premium reports, you may be required to register an account with accurate birth details (Date, Time, and Place of Birth).
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-2">
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
            <h4 className="font-semibold text-purple-900 mb-1">Age Requirement</h4>
            <p className="text-sm">You must be at least 18 years old or have parental/guardian consent to purchase consultations.</p>
          </div>
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
            <h4 className="font-semibold text-purple-900 mb-1">Accurate Birth Data</h4>
            <p className="text-sm">Precision in birth time and location is required to ensure calculation accuracy for Janam Kundli.</p>
          </div>
        </div>
        <p>
          You are solely responsible for maintaining the confidentiality of your account credentials and for all activities conducted under your registered profile.
        </p>
      </div>
    ),
  },
  {
    id: "payments",
    title: "4. Payments, Refunds & Cancellations",
    icon: CreditCard,
    summary: "Pricing structure, payment gateways, and refund guidelines.",
    content: (
      <div className="space-y-4 text-slate-600 leading-relaxed">
        <p>
          All pricing for audio/video consultations, written Kundli reports, and gemstone remedies is listed in INR (₹) or USD ($) depending on your region.
        </p>
        <ul className="list-disc pl-5 space-y-2">
          <li>
            <strong>Consultation Bookings:</strong> Payments must be completed in advance to confirm live slots with our astrologers.
          </li>
          <li>
            <strong>Digital & PDF Reports:</strong> Due to the custom calculation nature of digital astrology reports, once a report is generated and delivered, it is <em>non-refundable</em>.
          </li>
          <li>
            <strong>Live Session Cancellations:</strong> Cancellations made 24 hours prior to the scheduled slot qualify for a full refund or slot reschedule. Late cancellations may incur a 50% rescheduling fee.
          </li>
        </ul>
      </div>
    ),
  },
  {
    id: "ip",
    title: "5. Intellectual Property Rights",
    icon: FileText,
    summary: "Ownership of astrology charts, content, logos, and algorithms.",
    content: (
      <div className="space-y-4 text-slate-600 leading-relaxed">
        <p>
          All branding, trade names ("Namahastro"), planetary calculation algorithms, graphic designs, UI components, horoscope articles, and custom artwork are the exclusive intellectual property of Namahastro.
        </p>
        <p>
          You are granted a personal, non-transferable, non-exclusive license to view and download reports strictly for your individual, non-commercial use. Commercial redistribution, scraping, or copying of Namahastro content is strictly prohibited.
        </p>
      </div>
    ),
  },
  {
    id: "conduct",
    title: "6. User Conduct & Prohibited Uses",
    icon: Scale,
    summary: "Maintaining a respectful and constructive environment during sessions.",
    content: (
      <div className="space-y-4 text-slate-600 leading-relaxed">
        <p>While using Namahastro, you agree NOT to:</p>
        <div className="space-y-2">
          {[
            "Abuse, harass, or use profane language with our astrologers during live calls or chats.",
            "Furnish deliberately false birth details with malicious intent to misguide sessions.",
            "Attempt to compromise or reverse-engineer our chart calculation software.",
            "Record live consultation video/audio without prior written consent from the astrologer.",
          ].map((item, idx) => (
            <div key={idx} className="flex items-start gap-2">
              <CheckCircle2 className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
              <span>{item}</span>
            </div>
          ))}
        </div>
      </div>
    ),
  },
  {
    id: "limitation",
    title: "7. Limitation of Liability",
    icon: Globe,
    summary: "Extent of Namahastro’s legal responsibilities.",
    content: (
      <div className="space-y-4 text-slate-600 leading-relaxed">
        <p>
          To the maximum extent permitted by law, Namahastro and its empirical astrologers, directors, and affiliates shall not be liable for any direct, indirect, incidental, or consequential damages resulting from your reliance on astrological guidance provided on the platform.
        </p>
      </div>
    ),
  },
  {
    id: "governing",
    title: "8. Governing Law & Dispute Resolution",
    icon: HelpCircle,
    summary: "Jurisdiction and arbitration terms.",
    content: (
      <div className="space-y-4 text-slate-600 leading-relaxed">
        <p>
          These terms shall be governed, construed, and enforced in accordance with the laws of India. Any disputes arising from or relating to these terms or Namahastro services shall be subject to the exclusive jurisdiction of the courts in New Delhi, India.
        </p>
      </div>
    ),
  },
];

export default function TermsConditions() {
  const [activeTab, setActiveTab] = useState("acceptance");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredSections = sections.filter(
    (sec) =>
      sec.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sec.summary.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const scrollToSection = (id) => {
    setActiveTab(id);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <div className="min-h-screen bg-white text-slate-800 font-sans selection:bg-purple-100 selection:text-purple-900">
      {/* Top Subtle Purple Aura Background */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-b from-purple-100/60 via-purple-50/30 to-transparent blur-3xl pointer-events-none -z-10" />

      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-purple-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
             <img src={logo} alt="" className="h-16 w-16"/>
            
            <div>
              <span className="text-2xl font-bold bg-gradient-to-r from-purple-900 via-purple-700 to-indigo-700 bg-clip-text text-transparent">
                Namahastro
              </span>
              <span className="text-xs block text-purple-600 font-medium tracking-wider uppercase">
                Vedic Wisdom • Celestial Clarity
              </span>
            </div>
          </div>

          {/* <button
            onClick={() => window.print()}
            className="flex items-center gap-2 px-4 py-2 rounded-xl border border-purple-200 text-purple-700 hover:bg-purple-50 transition-all font-medium text-sm"
          >
            <Printer className="w-4 h-4" />
            <span className="hidden sm:inline">Print Copy</span>
          </button> */}
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-3xl mx-auto space-y-4"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-purple-100 border border-purple-200 text-purple-800 text-xs font-semibold uppercase tracking-wider">
            <BookOpen className="w-3.5 h-3.5 text-purple-600" />
            Legal Documentation
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
            Terms & <span className="text-purple-600">Conditions</span>
          </h1>
          <p className="text-slate-600 text-base sm:text-lg">
            Please review the rules, guidelines, and celestial service agreements governing your experience at Namahastro.
          </p>

          {/* Last Updated Badge */}
          <div className="pt-2 text-xs font-medium text-slate-500">
            Last Updated: <span className="text-purple-700 font-semibold">August 2026</span> • Effective Immediately
          </div>

          {/* Search Box */}
          <div className="pt-4 max-w-lg mx-auto relative">
            <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-purple-400" />
            <input
              type="text"
              placeholder="Search clauses (e.g. Refunds, Kundli, Privacy)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-slate-50/80 border border-purple-100 focus:bg-white focus:border-purple-500 focus:ring-4 focus:ring-purple-100 transition-all text-slate-800 outline-none placeholder:text-slate-400"
            />
          </div>
        </motion.div>
      </section>

      {/* Main Content Layout */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Sticky Sidebar Navigation */}
          <aside className="lg:col-span-4 sticky top-28 hidden lg:block">
            <div className="p-5 rounded-2xl border border-purple-100 bg-white shadow-xl shadow-purple-900/5 space-y-2">
              <h3 className="text-xs font-bold text-purple-900 uppercase tracking-wider mb-3 px-3">
                Table of Contents
              </h3>
              <nav className="space-y-1">
                {sections.map((sec) => {
                  const Icon = sec.icon;
                  const isActive = activeTab === sec.id;
                  return (
                    <button
                      key={sec.id}
                      onClick={() => scrollToSection(sec.id)}
                      className={`w-full flex items-center justify-between p-3 rounded-xl text-sm font-medium transition-all ${
                        isActive
                          ? "bg-purple-600 text-white shadow-md shadow-purple-600/20"
                          : "text-slate-600 hover:bg-purple-50 hover:text-purple-900"
                      }`}
                    >
                      <div className="flex items-center gap-3 truncate">
                        <Icon className={`w-4 h-4 ${isActive ? "text-white" : "text-purple-600"}`} />
                        <span className="truncate">{sec.title}</span>
                      </div>
                      <ChevronRight className={`w-4 h-4 ${isActive ? "text-white" : "text-slate-300"}`} />
                    </button>
                  );
                })}
              </nav>

              {/* Need Help Box */}
              <div className="mt-6 p-4 rounded-xl bg-gradient-to-br from-purple-900 to-indigo-900 text-white space-y-2">
                <p className="text-xs font-semibold text-purple-200">Have Questions?</p>
                <p className="text-xs text-purple-100">Our legal and support teams are available 24/7.</p>
                <a
                  href="mailto:support@namahastro.com"
                  className="mt-2 inline-flex items-center gap-2 text-xs font-medium text-white bg-white/20 hover:bg-white/30 px-3 py-2 rounded-lg backdrop-blur-sm transition-all"
                >
                  <Mail className="w-3.5 h-3.5" />
                  Contact Legal Team
                </a>
              </div>
            </div>
          </aside>

          {/* Clauses Content */}
          <main className="lg:col-span-8 space-y-6">
            <AnimatePresence>
              {filteredSections.length > 0 ? (
                filteredSections.map((sec, idx) => {
                  const Icon = sec.icon;
                  return (
                    <motion.div
                      key={sec.id}
                      id={sec.id}
                      initial={{ opacity: 0, y: 15 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, margin: "-50px" }}
                      transition={{ duration: 0.4, delay: idx * 0.05 }}
                      className="p-6 sm:p-8 rounded-2xl bg-white border border-purple-100 shadow-xl shadow-purple-900/5 hover:border-purple-200 transition-all scroll-mt-28"
                    >
                      <div className="flex items-center gap-3 mb-4">
                        <div className="p-3 rounded-xl bg-purple-50 border border-purple-100 text-purple-600">
                          <Icon className="w-6 h-6" />
                        </div>
                        <div>
                          <h2 className="text-xl font-bold text-slate-900">{sec.title}</h2>
                          <p className="text-xs text-purple-600 font-medium">{sec.summary}</p>
                        </div>
                      </div>
                      <div className="border-t border-slate-100 pt-4">
                        {sec.content}
                      </div>
                    </motion.div>
                  );
                })
              ) : (
                <div className="p-12 text-center rounded-2xl bg-purple-50/50 border border-purple-100">
                  <Search className="w-10 h-10 text-purple-400 mx-auto mb-3" />
                  <h3 className="text-lg font-bold text-slate-800">No matching sections found</h3>
                  <p className="text-sm text-slate-500 mt-1">Try searching with a different keyword or topic.</p>
                  <button
                    onClick={() => setSearchQuery("")}
                    className="mt-4 px-4 py-2 bg-purple-600 text-white rounded-xl text-sm font-medium hover:bg-purple-700 transition-all"
                  >
                    Clear Search
                  </button>
                </div>
              )}
            </AnimatePresence>
          </main>

        </div>
      </section>

      {/* Footer Banner */}
      <footer className="mt-16 border-t border-purple-100 bg-purple-50/50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <div className="flex justify-center items-center gap-2">
            <Sparkles className="w-5 h-5 text-purple-600" />
            <span className="font-bold text-slate-900">Namahastro</span>
          </div>
          <p className="text-sm text-slate-500 max-w-xl mx-auto">
            Providing authentic Vedic astrological insights, Kundli analysis, and spiritual guidance around the globe.
          </p>
          <div className="pt-4 text-xs text-slate-400">
            © {new Date().getFullYear()} Namahastro. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}