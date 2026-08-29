
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

  const astrologerImage =
    partner?.profilePic ||
    partner?.profileImage ||
    partner?.image ||
    booking?.partner?.profilePic ||
    booking?.partner?.profileImage ||
    "";

  /* =========================================================
     AGORA REFS
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
  ========================================================= */

  const [callData, setCallData] = useState(null);

  const [connecting, setConnecting] = useState(true);

  const [joined, setJoined] = useState(false);

  const [remoteJoined, setRemoteJoined] = useState(false);

  const [muted, setMuted] = useState(false);

  const [cameraOff, setCameraOff] = useState(false);

  const [speakerOn, setSpeakerOn] = useState(true);

  const [frontCamera, setFrontCamera] = useState(true);

  const [ending, setEnding] = useState(false);

  const [duration, setDuration] = useState(0);

  const [callStatus, setCallStatus] =
    useState("connecting");

  const [error, setError] = useState("");

  /* =========================================================
     FORMAT DURATION
  ========================================================= */

  const formatDuration = useCallback((seconds) => {
    const mins = Math.floor(seconds / 60)
      .toString()
      .padStart(2, "0");

    const secs = (seconds % 60)
      .toString()
      .padStart(2, "0");

    return `${mins}:${secs}`;
  }, []);

  /* =========================================================
     START TIMER
  ========================================================= */

  const startTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    elapsedSecondsRef.current = 0;
    setDuration(0);

    timerRef.current = setInterval(() => {
      elapsedSecondsRef.current += 1;

      setDuration(
        elapsedSecondsRef.current
      );
    }, 1000);
  }, []);

  /* =========================================================
     STOP TIMER
  ========================================================= */

  const stopTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  /* =========================================================
     CLEAR REMOTE VIDEO
  ========================================================= */

  const clearRemoteVideo = useCallback(() => {
    try {
      if (remoteVideoRef.current) {
        remoteVideoRef.current.innerHTML = "";
      }
    } catch (err) {
      console.error(
        "Clear remote video error:",
        err
      );
    }
  }, []);

  /* =========================================================
     PLAY REMOTE VIDEO
  ========================================================= */

  const playRemoteVideo = useCallback(
    (user) => {
      if (
        !remoteVideoRef.current ||
        !user?.videoTrack
      ) {
        return;
      }

      try {
        remoteVideoRef.current.innerHTML = "";

        user.videoTrack.play(
          remoteVideoRef.current
        );

        console.log(
          "▶️ Remote video playing:",
          user.uid
        );
      } catch (err) {
        console.error(
          "❌ Remote video play error:",
          err
        );
      }
    },
    []
  );

  /* =========================================================
     PLAY REMOTE AUDIO
  ========================================================= */

  const playRemoteAudio = useCallback(
    (user) => {
      if (!user?.audioTrack) {
        return;
      }

      try {
        user.audioTrack.setVolume(
          speakerOn ? 100 : 0
        );

        user.audioTrack.play();

        console.log(
          "🔊 Remote audio playing:",
          user.uid
        );
      } catch (err) {
        console.error(
          "❌ Remote audio play error:",
          err
        );
      }
    },
    [speakerOn]
  );

  /* =========================================================
     AGORA CLEANUP
  ========================================================= */

  const cleanupAgora = useCallback(
    async () => {
      stopTimer();

      console.log(
        "🧹 Cleaning Agora session..."
      );

      /* -----------------------------------------
         LOCAL AUDIO
      ----------------------------------------- */

      if (localAudioTrackRef.current) {
        try {
          localAudioTrackRef.current.stop();
        } catch {}

        try {
          localAudioTrackRef.current.close();
        } catch {}

        localAudioTrackRef.current = null;
      }

      /* -----------------------------------------
         LOCAL VIDEO
      ----------------------------------------- */

      if (localVideoTrackRef.current) {
        try {
          localVideoTrackRef.current.stop();
        } catch {}

        try {
          localVideoTrackRef.current.close();
        } catch {}

        localVideoTrackRef.current = null;
      }

      /* -----------------------------------------
         AGORA CLIENT
      ----------------------------------------- */

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
        } catch (err) {
          console.error(
            "Agora leave error:",
            err
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

      console.log(
        "✅ Agora cleanup completed"
      );
    },
    [
      clearRemoteVideo,
      stopTimer,
    ]
  );

  /* =========================================================
     JOIN AGORA
  ========================================================= */

  const joinAgora = useCallback(
    async (
      appId,
      channelName,
      rtcToken,
      uid
    ) => {
      console.log(
        "🔵 Starting Agora connection..."
      );

      /* -----------------------------------------
         VALIDATION
      ----------------------------------------- */

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

      /* -----------------------------------------
         CLEAN OLD CLIENT
      ----------------------------------------- */

      if (clientRef.current) {
        console.log(
          "⚠️ Existing Agora client found. Cleaning..."
        );

        await cleanupAgora();
      }

      /* -----------------------------------------
         CREATE CLIENT
      ----------------------------------------- */

      const client =
        AgoraRTC.createClient({
          mode: "rtc",
          codec: "vp8",
        });

      clientRef.current = client;

      /* =====================================================
         USER PUBLISHED
      ===================================================== */

      client.on(
        "user-published",
        async (
          user,
          mediaType
        ) => {
          try {
            console.log(
              "📡 USER PUBLISHED:",
              {
                uid: user.uid,
                mediaType,
              }
            );

            await client.subscribe(
              user,
              mediaType
            );

            console.log(
              "✅ USER SUBSCRIBED:",
              {
                uid: user.uid,
                mediaType,
              }
            );

            remoteUserRef.current =
              user;

            setRemoteJoined(true);
            setCallStatus(
              "in-progress"
            );

            if (
              mediaType === "video"
            ) {
              playRemoteVideo(user);
            }

            if (
              mediaType === "audio"
            ) {
              playRemoteAudio(user);
            }
          } catch (err) {
            console.error(
              "❌ Remote subscribe error:",
              err
            );
          }
        }
      );

      /* =====================================================
         USER UNPUBLISHED
      ===================================================== */

      client.on(
        "user-unpublished",
        (
          user,
          mediaType
        ) => {
          console.log(
            "📴 USER UNPUBLISHED:",
            {
              uid: user.uid,
              mediaType,
            }
          );

          if (
            mediaType === "video"
          ) {
            clearRemoteVideo();
          }
        }
      );

      /* =====================================================
         USER LEFT
      ===================================================== */

      client.on(
        "user-left",
        (user) => {
          console.log(
            "❌ REMOTE USER LEFT:",
            user.uid
          );

          remoteUserRef.current =
            null;

          clearRemoteVideo();

          setRemoteJoined(false);

          setCallStatus(
            "completed"
          );

          stopTimer();
        }
      );

      /* =====================================================
         CONNECTION STATE
      ===================================================== */

      client.on(
        "connection-state-change",
        (
          currentState,
          previousState
        ) => {
          console.log(
            `🔌 Agora connection: ${previousState} → ${currentState}`
          );

          if (
            currentState ===
            "CONNECTED"
          ) {
            console.log(
              "✅ Agora connected"
            );
          }

          if (
            currentState ===
            "DISCONNECTED"
          ) {
            if (
              !endingRef.current
            ) {
              setCallStatus(
                "completed"
              );

              stopTimer();
            }
          }
        }
      );

      /* =====================================================
         EXCEPTION
      ===================================================== */

      client.on(
        "exception",
        (event) => {
          console.warn(
            "⚠️ Agora exception:",
            event
          );
        }
      );

      /* =====================================================
         JOIN CHANNEL
      ===================================================== */

      console.log(
        "🔵 Joining Agora channel..."
      );

      console.log({
        appId,
        channelName,
        uid,
        tokenLength:
          rtcToken?.length,
      });

      let joinedAgora = false;

      const attemptJoin =
        async (retries = 5) => {
          try {
            await client.join(
              appId,
              channelName,
              rtcToken,
              uid
            );

            joinedAgora = true;

            console.log(
              "✅ Agora channel joined successfully"
            );
          } catch (err) {
            console.error(
              "❌ Agora join error:",
              err
            );

            const message =
              err?.message || "";

            if (
              message.includes(
                "UID_CONFLICT"
              ) &&
              retries > 0
            ) {
              console.log(
                `⚠️ UID conflict. Retrying... ${retries} attempts left`
              );

              await new Promise(
                (resolve) =>
                  setTimeout(
                    resolve,
                    2000
                  )
              );

              return attemptJoin(
                retries - 1
              );
            }

            throw err;
          }
        };

      await attemptJoin();

      if (!joinedAgora) {
        throw new Error(
          "Unable to join Agora channel."
        );
      }

      if (!mountedRef.current) {
        await client.leave();
        return;
      }

      /* =====================================================
         CREATE LOCAL TRACKS
      ===================================================== */

      let audioTrack = null;
      let videoTrack = null;

      try {
        console.log(
          "🎙️ Creating microphone..."
        );

        audioTrack =
          await AgoraRTC.createMicrophoneAudioTrack();

        console.log(
          "✅ Microphone created"
        );
      } catch (err) {
        console.error(
          "❌ Microphone creation failed:",
          err
        );

        if (mountedRef.current) {
          setMuted(true);
        }
      }

      try {
        console.log(
          "📷 Creating camera..."
        );

        videoTrack =
          await AgoraRTC.createCameraVideoTrack();

        console.log(
          "✅ Camera created"
        );
      } catch (err) {
        console.error(
          "❌ Camera creation failed:",
          err
        );

        if (mountedRef.current) {
          setCameraOff(true);
        }
      }

      if (
        !audioTrack &&
        !videoTrack
      ) {
        throw new Error(
          "Could not access camera or microphone. Please check browser permissions."
        );
      }

      localAudioTrackRef.current =
        audioTrack;

      localVideoTrackRef.current =
        videoTrack;

      /* =====================================================
         PLAY LOCAL VIDEO
      ===================================================== */

      if (
        videoTrack &&
        localVideoRef.current
      ) {
        try {
          videoTrack.play(
            localVideoRef.current
          );

          console.log(
            "▶️ Local video playing"
          );
        } catch (err) {
          console.error(
            "❌ Local video play error:",
            err
          );
        }
      }

      /* =====================================================
         PUBLISH TRACKS
      ===================================================== */

      const tracks = [];

      if (audioTrack) {
        tracks.push(audioTrack);
      }

      if (videoTrack) {
        tracks.push(videoTrack);
      }

      if (!mountedRef.current) {
        audioTrack?.close();
        videoTrack?.close();

        await client.leave();

        return;
      }

      console.log(
        "📤 Publishing local tracks..."
      );

      await client.publish(
        tracks
      );

      console.log(
        "✅ Local tracks published"
      );

      if (mountedRef.current) {
        setJoined(true);
        setConnecting(false);
        setCallStatus("waiting");
      }
    },
    [
      cleanupAgora,
      clearRemoteVideo,
      playRemoteAudio,
      playRemoteVideo,
      stopTimer,
    ]
  );

  /* =========================================================
     INITIATE VIDEO CALL
  ========================================================= */

  const startVideoCall =
    useCallback(async () => {
      if (
        initializingRef.current
      ) {
        console.log(
          "⚠️ Video call initialization already running"
        );

        return;
      }

      if (!bookingId) {
        setError(
          "Booking ID is missing."
        );

        setConnecting(false);
        setCallStatus("failed");

        return;
      }

      initializingRef.current = true;

      try {
        setConnecting(true);
        setError("");
        setCallStatus(
          "connecting"
        );

        console.log(
          "========================================"
        );

        console.log(
          "📞 STARTING VIDEO CALL"
        );

        console.log(
          "Booking ID:",
          bookingId
        );

        console.log(
          "========================================"
        );

        /* =====================================================
           IMPORTANT
           
           DO NOT call getUserMedia() here.
           
           Agora itself will request camera/mic.
           Calling getUserMedia() separately causes
           duplicate camera/mic streams on mobile.
        ===================================================== */

        /* =====================================================
           INITIATE API
        ===================================================== */

        console.log(
          "🔵 Calling initiateVideoCall..."
        );

        const response =
          await initiateVideoCall(
            bookingId
          );

        console.log(
          "📥 initiateVideoCall response:",
          response
        );

        if (
          !response?.data?.success
        ) {
          throw new Error(
            response?.data?.message ||
              "Unable to initiate video call."
          );
        }

        const data =
          response.data;

        console.log(
          "✅ Video call session received:",
          {
            appId: data.appId,
            channelName:
              data.channelName,
            uid: data.uid,
            tokenLength:
              data.rtcToken?.length,
          }
        );

        /* =====================================================
           SESSION VALIDATION
        ===================================================== */

        if (!data.appId) {
          throw new Error(
            "Agora App ID is missing from server response."
          );
        }

        if (!data.channelName) {
          throw new Error(
            "Agora channel name is missing from server response."
          );
        }

        if (!data.rtcToken) {
          throw new Error(
            "Agora RTC token is missing from server response."
          );
        }

        if (
          data.uid === undefined ||
          data.uid === null
        ) {
          throw new Error(
            "Agora UID is missing from server response."
          );
        }

        setCallData(data);

        /* =====================================================
           JOIN AGORA
        ===================================================== */

        await joinAgora(
          data.appId,
          data.channelName,
          data.rtcToken,
          data.uid
        );
      } catch (err) {
        console.error(
          "❌ VIDEO CALL START ERROR:",
          err
        );

        if (
          mountedRef.current
        ) {
          const message =
            err?.response?.data
              ?.message ||
            err?.message ||
            "Unable to start video call.";

          setError(message);

          setConnecting(false);
          setCallStatus("failed");
        }

        await cleanupAgora();
      } finally {
        initializingRef.current =
          false;
      }
    }, [
      bookingId,
      cleanupAgora,
      joinAgora,
    ]);

  /* =========================================================
     INITIALIZE COMPONENT
  ========================================================= */

  useEffect(() => {
    mountedRef.current = true;

    if (!bookingId) {
      setError(
        "Booking ID is missing."
      );

      setConnecting(false);
      setCallStatus("failed");

      return () => {
        mountedRef.current = false;
      };
    }

    startVideoCall();

    return () => {
      mountedRef.current = false;

      console.log(
        "🔴 VideoCall component unmounted"
      );

      cleanupAgora();
    };
  }, [
    bookingId,
    startVideoCall,
    cleanupAgora,
  ]);

  /* =========================================================
     START TIMER WHEN BOTH USERS CONNECT
  ========================================================= */

  useEffect(() => {
    if (
      joined &&
      remoteJoined
    ) {
      console.log(
        "⏱️ Both users connected. Timer started."
      );

      startTimer();
    }

    return () => {
      if (
        !remoteJoined ||
        !joined
      ) {
        return;
      }

      stopTimer();
    };
  }, [
    joined,
    remoteJoined,
    startTimer,
    stopTimer,
  ]);

  /* =========================================================
     MICROPHONE
  ========================================================= */

  const toggleMicrophone =
    async () => {
      const track =
        localAudioTrackRef.current;

      if (!track) {
        console.warn(
          "⚠️ Microphone track not available"
        );

        return;
      }

      try {
        const nextMuted =
          !muted;

        await track.setEnabled(
          !nextMuted
        );

        setMuted(nextMuted);

        console.log(
          nextMuted
            ? "🔇 Microphone muted"
            : "🎙️ Microphone unmuted"
        );
      } catch (err) {
        console.error(
          "❌ Microphone toggle error:",
          err
        );
      }
    };

  /* =========================================================
     CAMERA
  ========================================================= */

  const toggleCamera =
    async () => {
      const track =
        localVideoTrackRef.current;

      if (!track) {
        console.warn(
          "⚠️ Camera track not available"
        );

        return;
      }

      try {
        const nextCameraOff =
          !cameraOff;

        await track.setEnabled(
          !nextCameraOff
        );

        setCameraOff(
          nextCameraOff
        );

        console.log(
          nextCameraOff
            ? "📷 Camera disabled"
            : "📷 Camera enabled"
        );
      } catch (err) {
        console.error(
          "❌ Camera toggle error:",
          err
        );
      }
    };

  /* =========================================================
     SWITCH CAMERA
  ========================================================= */

  const flipCamera =
    async () => {
      const track =
        localVideoTrackRef.current;

      if (!track) {
        return;
      }

      try {
        const devices =
          await AgoraRTC.getCameras();

        if (
          !devices ||
          devices.length < 2
        ) {
          console.warn(
            "⚠️ Only one camera is available"
          );

          return;
        }

        const currentDeviceId =
          track.getTrackLabel?.();

        console.log(
          "📷 Available cameras:",
          devices
        );

        /*
         * Agora Web SDK supports switchDevice
         * with a specific deviceId.
         */

        const currentLabel =
          track.getTrackLabel?.() ||
          "";

        const nextDevice =
          devices.find(
            (device) =>
              device.label !==
              currentLabel
          ) || devices[0];

        await track.switchDevice(
          nextDevice.deviceId
        );

        setFrontCamera(
          (prev) => !prev
        );

        console.log(
          "✅ Camera switched:",
          nextDevice.label
        );
      } catch (err) {
        console.error(
          "❌ Camera switch error:",
          err
        );
      }
    };

  /* =========================================================
     SPEAKER
  ========================================================= */

  const toggleSpeaker =
    () => {
      try {
        const nextSpeaker =
          !speakerOn;

        setSpeakerOn(
          nextSpeaker
        );

        const remoteUser =
          remoteUserRef.current;

        if (
          remoteUser?.audioTrack
        ) {
          remoteUser.audioTrack.setVolume(
            nextSpeaker
              ? 100
              : 0
          );
        }

        console.log(
          nextSpeaker
            ? "🔊 Speaker ON"
            : "🔇 Speaker OFF"
        );
      } catch (err) {
        console.error(
          "❌ Speaker toggle error:",
          err
        );
      }
    };

  /* =========================================================
     END CALL
  ========================================================= */

  const handleEndCall =
    async () => {
      if (
        endingRef.current ||
        ending
      ) {
        return;
      }

      endingRef.current = true;
      setEnding(true);

      try {
        stopTimer();

        const elapsedSeconds =
          elapsedSecondsRef.current;

        /*
         * IMPORTANT:
         *
         * Backend expects actualDuration
         * in MINUTES.
         *
         * Backend:
         *
         * actualDuration * ratePerMinute
         *
         * Therefore seconds MUST be converted
         * into minutes before sending.
         */

        const actualDurationMinutes =
          Math.ceil(
            elapsedSeconds / 60
          );

        console.log(
          "📞 Ending video call:",
          {
            bookingId,
            elapsedSeconds,
            actualDurationMinutes,
          }
        );

        /* =====================================================
           TERMINATE API
        ===================================================== */

        if (bookingId) {
          try {
            const response =
              await terminateVideoCall(
                bookingId,
                actualDurationMinutes
              );

            console.log(
              "✅ terminateVideoCall response:",
              response
            );
          } catch (apiError) {
            console.error(
              "❌ terminateVideoCall error:",
              apiError
            );

            /*
             * Even if backend termination fails,
             * Agora must still be cleaned.
             */
          }
        }

        /* =====================================================
           CLEAN AGORA
        ===================================================== */

        await cleanupAgora();

        /* =====================================================
           REDIRECT
        ===================================================== */

        if (
          mountedRef.current
        ) {
          navigate(
            "/dashboard/my-bookings",
            {
              replace: true,
              state: {
                callEnded: true,
              },
            }
          );
        }
      } catch (err) {
        console.error(
          "❌ End call error:",
          err
        );

        if (
          mountedRef.current
        ) {
          setError(
            err?.response?.data
              ?.message ||
              err?.message ||
              "Unable to end video call."
          );
        }

        endingRef.current =
          false;

        setEnding(false);
      }
    };

  /* =========================================================
     BROWSER CLOSE / REFRESH
  ========================================================= */

  useEffect(() => {
    const handleBeforeUnload =
      () => {
        try {
          stopTimer();

          const audio =
            localAudioTrackRef.current;

          const video =
            localVideoTrackRef.current;

          audio?.stop();
          audio?.close();

          video?.stop();
          video?.close();

          clientRef.current?.leave();
        } catch (err) {
          console.error(
            "beforeunload cleanup error:",
            err
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
  }, [stopTimer]);

  /* =========================================================
     FAILED SCREEN
  ========================================================= */

  if (
    error &&
    !connecting
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
            {error}
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
                setError("");
                setConnecting(true);
                setCallStatus(
                  "connecting"
                );

                startVideoCall();
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

      {/* =====================================================
          TOP BAR
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
                ? formatDuration(
                    duration
                  )
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

                {astrologerImage ? (
                  <img
                    src={astrologerImage}
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

        {cameraOff && (
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
          CONNECTED STATUS
      ===================================================== */}

      {remoteJoined && (
        <div className="absolute left-1/2 top-20 z-20 -translate-x-1/2 rounded-full border border-emerald-400/20 bg-black/50 px-4 py-2 text-xs font-bold text-emerald-300 backdrop-blur-md">
          Connected securely
        </div>
      )}

      {/* =====================================================
          BOTTOM CONTROLS
      ===================================================== */}

      <div className="absolute bottom-0 left-0 right-0 z-30 bg-gradient-to-t from-black via-black/80 to-transparent px-5 pb-8 pt-24">

        <div className="flex items-center justify-center gap-3 md:gap-5">

          {/* MICROPHONE */}

          <button
            onClick={toggleMicrophone}
            disabled={
              !joined ||
              !localAudioTrackRef.current
            }
            className={`flex h-14 w-14 items-center justify-center rounded-full border transition-all active:scale-95 ${
              muted
                ? "border-red-500/30 bg-red-500 text-white"
                : "border-white/10 bg-white/10 text-white hover:bg-white/20"
            } disabled:cursor-not-allowed disabled:opacity-40`}
          >
            {muted ? (
              <MicOff size={21} />
            ) : (
              <Mic size={21} />
            )}
          </button>

          {/* CAMERA */}

          <button
            onClick={toggleCamera}
            disabled={
              !joined ||
              !localVideoTrackRef.current
            }
            className={`flex h-14 w-14 items-center justify-center rounded-full border transition-all active:scale-95 ${
              cameraOff
                ? "border-red-500/30 bg-red-500 text-white"
                : "border-white/10 bg-white/10 text-white hover:bg-white/20"
            } disabled:cursor-not-allowed disabled:opacity-40`}
          >
            {cameraOff ? (
              <VideoOff size={21} />
            ) : (
              <Video size={21} />
            )}
          </button>

          {/* SWITCH CAMERA */}

          <button
            onClick={flipCamera}
            disabled={
              !joined ||
              !localVideoTrackRef.current
            }
            className="flex h-14 w-14 items-center justify-center rounded-full border border-white/10 bg-white/10 text-white transition-all hover:bg-white/20 active:scale-95 disabled:cursor-not-allowed disabled:opacity-40"
            title="Switch Camera"
          >
            <RefreshCw size={21} />
          </button>

          {/* SPEAKER */}

          <button
            onClick={toggleSpeaker}
            disabled={!joined}
            className={`flex h-14 w-14 items-center justify-center rounded-full border transition-all active:scale-95 ${
              !speakerOn
                ? "border-yellow-500/30 bg-yellow-500 text-black"
                : "border-white/10 bg-white/10 text-white hover:bg-white/20"
            } disabled:cursor-not-allowed disabled:opacity-40`}
            title="Speaker"
          >
            {speakerOn ? (
              <Volume2 size={21} />
            ) : (
              <VolumeX size={21} />
            )}
          </button>

          {/* END CALL */}

          <button
            onClick={handleEndCall}
            disabled={ending}
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

export default VideoCall;

