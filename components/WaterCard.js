import { useEffect, useState, useRef } from "react";
import {
  Box,
  Text,
  Button,
  ButtonText,
  HStack,
  Input,
  InputField,
} from "@gluestack-ui/themed";
import { AnimatedCircularProgress } from "react-native-circular-progress";
import { Droplet, RotateCcw } from "lucide-react-native";

const WaterCard = ({ dailyGoal, onGoalComplete, onDrink }) => {
  const [currentIntake, setCurrentIntake] = useState(0);
  const [drinkAmount, setDrinkAmount] = useState("300");

  const goalReachedRef = useRef(false);

  const percentage = dailyGoal > 0 ? (currentIntake / dailyGoal) * 100 : 0;

  const addWater = () => {
    const amount = parseInt(drinkAmount) || 0;
    if (amount <= 0 || currentIntake >= dailyGoal) return;

    const newAmount = Math.min(currentIntake + amount, dailyGoal);
    setCurrentIntake(newAmount);

    // simpan ke history
    onDrink?.(amount);
  };

  const resetWater = () => {
    setCurrentIntake(0);
    goalReachedRef.current = false;
  };

  useEffect(() => {
    if (
      currentIntake >= dailyGoal &&
      dailyGoal > 0 &&
      !goalReachedRef.current
    ) {
      goalReachedRef.current = true;
      onGoalComplete?.();
    }
  }, [currentIntake, dailyGoal]);

  return (
    <Box
      p="$4"
      bg="$white"
      rounded="$lg"
      m="$2"
      alignItems="center"
      shadow="$2"
    >
      <AnimatedCircularProgress
        size={220}
        width={20}
        fill={percentage}
        tintColor="#3b82f6"
        backgroundColor="#e0e0e0"
        rotation={0}
        lineCap="round"
      >
        {() => (
          <Box alignItems="center">
            <Droplet size={32} color="#3b82f6" />
            <Text fontSize="$4xl" fontWeight="$bold">
              {currentIntake}
            </Text>
            <Text color="$gray500">/ {dailyGoal} mL</Text>
          </Box>
        )}
      </AnimatedCircularProgress>

      {/* INPUT JUMLAH MINUM */}
      <Input mt="$4" w="60%">
        <InputField
          value={drinkAmount}
          onChangeText={setDrinkAmount}
          keyboardType="numeric"
          placeholder="Jumlah (mL)"
          textAlign="center"
        />
      </Input>

      {/* BUTTON AREA */}
      <HStack mt="$4" space="md">
        <Button
          size="lg"
          bg="$blue500"
          rounded="$full"
          onPress={addWater}
          isDisabled={currentIntake >= dailyGoal}
        >
          <ButtonText>Minum</ButtonText>
        </Button>

        <Button
          size="lg"
          variant="outline"
          rounded="$full"
          onPress={resetWater}
          isDisabled={currentIntake === 0}
        >
          <RotateCcw size={18} color="#3b82f6" />
        </Button>
      </HStack>
    </Box>
  );
};

export default WaterCard;
