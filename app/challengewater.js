import React, { useState, useEffect } from "react";
import { ScrollView, Dimensions, Alert, RefreshControl } from "react-native";
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
  Divider,
  Progress,
  ProgressFilledTrack,
} from "@gluestack-ui/themed";
import { LineChart, BarChart } from "react-native-chart-kit";
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
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle,
  Users,
  Activity,
  Droplet,
  ThermometerSun,
  Waves,
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
    0: { desc: "Cerah", icon: SunMedium, color: "#fbbf24", risk: "sedang" },
    1: { desc: "Sebagian Cerah", icon: Cloud, color: "#94a3b8", risk: "rendah" },
    2: { desc: "Berawan", icon: Cloud, color: "#64748b", risk: "rendah" },
    3: { desc: "Mendung", icon: Cloud, color: "#475569", risk: "rendah" },
    45: { desc: "Kabut", icon: Cloud, color: "#cbd5e1", risk: "rendah" },
    48: { desc: "Kabut Beku", icon: CloudSnow, color: "#e2e8f0", risk: "rendah" },
    51: { desc: "Gerimis Ringan", icon: CloudRain, color: "#60a5fa", risk: "rendah" },
    53: { desc: "Gerimis Sedang", icon: CloudRain, color: "#3b82f6", risk: "rendah" },
    55: { desc: "Gerimis Lebat", icon: CloudRain, color: "#1d4ed8", risk: "sedang" },
    61: { desc: "Hujan Ringan", icon: CloudRain, color: "#60a5fa", risk: "rendah" },
    63: { desc: "Hujan Sedang", icon: CloudRain, color: "#3b82f6", risk: "sedang" },
    65: { desc: "Hujan Lebat", icon: CloudRain, color: "#1d4ed8", risk: "tinggi" },
    71: { desc: "Salju Ringan", icon: Snowflake, color: "#93c5fd", risk: "rendah" },
    73: { desc: "Salju Sedang", icon: Snowflake, color: "#60a5fa", risk: "sedang" },
    75: { desc: "Salju Lebat", icon: Snowflake, color: "#3b82f6", risk: "tinggi" },
    80: { desc: "Hujan Sesaat Ringan", icon: CloudRain, color: "#60a5fa", risk: "rendah" },
    81: { desc: "Hujan Sesaat Sedang", icon: CloudRain, color: "#3b82f6", risk: "sedang" },
    82: { desc: "Hujan Sesaat Lebat", icon: CloudRain, color: "#1d4ed8", risk: "tinggi" },
    85: { desc: "Hujan Salju Ringan", icon: CloudSnow, color: "#93c5fd", risk: "sedang" },
    86: { desc: "Hujan Salju Lebat", icon: CloudSnow, color: "#60a5fa", risk: "tinggi" },
    95: { desc: "Badai Petir", icon: CloudLightning, color: "#7c3aed", risk: "tinggi" },
    96: { desc: "Badai Petir dengan Hujan Es", icon: CloudLightning, color: "#6d28d9", risk: "tinggi" },
    99: { desc: "Badai Petir Lebat", icon: CloudLightning, color: "#5b21b6", risk: "tinggi" }
  };
  
  return weatherMap[weatherCode] || { desc: "Tidak Diketahui", icon: Cloud, color: "#94a3b8", risk: "rendah" };
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

// 📊 Fungsi untuk menghitung statistik
const calculateStatistics = (forecastData, currentWeather) => {
  const temperatures = forecastData.map(d => d.suhu);
  const waterRecommendations = forecastData.map(d => d.rekomLiter);
  
  return {
    avgTemperature: (temperatures.reduce((a, b) => a + b, 0) / temperatures.length).toFixed(1),
    maxTemperature: Math.max(...temperatures),
    minTemperature: Math.min(...temperatures),
    avgWaterRecommendation: (waterRecommendations.reduce((a, b) => a + b, 0) / waterRecommendations.length).toFixed(1),
    totalWaterWeek: (waterRecommendations.reduce((a, b) => a + b, 0)).toFixed(1),
    temperatureTrend: temperatures[temperatures.length - 1] > temperatures[0] ? "naik" : "turun",
    temperatureChange: (temperatures[temperatures.length - 1] - temperatures[0]).toFixed(1),
    riskLevel: currentWeather.risk,
    comfortIndex: calculateComfortIndex(currentWeather.temperature_2m, currentWeather.relative_humidity_2m),
    dehydrationRisk: calculateDehydrationRisk(currentWeather.temperature_2m, currentWeather.relative_humidity_2m)
  };
};

// 😌 Fungsi untuk menghitung indeks kenyamanan
const calculateComfortIndex = (temperature, humidity) => {
  // THI (Temperature Humidity Index) sederhana
  const thi = temperature - (0.55 * (1 - (humidity / 100)) * (temperature - 14.5));
  
  if (thi < 15) return { level: "Sangat Dingin", color: "#3b82f6", value: 20 };
  if (thi < 20) return { level: "Dingin", color: "#60a5fa", value: 40 };
  if (thi < 27) return { level: "Nyaman", color: "#10b981", value: 80 };
  if (thi < 30) return { level: "Agak Panas", color: "#f59e0b", value: 60 };
  if (thi < 35) return { level: "Panas", color: "#f97316", value: 40 };
  return { level: "Sangat Panas", color: "#ef4444", value: 20 };
};

// 💀 Fungsi untuk menghitung risiko dehidrasi
const calculateDehydrationRisk = (temperature, humidity) => {
  let risk = 30; // Base risk
  
  if (temperature > 35) risk += 50;
  else if (temperature > 30) risk += 30;
  else if (temperature > 25) risk += 10;
  
  if (humidity < 40) risk += 20;
  else if (humidity < 60) risk += 10;
  
  if (risk > 100) risk = 100;
  
  let level = "rendah";
  if (risk > 70) level = "tinggi";
  else if (risk > 40) level = "sedang";
  
  return { value: risk, level };
};

// 📋 Fungsi untuk mendapatkan rekomendasi detail
const getDetailedRecommendation = (temperature, humidity, weatherDesc, stats) => {
  let recommendations = [];
  
  // Rekomendasi berdasarkan suhu
  if (temperature > 35) {
    recommendations.push("• Minum air dingin untuk menurunkan suhu tubuh");
    recommendations.push("• Hindari aktivitas fisik berat di luar ruangan 11:00-15:00");
    recommendations.push("• Gunakan pakaian tipis dan berwarna terang");
    recommendations.push(`• Target minum air: ${(stats.avgWaterRecommendation * 1.2).toFixed(1)}L (20% lebih banyak)`);
  } else if (temperature > 30) {
    recommendations.push("• Minum air setiap 30 menit saat beraktivitas");
    recommendations.push("• Gunakan tabir surya SPF 30+ jika keluar rumah");
    recommendations.push("• Istirahat di tempat teduh setiap 2 jam");
    recommendations.push(`• Target minum air: ${stats.avgWaterRecommendation}L`);
  } else if (temperature < 22) {
    recommendations.push("• Minum air hangat untuk menjaga suhu tubuh");
    recommendations.push("• Gunakan pakaian yang cukup hangat");
    recommendations.push("• Konsumsi makanan hangat dan berkuah");
    recommendations.push(`• Target minum air: ${(stats.avgWaterRecommendation * 0.9).toFixed(1)}L (10% lebih sedikit)`);
  }
  
  // Rekomendasi berdasarkan kelembaban
  if (humidity < 40) {
    recommendations.push("• Gunakan pelembab kulit untuk mencegah dehidrasi kulit");
    recommendations.push("• Hindari mandi air panas terlalu lama");
    recommendations.push("• Gunakan humidifier di ruangan tertutup");
  } else if (humidity > 75) {
    recommendations.push("• Kurangi aktivitas yang membuat banyak berkeringat");
    recommendations.push("• Gunakan pakaian yang menyerap keringat (katun)");
    recommendations.push("• Pastikan ventilasi udara baik di dalam ruangan");
  }
  
  // Rekomendasi berdasarkan kondisi cuaca
  if (weatherDesc.includes("Hujan") || weatherDesc.includes("Gerimis")) {
    recommendations.push("• Tetap minum meski cuaca dingin atau hujan");
    recommendations.push("• Siapkan payung atau jas hujan");
    recommendations.push("• Hindari area rawan banjir dan longsor");
  }
  
  if (weatherDesc.includes("Cerah") || weatherDesc.includes("Terik")) {
    recommendations.push("• Gunakan topi atau payung saat berada di luar");
    recommendations.push("• Cari tempat teduh secara berkala");
    recommendations.push("• Gunakan kacamata hitam untuk melindungi mata");
  }
  
  if (weatherDesc.includes("Badai") || weatherDesc.includes("Petir")) {
    recommendations.push("• Segera cari tempat berlindung");
    recommendations.push("• Hindari area terbuka dan benda logam");
    recommendations.push("• Matikan perangkat elektronik yang tidak perlu");
  }
  
  // Rekomendasi berdasarkan statistik
  if (stats.temperatureTrend === "naik") {
    recommendations.push(`• Suhu cenderung naik ${Math.abs(stats.temperatureChange)}°C, siapkan lebih banyak air`);
  } else if (stats.temperatureTrend === "turun") {
    recommendations.push(`• Suhu cenderung turun ${Math.abs(stats.temperatureChange)}°C, sesuaikan pakaian`);
  }
  
  if (stats.dehydrationRisk.level === "tinggi") {
    recommendations.push("• Risiko dehidrasi TINGGI, minum air sebelum merasa haus");
    recommendations.push("• Pantau warna urine (harus jernih hingga kuning muda)");
  }
  
  // Rekomendasi umum
  recommendations.push("• Hindari minuman berkafein berlebihan (maks 2-3 cangkir/hari)");
  recommendations.push("• Konsumsi buah-buahan dengan kandungan air tinggi (semangka, melon, jeruk)");
  recommendations.push("• Dengarkan sinyal haus dari tubuh Anda");
  recommendations.push("• Minum segelas air setelah bangun tidur");
  
  return recommendations;
};

// ===================== KOMPONEN BARU =====================

const StatCard = ({ icon: Icon, title, value, subtitle, color, trend }) => {
  return (
    <Box 
      bg="$white" 
      p="$4" 
      rounded="$2xl" 
      shadow="$1" 
      flex={1}
      minWidth={120}
      mx="$1"
    >
      <HStack alignItems="center" space="sm" mb="$2">
        <Box p="$2" bg={`${color}20`} rounded="$full">
          <Icon size={18} color={color} />
        </Box>
        <Text fontSize="$xs" color="$gray600" fontWeight="$medium">
          {title}
        </Text>
      </HStack>
      <Text fontSize="$xl" fontWeight="$bold" color="$blue900">
        {value}
      </Text>
      <HStack alignItems="center" mt="$1">
        {trend === "up" && <TrendingUp size={14} color="#10b981" />}
        {trend === "down" && <TrendingDown size={14} color="#ef4444" />}
        <Text fontSize="$xs" color="$gray500" ml="$1">
          {subtitle}
        </Text>
      </HStack>
    </Box>
  );
};

const RiskIndicator = ({ level, value }) => {
  const getColor = (level) => {
    switch(level) {
      case "tinggi": return "#ef4444";
      case "sedang": return "#f59e0b";
      case "rendah": return "#10b981";
      default: return "#6b7280";
    }
  };

  const getIcon = (level) => {
    switch(level) {
      case "tinggi": return AlertTriangle;
      case "sedang": return AlertTriangle;
      case "rendah": return CheckCircle;
      default: return CheckCircle;
    }
  };

  const Icon = getIcon(level);
  const color = getColor(level);

  return (
    <HStack 
      bg={`${color}10`} 
      p="$3" 
      rounded="$xl" 
      alignItems="center" 
      space="sm"
    >
      <Icon size={20} color={color} />
      <VStack flex={1}>
        <Text fontSize="$sm" fontWeight="$medium" color="$blue900">
          Risiko Dehidrasi: {level.toUpperCase()}
        </Text>
        <Progress value={value} size="sm" mt="$1">
          <ProgressFilledTrack bg={color} />
        </Progress>
      </VStack>
      <Text fontSize="$sm" fontWeight="$bold" color={color}>
        {value}%
      </Text>
    </HStack>
  );
};

const ComfortLevel = ({ comfort }) => {
  return (
    <VStack bg="$white" p="$4" rounded="$2xl" shadow="$1">
      <HStack alignItems="center" space="sm" mb="$3">
        <Activity size={20} color={comfort.color} />
        <Text fontSize="$sm" fontWeight="$medium" color="$blue900">
          Tingkat Kenyamanan
        </Text>
      </HStack>
      <VStack space="sm">
        <HStack justifyContent="space-between">
          <Text fontSize="$sm" color="$gray600">Indeks:</Text>
          <Text fontSize="$sm" fontWeight="$bold" color={comfort.color}>
            {comfort.level}
          </Text>
        </HStack>
        <Progress value={comfort.value} size="sm">
          <ProgressFilledTrack bg={comfort.color} />
        </Progress>
        <Text fontSize="$xs" color="$gray500" textAlign="center">
          {comfort.value >= 70 ? "Kondisi sangat ideal" : 
           comfort.value >= 50 ? "Kondisi cukup nyaman" : 
           "Perlu penyesuaian aktivitas"}
        </Text>
      </VStack>
    </VStack>
  );
};

const ComparisonCard = ({ current, average }) => {
  const diff = current - average;
  const isHigher = diff > 0;
  const diffPercent = ((Math.abs(diff) / average) * 100).toFixed(1);

  return (
    <Box bg="$white" p="$4" rounded="$2xl" shadow="$1">
      <HStack justifyContent="space-between" alignItems="center" mb="$2">
        <Text fontSize="$sm" fontWeight="$medium" color="$blue900">
          Perbandingan dengan Rata-rata
        </Text>
        {isHigher ? <TrendingUp size={18} color="#ef4444" /> : <TrendingDown size={18} color="#3b82f6" />}
      </HStack>
      
      <VStack space="sm">
        <HStack justifyContent="space-between">
          <Text fontSize="$sm" color="$gray600">Suhu saat ini:</Text>
          <Text fontSize="$sm" fontWeight="$bold" color={isHigher ? "#ef4444" : "#3b82f6"}>
            {current}°C ({isHigher ? '+' : ''}{diff.toFixed(1)}°C)
          </Text>
        </HStack>
        
        <HStack justifyContent="space-between">
          <Text fontSize="$sm" color="$gray600">Rata-rata wilayah:</Text>
          <Text fontSize="$sm" fontWeight="$bold" color="$blue900">
            {average}°C
          </Text>
        </HStack>
        
        <Divider my="$2" />
        
        <Text fontSize="$xs" color="$gray500">
          Suhu saat ini {isHigher ? 'lebih tinggi' : 'lebih rendah'} {diffPercent}% dari rata-rata
          {isHigher ? '. Minum lebih banyak air!' : '. Tetap jaga hidrasi.'}
        </Text>
      </VStack>
    </Box>
  );
};

const HourlyForecast = ({ hourlyData }) => {
  if (!hourlyData || hourlyData.length === 0) return null;

  return (
    <Box bg="$white" p="$4" rounded="$2xl" shadow="$1" mx="$3" mt="$4">
      <HStack justifyContent="space-between" alignItems="center" mb="$3">
        <Text fontSize="$sm" fontWeight="$medium" color="$blue900">
          Prakiraan Per Jam (12 Jam)
        </Text>
        <Text fontSize="$xs" color="$gray500">Suhu & Air</Text>
      </HStack>
      
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <HStack space="$3">
          {hourlyData.slice(0, 12).map((hour, index) => (
            <VStack 
              key={index} 
              alignItems="center" 
              p="$3" 
              bg="$blue50" 
              rounded="$xl"
              minWidth={70}
            >
              <Text fontSize="$xs" color="$blue900" fontWeight="$medium">
                {hour.time}
              </Text>
              <Text fontSize="$lg" fontWeight="$bold" color="$blue700">
                {hour.temp}°
              </Text>
              <Droplet size={14} color="#3b82f6" />
              <Text fontSize="$xs" color="$blue600">
                {hour.water}L
              </Text>
            </VStack>
          ))}
        </HStack>
      </ScrollView>
    </Box>
  );
};

// ===================== KOMPONEN YANG SUDAH ADA (DIPERBARUI) =====================

const InfoHari = ({ hari, suhu, rekomLiter, weatherCode, index, stats }) => {
  const isHot = suhu >= 30;
  const weatherInfo = getWeatherDescription(weatherCode);
  const WeatherIcon = weatherInfo.icon;
  const label =
    index === 0
      ? "Hari ini"
      : index === 1
        ? "Besok"
        : "Hari " + (index + 1);

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

      <HStack space="md" alignItems="center">
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
        strokeWidth: 3,
      },
      {
        data: data.map((d) => d.rekomLiter * 10),
        color: () => "#60a5fa",
        strokeWidth: 3,
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
          backgroundColor: "#ffffff",
          backgroundGradientFrom: "#f0f9ff",
          backgroundGradientTo: "#e0f2fe",
          decimalPlaces: 1,
          color: (opacity = 1) => `rgba(59, 130, 246, ${opacity})`,
          labelColor: (opacity = 1) => `rgba(30, 58, 138, ${opacity})`,
          style: { borderRadius: 16 },
          propsForDots: { r: "5", strokeWidth: "2" },
          propsForBackgroundLines: { strokeDasharray: "" }
        }}
        bezier
        style={{ borderRadius: 16 }}
      />
    </Box>
  );
};

const WeatherInfoCard = ({ weatherData, selectedDaerah, waterRecommendation, stats }) => {
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
            <VStack>
              <Text bold fontSize="$2xl" color="$blue900">
                {weatherData.temperature_2m}°C
              </Text>
              <Text fontSize="$xs" color="$gray500">
                Rasakan seperti {(weatherData.temperature_2m * 1.1).toFixed(1)}°C
              </Text>
            </VStack>
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
          <Text fontSize="$xs" color="$gray600" mt="$1">Angin</Text>
          <Text bold fontSize="$sm">{weatherData.windspeed_10m || 5}km/jam</Text>
        </VStack>
        
        <VStack alignItems="center">
          <ThermometerSun size={20} color="#ea580c" />
          <Text fontSize="$xs" color="$gray600" mt="$1">Indeks UV</Text>
          <Text bold fontSize="$sm">{weatherData.uv_index || 5}</Text>
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
        Rekomendasi disesuaikan dengan kondisi cuaca dan statistik terbaru
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
  const [refreshing, setRefreshing] = useState(false);
  const [forecastData, setForecastData] = useState([]);
  const [hourlyData, setHourlyData] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [waterRecommendation, setWaterRecommendation] = useState("1.8");
  const [stats, setStats] = useState(null);
  const [regionalAverage, setRegionalAverage] = useState(28.5);
  const router = useRouter();

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
        `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,precipitation,weather_code,windspeed_10m,uv_index&daily=weather_code,temperature_2m_max,temperature_2m_min&hourly=temperature_2m,precipitation_probability&timezone=Asia%2FJakarta&forecast_days=5`
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
      
      // Format data per jam
      const hourlyForecast = data.hourly.time.slice(0, 24).map((time, index) => {
        const hour = dayjs(time).format('HH:mm');
        const temp = Math.round(data.hourly.temperature_2m[index]);
        const rainChance = data.hourly.precipitation_probability[index];
        
        // Hitung rekomendasi air per jam
        const hourlyWater = (parseFloat(waterRecommendation) / 16) * (temp > 30 ? 1.2 : 1);
        
        return {
          time: hour,
          temp: temp,
          water: hourlyWater.toFixed(1),
          rainChance: rainChance
        };
      });
      
      setWeatherData(data.current);
      setForecastData(dailyForecast);
      setHourlyData(hourlyForecast);
      
      // Hitung statistik
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
        
        // Hitung statistik
        const calculatedStats = calculateStatistics(dailyForecast, {
          ...data.current,
          risk: weatherInfo.risk
        });
        setStats(calculatedStats);
        
        // Generate rekomendasi detail
        const detailedRecs = getDetailedRecommendation(
          currentTemp, 
          currentHumidity, 
          weatherInfo.desc,
          calculatedStats
        );
        
        setRecommendations(detailedRecs);
        
        // Set reminder
        let reminderText = "";
        let reminderIcon = Droplets;
        
        if (currentTemp > 35) {
          reminderText = `🔥 SUHU SANGAT PANAS (${currentTemp}°C)! Minum minimal ${(parseFloat(waterRec) * 1.2).toFixed(1)}L air hari ini.`;
          reminderIcon = Flame;
        } else if (currentTemp > 32) {
          reminderText = `☀️ Cuaca panas (${currentTemp}°C), targetkan minum ${waterRec}L air.`;
          reminderIcon = SunMedium;
        } else if (currentTemp > 28) {
          reminderText = `⛅ Cuaca hangat (${currentTemp}°C), minum setidaknya ${waterRec}L air.`;
          reminderIcon = Cloud;
        } else if (currentTemp > 22) {
          reminderText = `😌 Cuaca nyaman (${currentTemp}°C), tetap minum ${waterRec}L air.`;
          reminderIcon = Droplets;
        } else {
          reminderText = `❄️ Cuaca sejuk (${currentTemp}°C), jaga asupan air ${waterRec}L.`;
          reminderIcon = Snowflake;
        }
        
        // Tambahkan info statistik
        reminderText += ` Rata-rata: ${calculatedStats.avgTemperature}°C, Trend: ${calculatedStats.temperatureTrend}.`;
        
        setReminder({ 
          icon: reminderIcon, 
          text: reminderText 
        });
        
        // Hitung rata-rata regional (simulasi)
        const regionalAvg = Math.random() * 5 + 26;
        setRegionalAverage(regionalAvg.toFixed(1));
      }
      
    } catch (error) {
      console.error("Error fetching weather data:", error);
      Alert.alert("Error", "Gagal mengambil data cuaca. Menggunakan data simulasi.");
      
      // Fallback ke data simulasi
      const fallbackData = Array.from({ length: 5 }, (_, i) => {
        const hari = ["Sen", "Sel", "Rab", "Kam", "Jum"][i];
        const suhu = Math.floor(Math.random() * 10) + 25;
        const weatherCode = [0, 1, 2, 3, 61][Math.floor(Math.random() * 5)];
        const weatherInfo = getWeatherDescription(weatherCode);
        const rekomLiter = calculateWaterRecommendation(suhu, 65, weatherInfo.desc);
        return { 
          hari, 
          suhu, 
          rekomLiter: parseFloat(rekomLiter),
          weatherCode 
        };
      });
      
      setForecastData(fallbackData);
      setStats({
        avgTemperature: 28.5,
        maxTemperature: 32,
        minTemperature: 25,
        avgWaterRecommendation: 2.1,
        totalWaterWeek: 10.5,
        temperatureTrend: "naik",
        temperatureChange: 2.5,
        riskLevel: "sedang",
        comfortIndex: { level: "Nyaman", color: "#10b981", value: 75 },
        dehydrationRisk: { value: 45, level: "sedang" }
      });
      setRecommendations([
        "• Minum air secara teratur setiap 2 jam",
        "• Hindari minuman berkafein berlebihan",
        "• Konsumsi buah dengan kandungan air tinggi",
        "• Pantau warna urine sebagai indikator hidrasi"
      ]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchWeatherData(selectedDaerah.lat, selectedDaerah.lon);
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
        borderLeftWidth={4}
        borderLeftColor="#2563EB"
      >
        {Icon && <Icon size={20} color="#2563EB" />}
        <Text flexShrink={1} fontSize="$sm" color="#1e40af">
          {reminder.text}
        </Text>
      </HStack>
    );
  };

  return (
    <ScrollView 
      style={{ backgroundColor: "#F8FAFC" }}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <VStack space="lg" py="$4">
        {/* HEADER */}
        <Box bg="$white" p="$4" rounded="$2xl" shadow="$1" mx="$3">
          <HStack justifyContent="space-between" alignItems="center">
            <VStack>
              <Heading color="$blue900" size="lg">
                Statistika Cuaca
              </Heading>
              <Text color="$blue800" fontSize="$sm">
                {dayjs().format("dddd, DD MMMM YYYY")} • {dayjs().format("HH:mm")}
              </Text>
            </VStack>
            <Users size={24} color="#3b82f6" />
          </HStack>
          <ReminderBox />
        </Box>

        {/* STATISTIK UTAMA */}
        {stats && (
          <Box mx="$3">
            <HStack space="sm" mb="$3">
              <StatCard
                icon={Thermometer}
                title="Suhu Rata²"
                value={`${stats.avgTemperature}°C`}
                subtitle={`Max: ${stats.maxTemperature}°C`}
                color="#ef4444"
                trend={stats.temperatureTrend === "naik" ? "up" : "down"}
              />
              <StatCard
                icon={Droplet}
                title="Air/hari"
                value={`${stats.avgWaterRecommendation}L`}
                subtitle={`Total/minggu: ${stats.totalWaterWeek}L`}
                color="#3b82f6"
                trend="up"
              />
            </HStack>
            
            <HStack space="sm">
              <StatCard
                icon={TrendingUp}
                title="Trend Suhu"
                value={stats.temperatureChange > 0 ? `+${stats.temperatureChange}°` : `${stats.temperatureChange}°`}
                subtitle={stats.temperatureTrend === "naik" ? "Naik" : "Turun"}
                color={stats.temperatureTrend === "naik" ? "#ef4444" : "#3b82f6"}
                trend={stats.temperatureTrend === "naik" ? "up" : "down"}
              />
              <StatCard
                icon={Waves}
                title="Risiko Cuaca"
                value={stats.riskLevel.toUpperCase()}
                subtitle={stats.riskLevel === "tinggi" ? "Waspada!" : "Aman"}
                color={stats.riskLevel === "tinggi" ? "#ef4444" : 
                       stats.riskLevel === "sedang" ? "#f59e0b" : "#10b981"}
                trend={stats.riskLevel === "tinggi" ? "up" : "down"}
              />
            </HStack>
          </Box>
        )}

        {/* SELECT DAERAH */}
        <Box bg="$white" p="$4" rounded="$2xl" shadow="$1" mx="$3">
          <HStack justifyContent="space-between" alignItems="center" mb="$2">
            <Text bold fontSize="$sm" color="$blue900">Pilih Daerah</Text>
            <Text fontSize="$xs" color="$gray500">{daerahJatim.length} daerah tersedia</Text>
          </HStack>
          <Select
            selectedValue={selectedDaerah.nama}
            onValueChange={(value) => {
              const daerah = daerahJatim.find(d => d.nama === value);
              setSelectedDaerah(daerah);
            }}
          >
            <SelectTrigger variant="outline" size="md">
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
        </Box>

        {/* INDIKATOR RISIKO & KENYAMANAN */}
        {stats && (
          <Box mx="$3">
            <HStack space="sm">
              <Box flex={1}>
                <RiskIndicator level={stats.dehydrationRisk.level} value={stats.dehydrationRisk.value} />
              </Box>
              <Box flex={1}>
                <ComfortLevel comfort={stats.comfortIndex} />
              </Box>
            </HStack>
          </Box>
        )}

        {/* PERBANDINGAN DENGAN RATA-RATA */}
        {stats && weatherData && (
          <ComparisonCard 
            current={weatherData.temperature_2m} 
            average={parseFloat(regionalAverage)} 
          />
        )}

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
              stats={stats}
            />

            {/* PRAKIRAAN PER JAM */}
            {hourlyData.length > 0 && (
              <HourlyForecast hourlyData={hourlyData} />
            )}

            {/* REKOMENDASI DETAIL */}
            <RecommendationCard recommendations={recommendations} />

            {/* INFO HARIAN */}
            {forecastData.length > 0 && (
              <Box bg="$white" p="$4" rounded="$2xl" shadow="$1" mx="$3">
                <HStack justifyContent="space-between" alignItems="center" mb="$3">
                  <Text bold fontSize="$sm" color="$blue900">Prakiraan 5 Hari ke Depan</Text>
                  <Text fontSize="$xs" color="$gray500">Suhu & Rekomendasi Air</Text>
                </HStack>
                <VStack>
                  {forecastData.map((item, index) => (
                    <InfoHari 
                      key={index} 
                      {...item} 
                      index={index} 
                      stats={stats}
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
            <HStack justifyContent="space-between" alignItems="center" mb="$2">
              <Heading size="sm">Rekomendasi Waktu Sekarang 🕒</Heading>
              <Text fontSize="$xs" color="$gray500">{dayjs().format("HH:mm")} WIB</Text>
            </HStack>
            <HStack alignItems="center" space="md">
              <Box p="$3" bg="$blue50" rounded="$full">
                <waktuSekarang.icon size={26} color="#2563EB" />
              </Box>
              <VStack flex={1}>
                <Text bold fontSize="$md" color="$blue900">{waktuSekarang.rekom}</Text>
                <Text fontSize="$sm" color="$gray600">Sesuaikan dengan aktivitas Anda</Text>
              </VStack>
            </HStack>
          </Box>
        )}

        {/* NAVIGASI KE FITUR LAIN */}
        <VStack space="md" mx="$3" mb="$10">
          <Button 
            size="lg" 
            bg="$blue600" 
            borderRadius="$2xl" 
            onPress={() => router.push("../jurnalwater")}
            shadow="$1"
          >
            <Droplets color="white" size={20} />
            <ButtonText ml="$2" color="white">Buka Jurnal Minum</ButtonText>
          </Button>
          
          <Button 
            size="lg" 
            bg="$emerald600" 
            borderRadius="$2xl" 
            onPress={() => router.push("../challengewater")}
            shadow="$1"
          >
            <Activity color="white" size={20} />
            <ButtonText ml="$2" color="white">Challenge Minum</ButtonText>
          </Button>
        </VStack>
      </VStack>
    </ScrollView>
  );
};

export default Stats;