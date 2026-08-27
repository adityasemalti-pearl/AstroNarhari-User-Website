import { getToken } from "firebase/messaging";
import { getFirebaseMessaging } from "../firebase";

const VAPID_KEY = "BNN5keG3vVNcJ6m0UckqNfOfyMs-rmMHw4uEYhh7hpM_TQWSA7_ti_0an70xTjIOejhq4R_5UoQ_1ROo46wNA68";

export const registerForPushNotifications = async () => {
  try {
    if (!("Notification" in window)) {
      console.log("Browser notifications are not supported.");
      return null;
    }

    const messaging = await getFirebaseMessaging();

    if (!messaging) {
      console.log("Firebase Messaging is not supported.");
      return null;
    }

    const permission = await Notification.requestPermission();

    if (permission !== "granted") {
      console.log("Notification permission denied.");
      return null;
    }

    const registration = await navigator.serviceWorker.register(
      "/firebase-messaging-sw.js"
    );

    const token = await getToken(messaging, {
      vapidKey: VAPID_KEY,
      serviceWorkerRegistration: registration,
    });

    console.log("FCM TOKEN:", token);

    return token;
  } catch (error) {
    console.error("FCM registration error:", error);
    return null;
  }
};