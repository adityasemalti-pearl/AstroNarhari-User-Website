import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
    Search,
    Sparkles,
    Clock3,
    TrendingUp,
    ArrowRight,
    ShoppingCart
} from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";

import "swiper/css";
import "swiper/css/pagination";
import { getCategories, getFeaturedProducts, getUserBanners } from "../../API/cosmicApis";
import { useNavigate } from "react-router-dom";

export default function CosmicInsights() {

    const navigate = useNavigate()

    const [banners, setBanners] = useState([])
    const [categories, setCategories] = useState([])
    const [featuredProducts, setFeaturedProducts] = useState([])

    const fetchBanners = async () => {
        try {
            const res = await getUserBanners()
            setBanners(res.data.data)
        } catch (error) {
            console.log(error)
        }
    }


    const fetchCategories = async () => {
        try {
            const res = await getCategories()
            setCategories(res.data.data)
        } catch (error) {
            console.log(error)
        }
    }

    const fetchFeaturedProducts = async () => {
        try {
            const res = await getFeaturedProducts()
            setFeaturedProducts(res.data.data)
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        fetchBanners();
        fetchCategories();
        fetchFeaturedProducts();
    }, [])

    return (

        <div className="relative">

            <button
            onClick={()=>navigate('/dashboard/cart')}
            className="absolute bottom-4 right-4 flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-purple-700 to-violet-900 text-white shadow-xl transition-all duration-300 hover:scale-110 hover:shadow-purple-500/40">
                <ShoppingCart size={20} strokeWidth={2.2} />
            </button>

            <div className="mb-8 text-center">
                <div className="inline-flex items-center gap-2 rounded-full bg-purple-100 px-5 py-2 text-sm font-semibold text-purple-700">
                    <Sparkles size={16} />
                    Cosmic Spotlight
                </div>
                <h2 className="mt-5 text-4xl md:text-5xl font-serif font-bold text-slate-900">
                    Explore The Universe
                    <span className="block text-purple-700">
                        Through Divine Wisdom
                    </span>
                </h2>
                <p className="mx-auto mt-5 max-w-2xl text-slate-500 leading-8">
                    Discover exclusive astrology insights, sacred rituals, zodiac guidance,
                    and timeless Vedic knowledge curated by experienced astrologers.
                </p>
            </div>
            <Swiper
                modules={[Autoplay, Pagination]}
                slidesPerView={1}
                loop
                autoplay={{
                    delay: 3500,
                    disableOnInteraction: false,
                }}
                pagination={{
                    clickable: true,
                }}
                className="h-[420px] max-w-6xl m-4 mx-auto rounded-[30px]"
            >

                {banners.map((item) => (

                    <SwiperSlide key={item._id}>

                        <div className="relative h-[420px] overflow-hidden rounded-[30px]">

                            {/* Banner Image */}

                            <img
                                src={item.image}
                                alt={item.title}
                                className="h-full w-full object-cover transition duration-700 hover:scale-105"
                            />

                            {/* Overlay */}

                            <div className="absolute inset-0 bg-gradient-to-r from-[#170b30]/85 via-[#170b30]/40 to-transparent" />

                            {/* Content */}

                            <div className="absolute inset-0 flex items-center">

                                <div className="max-w-xl px-8 md:px-14 text-white">

                                    <span className="inline-flex items-center rounded-full bg-white/15 backdrop-blur-md px-4 py-2 text-xs font-semibold uppercase tracking-wider">

                                        {item.type}

                                    </span>

                                    <h2 className="mt-5 text-4xl md:text-5xl font-serif font-bold leading-tight">

                                        {item.title}

                                    </h2>

                                    <p className="mt-4 text-purple-100 leading-7 max-w-md">

                                        Explore exclusive astrology insights, spiritual guidance,
                                        and cosmic wisdom specially curated for you.

                                    </p>

                                    {item.redirectUrl && (

                                        <button className="mt-8 rounded-2xl bg-white px-7 py-3 font-semibold text-purple-700 transition-all hover:scale-105">

                                            Explore Now

                                        </button>

                                    )}

                                </div>

                            </div>

                        </div>

                    </SwiperSlide>

                ))}
            </Swiper>



            {/* ================= Categories ================= */}
            <div className="mt-20">

                {/* Heading */}

                <div
                 
                    className="flex items-center justify-between mb-10 max-w-6xl mx-auto"
                >

                    <div>

                        <span className="inline-flex items-center gap-2 rounded-full bg-purple-100 px-5 py-2 text-sm font-semibold text-purple-700">

                            ✨ Explore Categories

                        </span>

                        <h2 className="mt-4 text-4xl font-serif font-bold text-slate-900">

                            Browse By Category

                        </h2>

                        <p className="mt-3 text-slate-500 max-w-xl">

                            Discover spiritual essentials, astrology products and
                            sacred collections carefully curated for you.

                        </p>

                    </div>

                    <motion.button

                        whileHover={{
                            scale: 1.05,
                            x: 5
                        }}

                        whileTap={{
                            scale: .96
                        }}

                        onClick={()=>navigate('/dashboard/products')}

                        className="rounded-2xl bg-gradient-to-r from-purple-700 to-violet-600 px-7 py-3 font-semibold text-white shadow-xl"

                    >

                        Discover All →

                    </motion.button>

                </div>

                {/* Categories */}

                <div className="overflow-x-auto hide">

                    <div className="flex w-max gap-8 pb-5">

                        {categories.map((item, index) => (

                            <motion.div

                                key={item._id}

                                initial={{
                                    opacity: 0,
                                    x: -60
                                }}

                                whileInView={{
                                    opacity: 1,
                                    x: 0
                                }}

                                transition={{
                                    delay: index * 0.08,
                                    duration: .5
                                }}

                                viewport={{
                                    once: true
                                }}

                                whileHover={{
                                    y: -8
                                }}

                                className="group w-32 flex-shrink-0 cursor-pointer text-center"

                            >

                                <motion.div

                                    whileHover={{
                                        rotate: 6,
                                        scale: 1.08
                                    }}

                                    transition={{
                                        type: "spring",
                                        stiffness: 250
                                    }}

                                    className="relative mx-auto"

                                >

                                    <div className="absolute inset-0 rounded-full bg-purple-400 blur-xl opacity-20 group-hover:opacity-40 transition" />

                                    <div className="relative h-24 w-24 overflow-hidden rounded-full border-4 border-white shadow-2xl ring-4 ring-purple-100">

                                        <img

                                            src={item.image}

                                            alt={item.name}

                                            className="h-full w-full object-cover transition duration-500 group-hover:scale-110"

                                        />

                                    </div>

                                </motion.div>

                                <h3 className="mt-4 text-sm font-semibold text-slate-800 line-clamp-2 group-hover:text-purple-700 transition">

                                    {item.name}

                                </h3>

                            </motion.div>

                        ))}

                    </div>

                </div>

            </div>



            {/* ================= Featured Products ================= */}

            <div className="mt-20 max-w-5xl mx-auto mb-10">

                <div className="mb-8 flex items-center justify-between">

                    <div>

                        <div className="inline-flex items-center gap-2 rounded-full bg-purple-100 px-4 py-2 text-sm font-semibold text-purple-700">
                            ✨ Featured Collection
                        </div>

                        <h2 className="mt-4 text-4xl font-serif font-bold text-slate-900">
                            Featured Products
                        </h2>

                        <p className="mt-2 text-slate-500">
                            Discover our most loved spiritual products & astrology essentials.
                        </p>

                    </div>

                    <button className="rounded-2xl border border-purple-200 bg-white px-6 py-3 font-semibold text-purple-700 transition hover:bg-purple-700 hover:text-white">
                        View All →
                    </button>

                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-5 justify-items-center">

                    {featuredProducts.slice(0, 5).map((item, index) => (

                        <motion.div
                            key={item._id}
                            whileHover={{ y: -5 }}
                            transition={{ duration: 0.25 }}
                            className="rounded-2xl bg-white border border-slate-200 p-3  w-[300px] shadow-sm hover:shadow-xl"
                        >

                            {/* Image */}

                            <div className="relative overflow-hidden rounded-2xl bg-slate-100 aspect-square">

                                <img
                                    src={item.images?.[0]}
                                    alt={item.name}
                                    className="h-full w-full object-cover transition duration-500 hover:scale-110"
                                />

                                {item.isFeatured && (
                                    <span className="absolute top-3 right-3 rounded-full bg-amber-400 px-2 py-1 text-[10px] font-bold text-white">
                                        NEW
                                    </span>
                                )}

                            </div>

                            {/* Content */}

                            <div className="mt-4">

                                <h3 className="line-clamp-1 text-[15px] font-semibold text-slate-800">
                                    {item.name}
                                </h3>

                                <div className="mt-3 flex items-center justify-between">

                                    <div>

                                        <span className="text-lg font-bold text-purple-700">
                                            ₹{item.price}
                                        </span>

                                        {item.salePrice && (
                                            <p className="text-xs text-slate-400 line-through">
                                                ₹{item.salePrice}
                                            </p>
                                        )}

                                    </div>

                                    <button  className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-800 text-white transition hover:scale-110">
                                        🛒
                                    </button>

                                </div>

                            </div>

                        </motion.div>

                    ))}

                </div>
            </div>


        </div>

    );
}