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
  Image,
  VStack,
  HStack,
} from "@gluestack-ui/themed";
import { Eye, EyeOff } from "lucide-react-native";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Firebase
import { signInWithEmailAndPassword } from "firebase/auth";
import { get, ref } from "firebase/database";
import { auth, db } from "../src/config/firebase";

export default function Login() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const toggleShowPassword = () => setShowPassword(!showPassword);

  // ================= LOGIKA LOGIN TIDAK DIUBAH =================
  const handleLogin = async () => {
    if (!username || !email || !password) {
      alert("Harap isi semua form");
      return;
    }
    try {
      const cred = await signInWithEmailAndPassword(
        auth,
        email.trim(),
        password
      );
      const uid = cred.user.uid;
      const snap = await get(ref(db, `users/${uid}`));
      if (!snap.exists()) {
        alert("Data akun tidak ditemukan");
        return;
      }

      const profile = snap.val();
      const usernameDB = (profile?.username || "").trim();

      if (usernameDB !== username.trim()) {
        alert("Username tidak sesuai");
        return;
      }

      await AsyncStorage.setItem(
        "user",
        JSON.stringify({
          uid,
          username: usernameDB,
          email,
          status: profile?.status || "user",
        })
      );

      router.replace("/(tabs)/home");
    } catch (err) {
      alert("Login gagal");
    }
  };

  return (
    <Box flex={1} bg="$white" px="$6" justifyContent="center">
      <VStack space="lg" alignItems="center">
        {/* LOGO */}
        <Image
          source={require("../assets/logo.png")}
          alt="logo"
          w={150}
          h={150}
          mb="$2"
        />

        {/* TITLE */}
        <Text fontSize="$2xl" fontWeight="$bold">
          Let’s Get Started!
        </Text>
        <Text color="$coolGray500">
          Let’s dive into your account
        </Text>

        {/* FORM */}
        <VStack w="100%" space="md" mt="$4">
          <Input>
            <InputField
              placeholder="Username"
              value={username}
              onChangeText={setUsername}
              autoCapitalize="none"
            />
          </Input>

          <Input>
            <InputField
              placeholder="Email"
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
            />
          </Input>

          <Input>
            <InputField
              placeholder="Password"
              secureTextEntry={!showPassword}
              value={password}
              onChangeText={setPassword}
            />
            <InputSlot pr="$3">
              <Pressable onPress={toggleShowPassword}>
                <Icon as={showPassword ? Eye : EyeOff} />
              </Pressable>
            </InputSlot>
          </Input>
        </VStack>

        {/* MAIN BUTTON */}
        <Button
          w="100%"
          mt="$4"
          bg="$blue600"
          borderRadius="$full"
          onPress={handleLogin}
        >
          <ButtonText color="$white">Sign in</ButtonText>
        </Button>

        {/* LINK */}
        <HStack mt="$2">
          <Text color="$coolGray500">Belum punya akun? </Text>
          <Pressable onPress={() => router.push("/register")}>
            <Text color="$blue600" fontWeight="$bold">
              Sign up
            </Text>
          </Pressable>
        </HStack>
      </VStack>
    </Box>
  );
}