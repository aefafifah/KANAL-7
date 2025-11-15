import React, { useEffect, useState } from "react";
import { Box, Text, ScrollView, Pressable } from "@gluestack-ui/themed";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { SafeAreaView } from "@gluestack-ui/themed";
import { MaterialIcons } from "@expo/vector-icons";

const moods = [
  { label: "Happy", emoji: "😄", color: "#FFD93D" },
  { label: "Calm", emoji: "😊", color: "#6FCF97" },
  { label: "Neutral", emoji: "😐", color: "#BDBDBD" },
  { label: "Sad", emoji: "😢", color: "#56CCF2" },
  { label: "Angry", emoji: "😡", color: "#EB5757" },
];

export default function MoodScreen({ title = "How do you feel today?" }) {
  const [selectedMood, setSelectedMood] = useState(null);
  const [history, setHistory] = useState([]);
  const [isLocked, setIsLocked] = useState(false);

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

  const saveMood = async () => {
    if (!selectedMood || isLocked) return;

    await AsyncStorage.setItem("currentMood", JSON.stringify(selectedMood));

    const newEntry = {
      mood: selectedMood,
      time: new Date().toLocaleTimeString("id-ID", {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    const newHistory = [newEntry, ...history];
    setHistory(newHistory);

    await AsyncStorage.setItem("moodHistory", JSON.stringify(newHistory));

    setIsLocked(true);
  };

  const handleEdit = () => {
    setIsLocked(false);
    setSelectedMood(null);
  };

  const deleteHistoryItem = async (index) => {
    const updated = history.filter((_, i) => i !== index);
    setHistory(updated);
    await AsyncStorage.setItem("moodHistory", JSON.stringify(updated));
  };

  return (
    <SafeAreaView bg="#fff" flex={1}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          padding: 20,
          paddingTop: 5,
          paddingBottom: 80,
        }}
      >
        {/* Title */}
        <Text fontSize={24} fontWeight="bold" mb={20}>
          {title}
        </Text>

        {/* Current Mood */}
        <Box
          bg="#f3f4f6"
          borderRadius={16}
          p={20}
          alignItems="center"
          mb={30}
        >
          {isLocked && selectedMood ? (
            <>
              <Text fontSize={60}>{selectedMood.emoji}</Text>

              <Text fontSize={22} fontWeight="bold" mt={10}>
                {selectedMood.label}
              </Text>

              <Pressable
                mt={10}
                px={14}
                py={8}
                bg="#3b82f6"
                borderRadius={12}
                onPress={handleEdit}
              >
                <Text color="#fff" fontWeight="bold">
                  Edit Mood
                </Text>
              </Pressable>
            </>
          ) : (
            <Text fontSize={16} color="#666">
              No mood selected yet
            </Text>
          )}
        </Box>

        {/* Select Mood */}
        <Text fontSize={18} fontWeight="bold" mb={10}>
          Choose Your Mood
        </Text>

        <Box
          flexDirection="row"
          flexWrap="wrap"
          justifyContent="space-between"
        >
          {moods.map((m) => (
            <Pressable
              key={m.label}
              width="48%"
              bg="#f5f5f5"
              borderRadius={16}
              py={20}
              mb={15}
              alignItems="center"
              borderWidth={2}
              borderColor={
                selectedMood?.label === m.label ? m.color : "transparent"
              }
              disabled={isLocked}
              opacity={isLocked ? 0.4 : 1}
              onPress={() => setSelectedMood(m)}
            >
              <Text fontSize={36}>{m.emoji}</Text>
              <Text mt={8} fontWeight="bold">
                {m.label}
              </Text>
            </Pressable>
          ))}
        </Box>

        {/* Set Button */}
        <Pressable
          py={16}
          borderRadius={16}
          alignItems="center"
          mb={20}
          bg={
            selectedMood && !isLocked
              ? selectedMood.color
              : "#999"
          }
          disabled={isLocked || !selectedMood}
          onPress={saveMood}
        >
          <Text fontSize={18} fontWeight="bold" color="#fff">
            {isLocked ? "Mood Set" : "Set Mood"}
          </Text>
        </Pressable>

        {/* History */}
        <Text fontSize={18} fontWeight="bold" mb={10}>
          Mood History
        </Text>

        {history.map((item, index) => (
          <Box
            key={index}
            bg="#f3f4f6"
            p={16}
            borderRadius={14}
            mb={10}
            flexDirection="row"
            justifyContent="space-between"
            alignItems="center"
          >
            <Box flexDirection="row" alignItems="center" gap={8}>
              <Text fontSize={30}>{item.mood.emoji}</Text>
              <Text fontSize={16} fontWeight="bold">
                {item.mood.label}
              </Text>
            </Box>

            <Box alignItems="flex-end">
              <Text fontSize={14} color="#666">
                {item.time}
              </Text>

              <Pressable mt={4} onPress={() => deleteHistoryItem(index)}>
                <MaterialIcons name="delete" size={18} color="#9c0707ff" />
              </Pressable>
            </Box>
          </Box>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}