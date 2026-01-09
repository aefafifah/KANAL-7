import {
  Box,
  HStack,
  Heading,
  ScrollView,
  Text,
  VStack,
} from "@gluestack-ui/themed";
import { useState } from "react";
import NewsCard from "../../components/NewsCard";

/* ===================== DATA DUMMY ===================== */
const dummyArticles = [
  {
    id: "dummy-1",
    title: "Ketahui Manfaat Minum Air Putih",
    description:
      "Air putih memiliki peran penting dalam menjaga kesehatan tubuh.",
    source: { name: "Kesehatan Kita" },
    urlToImage: require("../../assets/gambarminum1.jpg"),
  },
  {
    id: "dummy-2",
    title: "Rahasia Hidup Sehat dan Bugar",
    description:
      "Mengonsumsi air putih yang cukup setiap hari adalah kuncinya.",
    source: { name: "Gaya Hidup" },
    urlToImage: require("../../assets/gambarminum2.jpg"),
  },
  {
    id: "dummy-3",
    title: "Hidrasi Optimal Sepanjang Hari",
    description:
      "Pastikan Anda terhidrasi dengan baik untuk mendukung fungsi organ.",
    source: { name: "Tips Sehat" },
    urlToImage: require("../../assets/gambarminum3.png"),
  },
  {
    id: "dummy-4",
    title: "Manfaat Air Setelah Olahraga",
    description:
      "Mengganti cairan yang hilang dan mempercepat pemulihan otot.",
    source: { name: "Sport Info" },
    urlToImage: require("../../assets/gambarminum4.jpeg"),
  },
  {
    id: "dummy-5",
    title: "Minum Air Bersama Teman",
    description:
      "Menjadi motivasi untuk menjaga hidrasi bersama.",
    source: { name: "Komunitas Sehat" },
    urlToImage: require("../../assets/gambarminum5.jpg"),
  },
  {
    id: "dummy-6",
    title: "8 Gelas Sehari: Kebutuhan Harian",
    description:
      "Ikuti panduan minum 8 gelas air putih untuk tubuh bugar.",
    source: { name: "Info Gizi" },
    urlToImage: require("../../assets/gambarminum6.jpeg"),
  },
];

const SOFT_BG = "#EEF2FF";

const NewsScreen = () => {
  const [articles] = useState(dummyArticles);

  return (
    <ScrollView bg={SOFT_BG}>
      <VStack space="lg" pb="$6">

        {/* ===== HEADER ===== */}
        <Box bg="$white" px="$4" py="$4" shadow="$1">
          <Heading color="#1E293B">
            Pentingnya Hidrasi
          </Heading>
          <Text color="$gray500" mt="$1">
            Artikel & informasi seputar kesehatan
          </Text>
        </Box>

        {/* ===== FEATURED ===== */}
        <Box px="$3">
          {articles[0] && (
            <NewsCard post={articles[0]} size="large" />
          )}
        </Box>

        {/* ===== SMALL GRID ===== */}
        {articles.length >= 3 && (
          <HStack space="md" px="$3">
            <Box flex={1}>
              <NewsCard post={articles[1]} size="small" />
            </Box>
            <Box flex={1}>
              <NewsCard post={articles[2]} size="small" />
            </Box>
          </HStack>
        )}

        {/* ===== LIST ===== */}
        <VStack space="md" px="$3">
          {articles.slice(3).map((article) => (
            <NewsCard
              key={article.id}
              post={article}
              size="large"
            />
          ))}
        </VStack>

      </VStack>
    </ScrollView>
  );
};

export default NewsScreen;
