
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const API_URL = "https://da-server-ltll.onrender.com";

const Card = () => {
  const { token } = useParams();

  const [member, setMember] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchMember = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await axios.get(
          `${API_URL}/api/members/card/${token}`
        );

        const data = response.data.member || response.data;

        setMember({
          name: data.fullName,
          id: data.memberId,
          membership: data.membershipType,
          expiry: data.expiryDate,
          status: data.status
        });
      } catch (err) {
        setError(
          err.response?.data?.message ||
          "Invalid membership card or card not found."
        );
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchMember();
    } else {
      setError("Membership card token is missing.");
      setLoading(false);
    }
  }, [token]);

  const formatDate = (date) => {
    if (!date) return "N/A";

    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "2-digit"
    });
  };

  if (loading) {
    return (
      <section className="min-h-screen bg-[#080808] flex items-center justify-center px-4">
        <p className="text-[#168BCE] font-bold tracking-widest uppercase animate-pulse">
          Loading Membership Card...
        </p>
      </section>
    );
  }

  if (error || !member) {
    return (
      <section className="min-h-screen bg-[#080808] flex items-center justify-center px-4">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-3">
            Card Not Found
          </h2>

          <p className="text-gray-400">
            {error || "This membership card is unavailable."}
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="min-h-screen bg-[#080808] flex items-center justify-center px-4 py-12">


      {/* Membership Card */}
      <div className="relative w-full max-w-[520px] overflow-hidden rounded-xl border-2 border-[#168BCE] bg-black shadow-xl">
        <h1 className="text-xl text-center p-2">Take a screenshot.</h1>
        {/* Top Accent */}
        <div className="h-2 bg-gradient-to-r from-[#168BCE] via-[#168BCE] to-[#F07820]" />

        <div className="p-6 sm:p-8">

          {/* Brand Header */}
          <div className="flex items-center gap-3 border-b border-white/20 pb-5">

            <img
              src="/logo.jpeg"
              alt="DA WEB Logo"
              className="h-16 w-16 rounded-full object-cover"
            />

            <div>
              <h1 className="text-3xl font-black italic tracking-tight text-white sm:text-4xl">
                DA <span className="text-[#168BCE]">WEB</span>
              </h1>

              <p className="text-xs font-bold tracking-[3px] text-[#F07820]">
                SOCIAL CLUB
              </p>
            </div>

            <div className="ml-auto hidden sm:block">
              <span className="border border-[#168BCE] px-3 py-2 text-xs font-black tracking-widest text-white">
                MEMBER PASS
              </span>
            </div>
          </div>

          {/* Membership Type */}
          <div className="my-7">
            <p className="text-xs font-bold uppercase tracking-[3px] text-[#F07820]">
              Official Membership
            </p>

            <h2 className="mt-2 text-5xl font-black italic uppercase tracking-tight text-white sm:text-6xl">
              {member.membership}
            </h2>

            <div className="mt-3 h-1 w-20 bg-[#168BCE]" />
          </div>

          {/* Member Details */}
          <div className="space-y-5">

            <div>
              <p className="mb-1 text-xs font-bold uppercase tracking-widest text-[#168BCE]">
                Member Name
              </p>

              <h3 className="text-xl font-bold uppercase text-white sm:text-2xl">
                {member.name}
              </h3>
            </div>

            <div className="grid grid-cols-2 gap-4">

              <div>
                <p className="mb-2 text-xs font-bold uppercase tracking-widest text-[#168BCE]">
                  Member ID
                </p>

                <p className="break-all text-sm font-bold text-white sm:text-base">
                  {member.id}
                </p>
              </div>

              <div>
                <p className="mb-2 text-xs font-bold uppercase tracking-widest text-[#168BCE]">
                  Expiration Date
                </p>

                <p className="text-sm font-bold text-white sm:text-base">
                  {formatDate(member.expiry)}
                </p>
              </div>

            </div>
          </div>

          {/* Bottom */}
          <div className="mt-8 flex items-center justify-between border-t border-white/20 pt-5">

            <p className="text-xs font-black italic uppercase tracking-wider text-[#F07820] sm:text-sm">
              Get Caught Up in DA WEB
            </p>

            <div className="flex gap-1">
              <span className="h-3 w-3 bg-[#168BCE]" />
              <span className="h-3 w-3 bg-white" />
              <span className="h-3 w-3 bg-[#F07820]" />
            </div>

          </div>

        </div>

        {/* Bottom Accent */}
        <div className="h-2 bg-gradient-to-r from-[#F07820] via-[#168BCE] to-[#168BCE]" />

      </div>
    </section>
  );
};

export default Card;
