
import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import axios from "axios";

const API_URL = "http://https://da-server-ltll.onrender.com";

const Payment = () => {
    const [searchParams] = useSearchParams();
    const purchaseId = searchParams.get("purchaseId");

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handlePayment = async () => {
        if (!purchaseId) {
            setError("Purchase ID is missing.");
            return;
        }

        try {
            setLoading(true);
            setError("");

            const response = await axios.post(
                `${API_URL}/api/payments/create-checkout-session`,
                { purchaseId }
            );

            // Backend returns checkoutUrl
            const checkoutUrl =
                response.data.checkoutUrl || response.data.url;

            if (response.data.success && checkoutUrl) {
                window.location.href = checkoutUrl;
                return;
            }

            setError(
                response.data.message ||
                "Unable to create checkout session."
            );

        } catch (err) {
            console.error("Payment Error:", err);

            setError(
                err.response?.data?.message ||
                "Payment initialization failed. Please try again."
            );

        } finally {
            setLoading(false);
        }
    };

    return (
        <section className="min-h-screen bg-black text-white flex items-center justify-center px-4 py-16">

            <div className="w-full max-w-lg bg-[#111] border border-[#D4AF37]/30 rounded-2xl p-8 sm:p-10 text-center">

                <p className="text-[#D4AF37] text-xs tracking-[4px] uppercase mb-4">
                    DA WEB SOCIAL CLUB
                </p>

                <h1 className="text-3xl font-bold mb-3">
                    Complete Your Payment
                </h1>

                <p className="text-gray-400 text-sm mb-8">
                    Continue to our secure Stripe checkout page to complete your membership purchase.
                </p>

                {error && (
                    <div className="bg-red-500/10 border border-red-500/30 text-red-400 rounded-lg p-4 text-sm mb-6">
                        {error}
                    </div>
                )}

                <button
                    onClick={handlePayment}
                    disabled={loading || !purchaseId}
                    className="w-full bg-[#D4AF37] hover:bg-[#f0cc62] text-black font-bold py-4 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {loading
                        ? "Connecting to Stripe..."
                        : "Continue to Secure Payment"}
                </button>

                <p className="text-gray-500 text-xs mt-6">
                    Secure payment processing powered by Stripe.
                </p>

            </div>
        </section>
    );
};

export default Payment;
