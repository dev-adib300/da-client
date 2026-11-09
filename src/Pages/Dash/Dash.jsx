
import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Dash = () => {
  const navigate = useNavigate();

  const API_URL = import.meta.env.VITE_API_URL || "http://https://da-server-ltll.onrender.com";

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [membership, setMembership] = useState("all");

  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({
    total: 0,
    totalPages: 1,
    page: 1,
    limit: 10,
  });

  const [updatingMember, setUpdatingMember] = useState(null);

  const goldButton =
    "bg-gradient-to-r from-[#BF953F] via-[#FCF6BA] to-[#AA771C] text-black font-bold hover:brightness-110 transition duration-300";

  const membershipStyle = {
    Basic: "border-blue-400/30 bg-blue-400/10 text-blue-300",
    Premium: "border-orange-400/30 bg-orange-400/10 text-orange-300",
    VIP: "border-[#D4A017]/40 bg-[#D4A017]/10 text-[#E6C15A]",
  };

  const statusStyle = {
    active: "bg-green-500/10 text-green-400 border-green-500/30",
    expired: "bg-yellow-500/10 text-yellow-400 border-yellow-500/30",
    suspended: "bg-red-500/10 text-red-400 border-red-500/30",
  };

  const getHeaders = () => ({
    Authorization: `Bearer ${sessionStorage.getItem("adminToken")}`,
  });

  // Fetch members from MongoDB
  const fetchMembers = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const response = await axios.get(
        `${API_URL}/api/admin/members`,
        {
          headers: getHeaders(),
          params: {
            page,
            limit: 10,
            search,
            status,
            membership,
          },
        }
      );

      if (response.data.success) {
        setMembers(response.data.members || []);
        setPagination(
          response.data.pagination || {
            total: 0,
            totalPages: 1,
            page: 1,
            limit: 10,
          }
        );
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
        "Unable to load members. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }, [API_URL, page, search, status, membership, navigate]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchMembers();
    }, 400);

    return () => clearTimeout(timer);
  }, [fetchMembers]);

  // Update member status
  const handleStatusChange = async (member) => {
    const currentStatus = member.status;
    const newStatus =
      currentStatus === "suspended" ? "active" : "suspended";

    const confirmed = window.confirm(
      `Are you sure you want to ${newStatus === "suspended" ? "suspend" : "activate"
      } ${member.fullName}?`
    );

    if (!confirmed) return;

    setUpdatingMember(member.memberId);

    try {
      const response = await axios.patch(
        `${API_URL}/api/admin/members/${encodeURIComponent(member.memberId)}/status`,
        { status: newStatus },
        { headers: getHeaders() }
      );

      if (response.data.success) {
        await fetchMembers();
      }
    } catch (err) {
      alert(
        err.response?.data?.message ||
        "Unable to update member status."
      );
    } finally {
      setUpdatingMember(null);
    }
  };

  const formatDate = (date) => {
    if (!date) return "N/A";

    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "2-digit",
    });
  };

  const getMembershipStatus = (member) => {
    if (member.status === "suspended") return "suspended";

    return member.membershipStatus || (
      member.expiryDate && new Date(member.expiryDate) > new Date()
        ? "active"
        : "expired"
    );
  };

  const getMembershipName = (type) => {
    if (!type) return "N/A";

    return type.charAt(0).toUpperCase() + type.slice(1).toLowerCase();
  };

  const openMemberDetails = (memberId) => {
    navigate(`/admin/members/${encodeURIComponent(memberId)}`);
  };

  const handleFilterChange = (setter, value) => {
    setter(value);
    setPage(1);
  };

  const changePage = (newPage) => {
    if (newPage < 1 || newPage > pagination.totalPages) return;
    setPage(newPage);
  };

  const handleLogout = () => {
    sessionStorage.removeItem("adminToken");
    sessionStorage.removeItem("adminProfile");

    navigate("/admin/login", { replace: true });
  };

  return (
    <section className="min-h-screen bg-[#050505] px-3 py-8 text-white sm:px-6 md:px-10 md:py-12">

      <div className="mx-auto max-w-7xl">

        {/* Header */}
        <div className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">

          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.25em] text-[#C7A05B]">
              Administration
            </p>

            <h1 className="text-2xl font-bold sm:text-3xl">
              Members Management
            </h1>

            <p className="mt-2 text-sm text-gray-400">
              Manage and monitor your club members.
            </p>
          </div>

          <div className="flex items-center gap-3 sm:gap-5">

            

            <button
              type="button"
              onClick={handleLogout}
              className="rounded-lg border border-red-500/40 px-4 py-3 text-sm font-semibold text-red-400 transition hover:bg-red-500/10"
            >
              Logout as Admin
            </button>

          </div>

        </div>

        {/* Search and Filters */}
        <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

          <div className="relative w-full lg:max-w-md">

            <svg
              className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <circle cx="11" cy="11" r="7" strokeWidth="2" />
              <path
                d="m20 20-4-4"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>

            <input
              type="text"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              placeholder="Search by name, email or member ID..."
              className="w-full rounded-lg border border-[#444] bg-[#111] py-3 pl-11 pr-4 text-sm text-white placeholder:text-gray-500 outline-none transition focus:border-[#C7A05B] focus:ring-1 focus:ring-[#C7A05B]"
            />

          </div>

          <div className="grid grid-cols-2 gap-3 sm:flex">

            <select
              value={status}
              onChange={(e) =>
                handleFilterChange(setStatus, e.target.value)
              }
              className="rounded-lg border border-[#444] bg-[#111] px-3 py-3 text-sm text-white outline-none focus:border-[#C7A05B]"
            >
              <option value="all">All Statuses</option>
              <option value="active">Active</option>
              <option value="expired">Expired</option>
              <option value="suspended">Suspended</option>
            </select>

            <select
              value={membership}
              onChange={(e) =>
                handleFilterChange(setMembership, e.target.value)
              }
              className="rounded-lg border border-[#444] bg-[#111] px-3 py-3 text-sm text-white outline-none focus:border-[#C7A05B]"
            >
              <option value="all">All Plans</option>
              <option value="basic">Basic</option>
              <option value="premium">Premium</option>
              <option value="vip">VIP</option>
            </select>

          </div>

        </div>

        {/* Error */}
        {error && (
          <div className="mb-6 rounded-lg border border-red-500/30 bg-red-500/10 px-5 py-4 text-sm text-red-400">
            {error}

            <button
              onClick={fetchMembers}
              className="ml-3 font-semibold underline"
            >
              Retry
            </button>
          </div>
        )}

        {/* Desktop Table */}
        <div className="hidden overflow-hidden rounded-xl border border-[#333] bg-[#101010] md:block">

          <div className="overflow-x-auto">

            <table className="w-full text-left">

              <thead className="bg-[#191919]">
                <tr className="border-b border-[#333]">

                  {[
                    "Member",
                    "Member ID",
                    "Membership",
                    "Status",
                    "Expiration Date",
                    "Actions",
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

                {!loading && members.map((member) => {
                  const memberStatus = getMembershipStatus(member);
                  const plan = getMembershipName(member.membershipType);

                  return (
                    <tr
                      key={member.memberId}
                      className="transition hover:bg-[#1A1A1A]"
                    >

                      <td className="px-5 py-5">
                        <p className="whitespace-nowrap text-sm font-semibold text-white">
                          {member.fullName}
                        </p>

                        <p className="mt-1 text-xs text-gray-400">
                          {member.email}
                        </p>
                      </td>

                      <td className="px-5 py-5 text-sm text-gray-300">
                        {member.memberId}
                      </td>

                      <td className="px-5 py-5">
                        <span className={`rounded-full border px-3 py-1.5 text-xs font-semibold ${membershipStyle[plan] || "border-gray-500/30 bg-gray-500/10 text-gray-300"}`}>
                          {plan}
                        </span>
                      </td>

                      <td className="px-5 py-5">
                        <span className={`rounded-full border px-3 py-1.5 text-xs font-semibold capitalize ${statusStyle[memberStatus] || statusStyle.expired}`}>
                          {memberStatus}
                        </span>
                      </td>

                      <td className="whitespace-nowrap px-5 py-5 text-sm text-gray-300">
                        {formatDate(member.expiryDate)}
                      </td>

                      <td className="px-5 py-5">
                        <div className="flex items-center gap-2">

                          <button
                            type="button"
                            onClick={() => openMemberDetails(member.memberId)}
                            className={`rounded-md px-4 py-2 text-xs ${goldButton}`}
                          >
                            View
                          </button>

                          <button
                            type="button"
                            disabled={updatingMember === member.memberId}
                            onClick={() => handleStatusChange(member)}
                            className={`whitespace-nowrap rounded-md border px-3 py-2 text-xs font-semibold transition disabled:opacity-50 ${member.status === "suspended"
                              ? "border-green-500/50 text-green-400 hover:bg-green-500/10"
                              : "border-red-500/50 text-red-400 hover:bg-red-500/10"
                              }`}
                          >
                            {updatingMember === member.memberId
                              ? "Updating..."
                              : member.status === "suspended"
                                ? "Activate"
                                : "Suspend"}
                          </button>

                        </div>
                      </td>

                    </tr>
                  );
                })}

              </tbody>

            </table>

            {loading && (
              <div className="py-16 text-center text-sm text-gray-400">
                Loading members...
              </div>
            )}

            {!loading && members.length === 0 && (
              <div className="py-16 text-center text-sm text-gray-400">
                No members found.
              </div>
            )}

          </div>

        </div>

        {/* Mobile Member Cards */}
        <div className="grid grid-cols-1 gap-4 md:hidden">

          {loading && (
            <div className="rounded-xl border border-[#333] bg-[#111] py-12 text-center text-sm text-gray-400">
              Loading members...
            </div>
          )}

          {!loading && members.map((member) => {
            const memberStatus = getMembershipStatus(member);
            const plan = getMembershipName(member.membershipType);

            return (
              <div
                key={member.memberId}
                className="rounded-xl border border-[#383838] bg-[#111111] p-4 shadow-lg"
              >

                <div className="mb-4 flex items-start justify-between gap-2">

                  <div className="min-w-0">
                    <h3 className="break-words text-base font-bold text-white">
                      {member.fullName}
                    </h3>

                    <p className="mt-1 break-all text-xs text-gray-400">
                      {member.email}
                    </p>
                  </div>

                  <span className="shrink-0 rounded-md border border-[#C7A05B]/40 bg-[#C7A05B]/10 px-2 py-1 text-xs font-semibold text-[#E6C15A]">
                    {member.memberId}
                  </span>

                </div>

                <div className="mb-4 h-px bg-[#333]" />

                <div className="space-y-4">

                  <div className="flex items-center justify-between gap-3">
                    <span className="text-sm text-gray-400">
                      Phone
                    </span>

                    <span className="break-all text-right text-sm text-white">
                      {member.phone || "N/A"}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-400">
                      Membership
                    </span>

                    <span className={`rounded-full border px-3 py-1 text-xs font-semibold ${membershipStyle[plan] || "border-gray-500/30 bg-gray-500/10 text-gray-300"}`}>
                      {plan}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-400">
                      Status
                    </span>

                    <span className={`rounded-full border px-3 py-1 text-xs font-semibold capitalize ${statusStyle[memberStatus] || statusStyle.expired}`}>
                      {memberStatus}
                    </span>
                  </div>

                  <div className="flex items-center justify-between gap-3">
                    <span className="text-sm text-gray-400">
                      Expiration
                    </span>

                    <span className="text-right text-sm text-white">
                      {formatDate(member.expiryDate)}
                    </span>
                  </div>

                </div>

                <div className="mt-5 grid grid-cols-2 gap-3 border-t border-[#333] pt-4">

                  <button
                    type="button"
                    onClick={() => openMemberDetails(member.memberId)}
                    className={`rounded-lg py-2.5 text-sm ${goldButton}`}
                  >
                    View Details
                  </button>

                  <button
                    type="button"
                    disabled={updatingMember === member.memberId}
                    onClick={() => handleStatusChange(member)}
                    className={`rounded-lg border py-2.5 text-sm font-semibold transition disabled:opacity-50 ${member.status === "suspended"
                      ? "border-green-500/50 text-green-400 hover:bg-green-500/10"
                      : "border-red-500/50 text-red-400 hover:bg-red-500/10"
                      }`}
                  >
                    {updatingMember === member.memberId
                      ? "Updating..."
                      : member.status === "suspended"
                        ? "Activate"
                        : "Suspend"}
                  </button>

                </div>

              </div>
            );
          })}

          {!loading && members.length === 0 && (
            <div className="rounded-xl border border-[#333] bg-[#111] py-12 text-center">
              <p className="text-sm text-gray-400">
                No members found.
              </p>
            </div>
          )}

        </div>

        {/* Pagination */}
        {!loading && pagination.totalPages > 1 && (
          <div className="mt-8 flex flex-col items-center justify-between gap-4 sm:flex-row">

            <p className="text-sm text-gray-400">
              Showing page{" "}
              <span className="font-semibold text-white">
                {pagination.page}
              </span>{" "}
              of{" "}
              <span className="font-semibold text-white">
                {pagination.totalPages}
              </span>
            </p>

            <div className="flex items-center gap-2">

              <button
                type="button"
                disabled={page <= 1}
                onClick={() => changePage(page - 1)}
                className="rounded-lg border border-[#444] px-4 py-2 text-sm text-white transition hover:border-[#C7A05B] disabled:cursor-not-allowed disabled:opacity-40"
              >
                Previous
              </button>

              <button
                type="button"
                disabled={page >= pagination.totalPages}
                onClick={() => changePage(page + 1)}
                className="rounded-lg border border-[#444] px-4 py-2 text-sm text-white transition hover:border-[#C7A05B] disabled:cursor-not-allowed disabled:opacity-40"
              >
                Next
              </button>

            </div>

          </div>
        )}

      </div>

    </section>
  );
};

export default Dash;
