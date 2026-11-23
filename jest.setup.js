// Mock Expo SecureStore
jest.mock('expo-secure-store', () => {
  const store = new Map();
  return {
    getItemAsync: jest.fn(async (key) => store.get(key) || null),
    setItemAsync: jest.fn(async (key, value) => {
      store.set(key, value);
    }),
    deleteItemAsync: jest.fn(async (key) => {
      store.delete(key);
    }),
  };
});

// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () => {
  const storage = new Map();
  return {
    getItem: jest.fn(async (key) => storage.get(key) || null),
    setItem: jest.fn(async (key, value) => {
      storage.set(key, value);
    }),
    removeItem: jest.fn(async (key) => {
      storage.delete(key);
    }),
    clear: jest.fn(async () => {
      storage.clear();
    }),
  };
});

// Mock vector icons
jest.mock('@expo/vector-icons', () => ({
  Feather: 'Feather',
}));
