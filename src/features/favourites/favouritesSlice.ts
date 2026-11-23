import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { FavouriteRecipe, favouritesStorage } from './favouritesStorage';
import { MealSummary } from '../../api/mealDbApi';

export interface FavouritesState {
  items: FavouriteRecipe[];
  currentUserId: number | null;
  isLoading: boolean;
  isInitialized: boolean;
}

const initialState: FavouritesState = {
  items: [],
  currentUserId: null,
  isLoading: false,
  isInitialized: false,
};

export const loadFavouritesForUser = createAsyncThunk(
  'favourites/loadForUser',
  async (userId: number) => {
    const items = await favouritesStorage.loadFavourites(userId);
    return { userId, items };
  }
);

export const toggleFavouriteRecipe = createAsyncThunk(
  'favourites/toggle',
  async (
    { recipe, userId }: { recipe: MealSummary | { idMeal: string; strMeal: string; strMealThumb: string; strCategory?: string; strArea?: string }; userId: number },
    { getState }
  ) => {
    const state = getState() as { favourites: FavouritesState };
    const currentItems = state.favourites.items;

    const exists = currentItems.some((item) => item.idMeal === recipe.idMeal);
    let updated: FavouriteRecipe[];

    if (exists) {
      updated = currentItems.filter((item) => item.idMeal !== recipe.idMeal);
    } else {
      const newItem: FavouriteRecipe = {
        idMeal: recipe.idMeal,
        strMeal: recipe.strMeal,
        strMealThumb: recipe.strMealThumb,
        strCategory: recipe.strCategory || 'General',
        strArea: recipe.strArea || 'International',
        savedAt: new Date().toISOString(),
      };
      // Prevent duplicates
      updated = [newItem, ...currentItems.filter((item) => item.idMeal !== recipe.idMeal)];
    }

    // Persist per-user
    await favouritesStorage.saveFavourites(userId, updated);
    return updated;
  }
);

export const removeFavouriteRecipe = createAsyncThunk(
  'favourites/remove',
  async ({ recipeId, userId }: { recipeId: string; userId: number }, { getState }) => {
    const state = getState() as { favourites: FavouritesState };
    const currentItems = state.favourites.items;
    const updated = currentItems.filter((item) => item.idMeal !== recipeId);
    await favouritesStorage.saveFavourites(userId, updated);
    return updated;
  }
);

export const favouritesSlice = createSlice({
  name: 'favourites',
  initialState,
  reducers: {
    clearFavouritesState: (state) => {
      state.items = [];
      state.currentUserId = null;
      state.isInitialized = false;
    },
  },
  extraReducers: (builder) => {
    // Load
    builder.addCase(loadFavouritesForUser.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(loadFavouritesForUser.fulfilled, (state, action) => {
      state.isLoading = false;
      state.items = action.payload.items;
      state.currentUserId = action.payload.userId;
      state.isInitialized = true;
    });
    builder.addCase(loadFavouritesForUser.rejected, (state) => {
      state.isLoading = false;
      state.isInitialized = true;
    });

    // Toggle
    builder.addCase(toggleFavouriteRecipe.fulfilled, (state, action: PayloadAction<FavouriteRecipe[]>) => {
      state.items = action.payload;
    });

    // Remove
    builder.addCase(removeFavouriteRecipe.fulfilled, (state, action: PayloadAction<FavouriteRecipe[]>) => {
      state.items = action.payload;
    });
  },
});

export const { clearFavouritesState } = favouritesSlice.actions;
export default favouritesSlice.reducer;
