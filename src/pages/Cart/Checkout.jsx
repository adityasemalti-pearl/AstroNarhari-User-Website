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
} from "../../API/cosmicApis";

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

const AddressModal = ({ initialData, onClose, onSave, saving }) => {
    const [formData, setFormData] = useState(initialData || emptyAddress);
    const [errors, setErrors] = useState({});

    const handleChange = (field) => (e) => {
        const value =
            field === "isDefault" ? e.target.checked : e.target.value;
        setFormData((prev) => ({ ...prev, [field]: value }));
        if (errors[field]) setErrors((prev) => ({ ...prev, [field]: null }));
    };

    const validate = () => {
        const next = {};
        if (!formData.fullName?.trim()) next.fullName = "Full name is required";
        if (!/^[6-9]\d{9}$/.test(formData.mobile || ""))
            next.mobile = "Enter a valid 10-digit mobile number";
        if (!formData.houseNo?.trim()) next.houseNo = "Required";
        if (!formData.area?.trim()) next.area = "Required";
        if (!formData.city?.trim()) next.city = "Required";
        if (!formData.state?.trim()) next.state = "Required";
        if (!/^\d{6}$/.test(formData.pincode || ""))
            next.pincode = "Enter a valid 6-digit pincode";
        setErrors(next);
        return Object.keys(next).length === 0;
    };

    const handleSubmit = () => {
        if (!validate()) return;
        onSave(formData);
    };

    const inputClass = (field) =>
        `w-full rounded-xl border px-4 py-3 outline-none transition focus:border-purple-600 ${
            errors[field] ? "border-red-400" : "border-gray-200"
        }`;

    return (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 backdrop-blur-sm sm:items-center">
            <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-t-3xl bg-white p-6 shadow-2xl sm:rounded-3xl sm:p-8 animate-[slideUp_0.25s_ease-out]">
                <div className="mb-6 flex items-center justify-between">
                    <h3 className="text-2xl font-bold text-purple-900">
                        {initialData ? "Edit Address" : "Add New Address"}
                    </h3>
                    <button
                        onClick={onClose}
                        className="rounded-full p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-700"
                    >
                        <X size={20} />
                    </button>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                    <div className="sm:col-span-2">
                        <label className="mb-1 block text-sm font-medium text-gray-600">
                            Full Name
                        </label>
                        <input
                            className={inputClass("fullName")}
                            value={formData.fullName}
                            onChange={handleChange("fullName")}
                            placeholder="e.g. Aditya Semalti"
                        />
                        {errors.fullName && (
                            <p className="mt-1 text-xs text-red-500">{errors.fullName}</p>
                        )}
                    </div>

                    <div>
                        <label className="mb-1 block text-sm font-medium text-gray-600">
                            Mobile Number
                        </label>
                        <input
                            className={inputClass("mobile")}
                            value={formData.mobile}
                            onChange={handleChange("mobile")}
                            placeholder="10-digit mobile number"
                            maxLength={10}
                        />
                        {errors.mobile && (
                            <p className="mt-1 text-xs text-red-500">{errors.mobile}</p>
                        )}
                    </div>

                    <div>
                        <label className="mb-1 block text-sm font-medium text-gray-600">
                            Alternate Mobile{" "}
                            <span className="text-gray-400">(optional)</span>
                        </label>
                        <input
                            className={inputClass("alternateMobile")}
                            value={formData.alternateMobile}
                            onChange={handleChange("alternateMobile")}
                            placeholder="Alternate number"
                            maxLength={10}
                        />
                    </div>

                    <div>
                        <label className="mb-1 block text-sm font-medium text-gray-600">
                            House / Flat No.
                        </label>
                        <input
                            className={inputClass("houseNo")}
                            value={formData.houseNo}
                            onChange={handleChange("houseNo")}
                            placeholder="House No., Building"
                        />
                        {errors.houseNo && (
                            <p className="mt-1 text-xs text-red-500">{errors.houseNo}</p>
                        )}
                    </div>

                    <div>
                        <label className="mb-1 block text-sm font-medium text-gray-600">
                            Area / Street
                        </label>
                        <input
                            className={inputClass("area")}
                            value={formData.area}
                            onChange={handleChange("area")}
                            placeholder="Colony, Street"
                        />
                        {errors.area && (
                            <p className="mt-1 text-xs text-red-500">{errors.area}</p>
                        )}
                    </div>

                    <div className="sm:col-span-2">
                        <label className="mb-1 block text-sm font-medium text-gray-600">
                            Landmark{" "}
                            <span className="text-gray-400">(optional)</span>
                        </label>
                        <input
                            className={inputClass("landmark")}
                            value={formData.landmark}
                            onChange={handleChange("landmark")}
                            placeholder="Nearby landmark"
                        />
                    </div>

                    <div>
                        <label className="mb-1 block text-sm font-medium text-gray-600">
                            City
                        </label>
                        <input
                            className={inputClass("city")}
                            value={formData.city}
                            onChange={handleChange("city")}
                            placeholder="City"
                        />
                        {errors.city && (
                            <p className="mt-1 text-xs text-red-500">{errors.city}</p>
                        )}
                    </div>

                    <div>
                        <label className="mb-1 block text-sm font-medium text-gray-600">
                            State
                        </label>
                        <input
                            className={inputClass("state")}
                            value={formData.state}
                            onChange={handleChange("state")}
                            placeholder="State"
                        />
                        {errors.state && (
                            <p className="mt-1 text-xs text-red-500">{errors.state}</p>
                        )}
                    </div>

                    <div>
                        <label className="mb-1 block text-sm font-medium text-gray-600">
                            Pincode
                        </label>
                        <input
                            className={inputClass("pincode")}
                            value={formData.pincode}
                            onChange={handleChange("pincode")}
                            placeholder="6-digit pincode"
                            maxLength={6}
                        />
                        {errors.pincode && (
                            <p className="mt-1 text-xs text-red-500">{errors.pincode}</p>
                        )}
                    </div>

                    <div>
                        <label className="mb-1 block text-sm font-medium text-gray-600">
                            Address Type
                        </label>
                        <div className="flex gap-2">
                            {["Home", "Work", "Other"].map((type) => (
                                <button
                                    key={type}
                                    type="button"
                                    onClick={() =>
                                        setFormData((prev) => ({
                                            ...prev,
                                            addressType: type,
                                        }))
                                    }
                                    className={`rounded-xl px-4 py-2 text-sm font-medium transition ${
                                        formData.addressType === type
                                            ? "bg-purple-600 text-white"
                                            : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                                    }`}
                                >
                                    {type}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="sm:col-span-2">
                        <label className="flex cursor-pointer items-center gap-2 text-sm text-gray-600">
                            <input
                                type="checkbox"
                                checked={formData.isDefault}
                                onChange={handleChange("isDefault")}
                                className="h-4 w-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                            />
                            Set as default address
                        </label>
                    </div>
                </div>

                <div className="mt-8 flex gap-3">
                    <button
                        onClick={onClose}
                        className="flex-1 rounded-xl border border-gray-200 py-3 font-medium text-gray-600 hover:bg-gray-50"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={saving}
                        className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-purple-600 py-3 font-medium text-white transition hover:bg-purple-700 disabled:opacity-60"
                    >
                        {saving && <Loader2 size={18} className="animate-spin" />}
                        {initialData ? "Save Changes" : "Add Address"}
                    </button>
                </div>
            </div>
        </div>
    );
};

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
    const gstRate = 0.03; // adjust to match actual tax logic
    const gst = Math.round(subtotal * gstRate);
    const total = subtotal + shipping + gst;

    const canProceed =
        !!selectedAddress && cartItems.length > 0 && !cartLoading && !addressLoading;

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
                                                    className={`group relative cursor-pointer rounded-2xl border p-5 transition ${
                                                        isSelected
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
                                                            className={`flex h-5 w-5 items-center justify-center rounded-full border-2 ${
                                                                isSelected
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
                                                : `Show ${addresses.length - 2} more address${
                                                      addresses.length - 2 !== 1 ? "es" : ""
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
                                    <h2 className="text-xl font-bold">Apply Coupon</h2>
                                    <p className="text-sm text-gray-500">
                                        Save more on your order
                                    </p>
                                </div>
                            </div>

                            <div className="flex gap-3">
                                <input
                                    type="text"
                                    value={couponCode}
                                    onChange={(e) => setCouponCode(e.target.value)}
                                    placeholder="Enter Coupon Code"
                                    className="flex-1 rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-purple-600"
                                />
                                <button
                                    disabled
                                    title="Coupons are coming soon"
                                    className="cursor-not-allowed rounded-xl bg-purple-300 px-6 text-white"
                                >
                                    Apply
                                </button>
                            </div>
                            <p className="mt-2 text-xs text-gray-400">
                                Coupon codes are coming soon.
                            </p>
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
                                    disabled={!canProceed}
                                    title={
                                        !canProceed
                                            ? "Add an address and make sure your cart isn't empty"
                                            : "Payment integration coming soon"
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
        </div>
    );
};

export default CheckoutPage;