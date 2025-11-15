import { useState, useEffect } from "react";
import { Box, Text, Button, ButtonText, HStack } from "@gluestack-ui/themed";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function HydrationBadges() {
  const [microBreaks, setMicroBreaks] = useState(0);
  const [moodLogs, setMoodLogs] = useState(0);
  const [badges, setBadges] = useState([]);

  useEffect(() => {
    loadData();
  }, []);

  // Load data dari AsyncStorage
  const loadData = async () => {
    const m = await AsyncStorage.getItem("microBreaks");
    const ml = await AsyncStorage.getItem("moodLogs");
    const b = await AsyncStorage.getItem("badges");

    setMicroBreaks(m ? parseInt(m) : 0);
    setMoodLogs(ml ? parseInt(ml) : 0);
    setBadges(b ? JSON.parse(b) : []);
  };

  // Simpan data
  const saveAll = async (newMicro, newMood, newBadges) => {
    await AsyncStorage.setItem("microBreaks", String(newMicro));
    await AsyncStorage.setItem("moodLogs", String(newMood));
    await AsyncStorage.setItem("badges", JSON.stringify(newBadges));
  };

  // Tambah micro-break
  const addMicroBreak = async () => {
    const newCount = microBreaks + 1;
    setMicroBreaks(newCount);
    saveAll(newCount, moodLogs, badges);
  };

  // Tambah mood log
  const addMoodLog = async () => {
    const newCount = moodLogs + 1;
    setMoodLogs(newCount);
    saveAll(microBreaks, newCount, badges);
  };

  // Cek apakah ada badge baru yang bisa didapat
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

  // 🔥 RESET BADGE (fitur baru)
  const resetBadges = async () => {
    await AsyncStorage.setItem("microBreaks", "0");
    await AsyncStorage.setItem("moodLogs", "0");
    await AsyncStorage.setItem("badges", JSON.stringify([]));

    setMicroBreaks(0);
    setMoodLogs(0);
    setBadges([]);

    alert("Semua badge dan progress berhasil direset!");
  };

  return (
    <Box flex={1} p="$6">
      <Text fontSize="$3xl" bold mb="$4">
        Badge Pencapaian Hidrasi 🏅
      </Text>

      {/* Progress */}
      <Text mb="$2">Micro-break: {microBreaks}</Text>
      <Text mb="$4">Mood Journal: {moodLogs}</Text>

      {/* Buttons */}
      <HStack space="md" mb="$4">
        <Button onPress={addMicroBreak}>
          <ButtonText>+ Micro Break</ButtonText>
        </Button>

        <Button onPress={addMoodLog}>
          <ButtonText>+ Mood Log</ButtonText>
        </Button>
      </HStack>

      {/* Check Badges */}
      <Button mb="$4" onPress={checkBadges}>
        <ButtonText>Cek Badge Baru</ButtonText>
      </Button>

      {/* RESET BADGE */}
      <Button bgColor="$red500" onPress={resetBadges}>
        <ButtonText>Reset Semua Badge</ButtonText>
      </Button>

      {/* Badge List */}
      <Box mt="$6">
        <Text fontSize="$xl" bold mb="$2">
          Badge yang Sudah Didapat:
        </Text>

        {badges.length === 0 ? (
          <Text>Tidak ada badge.</Text>
        ) : (
          badges.map((b, index) => (
            <Text key={index} fontSize="$lg">• {b}</Text>
          ))
        )}
      </Box>
    </Box>
  );
}
