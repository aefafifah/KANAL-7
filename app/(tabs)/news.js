import { useState } from "react";
import { ScrollView, HStack, Heading } from "@gluestack-ui/themed";
import NewsCard from "../../components/NewsCard";

// Data dummy tetap sama
const dummyArticles = [
  {
    id: "dummy-1",
    title: "Ketahui Manfaat Minum Air Putih",
    description: "Air putih memiliki peran penting dalam menjaga kesehatan tubuh.",
    source: { name: "Kesehatan Kita" },
    urlToImage: require("../../assets/gambarminum1.jpg"),
  },
  {
    id: "dummy-2",
    title: "Rahasia Hidup Sehat dan Bugar",
    description: "Mengonsumsi air putih yang cukup setiap hari adalah kuncinya.",
    source: { name: "Gaya Hidup" },
    urlToImage: require("../../assets/gambarminum2.jpg"),
  },
  {
    id: "dummy-3",
    title: "Hidrasi Optimal Sepanjang Hari",
    description: "Pastikan Anda terhidrasi dengan baik untuk mendukung fungsi organ.",
    source: { name: "Tips Sehat" },
    urlToImage: require("../../assets/gambarminum3.png"),
  },
  {
    id: "dummy-4",
    title: "Manfaat Air Setelah Olahraga",
    description: "Mengganti cairan yang hilang dan mempercepat pemulihan otot.",
    source: { name: "Sport Info" },
    urlToImage: require("../../assets/gambarminum4.jpeg"),
  },
  {
    id: "dummy-5",
    title: "Minum Air Bersama Teman",
    description: "Menjadi motivasi untuk menjaga hidrasi bersama.",
    source: { name: "Komunitas Sehat" },
    urlToImage: require("../../assets/gambarminum5.jpg"),
  },
  {
    id: "dummy-6",
    title: "8 Gelas Sehari: Kebutuhan Harian",
    description: "Ikuti panduan minum 8 gelas air putih untuk tubuh bugar.",
    source: { name: "Info Gizi" },
    urlToImage: require("../../assets/gambarminum6.jpeg"),
  },
];

const NewsScreen = () => {
  // Tambahkan state sesuai persyaratan tugas
  const [articles, setArticles] = useState(dummyArticles);

  return (
    <ScrollView bg="$gray50">
      <Heading p="$4" pb="$0">Pentingnya Hidrasi</Heading>

      {articles[0] && <NewsCard post={articles[0]} size="large" />}

      {articles.length >= 3 && (
        <HStack>
          <NewsCard post={articles[1]} size="small" />
          <NewsCard post={articles[2]} size="small" />
        </HStack>
      )}

      {articles.slice(3).map((article) => (
        <NewsCard key={article.id} post={article} size="large" />
      ))}
    </ScrollView>
  );
};

export default NewsScreen;
