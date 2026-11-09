
import { useState } from "react";
import axios from "axios";

const API_URL = "http://https://da-server-ltll.onrender.com";

const plans = [
    { value: "basic", name: "Basic", price: "$15", duration: "1 Month" },
    { value: "premium", name: "Premium", price: "$30", duration: "3 Months" },
    { value: "vip", name: "VIP", price: "$60", duration: "6 Months" }
];

const Renewal = () => {
    const [email, setEmail] = useState("");
    const [otp, setOtp] = useState("");
    const [selectedPlan, setSelectedPlan] = useState("basic");

    const [verificationToken, setVerificationToken] = useState("");
    const [purchase, setPurchase] = useState(null);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    // Create or retry Stripe Checkout
    const handleCheckout = async (purchaseId) => {
        try {
            setLoading(true);
            setError("");
            setSuccess("Preparing your secure payment...");

            const response = await axios.post(
                `${API_URL}/api/payments/create-checkout-session`,
                { purchaseId }
            );

            if (
                response.data.success &&
                response.data.checkoutUrl
            ) {
                window.location.assign(response.data.checkoutUrl);
                return;
            }

            throw new Error("Unable to create Stripe checkout session.");

        } catch (err) {
            setSuccess("");

            setError(
                err.response?.data?.message ||
                err.message ||
                "Unable to start payment. Please try again."
            );
        } finally {
            setLoading(false);
        }
    };

    const handleSendOTP = async (e) => {
        e.preventDefault();

        try {
            setLoading(true);
            setError("");
            setSuccess("");

            const response = await axios.post(
                `${API_URL}/api/members/send-otp`,
                { email }
            );

            setSuccess(response.data.message);

        } catch (err) {
            setError(
                err.response?.data?.message ||
                "Unable to send OTP. Please try again."
            );
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyOTP = async (e) => {
        e.preventDefault();

        try {
            setLoading(true);
            setError("");
            setSuccess("");

            const response = await axios.post(
                `${API_URL}/api/members/verify-otp`,
                { email, otp }
            );

            if (response.data.success) {
                setVerificationToken(response.data.verificationToken);
                setSuccess(
                    "Email verified successfully! Select your renewal plan."
                );
            }

        } catch (err) {
            setError(
                err.response?.data?.message ||
                "OTP verification failed. Please try again."
            );
        } finally {
            setLoading(false);
        }
    };

    const handleRenewal = async (e) => {
        e.preventDefault();

        try {
            setLoading(true);
            setError("");
            setSuccess("");

            const response = await axios.post(
                `${API_URL}/api/members/renewal-purchase`,
                {
                    verificationToken,
                    membership: selectedPlan
                }
            );

            if (!response.data.success) {
                throw new Error(
                    response.data.message ||
                    "Unable to create renewal purchase."
                );
            }

            // Save the purchase before attempting payment.
            // This allows the member to retry if Stripe fails.
            setPurchase(response.data);
            setVerificationToken("");

            // Immediately redirect to Stripe Checkout.
            await handleCheckout(response.data.purchaseId);

        } catch (err) {
            setError(
                err.response?.data?.message ||
                err.message ||
                "Unable to create renewal purchase."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-black text-white flex items-center justify-center px-4 py-16">

            <div className="w-full max-w-xl bg-[#111] border border-[#d4af37]/30 rounded-2xl p-6 sm:p-10 shadow-2xl">

                <div className="text-center mb-8">
                    <h1 className="text-3xl sm:text-4xl font-bold tracking-wide">
                        MEMBERSHIP{" "}
                        <span className="text-[#d4af37]">
                            RENEWAL
                        </span>
                    </h1>

                    <p className="text-gray-300 mt-3">
                        Welcome back to DA WEB SOCIAL CLUB.
                        Verify your email to renew your membership.
                    </p>
                </div>

                {error && (
                    <div className="bg-red-950/40 border border-red-500 text-red-300 p-3 rounded-lg mb-5 text-sm">
                        {error}
                    </div>
                )}

                {success && (
                    <div className="bg-green-950/40 border border-green-600 text-green-300 p-3 rounded-lg mb-5 text-sm">
                        {success}
                    </div>
                )}

                {!purchase && !verificationToken && (
                    <form
                        onSubmit={handleSendOTP}
                        className="space-y-5"
                    >
                        <div>
                            <label className="block text-sm mb-2 text-white">
                                Registered Email Address
                            </label>

                            <input
                                type="email"
                                value={email}
                                onChange={(e) => {
                                    setEmail(e.target.value);
                                    setError("");
                                    setSuccess("");
                                }}
                                placeholder="Enter your registered email"
                                required
                                className="w-full bg-black border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-[#d4af37]"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-[#d4af37] text-black font-bold py-3 rounded-lg hover:bg-[#f0cf64] transition disabled:opacity-50"
                        >
                            {loading ? "SENDING..." : "SEND VERIFICATION CODE"}
                        </button>
                    </form>
                )}

                {!purchase && !verificationToken && success && (
                    <form
                        onSubmit={handleVerifyOTP}
                        className="space-y-5 mt-6"
                    >
                        <div>
                            <label className="block text-sm mb-2">
                                Six-Digit Verification Code
                            </label>

                            <input
                                type="text"
                                inputMode="numeric"
                                maxLength={6}
                                value={otp}
                                onChange={(e) => {
                                    setOtp(
                                        e.target.value.replace(/\D/g, "")
                                    );
                                    setError("");
                                }}
                                placeholder="Enter OTP"
                                required
                                className="w-full bg-black border border-gray-700 rounded-lg px-4 py-3 text-white text-center tracking-[0.5em] text-xl focus:outline-none focus:border-[#d4af37]"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading || otp.length !== 6}
                            className="w-full bg-[#d4af37] text-black font-bold py-3 rounded-lg hover:bg-[#f0cf64] transition disabled:opacity-50"
                        >
                            {loading ? "VERIFYING..." : "VERIFY EMAIL"}
                        </button>
                    </form>
                )}

                {!purchase && verificationToken && (
                    <form
                        onSubmit={handleRenewal}
                        className="space-y-6"
                    >
                        <div>
                            <h2 className="text-xl font-semibold mb-4">
                                Select Your Membership Plan
                            </h2>

                            <div className="space-y-3">
                                {plans.map((plan) => (
                                    <label
                                        key={plan.value}
                                        className={`flex items-center justify-between gap-3 p-4 rounded-lg border cursor-pointer transition ${
                                            selectedPlan === plan.value
                                                ? "border-[#d4af37] bg-[#d4af37]/10"
                                                : "border-gray-700 bg-black"
                                        }`}
                                    >
                                        <div className="flex items-center gap-3">
                                            <input
                                                type="radio"
                                                name="membership"
                                                value={plan.value}
                                                checked={
                                                    selectedPlan === plan.value
                                                }
                                                onChange={() =>
                                                    setSelectedPlan(plan.value)
                                                }
                                                className="accent-[#d4af37]"
                                            />

                                            <div>
                                                <p className="font-semibold text-white">
                                                    {plan.name}
                                                </p>

                                                <p className="text-sm text-gray-400">
                                                    {plan.duration}
                                                </p>
                                            </div>
                                        </div>

                                        <span className="text-[#d4af37] font-bold">
                                            {plan.price}
                                        </span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-[#d4af37] text-black font-bold py-3 rounded-lg hover:bg-[#f0cf64] transition disabled:opacity-50"
                        >
                            {loading
                                ? "PROCESSING..."
                                : "CONTINUE TO PAYMENT"}
                        </button>
                    </form>
                )}

                {purchase && (
                    <div className="text-center space-y-5">

                        <div className="text-[#d4af37] text-5xl">
                            ✓
                        </div>

                        <h2 className="text-2xl font-bold">
                            RENEWAL REQUEST CREATED
                        </h2>

                        <div className="bg-black border border-gray-700 rounded-lg p-5 text-left space-y-3">

                            <p>
                                <span className="text-gray-400">
                                    Member ID:
                                </span>{" "}
                                <span className="text-white font-semibold">
                                    {purchase.memberId}
                                </span>
                            </p>

                            <p>
                                <span className="text-gray-400">Plan:</span>{" "}
                                <span className="text-[#d4af37] font-semibold">
                                    {purchase.plan}
                                </span>
                            </p>

                            <p>
                                <span className="text-gray-400">Amount:</span>{" "}
                                <span className="text-white font-semibold">
                                    ${(purchase.amount / 100).toFixed(2)}
                                </span>
                            </p>

                            <p>
                                <span className="text-gray-400">Duration:</span>{" "}
                                <span className="text-white">
                                    {purchase.durationMonths} months
                                </span>
                            </p>

                            <p>
                                <span className="text-gray-400">
                                    Purchase ID:
                                </span>{" "}
                                <span className="text-white text-xs break-all">
                                    {purchase.purchaseId}
                                </span>
                            </p>

                            <p>
                                <span className="text-gray-400">Payment:</span>{" "}
                                <span className="text-yellow-400">
                                    Pending
                                </span>
                            </p>
                        </div>

                        <p className="text-gray-400 text-sm">
                            Your renewal purchase has been saved.
                            Your existing membership will only be extended
                            after successful payment confirmation.
                        </p>

                        <button
                            type="button"
                            onClick={() => handleCheckout(purchase.purchaseId)}
                            disabled={loading}
                            className="w-full bg-[#d4af37] text-black font-bold py-3 rounded-lg hover:bg-[#f0cf64] transition disabled:opacity-50"
                        >
                            {loading ? "PROCESSING..." : "PAY NOW / RETRY PAYMENT"}
                        </button>

                    </div>
                )}

                <p className="text-center text-gray-500 text-xs mt-8">
                    DA WEB SOCIAL CLUB © {new Date().getFullYear()}
                </p>

            </div>
        </div>
    );
};

export default Renewal;
