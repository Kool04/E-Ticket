// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
export const firebaseConfig = {
  apiKey: "AIzaSyDv-9hxWd-UyA61SiayZ3_57SKh9eOwRww",
  authDomain: "ticketspectacle-9c997.firebaseapp.com",
  projectId: "ticketspectacle-9c997",
  storageBucket: "ticketspectacle-9c997.appspot.com",
  messagingSenderId: "1091078489266",
  appId: "1:1091078489266:web:65b613713bd1dfae8175ab",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export { app, initializeApp };
