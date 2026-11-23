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
      {/* Header with back arrow and "Recipe" on the left */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
          activeOpacity={0.7}
          accessibilityRole="button"
          accessibilityLabel="Back to recipes"
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Feather name="arrow-left" size={22} color={colors.textPrimary} />
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
          {/* Photo with Favourite Heart Overlay */}
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
                size={22}
                color={isFavourite ? colors.primary : colors.textPrimary}
              />
            </TouchableOpacity>
          </View>

          {/* Title & Metadata */}
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
                <Feather name="shopping-bag" size={20} color={colors.primary} style={{ marginRight: 8 }} />
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
                <Feather name="book-open" size={20} color={colors.primary} style={{ marginRight: 8 }} />
                <Text style={styles.sectionTitle}>Instructions</Text>
              </View>
              <View style={styles.instructionsCard}>
                <Text style={styles.instructionsText}>{recipe.instructions}</Text>
              </View>
            </View>

            {/* Video or Source Links */}
            {(recipe.youtubeUrl || recipe.sourceUrl) && (
              <View style={styles.linksRow}>
                {recipe.youtubeUrl && (
                  <TouchableOpacity
                    style={[styles.linkButton, styles.youtubeButton]}
                    onPress={() => handleOpenLink(recipe.youtubeUrl)}
                    activeOpacity={0.8}
                    accessibilityRole="button"
                    accessibilityLabel="Watch video tutorial on YouTube"
                  >
                    <Feather name="video" size={18} color={colors.textInverse} style={{ marginRight: 8 }} />
                    <Text style={styles.linkButtonText}>Watch Tutorial</Text>
                  </TouchableOpacity>
                )}
                {recipe.sourceUrl && (
                  <TouchableOpacity
                    style={[styles.linkButton, styles.sourceButton]}
                    onPress={() => handleOpenLink(recipe.sourceUrl)}
                    activeOpacity={0.8}
                    accessibilityRole="button"
                    accessibilityLabel="View original recipe source"
                  >
                    <Feather name="external-link" size={18} color={colors.textPrimary} style={{ marginRight: 8 }} />
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
    paddingVertical: spacing.md,
    backgroundColor: colors.background,
    minHeight: layout.headerHeight,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: layout.minTouchTarget,
  },
  headerTitle: {
    ...typography.h3,
    color: colors.textPrimary,
    marginLeft: spacing.sm,
  },
  scrollContent: {
    paddingBottom: spacing.xxxl,
  },
  imageContainer: {
    width: '100%',
    height: 280,
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
    width: layout.minTouchTarget,
    height: layout.minTouchTarget,
    borderRadius: layout.minTouchTarget / 2,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.18,
    shadowRadius: 6,
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
    paddingHorizontal: spacing.md,
    paddingVertical: 4,
    borderRadius: layout.borderRadiusSm,
    borderWidth: 1,
    borderColor: colors.accentGreenBorder,
  },
  categoryBadgeText: {
    ...typography.tag,
    color: colors.accentGreen,
  },
  areaBadge: {
    backgroundColor: colors.backgroundSecondary,
    paddingHorizontal: spacing.md,
    paddingVertical: 4,
    borderRadius: layout.borderRadiusSm,
    borderWidth: 1,
    borderColor: colors.surfaceBorder,
  },
  areaBadgeText: {
    ...typography.tag,
    color: colors.textSecondary,
  },
  recipeTitle: {
    ...typography.h1,
    color: colors.textPrimary,
    marginTop: spacing.xs,
    marginBottom: spacing.md,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
    marginBottom: spacing.lg,
  },
  tagPill: {
    backgroundColor: colors.surfaceSubtle,
    borderWidth: 1,
    borderColor: colors.surfaceBorder,
    borderRadius: layout.borderRadiusPill,
    paddingHorizontal: spacing.md,
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
    color: colors.textPrimary,
  },
  ingredientsCard: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.surfaceBorder,
    borderRadius: layout.borderRadiusLg,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
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
    color: colors.accentGreen,
    marginLeft: spacing.sm,
  },
  instructionsCard: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.surfaceBorder,
    borderRadius: layout.borderRadiusLg,
    padding: spacing.lg,
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
    minHeight: layout.minTouchTarget,
    borderRadius: layout.borderRadiusMd,
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
  },
});
