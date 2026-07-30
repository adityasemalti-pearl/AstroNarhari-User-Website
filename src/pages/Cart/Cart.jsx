import React, { useEffect, useState } from "react";
import { Minus, Plus, Trash2, ShoppingBag } from "lucide-react";
import { Link } from "react-router-dom";
import { getCart, updateCartProduct } from "../../API/cosmicApis";


const Cart = () => {
    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [updatingProductId, setUpdatingProductId] = useState(null);





    const fetchCart = async () => {
        try {

            setLoading(true);

            const res = await getCart();

            if (res.data.success) {
                setCartItems(res.data.data.items);
            }

        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };




    const handleUpdateQuantity = async (productId, quantity) => {
        try {

            setUpdatingProductId(productId);

            const res = await updateCartProduct({
                productId,
                quantity,
            });

            if (res.data.success) {
                fetchCart();
            }

        } catch (error) {
            console.log(error);
        } finally {
            setUpdatingProductId(null);
        }
    };


    const subtotal = cartItems.reduce(
        (total, item) => total + item.product.salePrice * item.quantity,
        0
    );

    const discount = cartItems.reduce(
        (total, item) =>
            total +
            (item.product.price - item.product.salePrice) * item.quantity,
        0
    );

    const shipping = subtotal > 999 ? 0 : 99;

    const gst = Math.round(subtotal * 0.18);

    const grandTotal = subtotal + gst + shipping;



    useEffect(() => {
        fetchCart();
    }, []);
    if (!cartItems.length) {
        return (

            <div className="min-h-screen flex items-center justify-center px-5">

                <div className="text-center">

                    <div className="w-28 h-28 mx-auto rounded-full bg-purple-100 flex items-center justify-center">

                        <ShoppingBag size={55} className="text-purple-900" />

                    </div>

                    <h2 className="text-4xl font-serif font-bold mt-8 text-purple-950">

                        Your Cart is Empty

                    </h2>

                    <p className="text-slate-500 mt-3">

                        Looks like you haven't added any products yet.

                    </p>

                    <Link
                        to="/shop"
                        className="inline-block mt-8 px-8 py-4 rounded-2xl bg-purple-900 text-amber-300 font-bold"
                    >

                        Continue Shopping

                    </Link>

                </div>

            </div>

        );
    }



    return (
        <div className="min-h-screen bg-gradient-to-b from-[#faf7ff] via-white to-[#faf7ff]">

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

                {/* Header */}

                <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-12">

                    <div>

                        <span className="inline-flex items-center rounded-full bg-purple-100 px-4 py-2 text-xs font-bold tracking-[3px] uppercase text-purple-700">
                            Shopping Cart
                        </span>

                        <h1 className="mt-5 font-serif text-5xl font-bold text-purple-950">
                            Your Cart
                        </h1>

                        <p className="mt-3 text-slate-500 text-lg">
                            {cartItems.length} Product{cartItems.length > 1 ? "s" : ""} in your cart
                        </p>

                    </div>

                    {/* <div className="rounded-3xl border border-purple-100 bg-white px-8 py-6 shadow-lg">

                        <p className="text-sm text-slate-500">
                            Estimated Total
                        </p>

                        <h2 className="mt-2 text-4xl font-black text-purple-900">
                            ₹{grandTotal}
                        </h2>

                    </div> */}

                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

                    {/* LEFT */}

                    <div className="lg:col-span-2 space-y-8">

                        {cartItems.map((item) => {

                            const discount = Math.round(
                                ((item.product.price - item.product.salePrice) /
                                    item.product.price) *
                                100
                            );

                            return (

                                <div
                                    key={item._id}
                                    className="group rounded-[34px] bg-white border border-purple-100 shadow-lg hover:shadow-purple-900/10 hover:-translate-y-1 transition-all duration-300 overflow-hidden"
                                >

                                    <div className="p-6 flex flex-col md:flex-row gap-6">

                                        {/* IMAGE */}

                                        <div className="relative">

                                            <img
                                                src={item.product.images?.[0]}
                                                alt=""
                                                className="w-full md:w-52 h-52 rounded-3xl object-cover"
                                            />

                                            <span className="absolute top-4 left-4 rounded-full bg-amber-400 px-4 py-1 text-xs font-bold text-purple-950 shadow">

                                                {discount}% OFF

                                            </span>

                                        </div>

                                        {/* CONTENT */}

                                        <div className="flex-1 flex flex-col justify-between">

                                            <div>

                                                <span className="text-xs font-bold uppercase tracking-[2px] text-purple-700">

                                                    {item.product.category?.name}

                                                </span>

                                                <h2 className="mt-2 text-3xl font-serif font-bold text-purple-950">

                                                    {item.product.name}

                                                </h2>

                                                <p className="mt-3 text-slate-500 leading-7">

                                                    {item.product.shortDescription}

                                                </p>

                                                <div className="mt-5 flex flex-wrap gap-3">

                                                    <span className="rounded-full bg-green-100 px-4 py-2 text-xs font-semibold text-green-700">

                                                        🚚 Delivery in 2-4 Days

                                                    </span>

                                                    <span className="rounded-full bg-purple-100 px-4 py-2 text-xs font-semibold text-purple-700">

                                                        ✔ Authentic Product

                                                    </span>

                                                </div>

                                                <div className="mt-6 flex items-center gap-4">

                                                    <span className="text-4xl font-black text-purple-900">

                                                        ₹{item.product.salePrice}

                                                    </span>

                                                    <span className="text-lg line-through text-slate-400">

                                                        ₹{item.product.price}

                                                    </span>

                                                </div>

                                                <p className="mt-2 text-sm text-slate-500">

                                                    Total

                                                    <span className="ml-2 font-bold text-purple-900">

                                                        ₹{item.product.salePrice * item.quantity}

                                                    </span>

                                                </p>

                                            </div>

                                            <div className="mt-8 flex flex-wrap items-center justify-between gap-5">

                                                {/* Quantity */}

                                                <div className="flex items-center overflow-hidden rounded-2xl border border-purple-200">

                                                    <button
                                                        disabled={updatingProductId === item.product._id}
                                                        onClick={() => {
                                                            if (item.quantity > 1) {
                                                                handleUpdateQuantity(item.product._id, item.quantity - 1);
                                                            }
                                                        }}
                                                        className="flex h-12 w-12 items-center justify-center bg-purple-50 transition hover:bg-purple-900 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
                                                    >
                                                        <Minus size={18} />
                                                    </button>

                                                    <span className="flex w-14 items-center justify-center text-lg font-bold">

                                                        {updatingProductId === item.product._id ? (
                                                            <div className="h-5 w-5 animate-spin rounded-full border-2 border-purple-300 border-t-purple-900"></div>
                                                        ) : (
                                                            item.quantity
                                                        )}

                                                    </span>

                                                    <button
                                                        disabled={updatingProductId === item.product._id}
                                                        onClick={() =>
                                                            handleUpdateQuantity(item.product._id, item.quantity + 1)
                                                        }
                                                        className="flex h-12 w-12 items-center justify-center bg-purple-50 transition hover:bg-purple-900 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
                                                    >
                                                        <Plus size={18} />
                                                    </button>
                                                </div>

                                                <button className="flex items-center gap-2 rounded-2xl bg-red-50 px-5 py-3 font-semibold text-red-600 transition hover:bg-red-100">

                                                    <Trash2 size={18} />

                                                    Remove

                                                </button>

                                            </div>

                                        </div>

                                    </div>

                                </div>

                            );

                        })}

                    </div>

                    {/* RIGHT SIDEBAR START */}
                    <div>
                        <div className="sticky top-24 space-y-6">

                            {/* Order Summary */}

                            <div className="overflow-hidden rounded-[32px] border border-purple-100 bg-white shadow-xl">

                                <div className="bg-gradient-to-r from-purple-900 via-purple-800 to-indigo-900 p-7">

                                    <h2 className="font-serif text-3xl font-bold text-white">
                                        Order Summary
                                    </h2>

                                    <p className="mt-2 text-sm text-purple-200">
                                        {cartItems.length} Product{cartItems.length > 1 ? "s" : ""} Selected
                                    </p>

                                </div>

                                <div className="space-y-5 p-7">

                                    <div className="flex justify-between">

                                        <span className="text-slate-500">
                                            Subtotal
                                        </span>

                                        <span className="font-bold text-purple-950">
                                            ₹{subtotal}
                                        </span>

                                    </div>

                                    <div className="flex justify-between">

                                        <span className="text-slate-500">
                                            Discount
                                        </span>

                                        <span className="font-bold text-green-600">
                                            - ₹{discount}
                                        </span>

                                    </div>

                                    <div className="flex justify-between">

                                        <span className="text-slate-500">
                                            GST (18%)
                                        </span>

                                        <span className="font-bold text-purple-950">
                                            ₹{gst}
                                        </span>

                                    </div>

                                    <div className="flex justify-between">

                                        <span className="text-slate-500">
                                            Shipping
                                        </span>

                                        <span className="font-bold">

                                            {shipping === 0 ? (
                                                <span className="text-green-600">
                                                    FREE
                                                </span>
                                            ) : (
                                                `₹${shipping}`
                                            )}

                                        </span>

                                    </div>

                                    <div className="h-px bg-purple-100"></div>

                                    {/* Coupon */}

                                    <div>

                                        <label className="mb-3 block text-sm font-semibold text-slate-600">
                                            Coupon Code
                                        </label>

                                        <div className="flex overflow-hidden rounded-2xl border border-purple-200">

                                            <input
                                                type="text"
                                                placeholder="Enter coupon"
                                                className="flex-1 px-4 py-3 outline-none"
                                            />

                                            <button className="bg-purple-900 px-6 font-bold text-amber-300">
                                                Apply
                                            </button>

                                        </div>

                                    </div>

                                    <div className="rounded-2xl bg-purple-50 p-5">

                                        <div className="flex items-center justify-between">

                                            <span className="text-lg font-semibold text-purple-950">
                                                Grand Total
                                            </span>

                                            <span className="text-4xl font-black text-purple-900">
                                                ₹{grandTotal}
                                            </span>

                                        </div>

                                    </div>

                                    <button className="w-full rounded-2xl bg-gradient-to-r from-purple-900 to-indigo-900 py-4 text-lg font-bold text-amber-300 transition hover:scale-[1.02]">

                                        Proceed To Checkout

                                    </button>

                                </div>

                            </div>

                            {/* Delivery Card */}

                            <div className="rounded-[32px] bg-gradient-to-r from-purple-900 to-indigo-900 p-7 text-white shadow-xl">

                                <h3 className="font-serif text-2xl font-bold">
                                    Estimated Delivery
                                </h3>

                                <p className="mt-3 text-purple-200">
                                    Your order will arrive in
                                </p>

                                <h2 className="mt-2 text-4xl font-black">
                                    2 - 4 Days
                                </h2>

                                <div className="mt-6 rounded-2xl bg-white/10 p-4">

                                    <p className="text-sm">
                                        🚚 Free shipping on orders above ₹999
                                    </p>

                                </div>

                            </div>

                            {/* Secure Payment */}

                            <div className="rounded-[32px] border border-green-200 bg-green-50 p-6">

                                <h3 className="text-lg font-bold text-green-700">
                                    🔒 Secure Checkout
                                </h3>

                                <p className="mt-2 text-sm leading-6 text-slate-600">
                                    Your payment is protected with secure encryption. Shop with complete confidence.
                                </p>

                            </div>

                        </div>

                    </div>

                </div>

            </div>

            {/* Mobile Bottom Bar */}

            <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-purple-200 bg-white p-4 shadow-2xl lg:hidden">

                <div className="flex items-center justify-between">

                    <div>

                        <p className="text-xs text-slate-500">
                            Grand Total
                        </p>

                        <h3 className="text-2xl font-black text-purple-900">
                            ₹{grandTotal}
                        </h3>

                    </div>

                    <button className="rounded-2xl bg-gradient-to-r from-purple-900 to-indigo-900 px-8 py-3 font-bold text-amber-300">

                        Checkout

                    </button>

                </div>

            </div>
        </div>


    )
}

export default Cart;