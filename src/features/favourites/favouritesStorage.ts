import AsyncStorage from '@react-native-async-storage/async-storage';

export interface FavouriteRecipe {
  idMeal: string;
  strMeal: string;
  strMealThumb: string;
  strCategory?: string;
  strArea?: string;
  savedAt: string;
}

const getStorageKey = (userId: number | string): string => `foodie_favourites_${userId}`;

export const favouritesStorage = {
  async loadFavourites(userId: number | string): Promise<FavouriteRecipe[]> {
    try {
      const raw = await AsyncStorage.getItem(getStorageKey(userId));
      if (!raw) return [];
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        return parsed;
      }
      return [];
    } catch (error) {
      console.warn(`Failed to load favourites for user ${userId}:`, error);
      return [];
    }
  },

  async saveFavourites(userId: number | string, favourites: FavouriteRecipe[]): Promise<void> {
    try {
      await AsyncStorage.setItem(getStorageKey(userId), JSON.stringify(favourites));
    } catch (error) {
      console.warn(`Failed to persist favourites for user ${userId}:`, error);
    }
  },

  async clearFavourites(userId: number | string): Promise<void> {
    try {
      await AsyncStorage.removeItem(getStorageKey(userId));
    } catch (error) {
      console.warn(`Failed to clear favourites for user ${userId}:`, error);
    }
  },
};
