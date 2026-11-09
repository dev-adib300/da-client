
import { useEffect, useState } from "react";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import axios from "axios";

const PaymentSuccess = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    const sessionId = searchParams.get("session_id");

    const [message, setMessage] = useState(
        "Verifying your payment..."
    );

    const [error, setError] = useState("");

    useEffect(() => {
        if (!sessionId) {
            setError("Payment reference is missing.");
            return;
        }

        let isMounted = true;
        let timer;
        let attempts = 0;

        const confirmPayment = async () => {
            try {
                const response = await axios.get(
                    `https://da-server-ltll.onrender.com/api/payments/confirmation/${encodeURIComponent(sessionId)}`
                );

                if (!isMounted) return;

                if (
                    response.data.success &&
                    response.data.status === "completed" &&
                    response.data.cardUrl
                ) {
                    setMessage("Your membership is ready. Redirecting...");

                    // Navigate to the customer's membership card.
                    window.location.replace(response.data.cardUrl);
                    return;
                }

                if (response.data.status === "processing") {
                    attempts += 1;

                    if (attempts >= 40) {
                        setError(
                            "Your payment was received, but membership activation is taking longer than expected. Please check your email for your membership card."
                        );
                        return;
                    }

                    setMessage(
                        "Payment successful! Preparing your membership card..."
                    );

                    timer = setTimeout(confirmPayment, 3000);
                    return;
                }

                setError(
                    response.data.message ||
                    "Unable to confirm your membership."
                );

            } catch (err) {
                if (!isMounted) return;

                attempts += 1;

                if (attempts >= 40) {
                    setError(
                        "We could not confirm your membership yet. Please check your email or contact support."
                    );
                    return;
                }

                setMessage(
                    "Confirming your payment and preparing your card..."
                );

                timer = setTimeout(confirmPayment, 3000);
            }
        };

        confirmPayment();

        return () => {
            isMounted = false;
            clearTimeout(timer);
        };
    }, [sessionId]);

    return (
        <section className="min-h-screen bg-[#080808] flex items-center justify-center px-4 py-12">

            <div className="w-full max-w-lg bg-[#111] border border-[#C7A05B]/30 rounded-2xl p-8 sm:p-10 text-center shadow-[0_0_35px_rgba(199,160,91,0.08)]">

                {!error ? (
                    <>
                        <div className="w-20 h-20 mx-auto mb-6 rounded-full border-2 border-[#C7A05B] flex items-center justify-center">

                            <svg
                                className="w-10 h-10 text-[#C7A05B] animate-pulse"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M5 13l4 4L19 7"
                                />
                            </svg>

                        </div>

                        <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                            Payment Successful!
                        </h1>

                        <p className="text-white leading-7 mb-6">
                            {message}
                        </p>

                        <div className="w-8 h-8 border-2 border-[#C7A05B] border-t-transparent rounded-full animate-spin mx-auto" />
                    </>
                ) : (
                    <>
                        <div className="w-20 h-20 mx-auto mb-6 rounded-full border-2 border-[#C7A05B] flex items-center justify-center">

                            <svg
                                className="w-10 h-10 text-[#C7A05B]"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                />
                            </svg>

                        </div>

                        <h1 className="text-3xl font-bold text-white mb-4">
                            Payment Received
                        </h1>

                        <p className="text-white leading-7 mb-6">
                            {error}
                        </p>

                        <Link
                            to="/"
                            className="inline-block w-full py-3 rounded-lg font-bold text-black bg-[linear-gradient(90deg,#BF953F_0%,#FCF6BA_25%,#B38728_50%,#FBF5B7_75%,#AA771C_100%)] hover:brightness-110 transition"
                        >
                            Back to Home
                        </Link>
                    </>
                )}

            </div>

        </section>
    );
};

export default PaymentSuccess;
