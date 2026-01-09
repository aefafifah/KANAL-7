import React, { useState, useEffect } from "react";
import { ScrollView, Dimensions } from "react-native";
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

dayjs.locale("id");
const screenWidth = Dimensions.get("window").width;

/* ===================== DATA ===================== */

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
    data[nama] = Array.from({ length: 7 }, (_, i) => {
      const suhu = Math.floor(Math.random() * 10) + 25;
      const rekomLiter = (2 + (suhu - 25) * 0.1).toFixed(1);
      // const hari = ["Sen", "Sel", "Rab", "Kam", "Jum"][i];
      const hari = ["Sen", "Sel", "Rab", "Kam", "Jum", "Sab", "Min"][i];
      return { hari, suhu, rekomLiter: parseFloat(rekomLiter) };
    });
  });
  return data;
};

const dataPerDaerah = generateDataDaerah();

const dataPerJam = {
  pagi: { suhu: 28, rekom: "0.5L air sebelum aktivitas", icon: Coffee },
  siang: { suhu: 34, rekom: "1L air, hindari terik matahari", icon: Sun },
  sore: { suhu: 30, rekom: "0.7L air setelah aktivitas", icon: Droplets },
  malam: { suhu: 26, rekom: "0.4L air hangat sebelum tidur", icon: Moon },
};

const InfoHari = ({ hari, suhu, rekomLiter, index }) => {
  const isHot = suhu >= 30;
  const label =
    index === 0
      ? "Hari ini"
      : index === 1
        ? "Besok"
        : "Perkiraan";

  return (
    <HStack
      bg="$white"
      rounded="$2xl"
      p="$4"
      mb="$3"
      alignItems="center"
      justifyContent="space-between"
      shadow="$1"
      borderLeftWidth={5}
      borderLeftColor={isHot ? "#EF4444" : "#2563EB"}
    >
      {/* LEFT */}
      <VStack>
        <Text fontWeight="$bold" fontSize="$md" color="$blue900">
          {hari}
        </Text>
        <Text fontSize="$xs" color="$gray500">
          {label}
        </Text>
      </VStack>

      {/* RIGHT */}
      <HStack space="md" alignItems="center">
        {/* SUHU */}
        <Box
          bg={isHot ? "#FEE2E2" : "#DBEAFE"}
          px="$3"
          py="$1"
          rounded="$full"
        >
          <Text
            fontWeight="$semibold"
            color={isHot ? "#B91C1C" : "#1D4ED8"}
          >
            {suhu}°C
          </Text>
        </Box>

        {/* AIR */}
        <Box
          bg="#EFF6FF"
          px="$3"
          py="$1"
          rounded="$full"
        >
          <Text fontWeight="$semibold" color="#2563EB">
            {rekomLiter} L
          </Text>
        </Box>
      </HStack>
    </HStack>
  );
};



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
    <Box bg="$white" rounded="$2xl" p="$4" shadow="$1" mx="$3" mt="$4">
      <Heading size="sm" mb="$2">
        Grafik Suhu & Rekomendasi ({daerah})
      </Heading>

      <LineChart
        data={chartData}
        width={screenWidth - 64}
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
        style={{ borderRadius: 16 }}
      />
    </Box>
  );
};

/* ===================== SCREEN ===================== */

const Stats = () => {
  const [selectedDaerah, setSelectedDaerah] = useState("Surabaya");
  const [reminder, setReminder] = useState({ icon: null, text: "" });
  const [waktuSekarang, setWaktuSekarang] = useState(null);

  const data = dataPerDaerah[selectedDaerah];
  const avgTemp =
    data.reduce((sum, item) => sum + item.suhu, 0) / data.length || 0;

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
      <HStack
        bg="#DBEAFE"
        p="$3"
        rounded="$xl"
        alignItems="center"
        space="sm"
        mt="$3"
      >
        {Icon && <Icon size={20} color="#2563EB" />}
        <Text flexShrink={1}>{reminder.text}</Text>
      </HStack>
    );
  };

  return (
    <ScrollView style={{ backgroundColor: "#EEF2FF" }}>
      <VStack space="lg" py="$4">

        {/* HEADER */}
        <Box bg="$white" p="$4" rounded="$2xl" shadow="$1" mx="$3">
          <Heading color="$blue900">
            Statistika Cuaca Jawa Timur
          </Heading>
          <Text color="$blue800">
            {dayjs().format("dddd, DD MMMM YYYY")}
          </Text>
          <ReminderBox />
        </Box>

        {/* SELECT */}
        <Box bg="$white" p="$4" rounded="$2xl" shadow="$1" mx="$3">
          <Text bold mb="$2">Pilih Daerah</Text>
          <Select
            selectedValue={selectedDaerah}
            onValueChange={(value) => setSelectedDaerah(value)}
          >
            <SelectTrigger variant="outline">
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

          <Text mt="$3" color="$blue800">
            Suhu rata-rata: <Text bold>{avgTemp.toFixed(1)}°C</Text>
          </Text>
        </Box>

        {/* INFO HARIAN */}
        <Box bg="$white" p="$4" rounded="$2xl" shadow="$1" mx="$3">
          <Text bold mb="$3">Perkiraan Harian</Text>
          <VStack>
            {data.map((item) => (
              <InfoHari key={item.hari} {...item} />
            ))}
          </VStack>

        </Box>

        {/* CHART */}
        <ChartSuhuAir data={data} daerah={selectedDaerah} />

        {/* REKOMENDASI */}
        {waktuSekarang && (
          <Box bg="$white" p="$4" rounded="$2xl" shadow="$1" mx="$3" mb="$10">
            <Heading size="sm" mb="$2">
              Rekomendasi Sekarang 🕒
            </Heading>
            <VStack alignItems="center">
              <waktuSekarang.icon size={26} color="#2563EB" />
              <Text bold mt="$2">{dayjs().format("HH:mm")} WIB</Text>
              <Text>Suhu: {waktuSekarang.suhu}°C</Text>
              <Text fontSize={12} textAlign="center">
                {waktuSekarang.rekom}
              </Text>
            </VStack>
          </Box>
        )}
      </VStack>
    </ScrollView>
  );
};

export default Stats;
