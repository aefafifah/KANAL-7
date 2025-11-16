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

// helper 
const levelToCategory = (level) =>
  level === "Rendah" ? "healthy" : level === "Sedang" ? "ok" : "low";

const categoryColor = (cat) =>
  cat === "healthy" ? "#86efac" : cat === "ok" ? "#fde68a" : "#fca5a5";

// props
const CupCard = ({ size, selected, onPress, onLongPress }) => (
  <Pressable
    onPress={onPress}
    onLongPress={onLongPress}
    style={({ pressed }) => ({
      width: 80,
      height: 80,
      margin: 6,
      borderRadius: 12,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: selected ? "#e0f2fe" : "#f8fafc",
      borderWidth: 1,
      borderColor: selected ? "#2563eb" : "#e2e8f0",
      transform: [{ scale: pressed ? 0.97 : 1 }],
    })}
  >
    <Icon as={CupSoda} size="lg" color={selected ? "#2563eb" : "#64748b"} />
    <Text mt="$1" fontSize="$xs" color={selected ? "$blue600" : "$muted"}>
      {size} mL
    </Text>
  </Pressable>
);

const DrinkCard = ({ name, icon: IconComp, sugarLevel, selected, onPress, onLongPress }) => (
  <Pressable
    onPress={onPress}
    onLongPress={onLongPress}
    style={({ pressed }) => ({
      width: 100,
      height: 90,
      margin: 6,
      borderRadius: 12,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: selected ? "#f0fdf4" : "#f8fafc",
      borderWidth: 1,
      borderColor: selected ? "#16a34a" : "#e2e8f0",
      transform: [{ scale: pressed ? 0.97 : 1 }],
    })}
  >
    <Icon as={IconComp} size="lg" color={selected ? "#16a34a" : "#64748b"} />
    <Text mt="$1" fontSize="$xs" color={selected ? "$green600" : "$muted"}>
      {name}
    </Text>
    <Text size="2xs" color="$muted">
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

  // modal
  const [showAddCup, setShowAddCup] = useState(false);
  const [showAddDrink, setShowAddDrink] = useState(false);
  const [newCupSize, setNewCupSize] = useState("");
  const [newDrinkName, setNewDrinkName] = useState("");
  const [newDrinkSugar, setNewDrinkSugar] = useState("Sedang");

  // record
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
      sugarLevel: selectedDrink.sugarLevel,
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
      { text: "Hapus", style: "destructive", onPress: () => setHistory((p) => p.filter((h) => h.id !== id)) },
    ]);
  };

  // create,delete
  const handleAddCup = () => {
    const sizeNum = parseInt(newCupSize);
    if (!sizeNum) return Alert.alert("Ukuran tidak valid");
    setCups((p) => [...p, { id: Date.now(), size: sizeNum }]);
    setNewCupSize("");
    setShowAddCup(false);
  };

  const handleDeleteCup = (id) => {
    Alert.alert("Hapus Cup", "Hapus ukuran cup ini?", [
      { text: "Batal", style: "cancel" },
      { text: "Hapus", style: "destructive", onPress: () => setCups((p) => p.filter((c) => c.id !== id)) },
    ]);
  };

  const handleAddDrink = () => {
    if (!newDrinkName.trim()) return Alert.alert("Nama minuman kosong");
    setDrinks((p) => [...p, { id: Date.now(), name: newDrinkName, icon: GlassWater, sugarLevel: newDrinkSugar }]);
    setNewDrinkName("");
    setNewDrinkSugar("Sedang");
    setShowAddDrink(false);
  };

  const handleDeleteDrink = (id) => {
    Alert.alert("Hapus Minuman", "Hapus jenis minuman ini?", [
      { text: "Batal", style: "cancel" },
      { text: "Hapus", style: "destructive", onPress: () => setDrinks((p) => p.filter((d) => d.id !== id)) },
    ]);
  };

//  chart 
  const summary = useMemo(() => {
    const count = { healthy: 0, ok: 0, low: 0 };
    history.forEach((h) => {
      const cat = levelToCategory(h.sugarLevel);
      count[cat] += h.size;
    });
    return count;
  }, [history]);

  const pieData = [
    { name: "Sehat", volume: summary.healthy, color: categoryColor("healthy"), legendFontColor: "#374151", legendFontSize: 12 },
    { name: "Cukup", volume: summary.ok, color: categoryColor("ok"), legendFontColor: "#374151", legendFontSize: 12 },
    { name: "Kurang", volume: summary.low, color: categoryColor("low"), legendFontColor: "#374151", legendFontSize: 12 },
  ];

  return (
    <ScrollView style={{ backgroundColor: "#f9fafb" }}>
      <Center py="$6" px="$4">
        <Heading size="lg">Jurnal Air Harian 💧</Heading>

        {}
        <Box w="100%" bg="$white" p="$3" borderRadius="$lg" shadow="1" mb="$4">
          <Text bold mb="$2">Grafik Kesehatan Minuman</Text>
          <PieChart
            data={pieData}
            width={SCREEN_WIDTH - 40}
            height={220}
            accessor="volume"
            backgroundColor="transparent"
            chartConfig={{
              color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`
            }}
          />
        </Box>

        {}
        <Box w="100%" bg="$white" p="$3" borderRadius="$lg" shadow="1" mb="$4">
          <Text bold mb="$2">Pilih Ukuran Cup</Text>
          <HStack flexWrap="wrap">
            {cups.map((cup) => (
              <CupCard
                key={cup.id}
                size={cup.size}
                selected={selectedCup?.id === cup.id}
                onPress={() => setSelectedCup(cup)}
                onLongPress={() => handleDeleteCup(cup.id)}
              />
            ))}

            {}
            <Pressable
              onPress={() => setShowAddCup(true)}
              style={{
                width: 80,
                height: 80,
                margin: 6,
                borderRadius: 12,
                backgroundColor: "#f0f9ff",
                justifyContent: "center",
                alignItems: "center",
                borderWidth: 1,
                borderColor: "#dbeafe",
              }}
            >
              <Icon as={Plus} size="lg" color="#0366d6" />
              <Text mt="$1" fontSize="$xs" color="$blue600">Tambah</Text>
            </Pressable>
          </HStack>
        </Box>

        {}
        <Box w="100%" bg="$white" p="$3" borderRadius="$lg" shadow="1" mb="$4">
          <Text bold mb="$2">Pilih Jenis Minuman</Text>
          <HStack flexWrap="wrap">
            {drinks.map((d) => (
              <DrinkCard
                key={d.id}
                name={d.name}
                icon={d.icon}
                sugarLevel={d.sugarLevel}
                selected={selectedDrink?.id === d.id}
                onPress={() => setSelectedDrink(d)}
                onLongPress={() => handleDeleteDrink(d.id)}
              />
            ))}

            {}
            <Pressable
              onPress={() => setShowAddDrink(true)}
              style={{
                width: 100,
                height: 90,
                margin: 6,
                borderRadius: 12,
                backgroundColor: "#f0fff4",
                justifyContent: "center",
                alignItems: "center",
                borderWidth: 1,
                borderColor: "#bbf7d0",
              }}
            >
              <Icon as={Plus} size="lg" color="#16a34a" />
              <Text mt="$1" fontSize="$xs" color="$green600">Tambah</Text>
              <Text size="2xs" color="$muted">Level gula</Text>
            </Pressable>
          </HStack>
        </Box>

        {}
        <Button onPress={handleAddRecord} bgColor="$blue600" w="100%" mb="$4" rounded="$xl">
          <HStack alignItems="center" justifyContent="center" space="sm">
            <Icon as={Plus} color="white" />
            <Text color="white" bold>Tambah Riwayat Minum</Text>
          </HStack>
        </Button>

        {}
        <Box w="100%" bg="$white" p="$3" borderRadius="$lg" shadow="1" mb="$8">
          <Text bold mb="$2">Riwayat Minum</Text>

          {history.length === 0 ? (
            <Text color="$muted" textAlign="center" py="$6">
              Belum ada riwayat
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
                        <Text size="2xs" color="$muted">Gula: {h.sugarLevel}</Text>
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

      {}
      <Modal isOpen={showAddCup} onClose={() => setShowAddCup(false)}>
        <ModalBackdrop />
        <ModalContent>
          <ModalHeader><Heading>Tambah Ukuran Cup</Heading></ModalHeader>
          <ModalBody>
            <Input>
              <InputField
                keyboardType="numeric"
                placeholder="250"
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

      {}
      <Modal isOpen={showAddDrink} onClose={() => setShowAddDrink(false)}>
        <ModalBackdrop />
        <ModalContent>
          <ModalHeader>
            <Heading>Tambah Jenis Minuman</Heading>
            <Text size="xs" color="$muted">Masukkan nama & level gula</Text>
          </ModalHeader>

          <ModalBody>
            <VStack space="sm">
              <Input>
                <InputField
                  placeholder="Teh Manis"
                  value={newDrinkName}
                  onChangeText={setNewDrinkName}
                />
              </Input>

              <Text size="sm">Level Gula</Text>
              <HStack>
                {["Rendah", "Sedang", "Tinggi"].map((lvl) => {
                  const active = newDrinkSugar === lvl;
                  return (
                    <Pressable
                      key={lvl}
                      onPress={() => setNewDrinkSugar(lvl)}
                      style={{
                        padding: 10,
                        marginRight: 6,
                        borderRadius: 10,
                        backgroundColor: active
                          ? lvl === "Rendah"
                            ? "#e6fffa"
                            : lvl === "Sedang"
                            ? "#fff7ed"
                            : "#fff1f2"
                          : "#f8fafc",
                        borderWidth: 1,
                        borderColor: active
                          ? lvl === "Rendah"
                            ? "#10b981"
                            : lvl === "Sedang"
                            ? "#f59e0b"
                            : "#ef4444"
                          : "#e5e7eb",
                      }}
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
