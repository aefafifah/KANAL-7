import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Center, Box, Button, ButtonText, Text } from "@gluestack-ui/themed";
import { useRouter } from "expo-router";
export default function ProfileTab() {
  const router = useRouter();
  const [name, setName] = useState("");

  useEffect(() => {
    AsyncStorage.getItem("user").then((res) => {
      if (res) {
        const u = JSON.parse(res);
        setName(u.username);
      }
    });
  }, []);

  const handleLogout = async () => {
    router.replace("/login");
  };

  return (
    <Center flex={1} px="$6" bg="$gray100">
      <Box w="100%" maxWidth={350} p="$6" bg="$white" rounded="$xl" shadow="$2">

        <Text fontSize="$2xl" fontWeight="bold" mb="$4">
          <Text fontWeight="bold">{(name || "-").toUpperCase()}</Text>
        </Text>

        <Button mb="$3" onPress={() => router.push("/profile")}>
          <ButtonText>Lihat Profile</ButtonText>
        </Button>

        <Button mb="$3" onPress={() => router.push("/profile/editpassword")}>
          <ButtonText>Ubah Password</ButtonText>
        </Button>

        <Button mb="$3" onPress={() => router.push("/profile/language")}>
          <ButtonText>Pilih Bahasa</ButtonText>
        </Button>

        <Button mb="$3" onPress={() => router.push("/profile/theme")}>
          <ButtonText>Pilih Tema</ButtonText>
        </Button>

        {/* === TOMBOL LOGOUT === */}
        <Button bg="$red600" mt="$4" onPress={handleLogout}>
          <ButtonText style={{ color: "white" }}>Logout</ButtonText>
        </Button>

      </Box>
    </Center>
  );
}