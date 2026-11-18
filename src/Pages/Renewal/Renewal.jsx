import { useState } from "react";
import axios from "axios";

const API_URL = "https://da-server-ltll.onrender.com";

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
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

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
                    "Unable to complete membership renewal."
                );
            }

            if (response.data.cardUrl) {
                window.location.assign(response.data.cardUrl);
                return;
            }

            setError(
                "Your renewal was completed, but the updated membership card link was not returned. Please contact support."
            );

            console.error("Renewal Response:", response.data);

        } catch (err) {
            console.error("Renewal Error:", err);

            setError(
                err.response?.data?.message ||
                err.message ||
                "Unable to complete membership renewal."
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

                {!verificationToken && (
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

                {!verificationToken && success && (
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

                {verificationToken && (
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
                                ? "PROCESSING RENEWAL..."
                                : "RENEW MEMBERSHIP"}
                        </button>
                    </form>
                )}

                <p className="text-center text-gray-500 text-xs mt-8">
                    DA WEB SOCIAL CLUB © {new Date().getFullYear()}
                </p>

            </div>
        </div>
    );
};

export default Renewal;