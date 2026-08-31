
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  collection,
  onSnapshot,
} from "firebase/firestore";

import {
  getAuth,
  onAuthStateChanged,
} from "firebase/auth";

import {
  Search,
  MessageCircle,
  ArrowLeft,
} from "lucide-react";

import { db } from "../../firebase/firebase";

export default function ChatList() {
  const navigate = useNavigate();

  const [chats, setChats] = useState([]);
  const [search, setSearch] = useState("");

  const [loading, setLoading] = useState(true);

  const [firebaseUser, setFirebaseUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  // ==================================================
  // FIREBASE AUTH
  // ==================================================

  useEffect(() => {
    const auth = getAuth();

    const unsubscribe = onAuthStateChanged(
      auth,
      (user) => {
        console.log("=================================");
        console.log("FIREBASE AUTH USER:", user);
        console.log(
          "FIREBASE UID:",
          user?.uid
        );
        console.log("=================================");

        setFirebaseUser(user);
        setAuthLoading(false);
      },
      (error) => {
        console.error(
          "Firebase Auth Error:",
          error
        );

        setFirebaseUser(null);
        setAuthLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  // ==================================================
  // CURRENT FIREBASE UID
  // ==================================================

  const userId = firebaseUser?.uid || "";

  // ==================================================
  // LOAD ALL CONVERSATIONS
  // ==================================================

  useEffect(() => {
    if (authLoading) {
      return;
    }

    console.log("=================================");
    console.log(
      "CHAT LIST CURRENT USER:",
      userId
    );
    console.log("=================================");

    setLoading(true);

    const conversationsRef = collection(
      db,
      "conversations"
    );

    /*
     * IMPORTANT:
     *
     * We are intentionally NOT using:
     *
     * where("participants", "array-contains", userId)
     *
     * right now.
     *
     * We first want to see/load all conversations
     * from Firebase.
     */

    const unsubscribe = onSnapshot(
      conversationsRef,

      (snapshot) => {
        console.log("=================================");
        console.log(
          "TOTAL CONVERSATIONS:",
          snapshot.size
        );
        console.log("=================================");

        const list = snapshot.docs.map(
          (doc) => {
            const data = doc.data();

            console.log(
              "================================="
            );

            console.log(
              "CONVERSATION ID:",
              doc.id
            );

            console.log(
              "CONVERSATION DATA:",
              data
            );

            console.log(
              "PARTICIPANTS:",
              data.participants
            );

            console.log(
              "PARTICIPANTS INFO:",
              data.participantsInfo
            );

            console.log(
              "LAST MESSAGE:",
              data.lastMessage
            );

            console.log(
              "================================="
            );

            // ========================================
            // GET PARTICIPANTS
            // ========================================

            let participants = [];

            if (
              Array.isArray(
                data.participants
              )
            ) {
              participants =
                data.participants;
            }

            // Some projects may use participantIds
            else if (
              Array.isArray(
                data.participantIds
              )
            ) {
              participants =
                data.participantIds;
            }

            // ========================================
            // FIND OTHER USER
            // ========================================

            let otherUserId = "";

            if (participants.length > 0) {
              otherUserId =
                participants.find(
                  (id) =>
                    String(id) !==
                    String(userId)
                ) || "";
            }

            // ========================================
            // PARTICIPANTS INFO
            // ========================================

            const participantsInfo =
              data.participantsInfo || {};

            let otherUser = null;

            if (otherUserId) {
              otherUser =
                participantsInfo[
                  otherUserId
                ] || null;
            }

            // ========================================
            // FALLBACK USER DATA
            // ========================================

            if (!otherUser) {
              otherUser =
                data.otherUser ||
                data.partner ||
                data.astrologer ||
                null;
            }

            // ========================================
            // NAME
            // ========================================

            const partnerName =
              otherUser?.name ||
              otherUser?.fullName ||
              otherUser?.displayName ||
              data.partnerName ||
              data.astrologerName ||
              data.name ||
              "Astrologer";

            // ========================================
            // IMAGE
            // ========================================

            const partnerImage =
              otherUser?.image ||
              otherUser?.profilePic ||
              otherUser?.photoURL ||
              otherUser?.profileImage ||
              data.partnerImage ||
              data.astrologerImage ||
              "";

            // ========================================
            // LAST MESSAGE
            // ========================================

            const lastMessage =
              data.lastMessage || {};

            // ========================================
            // LAST MESSAGE TEXT
            // ========================================

            const lastMessageText =
              lastMessage?.text ||
              lastMessage?.message ||
              data.lastMessageText ||
              data.message ||
              "Start conversation";

            // ========================================
            // LAST MESSAGE TIME
            // ========================================

            const lastMessageAt =
              data.lastMessageAt ||
              data.updatedAt ||
              data.createdAt ||
              null;

            // ========================================
            // RETURN CHAT
            // ========================================

            return {
              id: doc.id,

              ...data,

              participants,

              participantsInfo,

              otherUserId,

              otherUser,

              partnerName,

              partnerImage,

              lastMessage: {
                ...lastMessage,
                text: lastMessageText,
              },

              lastMessageAt,
            };
          }
        );

        // ==========================================
        // SORT BY LAST MESSAGE
        // ==========================================

        list.sort((a, b) => {
          const getTime = (value) => {
            if (!value) {
              return 0;
            }

            if (
              typeof value.toDate ===
              "function"
            ) {
              return value
                .toDate()
                .getTime();
            }

            if (value?.seconds) {
              return (
                value.seconds * 1000
              );
            }

            const date = new Date(value);

            return isNaN(
              date.getTime()
            )
              ? 0
              : date.getTime();
          };

          return (
            getTime(b.lastMessageAt) -
            getTime(a.lastMessageAt)
          );
        });

        console.log(
          "FINAL CHAT LIST:",
          list
        );

        setChats(list);
        setLoading(false);
      },

      (error) => {
        console.error(
          "================================="
        );

        console.error(
          "FIREBASE CONVERSATIONS ERROR:",
          error
        );

        console.error(
          "================================="
        );

        setChats([]);
        setLoading(false);
      }
    );

    return () => {
      unsubscribe();
    };
  }, [userId, authLoading]);

  // ==================================================
  // FORMAT TIME
  // ==================================================

  const formatTime = (timestamp) => {
    if (!timestamp) {
      return "";
    }

    try {
      let date;

      // Firestore Timestamp
      if (
        timestamp &&
        typeof timestamp.toDate ===
          "function"
      ) {
        date = timestamp.toDate();
      }

      // Firebase timestamp object
      else if (
        timestamp?.seconds
      ) {
        date = new Date(
          timestamp.seconds * 1000
        );
      }

      // JS Date
      else if (
        timestamp instanceof Date
      ) {
        date = timestamp;
      }

      // String / normal date
      else {
        date = new Date(timestamp);
      }

      if (
        !date ||
        isNaN(date.getTime())
      ) {
        return "";
      }

      const today = new Date();

      const yesterday = new Date();

      yesterday.setDate(
        yesterday.getDate() - 1
      );

      // TODAY
      if (
        date.toDateString() ===
        today.toDateString()
      ) {
        return date.toLocaleTimeString(
          "en-IN",
          {
            hour: "numeric",
            minute: "2-digit",
            hour12: true,
          }
        );
      }

      // YESTERDAY
      if (
        date.toDateString() ===
        yesterday.toDateString()
      ) {
        return "Yesterday";
      }

      // OLDER
      return date.toLocaleDateString(
        "en-IN",
        {
          day: "numeric",
          month: "short",
        }
      );
    } catch (error) {
      console.error(
        "Time formatting error:",
        error
      );

      return "";
    }
  };

  // ==================================================
  // OPEN CHAT
  // ==================================================

  const openChat = (chat) => {
    console.log(
      "Opening conversation:",
      chat
    );

    /*
     * If otherUserId is available,
     * open using that Firebase UID.
     */

    if (chat?.otherUserId) {
      navigate(
        `/dashboard/chat/${chat.otherUserId}`,
        {
          state: {
            partner: {
              firebaseUid:
                chat.otherUserId,

              fullName:
                chat.partnerName,

              profilePic:
                chat.partnerImage,
            },

            conversationId:
              chat.id,
          },
        }
      );

      return;
    }

    /*
     * If participant information is not available,
     * still pass conversation ID.
     */

    navigate(
      `/dashboard/chat/${chat.id}`,
      {
        state: {
          conversationId:
            chat.id,

          partner: {
            fullName:
              chat.partnerName,

            profilePic:
              chat.partnerImage,
          },
        },
      }
    );
  };

  // ==================================================
  // SEARCH
  // ==================================================

  const filteredChats =
    chats.filter((chat) => {
      const name =
        chat.partnerName ||
        "Astrologer";

      const message =
        chat.lastMessage?.text ||
        "";

      const searchText =
        search
          .toLowerCase()
          .trim();

      if (!searchText) {
        return true;
      }

      return (
        name
          .toLowerCase()
          .includes(searchText) ||
        message
          .toLowerCase()
          .includes(searchText)
      );
    });

  // ==================================================
  // AUTH LOADING
  // ==================================================

  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#faf7ff] flex items-center justify-center">

        <div className="text-center">

          <div className="mx-auto h-10 w-10 rounded-full border-4 border-purple-200 border-t-purple-600 animate-spin" />

          <p className="mt-4 text-sm text-gray-500">
            Loading chats...
          </p>

        </div>

      </div>
    );
  }

  // ==================================================
  // NO FIREBASE USER
  // ==================================================

  if (!userId) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#faf7ff] px-4">

        <div className="text-center">

          <MessageCircle
            size={45}
            className="mx-auto text-purple-600"
          />

          <h2 className="mt-4 text-xl font-bold text-gray-900">
            Please login again
          </h2>

          <p className="mt-2 text-sm text-gray-500">
            Firebase authentication is
            required for chat.
          </p>

          <button
            onClick={() =>
              navigate("/login")
            }
            className="mt-5 rounded-xl bg-purple-600 px-5 py-3 text-sm font-semibold text-white hover:bg-purple-700"
          >
            Go to Login
          </button>

        </div>

      </div>
    );
  }

  // ==================================================
  // MAIN UI
  // ==================================================

  return (
    <div className="min-h-screen bg-[#faf7ff]">

      {/* HEADER */}

      <div className="sticky top-0 z-20 border-b border-purple-100 bg-white shadow-sm">

        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-5">

          <div className="flex items-center gap-3">

            <button
              onClick={() =>
                navigate(-1)
              }
              className="h-10 w-10 rounded-full flex items-center justify-center text-gray-600 hover:bg-purple-50 hover:text-purple-700 transition"
            >
              <ArrowLeft size={21} />
            </button>

            <div>

              <h1 className="text-xl font-bold text-gray-900">
                My Chats
              </h1>

              <p className="text-xs text-gray-500">
                Your conversations
              </p>

            </div>

          </div>

        </div>

      </div>

      {/* CONTENT */}

      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-6">

        {/* SEARCH */}

        <div className="relative mb-6">

          <Search
            size={19}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-purple-500"
          />

          <input
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
            placeholder="Search chats..."
            className="w-full rounded-2xl border border-purple-100 bg-white py-4 pl-12 pr-4 text-sm outline-none focus:border-purple-400 focus:ring-4 focus:ring-purple-100"
          />

        </div>

        {/* LOADING */}

        {loading ? (

          <div className="space-y-3">

            {[1, 2, 3, 4, 5].map(
              (item) => (
                <div
                  key={item}
                  className="h-20 rounded-2xl bg-white border border-purple-100 animate-pulse"
                />
              )
            )}

          </div>

        ) : filteredChats.length === 0 ? (

          /* EMPTY */

          <div className="rounded-3xl bg-white border border-purple-100 p-16 text-center">

            <div className="mx-auto h-20 w-20 rounded-full bg-purple-100 flex items-center justify-center">

              <MessageCircle
                size={34}
                className="text-purple-700"
              />

            </div>

            <h2 className="mt-5 text-xl font-bold text-gray-900">

              {search
                ? "No chats found"
                : "No conversations yet"}

            </h2>

            <p className="mt-2 text-sm text-gray-500">

              {search
                ? "Try another search."
                : "Your conversations will appear here."}

            </p>

          </div>

        ) : (

          /* CHAT LIST */

          <div className="space-y-3">

            {filteredChats.map(
              (chat) => {

                const lastMessage =
                  chat.lastMessage || {};

                const messageText =
                  lastMessage.text ||
                  "Start conversation";

                return (
                  <button
                    key={chat.id}
                    onClick={() =>
                      openChat(chat)
                    }
                    className="w-full flex items-center gap-4 p-4 rounded-2xl border border-purple-100 bg-white text-left shadow-sm hover:border-purple-300 hover:shadow-md transition"
                  >

                    {/* IMAGE */}

                    <div className="relative shrink-0">

                      <img
                        src={
                          chat.partnerImage ||
                          `https://ui-avatars.com/api/?name=${encodeURIComponent(
                            chat.partnerName ||
                              "Astrologer"
                          )}&background=EDE9FE&color=6D28D9`
                        }
                        alt={
                          chat.partnerName ||
                          "Astrologer"
                        }
                        className="h-14 w-14 rounded-full object-cover ring-2 ring-purple-100"
                        onError={(e) => {
                          e.currentTarget.src =
                            `https://ui-avatars.com/api/?name=${encodeURIComponent(
                              chat.partnerName ||
                                "Astrologer"
                            )}&background=EDE9FE&color=6D28D9`;
                        }}
                      />

                      <span className="absolute bottom-0 right-0 h-3.5 w-3.5 rounded-full border-2 border-white bg-green-500" />

                    </div>

                    {/* DETAILS */}

                    <div className="min-w-0 flex-1">

                      <div className="flex items-center justify-between gap-3">

                        <h3 className="truncate text-sm sm:text-base font-bold text-gray-900">

                          {chat.partnerName ||
                            "Astrologer"}

                        </h3>

                        <span className="text-[10px] sm:text-xs text-gray-400 shrink-0">

                          {formatTime(
                            chat.lastMessageAt
                          )}

                        </span>

                      </div>

                      <p className="mt-1 truncate text-xs sm:text-sm text-gray-500">

                        {messageText}

                      </p>

                    </div>

                  </button>
                );
              }
            )}

          </div>

        )}

      </main>

    </div>
  );
}

