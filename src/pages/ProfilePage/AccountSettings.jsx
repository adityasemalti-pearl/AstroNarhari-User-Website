import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Bell,
  Sun,
  Mail,
  Languages,
  Palette,
  ShieldCheck,
  FileText,
  Lock,
  Info,
  ChevronRight,
} from "lucide-react";

function Toggle({ checked, onChange }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={`relative h-7 w-12 rounded-full transition-colors shrink-0 ${
        checked ? "bg-purple-700" : "bg-slate-200"
      }`}
    >
      <motion.span
        layout
        transition={{ type: "spring", stiffness: 500, damping: 32 }}
        className="absolute top-1 h-5 w-5 rounded-full bg-white shadow"
        style={{ left: checked ? 26 : 4 }}
      />
    </button>
  );
}

function Row({ icon: Icon, title, subtitle, right, onClick }) {
  const Wrapper = onClick ? "button" : "div";
  return (
    <Wrapper
      type={onClick ? "button" : undefined}
      onClick={onClick}
      className={`w-full flex items-center gap-4 py-4 ${
        onClick ? "hover:bg-purple-50/60 -mx-3 px-3 rounded-xl transition-colors text-left" : ""
      }`}
    >
      <div className="h-10 w-10 rounded-xl bg-purple-50 flex items-center justify-center shrink-0">
        <Icon size={17} className="text-purple-600" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-slate-800">{title}</p>
        {subtitle && <p className="text-xs text-slate-500 mt-0.5">{subtitle}</p>}
      </div>
      {right}
    </Wrapper>
  );
}

function SectionCard({ label, children }) {
  return (
    <div className="rounded-3xl bg-white border border-purple-100 shadow-lg p-7">
      <h3 className="text-xs font-bold uppercase tracking-[2.5px] text-purple-700 mb-2">
        {label}
      </h3>
      <div className="divide-y divide-slate-100">{children}</div>
    </div>
  );
}

export default function AccountSettings() {
  const [notifications, setNotifications] = useState({
    push: true,
    horoscope: true,
    newsletter: false,
  });

  return (
    <div className="space-y-6 max-w-3xl my-10 mx-auto">

        <h1 className="text-5xl text-center font-sans font-bold text-purple-700">
            Account Settings
        </h1>
      <SectionCard label="Notifications">
        <Row
          icon={Bell}
          title="Push Notifications"
          subtitle="System alerts and general updates"
          right={
            <Toggle
              checked={notifications.push}
              onChange={(v) => setNotifications((p) => ({ ...p, push: v }))}
            />
          }
        />
        <Row
          icon={Sun}
          title="Daily Horoscope Alerts"
          subtitle="Receive your cosmic forecast every morning"
          right={
            <Toggle
              checked={notifications.horoscope}
              onChange={(v) => setNotifications((p) => ({ ...p, horoscope: v }))}
            />
          }
        />
        <Row
          icon={Mail}
          title="Email Newsletters"
          subtitle="Deep dives into planetary transits"
          right={
            <Toggle
              checked={notifications.newsletter}
              onChange={(v) => setNotifications((p) => ({ ...p, newsletter: v }))}
            />
          }
        />
      </SectionCard>

      <SectionCard label="App Preferences">
        <Row
          icon={Languages}
          title="App Language"
          subtitle="English"
          right={<ChevronRight size={16} className="text-slate-300" />}
          onClick={() => {}}
        />
        <Row
          icon={Palette}
          title="Theme"
          subtitle="System default (light)"
          right={<ChevronRight size={16} className="text-slate-300" />}
          onClick={() => {}}
        />
        <Row
          icon={ShieldCheck}
          title="Consultation Privacy"
          subtitle="Manage your chat visibility"
          right={<ChevronRight size={16} className="text-slate-300" />}
          onClick={() => {}}
        />
      </SectionCard>

      <SectionCard label="Legal & About">
        <Row
          icon={FileText}
          title="Terms of Service"
          right={<ChevronRight size={16} className="text-slate-300" />}
          onClick={() => {}}
        />
        <Row
          icon={Lock}
          title="Privacy Policy"
          right={<ChevronRight size={16} className="text-slate-300" />}
          onClick={() => {}}
        />
        <Row icon={Info} title="App Version" subtitle="2.4.0 (Build Oct 2023)" />
      </SectionCard>

      <button
        type="button"
        className="w-full rounded-2xl border-2 border-rose-100 text-rose-600 font-semibold text-sm py-4 hover:bg-rose-50 transition-colors"
      >
        Log Out
      </button>
    </div>
  );
}