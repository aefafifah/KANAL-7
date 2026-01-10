import {
  Box,
  HStack,
  Heading,
  ScrollView,
  Text,
  VStack,
} from "@gluestack-ui/themed";
import { useEffect, useState } from "react";
import NewsCard from "../../components/NewsCard";
import { onValue, off, ref } from "firebase/database";
import { db } from "../../src/config/firebase";

/* ===================== DATA DUMMY ===================== */
const dummyArticles = [
  {
    id: "dummy-1",
    title: "Jangan Remehkan Manfaat Air Putih",
    description:
      "Manfaat air putih untuk kesehatan tubuh sehari-hari.",
    source: { name: "Alodokter" },
    urlToImage:
      "https://res.cloudinary.com/dk0z4ums3/image/upload/v1618195654/attached_image/jangan-remehkan-manfaat-air-putih-0-alodokter.jpg",
    url: "https://www.alodokter.com/jangan-remehkan-manfaat-air-putih",
  },
  {
    id: "dummy-2",
    title: "Kenali 7 Manfaat Penting Minum Air Putih",
    description:
      "Air putih yang cukup bantu menjaga kesehatan tubuh.",
    source: { name: "Fimela" },
    urlToImage:
      "https://cdn0-production-images-kly.akamaized.net/6_Vl7RtQRUsZ99eul_sy-9NQcyQ=/680x383/smart/filters:quality(75):strip_icc():format(webp)/kly-media-production/medias/5440496/original/074961100_1765435315-blonde-girl-filling-glass-water.jpg",
    url: "https://www.fimela.com/health/read/6233963/kenali-7-manfaat-penting-minum-air-putih-yang-cukup-untuk-kesehatan-tubuh",
  },
  {
    id: "dummy-3",
    title: "Air Putih: Informasi Kesehatan",
    description:
      "Informasi kesehatan terkait air putih dari Kemenkes.",
    source: { name: "Kemenkes" },
    urlToImage: "https://kms.kemkes.go.id/contents/1741841964180-Slide1.PNG",
    url: "https://kms.kemkes.go.id/pengetahuan/detail/67d2662c3854e53bdd34029c",
  },
  {
    id: "dummy-5",
    title: "Apa Guna Air Putih Bagi Tubuh",
    description:
      "Pentingnya air putih bagi tubuh dan kesehatan.",
    source: { name: "VOI" },
    urlToImage:
      "https://imgsrv2.voi.id/h9aYab8bc9D1yc-orSZ6HYuVBC_Fh-C9iOMrXtCKwSE/auto/1200/675/sm/1/bG9jYWw6Ly8vcHVibGlzaGVycy81MDAzMTAvMjAyNTA3MzAxMzQxLW1haW4uY3JvcHBlZF8xNzUzODc5NjcwLmpwZw.jpg",
    url: "https://voi.id/info-sehat/500310/apa-guna-air-putih-bagi-tubuh",
  },
];

const SOFT_BG = "#EEF2FF";
const FALLBACK_IMAGE = require("../../assets/gambarminum1.jpg");

const mapImageSource = (value) => {
  if (!value) return FALLBACK_IMAGE;
  if (typeof value === "string") {
    const lower = value.toLowerCase();
    if (lower.endsWith(".avif")) return FALLBACK_IMAGE;
    return { uri: value };
  }
  return value;
};

const normalizeArticles = (list) =>
  list.map((article, index) => ({
    ...article,
    newsId: String(article.newsId || article.id || `news-${index}`),
    urlToImage: mapImageSource(article.urlToImage),
  }));

const NewsScreen = () => {
  const [articles, setArticles] = useState(() =>
    normalizeArticles(dummyArticles)
  );

  useEffect(() => {
    const newsRef = ref(db, "newsArticles");
    const handler = (snapshot) => {
      if (!snapshot.exists()) {
        setArticles(normalizeArticles(dummyArticles));
        return;
      }

      const data = snapshot.val();
      const list = Object.entries(data).map(([id, article]) => ({
        id,
        newsId: String(id),
        title: article.title || "",
        description: article.description || "",
        source: { name: article.sourceName || article.source?.name || "Info" },
        urlToImage: mapImageSource(
          article.imageUrl || article.urlToImage || FALLBACK_IMAGE
        ),
        url: article.url || article.link || "",
        createdAt: article.createdAt || 0,
      }));

      setArticles(normalizeArticles(list));
    };

    onValue(newsRef, handler);
    return () => off(newsRef, "value", handler);
  }, []);

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
