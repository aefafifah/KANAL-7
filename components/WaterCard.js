import { useEffect, useState } from "react";
import { Box, Text, Button, ButtonText } from "@gluestack-ui/themed";
import { AnimatedCircularProgress } from "react-native-circular-progress";
import { Droplet } from "lucide-react-native";

const WaterCard = ({ dailyGoal, onGoalComplete }) => {
  const [currentIntake, setCurrentIntake] = useState(0);
  const drinkAmount = 300;

  // Hitung persentase
  const percentage = dailyGoal > 0 ? (currentIntake / dailyGoal) * 100 : 0;

  // Tambah air minum
  const addWater = () => {
    const newAmount = Math.min(currentIntake + drinkAmount, dailyGoal);
    setCurrentIntake(newAmount);
  };

  // Cek apakah goal sudah tercapai → kirim callback ke HomeScreen
  useEffect(() => {
    if (currentIntake >= dailyGoal && dailyGoal > 0) {
      onGoalComplete(); // 🔥 INI MEMANGGIL UPDATE STREAK
    }
  }, [currentIntake]);

  return (
    <Box p="$4" bg="$white" rounded="$lg" m="$2" alignItems="center" shadow="$2">
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
          <Box alignItems="center" justifyContent="center">
            <Droplet size={32} color="#3b82f6" />
            <Text fontSize="$4xl" fontWeight="$bold" mt="$2">
              {currentIntake}
            </Text>
            <Text fontSize="$md" color="$gray500">
              / {dailyGoal} mL
            </Text>
          </Box>
        )}
      </AnimatedCircularProgress>

      <Button
        mt="$6"
        size="lg"
        bg="$blue500"
        rounded="$full"
        onPress={addWater}
        isDisabled={currentIntake >= dailyGoal}
      >
        <ButtonText>
          {currentIntake >= dailyGoal
            ? "Target Tercapai!"
            : `Minum (${drinkAmount} mL)`}
        </ButtonText>
      </Button>
    </Box>
  );
};

export default WaterCard;
