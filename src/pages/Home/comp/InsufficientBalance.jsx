import React, { useState } from "react";
import {
    ArrowLeft,
    Wallet,
    CreditCard,
    AlertTriangle,
    ArrowRight,
    Sparkles,
    Wallet2,
    Wallet2Icon,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import BookingConfirmedPopup from "./BookingConfirmedPopup";

const RECHARGE_OPTIONS = [500, 1000, 2000];

export default function InsufficientBalancePopup({
    currentBalance = 100,
    requiredAmount = 125,
    onClose = () => { },
    onProceed = () => { },
}) {
    const [selectedAmount, setSelectedAmount] = useState(1000);
    const [customAmount, setCustomAmount] = useState("");
    const [showSuccess, setShowSuccess] = useState(false);
    const navigate = useNavigate()

    const handleProceed = () => {
        const amount = customAmount
            ? Number(customAmount)
            : selectedAmount;
        onProceed(amount);
       setShowSuccess(true)
    };

    return (
        <div className="fixed  inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="w-full max-w-[680px] h-[600px] overflow-scroll hide  rounded-[32px] bg-white shadow-[0_30px_80px_rgba(0,0,0,0.18)]">
                {/* Header */}
                <div className="w-full max-w-[680px] overflow-hidden rounded-[32px] bg-white shadow-[0_30px_80px_rgba(0,0,0,0.18)]">
                    <button
                        onClick={onClose}
                        className="absolute left-5 top-5 flex h-10 w-10 items-center justify-center rounded-full bg-white/15 text-white backdrop-blur hover:bg-white/20"
                    >
                        <ArrowLeft size={20} />
                    </button>

                    <div className="flex justify-center">
                        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-white shadow-lg">
                            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-red-100">
                                <Wallet2Icon
                                    size={30}
                                    className="text-red-500"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="my-5 text-center">
                        <h2 className="text-3xl font-bold text-purple-900">
                            Insufficient Balance
                        </h2>

                        <p className="mt-2 text-sm text-purple-900">
                            Your cosmic journey is just a recharge away,<br />
                            To start a 5 minutes consultation with Acharya Sharma,<br />
                            you need a minimum balance of  ₹125
                        </p>
                    </div>
                </div>

                {/* Body */}
                <div className="-mt-8 rounded-t-[32px] bg-white px-6 pb-6 pt-6">

                    {/* Balance Card */}
                    <div className="rounded-2xl border border-purple-100 bg-gradient-to-r from-purple-50 to-pink-50 p-5">

                        <div className="flex items-center justify-between">

                            <div className="flex items-center gap-3">
                                <div className="rounded-xl bg-purple-100 p-3">
                                    <Wallet className="text-purple-700" size={22} />
                                </div>

                                <div>
                                    <p className="text-xs uppercase tracking-wide text-gray-500">
                                        Current Balance
                                    </p>

                                    <h3 className="text-2xl font-bold text-gray-900">
                                        ₹{currentBalance}
                                    </h3>
                                </div>
                            </div>

                            <div className="rounded-full bg-red-100 px-3 py-1 text-xs font-semibold text-red-600">
                                Need ₹{requiredAmount}
                            </div>

                        </div>
                    </div>

                    {/* Recharge */}
                    <div className="mt-7">

                        <div className="mb-3 flex items-center gap-2">
                            <Sparkles
                                size={16}
                                className="text-purple-600"
                            />
                            <h3 className="font-semibold text-gray-900">
                                Recharge Wallet
                            </h3>
                        </div>

                        <div className="grid grid-cols-3 gap-3">

                            {RECHARGE_OPTIONS.map((amount) => {
                                const active =
                                    selectedAmount === amount &&
                                    customAmount === "";

                                return (
                                    <button
                                        key={amount}
                                        onClick={() => {
                                            setSelectedAmount(amount);
                                            setCustomAmount("");
                                        }}
                                        className={`rounded-2xl border py-4 transition-all duration-300 ${active
                                            ? "border-purple-700 bg-gradient-to-r from-violet-700 to-fuchsia-700 shadow-lg scale-105 text-white"
                                            : "border-gray-200 bg-white text-gray-800 hover:border-purple-400 hover:shadow-md"
                                            }`}
                                    >
                                        <p className={active ? "text-xl font-bold text-white" : "text-xl font-bold text-gray-800"}>
                                            ₹{amount}
                                        </p>
                                    </button>
                                );
                            })}
                        </div>

                    </div>

                    {/* Custom Amount */}

                    <div className="mt-6">

                        <label className="mb-2 block text-sm font-semibold text-gray-700">
                            Enter Custom Amount
                        </label>

                        <div className="relative">

                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg font-semibold text-gray-500">
                                ₹
                            </span>

                            <input
                                type="number"
                                placeholder="Enter amount"
                                value={customAmount}
                                onChange={(e) =>
                                    setCustomAmount(e.target.value)
                                }
                                className="w-full rounded-2xl border border-gray-200 py-4 pl-10 pr-4 text-base outline-none transition-all focus:border-purple-600 focus:ring-4 focus:ring-purple-100"
                            />

                        </div>

                    </div>

                    {/* Info */}

                    <div className="mt-6 rounded-xl bg-amber-50 border border-amber-100 p-4">
                        <p className="text-sm text-amber-700">
                            Recharge your wallet to continue your consultation
                            instantly. Any unused balance will remain safely in
                            your wallet.
                        </p>
                    </div>

                    {/* Button */}

                    <button
                        onClick={handleProceed}
                        className="mt-7 flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-violet-700 via-purple-700 to-fuchsia-700 py-4 text-sm font-semibold text-white shadow-lg transition-all hover:scale-[1.02]"
                    >
                        <CreditCard size={18} />
                        Add money & start consultation

                    </button>

                </div>
            </div>
            
        </div>
    );
}