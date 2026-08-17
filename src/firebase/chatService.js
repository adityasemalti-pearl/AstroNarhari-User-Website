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

import { db } from "./firebase";

// Create a consistent conversation ID for 2 users
export const getConversationId = (userId, partnerId) => {
  return [userId, partnerId].sort().join("_");
};

// Send message
export const sendChatMessage = async ({
  conversationId,
  senderId,
  receiverId,
  text,
}) => {
  if (!text?.trim()) return;

  const messageRef = collection(
    db,
    "conversations",
    conversationId,
    "messages"
  );

  await addDoc(messageRef, {
    senderId,
    receiverId,
    text: text.trim(),
    seen: false,
    createdAt: serverTimestamp(),
  });
};

// Listen to real-time messages
export const listenToMessages = (conversationId, callback) => {
  const messagesRef = collection(
    db,
    "conversations",
    conversationId,
    "messages"
  );

  const q = query(messagesRef, orderBy("createdAt", "asc"));

  const unsubscribe = onSnapshot(q, (snapshot) => {
    const messages = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    callback(messages);
  });

  return unsubscribe;
};

// Mark message as seen
export const markMessageSeen = async (conversationId, messageId) => {
  try {
    const messageRef = doc(
      db,
      "conversations",
      conversationId,
      "messages",
      messageId
    );

    await updateDoc(messageRef, {
      seen: true,
    });
  } catch (error) {
    console.error("Error marking message as seen:", error);
  }
};