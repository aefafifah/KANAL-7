import React, { useMemo, useState } from "react";
import { ScrollView, Pressable, Alert, Dimensions } from "react-native";
import {
  Box,
  Center,
  Heading,
  Text,
  VStack,
  HStack,
  Button,
  ButtonText,
  Icon,
  Card,
} from "@gluestack-ui/themed";
import {
  CupSoda,
  Coffee,
  Droplet,
  Plus,
  Trash2,
  GlassWater,
} from "lucide-react-native";
import { PieChart } from "react-native-chart-kit";

const SCREEN_WIDTH = Dimensions.get("window").width;

// ===== THEME (SINKRON HOME & PROFILE) =====
const PRIMARY = "#2563EB";
const BG = "#F1F5F9";
const CARD = "#FFFFFF";
const TEXT = "#0F172A";
const SUB = "#64748B";

// ===== HELPER =====
const levelToCategory = (level) =>
  level === "Rendah" ? "healthy" : level === "Sedang" ? "ok" : "low";

const categoryColor = (cat) =>
  cat === "healthy" ? "#86efac" : cat === "ok" ? "#fde68a" : "#fca5a5";

// ===== CUP CARD =====
const CupCard = ({ size, selected, onPress, onLongPress }) => (
  <Pressable
    onPress={onPress}
    onLongPress={onLongPress}
    style={({ pressed }) => ({
      width: 80,
      height: 80,
      margin: 6,
      borderRadius: 14,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: selected ? "#DBEAFE" : CARD,
      borderWidth: 1,
      borderColor: selected ? PRIMARY : "#E5E7EB",
      transform: [{ scale: pressed ? 0.96 : 1 }],
    })}
  >
    <Icon as={CupSoda} size="lg" color={selected ? PRIMARY : SUB} />
    <Text mt="$1" fontSize="$xs" color={selected ? PRIMARY : SUB}>
      {size} mL
    </Text>
  </Pressable>
);

// ===== DRINK CARD =====
const DrinkCard = ({
  name,
  icon: IconComp,
  sugarLevel,
  selected,
  onPress,
  onLongPress,
}) => (
  <Pressable
    onPress={onPress}
    onLongPress={onLongPress}
    style={({ pressed }) => ({
      width: 100,
      height: 90,
      margin: 6,
      borderRadius: 14,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: selected ? "#DBEAFE" : CARD,
      borderWidth: 1,
      borderColor: selected ? PRIMARY : "#E5E7EB",
      transform: [{ scale: pressed ? 0.96 : 1 }],
    })}
  >
    <Icon as={IconComp} size="lg" color={selected ? PRIMARY : SUB} />
    <Text mt="$1" fontSize="$xs" color={TEXT}>
      {name}
    </Text>
    <Text fontSize="$2xs" color={SUB}>
      Gula: {sugarLevel}
    </Text>
  </Pressable>
);

export default function JurnalWater() {
  const [selectedCup, setSelectedCup] = useState(null);
  const [selectedDrink, setSelectedDrink] = useState(null);
  const [history, setHistory] = useState([]);

  const [cups, setCups] = useState([
    { id: 1, size: 100 },
    { id: 2, size: 200 },
    { id: 3, size: 300 },
    { id: 4, size: 500 },
  ]);

  const [drinks, setDrinks] = useState([
    { id: 1, name: "Air Putih", icon: GlassWater, sugarLevel: "Rendah" },
    { id: 2, name: "Juice", icon: Droplet, sugarLevel: "Sedang" },
    { id: 3, name: "Coffee", icon: Coffee, sugarLevel: "Tinggi" },
  ]);

  const [showAddCup, setShowAddCup] = useState(false);
  const [showAddDrink, setShowAddDrink] = useState(false);
  const [newCupSize, setNewCupSize] = useState("");
  const [newDrinkName, setNewDrinkName] = useState("");
  const [newDrinkSugar, setNewDrinkSugar] = useState("Sedang");

  const handleAddRecord = () => {
    if (!selectedCup || !selectedDrink) {
      Alert.alert("Lengkapi Pilihan", "Pilih ukuran cup dan jenis minuman.");
      return;
    }

    const now = new Date();
    setHistory((p) => [
      {
        id: Date.now(),
        drinkName: selectedDrink.name,
        size: selectedCup.size,
        sugarLevel: selectedDrink.sugarLevel,
        date: now.toLocaleDateString(),
        time: now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      },
      ...p,
    ]);

    setSelectedCup(null);
    setSelectedDrink(null);
  };

  const summary = useMemo(() => {
    const count = { healthy: 0, ok: 0, low: 0 };
    history.forEach((h) => {
      count[levelToCategory(h.sugarLevel)] += h.size;
    });
    return count;
  }, [history]);

  const pieData = [
    { name: "Sehat", volume: summary.healthy, color: "#86efac", legendFontColor: TEXT, legendFontSize: 12 },
    { name: "Cukup", volume: summary.ok, color: "#fde68a", legendFontColor: TEXT, legendFontSize: 12 },
    { name: "Kurang", volume: summary.low, color: "#fca5a5", legendFontColor: TEXT, legendFontSize: 12 },
  ];

  return (
    <ScrollView style={{ backgroundColor: BG }}>
      <Center px="$4" py="$6">

        <Heading color={TEXT} mb="$4">
          Jurnal Air Harian 💧
        </Heading>

        {/* ===== CHART ===== */}
        <Box bg={CARD} rounded="$xl" p="$4" mb="$5" w="100%">
          <Text fontWeight="$bold" color={TEXT} mb="$2">
            Ringkasan Minum
          </Text>
          <PieChart
            data={pieData}
            width={SCREEN_WIDTH - 48}
            height={220}
            accessor="volume"
            backgroundColor="transparent"
            chartConfig={{ color: () => TEXT }}
          />
        </Box>

        {/* ===== CUP ===== */}
        <Box bg={CARD} rounded="$xl" p="$4" mb="$5" w="100%">
          <Text fontWeight="$bold" color={TEXT} mb="$2">
            Pilih Ukuran Cup
          </Text>
          <HStack flexWrap="wrap">
            {cups.map((c) => (
              <CupCard
                key={c.id}
                size={c.size}
                selected={selectedCup?.id === c.id}
                onPress={() => setSelectedCup(c)}
              />
            ))}
          </HStack>
        </Box>

        {/* ===== DRINK ===== */}
        <Box bg={CARD} rounded="$xl" p="$4" mb="$5" w="100%">
          <Text fontWeight="$bold" color={TEXT} mb="$2">
            Pilih Jenis Minuman
          </Text>
          <HStack flexWrap="wrap">
            {drinks.map((d) => (
              <DrinkCard
                key={d.id}
                {...d}
                selected={selectedDrink?.id === d.id}
                onPress={() => setSelectedDrink(d)}
              />
            ))}
          </HStack>
        </Box>

        {/* ===== BUTTON ===== */}
        <Button
          bg={PRIMARY}
          h={56}
          rounded="$xl"
          w="100%"
          onPress={handleAddRecord}
        >
          <HStack alignItems="center" space="sm">
            <Icon as={Plus} color="white" />
            <ButtonText color="$white" fontWeight="$bold">
              Tambah Riwayat Minum
            </ButtonText>
          </HStack>
        </Button>

        {/* ===== HISTORY ===== */}
        <Box bg={CARD} rounded="$xl" p="$4" mt="$6" w="100%">
          <Text fontWeight="$bold" color={TEXT} mb="$2">
            Riwayat Minum
          </Text>

          {history.length === 0 ? (
            <Text color={SUB} textAlign="center" py="$6">
              Belum ada riwayat
            </Text>
          ) : (
            <VStack space="sm">
              {history.map((h) => (
                <Card key={h.id} p="$3" rounded="$lg">
                  <HStack justifyContent="space-between" alignItems="center">
                    <VStack>
                      <Text fontWeight="$bold">{h.drinkName}</Text>
                      <Text fontSize="$xs" color={SUB}>
                        {h.size} mL • {h.time}
                      </Text>
                    </VStack>
                    <Pressable onPress={() =>
                      setHistory((p) => p.filter((x) => x.id !== h.id))
                    }>
                      <Icon as={Trash2} color="#DC2626" />
                    </Pressable>
                  </HStack>
                </Card>
              ))}
            </VStack>
          )}
        </Box>
      </Center>
    </ScrollView>
  );
}
