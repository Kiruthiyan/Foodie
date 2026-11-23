import React from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Image,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { CompositeNavigationProp } from '@react-navigation/native';
import { Feather } from '@expo/vector-icons';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { removeFavouriteRecipe } from './favouritesSlice';
import { FoodieHeader } from '../../components/FoodieHeader';
import { EmptyState } from '../../components/States';
import { RootStackParamList, MainTabParamList } from '../../navigation/types';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing, layout } from '../../theme/spacing';

type FavouritesScreenNavigationProp = CompositeNavigationProp<
  BottomTabNavigationProp<MainTabParamList, 'FavouritesTab'>,
  NativeStackNavigationProp<RootStackParamList>
>;

interface FavouritesScreenProps {
  navigation: FavouritesScreenNavigationProp;
}

export const FavouritesScreen: React.FC<FavouritesScreenProps> = ({ navigation }) => {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const favourites = useAppSelector((state) => state.favourites.items);

  const handleRemove = (recipeId: string) => {
    if (user?.id) {
      dispatch(removeFavouriteRecipe({ recipeId, userId: user.id }));
    }
  };

  const countSubtitle = favourites.length === 1
    ? '1 SAVED RECIPE'
    : `${favourites.length} SAVED RECIPES`;

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      {/* Modern Header */}
      <FoodieHeader
        subtitle={countSubtitle}
        title="Favourites"
      />

      <View style={styles.content}>
        {favourites.length === 0 ? (
          <EmptyState
            icon="heart"
            title="No favourites yet"
            message="Discover delicious meals and tap the heart icon to save recipes to your collection."
            actionLabel="Browse recipes"
            onAction={() => navigation.navigate('HomeTab')}
          />
        ) : (
          <FlatList
            data={favourites}
            keyExtractor={(item) => item.idMeal}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.itemCard}
                onPress={() => navigation.navigate('RecipeDetails', { recipeId: item.idMeal })}
                activeOpacity={0.88}
                accessibilityRole="button"
                accessibilityLabel={`Favourite recipe: ${item.strMeal}`}
              >
                <Image source={{ uri: item.strMealThumb }} style={styles.thumbnail} />
                <View style={styles.itemInfo}>
                  <View style={styles.categoryBadge}>
                    <Text style={styles.categoryBadgeText}>{item.strCategory || 'Recipe'}</Text>
                  </View>
                  <Text style={styles.itemTitle} numberOfLines={2}>
                    {item.strMeal}
                  </Text>
                  {item.strArea ? (
                    <Text style={styles.itemArea}>{item.strArea} Cuisine</Text>
                  ) : null}
                </View>
                <TouchableOpacity
                  style={styles.removeButton}
                  onPress={() => handleRemove(item.idMeal)}
                  activeOpacity={0.7}
                  accessibilityRole="button"
                  accessibilityLabel={`Remove ${item.strMeal} from favourites`}
                  hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                >
                  <Feather name="trash-2" size={18} color={colors.error} />
                </TouchableOpacity>
              </TouchableOpacity>
            )}
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
    paddingTop: spacing.md,
    paddingBottom: spacing.xxl,
    gap: spacing.md,
  },
  itemCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.surfaceBorder,
    padding: spacing.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  thumbnail: {
    width: 82,
    height: 82,
    borderRadius: 14,
    backgroundColor: colors.backgroundSecondary,
  },
  itemInfo: {
    flex: 1,
    marginLeft: spacing.md,
    marginRight: spacing.sm,
  },
  categoryBadge: {
    alignSelf: 'flex-start',
    backgroundColor: colors.accentGreenLight,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: colors.accentGreenBorder,
    marginBottom: 4,
  },
  categoryBadgeText: {
    ...typography.tag,
    color: colors.accentGreenDark,
    fontSize: 10,
    fontWeight: '700',
  },
  itemTitle: {
    ...typography.bodyBold,
    fontSize: 15,
    lineHeight: 20,
    color: colors.textPrimary,
  },
  itemArea: {
    ...typography.caption,
    color: colors.textSecondary,
    marginTop: 2,
  },
  removeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.errorLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
