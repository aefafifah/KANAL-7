import React, { useState, useEffect, useCallback } from "react";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from "@react-navigation/native";
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
  Button,
  ButtonText,
  Pressable,
  Modal,
  Input,
  InputField,
  Center,
  AlertDialog,
  AlertDialogBackdrop,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogBody,
  AlertDialogFooter,
  Avatar,
  AvatarFallbackText,
  AvatarImage
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
  Settings,
  AlertTriangle,
  Wifi,
  WifiOff,
  RefreshCw,
  Award,
  Zap,
  Users,
} from "lucide-react-native";
import { STORAGE_KEYS, DEFAULT_PROFILE } from '../src/constants/storage';

// ========== KONFIGURASI ==========
const API_BASE_URL = 'http://192.168.229.195:3001';
const USE_API_MODE = false;

// Warna tema
const PRIMARY = "#2563EB";
const SOFT_BG = "#EEF2FF";
const CARD_BG = "$white";
const SUCCESS = "#22C55E";
const WARNING = "#F59E0B";

// Data dummy untuk leaderboard (fallback jika tidak ada user lain)
const DEFAULT_LEADERBOARD = [
  { id: 2, name: "Bagus", username: "bagus_01", score: 190, coins: 60, avatar: null, region: "Jakarta" },
  { id: 3, name: "Dewi", username: "dewi_h2o", score: 160, coins: 55, avatar: null, region: "Bandung" },
  { id: 4, name: "Rizky", username: "rizky_aqua", score: 145, coins: 48, avatar: null, region: "Surabaya" },
  { id: 5, name: "Sari", username: "sari_water", score: 130, coins: 42, avatar: null, region: "Yogyakarta" },
  { id: 6, name: "Ahmad", username: "ahmad_hydrate", score: 120, coins: 40, avatar: null, region: "Medan" },
];

export default function ChallengeWater() {
  const [coin, setCoin] = useState(50);
  const [points, setPoints] = useState(150);
  const [completedChallenges, setCompletedChallenges] = useState([]);
  const [currentProgress, setCurrentProgress] = useState(0);
  const [loading, setLoading] = useState(true);
  const [streak, setStreak] = useState(0);
  const [lastActiveDate, setLastActiveDate] = useState('');
  const [mood, setMood] = useState("Semangat");
  const [maxDaily, setMaxDaily] = useState(5);
  const [showSettings, setShowSettings] = useState(false);
  const [tempMaxDaily, setTempMaxDaily] = useState("5");
  const [apiMode, setApiMode] = useState(USE_API_MODE);
  const [apiStatus, setApiStatus] = useState("❌ Offline");
  
  // User profile state
  const [userProfile, setUserProfile] = useState({
    ...DEFAULT_PROFILE,
    name: "Kamu"
  });

  // Leaderboard state
  const [leaderboard, setLeaderboard] = useState([...DEFAULT_LEADERBOARD]);
  
  // Alert states
  const [showAlert, setShowAlert] = useState(false);
  const [alertTitle, setAlertTitle] = useState("");
  const [alertMessage, setAlertMessage] = useState("");
  const [showResetAlert, setShowResetAlert] = useState(false);

  // Daftar tantangan
  const challenges = [
    { id: 1, title: "Minum 8 gelas air hari ini", reward: 10, points: 20, category: "daily", icon: "💧" },
    { id: 2, title: "Minum air sebelum makan", reward: 5, points: 10, category: "daily", icon: "🍽️" },
    { id: 3, title: "Ganti minuman manis dengan air", reward: 15, points: 25, category: "healthy", icon: "🚫" },
    { id: 4, title: "Minum air setelah bangun tidur", reward: 5, points: 15, category: "daily", icon: "⏰" },
    { id: 5, title: "Selesaikan 2L sebelum jam 6", reward: 20, points: 30, category: "hard", icon: "🎯" },
    { id: 6, title: "Minum tanpa plastik sehari", reward: 25, points: 40, category: "eco", icon: "🌱" },
  ];

  // Load user profile - UPDATED
  const loadUserProfile = async () => {
    try {
      console.log('📱 Loading user profile...');
      
      // Coba load dari key challenge dulu
      let savedProfile = await AsyncStorage.getItem(STORAGE_KEYS.USER_PROFILE);
      
      if (!savedProfile) {
        console.log('📱 No USER_PROFILE, trying PERSONAL_INFO...');
        // Fallback ke personal-info dari Profile.js
        savedProfile = await AsyncStorage.getItem(STORAGE_KEYS.PERSONAL_INFO);
      }
      
      if (savedProfile) {
        const profile = JSON.parse(savedProfile);
        console.log('📱 Profile loaded:', profile);
        
        const updatedProfile = {
          ...DEFAULT_PROFILE,
          ...profile,
          name: profile.username || profile.name || "Kamu",
          username: profile.username || "",
          region: profile.region || "Local",
          photoUrl: profile.photoUrl || ""
        };
        
        setUserProfile(updatedProfile);
        
        // Update leaderboard dengan profil yang baru
        updateLeaderboardWithProfile(updatedProfile);
        
        return updatedProfile;
      } else {
        console.log('📱 No profile found in storage');
        return null;
      }
    } catch (error) {
      console.error('❌ Error loading profile:', error);
      return null;
    }
  };

  // Update leaderboard dengan profile yang baru
  const updateLeaderboardWithProfile = (profile) => {
    setLeaderboard(prev => {
      // Cari apakah user sudah ada di leaderboard
      const existingIndex = prev.findIndex(user => user.id === 'current_user');
      
      if (existingIndex !== -1) {
        // Update existing user
        const updated = [...prev];
        updated[existingIndex] = {
          ...updated[existingIndex],
          name: profile.name,
          username: profile.username || "kamu",
          avatar: profile.photoUrl,
          region: profile.region
        };
        return updated.sort((a, b) => b.score - a.score);
      } else {
        // Tambah user baru ke leaderboard
        const userEntry = {
          id: 'current_user',
          name: profile.name,
          username: profile.username || "kamu",
          score: points,
          coins: coin,
          avatar: profile.photoUrl,
          region: profile.region
        };
        
        const combined = [userEntry, ...DEFAULT_LEADERBOARD]
          .sort((a, b) => b.score - a.score);
        
        return combined;
      }
    });
  };

  // Load leaderboard data (dari API atau cache) - UPDATED
  const loadLeaderboard = async (forceUpdate = false) => {
    try {
      // Coba load dari cache dulu
      const cachedLeaderboard = await AsyncStorage.getItem(STORAGE_KEYS.LEADERBOARD);
      
      if (cachedLeaderboard && !forceUpdate) {
        const parsed = JSON.parse(cachedLeaderboard);
        
        // Update current user's data dengan profile terbaru
        const updated = parsed.map(user => {
          if (user.id === 'current_user') {
            return {
              ...user,
              score: points,
              coins: coin,
              name: userProfile.name,
              username: userProfile.username || "kamu",
              avatar: userProfile.photoUrl,
              region: userProfile.region
            };
          }
          return user;
        }).sort((a, b) => b.score - a.score);
        
        setLeaderboard(updated);
      } else {
        // Buat leaderboard baru dengan user saat ini
        const userEntry = {
          id: 'current_user',
          name: userProfile.name,
          username: userProfile.username || "kamu",
          score: points,
          coins: coin,
          avatar: userProfile.photoUrl,
          region: userProfile.region
        };
        
        const combined = [userEntry, ...DEFAULT_LEADERBOARD]
          .sort((a, b) => b.score - a.score);
        
        setLeaderboard(combined);
        
        // Simpan ke cache
        await AsyncStorage.setItem(STORAGE_KEYS.LEADERBOARD, JSON.stringify(combined));
      }
    } catch (error) {
      console.error('Error loading leaderboard:', error);
    }
  };

  // Helper untuk show alert
  const showCustomAlert = (title, message) => {
    setAlertTitle(title);
    setAlertMessage(message);
    setShowAlert(true);
  };

  // ========== TEST API CONNECTION ==========
  const testAPIConnection = async () => {
    try {
      console.log(`🔌 Testing API: ${API_BASE_URL}/api/health`);
      setApiStatus("🔄 Testing...");
      
      const response = await fetch(`${API_BASE_URL}/api/health`, {
        method: 'GET',
        timeout: 3000
      });
      
      if (response.ok) {
        const result = await response.json();
        console.log('✅ API Connected:', result);
        setApiStatus("✅ Online");
        showCustomAlert("API Connected", "Server API berhasil terhubung!");
        return true;
      }
    } catch (error) {
      console.log('❌ API Error:', error.message);
      setApiStatus("❌ Offline");
      showCustomAlert(
        "API Error", 
        `Gagal terhubung ke server:\n${API_BASE_URL}\n\nGunakan Local Mode dulu.`
      );
    }
    return false;
  };

  // ========== LOCAL STORAGE FUNCTIONS ==========
  const initializeData = async () => {
    try {
      const savedCoin = await AsyncStorage.getItem(STORAGE_KEYS.COIN);
      
      if (savedCoin === null) {
        await Promise.all([
          AsyncStorage.setItem(STORAGE_KEYS.COIN, '50'),
          AsyncStorage.setItem(STORAGE_KEYS.POINTS, '150'),
          AsyncStorage.setItem(STORAGE_KEYS.COMPLETED, JSON.stringify([])),
          AsyncStorage.setItem(STORAGE_KEYS.STREAK, '0'),
          AsyncStorage.setItem(STORAGE_KEYS.DAILY_PROGRESS, '0'),
          AsyncStorage.setItem(STORAGE_KEYS.LAST_DATE, new Date().toISOString()),
          AsyncStorage.setItem(STORAGE_KEYS.MAX_DAILY, '5'),
          AsyncStorage.setItem(STORAGE_KEYS.MOOD, 'Semangat'),
        ]);
        console.log('📁 Data initialized');
      }
    } catch (error) {
      console.error('Error initializing:', error);
    }
  };

  const loadData = async () => {
    try {
      const [
        savedCoin, savedPoints, savedCompleted,
        savedStreak, savedProgress, savedLastDate,
        savedMaxDaily, savedMood
      ] = await Promise.all([
        AsyncStorage.getItem(STORAGE_KEYS.COIN),
        AsyncStorage.getItem(STORAGE_KEYS.POINTS),
        AsyncStorage.getItem(STORAGE_KEYS.COMPLETED),
        AsyncStorage.getItem(STORAGE_KEYS.STREAK),
        AsyncStorage.getItem(STORAGE_KEYS.DAILY_PROGRESS),
        AsyncStorage.getItem(STORAGE_KEYS.LAST_DATE),
        AsyncStorage.getItem(STORAGE_KEYS.MAX_DAILY),
        AsyncStorage.getItem(STORAGE_KEYS.MOOD),
      ]);

      setCoin(parseInt(savedCoin) || 50);
      setPoints(parseInt(savedPoints) || 150);
      setCompletedChallenges(savedCompleted ? JSON.parse(savedCompleted) : []);
      setStreak(parseInt(savedStreak) || 0);
      setCurrentProgress(parseFloat(savedProgress) || 0);
      setLastActiveDate(savedLastDate || '');
      setMaxDaily(parseInt(savedMaxDaily) || 5);
      setTempMaxDaily((parseInt(savedMaxDaily) || 5).toString());
      setMood(savedMood || "Semangat");

      console.log('📁 Data loaded from storage');
      
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const checkStreak = async () => {
    try {
      const today = new Date().toDateString();
      const lastDateStr = lastActiveDate ? new Date(lastActiveDate).toDateString() : '';
      
      if (lastDateStr === today) return;
      
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = yesterday.toDateString();
      
      let newStreak = streak;
      
      if (lastDateStr === yesterdayStr) {
        newStreak += 1;
      } else if (lastDateStr !== today) {
        newStreak = 1;
      }
      
      setStreak(newStreak);
      setLastActiveDate(new Date().toISOString());
      
      await AsyncStorage.setItem(STORAGE_KEYS.STREAK, newStreak.toString());
      await AsyncStorage.setItem(STORAGE_KEYS.LAST_DATE, new Date().toISOString());
      
    } catch (error) {
      console.error('Error checking streak:', error);
    }
  };

  const toggleChallenge = async (challengeId, reward, challengePoints) => {
    try {
      // Cek batas harian
      if (!completedChallenges.includes(challengeId) && 
          completedChallenges.length >= maxDaily) {
        showCustomAlert(
          "⏸️ Batas Harian",
          `Maksimal ${maxDaily} tantangan per hari!\nTersisa: 0`
        );
        return;
      }

      let newCompleted = [...completedChallenges];
      let newCoin = coin;
      let newPoints = points;
      let newProgress = currentProgress;
      
      const progressPerChallenge = 100 / challenges.length;
      
      if (newCompleted.includes(challengeId)) {
        // Uncomplete challenge
        newCompleted = newCompleted.filter(id => id !== challengeId);
        newCoin -= reward;
        newPoints -= challengePoints;
        newProgress = Math.max(newProgress - progressPerChallenge, 0);
      } else {
        // Complete challenge
        newCompleted.push(challengeId);
        newCoin += reward;
        newPoints += challengePoints;
        newProgress = Math.min(newProgress + progressPerChallenge, 100);
        
        // Cek jika mencapai batas
        if (newCompleted.length >= maxDaily) {
          showCustomAlert(
            "🏆 Hari Ini Selesai!",
            `Kamu telah menyelesaikan ${maxDaily} tantangan!\nTunggu besok untuk tantangan baru.`
          );
        }
      }
      
      // Update state
      setCompletedChallenges(newCompleted);
      setCoin(newCoin);
      setPoints(newPoints);
      setCurrentProgress(newProgress);
      
      // Save to storage
      await Promise.all([
        AsyncStorage.setItem(STORAGE_KEYS.COIN, newCoin.toString()),
        AsyncStorage.setItem(STORAGE_KEYS.POINTS, newPoints.toString()),
        AsyncStorage.setItem(STORAGE_KEYS.COMPLETED, JSON.stringify(newCompleted)),
        AsyncStorage.setItem(STORAGE_KEYS.DAILY_PROGRESS, newProgress.toString()),
        AsyncStorage.setItem(STORAGE_KEYS.LAST_DATE, new Date().toISOString()),
      ]);
      
      // Update streak
      await checkStreak();
      
      // Update leaderboard setelah perubahan points/coin
      await loadLeaderboard(true);
      
    } catch (error) {
      console.error('Error toggling challenge:', error);
      showCustomAlert("Error", 'Gagal menyimpan progress');
    }
  };

  const handleResetData = async () => {
    setShowResetAlert(true);
  };

  const executeResetData = async () => {
    try {
      await AsyncStorage.multiRemove([
        STORAGE_KEYS.COIN,
        STORAGE_KEYS.POINTS,
        STORAGE_KEYS.COMPLETED,
        STORAGE_KEYS.STREAK,
        STORAGE_KEYS.DAILY_PROGRESS,
        STORAGE_KEYS.LAST_DATE,
        STORAGE_KEYS.MAX_DAILY,
        STORAGE_KEYS.MOOD,
        STORAGE_KEYS.LEADERBOARD
      ]);
      
      await initializeData();
      await loadData();
      // Load profile dulu sebelum leaderboard
      await loadUserProfile();
      await loadLeaderboard(true);
      showCustomAlert("Berhasil", "Data direset ke default");
    } catch (error) {
      showCustomAlert("Error", "Gagal mereset data");
    } finally {
      setShowResetAlert(false);
    }
  };

  const updateMaxDaily = async () => {
    const newMax = parseInt(tempMaxDaily) || 5;
    
    if (newMax < 1 || newMax > challenges.length) {
      showCustomAlert("Error", `Masukkan angka 1-${challenges.length}`);
      return;
    }
    
    setMaxDaily(newMax);
    await AsyncStorage.setItem(STORAGE_KEYS.MAX_DAILY, newMax.toString());
    setShowSettings(false);
    
    showCustomAlert(
      "Pengaturan Disimpan",
      `Batas tantangan: ${newMax} per hari\nSaat ini: ${completedChallenges.length}/${newMax}`
    );
  };

  const toggleApiMode = async () => {
    if (apiMode) {
      setApiMode(false);
      showCustomAlert("Local Mode", "Menggunakan penyimpanan lokal");
    } else {
      // Coba konek ke API dulu
      const connected = await testAPIConnection();
      if (connected) {
        setApiMode(true);
      }
    }
  };

  // Update leaderboard saat points/coin berubah - UPDATED
  useEffect(() => {
    const updateLeaderboard = async () => {
      const updated = leaderboard.map(user => {
        if (user.id === 'current_user') {
          return {
            ...user,
            score: points,
            coins: coin,
            name: userProfile.name,
            username: userProfile.username || "kamu",
            avatar: userProfile.photoUrl,
            region: userProfile.region
          };
        }
        return user;
      }).sort((a, b) => b.score - a.score);
      
      setLeaderboard(updated);
      // Simpan ke cache
      await AsyncStorage.setItem(STORAGE_KEYS.LEADERBOARD, JSON.stringify(updated));
    };
    
    if (leaderboard.length > 0) {
      updateLeaderboard();
    }
  }, [points, coin]);

  // Update leaderboard saat userProfile berubah - NEW
  useEffect(() => {
    if (userProfile && userProfile.name !== "Kamu") {
      updateLeaderboardWithProfile(userProfile);
    }
  }, [userProfile]);

  // Load data saat component mount - UPDATED
  useFocusEffect(
    useCallback(() => {
      const init = async () => {
        setLoading(true);
        console.log('🔄 Initializing ChallengeWater...');
        await initializeData();
        await loadData();
        
        // Load profile dulu, tunggu selesai
        const profile = await loadUserProfile();
        
        // Setelah profile loaded, baru load leaderboard
        if (profile) {
          await loadLeaderboard(true);
        } else {
          await loadLeaderboard(false);
        }
        
        setLoading(false);
        
        // Test API connection saat startup
        if (apiMode) {
          await testAPIConnection();
        }
        
        console.log('✅ ChallengeWater initialized');
      };
      
      init();
    }, [apiMode])
  );

  const getCurrentDate = () => {
    return new Date().toLocaleDateString('id-ID', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const remainingChallenges = Math.max(0, maxDaily - completedChallenges.length);
  const isMaxReached = completedChallenges.length >= maxDaily;
  const allDone = completedChallenges.length === maxDaily;

  // Fungsi untuk get avatar fallback
  const getAvatarFallback = (name) => {
    return name ? name.charAt(0).toUpperCase() : "?";
  };

  // Fungsi untuk get user rank emoji
  const getRankEmoji = (index) => {
    switch(index) {
      case 0: return "🥇";
      case 1: return "🥈";
      case 2: return "🥉";
      default: return `${index + 1}.`;
    }
  };

  // Fungsi untuk refresh semua data - UPDATED
  const refreshAllData = async () => {
    setLoading(true);
    try {
      await loadData();
      await loadUserProfile();
      await loadLeaderboard(true);
      showCustomAlert("Data Diperbarui", "Profil dan leaderboard berhasil diupdate!");
    } catch (error) {
      console.error('Error refreshing data:', error);
      showCustomAlert("Error", "Gagal memperbarui data");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Center flex={1} bg={SOFT_BG}>
        <VStack space="md" alignItems="center">
          <Icon as={RefreshCw} size="xl" color={PRIMARY} animation="spin" />
          <Text>Memuat tantangan...</Text>
        </VStack>
      </Center>
    );
  }

  return (
    <>
      <ScrollView flex={1} bg={SOFT_BG}>
        <VStack space="lg" p="$4" pb="$8">
          
          {/* ===== HEADER ===== */}
          <Box alignItems="center">
            <Box bg="#DBEAFE" p="$3" rounded="$full" mb="$2">
              <Droplet size={28} color={PRIMARY} />
            </Box>
            <Heading color={PRIMARY}>Tantangan Harian Air</Heading>
            <Text color="#64748B">{getCurrentDate()}</Text>

            <HStack alignItems="center" space="sm" mt="$2">
              <HStack alignItems="center" space="xs">
                <Smile size={16} color="#FACC15" />
                <Text fontSize="$sm">
                  Mood: <Text fontWeight="bold">{mood}</Text>
                </Text>
              </HStack>
              
              <HStack alignItems="center" space="xs">
                <Zap size={16} color={WARNING} />
                <Text fontSize="$sm">
                  Streak: <Text fontWeight="bold">{streak} hari</Text>
                </Text>
              </HStack>
              
              <Pressable onPress={toggleApiMode}>
                <HStack alignItems="center" space="xs">
                  <Icon 
                    as={apiMode ? Wifi : WifiOff} 
                    size={16} 
                    color={apiMode ? SUCCESS : "#64748B"} 
                  />
                  <Text fontSize="$sm" color={apiMode ? SUCCESS : "#64748B"}>
                    {apiMode ? 'API' : 'Local'}
                  </Text>
                </HStack>
              </Pressable>
            </HStack>
          </Box>

          {/* ===== USER PROFILE SUMMARY ===== */}
          <Pressable onPress={() => {/* Navigate to profile */}}>
            <Box bg={CARD_BG} p="$4" rounded="$2xl" shadow="$1">
              <HStack alignItems="center" space="sm">
                <Avatar size="md" bg="#DBEAFE">
                  {userProfile.photoUrl ? (
                    <AvatarImage source={{ uri: userProfile.photoUrl }} />
                  ) : (
                    <AvatarFallbackText>
                      {getAvatarFallback(userProfile.name)}
                    </AvatarFallbackText>
                  )}
                </Avatar>
                <VStack flex={1}>
                  <Text fontWeight="bold">{userProfile.name}</Text>
                  <Text fontSize="$sm" color="#64748B">
                    @{userProfile.username || "user"} • {userProfile.region}
                  </Text>
                </VStack>
                <Box bg="#DBEAFE" px="$3" py="$1" rounded="$full">
                  <Text fontSize="$sm" fontWeight="bold" color={PRIMARY}>
                    #{leaderboard.findIndex(u => u.id === 'current_user') + 1 || 1}
                  </Text>
                </Box>
              </HStack>
            </Box>
          </Pressable>

          {/* ===== MODE INFO ===== */}
          <Box 
            bg={apiMode ? "#DCFCE7" : "#DBEAFE"} 
            p="$3" 
            rounded="$xl" 
            borderWidth={1} 
            borderColor={apiMode ? "#BBF7D0" : "#BFDBFE"}
          >
            <HStack space="sm" alignItems="center">
              <Icon 
                as={apiMode ? Wifi : WifiOff} 
                color={apiMode ? SUCCESS : PRIMARY} 
                size="sm"
              />
              <VStack flex={1}>
                <Text fontWeight="bold" color={apiMode ? "#166534" : "#1E40AF"}>
                  {apiMode ? 'API Mode' : 'Local Mode'}
                </Text>
                <Text size="sm" color={apiMode ? "#166534" : "#1E40AF"}>
                  {apiMode 
                    ? `Server: ${API_BASE_URL}` 
                    : 'Menggunakan penyimpanan lokal'}
                </Text>
                {apiMode && (
                  <Text size="xs" color="#64748B">
                    Status: {apiStatus}
                  </Text>
                )}
              </VStack>
              <Button size="xs" onPress={testAPIConnection} bg={apiMode ? SUCCESS : PRIMARY}>
                <ButtonText>Test</ButtonText>
              </Button>
            </HStack>
          </Box>

          {/* ===== DAILY LIMIT ALERT ===== */}
          {isMaxReached && (
            <Box 
              bg="#FEF3C7" 
              p="$3" 
              rounded="$xl" 
              borderWidth={1} 
              borderColor="#FDE68A"
            >
              <HStack space="sm" alignItems="center">
                <AlertTriangle size={16} color="#D97706" />
                <VStack flex={1}>
                  <Text fontWeight="bold" color="#92400E">Batas Harian Tercapai!</Text>
                  <Text size="sm" color="#92400E">
                    {completedChallenges.length}/{maxDaily} tantangan selesai hari ini
                  </Text>
                </VStack>
              </HStack>
            </Box>
          )}

          {/* ===== COIN & POINTS ===== */}
          <Box bg={CARD_BG} p="$4" rounded="$2xl" shadow="$1">
            <HStack justifyContent="space-around">
              <HStack alignItems="center" space="sm">
                <Box bg="#FEF3C7" p="$2" rounded="$full">
                  <Coins size={20} color={WARNING} />
                </Box>
                <VStack>
                  <Text fontSize="$sm" color="#64748B">Koin</Text>
                  <Text fontWeight="bold" fontSize="$xl">{coin}</Text>
                </VStack>
              </HStack>

              <Divider orientation="vertical" h="$10" />

              <HStack alignItems="center" space="sm">
                <Box bg="#FEF3C7" p="$2" rounded="$full">
                  <Star size={20} color={WARNING} />
                </Box>
                <VStack>
                  <Text fontSize="$sm" color="#64748B">Poin</Text>
                  <Text fontWeight="bold" fontSize="$xl">{points}</Text>
                </VStack>
              </HStack>

              <Divider orientation="vertical" h="$10" />

              <HStack alignItems="center" space="sm">
                <Box bg="#DBEAFE" p="$2" rounded="$full">
                  <Trophy size={20} color={PRIMARY} />
                </Box>
                <VStack>
                  <Text fontSize="$sm" color="#64748B">Sisa</Text>
                  <Text 
                    fontWeight="bold" 
                    fontSize="$xl" 
                    color={isMaxReached ? SUCCESS : PRIMARY}
                  >
                    {remainingChallenges}
                  </Text>
                </VStack>
              </HStack>
            </HStack>
          </Box>

          {/* ===== PROGRESS BAR ===== */}
          <Box bg={CARD_BG} p="$4" rounded="$2xl" shadow="$1">
            <HStack justifyContent="space-between" mb="$2">
              <Text fontWeight="bold">Progress Harian</Text>
              <Badge bg={isMaxReached ? "#DCFCE7" : "#DBEAFE"} borderRadius="$full" px="$3">
                <Text color={isMaxReached ? "#166534" : "#1E40AF"}>
                  {Math.round(currentProgress)}%
                </Text>
              </Badge>
            </HStack>
            <Progress value={currentProgress} h="$2" borderRadius="$full">
              <ProgressFilledTrack bg={isMaxReached ? SUCCESS : PRIMARY} />
            </Progress>
            <HStack justifyContent="space-between" mt="$1">
              <Text size="sm" color="#64748B">
                {completedChallenges.length}/{maxDaily} tantangan
              </Text>
              {remainingChallenges > 0 && (
                <Text size="sm" color={PRIMARY}>
                  {remainingChallenges} tersisa
                </Text>
              )}
            </HStack>
          </Box>

          {/* ===== ACTION BUTTONS ===== */}
          <HStack space="sm">
            <Button 
              flex={1} 
              variant="outline" 
              onPress={() => setShowSettings(true)}
              size="sm"
              bg={CARD_BG}
            >
              <Icon as={Settings} size="sm" color={PRIMARY} />
              <ButtonText ml="$2" color={PRIMARY}>Pengaturan</ButtonText>
            </Button>
            
            <Button 
              flex={1} 
              variant="outline" 
              onPress={toggleApiMode}
              size="sm"
              bg={apiMode ? "#DCFCE7" : "#DBEAFE"}
            >
              <Icon 
                as={apiMode ? Wifi : WifiOff} 
                size="sm" 
                color={apiMode ? SUCCESS : PRIMARY} 
              />
              <ButtonText ml="$2" color={apiMode ? "#166534" : "#1E40AF"}>
                {apiMode ? 'API' : 'LOCAL'}
              </ButtonText>
            </Button>
            
            <Button 
              flex={1} 
              variant="outline" 
              onPress={handleResetData}
              size="sm"
              bg="#FEE2E2"
            >
              <ButtonText color="#DC2626">Reset</ButtonText>
            </Button>
          </HStack>

          <Divider my="$2" />

          {/* ===== CHALLENGES LIST ===== */}
          <Box>
            <HStack justifyContent="space-between" alignItems="center" mb="$2">
              <Text fontSize="$lg" fontWeight="bold">Daftar Tantangan</Text>
              <Badge size="sm" variant="outline" bg="#F1F5F9">
                <Text size="xs">Maks: {maxDaily}</Text>
              </Badge>
            </HStack>

            <VStack space="sm">
              {challenges.map((challenge) => {
                const isCompleted = completedChallenges.includes(challenge.id);
                const isDisabled = !isCompleted && isMaxReached;
                
                return (
                  <Pressable
                    key={challenge.id}
                    onPress={() => !isDisabled && toggleChallenge(
                      challenge.id, 
                      challenge.reward, 
                      challenge.points
                    )}
                    disabled={isDisabled}
                  >
                    <Box
                      bg={isCompleted ? "#F0FDF4" : CARD_BG}
                      p="$4"
                      rounded="$xl"
                      borderWidth={1}
                      borderColor={isCompleted ? SUCCESS : "#E5E7EB"}
                      opacity={isDisabled ? 0.7 : 1}
                    >
                      <HStack justifyContent="space-between" alignItems="center">
                        <HStack space="sm" alignItems="center" flex={1}>
                          <Box 
                            bg={isCompleted ? "#DCFCE7" : "#F1F5F9"} 
                            p="$2" 
                            rounded="$full"
                          >
                            <Icon
                              as={isCompleted ? CheckCircle2 : Circle}
                              color={isCompleted ? SUCCESS : "#CBD5E1"}
                              size="lg"
                            />
                          </Box>
                          <VStack flex={1}>
                            <Text fontWeight="bold" color={isDisabled ? "#94A3B8" : "#1E293B"}>
                              {challenge.title}
                            </Text>
                            <HStack space="sm" mt="$1">
                              <Badge size="sm" bg="#F1F5F9">
                                <Text size="xs">{challenge.category}</Text>
                              </Badge>
                              <HStack space="xs" alignItems="center">
                                <Coins size={12} color={WARNING} />
                                <Text size="xs" color="#64748B">+{challenge.reward}</Text>
                              </HStack>
                              <HStack space="xs" alignItems="center">
                                <Star size={12} color={WARNING} />
                                <Text size="xs" color="#64748B">+{challenge.points}</Text>
                              </HStack>
                            </HStack>
                          </VStack>
                        </HStack>

                        {isCompleted ? (
                          <Badge bg="#DCFCE7" rounded="$full">
                            <Text color="#166534">Selesai</Text>
                          </Badge>
                        ) : isDisabled ? (
                          <Badge bg="#F1F5F9" rounded="$full">
                            <Text color="#64748B">🔒</Text>
                          </Badge>
                        ) : null}
                      </HStack>
                    </Box>
                  </Pressable>
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
              borderWidth={1}
              borderColor="#A7F3D0"
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
            <HStack alignItems="center" justifyContent="space-between" mb="$2">
              <HStack alignItems="center">
                <Trophy size={20} color={WARNING} />
                <Text fontSize="$lg" fontWeight="bold" ml="$2">
                  Papan Juara Daerah
                </Text>
              </HStack>
              <HStack alignItems="center" space="xs">
                <Users size={16} color="#64748B" />
                <Text fontSize="$sm" color="#64748B">
                  {leaderboard.length} peserta
                </Text>
              </HStack>
            </HStack>

            <VStack space="sm">
              {leaderboard.slice(0, 5).map((user, index) => {
                const isCurrentUser = user.id === 'current_user';
                return (
                  <Box
                    key={user.id}
                    bg={
                      isCurrentUser
                        ? "#DBEAFE"
                        : index === 0
                        ? "#FEF3C7"
                        : index === 1
                        ? "#F1F5F9"
                        : index === 2
                        ? "#FEF3C7"
                        : CARD_BG
                    }
                    p="$3"
                    rounded="$xl"
                    borderWidth={2}
                    borderColor={
                      isCurrentUser
                        ? "#BFDBFE"
                        : index === 0
                        ? "#FDE68A"
                        : index === 1
                        ? "#E5E7EB"
                        : index === 2
                        ? "#FDE68A"
                        : "#E5E7EB"
                    }
                  >
                    <HStack justifyContent="space-between" alignItems="center">
                      <HStack alignItems="center" space="sm" flex={1}>
                        <Text fontWeight="bold" fontSize="$lg" color={
                          isCurrentUser ? "#1E40AF" : 
                          index === 0 ? "#92400E" : "#1E293B"
                        }>
                          {getRankEmoji(index)}
                        </Text>
                        
                        <Avatar size="sm" bg="#DBEAFE">
                          {user.avatar ? (
                            <AvatarImage source={{ uri: user.avatar }} />
                          ) : (
                            <AvatarFallbackText>
                              {getAvatarFallback(user.name)}
                            </AvatarFallbackText>
                          )}
                        </Avatar>
                        
                        <VStack flex={1}>
                          <HStack alignItems="center" space="xs">
                            <Text fontWeight="bold" numberOfLines={1}>
                              {user.name}
                            </Text>
                            {index === 0 && <Award size={14} color="#F59E0B" />}
                            {isCurrentUser && (
                              <Badge size="xs" bg={PRIMARY}>
                                <Text color="$white" fontSize="$xs">Kamu</Text>
                              </Badge>
                            )}
                          </HStack>
                          <Text fontSize="$xs" color="#64748B" numberOfLines={1}>
                            @{user.username} • {user.region}
                          </Text>
                        </VStack>
                      </HStack>
                      
                      <VStack alignItems="flex-end">
                        <HStack alignItems="center" space="xs">
                          <Coins size={14} color="#FACC15" />
                          <Text fontWeight="bold" color="#92400E">{user.coins}</Text>
                        </HStack>
                        <Text fontSize="$xs" color="#64748B">
                          {user.score} pts
                        </Text>
                      </VStack>
                    </HStack>
                  </Box>
                );
              })}
              
              {/* View All Button */}
              {leaderboard.length > 5 && (
                <Button 
                  variant="outline" 
                  mt="$2" 
                  bg={CARD_BG}
                  onPress={() => {/* Navigate to full leaderboard */}}
                >
                  <ButtonText color={PRIMARY}>Lihat Semua ({leaderboard.length})</ButtonText>
                </Button>
              )}
            </VStack>
          </Box>

          {/* ===== INFO FOOTER ===== */}
          <Box 
            bg={CARD_BG} 
            p="$4" 
            rounded="$xl" 
            borderWidth={1} 
            borderColor="#E5E7EB"
          >
            <VStack space="sm">
              <HStack justifyContent="space-between">
                <Text color="#64748B">Status</Text>
                <Badge bg={apiMode ? "#DCFCE7" : "#DBEAFE"}>
                  <Text color={apiMode ? "#166534" : "#1E40AF"}>
                    {apiMode ? 'API Mode' : 'Local Storage'}
                  </Text>
                </Badge>
              </HStack>
              <HStack justifyContent="space-between">
                <Text color="#64748B">Progress Hari Ini</Text>
                <Text fontWeight="bold">{completedChallenges.length}/{maxDaily}</Text>
              </HStack>
              <HStack justifyContent="space-between">
                <Text color="#64748B">Streak</Text>
                <Text fontWeight="bold">{streak} hari</Text>
              </HStack>
              <HStack justifyContent="space-between">
                <Text color="#64748B">Peringkat</Text>
                <Text fontWeight="bold">
                  #{leaderboard.findIndex(u => u.id === 'current_user') + 1 || 1} dari {leaderboard.length}
                </Text>
              </HStack>
              <Button mt="$3" variant="link" onPress={refreshAllData}>
                <RefreshCw size={16} color={PRIMARY} />
                <ButtonText ml="$2" color={PRIMARY}>Refresh Data</ButtonText>
              </Button>
            </VStack>
          </Box>

        </VStack>
      </ScrollView>

      {/* ===== SETTINGS MODAL ===== */}
      <Modal isOpen={showSettings} onClose={() => setShowSettings(false)}>
        <Modal.Content maxWidth={400}>
          <Modal.Header>
            <Heading size="lg">Pengaturan</Heading>
          </Modal.Header>
          <Modal.Body>
            <VStack space="lg">
              <VStack space="sm">
                <Text fontWeight="bold">Mode Penyimpanan</Text>
                <HStack space="sm" alignItems="center">
                  <Button 
                    flex={1} 
                    variant={apiMode ? "solid" : "outline"}
                    onPress={() => !apiMode && toggleApiMode()}
                    bg={apiMode ? SUCCESS : undefined}
                  >
                    <ButtonText>API Mode</ButtonText>
                  </Button>
                  <Button 
                    flex={1} 
                    variant={!apiMode ? "solid" : "outline"}
                    onPress={() => apiMode && toggleApiMode()}
                    bg={!apiMode ? PRIMARY : undefined}
                  >
                    <ButtonText>Local Mode</ButtonText>
                  </Button>
                </HStack>
                <Text size="sm" color="#64748B">
                  {apiMode 
                    ? `Server: ${API_BASE_URL}` 
                    : 'Data tersimpan di perangkat lokal'}
                </Text>
              </VStack>
              
              <Divider />
              
              <VStack space="sm">
                <Text fontWeight="bold">Batas Tantangan Harian</Text>
                <HStack space="sm" alignItems="center">
                  <Text flex={1}>Maksimal:</Text>
                  <Input flex={2}>
                    <InputField
                      value={tempMaxDaily}
                      onChangeText={setTempMaxDaily}
                      keyboardType="numeric"
                      maxLength={1}
                    />
                  </Input>
                  <Text>dari {challenges.length}</Text>
                </HStack>
                <Text size="xs" color="#64748B">
                  Saat ini: {completedChallenges.length}/{tempMaxDaily}
                </Text>
              </VStack>
              
              <VStack space="sm">
                <Text fontWeight="bold">Profil Pengguna</Text>
                <HStack alignItems="center" space="sm">
                  <Avatar size="sm" bg="#DBEAFE">
                    {userProfile.photoUrl ? (
                      <AvatarImage source={{ uri: userProfile.photoUrl }} />
                    ) : (
                      <AvatarFallbackText>
                        {getAvatarFallback(userProfile.name)}
                      </AvatarFallbackText>
                    )}
                  </Avatar>
                  <VStack flex={1}>
                    <Text fontWeight="bold">{userProfile.name}</Text>
                    <Text size="sm" color="#64748B">
                      @{userProfile.username || "Belum diatur"}
                    </Text>
                  </VStack>
                </HStack>
              </VStack>
            </VStack>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="outline" onPress={() => setShowSettings(false)} mr="$3">
              <ButtonText>Batal</ButtonText>
            </Button>
            <Button onPress={updateMaxDaily} bg={PRIMARY}>
              <ButtonText>Simpan</ButtonText>
            </Button>
          </Modal.Footer>
        </Modal.Content>
      </Modal>

      {/* ===== ALERT DIALOG ===== */}
      <AlertDialog isOpen={showAlert} onClose={() => setShowAlert(false)}>
        <AlertDialogBackdrop />
        <AlertDialogContent>
          <AlertDialogHeader>
            <Heading size="lg">{alertTitle}</Heading>
          </AlertDialogHeader>
          <AlertDialogBody>
            <Text>{alertMessage}</Text>
          </AlertDialogBody>
          <AlertDialogFooter>
            <Button onPress={() => setShowAlert(false)} bg={PRIMARY}>
              <ButtonText>OK</ButtonText>
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* ===== RESET CONFIRMATION DIALOG ===== */}
      <AlertDialog isOpen={showResetAlert} onClose={() => setShowResetAlert(false)}>
        <AlertDialogBackdrop />
        <AlertDialogContent>
          <AlertDialogHeader>
            <Heading size="lg">Reset Data</Heading>
          </AlertDialogHeader>
          <AlertDialogBody>
            <Text>Reset semua progress ke default? Tindakan ini tidak dapat dibatalkan.</Text>
            <Text mt="$2" fontSize="$sm" color="#64748B">
              Catatan: Profil pengguna tidak akan direset.
            </Text>
          </AlertDialogBody>
          <AlertDialogFooter>
            <Button variant="outline" onPress={() => setShowResetAlert(false)} mr="$3">
              <ButtonText>Batal</ButtonText>
            </Button>
            <Button bg="#DC2626" onPress={executeResetData}>
              <ButtonText>Reset</ButtonText>
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}