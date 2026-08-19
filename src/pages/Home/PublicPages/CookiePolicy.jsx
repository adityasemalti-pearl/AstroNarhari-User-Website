import React from "react";
import {
  Cookie,
  ShieldCheck,
  Settings2,
  BarChart3,
  LockKeyhole,
  CheckCircle2,
  Sparkles,
} from "lucide-react";

export default function CookiePolicy() {
  const lastUpdated = "17 August 2026";

  return (
    <div className="min-h-screen bg-[#FAFAFC] text-slate-800">

      {/* HERO */}
      <section className="relative overflow-hidden bg-gradient-to-br from-violet-950 via-purple-900 to-fuchsia-900 text-white">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -left-40 -top-40 h-[450px] w-[450px] rounded-full bg-purple-500/20 blur-3xl" />
          <div className="absolute -right-40 -bottom-40 h-[450px] w-[450px] rounded-full bg-fuchsia-500/20 blur-3xl" />
          <div className="absolute left-1/2 top-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/10" />
          <div className="absolute left-1/2 top-1/2 h-[350px] w-[350px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/10" />
        </div>

        <div className="relative mx-auto max-w-5xl px-6 py-24 text-center sm:px-8 lg:py-28">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl border border-white/20 bg-white/10 backdrop-blur">
            <Cookie size={32} className="text-purple-200" />
          </div>

          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-purple-100 backdrop-blur">
            <Sparkles size={15} />
            Legal & Privacy
          </div>

          <h1 className="text-4xl font-bold sm:text-5xl lg:text-6xl">
            Cookie Policy
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-base leading-8 text-purple-100 sm:text-lg">
            This Cookie Policy explains how Namah-Astro uses cookies and
            similar technologies to provide a better, safer and more
            personalized experience.
          </p>

          <p className="mt-5 text-sm text-purple-200">
            Last Updated: {lastUpdated}
          </p>
        </div>
      </section>

      {/* CONTENT */}
      <main className="mx-auto max-w-5xl px-6 py-16 sm:px-8 lg:px-12">

        {/* INTRO */}
        <section className="rounded-3xl border border-purple-100 bg-white p-7 shadow-sm sm:p-9">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-purple-50 text-purple-700">
              <Cookie size={23} />
            </div>

            <div>
              <h2 className="text-2xl font-bold text-slate-900">
                What Are Cookies?
              </h2>

              <p className="mt-4 leading-8 text-slate-600">
                Cookies are small text files that are stored on your device
                when you visit a website or use an online service. They help
                websites remember information about your visit and allow
                certain features to work correctly.
              </p>

              <p className="mt-4 leading-8 text-slate-600">
                Namah-Astro may use cookies and similar technologies to
                understand how users interact with our platform, improve
                functionality, maintain security and provide a better user
                experience.
              </p>
            </div>
          </div>
        </section>

        {/* SECTIONS */}
        <div className="mt-8 space-y-8">

          {/* 1 */}
          <section className="rounded-3xl border border-purple-100 bg-white p-7 shadow-sm sm:p-9">
            <h2 className="text-2xl font-bold text-slate-900">
              1. How We Use Cookies
            </h2>

            <p className="mt-4 leading-8 text-slate-600">
              Namah-Astro may use cookies for several purposes, including:
            </p>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {[
                "Keeping our platform secure.",
                "Remembering your preferences and settings.",
                "Understanding how visitors use our website.",
                "Improving website performance and functionality.",
                "Providing a personalized user experience.",
                "Helping us identify and resolve technical issues.",
              ].map((item) => (
                <div
                  key={item}
                  className="flex items-start gap-3 rounded-2xl bg-purple-50/60 p-4"
                >
                  <CheckCircle2
                    size={19}
                    className="mt-0.5 shrink-0 text-purple-600"
                  />
                  <span className="text-sm leading-6 text-slate-600">
                    {item}
                  </span>
                </div>
              ))}
            </div>
          </section>

          {/* 2 */}
          <section className="rounded-3xl border border-purple-100 bg-white p-7 shadow-sm sm:p-9">
            <div className="flex items-center gap-3">
              <ShieldCheck className="text-purple-700" size={24} />
              <h2 className="text-2xl font-bold text-slate-900">
                2. Types of Cookies We May Use
              </h2>
            </div>

            <div className="mt-7 space-y-5">

              <div className="rounded-2xl border border-purple-100 bg-purple-50/50 p-5">
                <h3 className="font-bold text-slate-900">
                  Essential Cookies
                </h3>
                <p className="mt-2 text-sm leading-7 text-slate-600">
                  These cookies are necessary for core functionality such as
                  authentication, account access, security and basic website
                  operations.
                </p>
              </div>

              <div className="rounded-2xl border border-purple-100 bg-purple-50/50 p-5">
                <h3 className="font-bold text-slate-900">
                  Preference Cookies
                </h3>
                <p className="mt-2 text-sm leading-7 text-slate-600">
                  These cookies help remember choices and preferences so that
                  you do not have to enter the same information repeatedly.
                </p>
              </div>

              <div className="rounded-2xl border border-purple-100 bg-purple-50/50 p-5">
                <h3 className="font-bold text-slate-900">
                  Analytics Cookies
                </h3>
                <p className="mt-2 text-sm leading-7 text-slate-600">
                  These cookies may help us understand website traffic,
                  engagement and usage patterns so we can improve our services.
                </p>
              </div>

              <div className="rounded-2xl border border-purple-100 bg-purple-50/50 p-5">
                <h3 className="font-bold text-slate-900">
                  Performance Cookies
                </h3>
                <p className="mt-2 text-sm leading-7 text-slate-600">
                  These cookies may help us monitor performance and identify
                  technical problems affecting the user experience.
                </p>
              </div>

            </div>
          </section>

          {/* 3 */}
          <section className="rounded-3xl border border-purple-100 bg-white p-7 shadow-sm sm:p-9">
            <div className="flex items-center gap-3">
              <Settings2 className="text-purple-700" size={24} />
              <h2 className="text-2xl font-bold text-slate-900">
                3. Managing Cookies
              </h2>
            </div>

            <p className="mt-5 leading-8 text-slate-600">
              Most web browsers allow you to control or delete cookies through
              their settings. You may choose to block certain cookies or
              receive a notification when cookies are being used.
            </p>

            <div className="mt-5 rounded-2xl bg-amber-50 p-5">
              <p className="text-sm leading-7 text-amber-800">
                Please note that disabling essential cookies may affect some
                features of the Namah-Astro platform, including login,
                authentication and other account-related functionality.
              </p>
            </div>
          </section>

          {/* 4 */}
          <section className="rounded-3xl border border-purple-100 bg-white p-7 shadow-sm sm:p-9">
            <div className="flex items-center gap-3">
              <BarChart3 className="text-purple-700" size={24} />
              <h2 className="text-2xl font-bold text-slate-900">
                4. Third-Party Services
              </h2>
            </div>

            <p className="mt-5 leading-8 text-slate-600">
              Some third-party services integrated into our platform may use
              cookies or similar technologies. These services may include
              analytics, authentication, payment, security or other technical
              providers.
            </p>

            <p className="mt-4 leading-8 text-slate-600">
              Third-party providers may have their own privacy and cookie
              policies. We recommend reviewing their respective policies to
              understand how they handle information.
            </p>
          </section>

          {/* 5 */}
          <section className="rounded-3xl border border-purple-100 bg-white p-7 shadow-sm sm:p-9">
            <div className="flex items-center gap-3">
              <LockKeyhole className="text-purple-700" size={24} />
              <h2 className="text-2xl font-bold text-slate-900">
                5. Security & Privacy
              </h2>
            </div>

            <p className="mt-5 leading-8 text-slate-600">
              We take reasonable measures to protect information collected
              through our platform. Cookies themselves generally do not contain
              your password or directly reveal sensitive account information.
            </p>

            <p className="mt-4 leading-8 text-slate-600">
              Our use of cookies should also be read together with our Privacy
              Policy and Terms & Conditions.
            </p>
          </section>

          {/* 6 */}
          <section className="rounded-3xl border border-purple-100 bg-white p-7 shadow-sm sm:p-9">
            <h2 className="text-2xl font-bold text-slate-900">
              6. Changes to This Cookie Policy
            </h2>

            <p className="mt-5 leading-8 text-slate-600">
              We may update this Cookie Policy from time to time to reflect
              changes in our technology, services, legal requirements or
              practices.
            </p>

            <p className="mt-4 leading-8 text-slate-600">
              Any updated version will be made available on this page along
              with the revised "Last Updated" date.
            </p>
          </section>

          {/* 7 */}
          <section className="rounded-3xl border border-purple-100 bg-white p-7 shadow-sm sm:p-9">
            <h2 className="text-2xl font-bold text-slate-900">
              7. Contact Us
            </h2>

            <p className="mt-5 leading-8 text-slate-600">
              If you have any questions about this Cookie Policy or how
              Namah-Astro uses cookies, you can contact us using the details
              below.
            </p>

            <div className="mt-6 rounded-2xl bg-gradient-to-r from-purple-50 to-fuchsia-50 p-6">
              <p className="font-bold text-slate-900">
                Namah-Astro
              </p>

              <p className="mt-2 text-sm text-slate-600">
                Email:{" "}
                <a
                  href="mailto:admin@namahastro.com"
                  className="font-semibold text-purple-700 hover:underline"
                >
                  admin@namahastro.com
                </a>
              </p>

              <p className="mt-1 text-sm text-slate-600">
                Location: Dehradun, Uttarakhand, India
              </p>
            </div>
          </section>

        </div>

        {/* BOTTOM NOTICE */}
        <div className="mt-10 rounded-3xl bg-gradient-to-r from-violet-800 via-purple-700 to-fuchsia-700 p-8 text-center text-white shadow-xl">
          <Cookie size={30} className="mx-auto text-purple-200" />

          <h3 className="mt-4 text-xl font-bold">
            Your Privacy Matters to Us
          </h3>

          <p className="mx-auto mt-3 max-w-2xl text-sm leading-7 text-purple-100">
            We aim to use cookies responsibly and transparently while
            providing a secure and smooth experience across Namah-Astro.
          </p>
        </div>

      </main>
    </div>
  );
}