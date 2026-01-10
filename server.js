const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3001; // Port berbeda dari React Native

// Middleware
app.use(cors());
app.use(express.json());

// Simpan data ke file JSON
const DATA_FILE = path.join(__dirname, 'data.json');

// Inisialisasi data jika file tidak ada
const initializeData = () => {
  const defaultData = {
    user: {
      coin: 50,
      points: 150,
      completedChallenges: [],
      streak: 0,
      lastActiveDate: new Date().toISOString(),
      dailyProgress: 0,
      mood: "Semangat",
      settings: { 
        maxDailyChallenges: 5,
        useApi: true,
        notificationEnabled: true
      }
    },
    challenges: [
      {
        id: 1,
        title: "Minum 8 gelas air hari ini",
        reward: 10,
        points: 20,
        category: "daily",
        icon: "💧",
        description: "Penuhi kebutuhan hidrasi harian dengan minum 8 gelas air",
        difficulty: "easy",
        duration: "daily",
        target: 8
      },
      {
        id: 2,
        title: "Minum air sebelum makan",
        reward: 5,
        points: 10,
        category: "daily",
        icon: "🍽️",
        description: "Minum 1 gelas air 30 menit sebelum makan",
        difficulty: "easy",
        duration: "daily",
        target: 3
      },
      {
        id: 3,
        title: "Ganti minuman manis dengan air",
        reward: 15,
        points: 25,
        category: "healthy",
        icon: "🚫",
        description: "Hindari minuman manis dan ganti dengan air putih",
        difficulty: "medium",
        duration: "daily",
        target: 1
      },
      {
        id: 4,
        title: "Minum air setelah bangun tidur",
        reward: 5,
        points: 15,
        category: "daily",
        icon: "⏰",
        description: "Minum 1-2 gelas air setelah bangun tidur",
        difficulty: "easy",
        duration: "daily",
        target: 1
      },
      {
        id: 5,
        title: "Selesaikan 2Liter sebelum jam 6",
        reward: 20,
        points: 30,
        category: "hard",
        icon: "🎯",
        description: "Minum 2 liter air sebelum jam 6 sore",
        difficulty: "hard",
        duration: "daily",
        target: 2000
      },
      {
        id: 6,
        title: "Minum tanpa plastik sehari",
        reward: 25,
        points: 40,
        category: "eco",
        icon: "🌱",
        description: "Hindari menggunakan botol plastik sekali pakai",
        difficulty: "medium",
        duration: "daily",
        target: 1
      },
      {
        id: 7,
        title: "Minum air setiap 2 jam",
        reward: 15,
        points: 25,
        category: "discipline",
        icon: "⏱️",
        description: "Minum segelas air setiap 2 jam",
        difficulty: "medium",
        duration: "daily",
        target: 8
      },
      {
        id: 8,
        title: "Bawa botol minum sendiri",
        reward: 10,
        points: 20,
        category: "eco",
        icon: "🥤",
        description: "Bawa botol minum reusable saat bepergian",
        difficulty: "easy",
        duration: "daily",
        target: 1
      }
    ],
    history: [],
    achievements: []
  };

  if (!fs.existsSync(DATA_FILE)) {
    fs.writeFileSync(DATA_FILE, JSON.stringify(defaultData, null, 2));
  }
};

// Baca data dari file
const readData = () => {
  try {
    const data = fs.readFileSync(DATA_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading data:', error);
    initializeData();
    return readData();
  }
};

// Tulis data ke file
const writeData = (data) => {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
  } catch (error) {
    console.error('Error writing data:', error);
  }
};

// Update streak logic
const updateStreak = (user) => {
  const today = new Date().toDateString();
  const lastDate = user.lastActiveDate ? new Date(user.lastActiveDate).toDateString() : '';
  
  if (lastDate === today) return user.streak;
  
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = yesterday.toDateString();
  
  let newStreak = user.streak;
  
  if (lastDate === yesterdayStr) {
    newStreak += 1;
  } else if (lastDate !== today) {
    newStreak = 1;
  }
  
  return newStreak;
};

// Inisialisasi data saat server start
initializeData();

// ========== ROUTES ==========

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: '🌊 Challenge Water API Server',
    version: '1.0.0',
    endpoints: {
      challenges: 'GET /api/challenges',
      user: 'GET /api/user',
      toggleChallenge: 'POST /api/challenge/toggle/:id',
      reset: 'POST /api/reset',
      settings: 'PUT /api/settings',
      stats: 'GET /api/stats',
      history: 'GET /api/history'
    }
  });
});

// Get all challenges
app.get('/api/challenges', (req, res) => {
  console.log('GET /api/challenges');
  const data = readData();
  res.json({
    success: true,
    data: data.challenges,
    count: data.challenges.length
  });
});

// Get user data
app.get('/api/user', (req, res) => {
  console.log('GET /api/user');
  const data = readData();
  
  // Update streak sebelum mengirim response
  const updatedStreak = updateStreak(data.user);
  if (updatedStreak !== data.user.streak) {
    data.user.streak = updatedStreak;
    data.user.lastActiveDate = new Date().toISOString();
    writeData(data);
  }
  
  res.json({
    success: true,
    data: data.user
  });
});

// Toggle challenge completion
app.post('/api/challenge/toggle/:id', (req, res) => {
  const challengeId = parseInt(req.params.id);
  console.log(`POST /api/challenge/toggle/${challengeId}`);
  
  const data = readData();
  const challenge = data.challenges.find(c => c.id === challengeId);
  
  if (!challenge) {
    return res.status(404).json({ 
      success: false, 
      message: 'Challenge tidak ditemukan' 
    });
  }
  
  const user = data.user;
  const maxDaily = user.settings.maxDailyChallenges || 5;
  const completed = user.completedChallenges || [];
  
  // Check daily limit
  if (!completed.includes(challengeId) && completed.length >= maxDaily) {
    return res.status(400).json({
      success: false,
      message: `Maksimal ${maxDaily} tantangan per hari!`,
      remaining: 0,
      maxDaily
    });
  }
  
  let newCompleted = [...completed];
  let newCoin = user.coin;
  let newPoints = user.points;
  let newProgress = user.dailyProgress || 0;
  let newMood = user.mood;
  
  // Progress per challenge
  const progressPerChallenge = 100 / data.challenges.length;
  
  if (newCompleted.includes(challengeId)) {
    // Uncomplete challenge
    newCompleted = newCompleted.filter(id => id !== challengeId);
    newCoin -= challenge.reward;
    newPoints -= challenge.points;
    newProgress = Math.max(newProgress - progressPerChallenge, 0);
    
    // Add to history
    data.history.push({
      type: 'unchallenge',
      challengeId,
      title: challenge.title,
      coinChange: -challenge.reward,
      pointsChange: -challenge.points,
      timestamp: new Date().toISOString()
    });
  } else {
    // Complete challenge
    newCompleted.push(challengeId);
    newCoin += challenge.reward;
    newPoints += challenge.points;
    newProgress = Math.min(newProgress + progressPerChallenge, 100);
    
    // Random mood update
    const moods = ["Semangat", "Bahagia", "Produktif", "Tenang", "Bersemangat", "Energik"];
    newMood = moods[Math.floor(Math.random() * moods.length)];
    
    // Add to history
    data.history.push({
      type: 'challenge_completed',
      challengeId,
      title: challenge.title,
      coinChange: challenge.reward,
      pointsChange: challenge.points,
      timestamp: new Date().toISOString()
    });
  }
  
  // Update streak
  const updatedStreak = updateStreak(user);
  
  // Update user data
  user.coin = newCoin;
  user.points = newPoints;
  user.completedChallenges = newCompleted;
  user.dailyProgress = newProgress;
  user.mood = newMood;
  user.streak = updatedStreak;
  user.lastActiveDate = new Date().toISOString();
  
  writeData(data);
  
  res.json({
    success: true,
    data: {
      coin: newCoin,
      points: newPoints,
      completedChallenges: newCompleted,
      dailyProgress: newProgress,
      mood: newMood,
      streak: updatedStreak,
      maxDailyReached: newCompleted.length >= maxDaily,
      remaining: Math.max(0, maxDaily - newCompleted.length)
    }
  });
});

// Reset all data
app.post('/api/reset', (req, res) => {
  console.log('POST /api/reset');
  
  const defaultData = {
    coin: 50,
    points: 150,
    completedChallenges: [],
    streak: 0,
    lastActiveDate: new Date().toISOString(),
    dailyProgress: 0,
    mood: "Semangat",
    settings: { 
      maxDailyChallenges: 5,
      useApi: true,
      notificationEnabled: true
    }
  };
  
  const data = readData();
  data.user = defaultData;
  data.history.push({
    type: 'reset',
    timestamp: new Date().toISOString()
  });
  
  writeData(data);
  
  res.json({ 
    success: true, 
    message: 'Data berhasil direset ke default' 
  });
});

// Update settings
app.put('/api/settings', (req, res) => {
  console.log('PUT /api/settings', req.body);
  
  const { maxDailyChallenges, notificationEnabled } = req.body;
  const data = readData();
  
  if (maxDailyChallenges !== undefined) {
    const max = parseInt(maxDailyChallenges);
    if (max < 1 || max > data.challenges.length) {
      return res.status(400).json({
        success: false,
        message: `Max daily challenges must be between 1 and ${data.challenges.length}`
      });
    }
    data.user.settings.maxDailyChallenges = max;
  }
  
  if (notificationEnabled !== undefined) {
    data.user.settings.notificationEnabled = notificationEnabled;
  }
  
  writeData(data);
  
  res.json({
    success: true,
    data: data.user.settings
  });
});

// Get statistics
app.get('/api/stats', (req, res) => {
  console.log('GET /api/stats');
  const data = readData();
  
  const stats = {
    totalChallenges: data.challenges.length,
    completedToday: data.user.completedChallenges.length,
    maxDaily: data.user.settings.maxDailyChallenges,
    remainingToday: Math.max(0, data.user.settings.maxDailyChallenges - data.user.completedChallenges.length),
    totalPoints: data.user.points,
    totalCoins: data.user.coin,
    currentStreak: data.user.streak,
    mood: data.user.mood
  };
  
  res.json({
    success: true,
    data: stats
  });
});

// Get history
app.get('/api/history', (req, res) => {
  console.log('GET /api/history');
  const data = readData();
  
  // Return last 20 items
  const history = data.history.slice(-20).reverse();
  
  res.json({
    success: true,
    data: history,
    count: history.length
  });
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'Server is healthy',
    timestamp: new Date().toISOString()
  });
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Challenge Water API Server running:`);
  console.log(`   Local: http://localhost:${PORT}`);
  console.log(`   Network: http://[YOUR_IP]:${PORT}`);
  console.log(`\n📱 Untuk React Native, gunakan:`);
  console.log(`   API Base URL: http://[YOUR_IP]:${PORT}/api`);
  console.log(`\n✅ Server siap digunakan!`);
});

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.log('\n🔻 Server shutting down...');
  process.exit(0);
});