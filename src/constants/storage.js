export const STORAGE_KEYS = {
  // Profile
  PERSONAL_INFO: 'personal-info',
  USER_PROFILE: '@challenge_user_profile',
  STREAK_LEVEL: 'streak-level',
  
  // Challenge
  COIN: '@challenge_coin',
  POINTS: '@challenge_points',
  COMPLETED: '@challenge_completed',
  STREAK: '@challenge_streak',
  LAST_DATE: '@challenge_last_date',
  DAILY_PROGRESS: '@challenge_daily_progress',
  MAX_DAILY: '@challenge_max_daily',
  MOOD: '@challenge_mood',
  LEADERBOARD: '@leaderboard_cache'
};

export const DEFAULT_PROFILE = {
  id: 'current_user',
  name: "User",
  username: "",
  email: "",
  gender: "",
  birthdate: "",
  photoUrl: "",
  region: "Local",
  joinDate: new Date().toISOString().split('T')[0]
};