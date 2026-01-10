import { useState, useEffect } from "react";
import {
  ScrollView,
  Box,
  Text,
  Button,
  ButtonText,
  HStack,
  VStack,
} from "@gluestack-ui/themed";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Droplet, Award, Smile, Coffee, RefreshCcw } from "lucide-react-native";

const PRIMARY = "#2563EB";
const SOFT_BG = "#EEF2FF";

export default function HydrationBadges({
  title = "Badge Pencapaian Hidrasi",
  microBreakLabel = "Micro-break",
  moodLabel = "Mood Journal",
}) {
  const [microBreaks, setMicroBreaks] = useState(0);
  const [moodLogs, setMoodLogs] = useState(0);
  const [badges, setBadges] = useState([]);

  useEffect(() => {
    loadData();
  }, []);

  // ===== LOGIKA ASLI (TIDAK DIUBAH) =====
  const loadData = async () => {
    const m = await AsyncStorage.getItem("microBreaks");
    const ml = await AsyncStorage.getItem("moodLogs");
    const b = await AsyncStorage.getItem("badges");

    setMicroBreaks(m ? parseInt(m) : 0);
    setMoodLogs(ml ? parseInt(ml) : 0);
    setBadges(b ? JSON.parse(b) : []);
  };

  const saveAll = async (newMicro, newMood, newBadges) => {
    await AsyncStorage.setItem("microBreaks", String(newMicro));
    await AsyncStorage.setItem("moodLogs", String(newMood));
    await AsyncStorage.setItem("badges", JSON.stringify(newBadges));
  };

  const addMicroBreak = async () => {
    const newCount = microBreaks + 1;
    setMicroBreaks(newCount);
    saveAll(newCount, moodLogs, badges);
  };

  const addMoodLog = async () => {
    const newCount = moodLogs + 1;
    setMoodLogs(newCount);
    saveAll(microBreaks, newCount, badges);
  };

  const checkBadges = async () => {
    let newBadges = [...badges];

    if (microBreaks >= 5 && !newBadges.includes("Pemula Sehat")) {
      newBadges.push("Pemula Sehat");
      alert("Selamat! Anda mendapat badge: Pemula Sehat 🟢");
    }

    if (microBreaks >= 15 && !newBadges.includes("Master Micro-Break")) {
      newBadges.push("Master Micro-Break");
      alert("Selamat! Anda mendapat badge: Master Micro-Break 🟢");
    }

    if (moodLogs >= 7 && !newBadges.includes("Mood Warrior")) {
      newBadges.push("Mood Warrior");
      alert("Selamat! Anda mendapat badge: Mood Warrior 🟢");
    }

    if (
      microBreaks >= 20 &&
      moodLogs >= 14 &&
      !newBadges.includes("Hydration Legend")
    ) {
      newBadges.push("Hydration Legend");
      alert("🏆 Anda menjadi Hydration Legend!");
    }

    setBadges(newBadges);
    saveAll(microBreaks, moodLogs, newBadges);
  };

  const resetBadges = async () => {
    await AsyncStorage.setItem("microBreaks", "0");
    await AsyncStorage.setItem("moodLogs", "0");
    await AsyncStorage.setItem("badges", JSON.stringify([]));

    setMicroBreaks(0);
    setMoodLogs(0);
    setBadges([]);

    alert("Semua badge dan progress berhasil direset!");
  };
  // ===== END LOGIKA =====

  return (
    <ScrollView flex={1} bg={SOFT_BG}>
      <VStack space="lg" p="$4">

        {/* ===== HEADER ===== */}
        <Box alignItems="center">
          <Box bg="#DBEAFE" p="$3" rounded="$full" mb="$2">
            <Award size={28} color={PRIMARY} />
          </Box>
          <Text fontSize="$2xl" fontWeight="$bold" color="#1E293B">
            {title}
          </Text>
          <Text color="#64748B" textAlign="center">
            Kumpulkan badge dari kebiasaan sehatmu
          </Text>
        </Box>

        {/* ===== PROGRESS CARD ===== */}
        <Box bg="$white" p="$4" rounded="$2xl" shadow="$1">
          <HStack justifyContent="space-between">
            <HStack space="sm" alignItems="center">
              <Coffee size={18} color={PRIMARY} />
              <VStack>
                <Text fontSize="$sm" color="#64748B">
                  {microBreakLabel}
                </Text>
                <Text fontWeight="$bold">{microBreaks}</Text>
              </VStack>
            </HStack>

            <HStack space="sm" alignItems="center">
              <Smile size={18} color="#FACC15" />
              <VStack>
                <Text fontSize="$sm" color="#64748B">
                  {moodLabel}
                </Text>
                <Text fontWeight="$bold">{moodLogs}</Text>
              </VStack>
            </HStack>
          </HStack>
        </Box>

        {/* ===== ACTION BUTTONS ===== */}
        <Box bg="$white" p="$4" rounded="$2xl" shadow="$1">
          <VStack space="sm">
            <HStack space="sm">
              <Button flex={1} bg={PRIMARY} onPress={addMicroBreak}>
                <ButtonText>+ Micro Break</ButtonText>
              </Button>
              <Button flex={1} bg={PRIMARY} onPress={addMoodLog}>
                <ButtonText>+ Mood Log</ButtonText>
              </Button>
            </HStack>

            <Button variant="outline" onPress={checkBadges}>
              <ButtonText>Cek Badge Baru</ButtonText>
            </Button>

            <Button bg="#EF4444" onPress={resetBadges}>
              <HStack space="xs" alignItems="center">
                <RefreshCcw size={14} color="white" />
                <ButtonText>Reset Semua Badge</ButtonText>
              </HStack>
            </Button>
          </VStack>
        </Box>

        {/* ===== BADGE LIST ===== */}
        <Box bg="$white" p="$4" rounded="$2xl" shadow="$1">
          <Text fontSize="$lg" fontWeight="$bold" mb="$2">
            Badge yang Sudah Didapat
          </Text>

          {badges.length === 0 ? (
            <Text color="#64748B">Belum ada badge.</Text>
          ) : (
            <VStack space="sm">
              {badges.map((b, index) => (
                <HStack
                  key={index}
                  space="sm"
                  alignItems="center"
                  bg="#F8FAFC"
                  p="$3"
                  rounded="$lg"
                >
                  <Droplet size={16} color={PRIMARY} />
                  <Text fontWeight="$medium">{b}</Text>
                </HStack>
              ))}
            </VStack>
          )}
        </Box>

      </VStack>
    </ScrollView>
  );
}
