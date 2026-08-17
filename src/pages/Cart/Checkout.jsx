import React, { useEffect, useState } from "react";
import {
    MapPin,
    Truck,
    Tag,
    CreditCard,
    Wallet,
    ShieldCheck,
    Plus,
    ChevronRight,
    X,
    Pencil,
    Trash2,
    Check,
    Loader2,
    PackageOpen,
    Star,
} from "lucide-react";
import {
    getMyAddresses,
    addShippingAddress,
    updateShippingAddress,
    deleteShippingAddress,
    getCart,
    getCoupons,
    applyCoupon,
    createOrder
} from "../../API/cosmicApis";
import AddressModal from "./AddressModal";
import PaymentResultPopup from "./PaymentResultPopup";

// ---------- helpers ----------

const emptyAddress = {
    fullName: "",
    mobile: "",
    alternateMobile: "",
    houseNo: "",
    area: "",
    landmark: "",
    city: "",
    state: "",
    pincode: "",
    addressType: "Home",
    isDefault: false,
};

// Normalizes a cart line item regardless of whether the API nests the
// product under `product` or flattens it onto the item itself.
const normalizeCartItem = (item) => {
    const product = item.product || item;
    return {
        id: item._id || item.id || product._id || product.id,
        name: product.name || item.name || "Product",
        image:
            product.image ||
            (Array.isArray(product.images) ? product.images[0] : null) ||
            item.image ||
            "https://placehold.co/200x200?text=No+Image",
        price: Number(item.price ?? product.price ?? 0),
        qty: Number(item.qty ?? item.quantity ?? 1),
    };
};

const currency = (n) =>
    `₹${Number(n || 0).toLocaleString("en-IN", { maximumFractionDigits: 2 })}`;

// ---------- skeletons ----------

const AddressSkeleton = () => (
    <div className="animate-pulse rounded-2xl border border-purple-100 bg-purple-50/60 p-5">
        <div className="h-4 w-16 rounded-full bg-purple-200" />
        <div className="mt-4 h-4 w-40 rounded bg-purple-200" />
        <div className="mt-2 h-3 w-28 rounded bg-purple-100" />
        <div className="mt-3 h-3 w-3/4 rounded bg-purple-100" />
    </div>
);

const CartItemSkeleton = () => (
    <div className="flex animate-pulse items-center gap-4 rounded-2xl border border-gray-100 p-4">
        <div className="h-24 w-24 rounded-2xl bg-gray-200" />
        <div className="flex-1 space-y-2">
            <div className="h-4 w-1/2 rounded bg-gray-200" />
            <div className="h-3 w-1/4 rounded bg-gray-100" />
            <div className="h-4 w-1/6 rounded bg-gray-100" />
        </div>
    </div>
);

// ---------- address form modal ----------


// ---------- main page ----------

const CheckoutPage = () => {
    const [addresses, setAddresses] = useState([]);
    const [selectedAddressId, setSelectedAddressId] = useState(null);
    const [addressLoading, setAddressLoading] = useState(true);
    const [showAllAddresses, setShowAllAddresses] = useState(false);

    const [cartItems, setCartItems] = useState([]);
    const [cartLoading, setCartLoading] = useState(true);

    const [paymentMethod, setPaymentMethod] = useState("razorpay");
    const [couponCode, setCouponCode] = useState("");
    const [orderNotes, setOrderNotes] = useState("");

    const [modalOpen, setModalOpen] = useState(false);
    const [editingAddress, setEditingAddress] = useState(null);
    const [savingAddress, setSavingAddress] = useState(false);
    const [deletingId, setDeletingId] = useState(null);
    const [error, setError] = useState("");

    const [coupons, setCoupons] = useState([]);
    const [couponLoading, setCouponLoading] = useState(false);
    const [couponError, setCouponError] = useState("");
    const [couponSuccess, setCouponSuccess] = useState("");
    const [appliedCoupon, setAppliedCoupon] = useState(null);
    const [applyingCoupon, setApplyingCoupon] = useState(false);
    const [couponDropdownOpen, setCouponDropdownOpen] = useState(false);
    const [paymentResult, setPaymentResult] = useState(null);

    const fetchCoupons = async () => {
        try {
            setAddressLoading(true);
            const res = await getCoupons();
            setCoupons(res?.data?.data || []);
        } catch (error) {
            console.log(error);
        } finally {
            setAddressLoading(false);
        }
    }

    const fetchMyAddresses = async () => {
        try {
            setAddressLoading(true);
            const res = await getMyAddresses();
            const list = res?.data?.data || [];
            setAddresses(list);

            // auto-select the default address, or fall back to the first one
            const defaultAddr = list.find((a) => a.isDefault) || list[0];
            if (defaultAddr) {
                setSelectedAddressId(defaultAddr._id || defaultAddr.id);
            }
        } catch (err) {
            console.log(err);
            setError("Couldn't load your addresses. Please refresh.");
        } finally {
            setAddressLoading(false);
        }
    };

    const fetchCart = async () => {
        try {
            setCartLoading(true);
            const res = await getCart();
            const items = (res?.data?.data?.items || []).map(normalizeCartItem);
            setCartItems(items);
        } catch (err) {
            console.log(err);
            setError("Couldn't load your cart. Please refresh.");
        } finally {
            setCartLoading(false);
        }
    };

    useEffect(() => {
        fetchMyAddresses();
        fetchCart();
        fetchCoupons();
    }, []);

    const openAddModal = () => {
        setEditingAddress(null);
        setModalOpen(true);
    };

    const openEditModal = (address) => {
        setEditingAddress(address);
        setModalOpen(true);
    };

    const closeModal = () => {
        setModalOpen(false);
        setEditingAddress(null);
    };

    const handleSaveAddress = async (formData) => {
        try {
            setSavingAddress(true);
            if (editingAddress) {
                const id = editingAddress._id || editingAddress.id;
                await updateShippingAddress(id, formData);
            } else {
                await addShippingAddress(formData);
            }
            await fetchMyAddresses();
            closeModal();
        } catch (err) {
            console.log(err);
            setError("Couldn't save this address. Please try again.");
        } finally {
            setSavingAddress(false);
        }
    };

    const handleDeleteAddress = async (address) => {
        const id = address._id || address.id;
        try {
            setDeletingId(id);
            await deleteShippingAddress(id);
            await fetchMyAddresses();
        } catch (err) {
            console.log(err);
            setError("Couldn't delete this address. Please try again.");
        } finally {
            setDeletingId(null);
        }
    };

    const selectedAddress = addresses.find(
        (a) => (a._id || a.id) === selectedAddressId
    );

    const visibleAddresses = showAllAddresses ? addresses : addresses.slice(0, 2);

    // ---- order totals ----
    const subtotal = cartItems.reduce((sum, i) => sum + i.price * i.qty, 0);
    const shipping = 0; // free shipping
    const gstRate = 0.03;
    const discount = appliedCoupon?.discountAmount || 0;
    const gst = Math.round((subtotal - discount) * gstRate);
    const total = subtotal - discount + shipping + gst;
    const canProceed =
        !!selectedAddress && cartItems.length > 0 && !cartLoading && !addressLoading;


    const handleRazorpayPayment = () => {
        if (!canProceed) {
            setError("Please select an address and add products to your cart.");
            return;
        }

        if (paymentMethod !== "razorpay") {
            setError("Please select Razorpay as the payment method.");
            return;
        }

        if (!window.Razorpay) {
            setError("Razorpay SDK failed to load. Please refresh the page.");
            return;
        }

        const options = {
            key: "rzp_test_TE9gEROWqFsafm",

            amount: Math.round(total * 100),

            currency: "INR",

            name: "Namahastro Cosmic shop",
            description: "Test Order Payment",

            image: "https://yourwebsite.com/logo.png",

            prefill: {
                name: selectedAddress?.fullName || "Test User",
                email: "test@example.com",
                contact: selectedAddress?.mobile || "9999999999",
            },

            notes: {
                address: selectedAddress
                    ? `${selectedAddress.city}, ${selectedAddress.state}`
                    : "",
                order_notes: orderNotes,
            },

            theme: {
                color: "#7c3aed",
            },

            // Payment successful
            handler: async function (response) {
                console.log("Payment Successful:", response);

                try {
                    setError("");

                    const orderData = {
                        paymentMethod: "ONLINE",

                        couponCode: couponCode || undefined,

                        notes: orderNotes,

                        address: {
                            name: selectedAddress.fullName,
                            mobile: selectedAddress.mobile,

                            address: [
                                selectedAddress.houseNo,
                                selectedAddress.area,
                                selectedAddress.landmark,
                            ]
                                .filter(Boolean)
                                .join(", "),

                            city: selectedAddress.city,
                            state: selectedAddress.state,
                            pincode: selectedAddress.pincode,
                        },

                        paymentDetails: {
                            transactionId:
                                response.razorpay_payment_id,
                        },
                    };

                    console.log("Creating Order:", orderData);

                    const result = await createOrder(orderData);

                    console.log("Order Created Successfully:", result);

                    setPaymentResult({
                        type: "success",
                        message:
                            "Your payment was successful and your order has been placed successfully.",
                        paymentId:
                            response.razorpay_payment_id,
                    });
                    // Optional:
                    // navigate("/orders");

                } catch (error) {
                    console.error("Order creation failed:", error);

                    setError(
                        error?.response?.data?.message ||
                        "Payment successful but order creation failed."
                    );
                }
            },

            modal: {
                ondismiss: function () {
                    console.log("Razorpay checkout closed");
                },
            },
        };

        const razorpay = new window.Razorpay(options);

        razorpay.on("payment.failed", function (response) {
            console.error("Payment Failed:", response.error);

            setPaymentResult({
                type: "failure",
                message:
                    response.error?.description ||
                    "Payment failed. Please try again.",
            });
        });

        razorpay.open();
    };



    const handleApplyCoupon = async () => {
        setCouponError("");
        setCouponSuccess("");

        if (!couponCode) {
            setCouponError("Please select a coupon.");
            return;
        }

        try {
            setApplyingCoupon(true);

            const res = await applyCoupon({
                code: couponCode,
                order_amount: subtotal,
            });

            const data = res?.data?.data || res?.data;

            const discountAmount = Number(
                data?.discountAmount ?? data?.discount ?? 0
            );

            setAppliedCoupon({
                code: data?.code || couponCode,
                discountAmount,
            });

            setCouponSuccess(
                `${data?.code || couponCode} applied successfully. You saved ${currency(
                    discountAmount
                )}.`
            );
        } catch (err) {
            console.log(err);
            setCouponError(
                err?.response?.data?.message || "Couldn't apply this coupon. Please try again."
            );
            setAppliedCoupon(null);
        } finally {
            setApplyingCoupon(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#faf8ff] py-10">
            <style>{`
                @keyframes slideUp { from { transform: translateY(24px); opacity: 0 } to { transform: translateY(0); opacity: 1 } }
                @keyframes fadeIn { from { opacity: 0 } to { opacity: 1 } }
                .fade-in { animation: fadeIn 0.3s ease-out; }
            `}</style>

            <div className="mx-auto max-w-7xl px-4">
                <div className="mb-8 flex items-center justify-between">
                    <h1 className="text-4xl font-bold text-purple-900">Checkout</h1>
                    <p className="hidden text-sm text-gray-500 sm:block">
                        {cartItems.length} item{cartItems.length !== 1 ? "s" : ""} in cart
                    </p>
                </div>

                {error && (
                    <div className="mb-6 flex items-center justify-between rounded-2xl border border-red-200 bg-red-50 px-5 py-3 text-sm text-red-600">
                        {error}
                        <button onClick={() => setError("")} className="ml-4 text-red-400 hover:text-red-600">
                            <X size={16} />
                        </button>
                    </div>
                )}

                <div className="grid gap-8 lg:grid-cols-3">
                    {/* LEFT SIDE */}
                    <div className="space-y-6 lg:col-span-2">
                        {/* Address */}
                        <div className="rounded-3xl bg-white p-6 shadow-lg">
                            <div className="mb-5 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="rounded-xl bg-purple-100 p-3">
                                        <MapPin className="text-purple-700" />
                                    </div>
                                    <div>
                                        <h2 className="text-xl font-bold">Delivery Address</h2>
                                        <p className="text-sm text-gray-500">
                                            Choose where to deliver
                                        </p>
                                    </div>
                                </div>

                                <button
                                    onClick={openAddModal}
                                    className="flex items-center gap-1.5 rounded-xl bg-purple-600 px-5 py-2 text-sm font-medium text-white transition hover:bg-purple-700"
                                >
                                    <Plus size={16} />
                                    Add New
                                </button>
                            </div>

                            {addressLoading ? (
                                <div className="grid gap-4 sm:grid-cols-2">
                                    <AddressSkeleton />
                                    <AddressSkeleton />
                                </div>
                            ) : addresses.length === 0 ? (
                                <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-purple-200 bg-purple-50/50 py-10 text-center">
                                    <PackageOpen className="mb-3 text-purple-300" size={36} />
                                    <p className="font-medium text-gray-700">
                                        No saved addresses yet
                                    </p>
                                    <p className="mt-1 text-sm text-gray-500">
                                        Add an address to continue with delivery
                                    </p>
                                    <button
                                        onClick={openAddModal}
                                        className="mt-4 rounded-xl bg-purple-600 px-5 py-2 text-sm font-medium text-white hover:bg-purple-700"
                                    >
                                        Add Address
                                    </button>
                                </div>
                            ) : (
                                <>
                                    <div className="grid gap-4 sm:grid-cols-2">
                                        {visibleAddresses.map((addr) => {
                                            const id = addr._id || addr.id;
                                            const isSelected = id === selectedAddressId;
                                            return (
                                                <div
                                                    key={id}
                                                    onClick={() => setSelectedAddressId(id)}
                                                    className={`group relative cursor-pointer rounded-2xl border p-5 transition ${isSelected
                                                        ? "border-purple-600 bg-purple-50 ring-2 ring-purple-200"
                                                        : "border-gray-200 bg-white hover:border-purple-300"
                                                        }`}
                                                >
                                                    <div className="flex items-center justify-between">
                                                        <div className="flex items-center gap-2">
                                                            <span className="rounded-full bg-purple-600 px-3 py-1 text-xs text-white">
                                                                {addr.addressType || "Home"}
                                                            </span>
                                                            {addr.isDefault && (
                                                                <span className="flex items-center gap-1 rounded-full bg-amber-100 px-2 py-1 text-xs font-medium text-amber-700">
                                                                    <Star size={11} fill="currentColor" />
                                                                    Default
                                                                </span>
                                                            )}
                                                        </div>

                                                        <div
                                                            className={`flex h-5 w-5 items-center justify-center rounded-full border-2 ${isSelected
                                                                ? "border-purple-600 bg-purple-600"
                                                                : "border-gray-300"
                                                                }`}
                                                        >
                                                            {isSelected && (
                                                                <Check size={12} className="text-white" />
                                                            )}
                                                        </div>
                                                    </div>

                                                    <h3 className="mt-3 text-lg font-bold">
                                                        {addr.fullName}
                                                    </h3>
                                                    <p className="mt-1 text-gray-600">{addr.mobile}</p>
                                                    <p className="mt-2 text-sm text-gray-700">
                                                        {[
                                                            addr.houseNo,
                                                            addr.area,
                                                            addr.landmark,
                                                            addr.city,
                                                            addr.state,
                                                        ]
                                                            .filter(Boolean)
                                                            .join(", ")}{" "}
                                                        {addr.pincode ? `- ${addr.pincode}` : ""}
                                                    </p>

                                                    <div className="mt-4 flex items-center gap-4 opacity-0 transition group-hover:opacity-100">
                                                        <button
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                openEditModal(addr);
                                                            }}
                                                            className="flex items-center gap-1 text-sm font-medium text-purple-600 hover:text-purple-800"
                                                        >
                                                            <Pencil size={14} />
                                                            Edit
                                                        </button>
                                                        <button
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                handleDeleteAddress(addr);
                                                            }}
                                                            disabled={deletingId === id}
                                                            className="flex items-center gap-1 text-sm font-medium text-red-500 hover:text-red-700 disabled:opacity-50"
                                                        >
                                                            {deletingId === id ? (
                                                                <Loader2 size={14} className="animate-spin" />
                                                            ) : (
                                                                <Trash2 size={14} />
                                                            )}
                                                            Delete
                                                        </button>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>

                                    {addresses.length > 2 && (
                                        <button
                                            onClick={() => setShowAllAddresses((v) => !v)}
                                            className="mt-4 text-sm font-medium text-purple-600 hover:text-purple-800"
                                        >
                                            {showAllAddresses
                                                ? "Show less"
                                                : `Show ${addresses.length - 2} more address${addresses.length - 2 !== 1 ? "es" : ""
                                                }`}
                                        </button>
                                    )}
                                </>
                            )}
                        </div>

                        {/* Products */}
                        <div className="rounded-3xl bg-white p-6 shadow-lg">
                            <div className="mb-6 flex items-center gap-3">
                                <div className="rounded-xl bg-purple-100 p-3">
                                    <Truck className="text-purple-700" />
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold">Order Items</h2>
                                    <p className="text-sm text-gray-500">
                                        {cartItems.length} Product{cartItems.length !== 1 ? "s" : ""}
                                    </p>
                                </div>
                            </div>

                            <div className="space-y-5">
                                {cartLoading ? (
                                    <>
                                        <CartItemSkeleton />
                                        <CartItemSkeleton />
                                    </>
                                ) : cartItems.length === 0 ? (
                                    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-gray-200 py-10 text-center">
                                        <PackageOpen className="mb-3 text-gray-300" size={36} />
                                        <p className="font-medium text-gray-700">
                                            Your cart is empty
                                        </p>
                                        <p className="mt-1 text-sm text-gray-500">
                                            Add some products before checking out
                                        </p>
                                    </div>
                                ) : (
                                    cartItems.map((item) => (
                                        <div
                                            key={item.id}
                                            className="flex items-center justify-between rounded-2xl border border-gray-100 p-4 transition hover:shadow-md"
                                        >
                                            <div className="flex items-center gap-4">
                                                <img
                                                    src={item.image}
                                                    alt={item.name}
                                                    className="h-24 w-24 rounded-2xl object-cover"
                                                />
                                                <div>
                                                    <h3 className="font-semibold text-lg">
                                                        {item.name}
                                                    </h3>
                                                    <p className="mt-2 text-gray-500">
                                                        Qty : {item.qty}
                                                    </p>
                                                    <p className="mt-1 font-bold text-purple-700">
                                                        {currency(item.price)}
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="text-right">
                                                <p className="text-gray-500">Total</p>
                                                <p className="text-2xl font-bold text-purple-700">
                                                    {currency(item.price * item.qty)}
                                                </p>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>

                        {/* Coupon */}
                        <div className="rounded-3xl bg-white p-6 shadow-lg">
                            <div className="mb-5 flex items-center gap-3">
                                <div className="rounded-xl bg-purple-100 p-3">
                                    <Tag className="text-purple-700" />
                                </div>

                                <div>
                                    <h2 className="text-xl font-bold">
                                        Apply Coupon
                                    </h2>

                                    <p className="text-sm text-gray-500">
                                        Choose a coupon and save more on your order
                                    </p>
                                </div>
                            </div>

                            <div className="flex gap-3">
                                <div className="relative flex-1">
                                    <button
                                        type="button"
                                        onClick={() => setCouponDropdownOpen((prev) => !prev)}
                                        className="flex w-full items-center justify-between rounded-xl border border-gray-200 bg-white px-4 py-3 text-left outline-none transition hover:border-purple-300 focus:border-purple-600"
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-purple-100">
                                                <Tag size={17} className="text-purple-600" />
                                            </div>

                                            <div>
                                                {couponCode ? (
                                                    <>
                                                        <p className="text-sm font-semibold text-gray-800">
                                                            {couponCode}
                                                        </p>

                                                        <p className="text-xs text-gray-500">
                                                            {
                                                                coupons.find(
                                                                    (coupon) => coupon.code === couponCode
                                                                )?.title
                                                            }
                                                        </p>
                                                    </>
                                                ) : (
                                                    <p className="text-sm text-gray-500">
                                                        Select a coupon
                                                    </p>
                                                )}
                                            </div>
                                        </div>

                                        <ChevronRight
                                            size={18}
                                            className={`text-gray-400 transition-transform ${couponDropdownOpen ? "rotate-90" : ""
                                                }`}
                                        />
                                    </button>

                                    {couponDropdownOpen && (
                                        <div className="absolute left-0 right-0 z-50 mt-2 max-h-72 overflow-y-auto rounded-2xl border border-gray-100 bg-white p-2 shadow-xl">
                                            {coupons.map((coupon) => (
                                                <button
                                                    key={coupon._id}
                                                    type="button"
                                                    onClick={() => {
                                                        setCouponCode(coupon.code);
                                                        setCouponError("");
                                                        setCouponSuccess("");
                                                        setCouponDropdownOpen(false);
                                                    }}
                                                    className={`mb-1 flex w-full items-center justify-between rounded-xl p-3 text-left transition last:mb-0 ${couponCode === coupon.code
                                                        ? "bg-purple-50 ring-1 ring-purple-200"
                                                        : "hover:bg-gray-50"
                                                        }`}
                                                >
                                                    <div className="flex items-center gap-3">
                                                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-50">
                                                            <Tag
                                                                size={17}
                                                                className="text-green-600"
                                                            />
                                                        </div>

                                                        <div>
                                                            <div className="flex items-center gap-2">
                                                                <p className="text-sm font-bold text-gray-800">
                                                                    {coupon.code}
                                                                </p>

                                                                {coupon.discountType === "PERCENTAGE" ? (
                                                                    <span className="rounded-full bg-purple-100 px-2 py-0.5 text-[10px] font-semibold text-purple-700">
                                                                        {coupon.discountValue}% OFF
                                                                    </span>
                                                                ) : (
                                                                    <span className="rounded-full bg-green-100 px-2 py-0.5 text-[10px] font-semibold text-green-700">
                                                                        ₹{coupon.discountValue} OFF
                                                                    </span>
                                                                )}
                                                            </div>

                                                            <p className="mt-1 text-xs text-gray-500">
                                                                {coupon.description}
                                                            </p>

                                                            <p className="mt-1 text-[11px] text-gray-400">
                                                                Min. order{" "}
                                                                {currency(coupon.minimumOrderAmount)}
                                                            </p>
                                                        </div>
                                                    </div>

                                                    {couponCode === coupon.code && (
                                                        <Check
                                                            size={18}
                                                            className="shrink-0 text-purple-600"
                                                        />
                                                    )}
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                <button
                                    type="button"
                                    onClick={handleApplyCoupon}
                                    disabled={!couponCode || applyingCoupon}
                                    className="flex items-center justify-center gap-2 rounded-xl bg-purple-600 px-6 font-medium text-white transition hover:bg-purple-700 disabled:cursor-not-allowed disabled:bg-purple-300"
                                >
                                    {applyingCoupon ? <Loader2 size={16} className="animate-spin" /> : "Apply"}
                                </button>
                            </div>

                            {couponError && (
                                <p className="mt-2 text-sm text-red-500">
                                    {couponError}
                                </p>
                            )}

                            {couponSuccess && (
                                <p className="mt-2 text-sm font-medium text-green-600">
                                    {couponSuccess}
                                </p>
                            )}

                            {appliedCoupon && (
                                <div className="mt-4 flex items-center justify-between rounded-xl bg-green-50 px-4 py-3">
                                    <div>
                                        <p className="font-semibold text-green-700">
                                            {appliedCoupon.code} Applied
                                        </p>

                                        <p className="text-sm text-green-600">
                                            You saved{" "}
                                            {currency(appliedCoupon.discountAmount)}
                                        </p>
                                    </div>

                                    <button
                                        type="button"
                                        onClick={() => {
                                            setAppliedCoupon(null);
                                            setCouponCode("");
                                            setCouponError("");
                                            setCouponSuccess("");
                                        }}
                                        className="text-sm font-medium text-red-500 hover:text-red-700"
                                    >
                                        Remove
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Payment */}
                        <div className="rounded-3xl bg-white p-6 shadow-lg">
                            <div className="mb-6 flex items-center gap-3">
                                <div className="rounded-xl bg-purple-100 p-3">
                                    <CreditCard className="text-purple-700" />
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold">Payment Method</h2>
                                    <p className="text-sm text-gray-500">
                                        Select payment option
                                    </p>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <label className="flex cursor-pointer items-center justify-between rounded-2xl border p-5 transition hover:border-purple-300">
                                    <div className="flex items-center gap-4">
                                        <CreditCard className="text-purple-700" />
                                        <div>
                                            <h3 className="font-semibold">Razorpay</h3>
                                            <p className="text-sm text-gray-500">
                                                UPI / Cards / Net Banking
                                            </p>
                                        </div>
                                    </div>
                                    <input
                                        type="radio"
                                        name="paymentMethod"
                                        checked={paymentMethod === "razorpay"}
                                        onChange={() => setPaymentMethod("razorpay")}
                                        className="h-4 w-4 accent-purple-600"
                                    />
                                </label>

                                <label className="flex cursor-pointer items-center justify-between rounded-2xl border p-5 transition hover:border-purple-300">
                                    <div className="flex items-center gap-4">
                                        <Wallet className="text-purple-700" />
                                        <div>
                                            <h3 className="font-semibold">Cash On Delivery</h3>
                                            <p className="text-sm text-gray-500">
                                                Pay after delivery
                                            </p>
                                        </div>
                                    </div>
                                    <input
                                        type="radio"
                                        name="paymentMethod"
                                        checked={paymentMethod === "cod"}
                                        onChange={() => setPaymentMethod("cod")}
                                        className="h-4 w-4 accent-purple-600"
                                    />
                                </label>
                            </div>
                        </div>

                        {/* Notes */}
                        <div className="rounded-3xl bg-white p-6 shadow-lg">
                            <h2 className="mb-4 text-xl font-bold">Order Notes</h2>
                            <textarea
                                rows={4}
                                value={orderNotes}
                                onChange={(e) => setOrderNotes(e.target.value)}
                                placeholder="Any special instructions..."
                                className="w-full rounded-2xl border border-gray-200 p-4 outline-none focus:border-purple-600"
                            />
                        </div>
                    </div>

                    {/* RIGHT SIDE */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-24 space-y-6">
                            {/* Order Summary */}
                            <div className="rounded-3xl bg-white p-6 shadow-lg">
                                <h2 className="mb-6 text-2xl font-bold text-purple-900">
                                    Order Summary
                                </h2>

                                <div className="space-y-4 text-gray-700">
                                    <div className="flex justify-between">
                                        <span>Subtotal</span>
                                        <span>{currency(subtotal)}</span>
                                    </div>

                                    {appliedCoupon && (
                                        <div className="flex justify-between text-green-600">
                                            <span>Discount ({appliedCoupon.code})</span>
                                            <span>- {currency(appliedCoupon.discountAmount)}</span>
                                        </div>
                                    )}

                                    <div className="flex justify-between">
                                        <span>Shipping</span>
                                        <span className="font-semibold text-green-600">
                                            {shipping === 0 ? "FREE" : currency(shipping)}
                                        </span>
                                    </div>

                                    <div className="flex justify-between">
                                        <span>GST ({Math.round(gstRate * 100)}%)</span>
                                        <span>{currency(gst)}</span>
                                    </div>

                                    <hr />

                                    <div className="flex justify-between text-2xl font-bold text-purple-700">
                                        <span>Total</span>
                                        <span>{currency(total)}</span>
                                    </div>
                                </div>

                                <button
                                    onClick={handleRazorpayPayment}
                                    disabled={!canProceed || paymentMethod !== "razorpay"}
                                    title={
                                        !canProceed
                                            ? "Add an address and make sure your cart isn't empty"
                                            : "Proceed with Razorpay test payment"
                                    }
                                    className="mt-8 flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-purple-600 to-violet-700 py-4 text-lg font-semibold text-white shadow-xl transition hover:scale-[1.02] hover:shadow-purple-300 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100"
                                >
                                    Proceed To Payment
                                    <ChevronRight size={20} />
                                </button>

                                {!selectedAddress && !addressLoading && (
                                    <p className="mt-3 text-center text-xs text-red-500">
                                        Select a delivery address to continue
                                    </p>
                                )}
                            </div>

                            {/* Delivery */}
                            <div className="rounded-3xl bg-white p-6 shadow-lg">
                                <div className="flex items-center gap-3">
                                    <div className="rounded-xl bg-purple-100 p-3">
                                        <Truck className="text-purple-700" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-lg">
                                            Estimated Delivery
                                        </h3>
                                        <p className="text-gray-500">Tomorrow, 10 AM - 6 PM</p>
                                    </div>
                                </div>
                            </div>

                            {/* Security */}
                            <div className="rounded-3xl bg-gradient-to-br from-purple-600 to-violet-700 p-6 text-white shadow-xl">
                                <div className="flex items-center gap-3">
                                    <ShieldCheck size={34} />
                                    <div>
                                        <h3 className="text-lg font-bold">
                                            100% Secure Checkout
                                        </h3>
                                        <p className="mt-1 text-sm text-purple-100">
                                            SSL encrypted payment with secure order processing.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {modalOpen && (
                <AddressModal
                    initialData={editingAddress}
                    onClose={closeModal}
                    onSave={handleSaveAddress}
                    saving={savingAddress}
                />
            )}
            {paymentResult && (
                <PaymentResultPopup
                    type={paymentResult.type}
                    message={paymentResult.message}
                    paymentId={paymentResult.paymentId}
                    countdownStart={10}
                    onRedirect={() => {
                        window.location.href = "/dashboard/orders";
                    }}
                    onClose={() => setPaymentResult(null)}
                />
            )}
        </div>
    );
};

export default CheckoutPage;