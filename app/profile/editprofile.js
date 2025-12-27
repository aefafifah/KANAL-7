import { useCallback, useState } from "react";
import { Alert, Image } from "react-native";
import {
  Box,
  Center,
  Text,
  Input,
  InputField,
  Button,
  ButtonText,
  Pressable,
  Icon,
  VStack,
  HStack,
} from "@gluestack-ui/themed";
import { Stack, useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";
import * as ImagePicker from "expo-image-picker";
import { Camera, User as UserIcon } from "lucide-react-native";

// Firebase RTDB update
import { auth, db } from "../../src/config/firebase";
import { update, ref } from "firebase/database";

export default function EditProfile() {
  const router = useRouter();

  // username permanen (read-only)
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");

  // yang boleh diubah hanya displayName
  const [displayName, setDisplayName] = useState("");

  // foto lokal (hapus saat logout)
  const [photoURI, setPhotoURI] = useState("");

  useFocusEffect(
    useCallback(() => {
      const load = async () => {
        try {
          const res = await AsyncStorage.getItem("user");
          if (res) {
            const u = JSON.parse(res);

            const uname = (u.username || "").toString().trim();
            setUsername(uname);
            setEmail((u.email || "").toString().trim());

            // ✅ sumber utama displayName: session.displayName
            // ✅ fallback aman: username (bukan "nama" legacy)
            const dname = (u.displayName || "").toString().trim();
            setDisplayName(dname || uname);
          }

          const savedPhoto = await AsyncStorage.getItem("profilePhoto");
          if (savedPhoto) setPhotoURI(savedPhoto);
        } catch (e) {
          console.log("EDIT PROFILE LOAD ERROR:", e);
        }
      };

      load();
    }, [])
  );

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Izin dibutuhkan",
        "Akses galeri diperlukan untuk mengganti foto profil."
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) {
      const uri = result.assets[0].uri;
      setPhotoURI(uri);
    }
  };

  const handleSave = async () => {
    const dname = displayName.trim();
    if (!dname) {
      Alert.alert("Validasi", "Display Name tidak boleh kosong.");
      return;
    }

    // 1) Update session lokal (username tetap)
    const res = await AsyncStorage.getItem("user");
    const oldUser = res ? JSON.parse(res) : {};

    const newUser = {
      ...oldUser,
      username: (username || oldUser.username || "").toString().trim(), // tetap
      email: (email || oldUser.email || "").toString().trim(),
      displayName: dname, // ✅ berubah
    };

    await AsyncStorage.setItem("user", JSON.stringify(newUser));

    // 2) Simpan foto lokal
    if (photoURI) {
      await AsyncStorage.setItem("profilePhoto", photoURI);
    } else {
      await AsyncStorage.removeItem("profilePhoto");
    }

    // 3) Update RTDB: hanya displayName (username tidak disentuh)
    try {
      const uid = auth.currentUser?.uid || oldUser?.uid;
      if (uid) {
        await update(ref(db, `users/${uid}`), {
          displayName: dname,
        });
      }
    } catch (e) {
      console.log("UPDATE DISPLAYNAME RTDB ERROR:", e);
      // tidak gagalkan save lokal
    }

    Alert.alert("Berhasil", "Profil berhasil diperbarui.");
    router.back();
  };

  return (
    <Box flex={1} bg="$gray50">
      <Stack.Screen options={{ title: "Edit Profil" }} />

      <Center flex={1} px="$5" py="$6">
        <Box
          w="100%"
          maxWidth={420}
          bg="$white"
          rounded="$2xl"
          shadow="$2"
          p="$6"
        >
          <HStack alignItems="center" justifyContent="space-between" mb="$5">
            <Box>
              <Text fontSize="$2xl" fontWeight="$bold" color="$gray900">
                Edit Profil
              </Text>
              <Text mt="$1" fontSize="$sm" color="$gray500">
                Perbarui display name dan foto profil
              </Text>
            </Box>
          </HStack>

          <Center mb="$6">
            <Pressable onPress={pickImage}>
              <Box
                w={120}
                h={120}
                rounded="$full"
                bg="$gray100"
                justifyContent="center"
                alignItems="center"
                overflow="hidden"
                position="relative"
                borderWidth={1}
                borderColor="$gray200"
              >
                {photoURI ? (
                  <Image
                    source={{ uri: photoURI }}
                    style={{ width: 120, height: 120 }}
                    resizeMode="cover"
                  />
                ) : (
                  <Icon as={UserIcon} size="xl" color="$gray400" />
                )}

                <Box
                  position="absolute"
                  right={8}
                  bottom={8}
                  w={36}
                  h={36}
                  rounded="$full"
                  bg="$blue600"
                  justifyContent="center"
                  alignItems="center"
                  shadow="$1"
                >
                  <Icon as={Camera} size="sm" color="$white" />
                </Box>
              </Box>
            </Pressable>

            <Text mt="$3" color="$gray500" fontSize="$sm">
              Ketuk foto untuk mengganti
            </Text>
          </Center>

          <VStack space="lg">
            {/* Username permanen (read-only) */}
            <Box>
              <Text
                mb="$2"
                color="$gray700"
                fontSize="$sm"
                fontWeight="$medium"
              >
                Username (Permanen)
              </Text>
              <Input
                isDisabled
                rounded="$xl"
                borderColor="$gray200"
                bg="$gray100"
                px="$3"
                py="$2"
              >
                <InputField value={username} />
              </Input>
            </Box>

            {/* Display Name editable */}
            <Box>
              <Text
                mb="$2"
                color="$gray700"
                fontSize="$sm"
                fontWeight="$medium"
              >
                Display Name
              </Text>
              <Input
                rounded="$xl"
                borderColor="$gray200"
                bg="$white"
                px="$3"
                py="$2"
              >
                <InputField
                  value={displayName}
                  onChangeText={setDisplayName}
                  placeholder="Masukkan display name"
                  autoCapitalize="words"
                />
              </Input>
            </Box>

            {/* Email read-only */}
            <Box>
              <Text
                mb="$2"
                color="$gray700"
                fontSize="$sm"
                fontWeight="$medium"
              >
                Email (Read Only)
              </Text>
              <Input
                isDisabled
                rounded="$xl"
                borderColor="$gray200"
                bg="$gray100"
                px="$3"
                py="$2"
              >
                <InputField value={email} />
              </Input>
            </Box>

            <Button
              mt="$2"
              bg="$blue600"
              rounded="$full"
              h={52}
              onPress={handleSave}
            >
              <ButtonText color="$white" fontWeight="$semibold">
                Save Change
              </ButtonText>
            </Button>
          </VStack>
        </Box>
      </Center>
    </Box>
  );
}
