import React, { useState, useEffect } from "react";
import { ScrollView, Dimensions, Alert } from "react-native";
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
  Cloud,
  CloudRain,
  Thermometer,
  Wind,
  CloudSnow,
  CloudLightning,
} from "lucide-react-native";
import { useRouter } from "expo-router";

dayjs.locale("id");
const screenWidth = Dimensions.get("window").width;

// 🌍 Koordinat daerah Jawa Timur (latitude, longitude)
const daerahJatim = [
  { nama: "Surabaya", lat: -7.2504, lon: 112.7688 },
  { nama: "Malang", lat: -7.9666, lon: 112.6326 },
  { nama: "Batu", lat: -7.8671, lon: 112.5239 },
  { nama: "Kediri", lat: -7.8480, lon: 112.0178 },
  { nama: "Blitar", lat: -8.0980, lon: 112.1681 },
  { nama: "Madiun", lat: -7.6298, lon: 111.5239 },
  { nama: "Mojokerto", lat: -7.4726, lon: 112.4333 },
  { nama: "Pasuruan", lat: -7.6469, lon: 112.8999 },
  { nama: "Probolinggo", lat: -7.7764, lon: 113.2037 },
  { nama: "Lumajang", lat: -8.1298, lon: 113.2250 },
  { nama: "Jember", lat: -8.1845, lon: 113.7031 },
  { nama: "Banyuwangi", lat: -8.2191, lon: 114.3691 },
  { nama: "Bondowoso", lat: -7.9135, lon: 113.8211 },
  { nama: "Situbondo", lat: -7.7052, lon: 113.9943 },
  { nama: "Sidoarjo", lat: -7.4478, lon: 112.7183 },
  { nama: "Gresik", lat: -7.1556, lon: 112.6519 },
  { nama: "Lamongan", lat: -7.1168, lon: 112.4165 },
  { nama: "Tuban", lat: -6.8977, lon: 112.0649 },
  { nama: "Bojonegoro", lat: -7.1500, lon: 111.8817 },
  { nama: "Ngawi", lat: -7.4058, lon: 111.4491 },
  { nama: "Magetan", lat: -7.6433, lon: 111.3566 },
  { nama: "Ponorogo", lat: -7.8651, lon: 111.4620 },
  { nama: "Pacitan", lat: -8.2068, lon: 111.0845 },
  { nama: "Trenggalek", lat: -8.0500, lon: 111.7167 },
  { nama: "Tulungagung", lat: -8.0656, lon: 111.9025 },
  { nama: "Nganjuk", lat: -7.6051, lon: 111.9036 },
  { nama: "Jombang", lat: -7.5741, lon: 112.2861 },
  { nama: "Blitar Kab", lat: -8.1333, lon: 112.2500 },
  { nama: "Kediri Kab", lat: -7.8333, lon: 112.1667 },
  { nama: "Malang Kab", lat: -8.1667, lon: 112.6667 },
  { nama: "Pasuruan Kab", lat: -7.7333, lon: 112.8333 },
  { nama: "Probolinggo Kab", lat: -7.8667, lon: 113.4167 },
  { nama: "Madiun Kab", lat: -7.6167, lon: 111.6500 },
  { nama: "Mojokerto Kab", lat: -7.5500, lon: 112.5000 },
  { nama: "Sumenep", lat: -7.0167, lon: 113.8667 },
  { nama: "Pamekasan", lat: -7.1568, lon: 113.4746 },
  { nama: "Sampang", lat: -7.1949, lon: 113.2416 },
  { nama: "Bangkalan", lat: -7.0451, lon: 112.7411 }
];

// 🌤️ Fungsi untuk mendapatkan deskripsi cuaca berdasarkan kode weather_code
const getWeatherDescription = (weatherCode) => {
  const weatherMap = {
    0: { desc: "Cerah", icon: SunMedium, color: "#fbbf24" },
    1: { desc: "Sebagian Cerah", icon: Cloud, color: "#94a3b8" },
    2: { desc: "Berawan", icon: Cloud, color: "#64748b" },
    3: { desc: "Mendung", icon: Cloud, color: "#475569" },
    45: { desc: "Kabut", icon: Cloud, color: "#cbd5e1" },
    48: { desc: "Kabut Beku", icon: CloudSnow, color: "#e2e8f0" },
    51: { desc: "Gerimis Ringan", icon: CloudRain, color: "#60a5fa" },
    53: { desc: "Gerimis Sedang", icon: CloudRain, color: "#3b82f6" },
    55: { desc: "Gerimis Lebat", icon: CloudRain, color: "#1d4ed8" },
    61: { desc: "Hujan Ringan", icon: CloudRain, color: "#60a5fa" },
    63: { desc: "Hujan Sedang", icon: CloudRain, color: "#3b82f6" },
    65: { desc: "Hujan Lebat", icon: CloudRain, color: "#1d4ed8" },
    71: { desc: "Salju Ringan", icon: Snowflake, color: "#93c5fd" },
    73: { desc: "Salju Sedang", icon: Snowflake, color: "#60a5fa" },
    75: { desc: "Salju Lebat", icon: Snowflake, color: "#3b82f6" },
    80: { desc: "Hujan Sesaat Ringan", icon: CloudRain, color: "#60a5fa" },
    81: { desc: "Hujan Sesaat Sedang", icon: CloudRain, color: "#3b82f6" },
    82: { desc: "Hujan Sesaat Lebat", icon: CloudRain, color: "#1d4ed8" },
    85: { desc: "Hujan Salju Ringan", icon: CloudSnow, color: "#93c5fd" },
    86: { desc: "Hujan Salju Lebat", icon: CloudSnow, color: "#60a5fa" },
    95: { desc: "Badai Petir", icon: CloudLightning, color: "#7c3aed" },
    96: { desc: "Badai Petir dengan Hujan Es", icon: CloudLightning, color: "#6d28d9" },
    99: { desc: "Badai Petir Lebat", icon: CloudLightning, color: "#5b21b6" }
  };
  
  return weatherMap[weatherCode] || { desc: "Tidak Diketahui", icon: Cloud, color: "#94a3b8" };
};

// 💧 Fungsi untuk menghitung rekomendasi air berdasarkan suhu dan kelembaban
const calculateWaterRecommendation = (temperature, humidity, weatherCondition) => {
  // Basis: 1.8 liter untuk suhu 25°C
  let baseWater = 1.8;
  
  // Penyesuaian berdasarkan suhu
  if (temperature > 35) {
    baseWater += 1.2; // Sangat panas
  } else if (temperature > 32) {
    baseWater += 0.8; // Panas
  } else if (temperature > 28) {
    baseWater += 0.4; // Hangat
  } else if (temperature < 20) {
    baseWater -= 0.3; // Dingin
  }
  
  // Penyesuaian berdasarkan kelembaban
  if (humidity < 40) {
    baseWater += 0.3; // Udara kering
  } else if (humidity > 80) {
    baseWater -= 0.2; // Udara lembab
  }
  
  // Penyesuaian berdasarkan kondisi cuaca
  if (weatherCondition.includes("Hujan") || weatherCondition.includes("Gerimis")) {
    baseWater -= 0.2; // Cuaca hujan
  } else if (weatherCondition.includes("Cerah") || weatherCondition.includes("Terik")) {
    baseWater += 0.3; // Cuaca cerah/terik
  }
  
  // Pastikan minimal 1.5 liter
  return Math.max(baseWater, 1.5).toFixed(1);
};

// 📋 Fungsi untuk mendapatkan rekomendasi detail
const getDetailedRecommendation = (temperature, humidity, weatherDesc, avgTemp) => {
  let recommendations = [];
  
  // Rekomendasi berdasarkan suhu
  if (temperature > 35) {
    recommendations.push("• Minum air dingin untuk menurunkan suhu tubuh");
    recommendations.push("• Hindari aktivitas fisik berat di luar ruangan");
    recommendations.push("• Gunakan pakaian tipis dan berwarna terang");
  } else if (temperature > 30) {
    recommendations.push("• Minum air setiap 30 menit");
    recommendations.push("• Gunakan tabir surya jika keluar rumah");
    recommendations.push("• Istirahat di tempat teduh");
  } else if (temperature < 22) {
    recommendations.push("• Minum air hangat untuk menjaga suhu tubuh");
    recommendations.push("• Gunakan pakaian yang cukup hangat");
  }
  
  // Rekomendasi berdasarkan kelembaban
  if (humidity < 40) {
    recommendations.push("• Gunakan pelembab kulit untuk mencegah dehidrasi kulit");
    recommendations.push("• Hindari mandi air panas terlalu lama");
  } else if (humidity > 75) {
    recommendations.push("• Kurangi aktivitas yang membuat banyak berkeringat");
    recommendations.push("• Gunakan pakaian yang menyerap keringat");
  }
  
  // Rekomendasi berdasarkan kondisi cuaca
  if (weatherDesc.includes("Hujan") || weatherDesc.includes("Gerimis")) {
    recommendations.push("• Tetap minum meski cuaca dingin atau hujan");
    recommendations.push("• Siapkan payung atau jas hujan");
  }
  
  if (weatherDesc.includes("Cerah") || weatherDesc.includes("Terik")) {
    recommendations.push("• Gunakan topi atau payung saat berada di luar");
    recommendations.push("• Cari tempat teduh secara berkala");
  }
  
  // Rekomendasi umum
  recommendations.push("• Hindari minuman berkafein berlebihan");
  recommendations.push("• Konsumsi buah-buahan dengan kandungan air tinggi");
  recommendations.push("• Dengarkan sinyal haus dari tubuh Anda");
  
  return recommendations;
};

// ===================== KOMPONEN =====================

const InfoHari = ({ hari, suhu, rekomLiter, weatherCode, index }) => {
  const isHot = suhu >= 30;
  const weatherInfo = getWeatherDescription(weatherCode);
  const WeatherIcon = weatherInfo.icon;
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
      borderLeftColor={isHot ? "#EF4444" : weatherInfo.color}
    >
      {/* LEFT */}
      <HStack space="sm" alignItems="center">
        <WeatherIcon size={24} color={weatherInfo.color} />
        <VStack>
          <Text fontWeight="$bold" fontSize="$md" color="$blue900">
            {hari}
          </Text>
          <Text fontSize="$xs" color="$gray500">
            {label}
          </Text>
        </VStack>
      </HStack>

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

const WeatherInfoCard = ({ weatherData, selectedDaerah, waterRecommendation }) => {
  if (!weatherData) return null;
  
  const currentWeather = getWeatherDescription(weatherData.weather_code);
  const WeatherIcon = currentWeather.icon;
  
  return (
    <Box bg="$white" rounded="$2xl" p="$4" shadow="$1" mx="$3" mt="$4">
      <Heading size="sm" mb="$3">Cuaca Saat Ini</Heading>
      <HStack justifyContent="space-between" alignItems="center" mb="$4">
        <VStack>
          <HStack alignItems="center" space="sm">
            <WeatherIcon size={32} color={currentWeather.color} />
            <Text bold fontSize="$2xl" color="$blue900">
              {weatherData.temperature_2m}°C
            </Text>
          </HStack>
          <Text color="$blue700">{currentWeather.desc}</Text>
          <Text fontSize="$sm" color="$gray500">{selectedDaerah.nama}</Text>
        </VStack>
        
        <VStack alignItems="flex-end">
          <Text fontSize="$sm" color="$gray500">Rekomendasi Air</Text>
          <Text bold fontSize="$xl" color="#2563EB">{waterRecommendation}L</Text>
          <Text fontSize="$xs" color="$gray500">per hari</Text>
        </VStack>
      </HStack>
      
      <HStack justifyContent="space-around" mt="$3" pt="$3" borderTopWidth={1} borderTopColor="$gray200">
        <VStack alignItems="center">
          <Droplets size={20} color="#4b5563" />
          <Text fontSize="$xs" color="$gray600" mt="$1">Kelembaban</Text>
          <Text bold fontSize="$sm">{weatherData.relative_humidity_2m}%</Text>
        </VStack>
        
        <VStack alignItems="center">
          <CloudRain size={20} color="#1d4ed8" />
          <Text fontSize="$xs" color="$gray600" mt="$1">Curah Hujan</Text>
          <Text bold fontSize="$sm">{weatherData.precipitation || 0}mm</Text>
        </VStack>
        
        <VStack alignItems="center">
          <Thermometer size={20} color="#dc2626" />
          <Text fontSize="$xs" color="$gray600" mt="$1">Kode Cuaca</Text>
          <Text bold fontSize="$sm">{weatherData.weather_code}</Text>
        </VStack>
      </HStack>
    </Box>
  );
};

const RecommendationCard = ({ recommendations }) => {
  if (!recommendations || recommendations.length === 0) return null;
  
  return (
    <Box bg="$white" rounded="$2xl" p="$4" shadow="$1" mx="$3" mt="$4">
      <Heading size="sm" mb="$3">Rekomendasi Kesehatan</Heading>
      <VStack space="$2">
        {recommendations.map((rec, index) => (
          <HStack key={index} space="sm" alignItems="flex-start">
            <Text color="#2563EB" fontSize="$sm">•</Text>
            <Text flex={1} fontSize="$sm" color="$gray700">
              {rec}
            </Text>
          </HStack>
        ))}
      </VStack>
      <Text fontSize="$xs" color="$gray500" mt="$3" textAlign="center">
        Rekomendasi disesuaikan dengan kondisi cuaca saat ini
      </Text>
    </Box>
  );
};

// ===================== SCREEN UTAMA =====================

const Stats = () => {
  const [selectedDaerah, setSelectedDaerah] = useState(daerahJatim[0]);
  const [reminder, setReminder] = useState({ icon: null, text: "" });
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [forecastData, setForecastData] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [waterRecommendation, setWaterRecommendation] = useState("1.8");
  const router = useRouter();

  // Data per jam untuk rekomendasi waktu
  const dataPerJam = {
    pagi: { suhu: 28, rekom: "0.5L air sebelum aktivitas", icon: Coffee },
    siang: { suhu: 34, rekom: "1L air, hindari terik matahari", icon: Sun },
    sore: { suhu: 30, rekom: "0.7L air setelah aktivitas", icon: Droplets },
    malam: { suhu: 26, rekom: "0.4L air hangat sebelum tidur", icon: Moon },
  };
  const [waktuSekarang, setWaktuSekarang] = useState(null);

  // 🌤️ Fungsi untuk mengambil data cuaca dari Open-Meteo API
  const fetchWeatherData = async (latitude, longitude) => {
    try {
      setLoading(true);
      
      const response = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,precipitation,weather_code&daily=weather_code,temperature_2m_max,temperature_2m_min&timezone=Asia%2FJakarta&forecast_days=5`
      );
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      // Format data untuk 5 hari ke depan
      const dailyForecast = data.daily.time.map((date, index) => {
        const day = dayjs(date).format('ddd');
        const suhu = data.daily.temperature_2m_max[index];
        const weatherCode = data.daily.weather_code[index];
        const weatherInfo = getWeatherDescription(weatherCode);
        
        // Hitung rekomendasi air berdasarkan suhu
        const rekomLiter = calculateWaterRecommendation(
          suhu, 
          data.current.relative_humidity_2m,
          weatherInfo.desc
        );
        
        return {
          hari: day,
          suhu: Math.round(suhu),
          rekomLiter: parseFloat(rekomLiter),
          weatherCode: weatherCode
        };
      });
      
      setWeatherData(data.current);
      setForecastData(dailyForecast);
      
      // Hitung rekomendasi berdasarkan data saat ini
      if (data.current) {
        const currentTemp = data.current.temperature_2m;
        const currentHumidity = data.current.relative_humidity_2m;
        const currentWeatherCode = data.current.weather_code;
        const weatherInfo = getWeatherDescription(currentWeatherCode);
        
        // Hitung rekomendasi air saat ini
        const waterRec = calculateWaterRecommendation(
          currentTemp,
          currentHumidity,
          weatherInfo.desc
        );
        setWaterRecommendation(waterRec);
        
        // Hitung rata-rata suhu 5 hari
        const avgTemp = dailyForecast.reduce((sum, item) => sum + item.suhu, 0) / dailyForecast.length;
        
        // Generate rekomendasi detail
        const detailedRecs = getDetailedRecommendation(
          currentTemp, 
          currentHumidity, 
          weatherInfo.desc,
          avgTemp
        );
        
        setRecommendations(detailedRecs);
        
        // Set reminder berdasarkan kondisi
        let reminderText = "";
        let reminderIcon = Droplets;
        
        if (currentTemp > 35) {
          reminderText = `Suhu sangat panas (${currentTemp}°C), minum minimal 3 liter air hari ini!`;
          reminderIcon = Flame;
        } else if (currentTemp > 30) {
          reminderText = `Cuaca cukup panas (${currentTemp}°C), targetkan minum 2.5 liter air.`;
          reminderIcon = SunMedium;
        } else if (currentTemp > 25) {
          reminderText = `Cuaca normal (${currentTemp}°C), minum setidaknya 2 liter air.`;
          reminderIcon = Cloud;
        } else {
          reminderText = `Cuaca sejuk (${currentTemp}°C), tetap jaga asupan air minimal 1.8 liter.`;
          reminderIcon = Snowflake;
        }
        
        // Tambahkan info kelembaban
        reminderText += ` Kelembaban ${currentHumidity}%.`;
        
        setReminder({ 
          icon: reminderIcon, 
          text: reminderText 
        });
      }
      
    } catch (error) {
      console.error("Error fetching weather data:", error);
      Alert.alert("Error", "Gagal mengambil data cuaca. Menggunakan data simulasi.");
      
      // Fallback ke data simulasi
      const fallbackData = Array.from({ length: 5 }, (_, i) => {
        const hari = ["Sen", "Sel", "Rab", "Kam", "Jum"][i];
        const suhu = Math.floor(Math.random() * 10) + 25;
        const rekomLiter = calculateWaterRecommendation(suhu, 65, "Cerah");
        return { 
          hari, 
          suhu, 
          rekomLiter: parseFloat(rekomLiter),
          weatherCode: 0 
        };
      });
      
      setForecastData(fallbackData);
      setRecommendations([
        "• Minum air secara teratur",
        "• Hindari minuman berkafein berlebihan",
        "• Konsumsi buah dengan kandungan air tinggi"
      ]);
    } finally {
      setLoading(false);
    }
  };

  // 📍 Fetch data cuaca saat daerah berubah
  useEffect(() => {
    if (selectedDaerah) {
      fetchWeatherData(selectedDaerah.lat, selectedDaerah.lon);
    }
  }, [selectedDaerah]);

  // Set waktu sekarang
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
        <Text flexShrink={1} fontSize="$sm">
          {reminder.text}
        </Text>
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

        {/* SELECT DAERAH */}
        <Box bg="$white" p="$4" rounded="$2xl" shadow="$1" mx="$3">
          <Text bold mb="$2">Pilih Daerah</Text>
          <Select
            selectedValue={selectedDaerah.nama}
            onValueChange={(value) => {
              const daerah = daerahJatim.find(d => d.nama === value);
              setSelectedDaerah(daerah);
            }}
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
                  <SelectItem key={daerah.nama} label={daerah.nama} value={daerah.nama} />
                ))}
              </SelectContent>
            </SelectPortal>
          </Select>

          {forecastData.length > 0 && (
            <Text mt="$3" color="$blue800">
              Rata-rata suhu 5 hari:{" "}
              <Text bold>
                {(
                  forecastData.reduce((sum, item) => sum + item.suhu, 0) / 
                  forecastData.length
                ).toFixed(1)}°C
              </Text>
            </Text>
          )}
        </Box>

        {/* CUACA SAAT INI */}
        {loading ? (
          <Box bg="$white" p="$4" rounded="$2xl" shadow="$1" mx="$3" alignItems="center">
            <Text>Memuat data cuaca...</Text>
          </Box>
        ) : (
          <>
            <WeatherInfoCard 
              weatherData={weatherData} 
              selectedDaerah={selectedDaerah}
              waterRecommendation={waterRecommendation}
            />

            {/* REKOMENDASI DETAIL */}
            <RecommendationCard recommendations={recommendations} />

            {/* INFO HARIAN */}
            {forecastData.length > 0 && (
              <Box bg="$white" p="$4" rounded="$2xl" shadow="$1" mx="$3">
                <Text bold mb="$3">Prakiraan 5 Hari ke Depan</Text>
                <VStack>
                  {forecastData.map((item, index) => (
                    <InfoHari 
                      key={index} 
                      {...item} 
                      index={index} 
                    />
                  ))}
                </VStack>
              </Box>
            )}

            {/* CHART */}
            {forecastData.length > 0 && (
              <ChartSuhuAir data={forecastData} daerah={selectedDaerah.nama} />
            )}
          </>
        )}

        {/* REKOMENDASI WAKTU SAAT INI */}
        {waktuSekarang && (
          <Box bg="$white" p="$4" rounded="$2xl" shadow="$1" mx="$3">
            <Heading size="sm" mb="$2">
              Rekomendasi Sekarang 🕒
            </Heading>
            <VStack alignItems="center">
              <waktuSekarang.icon size={26} color="#2563EB" />
              <Text bold mt="$2">{dayjs().format("HH:mm")} WIB</Text>
              <Text fontSize={12} textAlign="center" mt="$1">
                {waktuSekarang.rekom}
              </Text>
            </VStack>
          </Box>
        )}

        {/* NAVIGASI KE FITUR LAIN */}
        <VStack space="md" mx="$3" mb="$10">
          <Button 
            size="lg" 
            bg="$blue600" 
            borderRadius="$2xl" 
            onPress={() => router.push("../jurnalwater")}
          >
            <Droplets color="white" size={20} />
            <ButtonText ml="$2" color="white">Buka Jurnal Minum</ButtonText>
          </Button>
          
          <Button 
            size="lg" 
            bg="$blue600" 
            borderRadius="$2xl" 
            onPress={() => router.push("../challengewater")}
          >
            <Droplets color="white" size={20} />
            <ButtonText ml="$2" color="white">Challenge Minum</ButtonText>
          </Button>
        </VStack>
      </VStack>
    </ScrollView>
  );
};

export default Stats;