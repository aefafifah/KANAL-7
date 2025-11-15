import { useState } from "react";
import {
  ScrollView,
  Box,
  Text,
  Input,
  InputField,
  HStack,
  Pressable,
  Button,
  ButtonIcon,
} from "@gluestack-ui/themed";
import AsyncStorage from "@react-native-async-storage/async-storage";

import WaterCard from "../../components/WaterCard";
import { ArrowRight, Droplet, Lock, Unlock } from "lucide-react-native";

const HomeScreen = () => {
  const [inputGoal, setInputGoal] = useState("2500");
  const [lockedGoal, setLockedGoal] = useState(2500);
  const [isLocked, setIsLocked] = useState(true);

  // 🔥 Update streak ketika target minum tercapai
  const updateStreak = async () => {
    const today = new Date().toDateString();

    const savedLevel = await AsyncStorage.getItem("streak-level");
    const savedDate = await AsyncStorage.getItem("streak-date");

    let currentLevel = savedLevel ? parseInt(savedLevel) : 1;

    if (!savedDate) {
      await AsyncStorage.setItem("streak-level", "1");
      await AsyncStorage.setItem("streak-date", today);
      console.log("🔥 Streak Diset ke level 1");
      return;
    }

    const lastDate = new Date(savedDate);
    const now = new Date(today);

    const diff = Math.floor((now - lastDate) / (1000 * 60 * 60 * 24));

    if (diff === 0) {
      console.log("⚠️ Hari yang sama → streak tidak naik");
      return;
    }

    if (diff === 1) {
      currentLevel += 1; // naik 1 level
    } else if (diff > 1) {
      currentLevel = 1; // putus → ulang dari 1
    }

    await AsyncStorage.setItem("streak-level", currentLevel.toString());
    await AsyncStorage.setItem("streak-date", today);

    console.log("🔥 STREAK LEVEL UPDATED →", currentLevel);
  };


  // Lock/unlock input target minum
  const handleLockToggle = () => {
    if (isLocked) {
      setIsLocked(false);
    } else {
      const newGoal = parseInt(inputGoal) || 2500;
      setInputGoal(String(newGoal));
      setLockedGoal(newGoal);
      setIsLocked(true);
    }
  };

  return (
    <ScrollView flex={1} bg="$gray50">
      {/* 🔵 WATER CARD */}
      <WaterCard dailyGoal={lockedGoal} onGoalComplete={updateStreak} />

      {/* 🔵 Target Harian */}
      <Box bg="$white" p="$4" rounded="$lg" m="$2" shadow="$1">
        <Text fontSize="$lg" mb="$2">
          Target Harian Anda (mL)
        </Text>

        <HStack space="md" alignItems="center">
          <Input variant="outline" size="md" flex={1} isDisabled={isLocked}>
            <InputField
              placeholder="Masukkan target..."
              value={inputGoal}
              onChangeText={setInputGoal}
              keyboardType="numeric"
            />
          </Input>

          <Button
            size="lg"
            action={isLocked ? "secondary" : "primary"}
            variant="solid"
            onPress={handleLockToggle}
          >
            <ButtonIcon as={isLocked ? Lock : Unlock} />
          </Button>
        </HStack>
      </Box>

      {/* 🔵 History */}
      <Box bg="$white" rounded="$lg" m="$2" shadow="$1">
        <HStack justifyContent="space-between" alignItems="center" p="$4">
          <Text fontSize="$xl" fontWeight="$bold">
            History
          </Text>
          <Pressable onPress={() => alert("Buka halaman history…")}>
            <HStack alignItems="center" space="xs">
              <Text color="$blue500">View All</Text>
              <ArrowRight size={16} color="$blue500" />
            </HStack>
          </Pressable>
        </HStack>

        <Box px="$4" pb="$4" pt="$0" alignItems="center">
          <Droplet size={40} color="$gray300" />
          <Text mt="$2" color="$gray500" textAlign="center">
            You have no history of water intake today.
          </Text>
        </Box>
      </Box>

      <Box h="$10" />
    </ScrollView>
  );
};

export default HomeScreen;
