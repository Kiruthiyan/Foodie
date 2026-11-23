import React from 'react';
import { ScrollView, Text, TouchableOpacity, StyleSheet, View } from 'react-native';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';
import { spacing, layout } from '../theme/spacing';

interface CategoryChipsProps {
  categories: { idCategory?: string; strCategory: string }[];
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
}

export const CategoryChips: React.FC<CategoryChipsProps> = ({
  categories,
  selectedCategory,
  onSelectCategory,
}) => {
  const allCategories = [{ strCategory: 'All' }, ...categories];

  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {allCategories.map((item) => {
          const isSelected =
            selectedCategory.toLowerCase() === item.strCategory.toLowerCase();
          return (
            <TouchableOpacity
              key={item.strCategory}
              style={[styles.chip, isSelected && styles.chipSelected]}
              onPress={() => onSelectCategory(item.strCategory)}
              activeOpacity={0.75}
              accessibilityRole="button"
              accessibilityState={{ selected: isSelected }}
              accessibilityLabel={`Category ${item.strCategory}`}
            >
              <Text style={[styles.chipText, isSelected && styles.chipTextSelected]}>
                {item.strCategory}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: spacing.sm,
  },
  scrollContent: {
    paddingHorizontal: spacing.xl,
    gap: spacing.sm,
    alignItems: 'center',
    paddingVertical: 4,
  },
  chip: {
    minHeight: layout.minTouchTarget,
    paddingHorizontal: spacing.lg,
    borderRadius: layout.borderRadiusPill,
    backgroundColor: colors.surface,
    borderWidth: 1.5,
    borderColor: colors.surfaceBorder,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chipSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  chipText: {
    ...typography.bodyBold,
    color: colors.textSecondary,
  },
  chipTextSelected: {
    color: colors.textInverse,
  },
});
