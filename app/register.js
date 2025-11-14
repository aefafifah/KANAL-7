// app/register.js
import { useState } from "react";
import {
  Box,
  Input,
  InputField,
  Text,
  Button,
  ButtonText,
} from "@gluestack-ui/themed";
import { useRouter } from "expo-router";
import { UserStore } from "./userStore";

export default function Register() {
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");

  const handleRegister = async () => {
    // 1. Cek form kosong (semua harus diisi)
    if (!username || !email || !password || !confirm) {
      alert("Harap isi semua form");
      return;
    }

    // 2. Email harus mengandung '@'
    if (!email.includes("@")) {
      alert("Email harus mengandung '@'");
      return;
    }

    // 3. Password dan konfirmasi harus sama
    if (password !== confirm) {
      alert("Konfirmasi password tidak cocok");
      return;
    }

    // 4. Simpan ke UserStore (AsyncStorage)
    await UserStore.saveUser(username, email, password);

    alert("Registrasi berhasil! Silakan login.");
    router.replace("/login");
  };

  return (
    <Box flex={1} p="$6" justifyContent="center" bg="$white">
      <Text fontSize="$3xl" fontWeight="$bold" mb="$4">
        Daftar Akun
      </Text>

      <Input mb="$3">
        <InputField
          placeholder="Username"
          value={username}
          autoCapitalize="none"
          onChangeText={setUsername}
        />
      </Input>

      <Input mb="$3">
        <InputField
          placeholder="Email"
          keyboardType="email-address"
          value={email}
          autoCapitalize="none"
          onChangeText={setEmail}
        />
      </Input>

      <Input mb="$3">
        <InputField
          placeholder="Password"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
      </Input>

      <Input mb="$5">
        <InputField
          placeholder="Konfirmasi Password"
          secureTextEntry
          value={confirm}
          onChangeText={setConfirm}
        />
      </Input>

      <Button onPress={handleRegister}>
        <ButtonText>Daftar</ButtonText>
      </Button>
    </Box>
  );
}
