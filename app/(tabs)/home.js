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
  VStack,
} from "@gluestack-ui/themed";
import AsyncStorage from "@react-native-async-storage/async-storage";

import WaterCard from "../../components/WaterCard";
import { ArrowRight, Droplet, Lock, Unlock } from "lucide-react-native";

const PRIMARY = "#2563EB";
const SOFT_BG = "#EEF2FF";

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
      return;
    }

    const lastDate = new Date(savedDate);
    const now = new Date(today);
    const diff = Math.floor((now - lastDate) / (1000 * 60 * 60 * 24));

    if (diff === 1) currentLevel += 1;
    if (diff > 1) currentLevel = 1;

    await AsyncStorage.setItem("streak-level", currentLevel.toString());
    await AsyncStorage.setItem("streak-date", today);
  };

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
    <ScrollView flex={1} bg={SOFT_BG}>
      <VStack space="lg" p="$4">

        {/* ===== WATER CARD ===== */}
        <WaterCard dailyGoal={lockedGoal} onGoalComplete={updateStreak} />

        {/* ===== TARGET CARD ===== */}
        <Box bg="$white" p="$4" rounded="$2xl" shadow="$1">
          <Text fontSize="$lg" fontWeight="$bold" mb="$3" color="#1E293B">
            Target Harian (mL)
          </Text>

          <HStack space="md" alignItems="center">
            <Input flex={1} isDisabled={isLocked}>
              <InputField
                placeholder="2500"
                value={inputGoal}
                onChangeText={setInputGoal}
                keyboardType="numeric"
              />
            </Input>

            <Button
              bg={isLocked ? "#DBEAFE" : PRIMARY}
              onPress={handleLockToggle}
            >
              <ButtonIcon
                as={isLocked ? Lock : Unlock}
                color={isLocked ? PRIMARY : "white"}
              />
            </Button>
          </HStack>
        </Box>

        {/* ===== HISTORY ===== */}
        <Box bg="$white" rounded="$2xl" shadow="$1">
          <HStack justifyContent="space-between" alignItems="center" p="$4">
            <Text fontSize="$lg" fontWeight="$bold" color="#1E293B">
              History
            </Text>

            <Pressable>
              <HStack alignItems="center" space="xs">
                <Text color={PRIMARY}>View All</Text>
                <ArrowRight size={16} color={PRIMARY} />
              </HStack>
            </Pressable>
          </HStack>

          <Box alignItems="center" py="$6">
            <Box bg="#DBEAFE" p="$4" rounded="$full">
              <Droplet size={32} color={PRIMARY} />
            </Box>

            <Text mt="$3" color="#64748B" textAlign="center">
              You have no history of water intake today.
            </Text>
          </Box>
        </Box>

        <Box h="$6" />
      </VStack>
    </ScrollView>
  );
};

export default HomeScreen;
