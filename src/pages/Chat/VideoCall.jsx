import React, { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import AgoraRTC from "agora-rtc-sdk-ng";
import {
  Mic,
  MicOff,
  Video,
  VideoOff,
  PhoneOff,
  Loader2,
  User,
  AlertCircle,
} from "lucide-react";

import { initiateVideoCall, terminateVideoCall } from "../../API/callApi";

const VideoCall = () => {
  const { bookingId: paramBookingId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const booking = location.state?.booking;
  const partner = location.state?.partner;
  const bookingId = paramBookingId || booking?._id;

  const clientRef = useRef(null);
  const localVideoRef = useRef(null);
  const localAudioTrackRef = useRef(null);
  const localVideoTrackRef = useRef(null);
  const remoteUsersRef = useRef({});

  const [callData, setCallData] = useState(null);
  const [joined, setJoined] = useState(false);
  const [connecting, setConnecting] = useState(true);
  const [muted, setMuted] = useState(false);
  const [cameraOff, setCameraOff] = useState(false);
  const [ending, setEnding] = useState(false);
  const [duration, setDuration] = useState(0);
  const [error, setError] = useState("");

  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60).toString().padStart(2, "0");
    const secs = (seconds % 60).toString().padStart(2, "0");
    return `${mins}:${secs}`;
  };

  useEffect(() => {
    if (!joined) return;
    const timer = setInterval(() => setDuration((prev) => prev + 1), 1000);
    return () => clearInterval(timer);
  }, [joined]);

  useEffect(() => {
    let isMounted = true;

    if (!bookingId) {
      setError("Booking ID is missing.");
      setConnecting(false);
      return;
    }

    const startVideoCall = async () => {
      try {
        setConnecting(true);
        setError("");

        const response = await initiateVideoCall(bookingId);
        if (!response?.data?.success) {
          throw new Error(response?.data?.message || "Unable to initiate video call");
        }

        if (!isMounted) return;

        const data = response.data;
        setCallData(data);
        await joinAgora(data.appId, data.channelName, data.rtcToken, data.uid, () => isMounted);
      } catch (err) {
        if (isMounted) {
          setError(err?.response?.data?.message || err?.message || "Unable to start video call.");
          setConnecting(false);
        }
      }
    };

    startVideoCall();

    return () => {
      isMounted = false;
      cleanupAgora();
    };
  }, [bookingId]);

  const joinAgora = async (appId, channelName, rtcToken, uid, getIsMounted) => {
    try {
      const client = AgoraRTC.createClient({ mode: "rtc", codec: "vp8" });
      clientRef.current = client;

      client.on("user-published", async (user, mediaType) => {
        await client.subscribe(user, mediaType);
        remoteUsersRef.current[user.uid] = user;
        if (mediaType === "video") renderRemoteVideo(user);
        if (mediaType === "audio") user.audioTrack?.play();
        setJoined(true);
      });

      client.on("user-unpublished", (user, mediaType) => {
        if (mediaType === "video") {
          const container = document.getElementById(`remote-video-${user.uid}`);
          if (container) container.innerHTML = "";
        }
      });

      client.on("user-left", (user) => {
        delete remoteUsersRef.current[user.uid];
        const container = document.getElementById(`remote-video-${user.uid}`);
        if (container) container.innerHTML = "";
      });

      const attemptJoin = async (retries = 5) => {
        try {
          if (!getIsMounted()) return;
          await client.join(appId, channelName, rtcToken, uid);
        } catch (error) {
          if (error?.message?.includes("UID_CONFLICT") && retries > 0) {
            await new Promise((res) => setTimeout(res, 2000));
            return attemptJoin(retries - 1);
          }
          throw error;
        }
      };

      await attemptJoin();

      if (!getIsMounted()) {
        await client.leave();
        return;
      }

      let audioTrack = null;
      let videoTrack = null;

      try {
        const tracks = await AgoraRTC.createMicrophoneAndCameraTracks();
        audioTrack = tracks[0];
        videoTrack = tracks[1];
      } catch (err) {
        try {
          audioTrack = await AgoraRTC.createMicrophoneAudioTrack();
        } catch (audioErr) {
          setMuted(true);
        }
        try {
          videoTrack = await AgoraRTC.createCameraVideoTrack();
        } catch (videoErr) {
          setCameraOff(true);
        }
      }

      if (!audioTrack && !videoTrack) {
        throw new Error("Could not access Camera or Microphone. Please check device permissions.");
      }

      localAudioTrackRef.current = audioTrack;
      localVideoTrackRef.current = videoTrack;

      if (videoTrack && localVideoRef.current) {
        videoTrack.play(localVideoRef.current);
      }

      const tracksToPublish = [];
      if (audioTrack) tracksToPublish.push(audioTrack);
      if (videoTrack) tracksToPublish.push(videoTrack);

      if (!getIsMounted()) {
        audioTrack?.close();
        videoTrack?.close();
        await client.leave();
        return;
      }

      await client.publish(tracksToPublish);

      if (getIsMounted()) {
        setJoined(true);
        setConnecting(false);
      }
    } catch (err) {
      throw err;
    }
  };

  const renderRemoteVideo = (user) => {
    setTimeout(() => {
      const container = document.getElementById(`remote-video-${user.uid}`);
      if (container && user.videoTrack) {
        container.innerHTML = "";
        user.videoTrack.play(container);
      }
    }, 100);
  };

  const toggleMicrophone = async () => {
    try {
      const track = localAudioTrackRef.current;
      if (!track) return;
      const newMuted = !muted;
      await track.setEnabled(!newMuted);
      setMuted(newMuted);
    } catch (err) {}
  };

  const toggleCamera = async () => {
    try {
      const track = localVideoTrackRef.current;
      if (!track) return;
      const newCameraOff = !cameraOff;
      await track.setEnabled(!newCameraOff);
      setCameraOff(newCameraOff);
    } catch (err) {}
  };

  const cleanupAgora = async () => {
    try {
      const client = clientRef.current;
      if (client) {
        try {
          client.removeAllListeners();
          await client.leave();
        } catch (err) {}
      }
      if (localAudioTrackRef.current) {
        localAudioTrackRef.current.stop();
        localAudioTrackRef.current.close();
        localAudioTrackRef.current = null;
      }
      if (localVideoTrackRef.current) {
        localVideoTrackRef.current.stop();
        localVideoTrackRef.current.close();
        localVideoTrackRef.current = null;
      }
      clientRef.current = null;
    } catch (err) {}
  };

  const handleEndCall = async () => {
    if (ending) return;
    try {
      setEnding(true);
      const actualDuration = duration;
      await terminateVideoCall(bookingId, actualDuration);
      await cleanupAgora();
      navigate("/dashboard/my-bookings", { replace: true, state: { callEnded: true } });
    } catch (err) {
      setError(err?.response?.data?.message || err?.message || "Unable to end video call.");
      setEnding(false);
    }
  };

  useEffect(() => {
    const handleBeforeUnload = () => {
      cleanupAgora();
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  if (error && !connecting) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#08050d] px-4">
        <div className="w-full max-w-md rounded-3xl border border-red-500/20 bg-white/5 p-8 text-center text-white backdrop-blur-xl">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-500/10">
            <AlertCircle size={32} className="text-red-400" />
          </div>
          <h2 className="mt-5 text-2xl font-black">Unable to Join Call</h2>
          <p className="mt-3 text-sm leading-6 text-gray-400">{error}</p>
          <button onClick={() => navigate(-1)} className="mt-6 rounded-2xl bg-gradient-to-r from-violet-600 to-fuchsia-600 px-8 py-3 text-sm font-bold text-white">
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[999] overflow-hidden bg-[#08050d] text-white">
      <div className="absolute left-0 right-0 top-0 z-30 flex items-center justify-between bg-gradient-to-b from-black/80 to-transparent px-5 py-5 md:px-8">
        <div>
          <h1 className="text-lg font-black md:text-xl">Video Consultation</h1>
          <p className="text-xs text-gray-400">{partner?.fullName || partner?.name || "Astrologer"}</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 rounded-full border border-white/10 bg-black/40 px-4 py-2 backdrop-blur-md">
            <span className={`h-2 w-2 rounded-full ${joined ? "bg-emerald-400" : "bg-yellow-400 animate-pulse"}`} />
            <span className="text-xs font-bold">{joined ? formatDuration(duration) : "Connecting..."}</span>
          </div>
        </div>
      </div>

      <div className="absolute inset-0">
        <div id={Object.keys(remoteUsersRef.current).length ? `remote-video-${Object.keys(remoteUsersRef.current)[0]}` : "remote-video-container"} className="h-full w-full bg-gradient-to-br from-purple-950 via-[#100b18] to-black">
          {!joined || Object.keys(remoteUsersRef.current).length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center">
              <div className="relative">
                <div className="absolute -inset-5 animate-pulse rounded-full bg-purple-600/30 blur-2xl" />
                <div className="relative flex h-28 w-28 items-center justify-center overflow-hidden rounded-full border-4 border-white/10 bg-white/5">
                  {partner?.profilePic ? (
                    <img src={partner.profilePic} alt="Astrologer" className="h-full w-full object-cover" />
                  ) : (
                    <User size={42} />
                  )}
                </div>
              </div>
              <h2 className="mt-7 text-xl font-black">{connecting ? "Connecting..." : "Waiting for Astrologer"}</h2>
              <p className="mt-2 text-sm text-gray-400">Please wait while the astrologer joins the consultation.</p>
              {connecting && <Loader2 size={28} className="mt-6 animate-spin text-purple-400" />}
            </div>
          ) : null}
        </div>
      </div>

      <div className="absolute right-4 top-20 z-20 h-40 w-28 overflow-hidden rounded-2xl border border-white/20 bg-black shadow-2xl md:right-7 md:top-24 md:h-52 md:w-72">
        <div ref={localVideoRef} className="h-full w-full" />
        {cameraOff && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-900">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/10">
              <VideoOff size={22} />
            </div>
          </div>
        )}
        <div className="absolute bottom-2 left-2 rounded-lg bg-black/60 px-2 py-1 text-[10px] font-bold backdrop-blur-md">You</div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 z-30 bg-gradient-to-t from-black via-black/80 to-transparent px-5 pb-8 pt-24">
        <div className="flex items-center justify-center gap-4 md:gap-6">
          <button onClick={toggleMicrophone} disabled={!joined} className={`flex h-14 w-14 items-center justify-center rounded-full border transition-all active:scale-95 ${muted ? "border-red-500/30 bg-red-500 text-white" : "border-white/10 bg-white/10 text-white hover:bg-white/20"}`}>
            {muted ? <MicOff size={21} /> : <Mic size={21} />}
          </button>
          <button onClick={toggleCamera} disabled={!joined} className={`flex h-14 w-14 items-center justify-center rounded-full border transition-all active:scale-95 ${cameraOff ? "border-red-500/30 bg-red-500 text-white" : "border-white/10 bg-white/10 text-white hover:bg-white/20"}`}>
            {cameraOff ? <VideoOff size={21} /> : <Video size={21} />}
          </button>
          <button onClick={handleEndCall} disabled={ending} className="flex h-16 w-16 items-center justify-center rounded-full bg-red-600 text-white shadow-xl shadow-red-600/30 transition-all hover:bg-red-700 active:scale-95 disabled:cursor-not-allowed disabled:opacity-60">
            {ending ? <Loader2 size={24} className="animate-spin" /> : <PhoneOff size={25} />}
          </button>
        </div>
        <p className="mt-4 text-center text-[11px] text-gray-500">{joined ? "You are connected securely" : "Establishing secure connection..."}</p>
      </div>
    </div>
  );
};

export default VideoCall;