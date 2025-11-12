import { useState } from "react";
import { 
  ScrollView, Box, Text, Input, InputField, HStack, Pressable, 
  Button, ButtonText, ButtonIcon 
} from "@gluestack-ui/themed"; 
import WaterCard from "../../components/WaterCard"; 
import { ArrowRight, Droplet, Lock, Unlock } from "lucide-react-native"; 

const HomeScreen = () => {
  const [inputGoal, setInputGoal] = useState('2500'); 
  const [lockedGoal, setLockedGoal] = useState(2500);
  const [isLocked, setIsLocked] = useState(true);

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
      
      <WaterCard dailyGoal={lockedGoal} /> 

      <Box bg="$white" p="$4" rounded="$lg" m="$2" shadow="$1">
        <Text fontSize="$lg" mb="$2">Target Harian Anda (mL)</Text>
        
        <HStack space="md" alignItems="center">
          <Input variant="outline" size="md" flex={1} isDisabled={isLocked}>
            <InputField 
              placeholder="Masukkan target..."
              value={inputGoal}
              onChangeText={setInputGoal} 
              keyboardType="numeric" 
            />
          </Input>

          {/* --- INI TOMBOL YANG DIUBAH --- */}
          <Button 
            size="lg"
            // Ganti 'positive' (hijau) menjadi 'primary' (biru)
            action={isLocked ? "secondary" : "primary"} 
            variant="solid"
            onPress={handleLockToggle}
          >
            <ButtonIcon as={isLocked ? Lock : Unlock} />
          </Button>
        </HStack>
      </Box>

      {/* 3. Struktur History */}
      <Box bg="$white" rounded="$lg" m="$2" shadow="$1">
        <HStack justifyContent="space-between" alignItems="center" p="$4">
          <Text fontSize="$xl" fontWeight="$bold">History</Text>
          <Pressable onPress={() => alert('Buka Halaman History...')} >
            <HStack alignItems="center" space="xs"> 
              <Text color="$blue500" fontSize="$md">View All</Text>
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