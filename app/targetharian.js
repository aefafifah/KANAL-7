import { useState } from "react";
import {
  ScrollView,
  Box,
  Text,
  Input,
  InputField,
  Button,
  ButtonText,
  VStack,
  HStack,
} from "@gluestack-ui/themed";
import { Droplet, Thermometer, User, Wind } from "lucide-react-native";

const PRIMARY = "#2563EB";
const SOFT_BG = "#EEF2FF";

export default function TargetHarian() {
  const [weight, setWeight] = useState("");
  const [age, setAge] = useState("");
  const [temperature, setTemperature] = useState("");
  const [humidity, setHumidity] = useState("");
  const [result, setResult] = useState(null);

  const calculateWater = () => {
    if (!weight || !age || !temperature || !humidity) {
      alert("Harap isi semua data!");
      return;
    }

    let kebutuhan = weight * 30;

    if (age < 30) kebutuhan *= 1.1;
    else if (age <= 55) kebutuhan *= 1.05;
    else kebutuhan *= 1.03;

    if (temperature >= 32) kebutuhan *= 1.15;
    if (humidity > 75) kebutuhan *= 1.08;

    const liter = (kebutuhan / 1000).toFixed(2);
    setResult(liter);
  };

  return (
    <ScrollView flex={1} bg={SOFT_BG}>
      <VStack space="lg" p="$4">

        {/* ===== HEADER ===== */}
        <Box alignItems="center">
          <Box bg="#DBEAFE" p="$3" rounded="$full" mb="$2">
            <Droplet size={28} color={PRIMARY} />
          </Box>
          <Text fontSize="$2xl" fontWeight="$bold" color="#1E293B">
            Target Harian Dinamis
          </Text>
          <Text color="#64748B" textAlign="center" mt="$1">
            Hitung kebutuhan minum berdasarkan kondisi tubuh & lingkungan
          </Text>
        </Box>

        {/* ===== FORM CARD ===== */}
        <Box bg="$white" p="$5" rounded="$2xl" shadow="$1">
          <VStack space="md">

            {/* BERAT BADAN */}
            <HStack alignItems="center" space="sm">
              <User size={18} color={PRIMARY} />
              <Text fontWeight="$medium">Berat Badan (kg)</Text>
            </HStack>
            <Input>
              <InputField
                placeholder="Contoh: 60"
                keyboardType="numeric"
                value={weight}
                onChangeText={setWeight}
              />
            </Input>

            {/* USIA */}
            <HStack alignItems="center" space="sm">
              <User size={18} color={PRIMARY} />
              <Text fontWeight="$medium">Usia (tahun)</Text>
            </HStack>
            <Input>
              <InputField
                placeholder="Contoh: 25"
                keyboardType="numeric"
                value={age}
                onChangeText={setAge}
              />
            </Input>

            {/* SUHU */}
            <HStack alignItems="center" space="sm">
              <Thermometer size={18} color={PRIMARY} />
              <Text fontWeight="$medium">Suhu Harian (°C)</Text>
            </HStack>
            <Input>
              <InputField
                placeholder="Contoh: 34"
                keyboardType="numeric"
                value={temperature}
                onChangeText={setTemperature}
              />
            </Input>

            {/* KELEMBABAN */}
            <HStack alignItems="center" space="sm">
              <Wind size={18} color={PRIMARY} />
              <Text fontWeight="$medium">Kelembaban (%)</Text>
            </HStack>
            <Input>
              <InputField
                placeholder="Contoh: 80"
                keyboardType="numeric"
                value={humidity}
                onChangeText={setHumidity}
              />
            </Input>

            {/* BUTTON */}
            <Button bg={PRIMARY} mt="$4" onPress={calculateWater}>
              <ButtonText fontWeight="$bold">
                Hitung Target Harian
              </ButtonText>
            </Button>
          </VStack>
        </Box>

        {/* ===== RESULT CARD ===== */}
        {result && (
          <Box
            bg="#ECFDF5"
            p="$5"
            rounded="$2xl"
            alignItems="center"
            shadow="$1"
          >
            <Text fontSize="$md" color="#065F46">
              Target Minum Anda
            </Text>
            <Text fontSize="$3xl" fontWeight="$bold" color="#047857">
              {result} Liter
            </Text>
            <Text color="#047857">per hari</Text>
          </Box>
        )}

      </VStack>
    </ScrollView>
  );
}
