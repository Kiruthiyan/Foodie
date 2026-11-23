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
              activeOpacity={0.8}
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
    gap: 8,
    alignItems: 'center',
    paddingVertical: 4,
  },
  chip: {
    minHeight: 38,
    paddingHorizontal: 18,
    borderRadius: layout.borderRadiusPill,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.surfaceBorder,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 3,
    elevation: 1,
  },
  chipSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 3,
  },
  chipText: {
    ...typography.bodyBold,
    fontSize: 13,
    color: colors.textSecondary,
    fontWeight: '600',
  },
  chipTextSelected: {
    color: colors.textInverse,
    fontWeight: '700',
  },
});
