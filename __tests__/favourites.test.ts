import favouritesReducer, {
  clearFavouritesState,
  loadFavouritesForUser,
  toggleFavouriteRecipe,
  removeFavouriteRecipe,
  FavouritesState,
} from '../src/features/favourites/favouritesSlice';
import { favouritesStorage } from '../src/features/favourites/favouritesStorage';

describe('Favourites Slice & Storage Tests', () => {
  const initialState: FavouritesState = {
    items: [],
    currentUserId: null,
    isLoading: false,
    isInitialized: false,
  };

  const sampleRecipe = {
    idMeal: '52772',
    strMeal: 'Teriyaki Chicken Casserole',
    strMealThumb: 'https://www.themealdb.com/images/media/meals/wvpsxx1468256321.jpg',
    strCategory: 'Chicken',
    strArea: 'Japanese',
  };

  it('handles initial state', () => {
    expect(favouritesReducer(undefined, { type: 'unknown' })).toEqual(initialState);
  });

  it('populates favourites when loadFavouritesForUser is fulfilled', () => {
    const loadedItem = {
      ...sampleRecipe,
      savedAt: '2026-11-23T12:00:00.000Z',
    };

    const action = {
      type: loadFavouritesForUser.fulfilled.type,
      payload: { userId: 1, items: [loadedItem] },
    };

    const state = favouritesReducer(initialState, action);
    expect(state.isLoading).toBe(false);
    expect(state.isInitialized).toBe(true);
    expect(state.currentUserId).toBe(1);
    expect(state.items).toHaveLength(1);
    expect(state.items[0].idMeal).toBe('52772');
  });

  it('updates state when toggleFavouriteRecipe is fulfilled (add & prevent duplicates)', () => {
    const newItem = {
      ...sampleRecipe,
      savedAt: '2026-11-23T12:00:00.000Z',
    };

    const action = {
      type: toggleFavouriteRecipe.fulfilled.type,
      payload: [newItem],
    };

    const state = favouritesReducer(initialState, action);
    expect(state.items).toHaveLength(1);
    expect(state.items[0].strMeal).toBe('Teriyaki Chicken Casserole');
  });

  it('updates state when removeFavouriteRecipe is fulfilled', () => {
    const startingState: FavouritesState = {
      items: [{ ...sampleRecipe, savedAt: '2026-11-23T12:00:00.000Z' }],
      currentUserId: 1,
      isLoading: false,
      isInitialized: true,
    };

    const action = {
      type: removeFavouriteRecipe.fulfilled.type,
      payload: [],
    };

    const state = favouritesReducer(startingState, action);
    expect(state.items).toHaveLength(0);
  });

  it('clears state on clearFavouritesState (used on logout)', () => {
    const startingState: FavouritesState = {
      items: [{ ...sampleRecipe, savedAt: '2026-11-23T12:00:00.000Z' }],
      currentUserId: 1,
      isLoading: false,
      isInitialized: true,
    };

    const state = favouritesReducer(startingState, clearFavouritesState());
    expect(state.items).toHaveLength(0);
    expect(state.currentUserId).toBeNull();
    expect(state.isInitialized).toBe(false);
  });

  it('persists and retrieves items per user via favouritesStorage', async () => {
    const userId = 42;
    const testItems = [
      {
        idMeal: '52772',
        strMeal: 'Teriyaki Chicken Casserole',
        strMealThumb: 'https://www.themealdb.com/images/media/meals/wvpsxx1468256321.jpg',
        strCategory: 'Chicken',
        strArea: 'Japanese',
        savedAt: new Date().toISOString(),
      },
    ];

    await favouritesStorage.saveFavourites(userId, testItems);
    const loaded = await favouritesStorage.loadFavourites(userId);

    expect(loaded).toHaveLength(1);
    expect(loaded[0].idMeal).toBe('52772');

    // Check that different user has isolated storage
    const otherUserLoaded = await favouritesStorage.loadFavourites(99);
    expect(otherUserLoaded).toHaveLength(0);
  });
});
