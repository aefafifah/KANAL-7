// app/(tabs)/_layout.js
import { useEffect, useRef, useState } from "react";
import { Animated, Dimensions, TouchableOpacity } from "react-native";
import { Tabs, useRouter } from "expo-router";
import {
  Box,
  HStack,
  VStack,
  Text,
  Avatar,
  AvatarFallbackText,
  Pressable,
} from "@gluestack-ui/themed";
import {
  Home,
  Users,
  Newspaper,
  BarChart2,
  User,
  AlignJustify,
} from "lucide-react-native";

const { width, height } = Dimensions.get("window");

// 🔹 Drawer Menu
function DrawerMenu({ visible, onClose, router }) {
  const slideAnim = useRef(new Animated.Value(-width)).current;
  const overlayAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(slideAnim, {
      toValue: visible ? 0 : -width,
      duration: 250,
      useNativeDriver: true,
    }).start();

    Animated.timing(overlayAnim, {
      toValue: visible ? 1 : 0,
      duration: 200,
      useNativeDriver: true,
    }).start();
  }, [visible, slideAnim, overlayAnim]);

  if (!visible) return null;

  return (
    <Box
      position="absolute"
      left={0}
      top={0}
      right={0}
      bottom={0}
      zIndex={999}
    >
      {/* ✅ Overlay (klik luar untuk close) */}
      <Animated.View
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          width,
          height,
          opacity: overlayAnim,
        }}
      >
        <TouchableOpacity
          activeOpacity={1}
          onPress={onClose}
          style={{
            flex: 1,
            backgroundColor: "rgba(0,0,0,0.35)",
          }}
        />
      </Animated.View>

      {/* ✅ Drawer panel */}
      <Animated.View
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          bottom: 0,
          width: width * 0.72,
          transform: [{ translateX: slideAnim }],
        }}
      >
        <Box flex={1} bg="#111" p="$6" pt="$16">
          <Text color="white" fontSize="$2xl" mb="$8" fontWeight="$bold">
            Menu
          </Text>

          <VStack space="md">
            <Pressable
              bg="#3b82f6"
              p="$3"
              rounded="$lg"
              onPress={() => {
                onClose();
                router.push("/jurnalwater");
              }}
            >
              <Text color="white" fontWeight="$semibold">
                Jurnal Water
              </Text>
            </Pressable>

            <Pressable
              bg="#3b82f6"
              p="$3"
              rounded="$lg"
              onPress={() => {
                onClose();
                router.push("/challengewater");
              }}
            >
              <Text color="white" fontWeight="$semibold">
                Challenge Water
              </Text>
            </Pressable>

            <Pressable
              bg="#3b82f6"
              p="$3"
              rounded="$lg"
              onPress={() => {
                onClose();
                router.push("/sleepzone");
              }}
            >
              <Text color="white" fontWeight="$semibold">
                Smart Sleep Zone
              </Text>
            </Pressable>

            <Pressable
              bg="#3b82f6"
              p="$3"
              rounded="$lg"
              onPress={() => {
                onClose();
                router.push("/streak");
              }}
            >
              <Text color="white" fontWeight="$semibold">
                Streak Konsisten
              </Text>
            </Pressable>

            <Pressable
              bg="#3b82f6"
              p="$3"
              rounded="$lg"
              onPress={() => {
                onClose();
                router.push("/moodscreen");
              }}
            >
              <Text color="white" fontWeight="$semibold">
                Daily Mood
              </Text>
            </Pressable>

            <Pressable
              bg="#3b82f6"
              p="$3"
              rounded="$lg"
              onPress={() => {
                onClose();
                router.push("/targetharian");
              }}
            >
              <Text color="white" fontWeight="$semibold">
                Target Harian Dinamis
              </Text>
            </Pressable>

            <Pressable
              bg="#3b82f6"
              p="$3"
              rounded="$lg"
              onPress={() => {
                onClose();
                router.push("/hydrationBadges");
              }}
            >
              <Text color="white" fontWeight="$semibold">
                Hydration Badges
              </Text>
            </Pressable>

            <Pressable bg="#444" p="$3" rounded="$lg" onPress={onClose}>
              <Text color="white" fontWeight="$semibold">
                Close
              </Text>
            </Pressable>
          </VStack>
        </Box>
      </Animated.View>
    </Box>
  );
}

// 🔹 Tombol Hamburger
function HeaderHamburger({ onPress }) {
  return (
    <Pressable onPress={onPress} ml="$2">
      <AlignJustify size={24} color="black" />
    </Pressable>
  );
}

// 🔹 Header Avatar
function HeaderAvatar() {
  return (
    <HStack space="sm" alignItems="center" mr="$4">
      <Text color="$gray800" fontWeight="$medium">
        Mahasiswa
      </Text>
      <Avatar size="sm" bgColor="$blue500">
        <AvatarFallbackText>K</AvatarFallbackText>
      </Avatar>
    </HStack>
  );
}

// 🔹 TAB LAYOUT
export default function TabsLayout() {
  const [drawerVisible, setDrawerVisible] = useState(false);
  const router = useRouter();

  return (
    <>
      <DrawerMenu
        visible={drawerVisible}
        onClose={() => setDrawerVisible(false)}
        router={router}
      />

      <Tabs
        screenOptions={{
          tabBarActiveTintColor: "#3b82f6",
        }}
      >
        <Tabs.Screen
          name="home"
          options={{
            headerShown: true,
            headerTitle: "Home",
            headerLeft: () => (
              <HeaderHamburger onPress={() => setDrawerVisible(true)} />
            ),
            tabBarIcon: ({ color }) => <Home color={color} />,
          }}
        />

        <Tabs.Screen
          name="stats"
          options={{
            headerShown: true,
            headerTitle: "Kenali Cuaca & Rekomendasi Minum",
            headerLeft: () => (
              <HeaderHamburger onPress={() => setDrawerVisible(true)} />
            ),
            tabBarIcon: ({ color }) => <BarChart2 color={color} />,
          }}
        />

        <Tabs.Screen
          name="community"
          options={{
            headerShown: true,
            headerTitle: "Komunitas",
            headerLeft: () => (
              <HeaderHamburger onPress={() => setDrawerVisible(true)} />
            ),
            headerRight: () => <HeaderAvatar />,
            tabBarIcon: ({ color }) => <Users color={color} />,
          }}
        />

        <Tabs.Screen
          name="news"
          options={{
            headerShown: true,
            headerTitle: "Berita",
            headerLeft: () => (
              <HeaderHamburger onPress={() => setDrawerVisible(true)} />
            ),
            tabBarIcon: ({ color }) => <Newspaper color={color} />,
          }}
        />

        <Tabs.Screen
          name="profile"
          options={{
            headerShown: true,
            headerTitle: "Profil",
            headerLeft: () => (
              <HeaderHamburger onPress={() => setDrawerVisible(true)} />
            ),
            tabBarIcon: ({ color }) => <User color={color} />,
          }}
        />
      </Tabs>
    </>
  );
}
