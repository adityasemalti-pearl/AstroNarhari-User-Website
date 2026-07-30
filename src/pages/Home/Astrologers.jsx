import React, { useState, useMemo, useEffect, useRef } from 'react';
import {
    Search, Star, MessageSquare, Phone, Video, Bell,
    Check,
    Clock,
    Globe,
    Users,
    Wallet,
    Plus,
    X,
    Mic,
    MicOff,
    Volume2,
    VolumeX,
    Send,
    Sparkles,
    Filter,
    ChevronRight,
    ShieldCheck,
    Award,
    SlidersHorizontal,
    CheckCircle2,
    BellRing,
    Compass,
    Moon,
    Sun,
    Flame,
    Zap,
    Calendar,
    Heart,
    Bookmark,
    Share2,
    Play,
    Grid,
    List,
    Info,
    TrendingUp,
    Radio,
    Eye,
    Sliders,
    Maximize2,
    Minimize2,
    RotateCcw,
    BookOpen
} from 'lucide-react';
import BookAppointmentPopup from './comp/BookingPopup';
import InsufficientBalancePopup from './comp/InsufficientBalance';
import BookingConfirmedPopup from './comp/BookingConfirmedPopup';
import { getAllAstrologers, getAstrologerById } from '../../API/homeApis';



const CATEGORIES = [
    'All Experts',
    'LOVE & RELATIONSHIPS',
    'CAREER & FINANCE',
    'MARRIAGE & FAMILY',
    'HEALTH & WELLNESS',
    'BUSINESS & WEALTH'
];

const ZODIAC_SIGNS = [
    { name: 'Aries', dates: 'Mar 21 - Apr 19', icon: '♈', element: 'Fire', daily: 'A favorable planetary alignment brings sudden clarity regarding financial investments today.' },
    { name: 'Taurus', dates: 'Apr 20 - May 20', icon: '♉', element: 'Earth', daily: 'Patience will yield great rewards in your relationship dynamics today. Trust the slow process.' },
    { name: 'Gemini', dates: 'May 21 - Jun 20', icon: '♊', element: 'Air', daily: 'Communication barriers melt away. Perfect time to pitch ideas or initiate heartfelt conversations.' },
    { name: 'Cancer', dates: 'Jun 21 - Jul 22', icon: '♋', element: 'Water', daily: 'Listen closely to your inner intuition today. A long-pending family resolution is on the horizon.' },
    { name: 'Leo', dates: 'Jul 23 - Aug 22', icon: '♌', element: 'Fire', daily: 'Your natural charismatic energy is highlighted. Leadership opportunities arise at your workplace.' },
    { name: 'Virgo', dates: 'Aug 23 - Sep 22', icon: '♍', element: 'Earth', daily: 'Meticulous planning pays off today. Take a moment to celebrate your micro-achievements.' }
];

export default function Astrologers() {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All Experts');
    const [statusFilter, setStatusFilter] = useState('ALL'); // ALL, ONLINE, BUSY
    const [priceRange, setPriceRange] = useState(60);
    const [minRating, setMinRating] = useState(0);
    const [selectedLanguage, setSelectedLanguage] = useState('ALL');
    const [sortBy, setSortBy] = useState('RATING'); // RATING, PRICE_LOW, PRICE_HIGH, EXPERIENCE
    const [viewMode, setViewMode] = useState('GRID'); // GRID, LIST
    const [showWallet, setShowWallet] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);

    // Interactive Web States
    const [notifiedExperts, setNotifiedExperts] = useState({});
    const [bookmarkedExperts, setBookmarkedExperts] = useState({});
    const [walletBalance, setWalletBalance] = useState(350);
    const [isWalletOpen, setIsWalletOpen] = useState(false);
    const [isAudioAmbientOn, setIsAudioAmbientOn] = useState(false);

    // Active Consultation Modals
    const [activeChatExpert, setActiveChatExpert] = useState(null);
    const [activeCallExpert, setActiveCallExpert] = useState(null); // supports voice & video
    const [callMode, setCallMode] = useState('VIDEO'); // VOICE or VIDEO
    const [activeProfileExpert, setActiveProfileExpert] = useState(null);
    const [activeHoroscope, setActiveHoroscope] = useState(null);
    const [isKundliModalOpen, setIsKundliModalOpen] = useState(false);

    const [showBooking, setShowBooking] = useState(false)

    // Chat Simulation State
    const [messages, setMessages] = useState([]);
    const [chatInput, setChatInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);

    // Video/Voice Call Simulation State
    const [callDuration, setCallDuration] = useState(0);
    const [isMuted, setIsMuted] = useState(false);
    const [isVideoOff, setIsVideoOff] = useState(false);
    const [isSpeakerOn, setIsSpeakerOn] = useState(true);

    // Kundli Quick Match Form State
    const [kundliData, setKundliData] = useState({
        person1Name: '',
        person1Dob: '',
        person2Name: '',
        person2Dob: ''
    });
    const [kundliResult, setKundliResult] = useState(null);

    const audioCtxRef = useRef(null);

    const playCosmicChime = (freq = 440) => {
        try {
            if (!audioCtxRef.current) {
                audioCtxRef.current = new (window.AudioContext || window.webkitAudioContext)();
            }
            if (audioCtxRef.current.state === 'suspended') {
                audioCtxRef.current.resume();
            }
            const ctx = audioCtxRef.current;
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();

            osc.type = 'sine';
            osc.frequency.setValueAtTime(freq, ctx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(freq * 1.5, ctx.currentTime + 0.3);

            gain.gain.setValueAtTime(0.08, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);

            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start();
            osc.stop(ctx.currentTime + 0.4);
        } catch (err) {
            // Audio fallback graceful ignore
        }
    };




    useEffect(() => {
        let timer;
        if (activeCallExpert) {
            timer = setInterval(() => {
                setCallDuration((prev) => prev + 1);
            }, 1000);
        } else {
            setCallDuration(0);
        }
        return () => clearInterval(timer);
    }, [activeCallExpert]);

    // Format seconds to MM:SS
    const formatTime = (secs) => {
        const mins = Math.floor(secs / 60);
        const remSecs = secs % 60;
        return `${mins.toString().padStart(2, '0')}:${remSecs.toString().padStart(2, '0')}`;
    };


    // Handlers


    const handleToggleBookmark = (id, e) => {
        e.stopPropagation();
        playCosmicChime(520);
        setBookmarkedExperts(prev => ({ ...prev, [id]: !prev[id] }));
    };

    const handleToggleNotify = (id, e) => {
        e.stopPropagation();
        playCosmicChime(600);
        setNotifiedExperts(prev => ({ ...prev, [id]: !prev[id] }));
    };

    const handleOpenChat = (expert) => {
        playCosmicChime(480);
        setActiveChatExpert(expert);
        setMessages([
            {
                id: 1,
                sender: 'expert',
                text: `Pranam! I am ${expert.name}. Welcome to our private cosmic sanctuary. Please share your Date, Time, and City of birth to begin calculating your real-time Kundli charts.`,
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            }
        ]);
    };

    const handleSendMessage = (e) => {
        e.preventDefault();
        if (!chatInput.trim() || !activeChatExpert) return;

        playCosmicChime(400);
        const userMsg = {
            id: Date.now(),
            sender: 'user',
            text: chatInput,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };

        setMessages(prev => [...prev, userMsg]);
        setChatInput('');
        setIsTyping(true);

        setTimeout(() => {
            setIsTyping(false);
            const replies = [
                `Thank you for sharing your details. Analyzing your D1 Lagna and D9 Navamsha planetary positions...`,
                `I notice Jupiter in your 10th House of Career, indicating a powerful rise in recognition within the next 4 months.`,
                `According to Prashna timing, Rahu's influence is diminishing. A high-value opportunity will unfold before the next Full Moon.`
            ];
            const randomReply = replies[Math.floor(Math.random() * replies.length)];

            setMessages(prev => [
                ...prev,
                {
                    id: Date.now() + 1,
                    sender: 'expert',
                    text: randomReply,
                    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                }
            ]);
        }, 1500);
    };

    const handleStartCall = (expert, mode = 'VIDEO') => {
        playCosmicChime(640);
        setCallMode(mode);
        setActiveCallExpert(expert);
    };

    const handleCalculateKundli = (e) => {
        e.preventDefault();
        if (!kundliData.person1Name || !kundliData.person2Name) return;
        playCosmicChime(580);
        const mockScore = Math.floor(Math.random() * 12) + 24; // 24 to 36 points out of 36
        setKundliResult({
            score: mockScore,
            maxScore: 36,
            compatibility: mockScore > 30 ? 'Excellent Match (Ati Uttam)' : mockScore > 26 ? 'Good Match (Uttam)' : 'Average Compatibility',
            varna: '3 / 3',
            vashya: '2 / 2',
            tara: '3 / 3',
            yoni: '4 / 4',
            grahaMaitri: '4 / 5',
            gan: '5 / 6',
            bhakoot: '6 / 7',
            nadi: '8 / 8'
        });
    };




    const [filters, setFilters] = useState({
        page: 1,
        limit: 10,
        search: "",
        category: ""
    });

    const [astrologers, setAstrologers] = useState([])
    const [selectedPartner, setSelectedPartner] = useState(null);

    const fetchPartnerDetails = async (id) => {
        try {
            const res = await getAstrologerById(id);

            setSelectedPartner(res.data.data)
        } catch (error) {
            console.log(error);
        }
    };

    //api calls
    const fetchAllAstrologers = async () => {
        try {
            const params = {};

            if (selectedCategory !== "All Experts") {
                params.category = selectedCategory;
            }

            const res = await getAllAstrologers(params);

            if (res.success) {
                setAstrologers(res.data);
            }
        } catch (error) {
            console.log(error);
        }
    };


    useEffect(() => {
        fetchAllAstrologers()
    }, [selectedCategory])

    const filteredAstrologers = useMemo(() => {
        return astrologers.filter((astrologer) => {
            if (selectedCategory === "All Experts") return true;

            return astrologer.categories?.some(
                (category) =>
                    category.toLowerCase() === selectedCategory.toLowerCase()
            );
        });
    }, [astrologers, selectedCategory]);


    return (
        <div className="min-h-screen bg-transparent text-slate-100 font-sans selection:bg-amber-500 selection:text-slate-950 relative overflow-x-hidden">

            {/* Animated Glowing Cosmic Background Stars & Nebulae */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-purple-900/20 rounded-full blur-[140px] animate-pulse" />
                <div className="absolute top-1/3 right-10 w-[500px] h-[500px] bg-indigo-900/20 rounded-full blur-[160px]" />
                <div className="absolute bottom-10 left-10 w-[700px] h-[700px] bg-amber-600/10 rounded-full blur-[180px]" />
                <div className="absolute inset-0 bg-[radial-gradient(#ffffff0a_1px,transparent_1px)] [background-size:24px_24px]" />
            </div>


            {/* HERO BANNER SECTION (Desktop Web First) */}
            { }
            <section className="relative z-10 max-w-7xl mx-auto px-4 lg:px-8  pb-6">
                <div className="relative rounded-3xl overflow-hidden border border-white/10 bg-gradient-to-br from-purple-950 via-[#140A30]/80 to-[#0B051D] p-6 lg:p-12 shadow-2xl backdrop-blur-md">

                    {/* Decorative Corner Ornaments */}
                    <div className="absolute top-4 right-4 text-amber-400/20 pointer-events-none">
                        <Sparkles className="w-32 h-32 animate-pulse" />
                    </div>

                    <div className="max-w-3xl space-y-4">

                        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-400/10 border border-amber-400/30 text-amber-300 text-xs font-semibold">
                            <Zap className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                            <span>Real-Time Live Planetary Alignment Guidance</span>
                        </div>

                        <h2 className="font-serif font-extrabold text-3xl sm:text-4xl lg:text-5xl tracking-tight leading-tight text-white">
                            Connect with India's Verified <span className="bg-gradient-to-r from-amber-300 via-amber-400 to-yellow-200 bg-clip-text text-transparent">Vedic Masters</span> & Astro Guides
                        </h2>

                        <p className="text-sm sm:text-base text-slate-300 font-normal leading-relaxed">
                            Get immediate clarity on Career, Marriage, Finances & Health through Live Audio/Video calls & Chat. Over <strong className="text-amber-300 font-semibold">2.5 Million+</strong> consultations powered by authentic Vedic, KP & Tarot wisdom.
                        </p>

                        {/* Comprehensive Search Bar Component */}
                        <div className="pt-2">
                            <div className="relative max-w-2xl">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <Search className="h-5 h-5 text-amber-400" />
                                </div>
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="Search by Astrologer name, specialty (e.g., Prashna, Nadi, Tarot), or language..."
                                    className="w-full bg-[#0B051D]/90 border border-amber-500/30 rounded-2xl pl-12 pr-12 py-4 text-sm text-slate-100 placeholder-slate-400 shadow-xl focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-amber-400 transition-all"
                                />
                                {searchQuery && (
                                    <button
                                        onClick={() => setSearchQuery('')}
                                        className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-white"
                                    >
                                        <X className="w-5 h-5" />
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Quick Metrics Ticker */}
                        <div className="pt-2 flex flex-wrap items-center gap-6 text-xs text-slate-300 font-medium border-t border-white/10 pt-4">
                            <div className="flex items-center gap-2">
                                <ShieldCheck className="w-4 h-4 text-amber-400" />
                                <span>100% Verified Identity</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Award className="w-4 h-4 text-amber-400" />
                                <span>4.9★ Average Rating</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Clock className="w-4 h-4 text-amber-400" />
                                <span>24/7 Live Availability</span>
                            </div>
                        </div>

                    </div>
                </div>
            </section>

            {/* MAIN TWO-COLUMN WEB CONTENT SECTION */}
            { }
            <main className="relative z-10 max-w-7xl mx-auto px-4 lg:px-8 py-6">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 ">

                    {/* MAIN DIRECTORY CONTENT (Left 8 Cols on Large Screens) */}
                    <div className="lg:col-span-8 space-y-6">

                        {/* Category Filter Horizontal Scrollable Chips */}
                        <div className=" border border-white/10 bg-gradient-to-br from-purple-950/60 via-[#140A30]/80 to-[#0B051D] rounded-2xl p-2 backdrop-blur-md">
                            <div className="flex items-center hide gap-2 overflow-x-auto no-scrollbar scroll-smooth">
                                {CATEGORIES.map((cat) => {
                                    const isActive = selectedCategory === cat;
                                    return (
                                        <button
                                            key={cat}
                                            onClick={() => {
                                                // playCosmicChime(450);
                                                setSelectedCategory(cat);
                                            }}
                                            className={`shrink-0 px-4 py-2.5 rounded-xl text-xs font-bold transition-all duration-200 flex items-center gap-2 ${isActive
                                                ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 shadow-lg shadow-amber-500/20 scale-102'
                                                : 'bg-white/5 hover:bg-white/10 text-slate-300 border border-white/5'
                                                }`}
                                        >
                                            <span>{cat}</span>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Controls Bar: Status Filter + Price & Rating Controls + View Toggle */}
                        <div className="bg-gradient-to-br from-purple-950 via-[#140A30]/80 to-[#0B051D] border border-white/10 rounded-2xl p-4 space-y-4">
                            <div className="flex flex-wrap items-center justify-between gap-4">

                                {/* Status Toggle Buttons */}
                                <div className="flex items-center gap-1.5 bg-[#0B051D] p-1 rounded-xl border border-white/10">
                                    <button
                                        onClick={() => setStatusFilter('ALL')}
                                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${statusFilter === 'ALL' ? 'bg-amber-400 text-slate-950 shadow-md' : 'text-slate-400 hover:text-white'
                                            }`}
                                    >
                                        All Experts
                                    </button>
                                    <button
                                        onClick={() => setStatusFilter('ONLINE')}
                                        className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${statusFilter === 'ONLINE' ? 'bg-emerald-500 text-slate-950 shadow-md' : 'text-slate-400 hover:text-white'
                                            }`}
                                    >
                                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                                        Online Now
                                    </button>
                                    <button
                                        onClick={() => setStatusFilter('BUSY')}
                                        className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${statusFilter === 'BUSY' ? 'bg-amber-500 text-slate-950 shadow-md' : 'text-slate-400 hover:text-white'
                                            }`}
                                    >
                                        <span className="w-2 h-2 rounded-full bg-amber-400" />
                                        Busy
                                    </button>
                                </div>

                                {/* Sort By Dropdown */}
                                <div className="flex items-center gap-3">
                                    <span className="text-xs text-slate-400 font-semibold">Sort:</span>
                                    <select
                                        value={sortBy}
                                        onChange={(e) => setSortBy(e.target.value)}
                                        className="bg-[#0B051D] border border-white/10 rounded-xl px-3 py-1.5 text-xs text-slate-200 font-medium focus:outline-none focus:ring-1 focus:ring-amber-400"
                                    >
                                        <option value="RATING">Highest Rating</option>
                                        <option value="PRICE_LOW">Price: Low to High</option>
                                        <option value="PRICE_HIGH">Price: High to Low</option>
                                        <option value="EXPERIENCE">Most Experienced</option>
                                    </select>

                                    {/* Grid vs List View Switch */}
                                    <div className="flex items-center gap-1 bg-[#0B051D] p-1 rounded-xl border border-white/10">
                                        <button
                                            onClick={() => setViewMode('GRID')}
                                            className={`p-1.5 rounded-lg transition-all ${viewMode === 'GRID' ? 'bg-amber-400 text-slate-950' : 'text-slate-400 hover:text-white'
                                                }`}
                                        >
                                            <Grid className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={() => setViewMode('LIST')}
                                            className={`p-1.5 rounded-lg transition-all ${viewMode === 'LIST' ? 'bg-amber-400 text-slate-950' : 'text-slate-400 hover:text-white'
                                                }`}
                                        >
                                            <List className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>

                            </div>

                            {/* Advanced Slider Filters (Max Price Range & Min Rating) */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-white/10 pt-3 ">
                                <div className="space-y-1">
                                    <div className="flex justify-between text-xs text-slate-300 font-medium">
                                        <span>Max Price per Min:</span>
                                        <span className="text-amber-400 font-bold">₹{priceRange}/min</span>
                                    </div>
                                    <input
                                        type="range"
                                        min="15"
                                        max="80"
                                        step="5"
                                        value={priceRange}
                                        onChange={(e) => setPriceRange(Number(e.target.value))}
                                        className="w-full accent-amber-400 cursor-pointer h-1.5 bg-white/10 rounded-lg"
                                    />
                                </div>

                                <div className="space-y-1">
                                    <div className="flex justify-between text-xs text-slate-300 font-medium">
                                        <span>Minimum Rating:</span>
                                        <span className="text-amber-400 font-bold">{minRating > 0 ? `${minRating}+ Stars` : 'Any Rating'}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        {[0, 4.5, 4.8, 4.9].map((star) => (
                                            <button
                                                key={star}
                                                onClick={() => setMinRating(star)}
                                                className={`flex-1 py-1 rounded-lg text-xs font-semibold border transition-all ${minRating === star
                                                    ? 'bg-amber-400/20 text-amber-300 border-amber-400'
                                                    : 'bg-white/5 text-slate-400 border-white/5 hover:text-white'
                                                    }`}
                                            >
                                                {star === 0 ? 'All' : `${star}★`}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>

                        </div>

                        {/* ASTROLOGERS CARDS GRID / LIST */}
                        { }
                        {filteredAstrologers.length === 0 ? (
                            <div className="bg-gradient-to-br from-purple-950/60 via-[#140A30]/80 to-[#0B051D] border border-white/10 rounded-3xl p-12 text-center space-y-4 ">
                                <div className="w-16 h-16 bg-amber-400/10 text-amber-400 rounded-full flex items-center justify-center mx-auto border border-amber-400/20">
                                    <Search className="w-8 h-8" />
                                </div>
                                <h3 className="font-serif font-bold text-xl text-white">No Cosmic Guides Match Your Filters</h3>
                                <p className="text-sm text-slate-400 max-w-md mx-auto">
                                    Try adjusting your maximum price range, category, or search term to discover available astrologers.
                                </p>
                                <button
                                    onClick={() => {
                                        setSearchQuery('');
                                        setSelectedCategory('All Experts');
                                        setStatusFilter('ALL');
                                        setPriceRange(80);
                                        setMinRating(0);
                                    }}
                                    className="px-6 py-2.5 rounded-full bg-amber-400 text-slate-950 font-bold text-xs hover:bg-amber-300 transition-all shadow-lg"
                                >
                                    Reset All Filters
                                </button>
                            </div>
                        ) : (
                            <div className={viewMode === 'GRID' ? 'grid grid-cols-1 md:grid-cols-2 gap-6' : 'space-y-4'}>
                                {filteredAstrologers.map((astrologer) => {
                                    const isNotified = notifiedExperts[astrologer._id];
                                    const isBookmarked = bookmarkedExperts[astrologer._id];

                                    const status = astrologer.isOnline ? "ONLINE" : "OFFLINE";
                                    const isOffline = status === "OFFLINE";

                                    return (
                                        <div
                                            key={astrologer._id}
                                            onClick={() => {
                                                fetchPartnerDetails(astrologer._id);
                                                setActiveProfileExpert(true)
                                            }}
                                            className="group bg-gradient-to-br from-purple-950 via-[#140A30]/80 to-[#0B051D] rounded-3xl border border-white/10 hover:border-amber-400/50 p-5 relative transition-all duration-300 hover:shadow-2xl hover:shadow-amber-500/10 cursor-pointer flex flex-col justify-between"
                                        >
                                            <div>
                                                <div className="flex items-start justify-between gap-4">

                                                    {/* Avatar */}
                                                    <div className="relative flex-shrink-0">
                                                        <div className="w-20 h-20 rounded-2xl p-0.5 bg-[#0B051D] shadow-xl group-hover:scale-105 transition-transform duration-300">
                                                            <img
                                                                src={
                                                                    astrologer.profilePic ||
                                                                    "https://ui-avatars.com/api/?name=" +
                                                                    encodeURIComponent(astrologer.fullName)
                                                                }
                                                                alt={astrologer.fullName}
                                                                className="w-full h-full object-cover rounded-[14px]"
                                                            />
                                                        </div>

                                                        {/* Status */}
                                                        <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-[#0B051D] px-2.5 py-0.5 rounded-full border border-white/10 shadow-lg flex items-center gap-1.5 whitespace-nowrap">
                                                            <span
                                                                className={`w-2 h-2 rounded-full ${status === "ONLINE"
                                                                    ? "bg-emerald-400 animate-pulse"
                                                                    : "bg-slate-500"
                                                                    }`}
                                                            />
                                                            <span
                                                                className={`text-[10px] font-bold ${status === "ONLINE"
                                                                    ? "text-emerald-400"
                                                                    : "text-slate-400"
                                                                    }`}
                                                            >
                                                                {status}
                                                            </span>
                                                        </div>
                                                    </div>

                                                    {/* Rating */}
                                                    <div className="flex items-center gap-2">
                                                        <div className="flex items-center gap-1 bg-amber-400/10 border border-amber-400/30 text-amber-300 px-2.5 py-1 rounded-xl text-xs font-bold">
                                                            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                                                            <span>{Number(astrologer.averageRating || 0).toFixed(1)}</span>
                                                            <span className="text-[10px] text-slate-400">
                                                                ({astrologer.totalReviews || 0})
                                                            </span>
                                                        </div>

                                                        <button
                                                            onClick={(e) =>
                                                                handleToggleBookmark(astrologer._id, e)
                                                            }
                                                            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-400 hover:text-amber-400"
                                                        >
                                                            <Bookmark
                                                                className={`w-4 h-4 ${isBookmarked
                                                                    ? "fill-amber-400 text-amber-400"
                                                                    : ""
                                                                    }`}
                                                            />
                                                        </button>
                                                    </div>
                                                </div>

                                                {/* Name */}
                                                <div className="mt-4">
                                                    <div className="flex items-center gap-2">
                                                        <h3 className="font-serif font-bold text-lg text-white">
                                                            {astrologer.fullName}
                                                        </h3>

                                                        {astrologer.isVerified && (
                                                            <ShieldCheck className="w-4 h-4 text-amber-400" />
                                                        )}
                                                    </div>

                                                    <p className="text-xs text-amber-300 mt-1">
                                                        {astrologer.specialties?.join(" • ") || "Astrologer"}
                                                    </p>
                                                </div>

                                                {/* Bio */}
                                                {/* <p className="text-xs text-slate-400 line-clamp-2 mt-2">
                                                    {astrologer.about || "No description available."}
                                                </p> */}

                                                {/* Info */}
                                                <div className="mt-4 grid grid-cols-2 gap-2 text-xs text-slate-300 border-t border-white/10 pt-3">

                                                    <div className="flex items-center gap-2">
                                                        <Clock className="w-3.5 h-3.5 text-amber-400" />
                                                        <span>{astrologer.experience || 0} Years</span>
                                                    </div>

                                                    <div className="flex items-center gap-2">
                                                        <Globe className="w-3.5 h-3.5 text-amber-400" />
                                                        <span className="truncate">
                                                            {astrologer.languages?.join(", ") || "N/A"}
                                                        </span>
                                                    </div>

                                                    <div className="flex items-center gap-2">
                                                        <Users className="w-3.5 h-3.5 text-amber-400" />
                                                        <span>{astrologer.totalConsultations || 0} Consults</span>
                                                    </div>

                                                    <div className="flex items-center gap-1.5">
                                                        <span className="font-extrabold text-amber-300 text-sm">
                                                            ₹{astrologer.minRate || 0}/min
                                                        </span>

                                                        {astrologer.callPrice && (
                                                            <span className="text-[10px] text-slate-500">
                                                                Call ₹{astrologer.callPrice}
                                                            </span>
                                                        )}
                                                    </div>

                                                </div>
                                            </div>

                                            {/* Buttons */}
                                            <div className="mt-5 pt-3 border-t border-white/10">
                                                {isOffline ? (
                                                    <button
                                                        onClick={(e) =>
                                                            handleToggleNotify(astrologer._id, e)
                                                        }
                                                        className="w-full py-2.5 rounded-xl text-xs font-bold bg-white/5 border border-white/10 text-slate-300"
                                                    >
                                                        Notify When Live
                                                    </button>
                                                ) : (
                                                    <div className="grid grid-cols-3 gap-2">
                                                        <button
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                handleOpenChat(astrologer);
                                                            }}
                                                            className="bg-purple-950 border border-purple-500/30 text-amber-300 py-2.5 rounded-xl text-xs font-bold"
                                                        >
                                                            Chat
                                                        </button>

                                                        <button
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                handleStartCall(astrologer, "VOICE");
                                                            }}
                                                            className="bg-indigo-950 border border-indigo-500/30 text-amber-300 py-2.5 rounded-xl text-xs font-bold"
                                                        >
                                                            Call
                                                        </button>

                                                        <button
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                handleStartCall(astrologer, "VIDEO");
                                                            }}
                                                            className="bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 py-2.5 rounded-xl text-xs font-bold"
                                                        >
                                                            Video
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}

                    </div>

                    {/* RIGHT SIDEBAR (Desktop Web Widgets - 4 Cols on Large Screens) */}
                    { }
                    <div className="lg:col-span-4 space-y-6">

                        {/* 1. Live Cosmic Panchang Widget */}
                        <div className="bg-gradient-to-br from-purple-950 via-[#140A30]/80 to-[#0B051D] rounded-3xl border border-white/10 p-6 backdrop-blur-md space-y-4 shadow-xl relative overflow-hidden">
                            <div className="flex items-center justify-between border-b border-white/10 pb-3">
                                <div className="flex items-center gap-2">
                                    <Moon className="w-5 h-5 text-amber-400" />
                                    <h3 className="font-serif font-bold text-base text-white">Daily Cosmic Transit</h3>
                                </div>
                                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-400/10 text-amber-300 border border-amber-400/20">
                                    LIVE
                                </span>
                            </div>

                            <div className="space-y-3 text-xs text-slate-300">
                                <div className="flex justify-between items-center bg-white/5 p-3 rounded-xl border border-white/5">
                                    <span className="text-slate-400">Tithi</span>
                                    <span className="font-bold text-amber-300">Shukla Ekadashi</span>
                                </div>

                                <div className="flex justify-between items-center bg-white/5 p-3 rounded-xl border border-white/5">
                                    <span className="text-slate-400">Nakshatra</span>
                                    <span className="font-bold text-amber-300">Rohini (Moon Lord)</span>
                                </div>

                                <div className="flex justify-between items-center bg-white/5 p-3 rounded-xl border border-white/5">
                                    <span className="text-slate-400">Rahu Kaal Today</span>
                                    <span className="font-bold text-rose-400">01:45 PM - 03:15 PM</span>
                                </div>

                                <div className="flex justify-between items-center bg-white/5 p-3 rounded-xl border border-white/5">
                                    <span className="text-slate-400">Abhijit Muhurat</span>
                                    <span className="font-bold text-emerald-400">11:48 AM - 12:36 PM</span>
                                </div>
                            </div>
                        </div>

                        {/* 2. Instant Free Kundli Match Launcher Widget */}
                        <div className="bg-gradient-to-br from-purple-950 via-[#140A30]/80 to-[#0B051D] rounded-3xl border border-purple-500/30 p-6 backdrop-blur-md space-y-4 shadow-xl">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-2xl bg-amber-400/20 flex items-center justify-center text-amber-400 border border-amber-400/30">
                                    <Heart className="w-5 h-5 fill-amber-400/30" />
                                </div>
                                <div>
                                    <h4 className="font-serif font-bold text-base text-white">Kundli Matching</h4>
                                    <p className="text-xs text-slate-400">Guna Milan & Manglik Check</p>
                                </div>
                            </div>

                            <p className="text-xs text-slate-300 leading-relaxed">
                                Check 36 Guna compatibility instantly before consulting with our senior marriage relationship guides.
                            </p>

                            <button
                                onClick={() => setIsKundliModalOpen(true)}
                                className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs py-3 rounded-xl transition-all shadow-lg shadow-amber-500/10 flex items-center justify-center gap-2"
                            >
                                <Sparkles className="w-4 h-4" />
                                <span>Calculate Guna Milan Free</span>
                            </button>
                        </div>

                        {/* 3. Daily Horoscope Sign Selector Widget */}
                        <div className="bg-gradient-to-br from-purple-950 via-[#140A30]/80 to-[#0B051D] border border-white/10 rounded-3xl p-6  space-y-4 shadow-xl">
                            <div className="flex items-center justify-between border-b border-white/10 pb-3">
                                <h3 className="font-serif font-bold text-base text-white">Daily Zodiac Insights</h3>
                                <Sun className="w-5 h-5 text-amber-400" />
                            </div>

                            <div className="grid grid-cols-3 gap-2">
                                {ZODIAC_SIGNS.map((zodiac) => (
                                    <button
                                        key={zodiac.name}
                                        onClick={() => {
                                            playCosmicChime(500);
                                            setActiveHoroscope(zodiac);
                                        }}
                                        className="p-3 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/5 hover:border-amber-400/30 text-center space-y-1 transition-all group"
                                    >
                                        <div className="text-2xl group-hover:scale-125 transition-transform">{zodiac.icon}</div>
                                        <div className="text-[11px] font-bold text-slate-200">{zodiac.name}</div>
                                    </button>
                                ))}
                            </div>
                        </div>

                    </div>

                </div>
            </main>

            {/* WEB MODAL 1: LIVE CHAT SIMULATION */}
            { }
            {activeChatExpert && (
                <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-lg flex items-center justify-center p-4">
                    <div className="bg-[#0B051D] w-full max-w-2xl h-[650px] rounded-3xl shadow-2xl flex flex-col overflow-hidden border border-amber-500/30 animate-in fade-in zoom-in-95 duration-200">

                        {/* Header */}
                        <div className="bg-gradient-to-r from-purple-950 via-indigo-950 to-[#0B051D] p-4 px-6 border-b border-white/10 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="relative">
                                    <img
                                        src={activeChatExpert.avatar}
                                        alt={activeChatExpert.name}
                                        className="w-12 h-12 rounded-2xl object-cover border border-amber-400"
                                    />
                                    <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full bg-emerald-400 border-2 border-[#0B051D]" />
                                </div>
                                <div>
                                    <h4 className="font-serif font-bold text-base text-white">{activeChatExpert.name}</h4>
                                    <p className="text-xs text-amber-300 font-medium">₹{activeChatExpert.pricePerMin}/min • Live Chat Room</p>
                                </div>
                            </div>

                            <button
                                onClick={() => setActiveChatExpert(null)}
                                className="p-2 rounded-xl hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        {/* Messages Area */}
                        <div className="flex-1 p-6 overflow-y-auto space-y-4 bg-[radial-gradient(#ffffff05_1px,transparent_1px)] [background-size:20px_20px]">
                            {messages.map((msg) => (
                                <div
                                    key={msg.id}
                                    className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
                                >
                                    <div
                                        className={`max-w-[80%] rounded-2xl px-5 py-3 text-xs sm:text-sm font-normal shadow-lg ${msg.sender === 'user'
                                            ? 'bg-amber-500 text-slate-950 font-medium rounded-br-none'
                                            : 'bg-white/10 text-slate-100 border border-white/10 rounded-bl-none backdrop-blur-md'
                                            }`}
                                    >
                                        <p>{msg.text}</p>
                                        <span className={`text-[10px] block mt-1.5 text-right ${msg.sender === 'user' ? 'text-slate-900/70' : 'text-slate-400'}`}>
                                            {msg.time}
                                        </span>
                                    </div>
                                </div>
                            ))}

                            {isTyping && (
                                <div className="flex items-center gap-2 text-xs text-amber-300 bg-white/5 p-3 rounded-2xl border border-white/5 w-max">
                                    <Sparkles className="w-4 h-4 animate-spin text-amber-400" />
                                    <span>{activeChatExpert.name} is inspecting planetary charts...</span>
                                </div>
                            )}
                        </div>

                        {/* Form Input Bar */}
                        <form onSubmit={handleSendMessage} className="p-4 bg-white/5 border-t border-white/10 flex items-center gap-3">
                            <input
                                type="text"
                                value={chatInput}
                                onChange={(e) => setChatInput(e.target.value)}
                                placeholder="Ask about love compatibility, career timing, or planetary remedies..."
                                className="flex-1 bg-[#0B051D] border border-white/10 rounded-2xl px-5 py-3.5 text-xs sm:text-sm text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-400"
                            />
                            <button
                                type="submit"
                                className="bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 p-3.5 rounded-2xl hover:from-amber-400 hover:to-amber-500 transition-all font-bold shadow-lg"
                            >
                                <Send className="w-5 h-5" />
                            </button>
                        </form>

                    </div>
                </div>
            )}

            {/* WEB MODAL 2: FULL HD VIDEO / VOICE CALL CONSULTATION STUDIO */}
            { }
            {activeCallExpert && (
                <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-xl flex items-center justify-center p-4">
                    <div className="w-full max-w-4xl h-[650px] bg-[#0B051D] rounded-3xl border border-white/10 shadow-2xl overflow-hidden flex flex-col justify-between relative">

                        {/* Background Simulated Video Stream / Visualizer */}
                        <div className="absolute inset-0 z-0">
                            {callMode === 'VIDEO' && !isVideoOff ? (
                                <div className="w-full h-full relative">
                                    <img
                                        src={activeCallExpert.coverImage}
                                        alt={activeCallExpert.name}
                                        className="w-full h-full object-cover opacity-30"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-[#0B051D] via-transparent to-[#0B051D]/80" />
                                </div>
                            ) : (
                                <div className="w-full h-full bg-gradient-to-b from-purple-950/40 via-[#0B051D] to-[#0B051D]" />
                            )}
                        </div>

                        {/* Top Call Info Overlay Header */}
                        <div className="relative z-10 p-6 flex items-center justify-between border-b border-white/10 bg-[#0B051D]/60 backdrop-blur-md">
                            <div className="flex items-center gap-3">
                                <div className="w-3 h-3 rounded-full bg-emerald-400 animate-pulse" />
                                <span className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-widest">
                                    Encrypted Live {callMode} Consultation
                                </span>
                            </div>

                            <div className="bg-amber-400/10 border border-amber-400/30 px-4 py-1.5 rounded-full text-xs font-mono font-bold text-amber-300">
                                Duration: {formatTime(callDuration)} (₹{activeCallExpert.pricePerMin}/min)
                            </div>
                        </div>

                        {/* Center Video Avatar & Visualizer */}
                        <div className="relative z-10 flex flex-col items-center justify-center space-y-6 my-auto">
                            <div className="relative">
                                <img
                                    src={activeCallExpert.avatar}
                                    alt={activeCallExpert.name}
                                    className="w-32 h-32 rounded-3xl object-cover border-2 border-amber-400 shadow-2xl"
                                />
                                <div className="absolute inset-0 rounded-3xl ring-8 ring-amber-400/20 animate-ping pointer-events-none" />
                            </div>

                            <div className="text-center space-y-1">
                                <h3 className="font-serif font-bold text-2xl text-white">{activeCallExpert.name}</h3>
                                <p className="text-xs text-amber-300 font-medium">{activeCallExpert.specialties.join(' • ')}</p>
                            </div>
                        </div>

                        {/* Bottom Call Action Controls Bar */}
                        <div className="relative z-10 p-6 bg-[#0B051D]/80 backdrop-blur-md border-t border-white/10 flex items-center justify-center gap-6">

                            {/* Mute Mic Button */}
                            <button
                                onClick={() => setIsMuted(!isMuted)}
                                className={`p-4 rounded-2xl border transition-all ${isMuted
                                    ? 'bg-rose-500/20 text-rose-400 border-rose-500/40'
                                    : 'bg-white/10 text-white border-white/20 hover:bg-white/20'
                                    }`}
                            >
                                {isMuted ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
                            </button>

                            {/* Toggle Video Button */}
                            {callMode === 'VIDEO' && (
                                <button
                                    onClick={() => setIsVideoOff(!isVideoOff)}
                                    className={`p-4 rounded-2xl border transition-all ${isVideoOff
                                        ? 'bg-rose-500/20 text-rose-400 border-rose-500/40'
                                        : 'bg-white/10 text-white border-white/20 hover:bg-white/20'
                                        }`}
                                >
                                    <Video className="w-6 h-6" />
                                </button>
                            )}

                            {/* End Call Button */}
                            <button
                                onClick={() => setActiveCallExpert(null)}
                                className="p-5 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white shadow-xl transform active:scale-95 transition-all flex items-center gap-2 font-bold px-8"
                            >
                                <Phone className="w-6 h-6 rotate-[135deg]" />
                                <span>Disconnect</span>
                            </button>

                            {/* Speaker Toggle */}
                            <button
                                onClick={() => setIsSpeakerOn(!isSpeakerOn)}
                                className={`p-4 rounded-2xl border transition-all ${!isSpeakerOn
                                    ? 'bg-rose-500/20 text-rose-400 border-rose-500/40'
                                    : 'bg-white/10 text-white border-white/20 hover:bg-white/20'
                                    }`}
                            >
                                <Volume2 className="w-6 h-6" />
                            </button>

                        </div>

                    </div>
                </div>
            )}



            {/* WEB MODAL 4: DAILY HOROSCOPE MODAL */}
            { }
            {activeHoroscope && (
                <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-lg flex items-center justify-center p-4">
                    <div className="bg-[#0B051D] w-full max-w-md rounded-3xl border border-amber-500/30 shadow-2xl p-6 space-y-4 relative">
                        <button
                            onClick={() => setActiveHoroscope(null)}
                            className="absolute top-4 right-4 p-2 rounded-xl bg-white/5 text-slate-400 hover:text-white"
                        >
                            <X className="w-5 h-5" />
                        </button>

                        <div className="text-center space-y-2">
                            <div className="text-5xl">{activeHoroscope.icon}</div>
                            <h3 className="font-serif font-bold text-2xl text-white">{activeHoroscope.name}</h3>
                            <p className="text-xs text-amber-300 font-mono">{activeHoroscope.dates} • Element: {activeHoroscope.element}</p>
                        </div>

                        <div className="bg-white/5 p-4 rounded-2xl border border-white/10 text-xs text-slate-300 leading-relaxed">
                            {activeHoroscope.daily}
                        </div>

                        <button
                            onClick={() => setActiveHoroscope(null)}
                            className="w-full bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs py-3 rounded-xl transition-all"
                        >
                            Close Insight
                        </button>
                    </div>
                </div>
            )}

            {/* WEB MODAL 5: WALLET RECHARGE DRAWER */}
            { }
            {isWalletOpen && (
                <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-lg flex items-center justify-center p-4">
                    <div className="bg-[#0B051D] w-full max-w-md rounded-3xl border border-amber-500/30 p-6 space-y-6 shadow-2xl relative">

                        <div className="flex items-center justify-between border-b border-white/10 pb-4">
                            <div className="flex items-center gap-2 text-amber-300 font-serif font-bold text-lg">
                                <Wallet className="w-5 h-5 text-amber-400" />
                                <span>Cosmic Wallet Recharge</span>
                            </div>
                            <button
                                onClick={() => setIsWalletOpen(false)}
                                className="p-1 rounded-xl text-slate-400 hover:text-white"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="bg-gradient-to-r from-purple-900/60 via-indigo-900/60 to-purple-950/60 p-5 rounded-2xl border border-amber-400/30 space-y-1">
                            <span className="text-xs text-amber-300/80 font-medium">Current Available Balance</span>
                            <div className="text-3xl font-extrabold text-amber-300">₹{walletBalance}</div>
                        </div>

                        <div className="space-y-3">
                            <label className="text-xs font-bold text-slate-300 block">Select Quick Top-Up Amount</label>
                            <div className="grid grid-cols-3 gap-3">
                                {[100, 300, 500, 1000, 2000, 5000].map((amt) => (
                                    <button
                                        key={amt}
                                        onClick={() => {
                                            playCosmicChime(700);
                                            setWalletBalance(prev => prev + amt);
                                        }}
                                        className="bg-white/5 hover:bg-amber-400/20 border border-white/10 hover:border-amber-400 text-amber-300 font-bold py-3 rounded-2xl text-xs transition-all shadow-md"
                                    >
                                        + ₹{amt}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <button
                            onClick={() => setIsWalletOpen(false)}
                            className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs py-3.5 rounded-2xl transition-all shadow-lg"
                        >
                            Done & Return to Directory
                        </button>

                    </div>
                </div>
            )}

            {/* WEB MODAL 6: EXPERT PROFILE DRAWER */}
            { }
            {activeProfileExpert && (
                <div className="fixed inset-0  z-50 bg-black/80 backdrop-blur-lg flex items-center justify-center p-4">
                    <div className="bg-[#0B051D] hide w-full max-w-xl rounded-3xl border border-amber-500/30 p-6 lg:p-8 space-y-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">

                        <button
                            onClick={() => setActiveProfileExpert(null)}
                            className="absolute top-6 right-6 p-2 rounded-xl bg-white/5 text-slate-400 hover:text-white"
                        >
                            <X className="w-5 h-5" />
                        </button>

                        {/* Header */}
                        <div className="flex items-center gap-5">
                            <img
                                src={
                                    selectedPartner?.profilePic ||
                                    "https://ui-avatars.com/api/?name=" +
                                    encodeURIComponent(activeProfileExpert.fullName)
                                }
                                alt={selectedPartner?.fullName}
                                className="w-20 h-20 rounded-2xl object-cover border-2 border-amber-400 shadow-xl"
                            />

                            <div className="space-y-1">
                                <div className="flex items-center gap-2">
                                    <h3 className="font-serif font-bold text-2xl text-white">
                                        {selectedPartner?.fullName}
                                    </h3>

                                    {selectedPartner?.isVerified && (
                                        <ShieldCheck className="w-5 h-5 text-amber-400 fill-amber-400/20" />
                                    )}
                                </div>

                                <p className="text-xs text-amber-300">
                                    {selectedPartner?.specialties?.join(" • ")}
                                </p>

                                <div className="flex items-center gap-2 text-amber-400 font-bold text-xs pt-1">
                                    <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                                    <span>
                                        {Number(selectedPartner?.averageRating || 0).toFixed(1)}
                                        {" "}
                                        ({selectedPartner?.totalReviews || 0} Reviews)
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* About */}
                        <div className="space-y-2 text-xs text-slate-300">
                            <h4 className="font-bold text-amber-300 uppercase tracking-wider">
                                About
                            </h4>

                            <p className="leading-relaxed bg-white/5 p-4 rounded-2xl border border-white/10">
                                {selectedPartner?.bio || "No bio available."}
                            </p>
                        </div>

                        {/* Details */}
                        <div className="grid grid-cols-2 gap-3 text-xs text-slate-300">

                            <div className="bg-white/5 p-3 rounded-xl border border-white/5">
                                <span className="text-slate-400 block text-[10px]">
                                    Experience
                                </span>

                                <span className="font-bold text-white">
                                    {selectedPartner?.experience} Years
                                </span>
                            </div>

                            <div className="bg-white/5 p-3 rounded-xl border border-white/5">
                                <span className="text-slate-400 block text-[10px]">
                                    Qualification
                                </span>

                                <span className="font-bold text-white">
                                    {selectedPartner?.qualification}
                                </span>
                            </div>

                            <div className="bg-white/5 p-3 rounded-xl border border-white/5">
                                <span className="text-slate-400 block text-[10px]">
                                    City
                                </span>

                                <span className="font-bold text-white">
                                    {selectedPartner?.city}
                                </span>
                            </div>

                            <div className="bg-white/5 p-3 rounded-xl border border-white/5">
                                <span className="text-slate-400 block text-[10px]">
                                    Languages
                                </span>

                                <span className="font-bold text-white">
                                    {selectedPartner?.languages?.join(", ")}
                                </span>
                            </div>

                            <div className="bg-white/5 p-3 rounded-xl border border-white/5 col-span-2">
                                <span className="text-slate-400 block text-[10px]">
                                    Specialties
                                </span>

                                <span className="font-bold text-white">
                                    {selectedPartner?.specialties?.join(", ")}
                                </span>
                            </div>

                        </div>

                        {/* Footer */}
                        <div className="flex items-center justify-between pt-4 border-t border-white/10">

                            <div>
                                <span className="text-xs text-slate-400 block">
                                    Consultation Fee
                                </span>

                                <span className="font-extrabold text-amber-300 text-lg">
                                    ₹{selectedPartner?.minRate}/min
                                </span>
                            </div>

                            <button
                                onClick={() => {
                                    setActiveProfileExpert(null);
                                    setShowBooking(true);
                                }}
                                className="bg-amber-400 hover:bg-amber-300 text-slate-950 px-6 py-3 rounded-2xl font-bold text-xs transition-all shadow-lg"
                            >
                                Book Appointment
                            </button>

                        </div>

                    </div>
                </div>
            )}

            {showBooking && (
                <BookAppointmentPopup
                    astrologer={{ name: "Acharya Sharma", tag: "Vedic Expert", rating: 4.9, image: "..." }}
                    onClose={() => setShowBooking(false)}
                    onProceedToPayment={(data) => {

                        setShowBooking(false);   // Book popup close

                        setShowWallet(true);     // Wallet popup open

                    }}
                />
            )}

            {showWallet && (
                <InsufficientBalancePopup
                    currentBalance={100}
                    requiredAmount={125}
                    onClose={() => setShowWallet(false)}
                    onProceed={(amount) => {
                        console.log("Recharge Amount :", amount);

                        // Yahan payment page pe redirect kar sakte ho
                        // navigate("/wallet-payment", { state: { amount } });
                        setShowSuccess(true)
                        setShowWallet(false);
                    }}
                />
            )}

            {showSuccess && (
                <BookingConfirmedPopup
                    astrologer={{
                        name: "Acharya Sharma",
                        tag: "Vedic Expert",
                        rating: 4.9,
                        image: "https://i.pravatar.cc/150?img=12",
                    }}
                    booking={{
                        date: "24 July 2026",
                        time: "10:30 AM",
                        mode: "Chat",
                    }}
                    onClose={() => setShowSuccess(false)}
                    onMyBookings={() => {
                        setShowSuccess(false);

                        // React Router
                        navigate("/my-bookings");
                    }}
                />
            )}

        </div>
    );
}