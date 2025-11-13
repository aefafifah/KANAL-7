import React, { useState, useEffect } from "react";
import { ScrollView, Dimensions } from "react-native";
import { Button, ButtonText } from "@gluestack-ui/themed";
import {
  Text,
  Heading,
  HStack,
  VStack,
  Center,
  Box,
  Select,
  SelectTrigger,
  SelectInput,
  SelectPortal,
  SelectBackdrop,
  SelectContent,
  SelectItem,
  SelectDragIndicatorWrapper,
  SelectDragIndicator,
} from "@gluestack-ui/themed";
import { LineChart } from "react-native-chart-kit";
import dayjs from "dayjs";
import "dayjs/locale/id";
import {
  Sun,
  Moon,
  Droplets,
  Coffee,
  Flame,
  SunMedium,
  Snowflake,
} from "lucide-react-native";
import { useRouter } from "expo-router";
dayjs.locale("id");
const screenWidth = Dimensions.get("window").width;

const daerahJatim = [
  "Surabaya", "Malang", "Batu", "Kediri", "Blitar", "Madiun",
  "Mojokerto", "Pasuruan", "Probolinggo", "Lumajang", "Jember",
  "Banyuwangi", "Bondowoso", "Situbondo", "Sidoarjo", "Gresik",
  "Lamongan", "Tuban", "Bojonegoro", "Ngawi", "Magetan",
  "Ponorogo", "Pacitan", "Trenggalek", "Tulungagung", "Nganjuk",
  "Jombang", "Blitar Kab", "Kediri Kab", "Malang Kab", "Pasuruan Kab",
  "Probolinggo Kab", "Madiun Kab", "Mojokerto Kab", "Sumenep",
  "Pamekasan", "Sampang", "Bangkalan"
];

const generateDataDaerah = () => {
  const data = {};
  daerahJatim.forEach((nama) => {
    data[nama] = Array.from({ length: 5 }, (_, i) => {
      const suhu = Math.floor(Math.random() * 10) + 25;
      const rekomLiter = (2 + (suhu - 25) * 0.1).toFixed(1);
      const hari = ["Sen", "Sel", "Rab", "Kam", "Jum"][i];
      return { hari, suhu, rekomLiter: parseFloat(rekomLiter) };
    });
  });
  return data;
};

const dataPerDaerah = generateDataDaerah();

// 🌤️ Daftar rekomendasi per jam
const dataPerJam = {
  pagi: { suhu: 28, rekom: "0.5L air sebelum aktivitas", icon: Coffee },
  siang: { suhu: 34, rekom: "1L air, hindari terik matahari", icon: Sun },
  sore: { suhu: 30, rekom: "0.7L air setelah aktivitas", icon: Droplets },
  malam: { suhu: 26, rekom: "0.4L air hangat sebelum tidur", icon: Moon },
};

const InfoHari = ({ hari, suhu, rekomLiter }) => (
  <VStack
    alignItems="center"
    p={3}
    bg="$blue50"
    borderRadius={12}
    m={1}
    width={70}
    shadow={1}
  >
    <Text bold color="$blue800">
      {hari}
    </Text>
    <Text color="$blue700">{suhu}°C</Text>
    <Text fontSize={10}>{rekomLiter}L</Text>
  </VStack>
);

const ChartSuhuAir = ({ data, daerah }) => {
  const chartData = {
    labels: data.map((d) => d.hari),
    datasets: [
      {
        data: data.map((d) => d.suhu),
        color: () => "#f87171",
        strokeWidth: 2,
      },
      {
        data: data.map((d) => d.rekomLiter * 10),
        color: () => "#60a5fa",
        strokeWidth: 2,
      },
    ],
    legend: ["Suhu (°C)", "Rekomendasi Air (Liter x10)"],
  };

  return (
    <Center mt={4}>
      <Heading size="sm" mb={2}>
        Grafik Suhu & Rekomendasi Air ({daerah})
      </Heading>
      <LineChart
        data={chartData}
        width={screenWidth - 20}
        height={250}
        chartConfig={{
          backgroundColor: "#e0f2fe",
          backgroundGradientFrom: "#bfdbfe",
          backgroundGradientTo: "#93c5fd",
          decimalPlaces: 1,
          color: (opacity = 1) => `rgba(0, 0, 128, ${opacity})`,
          labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
        }}
        bezier
        style={{
          borderRadius: 16,
          marginVertical: 8,
        }}
      />
    </Center>
  );
};

const Stats = () => {
  const [selectedDaerah, setSelectedDaerah] = useState("Surabaya");
  const [reminder, setReminder] = useState({ icon: null, text: "" });
  const [waktuSekarang, setWaktuSekarang] = useState(null);
  const data = dataPerDaerah[selectedDaerah];
  const router = useRouter();
  const avgTemp =
    data.reduce((sum, item) => sum + item.suhu, 0) / data.length || 0;

  // 🔥 Reminder otomatis
  useEffect(() => {
    let pesan = "";
    let icon = null;
    if (avgTemp > 33) {
      pesan = "Hari ini panas, disarankan minum minimal 2.5 liter air.";
      icon = Flame;
    } else if (avgTemp >= 30) {
      pesan = "Cuaca cukup terik, cukupkan asupan air sekitar 2 liter.";
      icon = SunMedium;
    } else {
      pesan = "Cuaca sejuk, tetap minum setidaknya 1.8 liter air.";
      icon = Snowflake;
    }
    setReminder({ icon, text: pesan });
  }, [selectedDaerah]);

  // 🕒 Deteksi waktu otomatis (pagi/siang/sore/malam)
  useEffect(() => {
    const jam = new Date().getHours();
    let waktu = "pagi";
    if (jam >= 11 && jam < 15) waktu = "siang";
    else if (jam >= 15 && jam < 19) waktu = "sore";
    else if (jam >= 19 || jam < 5) waktu = "malam";
    setWaktuSekarang(dataPerJam[waktu]);
  }, []);

  const ReminderBox = () => {
    const Icon = reminder.icon;
    return (
      <Box mt={3} bg="$blue50" p={3} borderRadius={12} flexDirection="row" alignItems="center">
        {Icon && <Icon size={20} color="#2563eb" style={{ marginRight: 8 }} />}
        <Text color="$blue700" flexShrink={1}>
          {reminder.text}
        </Text>
      </Box>
    );
  };

  return (
    <ScrollView>
      <Center p={4} bg="$blue100" borderBottomRadius={20}>
        <Heading color="$blue900" mb={2}>
          Statistika Cuaca Jawa Timur
        </Heading>
        <Text color="$blue800">
          {dayjs().format("dddd, DD MMMM YYYY")}
        </Text>
        <ReminderBox />
      </Center>

      {/* Dropdown Pilihan Daerah */}
      <Center mt={4}>
        <Text mb={2} color="$blue700" bold>
          Pilih Daerah
        </Text>
        <Select selectedValue={selectedDaerah} onValueChange={(value) => setSelectedDaerah(value)}>
          <SelectTrigger variant="outline" width={250}>
            <SelectInput placeholder="Pilih daerah" />
          </SelectTrigger>
          <SelectPortal>
            <SelectBackdrop />
            <SelectContent>
              <SelectDragIndicatorWrapper>
                <SelectDragIndicator />
              </SelectDragIndicatorWrapper>
              {daerahJatim.map((daerah) => (
                <SelectItem key={daerah} label={daerah} value={daerah} />
              ))}
            </SelectContent>
          </SelectPortal>
        </Select>
      </Center>

      {/* Info rata-rata suhu */}
      <Center mt={3}>
        <Text color="$blue800">
          Suhu rata-rata di <Text bold>{selectedDaerah}</Text>:{" "}
          <Text bold>{avgTemp.toFixed(1)}°C</Text>
        </Text>
      </Center>

      {/* Info per hari */}
      <HStack justifyContent="center" flexWrap="wrap" my={4}>
        {data.map((item) => (
          <InfoHari key={item.hari} {...item} />
        ))}
      </HStack>

      <ChartSuhuAir data={data} daerah={selectedDaerah} />

      {/* Rekomendasi otomatis per jam */}
      {waktuSekarang && (
        <Center mt={6} mb={6}>
          <Heading size="sm" mb={2}>
            Rekomendasi Sekarang 🕒
          </Heading>
          <VStack
            alignItems="center"
            bg="$blue50"
            p={4}
            borderRadius={16}
            width={200}
            shadow={1}
          >
            <waktuSekarang.icon size={26} color="#2563eb" />
            <Text bold color="$blue800" mt={2}>
              {dayjs().format("HH:mm")} WIB
            </Text>
            <Text color="$blue700" mt={1}>
              Suhu: {waktuSekarang.suhu}°C
            </Text>
            <Text fontSize={12} textAlign="center" color="$blue600" mt={1}>
              {waktuSekarang.rekom}
            </Text>
          </VStack>
        </Center>
      )}
      <Button mt="$8" size="lg" bg="$blue600" borderRadius="$2xl" onPress={() => router.push("../jurnalwater")}> <Droplets color="white" size={20} /> <ButtonText ml="$2" color="white"> Buka Jurnal Minum </ButtonText> </Button>
       <Button mt="$8" size="lg" bg="$blue600" borderRadius="$2xl" onPress={() => router.push("../challengewater")}> <Droplets color="white" size={20} /> <ButtonText ml="$2" color="white"> Challenge Minum  </ButtonText> </Button>
    </ScrollView>
  );
};

export default Stats;
