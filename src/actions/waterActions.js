import { get, onValue, off, push, ref, update, remove } from "firebase/database";
import { db } from "../config/firebase";
import { getData } from "../utils/localStorage";

const getUid = async () => {
  const userData = await getData("user");
  return userData?.uid || null;
};

export const getWaterEntriesByDate = async (dateKey) => {
  const uid = await getUid();
  if (!uid) return [];

  const snapshot = await get(ref(db, `waterEntries/${uid}/${dateKey}`));
  if (!snapshot.exists()) return [];

  const data = snapshot.val();
  return Object.entries(data)
    .map(([id, entry]) => ({ id, ...entry }))
    .sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));
};

export const listenWaterEntriesByDate = async (dateKey, onUpdate) => {
  const uid = await getUid();
  if (!uid) {
    onUpdate([]);
    return () => {};
  }

  const pathRef = ref(db, `waterEntries/${uid}/${dateKey}`);
  const handler = (snapshot) => {
    if (!snapshot.exists()) {
      onUpdate([]);
      return;
    }

    const data = snapshot.val();
    const list = Object.entries(data)
      .map(([id, entry]) => ({ id, ...entry }))
      .sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));
    onUpdate(list);
  };

  onValue(pathRef, handler);
  return () => off(pathRef, "value", handler);
};

export const addWaterEntry = async (dateKey, amount) => {
  const uid = await getUid();
  if (!uid) return;

  const entry = {
    amount,
    time: new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    }),
    timestamp: Date.now(),
  };

  await push(ref(db, `waterEntries/${uid}/${dateKey}`), entry);
};

export const updateWaterEntry = async (dateKey, entryId, updates) => {
  const uid = await getUid();
  if (!uid) return;

  await update(ref(db, `waterEntries/${uid}/${dateKey}/${entryId}`), updates);
};

export const deleteWaterEntry = async (dateKey, entryId) => {
  const uid = await getUid();
  if (!uid) return;

  await remove(ref(db, `waterEntries/${uid}/${dateKey}/${entryId}`));
};
