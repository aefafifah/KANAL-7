// app/register.js
import { useState } from "react";
import {
  Box,
  Input,
  InputField,
  Text,
  Button,
  ButtonText,
  Pressable,
  InputSlot,
  Icon,
} from "@gluestack-ui/themed";
import { Eye, EyeOff } from "lucide-react-native";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { registerUser } from "../src/actions/authActions"; // ✅ samakan dengan file yang kamu kirim

function Title({ text }) {
  return (
    <Text fontSize="$3xl" fontWeight="$bold" mb="$4">
      {text}
    </Text>
  );
}

function InputLabel({
  label,
  value,
  setValue,
  type = "text",
  showPassword,
  toggleShowPassword,
}) {
  const isPassword = type === "password";

  return (
    <>
      <Text mb="$1">{label}</Text>

      <Input mb="$4">
        <InputField
          placeholder={label}
          value={value}
          secureTextEntry={isPassword && !showPassword}
          keyboardType={type === "email" ? "email-address" : "default"}
          autoCapitalize="none"
          onChangeText={setValue}
        />

        {isPassword && (
          <InputSlot pr="$3">
            <Pressable onPress={toggleShowPassword}>
              <Icon
                as={showPassword ? Eye : EyeOff}
                size="md"
                color="$coolGray500"
              />
            </Pressable>
          </InputSlot>
        )}
      </Input>
    </>
  );
}

export default function Register() {
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const toggleShowPassword = () => setShowPassword((prev) => !prev);

  const handleRegister = async () => {
    if (!username || !email || !password || !confirm) {
      alert("Harap isi semua form");
      return;
    }

    if (!email.includes("@")) {
      alert("Email harus mengandung '@'");
      return;
    }

    if (password !== confirm) {
      alert("Konfirmasi password tidak cocok");
      return;
    }

    try {
      // ✅ username permanen + displayName default sama dengan username (boleh diubah nanti)
      const profile = {
        username: username.trim(), // permanen
        displayName: username.trim(), // editable (default = username)
        email: email.trim(),
        status: "user",
      };

      const result = await registerUser(profile, password);

      const uid =
        result?.uid ||
        result?.user?.uid ||
        result?.userCredential?.user?.uid ||
        null;

      // ✅ session lokal (tanpa password)
      await AsyncStorage.setItem(
        "user",
        JSON.stringify({
          uid,
          username: profile.username,
          displayName: profile.displayName,
          email: profile.email,
          status: profile.status,
        })
      );

      alert("Registrasi berhasil! Silakan login.");
      router.replace("/login");
    } catch (error) {
      let message = "Registrasi gagal";

      switch (error?.code) {
        case "auth/email-already-in-use":
          message = "Email telah terdaftar";
          break;
        case "auth/invalid-email":
          message = "Format email tidak valid";
          break;
        case "auth/weak-password":
          message = "Password minimal 6 karakter";
          break;
        case "auth/network-request-failed":
          message = "Koneksi internet bermasalah";
          break;
        default:
          message = "Terjadi kesalahan saat registrasi";
      }

      alert(message);
      console.log("REGISTER ERROR:", error?.code, error?.message);
    }
  };

  return (
    <Box flex={1} p="$6" justifyContent="center" bg="$white">
      <Title text="Daftar Akun" />

      <InputLabel label="Username" value={username} setValue={setUsername} />

      <InputLabel
        label="Email"
        value={email}
        setValue={setEmail}
        type="email"
      />

      <InputLabel
        label="Password"
        value={password}
        setValue={setPassword}
        type="password"
        showPassword={showPassword}
        toggleShowPassword={toggleShowPassword}
      />

      <InputLabel
        label="Konfirmasi Password"
        value={confirm}
        setValue={setConfirm}
        type="password"
        showPassword={showPassword}
        toggleShowPassword={toggleShowPassword}
      />

      <Button onPress={handleRegister}>
        <ButtonText>Daftar</ButtonText>
      </Button>
    </Box>
  );
}
