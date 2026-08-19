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


export const SERVICES = [
    {
        
        icon: Sparkles,
        title: "Kundli",
        desc: "Detailed birth chart analysis",
        path:'/dashboard/kundali'
    },
    {
        icon: Heart,
        title: "Match Making",
        desc: "Guna milan & compatibility",
        path:'/dashboard/match'
    },
    {
        icon: PhoneCall,
        title: "Talk to Astrologer",
        desc: "Live voice consultation",
        path:'/dashboard/astrologers'
    },
    {
        icon: MessageCircle,
        title: "Chat Consultation",
        desc: "Private, instant chat",
        path:'/dashboard/astrologers'
    },
    {
        icon: Sun,
        title: "Daily Horoscope",
        desc: "Personalised daily insights",
        path:'/dashboard/horoscope'
    },
    {
        icon: CalendarDays,
        title: "Festival Calendar",
        desc: "Auspicious dates & muhurat",
        path:'/dashboard/festival'
    },
    {
        icon: Hash,
        title: "Numerology",
        desc: "Numbers that shape your life",
        path:'/dashboard'
    },
    {
        icon: Home,
        title: "Vastu",
        desc: "Harmony for home & office",
        path:'/dashboard/horoscope'
    },
    {
        icon: Gem,
        title: "Gemstone",
        desc: "Remedies & recommendations",
        path:'/dashboard/festival'
    },
    {
        icon: BookOpen,
        title: "Panchang",
        desc: "Daily Hindu almanac",
        path:'/dashboard/festival'
    },
];
export const ASTROLOGERS = [
    { initials: "RS", name: "Acharya Ramesh Shastri", exp: "22 yrs experience", tags: ["Vedic", "Marriage", "Hindi, Sanskrit"], rating: "4.9", reviews: "3.2k", price: "25", grad: "linear-gradient(135deg,#7C3AED,#4C1D95)" },
    { initials: "MJ", name: "Dr. Meena Joshi", exp: "15 yrs experience", tags: ["Numerology", "Career", "Hindi, English"], rating: "4.8", reviews: "2.1k", price: "20", grad: "linear-gradient(135deg,#C9A227,#8a6d10)" },
    { initials: "VT", name: "Pt. Vikram Trivedi", exp: "30 yrs experience", tags: ["Vastu", "Palmistry", "Hindi, Gujarati"], rating: "5.0", reviews: "5.6k", price: "35", grad: "linear-gradient(135deg,#9061F9,#4C1D95)" },
    { initials: "SD", name: "Acharya Sunita Devi", exp: "18 yrs experience", tags: ["Tarot", "Love", "Hindi, English"], rating: "4.9", reviews: "4.4k", price: "18", grad: "linear-gradient(135deg,#4C1D95,#150B2E)" },
];


export const WHY = [
    {
        icon: BadgeCheck,
        title: "Verified Experts",
        desc: "Every astrologer passes a rigorous background & skill verification before onboarding.",
    },
    {
        icon: Zap,
        title: "Instant Consultation",
        desc: "Connect within seconds — no waiting rooms, no scheduling hassle.",
    },
    {
        icon: ShieldCheck,
        title: "Secure Payments",
        desc: "100% encrypted transactions with trusted payment partners.",
    },
    {
        icon: LockKeyhole,
        title: "Privacy Protected",
        desc: "Your identity and conversations stay completely confidential.",
    },
    {
        icon: Target,
        title: "Accurate Predictions",
        desc: "Rooted in authentic Vedic principles, refined over decades of practice.",
    },
    {
        icon: Headphones,
        title: "24×7 Support",
        desc: "Our care team and astrologers are available around the clock, every day.",
    },
];
export const STEPS = [
    { num: 1, title: "Choose Astrologer", desc: "Browse profiles by expertise, language and rating to find your match." },
    { num: 2, title: "Recharge Wallet", desc: "Add balance securely — pay only for the minutes you actually use." },
    { num: 3, title: "Talk / Chat Instantly", desc: "Start your call or chat session immediately and get real answers." },
];

export const TESTIMONIALS = [
    { quote: "Acharya Ramesh gave me clarity about my career move that no one else could. The prediction played out exactly as he said.", name: "Priya Kapoor", loc: "Delhi", initials: "PK", bg: "#7C3AED" },
    { quote: "The kundli matching before my wedding was incredibly detailed. It genuinely eased my family's worries.", name: "Amit Rathore", loc: "Jaipur", initials: "AR", bg: "#C9A227" },
    { quote: "I was skeptical about online astrology, but Dr. Meena's chat consultation felt personal, warm and surprisingly accurate.", name: "Sneha Nair", loc: "Kochi", initials: "SN", bg: "#9061F9" },
    { quote: "Fast connection, secure payments, and genuinely knowledgeable astrologers. This is now my go-to app.", name: "Rohit Verma", loc: "Pune", initials: "RV", bg: "#4C1D95" },
];

export const BLOGS = [
    { icon: "✨", grad: "linear-gradient(135deg,#7C3AED,#4C1D95)", tag: "Astrology Tips", title: "5 remedies to strengthen a weak Moon in your chart", read: "4 min read" },
    { icon: "♌", grad: "linear-gradient(135deg,#C9A227,#8a6d10)", tag: "Zodiac Guides", title: "Understanding your Moon sign vs Sun sign", read: "6 min read" },
    { icon: "💞", grad: "linear-gradient(135deg,#9061F9,#4C1D95)", tag: "Love Predictions", title: "What Venus transit means for your relationship", read: "5 min read" },
    { icon: "💼", grad: "linear-gradient(135deg,#4C1D95,#150B2E)", tag: "Career Horoscope", title: "Best career moves for each sign this quarter", read: "7 min read" },
];

export const PRICING = [
    { label: "STARTER", price: "99", bonus: "No bonus · Try a quick session", popular: false },
    { label: "BASIC", price: "199", bonus: "+ ₹20 bonus talk-time", popular: false },
    { label: "VALUE", price: "499", bonus: "+ ₹75 bonus talk-time", popular: true },
    { label: "PREMIUM", price: "999", bonus: "+ ₹200 bonus talk-time", popular: false },
];

export const FAQS = [
    { q: "How does astrology consultation work?", a: "Simply choose an astrologer, recharge your wallet, and start a live call or chat instantly. You're billed only for the minutes you actually spend in the session." },
    { q: "Is my data secure?", a: "Yes. All conversations and personal details are encrypted end-to-end and never shared with third parties. Your privacy is a top priority for us." },
    { q: "How are astrologers verified?", a: "Every astrologer goes through identity verification, a skill assessment panel, and an ongoing rating review based on real user feedback before and after onboarding." },
    { q: "Can I get a refund?", a: "Unused wallet balance is refundable as per our refund policy. If a session was disrupted due to a technical issue, the minutes are automatically credited back." },
    { q: "Which languages are supported?", a: "Our astrologers speak Hindi, English and several regional languages including Tamil, Telugu, Gujarati, Marathi and Bengali." },
];
