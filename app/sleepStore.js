import AsyncStorage from "@react-native-async-storage/async-storage";

const KEY = "sleep-time";

// =====================
// SAVE SLEEP TIME (PER HARI)
// =====================
export const saveSleepTime = async (sleepTime, wakeTime) => {
  const today = new Date().toISOString().split("T")[0]; // yyyy-mm-dd

  const data = {
    sleepTime,
    wakeTime,
    date: today,
  };

  await AsyncStorage.setItem(KEY, JSON.stringify(data));
};

// =====================
// GET SLEEP TIME (CEK HARI)
// =====================
export const getSleepTime = async () => {
  const json = await AsyncStorage.getItem(KEY);
  if (!json) return null;

  const data = JSON.parse(json);
  const today = new Date().toISOString().split("T")[0];

  // ✅ kalau harinya sama → pakai
  if (data.date === today) {
    return data;
  }

  // ❌ kalau harinya beda → anggap expired
  return null;
};
