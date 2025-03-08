// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY ,
  authDomain: "mern-estate-8a71a.firebaseapp.com",
  projectId: "mern-estate-8a71a",
  storageBucket: "mern-estate-8a71a.firebasestorage.app",
  messagingSenderId: "267551972305",
  appId: "1:267551972305:web:6d227957cae32f75149ef0",
  measurementId: "G-ENHWB4H785"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);