import { AnimatePresence, motion } from "framer-motion";
import { Check } from "lucide-react";
import { useNavigate } from "react-router-dom";

const AddToCartPopup = ({
    open,
    onClose,
    product,
}) => {

    const navigate = useNavigate();

    if (!open) return null;

    return (
        <AnimatePresence>
            {open && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-[999] flex items-center justify-center bg-black/50 backdrop-blur-md p-4"
                >
                    <motion.div
                        initial={{ scale: 0.8, y: 40, opacity: 0 }}
                        animate={{ scale: 1, y: 0, opacity: 1 }}
                        exit={{ scale: 0.8, y: 40, opacity: 0 }}
                        transition={{ duration: 0.35 }}
                        className="relative w-full max-w-md overflow-hidden rounded-[32px] bg-white shadow-[0_30px_80px_rgba(0,0,0,0.25)]"
                    >

                        {/* Top Gradient */}

                        <div className="relative overflow-hidden bg-gradient-to-r from-purple-900 via-purple-800 to-indigo-900 px-8 py-10 text-center">

                            <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-amber-400/20 blur-3xl"></div>
                            <div className="absolute -left-8 bottom-0 h-32 w-32 rounded-full bg-white/10 blur-2xl"></div>

                            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-amber-400 shadow-xl">
                                <Check className="h-10 w-10 text-purple-900" />
                            </div>

                            <h2 className="mt-6 text-3xl font-bold text-white">
                                Added to Cart 🎉
                            </h2>

                            <p className="mt-2 text-sm text-purple-200">
                                Your product has been added successfully.
                            </p>

                        </div>

                        {/* Product */}

                        <div className="flex gap-4 p-6">

                            <img
                                src={product?.images?.[0]}
                                alt={product?.name}
                                className="h-24 w-24 rounded-2xl border object-cover"
                            />

                            <div className="flex-1">

                                <h3 className="font-serif text-xl font-bold text-purple-950 line-clamp-2">
                                    {product?.name}
                                </h3>

                                <p className="mt-2 text-sm text-slate-500 line-clamp-2">
                                    {product?.shortDescription}
                                </p>

                                <div className="mt-3 flex items-center gap-3">

                                    <span className="text-2xl font-black text-purple-900">
                                        ₹{product?.salePrice}
                                    </span>

                                    <span className="text-slate-400 line-through">
                                        ₹{product?.price}
                                    </span>

                                </div>

                            </div>

                        </div>

                        {/* Buttons */}

                        <div className="flex gap-3 border-t border-slate-100 p-6">

                            <button
                                onClick={onClose}
                                className="flex-1 rounded-2xl border border-purple-200 py-3 font-semibold text-purple-900 transition hover:bg-purple-50"
                            >
                                Continue Shopping
                            </button>

                            <button
                                onClick={() => navigate("/dashboard/cart")}
                                className="flex-1 rounded-2xl bg-gradient-to-r from-purple-900 to-indigo-900 py-3 font-bold text-amber-300 transition hover:scale-105"
                            >
                                View Cart
                            </button>

                        </div>

                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default AddToCartPopup;