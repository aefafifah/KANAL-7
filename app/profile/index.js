// app/profile/index.js
import { useCallback, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";
import { useRouter, Stack } from "expo-router";
import {
  Box,
  Center,
  Text,
  Button,
  ButtonText,
  VStack,
} from "@gluestack-ui/themed";

// Firebase (untuk refresh data biar displayName selalu up to date)
import { get, ref as dbRef } from "firebase/database";
import { auth, db } from "../../src/config/firebase";

export default function Profile() {
  const router = useRouter();

  const [user, setUser] = useState({
    uid: "",
    username: "",
    displayName: "",
    email: "",
    status: "user",
  });

  useFocusEffect(
    useCallback(() => {
      const load = async () => {
        try {
          // 1) Sumber utama: session login (AsyncStorage)
          const local = await AsyncStorage.getItem("user");
          if (local) {
            const u = JSON.parse(local);
            setUser({
              uid: u.uid || "",
              username: u.username || u.nama || "",
              displayName: u.displayName || u.nama || u.username || "",
              email: u.email || "",
              status: u.status || "user",
            });
          }

          // 2) Refresh dari RTDB (opsional tapi penting untuk displayName yang baru)
          const uid = auth.currentUser?.uid;
          if (!uid) return;

          const snap = await get(dbRef(db, `users/${uid}`));
          if (!snap.exists()) return;

          const p = snap.val();
          const usernameDB = (p?.username || p?.nama || "").trim();
          const displayNameDB = (p?.displayName || "").trim();
          const displayNameFinal = displayNameDB || usernameDB;

          const updated = {
            uid,
            username: usernameDB,
            displayName: displayNameFinal,
            email: (p?.email || auth.currentUser?.email || "").trim(),
            status: p?.status || "user",
          };

          setUser(updated);

          // sinkronkan session agar layar lain ikut konsisten
          await AsyncStorage.setItem("user", JSON.stringify(updated));
        } catch (e) {
          console.log("PROFILE INDEX LOAD ERROR:", e);
        }
      };

      load();
    }, [])
  );

  return (
    <>
      {/* ✅ REVISI YANG KAMU MINTA: ubah header dari "profile/index" jadi "Profil Saya" */}
      <Stack.Screen options={{ title: "Profil Saya" }} />

      <Center flex={1} px="$6" bg="$gray100">
        <Box
          w="100%"
          maxWidth={350}
          p="$6"
          bg="$white"
          rounded="$xl"
          shadow="$2"
        >
          <Text fontSize="$2xl" fontWeight="bold" mb="$4">
            Profil Saya
          </Text>

          {/* ✅ Display Name (yang bisa diubah) */}
          <VStack space="xs" mb="$4">
            <Text fontSize="$sm" color="$gray600">
              Display Name
            </Text>
            <Text fontSize="$lg" fontWeight="$semibold">
              {user.displayName || "-"}
            </Text>
          </VStack>

          {/* ✅ Username (permanen) */}
          <VStack space="xs" mb="$4">
            <Text fontSize="$sm" color="$gray600">
              Username
            </Text>
            <Text>{user.username || "-"}</Text>
          </VStack>

          {/* Email */}
          <VStack space="xs" mb="$4">
            <Text fontSize="$sm" color="$gray600">
              Email
            </Text>
            <Text>{user.email || "-"}</Text>
          </VStack>

          {/* Password (masked) */}
          <VStack space="xs" mb="$6">
            <Text fontSize="$sm" color="$gray600">
              Password
            </Text>
            <Text>********</Text>
          </VStack>

          <Button onPress={() => router.push("/profile/editprofile")}>
            <ButtonText>Edit Profil</ButtonText>
          </Button>
        </Box>
      </Center>
    </>
  );
}
