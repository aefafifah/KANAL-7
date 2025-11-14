// app/login.js
import { useState } from "react";
import {
  Box,
  Input,
  InputField,
  Text,
  Button,
  ButtonText,
  Pressable,
} from "@gluestack-ui/themed";
import { useRouter } from "expo-router";
import { UserStore } from "./userStore";

export default function Login() {
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    // 1. Cek form kosong
    if (!username || !email || !password) {
      alert("Harap isi semua form");
      return;
    }

    // 2. Email harus mengandung '@'
    if (!email.includes("@")) {
      alert("Email harus mengandung '@'");
      return;
    }

    // 3. Ambil data user tersimpan
    const user = await UserStore.getUser();
    if (!user) {
      alert("Akun tidak ditemukan, silakan daftar terlebih dahulu");
      return;
    }

    // 4. Cek kecocokan username, email, password
    if (
      username !== user.username ||
      email !== user.email ||
      password !== user.password
    ) {
      alert("Username, email, atau password salah");
      return;
    }

    // 5. Login berhasil
    router.replace("/(tabs)/home");
  };

  return (
    <Box flex={1} p="$6" justifyContent="center" bg="$white">
      <Text fontSize="$3xl" fontWeight="$bold" mb="$4">
        Login
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

      <Input mb="$5">
        <InputField
          placeholder="Password"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
      </Input>

      <Button mb="$3" onPress={handleLogin}>
        <ButtonText>Masuk</ButtonText>
      </Button>

      <Pressable onPress={() => router.push("/register")}>
        <Text mt="$2" textAlign="center" color="$blue600">
          Belum punya akun? Daftar di sini
        </Text>
      </Pressable>
    </Box>
  );
}
