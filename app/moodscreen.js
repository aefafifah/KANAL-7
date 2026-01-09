import React, { useEffect, useState } from "react";
import {
  Box,
  Text,
  ScrollView,
  Pressable,
  VStack,
  HStack,
} from "@gluestack-ui/themed";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { SafeAreaView } from "@gluestack-ui/themed";
import { MaterialIcons } from "@expo/vector-icons";

/* =====================
  THEME
===================== */
const BG = "#EEF2FF";
const CARD = "#FFFFFF";
const PRIMARY = "#3B82F6";
const MUTED = "#E5E7EB";

const moods = [
  { label: "Happy", emoji: "😄", color: "#FACC15" },
  { label: "Calm", emoji: "😊", color: "#22C55E" },
  { label: "Neutral", emoji: "😐", color: "#9CA3AF" },
  { label: "Sad", emoji: "😢", color: "#38BDF8" },
  { label: "Angry", emoji: "😡", color: "#EF4444" },
  { label: "Cry", emoji: "😭", color: "#6366F1" },
];

export default function MoodScreen({
  title = "How do you feel today?",
}) {
  const [selectedMood, setSelectedMood] = useState(null);
  const [history, setHistory] = useState([]);
  const [isLocked, setIsLocked] = useState(false);

  /* =====================
    LOAD DATA
  ===================== */
  useEffect(() => {
    loadMood();
    loadHistory();
  }, []);

  const loadMood = async () => {
    const saved = await AsyncStorage.getItem("currentMood");
    if (saved) {
      setSelectedMood(JSON.parse(saved));
      setIsLocked(true);
    }
  };

  const loadHistory = async () => {
    const saved = await AsyncStorage.getItem("moodHistory");
    if (saved) setHistory(JSON.parse(saved));
  };

  /* =====================
    SAVE MOOD
  ===================== */
  const saveMood = async () => {
    if (!selectedMood || isLocked) return;

    await AsyncStorage.setItem(
      "currentMood",
      JSON.stringify(selectedMood)
    );

    const newEntry = {
      mood: selectedMood,
      time: new Date().toLocaleTimeString("id-ID", {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    const newHistory = [newEntry, ...history];
    setHistory(newHistory);

    await AsyncStorage.setItem(
      "moodHistory",
      JSON.stringify(newHistory)
    );

    setIsLocked(true);
  };

  /* =====================
    EDIT & RESET
  ===================== */
  const handleEdit = () => {
    setIsLocked(false);
    setSelectedMood(null);
  };

  const resetMood = async () => {
    await AsyncStorage.removeItem("currentMood");
    setSelectedMood(null);
    setIsLocked(false);
  };

  /* =====================
    DELETE HISTORY
  ===================== */
  const deleteHistoryItem = async (index) => {
    const updated = history.filter((_, i) => i !== index);
    setHistory(updated);
    await AsyncStorage.setItem(
      "moodHistory",
      JSON.stringify(updated)
    );
  };

  return (
    <SafeAreaView flex={1} bg={BG}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          padding: 16,
          paddingBottom: 80,
        }}
      >
        {/* =====================
            TITLE
        ===================== */}
        <Text fontSize="$2xl" fontWeight="$bold" mb="$4">
          {title}
        </Text>

        {/* =====================
            CURRENT MOOD CARD
        ===================== */}
        <Box
          bg={CARD}
          rounded="$2xl"
          p="$6"
          shadow="$2"
          mb="$6"
          alignItems="center"
        >
          {isLocked && selectedMood ? (
            <>
              <Text fontSize={64}>{selectedMood.emoji}</Text>

              <Text
                fontSize="$xl"
                fontWeight="$bold"
                mt="$2"
              >
                {selectedMood.label}
              </Text>

              <HStack mt="$4" space="sm">
                <Pressable
                  px="$6"
                  py="$2"
                  bg={PRIMARY}
                  rounded="$xl"
                  onPress={handleEdit}
                >
                  <Text
                    color="$white"
                    fontWeight="$bold"
                  >
                    Edit
                  </Text>
                </Pressable>

                <Pressable
                  px="$6"
                  py="$2"
                  bg={MUTED}
                  rounded="$xl"
                  onPress={resetMood}
                >
                  <Text
                    color="#111827"
                    fontWeight="$bold"
                  >
                    Reset
                  </Text>
                </Pressable>
              </HStack>
            </>
          ) : (
            <Text color="#6B7280">
              No mood selected yet
            </Text>
          )}
        </Box>

        {/* =====================
            PICK MOOD
        ===================== */}
        <Text fontSize="$lg" fontWeight="$bold" mb="$3">
          Choose Your Mood
        </Text>

        <HStack
          flexWrap="wrap"
          justifyContent="space-between"
        >
          {moods.map((m) => {
            const active =
              selectedMood?.label === m.label;

            return (
              <Pressable
                key={m.label}
                w="48%"
                bg={CARD}
                rounded="$2xl"
                py="$5"
                mb="$4"
                alignItems="center"
                borderWidth={2}
                borderColor={
                  active ? m.color : MUTED
                }
                shadow="$1"
                opacity={isLocked ? 0.4 : 1}
                disabled={isLocked}
                onPress={() =>
                  setSelectedMood(m)
                }
              >
                <Text fontSize={40}>
                  {m.emoji}
                </Text>
                <Text mt="$2" fontWeight="$bold">
                  {m.label}
                </Text>
              </Pressable>
            );
          })}
        </HStack>

        {/* =====================
            SET BUTTON
        ===================== */}
        <Pressable
          mt="$2"
          py="$4"
          rounded="$2xl"
          alignItems="center"
          bg={
            selectedMood && !isLocked
              ? PRIMARY
              : "#CBD5E1"
          }
          disabled={isLocked || !selectedMood}
          onPress={saveMood}
        >
          <Text
            fontSize="$lg"
            fontWeight="$bold"
            color="$white"
          >
            {isLocked ? "Mood Set" : "Set Mood"}
          </Text>
        </Pressable>

        {/* =====================
            HISTORY
        ===================== */}
        <Text
          fontSize="$lg"
          fontWeight="$bold"
          mt="$8"
          mb="$3"
        >
          Mood History
        </Text>

        <VStack space="sm">
          {history.map((item, index) => (
            <Box
              key={index}
              bg={CARD}
              p="$4"
              rounded="$xl"
              shadow="$1"
            >
              <HStack
                justifyContent="space-between"
                alignItems="center"
              >
                <HStack
                  alignItems="center"
                  space="sm"
                >
                  <Text fontSize={32}>
                    {item.mood.emoji}
                  </Text>
                  <Text fontWeight="$bold">
                    {item.mood.label}
                  </Text>
                </HStack>

                <VStack alignItems="flex-end">
                  <Text
                    fontSize="$sm"
                    color="#6B7280"
                  >
                    {item.time}
                  </Text>

                  <Pressable
                    mt="$1"
                    onPress={() =>
                      deleteHistoryItem(index)
                    }
                  >
                    <MaterialIcons
                      name="delete"
                      size={18}
                      color="#DC2626"
                    />
                  </Pressable>
                </VStack>
              </HStack>
            </Box>
          ))}
        </VStack>
      </ScrollView>
    </SafeAreaView>
  );
}
