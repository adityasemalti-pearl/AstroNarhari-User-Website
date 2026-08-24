import React, { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Send,
  MoreVertical,
  Check,
  CheckCheck,
  MessageCircle,
} from "lucide-react";

import {
  collection,
  addDoc,
  query,
  orderBy,
  onSnapshot,
  serverTimestamp,
  doc,
  updateDoc,
  arrayUnion,
  setDoc,
} from "firebase/firestore";

import { getRestrictedKeywords } from "../../API/homeApis";

import { getAuth } from "firebase/auth";

import { db } from "../../firebase/firebase";

export default function Chat() {
  const location = useLocation();
  const navigate = useNavigate();


  const [keywords, setKeywords] = useState([])
  const [alert, setAlert] = useState(null);


  


  const fetchKeywords=async()=>{
    try {
      const res = await getRestrictedKeywords()
      setKeywords(res.data.data || res.data)
      console.log("resfehwgrf", res.data.data )
      
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(()=>{
    fetchKeywords()
  },[])

  // --------------------------------------------------
  // PARTNER / BOOKING
  // --------------------------------------------------

  const partner = location.state?.partner;
  const bookingId = location.state?.bookingId;


  const partnerId = partner?.firebaseUid;

  // --------------------------------------------------
  // STATE
  // --------------------------------------------------

  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);

  const messagesEndRef = useRef(null);

  const auth = getAuth();
  const firebaseUser = auth.currentUser;

  const userId = firebaseUser?.uid || null;

  console.log("================================");
  console.log("CHAT DEBUG");
  console.log("Firebase User:", firebaseUser);
  console.log("My Firebase UID:", userId);
  console.log("Partner:", partner);
  console.log("Partner Firebase UID:", partnerId);
  console.log("Booking ID:", bookingId);
  console.log("================================");

  const conversationId =
    userId && partnerId ? [userId, partnerId].sort().join("_") : "";

  console.log("Conversation ID:", conversationId);

  // --------------------------------------------------
  // SCROLL TO BOTTOM
  // --------------------------------------------------

  const scrollToBottom = () => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({
        behavior: "smooth",
      });
    }, 100);
  };

  // --------------------------------------------------
  // MARK MESSAGES AS READ
  // --------------------------------------------------

  const markMessagesAsRead = async (messageList) => {
    if (!userId || !conversationId) return;

    try {
      const unreadMessages = messageList.filter(
        (msg) =>
          msg.senderId !== userId && !(msg.readBy || []).includes(userId),
      );

      for (const msg of unreadMessages) {
        const messageRef = doc(
          db,
          "conversations",
          conversationId,
          "messages",
          msg.id,
        );

        await updateDoc(messageRef, {
          readBy: arrayUnion(userId),
        });
      }

      await setDoc(
        doc(db, "conversations", conversationId),
        {
          lastReadAt: {
            [userId]: serverTimestamp(),
          },
        },
        {
          merge: true,
        },
      );
    } catch (error) {
      console.error("Mark messages read error:", error);
    }
  };

  // --------------------------------------------------
  // LISTEN TO MESSAGES
  // --------------------------------------------------

  useEffect(() => {
    if (!userId) {
      console.error("Firebase user is not logged in. Firebase UID missing.");
      return;
    }

    if (!partnerId) {
      console.error("Partner Firebase UID is missing.", partner);
      return;
    }

    if (!conversationId) {
      console.error("Conversation ID missing");
      return;
    }

    console.log("Listening to Firestore conversation:", conversationId);

    const messagesRef = collection(
      db,
      "conversations",
      conversationId,
      "messages",
    );

    const q = query(messagesRef, orderBy("createdAt", "asc"));

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const messageList = snapshot.docs.map((item) => ({
          id: item.id,
          ...item.data(),
        }));

        console.log("Firestore Messages:", messageList);

        setMessages(messageList);

        scrollToBottom();

        markMessagesAsRead(messageList);
      },
      (error) => {
        console.error("Firestore message listener error:", error);
      },
    );

    return () => {
      unsubscribe();
    };
  }, [conversationId, userId, partnerId]);

  const showRestrictedAlert = (message) => {
  setAlert(message);

  setTimeout(() => {
    setAlert(null);
  }, 3000);
};

const checkRestrictedMessage = (text) => {
  if (!keywords || keywords.length === 0) {
    return null;
  }

  const lowerText = text.toLowerCase();

  return keywords.find((item) =>
    lowerText.includes(String(item.keyword).toLowerCase())
  );
};

  // --------------------------------------------------
  // SEND MESSAGE
  // --------------------------------------------------

  const sendChatMessage = async (text) => {
  if (!userId || !partnerId || !conversationId) {
    return;
  }

  try {
    setSending(true);

    const messagesRef = collection(
      db,
      "conversations",
      conversationId,
      "messages"
    );

    await addDoc(messagesRef, {
      senderId: userId,
      receiverId: partnerId,
      type: "text",
      text,
      createdAt: serverTimestamp(),
      readBy: [userId],
    });

    await setDoc(
      doc(db, "conversations", conversationId),
      {
        lastMessage: {
          text,
          senderId: userId,
        },
        lastMessageAt: serverTimestamp(),
        lastReadAt: {
          [userId]: serverTimestamp(),
        },
      },
      {
        merge: true,
      }
    );

    setMessage("");
    scrollToBottom();

  } catch (error) {
    console.error("Send message error:", error);
  } finally {
    setSending(false);
  }
};

const handleSendMessage = async (e) => {
  e?.preventDefault();

  const trimmedMessage = message.trim();

  if (!trimmedMessage) return;

  // Check restricted keyword
  const matchedKeyword = checkRestrictedMessage(trimmedMessage);

  if (matchedKeyword) {

    // BLOCK
    if (matchedKeyword.action === "block") {
      showRestrictedAlert(
        `"${matchedKeyword.keyword}" is a restricted word and cannot be sent.`
      );

      return;
    }

    // MASK
    if (matchedKeyword.action === "mask") {
      const escapedKeyword = String(matchedKeyword.keyword).replace(
        /[.*+?^${}()|[\]\\]/g,
        "\\$&"
      );

      const maskRegex = new RegExp(escapedKeyword, "gi");

      const maskedMessage = trimmedMessage.replace(
        maskRegex,
        "****"
      );

      await sendChatMessage(maskedMessage);

      return;
    }
  }

  // NORMAL MESSAGE
  await sendChatMessage(trimmedMessage);
};

  // --------------------------------------------------
  // ENTER TO SEND
  // --------------------------------------------------

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // --------------------------------------------------
  // FORMAT TIME
  // --------------------------------------------------

  const formatTime = (timestamp) => {
    if (!timestamp) return "";

    try {
      const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);

      return date.toLocaleTimeString("en-IN", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      });
    } catch {
      return "";
    }
  };

  // --------------------------------------------------
  // FORMAT DATE
  // --------------------------------------------------

  const formatDate = (timestamp) => {
    if (!timestamp) return "";

    try {
      const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);

      return date.toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
      });
    } catch {
      return "";
    }
  };

  // --------------------------------------------------
  // INVALID CHAT
  // --------------------------------------------------

  if (!userId || !partnerId) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#faf7ff] p-5">

        <div className="w-full max-w-md rounded-3xl bg-white p-8 text-center shadow-xl">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
            <MessageCircle size={30} className="text-red-500" />
          </div>

          <h2 className="mt-5 text-xl font-bold text-gray-900">
            Unable to Open Chat
          </h2>

          <p className="mt-2 text-sm text-gray-500">
            {!userId
              ? "Firebase authentication is missing."
              : "Astrologer Firebase UID is missing."}
          </p>

          <button
            onClick={() => navigate(-1)}
            className="mt-6 rounded-xl bg-purple-700 px-6 py-3 text-sm font-semibold text-white"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  // --------------------------------------------------
  // UI
  // --------------------------------------------------

  return (
    <div className="flex h-screen flex-col bg-[#faf7ff]">
      {/* ================= HEADER ================= */}
       {alert && (
  <div className="fixed right-5 top-5 z-[99999] w-[360px] max-w-[calc(100vw-40px)] animate-in slide-in-from-right-5">
    <div className="flex items-start gap-3 rounded-2xl border border-red-200 bg-white p-4 shadow-2xl">

      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-red-100">
        <span className="text-lg">⚠️</span>
      </div>

      <div className="flex-1">
        <h3 className="text-sm font-bold text-gray-900">
          Message Restricted
        </h3>

        <p className="mt-1 text-xs leading-5 text-gray-500">
          {alert}
        </p>
      </div>

      <button
        onClick={() => setAlert(null)}
        className="text-gray-400 transition hover:text-gray-700"
      >
        ✕
      </button>

    </div>
  </div>
)}
      <div className="sticky top-0 z-20 flex items-center justify-between border-b border-purple-100 bg-white px-4 py-4 shadow-sm sm:px-6">
        <div className="flex items-center gap-3">
          {/* Back */}

          <button
            onClick={() => navigate(-1)}
            className="flex h-10 w-10 items-center justify-center rounded-full text-gray-600 transition hover:bg-purple-50 hover:text-purple-700"
          >
            <ArrowLeft size={21} />
          </button>

          {/* Partner */}

          <div className="flex items-center gap-3">
            <div className="relative">
              <img
                src={
                  partner?.profilePic ||
                  partner?.image ||
                  "https://i.pravatar.cc/150?img=12"
                }
                alt={partner?.fullName || partner?.name || "Astrologer"}
                className="h-11 w-11 rounded-full object-cover ring-2 ring-purple-100"
              />

              {/* Online */}

              <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white bg-green-500" />
            </div>

            <div>
              <h2 className="text-sm font-bold text-gray-900 sm:text-base">
                {partner?.fullName || partner?.name || "Astrologer"}
              </h2>

              <p className="text-xs text-green-600">Online</p>
            </div>
          </div>
        </div>

        {/* More */}

        <button className="flex h-10 w-10 items-center justify-center rounded-full text-gray-500 transition hover:bg-gray-100">
          <MoreVertical size={20} />
        </button>
      </div>

      {/* ================= CHAT AREA ================= */}

      <div className="flex-1 overflow-y-auto px-4 py-5 sm:px-8">
        <div className="mx-auto max-w-4xl">
          {/* Chat Info */}

          <div className="mb-6 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-purple-100">
              <MessageCircle size={22} className="text-purple-700" />
            </div>

            <p className="mt-2 text-xs text-gray-500">
              Your conversation with{" "}
              <span className="font-semibold text-purple-700">
                {partner?.fullName || partner?.name || "your astrologer"}
              </span>
            </p>
          </div>

          {/* Messages */}

          {messages.length === 0 ? (
            <div className="flex min-h-[400px] items-center justify-center">
              <div className="text-center">
                <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-purple-100">
                  <MessageCircle size={34} className="text-purple-600" />
                </div>

                <h3 className="mt-5 text-lg font-semibold text-gray-900">
                  Start Your Conversation
                </h3>

                <p className="mt-2 max-w-sm text-sm text-gray-500">
                  Send a message to start chatting with your astrologer.
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {messages.map((msg, index) => {
                /*
                 * IMPORTANT:
                 * senderId is Firebase UID.
                 */

                const isMine = String(msg.senderId) === String(userId);

                const currentDate = formatDate(msg.createdAt);

                const previousDate =
                  index > 0 ? formatDate(messages[index - 1].createdAt) : null;

                const showDate = currentDate && currentDate !== previousDate;

                const isRead = (msg.readBy || []).some(
                  (id) => String(id) === String(partnerId),
                );

                return (
                  <React.Fragment key={msg.id}>
                    {/* Date Separator */}

                    {showDate && (
                      <div className="my-5 flex items-center justify-center">
                        <span className="rounded-full bg-white px-4 py-1.5 text-[11px] font-medium text-gray-500 shadow-sm">
                          {currentDate}
                        </span>
                      </div>
                    )}

                    {/* Message */}

                    <div
                      className={`flex ${
                        isMine ? "justify-end" : "justify-start"
                      }`}
                    >
                      <div
                        className={`max-w-[80%] sm:max-w-[65%] ${
                          isMine ? "items-end" : "items-start"
                        } flex flex-col`}
                      >
                        <div
                          className={`rounded-2xl px-4 py-3 shadow-sm ${
                            isMine
                              ? "rounded-br-md bg-gradient-to-r from-violet-700 to-fuchsia-700 text-white"
                              : "rounded-bl-md border border-gray-100 bg-white text-gray-800"
                          }`}
                        >
                          <p className="whitespace-pre-wrap break-words text-sm leading-6">
                            {msg.text}
                          </p>
                        </div>

                        {/* Time + Read */}

                        <div
                          className={`mt-1 flex items-center gap-1 px-1 ${
                            isMine ? "justify-end" : "justify-start"
                          }`}
                        >
                          <span className="text-[10px] text-gray-400">
                            {formatTime(msg.createdAt)}
                          </span>

                          {isMine &&
                            (isRead ? (
                              <CheckCheck
                                size={13}
                                className="text-purple-600"
                              />
                            ) : (
                              <Check size={13} className="text-gray-400" />
                            ))}
                        </div>
                      </div>
                    </div>
                  </React.Fragment>
                );
              })}
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* ================= INPUT ================= */}

      <div className="border-t border-purple-100 bg-white px-4 py-4 shadow-[0_-5px_20px_rgba(0,0,0,0.05)] sm:px-8">
        <form
          onSubmit={handleSendMessage}
          className="mx-auto flex max-w-4xl items-end gap-3"
        >
          <div className="flex-1 rounded-2xl border border-gray-200 bg-gray-50 px-4 py-2 transition focus-within:border-purple-400 focus-within:bg-white focus-within:ring-4 focus-within:ring-purple-100">
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              rows={1}
              placeholder="Type your message..."
              className="max-h-28 min-h-[40px] w-full resize-none bg-transparent py-2 text-sm text-gray-800 outline-none placeholder:text-gray-400"
            />
          </div>

          <button
            type="submit"
            disabled={sending || !message.trim()}
            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-r from-violet-700 to-fuchsia-700 text-white shadow-lg transition hover:scale-105 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Send size={19} className={sending ? "animate-pulse" : ""} />
          </button>
        </form>

        <p className="mx-auto mt-2 max-w-4xl text-center text-[10px] text-gray-400">
          Press Enter to send • Shift + Enter for new line
        </p>
      </div>
    </div>
  );
}
