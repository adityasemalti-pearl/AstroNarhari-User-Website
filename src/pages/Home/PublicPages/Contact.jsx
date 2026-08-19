import React, { useState } from "react";
import {
  Mail,
  Phone,
  MapPin,
  Clock3,
  Send,
  Sparkles,
  MessageCircle,
  CheckCircle2,
} from "lucide-react";

export default function ContactUs() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);

    setTimeout(() => {
      setSubmitted(false);
      setForm({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
      });
    }, 3000);
  };

  const contactCards = [
    {
      icon: <Mail size={23} />,
      title: "Email Us",
      value: "admin@namahastro.com",
      description: "Send us your questions anytime.",
    },
    // {
    //   icon: <Phone size={23} />,
    //   title: "Call Us",
    //   value: "+91 98765 43210",
    //   description: "Available Monday to Saturday.",
    // },
    {
      icon: <Clock3 size={23} />,
      title: "Working Hours",
      value: "24 x 7",
      description: "Monday to Saturday.",
    },
    // {
    //   icon: <MapPin size={23} />,
    //   title: "Our Office",
    //   value: "Dehradun, Uttarakhand",
    //   description: "India",
    // },
  ];

  return (
    <div className="min-h-screen bg-[#FAFAFC] text-slate-800">

      {/* HERO */}
      <section className="relative overflow-hidden bg-gradient-to-br from-violet-950 via-purple-900 to-fuchsia-900 text-white">

        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -left-40 -top-40 h-[450px] w-[450px] rounded-full bg-purple-500/20 blur-3xl" />
          <div className="absolute -bottom-40 -right-40 h-[450px] w-[450px] rounded-full bg-fuchsia-500/20 blur-3xl" />
          <div className="absolute left-1/2 top-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/10" />
          <div className="absolute left-1/2 top-1/2 h-[350px] w-[350px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/10" />
        </div>

        <div className="relative mx-auto max-w-7xl px-6 py-24 text-center sm:px-8 lg:px-12 lg:py-28">

          <div className="mx-auto mb-6 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm backdrop-blur">
            <MessageCircle size={17} className="text-purple-200" />
            We're Here to Help
          </div>

          <h1 className="text-4xl font-bold leading-tight sm:text-5xl lg:text-6xl">
            Get in
            <span className="text-purple-200"> Touch</span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-base leading-8 text-purple-100 sm:text-lg">
            Have a question, suggestion, or need assistance? Our team is here
            to help you make your Namah-Astro experience smooth and meaningful.
          </p>

        </div>
      </section>

      {/* CONTACT CARDS */}
      <section className="relative z-10 mx-auto -mt-10 max-w-7xl px-6 sm:px-8 lg:px-12">

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">

          {contactCards.map((card) => (
            <div
              key={card.title}
              className="rounded-3xl border border-purple-100 bg-white p-6 shadow-xl shadow-purple-900/5 transition duration-300 hover:-translate-y-1 hover:shadow-2xl"
            >

              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-purple-50 text-purple-700">
                {card.icon}
              </div>

              <h3 className="mt-5 text-lg font-bold text-slate-900">
                {card.title}
              </h3>

              <p className="mt-2 break-words text-sm font-semibold text-purple-700">
                {card.value}
              </p>

              <p className="mt-2 text-xs leading-5 text-slate-500">
                {card.description}
              </p>

            </div>
          ))}

        </div>
      </section>

      {/* MAIN CONTACT SECTION */}
      <section className="mx-auto max-w-7xl px-6 py-20 sm:px-8 lg:px-12">

        <div className="grid gap-12 lg:grid-cols-[0.85fr_1.15fr]">

          {/* LEFT CONTENT */}
          <div>

            <div className="mb-4 inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-purple-700">
              <Sparkles size={17} />
              Contact Namah-Astro
            </div>

            <h2 className="text-3xl font-bold leading-tight text-slate-900 sm:text-4xl">
              Let's Start a
              <span className="text-purple-700"> Conversation</span>
            </h2>

            <p className="mt-6 leading-8 text-slate-600">
              Whether you need help with your account, consultation,
              astrologer booking, payment, or simply want to share feedback,
              we'd love to hear from you.
            </p>

            <div className="mt-8 space-y-5">

              <div className="flex items-start gap-4 rounded-2xl border border-purple-100 bg-purple-50/60 p-5">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white text-purple-700 shadow-sm">
                  <MessageCircle size={20} />
                </div>

                <div>
                  <h4 className="font-bold text-slate-900">
                    Need consultation help?
                  </h4>
                  <p className="mt-1 text-sm leading-6 text-slate-500">
                    Our support team can help you with bookings, astrologer
                    selection and consultation-related questions.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 rounded-2xl border border-purple-100 bg-white p-5 shadow-sm">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-purple-50 text-purple-700">
                  <Mail size={20} />
                </div>

                <div>
                  <h4 className="font-bold text-slate-900">
                    Email Support
                  </h4>
                  <p className="mt-1 text-sm leading-6 text-slate-500">
                    For detailed queries, reach us at
                    <span className="font-semibold text-purple-700">
                      {" "}admin@namahastro.com
                    </span>
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 rounded-2xl border border-purple-100 bg-white p-5 shadow-sm">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-purple-50 text-purple-700">
                  <Clock3 size={20} />
                </div>

                <div>
                  <h4 className="font-bold text-slate-900">
                    Quick Response
                  </h4>
                  <p className="mt-1 text-sm leading-6 text-slate-500">
                    Our support team generally responds within 24 business
                    hours.
                  </p>
                </div>
              </div>

            </div>
          </div>

          {/* FORM */}
          <div className="rounded-[32px] border border-purple-100 bg-white p-6 shadow-xl sm:p-8">

            {submitted ? (
              <div className="flex min-h-[500px] flex-col items-center justify-center text-center">

                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-green-50 text-green-600">
                  <CheckCircle2 size={42} />
                </div>

                <h2 className="mt-6 text-2xl font-bold text-slate-900">
                  Message Sent!
                </h2>

                <p className="mt-3 max-w-sm text-sm leading-6 text-slate-500">
                  Thank you for contacting Namah-Astro. Our team will get back
                  to you as soon as possible.
                </p>

              </div>
            ) : (
              <>
                <div className="mb-7">
                  <h2 className="text-2xl font-bold text-slate-900">
                    Send Us a Message
                  </h2>

                  <p className="mt-2 text-sm text-slate-500">
                    Fill in the details below and we'll get back to you.
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">

                  <div className="grid gap-5 sm:grid-cols-2">

                    <div>
                      <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-500">
                        Full Name
                      </label>

                      <input
                        type="text"
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        placeholder="Enter your name"
                        required
                        className="w-full rounded-2xl border border-purple-100 bg-purple-50/30 px-4 py-3.5 text-sm outline-none transition focus:border-purple-400 focus:bg-white focus:ring-4 focus:ring-purple-100"
                      />
                    </div>

                    <div>
                      <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-500">
                        Email Address
                      </label>

                      <input
                        type="email"
                        name="email"
                        value={form.email}
                        onChange={handleChange}
                        placeholder="Enter your email"
                        required
                        className="w-full rounded-2xl border border-purple-100 bg-purple-50/30 px-4 py-3.5 text-sm outline-none transition focus:border-purple-400 focus:bg-white focus:ring-4 focus:ring-purple-100"
                      />
                    </div>

                  </div>

                  <div className="grid gap-5 sm:grid-cols-2">

                    <div>
                      <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-500">
                        Phone Number
                      </label>

                      <input
                        type="tel"
                        name="phone"
                        value={form.phone}
                        onChange={handleChange}
                        placeholder="+91 XXXXX XXXXX"
                        className="w-full rounded-2xl border border-purple-100 bg-purple-50/30 px-4 py-3.5 text-sm outline-none transition focus:border-purple-400 focus:bg-white focus:ring-4 focus:ring-purple-100"
                      />
                    </div>

                    <div>
                      <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-500">
                        Subject
                      </label>

                      <select
                        name="subject"
                        value={form.subject}
                        onChange={handleChange}
                        required
                        className="w-full rounded-2xl border border-purple-100 bg-purple-50/30 px-4 py-3.5 text-sm outline-none transition focus:border-purple-400 focus:bg-white focus:ring-4 focus:ring-purple-100"
                      >
                        <option value="">Select subject</option>
                        <option value="account">Account Help</option>
                        <option value="booking">Booking Support</option>
                        <option value="payment">Payment Issue</option>
                        <option value="astrologer">Astrologer Related</option>
                        <option value="feedback">Feedback</option>
                        <option value="other">Other</option>
                      </select>
                    </div>

                  </div>

                  <div>
                    <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-500">
                      Message
                    </label>

                    <textarea
                      name="message"
                      value={form.message}
                      onChange={handleChange}
                      placeholder="Tell us how we can help..."
                      rows={6}
                      required
                      className="w-full resize-none rounded-2xl border border-purple-100 bg-purple-50/30 px-4 py-3.5 text-sm outline-none transition focus:border-purple-400 focus:bg-white focus:ring-4 focus:ring-purple-100"
                    />
                  </div>

                  <button
                    type="submit"
                    className="flex h-14 w-full items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-violet-700 via-purple-700 to-fuchsia-700 font-semibold text-white shadow-lg shadow-purple-500/20 transition hover:-translate-y-0.5 hover:shadow-xl"
                  >
                    <Send size={19} />
                    Send Message
                  </button>

                </form>
              </>
            )}

          </div>
        </div>
      </section>

      {/* FAQ / SUPPORT */}
      <section className="bg-purple-50 px-6 py-20 sm:px-8 lg:px-12">

        <div className="mx-auto max-w-4xl text-center">

          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-purple-100 text-purple-700">
            <Sparkles size={22} />
          </div>

          <h2 className="mt-5 text-3xl font-bold text-slate-900">
            We're Always Happy to Help
          </h2>

          <p className="mt-4 text-sm leading-7 text-slate-500">
            From choosing the right astrologer to resolving account and
            booking questions, our team is here to make your experience better.
          </p>

          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">

            <a
              href="mailto:admin@namahastro.com"
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-purple-700 px-6 py-3 font-semibold text-white transition hover:bg-purple-800"
            >
              <Mail size={18} />
              Email Support
            </a>

            {/* <a
              href="tel:+919876543210"
              className="inline-flex items-center justify-center gap-2 rounded-2xl border border-purple-200 bg-white px-6 py-3 font-semibold text-purple-700 transition hover:bg-purple-100"
            >
              <Phone size={18} />
              Call Support
            </a> */}

          </div>

        </div>
      </section>

    </div>
  );
}