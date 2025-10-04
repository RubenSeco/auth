// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";


// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAAQH6zgTMTltWmdO-LoBIflg25ogg-brY",
  authDomain: "auth-authentication-32484.firebaseapp.com",
  projectId: "auth-authentication-32484",
  storageBucket: "auth-authentication-32484.firebasestorage.app",
  messagingSenderId: "521047587903",
  appId: "1:521047587903:web:9b4daf72bbf1274e33cc8a",
  measurementId: "G-BT6X3YL4GF"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
auth.languageCode = "es";

export const firebase = {
  app,
  auth
};
