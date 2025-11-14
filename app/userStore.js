// app/userStore.js
import AsyncStorage from "@react-native-async-storage/async-storage";

export const UserStore = {
  // Simpan user: username, email, password
  saveUser: async (username, email, password) => {
    try {
      const data = { username, email, password };
      await AsyncStorage.setItem("user", JSON.stringify(data));
    } catch (error) {
      console.log("Gagal menyimpan user:", error);
    }
  },

  // Ambil user
  getUser: async () => {
    try {
      const data = await AsyncStorage.getItem("user");
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.log("Gagal mengambil user:", error);
      return null;
    }
  },

  // Hapus user (logout)
  clearUser: async () => {
    try {
      await AsyncStorage.removeItem("user");
    } catch (error) {
      console.log("Gagal menghapus user:", error);
    }
  },
};
