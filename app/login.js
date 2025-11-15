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

export default function Login({
  title = "Login",
  buttonLabel = "Masuk",
  onLoginSuccess,
  showRegisterLink = true,
  bgColor = "$white",
}) {
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    if (!username || !email || !password) {
      alert("Harap isi semua form");
      return;
    }

    if (!email.includes("@")) {
      alert("Email harus mengandung '@'");
      return;
    }

    const user = await UserStore.getUser();
    if (!user) {
      alert("Akun tidak ditemukan, silakan daftar terlebih dahulu");
      return;
    }

    if (
      username !== user.username ||
      email !== user.email ||
      password !== user.password
    ) {
      alert("Username, email, atau password salah");
      return;
    }

    // Jika ada props callback onLoginSuccess
    if (onLoginSuccess) {
      onLoginSuccess(user);
    }

    router.replace("/(tabs)/home");
  };

  return (
    <Box flex={1} p="$6" justifyContent="center" bg={bgColor}>
      <Text fontSize="$3xl" fontWeight="$bold" mb="$4">
        {title}
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
        <ButtonText>{buttonLabel}</ButtonText>
      </Button>

      {showRegisterLink && (
        <Pressable onPress={() => router.push("/register")}>
          <Text mt="$2" textAlign="center" color="$blue600">
            Belum punya akun? Daftar di sini
          </Text>
        </Pressable>
      )}
    </Box>
  );
}