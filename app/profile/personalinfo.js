import { useState, useCallback } from "react";
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

  /* =====================
     LOAD PROFILE
  ===================== */
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
    }
  };

  /* =====================
     IMAGE PICKER
  ===================== */
  const pickImage = async () => {
    if (isLocked) return;

    const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!perm.granted) return;

    const result = await ImagePicker.launchImageLibraryAsync({
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

  /* =====================
     SAVE PROFILE
  ===================== */
  const saveProfile = async () => {
    if (!uid) return;

    await AsyncStorage.setItem(
      "personal-info",
      JSON.stringify(profile)
    );

    await set(ref(db, `users/${uid}/profile`), profile);

    setIsLocked(true);
  };

  return (
    <>
      <Stack.Screen options={{ title: "Personal Info" }} />

      <Box flex={1} bg="#F1F5F9">
        {/* HEADER */}
        <Box bg={PRIMARY} pt="$10" pb="$12" roundedBottom="$3xl">
          <VStack alignItems="center">
            <Pressable onPress={pickImage}>
              <Avatar size="xl" bg={PRIMARY}>
                {profile.photoUrl ? (
                  <Avatar.Image source={{ uri: profile.photoUrl }} />
                ) : (
                  <AvatarFallbackText>
                    {profile.username?.[0]?.toUpperCase()}
                  </AvatarFallbackText>
                )}
              </Avatar>
            </Pressable>

            <Text color="$white" fontWeight="$bold" mt="$2">
              @{profile.username}
            </Text>
            <Text color="#DBEAFE">{profile.email}</Text>
          </VStack>
        </Box>

        {/* CONTENT */}
        <VStack p="$4" mt="$-8" space="lg">
          {/* ACCOUNT */}
          <Section title="Account">
            <Pressable
              disabled={isLocked}
              opacity={isLocked ? 0.4 : 1}
              onPress={() => router.push("/profile/editusername")}
            >
              <Row label="Username" value={profile.username} arrow />
            </Pressable>

            <Divider />

            <Row label="Email" value={profile.email} />

            <Divider />

            <Pressable
              disabled={isLocked}
              opacity={isLocked ? 0.4 : 1}
              onPress={() => router.push("/profile/editpassword")}
            >
              <Row label="Password" value="••••••••" arrow />
            </Pressable>
          </Section>

          {/* PERSONAL */}
          <Section title="Personal Information">
            <Row label="Gender">
              {isLocked ? (
                <Text>{profile.gender || "Not set"}</Text>
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

            <Pressable
              disabled={isLocked}
              opacity={isLocked ? 0.4 : 1}
              onPress={() => setShowDatePicker(true)}
            >
              <Row
                label="Birthdate"
                value={profile.birthdate || "Select date"}
                arrow={!isLocked}
              />
            </Pressable>
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
              <ButtonText color="$white">Save Changes</ButtonText>
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
            display="spinner"
            onChange={(_, date) => {
              setShowDatePicker(false);
              if (date) {
                setProfile({
                  ...profile,
                  birthdate: date.toISOString().split("T")[0],
                });
              }
            }}
          />
        )}
      </Box>
    </>
  );
}

/* COMPONENT */
function Section({ title, children }) {
  return (
    <Box bg="$white" p="$4" rounded="$xl" shadow="$2">
      <Text fontWeight="$bold" mb="$3">
        {title}
      </Text>
      {children}
    </Box>
  );
}

function Row({ label, value, arrow, children }) {
  return (
    <HStack justifyContent="space-between" py="$2">
      <Text color="#64748B">{label}</Text>
      {children || (
        <HStack alignItems="center">
          <Text>{value}</Text>
          {arrow && <ChevronRight size={16} />}
        </HStack>
      )}
    </HStack>
  );
}