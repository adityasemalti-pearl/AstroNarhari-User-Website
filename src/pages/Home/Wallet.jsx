import React, { useEffect, useState } from "react";
import {
    ArrowLeft,
    Wallet,
    Plus,
    ArrowDownLeft,
    ArrowUpRight,
    CreditCard,
    Smartphone,
    ShieldCheck,
    ChevronRight,
} from "lucide-react";

import {
    myWallet,
    addMoneyToWallet,
} from "../../API/bookingApis";

const RECHARGE_OPTIONS = [100, 250, 500, 1000, 2000, 5000];

export default function WalletPage({ onBack }) {
    const [balance, setBalance] = useState(0);
    const [selectedAmount, setSelectedAmount] = useState(500);
    const [customAmount, setCustomAmount] = useState("");
    

    const [loadingBalance, setLoadingBalance] = useState(true);
    const [rechargeLoading, setRechargeLoading] = useState(false);

    // =========================
    // GET WALLET BALANCE
    // =========================
    const fetchWalletBalance = async () => {
        try {
            setLoadingBalance(true);

            const response = await myWallet();

            console.log("🔥 FULL WALLET RESPONSE:", response);
console.log("🔥 WALLET DATA:", response?.data);
console.log("🔥 WALLET BALANCE:", response?.data?.balance);

            // If your api interceptor returns response.data
            if (response?.data?.walletBalance !== undefined) {
                setBalance(response.data.walletBalance);
            }


        } catch (error) {
            console.error("Wallet Balance Error:", error);

            alert(
                error?.response?.data?.message ||
                "Unable to fetch wallet balance."
            );
        } finally {
            setLoadingBalance(false);
        }
    };

    // Fetch wallet balance when page opens
    useEffect(() => {
        fetchWalletBalance();
    }, []);

    // =========================
    // ADD MONEY
    // =========================
 


  const handleRecharge = async () => {
    try {
        const amount = customAmount
            ? Number(customAmount)
            : Number(selectedAmount);

        if (!amount || amount < 10) {
            alert("Please enter a valid amount.");
            return;
        }

        setRechargeLoading(true);

        // ₹500 -> 50000 paise
        const amountInPaise = amount * 100;

        const options = {
            key: "rzp_test_TE9gEROWqFsafm",

            amount: amountInPaise,
            currency: "INR",

            name: "NamahAstro",
            description: "Wallet Recharge",

            prefill: {
                name: "Test User",
                email: "test@example.com",
                contact: "9999999999",
            },

            theme: {
                color: "#6D28D9",
            },

            handler: async function (paymentResponse) {
                console.log(
                    "Razorpay Payment Success:",
                    paymentResponse
                );

                try {
                    // Payment successful -> call your API
                    const payload = {
                        amount: amountInPaise,
                    };

                    console.log(
                        "Calling addMoneyToWallet:",
                        payload
                    );

                    const response =
                        await addMoneyToWallet(payload);

                    console.log(
                        "Wallet API Response:",
                        response
                    );

                    if (response?.data?.success === false) {
                        alert(
                            response?.data?.message ||
                            "Unable to add money."
                        );
                        return;
                    }

                    if (response?.success === false) {
                        alert(
                            response?.message ||
                            "Unable to add money."
                        );
                        return;
                    }

                    alert(
                        response?.data?.message ||
                        response?.message ||
                        "Money added successfully!"
                    );

                    // Refresh wallet balance
                    await fetchWalletBalance();

                    setCustomAmount("");
                    setSelectedAmount(500);

                } catch (error) {
                    console.error(
                        "Add Money API Error:",
                        error
                    );

                    alert(
                        error?.response?.data?.message ||
                        "Payment succeeded but wallet update failed."
                    );
                }
            },

            modal: {
                ondismiss: function () {
                    console.log(
                        "Razorpay checkout closed"
                    );
                },
            },
        };

        // Check Razorpay script
        if (!window.Razorpay) {
            alert(
                "Razorpay SDK is not loaded. Add Razorpay script to index.html."
            );
            return;
        }

        const razorpay = new window.Razorpay(options);

        razorpay.on("payment.failed", function (response) {
            console.error(
                "Razorpay Payment Failed:",
                response.error
            );

            alert(
                response?.error?.description ||
                "Payment failed."
            );
        });

        razorpay.open();

    } catch (error) {
        console.error("Recharge Error:", error);

        alert(
            error?.message ||
            "Something went wrong."
        );
    } finally {
        setRechargeLoading(false);
    }
};


// const handleRecharge = async () => {
//     try {
//         const amount = customAmount
//             ? Number(customAmount)
//             : Number(selectedAmount);

//         if (!amount || amount < 10) {
//             alert("Please enter a valid amount.");
//             return;
//         }

//         setRechargeLoading(true);

//         const payload = {
//             amount: amount,
//         };

//         console.log("SENDING:", payload);

//         const response = await addMoneyToWallet(payload);

//         console.log("API RESPONSE:", response);

//         alert("API called successfully");

//     } catch (error) {
//         console.error("ADD MONEY ERROR:", error);

//         console.error(
//             "STATUS:",
//             error?.response?.status
//         );

//         console.error(
//             "DATA:",
//             error?.response?.data
//         );

//         alert(
//             error?.response?.data?.message ||
//             error?.message ||
//             "Add money failed"
//         );

//     } finally {
//         setRechargeLoading(false);
//     }
// };

    return (
        <div className="min-h-screen bg-gray-50 px-4 py-6 md:px-8">
            <div className="mx-auto max-w-5xl">

                {/* Header */}
                <div className="mb-6 flex items-center gap-3">
                    <button
                        onClick={onBack}
                        className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-gray-700 shadow-sm transition hover:bg-gray-100"
                    >
                        <ArrowLeft size={20} />
                    </button>

                    <div>
                        <h1 className="text-xl font-bold text-gray-900">
                            My Wallet
                        </h1>

                        <p className="text-sm text-gray-500">
                            Manage your balance and transactions
                        </p>
                    </div>
                </div>

                {/* Wallet Balance */}
                <div className="mb-6 overflow-hidden rounded-2xl bg-purple-700 p-6 text-white shadow-lg">
                    <div className="flex items-start justify-between">
                        <div>
                            <div className="mb-2 flex items-center gap-2 text-purple-200">
                                <Wallet size={18} />

                                <span className="text-sm font-medium">
                                    Available Balance
                                </span>
                            </div>

                            <h2 className="text-3xl font-bold">
                                {loadingBalance
                                    ? "Loading..."
                                    : `₹${Number(balance).toLocaleString("en-IN")}`}
                            </h2>

                            <p className="mt-2 text-xs text-purple-200">
                                Use your wallet balance for consultations
                            </p>
                        </div>

                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/15">
                            <Wallet size={24} />
                        </div>
                    </div>

                    <div className="mt-6 flex items-center justify-between border-t border-white/15 pt-4">
                        <span className="text-xs text-purple-200">
                            Secure wallet
                        </span>

                        <div className="flex items-center gap-1.5 text-xs font-medium">
                            <ShieldCheck size={14} />
                            100% Secure
                        </div>
                    </div>
                </div>

                {/* Main Grid */}
                <div className="grid gap-6 lg:grid-cols-3">

                    {/* Add Money */}
                    <div className="rounded-2xl bg-white p-5 shadow-sm lg:col-span-2">

                        <div className="mb-5">
                            <h2 className="text-base font-semibold text-gray-900">
                                Add Money
                            </h2>

                            <p className="mt-1 text-xs text-gray-500">
                                Choose an amount to add to your wallet
                            </p>
                        </div>

                        {/* Amount Options */}
                        <div className="grid grid-cols-3 gap-3 sm:grid-cols-6">
                            {RECHARGE_OPTIONS.map((amount) => {
                                const isSelected =
                                    selectedAmount === amount &&
                                    !customAmount;

                                return (
                                    <button
                                        key={amount}
                                        onClick={() => {
                                            setSelectedAmount(amount);
                                            setCustomAmount("");
                                        }}
                                        className={`rounded-xl border py-3 text-sm font-semibold transition ${isSelected
                                                ? "border-purple-700 bg-purple-700 text-white"
                                                : "border-gray-200 bg-white text-gray-700 hover:border-purple-300"
                                            }`}
                                    >
                                        ₹{amount}
                                    </button>
                                );
                            })}
                        </div>

                        {/* Custom Amount */}
                        <div className="mt-5">
                            <label className="mb-2 block text-xs font-medium text-gray-600">
                                Enter custom amount
                            </label>

                            <div className="relative">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-semibold text-gray-500">
                                    ₹
                                </span>

                                <input
                                    type="number"
                                    value={customAmount}
                                    onChange={(e) => {
                                        setCustomAmount(e.target.value);
                                        setSelectedAmount(null);
                                    }}
                                    placeholder="Enter amount"
                                    className="w-full rounded-xl border border-gray-200 py-3 pl-8 pr-4 text-sm outline-none transition focus:border-purple-500 focus:ring-2 focus:ring-purple-100"
                                />
                            </div>
                        </div>

                        {/* Add Money Button */}
                        <button
                            onClick={handleRecharge}
                            disabled={rechargeLoading}
                            className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-purple-700 py-3.5 text-sm font-semibold text-white transition hover:bg-purple-800 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {rechargeLoading ? (
                                "Processing..."
                            ) : (
                                <>
                                    <Plus size={18} />
                                    Add Money
                                </>
                            )}
                        </button>

                        {/* Payment Methods */}
                        <div className="mt-5 flex items-center justify-center gap-5 border-t border-gray-100 pt-4">
                            <div className="flex items-center gap-1.5 text-xs text-gray-500">
                                <CreditCard size={14} />
                                Cards
                            </div>

                            <div className="flex items-center gap-1.5 text-xs text-gray-500">
                                <Smartphone size={14} />
                                UPI
                            </div>

                            <div className="flex items-center gap-1.5 text-xs text-gray-500">
                                <ShieldCheck size={14} />
                                Secure Payment
                            </div>
                        </div>
                    </div>

                    {/* Wallet Benefits */}
                    <div className="rounded-2xl bg-white p-5 shadow-sm">
                        <h2 className="text-base font-semibold text-gray-900">
                            Wallet Benefits
                        </h2>

                        <div className="mt-5 space-y-5">

                            <div className="flex gap-3">
                                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-purple-100 text-purple-700">
                                    <Wallet size={17} />
                                </div>

                                <div>
                                    <p className="text-sm font-medium text-gray-900">
                                        Instant Payment
                                    </p>

                                    <p className="mt-1 text-xs leading-5 text-gray-500">
                                        Pay instantly for astrology consultations.
                                    </p>
                                </div>
                            </div>

                            <div className="flex gap-3">
                                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-purple-100 text-purple-700">
                                    <ShieldCheck size={17} />
                                </div>

                                <div>
                                    <p className="text-sm font-medium text-gray-900">
                                        Secure Transactions
                                    </p>

                                    <p className="mt-1 text-xs leading-5 text-gray-500">
                                        Your wallet transactions are protected.
                                    </p>
                                </div>
                            </div>

                            <div className="flex gap-3">
                                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-purple-100 text-purple-700">
                                    <Plus size={17} />
                                </div>

                                <div>
                                    <p className="text-sm font-medium text-gray-900">
                                        Easy Recharge
                                    </p>

                                    <p className="mt-1 text-xs leading-5 text-gray-500">
                                        Add money anytime using UPI or cards.
                                    </p>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>

                {/* Transactions */}
                <div className="mt-6 rounded-2xl bg-white p-5 shadow-sm">

                    <div className="mb-5 flex items-center justify-between">
                        <div>
                            <h2 className="text-base font-semibold text-gray-900">
                                Recent Transactions
                            </h2>

                            <p className="mt-1 text-xs text-gray-500">
                                Your recent wallet activity
                            </p>
                        </div>

                        <button className="flex items-center gap-1 text-xs font-medium text-purple-700">
                            View All
                            <ChevronRight size={14} />
                        </button>
                    </div>

                    <div className="rounded-xl border border-dashed border-gray-200 py-10 text-center">
                        <Wallet
                            size={28}
                            className="mx-auto text-gray-300"
                        />

                        <p className="mt-3 text-sm font-medium text-gray-600">
                            No recent transactions
                        </p>

                        <p className="mt-1 text-xs text-gray-400">
                            Your wallet transactions will appear here.
                        </p>
                    </div>

                </div>

            </div>
        </div>
    );
}