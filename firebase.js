// storysmith-mvp/firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Your Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyA32dpDpAFhvZQznMfSejYmleARn4KH15o",
  authDomain: "storysmith-waitlist.firebaseapp.com",
  projectId: "storysmith-waitlist",
  storageBucket: "storysmith-waitlist.firebasestorage.app",
  messagingSenderId: "760992279593",
  appId: "1:760992279593:web:429fff237a885089644038",
  measurementId: "G-GPMTD2TEQE"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export Firestore DB
export const db = getFirestore(app);
