import React, { useState, useEffect } from "react";
import {
  ScrollView,
  Box,
  Text,
  Heading,
  Progress,
  ProgressFilledTrack,
  Icon,
  Divider,
  HStack,
  VStack,
  Badge,
} from "@gluestack-ui/themed";
import {
  Trophy,
  CheckCircle2,
  Circle,
  Coins,
  Gift,
  Droplet,
  Smile,
  Star,
} from "lucide-react-native";

const PRIMARY = "#2563EB";
const SOFT_BG = "#EEF2FF";
const CARD_BG = "$white";

export default function ChallengeWater({
  mood = "Semangat",
  hari = "Kamis, 13 November",
  progress = 0,
}) {
  const [coin, setCoin] = useState(50);
  const [points, setPoints] = useState(150);
  const [completedChallenges, setCompletedChallenges] = useState([]);
  const [currentProgress, setCurrentProgress] = useState(progress);

  const [leaderboard, setLeaderboard] = useState([
    { id: 2, name: "Bagus", score: 190, coins: 60 },
    { id: 3, name: "Dewi", score: 160, coins: 55 },
    { id: 4, name: "Kamu", score: points, coins: coin },
  ]);

  const challenges = [
    { id: 1, title: "Minum 8 gelas air hari ini", reward: 10, points: 20 },
    { id: 2, title: "Minum air putih sebelum makan", reward: 5, points: 10 },
    {
      id: 3,
      title: "Ganti minuman manis dengan air putih",
      reward: 15,
      points: 25,
    },
    {
      id: 4,
      title: "Minum segelas air setelah bangun tidur",
      reward: 5,
      points: 15,
    },
  ];

  const handleToggleChallenge = (id, reward, pts) => {
    if (completedChallenges.includes(id)) {
      setCompletedChallenges(completedChallenges.filter((c) => c !== id));
      setCoin((prev) => prev - reward);
      setPoints((prev) => prev - pts);
      setCurrentProgress(
        Math.max(currentProgress - 100 / challenges.length, 0)
      );
    } else {
      setCompletedChallenges([...completedChallenges, id]);
      setCoin((prev) => prev + reward);
      setPoints((prev) => prev + pts);
      setCurrentProgress(
        Math.min(currentProgress + 100 / challenges.length, 100)
      );
    }
  };

  useEffect(() => {
    const updated = leaderboard.map((user) =>
      user.name === "Kamu" ? { ...user, score: points, coins: coin } : user
    );
    const sorted = [...updated].sort((a, b) => b.score - a.score);
    setLeaderboard(sorted);
  }, [points, coin]);

  const allDone = completedChallenges.length === challenges.length;

  return (
    <ScrollView flex={1} bg={SOFT_BG}>
      <VStack space="lg" p="$4">

        {/* ===== HEADER ===== */}
        <Box alignItems="center">
          <Box bg="#DBEAFE" p="$3" rounded="$full" mb="$2">
            <Droplet size={28} color={PRIMARY} />
          </Box>
          <Heading color={PRIMARY}>Tantangan Harian Air</Heading>
          <Text color="#64748B">{hari}</Text>

          <HStack alignItems="center" space="xs" mt="$2">
            <Smile size={16} color="#FACC15" />
            <Text fontSize="$sm">
              Mood hari ini: <Text fontWeight="bold">{mood}</Text>
            </Text>
          </HStack>
        </Box>

        {/* ===== COIN & POINTS ===== */}
        <Box bg={CARD_BG} p="$4" rounded="$2xl" shadow="$1">
          <HStack justifyContent="space-around">
            <HStack alignItems="center" space="sm">
              <Coins size={22} color="#FACC15" />
              <VStack>
                <Text fontSize="$sm" color="#64748B">
                  Koin
                </Text>
                <Text fontWeight="bold" fontSize="$lg">
                  {coin}
                </Text>
              </VStack>
            </HStack>

            <Divider orientation="vertical" h="$10" />

            <HStack alignItems="center" space="sm">
              <Star size={22} color="#F59E0B" />
              <VStack>
                <Text fontSize="$sm" color="#64748B">
                  Poin
                </Text>
                <Text fontWeight="bold" fontSize="$lg">
                  {points} pts
                </Text>
              </VStack>
            </HStack>
          </HStack>
        </Box>

        {/* ===== PROGRESS ===== */}
        <Box bg={CARD_BG} p="$4" rounded="$2xl" shadow="$1">
          <Text fontWeight="bold" mb="$2">
            Progress Hari Ini
          </Text>
          <Progress value={currentProgress} h={10} borderRadius="$full">
            <ProgressFilledTrack bgColor={PRIMARY} />
          </Progress>
          <Text mt="$2" textAlign="right" color="#64748B">
            {Math.round(currentProgress)}%
          </Text>
        </Box>

        {/* ===== CHALLENGES ===== */}
        <Box>
          <Text fontSize="$lg" fontWeight="bold" mb="$2">
            Daftar Tantangan
          </Text>

          <VStack space="sm">
            {challenges.map((item) => {
              const done = completedChallenges.includes(item.id);
              return (
                <Box
                  key={item.id}
                  bg={CARD_BG}
                  p="$4"
                  rounded="$2xl"
                  borderWidth={1}
                  borderColor={done ? "#22C55E" : "#E5E7EB"}
                >
                  <HStack justifyContent="space-between" alignItems="center">
                    <HStack space="sm" alignItems="center">
                      <Icon
                        as={done ? CheckCircle2 : Circle}
                        color={done ? "#22C55E" : "#CBD5E1"}
                        size="lg"
                        onPress={() =>
                          handleToggleChallenge(
                            item.id,
                            item.reward,
                            item.points
                          )
                        }
                      />
                      <VStack>
                        <Text fontWeight="bold">{item.title}</Text>
                        <Text fontSize="$sm" color="#64748B">
                          +{item.reward} Koin • +{item.points} Pts
                        </Text>
                      </VStack>
                    </HStack>

                    {done && (
                      <Badge bgColor="#DCFCE7" rounded="$full">
                        <Text color="#166534">Selesai</Text>
                      </Badge>
                    )}
                  </HStack>
                </Box>
              );
            })}
          </VStack>
        </Box>

        {/* ===== REWARD ===== */}
        {allDone && (
          <Box
            bg="#ECFDF5"
            p="$5"
            rounded="$2xl"
            alignItems="center"
            space="sm"
          >
            <Gift size={32} color="#10B981" />
            <Text fontWeight="bold" color="#047857">
              Semua tantangan selesai!
            </Text>
            <Text color="#065F46" textAlign="center">
              Hadiah: Voucher Air Zam-Zam atau Dashboard Juara Daerah
            </Text>
          </Box>
        )}

        {/* ===== LEADERBOARD ===== */}
        <Box>
          <HStack alignItems="center" mb="$2">
            <Trophy size={20} color="#F59E0B" />
            <Text fontSize="$lg" fontWeight="bold" ml="$2">
              Papan Juara Daerah
            </Text>
          </HStack>

          <VStack space="sm">
            {leaderboard.map((user, index) => (
              <Box
                key={user.id}
                bg={
                  user.name === "Kamu"
                    ? "#DBEAFE"
                    : index === 0
                    ? "#FEF3C7"
                    : CARD_BG
                }
                p="$3"
                rounded="$xl"
              >
                <HStack justifyContent="space-between" alignItems="center">
                  <Text fontWeight="bold">
                    {index + 1}. {user.name}
                  </Text>
                  <HStack space="sm" alignItems="center">
                    <Coins size={16} color="#FACC15" />
                    <Text fontWeight="bold">{user.coins}</Text>
                    <Text>{user.score} pts</Text>
                  </HStack>
                </HStack>
              </Box>
            ))}
          </VStack>
        </Box>

      </VStack>
    </ScrollView>
  );
}
