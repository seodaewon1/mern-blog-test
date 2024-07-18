// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "hhss-6048c.firebaseapp.com",
  projectId: "hhss-6048c",
  storageBucket: "hhss-6048c.appspot.com",
  messagingSenderId: "852493914494",
  appId: "1:852493914494:web:3c3cd5fb93bd964b32a32f",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
