import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Search,
    ShoppingBag,
    Heart,
    Star,
    SlidersHorizontal,
    Sparkles,
    ArrowRight,
    Eye,
    Check
} from "lucide-react";

import { getAllCategories, getAllProducts } from "../../API/cosmicApis";
import { useNavigate } from "react-router-dom";

const CATEGORIES = ["All", "Gemstones", "Rudraksha", "Yantras", "Crystals"];

const AllProducts = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [favorites, setFavorites] = useState({});
    const [categories, setCategories] = useState([])

    const navigate = useNavigate();

    const fetchAllProducts = async () => {
        try {
            setLoading(true);
            const res = await getAllProducts();
            setProducts(res.data?.data || []);
        } catch (error) {
            console.error("Error fetching products:", error);
        } finally {
            setLoading(false);
        }
    };



    const fetchAllCategories = async () => {
        try {
            setLoading(true);
            const res = await getAllCategories();
            setCategories(res.data?.data || []);
        } catch (error) {
            console.error("Error fetching products:", error);
        } finally {
            setLoading(false);
        }
    };



    useEffect(() => {
        fetchAllProducts();
        fetchAllCategories()
    }, []);

    const toggleFavorite = (id) => {
        setFavorites((prev) => ({ ...prev, [id]: !prev[id] }));
    };

    const filteredProducts = products.filter((product) => {

        const matchSearch = product.name
            .toLowerCase()
            .includes(search.toLowerCase());

        const matchCategory =
            !selectedCategory ||
            selectedCategory === "All" ||
            product.category?._id === selectedCategory;

        return matchSearch && matchCategory;
    });

    return (
        <div className="min-h-screen bg-[#FDFBF7] text-slate-800 selection:bg-amber-100 selection:text-amber-900 font-sans relative overflow-hidden">
            {/* Subtle Luxury Background Accents */}
            <div className="pointer-events-none absolute left-1/2 top-0 -translate-x-1/2 h-[600px] w-full max-w-7xl bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-amber-100/40 via-purple-50/20 to-transparent blur-3xl" />
            <div className="pointer-events-none absolute -right-40 top-1/3 h-[500px] w-[500px] rounded-full bg-amber-50/30 blur-3xl" />

            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-24">
                {/* Header Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="text-center max-w-3xl mx-auto"
                >
                    <div className="inline-flex items-center gap-2 rounded-full border border-amber-200/60 bg-gradient-to-r from-amber-50/80 to-purple-50/80 px-4 py-1.5 text-xs font-semibold tracking-wide text-amber-900 uppercase backdrop-blur-md shadow-sm">
                        <Sparkles size={14} className="text-amber-600" />
                        <span>Sacred Collection</span>
                    </div>

                    <h1 className="mt-6 text-4xl sm:text-5xl lg:text-6xl font-serif font-medium tracking-tight text-slate-900 leading-[1.15]">
                        Divine & Sacred <br />
                        <span className="italic font-normal text-amber-800">Astrology Artifacts</span>
                    </h1>

                    <p className="mt-4 text-base sm:text-lg text-slate-600 leading-relaxed font-light">
                        Handpicked, authentic gemstones, consecrated rudraksha, and energized yantras curated by master astrologers for spiritual alignment.
                    </p>
                </motion.div>

                {/* Filter & Search Bar Section */}
                <div className="mt-12 space-y-8">

                    {/* Search */}

                    <div className="max-w-md">

                        <div className="relative">

                            <Search
                                size={18}
                                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                            />

                            <input
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Search products..."
                                className="w-full rounded-2xl border border-slate-200 bg-white py-4 pl-12 pr-4 shadow-lg outline-none transition focus:border-purple-500 focus:ring-4 focus:ring-purple-200"
                            />

                        </div>

                    </div>

                    {/* Categories */}

                    <div className="overflow-x-auto hide">

                        <div className="flex w-max gap-5 pb-3">

                            {/* All */}

                            <motion.button

                                whileHover={{ y: -5 }}

                                whileTap={{ scale: .95 }}

                                onClick={() => setSelectedCategory("All")}

                                className={`group flex w-28 flex-shrink-0 flex-col items-center ${selectedCategory === "All" ? "" : ""
                                    }`}

                            >

                                <div
                                    className={`flex h-20 w-20 items-center justify-center rounded-full border-4 transition-all ${selectedCategory === "All"
                                        ? "border-purple-600 ring-4 ring-purple-200"
                                        : "border-white shadow-lg"
                                        }`}
                                >

                                    ✨

                                </div>

                                <p className="mt-3 text-sm font-semibold">
                                    All
                                </p>

                            </motion.button>

                            {/* Dynamic Categories */}

                            {categories.map((item, index) => (

                                <motion.button

                                    key={item._id}

                                    initial={{
                                        opacity: 0,
                                        x: -40
                                    }}

                                    whileInView={{
                                        opacity: 1,
                                        x: 0
                                    }}

                                    transition={{
                                        delay: index * .06
                                    }}

                                    viewport={{
                                        once: true
                                    }}

                                    whileHover={{
                                        y: -6
                                    }}

                                    whileTap={{
                                        scale: .95
                                    }}

                                    onClick={() => setSelectedCategory(item._id)}

                                    className="group flex w-28 flex-shrink-0 flex-col items-center"

                                >

                                    <div

                                        className={`relative h-20 w-20 overflow-hidden rounded-full border-4 transition-all duration-300 ${selectedCategory === item.name
                                            ? "border-purple-600 ring-4 ring-purple-200 shadow-xl"
                                            : "border-white shadow-lg group-hover:shadow-2xl"
                                            }`}

                                    >

                                        <img

                                            src={item.image}

                                            alt={item.name}

                                            className="h-full w-full object-cover transition duration-500 group-hover:scale-110"

                                        />

                                    </div>

                                    <p

                                        className={`mt-3 line-clamp-2 text-center text-sm font-semibold transition ${selectedCategory === item._id
                                            ? "text-purple-700"
                                            : "text-slate-700"
                                            }`}

                                    >

                                        {item.name}

                                    </p>

                                </motion.button>

                            ))}

                        </div>

                    </div>

                </div>

                {/* Product Grid */}
                <div className="mt-10">
                    {loading ? (
                        // Skeleton Loader
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                            {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
                                <div
                                    key={n}
                                    className="animate-pulse rounded-3xl border border-slate-100 bg-white p-4 shadow-sm"
                                >
                                    <div className="h-64 rounded-2xl bg-slate-100" />
                                    <div className="mt-4 h-4 w-1/3 rounded bg-slate-100" />
                                    <div className="mt-2 h-6 w-3/4 rounded bg-slate-100" />
                                    <div className="mt-4 h-5 w-1/2 rounded bg-slate-100" />
                                </div>
                            ))}
                        </div>
                    ) : filteredProducts.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                            {filteredProducts.map((item, index) => (
                                <motion.div

                                    key={item._id || index}
                                    initial={{ opacity: 0, y: 30 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.05, duration: 0.4 }}
                                    className="group relative flex flex-col justify-between rounded-3xl border border-amber-100/60 bg-white/80 backdrop-blur-sm p-4 transition-all duration-300 hover:border-amber-300 hover:bg-white hover:shadow-2xl hover:shadow-amber-900/10"
                                >
                                    {/* Top Image Container */}
                                    <div className="relative aspect-square w-full overflow-hidden rounded-2xl bg-slate-50">
                                        <img
                                            src={item.images?.[0] || "/placeholder.jpg"}
                                            alt={item.name}
                                            className="h-full w-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
                                        />

                                        {/* Badges Overlay */}
                                        <div className="absolute left-3 top-3 flex flex-col gap-1 z-10">
                                            {item.isFeatured && (
                                                <span className="inline-flex items-center gap-1 rounded-full bg-amber-900/90 backdrop-blur-md px-3 py-1 text-[10px] font-semibold tracking-wider text-amber-200 uppercase">
                                                    <Sparkles size={10} /> Featured
                                                </span>
                                            )}
                                        </div>

                                        {/* Wishlist Button */}
                                        <button
                                            onClick={() => toggleFavorite(item._id)}
                                            className="absolute right-3 top-3 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-white/80 backdrop-blur-md text-slate-700 shadow-sm transition hover:scale-110 hover:bg-white hover:text-red-500"
                                        >
                                            <Heart
                                                size={16}
                                                className={favorites[item._id] ? "fill-red-500 text-red-500" : ""}
                                            />
                                        </button>

                                        {/* Quick Hover Actions Overlay */}
                                        <div className="absolute inset-x-0 bottom-3 px-3 opacity-0 transition-all duration-300 transform translate-y-2 group-hover:opacity-100 group-hover:translate-y-0">
                                            <button
                                                onClick={() => navigate(`/dashboard/cosmic-detail/${item._id}`)}
                                                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-slate-900/90 backdrop-blur-md text-xs font-medium text-white shadow-lg hover:bg-slate-900 transition">
                                                <Eye size={14} />
                                                Quick View
                                            </button>
                                        </div>
                                    </div>

                                    {/* Details Container */}
                                    <div className="mt-4 flex flex-1 flex-col justify-between">
                                        <div>
                                            {/* Category & Rating */}
                                            <div className="flex items-center justify-between text-xs">
                                                <span className="font-medium text-amber-800/80 uppercase tracking-wider text-[10px]">
                                                    {item.category?.name || "Spiritual"}
                                                </span>
                                                <div className="flex items-center gap-1 text-amber-500">
                                                    <Star size={12} fill="currentColor" />
                                                    <span className="font-semibold text-slate-700 text-xs">5.0</span>
                                                </div>
                                            </div>

                                            {/* Product Name */}
                                            <h2 className="mt-2 text-base font-serif font-semibold text-slate-900 line-clamp-1 group-hover:text-amber-900 transition-colors">
                                                {item.name}
                                            </h2>

                                            {/* Description */}
                                            <p className="mt-1 text-xs text-slate-500 line-clamp-2 leading-relaxed font-light">
                                                {item.shortDescription || "Energized and certified authentic divine product."}
                                            </p>
                                        </div>

                                        {/* Footer: Price & Add to Cart */}
                                        <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between">
                                            <div>
                                                <div className="flex items-baseline gap-2">
                                                    <span className="text-lg font-bold text-slate-900">
                                                        ₹{item.price}
                                                    </span>
                                                    {item.salePrice && (
                                                        <span className="text-xs text-slate-400 line-through">
                                                            ₹{item.salePrice}
                                                        </span>
                                                    )}
                                                </div>
                                                <span className="text-[10px] text-slate-400 font-light">Tax included</span>
                                            </div>

                                            <button
                                                disabled={item.stock <= 0}
                                                className={`flex h-10 w-10 items-center justify-center rounded-xl transition-all ${item.stock > 0
                                                    ? "bg-amber-100/80 text-amber-900 hover:bg-amber-800 hover:text-white shadow-sm"
                                                    : "bg-slate-100 text-slate-400 cursor-not-allowed"
                                                    }`}
                                            >
                                                <ShoppingBag size={18} />
                                            </button>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    ) : (
                        // Empty State
                        <div className="py-20 text-center bg-white/50 backdrop-blur-sm rounded-3xl border border-amber-100/50">
                            <ShoppingBag size={48} className="mx-auto text-amber-300 stroke-[1.5]" />
                            <h3 className="mt-4 text-xl font-serif font-semibold text-slate-800">
                                No Sacred Products Found
                            </h3>
                            <p className="mt-2 text-sm text-slate-500">
                                Try adjusting your search query or clear filters to see more results.
                            </p>
                        </div>
                    )}
                </div>

                
                {/* Luxury CTA Banner */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="relative mt-24 overflow-hidden rounded-3xl bg-slate-900 p-8 sm:p-14 text-white shadow-2xl"
                >
                    {/* Subtle Ambient Glows */}
                    <div className="absolute -left-20 -top-20 h-64 w-64 rounded-full bg-amber-500/10 blur-3xl" />
                    <div className="absolute -right-20 -bottom-20 h-64 w-64 rounded-full bg-purple-500/10 blur-3xl" />

                    <div className="relative z-10 max-w-2xl mx-auto text-center">
                        <div className="inline-flex items-center justify-center p-3 rounded-2xl bg-amber-500/10 text-amber-400 mb-6">
                            <Sparkles size={24} />
                        </div>

                        <h2 className="text-3xl sm:text-4xl font-serif font-medium tracking-tight">
                            Personalized Gemstone Recommendation
                        </h2>

                        <p className="mt-4 text-sm sm:text-base text-slate-300 leading-relaxed font-light">
                            Not sure which product aligns with your horoscope? Consult with our verified Vedic astrologers for a personalized reading.
                        </p>

                        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
                            <button className="w-full sm:w-auto rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 px-8 py-3.5 text-xs font-semibold uppercase tracking-wider text-slate-950 transition hover:brightness-110 shadow-lg shadow-amber-500/20">
                                Book Consultation
                            </button>
                            <button className="w-full sm:w-auto rounded-xl border border-slate-700 bg-slate-800/50 px-8 py-3.5 text-xs font-semibold uppercase tracking-wider text-slate-200 transition hover:bg-slate-800">
                                Learn More
                            </button>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default AllProducts;