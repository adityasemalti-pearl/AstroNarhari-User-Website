import React, { useState, useEffect, useRef, useMemo } from "react";


import {
    Sparkles,
    Heart,
    PhoneCall,
    MessageCircle,
    Sun,
    CalendarDays,
    Hash,
    Home,
    Gem,
    BookOpen,
    BadgeCheck,
    Zap,
    ShieldCheck,
    LockKeyhole,
    Target,
    Headphones,
    MessageSquare,
} from "lucide-react";

import {SERVICES,
ASTROLOGERS,
WHY,
STEPS,
TESTIMONIALS,
BLOGS,
PRICING,
FAQS} from './HomeData'

/* ================= helpers ================= */
import './HomePage.css'
function useInView(threshold = 0.15) {
    const ref = useRef(null);
    const [inView, setInView] = useState(false);
    useEffect(() => {
        const el = ref.current;
        if (!el) return;
        const io = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setInView(true);
                        io.unobserve(el);
                    }
                });
            },
            { threshold }
        );
        io.observe(el);
        return () => io.disconnect();
    }, [threshold]);
    return [ref, inView];
}

function Reveal({ children, stagger = false, className = "", style }) {
    const [ref, inView] = useInView(0.12);
    return (
        <div
            ref={ref}
            className={`${stagger ? "reveal-stagger" : "reveal"} ${inView ? "in" : ""} ${className}`}
            style={style}
        >
            {children}
        </div>
    );
}

function StatCounter({ target, decimal, suffix = "", divide, label }) {
    const [ref, inView] = useInView(0.5);
    const [display, setDisplay] = useState(decimal ? "0.0" : "0");
    useEffect(() => {
        if (!inView) return;
        const duration = 1600;
        const start = performance.now();
        let raf;
        function tick(now) {
            const p = Math.min((now - start) / duration, 1);
            const eased = 1 - Math.pow(1 - p, 3);
            const val = target * eased;
            if (decimal) setDisplay(val.toFixed(1));
            else if (divide) setDisplay(Math.round(val / divide) + suffix);
            else setDisplay(Math.round(val) + suffix);
            if (p < 1) raf = requestAnimationFrame(tick);
        }
        raf = requestAnimationFrame(tick);
        return () => cancelAnimationFrame(raf);
    }, [inView, target, decimal, suffix, divide]);
    return (
        <div className="item" ref={ref}>
            <div className="num">{display}</div>
            <div className="lbl">{label}</div>
        </div>
    );
}

function StarField({ count = 130, className = "" }) {
    const stars = useMemo(
        () =>
            Array.from({ length: count }).map((_, i) => ({
                id: i,
                size: (Math.random() * 2 + 1).toFixed(1),
                top: (Math.random() * 100).toFixed(1),
                left: (Math.random() * 100).toFixed(1),
                dur: (Math.random() * 3 + 2).toFixed(1),
                delay: (Math.random() * 5).toFixed(1),
            })),
        [count]
    );
    return (
        <div className={`stars ${className}`}>
            {stars.map((s) => (
                <div
                    key={s.id}
                    className="star"
                    style={{
                        width: `${s.size}px`,
                        height: `${s.size}px`,
                        top: `${s.top}%`,
                        left: `${s.left}%`,
                        animationDuration: `${s.dur}s`,
                        animationDelay: `${s.delay}s`,
                    }}
                />
            ))}
        </div>
    );
}

/* ================= data ================= */


/* ================= main component ================= */
import logo from '../../../assets/logo.png'
import { useNavigate } from "react-router-dom";
import BackToTop from "../comp/BackToTop";
import Header from "./HomeNavBar";
export default function AstroSetuLanding() {

    const [menuOpen, setMenuOpen] = useState(false);
    const [liveCount, setLiveCount] = useState(142);
    const [openFaq, setOpenFaq] = useState(0);
    const [testiIndex, setTestiIndex] = useState(0);
    const [testiPaused, setTestiPaused] = useState(false);
    const navigate = useNavigate()


    useEffect(() => {
        const id = setInterval(() => {
            setLiveCount(142 + Math.floor(Math.random() * 9) - 4);
        }, 4000);
        return () => clearInterval(id);
    }, []);

    useEffect(() => {
        if (testiPaused) return;
        const id = setInterval(() => {
            setTestiIndex((i) => (i + 1) % TESTIMONIALS.length);
        }, 5000);
        return () => clearInterval(id);
    }, [testiPaused]);

    const navLink = (href, label) => (
        <a href={href} onClick={() => setMenuOpen(false)}>
            {label}
        </a>
    );

    return (
        <div className="asx-root">


            {/* ============ HEADER ============ */}
            <Header
                menuOpen={menuOpen}
                setMenuOpen={setMenuOpen}
            />


            {/* ============ 1. HERO ============ */}
            <section className="hero" id="hero">
                <StarField count={130} />
                <div className="shooting-star" style={{ top: "12%" }} />
                <div className="shooting-star s2" />
                <div className="shooting-star s3" />
                <div className="planet" style={{ width: 70, height: 70, top: "14%", left: "6%", background: "radial-gradient(circle at 35% 30%, #E8CE7E, #7a5c10)" }} />
                <div className="planet" style={{ width: 34, height: 34, top: "68%", left: "12%", background: "radial-gradient(circle at 35% 30%, #C9AEFB, #4C1D95)", animationDelay: "1.4s" }} />

                <div className="zodiac-wheel">
                    <svg viewBox="0 0 400 400">
                        <circle cx="200" cy="200" r="188" fill="none" stroke="rgba(255,255,255,0.14)" strokeWidth="1" />
                        <circle cx="200" cy="200" r="150" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
                        <circle cx="200" cy="200" r="188" fill="none" stroke="url(#gradring)" strokeWidth="1.4" strokeDasharray="2 10" />
                        <defs>
                            <linearGradient id="gradring" x1="0" y1="0" x2="1" y2="1">
                                <stop offset="0%" stopColor="#C9A227" />
                                <stop offset="100%" stopColor="#7C3AED" />
                            </linearGradient>
                        </defs>
                        <g fill="rgba(255,255,255,0.75)" fontSize="20" fontFamily="Cormorant Garamond, serif" textAnchor="middle">
                            <text x="200" y="30">♈</text><text x="294" y="55">♉</text><text x="358" y="118">♊</text>
                            <text x="382" y="200">♋</text><text x="358" y="282">♌</text><text x="294" y="345">♍</text>
                            <text x="200" y="378">♎</text><text x="106" y="345">♏</text><text x="42" y="282">♐</text>
                            <text x="18" y="200">♑</text><text x="42" y="118">♒</text><text x="106" y="55">♓</text>
                        </g>
                    </svg>
                </div>

                <div className="wrap hero-grid">
                    <div>
                        <div className="live-badge">
                            <span className="pulse-dot" /> {liveCount} astrologers online right now
                        </div>
                        <h1>
                            Discover Your Destiny with <em>India's Trusted Astrologers</em>
                        </h1>
                        <p className="lead">
                            Get instant clarity on love, career, marriage & life through live call or chat with 500+ verified Vedic astrologers — private, accurate, and available 24×7.
                        </p>
                        <div className="hero-ctas">
                            <a href="/login" className="btn btn-primary"> Start Your Journey</a>
                            <a href="/login" className="btn btn-ghost"><MessageSquare/> Chat Now</a>
                        </div>
                        <div className="hero-trustline">
                            <div className="avatars">
                                <span style={{ background: "#7C3AED" }}>RS</span>
                                <span style={{ background: "#C9A227" }}>MJ</span>
                                <span style={{ background: "#9061F9" }}>VT</span>
                                <span style={{ background: "#4C1D95" }}>SD</span>
                            </div>
                            <span>Joined by 100,000+ people seeking guidance this year</span>
                        </div>
                    </div>

                    <div className="phone-stage">
                        <div className="float-chip chip-live"><span className="dot" /> Pt. Ramesh is online</div>
                        <div className="float-chip chip-rate">⭐ 4.9 · 12,400 reviews</div>
                        <div className="phone">
                            <div className="phone-notch" />
                            <div className="phone-screen">
                                <div className="phone-topbar">
                                    <div>
                                        <div className="name">Acharya Meena</div>
                                        <div className="sub">Vedic · Love & Career</div>
                                    </div>
                                    <div className="phone-avatar" />
                                </div>
                                <div className="chat-bubble them" style={{ animationDelay: ".2s" }}>Namaste 🙏 I see strong Jupiter influence in your 7th house this month.</div>
                                <div className="chat-bubble me" style={{ animationDelay: ".6s" }}>That explains a lot! What about my career?</div>
                                <div className="chat-bubble them" style={{ animationDelay: "1s" }}>Saturn transit favours new opportunities after the 14th ✨</div>
                                <div className="phone-card" style={{ animation: "bubbleIn .6s ease 1.4s both" }}>
                                    <div className="ic">🔮</div>
                                    <div><div className="t">Free Kundli Match</div><div className="s">Check compatibility instantly</div></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ============ 2. TRUSTED BY THOUSANDS ============ */}
            <div className="trustbar">
                <div className="wrap trust-grid">
                    <StatCounter target={4.9} decimal label="⭐ Average Rating" />
                    <StatCounter target={1000000} divide={1000000} suffix="M+" label="Consultations Completed" />
                    <StatCounter target={500} suffix="+" label="Verified Astrologers" />
                    <StatCounter target={100000} divide={1000} suffix="K+" label="Happy Users" />
                </div>
            </div>

            {/* ============ 3. SERVICES ============ */}
            <section className="section" id="services">
                <div className="wrap">
                    <Reveal className="section-head">
                        <span className="eyebrow">What We Offer</span>
                        <h2>One platform for every celestial answer</h2>
                        <p>From daily guidance to deep life predictions — everything rooted in authentic Vedic astrology.</p>
                    </Reveal>
                    <Reveal stagger className="services-grid">
                        {SERVICES.map((s) => {
                            const Icon = s.icon;

                            return (
                                <div className="service-card group" key={s.title}>
                                    <div className="service-icon">
                                        <Icon
                                            size={30}
                                            strokeWidth={2}
                                            className="text-purple-400 transition-transform duration-300 group-hover:scale-110"
                                        />
                                    </div>

                                    <h4>{s.title}</h4>
                                    <p>{s.desc}</p>
                                </div>
                            );
                        })}
                    </Reveal>
                </div>
            </section>

            {/* ============ 4. EXPERT ASTROLOGERS ============ */}
            <section className="section alt" id="astrologers">
                <div className="wrap">
                    <Reveal className="section-head">
                        <span className="eyebrow">Meet the Experts</span>
                        <h2>India's most trusted astrologers, one tap away</h2>
                        <p>Every astrologer is background-verified and rated by thousands of real users.</p>
                    </Reveal>
                    <Reveal stagger className="astro-grid">
                        {ASTROLOGERS.map((a) => (
                            <div className="astro-card" key={a.name}>
                                <div className="astro-top">
                                    <div className="astro-avatar" style={{ background: a.grad }}>
                                        {a.initials}
                                        <div className="ring" />
                                        <div className="online-dot" />
                                    </div>
                                    <div>
                                        <div className="astro-name">{a.name}</div>
                                        <div className="astro-exp">{a.exp}</div>
                                    </div>
                                </div>
                                <div className="astro-tags">
                                    {a.tags.map((t) => <span key={t}>{t}</span>)}
                                </div>
                                <div className="astro-meta">
                                    <div className="astro-rating">⭐ {a.rating} <span style={{ color: "var(--ink-faint)", fontWeight: 500 }}>({a.reviews})</span></div>
                                    <div className="astro-price">₹{a.price}/min</div>
                                </div>
                                <a href="" className="btn btn-primary">Talk Now</a>
                            </div>
                        ))}
                    </Reveal>
                    <div style={{ textAlign: "center", marginTop: 44 }}>
                        <a
                            href="/dashboard/astrologers" className="btn btn-outline">View All 500+ Astrologers</a>
                    </div>
                </div>
            </section>

            {/* ============ 5. WHY CHOOSE US ============ */}
            <section className="section" id="why">
                <div className="wrap">
                    <Reveal className="section-head">
                        <span className="eyebrow">Why Namah-Astro</span>
                        <h2>Guidance you can trust, delivered with care</h2>
                    </Reveal>
                    <Reveal stagger className="why-grid">
                        {WHY.map((w) => {
                            const Icon = w.icon;

                            return (
                                <div className="why-card group" key={w.title}>
                                    <div className="why-icon">
                                        <Icon
                                            size={30}
                                            strokeWidth={2}
                                            className="text-yellow-400 transition-all duration-300 group-hover:scale-110"
                                        />
                                    </div>

                                    <h4>{w.title}</h4>
                                    <p>{w.desc}</p>
                                </div>
                            );
                        })}
                    </Reveal>
                </div>
            </section>

            {/* ============ 6. HOW IT WORKS ============ */}
            <section className="section alt" id="how">
                <div className="wrap">
                    <Reveal className="section-head">
                        <span className="eyebrow">Getting Started</span>
                        <h2>Three steps to your first reading</h2>
                    </Reveal>
                    <Reveal stagger className="steps">
                        {STEPS.map((s) => (
                            <div className="step" key={s.num}>
                                <div className="stepnum">{s.num}</div>
                                <div className="step-line" />
                                <h4>{s.title}</h4>
                                <p>{s.desc}</p>
                            </div>
                        ))}
                    </Reveal>
                </div>
            </section>

            {/* ============ 7. KUNDLI PREVIEW ============ */}
            <section className="section" id="kundli">
                <div className="wrap">
                    <Reveal className="section-head">
                        <span className="eyebrow">Free Tool</span>
                        <h2>Generate your Kundli in seconds</h2>
                        <p>Enter your birth details to preview your personalised birth chart and horoscope.</p>
                    </Reveal>
                    <Reveal className="kundli-panel">
                        <div className="kundli-form">
                            <h3>Enter Birth Details</h3>
                            <p>Accurate to the minute for precise chart calculation.</p>
                            <div className="field"><label>Full Name</label><input type="text" placeholder="e.g. Aarav Sharma" /></div>
                            <div className="field-row">
                                <div className="field"><label>Date of Birth</label><input type="date" /></div>
                                <div className="field"><label>Time of Birth</label><input type="time" /></div>
                            </div>
                            <div className="field"><label>Place of Birth</label><input type="text" placeholder="e.g. Dehradun, Uttarakhand" /></div>
                            <a href="/dashboard/kundali" className="btn btn-primary" style={{ width: "100%", marginTop: 8 }}>Generate My Kundli</a>
                        </div>
                        <div className="kundli-visual">
                            <svg className="kundli-chart" viewBox="0 0 280 280">
                                <rect x="10" y="10" width="260" height="260" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="1.4" />
                                <line x1="10" y1="10" x2="270" y2="270" stroke="rgba(255,255,255,0.4)" strokeWidth="1.2" />
                                <line x1="270" y1="10" x2="10" y2="270" stroke="rgba(255,255,255,0.4)" strokeWidth="1.2" />
                                <line x1="140" y1="10" x2="10" y2="140" stroke="rgba(255,255,255,0.4)" strokeWidth="1.2" />
                                <line x1="10" y1="140" x2="140" y2="270" stroke="rgba(255,255,255,0.4)" strokeWidth="1.2" />
                                <line x1="140" y1="270" x2="270" y2="140" stroke="rgba(255,255,255,0.4)" strokeWidth="1.2" />
                                <line x1="270" y1="140" x2="140" y2="10" stroke="rgba(255,255,255,0.4)" strokeWidth="1.2" />
                                <g fill="#E8CE7E" fontSize="13" fontFamily="Space Mono, monospace" textAnchor="middle">
                                    <text x="140" y="55">Su Ma</text><text x="65" y="60">Ju</text><text x="215" y="60">Ve</text>
                                    <text x="45" y="145">Ra</text><text x="235" y="145">Ke</text>
                                    <text x="65" y="225">Sa</text><text x="215" y="225">Me</text><text x="140" y="235">Mo</text>
                                </g>
                            </svg>
                            <div className="horo-mini">
                                <span>♈</span><span>♉</span><span>♊</span><span>♋</span><span>♌</span><span>♍</span>
                            </div>
                        </div>
                    </Reveal>
                </div>
            </section>

            {/* ============ 8. TESTIMONIALS ============ */}
            <section className="section alt" id="testimonials">
                <div className="wrap">
                    <Reveal className="section-head">
                        <span className="eyebrow">Real Stories</span>
                        <h2>Loved by thousands across India</h2>
                    </Reveal>
                    <Reveal
                        className="testi-wrap"
                        style={{ position: "relative" }}
                    >
                        <div
                            onMouseEnter={() => setTestiPaused(true)}
                            onMouseLeave={() => setTestiPaused(false)}
                        >
                            <button className="testi-arrow prev" onClick={() => setTestiIndex((i) => (i - 1 + TESTIMONIALS.length) % TESTIMONIALS.length)}>←</button>
                            <button className="testi-arrow next" onClick={() => setTestiIndex((i) => (i + 1) % TESTIMONIALS.length)}>→</button>
                            <div className="testi-track">
                                <div className="testi-slides" style={{ transform: `translateX(-${testiIndex * 100}%)` }}>
                                    {TESTIMONIALS.map((t) => (
                                        <div className="testi-slide" key={t.name}>
                                            <div className="testi-card">
                                                <div className="testi-stars">★★★★★</div>
                                                <p className="testi-quote">"{t.quote}"</p>
                                                <div className="testi-person">
                                                    <div className="testi-avatar" style={{ background: t.bg }}>{t.initials}</div>
                                                    <div>
                                                        <div className="testi-name">{t.name}</div>
                                                        <div className="testi-loc">{t.loc}</div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="testi-dots">
                                {TESTIMONIALS.map((t, i) => (
                                    <button key={t.name} className={i === testiIndex ? "active" : ""} onClick={() => setTestiIndex(i)} />
                                ))}
                            </div>
                        </div>
                    </Reveal>
                </div>
            </section>

            {/* ============ 9. FEATURED BLOGS ============ */}
            <section className="section" id="blogs">
                <div className="wrap">
                    <Reveal className="section-head">
                        <span className="eyebrow">Astro Journal</span>
                        <h2>Read, learn & explore the stars</h2>
                    </Reveal>
                    <Reveal stagger className="blog-grid">
                        {BLOGS.map((b) => (
                            <div className="blog-card" key={b.title}>
                                <div className="blog-banner" style={{ background: b.grad }}>{b.icon}</div>
                                <div className="blog-body">
                                    <span className="blog-tag">{b.tag}</span>
                                    <h4>{b.title}</h4>
                                    <p>{b.read}</p>
                                </div>
                            </div>
                        ))}
                    </Reveal>
                </div>
            </section>

            {/* ============ 10. APP SCREENSHOTS ============ */}
            <section className="section alt" id="app">
                <div className="wrap">
                    <Reveal className="section-head">
                        <span className="eyebrow">Inside the App</span>
                        <h2>Everything you need, beautifully designed</h2>
                    </Reveal>
                    <Reveal className="appscreens-track">
                        <div className="mini-phone"><div className="mini-screen">
                            <div style={{ fontSize: 11, fontWeight: 700, color: "var(--purple-deep)", marginBottom: 10 }}>DASHBOARD</div>
                            <div className="phone-card" style={{ margin: "0 0 10px" }}><div className="ic">🔮</div><div><div className="t">Kundli</div><div className="s">View chart</div></div></div>
                            <div className="phone-card" style={{ margin: "0 0 10px" }}><div className="ic">📅</div><div><div className="t">Horoscope</div><div className="s">Today</div></div></div>
                            <div className="phone-card"><div className="ic">💰</div><div><div className="t">Wallet</div><div className="s">₹450 balance</div></div></div>
                            <div className="mini-label">Dashboard</div>
                        </div></div>
                        <div className="mini-phone"><div className="mini-screen">
                            <div className="chat-bubble them" style={{ margin: "0 0 8px" }}>Your 2nd house shows financial growth soon 💫</div>
                            <div className="chat-bubble me" style={{ margin: "0 0 0 auto" }}>Thank you! Any remedies?</div>
                            <div className="mini-label">Chat</div>
                        </div></div>
                        <div className="mini-phone"><div className="mini-screen" style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                            <div className="astro-avatar" style={{ background: "linear-gradient(135deg,#7C3AED,#4C1D95)", width: 80, height: 80, fontSize: 26 }}>RS</div>
                            <p style={{ marginTop: 14, fontWeight: 700 }}>Acharya Ramesh</p>
                            <p style={{ fontSize: 11, color: "var(--ink-faint)" }}>04:12 — In Call</p>
                            <div className="mini-label">Live Call</div>
                        </div></div>
                        <div className="mini-phone"><div className="mini-screen">
                            <svg viewBox="0 0 200 200" style={{ width: "100%" }}>
                                <rect x="8" y="8" width="184" height="184" fill="none" stroke="#7C3AED" strokeWidth="1.2" />
                                <line x1="8" y1="8" x2="192" y2="192" stroke="#7C3AED" strokeWidth="1" />
                                <line x1="192" y1="8" x2="8" y2="192" stroke="#7C3AED" strokeWidth="1" />
                                <line x1="100" y1="8" x2="8" y2="100" stroke="#7C3AED" strokeWidth="1" />
                                <line x1="8" y1="100" x2="100" y2="192" stroke="#7C3AED" strokeWidth="1" />
                                <line x1="100" y1="192" x2="192" y2="100" stroke="#7C3AED" strokeWidth="1" />
                                <line x1="192" y1="100" x2="100" y2="8" stroke="#7C3AED" strokeWidth="1" />
                            </svg>
                            <div className="mini-label">Kundli Chart</div>
                        </div></div>
                        <div className="mini-phone"><div className="mini-screen">
                            <div style={{ fontSize: 11, fontWeight: 700, color: "var(--purple-deep)", marginBottom: 10 }}>TODAY — ARIES</div>
                            <p style={{ fontSize: 12, color: "var(--ink-soft)", lineHeight: 1.6 }}>A favourable day for bold decisions. Trust your instincts in matters of career and love.</p>
                            <div className="mini-label">Horoscope</div>
                        </div></div>
                        <div className="mini-phone"><div className="mini-screen">
                            <div style={{ fontSize: 11, fontWeight: 700, color: "var(--purple-deep)", marginBottom: 10 }}>WALLET</div>
                            <div style={{ fontFamily: "Cormorant Garamond, serif", fontSize: 34, fontWeight: 700, color: "var(--purple-deep)" }}>₹450</div>
                            <p style={{ fontSize: 11, color: "var(--ink-faint)" }}>Available balance</p>
                            <div className="phone-card" style={{ marginTop: 16 }}><div className="ic">➕</div><div><div className="t">Add Money</div><div className="s">Instant recharge</div></div></div>
                            <div className="mini-label">Wallet</div>
                        </div></div>
                    </Reveal>
                </div>
            </section>

            {/* ============ 11. PRICING ============ */}
            <section className="section" id="pricing">
                <div className="wrap">
                    <Reveal className="section-head">
                        <span className="eyebrow">Recharge Plans</span>
                        <h2>Simple, transparent pricing</h2>
                        <p>Pay only for what you use. Bigger recharges unlock bonus talk-time.</p>
                    </Reveal>
                    <Reveal stagger className="price-grid">
                        {PRICING.map((p) => (
                            <div className={`price-card ${p.popular ? "popular" : ""}`} key={p.label}>
                                {p.popular && <div className="popular-tag">MOST POPULAR</div>}
                                <div style={{ fontSize: 13, color: p.popular ? "var(--purple-deep)" : "var(--ink-faint)", fontWeight: 700 }}>{p.label}</div>
                                <div className="price-amt">₹{p.price}</div>
                                <div className="price-bonus">{p.bonus}</div>
                                <a href="#" className={`btn ${p.popular ? "btn-primary" : "btn-outline"}`}>Recharge</a>
                            </div>
                        ))}
                    </Reveal>
                </div>
            </section>

            {/* ============ 12. FAQ ============ */}
            <section className="section alt" id="faq">
                <div className="wrap">
                    <Reveal className="section-head">
                        <span className="eyebrow">Questions & Answers</span>
                        <h2>Frequently asked questions</h2>
                    </Reveal>
                    <Reveal className="faq-list">
                        {FAQS.map((f, i) => (
                            <div className={`faq-item ${openFaq === i ? "open" : ""}`} key={f.q}>
                                <div className="faq-q" onClick={() => setOpenFaq(openFaq === i ? -1 : i)}>
                                    <h4>{f.q}</h4>
                                    <div className="faq-icon">+</div>
                                </div>
                                <div className="faq-a" style={{ maxHeight: openFaq === i ? 400 : 0 }}>
                                    <p>{f.a}</p>
                                </div>
                            </div>
                        ))}
                    </Reveal>
                </div>
            </section>

            {/* ============ 13. DOWNLOAD APP CTA ============ */}
            <section className="section" id="download">
                <div className="wrap">
                    <Reveal className="download-panel">
                        <StarField count={60} className="download-stars" />
                        <div style={{ position: "relative", zIndex: 1 }}>
                            <span className="eyebrow" style={{ color: "var(--gold-soft)" }}>Get The App</span>
                            <h2>Carry your astrologer in your pocket</h2>
                            <p>Download the Namah-Astro app for faster consultations, push notifications for daily horoscope, and exclusive app-only offers.</p>
                            <div className="store-btns">
                                <a href="#" className="store-btn"><span className="ic">▶</span><span className="txt"><small>GET IT ON</small><strong>Google Play</strong></span></a>
                                <a href="#" className="store-btn"><span className="ic"></span><span className="txt"><small>Download on the</small><strong>App Store</strong></span></a>
                            </div>
                        </div>
                        <div className="qr-box" style={{ position: "relative", zIndex: 1 }}><div className="qr-pattern" /></div>
                    </Reveal>
                </div>
            </section>

            {/* ============ 14. NEWSLETTER ============ */}
            <section className="newsletter">
                <div className="wrap">
                    <span className="eyebrow">Stay Aligned</span>
                    <h2 style={{ marginTop: 14 }}>Weekly cosmic insights in your inbox</h2>
                    <p>Horoscopes, remedies and festival reminders — no spam, ever.</p>
                    <form className="newsletter-form" onSubmit={(e) => e.preventDefault()}>
                        <input type="email" placeholder="Enter your email address" required />
                        <button className="btn btn-primary" type="submit">Subscribe</button>
                    </form>
                </div>
            </section>

            {/* ============ 15. FOOTER ============ */}
            <footer>
                <StarField count={60} />
                <div className="wrap" style={{ position: "relative", zIndex: 1 }}>
                    <div className="footer-grid">
                        <div className="footer-brand">
                            <a href="#hero" className="logo" style={{ color: "#fff" }}><span className="glyph">✦</span>Namah-Astro</a>
                            <p>India's most trusted platform to connect with verified astrologers for live call & chat consultations.</p>
                            <div className="social-row">
                                <a href="#">𝕏</a><a href="#">📸</a><a href="#">📘</a><a href="#">▶</a>
                            </div>
                        </div>
                        <div className="footer-col"><h5>Company</h5><ul>
                            <li><a href="#">About</a></li><li><a href="#">Careers</a></li><li><a href="#">Contact</a></li><li><a href="#">Blog</a></li>
                        </ul></div>
                        <div className="footer-col"><h5>Legal</h5><ul>
                            <li><a href="#">Privacy Policy</a></li><li><a href="/terms-n-conditions">Terms & Conditions</a></li><li><a href="#">Refund Policy</a></li><li><a href="#">Cookie Policy</a></li>
                        </ul></div>
                        <div className="footer-col"><h5>Services</h5><ul>
                            <li><a href="#services">Kundli</a></li><li><a href="#services">Match Making</a></li><li><a href="#astrologers">Talk to Astrologer</a></li><li><a href="#services">Numerology</a></li>
                        </ul></div>
                        <div className="footer-col"><h5>Contact</h5><ul>
                            <li>Admin@namahastro.com</li>
                        </ul></div>
                    </div>
                    <div className="footer-bottom">
                        <span>© 2026 Namah-Astro. All rights reserved.</span>
                        <span>Made with ✦ for seekers across India</span>
                    </div>
                </div>
                <BackToTop />
            </footer>

        </div>
    );
}

/* ================= styles ================= */

