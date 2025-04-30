// firebase.ts
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY, // Access environment variable
  authDomain: `${import.meta.env.VITE_FIREBASE_PROJECT_ID}.firebaseapp.com`, // Access environment variable
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID, // Access environment variable
  storageBucket: `${import.meta.env.VITE_FIREBASE_PROJECT_ID}.appspot.com`, // Access environment variable
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID, // Access environment variable
  appId: import.meta.env.VITE_FIREBASE_APP_ID, // Access environment variable
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID // Access environment variable, added
};

//console.log("Firebase Config from env:", firebaseConfig);

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

// Export the Firestore instance to use in your components

export { db, auth };