import { useState } from "react";
import { Box, Text, Button, ButtonText } from "@gluestack-ui/themed";
import { AnimatedCircularProgress } from "react-native-circular-progress";
import { Droplet } from "lucide-react-native";

// Komponen baru kita, sekarang lebih canggih
const WaterCard = () => {
  // Kita ubah state dari 'gelas' ke 'mL' agar sesuai referensi Dribbble
  const [count, setCount] = useState(0); // Dimulai dari 0 mL
  const goal = 2500; // Target harian 2500 mL
  const drinkAmount = 300; // Jumlah sekali minum

  // Fungsi untuk menambah air
  const addWater = () => {
    // Jangan biarkan melebihi goal
    setCount(Math.min(count + drinkAmount, goal));
  };

  // Menghitung persentase untuk lingkaran progres
  const percentage = (count / goal) * 100;

  return (
    <Box p="$4" bg="$white" rounded="$lg" m="$2" alignItems="center" shadow="$2">
      
      {/* --- Bagian Lingkaran Progres --- */}
      <AnimatedCircularProgress
        size={220} // Ukuran lingkaran
        width={20} // Lebar garis lingkaran
        fill={percentage} // Persentase progres
        tintColor="#3b82f6" // Warna biru progres
        backgroundColor="#e0e0e0" // Warna abu-abu background
        rotation={0} // Memulai dari atas
        lineCap="round"
      >
        {
          (fill) => (
            // --- Konten di Tengah Lingkaran ---
            <Box alignItems="center" justifyContent="center">
              <Droplet size={32} color="#3b82f6" />
              <Text fontSize="$4xl" fontWeight="$bold" mt="$2">
                {count}
              </Text>
              <Text fontSize="$md" color="$gray500">
                / {goal} mL
              </Text>
            </Box>
          )
        }
      </AnimatedCircularProgress>

      {/* --- Tombol Minum --- */}
      <Button 
        mt="$6" 
        size="lg" 
        bg="$blue500" 
        rounded="$full"
        onPress={addWater}
        // Tombol akan non-aktif jika sudah mencapai goal
        isDisabled={count >= goal} 
      >
        <ButtonText>
          {count >= goal ? "Target Tercapai!" : `Minum (${drinkAmount} mL)`}
        </ButtonText>
      </Button>

    </Box>
  );
};

export default WaterCard;