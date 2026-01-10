import { useEffect, useState } from "react";
import {
  ScrollView,
  Box,
  Text,
  HStack,
  VStack,
  Pressable,
  Button,
  Input,
  InputField,
} from "@gluestack-ui/themed";
import { Trash2, Pencil } from "lucide-react-native";
import { LineChart } from "react-native-chart-kit";
import { Dimensions } from "react-native";
import {
  deleteWaterEntry,
  listenWaterEntriesByDate,
  updateWaterEntry,
} from "../src/actions/waterActions";

const PRIMARY = "#2563EB";
const SOFT_BG = "#EEF2FF";
const screenWidth = Dimensions.get("window").width;

// helper tanggal
const getTodayKey = () => {
  const today = new Date();
  return today.toISOString().split("T")[0];
};

const JournalWater = () => {
  const [history, setHistory] = useState([]);
  const [editId, setEditId] = useState(null);
  const [editValue, setEditValue] = useState("");

  useEffect(() => {
    let unsubscribe = () => {};
    let isMounted = true;

    (async () => {
      unsubscribe = await listenWaterEntriesByDate(getTodayKey(), (entries) => {
        if (isMounted) setHistory(entries);
      });
    })();

    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, []);

  // hapus history
  const deleteHistory = async (entryId) => {
    await deleteWaterEntry(getTodayKey(), entryId);
  };

  // simpan edit
  const saveEdit = async () => {
    if (!editId) return;
    await updateWaterEntry(getTodayKey(), editId, {
      amount: parseInt(editValue),
    });
    setEditId(null);
    setEditValue("");
  };

  // data grafik
  const chartData = {
    labels: history
      .slice()
      .reverse()
      .map((item) => item.time),
    datasets: [
      {
        data: history.slice().reverse().map((item) => item.amount),
      },
    ],
  };

  return (
    <ScrollView flex={1} bg={SOFT_BG}>
      <VStack space="lg" p="$4">

        {/* ===== HEADER ===== */}
        <Text fontSize="$2xl" fontWeight="$bold" color="#1E293B">
          History Minum Hari Ini
        </Text>

        {/* ===== CHART ===== */}
        {history.length > 0 && (
          <Box bg="$white" rounded="$2xl" p="$4" shadow="$1">
            <Text fontWeight="$bold" mb="$2">
              Grafik Konsumsi Air
            </Text>
            <LineChart
              data={chartData}
              width={screenWidth - 32}
              height={220}
              chartConfig={{
                backgroundGradientFrom: "#ffffff",
                backgroundGradientTo: "#ffffff",
                color: () => PRIMARY,
                labelColor: () => "#64748B",
              }}
              bezier
              style={{ borderRadius: 16 }}
            />
          </Box>
        )}

        {/* ===== HISTORY LIST ===== */}
        <Box bg="$white" rounded="$2xl" shadow="$1">
          <VStack space="sm" p="$4">
            {history.length === 0 && (
              <Text color="#64748B" textAlign="center">
                Tidak ada history minum hari ini.
              </Text>
            )}

            {history.map((item) => (
              <Box
                key={item.id}
                bg="#F8FAFC"
                p="$3"
                rounded="$lg"
              >
                {editId === item.id ? (
                  <HStack space="sm" alignItems="center">
                    <Input flex={1}>
                      <InputField
                        value={editValue}
                        onChangeText={setEditValue}
                        keyboardType="numeric"
                        placeholder="Jumlah (mL)"
                      />
                    </Input>
                    <Button size="sm" bg={PRIMARY} onPress={saveEdit}>
                      <Text color="$white">Save</Text>
                    </Button>
                  </HStack>
                ) : (
                  <HStack justifyContent="space-between" alignItems="center">
                    <VStack>
                      <Text fontWeight="$bold">{item.amount} ml</Text>
                      <Text color="#64748B">{item.time}</Text>
                    </VStack>

                    <HStack space="sm">
                      <Pressable
                        onPress={() => {
                          setEditId(item.id);
                          setEditValue(String(item.amount));
                        }}
                      >
                        <Pencil size={18} color={PRIMARY} />
                      </Pressable>

                      <Pressable onPress={() => deleteHistory(item.id)}>
                        <Trash2 size={18} color="#EF4444" />
                      </Pressable>
                    </HStack>
                  </HStack>
                )}
              </Box>
            ))}
          </VStack>
        </Box>

      </VStack>
    </ScrollView>
  );
};

export default JournalWater;
