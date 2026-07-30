import { CreditCard, Plus, Smartphone, ArrowDownLeft,
  ArrowUpRight,
  RefreshCcw,
  Gift, } from "lucide-react";



const WalletPage = () => {
    return (
        <div className="px-4">
            <div className="w-full max-w-6xl mx-auto rounded-2xl bg-gradient-to-r from-purple-700 via-purple-500 to-purple-700 p-8 shadow-lg">
                <h2 className="text-lg text-white/80">Current Balance</h2>
                <h1 className="mt-2 text-4xl font-bold text-white">₹0.00</h1>
            </div>
            <div className="mx-auto mt-16 max-w-5xl rounded-3xl border border-purple-100 bg-white p-10 shadow-xl">
                <h2 className="text-center text-4xl font-bold text-purple-700">
                    Top Up Wallet
                </h2>

                <p className="mt-2 text-center text-gray-500">
                    Choose a recharge amount or enter a custom amount.
                </p>

                {/* Quick Amounts */}
                <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-3">
                    <button className="rounded-2xl border-2 border-purple-300 py-5 text-2xl font-bold text-purple-700 transition-all duration-300 hover:-translate-y-1 hover:border-purple-700 hover:bg-purple-700 hover:text-white hover:shadow-lg">
                        + ₹100
                    </button>

                    <button className="rounded-2xl border-2 border-purple-300 bg-purple-700 py-5 text-2xl font-bold text-white shadow-lg transition-all duration-300 hover:-translate-y-1">
                        + ₹500
                    </button>

                    <button className="rounded-2xl border-2 border-purple-300 py-5 text-2xl font-bold text-purple-700 transition-all duration-300 hover:-translate-y-1 hover:border-purple-700 hover:bg-purple-700 hover:text-white hover:shadow-lg">
                        + ₹1000
                    </button>
                </div>

                {/* Custom Amount */}
                <div className="mx-auto mt-12 max-w-md">
                    <label className="mb-3 block text-lg font-semibold text-gray-700">
                        Enter Custom Amount
                    </label>

                    <div className="flex items-center rounded-xl border-2 border-purple-200 px-4 py-3 focus-within:border-purple-700">
                        <span className="mr-2 text-2xl font-bold text-purple-700">₹</span>

                        <input
                            type="number"
                            placeholder="Enter Amount"
                            className="w-full bg-transparent text-lg outline-none placeholder:text-gray-400"
                        />
                    </div>

                    <button className="mt-8 w-full rounded-xl bg-gradient-to-r from-purple-700 to-purple-500 py-4 text-lg font-semibold text-white shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
                        Add To Wallet
                    </button>
                </div>
            </div>


            <div className="mx-auto mt-12 max-w-5xl rounded-3xl border border-purple-100 bg-white p-8 shadow-xl">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-3xl font-bold text-purple-700">
                            Saved Payment Methods
                        </h2>
                        <p className="mt-1 text-gray-500">
                            Choose a saved payment method or add a new one.
                        </p>
                    </div>

                    <button className="flex items-center gap-2 rounded-xl bg-purple-700 px-5 py-3 font-semibold text-white transition hover:bg-purple-800">
                        <Plus size={18} />
                        Add New
                    </button>
                </div>

                {/* Payment Methods */}
                <div className="mt-8 space-y-4">
                    {/* Card */}
                    <div className="flex cursor-pointer items-center justify-between rounded-2xl border-2 border-purple-200 p-5 transition hover:border-purple-600 hover:bg-purple-50">
                        <div className="flex items-center gap-4">
                            <div className="rounded-xl bg-purple-100 p-3 text-purple-700">
                                <CreditCard size={24} />
                            </div>

                            <div>
                                <h3 className="font-semibold text-gray-800">
                                    Visa Debit Card
                                </h3>
                                <p className="text-sm text-gray-500">
                                    **** **** **** 4589
                                </p>
                            </div>
                        </div>

                        <span className="rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-700">
                            Default
                        </span>
                    </div>

                    {/* UPI */}
                    <div className="flex cursor-pointer items-center justify-between rounded-2xl border-2 border-gray-200 p-5 transition hover:border-purple-600 hover:bg-purple-50">
                        <div className="flex items-center gap-4">
                            <div className="rounded-xl bg-purple-100 p-3 text-purple-700">
                                <Smartphone size={24} />
                            </div>

                            <div>
                                <h3 className="font-semibold text-gray-800">
                                    UPI
                                </h3>
                                <p className="text-sm text-gray-500">
                                    aditya@okaxis
                                </p>
                            </div>
                        </div>

                        <button className="text-sm font-semibold text-purple-700 hover:underline">
                            Use
                        </button>
                    </div>
                </div>
            </div>
            <div className="mx-auto mt-12 max-w-5xl rounded-3xl border border-purple-100 bg-white p-8 shadow-xl">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-3xl font-bold text-purple-700">
                            Recent Activity
                        </h2>
                        <p className="mt-1 text-gray-500">
                            Your latest wallet transactions.
                        </p>
                    </div>

                    <button className="text-sm font-semibold text-purple-700 hover:underline">
                        View All
                    </button>
                </div>

                {/* Transactions */}
                <div className="mt-8 space-y-4">

                    {/* Wallet Recharge */}
                    <div className="flex items-center justify-between rounded-2xl border border-gray-200 p-5 transition hover:border-purple-400 hover:bg-purple-50">
                        <div className="flex items-center gap-4">
                            <div className="rounded-full bg-green-100 p-3 text-green-600">
                                <ArrowDownLeft size={22} />
                            </div>

                            <div>
                                <h3 className="font-semibold text-gray-800">
                                    Wallet Recharge
                                </h3>
                                <p className="text-sm text-gray-500">
                                    Added via UPI • Today, 10:45 AM
                                </p>
                            </div>
                        </div>

                        <span className="font-bold text-green-600">
                            + ₹500
                        </span>
                    </div>

                    {/* Astrologer Payment */}
                    <div className="flex items-center justify-between rounded-2xl border border-gray-200 p-5 transition hover:border-purple-400 hover:bg-purple-50">
                        <div className="flex items-center gap-4">
                            <div className="rounded-full bg-red-100 p-3 text-red-500">
                                <ArrowUpRight size={22} />
                            </div>

                            <div>
                                <h3 className="font-semibold text-gray-800">
                                    Payment to Astrologer
                                </h3>
                                <p className="text-sm text-gray-500">
                                    Dr. Narhari • Voice Consultation
                                </p>
                            </div>
                        </div>

                        <span className="font-bold text-red-500">
                            - ₹299
                        </span>
                    </div>

                    {/* Refund */}
                    <div className="flex items-center justify-between rounded-2xl border border-gray-200 p-5 transition hover:border-purple-400 hover:bg-purple-50">
                        <div className="flex items-center gap-4">
                            <div className="rounded-full bg-blue-100 p-3 text-blue-600">
                                <RefreshCcw size={22} />
                            </div>

                            <div>
                                <h3 className="font-semibold text-gray-800">
                                    Consultation Refund
                                </h3>
                                <p className="text-sm text-gray-500">
                                    Session Cancelled • Yesterday
                                </p>
                            </div>
                        </div>

                        <span className="font-bold text-blue-600">
                            + ₹299
                        </span>
                    </div>

                    {/* Cashback */}
                    <div className="flex items-center justify-between rounded-2xl border border-gray-200 p-5 transition hover:border-purple-400 hover:bg-purple-50">
                        <div className="flex items-center gap-4">
                            <div className="rounded-full bg-yellow-100 p-3 text-yellow-600">
                                <Gift size={22} />
                            </div>

                            <div>
                                <h3 className="font-semibold text-gray-800">
                                    Cashback Reward
                                </h3>
                                <p className="text-sm text-gray-500">
                                    Wallet Recharge Offer
                                </p>
                            </div>
                        </div>

                        <span className="font-bold text-green-600">
                            + ₹50
                        </span>
                    </div>

                </div>
            </div>
        </div>
    )
}


export default WalletPage;