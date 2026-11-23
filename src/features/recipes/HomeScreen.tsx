import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  RefreshControl,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { CompositeNavigationProp } from '@react-navigation/native';
import { Feather } from '@expo/vector-icons';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import {
  useGetCategoriesQuery,
  useSearchRecipesByNameQuery,
  useFilterByCategoryQuery,
  MealSummary,
} from '../../api/mealDbApi';
import {
  toggleFavouriteRecipe,
  loadFavouritesForUser,
} from '../favourites/favouritesSlice';
import { FoodieHeader } from '../../components/FoodieHeader';
import { RecipeCard } from '../../components/RecipeCard';
import { CategoryChips } from '../../components/CategoryChips';
import { LoadingState, ErrorState, EmptyState } from '../../components/States';
import { RootStackParamList, MainTabParamList } from '../../navigation/types';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing } from '../../theme/spacing';

type HomeScreenNavigationProp = CompositeNavigationProp<
  BottomTabNavigationProp<MainTabParamList, 'HomeTab'>,
  NativeStackNavigationProp<RootStackParamList>
>;

interface HomeScreenProps {
  navigation: HomeScreenNavigationProp;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const { items: favourites, isInitialized } = useAppSelector((state) => state.favourites);

  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [refreshing, setRefreshing] = useState<boolean>(false);

  // Initialize favourites for signed-in user
  useEffect(() => {
    if (user?.id && !isInitialized) {
      dispatch(loadFavouritesForUser(user.id));
    }
  }, [user?.id, isInitialized, dispatch]);

  // Categories query
  const {
    data: categories = [],
  } = useGetCategoriesQuery();

  // Recipe queries: If "All", search default (''); if category selected, filter by category
  const isCategoryFilter = selectedCategory !== 'All';

  const {
    data: defaultMeals = [],
    isLoading: isLoadingDefault,
    isError: isErrorDefault,
    refetch: refetchDefault,
  } = useSearchRecipesByNameQuery('', { skip: isCategoryFilter });

  const {
    data: categoryMeals = [],
    isLoading: isLoadingCategory,
    isError: isErrorCategory,
    refetch: refetchCategory,
  } = useFilterByCategoryQuery(selectedCategory, { skip: !isCategoryFilter });

  const meals: MealSummary[] = isCategoryFilter ? categoryMeals : defaultMeals;
  const isLoadingMeals = isCategoryFilter ? isLoadingCategory : isLoadingDefault;
  const isError = isCategoryFilter ? isErrorCategory : isErrorDefault;

  const onRefresh = async () => {
    setRefreshing(true);
    if (isCategoryFilter) {
      await refetchCategory();
    } else {
      await refetchDefault();
    }
    setRefreshing(false);
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

  const userInitial = user?.firstName ? user.firstName.charAt(0).toUpperCase() : 'U';
  const userName = user?.firstName ? user.firstName : 'Foodie';

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      {/* Modern Header */}
      <FoodieHeader
        showProfileAvatar={true}
        avatarUrl={user?.image}
        userInitial={userInitial}
        onProfilePress={() => navigation.navigate('ProfileTab')}
        subtitle="EXPLORE DELICIOUS RECIPES"
        title={`Hello, ${userName} 👋`}
      />

      {/* Modern Search Prompt Bar */}
      <TouchableOpacity
        style={styles.searchPromptButton}
        onPress={() => navigation.navigate('SearchTab')}
        activeOpacity={0.85}
        accessibilityRole="button"
        accessibilityLabel="Open Smart Search"
      >
        <Feather name="search" size={18} color={colors.textMuted} style={{ marginRight: 10 }} />
        <Text style={styles.searchPromptText}>Search recipes, ingredients...</Text>
        <View style={styles.searchBadge}>
          <Feather name="sliders" size={12} color={colors.primary} style={{ marginRight: 4 }} />
          <Text style={styles.searchBadgeText}>Smart</Text>
        </View>
      </TouchableOpacity>

      {/* Category Filter Chips */}
      <CategoryChips
        categories={categories}
        selectedCategory={selectedCategory}
        onSelectCategory={(cat) => setSelectedCategory(cat)}
      />

      {/* Main Content Area */}
      <View style={styles.contentArea}>
        {isLoadingMeals && !refreshing ? (
          <LoadingState message="Discovering mouthwatering recipes..." />
        ) : isError ? (
          <ErrorState onRetry={onRefresh} />
        ) : meals.length === 0 ? (
          <EmptyState
            icon="search"
            title="No recipes found"
            message={`No recipes currently available in ${selectedCategory}.`}
            actionLabel="View All Categories"
            onAction={() => setSelectedCategory('All')}
          />
        ) : (
          <FlatList
            data={meals}
            keyExtractor={(item) => item.idMeal}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                tintColor={colors.primary}
                colors={[colors.primary]}
              />
            }
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
  searchPromptButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: spacing.xl,
    marginVertical: spacing.xs,
    paddingHorizontal: spacing.lg,
    minHeight: 48,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.surfaceBorder,
    borderRadius: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 5,
    elevation: 1,
  },
  searchPromptText: {
    flex: 1,
    ...typography.body,
    color: colors.textMuted,
  },
  searchBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primaryLight,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  searchBadgeText: {
    ...typography.captionBold,
    color: colors.primary,
    fontSize: 11,
  },
  contentArea: {
    flex: 1,
  },
  listContent: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.sm,
    paddingBottom: spacing.xxl,
  },
});
