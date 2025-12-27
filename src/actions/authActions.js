// src/actions/AuthAction.js
import { Alert } from "react-native";
import { auth, db } from "../config/firebase";
import { storeData, getData, clearStorage } from "../utils/localStorage";

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";

import { ref, set, push, get, update, remove } from "firebase/database";

// Helper normalize: pastikan username & displayName ada
const normalizeUser = (data = {}) => {
  const username = (data.username || data.nama || "").toString();
  const displayName = (
    data.displayName ||
    data.nama ||
    username ||
    ""
  ).toString();

  return {
    ...data,
    username,
    displayName,
  };
};

// =========================
// AUTH
// =========================
export const registerUser = async (data, password) => {
  try {
    const normalized = normalizeUser(data);

    const success = await createUserWithEmailAndPassword(
      auth,
      normalized.email,
      password
    );

    const dataBaru = {
      ...normalized,
      uid: success.user.uid,
      createdAt: Date.now(),
    };

    await set(ref(db, "users/" + success.user.uid), dataBaru);

    // simpan local storage versi wrapper (kalau kamu masih pakai di fitur lain)
    await storeData("user", dataBaru);

    return dataBaru;
  } catch (error) {
    throw error;
  }
};

export const loginUser = async (email, password) => {
  try {
    const success = await signInWithEmailAndPassword(auth, email, password);

    const snapshot = await get(ref(db, "users/" + success.user.uid));
    if (!snapshot.exists()) throw new Error("User data not found");

    const userData = normalizeUser(snapshot.val());

    // Sinkronkan field baru kalau belum ada
    const patch = {};
    if (!snapshot.val()?.username && userData.username)
      patch.username = userData.username;
    if (!snapshot.val()?.displayName && userData.displayName)
      patch.displayName = userData.displayName;

    if (Object.keys(patch).length > 0) {
      await update(ref(db, "users/" + success.user.uid), patch);
    }

    await storeData("user", userData);
    return userData;
  } catch (error) {
    throw error;
  }
};

export const logoutUser = async () => {
  try {
    await signOut(auth);
    await clearStorage();
  } catch (error) {
    throw error;
  }
};

// =========================
// NOTES CRUD (Realtime DB)
// =========================
export const addNote = async (data) => {
  try {
    const userData = await getData("user");
    if (!userData) {
      Alert.alert("Error", "Login terlebih dahulu");
      return;
    }

    const dataBaru = { ...data, uid: userData.uid };
    await push(ref(db, "notes/" + userData.uid), dataBaru);

    console.log("Note added successfully");
  } catch (error) {
    throw error;
  }
};

export const getNote = async () => {
  try {
    const userData = await getData("user");
    if (!userData) return [];

    const snapshot = await get(ref(db, "notes/" + userData.uid));
    if (!snapshot.exists()) return [];

    const notesData = snapshot.val();
    return Object.entries(notesData).map(([noteId, noteData]) => ({
      noteId,
      ...noteData,
    }));
  } catch (error) {
    console.error("Error fetching user notes:", error);
    return [];
  }
};

export const editNote = async (noteId, updatedData) => {
  try {
    const userData = await getData("user");
    if (!userData) {
      Alert.alert("Error", "Login terlebih dahulu");
      return;
    }

    const notePath = `notes/${userData.uid}/${noteId}`;
    await update(ref(db, notePath), updatedData);

    console.log("Note updated successfully");
  } catch (error) {
    throw error;
  }
};

export const deleteNote = async (noteId) => {
  try {
    const userData = await getData("user");
    if (!userData) {
      Alert.alert("Error", "Login terlebih dahulu");
      return;
    }

    const notePath = `notes/${userData.uid}/${noteId}`;
    await remove(ref(db, notePath));

    console.log("Note deleted successfully");
  } catch (error) {
    throw error;
  }
};
