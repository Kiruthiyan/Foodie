import { StoredUser } from './authStorage';

const DUMMY_JSON_URL = 'https://dummyjson.com';

export interface LoginResponse {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  gender: string;
  image: string;
  token?: string;
  accessToken?: string;
  refreshToken?: string;
}

export interface RegisterPayload {
  username: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export interface RegisterResponse {
  id: number;
  firstName: string;
  lastName: string;
  username: string;
  email: string;
}

export const authService = {
  async login(username: string, password: string): Promise<{ token: string; user: StoredUser }> {
    const response = await fetch(`${DUMMY_JSON_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: username.trim(),
        password: password.trim(),
        expiresInMins: 60 * 24, // 24 hours
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Invalid username or password');
    }

    const token = data.accessToken || data.token;
    if (!token) {
      throw new Error('Authentication succeeded but no token received');
    }

    const user: StoredUser = {
      id: data.id,
      username: data.username,
      email: data.email,
      firstName: data.firstName,
      lastName: data.lastName,
      image: data.image,
    };

    return { token, user };
  },

  async register(payload: RegisterPayload): Promise<RegisterResponse> {
    const response = await fetch(`${DUMMY_JSON_URL}/users/add`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        firstName: payload.firstName.trim(),
        lastName: payload.lastName.trim(),
        username: payload.username.trim(),
        email: payload.email.trim(),
        password: payload.password,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Registration failed');
    }

    return {
      id: data.id,
      firstName: data.firstName,
      lastName: data.lastName,
      username: data.username,
      email: data.email,
    };
  },
};
