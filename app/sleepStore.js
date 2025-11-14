import AsyncStorage from "@react-native-async-storage/async-storage";

export const saveSleepTime = async (sleepTime, wakeTime) => {
  try {
    await AsyncStorage.setItem(
      "sleep",
      JSON.stringify({ sleepTime, wakeTime })
    );
  } catch (error) {
    console.log("Gagal menyimpan zona tidur:", error);
  }
};

export const getSleepTime = async () => {
  try {
    const data = await AsyncStorage.getItem("sleep");
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.log("Gagal mengambil zona tidur:", error);
    return null;
  }
};
