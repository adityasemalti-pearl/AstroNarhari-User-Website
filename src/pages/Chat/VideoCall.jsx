import React, {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import AgoraRTC from "agora-rtc-sdk-ng";
import {
  AlertCircle,
  Loader2,
  Mic,
  MicOff,
  PhoneOff,
  RefreshCw,
  User,
  Video,
  VideoOff,
  Volume2,
  VolumeX,
} from "lucide-react";
import { initiateVideoCall, terminateVideoCall } from "../../API/callApi";

const VideoCallScreen = () => {
  const { bookingId: paramBookingId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  // =========================================================
  // BOOKING DATA
  // =========================================================
  const booking = location.state?.booking;
  const partner = location.state?.partner;

  const bookingId = paramBookingId || booking?._id || booking?.id;

  const astrologerName =
    partner?.fullName ||
    partner?.name ||
    booking?.partner?.fullName ||
    booking?.partner?.name ||
    "Astrologer";

  const astrologerPhotoUrl =
    partner?.profilePic ||
    partner?.profileImage ||
    partner?.image ||
    booking?.partner?.profilePic ||
    booking?.partner?.profileImage ||
    "";

  // =========================================================
  // REFS
  // =========================================================
  const clientRef = useRef(null);
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);

  const localAudioTrackRef = useRef(null);
  const localVideoTrackRef = useRef(null);
  const remoteUserRef = useRef(null);

  const mountedRef = useRef(false);
  const initializingRef = useRef(false);
  const endingRef = useRef(false);

  const timerRef = useRef(null);
  const elapsedSecondsRef = useRef(0);

  // =========================================================
  // STATE
  // =========================================================
  const [callStatus, setCallStatus] = useState("connecting"); // connecting | waiting | in-progress | completed | failed
  const [errorMessage, setErrorMessage] = useState(null);
  const [remoteJoined, setRemoteJoined] = useState(false);
  const [isLocalVideoEnabled, setIsLocalVideoEnabled] = useState(true);
  const [isMicMuted, setIsMicMuted] = useState(false);
  const [isSpeakerOn, setIsSpeakerOn] = useState(true);
  const [isFrontCamera, setIsFrontCamera] = useState(true);
  const [formattedElapsed, setFormattedElapsed] = useState("00:00");
  const [connecting, setConnecting] = useState(true);
  const [joined, setJoined] = useState(false);
  const [ending, setEnding] = useState(false);

  // =========================================================
  // TIMER
  // =========================================================
  const startElapsedTimer = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    elapsedSecondsRef.current = 0;
    setFormattedElapsed("00:00");

    timerRef.current = setInterval(() => {
      elapsedSecondsRef.current += 1;
      const minutes = Math.floor(elapsedSecondsRef.current / 60);
      const seconds = elapsedSecondsRef.current % 60;
      setFormattedElapsed(
        `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`
      );
    }, 1000);
  }, []);

  const stopElapsedTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  // =========================================================
  // REMOTE VIDEO & AUDIO
  // =========================================================
  const clearRemoteVideo = useCallback(() => {
    if (remoteVideoRef.current) {
      try {
        remoteVideoRef.current.innerHTML = "";
      } catch (e) {}
    }
  }, []);

  const playRemoteVideo = useCallback((user) => {
    if (!user?.videoTrack || !remoteVideoRef.current) return;
    try {
      remoteVideoRef.current.innerHTML = "";
      user.videoTrack.play(remoteVideoRef.current);
    } catch (e) {
      console.error("Remote video play error:", e);
    }
  }, []);

  const playRemoteAudio = useCallback(
    (user) => {
      if (!user?.audioTrack) return;
      try {
        user.audioTrack.setVolume(isSpeakerOn ? 100 : 0);
        user.audioTrack.play();
      } catch (e) {
        console.error("Remote audio play error:", e);
      }
    },
    [isSpeakerOn]
  );

  // =========================================================
  // RELEASE ENGINE (CLEANUP)
  // =========================================================
  const releaseEngine = useCallback(async () => {
    stopElapsedTimer();

    if (localAudioTrackRef.current) {
      try { localAudioTrackRef.current.stop(); } catch {}
      try { localAudioTrackRef.current.close(); } catch {}
      localAudioTrackRef.current = null;
    }

    if (localVideoTrackRef.current) {
      try { localVideoTrackRef.current.stop(); } catch {}
      try { localVideoTrackRef.current.close(); } catch {}
      localVideoTrackRef.current = null;
    }

    if (clientRef.current) {
      try { clientRef.current.removeAllListeners(); } catch {}
      try {
        if (clientRef.current.connectionState !== "DISCONNECTED") {
          await clientRef.current.leave();
        }
      } catch {}
      clientRef.current = null;
    }

    remoteUserRef.current = null;
    clearRemoteVideo();

    if (mountedRef.current) {
      setJoined(false);
      setRemoteJoined(false);
    }
  }, [clearRemoteVideo, stopElapsedTimer]);

  // =========================================================
  // LOCAL MEDIA (CAMERA & MIC)
  // =========================================================
  const createLocalAudio = useCallback(async () => {
    try {
      const track = await AgoraRTC.createMicrophoneAudioTrack();
      localAudioTrackRef.current = track;
      if (mountedRef.current) setIsMicMuted(false);
      return track;
    } catch (e) {
      console.warn("⚠️ Microphone not accessible:", e);
      localAudioTrackRef.current = null;
      if (mountedRef.current) setIsMicMuted(true);
      return null;
    }
  }, []);

  const createLocalVideo = useCallback(async () => {
    try {
      const track = await AgoraRTC.createCameraVideoTrack();
      localVideoTrackRef.current = track;
      if (mountedRef.current) setIsLocalVideoEnabled(true);

      if (localVideoRef.current) {
        try {
          track.play(localVideoRef.current);
        } catch {}
      }
      return track;
    } catch (e) {
      console.warn("⚠️ Camera not accessible:", e);
      localVideoTrackRef.current = null;
      if (mountedRef.current) setIsLocalVideoEnabled(false);
      return null;
    }
  }, []);

  // =========================================================
  // INIT AGORA RTC
  // =========================================================
  const initAgoraEngine = useCallback(
    async (session) => {
      const { appId, channelName, rtcToken, uid } = session;

      if (!appId || !channelName || !rtcToken || uid === undefined) {
        throw new Error("Agora session credentials missing.");
      }

      const client = AgoraRTC.createClient({ mode: "rtc", codec: "vp8" });
      clientRef.current = client;

      // When Astrologer Joins / Publishes
      client.on("user-published", async (user, mediaType) => {
        try {
          console.log("📡 Astrologer published media:", user.uid, mediaType);
          await client.subscribe(user, mediaType);
          remoteUserRef.current = user;

          if (!mountedRef.current) return;
          setRemoteJoined(true);
          setCallStatus("in-progress");

          if (elapsedSecondsRef.current === 0 && !timerRef.current) {
            startElapsedTimer();
          }

          if (mediaType === "video") playRemoteVideo(user);
          if (mediaType === "audio") playRemoteAudio(user);
        } catch (err) {
          console.error("❌ Remote media subscribe error:", err);
        }
      });

      client.on("user-unpublished", (user, mediaType) => {
        if (mediaType === "video") clearRemoteVideo();
      });

      client.on("user-left", () => {
        console.log("📴 Astrologer left the call");
        remoteUserRef.current = null;
        clearRemoteVideo();
        stopElapsedTimer();
        if (mountedRef.current) {
          setRemoteJoined(false);
          setCallStatus("completed");
        }
      });

      console.log("🔵 Joining Agora RTC channel:", channelName, "with UID:", uid);
      await client.join(appId, channelName, rtcToken, uid);
      console.log("✅ Joined Agora RTC channel successfully");

      if (mountedRef.current) setCallStatus("waiting");

      // Capture and publish local mic & camera
      const [audioTrack, videoTrack] = await Promise.all([
        createLocalAudio(),
        createLocalVideo(),
      ]);

      const tracksToPublish = [];
      if (audioTrack) tracksToPublish.push(audioTrack);
      if (videoTrack) tracksToPublish.push(videoTrack);

      if (tracksToPublish.length > 0) {
        try {
          await client.publish(tracksToPublish);
          console.log("✅ Published local media tracks:", tracksToPublish.length);
        } catch (pubErr) {
          console.error("❌ Local track publish failed:", pubErr);
        }
      }

      if (!mountedRef.current) {
        await releaseEngine();
        return;
      }

      setJoined(true);
      setConnecting(false);
    },
    [
      clearRemoteVideo,
      createLocalAudio,
      createLocalVideo,
      playRemoteAudio,
      playRemoteVideo,
      releaseEngine,
      startElapsedTimer,
      stopElapsedTimer,
    ]
  );

  // =========================================================
  // START CALL
  // =========================================================
  const startCall = useCallback(async () => {
    if (initializingRef.current) return;

    if (!bookingId) {
      setCallStatus("failed");
      setErrorMessage("No booking found for this call.");
      setConnecting(false);
      return;
    }

    initializingRef.current = true;

    try {
      setConnecting(true);
      setErrorMessage(null);
      setCallStatus("connecting");

      console.log("🔵 Calling initiateVideoCall API for bookingId:", bookingId);
      const res = await initiateVideoCall(bookingId);
      const session = res?.data?.data || res?.data;

      if (!session || session.success === false) {
        throw new Error(session?.message || "Unable to initiate video call.");
      }

      await initAgoraEngine(session);
    } catch (error) {
      console.error("❌ Start call error:", error);
      if (mountedRef.current) {
        setCallStatus("failed");
        setErrorMessage(
          error?.response?.data?.message ||
          error?.message ||
          "Unable to start video call."
        );
        setConnecting(false);
      }
      await releaseEngine();
    } finally {
      initializingRef.current = false;
    }
  }, [bookingId, initAgoraEngine, releaseEngine]);

  useEffect(() => {
    mountedRef.current = true;
    startCall();

    return () => {
      mountedRef.current = false;
      releaseEngine();
    };
  }, [releaseEngine, startCall]);

  // =========================================================
  // CONTROLS
  // =========================================================
  const toggleMic = async () => {
    if (!joined) return;
    let track = localAudioTrackRef.current;
    if (!track) {
      track = await createLocalAudio();
      if (!track) return;
      if (clientRef.current) {
        try {
          await clientRef.current.publish([track]);
          await track.setEnabled(true);
          setIsMicMuted(false);
        } catch {
          setIsMicMuted(true);
        }
      }
      return;
    }
    const nextMuted = !isMicMuted;
    await track.setEnabled(!nextMuted);
    setIsMicMuted(nextMuted);
  };

  const toggleCamera = async () => {
    if (!joined) return;
    let track = localVideoTrackRef.current;
    if (!track) {
      track = await createLocalVideo();
      if (!track) return;
      if (clientRef.current) {
        try {
          await clientRef.current.publish([track]);
          await track.setEnabled(true);
          setIsLocalVideoEnabled(true);
        } catch {
          setIsLocalVideoEnabled(false);
        }
      }
      return;
    }
    const nextEnabled = !isLocalVideoEnabled;
    await track.setEnabled(nextEnabled);
    setIsLocalVideoEnabled(nextEnabled);
  };

  const flipCamera = async () => {
    const track = localVideoTrackRef.current;
    if (!track) return;
    try {
      const cameras = await AgoraRTC.getCameras();
      if (!cameras || cameras.length < 2) return;
      const currentLabel = track.getTrackLabel?.() || "";
      const currentIndex = cameras.findIndex((c) => c.label === currentLabel);
      const nextCamera = cameras[(currentIndex + 1) % cameras.length];
      await track.switchDevice(nextCamera.deviceId);
      setIsFrontCamera((p) => !p);
    } catch (e) {
      console.error("Camera switch error:", e);
    }
  };

  const toggleSpeaker = () => {
    const nextSpeaker = !isSpeakerOn;
    setIsSpeakerOn(nextSpeaker);
    if (remoteUserRef.current?.audioTrack) {
      remoteUserRef.current.audioTrack.setVolume(nextSpeaker ? 100 : 0);
    }
  };

  const endCall = async () => {
    if (endingRef.current || ending) return;
    endingRef.current = true;
    setEnding(true);

    stopElapsedTimer();
    const durationMinutes = Math.ceil(elapsedSecondsRef.current / 60);

    await releaseEngine();

    if (bookingId) {
      try {
        await terminateVideoCall(bookingId, durationMinutes);
      } catch (err) {
        console.error("Terminate call API error:", err);
      }
    }

    navigate("/dashboard/my-bookings", {
      replace: true,
      state: { callEnded: true },
    });
  };

  // =========================================================
  // FAILED SCREEN
  // =========================================================
  if (callStatus === "failed") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#08050d] px-4">
        <div className="w-full max-w-md rounded-3xl border border-red-500/20 bg-white/5 p-8 text-center text-white backdrop-blur-xl">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-500/10">
            <AlertCircle size={32} className="text-red-400" />
          </div>
          <h2 className="mt-5 text-2xl font-black">Unable to Connect Call</h2>
          <p className="mt-3 text-sm leading-6 text-gray-400">
            {errorMessage || "Something went wrong while connecting the call."}
          </p>
          <div className="mt-6 flex justify-center gap-3">
            <button
              onClick={() => navigate(-1)}
              className="rounded-2xl border border-white/10 bg-white/5 px-6 py-3 text-sm font-bold text-white transition hover:bg-white/10"
            >
              Go Back
            </button>
            <button
              onClick={() => {
                setErrorMessage(null);
                setConnecting(true);
                setCallStatus("connecting");
                startCall();
              }}
              className="flex items-center gap-2 rounded-2xl bg-gradient-to-r from-violet-600 to-fuchsia-600 px-6 py-3 text-sm font-bold text-white transition hover:opacity-90"
            >
              <RefreshCw size={16} />
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  // =========================================================
  // MAIN UI
  // =========================================================
  return (
    <div className="fixed inset-0 z-[999] overflow-hidden bg-[#08050d] text-white">
      {/* HEADER */}
      <div className="absolute left-0 right-0 top-0 z-30 flex items-center justify-between bg-gradient-to-b from-black/80 to-transparent px-5 py-5 md:px-8">
        <div>
          <h1 className="text-lg font-black md:text-xl">Video Consultation</h1>
          <p className="text-xs text-gray-400">{astrologerName}</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 rounded-full border border-white/10 bg-black/40 px-4 py-2 backdrop-blur-md">
            <span
              className={`h-2 w-2 rounded-full ${
                remoteJoined
                  ? "bg-emerald-400"
                  : connecting
                  ? "animate-pulse bg-yellow-400"
                  : "bg-gray-500"
              }`}
            />
            <span className="text-xs font-bold">
              {remoteJoined
                ? formattedElapsed
                : connecting
                ? "Connecting..."
                : "Waiting for Astrologer..."}
            </span>
          </div>
        </div>
      </div>

      {/* REMOTE VIDEO */}
      <div className="absolute inset-0">
        <div
          ref={remoteVideoRef}
          className="h-full w-full bg-gradient-to-br from-purple-950 via-[#100b18] to-black"
        />

        {!remoteJoined && (
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <div className="relative">
              <div className="absolute -inset-5 animate-pulse rounded-full bg-purple-600/30 blur-2xl" />
              <div className="relative flex h-28 w-28 items-center justify-center overflow-hidden rounded-full border-4 border-white/10 bg-white/5">
                {astrologerPhotoUrl ? (
                  <img
                    src={astrologerPhotoUrl}
                    alt={astrologerName}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <User size={42} />
                )}
              </div>
            </div>

            <h2 className="mt-7 text-xl font-black">
              {connecting ? "Connecting..." : "Waiting for Astrologer"}
            </h2>

            <p className="mt-2 max-w-sm px-5 text-center text-sm text-gray-400">
              {connecting
                ? "Establishing secure connection..."
                : "Please wait while the astrologer joins the consultation."}
            </p>

            {connecting && (
              <Loader2 size={28} className="mt-6 animate-spin text-purple-400" />
            )}
          </div>
        )}
      </div>

      {/* LOCAL PREVIEW */}
      <div className="absolute right-4 top-20 z-20 h-40 w-28 overflow-hidden rounded-2xl border border-white/20 bg-black shadow-2xl md:right-7 md:top-24 md:h-52 md:w-72">
        <div ref={localVideoRef} className="h-full w-full" />
        {!isLocalVideoEnabled && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-900">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/10">
              <VideoOff size={22} />
            </div>
          </div>
        )}
        <div className="absolute bottom-2 left-2 rounded-lg bg-black/60 px-2 py-1 text-[10px] font-bold backdrop-blur-md">
          You
        </div>
      </div>

      {/* CONTROLS */}
      <div className="absolute bottom-0 left-0 right-0 z-30 bg-gradient-to-t from-black via-black/80 to-transparent px-5 pb-8 pt-24">
        <div className="flex items-center justify-center gap-3 md:gap-5">
          <button
            onClick={toggleMic}
            disabled={!joined}
            className={`flex h-14 w-14 items-center justify-center rounded-full border transition-all active:scale-95 ${
              isMicMuted
                ? "border-red-500/30 bg-red-500 text-white"
                : "border-white/10 bg-white/10 text-white hover:bg-white/20"
            }`}
          >
            {isMicMuted ? <MicOff size={21} /> : <Mic size={21} />}
          </button>

          <button
            onClick={toggleCamera}
            disabled={!joined}
            className={`flex h-14 w-14 items-center justify-center rounded-full border transition-all active:scale-95 ${
              !isLocalVideoEnabled
                ? "border-red-500/30 bg-red-500 text-white"
                : "border-white/10 bg-white/10 text-white hover:bg-white/20"
            }`}
          >
            {!isLocalVideoEnabled ? <VideoOff size={21} /> : <Video size={21} />}
          </button>

          <button
            onClick={flipCamera}
            disabled={!joined || !localVideoTrackRef.current}
            className="flex h-14 w-14 items-center justify-center rounded-full border border-white/10 bg-white/10 text-white hover:bg-white/20"
          >
            <RefreshCw size={21} className={isFrontCamera ? "" : "rotate-180"} />
          </button>

          <button
            onClick={toggleSpeaker}
            disabled={!joined}
            className={`flex h-14 w-14 items-center justify-center rounded-full border transition-all ${
              !isSpeakerOn
                ? "border-yellow-500/30 bg-yellow-500 text-black"
                : "border-white/10 bg-white/10 text-white hover:bg-white/20"
            }`}
          >
            {isSpeakerOn ? <Volume2 size={21} /> : <VolumeX size={21} />}
          </button>

          <button
            onClick={endCall}
            disabled={ending}
            className="flex h-16 w-16 items-center justify-center rounded-full bg-red-600 text-white shadow-xl shadow-red-600/30 hover:bg-red-700 active:scale-95"
          >
            {ending ? <Loader2 size={24} className="animate-spin" /> : <PhoneOff size={25} />}
          </button>
        </div>
      </div>
    </div>
  );
};

export default VideoCallScreen;