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
  Image,
  VStack,
  HStack,
} from "@gluestack-ui/themed";
import { Eye, EyeOff } from "lucide-react-native";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { registerUser } from "../src/actions/authActions";

export default function Register() {
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const toggleShowPassword = () => setShowPassword(!showPassword);

  // ================= LOGIKA REGISTER TIDAK DIUBAH =================
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
      const profile = {
        username: username.trim(),
        displayName: username.trim(),
        email: email.trim(),
        status: "user",
      };

      const result = await registerUser(profile, password);

      const uid =
        result?.uid ||
        result?.user?.uid ||
        result?.userCredential?.user?.uid ||
        null;

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
      alert("Registrasi gagal");
      console.log(error);
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
          Create Account
        </Text>
        <Text color="$coolGray500">
          Fill the form to get started
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

          <Input>
            <InputField
              placeholder="Confirm Password"
              secureTextEntry={!showPassword}
              value={confirm}
              onChangeText={setConfirm}
            />
          </Input>
        </VStack>

        {/* BUTTON */}
        <Button
          w="100%"
          mt="$4"
          bg="$blue600"
          borderRadius="$full"
          onPress={handleRegister}
        >
          <ButtonText color="$white">Sign up</ButtonText>
        </Button>

        {/* LINK */}
        <HStack mt="$2">
          <Text color="$coolGray500">Already have an account? </Text>
          <Pressable onPress={() => router.replace("/login")}>
            <Text color="$blue600" fontWeight="$bold">
              Sign in
            </Text>
          </Pressable>
        </HStack>
      </VStack>
    </Box>
  );
}