import { useState } from "react";
import { Box, Text, HStack, Pressable } from "@gluestack-ui/themed";
import Ionicons from "@expo/vector-icons/Ionicons";

const moods = [
  { key: "happy", icon: "happy-outline", label: "Senang" },
  { key: "neutral", icon: "remove-circle-outline", label: "Biasa" },
  { key: "sad", icon: "sad-outline", label: "Sedih" },
  { key: "tired", icon: "moon-outline", label: "Lelah" },
];

const MoodTracker = ({ onMoodChange }) => {
  const [selectedMood, setSelectedMood] = useState(null);

  const handleSelectMood = (mood) => {
    setSelectedMood(mood);
    if (onMoodChange) onMoodChange(mood);
  };

  return (
    <Box bg="$blue50" rounded="$xl" p="$4" my="$3">
      <Text fontSize="$lg" mb="$3" fontWeight="$bold" color="$blue800">
        Bagaimana perasaanmu hari ini?
      </Text>
      <HStack justifyContent="space-around">
        {moods.map((m) => (
          <Pressable
            key={m.key}
            alignItems="center"
            onPress={() => handleSelectMood(m.key)}
          >
            <Ionicons
              name={m.icon}
              size={34}
              color={selectedMood === m.key ? "#007AFF" : "#A0A0A0"}
            />
            <Text
              color={selectedMood === m.key ? "$blue700" : "$coolGray500"}
              fontSize="$sm"
              mt="$1"
            >
              {m.label}
            </Text>
          </Pressable>
        ))}
      </HStack>
    </Box>
  );
};

export default MoodTracker;
