
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const AdminLogin = () => {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });

    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const API_URL = import.meta.env.VITE_API_URL || "http://https://da-server-ltll.onrender.com";

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setError("");
        setLoading(true);

        try {
            const response = await axios.post(
                `${API_URL}/api/admin/login`,
                formData
            );

            if (response.data.success && response.data.token) {
                sessionStorage.setItem("adminToken", response.data.token);
                sessionStorage.setItem(
                    "adminProfile",
                    JSON.stringify(response.data.admin)
                );

                navigate("/admin/members", { replace: true });
            } else {
                setError(response.data.message || "Unable to sign in.");
            }
        } catch (err) {
            setError(
                err.response?.data?.message ||
                "Invalid email or password. Please try again."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <section className="min-h-screen bg-[#080808] flex items-center justify-center px-5 py-12">

            <div className="w-full max-w-md">

                {/* Logo / Brand */}
                <div className="text-center mb-10">
                    <Link to="/" className="inline-block">
                        <img
                            src="/logo.jpeg"
                            alt="DA WEB SOCIAL CLUB"
                            className="w-20 h-20 object-cover rounded-full mx-auto mb-5"
                        />
                    </Link>

                    <h1 className="text-3xl sm:text-4xl font-serif text-white tracking-wide">
                        Admin <span className="text-[#D4AF37]">Portal</span>
                    </h1>
                </div>

                {/* Login Form */}
                <div className="bg-[#111111] border border-[#D4AF37]/30 rounded-xl p-7 sm:p-9 shadow-[0_0_40px_rgba(212,175,55,0.06)]">

                    <div className="mb-7">
                        <h2 className="text-xl text-white font-medium">
                            Welcome Back
                        </h2>

                        <p className="text-gray-500 text-sm mt-2">
                            Sign in to manage your membership platform.
                        </p>
                    </div>

                    {error && (
                        <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm px-4 py-3 rounded-lg mb-5">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">

                        {/* Email */}
                        <div>
                            <label className="block text-gray-300 text-sm mb-2">
                                Email Address
                            </label>

                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="admin@example.com"
                                autoComplete="username"
                                required
                                className="w-full bg-[#080808] border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-600 outline-none transition focus:border-[#D4AF37]"
                            />
                        </div>

                        {/* Password */}
                        <div>
                            <label className="block text-gray-300 text-sm mb-2">
                                Password
                            </label>

                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    placeholder="Enter your password"
                                    autoComplete="current-password"
                                    required
                                    className="w-full bg-[#080808] border border-gray-700 rounded-lg px-4 py-3 pr-20 text-white placeholder-gray-600 outline-none transition focus:border-[#D4AF37]"
                                />

                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-[#D4AF37] hover:text-white transition"
                                >
                                    {showPassword ? "HIDE" : "SHOW"}
                                </button>
                            </div>
                        </div>

                        {/* Submit */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-[#D4AF37] hover:bg-[#b8962e] disabled:opacity-60 disabled:cursor-not-allowed text-black font-semibold py-3 rounded-lg transition duration-300 mt-3"
                        >
                            {loading ? "Signing In..." : "SIGN IN"}
                        </button>

                    </form>

                    <div className="border-t border-gray-800 mt-7 pt-6 text-center">
                        <Link
                            to="/"
                            className="text-gray-500 hover:text-[#D4AF37] text-sm transition"
                        >
                            ← Back to Website
                        </Link>
                    </div>

                </div>

            </div>
        </section>
    );
};

export default AdminLogin;