import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { authService } from './authService';
import { authStorage, StoredUser } from './authStorage';

interface AuthState {
  user: StoredUser | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isRestoringSession: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: false,
  isRestoringSession: true,
  error: null,
};

export const restoreSession = createAsyncThunk(
  'auth/restoreSession',
  async () => {
    const { token, user } = await authStorage.getSession();
    if (token && user) {
      return { token, user };
    }
    return null;
  }
);

export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async ({ username, password }: { username: string; password: string }, { rejectWithValue }) => {
    try {
      const { token, user } = await authService.login(username, password);
      await authStorage.saveSession(token, user);
      return { token, user };
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Login failed';
      return rejectWithValue(message);
    }
  }
);

export const logoutUser = createAsyncThunk(
  'auth/logoutUser',
  async () => {
    await authStorage.clearSession();
  }
);

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearAuthError: (state) => {
      state.error = null;
    },
    setMockAuthenticatedUser: (state, action: PayloadAction<{ user: StoredUser; token: string }>) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isAuthenticated = true;
      state.isRestoringSession = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Restore Session
    builder.addCase(restoreSession.pending, (state) => {
      state.isRestoringSession = true;
    });
    builder.addCase(restoreSession.fulfilled, (state, action) => {
      state.isRestoringSession = false;
      if (action.payload) {
        state.token = action.payload.token;
        state.user = action.payload.user;
        state.isAuthenticated = true;
      } else {
        state.token = null;
        state.user = null;
        state.isAuthenticated = false;
      }
    });
    builder.addCase(restoreSession.rejected, (state) => {
      state.isRestoringSession = false;
      state.isAuthenticated = false;
    });

    // Login
    builder.addCase(loginUser.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(loginUser.fulfilled, (state, action) => {
      state.isLoading = false;
      state.token = action.payload.token;
      state.user = action.payload.user;
      state.isAuthenticated = true;
      state.error = null;
    });
    builder.addCase(loginUser.rejected, (state, action) => {
      state.isLoading = false;
      state.error = (action.payload as string) || 'Authentication failed';
    });

    // Logout
    builder.addCase(logoutUser.fulfilled, (state) => {
      state.token = null;
      state.user = null;
      state.isAuthenticated = false;
      state.error = null;
    });
  },
});

export const { clearAuthError, setMockAuthenticatedUser } = authSlice.actions;
export default authSlice.reducer;
