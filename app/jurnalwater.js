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
  Icon,
  Input,
  InputField,
  Modal,
  ModalBackdrop,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
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
const TARGET_ML = 2000;

// Helper: sugar level
const sugarWeight = { Rendah: 0, Sedang: 1, Tinggi: 2 };
const levelToCategory = (level) =>
  level === "Rendah" ? "healthy" : level === "Sedang" ? "ok" : "low";
const categoryColor = (cat) =>
  cat === "healthy" ? "#86efac" : cat === "ok" ? "#fde68a" : "#fca5a5";
const statusLabel = (cat) =>
  cat === "healthy" ? "Sehat" : cat === "ok" ? "Cukup" : "Kurang";

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

  // modal
  const [showAddCup, setShowAddCup] = useState(false);
  const [showAddDrink, setShowAddDrink] = useState(false);
  const [newCupSize, setNewCupSize] = useState("");
  const [newDrinkName, setNewDrinkName] = useState("");
  const [newDrinkSugar, setNewDrinkSugar] = useState("Sedang");

  // --- actions
  const handleAddRecord = () => {
    if (!selectedCup || !selectedDrink) {
      Alert.alert("Isi pilihan", "Pilih ukuran cup & jenis minuman terlebih dahulu.");
      return;
    }
    const now = new Date();
    const record = {
      id: Date.now(),
      drinkName: selectedDrink.name,
      size: selectedCup.size,
      sugarLevel: selectedDrink.sugarLevel || "Sedang",
      date: now.toLocaleDateString(),
      time: now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };
    setHistory((prev) => [record, ...prev]);
    setSelectedCup(null);
    setSelectedDrink(null);
  };

  const handleDeleteRecord = (id) => {
    Alert.alert("Hapus Riwayat", "Yakin ingin menghapus catatan ini?", [
      { text: "Batal", style: "cancel" },
      { text: "Hapus", style: "destructive", onPress: () => setHistory((prev) => prev.filter((h) => h.id !== id)) },
    ]);
  };

  const handleAddCup = () => {
    const sizeNum = parseInt(newCupSize, 10);
    if (!sizeNum) {
      Alert.alert("Masukkan ukuran yang valid (contoh: 250)");
      return;
    }
    setCups((prev) => [...prev, { id: Date.now(), size: sizeNum }]);
    setNewCupSize("");
    setShowAddCup(false);
  };

  const handleAddDrink = () => {
    if (!newDrinkName.trim()) {
      Alert.alert("Nama kosong", "Masukkan nama minuman terlebih dahulu.");
      return;
    }
    setDrinks((prev) => [
      ...prev,
      { id: Date.now(), name: newDrinkName, icon: GlassWater, sugarLevel: newDrinkSugar },
    ]);
    setNewDrinkName("");
    setNewDrinkSugar("Sedang");
    setShowAddDrink(false);
  };

  const handleDeleteCup = (id) => {
    Alert.alert("Hapus Cup", "Hapus ukuran cup ini?", [
      { text: "Batal", style: "cancel" },
      { text: "Hapus", style: "destructive", onPress: () => setCups((prev) => prev.filter((c) => c.id !== id)) },
    ]);
  };

  const handleDeleteDrink = (id) => {
    Alert.alert("Hapus Minuman", "Hapus jenis minuman ini?", [
      { text: "Batal", style: "cancel" },
      { text: "Hapus", style: "destructive", onPress: () => setDrinks((prev) => prev.filter((d) => d.id !== id)) },
    ]);
  };

  // --- analytics
  const summary = useMemo(() => {
    const count = { healthy: 0, ok: 0, low: 0 };
    history.forEach((h) => {
      const cat = levelToCategory(h.sugarLevel);
      count[cat] += h.size || 0;
    });
    return count;
  }, [history]);

  const pieData = [
    {
      name: "Sehat",
      volume: summary.healthy,
      color: categoryColor("healthy"),
      legendFontColor: "#374151",
      legendFontSize: 12,
    },
    {
      name: "Cukup",
      volume: summary.ok,
      color: categoryColor("ok"),
      legendFontColor: "#374151",
      legendFontSize: 12,
    },
    {
      name: "Kurang",
      volume: summary.low,
      color: categoryColor("low"),
      legendFontColor: "#374151",
      legendFontSize: 12,
    },
  ];

  return (
    <ScrollView style={{ backgroundColor: "#f9fafb" }}>
      <Center py="$6" px="$4">
        <Heading size="lg" mb="$1">
          Jurnal Air Harian 💧
        </Heading>
        <Text color="$muted" mb="$4" textAlign="center">
          Catat konsumsi air & pantau kesehatan minumanmu berdasarkan kadar gula.
        </Text>

        {/* === Pie Chart Section === */}
        <Box w="100%" bg="$white" p="$3" borderRadius="$lg" shadow="1" mb="$4">
          <Text bold mb="$2">
            Grafik Kesehatan Minuman
          </Text>
          <PieChart
            data={pieData}
            width={SCREEN_WIDTH - 40}
            height={220}
            accessor="volume"
            backgroundColor="transparent"
            paddingLeft="10"
            center={[0, 0]}
            absolute
            chartConfig={{
              color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
            }}
          />
        </Box>

        {/* === Cup Selection === */}
        <Box w="100%" bg="$white" p="$3" borderRadius="$lg" shadow="1" mb="$4">
          <Text bold mb="$2">
            Pilih Ukuran Cup
          </Text>
          <HStack flexWrap="wrap" justifyContent="flex-start">
            {cups.map((cup) => {
              const isSelected = selectedCup?.id === cup.id;
              return (
                <Pressable
                  key={cup.id}
                  onPress={() => setSelectedCup(cup)}
                  onLongPress={() => handleDeleteCup(cup.id)}
                  style={({ pressed }) => ({
                    width: 80,
                    height: 80,
                    margin: 6,
                    borderRadius: 12,
                    justifyContent: "center",
                    alignItems: "center",
                    backgroundColor: isSelected ? "#e0f2fe" : "#f8fafc",
                    borderWidth: 1,
                    borderColor: isSelected ? "#2563eb" : "#e2e8f0",
                    transform: [{ scale: pressed ? 0.97 : 1 }],
                  })}
                >
                  <Icon as={CupSoda} size="lg" color={isSelected ? "#2563eb" : "#64748b"} />
                  <Text mt="$1" fontSize="$xs" color={isSelected ? "$blue600" : "$muted"}>
                    {cup.size} mL
                  </Text>
                </Pressable>
              );
            })}
            <Pressable
              onPress={() => setShowAddCup(true)}
              style={({ pressed }) => ({
                width: 80,
                height: 80,
                margin: 6,
                borderRadius: 12,
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: "#f0f9ff",
                borderWidth: 1,
                borderColor: "#e6f2ff",
                transform: [{ scale: pressed ? 0.97 : 1 }],
              })}
            >
              <Icon as={Plus} size="lg" color="#0366d6" />
              <Text mt="$1" fontSize="$xs" color="$blue600">
                Tambah
              </Text>
            </Pressable>
          </HStack>
        </Box>

        {/* === Drink Selection === */}
        <Box w="100%" bg="$white" p="$3" borderRadius="$lg" shadow="1" mb="$4">
          <Text bold mb="$2">
            Pilih Jenis Minuman
          </Text>
          <HStack flexWrap="wrap" justifyContent="flex-start">
            {drinks.map((d) => {
              const isSelected = selectedDrink?.id === d.id;
              const IconComp = d.icon || GlassWater;
              return (
                <Pressable
                  key={d.id}
                  onPress={() => setSelectedDrink(d)}
                  onLongPress={() => handleDeleteDrink(d.id)}
                  style={({ pressed }) => ({
                    width: 100,
                    height: 90,
                    margin: 6,
                    borderRadius: 12,
                    justifyContent: "center",
                    alignItems: "center",
                    backgroundColor: isSelected ? "#f0fdf4" : "#f8fafc",
                    borderWidth: 1,
                    borderColor: isSelected ? "#16a34a" : "#e2e8f0",
                    transform: [{ scale: pressed ? 0.97 : 1 }],
                  })}
                >
                  <Icon as={IconComp} size="lg" color={isSelected ? "#16a34a" : "#64748b"} />
                  <Text mt="$1" fontSize="$xs" color={isSelected ? "$green600" : "$muted"}>
                    {d.name}
                  </Text>
                  <Text size="2xs" color="$muted">
                    Gula: {d.sugarLevel}
                  </Text>
                </Pressable>
              );
            })}
            <Pressable
              onPress={() => setShowAddDrink(true)}
              style={({ pressed }) => ({
                width: 100,
                height: 90,
                margin: 6,
                borderRadius: 12,
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: "#f0fff4",
                borderWidth: 1,
                borderColor: "#e6f8ee",
                transform: [{ scale: pressed ? 0.97 : 1 }],
              })}
            >
              <Icon as={Plus} size="lg" color="#15803d" />
              <Text mt="$1" fontSize="$xs" color="$green600">
                Tambah
              </Text>
              <Text size="2xs" color="$muted">
                Pilih level gula
              </Text>
            </Pressable>
          </HStack>
        </Box>

        {/* === Add Record Button === */}
        <Button onPress={handleAddRecord} bgColor="$blue600" w="100%" mb="$4" rounded="$xl">
          <HStack alignItems="center" justifyContent="center" space="sm">
            <Icon as={Plus} color="white" />
            <Text color="white" fontWeight="bold">
              Tambah Riwayat Minum
            </Text>
          </HStack>
        </Button>

        {/* === History === */}
        <Box w="100%" bg="$white" p="$3" borderRadius="$lg" shadow="1" mb="$12">
          <Text bold mb="$2">
            Riwayat Minum
          </Text>
          {history.length === 0 ? (
            <Text color="$muted" textAlign="center" py="$6">
              Belum ada riwayat — mulai catat sekarang!
            </Text>
          ) : (
            <VStack space="sm">
              {history.map((h) => (
                <Card key={h.id} p="$3" borderRadius="$lg">
                  <HStack justifyContent="space-between" alignItems="center">
                    <HStack alignItems="center">
                      <Icon as={CupSoda} size="lg" color="#0366d6" mr="$3" />
                      <VStack>
                        <Text bold>{h.drinkName}</Text>
                        <Text size="xs" color="$muted">
                          {h.size} mL — {h.date} {h.time}
                        </Text>
                        <Text size="2xs" color="$muted">
                          Gula: {h.sugarLevel}
                        </Text>
                      </VStack>
                    </HStack>
                    <Pressable onPress={() => handleDeleteRecord(h.id)}>
                      <Icon as={Trash2} size="md" color="#dc2626" />
                    </Pressable>
                  </HStack>
                </Card>
              ))}
            </VStack>
          )}
        </Box>
      </Center>

      {/* === Modal Add Cup === */}
      <Modal isOpen={showAddCup} onClose={() => setShowAddCup(false)}>
        <ModalBackdrop />
        <ModalContent>
          <ModalHeader>
            <Heading>Tambah Ukuran Cup</Heading>
          </ModalHeader>
          <ModalBody>
            <Input>
              <InputField
                placeholder="250"
                keyboardType="numeric"
                value={newCupSize}
                onChangeText={setNewCupSize}
              />
            </Input>
          </ModalBody>
          <ModalFooter>
            <Button mr="$3" onPress={() => setShowAddCup(false)}>
              <Text>Batal</Text>
            </Button>
            <Button bgColor="$blue600" onPress={handleAddCup}>
              <Text color="white">Tambah</Text>
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* === Modal Add Drink === */}
      <Modal isOpen={showAddDrink} onClose={() => setShowAddDrink(false)}>
        <ModalBackdrop />
        <ModalContent>
          <ModalHeader>
            <Heading>Tambah Jenis Minuman</Heading>
            <Text size="xs" color="$muted" mt="$1">
              Masukkan nama & pilih level gula
            </Text>
          </ModalHeader>
          <ModalBody>
            <VStack space="sm">
              <Input>
                <InputField
                  placeholder="Contoh: Teh Manis"
                  value={newDrinkName}
                  onChangeText={setNewDrinkName}
                />
              </Input>

              <Text size="sm" mt="$2" mb="$1">
                Level Gula
              </Text>
              <HStack>
                {["Rendah", "Sedang", "Tinggi"].map((lvl) => {
                  const active = newDrinkSugar === lvl;
                  return (
                    <Pressable
                      key={lvl}
                      onPress={() => setNewDrinkSugar(lvl)}
                      style={({ pressed }) => ({
                        paddingVertical: 8,
                        paddingHorizontal: 12,
                        marginRight: 8,
                        borderRadius: 10,
                        backgroundColor: active
                          ? lvl === "Rendah"
                            ? "#e6fffa"
                            : lvl === "Sedang"
                            ? "#fff7ed"
                            : "#fff1f2"
                          : "#fbfdff",
                        borderWidth: 1,
                        borderColor: active
                          ? lvl === "Rendah"
                            ? "#10b981"
                            : lvl === "Sedang"
                            ? "#f59e0b"
                            : "#ef4444"
                          : "#e2e8f0",
                        transform: [{ scale: pressed ? 0.98 : 1 }],
                      })}
                    >
                      <Text>{lvl}</Text>
                    </Pressable>
                  );
                })}
              </HStack>
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Button mr="$3" onPress={() => setShowAddDrink(false)}>
              <Text>Batal</Text>
            </Button>
            <Button bgColor="$green600" onPress={handleAddDrink}>
              <Text color="white">Tambah</Text>
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </ScrollView>
  );
}
