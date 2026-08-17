import React, { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
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
} from "firebase/firestore";

import { db } from "../../firebase/firebase";
// Change this path according to your Firebase config file

export default function Chat() {
  const { partnerId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const partner = location.state?.partner;
  const bookingId = location.state?.bookingId;

  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);

  const messagesEndRef = useRef(null);

  // --------------------------------------------------
  // CURRENT USER
  // --------------------------------------------------

  const user = JSON.parse(localStorage.getItem("user"));

  const userId =
    user?._id ||
    user?.id ||
    user?.userId;

  // --------------------------------------------------
  // CONVERSATION ID
  // --------------------------------------------------

  const conversationId = [userId, partnerId]
    .filter(Boolean)
    .sort()
    .join("_");

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
  // LISTEN TO MESSAGES
  // --------------------------------------------------

  useEffect(() => {
    if (!userId || !partnerId) {
      console.log("User ID or Partner ID missing");
      return;
    }

    if (!conversationId) {
      return;
    }

    console.log("Conversation ID:", conversationId);

    const messagesRef = collection(
      db,
      "conversations",
      conversationId,
      "messages"
    );

    const q = query(
      messagesRef,
      orderBy("createdAt", "asc")
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const messageList = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setMessages(messageList);

        scrollToBottom();

        // Mark received messages as seen
        markMessagesAsSeen(messageList);
      },
      (error) => {
        console.error(
          "Firestore message listener error:",
          error
        );
      }
    );

    return () => unsubscribe();
  }, [conversationId, userId, partnerId]);

  // --------------------------------------------------
  // MARK MESSAGES AS SEEN
  // --------------------------------------------------

  const markMessagesAsSeen = async (messageList) => {
    if (!userId) return;

    try {
      const unseenMessages = messageList.filter(
        (msg) =>
          msg.receiverId === userId &&
          msg.seen === false
      );

      for (const msg of unseenMessages) {
        const messageRef = doc(
          db,
          "conversations",
          conversationId,
          "messages",
          msg.id
        );

        await updateDoc(messageRef, {
          seen: true,
          seenAt: serverTimestamp(),
        });
      }
    } catch (error) {
      console.error(
        "Mark messages seen error:",
        error
      );
    }
  };

  // --------------------------------------------------
  // SEND MESSAGE
  // --------------------------------------------------

  const handleSendMessage = async (e) => {
    e?.preventDefault();

    const trimmedMessage = message.trim();

    if (!trimmedMessage) return;

    if (!userId) {
      console.error("User ID is missing");
      return;
    }

    if (!partnerId) {
      console.error("Partner ID is missing");
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
        text: trimmedMessage,
        seen: false,
        createdAt: serverTimestamp(),
        bookingId: bookingId || null,
      });

      setMessage("");

      scrollToBottom();

    } catch (error) {
      console.error(
        "Send message error:",
        error
      );
    } finally {
      setSending(false);
    }
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
      const date = timestamp.toDate
        ? timestamp.toDate()
        : new Date(timestamp);

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
      const date = timestamp.toDate
        ? timestamp.toDate()
        : new Date(timestamp);

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
            <MessageCircle
              size={30}
              className="text-red-500"
            />
          </div>

          <h2 className="mt-5 text-xl font-bold text-gray-900">
            Unable to Open Chat
          </h2>

          <p className="mt-2 text-sm text-gray-500">
            User or astrologer information is missing.
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
                alt={
                  partner?.fullName ||
                  partner?.name ||
                  "Astrologer"
                }
                className="h-11 w-11 rounded-full object-cover ring-2 ring-purple-100"
              />

              {/* Online */}
              <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white bg-green-500" />

            </div>

            <div>

              <h2 className="text-sm font-bold text-gray-900 sm:text-base">
                {partner?.fullName ||
                  partner?.name ||
                  "Astrologer"}
              </h2>

              <p className="text-xs text-green-600">
                Online
              </p>

            </div>

          </div>

        </div>

        {/* More */}
        <button
          className="flex h-10 w-10 items-center justify-center rounded-full text-gray-500 transition hover:bg-gray-100"
        >
          <MoreVertical size={20} />
        </button>

      </div>

      {/* ================= CHAT AREA ================= */}

      <div className="flex-1 overflow-y-auto px-4 py-5 sm:px-8">

        <div className="mx-auto max-w-4xl">

          {/* Chat Info */}
          <div className="mb-6 text-center">

            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-purple-100">
              <MessageCircle
                size={22}
                className="text-purple-700"
              />
            </div>

            <p className="mt-2 text-xs text-gray-500">
              Your conversation with{" "}
              <span className="font-semibold text-purple-700">
                {partner?.fullName ||
                  partner?.name ||
                  "your astrologer"}
              </span>
            </p>

          </div>

          {/* Messages */}

          {messages.length === 0 ? (

            <div className="flex min-h-[400px] items-center justify-center">

              <div className="text-center">

                <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-purple-100">
                  <MessageCircle
                    size={34}
                    className="text-purple-600"
                  />
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

                const isMine =
                  msg.senderId === userId;

                const currentDate =
                  formatDate(msg.createdAt);

                const previousDate =
                  index > 0
                    ? formatDate(
                        messages[index - 1].createdAt
                      )
                    : null;

                const showDate =
                  currentDate &&
                  currentDate !== previousDate;

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
                        isMine
                          ? "justify-end"
                          : "justify-start"
                      }`}
                    >

                      <div
                        className={`max-w-[80%] sm:max-w-[65%] ${
                          isMine
                            ? "items-end"
                            : "items-start"
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

                        {/* Time + Seen */}
                        <div
                          className={`mt-1 flex items-center gap-1 px-1 ${
                            isMine
                              ? "justify-end"
                              : "justify-start"
                          }`}
                        >

                          <span className="text-[10px] text-gray-400">
                            {formatTime(msg.createdAt)}
                          </span>

                          {isMine && (
                            msg.seen ? (
                              <CheckCheck
                                size={13}
                                className="text-purple-600"
                              />
                            ) : (
                              <Check
                                size={13}
                                className="text-gray-400"
                              />
                            )
                          )}

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
              onChange={(e) =>
                setMessage(e.target.value)
              }
              onKeyDown={handleKeyDown}
              rows={1}
              placeholder="Type your message..."
              className="max-h-28 min-h-[40px] w-full resize-none bg-transparent py-2 text-sm text-gray-800 outline-none placeholder:text-gray-400"
            />

          </div>

          <button
            type="submit"
            disabled={
              sending ||
              !message.trim()
            }
            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-r from-violet-700 to-fuchsia-700 text-white shadow-lg transition hover:scale-105 disabled:cursor-not-allowed disabled:opacity-50"
          >

            <Send
              size={19}
              className={
                sending
                  ? "animate-pulse"
                  : ""
              }
            />

          </button>

        </form>

        <p className="mx-auto mt-2 max-w-4xl text-center text-[10px] text-gray-400">
          Press Enter to send • Shift + Enter for new line
        </p>

      </div>

    </div>
  );
}