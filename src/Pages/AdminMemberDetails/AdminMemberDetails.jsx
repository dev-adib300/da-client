
import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";

const AdminMemberDetails = () => {
    const { memberId } = useParams();
    const navigate = useNavigate();

    const API_URL = import.meta.env.VITE_API_URL || "https://da-server-ltll.onrender.com";

    const [member, setMember] = useState(null);
    const [purchases, setPurchases] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [updating, setUpdating] = useState(false);

    const goldButton =
        "bg-gradient-to-r from-[#BF953F] via-[#FCF6BA] to-[#AA771C] text-black font-bold hover:brightness-110 transition duration-300";

    const getHeaders = () => ({
        Authorization: `Bearer ${sessionStorage.getItem("adminToken")}`,
    });

    const fetchMemberDetails = useCallback(async () => {
        setLoading(true);
        setError("");

        try {
            const [memberResponse, purchaseResponse] = await Promise.all([
                axios.get(
                    `${API_URL}/api/admin/members/${encodeURIComponent(memberId)}`,
                    { headers: getHeaders() }
                ),
                axios.get(
                    `${API_URL}/api/admin/members/${encodeURIComponent(memberId)}/purchases`,
                    { headers: getHeaders() }
                ),
            ]);

            if (memberResponse.data.success) {
                setMember(memberResponse.data.member);
            }

            if (purchaseResponse.data.success) {
                setPurchases(purchaseResponse.data.purchases || []);
            }
        } catch (err) {
            if (err.response?.status === 401 || err.response?.status === 403) {
                sessionStorage.removeItem("adminToken");
                sessionStorage.removeItem("adminProfile");
                navigate("/admin/login", { replace: true });
                return;
            }

            setError(
                err.response?.data?.message ||
                "Unable to load member details."
            );
        } finally {
            setLoading(false);
        }
    }, [API_URL, memberId, navigate]);

    useEffect(() => {
        fetchMemberDetails();
    }, [fetchMemberDetails]);

    const handleStatusChange = async () => {
        if (!member) return;

        const newStatus =
            member.status === "suspended" ? "active" : "suspended";

        const confirmed = window.confirm(
            `Are you sure you want to ${
                newStatus === "suspended" ? "suspend" : "reactivate"
            } this member?`
        );

        if (!confirmed) return;

        setUpdating(true);

        try {
            const response = await axios.patch(
                `${API_URL}/api/admin/members/${encodeURIComponent(memberId)}/status`,
                { status: newStatus },
                { headers: getHeaders() }
            );

            if (response.data.success) {
                await fetchMemberDetails();
            }
        } catch (err) {
            alert(
                err.response?.data?.message ||
                "Unable to update member status."
            );
        } finally {
            setUpdating(false);
        }
    };

    const formatDate = (date) => {
        if (!date) return "N/A";

        return new Date(date).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "2-digit",
        });
    };

    const formatDateTime = (date) => {
        if (!date) return "N/A";

        return new Date(date).toLocaleString("en-US", {
            year: "numeric",
            month: "short",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    const formatAmount = (amount, currency = "USD") => {
        if (typeof amount !== "number") return "N/A";

        return new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: currency.toUpperCase(),
        }).format(amount / 100);
    };

    const getMembershipStatus = () => {
        if (!member) return "unknown";

        if (member.status === "suspended") return "suspended";

        return member.membershipStatus || (
            member.expiryDate && new Date(member.expiryDate) > new Date()
                ? "active"
                : "expired"
        );
    };

    const statusStyle = {
        active: "border-green-500/30 bg-green-500/10 text-green-400",
        expired: "border-yellow-500/30 bg-yellow-500/10 text-yellow-400",
        suspended: "border-red-500/30 bg-red-500/10 text-red-400",
    };

    const membershipStyle = {
        basic: "border-blue-400/30 bg-blue-400/10 text-blue-300",
        premium: "border-orange-400/30 bg-orange-400/10 text-orange-300",
        vip: "border-[#D4A017]/40 bg-[#D4A017]/10 text-[#E6C15A]",
    };

    const paymentStyle = {
        paid: "border-green-500/30 bg-green-500/10 text-green-400",
        pending: "border-yellow-500/30 bg-yellow-500/10 text-yellow-400",
        unpaid: "border-red-500/30 bg-red-500/10 text-red-400",
        failed: "border-red-500/30 bg-red-500/10 text-red-400",
        cancelled: "border-gray-500/30 bg-gray-500/10 text-gray-400",
        refunded: "border-purple-500/30 bg-purple-500/10 text-purple-400",
    };

    const currentStatus = getMembershipStatus();

    if (loading) {
        return (
            <section className="min-h-screen bg-[#050505] px-5 py-20 text-center text-gray-400">
                Loading member details...
            </section>
        );
    }

    if (error || !member) {
        return (
            <section className="min-h-screen bg-[#050505] px-5 py-20 text-center text-white">
                <p className="mb-5 text-red-400">
                    {error || "Member not found."}
                </p>

                <button
                    onClick={() => navigate("/admin/members")}
                    className={`rounded-lg px-6 py-3 text-sm ${goldButton}`}
                >
                    Back to Members
                </button>
            </section>
        );
    }

    return (
        <section className="min-h-screen bg-[#050505] px-3 py-8 text-white sm:px-6 md:px-10 md:py-12">

            <div className="mx-auto max-w-7xl">

                {/* Back Navigation */}
                <Link
                    to="/admin/members"
                    className="mb-8 inline-flex items-center gap-2 text-sm text-gray-400 transition hover:text-[#D4AF37]"
                >
                    <span>←</span>
                    Back to Members
                </Link>

                {/* Header */}
                <div className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">

                    <div>
                        <p className="mb-2 text-xs font-semibold uppercase tracking-[0.25em] text-[#C7A05B]">
                            Member Management
                        </p>

                        <h1 className="text-2xl font-bold sm:text-3xl">
                            Member Details
                        </h1>

                        <p className="mt-2 text-sm text-gray-400">
                            Review member information and payment history.
                        </p>
                    </div>

                    <button
                        type="button"
                        disabled={updating}
                        onClick={handleStatusChange}
                        className={`rounded-lg px-6 py-3 text-sm font-semibold transition disabled:opacity-50 ${
                            member.status === "suspended"
                                ? "border border-green-500/40 text-green-400 hover:bg-green-500/10"
                                : "border border-red-500/40 text-red-400 hover:bg-red-500/10"
                        }`}
                    >
                        {updating
                            ? "Updating..."
                            : member.status === "suspended"
                                ? "Reactivate Member"
                                : "Suspend Member"}
                    </button>

                </div>

                {/* Member Profile */}
                <div className="mb-8 rounded-xl border border-[#383838] bg-[#101010] p-5 sm:p-8">

                    <div className="mb-7 flex flex-col gap-4 border-b border-[#333] pb-6 sm:flex-row sm:items-center sm:justify-between">

                        <div>
                            <h2 className="text-xl font-bold sm:text-2xl">
                                {member.fullName}
                            </h2>

                            <p className="mt-2 break-all text-sm text-gray-400">
                                {member.email}
                            </p>
                        </div>

                        <div className="flex flex-wrap items-center gap-2">

                            <span className={`rounded-full border px-4 py-2 text-xs font-semibold uppercase ${membershipStyle[member.membershipType?.toLowerCase()] || "border-gray-500/30 text-gray-300"}`}>
                                {member.membershipType || "N/A"}
                            </span>

                            <span className={`rounded-full border px-4 py-2 text-xs font-semibold capitalize ${statusStyle[currentStatus] || statusStyle.expired}`}>
                                {currentStatus}
                            </span>

                        </div>

                    </div>

                    <div className="grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2 lg:grid-cols-3">

                        <div>
                            <p className="text-xs uppercase tracking-wider text-gray-500">
                                Member ID
                            </p>
                            <p className="mt-2 break-all text-sm font-semibold text-white">
                                {member.memberId}
                            </p>
                        </div>

                        <div>
                            <p className="text-xs uppercase tracking-wider text-gray-500">
                                Phone Number
                            </p>
                            <p className="mt-2 text-sm text-white">
                                {member.phone || "N/A"}
                            </p>
                        </div>

                        <div>
                            <p className="text-xs uppercase tracking-wider text-gray-500">
                                Date of Birth
                            </p>
                            <p className="mt-2 text-sm text-white">
                                {formatDate(member.dateOfBirth)}
                            </p>
                        </div>

                        <div>
                            <p className="text-xs uppercase tracking-wider text-gray-500">
                                Membership Start
                            </p>
                            <p className="mt-2 text-sm text-white">
                                {formatDate(member.membershipStartDate)}
                            </p>
                        </div>

                        <div>
                            <p className="text-xs uppercase tracking-wider text-gray-500">
                                Membership Expiry
                            </p>
                            <p className="mt-2 text-sm text-white">
                                {formatDate(member.expiryDate)}
                            </p>
                        </div>

                        <div>
                            <p className="text-xs uppercase tracking-wider text-gray-500">
                                Account Created
                            </p>
                            <p className="mt-2 text-sm text-white">
                                {formatDate(member.createdAt)}
                            </p>
                        </div>

                    </div>

                </div>

                {/* Purchase History */}
                <div className="mb-5 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">

                    <div>
                        <h2 className="text-xl font-bold">
                            Purchase History
                        </h2>

                        <p className="mt-1 text-sm text-gray-400">
                            All membership payments and renewals.
                        </p>
                    </div>

                    <span className="text-sm text-[#D4AF37]">
                        {purchases.length} Purchase(s)
                    </span>

                </div>

                {/* Purchase Table */}
                <div className="overflow-hidden rounded-xl border border-[#333] bg-[#101010]">

                    <div className="overflow-x-auto">

                        <table className="w-full text-left">

                            <thead className="bg-[#191919]">
                                <tr className="border-b border-[#333]">

                                    {[
                                        "Plan",
                                        "Purchase Type",
                                        "Amount",
                                        "Payment Status",
                                        "Purchase Date",
                                    ].map((heading) => (
                                        <th
                                            key={heading}
                                            className="whitespace-nowrap px-5 py-5 text-xs font-bold uppercase tracking-wider text-[#C7A05B]"
                                        >
                                            {heading}
                                        </th>
                                    ))}

                                </tr>
                            </thead>

                            <tbody className="divide-y divide-[#292929]">

                                {purchases.map((purchase) => {
                                    const plan = purchase.plan || purchase.membership;
                                    const paymentStatus = purchase.paymentStatus?.toLowerCase() || "pending";

                                    return (
                                        <tr
                                            key={purchase._id}
                                            className="transition hover:bg-[#1A1A1A]"
                                        >

                                            <td className="whitespace-nowrap px-5 py-5 text-sm font-semibold text-white">
                                                {plan
                                                    ? plan.charAt(0).toUpperCase() + plan.slice(1).toLowerCase()
                                                    : "N/A"}
                                            </td>

                                            <td className="whitespace-nowrap px-5 py-5 text-sm capitalize text-gray-300">
                                                {purchase.purchaseType || "Initial"}
                                            </td>

                                            <td className="whitespace-nowrap px-5 py-5 text-sm text-white">
                                                {formatAmount(
                                                    purchase.amount,
                                                    purchase.currency || "USD"
                                                )}
                                            </td>

                                            <td className="whitespace-nowrap px-5 py-5">
                                                <span className={`rounded-full border px-3 py-1.5 text-xs font-semibold capitalize ${paymentStyle[paymentStatus] || paymentStyle.pending}`}>
                                                    {paymentStatus}
                                                </span>
                                            </td>

                                            <td className="whitespace-nowrap px-5 py-5 text-sm text-gray-300">
                                                {formatDateTime(purchase.purchasedAt || purchase.createdAt)}
                                            </td>

                                        </tr>
                                    );
                                })}

                            </tbody>

                        </table>

                        {purchases.length === 0 && (
                            <div className="py-14 text-center text-sm text-gray-400">
                                No purchase history found.
                            </div>
                        )}

                    </div>

                </div>

                {/* Refresh */}
                <div className="mt-6 flex justify-end">
                    <button
                        type="button"
                        onClick={fetchMemberDetails}
                        className="rounded-lg border border-[#444] px-5 py-2.5 text-sm text-gray-300 transition hover:border-[#D4AF37] hover:text-[#D4AF37]"
                    >
                        Refresh Details
                    </button>
                </div>

            </div>

        </section>
    );
};

export default AdminMemberDetails;
