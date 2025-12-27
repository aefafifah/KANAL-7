// src/config/firebase.js
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyAne5lJ1U9kIDs-dLxCuVg2XQtsMHg_6pg",
  authDomain: "kanal-app-d74d5.firebaseapp.com",
  databaseURL: "https://kanal-app-d74d5-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "kanal-app-d74d5",
  storageBucket: "kanal-app-d74d5.firebasestorage.app",
  messagingSenderId: "3111433446",
  appId: "1:3111433446:web:757f065595ccf7109c7727",
};

// Cegah double init (WAJIB di Expo)
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getDatabase(app);
export default app;
