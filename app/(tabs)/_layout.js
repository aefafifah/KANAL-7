import { Tabs } from "expo-router"; 
import { Avatar, AvatarFallbackText, AvatarImage, HStack, Text } from "@gluestack-ui/themed";
import { Home, Users, Newspaper, BarChart2, User } from "lucide-react-native";

// Komponen avatar untuk header Komunitas
function HeaderAvatar() {
  return (
    <HStack space="sm" alignItems="center" mr="$4">
      <Text color="$gray800" fontWeight="$medium">Mahasiswa</Text>
      <Avatar size="sm" bgColor="$blue500">
        <AvatarFallbackText>K</AvatarFallbackText>
      </Avatar>
    </HStack>
  );
}

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#3b82f6', 
      }}
    >
      {/* 1. Home (Header Tampil) */}
      <Tabs.Screen
        name="home"
        options={{
          headerShown: true, // Header ditampilkan
          headerTitle: "Home", // Judul header
          tabBarIcon: ({ color }) => <Home color={color} />,
        }}
      />
      
      {/* 2. Stats (Header Hilang) */}
      <Tabs.Screen
        name="stats"
        options={{
          headerShown: true, // Header dihilangkan
          headerTitle: "Kenali Cuaca dan Rekomendasi Minummu",
          tabBarIcon: ({ color }) => <BarChart2 color={color} />,
        }}
      />

      {/* 3. Community (Header Kustom) */}
      <Tabs.Screen
        name="community"
        options={{
          headerShown: true, // Header ditampilkan
          headerTitle: "Komunitas", 
          headerRight: () => <HeaderAvatar />, 
          tabBarIcon: ({ color }) => <Users color={color} />,
        }}
      />
      
      {/* 4. News (Header Hilang) */}
      <Tabs.Screen
        name="news"
        options={{
          headerShown: true, // Header dihilangkan
          headerTitle: "Berita",
          tabBarIcon: ({ color }) => <Newspaper color={color} />,
        }}
      />
      
      {/* 5. Profile (Header Hilang) */}
      <Tabs.Screen
        name="profile"
        options={{
          headerShown: true, // Header dihilangkan
          headerTitle: "Profile",
          tabBarIcon: ({ color }) => <User color={color} />,
        }}
      />
    </Tabs>
  );
}