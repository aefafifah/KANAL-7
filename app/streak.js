// app/streak.js
import { useEffect, useState } from "react";
import { Image } from "react-native";
import {
  Box,
  Text,
  ScrollView,
  HStack,
  VStack,
} from "@gluestack-ui/themed";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function StreakScreen({
  totalLevels = 15,
  iconBig = "https://cdn-icons-png.flaticon.com/256/8722/8722283.png",
  iconSmall = "https://cdn-icons-png.flaticon.com/256/8722/8722283.png",
  iconLocked = "https://cdn-icons-png.flaticon.com/512/61/61457.png",
  headerColor = "#3BA3FF",
  backgroundColor = "#E7F2FF",
}) {
  const [level, setLevel] = useState(1);

  // AUTO CALCULATE STREAK
  const calculateStreak = async () => {
    const today = new Date().toDateString();
    const savedLevel = await AsyncStorage.getItem("streak-level");
    const savedDate = await AsyncStorage.getItem("streak-date");

    let currentLevel = savedLevel ? parseInt(savedLevel) : 1;

    if (!savedDate) {
      await AsyncStorage.setItem("streak-level", "1");
      await AsyncStorage.setItem("streak-date", today);
      setLevel(1);
      return;
    }

    const lastDate = new Date(savedDate);
    const now = new Date(today);

    const diffDays = Math.floor(
      (now - lastDate) / (1000 * 60 * 60 * 24)
    );

    if (diffDays === 1) {
      currentLevel = currentLevel + 1;
    } else if (diffDays > 1) {
      currentLevel = 1;
    }

    await AsyncStorage.setItem("streak-level", currentLevel.toString());
    await AsyncStorage.setItem("streak-date", today);

    setLevel(currentLevel);
  };

  useEffect(() => {
    calculateStreak();
  }, []);

  const streakLevels = Array.from({ length: totalLevels }).map((_, i) => {
    const lvl = i + 1;
    return {
      level: lvl,
      unlocked: lvl <= level,
      requirement: `Keep a ${lvl}-day streak!`,
    };
  });

  return (
    <Box flex={1} bg={backgroundColor}>
      {/* BLUE HEADER */}
      <Box
        h={260}
        bg={headerColor}
        pb="$6"
        alignItems="center"
        justifyContent="flex-end"
        borderBottomLeftRadius={32}
        borderBottomRightRadius={32}
      >
        {/* BIG MEDAL ICON */}
        <Image
          source={{ uri: iconBig }}
          style={{ width: 160, height: 160, marginBottom: 10 }}
          resizeMode="contain"
        />

        <Text fontSize="$2xl" color="white" fontWeight="bold">
          Streak Level {level}
        </Text>

        <Text color="white">
          You've maintained {level}-day consistency!
        </Text>
      </Box>

      {/* WHITE CONTENT */}
      <Box flex={1} mt={-20} bg="white" roundedTop="$3xl" p="$4">
        <Text fontWeight="bold" fontSize="$lg" mb="$4">
          Your Streak Progress
        </Text>

        <ScrollView showsVerticalScrollIndicator={false}>
          <HStack flexWrap="wrap" justifyContent="space-between">
            {streakLevels.map((item, index) => (
              <VStack
                key={index}
                w="30%"
                mb="$6"
                alignItems="center"
              >
                <Image
                  source={{
                    uri: item.unlocked ? iconSmall : iconLocked,
                  }}
                  style={{ width: 70, height: 70, marginBottom: 8 }}
                  resizeMode="contain"
                />

                <Text
                  fontWeight="bold"
                  fontSize="$sm"
                  textAlign="center"
                  color={item.unlocked ? "#1E1E1E" : "#A0A0A0"}
                >
                  Level {item.level}
                </Text>

                <Text
                  fontSize="$xs"
                  textAlign="center"
                  color={item.unlocked ? "#4A4A4A" : "#C0C0C0"}
                >
                  {item.unlocked
                    ? item.level === level
                      ? "Your current streak level"
                      : "Unlocked"
                    : item.requirement}
                </Text>
              </VStack>
            ))}
          </HStack>
        </ScrollView>
      </Box>
    </Box>
  );
}
