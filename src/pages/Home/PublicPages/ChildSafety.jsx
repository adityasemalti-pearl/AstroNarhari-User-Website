import React from "react";
import {
  ShieldCheck,
  AlertTriangle,
  Ban,
  Flag,
  Mail,
  Scale,
  LockKeyhole,
  Users,
  CheckCircle2,
  ArrowLeft,
} from "lucide-react";
import { Link } from "react-router-dom";

const ChildSafety = () => {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      {/* Header */}
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5 lg:px-8">
          <Link
            to="/"
            className="flex items-center gap-3 text-slate-900 transition hover:text-violet-700"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-violet-600 to-violet-800 shadow-lg shadow-violet-200">
              <ShieldCheck className="h-5 w-5 text-white" />
            </div>

            <div>
              <h1 className="font-serif text-lg font-bold tracking-[0.12em]">
                ASTRONARHARI
              </h1>
              <p className="text-[9px] font-bold tracking-[0.25em] text-violet-600">
                PARTNER PORTAL
              </p>
            </div>
          </Link>

          <Link
            to="/home"
            className="hidden items-center gap-2 text-sm font-semibold text-slate-500 transition hover:text-violet-700 sm:flex"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden border-b border-slate-200 bg-white">
        <div className="absolute -left-32 -top-32 h-80 w-80 rounded-full bg-violet-100/70 blur-3xl" />
        <div className="absolute -bottom-40 -right-20 h-96 w-96 rounded-full bg-fuchsia-100/60 blur-3xl" />

        <div className="relative mx-auto max-w-5xl px-6 py-16 text-center lg:px-8 lg:py-20">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-violet-100 text-violet-700 shadow-sm">
            <ShieldCheck className="h-8 w-8" />
          </div>

          <p className="text-xs font-bold uppercase tracking-[0.22em] text-violet-600">
            Child Safety & Protection
          </p>

          <h2 className="mt-3 font-serif text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
            Child Safety Standards
            <span className="block bg-gradient-to-r from-violet-600 to-fuchsia-600 bg-clip-text text-transparent">
              & CSAE Policy
            </span>
          </h2>

          <p className="mx-auto mt-6 max-w-2xl text-sm leading-7 text-slate-500 sm:text-base">
            AstroNarhari is committed to maintaining a safe and respectful
            platform. We have a zero-tolerance policy toward Child Sexual
            Abuse and Exploitation (CSAE) and any content or behavior that
            puts children at risk.
          </p>

          <div className="mt-6 text-xs font-medium text-slate-400">
            Last Updated: August 20, 2026
          </div>
        </div>
      </section>

      {/* Content */}
      <main className="mx-auto max-w-5xl px-6 py-12 lg:px-8 lg:py-16">
        <div className="space-y-8">
          {/* Zero Tolerance */}
          <section className="rounded-3xl border border-red-100 bg-white p-6 shadow-sm sm:p-8">
            <div className="flex items-start gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-red-50 text-red-600">
                <Ban className="h-5 w-5" />
              </div>

              <div>
                <h3 className="text-xl font-bold text-slate-900">
                  1. Zero-Tolerance Policy
                </h3>

                <p className="mt-3 text-sm leading-7 text-slate-600">
                  AstroNarhari has a strict zero-tolerance policy towards
                  Child Sexual Abuse and Exploitation (CSAE). We strictly
                  prohibit Child Sexual Abuse Material (CSAM), child
                  exploitation, grooming, sexualization of minors, or any
                  other behavior that sexually exploits or endangers children.
                </p>

                <p className="mt-3 text-sm leading-7 text-slate-600">
                  This policy applies to all areas of our platform, including
                  user profiles, text communication, audio calls, video calls,
                  images, uploaded content, and any other form of interaction
                  facilitated through our services.
                </p>
              </div>
            </div>
          </section>

          {/* Prohibited Content */}
          <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
            <div className="flex items-start gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-violet-50 text-violet-700">
                <AlertTriangle className="h-5 w-5" />
              </div>

              <div className="flex-1">
                <h3 className="text-xl font-bold text-slate-900">
                  2. Prohibited Content and Behavior
                </h3>

                <p className="mt-3 text-sm leading-7 text-slate-600">
                  The following activities are strictly prohibited on
                  AstroNarhari:
                </p>

                <div className="mt-5 grid gap-3 sm:grid-cols-2">
                  {[
                    "Creating, uploading, sharing, or distributing CSAM.",
                    "Sexual exploitation or abuse of children.",
                    "Sexualization of minors in any form.",
                    "Grooming or attempting to groom a child.",
                    "Soliciting sexual content from minors.",
                    "Using the platform to facilitate child exploitation.",
                    "Sharing links or material that facilitate child abuse.",
                    "Any attempt to circumvent our child-safety protections.",
                  ].map((item, index) => (
                    <div
                      key={index}
                      className="flex gap-3 rounded-xl border border-slate-100 bg-slate-50 p-4"
                    >
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-violet-600" />
                      <p className="text-sm leading-6 text-slate-600">{item}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* Enforcement */}
          <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
            <div className="flex items-start gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
                <Scale className="h-5 w-5" />
              </div>

              <div>
                <h3 className="text-xl font-bold text-slate-900">
                  3. Enforcement and Account Actions
                </h3>

                <p className="mt-3 text-sm leading-7 text-slate-600">
                  We take reports and signals related to child safety
                  seriously. When we identify or receive credible reports of
                  CSAE-related activity, we may take immediate action,
                  including investigation, removal of violating content,
                  suspension, or permanent termination of the responsible
                  account.
                </p>

                <p className="mt-3 text-sm leading-7 text-slate-600">
                  Accounts involved in serious violations may be permanently
                  banned without prior notice where necessary to protect users
                  and maintain platform safety.
                </p>
              </div>
            </div>
          </section>

          {/* Reporting */}
          <section className="rounded-3xl border border-violet-200 bg-gradient-to-br from-violet-50 to-white p-6 shadow-sm sm:p-8">
            <div className="flex items-start gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-violet-600 text-white shadow-lg shadow-violet-200">
                <Flag className="h-5 w-5" />
              </div>

              <div className="flex-1">
                <h3 className="text-xl font-bold text-slate-900">
                  4. Reporting Child Safety Concerns
                </h3>

                <p className="mt-3 text-sm leading-7 text-slate-600">
                  If you encounter content, behavior, or activity that may
                  involve child sexual abuse or exploitation, please report it
                  immediately. Users may report concerns through available
                  reporting features within the application or contact our
                  dedicated Child Safety Team directly.
                </p>

                <div className="mt-6 rounded-2xl border border-violet-100 bg-white p-5">
                  <div className="flex items-center gap-3">
                    <Mail className="h-5 w-5 text-violet-600" />

                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                        Child Safety Contact
                      </p>

                      <a
                        href="mailto:safety@astronarhari.com"
                        className="mt-1 block text-sm font-bold text-violet-700 hover:text-violet-900"
                      >
                        safety@astronarhari.com
                      </a>
                    </div>
                  </div>
                </div>

                <p className="mt-4 text-xs leading-6 text-slate-500">
                  When submitting a report, please provide as much relevant
                  information as possible so that we can properly assess and
                  respond to the concern.
                </p>
              </div>
            </div>
          </section>

          {/* Law Enforcement */}
          <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
            <div className="flex items-start gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                <Users className="h-5 w-5" />
              </div>

              <div>
                <h3 className="text-xl font-bold text-slate-900">
                  5. Cooperation With Authorities
                </h3>

                <p className="mt-3 text-sm leading-7 text-slate-600">
                  Where required by applicable law, or where we reasonably
                  believe that a child may be at risk of abuse or exploitation,
                  we may preserve relevant information and cooperate with
                  appropriate law enforcement authorities and recognized child
                  safety organizations.
                </p>

                <p className="mt-3 text-sm leading-7 text-slate-600">
                  Where legally applicable and appropriate, reports may be
                  submitted to relevant authorities or child-safety
                  organizations, including organizations such as the National
                  Center for Missing & Exploited Children (NCMEC).
                </p>
              </div>
            </div>
          </section>

          {/* Platform Safety */}
          <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
            <div className="flex items-start gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                <LockKeyhole className="h-5 w-5" />
              </div>

              <div>
                <h3 className="text-xl font-bold text-slate-900">
                  6. Child Safety and Platform Protection
                </h3>

                <p className="mt-3 text-sm leading-7 text-slate-600">
                  AstroNarhari continuously works to maintain a safe
                  environment for all users. We may use appropriate moderation,
                  reporting, review, and account-enforcement mechanisms to
                  identify and address activity that violates our policies.
                </p>

                <p className="mt-3 text-sm leading-7 text-slate-600">
                  Our platform does not permit users to use our services for
                  activities involving the sexual exploitation or abuse of
                  children.
                </p>
              </div>
            </div>
          </section>

          {/* Contact */}
          <section className="rounded-3xl bg-slate-900 p-7 text-white shadow-xl sm:p-10">
            <div className="max-w-3xl">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-violet-300">
                Need Help?
              </p>

              <h3 className="mt-3 font-serif text-3xl font-bold">
                Contact our Child Safety Team
              </h3>

              <p className="mt-4 text-sm leading-7 text-slate-300">
                For child safety concerns, suspected CSAE activity, or
                questions regarding this policy, please contact our dedicated
                team.
              </p>

              <a
                href="mailto:safety@astronarhari.com"
                className="mt-6 inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-bold text-slate-900 transition hover:bg-violet-50"
              >
                <Mail className="h-4 w-4" />
                Admin@namahastro.com
              </a>
            </div>
          </section>

          {/* Disclaimer */}
          <div className="rounded-2xl border border-slate-200 bg-slate-100 p-5">
            <p className="text-xs leading-6 text-slate-500">
              <strong className="text-slate-700">Important:</strong> This
              Child Safety Standards & CSAE Policy forms part of AstroNarhari's
              broader safety and responsible-use framework. We may update this
              policy from time to time to reflect changes in our services,
              applicable laws, or child-safety best practices.
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white">
        <div className="mx-auto flex max-w-5xl flex-col gap-3 px-6 py-8 text-center sm:flex-row sm:items-center sm:justify-between sm:text-left lg:px-8">
          <p className="text-xs text-slate-400">
            © {new Date().getFullYear()} AstroNarhari. All rights reserved.
          </p>

          <div className="flex justify-center gap-5 text-xs font-medium text-slate-500 sm:justify-end">
            <Link
              to="/privacy-policy"
              className="transition hover:text-violet-700"
            >
              Privacy Policy
            </Link>

            <Link
              to="/terms"
              className="transition hover:text-violet-700"
            >
              Terms & Conditions
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default ChildSafety;