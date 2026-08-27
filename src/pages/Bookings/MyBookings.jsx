import { useState, useEffect } from "react";
import { getMyBookings, cancelBooking } from "../../API/bookingApis";
import {
  initiateCall,
  terminateCall,
  initiateVideoCall,
} from "../../API/callApi";
import { useNavigate } from "react-router-dom";
import { getAstrologerById } from "../../API/homeApis";

import {
  Phone,
  Video,
  MessageCircle,
  X,
  CheckCircle2,
  AlertCircle,
  CalendarClock,
  CalendarX,
  Loader2,
} from "lucide-react";

export default function MyBookings() {
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("all");
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeCallModal, setActiveCallModal] = useState(null);
  const [callLoading, setCallLoading] = useState(false);

  const [messagePopup, setMessagePopup] = useState({
    show: false,
    type: "error",
    title: "",
    message: "",
  });

  const showMessage = (title, message, type = "error") => {
    setMessagePopup({ show: true, type, title, message });
  };

  const closeMessage = () => {
    setMessagePopup({ show: false, type: "error", title: "", message: "" });
  };

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const res = await getMyBookings();
      setBookings(res?.data?.data || []);
    } catch (error) {
      showMessage(
        "Unable to Load Bookings",
        error?.response?.data?.message || "Something went wrong while loading your bookings.",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const formatDate = (date) => {
    if (!date) return "";
    return new Date(date).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const normalizeMode = (mode) => {
    if (!mode) return "";
    return mode.toLowerCase().replace(/_/g, " ").trim();
  };

  const isChatBooking = (mode) => normalizeMode(mode).includes("chat");
  const isVoiceBooking = (mode) => normalizeMode(mode).includes("voice") || normalizeMode(mode).includes("audio");
  const isVideoBooking = (mode) => normalizeMode(mode).includes("video");

  const isPendingStatus = (status) => status === "pending";
  const isAcceptedStatus = (status) => ["accepted", "confirmed"].includes(status);
  const isCompletedStatus = (status) => status === "completed";
  const isCancelledStatus = (status) => ["cancelled", "rejected"].includes(status);

  const handleChat = async (booking) => {
    try {
      const id = booking?.partner?._id;
      if (!id) {
        showMessage("Invalid Partner", "Astrologer information is missing.", "error");
        return;
      }
      if (!booking?._id) {
        showMessage("Invalid Booking", "Booking information is missing.", "error");
        return;
      }
      
      const res = await getAstrologerById(id);
      const partnerDetails = res?.data?.data;
      if (!partnerDetails) {
        showMessage("Partner Not Found", "Unable to fetch astrologer details.", "error");
        return;
      }

      navigate(`/dashboard/chat/${id}`, {
        state: { partner: partnerDetails, partnerId: id, bookingId: booking._id },
      });
    } catch (error) {
      showMessage("Unable to Open Chat", error?.response?.data?.message || "Unable to fetch astrologer details.", "error");
    }
  };

  const handleVoiceCall = async (booking) => {
    try {
      if (!booking?._id) {
        showMessage("Invalid Booking", "Booking information is missing.", "error");
        return;
      }

      setCallLoading(true);
      const payload = { bookingId: booking._id };
      const res = await initiateCall(payload);

      if (res?.status === 200 || res?.data?.callSid) {
        showMessage("Call Connecting", res?.data?.message || "Connecting you with the astrologer. Please wait.", "success");
        setTimeout(() => {
          closeMessage();
          setActiveCallModal({ ...booking, callType: "voice" });
          setCallLoading(false);
        }, 1200);
        return;
      }

      setCallLoading(false);
      showMessage("Unable to Start Call", res?.data?.message || "Unable to connect the call. Please try again.", "error");
    } catch (error) {
      setCallLoading(false);
      showMessage("Unable to Start Call", error?.response?.data?.message || "Unable to connect the call. Please try again.", "error");
    }
  };

  const handleVideoCall = async (booking) => {
    try {
      if (!booking?._id) {
        showMessage("Invalid Booking", "Booking information is missing.", "error");
        return;
      }

      setCallLoading(true);
      const res = await initiateVideoCall(booking._id);

      if (res?.data?.success) {
        const callData = {
          rtcToken: res.data.rtcToken,
          rtmToken: res.data.rtmToken,
          channelName: res.data.channelName,
          uid: res.data.uid,
          appId: res.data.appId,
        };

        navigate(`/dashboard/video-call/${booking._id}`, {
          state: { booking, partner: booking.partner, callData },
        });
        return;
      }

      showMessage("Unable to Start Video Call", res?.data?.message || "Unable to start video call. Please try again.", "error");
    } catch (error) {
      showMessage("Unable to Start Video Call", error?.response?.data?.message || "Unable to start video call. Please try again.", "error");
    } finally {
      setCallLoading(false);
    }
  };

  const handleEndCall = async (bookingId) => {
    try {
      if (!bookingId) return;
      setCallLoading(true);
      const res = await terminateCall({ bookingId });
      setActiveCallModal(null);
      showMessage("Call Ended", res?.data?.message || "Your consultation call has been ended successfully.", "success");
    } catch (error) {
      setActiveCallModal(null);
      showMessage("Call Ended", "The call has been closed from your side.", "success");
    } finally {
      setCallLoading(false);
    }
  };

  const handleCancelBooking = async (booking) => {
    try {
      if (!booking?._id) {
        showMessage("Invalid Booking", "Booking ID is missing.", "error");
        return;
      }
      setLoading(true);
      const res = await cancelBooking(booking._id);

      if (res?.data?.success) {
        showMessage("Booking Cancelled", res?.data?.message || "Your booking has been cancelled successfully.", "success");
        await fetchBookings();
      } else {
        showMessage("Cancellation Failed", res?.data?.message || "Unable to cancel this booking.", "error");
      }
    } catch (error) {
      showMessage("Cancellation Failed", error?.response?.data?.message || "Unable to cancel this booking. Please try again.", "error");
    } finally {
      setLoading(false);
    }
  };

  const getFilteredAndSortedBookings = () => {
    let list = [...bookings];

    if (activeTab === "pending") list = list.filter((b) => isPendingStatus(b.status));
    else if (activeTab === "accepted") list = list.filter((b) => isAcceptedStatus(b.status));
    else if (activeTab === "completed") list = list.filter((b) => isCompletedStatus(b.status));
    else if (activeTab === "cancelled") list = list.filter((b) => isCancelledStatus(b.status));

    return list.sort((a, b) => {
      const getStatusWeight = (status) => {
        if (isAcceptedStatus(status)) return 1;
        if (isPendingStatus(status)) return 2;
        if (isCompletedStatus(status)) return 3;
        return 4;
      };
      const weightA = getStatusWeight(a.status);
      const weightB = getStatusWeight(b.status);

      if (weightA !== weightB) return weightA - weightB;
      return new Date(b.createdAt) - new Date(a.createdAt);
    });
  };

  const currentList = getFilteredAndSortedBookings();

  const renderModeButton = (booking) => {
    if (isChatBooking(booking.mode)) {
      return (
        <button
          onClick={() => handleChat(booking)}
          className="inline-flex flex-1 items-center justify-center gap-2 rounded-2xl px-5 py-3 text-sm font-bold transition-all md:flex-none bg-purple-50 text-purple-700 hover:bg-purple-100 active:scale-95"
        >
          <MessageCircle size={17} /> Chat
        </button>
      );
    }

    if (isVoiceBooking(booking.mode)) {
      return (
        <button
          onClick={() => handleVoiceCall(booking)}
          disabled={callLoading}
          className="inline-flex flex-1 items-center justify-center gap-2 rounded-2xl px-6 py-3 text-sm font-bold transition-all md:flex-none bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white shadow-lg shadow-purple-600/30 hover:opacity-95 active:scale-95 disabled:opacity-60"
        >
          {callLoading ? <Loader2 size={17} className="animate-spin" /> : <Phone size={17} />}
          {callLoading ? "Connecting..." : "Voice Call"}
        </button>
      );
    }

    if (isVideoBooking(booking.mode)) {
      return (
        <button
          onClick={() => handleVideoCall(booking)}
          disabled={callLoading}
          className="inline-flex flex-1 items-center justify-center gap-2 rounded-2xl px-6 py-3 text-sm font-bold transition-all md:flex-none bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-600/30 hover:opacity-95 active:scale-95 disabled:opacity-60"
        >
          {callLoading ? <Loader2 size={17} className="animate-spin" /> : <Video size={17} />}
          {callLoading ? "Connecting..." : "Video Call"}
        </button>
      );
    }
    return null;
  };

  const renderBookingsList = (list) => {
    if (list.length === 0) {
      return (
        <div className="py-20 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-purple-50">
            <CalendarClock size={28} className="text-purple-500" />
          </div>
          <p className="mt-4 font-semibold text-gray-400">No bookings found</p>
        </div>
      );
    }

    return (
      <div className="grid gap-6">
        {list.map((booking) => {
          const partner = booking.partner || {
            fullName: "Astrologer (Unassigned)",
            profilePic: "https://via.placeholder.com/150",
            specialties: [],
          };
          const pending = isPendingStatus(booking.status);
          const accepted = isAcceptedStatus(booking.status);

          let displayMode = "Consultation";
          if (isChatBooking(booking.mode)) displayMode = "Chat";
          else if (isVoiceBooking(booking.mode)) displayMode = "Voice Call";
          else if (isVideoBooking(booking.mode)) displayMode = "Video Call";

          return (
            <div key={booking._id} className="group relative overflow-hidden rounded-3xl border border-purple-100/80 bg-white p-6 shadow-xl shadow-purple-900/5 transition-all duration-300 hover:shadow-2xl hover:shadow-purple-900/10">
              <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
                <div className="flex items-start gap-4">
                  <div className="relative shrink-0">
                    <img src={partner.profilePic} alt={partner.fullName} className="h-16 w-16 rounded-2xl object-cover ring-4 ring-purple-50" />
                    <span className="absolute -bottom-1 -right-1 h-4 w-4 rounded-full border-2 border-white bg-emerald-500" />
                  </div>
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-lg font-bold text-gray-900">{partner.fullName}</h3>
                      <span className="rounded-full bg-purple-50 px-2.5 py-0.5 text-xs font-semibold capitalize text-purple-700">{displayMode}</span>
                    </div>
                    <p className="mt-1 text-xs font-medium text-purple-600">{partner.specialties?.length ? partner.specialties.join(", ") : "General Consultation"}</p>
                    <div className="mt-3 flex flex-wrap items-center gap-3 text-xs font-medium text-gray-500">
                      <span className="flex items-center gap-1.5 rounded-xl bg-gray-50 px-3 py-1.5">📅 {formatDate(booking.date)}</span>
                      <span className="flex items-center gap-1.5 rounded-xl bg-gray-50 px-3 py-1.5">⏰ {booking.timeSlot || "N/A"}</span>
                      <span className="flex items-center gap-1.5 rounded-xl bg-gray-50 px-3 py-1.5">⏳ {booking.duration || 0} Mins</span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col items-end justify-between gap-4 border-t border-gray-100 pt-4 md:border-t-0 md:pt-0">
                  <div className="text-right">
                    <span className="text-xs font-medium text-gray-400">Total Amount</span>
                    <p className="text-lg font-extrabold text-gray-900">₹{booking.totalFee || 0}</p>
                    <span className={`mt-1 inline-block rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${accepted ? "bg-emerald-50 text-emerald-600" : pending ? "bg-amber-50 text-amber-600" : isCompletedStatus(booking.status) ? "bg-blue-50 text-blue-600" : "bg-gray-100 text-gray-600"}`}>
                      {booking.status}
                    </span>
                  </div>

                  <div className="flex w-full flex-wrap items-center gap-3 md:w-auto">
                    {pending && (
                      <button onClick={() => handleCancelBooking(booking)} className="inline-flex flex-1 items-center justify-center gap-2 rounded-2xl bg-red-50 px-5 py-3 text-sm font-bold text-red-600 transition-all hover:bg-red-100 active:scale-95 md:flex-none">
                        <CalendarX size={17} /> Cancel
                      </button>
                    )}
                    {accepted && renderModeButton(booking)}
                    {isCompletedStatus(booking.status) && <span className="rounded-2xl bg-blue-50 px-4 py-3 text-xs font-bold text-blue-600">Consultation Completed</span>}
                    {isCancelledStatus(booking.status) && <span className="rounded-2xl bg-gray-100 px-4 py-3 text-xs font-bold text-gray-500">Booking Closed</span>}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#faf7ff] px-4 py-8 md:px-8">
      <div className="mx-auto max-w-5xl">
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-black tracking-tight text-gray-900">My Bookings</h1>
            <p className="mt-1 text-sm font-medium text-gray-500">Manage your consultation sessions with experts.</p>
          </div>
          <div className="flex flex-wrap rounded-2xl border border-purple-100 bg-white p-1.5 shadow-sm">
            {["all", "pending", "accepted", "completed", "cancelled"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`rounded-xl px-4 py-2 text-xs font-bold capitalize transition-all duration-300 ${activeTab === tab ? "bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white shadow-md" : "text-gray-500 hover:text-purple-700"}`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
        {loading ? (
          <div className="py-24 text-center">
            <Loader2 size={36} className="mx-auto animate-spin text-purple-600" />
            <p className="mt-3 text-sm font-medium text-gray-400">Loading your bookings...</p>
          </div>
        ) : (
          renderBookingsList(currentList)
        )}
      </div>

      {activeCallModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4 backdrop-blur-md">
          <div className="relative w-full max-w-md overflow-hidden rounded-[32px] border border-purple-500/20 bg-gradient-to-b from-purple-950 via-gray-950 to-black p-8 text-center text-white shadow-2xl">
            <div className="absolute -left-24 -top-24 h-48 w-48 rounded-full bg-purple-600/30 blur-3xl" />
            <div className="absolute -bottom-24 -right-24 h-48 w-48 rounded-full bg-fuchsia-600/30 blur-3xl" />
            <button onClick={() => setActiveCallModal(null)} className="absolute right-5 top-5 z-20 flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-gray-300 transition hover:bg-white/20 hover:text-white">
              <X size={18} />
            </button>
            <div className="relative z-10 flex flex-col items-center">
              <div className="relative mb-6">
                <div className="absolute -inset-4 animate-pulse rounded-full bg-gradient-to-r from-violet-500 to-fuchsia-500 opacity-70 blur-lg" />
                <img src={activeCallModal.partner?.profilePic || "https://via.placeholder.com/150"} alt={activeCallModal.partner?.fullName || "Astrologer"} className="relative h-28 w-28 rounded-full object-cover shadow-2xl ring-4 ring-white/20" />
                <span className="absolute bottom-1 right-1 flex h-7 w-7 items-center justify-center rounded-full bg-emerald-500 ring-4 ring-gray-950">
                  <Phone size={13} />
                </span>
              </div>
              <h2 className="text-2xl font-black tracking-tight">{activeCallModal.partner?.fullName || "Astrologer"}</h2>
              <p className="mt-1 text-sm font-medium text-purple-300">{activeCallModal.partner?.specialties?.join(", ") || "General Consultation"}</p>
              <div className="my-8 flex flex-col items-center">
                <div className="mb-4 flex items-center gap-2">
                  <span className="h-2.5 w-2.5 animate-ping rounded-full bg-emerald-400" />
                  <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
                </div>
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-400">Calling Astrologer...</p>
                <p className="mt-2 text-xs text-gray-400">Please wait while your call is being connected.</p>
              </div>
              <button onClick={() => handleEndCall(activeCallModal?._id)} disabled={callLoading} className="inline-flex items-center justify-center gap-2 rounded-2xl bg-red-600 px-10 py-4 text-sm font-bold text-white shadow-lg shadow-red-600/40 transition-all hover:bg-red-700 active:scale-95 disabled:cursor-not-allowed disabled:opacity-60">
                {callLoading ? <Loader2 size={18} className="animate-spin" /> : <Phone size={18} />}
                {callLoading ? "Ending..." : "End Call"}
              </button>
            </div>
          </div>
        </div>
      )}

      {messagePopup.show && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 px-4 backdrop-blur-sm">
          <div className="relative w-full max-w-sm overflow-hidden rounded-[28px] bg-white shadow-2xl">
            <div className={`h-1.5 w-full ${messagePopup.type === "success" ? "bg-gradient-to-r from-emerald-400 to-green-600" : "bg-gradient-to-r from-red-500 to-rose-600"}`} />
            <button onClick={closeMessage} className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-gray-500 transition hover:bg-gray-200">
              <X size={16} />
            </button>
            <div className="p-7 text-center">
              <div className="mb-5 flex justify-center">
                <div className={`flex h-16 w-16 items-center justify-center rounded-full ${messagePopup.type === "success" ? "bg-emerald-50" : "bg-red-50"}`}>
                  {messagePopup.type === "success" ? <CheckCircle2 size={34} className="text-emerald-500" /> : <AlertCircle size={34} className="text-red-500" />}
                </div>
              </div>
              <h3 className="text-xl font-black text-gray-900">{messagePopup.title}</h3>
              <p className="mt-3 text-sm leading-6 text-gray-500">{messagePopup.message}</p>
              <button onClick={closeMessage} className={`mt-6 w-full rounded-2xl px-5 py-3.5 text-sm font-bold text-white shadow-lg transition-all active:scale-95 ${messagePopup.type === "success" ? "bg-gradient-to-r from-violet-600 to-fuchsia-600 shadow-purple-500/30" : "bg-gradient-to-r from-red-500 to-rose-600 shadow-red-500/30"}`}>
                Okay
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}