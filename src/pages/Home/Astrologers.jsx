import React, { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  Star,
  Clock,
  Globe,
  Users,
  ShieldCheck,
  Award,
  X,
  Bookmark,
} from "lucide-react";
import BookAppointmentPopup from "./comp/BookingPopup";
import InsufficientBalancePopup from "./comp/InsufficientBalance";
import BookingConfirmedPopup from "./comp/BookingConfirmedPopup";
import { getAllAstrologers, getAstrologerById } from "../../API/homeApis";
import { myWallet } from "../../API/bookingApis";

const FILTERS = [
  { key: "ALL", label: "All Guides" },
  { key: "ONLINE", label: "Online Now" },
  { key: "OFFLINE", label: "Offline" },
];

export default function Astrologers() {
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL"); // ALL, ONLINE, OFFLINE

  const [bookmarkedExperts, setBookmarkedExperts] = useState({});

  const [showWallet, setShowWallet] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showBooking, setShowBooking] = useState(false);
  const [lastBooking, setLastBooking] = useState(null);

  const [astrologers, setAstrologers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPartner, setSelectedPartner] = useState(null);
  const [activeProfileExpert, setActiveProfileExpert] = useState(null);
  const [balance, setBalance] = useState(null);

  const handleToggleBookmark = (id, e) => {
    e.stopPropagation();
    setBookmarkedExperts((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const fetchPartnerDetails = async (id) => {
    try {
      const res = await getAstrologerById(id);
      setSelectedPartner(res.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchAllAstrologers = async () => {
    try {
      setIsLoading(true);
      const res = await getAllAstrologers({});
      if (res.success) {
        setAstrologers(res.data);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAllAstrologers();
  }, []);

  const fetchWallet = async () => {
    try {
      const res = await myWallet();
      setBalance(res.data.walletBalance);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchWallet();
  }, []);

  const filteredAstrologers = useMemo(() => {
    return astrologers.filter((astrologer) => {
      if (statusFilter === "ONLINE" && !astrologer.isOnline) return false;
      if (statusFilter === "OFFLINE" && astrologer.isOnline) return false;

      if (searchQuery.trim()) {
        const q = searchQuery.trim().toLowerCase();
        const matchesSearch =
          astrologer.fullName?.toLowerCase().includes(q) ||
          astrologer.specialties?.some((s) => s.toLowerCase().includes(q)) ||
          astrologer.languages?.some((l) => l.toLowerCase().includes(q));
        if (!matchesSearch) return false;
      }

      return true;
    });
  }, [astrologers, statusFilter, searchQuery]);

  const onlineCount = astrologers.filter((a) => a.isOnline).length;

  return (
    // Updated Background and Text colors
    <div className="min-h-screen bg-[#F8F7FF] text-[#1A1429] font-sans">
      {/* HEADER */}
      {/* Updated Border Color */}
      <section className="border-b border-[#E2E0EF] bg-white">
        <div className="max-w-7xl mx-auto px-4 lg:px-8 pt-12 pb-10 space-y-7">
          {/* Accent text changed to Purple */}
          <div className="flex items-center gap-2 text-[11px] font-bold tracking-[0.2em] uppercase text-[#6D28D9]">
            <span className="w-8 h-px bg-[#6D28D9]" />
            <span>Vedic Guidance Directory</span>
          </div>

          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
            {/* Main title text color */}
            <h1 className="font-serif font-bold text-3xl sm:text-4xl leading-tight text-[#1A1429] max-w-xl">
              Connect with trusted spiritual guides
            </h1>
            {/* Soft text color */}
            <div className="flex items-center gap-2 text-sm bg-[#EDE9FE] text-[#6D28D9] px-4 py-1.5 rounded-full font-medium">
              {/* Online pulse dot */}
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#10B981] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#10B981]"></span>
              </span>
              <span>
                <strong className="font-semibold">{onlineCount}</strong> experts
                online now
              </span>
            </div>
          </div>

          {/* Search */}
          <div className="relative max-w-2xl">
            <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
              {/* Icon color changed to purple */}
              <Search className="w-5 h-5 text-[#6D28D9]" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name, specialty, or language..."
              // Updated borders, focus ring, and placeholder
              className="w-full bg-white border border-[#E2E0EF] rounded-full pl-12 pr-12 py-4 text-sm text-[#1A1429] placeholder-[#A9A2CC] focus:outline-none focus:ring-2 focus:ring-[#6D28D9]/20 focus:border-[#6D28D9] transition-all shadow-inner"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute inset-y-0 right-0 pr-5 flex items-center text-[#A9A2CC] hover:text-[#6D28D9]"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>

          {/* Online / Offline filter */}
          {/* Updated background and borders */}
          <div className="inline-flex items-center gap-1.5 bg-[#F1F0F7] p-1.5 rounded-full border border-[#E2E0EF]">
            {FILTERS.map((f) => {
              const isActive = statusFilter === f.key;
              return (
                <button
                  key={f.key}
                  onClick={() => setStatusFilter(f.key)}
                  // Active state is deep purple, inactive is muted purple
                  className={`px-5 py-2.5 rounded-full text-xs font-bold transition-all flex items-center gap-2 ${
                    isActive
                      ? "bg-[#6D28D9] text-white shadow-md"
                      : "text-[#6C5F8B] hover:bg-white/50 hover:text-[#1A1429]"
                  }`}
                >
                  {f.key === "ONLINE" && (
                    <span
                      className={`w-2 h-2 rounded-full ${
                        isActive ? "bg-[#A7F3D0]" : "bg-[#10B981]"
                      }`}
                    />
                  )}
                  {f.label}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* LISTING */}
      <main className="max-w-7xl mx-auto px-4 lg:px-8 py-10">
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              // Skeletal loading states updated to light lavender
              <div
                key={i}
                className="rounded-2xl border border-[#E2E0EF] bg-white p-6 animate-pulse space-y-4 shadow-sm"
              >
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-2xl bg-[#F1F0F7]" />
                  <div className="flex-1 space-y-2.5">
                    <div className="h-3.5 w-2/3 bg-[#F1F0F7] rounded" />
                    <div className="h-3 w-1/2 bg-[#F1F0F7] rounded" />
                  </div>
                </div>
                <div className="h-3 w-full bg-[#F1F0F7] rounded pt-2" />
                <div className="h-3 w-2/3 bg-[#F1F0F7] rounded" />
              </div>
            ))}
          </div>
        ) : filteredAstrologers.length === 0 ? (
          // Empty state updated to purple theme
          <div className="border border-[#E2E0EF] bg-white rounded-3xl p-16 text-center space-y-5 shadow-sm">
            <div className="w-16 h-16 bg-[#EDE9FE] text-[#6D28D9] rounded-full flex items-center justify-center mx-auto border-4 border-white shadow-lg">
              <Search className="w-7 h-7" />
            </div>
            <h3 className="font-serif font-bold text-2xl text-[#1A1429]">
              No guides match your search
            </h3>
            <p className="text-base text-[#6C5F8B] max-w-md mx-auto leading-relaxed">
              Try refining your search term, specialty, or switch back to
              viewing All Guides.
            </p>
            <button
              onClick={() => {
                setSearchQuery("");
                setStatusFilter("ALL");
              }}
              className="px-8 py-3 rounded-full bg-[#6D28D9] text-white font-bold text-sm hover:bg-[#5B21B6] transition-all shadow-md hover:shadow-lg active:scale-95"
            >
              Reset filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredAstrologers.map((astrologer) => {
              const isBookmarked = bookmarkedExperts[astrologer._id];
              const isOnline = !!astrologer.isOnline;

              return (
                <div
                  key={astrologer._id}
                  onClick={() => {
                    fetchPartnerDetails(astrologer._id);
                    setActiveProfileExpert(astrologer);
                  }}
                  // Updated interaction colors: Border changes to primary purple, shadow has a purple tint
                  className="group bg-white rounded-3xl border border-[#E2E0EF] hover:border-[#6D28D9]/50 p-6 relative transition-all duration-300 hover:shadow-[0_12px_30px_-10px_rgba(109,40,217,0.15)] cursor-pointer flex flex-col shadow-sm"
                >
                  <div className="flex items-start justify-between gap-3">
                    {/* Avatar with online ring - Changed to Purple Gradient */}
                    <div className="relative flex-shrink-0">
                      <div
                        className={`w-20 h-20 rounded-3xl p-[3px] transition-all duration-300 ${
                          isOnline
                            ? "bg-gradient-to-br from-[#6D28D9] via-[#8B5CF6] to-[#C4B5FD]"
                            : "bg-[#F1F0F7]"
                        }`}
                      >
                        <img
                          src={
                            astrologer.profilePic ||
                            "https://ui-avatars.com/api/?name=" +
                              encodeURIComponent(astrologer.fullName) +
                              "&background=EDE9FE&color=6D28D9"
                          }
                          alt={astrologer.fullName}
                          className="w-full h-full object-cover rounded-[21px] bg-white border-2 border-white"
                        />
                      </div>
                      {/* Online dot updated to Emerald/Muted gray */}
                      <span
                        className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-4 border-white ${
                          isOnline ? "bg-[#10B981]" : "bg-[#A9A2CC]"
                        }`}
                      />
                    </div>

                    {/* Bookmark - Changed hover and active to Purple */}
                    <button
                      onClick={(e) => handleToggleBookmark(astrologer._id, e)}
                      className="p-2.5 rounded-2xl text-[#A9A2CC] hover:text-[#6D28D9] hover:bg-[#EDE9FE] transition-colors"
                    >
                      <Bookmark
                        className={`w-5 h-5 ${
                          isBookmarked ? "fill-[#6D28D9] text-[#6D28D9]" : ""
                        }`}
                      />
                    </button>
                  </div>

                  {/* Name + rating */}
                  <div className="mt-5 flex-grow">
                    <div className="flex items-center gap-2">
                      <h3 className="font-serif font-bold text-xl text-[#1A1429] group-hover:text-[#6D28D9] transition-colors">
                        {astrologer.fullName}
                      </h3>
                      {/* Verified icon color change */}
                      {astrologer.isVerified && (
                        <ShieldCheck
                          className="w-5 h-5 text-[#6D28D9]"
                          fill="#EDE9FE"
                        />
                      )}
                    </div>
                    {/* Specialty text color change */}
                    <p className="text-xs font-medium text-[#6D28D9] mt-1.5 max-w-full w-fit truncate bg-[#EDE9FE] px-3 py-1 rounded-full overflow-hidden whitespace-nowrap">
                      {astrologer.specialties?.join(" • ") || "Astrologer"}
                    </p>
                  </div>

                  {/* Star color change */}
                  <div className="mt-4 flex items-center gap-1.5 text-xs text-[#6C5F8B]">
                    <Star className="w-4 h-4 fill-[#6D28D9] text-[#6D28D9]" />
                    <span className="font-bold text-[#1A1429] text-sm">
                      {Number(astrologer.averageRating || 0).toFixed(1)}
                    </span>
                    <span>({astrologer.totalReviews || 0} reviews)</span>
                  </div>

                  {/* Meta - Border and icons changed to pale purple */}
                  <div className="mt-5 grid grid-cols-2 gap-x-3 gap-y-3.5 text-xs text-[#6C5F8B] border-t border-[#E2E0EF] pt-4 flex-shrink-0">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-[#8B5CF6]" />
                      <span>{astrologer.experience || 0} yrs experience</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Globe className="w-4 h-4 text-[#8B5CF6]" />
                      <span className="truncate">
                        {astrologer.languages?.join(", ") || "N/A"}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 col-span-2">
                      <Users className="w-4 h-4 text-[#8B5CF6]" />
                      <span>
                        {astrologer.totalConsultations || 0} consultations
                        guided
                      </span>
                    </div>
                  </div>

                  {/* Price + status footer - Border changed */}
                  <div className="mt-5 pt-4 border-t border-[#E2E0EF] flex items-center justify-between flex-shrink-0">
                    <span className="font-extrabold text-[#1A1429] text-base">
                      ₹{astrologer.minRate || 0}
                      <span className="text-[#6C5F8B] font-medium text-xs">
                        /min
                      </span>
                    </span>
                    {/* Online status pills changed to Green/Purple hues */}
                    <span
                      className={`text-[10px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-full ${
                        isOnline
                          ? "bg-[#A7F3D0] text-[#065F46]"
                          : "bg-[#F1F0F7] text-[#6C5F8B]"
                      }`}
                    >
                      {isOnline ? "Online" : "Offline"}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      {/* PROFILE DRAWER - Changed background backdrop and borders to purple theme */}
      {activeProfileExpert && (
        <div className="fixed inset-0 z-50 bg-[#1A1429]/50 backdrop-blur-sm flex items-center justify-center p-4 transition-opacity duration-300">
          <div className="bg-white w-full max-w-xl rounded-3xl border border-[#E2E0EF] p-8 space-y-7 shadow-2xl relative max-h-[90vh] overflow-y-auto animate-fadeInUp">
            {/* Close button updated */}
            <button
              onClick={() => setActiveProfileExpert(null)}
              className="absolute top-6 right-6 p-2.5 rounded-2xl bg-[#F8F7FF] text-[#6C5F8B] hover:text-[#6D28D9] hover:bg-[#EDE9FE]"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-6">
              {/* Profile image border */}
              <img
                src={
                  selectedPartner?.profilePic ||
                  "https://ui-avatars.com/api/?name=" +
                    encodeURIComponent(activeProfileExpert.fullName) +
                    "&background=EDE9FE&color=6D28D9"
                }
                alt={selectedPartner?.fullName}
                className="w-24 h-24 rounded-3xl object-cover border-4 border-[#EDE9FE] shadow-md"
              />
              <div className="space-y-1.5">
                <div className="flex items-center gap-2.5">
                  <h3 className="font-serif font-bold text-3xl text-[#1A1429]">
                    {selectedPartner?.fullName}
                  </h3>
                  {selectedPartner?.isVerified && (
                    <ShieldCheck
                      className="w-6 h-6 text-[#6D28D9]"
                      fill="#EDE9FE"
                    />
                  )}
                </div>
                <p className="text-sm font-medium text-[#6D28D9]">
                  {selectedPartner?.specialties?.join(" • ")}
                </p>
                {/* Star color change */}
                <div className="flex items-center gap-2 text-[#1A1429] font-bold text-sm pt-1.5">
                  <Star className="w-5 h-5 fill-[#6D28D9] text-[#6D28D9]" />
                  <span>
                    {Number(selectedPartner?.averageRating || 0).toFixed(1)} (
                    {selectedPartner?.totalReviews || 0} reviews)
                  </span>
                </div>
              </div>
            </div>

            {/* Accent color changed to purple */}
            <div className="space-y-3 text-sm text-[#1A1429]">
              <h4 className="font-bold text-[#6D28D9] uppercase tracking-wider text-xs">
                About the Guide
              </h4>
              {/* Background and border changes */}
              <p className="leading-relaxed bg-[#F8F7FF] p-5 rounded-2xl border border-[#E2E0EF]">
                {selectedPartner?.bio || "No bio available."}
              </p>
            </div>

            {/* Info grid updated to purple theme */}
            <div className="grid grid-cols-2 gap-4 text-sm text-[#6C5F8B]">
              {[
                {
                  label: "Experience",
                  value: `${selectedPartner?.experience} Years`,
                  icon: Clock,
                },
                {
                  label: "Qualification",
                  value: selectedPartner?.qualification || "N/A",
                  icon: Award,
                },
                {
                  label: "City",
                  value: selectedPartner?.city || "N/A",
                  icon: Globe,
                },
                {
                  label: "Languages",
                  value: selectedPartner?.languages?.join(", ") || "N/A",
                  icon: Users,
                },
              ].map((item, idx) => (
                <div
                  key={idx}
                  className="bg-[#F8F7FF] p-4 rounded-2xl border border-[#E2E0EF] flex items-center gap-3.5"
                >
                  <item.icon className="w-5 h-5 text-[#8B5CF6] flex-shrink-0" />
                  <div>
                    <span className="block text-[11px] font-medium text-[#A9A2CC] uppercase tracking-wider">
                      {item.label}
                    </span>
                    <span className="font-bold text-[#1A1429]">
                      {item.value}
                    </span>
                  </div>
                </div>
              ))}
              {/* Specialties col-span update */}
              <div className="bg-[#F8F7FF] p-4 rounded-2xl border border-[#E2E0EF] col-span-2 space-y-1">
                <span className="block text-[11px] font-medium text-[#A9A2CC] uppercase tracking-wider">
                  Specialties
                </span>
                <div className="flex flex-wrap gap-2 pt-1">
                  {selectedPartner?.specialties?.map((s) => (
                    <span
                      key={s}
                      className="bg-[#EDE9FE] text-[#6D28D9] text-xs font-semibold px-3 py-1 rounded-full border border-[#D8D1F7]"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Footer Fee + Button changed to Purple */}
            <div className="flex items-center justify-between pt-6 mt-2 border-t border-[#E2E0EF]">
              <div>
                <span className="text-xs text-[#6C5F8B] block font-medium">
                  Consultation Fee
                </span>
                <span className="font-extrabold text-[#1A1429] text-2xl">
                  ₹{selectedPartner?.minRate}
                  <span className="text-sm font-medium text-[#6C5F8B]">
                    /min
                  </span>
                </span>
              </div>
              <button
                onClick={() => {
                  setActiveProfileExpert(null);
                  setShowBooking(true);
                }}
                // Button background changed to primary purple
                className="bg-[#6D28D9] hover:bg-[#5B21B6] text-white px-8 py-4 rounded-2xl font-bold text-sm transition-all shadow-md hover:shadow-lg active:scale-95"
              >
                Book Appointment
              </button>
            </div>
          </div>
        </div>
      )}

      {showBooking && (
        <BookAppointmentPopup
          astrologer={selectedPartner}
          themeColor="#6D28D9" // Passing purple theme color to popups
          month={new Date().toLocaleString("default", {
            month: "long",
            year: "numeric",
          })}
          fee={selectedPartner?.minRate}
          balance={balance}
          onClose={() => setShowBooking(false)}
          setShowWallet={setShowWallet}
          onProceedToPayment={(details) => {
            setLastBooking(details);
            setShowSuccess(true);
          }}
        />
      )}

      {showWallet && (
        <InsufficientBalancePopup
          currentBalance={balance}
          themeColor="#6D28D9"
          requiredAmount={selectedPartner?.minRate || 0}
          onClose={() => setShowWallet(false)}
          onProceed={(amount) => {
            setBalance((prev) => Number(prev) + Number(amount));
            setShowWallet(false);
          }}
        />
      )}

      {showSuccess && (
        <BookingConfirmedPopup
          themeColor="#6D28D9"
          astrologer={{
            name: selectedPartner?.fullName || "Your Astrologer",
            tag: selectedPartner?.tag || "Vedic Expert",
            rating: selectedPartner?.averageRating || 0,
            image: selectedPartner?.profilePic,
          }}
          booking={{
            date: lastBooking?.date || "",
            time: lastBooking?.timeSlot || "",
            mode: lastBooking?.mode === "call" ? "Voice Call" : "Chat",
          }}
          onClose={() => setShowSuccess(false)}
          onMyBookings={() => {
            setShowSuccess(false);
            navigate("/dashboard/my-bookings");
          }}
        />
      )}
    </div>
  );
}
