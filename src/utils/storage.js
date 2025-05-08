import AsyncStorage from '@react-native-async-storage/async-storage';

export const STORAGE_KEYS = {
  TIMERS: 'timers',
  HISTORY: 'history',
};

// Save item to AsyncStorage
export const saveItem = async (key, value) => {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error(`Failed to save ${key}:`, e);
  }
};

// Load item from AsyncStorage
export const loadItem = async (key) => {
  try {
    const data = await AsyncStorage.getItem(key);
    return data ? JSON.parse(data) : null;
  } catch (e) {
    console.error(`Failed to load ${key}:`, e);
    return null;
  }
};

// Append to existing list (e.g., add to history)
export const appendToList = async (key, item) => {
  try {
    const existing = await loadItem(key);
    const updated = existing ? [...existing, item] : [item];
    await saveItem(key, updated);
  } catch (e) {
    console.error(`Failed to append to ${key}:`, e);
  }
};

// Clear a key (useful for dev or reset actions)
export const clearItem = async (key) => {
  try {
    await AsyncStorage.removeItem(key);
  } catch (e) {
    console.error(`Failed to clear ${key}:`, e);
  }
};
