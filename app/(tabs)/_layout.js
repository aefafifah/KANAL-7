import { useEffect, useRef, useState } from "react";
import { Animated, Dimensions, TouchableOpacity } from "react-native";
import { Tabs, useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
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

/* ===================== DRAWER MENU ===================== */
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
  }, [visible]);

  if (!visible) return null;

  return (
    <Box position="absolute" left={0} top={0} right={0} bottom={0} zIndex={999}>
      {/* Overlay */}
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

      {/* Drawer */}
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
            {[
              { label: "Jurnal Water", path: "/jurnalwater" },
              { label: "Challenge Water", path: "/challengewater" },
              { label: "Smart Sleep Zone", path: "/sleepzone" },
              { label: "Streak Konsisten", path: "/streak" },
              { label: "Daily Mood", path: "/moodscreen" },
              { label: "Target Harian Dinamis", path: "/targetharian" },
              { label: "Hydration Badges", path: "/hydrationBadges" },
            ].map((item) => (
              <Pressable
                key={item.label}
                bg="#3b82f6"
                p="$3"
                rounded="$lg"
                onPress={() => {
                  onClose();
                  router.push(item.path);
                }}
              >
                <Text color="white" fontWeight="$semibold">
                  {item.label}
                </Text>
              </Pressable>
            ))}

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

/* ===================== HEADER COMPONENT ===================== */
function HeaderHamburger({ onPress }) {
  return (
    <Pressable onPress={onPress} ml="$4">
      <AlignJustify size={24} color="black" />
    </Pressable>
  );
}

/* ===================== HEADER AVATAR ===================== */
function HeaderAvatar() {
  const [user, setUser] = useState({
    username: "",
    photoUrl: "",
  });

  useEffect(() => {
    const loadUser = async () => {
      const saved = await AsyncStorage.getItem("personal-info");
      if (saved) {
        const p = JSON.parse(saved);
        setUser({
          username: p.username || "",
          photoUrl: p.photoUrl || "",
        });
      }
    };

    loadUser();
  }, []);

  return (
    <HStack mr="$4">
      <Avatar size="sm" bg="$blue500">
        {user.photoUrl ? (
          <Avatar.Image source={{ uri: user.photoUrl }} />
        ) : (
          <AvatarFallbackText>
            {user.username?.charAt(0)?.toUpperCase()}
          </AvatarFallbackText>
        )}
      </Avatar>

    </HStack>
  );
}

/* ===================== TAB LAYOUT ===================== */
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
          headerTitleAlign: "center",
        }}
      >
        {/* HOME */}
        <Tabs.Screen
          name="home"
          options={{
            headerTitle: "Home",
            headerLeft: () => (
              <HeaderHamburger onPress={() => setDrawerVisible(true)} />
            ),
            headerRight: () => <Box w={40} />,
            tabBarIcon: ({ color }) => <Home color={color} />,
          }}
        />

        {/* STATS */}
        <Tabs.Screen
          name="stats"
          options={{
            headerTitle: () => (
              <Box alignItems="center">
                <Text fontSize="$md" fontWeight="$semibold">
                  Kenali Cuaca & Rekomendasi
                </Text>
                <Text fontSize="$sm" color="$gray600">
                  Minum
                </Text>
              </Box>
            ),
            headerLeft: () => (
              <HeaderHamburger onPress={() => setDrawerVisible(true)} />
            ),
            headerRight: () => <Box w={40} />,
            tabBarIcon: ({ color }) => <BarChart2 color={color} />,
          }}
        />

        {/* COMMUNITY */}
        <Tabs.Screen
          name="community"
          options={{
            headerTitle: "Komunitas",
            headerLeft: () => (
              <HeaderHamburger onPress={() => setDrawerVisible(true)} />
            ),
            headerRight: () => <Box w={40} />,
            tabBarIcon: ({ color }) => <Users color={color} />,
          }}
        />

        {/* NEWS */}
        <Tabs.Screen
          name="news"
          options={{
            headerTitle: "Berita",
            headerLeft: () => (
              <HeaderHamburger onPress={() => setDrawerVisible(true)} />
            ),
            headerRight: () => <Box w={40} />,
            tabBarIcon: ({ color }) => <Newspaper color={color} />,
          }}
        />

        {/* PROFILE */}
        <Tabs.Screen
          name="profile"
          options={{
            headerTitle: "Account",
            headerLeft: () => (
              <HeaderHamburger onPress={() => setDrawerVisible(true)} />
            ),
            headerRight: () => <Box w={40} />,
            tabBarIcon: ({ color }) => <User color={color} />,
          }}
        />
      </Tabs>
    </>
  );
}
