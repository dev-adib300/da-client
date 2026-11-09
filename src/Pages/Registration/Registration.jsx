
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const Registration = () => {
    const { plan } = useParams();
    const navigate = useNavigate();

    const validPlans = {
        basic: "Basic",
        premium: "Premium",
        vip: "VIP",
    };

    const selectedPlan = validPlans[plan?.toLowerCase()] || "";

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
        phone: "",
        dateOfBirth: "",
        membership: selectedPlan,
        terms: false,
    });

    useEffect(() => {
        setFormData((prev) => ({
            ...prev,
            membership: selectedPlan,
        }));
    }, [selectedPlan]);

    // Handle input changes
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));

        setError("");
    };

    // Submit registration and proceed to payment
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.terms) {
            setError("Please accept the Terms & Conditions.");
            return;
        }

        if (!formData.membership) {
            setError("Please select a membership plan.");
            return;
        }

        try {
            setLoading(true);
            setError("");

            const response = await axios.post(
                "http://localhost:5000/api/members/register",
                formData
            );

            if (response.data.success) {
                const purchaseId =
                    response.data.purchaseId ||
                    response.data.purchase?._id ||
                    response.data.purchase?.purchaseId;

                if (!purchaseId) {
                    setError(
                        "Registration was saved, but the purchase ID was not returned. Please contact support."
                    );
                    console.error("Registration Response:", response.data);
                    return;
                }

                navigate(
                    `/payment?purchaseId=${encodeURIComponent(purchaseId)}`
                );
            }
        } catch (error) {
            console.error("Registration Error:", error);

            const message =
                error.response?.data?.message ||
                "Unable to complete registration. Please try again.";

            setError(message);
        } finally {
            setLoading(false);
        }
    };

    const inputClass =
        "w-full bg-[#080808] border border-[#333] rounded-lg px-4 py-3 text-white placeholder:text-white/50 focus:outline-none focus:border-[#C7A05B] transition duration-300";

    return (
        <div className="min-h-screen bg-[#080808] flex items-center justify-center px-3 sm:px-6 py-10">

            <div className="w-full max-w-lg">

                <h2 className="text-center mb-3 text-3xl md:text-4xl font-semibold text-white">
                    Registration
                </h2>

                <p className="text-center text-white/60 text-sm mb-7">
                    Complete your information to become a DA WEB member.
                </p>

                <div className="border border-[#C7A05B]/30 rounded-2xl p-5 sm:p-8 md:p-10 shadow-[0_0_35px_rgba(199,160,91,0.08)]">

                    <form onSubmit={handleSubmit} className="space-y-5">

                        {/* Full Name */}
                        <div>
                            <label className="block text-white text-sm font-medium mb-2">
                                Full Name
                            </label>

                            <input
                                type="text"
                                name="fullName"
                                value={formData.fullName}
                                onChange={handleChange}
                                placeholder="Enter your full name"
                                autoComplete="name"
                                required
                                className={inputClass}
                            />
                        </div>

                        {/* Email */}
                        <div>
                            <label className="block text-white text-sm font-medium mb-2">
                                Email Address
                            </label>

                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="Enter your email"
                                autoComplete="email"
                                required
                                className={inputClass}
                            />
                        </div>

                        {/* Phone */}
                        <div>
                            <label className="block text-white text-sm font-medium mb-2">
                                Phone Number
                            </label>

                            <input
                                type="tel"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                placeholder="Enter your phone number"
                                autoComplete="tel"
                                required
                                className={inputClass}
                            />
                        </div>

                        {/* Date of Birth */}
                        <div>
                            <label className="block text-white text-sm font-medium mb-2">
                                Date of Birth
                            </label>

                            <input
                                type="date"
                                name="dateOfBirth"
                                value={formData.dateOfBirth}
                                onChange={handleChange}
                                autoComplete="bday"
                                max={new Date().toISOString().split("T")[0]}
                                required
                                className={`${inputClass} [color-scheme:dark]`}
                            />
                        </div>

                        {/* Membership */}
                        <div>
                            <label className="block text-white text-sm font-medium mb-2">
                                Select Membership
                            </label>

                            <select
                                name="membership"
                                value={formData.membership}
                                onChange={handleChange}
                                required
                                className={inputClass}
                            >
                                <option value="" disabled>
                                    Choose your membership
                                </option>

                                <option value="Basic">Basic - $15</option>
                                <option value="Premium">Premium - $30</option>
                                <option value="VIP">VIP - $60</option>
                            </select>
                        </div>

                        {/* Terms */}
                        <div className="flex items-start gap-3">
                            <input
                                type="checkbox"
                                name="terms"
                                checked={formData.terms}
                                onChange={handleChange}
                                className="mt-1 h-4 w-4 accent-[#C7A05B] cursor-pointer"
                                required
                            />

                            <label className="text-sm text-white/80 leading-6">
                                I agree to the{" "}
                                <a
                                    href="/terms"
                                    className="text-[#D4AF65] hover:underline"
                                >
                                    Terms & Conditions
                                </a>{" "}
                                and{" "}
                                <a
                                    href="/privacy"
                                    className="text-[#D4AF65] hover:underline"
                                >
                                    Privacy Policy
                                </a>.
                            </label>
                        </div>

                        {/* Error */}
                        {error && (
                            <p className="text-red-400 text-sm text-center">
                                {error}
                            </p>
                        )}

                        {/* Submit */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3 rounded-lg font-bold text-black bg-[linear-gradient(90deg,#BF953F_0%,#FCF6BA_25%,#B38728_50%,#FBF5B7_75%,#AA771C_100%)] hover:brightness-110 active:scale-[0.98] transition duration-300 shadow-lg shadow-[#C7A05B]/10 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? "Processing..." : "Proceed to Pay"}
                        </button>

                    </form>
                </div>

                <p className="text-center text-white/40 text-xs mt-6">
                    DA WEB SOCIAL CLUB
                </p>

            </div>
        </div>
    );
};

export default Registration;
