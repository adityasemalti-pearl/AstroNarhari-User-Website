
import React from "react";
import { motion } from "framer-motion";
import {
  ShieldCheck,
  Lock,
  UserCheck,
  Database,
  Eye,
  FileText,
  Mail,
  Sparkles,
  ChevronRight,
} from "lucide-react";

const sections = [
  {
    id: "information",
    icon: Database,
    title: "1. Information We Collect",
    content: (
      <>
        <p>
          We may collect information that you provide when you create an
          account, use our astrology services, communicate with astrologers,
          make bookings, or contact our support team.
        </p>

        <ul>
          <li>Name, mobile number, email address and profile information.</li>
          <li>Date, time and place of birth for astrology services.</li>
          <li>Booking, consultation and transaction information.</li>
          <li>Messages, reviews, feedback and other information you submit.</li>
          <li>Device, browser, IP address and general usage information.</li>
        </ul>
      </>
    ),
  },
  {
    id: "usage",
    icon: Eye,
    title: "2. How We Use Your Information",
    content: (
      <>
        <p>
          We use the information we collect to provide, maintain and improve
          our services and to provide you with a personalized astrology
          experience.
        </p>

        <ul>
          <li>To create and manage your account.</li>
          <li>To provide astrology consultations and personalized services.</li>
          <li>To process bookings, payments and refunds.</li>
          <li>To communicate important account and service updates.</li>
          <li>To improve our website, applications and user experience.</li>
          <li>To prevent fraud, abuse and unauthorized activity.</li>
        </ul>
      </>
    ),
  },
  {
    id: "astrology",
    icon: Sparkles,
    title: "3. Astrology Information",
    content: (
      <p>
        Information such as your date, time and place of birth may be required
        to generate birth charts, horoscopes, predictions and other astrology
        related services. This information is used only for providing the
        requested services and improving your experience on our platform.
      </p>
    ),
  },
  {
    id: "payments",
    icon: Lock,
    title: "4. Payments & Transactions",
    content: (
      <p>
        Payments may be processed through trusted third-party payment
        providers. We do not intentionally store complete payment card
        information on our servers. Payment information is handled according
        to the security and privacy policies of the respective payment
        provider.
      </p>
    ),
  },
  {
    id: "sharing",
    icon: UserCheck,
    title: "5. Sharing of Information",
    content: (
      <>
        <p>
          We do not sell or rent your personal information. Information may be
          shared only when reasonably necessary to provide our services or
          comply with applicable laws.
        </p>

        <ul>
          <li>With astrologers when required to provide a consultation.</li>
          <li>With service providers supporting our platform.</li>
          <li>With payment and communication service providers.</li>
          <li>When required by law or legal authorities.</li>
          <li>To protect the safety, security and rights of our users.</li>
        </ul>
      </>
    ),
  },
  {
    id: "security",
    icon: ShieldCheck,
    title: "6. Data Security",
    content: (
      <p>
        We take reasonable technical and organizational measures to protect
        your information against unauthorized access, alteration, disclosure
        or destruction. However, no internet-based service can guarantee
        absolute security.
      </p>
    ),
  },
  {
    id: "cookies",
    icon: FileText,
    title: "7. Cookies & Tracking Technologies",
    content: (
      <p>
        We may use cookies and similar technologies to maintain sessions,
        remember preferences, understand website usage and improve our
        services. You can manage cookie preferences through your browser
        settings.
      </p>
    ),
  },
  {
    id: "rights",
    icon: UserCheck,
    title: "8. Your Privacy Rights",
    content: (
      <>
        <p>
          Depending on applicable law, you may have rights regarding the
          personal information we hold about you.
        </p>

        <ul>
          <li>Request access to your personal information.</li>
          <li>Request correction of inaccurate information.</li>
          <li>Request deletion of your account or personal information.</li>
          <li>Withdraw consent where applicable.</li>
          <li>Request information about how your data is used.</li>
        </ul>
      </>
    ),
  },
  {
    id: "children",
    icon: ShieldCheck,
    title: "9. Children's Privacy",
    content: (
      <p>
        Our services are not intended for children who are not legally
        permitted to use such services. We do not knowingly collect personal
        information from children without appropriate authorization.
      </p>
    ),
  },
  {
    id: "changes",
    icon: FileText,
    title: "10. Changes to This Privacy Policy",
    content: (
      <p>
        We may update this Privacy Policy from time to time to reflect changes
        in our services, technology or legal requirements. Any updated policy
        will be published on this page with the revised effective date.
      </p>
    ),
  },
  {
    id: "contact",
    icon: Mail,
    title: "11. Contact Us",
    content: (
      <>
        <p>
          If you have questions, concerns or requests regarding this Privacy
          Policy, please contact our support team.
        </p>

        <div className="mt-5 rounded-2xl bg-purple-50 border border-purple-100 p-5">
          <p className="font-semibold text-purple-950">
            Privacy & Support Team
          </p>
          <p className="text-slate-600 mt-1">
            Email: support@yourwebsite.com
          </p>
        </div>
      </>
    ),
  },
];

export default function PrivacyPolicy() {
  const scrollToSection = (id) => {
    document.getElementById(id)?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  return (
    <div className="min-h-screen bg-[#fbfaff] text-slate-800 overflow-hidden">
      {/* Background Effects */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <motion.div
          animate={{
            x: [0, 40, 0],
            y: [0, -30, 0],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute -top-40 -right-40 w-[500px] h-[500px] rounded-full bg-purple-200/40 blur-3xl"
        />

        <motion.div
          animate={{
            x: [0, -30, 0],
            y: [0, 40, 0],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute top-[40%] -left-48 w-[500px] h-[500px] rounded-full bg-violet-200/30 blur-3xl"
        />

        <div className="absolute top-[20%] right-[20%] w-2 h-2 bg-purple-400 rounded-full animate-pulse" />
        <div className="absolute top-[35%] left-[15%] w-1.5 h-1.5 bg-violet-400 rounded-full animate-pulse" />
        <div className="absolute bottom-[20%] right-[12%] w-2 h-2 bg-purple-300 rounded-full animate-pulse" />
      </div>

      {/* Hero */}
      <section className="relative">
        <div className="max-w-7xl mx-auto px-6 pt-16 pb-12">
          <motion.div
            initial={{ opacity: 0, y: 35 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="text-center max-w-4xl mx-auto"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="mx-auto mb-6 w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-700 to-violet-500 flex items-center justify-center shadow-xl shadow-purple-300/40"
            >
              <ShieldCheck className="w-8 h-8 text-white" />
            </motion.div>

            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-50 border border-purple-100 text-purple-700 text-xs font-bold uppercase tracking-wider mb-5">
              <Sparkles className="w-3.5 h-3.5" />
              Your Privacy Matters
            </div>

            <h1 className="text-4xl md:text-6xl font-serif font-bold text-purple-950 tracking-tight">
              Privacy{" "}
              <span className="bg-gradient-to-r from-purple-700 to-violet-500 bg-clip-text text-transparent">
                Policy
              </span>
            </h1>

            <p className="mt-5 text-slate-500 text-base md:text-lg leading-8 max-w-2xl mx-auto">
              We respect your privacy and are committed to protecting the
              information you share with us while using our astrology platform.
            </p>

            <div className="mt-6 text-xs font-semibold text-slate-400">
              Last Updated: August 19, 2026
            </div>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <main className="relative max-w-7xl mx-auto px-6 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-8">
          {/* Sidebar */}
          <aside className="hidden lg:block">
            <div className="sticky top-8 rounded-3xl bg-white border border-purple-100 shadow-lg shadow-purple-900/5 p-5">
              <p className="text-xs font-bold uppercase tracking-widest text-purple-500 mb-4 px-3">
                On This Page
              </p>

              <div className="space-y-1">
                {sections.map((section) => (
                  <button
                    key={section.id}
                    onClick={() => scrollToSection(section.id)}
                    className="w-full flex items-center justify-between gap-2 px-3 py-2.5 rounded-xl text-left text-sm text-slate-600 hover:bg-purple-50 hover:text-purple-800 transition-all group"
                  >
                    <span className="truncate">{section.title.replace(/^\d+\.\s/, "")}</span>
                    <ChevronRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </button>
                ))}
              </div>
            </div>
          </aside>

          {/* Policy */}
          <div className="space-y-5">
            {sections.map((section, index) => {
              const Icon = section.icon;

              return (
                <motion.section
                  key={section.id}
                  id={section.id}
                  initial={{ opacity: 0, y: 25 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.15 }}
                  transition={{
                    duration: 0.5,
                    delay: Math.min(index * 0.03, 0.2),
                  }}
                  className="scroll-mt-8 bg-white rounded-3xl border border-purple-100 shadow-lg shadow-purple-900/[0.04] p-6 md:p-9 hover:shadow-xl hover:shadow-purple-900/[0.06] transition-shadow"
                >
                  <div className="flex items-start gap-4">
                    <div className="shrink-0 w-11 h-11 rounded-xl bg-purple-50 border border-purple-100 flex items-center justify-center">
                      <Icon className="w-5 h-5 text-purple-700" />
                    </div>

                    <div className="min-w-0 flex-1">
                      <h2 className="text-xl md:text-2xl font-serif font-bold text-purple-950">
                        {section.title}
                      </h2>

                      <div className="mt-4 text-sm md:text-[15px] leading-7 text-slate-600 policy-content">
                        {section.content}
                      </div>
                    </div>
                  </div>
                </motion.section>
              );
            })}
          </div>
        </div>
      </main>

      {/* Bottom CTA */}
      <section className="relative px-6 pb-16">
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="max-w-5xl mx-auto rounded-[2rem] bg-gradient-to-br from-purple-950 via-purple-900 to-violet-800 p-8 md:p-12 text-center relative overflow-hidden shadow-2xl shadow-purple-900/20"
        >
          <div className="absolute -top-24 -right-24 w-64 h-64 rounded-full bg-purple-400/20 blur-3xl" />
          <div className="absolute -bottom-32 -left-20 w-72 h-72 rounded-full bg-violet-400/10 blur-3xl" />

          <div className="relative">
            <Sparkles className="w-7 h-7 text-purple-200 mx-auto mb-4" />

            <h2 className="text-2xl md:text-3xl font-serif font-bold text-white">
              Your Trust, Our Responsibility
            </h2>

            <p className="mt-3 text-purple-200 max-w-2xl mx-auto text-sm md:text-base leading-7">
              We are committed to keeping your information secure and providing
              a transparent and trustworthy astrology experience.
            </p>

            <div className="mt-6 inline-flex items-center gap-2 text-xs font-semibold text-purple-100 bg-white/10 border border-white/10 rounded-full px-5 py-2.5">
              <Lock className="w-4 h-4" />
              Your information is protected
            </div>
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="border-t border-purple-100 bg-white/70">
        <div className="max-w-7xl mx-auto px-6 py-7 text-center">
          <p className="text-xs text-slate-400">
            © {new Date().getFullYear()} Your Astrology Platform. All rights
            reserved.
          </p>
        </div>
      </footer>

      {/* Policy List Styling */}
      <style>{`
        .policy-content p {
          margin-bottom: 12px;
        }

        .policy-content ul {
          margin-top: 14px;
          padding-left: 20px;
          list-style-type: disc;
        }

        .policy-content li {
          margin-bottom: 7px;
          padding-left: 4px;
        }

        .policy-content li::marker {
          color: #7e22ce;
        }
      `}</style>
    </div>
  );
}
