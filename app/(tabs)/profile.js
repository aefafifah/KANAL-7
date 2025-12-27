import { useCallback, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Center, Box, Button, ButtonText, Text, HStack } from "@gluestack-ui/themed";
import { useRouter } from "expo-router";
import { useFocusEffect } from "@react-navigation/native";

// Firebase
import { signOut } from "firebase/auth";
import { get, ref as dbRef } from "firebase/database";
import { auth, db } from "../../src/config/firebase";

export default function ProfileTab({ title = "Profile" }) {
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [displayName, setDisplayName] = useState("");

  useFocusEffect(
    useCallback(() => {
      const load = async () => {
        try {
          const uid = auth.currentUser?.uid;

          // 1) cepat dari session/cache
          const local = await AsyncStorage.getItem("user");
          if (local) {
            const u = JSON.parse(local);
            setUsername(u.username || u.nama || "");
            setDisplayName(u.displayName || u.nama || u.username || "");
          }

          // 2) sumber utama: RTDB (ambil displayName terbaru)
          if (uid) {
            const snap = await get(dbRef(db, `users/${uid}`));
            if (snap.exists()) {
              const p = snap.val();

              const usernameDB = (p?.username || p?.nama || "").trim();
              const displayNameDB = (p?.displayName || "").trim();
              const displayNameFinal = displayNameDB || usernameDB;

              setUsername(usernameDB);
              setDisplayName(displayNameFinal);

              // sinkronkan session (tanpa password)
              await AsyncStorage.setItem(
                "user",
                JSON.stringify({
                  uid,
                  username: usernameDB,
                  displayName: displayNameFinal,
                  email: auth.currentUser?.email || p?.email || "",
                  status: p?.status || "user",
                })
              );
            }
          }
        } catch (e) {
          console.log("PROFILE TAB LOAD ERROR:", e);
        }
      };

      load();
    }, [])
  );

  const handleLogout = async () => {
    try {
      await signOut(auth);
      await AsyncStorage.removeItem("user");
      await AsyncStorage.removeItem("profilePhoto"); // foto lokal hilang setelah logout
      router.replace("/login");
    } catch (e) {
      alert("Logout gagal");
    }
  };

  return (
    <Center flex={1} px="$6" bg="$gray100">
      <Box w="100%" maxWidth={350} p="$6" bg="$white" rounded="$xl" shadow="$2">
        <Text fontSize="$xl" color="$gray600" mb="$2">
          {title}
        </Text>

        {/* Utama: displayName */}
        <Text fontSize="$2xl" fontWeight="bold">
          {displayName || "-"}
        </Text>

        {/* Secondary: @username */}
        <Text mt="$1" mb="$4" color="$gray500">
          {username ? `@${username}` : ""}
        </Text>

        <Button mb="$3" onPress={() => router.push("/profile")}>
          <ButtonText>Lihat Profile</ButtonText>
        </Button>

        <Button mb="$3" onPress={() => router.push("/profile/editpassword")}>
          <ButtonText>Ubah Password</ButtonText>
        </Button>

        <Button mb="$3" onPress={() => router.push("/profile/language")}>
          <ButtonText>Pilih Bahasa</ButtonText>
        </Button>

        <Button mb="$3" onPress={() => router.push("/profile/theme")}>
          <ButtonText>Pilih Tema</ButtonText>
        </Button>

        <Button bg="$red600" mt="$4" onPress={handleLogout}>
          <ButtonText color="$white">Logout</ButtonText>
        </Button>
      </Box>
    </Center>
  );
}
