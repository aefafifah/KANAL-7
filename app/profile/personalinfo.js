import { useState, useCallback } from "react";
import { Platform } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Stack, useRouter } from "expo-router";
import { useFocusEffect } from "@react-navigation/native";
import DateTimePicker from "@react-native-community/datetimepicker";

import {
  Box,
  Text,
  VStack,
  HStack,
  Button,
  ButtonText,
  Pressable,
  Avatar,
  AvatarFallbackText,
  Select,
  SelectTrigger,
  SelectInput,
  SelectIcon,
  SelectPortal,
  SelectContent,
  SelectItem,
  Divider,
} from "@gluestack-ui/themed";

import { ChevronDown, Pencil, ChevronRight, Camera } from "lucide-react-native";
import * as ImagePicker from "expo-image-picker";
import { auth, db } from "../../src/config/firebase";
import { ref, set } from "firebase/database";

const PRIMARY = "#3B82F6";

export default function PersonalInfo() {
  const router = useRouter();
  const uid = auth.currentUser?.uid;

  const [isLocked, setIsLocked] = useState(true);
  const [showDatePicker, setShowDatePicker] = useState(false);

  const [profile, setProfile] = useState({
    username: "",
    email: "",
    gender: "",
    birthdate: "",
    photoUrl: "",
  });

  // =====================
  // LOAD PROFILE
  // =====================
  useFocusEffect(
    useCallback(() => {
      loadProfile();
    }, [])
  );

  const loadProfile = async () => {
    const saved = await AsyncStorage.getItem("personal-info");
    if (saved) {
      const p = JSON.parse(saved);
      setProfile({
        username: p.username || "",
        email: p.email || "",
        gender: p.gender || "",
        birthdate: p.birthdate || "",
        photoUrl: p.photoUrl || "",
      });
      return;
    }

    const localUser = await AsyncStorage.getItem("user");
    if (localUser) {
      const u = JSON.parse(localUser);
      setProfile((prev) => ({
        ...prev,
        username: u.username || "",
        email: u.email || "",
      }));
    }
  };

  // =====================
  // IMAGE PICKER
  // =====================
  const pickImage = async () => {
    if (isLocked) return;

    const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!perm.granted) {
      alert("Izin galeri diperlukan");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });

    if (!result.canceled) {
      setProfile((p) => ({
        ...p,
        photoUrl: result.assets[0].uri,
      }));
    }
  };

  // =====================
  // DATE PICKER HANDLER
  // =====================
  const handleDateChange = (event, selectedDate) => {
    setShowDatePicker(false);

    if (selectedDate) {
      const formatted = selectedDate.toISOString().split("T")[0];
      setProfile((p) => ({
        ...p,
        birthdate: formatted,
      }));
    }
  };

  // =====================
  // SAVE PROFILE
  // =====================
  const saveProfile = async () => {
    if (!uid) return;

    const personalInfo = {
      username: profile.username,
      email: profile.email,
      gender: profile.gender || "",
      birthdate: profile.birthdate || "",
      photoUrl: profile.photoUrl || "",
    };

    await AsyncStorage.setItem(
      "personal-info",
      JSON.stringify(personalInfo)
    );

    await set(ref(db, `users/${uid}/profile`), personalInfo);

    setIsLocked(true);
  };

  return (
    <>
      <Stack.Screen options={{ title: "Personal Info" }} />

      <Box flex={1} bg="#F1F5F9">
        {/* ===== HEADER ===== */}
        <Box bg={PRIMARY} pt="$10" pb="$12" roundedBottom="$3xl">
          <VStack alignItems="center" space="sm">
            <Pressable onPress={pickImage}>
              <Box bg="$white" p="$1" rounded="$full">
                <Avatar size="xl" bg={PRIMARY}>
                  {profile.photoUrl ? (
                    <Avatar.Image source={{ uri: profile.photoUrl }} />
                  ) : (
                    <AvatarFallbackText>
                      {profile.username?.charAt(0)?.toUpperCase()}
                    </AvatarFallbackText>
                  )}
                </Avatar>

                {!isLocked && (
                  <Box
                    position="absolute"
                    bottom={0}
                    right={0}
                    bg={PRIMARY}
                    p="$1"
                    rounded="$full"
                  >
                    <Camera size={14} color="white" />
                  </Box>
                )}
              </Box>
            </Pressable>

            <Text fontSize="$lg" fontWeight="$bold" color="$white">
              @{profile.username}
            </Text>

            <Text fontSize="$sm" color="#DBEAFE">
              {profile.email}
            </Text>
          </VStack>
        </Box>

        {/* ===== CONTENT ===== */}
        <VStack p="$4" space="lg" mt="$-8">
          {/* ACCOUNT */}
          <Section title="Account">
            <Pressable
              disabled={isLocked}
              onPress={() => router.push("/profile/editusername")}
            >
              <Row label="Username" value={profile.username} arrow />
            </Pressable>

            <Divider />

            <Row label="Email" value={profile.email} />

            <Divider />

            <Pressable
              disabled={isLocked}
              onPress={() => router.push("/profile/editpassword")}
            >
              <Row label="Password" value="••••••••" arrow />
            </Pressable>
          </Section>

          {/* PERSONAL */}
          <Section title="Personal Information">
            <Row label="Gender">
              {isLocked ? (
                <Text fontWeight="$medium" color="#0F172A">
                  {profile.gender || "Not set"}
                </Text>
              ) : (
                <Select
                  selectedValue={profile.gender}
                  onValueChange={(v) =>
                    setProfile({ ...profile, gender: v })
                  }
                >
                  <SelectTrigger>
                    <SelectInput placeholder="Select gender" />
                    <SelectIcon as={ChevronDown} />
                  </SelectTrigger>

                  <SelectPortal>
                    <SelectContent>
                      <SelectItem label="Male" value="Male" />
                      <SelectItem label="Female" value="Female" />
                      <SelectItem label="Other" value="Other" />
                    </SelectContent>
                  </SelectPortal>
                </Select>
              )}
            </Row>

            <Divider />

            <Row label="Birthdate">
              {isLocked ? (
                <Text fontWeight="$medium" color="#0F172A">
                  {profile.birthdate || "Not set"}
                </Text>
              ) : (
                <Pressable onPress={() => setShowDatePicker(true)}>
                  <HStack alignItems="center" space="xs">
                    <Text fontWeight="$medium" color="#0F172A">
                      {profile.birthdate || "Select date"}
                    </Text>
                    <ChevronRight size={16} color="#94A3B8" />
                  </HStack>
                </Pressable>
              )}
            </Row>
          </Section>

          {/* ACTION */}
          {isLocked ? (
            <Button
              variant="outline"
              borderColor={PRIMARY}
              onPress={() => setIsLocked(false)}
            >
              <Pencil size={16} color={PRIMARY} />
              <ButtonText ml="$2" color={PRIMARY}>
                Edit Profile
              </ButtonText>
            </Button>
          ) : (
            <Button bg={PRIMARY} onPress={saveProfile}>
              <ButtonText color="$white">
                Save Changes
              </ButtonText>
            </Button>
          )}
        </VStack>

        {/* DATE PICKER */}
        {showDatePicker && (
          <DateTimePicker
            value={
              profile.birthdate
                ? new Date(profile.birthdate)
                : new Date()
            }
            mode="date"
            display={Platform.OS === "ios" ? "spinner" : "default"}
            onChange={handleDateChange}
            maximumDate={new Date()}
          />
        )}
      </Box>
    </>
  );
}

/* ===== KOMPONEN ===== */

function Section({ title, children }) {
  return (
    <Box
      bg="$white"
      rounded="$xl"
      p="$4"
      shadow="$2"
      borderLeftWidth={4}
      borderLeftColor={PRIMARY}
    >
      <Text fontWeight="$bold" mb="$3" color="#1E293B">
        {title}
      </Text>
      {children}
    </Box>
  );
}

function Row({ label, value, arrow, children }) {
  return (
    <HStack alignItems="center" justifyContent="space-between" py="$2">
      <Text color="#64748B">{label}</Text>

      {children ? (
        children
      ) : (
        <HStack alignItems="center" space="xs">
          <Text fontWeight="$medium" color="#0F172A">
            {value}
          </Text>
          {arrow && (
            <ChevronRight size={16} color="#94A3B8" />
          )}
        </HStack>
      )}
    </HStack>
  );
}
