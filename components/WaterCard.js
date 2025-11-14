// // import { useState } from "react";
// // import { Box, Text, Button, ButtonText } from "@gluestack-ui/themed"; 
// // import { AnimatedCircularProgress } from "react-native-circular-progress";
// // import { Droplet } from "lucide-react-native";

// // const WaterCard = ({ dailyGoal = 2500 }) => {
// //   const [currentIntake, setCurrentIntake] = useState(0); 
// //   const drinkAmount = 300; 

// //   const addWater = () => {
// //     setCurrentIntake(prev => Math.min(prev + drinkAmount, dailyGoal));
// //   };

// //   // --- INI BARIS YANG DIPERBAIKI ---
// //   // Kita cek dulu apakah dailyGoal > 0 sebelum melakukan pembagian
// //   const percentage = (dailyGoal > 0) ? (currentIntake / dailyGoal) * 100 : 0;
// //   // ---

// //   return (
// //     <Box p="$4" bg="$white" rounded="$lg" m="$2" alignItems="center" shadow="$2">

// //       {/* --- Bagian Lingkaran Progres --- */}
// //       <AnimatedCircularProgress
// //         size={220} 
// //         width={20} 
// //         fill={percentage} // Sekarang aman dari nilai 'Infinity'
// //         tintColor="#3b82f6" 
// //         backgroundColor="#e0e0e0" 
// //         rotation={0} 
// //         lineCap="round"
// //       >
// //         {
// //           (fill) => (
// //             <Box alignItems="center" justifyContent="center">
// //               <Droplet size={32} color="#3b82f6" />
// //               <Text fontSize="$4xl" fontWeight="$bold" mt="$2">
// //                 {currentIntake}
// //               </Text>
// //               <Text fontSize="$md" color="$gray500">
// //                 / {dailyGoal} mL
// //               </Text>
// //             </Box>
// //           )
// //         }
// //       </AnimatedCircularProgress>

// //       {/* --- Tombol Minum (Center) --- */}
// //       <Button 
// //         mt="$6" 
// //         size="lg" 
// //         bg="$blue500" 
// //         rounded="$full"
// //         onPress={addWater}
// //         // Tombol juga akan non-aktif jika goal-nya 0
// //         isDisabled={currentIntake >= dailyGoal || dailyGoal === 0} 
// //       >
// //         <ButtonText>
// //           {currentIntake >= dailyGoal ? "Target Tercapai!" : `Minum (${drinkAmount} mL)`}
// //         </ButtonText>
// //       </Button>

// //     </Box>
// //   );
// // };

// // export default WaterCard;

// import { useState, useEffect } from "react";
// import { Box, Text, Button, ButtonText } from "@gluestack-ui/themed";
// import { AnimatedCircularProgress } from "react-native-circular-progress";
// import { Droplet } from "lucide-react-native";
// import AsyncStorage from "@react-native-async-storage/async-storage";

// const WaterCard = ({ dailyGoal = 2500 }) => {
//   const [currentIntake, setCurrentIntake] = useState(0);

//   const drinkAmount = 300;

//   // ---------------------------------------------
//   // 🔥 Fungsi update streak otomatis
//   // ---------------------------------------------
//   const updateStreak = async () => {
//     const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD

//     const lastDate = await AsyncStorage.getItem("streak-last-date");
//     const currentStreak = parseInt(await AsyncStorage.getItem("streak-count")) || 0;

//     if (!lastDate) {
//       await AsyncStorage.setItem("streak-last-date", today);
//       await AsyncStorage.setItem("streak-count", "1");
//       await AsyncStorage.setItem("streak-level", "1");
//       return;
//     }

//     const last = new Date(lastDate);
//     const diff = (new Date(today) - last) / (1000 * 3600 * 24);

//     let newStreak = currentStreak;

//     if (diff === 1) {
//       newStreak = currentStreak + 1;
//     } else if (diff > 1) {
//       newStreak = 1;
//     }

//     await AsyncStorage.setItem("streak-count", String(newStreak));
//     await AsyncStorage.setItem("streak-last-date", today);

//     // Level naik tiap 3 hari (bisa diganti bebas)
//     const newLevel = Math.min(15, Math.ceil(newStreak / 3));
//     await AsyncStorage.setItem("streak-level", String(newLevel));
//   };

//   // ---------------------------------------------
//   // 🔥 Tambahkan logika ini di addWater()
//   // ---------------------------------------------
//   const addWater = async () => {
//     setCurrentIntake(prev => {
//       const updated = Math.min(prev + drinkAmount, dailyGoal);

//       // Jika baru MENCAPAI TARGET → update streak
//       if (updated >= dailyGoal && prev < dailyGoal) {
//         updateStreak();
//       }

//       return updated;
//     });
//   };

//   const percentage = (dailyGoal > 0) ? (currentIntake / dailyGoal) * 100 : 0;

//   return (
//     <Box p="$4" bg="$white" rounded="$lg" m="$2" alignItems="center" shadow="$2">

//       <AnimatedCircularProgress
//         size={220}
//         width={20}
//         fill={percentage}
//         tintColor="#3b82f6"
//         backgroundColor="#e0e0e0"
//         rotation={0}
//         lineCap="round"
//       >
//         {
//           () => (
//             <Box alignItems="center" justifyContent="center">
//               <Droplet size={32} color="#3b82f6" />
//               <Text fontSize="$4xl" fontWeight="$bold" mt="$2">
//                 {currentIntake}
//               </Text>
//               <Text fontSize="$md" color="$gray500">
//                 / {dailyGoal} mL
//               </Text>
//             </Box>
//           )
//         }
//       </AnimatedCircularProgress>

//       <Button
//         mt="$6"
//         size="lg"
//         bg="$blue500"
//         rounded="$full"
//         onPress={addWater}
//         isDisabled={currentIntake >= dailyGoal || dailyGoal === 0}
//       >
//         <ButtonText>
//           {currentIntake >= dailyGoal ? "Target Tercapai!" : `Minum (${drinkAmount} mL)`}
//         </ButtonText>
//       </Button>
//     </Box>
//   );
// };

// export default WaterCard;

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
