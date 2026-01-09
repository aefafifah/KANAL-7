import React, { useState } from "react";
import { Alert } from "react-native";
import {
  Box,
  Text,
  ScrollView,
  VStack,
  HStack,
  Pressable,
  Avatar,
  AvatarFallbackText,
} from "@gluestack-ui/themed";
import { Heart, MessageCircle, Share2, Plus } from "lucide-react-native";

/* ===================== DATA DUMMY ===================== */
const INITIAL_POSTS = [
  {
    id: "1",
    userName: "R Clara Angelica Surya",
    timestamp: "2 jam yang lalu",
    postText: "Kemeja untuk outfit ngampus nih ✨",
    postLink: "s.shopee.co.id/AA9HtcEpl5",
  },
  {
    id: "2",
    userName: "R Clara Angelica Surya",
    timestamp: "2 jam yang lalu",
    postText: "Parfum nya nihh 🌸",
    postLink: "s.shopee.co.id/AUm8Ibx36V",
  },
  {
    id: "3",
    userName: "R Clara Angelica Surya",
    timestamp: "2 jam yang lalu",
    postText: "Siapa yang butuh sunscreen? ☀️",
    postLink: "s.shopee.co.id/2vjqlOCfmo",
  },
];

/* ===================== CONSTANT WARNA ===================== */
const PRIMARY = "#2563EB";
const SOFT_BG = "#EEF2FF";

const Community = () => {
  const [posts] = useState(INITIAL_POSTS);

  return (
    <Box flex={1} bg={SOFT_BG}>
      {/* ===== HEADER ===== */}
      <Box bg="$white" px="$4" py="$4" shadow="$1">
        <Text fontSize="$2xl" fontWeight="$bold" color="#1E293B">
          Komunitas
        </Text>
        <Text fontSize="$sm" color="$gray500">
          Berbagi tips & rekomendasi bareng
        </Text>
      </Box>

      {/* ===== FEED ===== */}
      <ScrollView>
        <VStack space="lg" p="$4">
          {posts.map((item) => (
            <Box
              key={item.id}
              bg="$white"
              rounded="$2xl"
              p="$4"
              shadow="$1"
            >
              {/* HEADER POST */}
              <HStack space="md" alignItems="center">
                <Avatar size="sm" bg="#DBEAFE">
                  <AvatarFallbackText>
                    {item.userName.charAt(0)}
                  </AvatarFallbackText>
                </Avatar>

                <VStack>
                  <Text fontWeight="$bold" color="#1E293B">
                    {item.userName}
                  </Text>
                  <Text fontSize="$xs" color="$gray500">
                    {item.timestamp}
                  </Text>
                </VStack>
              </HStack>

              {/* CONTENT */}
              <Text mt="$3" color="#334155">
                {item.postText}
              </Text>

              <Text mt="$2" color={PRIMARY} fontSize="$sm">
                {item.postLink}
              </Text>

              {/* ACTION */}
              <HStack
                justifyContent="space-between"
                mt="$4"
                pt="$3"
                borderTopWidth={1}
                borderColor="$gray200"
              >
                <ActionButton icon={Heart} label="Suka" />
                <ActionButton icon={MessageCircle} label="Komentar" />
                <ActionButton icon={Share2} label="Bagikan" />
              </HStack>
            </Box>
          ))}

          <Box h="$10" />
        </VStack>
      </ScrollView>

      {/* ===== FAB POST ===== */}
      <Pressable
        position="absolute"
        bottom={24}
        right={24}
        bg={PRIMARY}
        p="$4"
        rounded="$full"
        shadow="$4"
        onPress={() =>
          Alert.alert("Post", "Masukkan konten yang ingin kamu bagikan")
        }
      >
        <Plus size={24} color="white" />
      </Pressable>
    </Box>
  );
};

/* ===================== ACTION BUTTON ===================== */
function ActionButton({ icon: Icon, label }) {
  return (
    <Pressable>
      <HStack space="xs" alignItems="center">
        <Icon size={18} color="#64748B" />
        <Text fontSize="$sm" color="#64748B">
          {label}
        </Text>
      </HStack>
    </Pressable>
  );
}

export default Community;
