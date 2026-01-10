import React, { useMemo, useState, useEffect } from "react";
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
  ButtonText,
} from "@gluestack-ui/themed";
import {
  CupSoda,
  Coffee,
  Droplet,
  Plus,
  Trash2,
  GlassWater,
  CheckCircle,
  Cloud,
} from "lucide-react-native";
import { PieChart } from "react-native-chart-kit";
import { supabase } from "../lib/supabase";

const SCREEN_WIDTH = Dimensions.get("window").width;
const TARGET_ML = 2000;

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

// ===== ICON MAPPING =====
const iconMap = {
  CupSoda: CupSoda,
  Coffee: Coffee,
  Droplet: Droplet,
  GlassWater: GlassWater,
};

// ===== CUP CARD COMPONENT =====
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

// ===== DRINK CARD COMPONENT =====
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
  const [cups, setCups] = useState([]);
  const [drinks, setDrinks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [connected, setConnected] = useState(false);

  // Modal state
  const [showAddCup, setShowAddCup] = useState(false);
  const [showAddDrink, setShowAddDrink] = useState(false);
  const [newCupSize, setNewCupSize] = useState("");
  const [newDrinkName, setNewDrinkName] = useState("");
  const [newDrinkSugar, setNewDrinkSugar] = useState("Sedang");

  // ===== SUPABASE CONNECTION & DATA FETCHING =====
  const testConnection = async () => {
    try {
      const { data, error } = await supabase
        .from('drink_logs')
        .select('count');
      
      if (error) throw error;
      setConnected(true);
      console.log('✅ Connected to Supabase drink_logs');
    } catch (error) {
      console.error('❌ Connection error:', error.message);
      setConnected(false);
    }
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      console.log('🔄 Fetching data...');
      
      // Fetch cup sizes
      const { data: cupData, error: cupError } = await supabase
        .from('cup_sizes')
        .select('*')
        .order('size_ml');
      
      if (cupError) {
        console.error('Cup fetch error:', cupError);
        throw cupError;
      }
      
      console.log('Cups fetched:', cupData?.length || 0);
      setCups(cupData?.map(c => ({ id: c.id, size: c.size_ml })) || []);

      // Fetch drink types
      const { data: drinkData, error: drinkError } = await supabase
        .from('drink_types')
        .select('*')
        .order('name');
      
      if (drinkError) {
        console.error('Drink fetch error:', drinkError);
        throw drinkError;
      }
      
      console.log('Drinks fetched:', drinkData?.length || 0);
      setDrinks(drinkData?.map(d => ({
        id: d.id,
        name: d.name,
        icon: iconMap[d.icon_name] || GlassWater,
        sugarLevel: d.sugar_level
      })) || []);

      // Fetch drink logs (today)
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      console.log('Fetching logs for date:', today.toISOString());
      
      const { data: logData, error: logError } = await supabase
        .from('drink_logs')
        .select('*')
        .gte('consumed_at', today.toISOString())
        .order('consumed_at', { ascending: false });
      
      if (logError) {
        console.error('Log fetch error:', logError);
        throw logError;
      }
      
      console.log('Logs fetched:', logData?.length || 0);
      
      const formattedLogs = logData?.map(log => ({
        id: log.id,
        drinkName: log.drink_name,
        size: log.volume_ml,
        sugarLevel: log.sugar_level,
        date: new Date(log.consumed_at).toLocaleDateString(),
        time: new Date(log.consumed_at).toLocaleTimeString([], { 
          hour: "2-digit", 
          minute: "2-digit" 
        }),
      })) || [];
      
      setHistory(formattedLogs);
      setConnected(true);
      
    } catch (error) {
      console.error("Error fetching data:", error);
      Alert.alert("Koneksi Error", error.message || "Gagal terhubung ke database");
      setConnected(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    testConnection();
    fetchData();

    // Real-time subscription
    const subscription = supabase
      .channel('real-time-logs')
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'drink_logs' 
        }, 
        (payload) => {
          console.log('Realtime update:', payload);
          fetchData();
        }
      )
      .subscribe((status) => {
        console.log('Subscription status:', status);
      });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // ===== ACTIONS =====
  const handleAddRecord = async () => {
    if (!selectedCup || !selectedDrink) {
      Alert.alert("Lengkapi Pilihan", "Pilih ukuran cup dan jenis minuman.");
      return;
    }

    setLoading(true);
    try {
      console.log('📝 Adding record...', {
        drink: selectedDrink.name,
        size: selectedCup.size,
        sugar: selectedDrink.sugarLevel
      });

      const { data, error } = await supabase
        .from('drink_logs')
        .insert({
          drink_name: selectedDrink.name,
          volume_ml: selectedCup.size,
          sugar_level: selectedDrink.sugarLevel
        })
        .select();

      if (error) {
        console.error('❌ Insert error:', error);
        
        if (error.code === 'PGRST204') {
          console.log('🔄 Trying alternative insert method...');
          
          const { data: rpcData, error: rpcError } = await supabase.rpc(
            'insert_drink_log',
            {
              p_drink_name: selectedDrink.name,
              p_volume_ml: selectedCup.size,
              p_sugar_level: selectedDrink.sugarLevel
            }
          );
          
          if (rpcError) throw rpcError;
          
          console.log('✅ RPC insert success:', rpcData);
        } else {
          throw error;
        }
      } else {
        console.log('✅ Insert success:', data);
      }

      Alert.alert("Sukses", "✅ Catatan tersimpan!");
      setSelectedCup(null);
      setSelectedDrink(null);
      
      await fetchData();
      
    } catch (error) {
      console.error('💥 Save error:', error);
      
      let errorMessage = "Gagal menyimpan";
      if (error.code === 'PGRST204') {
        errorMessage = "Database sedang update. Coba lagi dalam 1 menit.";
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      Alert.alert("Error", errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteRecord = async (id) => {
    Alert.alert("Hapus?", "Yakin hapus catatan ini?", [
      { text: "Batal" },
      { 
        text: "Hapus", 
        onPress: async () => {
          try {
            const { error } = await supabase
              .from('drink_logs')
              .delete()
              .eq('id', id);
            
            if (error) throw error;
            
            console.log('Deleted record:', id);
            fetchData();
          } catch (error) {
            console.error('Delete error:', error);
            Alert.alert("Error", "Gagal menghapus");
          }
        }
      },
    ]);
  };

  const handleAddCup = async () => {
    const sizeNum = parseInt(newCupSize, 10);
    if (!sizeNum || sizeNum <= 0) {
      Alert.alert("Error", "Masukkan angka yang valid");
      return;
    }

    try {
      const { error } = await supabase
        .from('cup_sizes')
        .insert([{ size_ml: sizeNum }]);
      
      if (error) throw error;
      
      setNewCupSize("");
      setShowAddCup(false);
      fetchData();
    } catch (error) {
      console.error('Add cup error:', error);
      Alert.alert("Error", error.message || "Gagal menambah cup");
    }
  };

  const handleAddDrink = async () => {
    if (!newDrinkName.trim()) {
      Alert.alert("Error", "Masukkan nama minuman");
      return;
    }

    try {
      const { error } = await supabase
        .from('drink_types')
        .insert([{
          name: newDrinkName,
          sugar_level: newDrinkSugar,
          icon_name: "GlassWater"
        }]);
      
      if (error) throw error;
      
      setNewDrinkName("");
      setNewDrinkSugar("Sedang");
      setShowAddDrink(false);
      fetchData();
    } catch (error) {
      console.error('Add drink error:', error);
      Alert.alert("Error", error.message || "Gagal menambah minuman");
    }
  };

  const handleDeleteCup = async (id) => {
    Alert.alert("Hapus Cup?", "Cup akan dihapus permanen", [
      { text: "Batal" },
      { 
        text: "Hapus", 
        onPress: async () => {
          try {
            const { error } = await supabase
              .from('cup_sizes')
              .delete()
              .eq('id', id);
            
            if (error) throw error;
            
            fetchData();
          } catch (error) {
            Alert.alert("Error", "Gagal menghapus cup");
          }
        }
      },
    ]);
  };

  const handleDeleteDrink = async (id) => {
    Alert.alert("Hapus Minuman?", "Minuman akan dihapus permanen", [
      { text: "Batal" },
      { 
        text: "Hapus", 
        onPress: async () => {
          try {
            const { error } = await supabase
              .from('drink_types')
              .delete()
              .eq('id', id);
            
            if (error) throw error;
            
            fetchData();
          } catch (error) {
            Alert.alert("Error", "Gagal menghapus minuman");
          }
        }
      },
    ]);
  };

  // ===== ANALYTICS =====
  const summary = useMemo(() => {
    const count = { healthy: 0, ok: 0, low: 0 };
    history.forEach((h) => {
      const category = levelToCategory(h.sugarLevel);
      count[category] += h.size;
    });
    return count;
  }, [history]);

  const sugarSummary = useMemo(() => {
    const summary = {
      lowSugar: { volume: 0, label: "Gula Rendah", color: "#86efac" },
      mediumSugar: { volume: 0, label: "Gula Sedang", color: "#fde68a" },
      highSugar: { volume: 0, label: "Gula Tinggi", color: "#fca5a5" },
    };
    
    history.forEach((h) => {
      if (h.sugarLevel && h.size) {
        switch(h.sugarLevel) {
          case "Rendah":
            summary.lowSugar.volume += h.size;
            break;
          case "Sedang":
            summary.mediumSugar.volume += h.size;
            break;
          case "Tinggi":
            summary.highSugar.volume += h.size;
            break;
        }
      }
    });
    
    return summary;
  }, [history]);

  // Pie chart data untuk kategori sehat
  const healthPieData = useMemo(() => [
    { 
      name: "Sehat", 
      volume: summary.healthy, 
      color: "#86efac", 
      legendFontColor: TEXT, 
      legendFontSize: 12 
    },
    { 
      name: "Cukup", 
      volume: summary.ok, 
      color: "#fde68a", 
      legendFontColor: TEXT, 
      legendFontSize: 12 
    },
    { 
      name: "Kurang", 
      volume: summary.low, 
      color: "#fca5a5", 
      legendFontColor: TEXT, 
      legendFontSize: 12 
    },
  ], [summary]);

  // Pie chart data untuk gula
  const sugarPieData = useMemo(() => {
    const data = [
      {
        name: "Gula Rendah",
        volume: sugarSummary.lowSugar.volume,
        color: "#86efac",
        legendFontColor: TEXT,
        legendFontSize: 12,
      },
      {
        name: "Gula Sedang",
        volume: sugarSummary.mediumSugar.volume,
        color: "#fde68a",
        legendFontColor: TEXT,
        legendFontSize: 12,
      },
      {
        name: "Gula Tinggi",
        volume: sugarSummary.highSugar.volume,
        color: "#fca5a5",
        legendFontColor: TEXT,
        legendFontSize: 12,
      },
    ];
    
    const filteredData = data.filter(item => item.volume > 0);
    
    if (filteredData.length === 0) {
      return [{
        name: "Belum ada data",
        volume: 1,
        color: "#d1d5db",
        legendFontColor: TEXT,
        legendFontSize: 12,
      }];
    }
    
    return filteredData;
  }, [sugarSummary]);

  const totalVolume = history.reduce((sum, h) => sum + h.size, 0);
  const progress = Math.min((totalVolume / TARGET_ML) * 100, 100);

  return (
    <ScrollView style={{ backgroundColor: BG }}>
      <Center px="$4" py="$6">
        {/* Header dengan status koneksi */}
        <VStack alignItems="center" mb="$4" w="100%">
          <HStack alignItems="center" mb="$2">
            <Icon as={connected ? CheckCircle : Cloud} 
                  size="lg" 
                  color={connected ? "$green600" : "$amber600"} />
            <Heading color={TEXT} ml="$2" size="lg">
              Jurnal Air Harian 💧
            </Heading>
          </HStack>
          <Text color={SUB} size="sm">
            {connected ? "✅ Tersinkron dengan Supabase" : "⚠️ Mode offline"}
          </Text>
        </VStack>

        {/* Progress Bar */}
        <Box w="100%" bg={CARD} p="$3" borderRadius="$lg" mb="$4">
          <HStack justifyContent="space-between" mb="$2">
            <Text fontWeight="$bold" color={TEXT}>Target: {TARGET_ML}ml</Text>
            <Text fontWeight="$bold" color={PRIMARY}>{totalVolume}ml</Text>
          </HStack>
          <Box w="100%" h="$2" bg="$blue100" borderRadius="$full" overflow="hidden">
            <Box h="100%" bg={PRIMARY} width={`${progress}%`} borderRadius="$full" />
          </Box>
          <Text fontSize="$xs" color={SUB} mt="$1">
            {progress.toFixed(0)}% tercapai • {history.length} catatan
          </Text>
        </Box>

        {/* CHART 1: Ringkasan Kesehatan */}
        <Box bg={CARD} rounded="$xl" p="$4" mb="$5" w="100%">
          <Text fontWeight="$bold" color={TEXT} mb="$2">
            Ringkasan Minum (Kesehatan)
          </Text>
          {history.length === 0 ? (
            <Center h={180}>
              <Text color={SUB}>Belum ada data</Text>
            </Center>
          ) : (
            <PieChart
              data={healthPieData}
              width={SCREEN_WIDTH - 48}
              height={180}
              accessor="volume"
              backgroundColor="transparent"
              chartConfig={{ color: () => TEXT }}
            />
          )}
        </Box>

        {/* Statistik Gula */}
        <Box w="100%" bg={CARD} p="$3" borderRadius="$lg" mb="$4">
          <Text fontWeight="$bold" color={TEXT} mb="$2">Statistik Konsumsi Gula</Text>
          <HStack justifyContent="space-between" flexWrap="wrap">
            {["lowSugar", "mediumSugar", "highSugar"].map((key, index) => {
              const item = sugarSummary[key];
              const colorMap = {
                lowSugar: "#10b981",
                mediumSugar: "#f59e0b", 
                highSugar: "#ef4444"
              };
              const bgMap = {
                lowSugar: "#d1fae5",
                mediumSugar: "#fef3c7",
                highSugar: "#fee2e2"
              };
              
              return (
                <VStack key={key} alignItems="center" flex={1} p="$2">
                  <Text fontWeight="$bold" color={colorMap[key]}>{item.volume}ml</Text>
                  <Text fontSize="$xs" color={SUB}>{item.label}</Text>
                  <Box w="100%" h="$1" bg={bgMap[key]} borderRadius="$full" mt="$1">
                    <Box h="100%" bg={colorMap[key]} 
                      width={`${totalVolume > 0 ? (item.volume / totalVolume * 100) : 0}%`} 
                      borderRadius="$full" />
                  </Box>
                </VStack>
              );
            })}
          </HStack>
        </Box>

        {/* CHART 2: Distribusi Gula */}
        <Box bg={CARD} rounded="$xl" p="$4" mb="$5" w="100%">
          <Text fontWeight="$bold" color={TEXT} mb="$2">
            Distribusi Konsumsi Gula (ml)
          </Text>
          {history.length === 0 ? (
            <Center h={180}>
              <Text color={SUB}>Belum ada data</Text>
            </Center>
          ) : (
            <VStack>
              <PieChart
                data={sugarPieData}
                width={SCREEN_WIDTH - 48}
                height={180}
                accessor="volume"
                backgroundColor="transparent"
                paddingLeft="15"
                absolute
                chartConfig={{ color: () => TEXT }}
              />
            </VStack>
          )}
        </Box>

        {/* ===== CUP SELECTION ===== */}
        <Box bg={CARD} rounded="$xl" p="$4" mb="$5" w="100%">
          <HStack justifyContent="space-between" alignItems="center" mb="$2">
            <Text fontWeight="$bold" color={TEXT}>
              Pilih Ukuran Cup ({cups.length})
            </Text>
            {loading && <Text fontSize="$sm" color={PRIMARY}>Memuat...</Text>}
          </HStack>
          <HStack flexWrap="wrap">
            {cups.map((c) => (
              <CupCard
                key={c.id}
                size={c.size}
                selected={selectedCup?.id === c.id}
                onPress={() => setSelectedCup(c)}
                onLongPress={() => handleDeleteCup(c.id)}
              />
            ))}
            <Pressable
              onPress={() => setShowAddCup(true)}
              style={({ pressed }) => ({
                width: 80,
                height: 80,
                margin: 6,
                borderRadius: 14,
                backgroundColor: "#DBEAFE",
                borderWidth: 1,
                borderColor: "#BFDBFE",
                justifyContent: "center",
                alignItems: "center",
                transform: [{ scale: pressed ? 0.96 : 1 }],
              })}
            >
              <Icon as={Plus} size="lg" color={PRIMARY} />
              <Text mt="$1" fontSize="$xs" color={PRIMARY}>
                Tambah
              </Text>
            </Pressable>
          </HStack>
        </Box>

        {/* ===== DRINK SELECTION ===== */}
        <Box bg={CARD} rounded="$xl" p="$4" mb="$5" w="100%">
          <HStack justifyContent="space-between" alignItems="center" mb="$2">
            <Text fontWeight="$bold" color={TEXT}>
              Pilih Jenis Minuman ({drinks.length})
            </Text>
            {loading && <Text fontSize="$sm" color={PRIMARY}>Memuat...</Text>}
          </HStack>
          <HStack flexWrap="wrap">
            {drinks.map((d) => (
              <DrinkCard
                key={d.id}
                {...d}
                selected={selectedDrink?.id === d.id}
                onPress={() => setSelectedDrink(d)}
                onLongPress={() => handleDeleteDrink(d.id)}
              />
            ))}
            <Pressable
              onPress={() => setShowAddDrink(true)}
              style={({ pressed }) => ({
                width: 100,
                height: 90,
                margin: 6,
                borderRadius: 14,
                backgroundColor: "#DBEAFE",
                borderWidth: 1,
                borderColor: "#BFDBFE",
                justifyContent: "center",
                alignItems: "center",
                transform: [{ scale: pressed ? 0.96 : 1 }],
              })}
            >
              <Icon as={Plus} size="lg" color={PRIMARY} />
              <Text mt="$1" fontSize="$xs" color={PRIMARY}>
                Tambah
              </Text>
              <Text fontSize="$2xs" color={SUB}>Jenis baru</Text>
            </Pressable>
          </HStack>
        </Box>

        {/* ===== ADD BUTTON ===== */}
        <Button
          bg={PRIMARY}
          h={56}
          rounded="$xl"
          w="100%"
          onPress={handleAddRecord}
          isDisabled={!selectedCup || !selectedDrink || loading}
          mb="$4"
        >
          <HStack alignItems="center" space="sm">
            <Icon as={Plus} color="white" />
            <ButtonText color="white" fontWeight="$bold">
              {loading ? "Menyimpan..." : `Tambah: ${selectedDrink?.name || ''} (${selectedCup?.size || 0}ml)`}
            </ButtonText>
          </HStack>
        </Button>

        {/* ===== HISTORY ===== */}
        <Box bg={CARD} rounded="$xl" p="$4" w="100%">
          <HStack justifyContent="space-between" alignItems="center" mb="$2">
            <Text fontWeight="$bold" color={TEXT}>
              Riwayat Minum Hari Ini ({history.length})
            </Text>
            {loading && <Text fontSize="$sm" color={PRIMARY}>Memuat...</Text>}
          </HStack>

          {history.length === 0 ? (
            <Text color={SUB} textAlign="center" py="$6">
              Belum ada riwayat minum hari ini
            </Text>
          ) : (
            <VStack space="sm">
              {history.map((h) => (
                <Card key={h.id} p="$3" rounded="$lg">
                  <HStack justifyContent="space-between" alignItems="center">
                    <HStack alignItems="center">
                      <Icon as={CupSoda} size="md" color={PRIMARY} mr="$2" />
                      <VStack>
                        <Text fontWeight="$bold">{h.drinkName}</Text>
                        <Text fontSize="$xs" color={SUB}>
                          {h.size}ml • Gula: {h.sugarLevel} • {h.time}
                        </Text>
                      </VStack>
                    </HStack>
                    <Pressable onPress={() => handleDeleteRecord(h.id)}>
                      <Icon as={Trash2} color="#DC2626" />
                    </Pressable>
                  </HStack>
                </Card>
              ))}
            </VStack>
          )}
        </Box>

        {/* Debug Info */}
        <Box bg="#F8FAFC" p="$3" borderRadius="$lg" w="100%" mt="$4">
          <Text fontSize="$sm" textAlign="center" color={SUB}>
            Supabase: {connected ? "✅ Connected" : "❌ Disconnected"}
          </Text>
          <Text fontSize="$xs" textAlign="center" color={SUB} mt="$1">
            Cups: {cups.length} | Drinks: {drinks.length} | Logs: {history.length}
          </Text>
        </Box>
      </Center>

      {/* ===== MODAL ADD CUP ===== */}
      <Modal isOpen={showAddCup} onClose={() => setShowAddCup(false)}>
        <ModalBackdrop />
        <ModalContent>
          <ModalHeader>
            <Heading>Tambah Ukuran Cup</Heading>
          </ModalHeader>
          <ModalBody>
            <Input>
              <InputField
                placeholder="Ukuran dalam ml, contoh: 250"
                keyboardType="numeric"
                value={newCupSize}
                onChangeText={setNewCupSize}
              />
            </Input>
            <Text size="xs" color={SUB} mt="$2">
              Contoh: 150, 250, 330, 500, 1000
            </Text>
          </ModalBody>
          <ModalFooter>
            <Button mr="$3" onPress={() => setShowAddCup(false)} variant="outline">
              <Text>Batal</Text>
            </Button>
            <Button bg={PRIMARY} onPress={handleAddCup}>
              <Text color="white">Tambah</Text>
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* ===== MODAL ADD DRINK ===== */}
      <Modal isOpen={showAddDrink} onClose={() => setShowAddDrink(false)}>
        <ModalBackdrop />
        <ModalContent>
          <ModalHeader>
            <Heading>Tambah Jenis Minuman</Heading>
          </ModalHeader>
          <ModalBody>
            <VStack space="sm">
              <Input>
                <InputField
                  placeholder="Nama minuman, contoh: Teh Manis"
                  value={newDrinkName}
                  onChangeText={setNewDrinkName}
                />
              </Input>

              <Text size="sm" mt="$2">Level Gula</Text>
              <HStack space="sm">
                {["Rendah", "Sedang", "Tinggi"].map((lvl) => (
                  <Pressable
                    key={lvl}
                    onPress={() => setNewDrinkSugar(lvl)}
                    style={({ pressed }) => ({
                      flex: 1,
                      padding: 10,
                      borderRadius: 8,
                      backgroundColor: newDrinkSugar === lvl 
                        ? lvl === "Rendah" ? "#e6fffa" 
                        : lvl === "Sedang" ? "#fff7ed" 
                        : "#fff1f2" 
                        : "#f8fafc",
                      borderWidth: 1,
                      borderColor: newDrinkSugar === lvl 
                        ? lvl === "Rendah" ? "#10b981" 
                        : lvl === "Sedang" ? "#f59e0b" 
                        : "#ef4444" 
                        : "#e2e8f0",
                      alignItems: "center",
                      transform: [{ scale: pressed ? 0.98 : 1 }],
                    })}
                  >
                    <Text color={
                      newDrinkSugar === lvl 
                        ? lvl === "Rendah" ? "#065f46" 
                        : lvl === "Sedang" ? "#92400e" 
                        : "#991b1b" 
                        : TEXT
                    }>
                      {lvl}
                    </Text>
                  </Pressable>
                ))}
              </HStack>
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Button mr="$3" onPress={() => setShowAddDrink(false)} variant="outline">
              <Text>Batal</Text>
            </Button>
            <Button bg="$green600" onPress={handleAddDrink}>
              <Text color="white">Tambah</Text>
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </ScrollView>
  );
}