import React, { useEffect, useState } from "react";
import { CheckCircle, XCircle, ArrowRight } from "lucide-react";

const PaymentResultPopup = ({
    type = "success",
    message,
    paymentId,
    onClose,
    onRedirect,
    countdownStart = 10,
}) => {
    const [countdown, setCountdown] = useState(countdownStart);

    useEffect(() => {
        const timer = setInterval(() => {
            setCountdown((prev) => {
                if (prev <= 1) {
                    clearInterval(timer);

                    if (onRedirect) {
                        onRedirect();
                    }

                    return 0;
                }

                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [onRedirect, countdownStart]);

    const isSuccess = type === "success";

    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 px-4 backdrop-blur-sm">
            <div className="w-full max-w-md animate-[slideUp_0.3s_ease-out] rounded-3xl bg-white p-8 text-center shadow-2xl">

                {/* Icon */}
                <div className="mb-5 flex justify-center">
                    {isSuccess ? (
                        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
                            <CheckCircle
                                size={52}
                                className="text-green-600"
                            />
                        </div>
                    ) : (
                        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-red-100">
                            <XCircle
                                size={52}
                                className="text-red-600"
                            />
                        </div>
                    )}
                </div>

                {/* Title */}
                <h2
                    className={`text-2xl font-bold ${
                        isSuccess
                            ? "text-green-700"
                            : "text-red-700"
                    }`}
                >
                    {isSuccess
                        ? "Payment Successful!"
                        : "Payment Failed"}
                </h2>

                {/* Message */}
                <p className="mt-3 text-gray-600">
                    {message ||
                        (isSuccess
                            ? "Your payment has been successfully processed and your order has been placed."
                            : "We couldn't process your payment. Please try again.")}
                </p>

                {/* Payment ID */}
                {isSuccess && paymentId && (
                    <div className="mt-5 rounded-xl bg-gray-50 p-3">
                        <p className="text-xs text-gray-500">
                            Payment ID
                        </p>

                        <p className="mt-1 break-all text-sm font-semibold text-gray-700">
                            {paymentId}
                        </p>
                    </div>
                )}

                {/* Countdown */}
                <div className="mt-6">
                    <p className="text-sm text-gray-500">
                        Redirecting to My Orders in
                    </p>

                    <div className="mt-2 text-3xl font-bold text-purple-700">
                        {countdown}s
                    </div>
                </div>

                {/* Manual redirect */}
                <button
                    onClick={onRedirect}
                    className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-purple-600 py-3 font-semibold text-white transition hover:bg-purple-700"
                >
                    Go To My Orders
                    <ArrowRight size={18} />
                </button>

                {/* Close */}
                {onClose && (
                    <button
                        onClick={onClose}
                        className="mt-3 text-sm text-gray-400 hover:text-gray-600"
                    >
                        Close
                    </button>
                )}
            </div>
        </div>
    );
};

export default PaymentResultPopup;