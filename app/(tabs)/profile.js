import { useCallback, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";
import { useRouter, Stack } from "expo-router";
import {
  Box,
  Text,
  VStack,
  HStack,
  Pressable,
  ScrollView,
  Avatar,
  AvatarFallbackText,
  AvatarImage,
} from "@gluestack-ui/themed";
import {
  User,
  Settings,
  Shield,
  LogOut,
  Star,
  ChevronRight,
} from "lucide-react-native";

import { get, ref as dbRef } from "firebase/database";
import { auth, db } from "../../src/config/firebase";

export default function Profile() {
  const router = useRouter();

  const [user, setUser] = useState({
    username: "",
    email: "",
    photoUrl: "",
  });

  const [streakLevel, setStreakLevel] = useState(1);

  useFocusEffect(
    useCallback(() => {
      const load = async () => {
        const saved = await AsyncStorage.getItem("personal-info");

        if (saved) {
          const p = JSON.parse(saved);
          setUser({
            username: p.username || "",
            email: p.email || "",
            photoUrl: p.photoUrl || "",
          });
        }

        const streak = await AsyncStorage.getItem("streak-level");
        setStreakLevel(streak ? parseInt(streak) : 1);
      };

      load();
    }, [])
  );



  const logout = async () => {
    await AsyncStorage.clear();
    await auth.signOut();
    router.replace("/login");
  };

  return (
    <>
      <Stack.Screen options={{ title: "Profile" }} />

      <ScrollView bg="#EEF2FF">
        <VStack space="lg" p="$4">

          {/* ===== HEADER CENTER ===== */}
          <VStack alignItems="center" space="sm" mt="$4">
            <Avatar size="2xl" bg="#3B82F6">
              {user.photoUrl ? (
                <AvatarImage source={{ uri: user.photoUrl }} />
              ) : (
                <AvatarFallbackText>
                  {user.username?.charAt(0)?.toUpperCase()}
                </AvatarFallbackText>
              )}
            </Avatar>

            <Text fontSize="$xl" fontWeight="$bold" color="#111827">
              @{user.username}
            </Text>

            <Text fontSize="$sm" color="#6B7280">
              {user.email}
            </Text>
          </VStack>

          {/* ===== LEVEL CARD ===== */}
          <Pressable onPress={() => router.push("/streak")}>
            <Box
              bg="#2563EB"
              rounded="$2xl"
              p="$5"
              shadow="$2"
            >
              <HStack justifyContent="space-between" alignItems="center">
                <HStack space="md" alignItems="center">
                  <Box bg="#1E40AF" p="$3" rounded="$full">
                    <Star size={22} color="#FFFFFF" />
                  </Box>

                  <VStack>
                    <Text color="#FFFFFF" fontSize="$lg" fontWeight="$bold">
                      Level {streakLevel}
                    </Text>
                    <Text color="#DBEAFE" fontSize="$sm">
                      Konsisten {streakLevel} hari
                    </Text>
                  </VStack>
                </HStack>

                <ChevronRight size={20} color="#FFFFFF" />
              </HStack>
            </Box>
          </Pressable>

          {/* ===== MENU ===== */}
          <MenuCard
            title="Personal Info"
            subtitle="Profil, foto, gender"
            icon={User}
            onPress={() => router.push("/profile/personalinfo")}
          />

          <MenuCard
            title="Preferences"
            subtitle="Reminder & tampilan"
            icon={Settings}
            onPress={() => router.push("/profile/preference")}
          />

          <MenuCard
            title="Logout"
            subtitle="Keluar dari akun"
            danger
            icon={LogOut}
            onPress={logout}
          />
        </VStack>
      </ScrollView>
    </>
  );
}

/* ===== MENU CARD ===== */
function MenuCard({ title, subtitle, icon: Icon, onPress, danger }) {
  return (
    <Pressable onPress={onPress}>
      <Box bg="#FFFFFF" rounded="$2xl" p="$5" shadow="$1">
        <HStack justifyContent="space-between" alignItems="center">
          <HStack space="md" alignItems="center">
            <Box
              bg={danger ? "#FEE2E2" : "#DBEAFE"}
              p="$3"
              rounded="$full"
            >
              <Icon
                size={22}
                color={danger ? "#DC2626" : "#2563EB"}
              />
            </Box>

            <VStack>
              <Text
                fontSize="$lg"
                fontWeight="$bold"
                color={danger ? "#DC2626" : "#111827"}
              >
                {title}
              </Text>
              <Text fontSize="$sm" color="#6B7280">
                {subtitle}
              </Text>
            </VStack>
          </HStack>

          <ChevronRight size={20} color="#9CA3AF" />
        </HStack>
      </Box>
    </Pressable>
  );
}
