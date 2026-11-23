import React, { useState, useMemo } from 'react';
import {
  View,
  FlatList,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { CompositeNavigationProp } from '@react-navigation/native';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import {
  useGetCategoriesQuery,
  useSearchRecipesByNameQuery,
  useFilterByCategoryQuery,
  MealSummary,
} from '../../api/mealDbApi';
import { toggleFavouriteRecipe } from '../favourites/favouritesSlice';
import { FoodieHeader } from '../../components/FoodieHeader';
import { SearchBar } from '../../components/SearchBar';
import { CategoryChips } from '../../components/CategoryChips';
import { RecipeCard } from '../../components/RecipeCard';
import { LoadingState, ErrorState, EmptyState } from '../../components/States';
import { useDebounce } from '../../utils/debounce';
import { RootStackParamList, MainTabParamList } from '../../navigation/types';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';

type SearchScreenNavigationProp = CompositeNavigationProp<
  BottomTabNavigationProp<MainTabParamList, 'SearchTab'>,
  NativeStackNavigationProp<RootStackParamList>
>;

interface SearchScreenProps {
  navigation: SearchScreenNavigationProp;
}

export const SearchScreen: React.FC<SearchScreenProps> = ({ navigation }) => {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const favourites = useAppSelector((state) => state.favourites.items);

  const [rawSearchQuery, setRawSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Debounce search input (350ms) to ensure API call is not executed on every keystroke
  const debouncedQuery = useDebounce(rawSearchQuery, 350);

  // Categories
  const { data: categories = [] } = useGetCategoriesQuery();

  // Search by name API query
  const {
    data: searchResults = [],
    isLoading: isSearchLoading,
    isError: isSearchError,
    refetch: refetchSearch,
  } = useSearchRecipesByNameQuery(debouncedQuery);

  // Category filter API query
  const hasCategoryFilter = selectedCategory !== 'All';
  const {
    data: categoryResults = [],
    isLoading: isCategoryLoading,
    isError: isCategoryError,
    refetch: refetchCategory,
  } = useFilterByCategoryQuery(selectedCategory, { skip: !hasCategoryFilter });

  // Combined smart filtering: Name query AND category filter applied together
  const filteredMeals = useMemo(() => {
    if (hasCategoryFilter) {
      if (debouncedQuery.trim().length > 0) {
        const queryLower = debouncedQuery.toLowerCase().trim();
        return categoryResults.filter((meal) =>
          meal.strMeal.toLowerCase().includes(queryLower)
        );
      }
      return categoryResults;
    }

    return searchResults;
  }, [hasCategoryFilter, categoryResults, debouncedQuery, searchResults]);

  const isLoading = (hasCategoryFilter ? isCategoryLoading : false) || isSearchLoading;
  const isError = hasCategoryFilter ? isCategoryError : isSearchError;

  const handleClearFilters = () => {
    setRawSearchQuery('');
    setSelectedCategory('All');
  };

  const handleToggleFavourite = (meal: MealSummary) => {
    if (user?.id) {
      dispatch(
        toggleFavouriteRecipe({
          recipe: {
            idMeal: meal.idMeal,
            strMeal: meal.strMeal,
            strMealThumb: meal.strMealThumb,
            strCategory: meal.strCategory || selectedCategory,
            strArea: meal.strArea,
          },
          userId: user.id,
        })
      );
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      {/* Modern Header */}
      <FoodieHeader
        subtitle="DISCOVERY ENGINE"
        title="Smart Search"
      />

      {/* Modern Search Bar */}
      <SearchBar
        value={rawSearchQuery}
        onChangeText={setRawSearchQuery}
        onClear={() => setRawSearchQuery('')}
        placeholder="Search by recipe name..."
      />

      {/* Category Chips with "All" and Selected Highlighting */}
      <CategoryChips
        categories={categories}
        selectedCategory={selectedCategory}
        onSelectCategory={(cat) => setSelectedCategory(cat)}
      />

      {/* Results Content Area */}
      <View style={styles.content}>
        {isLoading ? (
          <LoadingState message="Filtering culinary catalog..." />
        ) : isError ? (
          <ErrorState
            onRetry={() => {
              if (hasCategoryFilter) refetchCategory();
              refetchSearch();
            }}
          />
        ) : filteredMeals.length === 0 ? (
          <EmptyState
            icon="search"
            title="No recipes found"
            message={
              rawSearchQuery.trim()
                ? `No dishes matched "${rawSearchQuery}" in ${selectedCategory} category.`
                : `No recipes found in ${selectedCategory} category.`
            }
            actionLabel="Reset filters"
            onAction={handleClearFilters}
          />
        ) : (
          <FlatList
            data={filteredMeals}
            keyExtractor={(item) => item.idMeal}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) => {
              const isFav = favourites.some((f) => f.idMeal === item.idMeal);
              return (
                <RecipeCard
                  id={item.idMeal}
                  title={item.strMeal}
                  thumbnail={item.strMealThumb}
                  category={item.strCategory || (selectedCategory !== 'All' ? selectedCategory : undefined)}
                  area={item.strArea}
                  isFavourite={isFav}
                  onPress={() => navigation.navigate('RecipeDetails', { recipeId: item.idMeal })}
                  onToggleFavourite={() => handleToggleFavourite(item)}
                />
              );
            }}
          />
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
  },
  listContent: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.sm,
    paddingBottom: spacing.xxl,
  },
});
