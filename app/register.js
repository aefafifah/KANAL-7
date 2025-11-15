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

function Title({ text }) {
  return (
    <Text fontSize="$3xl" fontWeight="$bold" mb="$4">
      {text}
    </Text>
  );
}

function InputLabel({ label, value, setValue, type = "text" }) {
  return (
    <>
      <Text mb="$1">{label}</Text>
      <Input mb="$3">
        <InputField
          placeholder={label}
          value={value}
          secureTextEntry={type === "password"}
          keyboardType={type === "email" ? "email-address" : "default"}
          autoCapitalize="none"
          onChangeText={setValue}
        />
      </Input>
    </>
  );
}

export default function Register() {
  const router = useRouter();

  // STATE
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");

  // HANDLE REGISTER
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

    await UserStore.saveUser(username, email, password);

    alert("Registrasi berhasil! Silakan login.");
    router.replace("/login");
  };

  return (
    <Box flex={1} p="$6" justifyContent="center" bg="$white">
      {/* 🟦 Menggunakan Props */}
      <Title text="Daftar Akun" />

      {/* 🟩 Input dengan props */}
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
      />

      <InputLabel
        label="Konfirmasi Password"
        value={confirm}
        setValue={setConfirm}
        type="password"
      />

      <Button onPress={handleRegister}>
        <ButtonText>Daftar</ButtonText>
      </Button>
    </Box>
  );
}