import React from 'react';
import {
  View,
  Text,
  ScrollView,
  Image,
  StyleSheet,
  TouchableOpacity,
  Linking,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Feather } from '@expo/vector-icons';
import { useGetRecipeByIdQuery } from '../../api/mealDbApi';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { toggleFavouriteRecipe } from '../favourites/favouritesSlice';
import { LoadingState, ErrorState, EmptyState } from '../../components/States';
import { RootStackParamList } from '../../navigation/types';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing, layout } from '../../theme/spacing';

type RecipeDetailsProps = NativeStackScreenProps<RootStackParamList, 'RecipeDetails'>;

export const RecipeDetailsScreen: React.FC<RecipeDetailsProps> = ({ route, navigation }) => {
  const { recipeId } = route.params;
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const favourites = useAppSelector((state) => state.favourites.items);

  // Independent fetch by ID
  const {
    data: recipe,
    isLoading,
    isError,
    refetch,
  } = useGetRecipeByIdQuery(recipeId);

  const isFavourite = favourites.some((item) => item.idMeal === recipeId);

  const handleToggleFavourite = () => {
    if (recipe && user?.id) {
      dispatch(
        toggleFavouriteRecipe({
          recipe: {
            idMeal: recipe.id,
            strMeal: recipe.title,
            strMealThumb: recipe.thumbnail,
            strCategory: recipe.category,
            strArea: recipe.area,
          },
          userId: user.id,
        })
      );
    }
  };

  const handleOpenLink = (url?: string | null) => {
    if (url) {
      Linking.openURL(url).catch((err) => console.warn('Could not open link:', err));
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      {/* Header with back pill and "Recipe" title */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backPill}
          onPress={() => navigation.goBack()}
          activeOpacity={0.75}
          accessibilityRole="button"
          accessibilityLabel="Back to recipes"
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Feather name="arrow-left" size={18} color={colors.textPrimary} />
          <Text style={styles.headerTitle}>Recipe</Text>
        </TouchableOpacity>
      </View>

      {isLoading ? (
        <LoadingState message="Loading recipe details..." />
      ) : isError ? (
        <ErrorState message="Could not load this recipe." onRetry={refetch} />
      ) : !recipe ? (
        <EmptyState
          icon="alert-circle"
          title="Recipe Not Found"
          message="The requested recipe ID could not be retrieved."
          actionLabel="Go Back"
          onAction={() => navigation.goBack()}
        />
      ) : (
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {/* Photo Hero with Floating Favourite Button */}
          <View style={styles.imageContainer}>
            <Image source={{ uri: recipe.thumbnail }} style={styles.heroImage} resizeMode="cover" />
            <TouchableOpacity
              style={[styles.heartButton, isFavourite && styles.heartButtonActive]}
              onPress={handleToggleFavourite}
              activeOpacity={0.8}
              accessibilityRole="button"
              accessibilityLabel={isFavourite ? 'Remove from favourites' : 'Add to favourites'}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <Feather
                name="heart"
                size={20}
                color={isFavourite ? colors.primary : colors.textPrimary}
              />
            </TouchableOpacity>
          </View>

          {/* Details Body */}
          <View style={styles.body}>
            <View style={styles.tagRow}>
              <View style={styles.categoryBadge}>
                <Text style={styles.categoryBadgeText}>{recipe.category}</Text>
              </View>
              <View style={styles.areaBadge}>
                <Text style={styles.areaBadgeText}>{recipe.area} Cuisine</Text>
              </View>
            </View>

            <Text style={styles.recipeTitle}>{recipe.title}</Text>

            {/* Tags */}
            {recipe.tags && recipe.tags.length > 0 && (
              <View style={styles.tagsContainer}>
                {recipe.tags.map((tag, idx) => (
                  <View key={idx} style={styles.tagPill}>
                    <Text style={styles.tagPillText}>#{tag}</Text>
                  </View>
                ))}
              </View>
            )}

            {/* Ingredients Section */}
            <View style={styles.section}>
              <View style={styles.sectionHeaderRow}>
                <Feather name="shopping-bag" size={18} color={colors.primary} style={{ marginRight: 8 }} />
                <Text style={styles.sectionTitle}>
                  Ingredients ({recipe.ingredients.length})
                </Text>
              </View>
              <View style={styles.ingredientsCard}>
                {recipe.ingredients.map((item, idx) => (
                  <View
                    key={idx}
                    style={[
                      styles.ingredientRow,
                      idx !== recipe.ingredients.length - 1 && styles.ingredientBorder,
                    ]}
                  >
                    <View style={styles.bulletDot} />
                    <Text style={styles.ingredientName}>{item.name}</Text>
                    <Text style={styles.ingredientMeasure}>{item.measure}</Text>
                  </View>
                ))}
              </View>
            </View>

            {/* Cooking Instructions */}
            <View style={styles.section}>
              <View style={styles.sectionHeaderRow}>
                <Feather name="book-open" size={18} color={colors.primary} style={{ marginRight: 8 }} />
                <Text style={styles.sectionTitle}>Step-by-Step Instructions</Text>
              </View>
              <View style={styles.instructionsCard}>
                <Text style={styles.instructionsText}>{recipe.instructions}</Text>
              </View>
            </View>

            {/* Media / Source Actions */}
            {(recipe.youtubeUrl || recipe.sourceUrl) && (
              <View style={styles.linksRow}>
                {recipe.youtubeUrl && (
                  <TouchableOpacity
                    style={[styles.linkButton, styles.youtubeButton]}
                    onPress={() => handleOpenLink(recipe.youtubeUrl)}
                    activeOpacity={0.85}
                    accessibilityRole="button"
                    accessibilityLabel="Watch video tutorial on YouTube"
                  >
                    <Feather name="video" size={16} color={colors.textInverse} style={{ marginRight: 8 }} />
                    <Text style={styles.linkButtonText}>Watch Tutorial</Text>
                  </TouchableOpacity>
                )}
                {recipe.sourceUrl && (
                  <TouchableOpacity
                    style={[styles.linkButton, styles.sourceButton]}
                    onPress={() => handleOpenLink(recipe.sourceUrl)}
                    activeOpacity={0.85}
                    accessibilityRole="button"
                    accessibilityLabel="View original recipe source"
                  >
                    <Feather name="external-link" size={16} color={colors.textPrimary} style={{ marginRight: 8 }} />
                    <Text style={[styles.linkButtonText, { color: colors.textPrimary }]}>Source</Text>
                  </TouchableOpacity>
                )}
              </View>
            )}
          </View>
        </ScrollView>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.sm,
    backgroundColor: colors.background,
    minHeight: layout.headerHeight,
  },
  backPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.surfaceBorder,
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 3,
    elevation: 1,
  },
  headerTitle: {
    ...typography.bodyBold,
    color: colors.textPrimary,
    marginLeft: 6,
    fontSize: 14,
  },
  scrollContent: {
    paddingBottom: spacing.xxxl,
  },
  imageContainer: {
    width: '100%',
    height: 290,
    position: 'relative',
    backgroundColor: colors.backgroundSecondary,
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  heartButton: {
    position: 'absolute',
    bottom: spacing.lg,
    right: spacing.lg,
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.16,
    shadowRadius: 8,
    elevation: 4,
  },
  heartButtonActive: {
    backgroundColor: '#FFFFFF',
  },
  body: {
    padding: spacing.xl,
  },
  tagRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.xs,
  },
  categoryBadge: {
    backgroundColor: colors.accentGreenLight,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.accentGreenBorder,
  },
  categoryBadgeText: {
    ...typography.tag,
    color: colors.accentGreenDark,
    fontSize: 11,
    fontWeight: '700',
  },
  areaBadge: {
    backgroundColor: colors.backgroundSecondary,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.surfaceBorder,
  },
  areaBadgeText: {
    ...typography.tag,
    color: colors.textSecondary,
    fontSize: 11,
    fontWeight: '600',
  },
  recipeTitle: {
    ...typography.h1,
    fontSize: 26,
    lineHeight: 32,
    color: colors.textPrimary,
    marginTop: spacing.xs,
    marginBottom: spacing.md,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: spacing.lg,
  },
  tagPill: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.surfaceBorder,
    borderRadius: layout.borderRadiusPill,
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  tagPillText: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  section: {
    marginTop: spacing.lg,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  sectionTitle: {
    ...typography.h3,
    fontSize: 18,
    color: colors.textPrimary,
  },
  ingredientsCard: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.surfaceBorder,
    borderRadius: 18,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 6,
    elevation: 1,
  },
  ingredientRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
  },
  ingredientBorder: {
    borderBottomWidth: 1,
    borderBottomColor: colors.surfaceBorder,
  },
  bulletDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.primary,
    marginRight: spacing.md,
  },
  ingredientName: {
    flex: 1,
    ...typography.bodyLarge,
    color: colors.textPrimary,
  },
  ingredientMeasure: {
    ...typography.bodyBold,
    color: colors.accentGreenDark,
    marginLeft: spacing.sm,
  },
  instructionsCard: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.surfaceBorder,
    borderRadius: 18,
    padding: spacing.lg,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 6,
    elevation: 1,
  },
  instructionsText: {
    ...typography.bodyLarge,
    color: colors.textPrimary,
    lineHeight: 24,
  },
  linksRow: {
    flexDirection: 'row',
    gap: spacing.md,
    marginTop: spacing.xl,
  },
  linkButton: {
    flex: 1,
    flexDirection: 'row',
    minHeight: 48,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.md,
  },
  youtubeButton: {
    backgroundColor: colors.primary,
  },
  sourceButton: {
    backgroundColor: colors.surface,
    borderWidth: 1.5,
    borderColor: colors.surfaceBorder,
  },
  linkButtonText: {
    ...typography.button,
    color: colors.textInverse,
    fontSize: 14,
  },
});
