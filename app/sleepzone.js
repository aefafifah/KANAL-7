// app/sleepzone.js
import { useState, useEffect } from "react";
import { Box, Text, Input, InputField, Button, ButtonText } from "@gluestack-ui/themed";
import { saveSleepTime, getSleepTime } from "./sleepStore";

export default function SleepZone({
  title = "Zona Waktu Tidur Cerdas",
  buttonLabel = "Simpan Zona Tidur",
  bgColor = "$white",
  defaultValues = { sleep: "", wake: "" },
  onSaved = () => {},
}) {
  const [sleepTime, setSleepTime] = useState(defaultValues.sleep);
  const [wakeTime, setWakeTime] = useState(defaultValues.wake);

  // Load data dari storage jika ada
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

    // panggil callback props
    onSaved({ sleepTime, wakeTime });
  };

  return (
    <Box flex={1} p="$6" bg={bgColor}>
      <Text fontSize="$3xl" bold mb="$4">
        {title}
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
        <ButtonText>{buttonLabel}</ButtonText>
      </Button>
    </Box>
  );
}