import { useState } from "react";
import { Box, Text, Input, InputField, Button, ButtonText } from "@gluestack-ui/themed";

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

    let kebutuhan = weight * 30; // dasar per ml

    // Faktor usia
    if (age < 30) kebutuhan *= 1.10;
    else if (age <= 55) kebutuhan *= 1.05;
    else kebutuhan *= 1.03;

    // Faktor suhu
    if (temperature >= 32) kebutuhan *= 1.15;

    // Faktor kelembaban
    if (humidity > 75) kebutuhan *= 1.08;

    const liter = (kebutuhan / 1000).toFixed(2);

    setResult(liter);
  };

  return (
    <Box flex={1} p="$6">
      <Text fontSize="$3xl" bold mb="$4">
        Target Harian Dinamis
      </Text>

      <Text mb="$2">Berat Badan (kg)</Text>
      <Input mb="$3">
        <InputField
          placeholder="Contoh: 60"
          keyboardType="numeric"
          value={weight}
          onChangeText={setWeight}
        />
      </Input>

      <Text mb="$2">Usia (tahun)</Text>
      <Input mb="$3">
        <InputField
          placeholder="Contoh: 25"
          keyboardType="numeric"
          value={age}
          onChangeText={setAge}
        />
      </Input>

      <Text mb="$2">Suhu Harian (°C)</Text>
      <Input mb="$3">
        <InputField
          placeholder="Contoh: 34"
          keyboardType="numeric"
          value={temperature}
          onChangeText={setTemperature}
        />
      </Input>

      <Text mb="$2">Kelembaban (%)</Text>
      <Input mb="$5">
        <InputField
          placeholder="Contoh: 80"
          keyboardType="numeric"
          value={humidity}
          onChangeText={setHumidity}
        />
      </Input>

      <Button onPress={calculateWater} mb="$4">
        <ButtonText>Hitung Target Harian</ButtonText>
      </Button>

      {result && (
        <Box mt="$4">
          <Text fontSize="$xl" bold>
            Target Minum Anda:
          </Text>
          <Text fontSize="$2xl" color="$blue600">
            {result} Liter / hari
          </Text>
        </Box>
      )}
    </Box>
  );
}
