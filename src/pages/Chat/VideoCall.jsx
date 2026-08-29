import React, {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

import {
  useLocation,
  useNavigate,
  useParams,
} from "react-router-dom";

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
  Volume2,
  VolumeX,
  RefreshCw,
} from "lucide-react";

/**
 * Ported 1:1 from the Flutter `VideoCallController` (the initiating /
 * customer-side call screen). Mirrors its exact step order:
 *
 *   1. Request camera + mic permission up front (Flutter: Permission.camera /
 *      Permission.microphone). On the web this is done with a quick
 *      getUserMedia() probe so we can show the same
 *      "Camera and microphone permissions are required" error immediately,
 *      instead of only finding out when Agora tries to grab tracks later.
 *   2. Call `initiateVideoCall(bookingId)` (Flutter: `_repository.initiateCall`).
 *   3. Initialize the Agora engine/client and join the channel
 *      (Flutter: `_initAgoraEngine`).
 *   4. On successful join, enable the speakerphone
 *      (Flutter: `onJoinChannelSuccess` -> `setEnableSpeakerphone(true)`).
 *   5. On remote user joining, start the elapsed-time timer
 *      (Flutter: `onUserJoined` -> `_startElapsedTimer`).
 *   6. On end call, leave + release the engine, then call
 *      `terminateVideoCall(bookingId, durationMinutes)`
 *      (Flutter: `endCall`).
 */
import {
  initiateVideoCall,
  terminateVideoCall,
} from "../../API/callApi";

const VideoCall = () => {
  const { bookingId: paramBookingId } = useParams();

  const location = useLocation();
  const navigate = useNavigate();

  /* =========================================================
     BOOKING DATA
     (Flutter reads these from Get.parameters: name / image)
  ========================================================= */

  const booking = location.state?.booking;
  const partner = location.state?.partner;

  const bookingId =
    paramBookingId ||
    booking?._id ||
    booking?.id;

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

  /* =========================================================
     AGORA / ENGINE REFS
  ========================================================= */

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

  /* =========================================================
     STATE
     (mirrors the .obs fields on VideoCallController)
  ========================================================= */

  const [callData, setCallData] = useState(null); // ~ _session

  const [callStatus, setCallStatus] = useState("connecting");
  const [errorMessage, setErrorMessage] = useState(null);

  const [remoteJoined, setRemoteJoined] = useState(false); // ~ remoteUid != null

  const [isLocalVideoEnabled, setIsLocalVideoEnabled] = useState(true);
  const [isMicMuted, setIsMicMuted] = useState(false);
  const [isSpeakerOn, setIsSpeakerOn] = useState(true);
  const [isFrontCamera, setIsFrontCamera] = useState(true);

  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [formattedElapsed, setFormattedElapsed] = useState("00:00");

  const [connecting, setConnecting] = useState(true);
  const [joined, setJoined] = useState(false);
  const [ending, setEnding] = useState(false);

  /* =========================================================
     ELAPSED TIMER
     (Flutter: _startElapsedTimer / _stopElapsedTimer)
  ========================================================= */

  const startElapsedTimer = useCallback(() => {
    elapsedSecondsRef.current = 0;
    setIsTimerRunning(true);
    setFormattedElapsed("00:00");

    if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    timerRef.current = setInterval(() => {
      elapsedSecondsRef.current += 1;

      const m = Math.floor(elapsedSecondsRef.current / 60);
      const s = elapsedSecondsRef.current % 60;

      setFormattedElapsed(
        `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`
      );
    }, 1000);
  }, []);

  const stopElapsedTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    setIsTimerRunning(false);
  }, []);

  /* =========================================================
     REMOTE VIDEO HELPERS
  ========================================================= */

  const clearRemoteVideo = useCallback(() => {
    try {
      if (remoteVideoRef.current) {
        remoteVideoRef.current.innerHTML = "";
      }
    } catch (err) {
      console.error("Clear remote video error:", err);
    }
  }, []);

  const playRemoteVideo = useCallback((user) => {
    if (!remoteVideoRef.current || !user?.videoTrack) return;

    try {
      remoteVideoRef.current.innerHTML = "";
      user.videoTrack.play(remoteVideoRef.current);
      console.log("✅ [Agora] remote video playing, uid:", user.uid);
    } catch (err) {
      console.error("❌ Remote video play error:", err);
    }
  }, []);

  const playRemoteAudio = useCallback(
    (user) => {
      if (!user?.audioTrack) return;

      try {
        user.audioTrack.setVolume(isSpeakerOn ? 100 : 0);
        user.audioTrack.play();
      } catch (err) {
        console.error("❌ Remote audio play error:", err);
      }
    },
    [isSpeakerOn]
  );

  /* =========================================================
     ENGINE CLEANUP
     (Flutter: onClose / part of endCall — leaveChannel + release)
  ========================================================= */

  const releaseEngine = useCallback(async () => {
    stopElapsedTimer();

    if (localAudioTrackRef.current) {
      try {
        localAudioTrackRef.current.stop();
      } catch {}
      try {
        localAudioTrackRef.current.close();
      } catch {}
      localAudioTrackRef.current = null;
    }

    if (localVideoTrackRef.current) {
      try {
        localVideoTrackRef.current.stop();
      } catch {}
      try {
        localVideoTrackRef.current.close();
      } catch {}
      localVideoTrackRef.current = null;
    }

    const client = clientRef.current;

    if (client) {
      try {
        client.removeAllListeners();
      } catch {}

      try {
        if (client.connectionState !== "DISCONNECTED") {
          await client.leave();
        }
      } catch (err) {
        console.error("Agora leaveChannel error:", err);
      }
    }

    clientRef.current = null;
    remoteUserRef.current = null;

    clearRemoteVideo();

    if (mountedRef.current) {
      setJoined(false);
      setRemoteJoined(false);
    }
  }, [clearRemoteVideo, stopElapsedTimer]);

  /* =========================================================
     REQUEST CAMERA + MIC PERMISSION
     (Flutter: Permission.camera.request() / Permission.microphone.request(),
     done BEFORE calling the API)
  ========================================================= */

  const requestMediaPermissions = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });

      // We only needed this to trigger/confirm the permission prompt.
      // Agora will create its own tracks right after.
      stream.getTracks().forEach((track) => track.stop());

      console.log("📷🎙️ camera=granted mic=granted");
      return true;
    } catch (err) {
      console.error("❌ Camera/Mic permission denied:", err);
      return false;
    }
  }, []);

  /* =========================================================
     INIT AGORA ENGINE + JOIN
     (Flutter: _initAgoraEngine)
  ========================================================= */

  const initAgoraEngine = useCallback(
    async (session) => {
      const { appId, channelName, rtcToken, uid } = session;

      if (!appId) throw new Error("Agora App ID is missing.");
      if (!channelName) throw new Error("Agora channel name is missing.");
      if (!rtcToken) throw new Error("Agora RTC token is missing.");
      if (uid === undefined || uid === null) {
        throw new Error("Agora UID is missing.");
      }

      const client = AgoraRTC.createClient({
        mode: "rtc", // ~ ChannelProfileType.channelProfileCommunication
        codec: "vp8",
      });

      clientRef.current = client;

      // onJoinChannelSuccess -> enable speakerphone
      // (handled right after client.join() below, since the web SDK
      // resolves the join() promise on success)

      // onUserJoined
      client.on("user-published", async (user, mediaType) => {
        try {
          await client.subscribe(user, mediaType);

          remoteUserRef.current = user;
          console.log("✅ [Agora] onUserJoined-equivalent, remoteUid:", user.uid);

          setRemoteJoined(true);
          setCallStatus("in-progress");
          startElapsedTimer();

          if (mediaType === "video") playRemoteVideo(user);
          if (mediaType === "audio") playRemoteAudio(user);
        } catch (err) {
          console.error("❌ Remote subscribe error:", err);
        }
      });

      // onUserOffline
      client.on("user-left", () => {
        remoteUserRef.current = null;
        clearRemoteVideo();

        setRemoteJoined(false);
        setCallStatus("completed");

        stopElapsedTimer();
      });

      // onLeaveChannel
      client.on("connection-state-change", (currentState) => {
        if (currentState === "DISCONNECTED") {
          setCallStatus("completed");
        }
      });

      // onError
      client.on("exception", (event) => {
        console.error("❌ [Agora] onError-equivalent:", event);

        setCallStatus((prevStatus) => {
          if (prevStatus !== "in-progress") {
            setErrorMessage(`Connection error. Please try again.`);
            return "failed";
          }
          return prevStatus;
        });
      });

      // client.join == engine.joinChannel(...)
      await client.join(appId, channelName, rtcToken, uid);

      console.log("✅ [Agora] onJoinChannelSuccess-equivalent");
      setCallStatus("waiting");

      // ⚠️ setEnableSpeakerphone happens here, same spot as Flutter
      // (moved into the success callback, not before joinChannel)
      try {
        const remoteUser = remoteUserRef.current;
        if (remoteUser?.audioTrack) {
          remoteUser.audioTrack.setVolume(isSpeakerOn ? 100 : 0);
        }
      } catch (err) {
        console.error("⚠️ setEnableSpeakerphone-equivalent failed:", err);
      }

      if (!mountedRef.current) {
        await client.leave();
        return;
      }

      // enableVideo() + startPreview() + publish local tracks
      let audioTrack = null;
      let videoTrack = null;

      try {
        audioTrack = await AgoraRTC.createMicrophoneAudioTrack();
      } catch (err) {
        console.error("❌ Microphone creation failed:", err);
        if (mountedRef.current) setIsMicMuted(true);
      }

      try {
        videoTrack = await AgoraRTC.createCameraVideoTrack();
      } catch (err) {
        console.error("❌ Camera creation failed:", err);
        if (mountedRef.current) setIsLocalVideoEnabled(false);
      }

      if (!audioTrack && !videoTrack) {
        throw new Error(
          "Could not access camera or microphone. Please check browser permissions."
        );
      }

      localAudioTrackRef.current = audioTrack;
      localVideoTrackRef.current = videoTrack;

      if (videoTrack && localVideoRef.current) {
        try {
          videoTrack.play(localVideoRef.current);
        } catch (err) {
          console.error("❌ Local video play error:", err);
        }
      }

      const tracks = [];
      if (audioTrack) tracks.push(audioTrack);
      if (videoTrack) tracks.push(videoTrack);

      if (!mountedRef.current) {
        audioTrack?.close();
        videoTrack?.close();
        await client.leave();
        return;
      }

      await client.publish(tracks);

      if (mountedRef.current) {
        setJoined(true);
        setConnecting(false);
      }
    },
    [
      clearRemoteVideo,
      isSpeakerOn,
      playRemoteAudio,
      playRemoteVideo,
      startElapsedTimer,
      stopElapsedTimer,
    ]
  );

  /* =========================================================
     START CALL
     (Flutter: _startCall — permission check -> initiateCall -> _initAgoraEngine)
  ========================================================= */

  const startCall = useCallback(async () => {
    if (initializingRef.current) return;

    if (!bookingId) {
      setCallStatus("failed");
      setErrorMessage(
        "No booking found for this call. Please book a consultation first."
      );
      setConnecting(false);
      return;
    }

    initializingRef.current = true;

    try {
      setConnecting(true);
      setErrorMessage(null);
      setCallStatus("connecting");

      // Step 0: permissions (Flutter does this first)
      const permissionsGranted = await requestMediaPermissions();

      if (!permissionsGranted) {
        setCallStatus("failed");
        setErrorMessage(
          "Camera and microphone permissions are required for a video call."
        );
        setConnecting(false);
        return;
      }

      // Step 1: initiateCall API
      let session;

      try {
        console.log("🔵 [1] Calling initiateVideoCall for bookingId=", bookingId);

        const response = await initiateVideoCall(bookingId);

        if (!response?.data?.success) {
          throw new Error(
            response?.data?.message || "Unable to initiate video call."
          );
        }

        session = response.data;

        if (!session.appId) throw new Error("Agora App ID is missing from server response.");
        if (!session.channelName) throw new Error("Agora channel name is missing from server response.");
        if (!session.rtcToken) throw new Error("Agora RTC token is missing from server response.");
        if (session.uid === undefined || session.uid === null) {
          throw new Error("Agora UID is missing from server response.");
        }

        console.log("✅ [1] initiateCall OK:", {
          appId: session.appId,
          channel: session.channelName,
          uid: session.uid,
          rtcTokenLen: session.rtcToken?.length,
        });

        setCallData(session);
      } catch (err) {
        console.error("❌ [1] initiateCall FAILED:", err);

        setCallStatus("failed");
        setErrorMessage(
          err?.response?.data?.message ||
            err?.message ||
            "Could not reach the server to start the call."
        );
        setConnecting(false);
        return;
      }

      // Step 2: Agora engine setup + join
      try {
        console.log("🔵 [2] Initializing Agora engine");

        await initAgoraEngine(session);

        console.log("✅ [2] initAgoraEngine completed without throwing");
      } catch (err) {
        console.error("❌ [2] initAgoraEngine FAILED:", err);

        setCallStatus("failed");
        setErrorMessage("Could not start the video call. Please try again.");
        setConnecting(false);

        await releaseEngine();
      }
    } finally {
      initializingRef.current = false;
    }
  }, [bookingId, initAgoraEngine, releaseEngine, requestMediaPermissions]);

  /* =========================================================
     INITIALIZE COMPONENT
     (Flutter: onInit)
  ========================================================= */

  useEffect(() => {
    mountedRef.current = true;

    if (!bookingId) {
      setCallStatus("failed");
      setErrorMessage(
        "No booking found for this call. Please book a consultation first."
      );
      setConnecting(false);

      return () => {
        mountedRef.current = false;
      };
    }

    startCall();

    return () => {
      mountedRef.current = false;
      releaseEngine();
    };
  }, [bookingId, startCall, releaseEngine]);

  /* =========================================================
     CONTROLS
     (Flutter: toggleMic / toggleCamera / flipCamera / toggleSpeaker)
  ========================================================= */

  const toggleMic = async () => {
    const track = localAudioTrackRef.current;
    if (!track) return;

    try {
      const nextMuted = !isMicMuted;
      await track.setEnabled(!nextMuted);
      setIsMicMuted(nextMuted);
    } catch (err) {
      console.error("❌ Microphone toggle error:", err);
    }
  };

  const toggleCamera = async () => {
    const track = localVideoTrackRef.current;
    if (!track) return;

    try {
      const nextEnabled = !isLocalVideoEnabled;
      await track.setEnabled(nextEnabled);
      setIsLocalVideoEnabled(nextEnabled);
    } catch (err) {
      console.error("❌ Camera toggle error:", err);
    }
  };

  const flipCamera = async () => {
    const track = localVideoTrackRef.current;
    if (!track) return;

    try {
      const devices = await AgoraRTC.getCameras();
      if (!devices || devices.length < 2) return;

      const currentLabel = track.getTrackLabel?.() || "";
      const nextDevice =
        devices.find((d) => d.label !== currentLabel) || devices[0];

      await track.switchDevice(nextDevice.deviceId);
      setIsFrontCamera((prev) => !prev);
    } catch (err) {
      console.error("❌ Camera switch error:", err);
    }
  };

  const toggleSpeaker = () => {
    try {
      const nextSpeaker = !isSpeakerOn;
      setIsSpeakerOn(nextSpeaker);

      const remoteUser = remoteUserRef.current;
      if (remoteUser?.audioTrack) {
        remoteUser.audioTrack.setVolume(nextSpeaker ? 100 : 0);
      }
    } catch (err) {
      console.error("❌ Speaker toggle error:", err);
    }
  };

  /* =========================================================
     END CALL
     (Flutter: endCall)
  ========================================================= */

  const endCall = async () => {
    if (endingRef.current || ending) return;

    endingRef.current = true;
    setEnding(true);

    stopElapsedTimer();

    const durationMinutes = Math.ceil(elapsedSecondsRef.current / 60);
    const id = bookingId;

    await releaseEngine();

    if (id) {
      try {
        await terminateVideoCall(id, durationMinutes);
      } catch (err) {
        console.error("terminateCall error:", err);
      }
    }

    if (mountedRef.current) {
      navigate("/dashboard/my-bookings", {
        replace: true,
        state: { callEnded: true },
      });
    }
  };

  /* =========================================================
     BROWSER CLOSE / REFRESH
  ========================================================= */

  useEffect(() => {
    const handleBeforeUnload = () => {
      try {
        stopElapsedTimer();

        localAudioTrackRef.current?.stop();
        localAudioTrackRef.current?.close();

        localVideoTrackRef.current?.stop();
        localVideoTrackRef.current?.close();

        clientRef.current?.leave();
      } catch (err) {
        console.error("beforeunload cleanup error:", err);
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [stopElapsedTimer]);

  /* =========================================================
     FAILED SCREEN
  ========================================================= */

  if (callStatus === "failed") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#08050d] px-4">
        <div className="w-full max-w-md rounded-3xl border border-red-500/20 bg-white/5 p-8 text-center text-white backdrop-blur-xl">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-500/10">
            <AlertCircle size={32} className="text-red-400" />
          </div>

          <h2 className="mt-5 text-2xl font-black">Unable to Join Call</h2>

          <p className="mt-3 text-sm leading-6 text-gray-400">
            {errorMessage}
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
              className="flex items-center gap-2 rounded-2xl bg-gradient-to-r from-violet-600 to-fuchsia-600 px-6 py-3 text-sm font-bold text-white"
            >
              <RefreshCw size={16} />
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  /* =========================================================
     MAIN UI
  ========================================================= */

  return (
    <div className="fixed inset-0 z-[999] overflow-hidden bg-[#08050d] text-white">
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
                : "Waiting"}
            </span>
          </div>
        </div>
      </div>

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
                ? "Establishing secure video connection..."
                : "Please wait while the astrologer joins the consultation."}
            </p>

            {connecting && (
              <Loader2 size={28} className="mt-6 animate-spin text-purple-400" />
            )}
          </div>
        )}
      </div>

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

      {remoteJoined && (
        <div className="absolute left-1/2 top-20 z-20 -translate-x-1/2 rounded-full border border-emerald-400/20 bg-black/50 px-4 py-2 text-xs font-bold text-emerald-300 backdrop-blur-md">
          Connected securely
        </div>
      )}

      <div className="absolute bottom-0 left-0 right-0 z-30 bg-gradient-to-t from-black via-black/80 to-transparent px-5 pb-8 pt-24">
        <div className="flex items-center justify-center gap-3 md:gap-5">
          <button
            onClick={toggleMic}
            disabled={!joined || !localAudioTrackRef.current}
            className={`flex h-14 w-14 items-center justify-center rounded-full border transition-all active:scale-95 ${
              isMicMuted
                ? "border-red-500/30 bg-red-500 text-white"
                : "border-white/10 bg-white/10 text-white hover:bg-white/20"
            } disabled:cursor-not-allowed disabled:opacity-40`}
          >
            {isMicMuted ? <MicOff size={21} /> : <Mic size={21} />}
          </button>

          <button
            onClick={toggleCamera}
            disabled={!joined || !localVideoTrackRef.current}
            className={`flex h-14 w-14 items-center justify-center rounded-full border transition-all active:scale-95 ${
              !isLocalVideoEnabled
                ? "border-red-500/30 bg-red-500 text-white"
                : "border-white/10 bg-white/10 text-white hover:bg-white/20"
            } disabled:cursor-not-allowed disabled:opacity-40`}
          >
            {!isLocalVideoEnabled ? <VideoOff size={21} /> : <Video size={21} />}
          </button>

          <button
            onClick={flipCamera}
            disabled={!joined || !localVideoTrackRef.current}
            className="flex h-14 w-14 items-center justify-center rounded-full border border-white/10 bg-white/10 text-white transition-all hover:bg-white/20 active:scale-95 disabled:cursor-not-allowed disabled:opacity-40"
            title="Switch Camera"
          >
            <RefreshCw size={21} />
          </button>

          <button
            onClick={toggleSpeaker}
            disabled={!joined}
            className={`flex h-14 w-14 items-center justify-center rounded-full border transition-all active:scale-95 ${
              !isSpeakerOn
                ? "border-yellow-500/30 bg-yellow-500 text-black"
                : "border-white/10 bg-white/10 text-white hover:bg-white/20"
            } disabled:cursor-not-allowed disabled:opacity-40`}
            title="Speaker"
          >
            {isSpeakerOn ? <Volume2 size={21} /> : <VolumeX size={21} />}
          </button>

          <button
            onClick={endCall}
            disabled={ending}
            className="flex h-16 w-16 items-center justify-center rounded-full bg-red-600 text-white shadow-xl shadow-red-600/30 transition-all hover:bg-red-700 active:scale-95 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {ending ? (
              <Loader2 size={24} className="animate-spin" />
            ) : (
              <PhoneOff size={25} />
            )}
          </button>
        </div>

        <p className="mt-4 text-center text-[11px] text-gray-500">
          {remoteJoined
            ? "You are connected securely"
            : "Waiting for the astrologer to join..."}
        </p>
      </div>
    </div>
  );
};

export default VideoCall;