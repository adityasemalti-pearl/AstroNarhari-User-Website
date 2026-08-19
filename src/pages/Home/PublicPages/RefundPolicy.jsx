import React from "react";
import { ArrowLeft, ShieldCheck, CreditCard, Clock3, AlertCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function RefundPolicy() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#FAFAFC] text-slate-800 font-sans">

      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-purple-100 bg-white/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-10">
          
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-sm font-medium text-slate-600 transition hover:text-purple-700"
          >
            <ArrowLeft size={18} />
            Back
          </button>

          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-purple-100 to-violet-50 border border-purple-200 text-purple-600">
              ✦
            </div>

            <span className="font-serif text-lg font-bold tracking-wide text-slate-900">
              Namah-Astro
            </span>
          </div>

          <div className="w-16" />
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden bg-white">
        <div className="absolute left-1/2 top-0 h-[450px] w-[700px] -translate-x-1/2 rounded-full bg-purple-200/30 blur-[100px]" />

        <div className="relative mx-auto max-w-4xl px-6 py-20 text-center lg:py-24">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-purple-50 text-purple-600 shadow-sm">
            <CreditCard size={30} />
          </div>

          <p className="mb-3 text-xs font-bold uppercase tracking-[0.3em] text-purple-600">
            Namah-Astro
          </p>

          <h1 className="font-serif text-4xl font-bold tracking-tight text-slate-950 sm:text-5xl">
            Refund Policy
          </h1>

          <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-slate-500 sm:text-base">
            We want every consultation experience on Namah-Astro to be
            transparent, reliable, and fair. This policy explains when refunds
            may be available for our services.
          </p>

          <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-purple-100 bg-purple-50 px-4 py-2 text-xs font-medium text-purple-700">
            <Clock3 size={14} />
            Last Updated: August 2026
          </div>
        </div>
      </section>

      {/* Content */}
      <main className="mx-auto max-w-5xl px-6 py-12 lg:px-10 lg:py-16">

        {/* Important Notice */}
        <div className="mb-10 rounded-3xl border border-purple-200 bg-gradient-to-r from-purple-50 to-violet-50 p-6 sm:p-8">
          <div className="flex gap-4">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white text-purple-600 shadow-sm">
              <ShieldCheck size={22} />
            </div>

            <div>
              <h3 className="font-semibold text-slate-900">
                Our Refund Commitment
              </h3>

              <p className="mt-2 text-sm leading-6 text-slate-600">
                Refund requests are reviewed on a case-by-case basis. If a
                service could not be delivered due to a technical issue or
                circumstances attributable to Namah-Astro, we will make
                reasonable efforts to resolve the issue or provide an
                appropriate refund.
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-8">

          {/* 1 */}
          <section className="rounded-3xl border border-purple-100 bg-white p-6 shadow-sm sm:p-8">
            <h2 className="text-xl font-bold text-slate-900">
              1. General Refund Policy
            </h2>

            <p className="mt-4 text-sm leading-7 text-slate-600">
              Payments made on Namah-Astro are generally made for specific
              astrology consultation services, including live chat, voice
              calls, video consultations, and other paid services available
              through the platform.
            </p>

            <p className="mt-3 text-sm leading-7 text-slate-600">
              Once a consultation has been successfully completed, the payment
              is generally non-refundable.
            </p>
          </section>

          {/* 2 */}
          <section className="rounded-3xl border border-purple-100 bg-white p-6 shadow-sm sm:p-8">
            <h2 className="text-xl font-bold text-slate-900">
              2. Eligible Refund Situations
            </h2>

            <p className="mt-4 text-sm leading-7 text-slate-600">
              A refund or adjustment may be considered in situations such as:
            </p>

            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              {[
                "Payment was successfully deducted but the consultation could not be started.",
                "A technical problem on our platform prevented the service from being delivered.",
                "The same transaction was charged more than once due to a technical error.",
                "A scheduled consultation was cancelled by the astrologer and could not be rescheduled.",
                "An incorrect amount was charged due to a system or payment processing issue.",
                "Other exceptional circumstances approved by Namah-Astro support."
              ].map((item, index) => (
                <div
                  key={index}
                  className="flex gap-3 rounded-2xl bg-purple-50/60 p-4"
                >
                  <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-purple-100 text-xs font-bold text-purple-700">
                    {index + 1}
                  </span>

                  <p className="text-sm leading-6 text-slate-600">
                    {item}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* 3 */}
          <section className="rounded-3xl border border-purple-100 bg-white p-6 shadow-sm sm:p-8">
            <h2 className="text-xl font-bold text-slate-900">
              3. Non-Refundable Situations
            </h2>

            <p className="mt-4 text-sm leading-7 text-slate-600">
              Refunds may generally not be provided in the following cases:
            </p>

            <ul className="mt-5 space-y-3">
              {[
                "The consultation has already been completed successfully.",
                "The user voluntarily ends a consultation after it has started.",
                "The user does not attend a scheduled consultation without prior cancellation.",
                "The user changes their mind after receiving the service.",
                "The user provides incorrect information that affects the consultation.",
                "The request is based solely on dissatisfaction with an astrologer's opinion or prediction."
              ].map((item, index) => (
                <li
                  key={index}
                  className="flex items-start gap-3 text-sm leading-6 text-slate-600"
                >
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-purple-500" />
                  {item}
                </li>
              ))}
            </ul>
          </section>

          {/* 4 */}
          <section className="rounded-3xl border border-purple-100 bg-white p-6 shadow-sm sm:p-8">
            <h2 className="text-xl font-bold text-slate-900">
              4. Failed or Interrupted Consultation
            </h2>

            <p className="mt-4 text-sm leading-7 text-slate-600">
              If a consultation is interrupted because of a technical issue,
              users should contact our support team as soon as possible.
              Depending on the circumstances, Namah-Astro may offer a
              replacement session, wallet credit, partial refund, or full
              refund.
            </p>
          </section>

          {/* 5 */}
          <section className="rounded-3xl border border-purple-100 bg-white p-6 shadow-sm sm:p-8">
            <h2 className="text-xl font-bold text-slate-900">
              5. Refund Request Process
            </h2>

            <p className="mt-4 text-sm leading-7 text-slate-600">
              To request a refund, please contact our support team with the
              following information:
            </p>

            <div className="mt-5 space-y-3">
              {[
                "Registered mobile number or email address",
                "Transaction or booking ID",
                "Date and time of the transaction",
                "Reason for requesting the refund",
                "Relevant screenshots or payment details, if applicable"
              ].map((item, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 rounded-xl border border-slate-100 bg-slate-50 px-4 py-3"
                >
                  <div className="flex h-7 w-7 items-center justify-center rounded-full bg-purple-100 text-xs font-bold text-purple-700">
                    {index + 1}
                  </div>

                  <span className="text-sm text-slate-600">
                    {item}
                  </span>
                </div>
              ))}
            </div>
          </section>

          {/* 6 */}
          <section className="rounded-3xl border border-purple-100 bg-white p-6 shadow-sm sm:p-8">
            <h2 className="text-xl font-bold text-slate-900">
              6. Refund Processing Time
            </h2>

            <p className="mt-4 text-sm leading-7 text-slate-600">
              Once a refund is approved, the refund will be initiated through
              the applicable payment method. The time taken for the amount to
              appear in your account may depend on the payment gateway, bank,
              card issuer, or other financial institution.
            </p>

            <div className="mt-5 flex items-start gap-3 rounded-2xl bg-purple-50 p-4">
              <Clock3 className="mt-0.5 shrink-0 text-purple-600" size={20} />

              <p className="text-sm leading-6 text-purple-800">
                Processing times may vary depending on the payment method and
                financial institution involved.
              </p>
            </div>
          </section>

          {/* 7 */}
          <section className="rounded-3xl border border-purple-100 bg-white p-6 shadow-sm sm:p-8">
            <h2 className="text-xl font-bold text-slate-900">
              7. Wallet Credits
            </h2>

            <p className="mt-4 text-sm leading-7 text-slate-600">
              In certain situations, Namah-Astro may provide wallet credit
              instead of returning the amount to the original payment method.
              Any such resolution will be communicated to the user before the
              credit is issued.
            </p>
          </section>

          {/* 8 */}
          <section className="rounded-3xl border border-purple-100 bg-white p-6 shadow-sm sm:p-8">
            <h2 className="text-xl font-bold text-slate-900">
              8. Payment Gateway Charges
            </h2>

            <p className="mt-4 text-sm leading-7 text-slate-600">
              Where applicable, payment gateway or transaction processing
              charges may be non-refundable, depending on the payment
              provider's policies and the nature of the transaction.
            </p>
          </section>

          {/* 9 */}
          <section className="rounded-3xl border border-purple-100 bg-white p-6 shadow-sm sm:p-8">
            <h2 className="text-xl font-bold text-slate-900">
              9. Policy Changes
            </h2>

            <p className="mt-4 text-sm leading-7 text-slate-600">
              Namah-Astro reserves the right to update or modify this Refund
              Policy from time to time. Any updated policy will be published
              on this page with the revised effective date.
            </p>
          </section>

          {/* Contact */}
          <section className="rounded-3xl bg-gradient-to-br from-purple-700 via-violet-700 to-fuchsia-700 p-8 text-white shadow-xl">
            <div className="flex items-start gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/15">
                <AlertCircle size={22} />
              </div>

              <div>
                <h2 className="text-xl font-bold">
                  Need Help With a Refund?
                </h2>

                <p className="mt-2 text-sm leading-6 text-purple-100">
                  If you believe you are eligible for a refund or have a
                  payment-related issue, our support team is here to help.
                </p>

                <a
                  href="mailto:Admin@namahastro.com"
                  className="mt-5 inline-flex rounded-xl bg-white px-5 py-3 text-sm font-semibold text-purple-700 transition hover:bg-purple-50"
                >
                  Admin@namahastro.com
                </a>
              </div>
            </div>
          </section>

        </div>

        {/* Footer */}
        <div className="mt-12 border-t border-purple-100 pt-6 text-center">
          <p className="text-xs text-slate-400">
            © 2026 Namah-Astro. All rights reserved.
          </p>

          <p className="mt-2 text-xs text-slate-400">
            Made with ✦ for seekers across India
          </p>
        </div>

      </main>
    </div>
  );
}