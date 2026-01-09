import { useEffect, useState } from "react";
import { Stack, useRouter } from "expo-router";
import {
  Box,
  Text,
  VStack,
  Input,
  InputField,
  Button,
  ButtonText,
} from "@gluestack-ui/themed";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { auth, db } from "../../src/config/firebase";
import { ref, update } from "firebase/database";

export default function ChangeUsername() {
  const router = useRouter();
  const uid = auth.currentUser?.uid;

  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadCurrent();
  }, []);

  const loadCurrent = async () => {
    const local = await AsyncStorage.getItem("user");
    if (local) {
      const u = JSON.parse(local);
      setUsername(u.username || "");
    }
  };

  const handleSave = async () => {
    if (!username.trim()) {
      alert("Username tidak boleh kosong");
      return;
    }

    try {
      setLoading(true);

      // 🔥 Update DB
      await update(ref(db, `users/${uid}`), {
        username: username.trim(),
      });

      // 🔥 Update local session
      const local = await AsyncStorage.getItem("user");
      if (local) {
        const u = JSON.parse(local);
        const updated = { ...u, username: username.trim() };
        await AsyncStorage.setItem("user", JSON.stringify(updated));
      }

      alert("Username berhasil diubah");
      router.back();
    } catch (e) {
      console.log(e);
      alert("Gagal mengubah username");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Stack.Screen options={{ title: "Change Username" }} />

      <Box flex={1} bg="#F1F5F9" p="$5">
        <VStack space="lg">
          <Text color="$gray600">
            Username baru akan ditampilkan di profil kamu
          </Text>

          <Input>
            <InputField
              placeholder="New username"
              value={username}
              onChangeText={setUsername}
            />
          </Input>

          <Button onPress={handleSave} isDisabled={loading}>
            <ButtonText>
              {loading ? "Saving..." : "Save Username"}
            </ButtonText>
          </Button>
        </VStack>
      </Box>
    </>
  );
}
