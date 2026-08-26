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
import { addToCart, getCategories, getFeaturedProducts, getUserBanners } from "../../API/cosmicApis";
import { useNavigate } from "react-router-dom";
import Loader from "../../components/Loader";
import FloatingCartButton from "../Cart/FloatingCartButton";

export default function CosmicStore() {

    const navigate = useNavigate()

    const [banners, setBanners] = useState([])
    const [categories, setCategories] = useState([])
    const [featuredProducts, setFeaturedProducts] = useState([])
    const [loading, setLoading] = useState(false)

    const fetchBanners = async () => {
        try {
            setLoading(true)
            const res = await getUserBanners()
            setBanners(res.data.data)
            setLoading(false)
        } catch (error) {
            console.log(error)
        }
    }


    const fetchCategories = async () => {
        try {
            setLoading(true)
            const res = await getCategories()
            setCategories(res.data.data)
            setLoading(false)
        } catch (error) {
            console.log(error)
        }
    }

    const fetchFeaturedProducts = async () => {
        try {
            setLoading(true)
            const res = await getFeaturedProducts()
            setFeaturedProducts(res.data.data)
            setLoading(false)
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        fetchBanners();
        fetchCategories();
        fetchFeaturedProducts();
    }, [])

    const handleAddToCart = async () => {
            try {
                const res = await addToCart({
                    productId: productDetail._id,
                    quantity: 1,
                });
    
            } catch (error) {
                console.log(error);
            }
        };


    if (loading) {
        return (
            <Loader />
        )
    }

    return (
<div className="relative w-full overflow-hidden">

    <FloatingCartButton />

    {/* ================= COSMIC SPOTLIGHT ================= */}

    <div className="mb-6 px-4 text-center sm:mb-8 sm:px-6">
        <div className="inline-flex items-center gap-2 rounded-full bg-purple-100 px-4 py-1.5 text-xs font-semibold text-purple-700 sm:px-5 sm:py-2 sm:text-sm">
            <Sparkles size={14} className="sm:h-4 sm:w-4" />
            Cosmic Spotlight
        </div>

        <h2 className="mt-4 text-3xl font-serif font-bold leading-tight text-slate-900 sm:mt-5 sm:text-4xl md:text-5xl">
            Explore The Universe
            <span className="block text-purple-700">
                Through Divine Wisdom
            </span>
        </h2>

        <p className="mx-auto mt-4 max-w-2xl text-sm leading-6 text-slate-500 sm:mt-5 sm:text-base sm:leading-8">
            Discover exclusive astrology insights, sacred rituals, zodiac
            guidance, and timeless Vedic knowledge curated by experienced
            astrologers.
        </p>
    </div>


    {/* ================= BANNER ================= */}

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
        className="mx-3 h-[300px] overflow-hidden rounded-[22px] sm:mx-4 sm:h-[360px] sm:rounded-[26px] md:h-[420px] md:max-w-6xl md:mx-auto md:rounded-[30px]"
    >
        {banners.map((item) => (
            <SwiperSlide key={item._id}>
                <div className="relative h-[300px] overflow-hidden rounded-[22px] sm:h-[360px] sm:rounded-[26px] md:h-[420px] md:rounded-[30px]">

                    {/* Banner Image */}

                    <img
                        src={item.image}
                        alt={item.title}
                        className="h-full w-full object-cover transition duration-700 hover:scale-105"
                    />

                    {/* Overlay */}

                    <div className="absolute inset-0 bg-gradient-to-r from-[#170b30]/90 via-[#170b30]/60 to-[#170b30]/10" />

                    {/* Content */}

                    <div className="absolute inset-0 flex items-center">

                        <div className="w-full max-w-xl px-6 py-4 text-white sm:px-8 md:px-14">

                            <h2 className="mt-0 max-w-[90%] text-2xl font-serif font-bold leading-tight sm:mt-2 sm:max-w-xl sm:text-4xl md:text-5xl">
                                {item.title}
                            </h2>

                            <p className="mt-3 max-w-md text-xs leading-5 text-purple-100 sm:mt-4 sm:text-sm sm:leading-7 md:text-base">
                                Explore exclusive astrology insights,
                                spiritual guidance, and cosmic wisdom
                                specially curated for you.
                            </p>

                            {item.redirectUrl && (
                                <button
                                    onClick={() => navigate(item.redirectUrl)}
                                    className="mt-5 rounded-xl bg-white px-5 py-2.5 text-xs font-semibold text-purple-700 transition-all hover:scale-105 sm:mt-7 sm:rounded-2xl sm:px-7 sm:py-3 sm:text-sm"
                                >
                                    Explore Now
                                </button>
                            )}

                        </div>
                    </div>
                </div>
            </SwiperSlide>
        ))}
    </Swiper>


    {/* ================= CATEGORIES ================= */}

    <div className="mt-12 px-4 sm:mt-16 sm:px-6 md:mt-20">

        {/* Heading */}

        <div className="mx-auto mb-7 flex max-w-6xl flex-col gap-5 sm:mb-10 md:flex-row md:items-end md:justify-between md:gap-8">

            <div className="min-w-0">

                <span className="inline-flex items-center gap-2 rounded-full bg-purple-100 px-4 py-1.5 text-xs font-semibold text-purple-700 sm:px-5 sm:py-2 sm:text-sm">
                    ✨ Explore Categories
                </span>

                <h2 className="mt-3 text-2xl font-serif font-bold text-slate-900 sm:mt-4 sm:text-3xl md:text-4xl">
                    Browse By Category
                </h2>

                <p className="mt-2 max-w-xl text-sm leading-6 text-slate-500 sm:mt-3 sm:text-base">
                    Discover spiritual essentials, astrology products and
                    sacred collections carefully curated for you.
                </p>

            </div>

            <motion.button
                whileHover={{
                    scale: 1.05,
                    x: 5,
                }}
                whileTap={{
                    scale: 0.96,
                }}
                onClick={() => navigate("/dashboard/products")}
                className="w-full shrink-0 rounded-xl bg-gradient-to-r from-purple-700 to-violet-600 px-5 py-3 text-sm font-semibold text-white shadow-xl sm:w-auto sm:rounded-2xl sm:px-7"
            >
                Discover All →
            </motion.button>

        </div>


        {/* Categories */}

        <div className="hide -mx-4 overflow-x-auto px-4 sm:-mx-6 sm:px-6">

            <div className="flex w-max gap-5 pb-5 sm:gap-7 md:gap-8">

                {categories.map((item, index) => (
                    <motion.div
                        key={item._id}
                        initial={{
                            opacity: 0,
                            x: -60,
                        }}
                        whileInView={{
                            opacity: 1,
                            x: 0,
                        }}
                        transition={{
                            delay: index * 0.08,
                            duration: 0.5,
                        }}
                        viewport={{
                            once: true,
                        }}
                        whileHover={{
                            y: -8,
                        }}
                        className="group w-[92px] flex-shrink-0 cursor-pointer text-center sm:w-28 md:w-32"
                    >

                        <motion.div
                            whileHover={{
                                rotate: 6,
                                scale: 1.08,
                            }}
                            transition={{
                                type: "spring",
                                stiffness: 250,
                            }}
                            className="relative mx-auto w-fit"
                        >

                            <div className="absolute inset-0 rounded-full bg-purple-400 opacity-20 blur-xl transition group-hover:opacity-40" />

                            <div className="relative h-[76px] w-[76px] overflow-hidden rounded-full border-4 border-white shadow-2xl ring-4 ring-purple-100 sm:h-24 sm:w-24">
                                <img
                                    src={item.image}
                                    alt={item.name}
                                    className="h-full w-full object-cover transition duration-500 group-hover:scale-110"
                                />
                            </div>

                        </motion.div>

                        <h3 className="mt-3 line-clamp-2 text-xs font-semibold text-slate-800 transition group-hover:text-purple-700 sm:mt-4 sm:text-sm">
                            {item.name}
                        </h3>

                    </motion.div>
                ))}

            </div>
        </div>
    </div>


    {/* ================= FEATURED PRODUCTS ================= */}

    <div className="mx-auto mt-12 mb-8 w-full max-w-5xl px-4 sm:mt-16 sm:mb-10 sm:px-6 md:mt-20">

        {/* Heading */}

        <div className="mb-6 flex flex-col gap-3 sm:mb-8">

            <div>

                <div className="inline-flex items-center gap-2 rounded-full bg-purple-100 px-4 py-1.5 text-xs font-semibold text-purple-700 sm:py-2 sm:text-sm">
                    ✨ Featured Collection
                </div>

                <h2 className="mt-3 text-2xl font-serif font-bold text-slate-900 sm:mt-4 sm:text-3xl md:text-4xl">
                    Featured Products
                </h2>

                <p className="mt-2 text-sm leading-6 text-slate-500 sm:text-base">
                    Discover our most loved spiritual products & astrology
                    essentials.
                </p>

            </div>

        </div>


        {/* Products */}

        <div className="grid grid-cols-2 justify-items-center gap-3 sm:gap-5 md:grid-cols-3">

            {featuredProducts.slice(0, 5).map((item, index) => (

                <motion.div
                    key={item._id}
                    whileHover={{
                        y: -5,
                    }}
                    transition={{
                        duration: 0.25,
                    }}
                    className="w-full max-w-[300px] rounded-xl border border-slate-200 bg-white p-2 shadow-sm transition hover:shadow-xl sm:rounded-2xl sm:p-3"
                >

                    {/* Image */}

                    <div
                        onClick={() =>
                            navigate(
                                `/dashboard/cosmic-detail/${item._id}`
                            )
                        }
                        className="relative aspect-square cursor-pointer overflow-hidden rounded-xl bg-slate-100 sm:rounded-2xl"
                    >

                        <img
                            src={item.images?.[0]}
                            alt={item.name}
                            className="h-full w-full object-cover transition duration-500 hover:scale-110"
                        />

                        {item.isFeatured && (
                            <span className="absolute right-2 top-2 rounded-full bg-amber-400 px-2 py-1 text-[8px] font-bold text-white sm:right-3 sm:top-3 sm:text-[10px]">
                                NEW
                            </span>
                        )}

                    </div>


                    {/* Content */}

                    <div className="mt-2.5 sm:mt-4">

                        <h3 className="line-clamp-1 text-xs font-semibold text-slate-800 sm:text-[15px]">
                            {item.name}
                        </h3>

                        <div className="mt-2 flex items-center justify-between gap-2 sm:mt-3">

                            <div className="min-w-0">

                                <span className="block truncate text-sm font-bold text-purple-700 sm:text-lg">
                                    ₹{item.price}
                                </span>

                                {item.salePrice && (
                                    <p className="truncate text-[9px] text-slate-400 line-through sm:text-xs">
                                        ₹{item.salePrice}
                                    </p>
                                )}

                            </div>

                            <button
                                onClick={() =>
                                    navigate("/dashboard/cart")
                                }
                                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-purple-800 text-white transition duration-200 hover:scale-110 sm:h-10 sm:w-10"
                            >
                                <ShoppingCart className="h-4 w-4 sm:h-5 sm:w-5" />
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