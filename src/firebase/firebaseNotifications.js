import { getToken, onMessage } from "firebase/messaging";
import { getFirebaseMessaging } from "../firebase";

const VAPID_KEY = import.meta.env.VITE_FIREBASE_VAPID_KEY;

export const requestNotificationPermission = async () => {
  try {
    if (!("Notification" in window)) {
      console.log("Browser notifications are not supported.");
      return null;
    }

    const permission = await Notification.requestPermission();

    if (permission !== "granted") {
      console.log("Notification permission denied.");
      return null;
    }

    const messaging = await getFirebaseMessaging();

    if (!messaging) {
      console.log("Firebase messaging is not supported.");
      return null;
    }

    const registration = await navigator.serviceWorker.register(
      "/firebase-messaging-sw.js"
    );

    const token = await getToken(messaging, {
      vapidKey: VAPID_KEY,
      serviceWorkerRegistration: registration,
    });

    console.log("🔥 FCM TOKEN:", token);

    return token;
  } catch (error) {
    console.error("FCM TOKEN ERROR:", error);
    return null;
  }
};

export const listenForForegroundNotifications = async (
  callback
) => {
  try {
    const messaging = await getFirebaseMessaging();

    if (!messaging) return null;

    return onMessage(messaging, (payload) => {
      console.log("🔥 FOREGROUND NOTIFICATION:", payload);

      callback?.(payload);
    });
  } catch (error) {
    console.error(
      "Foreground notification listener error:",
      error
    );

    return null;
  }
};