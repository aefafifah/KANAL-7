import { Tabs } from "expo-router/tabs";
import { Text } from "@gluestack-ui/themed";
import Ionicons from "@expo/vector-icons/Ionicons";

const noHead = { headerShown: false };

const TabsLayout = () => {
  return (
    <Tabs
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color }) => {
          let icon;
          switch (route.name) {
            case "home":
              icon = "water-outline";
              break;
            case "stats":
              icon = "stats-chart-outline";
              break;
            case "community":
              icon = "people-outline";
              break;
            case "news":
              icon = "newspaper-outline";
              break;
            case "profile":
              icon = "person-circle-outline";
              break;
          }
          return <Ionicons name={icon} size={26} color={focused ? "blue" : color} />;
        },
        tabBarLabel: ({ children, color, focused }) => (
          <Text mb="$1" color={focused ? "$blue600" : color}>
            {children}
          </Text>
        ),
      })}
    >
      <Tabs.Screen name="home" options={{ title: "Home", ...noHead }} />
      <Tabs.Screen name="stats" options={{ title: "Statistik", ...noHead }} />
      <Tabs.Screen name="community" options={{ title: "Komunitas", ...noHead }} />
      <Tabs.Screen name="news" options={{ title: "Berita", ...noHead }} />
      <Tabs.Screen name="profile" options={{ title: "Profil", ...noHead }} />
    </Tabs>
  );
};

export default TabsLayout;
