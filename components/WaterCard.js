import { useState } from "react";
import { Box, Text, Button, ButtonText } from "@gluestack-ui/themed"; 
import { AnimatedCircularProgress } from "react-native-circular-progress";
import { Droplet } from "lucide-react-native";

const WaterCard = ({ dailyGoal = 2500 }) => {
  const [currentIntake, setCurrentIntake] = useState(0); 
  const drinkAmount = 300; 

  const addWater = () => {
    setCurrentIntake(prev => Math.min(prev + drinkAmount, dailyGoal));
  };
  
  // --- INI BARIS YANG DIPERBAIKI ---
  // Kita cek dulu apakah dailyGoal > 0 sebelum melakukan pembagian
  const percentage = (dailyGoal > 0) ? (currentIntake / dailyGoal) * 100 : 0;
  // ---

  return (
    <Box p="$4" bg="$white" rounded="$lg" m="$2" alignItems="center" shadow="$2">
      
      {/* --- Bagian Lingkaran Progres --- */}
      <AnimatedCircularProgress
        size={220} 
        width={20} 
        fill={percentage} // Sekarang aman dari nilai 'Infinity'
        tintColor="#3b82f6" 
        backgroundColor="#e0e0e0" 
        rotation={0} 
        lineCap="round"
      >
        {
          (fill) => (
            <Box alignItems="center" justifyContent="center">
              <Droplet size={32} color="#3b82f6" />
              <Text fontSize="$4xl" fontWeight="$bold" mt="$2">
                {currentIntake}
              </Text>
              <Text fontSize="$md" color="$gray500">
                / {dailyGoal} mL
              </Text>
            </Box>
          )
        }
      </AnimatedCircularProgress>

      {/* --- Tombol Minum (Center) --- */}
      <Button 
        mt="$6" 
        size="lg" 
        bg="$blue500" 
        rounded="$full"
        onPress={addWater}
        // Tombol juga akan non-aktif jika goal-nya 0
        isDisabled={currentIntake >= dailyGoal || dailyGoal === 0} 
      >
        <ButtonText>
          {currentIntake >= dailyGoal ? "Target Tercapai!" : `Minum (${drinkAmount} mL)`}
        </ButtonText>
      </Button>

    </Box>
  );
};

export default WaterCard;