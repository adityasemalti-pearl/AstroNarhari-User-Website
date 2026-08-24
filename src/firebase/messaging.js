/* eslint-disable no-undef */

importScripts(
  "https://www.gstatic.com/firebasejs/10.13.2/firebase-app-compat.js"
);

importScripts(
  "https://www.gstatic.com/firebasejs/10.13.2/firebase-messaging-compat.js"
);

firebase.initializeApp({
  apiKey: "AIzaSyBTE0OFRibSmhcqFsU3n7P6-gCV2Jdqz3k",
  authDomain: "astroshriyam.firebaseapp.com",
  projectId: "astroshriyam",
  storageBucket: "astroshriyam.firebasestorage.app",
  messagingSenderId: "256699637886",
  appId: "1:256699637886:web:40748223d97541eedd782f",
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log("🔥 BACKGROUND NOTIFICATION:", payload);

  const notificationTitle =
    payload?.notification?.title || "Namahastro";

  const notificationOptions = {
    body:
      payload?.notification?.body ||
      "You have a new notification.",
    icon: "/logo.png",
    data: payload?.data || {},
  };

  self.registration.showNotification(
    notificationTitle,
    notificationOptions
  );
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  const data = event.notification.data || {};

  console.log("Notification clicked:", data);

  event.waitUntil(
    clients.matchAll({
      type: "window",
      includeUncontrolled: true,
    }).then((clientList) => {
      for (const client of clientList) {
        if ("focus" in client) {
          return client.focus();
        }
      }

      if (clients.openWindow) {
        return clients.openWindow("/");
      }
    })
  );
});