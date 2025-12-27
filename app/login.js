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
  InputSlot,
  Icon,
} from "@gluestack-ui/themed";
import { Eye, EyeOff } from "lucide-react-native";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Firebase
import { signInWithEmailAndPassword } from "firebase/auth";
import { get, ref } from "firebase/database";
import { auth, db } from "../src/config/firebase";

export default function Login({
  title = "Login",
  buttonLabel = "Masuk",
  onLoginSuccess,
  showRegisterLink = true,
  bgColor = "$white",
}) {
  const router = useRouter();

  // user wajib isi 3 data
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const toggleShowPassword = () => setShowPassword((prev) => !prev);

  const handleLogin = async () => {
    if (!username || !email || !password) {
      alert("Harap isi semua form");
      return;
    }

    if (!email.includes("@")) {
      alert("Email harus mengandung '@'");
      return;
    }

    try {
      // 1) Login Firebase dengan email+password
      const cred = await signInWithEmailAndPassword(
        auth,
        email.trim(),
        password
      );
      const uid = cred.user.uid;

      // 2) Ambil profil dari RTDB
      const snap = await get(ref(db, `users/${uid}`));
      if (!snap.exists()) {
        alert("Data akun tidak ditemukan di database");
        return;
      }

      const profile = snap.val();

      // 3) Username WAJIB cocok dengan DB (strict)
      // username permanen ada di: profile.username (fallback legacy: profile.nama)
      const usernameDB = (profile?.username || profile?.nama || "").trim();
      const usernameInput = username.trim();

      if (!usernameDB) {
        alert("Username belum tersimpan di database. Silakan daftar ulang.");
        return;
      }

      // strict match (case-sensitive sesuai permintaan kamu)
      if (usernameDB !== usernameInput) {
        alert("Username tidak sesuai dengan akun ini");
        return;
      }

      // 4) Display Name ambil TERBARU dari RTDB, fallback ke username
      const displayNameDB = (profile?.displayName || "").trim();
      const displayNameFinal = displayNameDB || usernameDB;

      // 5) Simpan session ke AsyncStorage (tanpa password)
      const localUser = {
        uid,
        username: usernameDB, // permanen
        displayName: displayNameFinal, // yang tampil di UI
        email: (profile?.email || cred.user.email || email).trim(),
        status: profile?.status || "user",
      };

      await AsyncStorage.setItem("user", JSON.stringify(localUser));

      if (onLoginSuccess) onLoginSuccess(localUser);

      router.replace("/(tabs)/home");
    } catch (error) {
      console.log("LOGIN ERROR:", error?.code, error?.message);

      let msg = "Terjadi kesalahan saat login";
      switch (error?.code) {
        case "auth/invalid-credential":
        case "auth/wrong-password":
          msg = "Email atau password salah";
          break;
        case "auth/user-not-found":
          msg = "Akun tidak ditemukan";
          break;
        case "auth/invalid-email":
          msg = "Format email tidak valid";
          break;
        case "auth/network-request-failed":
          msg = "Koneksi internet bermasalah";
          break;
        default:
          msg = "Login gagal";
      }
      alert(msg);
    }
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
          secureTextEntry={!showPassword}
          value={password}
          onChangeText={setPassword}
        />
        <InputSlot pr="$3">
          <Pressable onPress={toggleShowPassword}>
            <Icon
              as={showPassword ? Eye : EyeOff}
              size="md"
              color="$coolGray500"
            />
          </Pressable>
        </InputSlot>
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
