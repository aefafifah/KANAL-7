import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Heading,
  Card,
  Progress,
  ProgressFilledTrack,
  Icon,
  ScrollView,
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

export default function ChallengeWater({
  mood = "Semangat",
  hari = "Kamis, 13 November",
  progress = 0,
}) {
  const [coin, setCoin] = useState(50);
  const [points, setPoints] = useState(150);
  const [completedChallenges, setCompletedChallenges] = useState([]);
  const [currentProgress, setCurrentProgress] = useState(progress);

  // Leaderboard awal (dummy)
  const [leaderboard, setLeaderboard] = useState([
    { id: 2, name: "Bagus", score: 190, coins: 60 },
    { id: 3, name: "Dewi", score: 160, coins: 55 },
    { id: 4, name: "Kamu", score: points, coins: coin }, // posisi user sendiri
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

  // Update leaderboard otomatis ketika points/coin berubah
  useEffect(() => {
    const updated = leaderboard.map((user) =>
      user.name === "Kamu" ? { ...user, score: points, coins: coin } : user
    );
    const sorted = [...updated].sort((a, b) => b.score - a.score);
    setLeaderboard(sorted);
  }, [points, coin]);

  const allDone = completedChallenges.length === challenges.length;

  return (
    <ScrollView contentContainerStyle={{ padding: 16 }}>
      {/* Header */}
      <VStack space="xs" alignItems="center" mt="$3">
        <Icon as={Droplet} size="md" color="#3B82F6" />
        <Heading color="#2563EB">Tantangan Harian Air</Heading>
        <Text color="$muted">{hari}</Text>
        <HStack space="xs" alignItems="center" mt="$1">
          <Icon as={Smile} size="sm" color="#FACC15" />
          <Text fontSize="$sm">
            Mood hari ini: <Text fontWeight="bold">{mood}</Text>
          </Text>
        </HStack>
      </VStack>

      {/* Coin & Points Overview */}
      <HStack
        justifyContent="space-around"
        alignItems="center"
        mt="$6"
        p="$3"
        borderRadius="$xl"
        backgroundColor="#EFF6FF"
      >
        <HStack alignItems="center" space="sm">
          <Icon as={Coins} size="lg" color="#FACC15" />
          <VStack>
            <Text fontSize="$sm" color="$muted">
              Koin
            </Text>
            <Text fontWeight="bold" fontSize="$lg">
              {coin}
            </Text>
          </VStack>
        </HStack>

        <Divider orientation="vertical" h="$10" />

        <HStack alignItems="center" space="sm">
          <Icon as={Star} size="lg" color="#F59E0B" />
          <VStack>
            <Text fontSize="$sm" color="$muted">
              Poin
            </Text>
            <Text fontWeight="bold" fontSize="$lg">
              {points} pts
            </Text>
          </VStack>
        </HStack>
      </HStack>

      {/* Progress */}
      <View mt="$5">
        <Text mb="$1" fontWeight="bold">
          Progress Hari Ini
        </Text>
        <Progress value={currentProgress} h={10} borderRadius="$full">
          <ProgressFilledTrack
            bgColor={allDone ? "$success700" : "$primary500"}
          />
        </Progress>
        <Text mt="$1" textAlign="right" color="$muted">
          {Math.round(currentProgress)}%
        </Text>
      </View>

      <Divider my="$4" />

      {/* Challenges List */}
      <VStack space="md">
        <Text fontSize="$lg" fontWeight="bold">
          Daftar Tantangan
        </Text>

        {challenges.map((item) => {
          const done = completedChallenges.includes(item.id);
          return (
            <Card
              key={item.id}
              p="$4"
              borderRadius="$lg"
              backgroundColor={done ? "#ECFDF5" : "#F9FAFB"}
              borderColor={done ? "#16A34A" : "#E5E7EB"}
              borderWidth={1}
              shadowColor="#000"
              shadowOffset={{ width: 0, height: 1 }}
              shadowOpacity={0.1}
              shadowRadius={2}
            >
              <HStack justifyContent="space-between" alignItems="center">
                <HStack alignItems="center" space="sm">
                  <Icon
                    as={done ? CheckCircle2 : Circle}
                    color={done ? "#16A34A" : "#9CA3AF"}
                    size="lg"
                    onPress={() =>
                      handleToggleChallenge(item.id, item.reward, item.points)
                    }
                  />
                  <VStack>
                    <Text fontWeight="bold">{item.title}</Text>
                    <Text color="$muted" fontSize="$sm">
                      +{item.reward} Koin • +{item.points} Pts
                    </Text>
                  </VStack>
                </HStack>
                {done && (
                  <Badge bgColor="$success100" borderRadius="$full" px="$2">
                    <Text color="$success700">Selesai</Text>
                  </Badge>
                )}
              </HStack>
            </Card>
          );
        })}
      </VStack>

      {/* Reward Section */}
      {allDone && (
        <VStack alignItems="center" mt="$8" space="sm">
          <Icon as={Gift} size="xl" color="#10B981" />
          <Text color="$success700" fontWeight="bold" fontSize="$lg">
            Semua tantangan selesai!
          </Text>
          <Text color="$muted" textAlign="center">
            Hadiah: Voucher Air Zam-Zam atau Dashboard Juara Daerah
          </Text>
        </VStack>
      )}

      {/* Leaderboard */}
      <View mt="$10" mb="$6">
        <HStack alignItems="center" mb="$3">
          <Icon as={Trophy} size="md" color="#F59E0B" mr="$2" />
          <Heading size="md">Papan Juara Daerah</Heading>
        </HStack>

        {leaderboard.map((user, index) => (
          <Card
            key={user.id}
            mb="$2"
            p="$3"
            borderRadius="$lg"
            flexDirection="row"
            justifyContent="space-between"
            alignItems="center"
            backgroundColor={
              user.name === "Kamu"
                ? "#DBEAFE"
                : index === 0
                ? "#FFF7E6"
                : "#F9FAFB"
            }
          >
            <HStack space="sm" alignItems="center">
              <Text fontWeight="bold">{index + 1}.</Text>
              <Text>{user.name}</Text>
            </HStack>
            <HStack space="sm" alignItems="center">
              <Icon as={Coins} color="#FACC15" size="lg" />
              <Text fontWeight="bold" color="#FACC15">
                {user.coins}
              </Text>
              <Text fontWeight="bold">{user.score} pts</Text>
            </HStack>
          </Card>
        ))}
      </View>
    </ScrollView>
  );
}
