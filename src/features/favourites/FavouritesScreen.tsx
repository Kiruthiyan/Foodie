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

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      {/* Foodie Header */}
      <FoodieHeader
        subtitle="MY COLLECTION"
        title="Favourites"
      />

      <View style={styles.content}>
        {favourites.length === 0 ? (
          <EmptyState
            icon="heart"
            title="No favourites yet"
            message="Explore appetizing dishes and tap the heart icon to save recipes here."
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
                activeOpacity={0.85}
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
                  <Feather name="trash-2" size={20} color={colors.primary} />
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
    borderRadius: layout.borderRadiusLg,
    borderWidth: 1,
    borderColor: colors.surfaceBorder,
    padding: spacing.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  thumbnail: {
    width: 80,
    height: 80,
    borderRadius: layout.borderRadiusMd,
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
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: layout.borderRadiusSm,
    borderWidth: 1,
    borderColor: colors.accentGreenBorder,
    marginBottom: 4,
  },
  categoryBadgeText: {
    ...typography.tag,
    color: colors.accentGreen,
  },
  itemTitle: {
    ...typography.bodyBold,
    color: colors.textPrimary,
  },
  itemArea: {
    ...typography.caption,
    color: colors.textSecondary,
    marginTop: 2,
  },
  removeButton: {
    width: layout.minTouchTarget,
    height: layout.minTouchTarget,
    borderRadius: layout.minTouchTarget / 2,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
