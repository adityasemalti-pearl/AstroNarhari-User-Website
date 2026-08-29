import React, { useCallback, useEffect, useRef, useState } from "react";
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
     BOOKING / PARTNER DATA
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
    "";

  /* =========================================================
     AGORA REFS
  ========================================================= */

  const clientRef = useRef(null);

  const localVideoRef = useRef(null);

  const localAudioTrackRef = useRef(null);
  const localVideoTrackRef = useRef(null);

  const remoteVideoRef = useRef(null);

  const isMountedRef = useRef(true);
  const initializingRef = useRef(false);
  const endingRef = useRef(false);

  const timerRef = useRef(null);

  const elapsedSecondsRef = useRef(0);

  const remoteUserRef = useRef(null);

  /* =========================================================
     STATE
  ========================================================= */

  const [callData, setCallData] = useState(null);

  const [callStatus, setCallStatus] = useState("connecting");

  const [joined, setJoined] = useState(false);

  const [remoteJoined, setRemoteJoined] = useState(false);

  const [connecting, setConnecting] = useState(true);

  const [muted, setMuted] = useState(false);

  const [cameraOff, setCameraOff] = useState(false);

  const [speakerOn, setSpeakerOn] = useState(true);

  const [frontCamera, setFrontCamera] = useState(true);

  const [ending, setEnding] = useState(false);

  const [duration, setDuration] = useState(0);

  const [error, setError] = useState("");

  /* =========================================================
     FORMAT TIMER
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

      setDuration(elapsedSecondsRef.current);
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
     RENDER REMOTE VIDEO
  ========================================================= */

  const renderRemoteVideo = useCallback((user) => {
    remoteUserRef.current = user;

    setRemoteJoined(true);
    setCallStatus("in-progress");

    setTimeout(() => {
      if (
        remoteVideoRef.current &&
        user.videoTrack
      ) {
        try {
          user.videoTrack.play(
            remoteVideoRef.current
          );
        } catch (error) {
          console.error(
            "Remote video play error:",
            error
          );
        }
      }
    }, 100);
  }, []);

  /* =========================================================
     STOP REMOTE VIDEO
  ========================================================= */

  const clearRemoteVideo = useCallback(() => {
    try {
      if (remoteVideoRef.current) {
        remoteVideoRef.current.innerHTML = "";
      }
    } catch (error) {
      console.error(
        "Clear remote video error:",
        error
      );
    }
  }, []);

  /* =========================================================
     AGORA CLEANUP
  ========================================================= */

  const cleanupAgora = useCallback(async () => {
    stopTimer();

    try {
      const client = clientRef.current;

      if (client) {
        try {
          client.removeAllListeners();
        } catch (error) {
          console.error(
            "Agora remove listeners error:",
            error
          );
        }

        try {
          if (
            client.connectionState !== "DISCONNECTED"
          ) {
            await client.leave();
          }
        } catch (error) {
          console.error(
            "Agora leave error:",
            error
          );
        }
      }

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

      clearRemoteVideo();

      remoteUserRef.current = null;

      clientRef.current = null;

      setJoined(false);
      setRemoteJoined(false);
    } catch (error) {
      console.error(
        "Agora cleanup error:",
        error
      );
    }
  }, [clearRemoteVideo, stopTimer]);

  /* =========================================================
     INITIALIZE AGORA
  ========================================================= */

  const joinAgora = useCallback(
    async (
      appId,
      channelName,
      rtcToken,
      uid
    ) => {
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

      if (uid === undefined || uid === null) {
        throw new Error(
          "Agora UID is missing."
        );
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

      /* -----------------------------------------
         USER PUBLISHED
      ----------------------------------------- */

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

            console.log(
              "✅ Remote user subscribed:",
              user.uid,
              mediaType
            );

            remoteUserRef.current = user;

            /* -------------------------------
               REMOTE VIDEO
            -------------------------------- */

            if (mediaType === "video") {
              setRemoteJoined(true);
              setCallStatus("in-progress");

              setTimeout(() => {
                if (
                  remoteVideoRef.current &&
                  user.videoTrack
                ) {
                  remoteVideoRef.current.innerHTML =
                    "";

                  user.videoTrack.play(
                    remoteVideoRef.current
                  );
                }
              }, 100);
            }

            /* -------------------------------
               REMOTE AUDIO
            -------------------------------- */

            if (mediaType === "audio") {
              try {
                user.audioTrack?.play();
              } catch (audioError) {
                console.error(
                  "Remote audio play error:",
                  audioError
                );
              }

              setRemoteJoined(true);
              setCallStatus("in-progress");
            }
          } catch (error) {
            console.error(
              "Remote subscribe error:",
              error
            );
          }
        }
      );

      /* -----------------------------------------
         USER UNPUBLISHED
      ----------------------------------------- */

      client.on(
        "user-unpublished",
        (user, mediaType) => {
          console.log(
            "📴 Remote user unpublished:",
            user.uid,
            mediaType
          );

          if (mediaType === "video") {
            clearRemoteVideo();
          }
        }
      );

      /* -----------------------------------------
         USER LEFT
      ----------------------------------------- */

      client.on(
        "user-left",
        (user) => {
          console.log(
            "❌ Remote user left:",
            user.uid
          );

          remoteUserRef.current = null;

          clearRemoteVideo();

          setRemoteJoined(false);

          setCallStatus("completed");

          stopTimer();
        }
      );

      /* -----------------------------------------
         CONNECTION STATE
      ----------------------------------------- */

      client.on(
        "connection-state-change",
        (
          curState,
          prevState
        ) => {
          console.log(
            `Agora connection: ${prevState} → ${curState}`
          );

          if (
            curState === "DISCONNECTED"
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

      /* -----------------------------------------
         EXCEPTION
      ----------------------------------------- */

      client.on(
        "exception",
        (event) => {
          console.warn(
            "⚠️ Agora exception:",
            event
          );
        }
      );

      /* -----------------------------------------
         JOIN CHANNEL
      ----------------------------------------- */

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

      const attemptJoin = async (
        retries = 5
      ) => {
        try {
          await client.join(
            appId,
            channelName,
            rtcToken,
            uid
          );

          joinedAgora = true;

          console.log(
            "✅ Agora channel joined"
          );
        } catch (error) {
          console.error(
            "Agora join error:",
            error
          );

          const errorMessage =
            error?.message || "";

          if (
            errorMessage.includes(
              "UID_CONFLICT"
            ) &&
            retries > 0
          ) {
            console.log(
              `⚠️ UID conflict. Retrying... ${retries}`
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

          throw error;
        }
      };

      await attemptJoin();

      if (!joinedAgora) {
        throw new Error(
          "Unable to join Agora channel."
        );
      }

      if (!isMountedRef.current) {
        await client.leave();
        return;
      }

      /* -----------------------------------------
         CREATE LOCAL TRACKS
      ----------------------------------------- */

      let audioTrack = null;
      let videoTrack = null;

      try {
        console.log(
          "🎙️ Creating microphone + camera tracks..."
        );

        const tracks =
          await AgoraRTC.createMicrophoneAndCameraTracks();

        audioTrack = tracks[0];
        videoTrack = tracks[1];

        console.log(
          "✅ Microphone + camera tracks created"
        );
      } catch (trackError) {
        console.error(
          "Camera + microphone creation failed:",
          trackError
        );

        /* ---------------------------------------
           TRY AUDIO SEPARATELY
        --------------------------------------- */

        try {
          audioTrack =
            await AgoraRTC.createMicrophoneAudioTrack();

          console.log(
            "✅ Microphone created separately"
          );
        } catch (audioError) {
          console.error(
            "Microphone failed:",
            audioError
          );

          if (isMountedRef.current) {
            setMuted(true);
          }
        }

        /* ---------------------------------------
           TRY CAMERA SEPARATELY
        --------------------------------------- */

        try {
          videoTrack =
            await AgoraRTC.createCameraVideoTrack();

          console.log(
            "✅ Camera created separately"
          );
        } catch (videoError) {
          console.error(
            "Camera failed:",
            videoError
          );

          if (isMountedRef.current) {
            setCameraOff(true);
          }
        }
      }

      if (!audioTrack && !videoTrack) {
        throw new Error(
          "Could not access Camera or Microphone. Please check your browser permissions."
        );
      }

      localAudioTrackRef.current =
        audioTrack;

      localVideoTrackRef.current =
        videoTrack;

      /* -----------------------------------------
         LOCAL VIDEO PLAY
      ----------------------------------------- */

      if (
        videoTrack &&
        localVideoRef.current
      ) {
        videoTrack.play(
          localVideoRef.current
        );
      }

      /* -----------------------------------------
         PUBLISH LOCAL TRACKS
      ----------------------------------------- */

      const tracksToPublish = [];

      if (audioTrack) {
        tracksToPublish.push(
          audioTrack
        );
      }

      if (videoTrack) {
        tracksToPublish.push(
          videoTrack
        );
      }

      if (!isMountedRef.current) {
        audioTrack?.close();
        videoTrack?.close();

        await client.leave();

        return;
      }

      await client.publish(
        tracksToPublish
      );

      console.log(
        "✅ Local tracks published"
      );

      if (isMountedRef.current) {
        setJoined(true);

        setConnecting(false);

        setCallStatus("waiting");
      }
    },
    [clearRemoteVideo, stopTimer]
  );

  /* =========================================================
     START VIDEO CALL
  ========================================================= */

  const startVideoCall = useCallback(
    async () => {
      if (
        initializingRef.current
      ) {
        return;
      }

      initializingRef.current = true;

      try {
        setConnecting(true);
        setError("");

        setCallStatus("connecting");

        /* ---------------------------------------
           BOOKING VALIDATION
        --------------------------------------- */

        if (
          !bookingId
        ) {
          throw new Error(
            "Booking ID is missing."
          );
        }

        /* ---------------------------------------
           CAMERA PERMISSION
        --------------------------------------- */

        try {
          await navigator.mediaDevices.getUserMedia(
            {
              video: true,
              audio: true,
            }
          );
        } catch (permissionError) {
          console.error(
            "Browser permission error:",
            permissionError
          );

          throw new Error(
            "Camera and microphone permissions are required for a video call."
          );
        }

        /* ---------------------------------------
           INITIATE CALL API
        --------------------------------------- */

        console.log(
          "🔵 Calling initiateVideoCall:",
          bookingId
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
          "✅ Video call session:",
          data
        );

        if (
          !data.appId ||
          !data.channelName ||
          !data.rtcToken
        ) {
          throw new Error(
            "Invalid video call session received from server."
          );
        }

        setCallData(data);

        /* ---------------------------------------
           JOIN AGORA
        --------------------------------------- */

        await joinAgora(
          data.appId,
          data.channelName,
          data.rtcToken,
          data.uid
        );
      } catch (error) {
        console.error(
          "❌ Video call start error:",
          error
        );

        if (
          isMountedRef.current
        ) {
          setError(
            error?.response
              ?.data?.message ||
              error?.message ||
              "Unable to start video call."
          );

          setConnecting(false);

          setCallStatus("failed");
        }

        await cleanupAgora();
      } finally {
        initializingRef.current =
          false;
      }
    },
    [
      bookingId,
      cleanupAgora,
      joinAgora,
    ]
  );

  /* =========================================================
     INIT
  ========================================================= */

  useEffect(() => {
    isMountedRef.current = true;

    if (!bookingId) {
      setError(
        "Booking ID is missing."
      );

      setConnecting(false);

      setCallStatus("failed");

      return;
    }

    startVideoCall();

    return () => {
      isMountedRef.current = false;

      cleanupAgora();
    };
  }, [
    bookingId,
    startVideoCall,
    cleanupAgora,
  ]);

  /* =========================================================
     START TIMER WHEN REMOTE JOINS
  ========================================================= */

  useEffect(() => {
    if (
      remoteJoined &&
      joined
    ) {
      startTimer();
    }

    return () => {
      stopTimer();
    };
  }, [
    remoteJoined,
    joined,
    startTimer,
    stopTimer,
  ]);

  /* =========================================================
     MICROPHONE TOGGLE
  ========================================================= */

  const toggleMicrophone =
    async () => {
      try {
        const track =
          localAudioTrackRef.current;

        if (!track) {
          return;
        }

        const newMuted =
          !muted;

        await track.setEnabled(
          !newMuted
        );

        setMuted(
          newMuted
        );
      } catch (error) {
        console.error(
          "Microphone toggle error:",
          error
        );
      }
    };

  /* =========================================================
     CAMERA TOGGLE
  ========================================================= */

  const toggleCamera =
    async () => {
      try {
        const track =
          localVideoTrackRef.current;

        if (!track) {
          return;
        }

        const newCameraOff =
          !cameraOff;

        await track.setEnabled(
          !newCameraOff
        );

        setCameraOff(
          newCameraOff
        );
      } catch (error) {
        console.error(
          "Camera toggle error:",
          error
        );
      }
    };

  /* =========================================================
     FLIP CAMERA
  ========================================================= */

  const flipCamera =
    async () => {
      try {
        const track =
          localVideoTrackRef.current;

        if (!track) {
          return;
        }

        await track.switchDevice(
          "videoinput"
        ).catch(async () => {
          await track.switchDevice(
            "environment"
          );
        });

        setFrontCamera(
          (prev) => !prev
        );
      } catch (error) {
        console.error(
          "Camera switch error:",
          error
        );

        try {
          await track?.switchDevice(
            frontCamera
              ? "environment"
              : "user"
          );

          setFrontCamera(
            (prev) => !prev
          );
        } catch {}
      }
    };

  /* =========================================================
     SPEAKER TOGGLE
  ========================================================= */

  const toggleSpeaker =
    async () => {
      try {
        const client =
          clientRef.current;

        if (!client) {
          return;
        }

        const newSpeaker =
          !speakerOn;

        /* Agora Web SDK browser
           audio playback is controlled
           through audio track volume */

        const remoteUser =
          remoteUserRef.current;

        if (
          remoteUser?.audioTrack
        ) {
          remoteUser.audioTrack.setVolume(
            newSpeaker
              ? 100
              : 0
          );
        }

        setSpeakerOn(
          newSpeaker
        );
      } catch (error) {
        console.error(
          "Speaker toggle error:",
          error
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

      try {
        setEnding(true);

        stopTimer();

        const actualDuration =
          elapsedSecondsRef.current;

        console.log(
          "📞 Ending call:",
          {
            bookingId,
            actualDuration,
          }
        );

        /* ---------------------------------------
           TERMINATE API
        --------------------------------------- */

        if (
          bookingId
        ) {
          try {
            await terminateVideoCall(
              bookingId,
              actualDuration
            );

            console.log(
              "✅ terminateVideoCall success"
            );
          } catch (apiError) {
            console.error(
              "terminateVideoCall error:",
              apiError
            );

            /*
             * Call cleanup should still happen
             * even if API fails.
             */
          }
        }

        /* ---------------------------------------
           AGORA CLEANUP
        --------------------------------------- */

        await cleanupAgora();

        /* ---------------------------------------
           REDIRECT
        --------------------------------------- */

        navigate(
          "/dashboard/my-bookings",
          {
            replace: true,
            state: {
              callEnded: true,
            },
          }
        );
      } catch (error) {
        console.error(
          "End call error:",
          error
        );

        setError(
          error?.response
            ?.data?.message ||
            error?.message ||
            "Unable to end video call."
        );

        setEnding(false);

        endingRef.current = false;
      }
    };

  /* =========================================================
     BROWSER CLOSE / REFRESH
  ========================================================= */

  useEffect(() => {
    const handleBeforeUnload =
      () => {
        try {
          const client =
            clientRef.current;

          client?.leave();

          localAudioTrackRef.current?.stop();
          localAudioTrackRef.current?.close();

          localVideoTrackRef.current?.stop();
          localVideoTrackRef.current?.close();
        } catch {}
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
  }, []);

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
          REMOTE VIDEO AREA
      ===================================================== */}

      <div className="absolute inset-0">

        <div
          ref={remoteVideoRef}
          className="h-full w-full bg-gradient-to-br from-purple-950 via-[#100b18] to-black"
        />

        {/* -----------------------------------------------
            WAITING SCREEN
        ------------------------------------------------ */}

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
          CALL STATUS
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

          {/* -----------------------------------------------
              MICROPHONE
          ------------------------------------------------ */}

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

          {/* -----------------------------------------------
              CAMERA
          ------------------------------------------------ */}

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

          {/* -----------------------------------------------
              FLIP CAMERA
          ------------------------------------------------ */}

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

          {/* -----------------------------------------------
              SPEAKER
          ------------------------------------------------ */}

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

          {/* -----------------------------------------------
              END CALL
          ------------------------------------------------ */}

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
            : "Establishing secure connection..."}
        </p>

      </div>

    </div>
  );
};

export default VideoCall;