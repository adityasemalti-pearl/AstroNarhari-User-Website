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

import {
  initiateVideoCall,
  terminateVideoCall,
} from "../../API/callApi";

const VideoCallScreen = () => {
  const { bookingId: paramBookingId } = useParams();

  const location = useLocation();
  const navigate = useNavigate();

  // =========================================================
  // BOOKING DATA
  // =========================================================

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

  const [callData, setCallData] = useState(null);

  const [callStatus, setCallStatus] =
    useState("connecting");

  const [errorMessage, setErrorMessage] =
    useState(null);

  const [remoteJoined, setRemoteJoined] =
    useState(false);

  const [isLocalVideoEnabled, setIsLocalVideoEnabled] =
    useState(false);

  const [isMicMuted, setIsMicMuted] =
    useState(true);

  const [isSpeakerOn, setIsSpeakerOn] =
    useState(true);

  const [isFrontCamera, setIsFrontCamera] =
    useState(true);

  const [formattedElapsed, setFormattedElapsed] =
    useState("00:00");

  const [connecting, setConnecting] =
    useState(true);

  const [joined, setJoined] =
    useState(false);

  const [ending, setEnding] =
    useState(false);

  // =========================================================
  // TIMER
  // =========================================================

  const startElapsedTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    elapsedSecondsRef.current = 0;
    setFormattedElapsed("00:00");

    timerRef.current = setInterval(() => {
      elapsedSecondsRef.current += 1;

      const minutes = Math.floor(
        elapsedSecondsRef.current / 60
      );

      const seconds =
        elapsedSecondsRef.current % 60;

      setFormattedElapsed(
        `${String(minutes).padStart(2, "0")}:${String(
          seconds
        ).padStart(2, "0")}`
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
  // CLEAR REMOTE VIDEO
  // =========================================================

  const clearRemoteVideo = useCallback(() => {
    if (!remoteVideoRef.current) {
      return;
    }

    try {
      remoteVideoRef.current.innerHTML = "";
    } catch (error) {
      console.error(
        "❌ Failed to clear remote video:",
        error
      );
    }
  }, []);

  // =========================================================
  // PLAY REMOTE VIDEO
  // =========================================================

  const playRemoteVideo = useCallback((user) => {
    if (
      !user?.videoTrack ||
      !remoteVideoRef.current
    ) {
      return;
    }

    try {
      remoteVideoRef.current.innerHTML = "";

      user.videoTrack.play(
        remoteVideoRef.current
      );
    } catch (error) {
      console.error(
        "❌ Remote video play error:",
        error
      );
    }
  }, []);

  // =========================================================
  // PLAY REMOTE AUDIO
  // =========================================================

  const playRemoteAudio = useCallback(
    (user) => {
      if (!user?.audioTrack) {
        return;
      }

      try {
        user.audioTrack.setVolume(
          isSpeakerOn ? 100 : 0
        );

        user.audioTrack.play();
      } catch (error) {
        console.error(
          "❌ Remote audio play error:",
          error
        );
      }
    },
    [isSpeakerOn]
  );

  // =========================================================
  // RELEASE AGORA
  // =========================================================

  const releaseEngine = useCallback(async () => {
    stopElapsedTimer();

    // -------------------------------------------------------
    // LOCAL AUDIO
    // -------------------------------------------------------

    const audioTrack =
      localAudioTrackRef.current;

    if (audioTrack) {
      try {
        audioTrack.stop();
      } catch {}

      try {
        audioTrack.close();
      } catch {}

      localAudioTrackRef.current = null;
    }

    // -------------------------------------------------------
    // LOCAL VIDEO
    // -------------------------------------------------------

    const videoTrack =
      localVideoTrackRef.current;

    if (videoTrack) {
      try {
        videoTrack.stop();
      } catch {}

      try {
        videoTrack.close();
      } catch {}

      localVideoTrackRef.current = null;
    }

    // -------------------------------------------------------
    // AGORA CLIENT
    // -------------------------------------------------------

    const client = clientRef.current;

    if (client) {
      try {
        client.removeAllListeners();
      } catch {}

      try {
        if (
          client.connectionState !==
          "DISCONNECTED"
        ) {
          await client.leave();
        }
      } catch (error) {
        console.error(
          "❌ Agora leave error:",
          error
        );
      }
    }

    clientRef.current = null;
    remoteUserRef.current = null;

    clearRemoteVideo();

    if (mountedRef.current) {
      setJoined(false);
      setRemoteJoined(false);
    }
  }, [
    clearRemoteVideo,
    stopElapsedTimer,
  ]);

  // =========================================================
  // CREATE LOCAL MICROPHONE
  //
  // FAILURE IS NOT FATAL
  // =========================================================

  const createLocalAudio = useCallback(async () => {
    try {
      const track =
        await AgoraRTC.createMicrophoneAudioTrack();

      localAudioTrackRef.current = track;

      if (mountedRef.current) {
        setIsMicMuted(false);
      }

      console.log(
        "🎙️ Microphone created successfully"
      );

      return track;
    } catch (error) {
      console.warn(
        "⚠️ Microphone unavailable. Continuing without mic.",
        error
      );

      localAudioTrackRef.current = null;

      if (mountedRef.current) {
        setIsMicMuted(true);
      }

      return null;
    }
  }, []);

  // =========================================================
  // CREATE LOCAL CAMERA
  //
  // FAILURE IS NOT FATAL
  // =========================================================

  const createLocalVideo = useCallback(async () => {
    try {
      const track =
        await AgoraRTC.createCameraVideoTrack();

      localVideoTrackRef.current = track;

      if (mountedRef.current) {
        setIsLocalVideoEnabled(true);
      }

      // Local preview
      if (localVideoRef.current) {
        try {
          track.play(
            localVideoRef.current
          );
        } catch (error) {
          console.error(
            "❌ Local video preview error:",
            error
          );
        }
      }

      console.log(
        "📷 Camera created successfully"
      );

      return track;
    } catch (error) {
      console.warn(
        "⚠️ Camera unavailable. Continuing without camera.",
        error
      );

      localVideoTrackRef.current = null;

      if (mountedRef.current) {
        setIsLocalVideoEnabled(false);
      }

      return null;
    }
  }, []);

  // =========================================================
  // INIT AGORA
  // =========================================================

  const initAgoraEngine = useCallback(
    async (session) => {
      const {
        appId,
        channelName,
        rtcToken,
        uid,
      } = session;

      // -----------------------------------------------------
      // VALIDATION
      // -----------------------------------------------------

      if (!appId) {
        throw new Error(
          "Agora App ID is missing."
        );
      }

      if (!channelName) {
        throw new Error(
          "Agora channel name is missing."
        );
      }

      if (!rtcToken) {
        throw new Error(
          "Agora RTC token is missing."
        );
      }

      if (
        uid === undefined ||
        uid === null
      ) {
        throw new Error(
          "Agora UID is missing."
        );
      }

      // -----------------------------------------------------
      // CREATE CLIENT
      // -----------------------------------------------------

      const client =
        AgoraRTC.createClient({
          mode: "rtc",
          codec: "vp8",
        });

      clientRef.current = client;

      // =====================================================
      // USER PUBLISHED
      // =====================================================

      client.on(
        "user-published",
        async (user, mediaType) => {
          try {
            console.log(
              "📡 Remote user published:",
              user.uid,
              mediaType
            );

            await client.subscribe(
              user,
              mediaType
            );

            remoteUserRef.current = user;

            if (!mountedRef.current) {
              return;
            }

            setRemoteJoined(true);
            setCallStatus("in-progress");

            // Start billing/call timer only
            // when remote user actually publishes.
            if (
              elapsedSecondsRef.current === 0 &&
              !timerRef.current
            ) {
              startElapsedTimer();
            }

            // ------------------------------------------------
            // REMOTE VIDEO
            // ------------------------------------------------

            if (mediaType === "video") {
              playRemoteVideo(user);
            }

            // ------------------------------------------------
            // REMOTE AUDIO
            // ------------------------------------------------

            if (mediaType === "audio") {
              playRemoteAudio(user);
            }
          } catch (error) {
            console.error(
              "❌ Remote subscribe error:",
              error
            );
          }
        }
      );

      // =====================================================
      // USER UNPUBLISHED
      // =====================================================

      client.on(
        "user-unpublished",
        (user, mediaType) => {
          console.log(
            "⚠️ Remote user unpublished:",
            user.uid,
            mediaType
          );

          if (mediaType === "video") {
            clearRemoteVideo();
          }
        }
      );

      // =====================================================
      // USER LEFT
      // =====================================================

      client.on(
        "user-left",
        (user) => {
          console.log(
            "📴 Remote user left:",
            user?.uid
          );

          remoteUserRef.current = null;

          clearRemoteVideo();

          stopElapsedTimer();

          if (mountedRef.current) {
            setRemoteJoined(false);
            setCallStatus("completed");
          }
        }
      );

      // =====================================================
      // CONNECTION STATE
      // =====================================================

      client.on(
        "connection-state-change",
        (
          currentState,
          previousState
        ) => {
          console.log(
            "🔌 Agora connection:",
            previousState,
            "→",
            currentState
          );

          if (
            currentState ===
            "DISCONNECTED"
          ) {
            stopElapsedTimer();

            if (mountedRef.current) {
              setCallStatus("completed");
              setRemoteJoined(false);
            }
          }
        }
      );

      // =====================================================
      // AGORA EXCEPTION
      // =====================================================

      client.on(
        "exception",
        (event) => {
          console.error(
            "❌ Agora exception:",
            event
          );

          if (!mountedRef.current) {
            return;
          }

          setCallStatus((previous) => {
            if (
              previous !==
              "in-progress"
            ) {
              setErrorMessage(
                "Connection error. Please try again."
              );

              return "failed";
            }

            return previous;
          });
        }
      );

      // =====================================================
      // JOIN CHANNEL
      // =====================================================

      console.log(
        "🔵 Joining Agora channel..."
      );

      await client.join(
        appId,
        channelName,
        rtcToken,
        uid
      );

      console.log(
        "✅ Agora channel joined"
      );

      if (mountedRef.current) {
        setCallStatus("waiting");
      }

      // =====================================================
      // CREATE LOCAL TRACKS
      //
      // BOTH ARE OPTIONAL.
      //
      // No mic  -> call still works.
      // No camera -> call still works.
      // Neither -> receive-only.
      // =====================================================

      const [
        audioTrack,
        videoTrack,
      ] = await Promise.all([
        createLocalAudio(),
        createLocalVideo(),
      ]);

      // =====================================================
      // PUBLISH AVAILABLE TRACKS
      // =====================================================

      const tracks = [];

      if (audioTrack) {
        tracks.push(audioTrack);
      }

      if (videoTrack) {
        tracks.push(videoTrack);
      }

      if (tracks.length > 0) {
        try {
          await client.publish(tracks);

          console.log(
            "✅ Published local tracks:",
            tracks.length
          );
        } catch (error) {
          console.error(
            "❌ Local track publish failed:",
            error
          );

          // Don't terminate the call.
          // Remote media can still be received.
        }
      } else {
        console.log(
          "ℹ️ No local camera/microphone available."
        );

        console.log(
          "ℹ️ Continuing as receive-only."
        );
      }

      // =====================================================
      // COMPONENT UNMOUNTED DURING INITIALIZATION
      // =====================================================

      if (!mountedRef.current) {
        try {
          audioTrack?.stop();
          audioTrack?.close();

          videoTrack?.stop();
          videoTrack?.close();

          if (
            client.connectionState !==
            "DISCONNECTED"
          ) {
            await client.leave();
          }
        } catch {}

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
      startElapsedTimer,
      stopElapsedTimer,
    ]
  );

  // =========================================================
  // START CALL
  // =========================================================

  const startCall = useCallback(async () => {
    if (initializingRef.current) {
      return;
    }

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

      // =====================================================
      // STEP 1: INITIATE CALL API
      // =====================================================

      console.log(
        "🔵 Initiating video call:",
        bookingId
      );

      let response;

      try {
        response =
          await initiateVideoCall(
            bookingId
          );
      } catch (error) {
        console.error(
          "❌ initiateVideoCall failed:",
          error
        );

        setCallStatus("failed");

        setErrorMessage(
          error?.response?.data
            ?.message ||
            error?.message ||
            "Could not reach the server to start the call."
        );

        setConnecting(false);

        return;
      }

      console.log(
        "📥 initiateVideoCall response:",
        response
      );

      // Supports:
      //
      // response.data
      //
      // OR
      //
      // response.data.data

      const session =
        response?.data?.data ||
        response?.data;

      if (!session) {
        throw new Error(
          "Invalid call session received from server."
        );
      }

      if (session.success === false) {
        throw new Error(
          session.message ||
            "Unable to initiate video call."
        );
      }

      // =====================================================
      // VALIDATE AGORA SESSION
      // =====================================================

      if (!session.appId) {
        throw new Error(
          "Agora App ID is missing from server response."
        );
      }

      if (!session.channelName) {
        throw new Error(
          "Agora channel name is missing from server response."
        );
      }

      if (!session.rtcToken) {
        throw new Error(
          "Agora RTC token is missing from server response."
        );
      }

      if (
        session.uid === undefined ||
        session.uid === null
      ) {
        throw new Error(
          "Agora UID is missing from server response."
        );
      }

      console.log(
        "✅ Call session received:",
        {
          appId: session.appId,
          channelName:
            session.channelName,
          uid: session.uid,
        }
      );

      setCallData(session);

      // =====================================================
      // STEP 2: JOIN AGORA
      // =====================================================

      try {
        console.log(
          "🔵 Initializing Agora..."
        );

        await initAgoraEngine(
          session
        );

        console.log(
          "✅ Agora initialized"
        );
      } catch (error) {
        console.error(
          "❌ Agora initialization failed:",
          error
        );

        setCallStatus("failed");

        setErrorMessage(
          error?.message ||
            "Could not start the video call. Please try again."
        );

        setConnecting(false);

        await releaseEngine();
      }
    } catch (error) {
      console.error(
        "❌ Start call error:",
        error
      );

      if (mountedRef.current) {
        setCallStatus("failed");

        setErrorMessage(
          error?.message ||
            "Unable to start video call."
        );

        setConnecting(false);
      }
    } finally {
      initializingRef.current = false;
    }
  }, [
    bookingId,
    initAgoraEngine,
    releaseEngine,
  ]);

  // =========================================================
  // INITIALIZE SCREEN
  // =========================================================

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
  }, [
    bookingId,
    releaseEngine,
    startCall,
  ]);

  // =========================================================
  // MICROPHONE TOGGLE
  // =========================================================

  const toggleMic = async () => {
    if (!joined) {
      return;
    }

    let track =
      localAudioTrackRef.current;

    // -------------------------------------------------------
    // NO MIC TRACK
    // TRY TO CREATE AGAIN
    // -------------------------------------------------------

    if (!track) {
      track =
        await createLocalAudio();

      if (!track) {
        return;
      }

      const client =
        clientRef.current;

      if (client) {
        try {
          await client.publish([
            track,
          ]);

          await track.setEnabled(
            true
          );

          setIsMicMuted(false);

          console.log(
            "✅ Microphone acquired and published"
          );
        } catch (error) {
          console.error(
            "❌ Failed to publish microphone:",
            error
          );

          try {
            track.stop();
            track.close();
          } catch {}

          localAudioTrackRef.current =
            null;

          setIsMicMuted(true);
        }
      }

      return;
    }

    // -------------------------------------------------------
    // EXISTING MIC
    // -------------------------------------------------------

    try {
      const nextMuted =
        !isMicMuted;

      await track.setEnabled(
        !nextMuted
      );

      setIsMicMuted(
        nextMuted
      );
    } catch (error) {
      console.error(
        "❌ Microphone toggle error:",
        error
      );
    }
  };

  // =========================================================
  // CAMERA TOGGLE
  // =========================================================

  const toggleCamera = async () => {
    if (!joined) {
      return;
    }

    let track =
      localVideoTrackRef.current;

    // -------------------------------------------------------
    // NO CAMERA TRACK
    // TRY TO CREATE AGAIN
    // -------------------------------------------------------

    if (!track) {
      track =
        await createLocalVideo();

      if (!track) {
        return;
      }

      const client =
        clientRef.current;

      if (client) {
        try {
          await client.publish([
            track,
          ]);

          await track.setEnabled(
            true
          );

          setIsLocalVideoEnabled(
            true
          );

          console.log(
            "✅ Camera acquired and published"
          );
        } catch (error) {
          console.error(
            "❌ Failed to publish camera:",
            error
          );

          try {
            track.stop();
            track.close();
          } catch {}

          localVideoTrackRef.current =
            null;

          setIsLocalVideoEnabled(
            false
          );
        }
      }

      return;
    }

    // -------------------------------------------------------
    // EXISTING CAMERA
    // -------------------------------------------------------

    try {
      const nextEnabled =
        !isLocalVideoEnabled;

      await track.setEnabled(
        nextEnabled
      );

      setIsLocalVideoEnabled(
        nextEnabled
      );
    } catch (error) {
      console.error(
        "❌ Camera toggle error:",
        error
      );
    }
  };

  // =========================================================
  // FLIP CAMERA
  // =========================================================

  const flipCamera = async () => {
    const track =
      localVideoTrackRef.current;

    if (!track) {
      return;
    }

    try {
      const cameras =
        await AgoraRTC.getCameras();

      if (
        !cameras ||
        cameras.length < 2
      ) {
        console.warn(
          "⚠️ Only one camera is available."
        );

        return;
      }

      const currentLabel =
        track.getTrackLabel?.() ||
        "";

      const currentIndex =
        cameras.findIndex(
          (camera) =>
            camera.label ===
            currentLabel
        );

      const nextIndex =
        currentIndex >= 0
          ? (currentIndex + 1) %
            cameras.length
          : 0;

      const nextCamera =
        cameras[nextIndex];

      await track.switchDevice(
        nextCamera.deviceId
      );

      setIsFrontCamera(
        (previous) => !previous
      );

      console.log(
        "📷 Camera switched:",
        nextCamera.label
      );
    } catch (error) {
      console.error(
        "❌ Camera switch error:",
        error
      );
    }
  };

  // =========================================================
  // SPEAKER TOGGLE
  // =========================================================

  const toggleSpeaker = () => {
    const nextSpeaker =
      !isSpeakerOn;

    setIsSpeakerOn(
      nextSpeaker
    );

    const remoteUser =
      remoteUserRef.current;

    if (remoteUser?.audioTrack) {
      try {
        remoteUser.audioTrack.setVolume(
          nextSpeaker ? 100 : 0
        );
      } catch (error) {
        console.error(
          "❌ Speaker toggle error:",
          error
        );
      }
    }
  };

  // =========================================================
  // END CALL
  // =========================================================

  const endCall = async () => {
    if (
      endingRef.current ||
      ending
    ) {
      return;
    }

    endingRef.current = true;
    setEnding(true);

    // -------------------------------------------------------
    // STOP TIMER FIRST
    // -------------------------------------------------------

    stopElapsedTimer();

    const durationSeconds =
      elapsedSecondsRef.current;

    const durationMinutes =
      Math.ceil(
        durationSeconds / 60
      );

    console.log(
      "📞 Ending video call:",
      {
        bookingId,
        durationSeconds,
        durationMinutes,
      }
    );

    // -------------------------------------------------------
    // RELEASE AGORA
    // -------------------------------------------------------

    await releaseEngine();

    // -------------------------------------------------------
    // TERMINATE CALL API
    // -------------------------------------------------------

    if (bookingId) {
      try {
        await terminateVideoCall(
          bookingId,
          durationMinutes
        );

        console.log(
          "✅ terminateVideoCall successful"
        );
      } catch (error) {
        console.error(
          "❌ terminateVideoCall error:",
          error
        );
      }
    }

    // -------------------------------------------------------
    // NAVIGATE
    // -------------------------------------------------------

    navigate(
      "/dashboard/my-bookings",
      {
        replace: true,
        state: {
          callEnded: true,
        },
      }
    );
  };

  // =========================================================
  // BROWSER CLOSE / REFRESH
  // =========================================================

  useEffect(() => {
    const handleBeforeUnload =
      () => {
        try {
          stopElapsedTimer();

          const audioTrack =
            localAudioTrackRef.current;

          const videoTrack =
            localVideoTrackRef.current;

          if (audioTrack) {
            audioTrack.stop();
            audioTrack.close();
          }

          if (videoTrack) {
            videoTrack.stop();
            videoTrack.close();
          }

          clientRef.current?.leave();
        } catch (error) {
          console.error(
            "❌ Browser cleanup error:",
            error
          );
        }
      };

    window.addEventListener(
      "beforeunload",
      handleBeforeUnload
    );

    return () => {
      window.removeEventListener(
        "beforeunload",
        handleBeforeUnload
      );
    };
  }, [stopElapsedTimer]);

  // =========================================================
  // FAILED SCREEN
  // =========================================================

  if (
    callStatus === "failed"
  ) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#08050d] px-4">
        <div className="w-full max-w-md rounded-3xl border border-red-500/20 bg-white/5 p-8 text-center text-white backdrop-blur-xl">

          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-500/10">
            <AlertCircle
              size={32}
              className="text-red-400"
            />
          </div>

          <h2 className="mt-5 text-2xl font-black">
            Unable to Join Call
          </h2>

          <p className="mt-3 text-sm leading-6 text-gray-400">
            {errorMessage ||
              "Something went wrong while starting the call."}
          </p>

          <div className="mt-6 flex justify-center gap-3">

            <button
              onClick={() =>
                navigate(-1)
              }
              className="rounded-2xl border border-white/10 bg-white/5 px-6 py-3 text-sm font-bold text-white transition hover:bg-white/10"
            >
              Go Back
            </button>

            <button
              onClick={() => {
                setErrorMessage(null);
                setConnecting(true);
                setCallStatus(
                  "connecting"
                );

                startCall();
              }}
              className="flex items-center gap-2 rounded-2xl bg-gradient-to-r from-violet-600 to-fuchsia-600 px-6 py-3 text-sm font-bold text-white transition hover:opacity-90"
            >
              <RefreshCw
                size={16}
              />

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

      {/* =====================================================
          HEADER
      ===================================================== */}

      <div className="absolute left-0 right-0 top-0 z-30 flex items-center justify-between bg-gradient-to-b from-black/80 to-transparent px-5 py-5 md:px-8">

        <div>
          <h1 className="text-lg font-black md:text-xl">
            Video Consultation
          </h1>

          <p className="text-xs text-gray-400">
            {astrologerName}
          </p>
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

      {/* =====================================================
          REMOTE VIDEO
      ===================================================== */}

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
              {connecting
                ? "Connecting..."
                : "Waiting for Astrologer"}
            </h2>

            <p className="mt-2 max-w-sm px-5 text-center text-sm text-gray-400">
              {connecting
                ? "Establishing secure video connection..."
                : "Please wait while the astrologer joins the consultation."}
            </p>

            {connecting && (
              <Loader2
                size={28}
                className="mt-6 animate-spin text-purple-400"
              />
            )}

          </div>
        )}

      </div>

      {/* =====================================================
          LOCAL VIDEO
      ===================================================== */}

      <div className="absolute right-4 top-20 z-20 h-40 w-28 overflow-hidden rounded-2xl border border-white/20 bg-black shadow-2xl md:right-7 md:top-24 md:h-52 md:w-72">

        <div
          ref={localVideoRef}
          className="h-full w-full"
        />

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

      {/* =====================================================
          CONNECTED BADGE
      ===================================================== */}

      {remoteJoined && (
        <div className="absolute left-1/2 top-20 z-20 -translate-x-1/2 rounded-full border border-emerald-400/20 bg-black/50 px-4 py-2 text-xs font-bold text-emerald-300 backdrop-blur-md">
          Connected securely
        </div>
      )}

      {/* =====================================================
          CONTROLS
      ===================================================== */}

      <div className="absolute bottom-0 left-0 right-0 z-30 bg-gradient-to-t from-black via-black/80 to-transparent px-5 pb-8 pt-24">

        <div className="flex items-center justify-center gap-3 md:gap-5">

          {/* MIC */}

          <button
            onClick={toggleMic}
            disabled={!joined}
            title={
              localAudioTrackRef.current
                ? "Toggle microphone"
                : "Microphone unavailable — tap to retry"
            }
            className={`flex h-14 w-14 items-center justify-center rounded-full border transition-all active:scale-95 ${
              isMicMuted
                ? "border-red-500/30 bg-red-500 text-white"
                : "border-white/10 bg-white/10 text-white hover:bg-white/20"
            } disabled:cursor-not-allowed disabled:opacity-40`}
          >
            {isMicMuted ? (
              <MicOff size={21} />
            ) : (
              <Mic size={21} />
            )}
          </button>

          {/* CAMERA */}

          <button
            onClick={toggleCamera}
            disabled={!joined}
            title={
              localVideoTrackRef.current
                ? "Toggle camera"
                : "Camera unavailable — tap to retry"
            }
            className={`flex h-14 w-14 items-center justify-center rounded-full border transition-all active:scale-95 ${
              !isLocalVideoEnabled
                ? "border-red-500/30 bg-red-500 text-white"
                : "border-white/10 bg-white/10 text-white hover:bg-white/20"
            } disabled:cursor-not-allowed disabled:opacity-40`}
          >
            {!isLocalVideoEnabled ? (
              <VideoOff size={21} />
            ) : (
              <Video size={21} />
            )}
          </button>

          {/* FLIP CAMERA */}

          <button
            onClick={flipCamera}
            disabled={
              !joined ||
              !localVideoTrackRef.current
            }
            title="Switch camera"
            className="flex h-14 w-14 items-center justify-center rounded-full border border-white/10 bg-white/10 text-white transition-all hover:bg-white/20 active:scale-95 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <RefreshCw
              size={21}
              className={
                isFrontCamera
                  ? ""
                  : "rotate-180 transition-transform"
              }
            />
          </button>

          {/* SPEAKER */}

          <button
            onClick={toggleSpeaker}
            disabled={!joined}
            title="Speaker"
            className={`flex h-14 w-14 items-center justify-center rounded-full border transition-all active:scale-95 ${
              !isSpeakerOn
                ? "border-yellow-500/30 bg-yellow-500 text-black"
                : "border-white/10 bg-white/10 text-white hover:bg-white/20"
            } disabled:cursor-not-allowed disabled:opacity-40`}
          >
            {isSpeakerOn ? (
              <Volume2 size={21} />
            ) : (
              <VolumeX size={21} />
            )}
          </button>

          {/* END CALL */}

          <button
            onClick={endCall}
            disabled={ending}
            title="End call"
            className="flex h-16 w-16 items-center justify-center rounded-full bg-red-600 text-white shadow-xl shadow-red-600/30 transition-all hover:bg-red-700 active:scale-95 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {ending ? (
              <Loader2
                size={24}
                className="animate-spin"
              />
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

export default VideoCallScreen;