import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Eye,
  Star,
  Play,
  Plus,
  Sparkles,
  Search,
  X,
  Mic,
  MicOff,
  Video,
  VideoOff,
  Radio,
  Send,
  Gift,
} from "lucide-react";
import { getActiveGifts, sendLiveGift } from "../../API/giftApis";
import { getActiveSessions, joinAgoraSession } from "../../API/agoraApi";
import AgoraRTC from "agora-rtc-sdk-ng";

export default function LiveStream() {
  const [streams, setStreams] = useState([]);
  const [totalSessions, setTotalSessions] = useState(0);
  const [loading, setLoading] = useState(false);
  const [joinedStream, setJoinedStream] = useState(null);
  const [agoraClient, setAgoraClient] = useState(null);
  const [localAudioTrack, setLocalAudioTrack] = useState(null);
  const [localVideoTrack, setLocalVideoTrack] = useState(null);
  const [remoteUsers, setRemoteUsers] = useState([]);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);

  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");

  const [gifts, setGifts] = useState([]);
  const [showGiftPanel, setShowGiftPanel] = useState(false);
  const [selectedGift, setSelectedGift] = useState(null);
  const [sendingGift, setSendingGift] = useState(false);
  const [giftMessage, setGiftMessage] = useState("");

  // Refs
  const remoteVideoRef = useRef(null);
  const commentsEndRef = useRef(null);
  const agoraClientRef = useRef(null); // RTC client — used for chat via data stream too
  const localUidRef = useRef(null); // our own rtc uid, to ignore echoed-back messages

  const loadActiveGifts = async () => {
    try {
      const response = await getActiveGifts();
      if (response.data?.success) {
        setGifts(response.data.gifts || []);
      } else {
        setGifts([]);
      }
    } catch (error) {
      console.error(
        "Failed to load active gifts:",
        error.response?.data || error.message,
      );
    }
  };

  useEffect(() => {
    const fetchActiveSessions = async () => {
      setLoading(true);
      try {
        const response = await getActiveSessions();
        if (response.data && response.data.success) {
          setStreams(response.data.sessions || []);
          setTotalSessions(response.data.total || 0);
        } else {
          setStreams([]);
          setTotalSessions(0);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchActiveSessions();
  }, []);

  useEffect(() => {
    commentsEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [comments]);

  // Decode an incoming stream-message payload (Uint8Array) into a comment object
  const handleIncomingStreamMessage = (uid, payload) => {
    try {
      // Ignore our own echoed-back message (mirrors the Flutter app's guard)
      if (localUidRef.current != null && uid === localUidRef.current) {
        return;
      }

      const jsonString = new TextDecoder().decode(payload);
      const parsed = JSON.parse(jsonString);

      const sender = parsed.user || parsed.sender || "Host";
      const text = parsed.text || parsed.message || "";

      if (!text) return;

      setComments((prev) => {
        const messageId =
          parsed.messageId || parsed.id || `${uid}-${Date.now()}`;

        if (prev.some((item) => item.messageId === messageId)) return prev;

        return [
          ...prev,
          {
            messageId,
            user: sender,
            text,
            timestamp:
              parsed.timestamp ||
              new Date().toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              }),
          },
        ];
      });
    } catch (err) {
      console.error("Stream Message Decode Error:", err);
    }
  };

  const handleJoinStream = async (stream) => {
    try {
      const payload = {
        sessionId: stream._id,
        userId: "6a60638240b5df06fa258b16",
      };

      const res = await joinAgoraSession(payload);
      const responseData = res.data?.data || res.data;

      if (!responseData) {
        console.error("Invalid Agora response");
        return;
      }

      await loadActiveGifts();

      setJoinedStream({
        ...stream,
        ...responseData,
      });

      setComments([
        {
          messageId: `system-${Date.now()}`,
          user: "System",
          text: "Welcome to the live cosmic session!",
          timestamp: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
        },
      ]);

      const appId = responseData.appId || "0228c9fe15a54e20a48e44835be49d7c";
      const channelName = responseData.channelName;
      const rtcToken = responseData.rtcToken;
      const uid = responseData.uid;

      console.log("Agora Details:", {
        appId,
        channelName,
        uid,
        hasRtcToken: !!rtcToken,
      });

      // =====================================================
      // RTC (video/audio + chat via data stream)
      // =====================================================
      const client = AgoraRTC.createClient({
        mode: "live",
        codec: "vp8",
      });

      await client.setClientRole("audience");
      agoraClientRef.current = client;
      setAgoraClient(client);

      client.on("user-published", async (user, mediaType) => {
        try {
          await client.subscribe(user, mediaType);
          console.log("RTC User Published:", user.uid, mediaType);

          if (mediaType === "video" && user.videoTrack) {
            setRemoteUsers((prev) => {
              const exists = prev.some((u) => u.uid === user.uid);
              if (exists) return prev;
              return [...prev, user];
            });

            setTimeout(() => {
              if (remoteVideoRef.current && user.videoTrack) {
                user.videoTrack.play(remoteVideoRef.current);
              }
            }, 300);
          }

          if (mediaType === "audio" && user.audioTrack) {
            user.audioTrack.play();
          }
        } catch (error) {
          console.error("RTC Subscribe Error:", error);
        }
      });

      client.on("user-unpublished", (user, mediaType) => {
        console.log("RTC User Unpublished:", user.uid, mediaType);
        if (mediaType === "video") {
          setRemoteUsers((prev) => prev.filter((u) => u.uid !== user.uid));
        }
      });

      client.on("user-left", (user) => {
        console.log("RTC User Left:", user.uid);
        setRemoteUsers((prev) => prev.filter((u) => u.uid !== user.uid));
      });

      // Chat messages arrive here (Agora RTC data-stream — same mechanism as the app)
      client.on("stream-message", (streamUid, payload) => {
        console.log("Stream message received from:", streamUid);
        handleIncomingStreamMessage(streamUid, payload);
      });

      client.on("connection-state-change", (curState, prevState, reason) => {
        console.log("RTC connection state:", prevState, "->", curState, reason);
      });

      const joinedUid = await client.join(appId, channelName, rtcToken, uid);
      localUidRef.current = joinedUid;
      console.log("RTC Connected:", channelName, "uid:", joinedUid);
    } catch (error) {
      console.error(
        "Join Stream Error:",
        error.response?.data || error.message,
      );
    }
  };

  const handleLeaveStream = async () => {
    try {
      // Stop local tracks
      if (localAudioTrack) {
        localAudioTrack.stop();
        localAudioTrack.close();
      }
      if (localVideoTrack) {
        localVideoTrack.stop();
        localVideoTrack.close();
      }

      // Leave RTC (data-stream / chat cleans up automatically with the channel)
      const client = agoraClientRef.current;
      if (client) {
        try {
          await client.leave();
          console.log("RTC Left");
        } catch (error) {
          console.error("RTC Leave Error:", error);
        }
      }

      agoraClientRef.current = null;
      localUidRef.current = null;

      setJoinedStream(null);
      setAgoraClient(null);
      setLocalAudioTrack(null);
      setLocalVideoTrack(null);
      setRemoteUsers([]);
      setComments([]);
      setIsMuted(false);
      setIsVideoOff(false);

      console.log("Left Live Stream Successfully");
    } catch (error) {
      console.error("Leave Stream Error:", error);
    }
  };

  const handleSendGift = async () => {
    if (!selectedGift) return;

    if (!joinedStream?._id) {
      console.error("Live session ID is missing");
      return;
    }

    try {
      setSendingGift(true);
      setGiftMessage("");

      const response = await sendLiveGift({
        giftId: selectedGift._id,
        sessionId: joinedStream._id,
      });

      if (response.data?.success) {
        const giftData = response.data.data;

        setGiftMessage(`${giftData.giftName} sent successfully!`);

        const giftChatMessage = {
          messageId: `gift-${Date.now()}`,
          user: "You",
          text: `🎁 Sent ${giftData.giftName}`,
          timestamp: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
        };

        setComments((prev) => [...prev, giftChatMessage]);

        setSelectedGift(null);
        setShowGiftPanel(false);

        console.log("Gift sent successfully:", giftData);
      }
    } catch (error) {
      console.error("Send Gift Error:", error.response?.data || error.message);
      setGiftMessage(error.response?.data?.message || "Unable to send gift");
    } finally {
      setSendingGift(false);
    }
  };

  const toggleAudio = async () => {
    if (localAudioTrack) {
      await localAudioTrack.setEnabled(!isMuted);
      setIsMuted(!isMuted);
    }
  };

  const toggleVideo = async () => {
    if (localVideoTrack) {
      await localVideoTrack.setEnabled(!isVideoOff);
      setIsVideoOff(!isVideoOff);
    }
  };

  const handleSendComment = async (e) => {
    e.preventDefault();

    const text = newComment.trim();
    if (!text) return;

    const client = agoraClientRef.current;

    if (!client) {
      console.warn("RTC client is not connected");
      return;
    }

    const messageId = `${Date.now()}-${Math.random()
      .toString(36)
      .substring(2, 8)}`;

    const messageData = {
      messageId,
      user: "You",
      text,
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    try {
      // Show instantly in own chat (sender doesn't need to wait for the echo)
      setComments((prev) => [...prev, messageData]);
      setNewComment("");

      await client.sendStreamMessage(JSON.stringify(messageData), false);

      console.log("Message Sent Successfully:", messageData);
    } catch (error) {
      console.error("Send Stream Message Error:", error);

      // Remove optimistic message if sending failed
      setComments((prev) =>
        prev.filter((item) => item.messageId !== messageId),
      );
      setNewComment(text);
    }
  };

  const topChoice =
    streams.length > 0
      ? {
          id: streams[0]._id,
          rawData: streams[0],
          name: streams[0].partnerId?.fullName || "Cosmic Expert",
          specialty: streams[0].topic || "Interactive Cosmic Session",
          viewers: streams[0].viewerCount || 0,
          rating: streams[0].partnerId?.averageRating || "5.0",
          category: streams[0].category,
          image:
            streams[0].partnerId?.profilePic ||
            "https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&q=80&w=1200",
          avatar:
            streams[0].partnerId?.profilePic ||
            "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200",
        }
      : null;

  const liveStreamsList = streams.length > 1 ? streams.slice(1) : [];

  return (
    <div className="w-full min-h-screen bg-[#FAF8FF] text-slate-800 font-sans relative flex flex-col justify-between pb-20">
      <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-purple-200/30 rounded-full blur-3xl pointer-events-none -translate-y-1/2" />
      <div className="absolute top-1/2 left-0 w-[500px] h-[500px] bg-amber-100/40 rounded-full blur-3xl pointer-events-none -translate-y-1/2" />

      <main className="w-full px-4 sm:px-6 lg:px-12 py-12 relative z-10 flex-1 space-y-10">
        <div className="w-full flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-purple-100">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-purple-900 font-semibold text-xs tracking-widest uppercase">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>Spiritual Guidance</span>
            </div>
            <h1 className="font-serif text-3xl md:text-5xl font-bold text-indigo-950 tracking-tight">
              Cosmic Broadcasts
            </h1>
            <p className="text-sm md:text-base text-slate-500">
              Join live interactive sessions with verified spiritual experts.
            </p>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-2 bg-white/80 border border-purple-100 rounded-2xl px-4 py-3 text-xs text-slate-600 shadow-sm">
              <Search className="w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search experts..."
                className="bg-transparent outline-none w-48 placeholder-slate-400"
              />
            </div>

            <div className="flex items-center gap-2 bg-emerald-50 text-emerald-700 border border-emerald-200/80 px-4 py-3 rounded-2xl text-xs font-semibold shadow-sm">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              <span>{totalSessions} Active Sessions</span>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-20 w-full">
            <div className="w-8 h-8 border-4 border-purple-950 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : streams.length === 0 ? (
          <div className="text-center py-20 bg-white/60 rounded-3xl border border-purple-100/80 w-full">
            <p className="text-slate-500 text-sm font-medium">
              No live streams available right now.
            </p>
          </div>
        ) : (
          <div className="w-full space-y-10">
            {topChoice && (
              <div className="space-y-4 w-full">
                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-amber-500" />
                    <h2 className="font-serif text-2xl font-bold text-indigo-950">
                      Featured Session
                    </h2>
                  </div>
                  <span className="text-xs font-semibold text-purple-900 bg-purple-50 px-3 py-1 rounded-full border border-purple-100">
                    Top Rated
                  </span>
                </div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="relative w-full h-[380px] md:h-[480px] rounded-3xl overflow-hidden shadow-2xl border border-purple-100/80 group cursor-pointer"
                >
                  <img
                    src={topChoice.image}
                    alt={topChoice.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />

                  <div className="absolute top-6 left-6 right-6 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="bg-rose-600 text-white text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1.5 shadow-md">
                        <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
                        BROADCASTING
                      </span>
                      <span className="bg-black/40 backdrop-blur-md text-white text-xs font-semibold px-3 py-1 rounded-full flex items-center gap-1.5 border border-white/20">
                        <Eye className="w-3.5 h-3.5 text-amber-300" />
                        {topChoice.viewers} Watching
                      </span>
                    </div>

                    <div className="w-10 h-10 rounded-full bg-amber-400 text-slate-950 flex items-center justify-center shadow-lg">
                      <Star className="w-5 h-5 fill-slate-950" />
                    </div>
                  </div>

                  <div className="absolute bottom-6 left-6 right-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
                    <div className="space-y-2 text-white max-w-xl">
                      <h3 className="font-serif text-3xl md:text-5xl font-bold tracking-tight">
                        {topChoice.name}
                      </h3>
                      <p className="text-sm md:text-base text-slate-200 font-normal">
                        {topChoice.specialty}
                      </p>
                    </div>

                    <motion.button
                      onClick={() => handleJoinStream(topChoice.rawData)}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="px-6 py-3.5 bg-amber-400 hover:bg-amber-300 text-indigo-950 font-bold text-sm rounded-2xl shadow-xl flex items-center gap-2 self-start md:self-auto"
                    >
                      <Play className="w-4 h-4 fill-indigo-950" />
                      <span>Join Session</span>
                    </motion.button>
                  </div>
                </motion.div>
              </div>
            )}

            {liveStreamsList.length > 0 && (
              <div className="space-y-6 w-full">
                <div className="flex items-center justify-between border-b border-purple-100/80 pb-4 w-full">
                  <h2 className="font-serif text-2xl font-bold text-indigo-950">
                    All Broadcasts
                  </h2>
                  <span className="text-xs font-medium text-slate-500">
                    Available rooms
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 w-full">
                  {liveStreamsList.map((stream, idx) => {
                    const partnerName =
                      stream.partnerId?.fullName || "Astrologer";
                    const partnerPic =
                      stream.partnerId?.profilePic ||
                      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=800";
                    const rating = stream.partnerId?.averageRating || "4.8";

                    return (
                      <motion.div
                        key={stream._id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        className="bg-white/90 backdrop-blur-sm rounded-3xl overflow-hidden border border-purple-100/80 shadow-lg shadow-purple-950/5 hover:shadow-xl hover:border-purple-200 transition-all group flex flex-col justify-between w-full"
                      >
                        <div className="relative h-56 w-full overflow-hidden">
                          <img
                            src={partnerPic}
                            alt={partnerName}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />

                          <div className="absolute top-3 left-3 flex items-center gap-2">
                            <span className="bg-rose-600 text-white text-[10px] font-bold px-2.5 py-0.5 rounded-md shadow-sm">
                              LIVE
                            </span>
                            <span className="bg-slate-950/60 backdrop-blur-md text-white text-[11px] font-medium px-2 py-0.5 rounded-md flex items-center gap-1">
                              <Eye className="w-3 h-3 text-amber-300" />
                              {stream.viewerCount || 0}
                            </span>
                          </div>

                          <div
                            onClick={() => handleJoinStream(stream)}
                            className="absolute inset-0 bg-slate-950/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer"
                          >
                            <div className="w-12 h-12 rounded-full bg-purple-900/90 text-amber-300 flex items-center justify-center shadow-lg transform scale-90 group-hover:scale-100 transition-transform">
                              <Play className="w-5 h-5 fill-amber-300 ml-0.5" />
                            </div>
                          </div>
                        </div>

                        <div className="p-5 space-y-4 flex-1 flex flex-col justify-between w-full">
                          <div className="flex items-center gap-3">
                            <img
                              src={partnerPic}
                              alt={partnerName}
                              className="w-10 h-10 rounded-full object-cover ring-2 ring-purple-100"
                            />
                            <div className="overflow-hidden">
                              <h4 className="font-serif text-base font-bold text-indigo-950 truncate">
                                {partnerName}
                              </h4>
                              <p className="text-xs text-slate-500 truncate">
                                {stream.topic || "Cosmic Guidance"}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                            <span className="text-[11px] font-semibold text-purple-800 bg-purple-50 px-2.5 py-1 rounded-full border border-purple-100 truncate max-w-[120px]">
                              {stream.category}
                            </span>

                            <div className="flex items-center gap-1 text-xs font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded-lg border border-amber-200/60">
                              <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                              <span>{rating}</span>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      <AnimatePresence>
        {joinedStream && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-xl flex items-center justify-center p-2 sm:p-4 md:p-6"
          >
            <div className="relative w-full max-w-7xl h-[92vh] bg-slate-900 rounded-3xl overflow-hidden shadow-2xl border border-purple-500/30 flex flex-col lg:flex-row">
              <div className="absolute top-4 left-4 right-4 z-30 flex items-center justify-between pointer-events-none">
                <div className="flex items-center gap-3 bg-black/60 backdrop-blur-md px-4 py-2 rounded-2xl border border-white/10 text-white pointer-events-auto">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-600 animate-pulse" />
                  <span className="text-sm font-semibold">
                    {joinedStream.topic || "Live Session"}
                  </span>
                </div>

                <button
                  onClick={handleLeaveStream}
                  className="w-10 h-10 rounded-full bg-rose-600 text-white flex items-center justify-center shadow-lg hover:bg-rose-500 transition-colors pointer-events-auto cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex-1 relative w-full h-full bg-slate-950 flex items-center justify-center">
                <div
                  ref={remoteVideoRef}
                  className="w-full h-full absolute inset-0 object-cover"
                />

                {remoteUsers.length === 0 && (
                  <div className="text-center space-y-3 z-20">
                    <div className="w-16 h-16 rounded-full bg-purple-900/50 text-amber-300 flex items-center justify-center mx-auto animate-pulse border border-purple-500/30">
                      <Radio className="w-8 h-8" />
                    </div>
                    <p className="text-slate-300 text-sm font-medium">
                      Connecting to stream...
                    </p>
                  </div>
                )}

                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 flex items-center gap-4 bg-black/60 backdrop-blur-md px-6 py-3 rounded-2xl border border-white/10">
                  <button
                    onClick={toggleAudio}
                    className={`w-12 h-12 rounded-full flex items-center justify-center text-white transition-colors cursor-pointer ${isMuted ? "bg-rose-600" : "bg-slate-800 hover:bg-slate-700"}`}
                  >
                    {isMuted ? (
                      <MicOff className="w-5 h-5" />
                    ) : (
                      <Mic className="w-5 h-5" />
                    )}
                  </button>

                  <button
                    onClick={toggleVideo}
                    className={`w-12 h-12 rounded-full flex items-center justify-center text-white transition-colors cursor-pointer ${isVideoOff ? "bg-rose-600" : "bg-slate-800 hover:bg-slate-700"}`}
                  >
                    {isVideoOff ? (
                      <VideoOff className="w-5 h-5" />
                    ) : (
                      <Video className="w-5 h-5" />
                    )}
                  </button>
                  <button
                    onClick={() => {
                      setShowGiftPanel(true);
                      setGiftMessage("");
                    }}
                    className="w-12 h-12 rounded-full flex items-center justify-center text-white bg-purple-700 hover:bg-purple-600 transition-colors cursor-pointer"
                    title="Send Gift"
                  >
                    <Gift className="w-5 h-5" />
                  </button>

                  <button
                    onClick={handleLeaveStream}
                    className="px-5 py-3 rounded-2xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold shadow-lg transition-colors cursor-pointer"
                  >
                    Leave Stream
                  </button>
                </div>
              </div>

              <div className="w-full lg:w-96 bg-slate-950 border-t lg:border-t-0 lg:border-l border-white/10 flex flex-col h-[40vh] lg:h-full z-40 relative">
                <div className="p-4 border-b border-white/10 flex items-center justify-between shrink-0">
                  <h3 className="font-serif font-bold text-white text-base">
                    Live Chat
                  </h3>
                  <span className="text-xs text-purple-300 bg-purple-900/40 px-2.5 py-1 rounded-full border border-purple-500/35">
                    {comments.length} Messages
                  </span>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-3 min-h-0">
                  {comments.map((c, index) => (
                    <div
                      key={c.messageId || index}
                      className="bg-white/5 border border-white/10 rounded-2xl p-3 space-y-1"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-amber-400">
                          {c.user}
                        </span>
                        {c.timestamp && (
                          <span className="text-[10px] text-slate-500">
                            {c.timestamp}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-200 leading-relaxed break-words">
                        {c.text}
                      </p>
                    </div>
                  ))}
                  <div ref={commentsEndRef} />
                </div>

                <form
                  onSubmit={handleSendComment}
                  className="p-3 border-t border-white/10 flex items-center gap-2 bg-slate-900 shrink-0"
                >
                  <input
                    type="text"
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Ask or comment..."
                    className="flex-1 bg-white/10 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-400 outline-none focus:border-amber-400 transition-colors"
                  />
                  <button
                    type="submit"
                    className="w-10 h-10 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 flex items-center justify-center transition-colors shadow-md cursor-pointer shrink-0"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </form>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showGiftPanel && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[70] bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-4"
            onClick={() => setShowGiftPanel(false)}
          >
            <motion.div
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 100, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-lg bg-slate-900 border border-purple-500/30 rounded-3xl shadow-2xl overflow-hidden"
            >
              <div className="flex items-center justify-between px-5 py-4 border-b border-white/10">
                <div>
                  <h3 className="text-white font-bold text-lg">
                    Send a Gift 🎁
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">
                    Support the astrologer during the live session
                  </p>
                </div>

                <button
                  onClick={() => setShowGiftPanel(false)}
                  className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="p-5">
                {gifts.length === 0 ? (
                  <div className="text-center py-10">
                    <Gift className="w-10 h-10 text-purple-400 mx-auto mb-3" />
                    <p className="text-slate-300 text-sm">
                      No gifts available right now.
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-4 gap-3">
                    {gifts.map((gift) => (
                      <button
                        key={gift._id}
                        onClick={() => setSelectedGift(gift)}
                        className={`rounded-2xl p-3 border transition-all ${
                          selectedGift?._id === gift._id
                            ? "border-amber-400 bg-amber-400/10 scale-105"
                            : "border-white/10 bg-white/5 hover:bg-white/10"
                        }`}
                      >
                        <div className="w-14 h-14 mx-auto flex items-center justify-center">
                          <img
                            src={gift.iconUrl}
                            alt={gift.giftName}
                            className="w-full h-full object-contain"
                          />
                        </div>

                        <p className="text-white text-xs font-semibold mt-2 truncate">
                          {gift.giftName}
                        </p>

                        <p className="text-amber-400 text-xs font-bold mt-1">
                          {gift.price}
                        </p>
                      </button>
                    ))}
                  </div>
                )}

                {selectedGift && (
                  <div className="mt-5 p-4 rounded-2xl bg-white/5 border border-white/10">
                    <div className="flex items-center gap-3">
                      <div className="w-14 h-14 rounded-xl bg-purple-900/40 flex items-center justify-center">
                        <img
                          src={selectedGift.iconUrl}
                          alt={selectedGift.giftName}
                          className="w-10 h-10 object-contain"
                        />
                      </div>

                      <div className="flex-1">
                        <p className="text-white font-bold">
                          {selectedGift.giftName}
                        </p>
                        <p className="text-xs text-slate-400">
                          Gift value:{" "}
                          <span className="text-amber-400 font-bold">
                            {selectedGift.price}
                          </span>
                        </p>
                      </div>

                      <button
                        onClick={handleSendGift}
                        disabled={sendingGift}
                        className="px-5 py-3 rounded-xl bg-amber-400 hover:bg-amber-300 disabled:opacity-50 disabled:cursor-not-allowed text-slate-950 font-bold text-xs flex items-center gap-2"
                      >
                        <Gift className="w-4 h-4" />
                        {sendingGift ? "Sending..." : "Send Gift"}
                      </button>
                    </div>
                  </div>
                )}

                {giftMessage && (
                  <div className="mt-4 text-center text-xs font-semibold text-emerald-400">
                    {giftMessage}
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        className="fixed bottom-8 right-8 z-40"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.5, type: "spring", stiffness: 260, damping: 20 }}
      >
        <motion.button
          whileHover={{ scale: 1.1, rotate: 90 }}
          whileTap={{ scale: 0.9 }}
          className="w-16 h-16 rounded-full bg-amber-400 hover:bg-amber-300 text-slate-950 flex items-center justify-center shadow-2xl shadow-amber-500/40 border-2 border-white ring-4 ring-amber-400/20 group cursor-pointer"
          title="Schedule Session"
        >
          <Plus className="w-8 h-8 text-slate-950 stroke-[2.5]" />
        </motion.button>
      </motion.div>

      <footer className="w-full text-center py-6 border-t border-slate-200/60 text-xs text-slate-400 bg-white/40">
        &copy; {new Date().getFullYear()} Live Astro Network. All spiritual
        sessions are end-to-end encrypted.
      </footer>
    </div>
  );
}
