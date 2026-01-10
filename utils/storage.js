// utils/storage.js
import AsyncStorage from '@react-native-async-storage/async-storage';

// Key constants
export const STORAGE_KEYS = {
  USER_DATA: '@user_data',
  CHALLENGE_PROGRESS: '@challenge_progress',
  WATER_LOGS: '@water_logs',
  SETTINGS: '@app_settings',
};

// 1. Save data
export const saveData = async (key, value) => {
  try {
    const jsonValue = JSON.stringify(value);
    await AsyncStorage.setItem(key, jsonValue);
    console.log(`✅ Data saved: ${key}`);
    return true;
  } catch (error) {
    console.error(`❌ Error saving ${key}:`, error);
    return false;
  }
};

// 2. Load data
export const loadData = async (key) => {
  try {
    const jsonValue = await AsyncStorage.getItem(key);
    return jsonValue != null ? JSON.parse(jsonValue) : null;
  } catch (error) {
    console.error(`❌ Error loading ${key}:`, error);
    return null;
  }
};

// 3. Remove data
export const removeData = async (key) => {
  try {
    await AsyncStorage.removeItem(key);
    console.log(`🗑️ Data removed: ${key}`);
    return true;
  } catch (error) {
    console.error(`❌ Error removing ${key}:`, error);
    return false;
  }
};

// 4. Clear all data
export const clearAllData = async () => {
  try {
    await AsyncStorage.clear();
    console.log('🧹 All data cleared');
    return true;
  } catch (error) {
    console.error('❌ Error clearing data:', error);
    return false;
  }
};

// 5. Get all keys
export const getAllKeys = async () => {
  try {
    const keys = await AsyncStorage.getAllKeys();
    return keys;
  } catch (error) {
    console.error('❌ Error getting keys:', error);
    return [];
  }
};

// 6. Get multiple items
export const getMultipleData = async (keys) => {
  try {
    const values = await AsyncStorage.multiGet(keys);
    return values.reduce((acc, [key, value]) => {
      acc[key] = value != null ? JSON.parse(value) : null;
      return acc;
    }, {});
  } catch (error) {
    console.error('❌ Error getting multiple data:', error);
    return {};
  }
};

// 7. Save multiple items
export const saveMultipleData = async (keyValuePairs) => {
  try {
    const pairs = keyValuePairs.map(([key, value]) => [
      key,
      JSON.stringify(value)
    ]);
    await AsyncStorage.multiSet(pairs);
    console.log(`✅ Multiple data saved`);
    return true;
  } catch (error) {
    console.error('❌ Error saving multiple data:', error);
    return false;
  }
};