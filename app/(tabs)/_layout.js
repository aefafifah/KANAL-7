import { useState, useRef } from "react";
import {
  Animated,
  Dimensions,
  TouchableOpacity,
  View,
  StyleSheet,
} from "react-native";
import { Tabs, useRouter } from "expo-router";
import {
  HStack,
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

const { width } = Dimensions.get("window");

// 🔹 Drawer Menu
function DrawerMenu({ visible, onClose, router }) {
  const slideAnim = useRef(new Animated.Value(-width)).current;

  if (visible) {
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  } else {
    Animated.timing(slideAnim, {
      toValue: -width,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }

  return (
    <Animated.View
      style={[
        styles.drawerContainer,
        { transform: [{ translateX: slideAnim }] },
      ]}
    >
      <View style={styles.drawerContent}>
        <Text style={styles.drawerTitle}>Menu</Text>

        {/* Jurnal Water */}
        <TouchableOpacity
          style={styles.drawerButton}
          onPress={() => {
            onClose();
            router.push("/jurnalwater");
          }}
        >
          <Text style={styles.drawerButtonText}>Jurnal Water</Text>
        </TouchableOpacity>

        {/* Challenge Water */}
        <TouchableOpacity
          style={styles.drawerButton}
          onPress={() => {
            onClose();
            router.push("/challengewater");
          }}
        >
          <Text style={styles.drawerButtonText}>Challenge Water</Text>
        </TouchableOpacity>

        {/* 🔥 Sleep Zone Cerdas (FITUR BARU) */}
        <TouchableOpacity
          style={styles.drawerButton}
          onPress={() => {
            onClose();
            router.push("/sleepzone");
          }}
        >
          <Text style={styles.drawerButtonText}>smart sleep zone</Text>
        </TouchableOpacity>

        {/* Streak */}
        <TouchableOpacity
          style={styles.drawerButton}
          onPress={() => {
            onClose();
            router.push("/streak");
          }}
        >
          <Text style={styles.drawerButtonText}>Streak Konsisten</Text>
        </TouchableOpacity>

        {/* Mood Harian */}
        <TouchableOpacity
          style={styles.drawerButton}
          onPress={() => {
            onClose();
            router.push("/moodscreen");
          }}
        >
          <Text style={styles.drawerButtonText}>Daily Mood</Text>
        </TouchableOpacity>

        {/* Target Harian Dinamis */}
        <TouchableOpacity
          style={styles.drawerButton}
          onPress={() => {
            onClose();
            router.push("/targetharian");
          }}
        >
          <Text style={styles.drawerButtonText}>Target Harian Dinamis</Text>
        </TouchableOpacity>

        {/* Export Report */}
        <TouchableOpacity
          style={styles.drawerButton}
          onPress={() => {
            onClose();
            router.push("/exportreport");
          }}
        >
          <Text style={styles.drawerButtonText}>Export Hidrasi Report</Text>
        </TouchableOpacity>


        {/* Hydration Badges */}
        <TouchableOpacity
          style={styles.drawerButton}
          onPress={() => {
            onClose();
            router.push("/hydrationBadges");
          }}
        >
          <Text style={styles.drawerButtonText}>Hydration Badges</Text>
        </TouchableOpacity>


        {/* Close */}
        <TouchableOpacity
          style={[styles.drawerButton, { backgroundColor: "#aaa" }]}
          onPress={onClose}
        >
          <Text style={styles.drawerButtonText}>Close</Text>
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
}

// 🔹 Tombol Hamburger
function HeaderHamburger({ onPress }) {
  return (
    <Pressable onPress={onPress} style={{ marginLeft: 10 }}>
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
      {/* Drawer */}
      <DrawerMenu
        visible={drawerVisible}
        onClose={() => setDrawerVisible(false)}
        router={router}
      />

      {/* TAB BAR */}
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
            headerTitle: "Profile",
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

// 🔹 Styles
const styles = StyleSheet.create({
  drawerContainer: {
    position: "absolute",
    left: 0,
    top: 0,
    bottom: 0,
    width: width * 0.7,
    backgroundColor: "#111",
    zIndex: 999,
    elevation: 10,
  },
  drawerContent: {
    flex: 1,
    paddingTop: 60,
    paddingHorizontal: 20,
  },
  drawerTitle: {
    color: "white",
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 30,
  },
  drawerButton: {
    backgroundColor: "#3b82f6",
    borderRadius: 10,
    paddingVertical: 10,
    marginBottom: 15,
    alignItems: "center",
  },
  drawerButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
});
