import React, { useState, useEffect } from 'react';
import {
    ArrowLeft,
    Bookmark,
    Share2,
    Sparkles,
    CheckCircle2,
    Clock,
    Calendar,
    Send,
    Check,
    ChevronRight,
    Moon,
    Star,
    Heart,
    Eye,
    Compass,
    CheckSquare,
    Square,
    Sun,
    Flame,
    Volume2,
    VolumeX,
    Zap,
    TrendingUp,
    Award,
    Radio,
    Sliders
} from 'lucide-react';
import { useParams } from 'react-router-dom';
import { addToCart, getProductById, getRelatedProducts } from '../../API/cosmicApis';
import toast from 'react-hot-toast';
import AddToCartPopup from '../Cart/AddToCartPopUp';
import Loader from '../../components/Loader';

const INSIGHTS_DATA = {
    'great-conjunction': {
        id: 'great-conjunction',
        category: 'CELESTIAL ALIGNMENT',
        superTitle: "Lunar Rhythms: Decoding the Moon's Cycles",
        title: 'The Great Conjunction: Harvesting Divine Energy During the Lunar Peak',
        subtitle: 'An ancient Vedic blueprint for aligning your spiritual vessel during the rare moon alignment.',
        author: {
            name: 'Dr. Ananya Sharma',
            role: 'Lead Vedic Astrologer & Sanskrit Scholar',
            avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=300',
            date: 'Oct 24, 2023',
            readTime: '6 min read',
            views: '14.2k'
        },
        heroImage: 'https://images.unsplash.com/photo-1532693322450-2cb5c511067d?auto=format&fit=crop&q=80&w=1400',
        leadQuote: 'As the moon reaches its zenith and aligns with the cosmic center, the veil between the material and spiritual world thins. This period offers a unique gateway for those seeking to reset their karmic path.',
        introText: 'Understanding the current lunar peak requires more than just looking at the sky; it requires an inner calibration. In Vedic astrology, this specific alignment is known as the "Chandra Shuddhi", a moment of pure emotional clarity and mental fortitude. When the moon sits in its exaltation, our subconscious mind becomes highly receptive to positive affirmations and ritualistic shifts.',
        keyTakeaways: [
            { text: 'The cosmic peak occurs precisely at 03:42 AM IST, marking the strongest energetic window of the month.' },
            { text: 'Deep meditation during this window is 10x more effective for subconscious reprogramming and karmic balance.' },
            { text: 'Focus activation on throat and heart chakras for effective manifestation and authentic vocal expression.' }
        ],
        midBodyText: 'During this phase, the planetary ruler of your Rashi will play a pivotal role. For those with Moon in Taurus or Cancer, the effects will be deeply grounded and nurturing. Conversely, fire signs may feel a surge of creative unrest that needs to be channeled through structured ritual work.',
        pullQuote: 'The stars do not compel, they impel. It is our conscious choice to align our sails with the cosmic winds.',
        ritualTitle: 'Actionable Ritual: The Silver Vessel Manifestation',
        ritualIntro: 'To capture the essence of this alignment, follow this simple yet potent ritual before the moon reaches its peak tonight:',
        ritualSteps: [
            { id: 1, title: 'Prepare the Vessel', desc: 'Fill a silver or ceramic bowl with filtered water and place it under direct moonlight for 3 hours.' },
            { id: 2, title: 'Intention Setting', desc: 'Write your primary intention on a piece of saffron-colored paper and place it beneath the vessel.' },
            { id: 3, title: 'Lunar Activation', desc: 'At 03:42 AM, sip the energized moon water while visualizing your manifestation taking root in physical reality.' }
        ],
        closingText: 'As the night concludes, reflect on the shifts you feel. Astrology is a tool for self-awareness, and these insights are merely the map—you are the traveler.',
        tags: ['Moon Magic', 'Vedic Rituals', 'Astrology', 'Chandra Shuddhi']
    },
    'home-planetary-balance': {
        id: 'home-planetary-balance',
        category: 'LIFESTYLE & VASTU',
        superTitle: 'Harmonious Spaces: Sacred Geometry',
        title: 'Designing Your Home Sanctuary for Optimal Planetary Balance',
        subtitle: 'Transform your interior living space into a cosmic sanctuary that magnetizes peace, health, and abundance.',
        author: {
            name: 'Acharya Vasudha',
            role: 'Vastu & Energy Master',
            avatar: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&q=80&w=300',
            date: 'Nov 02, 2023',
            readTime: '5 min read',
            views: '9.8k'
        },
        heroImage: 'https://images.unsplash.com/photo-1507089947368-19c1da9775ae?auto=format&fit=crop&q=80&w=1400',
        leadQuote: 'Your living environment is an outer reflection of your inner cosmic state. Rearranging spatial elements unlocks clogged prana.',
        introText: 'Aligning your living sanctuary with directional planetary energies ensures steady mental peace, harmonious relationships, and sustained prosperity.',
        keyTakeaways: [
            { text: 'Keep the North-East quadrant uncluttered and open for divine cosmic flow (Ishan Kona).' },
            { text: 'Incorporate pure copper elements in the South-East corner to balance Agni (Fire energy).' },
            { text: 'Use warm ambient amber lighting during twilight hours to soothe heavy Saturn influences.' }
        ],
        midBodyText: 'When energy stagnates in corners of the home, residents often feel unwarranted exhaustion. Simple acoustic cleansing using high-frequency brass bells can instantly reset room vibrations.',
        pullQuote: 'A home aligned with the cosmos becomes an impenetrable sanctuary for the human soul.',
        ritualTitle: 'Actionable Ritual: Salt & Sage Space Reset',
        ritualIntro: 'Perform this spatial aura cleansing ritual during sunset to dissipate stagnant energies:',
        ritualSteps: [
            { id: 1, title: 'Rock Salt Placement', desc: 'Place unrefined Himalayan pink salt in small ceramic dishes in all four corners of your primary workspace.' },
            { id: 2, title: 'Acoustic Sounding', desc: 'Ring a brass bell 108 times starting from the main entrance moving clockwise throughout each room.' }
        ],
        closingText: 'Observe how natural light and stagnant energy flow through your rooms over the next 7 days.',
        tags: ['Vastu Shastra', 'Home Energy', 'Spiritual Living', 'Sacred Space']
    },
    'saturn-retrograde': {
        id: 'saturn-retrograde',
        category: 'PLANETARY SHIFTS',
        superTitle: 'Cosmic Realignment & Career',
        title: "Saturn's Retrograde: Navigating Career Transitions & Karma",
        subtitle: 'Mastering the slow burn of Shani Dev to build unbreakable professional foundations.',
        author: {
            name: 'Dr. R.K. Gupta',
            role: 'Vedic Astrology Scholar',
            avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=300',
            date: 'Oct 18, 2023',
            readTime: '8 min read',
            views: '18.5k'
        },
        heroImage: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=1400',
        leadQuote: 'Saturn does not punish; he audits. Retrograde cycles are divine invitations to re-evaluate our long-term karmic ambitions.',
        introText: 'While retrograde periods can feel like sudden roadblocks, they actually protect us from hasty commitments that lack soul substance.',
        keyTakeaways: [
            { text: 'Review past business contracts and complete unfinished professional commitments meticulousness.' },
            { text: 'Avoid launching impulsive, high-risk commercial ventures without thorough structural audits.' },
            { text: 'Patience cultivated under Saturn transforms into enduring leadership and authority later.' }
        ],
        midBodyText: 'Saturn demands absolute discipline, integrity, and authenticity. Any endeavor built on weak or superficial foundations will require reconstruction during this cycle.',
        pullQuote: 'Delays are not denials; they are divine recalibrations preparing you for greater weight.',
        ritualTitle: 'Actionable Ritual: Grounding Karma Meditation',
        ritualIntro: 'Anchor your career energy and focus with this grounding grounding practice:',
        ritualSteps: [
            { id: 1, title: 'Black Tourmaline Focus', desc: 'Hold a grounding stone during sunrise meditation while reflecting on career ambitions.' },
            { id: 2, title: 'Journaling Audit', desc: 'Write down 3 professional habits you need to surrender to make room for authentic authority.' }
        ],
        closingText: 'Trust the slower pace—it is laying the bedrock for your enduring legacy.',
        tags: ['Saturn Retrograde', 'Career Forecast', 'Karma', 'Vedic Astrology']
    }
};

export default function App() {
    const [currentInsightKey, setCurrentInsightKey] = useState('great-conjunction');
    const [isBookmarked, setIsBookmarked] = useState(false);
    const [isLiked, setIsLiked] = useState(false);
    const [likeCount, setLikeCount] = useState(482);
    const [emailInput, setEmailInput] = useState('');
    const [subscribed, setSubscribed] = useState(false);
    const [completedSteps, setCompletedSteps] = useState({});
    const [showShareToast, setShowShareToast] = useState(false);
    const [scrollProgress, setScrollProgress] = useState(0);
    const [isPlayingAudio, setIsPlayingAudio] = useState(false);
    const [followingAuthor, setFollowingAuthor] = useState(false);

    const article = INSIGHTS_DATA[currentInsightKey] || INSIGHTS_DATA['great-conjunction'];
    const handleSelectArticle = (key) => {
        setCurrentInsightKey(key);
        window.scrollTo({ top: 0, behavior: 'smooth' });
        setCompletedSteps({});
    };

    const toggleStep = (stepId) => {
        setCompletedSteps(prev => ({ ...prev, [stepId]: !prev[stepId] }));
    };

    const handleShare = () => {
        if (navigator.clipboard) {
            navigator.clipboard.writeText(window.location.href);
        }
        setShowShareToast(true);
        setTimeout(() => setShowShareToast(false), 3000);
    };

    const handleSubscribe = (e) => {
        e.preventDefault();
        if (emailInput.trim()) {
            setSubscribed(true);
            setEmailInput('');
            setTimeout(() => setSubscribed(false), 5000);
        }
    };

    const completedCount = Object.values(completedSteps).filter(Boolean).length;
    const totalSteps = article.ritualSteps.length;
    const progressPercent = Math.round((completedCount / totalSteps) * 100);




    const { id } = useParams();

    const [productDetail, setProductDetail] = useState({});
    const [relatedProducts, setRelatedProducts] = useState([])
    const [loading, setLoading] = useState(false);
    const [quantity, setQuantity] = useState(1);
    const [showPopup, setShowPopup] = useState(false);

    const fetchProductDetail = async () => {
        try {
            setLoading(true)
            const res = await getProductById(id);

            console.log("API  jj:", res.data);

            setProductDetail(res.data.data);
            setLoading(false)
        } catch (error) {
            console.error(error);
        }
    };

    const fetchRelatedProduct = async () => {
        try {
            setLoading(true)
            const res = await getRelatedProducts(id);
            console.log("API:", res.data);
            setRelatedProducts(res.data.data);
            setLoading(false)
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        if (id) {
            fetchProductDetail();
            fetchRelatedProduct()
        }
    }, [id]);


    const handleAddToCart = async () => {
        try {
            const res = await addToCart({
                productId: productDetail._id,
                quantity: 1,
            });

            if (res.data.success) {
                setShowPopup(true);

                setTimeout(() => {
                    setShowPopup(false);
                }, 3000);
            }

        } catch (error) {
            console.log(error);
        }
    };


    if(loading){
        return(
            <Loader/>
        )
    }

    return (
        <div className="min-h-screen bg-[#FDFBF7] text-[#2A2438] font-sans selection:bg-amber-200 selection:text-purple-950 pb-20 relative overflow-x-hidden">

            {/* Dynamic Background Twinkling Effect */}
            <div className="fixed inset-0 pointer-events-none z-0 opacity-40">
                <div className="absolute top-10 left-1/4 w-96 h-96 bg-purple-200/30 rounded-full blur-3xl animate-pulse" />
                <div className="absolute top-1/3 right-10 w-80 h-80 bg-amber-200/20 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '6s' }} />
                <div className="absolute bottom-10 left-1/3 w-[500px] h-[500px] bg-indigo-100/30 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '8s' }} />
            </div>

            { }
            <div className="fixed top-0 left-0 w-full h-1.5 bg-purple-100/60 z-50 backdrop-blur-sm">
                <div
                    className="h-full bg-gradient-to-r from-amber-500 via-purple-600 to-amber-400 transition-all duration-150 ease-out shadow-[0_0_12px_rgba(245,158,11,0.8)]"
                    style={{ width: `${scrollProgress}%` }}
                />
            </div>

            { }
            <header className="sticky top-0 z-40 bg-[#FDFBF7]/85 backdrop-blur-xl border-b border-purple-100/80 transition-all duration-300 shadow-sm">
                <div className="max-w-[1400px] mx-auto px-4 sm:px-8 h-18 flex items-center justify-between">
                    <button
                        onClick={() => handleSelectArticle('great-conjunction')}
                        className="flex items-center gap-2.5 text-slate-700 hover:text-purple-950 transition-all p-2 -ml-2 rounded-2xl hover:bg-purple-50/80 group"
                        aria-label="Go Back"
                    >
                        {/* <div className="w-9 h-9 rounded-xl bg-purple-100/70 text-purple-900 flex items-center justify-center group-hover:scale-105 group-hover:bg-purple-900 group-hover:text-amber-300 transition-all">
              <ArrowLeft className="w-4 h-4" />
            </div> */}
                        <div className="text-left hidden sm:block">
                            {/* <span className="text-[10px] font-bold text-amber-700 tracking-widest uppercase block">Navigation</span> */}
                            <span className="text-xs font-serif font-bold text-purple-950">Cosmic Insights</span>
                        </div>
                    </button>

                    <div className="hidden md:flex items-center gap-2 bg-amber-50/80 border border-amber-200/60 px-4 py-1.5 rounded-full shadow-inner">
                        <Sparkles className="w-3.5 h-3.5 text-amber-600 animate-spin" style={{ animationDuration: '8s' }} />
                        <span className="text-[11px] font-extrabold text-amber-900 tracking-wider uppercase">
                            {productDetail?.category?.name}
                        </span>
                    </div>

                    <div className="flex items-center gap-2 sm:gap-3">
                        {/* Read Aloud Simulation Button */}
                        <button
                            onClick={() => setIsPlayingAudio(!isPlayingAudio)}
                            className={`px-3 py-2 rounded-full transition-all text-xs font-semibold flex items-center gap-1.5 border ${isPlayingAudio
                                ? 'bg-amber-400 text-purple-950 border-amber-500 shadow-md animate-pulse'
                                : 'bg-white text-slate-700 border-purple-100 hover:bg-purple-50'
                                }`}
                            title="Listen to Article"
                        >
                            {isPlayingAudio ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4 text-slate-400" />}
                            <span className="hidden md:inline">{isPlayingAudio ? 'Playing Audio...' : 'Listen'}</span>
                        </button>

                        {/* Like Button */}
                        <button
                            onClick={() => {
                                setIsLiked(!isLiked);
                                setLikeCount(prev => isLiked ? prev - 1 : prev + 1);
                            }}
                            className={`px-3 py-2 rounded-full transition-all flex items-center gap-1.5 text-xs font-bold border ${isLiked
                                ? 'bg-rose-50 border-rose-200 text-rose-600 shadow-sm'
                                : 'bg-white border-purple-100 text-slate-700 hover:bg-rose-50/50'
                                }`}
                            title="Like Insight"
                        >
                            <Heart className={`w-4 h-4 transition-transform active:scale-125 ${isLiked ? 'fill-rose-500 text-rose-500' : ''}`} />
                            <span>{likeCount}</span>
                        </button>

                        {/* Bookmark Button */}
                        <button
                            onClick={() => setIsBookmarked(!isBookmarked)}
                            className={`p-2.5 rounded-full transition-all border ${isBookmarked
                                ? 'bg-purple-900 text-amber-300 border-purple-950 shadow-md'
                                : 'bg-white border-purple-100 text-slate-700 hover:bg-purple-50'
                                }`}
                            title="Bookmark Article"
                        >
                            <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-amber-300' : ''}`} />
                        </button>

                        {/* Share Button */}
                        <button
                            onClick={handleShare}
                            className="p-2.5 rounded-full bg-white border border-purple-100 text-slate-700 hover:bg-purple-50 hover:text-purple-900 transition-all"
                            title="Share Article"
                        >
                            <Share2 className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </header>

            { }
            {showShareToast && (
                <div className="fixed top-22 right-6 z-50 bg-purple-950 text-amber-200 px-5 py-3.5 rounded-2xl shadow-2xl flex items-center gap-3 text-xs border border-purple-700/60 animate-bounce">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                    <span className="font-medium">Cosmic insight link copied to clipboard!</span>
                </div>
            )}

            { }
            <main className="max-w-[1400px] mx-auto px-4 sm:px-8 py-8 sm:py-12 relative z-10">

                <div className="grid grid-cols-1 xl:grid-cols-12 gap-10 lg:gap-12 items-start">

                    {/* LEFT PRIMARY ARTICLE CONTENT (8 COLUMNS) */}
                    <div className="xl:col-span-8 space-y-10 ">

                        {/* Super Title & Article Heading Block */}
                        <div className="space-y-4 text-left">
                            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-100/80 border border-purple-200 text-purple-900 text-xs font-bold tracking-wider uppercase">
                                <Moon className="w-3.5 h-3.5 text-amber-600" />
                                <span>Premium Spiritual Product</span>
                            </div>
                            <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-extrabold text-purple-950 leading-[1.18] tracking-tight">
                                {article.title}
                            </h1>
                            <p className="text-slate-600 text-base sm:text-lg font-normal leading-relaxed max-w-3xl">
                                {productDetail?.shortDescription}
                            </p>

                            <div className="flex flex-wrap items-center gap-4 pt-3">

                                <span className="text-4xl font-black text-purple-900">
                                    ₹{productDetail?.salePrice}
                                </span>

                                <span className="text-2xl line-through text-slate-400">
                                    ₹{productDetail?.price}
                                </span>

                                <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-bold">
                                    {Math.round(
                                        ((productDetail?.price - productDetail?.salePrice) /
                                            productDetail?.price) * 100
                                    )}% OFF
                                </span>

                            </div>
                        </div>

                        {/* Hero Image Container with Parallax hover effect */}
                        <div className="relative overflow-hidden rounded-[32px] sm:rounded-[40px] border border-purple-200/80 shadow-2xl group">
                            <div className="absolute inset-0 bg-gradient-to-tr from-purple-950/40 via-transparent to-amber-500/10 z-10 pointer-events-none" />

                            <img
                                src={productDetail?.images?.[0]}
                                alt={productDetail?.name}
                                className="w-full h-[320px] sm:h-[460px] md:h-[540px] object-cover transition-transform duration-1000 group-hover:scale-105"
                            />

                            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent z-10" />

                            <div className="absolute bottom-6 left-6 right-6 sm:bottom-8 sm:left-8 sm:right-8 z-20 flex flex-wrap justify-between items-end gap-4">
                                <div className="space-y-2">
                                    <span className="inline-flex items-center gap-2 rounded-full bg-white/20 backdrop-blur-md px-4 py-1.5 text-amber-200 text-xs font-bold uppercase tracking-[2px] border border-white/30 shadow-lg">
                                        <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                                        Premium Authentic Product
                                    </span>
                                    <p className="text-white/90 text-xs sm:text-sm font-medium hidden sm:block">
                                        Original • Spiritual • Trusted Quality
                                    </p>
                                </div>

                                <div className="flex items-center gap-3">
                                    <div className="rounded-2xl bg-black/40 backdrop-blur-md px-4 py-2.5 text-white border border-white/20 text-xs flex items-center gap-2 shadow-lg">
                                        <Clock className="w-4 h-4 text-amber-400" />
                                        <span>
                                            ₹{productDetail?.salePrice}
                                        </span>
                                    </div>
                                    <div className="rounded-2xl bg-black/40 backdrop-blur-md px-4 py-2.5 text-white border border-white/20 text-xs flex items-center gap-2 shadow-lg">
                                        <Eye className="w-4 h-4 text-amber-400" />
                                        <span>
                                            Stock : {productDetail?.stock}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        { }
                        <div className="bg-white rounded-[32px] sm:rounded-[40px] border border-purple-100/90 shadow-xl shadow-purple-950/5 p-6 sm:p-10 md:p-12 space-y-9 relative">

                            {/* Author Information Header */}
                            <div className="pb-6 border-b border-purple-100/80 flex flex-wrap items-center justify-between gap-6">

                                <div className="flex items-center gap-5">

                                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-900 to-purple-700 flex items-center justify-center shadow-lg">
                                        <Sparkles className="w-8 h-8 text-amber-400" />
                                    </div>

                                    <div>

                                        <h3 className="font-serif text-2xl font-bold text-purple-950">
                                            {productDetail?.name}
                                        </h3>

                                        <p className="text-sm text-slate-500 mt-1">
                                            Category :
                                            <span className="font-semibold text-purple-800 ml-2">
                                                {productDetail?.category?.name}
                                            </span>
                                        </p>

                                    </div>

                                </div>

                                <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-purple-200 bg-white/95 backdrop-blur-xl p-4 shadow-2xl md:hidden">

                                    <div className="flex gap-3">

                                        <button
                                            onClick={handleAddToCart}
                                            disabled={loading}
                                            className="flex-1 hover:sacle-105 duration-150 rounded-2xl border-2 border-purple-900 py-4 font-bold text-purple-900 transition-all disabled:opacity-60"
                                        >
                                            {loading ? "Adding..." : "Add to Cart"}
                                        </button>

                                        {/* <button
                                            className="flex-1 rounded-2xl bg-gradient-to-r from-purple-900 to-indigo-900 py-4 font-bold text-amber-300"
                                        >
                                            Buy Now
                                        </button> */}

                                    </div>

                                </div>

                            </div>

                            {/* Highlight Lead Quote */}
                            <div className="bg-gradient-to-r from-purple-50 via-amber-50 to-purple-50 rounded-3xl p-6 border-l-4 border-amber-400">

                                <h2 className="font-serif text-2xl font-bold text-purple-950 mb-3">
                                    Product Description
                                </h2>

                                <p className="text-slate-700 leading-8">
                                    {productDetail?.description}
                                </p>

                            </div>

                            {/* Introductory Section Paragraph */}
                            <div className="space-y-4">

                                <h2 className="text-2xl font-bold text-purple-950">
                                    Product Highlights
                                </h2>

                                <div className="grid md:grid-cols-2 gap-4">

                                    <div className="rounded-2xl bg-purple-50 p-5">
                                        <p className="text-xs uppercase font-bold text-slate-500">
                                            Original Price
                                        </p>

                                        <p className="text-2xl font-bold text-slate-500 line-through">
                                            ₹{productDetail?.price}
                                        </p>
                                    </div>

                                    <div className="rounded-2xl bg-amber-50 p-5">

                                        <p className="text-xs uppercase font-bold text-slate-500">
                                            Offer Price
                                        </p>

                                        <p className="text-3xl font-black text-purple-900">
                                            ₹{productDetail?.salePrice}
                                        </p>

                                    </div>

                                    <div className="rounded-2xl bg-green-50 p-5">

                                        <p className="text-xs uppercase font-bold text-slate-500">
                                            Availability
                                        </p>

                                        <p className="text-xl font-bold text-green-700">
                                            {productDetail?.stock} In Stock
                                        </p>

                                    </div>

                                    <div className="rounded-2xl bg-indigo-50 p-5">

                                        <p className="text-xs uppercase font-bold text-slate-500">
                                            Discount
                                        </p>

                                        <p className="text-2xl font-black text-indigo-700">

                                            {Math.round(
                                                ((productDetail?.price -
                                                    productDetail?.salePrice) /
                                                    productDetail?.price) *
                                                100
                                            )}% OFF

                                        </p>

                                    </div>

                                </div>

                            </div>

                            { }
                            <div className="bg-gradient-to-br from-[#FAF8F5] to-amber-50/40 rounded-3xl p-6 sm:p-8 border-l-4 border-amber-500 border border-amber-200/60 shadow-sm space-y-5">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2.5 text-purple-950">
                                        <div className="w-8 h-8 rounded-xl bg-amber-400/30 text-amber-800 flex items-center justify-center">
                                            <Sparkles className="w-4 h-4" />
                                        </div>
                                        <h3 className="font-serif font-bold text-xl">Product Benefits</h3>
                                    </div>
                                    <span className="text-[10px] font-extrabold uppercase tracking-widest text-amber-800 bg-amber-200/60 px-3 py-1 rounded-full">
                                        Essential Guidance
                                    </span>
                                </div>

                                <ul className="space-y-3.5">
                                    {productDetail?.benefits?.map((item, index) => (

                                        <li
                                            key={index}
                                            className="flex items-start gap-3.5 text-sm text-slate-800"
                                        >
                                            <span className="w-7 h-7 rounded-full bg-amber-400 text-purple-950 flex items-center justify-center font-black">
                                                {index + 1}
                                            </span>

                                            <span>{item}</span>

                                        </li>

                                    ))}
                                </ul>
                            </div>


                            {/* Center Styled Pull Quote */}
                            <div className="space-y-8">

                                <div>

                                    <h2 className="text-3xl font-serif font-bold text-purple-950 mb-4">
                                        How To Use
                                    </h2>

                                    <p className="text-slate-700 text-lg leading-8">
                                        {productDetail?.howToUse}
                                    </p>

                                </div>

                                <div className="bg-gradient-to-r from-purple-100 via-amber-50 to-purple-100 rounded-3xl p-8 border border-purple-200">

                                    <h3 className="text-xl font-bold text-purple-950 mb-3">
                                        Spiritual Tip ✨
                                    </h3>

                                    <p className="text-slate-700 italic text-lg">
                                        Wear this product with positive intentions and cleanse it regularly
                                        to maintain its spiritual energy.
                                    </p>

                                </div>

                            </div>

                            { }
                            <div className="space-y-6 pt-2">
                                <div className="bg-purple-950 text-white rounded-3xl p-6 sm:p-8 space-y-6 relative overflow-hidden border border-purple-800 shadow-xl">

                                    {/* Subtle Glow background */}
                                    <div className="absolute -top-12 -right-12 w-48 h-48 bg-amber-500/20 rounded-full blur-2xl pointer-events-none" />



                                    {/* Step List Cards */}
                                    <div className="space-y-6">

                                        <h2 className="font-serif text-3xl font-bold text-purple-950">
                                            Product Gallery
                                        </h2>

                                        <div className="grid md:grid-cols-2 gap-6">

                                            {productDetail?.images?.map((img, index) => (

                                                <div
                                                    key={index}
                                                    className="overflow-hidden rounded-3xl border border-purple-200 shadow-lg group"
                                                >

                                                    <img
                                                        src={img}
                                                        alt=""
                                                        className="w-full h-80 object-cover transition duration-700 group-hover:scale-110"
                                                    />

                                                </div>

                                            ))}

                                        </div>

                                    </div>
                                </div>
                            </div>

                            {/* Closing Summary Paragraph */}
                            <div className="bg-amber-50 border-l-4 border-amber-400 rounded-r-3xl p-6">

                                <h3 className="font-bold text-xl text-purple-950 mb-3">
                                    Care Instructions
                                </h3>

                                <p className="text-slate-700 leading-8">
                                    {productDetail?.careInstructions}
                                </p>

                            </div>

                            {/* Article Footer Tags & Actions */}
                            <div className="pt-4 flex flex-wrap items-center justify-between gap-4 border-t border-purple-100/80">
                                <div className="flex flex-wrap gap-3">

                                    <span className="bg-purple-100 px-4 py-2 rounded-full text-sm font-semibold">
                                        #{productDetail?.category?.name}
                                    </span>

                                    <span className="bg-amber-100 px-4 py-2 rounded-full text-sm font-semibold">
                                        #Spiritual
                                    </span>

                                    <span className="bg-green-100 px-4 py-2 rounded-full text-sm font-semibold">
                                        #Original
                                    </span>

                                    <span className="bg-indigo-100 px-4 py-2 rounded-full text-sm font-semibold">
                                        #Meditation
                                    </span>

                                </div>

                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={handleShare}
                                        className="p-2.5 rounded-full bg-purple-50 hover:bg-purple-100 text-purple-900 transition-all"
                                        title="Share Article"
                                    >
                                        <Share2 className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={() => setIsBookmarked(!isBookmarked)}
                                        className="p-2.5 rounded-full bg-purple-50 hover:bg-purple-100 text-purple-900 transition-all"
                                        title="Bookmark Article"
                                    >
                                        <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-purple-900' : ''}`} />
                                    </button>
                                </div>
                            </div>

                        </div>

                        { }
                        <section className="bg-gradient-to-br  from-purple-950 via-indigo-950 to-slate-950 rounded-[32px] sm:rounded-[40px] p-8 sm:p-12 text-white text-center space-y-5 shadow-2xl relative overflow-hidden border border-purple-800/60">

                            <div className="absolute top-0 right-0 w-60 h-60 bg-amber-400/10 rounded-full blur-3xl pointer-events-none" />
                            <div className="absolute bottom-0 left-0 w-60 h-60 bg-purple-500/20 rounded-full blur-3xl pointer-events-none" />

                            <div className="relative z-10 max-w-xl mx-auto space-y-4">
                                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-500 text-purple-950 flex items-center justify-center mx-auto shadow-lg shadow-amber-500/20 font-black">
                                    <Star className="w-6 h-6 fill-purple-950" />
                                </div>

                                <h3 className="font-serif text-2xl sm:text-3xl font-extrabold tracking-tight">
                                    Never Miss a Cosmic Alignment
                                </h3>

                                <p className="text-xs sm:text-sm text-purple-200/90 leading-relaxed max-w-md mx-auto">
                                    Receive curated weekly astrological forecasts, high-resonance transit warnings, and sacred ritual guides directly in your inbox.
                                </p>

                                {subscribed ? (
                                    <div className="bg-emerald-500/20 border border-emerald-400/50 text-emerald-200 p-4 rounded-2xl text-xs font-semibold flex items-center justify-center gap-2 animate-in fade-in">
                                        <Check className="w-5 h-5 text-emerald-400 shrink-0" />
                                        <span>Your cosmic subscription is active. Blessings upon your path!</span>
                                    </div>
                                ) : (
                                    <form onSubmit={handleSubscribe} className="space-y-3 pt-2 max-w-md mx-auto">
                                        <div className="relative">
                                            <input
                                                type="email"
                                                value={emailInput}
                                                onChange={(e) => setEmailInput(e.target.value)}
                                                placeholder="Enter your sacred email address..."
                                                required
                                                className="w-full bg-purple-900/60 border border-purple-700/80 rounded-full px-6 py-4 text-xs sm:text-sm text-white placeholder-purple-300/60 focus:outline-none focus:ring-2 focus:ring-amber-400/80 transition-all shadow-inner"
                                            />
                                        </div>

                                        <button
                                            type="submit"
                                            className="w-full bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-purple-950 font-extrabold text-xs sm:text-sm py-4 rounded-full shadow-lg shadow-amber-500/25 transition-all transform active:scale-98 flex items-center justify-center gap-2 uppercase tracking-wider"
                                        >
                                            <span>Join Cosmic Circle</span>
                                            <Send className="w-4 h-4" />
                                        </button>
                                    </form>
                                )}

                                <p className="text-[10px] text-purple-300/60 pt-1">
                                    100% sacred privacy guaranteed. Unsubscribe at any time.
                                </p>
                            </div>
                        </section>

                    </div>

                    { }
                    <aside className="xl:col-span-4 space-y-8 sticky top-24">

                        {/* Live Celestial Energy Tracker Widget */}
                        <div className="bg-white rounded-3xl border border-purple-100 shadow-xl shadow-purple-950/5 p-6 space-y-5 relative overflow-hidden">
                            <div className="flex items-center justify-between border-b border-purple-100 pb-4">
                                <div className="flex items-center gap-2">
                                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
                                    <h3 className="font-serif font-bold text-purple-950 text-base">Product Information</h3>
                                </div>
                                <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200">
                                    REAL-TIME
                                </span>
                            </div>

                            <div className="space-y-4">

                                <div className="flex items-center justify-between p-4 bg-purple-50 rounded-2xl border border-purple-100">

                                    <div>
                                        <p className="text-xs text-slate-500">Category</p>
                                        <h4 className="font-bold text-purple-950">
                                            {productDetail?.category?.name}
                                        </h4>
                                    </div>

                                    <Sparkles className="w-6 h-6 text-amber-500" />

                                </div>

                                <div className="flex items-center justify-between p-4 bg-green-50 rounded-2xl border border-green-100">

                                    <div>
                                        <p className="text-xs text-slate-500">Availability</p>

                                        <h4 className="font-bold text-green-700">
                                            {productDetail?.stock > 0
                                                ? `${productDetail.stock} In Stock`
                                                : "Out of Stock"}
                                        </h4>

                                    </div>

                                    <CheckCircle2 className="w-6 h-6 text-green-600" />

                                </div>

                                <div className="p-4 rounded-2xl bg-gradient-to-r from-purple-900 to-indigo-900 text-white">

                                    <p className="text-xs text-purple-200">
                                        Offer Price
                                    </p>

                                    <h2 className="text-3xl font-black mt-1">
                                        ₹{productDetail?.salePrice}
                                    </h2>

                                    <p className="line-through text-purple-300">
                                        ₹{productDetail?.price}
                                    </p>

                                </div>

                            </div>
                        </div>

                        {/* VIP Astrologer Consultation Banner */}
                        <div className="bg-gradient-to-br from-amber-400 via-amber-300 to-amber-500 rounded-3xl p-6 text-purple-950 space-y-4 shadow-xl border border-amber-300 relative overflow-hidden group">
                            <div className="space-y-1.5 relative z-10">
                                <span className="text-[10px] font-black uppercase tracking-widest bg-purple-950 text-amber-300 px-3 py-1 rounded-full inline-block">
                                    Personal Guidance
                                </span>
                                <h3 className="font-serif text-xl font-extrabold leading-snug">
                                    Bring Positive Energy Home
                                </h3>
                                <p className="text-xs font-medium text-purple-950/80 leading-relaxed">
                                    Authentic spiritual products carefully selected to support your meditation, healing and positive energy.                                </p>
                            </div>

                            <button
                                onClick={() => alert('Redirecting to 1-on-1 Astrologer Booking Calendar...')}
                                className="w-full bg-purple-950 hover:bg-purple-900 text-amber-300 font-bold text-xs py-3.5 rounded-2xl shadow-lg transition-all group-hover:scale-102 flex items-center justify-center gap-2"
                            >
                                <span>Book Consultation</span>
                                <ChevronRight className="w-4 h-4" />
                            </button>
                        </div>

                        { }
                        <div className="bg-white rounded-3xl border border-purple-100 shadow-xl shadow-purple-950/5 p-6 space-y-5">
                            <div className="flex items-center justify-between border-b border-purple-100 pb-3">
                                <h3 className="font-serif font-bold text-purple-950 text-lg flex items-center gap-2">
                                    <TrendingUp className="w-4 h-4 text-amber-600" />
                                    <span>Why You'll Love It</span>
                                </h3>
                            </div>

                            <div className="space-y-4">

                                {productDetail?.benefits?.map((item, index) => (

                                    <div
                                        key={index}
                                        className="flex gap-4 p-4 rounded-2xl bg-purple-50 hover:bg-amber-50 transition"
                                    >

                                        <div className="w-10 h-10 rounded-xl bg-amber-400 flex items-center justify-center text-purple-950 font-black">
                                            {index + 1}
                                        </div>

                                        <div>

                                            <h4 className="font-bold text-purple-950">
                                                {item}
                                            </h4>

                                            <p className="text-xs text-slate-500 mt-1">
                                                Premium spiritual benefit.
                                            </p>

                                        </div>

                                    </div>

                                ))}

                            </div>
                        </div>


                        <div className="hidden md:block bg-gradient-to-br from-purple-950 to-indigo-900 rounded-3xl p-6 text-white space-y-4">

                            <h3 className="font-serif text-2xl font-bold">
                                ₹{productDetail?.salePrice}
                            </h3>

                            <p className="text-purple-200">
                                Inclusive of all taxes
                            </p>

                            {/* <button className="w-full py-4 rounded-2xl bg-amber-400 text-purple-950 font-black hover:scale-105 transition">

                                Buy Now

                            </button> */}

                            <button
                                onClick={handleAddToCart}
                                disabled={loading}
                                className="w-full py-4 rounded-2xl border border-purple-500 text-white">

                                {loading ? "Adding..." : "Add To Cart"}

                            </button>

                        </div>

                    </aside>

                </div>


            </main>



            { }
            <footer className="mt-20 border-t border-purple-100 bg-white/60 backdrop-blur-md py-12 text-center text-xs text-slate-500">
                <div className="max-w-4xl mx-auto px-4 space-y-4">
                    <div className="flex items-center justify-center gap-2 text-purple-950 font-serif font-bold text-lg">
                        <Moon className="w-5 h-5 text-amber-500" />
                        <span>Cosmic Insights Network</span>
                    </div>
                    <p className="font-serif italic text-purple-900/80 text-sm">
                        ✦ Bridging Ancient Astrological Wisdom & Modern Consciousness ✦
                    </p>
                    <div className="flex justify-center gap-6 text-slate-600 font-semibold text-[11px]">
                        <a href="#terms" className="hover:text-purple-950 transition-colors">Astrological Methodology</a>
                        <span>•</span>
                        <a href="#privacy" className="hover:text-purple-950 transition-colors">Privacy Policy</a>
                        <span>•</span>
                        <a href="#contact" className="hover:text-purple-950 transition-colors">Consultation Support</a>
                    </div>
                    <p className="text-[10px] text-slate-400 pt-2">
                        &copy; {new Date().getFullYear()} Cosmic Insights Network. All rights reserved.
                    </p>
                </div>
            </footer>

            <section className="mt-20 max-w-6xl mx-auto ">

                <div className="flex items-end justify-between mb-8">

                    <div className='mx-auto text-center'>
                        <span className="text-xs text-center uppercase tracking-[4px] text-amber-600 font-bold">
                            Explore More
                        </span>

                        <h2 className="font-serif text-4xl font-bold text-purple-950 mt-2">
                            Related Products
                        </h2>
                    </div>

                </div>

                <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-8">

                    {relatedProducts?.map((item) => {

                        const discount = Math.round(
                            ((item.price - item.salePrice) / item.price) * 100
                        );

                        return (

                            <div
                                key={item._id}
                                onClick={() => navigate(`/shop/${item._id}`)}
                                className="group bg-white rounded-[30px] overflow-hidden  border border-purple-100 shadow-lg hover:shadow-2xl hover:shadow-purple-900/10 transition-all duration-500 hover:-translate-y-2 cursor-pointer"
                            >

                                {/* IMAGE */}
                                <div className="relative overflow-hidden">

                                    <img
                                        src={item.images?.[0]}
                                        alt={item.name}
                                        className="w-full h-52 object-cover duration-700 group-hover:scale-110"
                                    />

                                    <div className="absolute inset-0 bg-gradient-to-t from-[#1c1233]/80 via-transparent to-transparent" />

                                    <span className="absolute top-4 left-4 bg-amber-400 text-purple-950 px-3 py-1 rounded-full text-[11px] font-bold shadow">
                                        {discount}% OFF
                                    </span>

                                    <button
                                        onClick={(e) => e.stopPropagation()}
                                        className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center hover:bg-white/30 transition"
                                    >
                                        <Heart className="w-4 h-4 text-white" />
                                    </button>

                                    <div className="absolute bottom-4 left-4">

                                        <span className="px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-white text-[11px] font-semibold">
                                            {item.category?.name}
                                        </span>

                                    </div>

                                </div>

                                {/* CONTENT */}

                                <div className="p-5">

                                    <h3 className="font-serif text-xl font-bold text-purple-950 line-clamp-1">
                                        {item.name}
                                    </h3>

                                    <p className="text-sm text-slate-500 mt-2 leading-6 line-clamp-2 min-h-[38px]">
                                        {item.shortDescription}
                                    </p>

                                    <div className="flex items-end justify-between ">

                                        <div>

                                            <div className="flex items-center gap-2">

                                                <span className="text-2xl font-black text-purple-900">
                                                    ₹{item.salePrice}
                                                </span>

                                                <span className="text-sm text-slate-400 line-through">
                                                    ₹{item.price}
                                                </span>

                                            </div>

                                            <p className="text-xs text-green-600 font-medium mt-1">
                                                {item.stock > 0
                                                    ? `${item.stock} in stock`
                                                    : "Out of stock"}
                                            </p>

                                        </div>

                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                            }}
                                            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-900 to-purple-700 text-amber-300 text-sm font-semibold hover:scale-105 transition"
                                        >
                                            View
                                        </button>

                                    </div>

                                </div>

                            </div>

                        )

                    })}

                </div>

            </section>


            <AddToCartPopup
                open={showPopup}
                onClose={() => setShowPopup(false)}
                product={productDetail}
            />



        </div>
    );
}