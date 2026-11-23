import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import authReducer from '../features/auth/authSlice';
import favouritesReducer from '../features/favourites/favouritesSlice';
import { mealDbApi } from '../api/mealDbApi';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    favourites: favouritesReducer,
    [mealDbApi.reducerPath]: mealDbApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }).concat(mealDbApi.middleware),
});

setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
