import { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  Box,
  Text,
  Input,
  InputField,
  Button,
  ButtonText,
  VStack,
  HStack,
  Pressable,
  ScrollView,
  Center,
} from "@gluestack-ui/themed";
import { Trash2, Edit3, Moon, Sun } from "lucide-react-native";
import { saveSleepTime, getSleepTime } from "./sleepStore";

/* =====================
  THEME
===================== */
const BG = "#EEF2FF";
const CARD = "#FFFFFF";
const PRIMARY = "#3B82F6";
const MUTED = "#E5E7EB";

const HISTORY_KEY = "sleepzone-history";

export default function SleepZone({
  title = "Smart Sleep Zone",
  buttonLabel = "Simpan Zona Tidur",
}) {
  const [sleepTime, setSleepTime] = useState("");
  const [wakeTime, setWakeTime] = useState("");
  const [isLocked, setIsLocked] = useState(false);
  const [history, setHistory] = useState([]);

  /* =====================
    LOAD DATA
  ===================== */
  useEffect(() => {
    loadCurrent();
    loadHistory();
  }, []);

  const loadCurrent = async () => {
    const data = await getSleepTime();
    if (data) {
      setSleepTime(data.sleepTime);
      setWakeTime(data.wakeTime);
      setIsLocked(true);
    }
  };

  const loadHistory = async () => {
    const json = await AsyncStorage.getItem(HISTORY_KEY);
    setHistory(json ? JSON.parse(json) : []);
  };

  /* =====================
    SAVE
  ===================== */
  const handleSave = async () => {
    if (!sleepTime || !wakeTime) {
      alert("Isi jam tidur dan jam bangun!");
      return;
    }

    await saveSleepTime(sleepTime, wakeTime);

    const newEntry = {
      id: Date.now().toString(),
      sleepTime,
      wakeTime,
      savedAt: new Date().toLocaleString(),
    };

    const newHistory = [newEntry, ...history];
    setHistory(newHistory);
    await AsyncStorage.setItem(
      HISTORY_KEY,
      JSON.stringify(newHistory)
    );

    setIsLocked(true);
  };

  /* =====================
    DELETE HISTORY
  ===================== */
  const deleteHistory = async (id) => {
    const filtered = history.filter((h) => h.id !== id);
    setHistory(filtered);
    await AsyncStorage.setItem(
      HISTORY_KEY,
      JSON.stringify(filtered)
    );
  };

  return (
    <Box flex={1} bg={BG}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          padding: 16,
          paddingBottom: 80,
        }}
      >
        {/* =====================
            HEADER
        ===================== */}
        <Text fontSize="$2xl" fontWeight="$bold" mb="$4">
          {title}
        </Text>

        {/* =====================
            CURRENT ZONE CARD
        ===================== */}
        <Box
          bg={CARD}
          rounded="$2xl"
          p="$6"
          shadow="$2"
          mb="$6"
        >
          <Text fontWeight="$bold" mb="$4">
            Zona Tidur Saat Ini
          </Text>

          <HStack
            justifyContent="space-between"
            alignItems="center"
            mb="$4"
          >
            <HStack space="sm" alignItems="center">
              <Moon size={20} color={PRIMARY} />
              <Text fontWeight="$medium">
                Tidur: {sleepTime || "--:--"}
              </Text>
            </HStack>

            <HStack space="sm" alignItems="center">
              <Sun size={20} color={PRIMARY} />
              <Text fontWeight="$medium">
                Bangun: {wakeTime || "--:--"}
              </Text>
            </HStack>
          </HStack>

          {isLocked ? (
            <Button
              variant="outline"
              borderColor={PRIMARY}
              onPress={() => setIsLocked(false)}
            >
              <Edit3 size={16} color={PRIMARY} />
              <ButtonText ml="$2" color={PRIMARY}>
                Edit Zona Tidur
              </ButtonText>
            </Button>
          ) : (
            <Button bg={PRIMARY} onPress={handleSave}>
              <ButtonText color="$white">
                {buttonLabel}
              </ButtonText>
            </Button>
          )}
        </Box>

        {/* =====================
            INPUT CARD
        ===================== */}
        {!isLocked && (
          <Box
            bg={CARD}
            rounded="$2xl"
            p="$6"
            shadow="$1"
            mb="$6"
          >
            <Text fontWeight="$bold" mb="$3">
              Atur Waktu Tidur
            </Text>

            <Text mb="$1">Jam Tidur</Text>
            <Input mb="$4">
              <InputField
                placeholder="22:00"
                value={sleepTime}
                onChangeText={setSleepTime}
              />
            </Input>

            <Text mb="$1">Jam Bangun</Text>
            <Input>
              <InputField
                placeholder="06:00"
                value={wakeTime}
                onChangeText={setWakeTime}
              />
            </Input>
          </Box>
        )}

        {/* =====================
            HISTORY
        ===================== */}
        <Text fontSize="$lg" fontWeight="$bold" mb="$3">
          Riwayat Zona Tidur
        </Text>

        {history.length === 0 && (
          <Text color="#6B7280">
            Belum ada riwayat.
          </Text>
        )}

        <VStack space="sm">
          {history.map((item) => (
            <Box
              key={item.id}
              bg={CARD}
              p="$4"
              rounded="$xl"
              shadow="$1"
            >
              <HStack
                justifyContent="space-between"
                alignItems="center"
              >
                <VStack>
                  <Text fontWeight="$medium">
                    Tidur {item.sleepTime} • Bangun {item.wakeTime}
                  </Text>
                  <Text fontSize="$xs" color="#6B7280">
                    {item.savedAt}
                  </Text>
                </VStack>

                <Pressable
                  onPress={() => deleteHistory(item.id)}
                >
                  <Trash2 size={18} color="#EF4444" />
                </Pressable>
              </HStack>
            </Box>
          ))}
        </VStack>
      </ScrollView>
    </Box>
  );
}
