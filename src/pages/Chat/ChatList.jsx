import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  collection,
  query,
  orderBy,
  onSnapshot,
} from "firebase/firestore";
import { getAuth } from "firebase/auth";

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

  // --------------------------------------------------
  // FIREBASE USER
  // --------------------------------------------------

  const auth = getAuth();

  const firebaseUser = auth.currentUser;

  const userId = firebaseUser?.uid || "";

  console.log("ChatList Firebase UID:", userId);

  // --------------------------------------------------
  // LISTEN TO CONVERSATIONS
  // --------------------------------------------------

  useEffect(() => {
    if (!userId) {
      console.log("Firebase user not logged in");
      setLoading(false);
      return;
    }

    const conversationsRef = collection(
      db,
      "conversations"
    );

    /*
     * Same as Flutter:
     *
     * .where(
     *   'participants',
     *   arrayContains: uid
     * )
     */

    const q = query(
      conversationsRef,
      orderBy("lastMessageAt", "desc")
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const list = snapshot.docs
          .map((item) => {
            const data = item.data();

            const participants =
              Array.isArray(data.participants)
                ? data.participants
                : [];

            // Only conversations of current Firebase user
            if (!participants.includes(userId)) {
              return null;
            }

            // Find other Firebase UID
            const otherUserId =
              participants.find(
                (id) =>
                  String(id) !==
                  String(userId)
              );

            const participantsInfo =
              data.participantsInfo || {};

            const otherUser =
              otherUserId
                ? participantsInfo[otherUserId]
                : null;

            return {
              id: item.id,
              ...data,

              otherUserId,

              otherUser,

              partnerName:
                otherUser?.name ||
                otherUser?.fullName ||
                "Astrologer",

              partnerImage:
                otherUser?.image ||
                otherUser?.profilePic ||
                "",
            };
          })
          .filter(Boolean);

        console.log(
          "Firebase Chat List:",
          list
        );

        setChats(list);
        setLoading(false);
      },
      (error) => {
        console.error(
          "Chats Error:",
          error
        );

        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [userId]);

  // --------------------------------------------------
  // FORMAT TIME
  // --------------------------------------------------

  const formatTime = (timestamp) => {
    if (!timestamp) return "";

    try {
      const date = timestamp.toDate
        ? timestamp.toDate()
        : new Date(timestamp);

      const today = new Date();

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

      return date.toLocaleDateString(
        "en-IN",
        {
          day: "numeric",
          month: "short",
        }
      );
    } catch {
      return "";
    }
  };

  // --------------------------------------------------
  // OPEN CHAT
  // --------------------------------------------------

  const openChat = (chat) => {
    if (!chat.otherUserId) {
      console.error(
        "Other Firebase UID missing"
      );
      return;
    }

    console.log(
      "Opening chat with:",
      chat.otherUserId
    );

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

          conversationId: chat.id,
        },
      }
    );
  };

  // --------------------------------------------------
  // SEARCH
  // --------------------------------------------------

  const filteredChats = chats.filter(
    (chat) =>
      (chat.partnerName ||
        "Astrologer")
        .toLowerCase()
        .includes(
          search.toLowerCase()
        )
  );

  // --------------------------------------------------
  // NO FIREBASE USER
  // --------------------------------------------------

  if (!userId) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#faf7ff]">
        <div className="text-center">

          <MessageCircle
            size={45}
            className="mx-auto text-purple-600"
          />

          <h2 className="mt-4 text-xl font-bold">
            Please login again
          </h2>

          <p className="mt-2 text-sm text-gray-500">
            Firebase authentication is required
            for chat.
          </p>

        </div>
      </div>
    );
  }

  // --------------------------------------------------
  // UI
  // --------------------------------------------------

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
              className="h-10 w-10 rounded-full flex items-center justify-center text-gray-600 hover:bg-purple-50 hover:text-purple-700"
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
                  chat.lastMessage;

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

                        {lastMessage?.text ||
                          "Start conversation"}

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