import { useState, useEffect } from "react";
import { Box, Text, Input, InputField, Button, ButtonText } from "@gluestack-ui/themed";
import { saveSleepTime, getSleepTime } from "./sleepStore";

export default function SleepZone() {
  const [sleepTime, setSleepTime] = useState("");
  const [wakeTime, setWakeTime] = useState("");

  useEffect(() => {
    loadExisting();
  }, []);

  const loadExisting = async () => {
    const data = await getSleepTime();
    if (data) {
      setSleepTime(data.sleepTime);
      setWakeTime(data.wakeTime);
    }
  };

  const handleSave = async () => {
    if (!sleepTime || !wakeTime) {
      alert("Isi jam tidur dan jam bangun!");
      return;
    }

    await saveSleepTime(sleepTime, wakeTime);
    alert("Zona waktu tidur tersimpan!");
  };

  return (
    <Box flex={1} p="$6">
      <Text fontSize="$3xl" bold mb="$4">
        Zona Waktu Tidur Cerdas
      </Text>

      <Text mb="$2">Jam Tidur (contoh: 22:00)</Text>
      <Input mb="$3">
        <InputField
          placeholder="Jam tidur"
          value={sleepTime}
          onChangeText={setSleepTime}
        />
      </Input>

      <Text mb="$2">Jam Bangun (contoh: 06:00)</Text>
      <Input mb="$4">
        <InputField
          placeholder="Jam bangun"
          value={wakeTime}
          onChangeText={setWakeTime}
        />
      </Input>

      <Button onPress={handleSave}>
        <ButtonText>Simpan Zona Tidur</ButtonText>
      </Button>
    </Box>
  );
}
