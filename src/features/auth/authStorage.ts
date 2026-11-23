import * as SecureStore from 'expo-secure-store';

const TOKEN_KEY = 'foodie_auth_token';
const USER_KEY = 'foodie_auth_user';

export interface StoredUser {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  image?: string;
}

export const authStorage = {
  async saveSession(token: string, user: StoredUser): Promise<void> {
    try {
      await SecureStore.setItemAsync(TOKEN_KEY, token);
      await SecureStore.setItemAsync(USER_KEY, JSON.stringify(user));
    } catch (error) {
      console.warn('SecureStore: Failed to save session', error);
    }
  },

  async getSession(): Promise<{ token: string | null; user: StoredUser | null }> {
    try {
      const token = await SecureStore.getItemAsync(TOKEN_KEY);
      const userStr = await SecureStore.getItemAsync(USER_KEY);
      const user = userStr ? (JSON.parse(userStr) as StoredUser) : null;
      return { token, user };
    } catch (error) {
      console.warn('SecureStore: Failed to read session', error);
      return { token: null, user: null };
    }
  },

  async clearSession(): Promise<void> {
    try {
      await SecureStore.deleteItemAsync(TOKEN_KEY);
      await SecureStore.deleteItemAsync(USER_KEY);
    } catch (error) {
      console.warn('SecureStore: Failed to delete session', error);
    }
  },
};
