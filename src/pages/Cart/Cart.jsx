import React, { useEffect, useState } from "react";
import { Minus, Plus, Trash2, ShoppingBag, Truck, ShieldCheck } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import {
  getCart,
  updateCartProduct,
  deleteCartProduct,
} from "../../API/cosmicApis";

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingProductId, setUpdatingProductId] = useState(null);
  const [deletingProductId, setDeletingProductId] = useState(null);
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState(null);

  const navigate = useNavigate();

  const fetchCart = async () => {
    try {
      setLoading(true);

      const res = await getCart();

      if (res.data.success) {
        setCartItems(res.data.data.items || []);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveProduct = async () => {
    if (!selectedProductId) return;

    try {
      setDeletingProductId(selectedProductId);

      const res = await deleteCartProduct(selectedProductId);

      if (res.data.success || res.data.data?.success) {
        await fetchCart();
      }
    } catch (error) {
      console.log(error);
    } finally {
      setDeletingProductId(null);
      setSelectedProductId(null);
      setShowDeletePopup(false);
    }
  };

  const handleUpdateQuantity = async (productId, quantity) => {
    if (quantity < 1) return;

    try {
      setUpdatingProductId(productId);

      const res = await updateCartProduct({
        productId,
        quantity,
      });

      if (res.data.success) {
        await fetchCart();
      }
    } catch (error) {
      console.log(error);
    } finally {
      setUpdatingProductId(null);
    }
  };

  const subtotal = cartItems.reduce(
    (total, item) =>
      total +
      Number(item.product?.salePrice || item.product?.price || 0) *
        Number(item.quantity || 0),
    0
  );

  const discount = cartItems.reduce(
    (total, item) =>
      total +
      Math.max(
        0,
        Number(item.product?.price || 0) -
          Number(item.product?.salePrice || item.product?.price || 0)
      ) *
        Number(item.quantity || 0),
    0
  );

  const shipping = subtotal > 999 ? 0 : 99;
  const gst = Math.round(subtotal * 0.18);
  const grandTotal = subtotal + gst + shipping;

  useEffect(() => {
    fetchCart();
  }, []);

  // ================= LOADING =================

  if (loading) {
    return (
      <div className="min-h-screen bg-[#faf7ff] flex flex-col items-center justify-center px-5">
        <div className="relative h-14 w-14 sm:h-16 sm:w-16">
          <div className="absolute inset-0 rounded-full border-4 border-purple-200" />
          <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-purple-700 border-r-violet-500 animate-spin" />
        </div>

        <p className="mt-5 text-base sm:text-lg font-semibold text-purple-800">
          Loading items...
        </p>
      </div>
    );
  }

  // ================= EMPTY CART =================

  if (!cartItems.length) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#faf7ff] via-white to-[#faf7ff] flex items-center justify-center px-5 py-12">
        <div className="text-center w-full max-w-md">
          <div className="mx-auto h-24 w-24 sm:h-28 sm:w-28 rounded-full bg-purple-100 flex items-center justify-center">
            <ShoppingBag
              size={48}
              className="text-purple-900 sm:w-[55px] sm:h-[55px]"
            />
          </div>

          <h2 className="mt-7 sm:mt-8 text-3xl sm:text-4xl font-serif font-bold text-purple-950">
            Your Cart is Empty
          </h2>

          <p className="mt-3 text-sm sm:text-base text-slate-500 px-2">
            Looks like you haven't added any products yet.
          </p>

          <Link
            to="/dashboard/products"
            className="inline-flex mt-7 sm:mt-8 px-6 sm:px-8 py-3.5 sm:py-4 rounded-2xl bg-purple-900 text-amber-300 font-bold text-sm sm:text-base"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#faf7ff] via-white to-[#faf7ff] pb-28 lg:pb-10">
      <div className="max-w-7xl mx-auto px-3 sm:px-5 md:px-6 lg:px-8 py-6 sm:py-8 lg:py-10">

        {/* ================= HEADER ================= */}

        <div className="mb-7 sm:mb-10 lg:mb-12">
          <span className="inline-flex items-center rounded-full bg-purple-100 px-3 sm:px-4 py-1.5 sm:py-2 text-[10px] sm:text-xs font-bold tracking-[2px] sm:tracking-[3px] uppercase text-purple-700">
            Shopping Cart
          </span>

          <h1 className="mt-3 sm:mt-5 font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-purple-950">
            Your Cart
          </h1>

          <p className="mt-2 sm:mt-3 text-sm sm:text-base lg:text-lg text-slate-500">
            {cartItems.length} Product
            {cartItems.length > 1 ? "s" : ""} in your cart
          </p>
        </div>

        {/* ================= MAIN GRID ================= */}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-10">

          {/* ================= LEFT PRODUCTS ================= */}

          <div className="lg:col-span-2 space-y-4 sm:space-y-6 lg:space-y-8">

            {cartItems.map((item) => {
              const price = Number(item.product?.price || 0);
              const salePrice = Number(
                item.product?.salePrice || item.product?.price || 0
              );

              const quantity = Number(item.quantity || 1);

              const discount =
                price > salePrice
                  ? Math.round(((price - salePrice) / price) * 100)
                  : 0;

              return (
                <div
                  key={item._id}
                  className="group rounded-2xl sm:rounded-3xl lg:rounded-[34px] bg-white border border-purple-100 shadow-md sm:shadow-lg overflow-hidden transition-all duration-300 lg:hover:-translate-y-1 lg:hover:shadow-purple-900/10"
                >
                  <div className="p-3 sm:p-5 lg:p-6 flex flex-col sm:flex-row gap-4 sm:gap-5 lg:gap-6">

                    {/* ================= IMAGE ================= */}

                    <div
                      onClick={() =>
                        navigate(
                          `/dashboard/cosmic-detail/${item.product?._id}`
                        )
                      }
                      className="relative w-full sm:w-40 md:w-48 lg:w-52 flex-shrink-0 cursor-pointer"
                    >
                      <img
                        src={item.product?.images?.[0]}
                        alt={item.product?.name || "Product"}
                        className="w-full h-52 sm:h-40 md:h-48 lg:h-52 rounded-xl sm:rounded-2xl lg:rounded-3xl object-cover"
                      />

                      {discount > 0 && (
                        <span className="absolute top-2.5 left-2.5 sm:top-3 sm:left-3 lg:top-4 lg:left-4 rounded-full bg-amber-400 px-2.5 sm:px-3 lg:px-4 py-1 text-[9px] sm:text-[10px] lg:text-xs font-bold text-purple-950 shadow">
                          {discount}% OFF
                        </span>
                      )}
                    </div>

                    {/* ================= CONTENT ================= */}

                    <div className="flex-1 min-w-0 flex flex-col">

                      <div>
                        <span className="text-[9px] sm:text-[10px] lg:text-xs font-bold uppercase tracking-[1.5px] sm:tracking-[2px] text-purple-700">
                          {item.product?.category?.name || "Spiritual Product"}
                        </span>

                        <h2 className="mt-1.5 sm:mt-2 text-xl sm:text-2xl lg:text-3xl font-serif font-bold text-purple-950 line-clamp-2">
                          {item.product?.name}
                        </h2>

                        <p className="mt-2 sm:mt-3 text-xs sm:text-sm lg:text-base text-slate-500 leading-5 sm:leading-6 lg:leading-7 line-clamp-2">
                          {item.product?.shortDescription ||
                            "Premium spiritual product curated specially for you."}
                        </p>

                        {/* BADGES */}

                        <div className="mt-3 sm:mt-4 lg:mt-5 flex flex-wrap gap-2">
                          <span className="inline-flex items-center gap-1 rounded-full bg-green-50 px-2.5 sm:px-3 lg:px-4 py-1.5 sm:py-2 text-[9px] sm:text-[10px] lg:text-xs font-semibold text-green-700">
                            <Truck size={12} />
                            Delivery 2-4 Days
                          </span>

                          <span className="inline-flex items-center gap-1 rounded-full bg-purple-50 px-2.5 sm:px-3 lg:px-4 py-1.5 sm:py-2 text-[9px] sm:text-[10px] lg:text-xs font-semibold text-purple-700">
                            <ShieldCheck size={12} />
                            Authentic
                          </span>
                        </div>

                        {/* PRICE */}

                        <div className="mt-4 sm:mt-5 lg:mt-6 flex items-center gap-2 sm:gap-3 flex-wrap">
                          <span className="text-2xl sm:text-3xl lg:text-4xl font-black text-purple-900">
                            ₹{salePrice}
                          </span>

                          {price > salePrice && (
                            <span className="text-sm sm:text-base lg:text-lg line-through text-slate-400">
                              ₹{price}
                            </span>
                          )}
                        </div>

                        <p className="mt-1.5 sm:mt-2 text-xs sm:text-sm text-slate-500">
                          Total:
                          <span className="ml-1.5 font-bold text-purple-900">
                            ₹{salePrice * quantity}
                          </span>
                        </p>
                      </div>

                      {/* ================= ACTIONS ================= */}

                      <div className="mt-5 sm:mt-6 lg:mt-8 flex items-center justify-between gap-3">

                        {/* QUANTITY */}

                        <div className="flex items-center overflow-hidden rounded-xl sm:rounded-2xl border border-purple-200 bg-purple-50">
                          <button
                            disabled={
                              updatingProductId === item.product?._id ||
                              quantity <= 1
                            }
                            onClick={() =>
                              handleUpdateQuantity(
                                item.product?._id,
                                quantity - 1
                              )
                            }
                            className="flex h-10 w-10 sm:h-11 sm:w-12 items-center justify-center text-purple-900 transition hover:bg-purple-900 hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
                          >
                            <Minus size={16} />
                          </button>

                          <span className="flex h-10 sm:h-11 w-10 sm:w-12 items-center justify-center text-sm sm:text-base font-bold bg-white">
                            {updatingProductId === item.product?._id ? (
                              <div className="h-4 w-4 sm:h-5 sm:w-5 animate-spin rounded-full border-2 border-purple-300 border-t-purple-900" />
                            ) : (
                              quantity
                            )}
                          </span>

                          <button
                            disabled={
                              updatingProductId === item.product?._id
                            }
                            onClick={() =>
                              handleUpdateQuantity(
                                item.product?._id,
                                quantity + 1
                              )
                            }
                            className="flex h-10 w-10 sm:h-11 sm:w-12 items-center justify-center text-purple-900 transition hover:bg-purple-900 hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
                          >
                            <Plus size={16} />
                          </button>
                        </div>

                        {/* REMOVE */}

                        <button
                          onClick={() => {
                            setSelectedProductId(item.product?._id);
                            setShowDeletePopup(true);
                          }}
                          disabled={
                            deletingProductId === item.product?._id
                          }
                          className="flex items-center justify-center gap-1.5 sm:gap-2 rounded-xl sm:rounded-2xl bg-red-50 px-3 sm:px-4 lg:px-5 py-2.5 sm:py-3 text-xs sm:text-sm lg:text-base font-semibold text-red-600 transition hover:bg-red-100 disabled:opacity-50"
                        >
                          <Trash2 size={15} className="sm:w-[18px] sm:h-[18px]" />

                          <span className="hidden xs:inline sm:inline">
                            Remove
                          </span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* ================= RIGHT SIDEBAR ================= */}

          <div>
            <div className="lg:sticky lg:top-24 space-y-5 sm:space-y-6">

              {/* ================= ORDER SUMMARY ================= */}

              <div className="overflow-hidden rounded-2xl sm:rounded-3xl lg:rounded-[32px] border border-purple-100 bg-white shadow-lg sm:shadow-xl">

                <div className="bg-gradient-to-r from-purple-900 via-purple-800 to-indigo-900 p-5 sm:p-6 lg:p-7">
                  <h2 className="font-serif text-2xl sm:text-3xl font-bold text-white">
                    Order Summary
                  </h2>

                  <p className="mt-1.5 sm:mt-2 text-xs sm:text-sm text-purple-200">
                    {cartItems.length} Product
                    {cartItems.length > 1 ? "s" : ""} Selected
                  </p>
                </div>

                <div className="space-y-4 sm:space-y-5 p-5 sm:p-6 lg:p-7">

                  <div className="flex justify-between gap-4 text-sm sm:text-base">
                    <span className="text-slate-500">Subtotal</span>
                    <span className="font-bold text-purple-950">
                      ₹{subtotal}
                    </span>
                  </div>

                  <div className="flex justify-between gap-4 text-sm sm:text-base">
                    <span className="text-slate-500">Discount</span>
                    <span className="font-bold text-green-600">
                      - ₹{discount}
                    </span>
                  </div>

                  <div className="flex justify-between gap-4 text-sm sm:text-base">
                    <span className="text-slate-500">GST (18%)</span>
                    <span className="font-bold text-purple-950">
                      ₹{gst}
                    </span>
                  </div>

                  <div className="flex justify-between gap-4 text-sm sm:text-base">
                    <span className="text-slate-500">Shipping</span>

                    <span className="font-bold">
                      {shipping === 0 ? (
                        <span className="text-green-600">FREE</span>
                      ) : (
                        `₹${shipping}`
                      )}
                    </span>
                  </div>

                  <div className="h-px bg-purple-100" />

                  {/* COUPON */}

                  <div>
                    <label className="mb-2 sm:mb-3 block text-xs sm:text-sm font-semibold text-slate-600">
                      Coupon Code
                    </label>

                    <div className="flex overflow-hidden rounded-xl sm:rounded-2xl border border-purple-200">
                      <input
                        type="text"
                        placeholder="Enter coupon"
                        className="min-w-0 flex-1 px-3 sm:px-4 py-2.5 sm:py-3 text-sm outline-none"
                      />

                      <button className="bg-purple-900 px-4 sm:px-6 text-xs sm:text-sm font-bold text-amber-300">
                        Apply
                      </button>
                    </div>
                  </div>

                  {/* GRAND TOTAL */}

                  <div className="rounded-xl sm:rounded-2xl bg-purple-50 p-4 sm:p-5">
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-sm sm:text-lg font-semibold text-purple-950">
                        Grand Total
                      </span>

                      <span className="text-xl sm:text-3xl lg:text-4xl font-black text-purple-900">
                        ₹{grandTotal}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => navigate("/dashboard/checkout")}
                    className="w-full rounded-xl sm:rounded-2xl bg-gradient-to-r from-purple-900 to-indigo-900 py-3.5 sm:py-4 text-sm sm:text-lg font-bold text-amber-300 transition hover:scale-[1.01] active:scale-[0.98]"
                  >
                    Proceed To Checkout
                  </button>
                </div>
              </div>

              {/* ================= DELIVERY ================= */}

              <div className="rounded-2xl sm:rounded-3xl lg:rounded-[32px] bg-gradient-to-r from-purple-900 to-indigo-900 p-5 sm:p-6 lg:p-7 text-white shadow-lg sm:shadow-xl">
                <h3 className="font-serif text-xl sm:text-2xl font-bold">
                  Estimated Delivery
                </h3>

                <p className="mt-2 sm:mt-3 text-sm sm:text-base text-purple-200">
                  Your order will arrive in
                </p>

                <h2 className="mt-1.5 text-3xl sm:text-4xl font-black">
                  2 - 4 Days
                </h2>

                <div className="mt-4 sm:mt-6 rounded-xl sm:rounded-2xl bg-white/10 p-3.5 sm:p-4">
                  <p className="text-xs sm:text-sm">
                    🚚 Free shipping on orders above ₹999
                  </p>
                </div>
              </div>

              {/* ================= SECURE PAYMENT ================= */}

              <div className="rounded-2xl sm:rounded-3xl lg:rounded-[32px] border border-green-200 bg-green-50 p-5 sm:p-6">
                <h3 className="flex items-center gap-2 text-base sm:text-lg font-bold text-green-700">
                  <ShieldCheck size={20} />
                  Secure Checkout
                </h3>

                <p className="mt-2 text-xs sm:text-sm leading-5 sm:leading-6 text-slate-600">
                  Your payment is protected with secure encryption. Shop with
                  complete confidence.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ================= MOBILE BOTTOM CHECKOUT ================= */}

      <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-purple-200 bg-white/95 backdrop-blur-xl p-3 sm:p-4 shadow-[0_-8px_30px_rgba(0,0,0,0.08)] lg:hidden">
        <div className="mx-auto max-w-7xl flex items-center justify-between gap-3">

          <div className="min-w-0">
            <p className="text-[10px] sm:text-xs text-slate-500">
              Grand Total
            </p>

            <h3 className="text-xl sm:text-2xl font-black text-purple-900">
              ₹{grandTotal}
            </h3>
          </div>

          <button
            onClick={() => navigate("/dashboard/checkout")}
            className="flex-shrink-0 rounded-xl sm:rounded-2xl bg-gradient-to-r from-purple-900 to-indigo-900 px-4 sm:px-7 py-3 sm:py-3.5 text-xs sm:text-base font-bold text-amber-300 shadow-lg active:scale-95 transition"
          >
            Checkout
          </button>
        </div>
      </div>

      {/* ================= DELETE POPUP ================= */}

      {showDeletePopup && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 px-4 backdrop-blur-sm">

          <div className="w-full max-w-sm rounded-2xl sm:rounded-3xl bg-white p-5 sm:p-7 shadow-2xl">

            <div className="mx-auto flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-full bg-red-100">
              <Trash2
                size={22}
                className="text-red-600 sm:w-[25px] sm:h-[25px]"
              />
            </div>

            <div className="mt-4 sm:mt-5 text-center">
              <h3 className="text-xl sm:text-2xl font-bold text-purple-950">
                Remove Product?
              </h3>

              <p className="mt-2 text-xs sm:text-sm leading-5 sm:leading-6 text-slate-500">
                Are you sure you want to remove this product from your cart?
              </p>
            </div>

            <div className="mt-6 sm:mt-7 flex gap-2.5 sm:gap-3">

              <button
                onClick={() => {
                  setShowDeletePopup(false);
                  setSelectedProductId(null);
                }}
                disabled={!!deletingProductId}
                className="flex-1 rounded-xl border border-purple-200 bg-white py-2.5 sm:py-3 text-sm sm:text-base font-semibold text-purple-900 transition hover:bg-purple-50 disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                onClick={handleRemoveProduct}
                disabled={!!deletingProductId}
                className="flex-1 rounded-xl bg-red-600 py-2.5 sm:py-3 text-sm sm:text-base font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {deletingProductId ? (
                  <div className="mx-auto h-5 w-5 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                ) : (
                  "Remove"
                )}
              </button>

            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;