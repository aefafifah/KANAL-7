import { useEffect, useMemo, useState } from "react";
import { Linking } from "react-native";
import { Stack, useLocalSearchParams } from "expo-router";
import {
  Box,
  Button,
  ButtonText,
  Heading,
  ScrollView,
  Text,
  VStack,
  Image,
} from "@gluestack-ui/themed";
import { onValue, off, ref } from "firebase/database";
import { db } from "../../src/config/firebase";

const FALLBACK_IMAGE = require("../../assets/gambarminum1.jpg");

export default function NewsDetail() {
  const params = useLocalSearchParams();

  const rawId = params?.id ?? "";
  const id = Array.isArray(rawId) ? rawId[0] : rawId;
  const [article, setArticle] = useState(null);

  const normalizeParam = (value) => {
    if (Array.isArray(value)) return value[0] || "";
    return value || "";
  };

  const title = article?.title || normalizeParam(params?.title) || "Berita";
  const description =
    article?.description || normalizeParam(params?.description);
  const sourceName =
    article?.sourceName ||
    article?.source?.name ||
    normalizeParam(params?.sourceName);
  const url = article?.url || article?.link || normalizeParam(params?.url);
  const imageUrl =
    article?.imageUrl ||
    article?.urlToImage ||
    normalizeParam(params?.imageUrl);

  useEffect(() => {
    if (!id || id === "detail") {
      setArticle(null);
      return () => {};
    }

    const articleRef = ref(db, `newsArticles/${id}`);
    const handler = (snapshot) => {
      if (!snapshot.exists()) {
        setArticle(null);
        return;
      }

      setArticle(snapshot.val());
    };

    onValue(articleRef, handler);
    return () => off(articleRef, "value", handler);
  }, [id]);

  const imageSource = useMemo(() => {
    if (typeof imageUrl === "string" && imageUrl.length > 0) {
      return { uri: imageUrl };
    }
    return FALLBACK_IMAGE;
  }, [imageUrl]);

  return (
    <Box flex={1} bg="$white">
      <Stack.Screen
        options={{
          headerShown: true,
          title,
        }}
      />

      <ScrollView key={id || title}>
        <Image source={imageSource} alt={title} h={220} w="100%" />
        <VStack space="sm" p="$4">
          {sourceName ? (
            <Text size="xs" color="$blue500" fontWeight="$bold">
              {sourceName}
            </Text>
          ) : null}
          <Heading size="md">{title}</Heading>
          {description ? (
            <Text color="$gray600">{description}</Text>
          ) : (
            <Text color="$gray500">
              Konten berita belum tersedia.
            </Text>
          )}
          {url ? (
            <Button
              mt="$3"
              bg="$blue600"
              onPress={() => Linking.openURL(url)}
            >
              <ButtonText color="$white">Buka Sumber</ButtonText>
            </Button>
          ) : null}
        </VStack>
      </ScrollView>
    </Box>
  );
}
