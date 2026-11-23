import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';
import { spacing, layout } from '../theme/spacing';

interface RecipeCardProps {
  id: string;
  title: string;
  thumbnail: string;
  category?: string;
  area?: string;
  isFavourite?: boolean;
  onPress: () => void;
  onToggleFavourite: () => void;
}

export const RecipeCard: React.FC<RecipeCardProps> = ({
  title,
  thumbnail,
  category,
  area,
  isFavourite = false,
  onPress,
  onToggleFavourite,
}) => {
  return (
    <TouchableOpacity
      style={styles.cardContainer}
      onPress={onPress}
      activeOpacity={0.9}
      accessibilityRole="button"
      accessibilityLabel={`Recipe: ${title}`}
    >
      <View style={styles.imageWrapper}>
        <Image source={{ uri: thumbnail }} style={styles.image} resizeMode="cover" />
        <View style={styles.imageGradientOverlay} />
        
        {/* Floating Heart Button */}
        <TouchableOpacity
          style={[styles.heartButton, isFavourite && styles.heartButtonActive]}
          onPress={onToggleFavourite}
          activeOpacity={0.8}
          accessibilityRole="button"
          accessibilityLabel={isFavourite ? 'Remove from favourites' : 'Save to favourites'}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Feather
            name="heart"
            size={18}
            color={isFavourite ? colors.primary : colors.textPrimary}
          />
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        <View style={styles.tagRow}>
          {category ? (
            <View style={styles.tag}>
              <Text style={styles.tagText}>{category}</Text>
            </View>
          ) : null}
          {area ? (
            <View style={styles.areaTag}>
              <Text style={styles.areaTagText}>{area} Cuisine</Text>
            </View>
          ) : null}
        </View>

        <Text style={styles.title} numberOfLines={2}>
          {title}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: colors.surface,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.surfaceBorder,
    marginBottom: spacing.lg,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  imageWrapper: {
    width: '100%',
    height: 195,
    position: 'relative',
    backgroundColor: colors.backgroundSecondary,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  imageGradientOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.02)',
  },
  heartButton: {
    position: 'absolute',
    top: spacing.md,
    right: spacing.md,
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 3,
  },
  heartButtonActive: {
    backgroundColor: '#FFFFFF',
  },
  content: {
    padding: spacing.lg,
  },
  tagRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: spacing.xs,
    marginBottom: spacing.xs,
  },
  tag: {
    backgroundColor: colors.accentGreenLight,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.accentGreenBorder,
  },
  tagText: {
    ...typography.tag,
    color: colors.accentGreenDark,
    fontWeight: '700',
    fontSize: 11,
  },
  areaTag: {
    backgroundColor: colors.backgroundSecondary,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.surfaceBorder,
  },
  areaTagText: {
    ...typography.tag,
    color: colors.textSecondary,
    fontWeight: '600',
    fontSize: 11,
  },
  title: {
    ...typography.h3,
    fontSize: 17,
    lineHeight: 22,
    color: colors.textPrimary,
    fontWeight: '700',
    marginTop: 2,
  },
});
