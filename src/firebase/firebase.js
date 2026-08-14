// firebase.js
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBTE0OFRibSmhcqFsU3n7P6-gCV2Jdqz3k",
  authDomain: "astroshriyam.firebaseapp.com",
  projectId: "astroshriyam",
  storageBucket: "astroshriyam.firebasestorage.app",
  messagingSenderId: "256699637886",
  appId: "1:256699637886:web:40748223d97541eedd782f",
  measurementId: "G-FXQB9MN160"
};

const app = initializeApp(firebaseConfig);

export const analytics = getAnalytics(app);
export const auth = getAuth(app);

// Firestore
export const db = getFirestore(app);

export default app;