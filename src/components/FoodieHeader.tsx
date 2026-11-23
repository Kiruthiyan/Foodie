import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';
import { spacing, layout } from '../theme/spacing';

interface FoodieLogoProps {
  size?: 'normal' | 'large';
}

export const FoodieLogo: React.FC<FoodieLogoProps> = ({ size = 'normal' }) => {
  const isLarge = size === 'large';
  return (
    <View style={styles.logoRow}>
      <View style={[styles.iconBadge, isLarge && styles.iconBadgeLarge]}>
        <Feather name="disc" size={isLarge ? 20 : 15} color={colors.surface} />
      </View>
      <Text style={[styles.logoText, isLarge && styles.logoTextLarge]}>
        Foodie<Text style={styles.logoDot}>.</Text>
      </Text>
    </View>
  );
};

interface FoodieHeaderProps {
  showProfileAvatar?: boolean;
  avatarUrl?: string;
  userInitial?: string;
  onProfilePress?: () => void;
  title?: string;
  subtitle?: string;
}

export const FoodieHeader: React.FC<FoodieHeaderProps> = ({
  showProfileAvatar = false,
  avatarUrl,
  userInitial = 'U',
  onProfilePress,
  title,
  subtitle,
}) => {
  return (
    <View style={styles.headerContainer}>
      <View style={styles.topRow}>
        <FoodieLogo />
        {showProfileAvatar && (
          <TouchableOpacity
            style={styles.avatarButton}
            onPress={onProfilePress}
            activeOpacity={0.8}
            accessibilityRole="button"
            accessibilityLabel="Open user profile"
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            {avatarUrl ? (
              <Image source={{ uri: avatarUrl }} style={styles.avatarImage} />
            ) : (
              <View style={styles.avatarFallback}>
                <Text style={styles.avatarInitial}>{userInitial}</Text>
              </View>
            )}
          </TouchableOpacity>
        )}
      </View>

      {(title || subtitle) && (
        <View style={styles.titleSection}>
          {subtitle && <Text style={styles.headerSubtitle}>{subtitle}</Text>}
          {title && <Text style={styles.headerTitle}>{title}</Text>}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.md,
    paddingBottom: spacing.sm,
    backgroundColor: colors.background,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: layout.minTouchTarget,
  },
  logoRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconBadge: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.sm,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 2,
  },
  iconBadgeLarge: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: spacing.md,
  },
  logoText: {
    ...typography.h3,
    fontSize: 20,
    color: colors.textPrimary,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  logoTextLarge: {
    fontSize: 28,
    lineHeight: 34,
  },
  logoDot: {
    color: colors.primary,
  },
  avatarButton: {
    width: layout.minTouchTarget,
    height: layout.minTouchTarget,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: colors.surfaceBorder,
  },
  avatarFallback: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primaryLight,
    borderWidth: 1.5,
    borderColor: colors.primaryBorder,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarInitial: {
    ...typography.captionBold,
    color: colors.primary,
    fontSize: 14,
  },
  titleSection: {
    marginTop: spacing.md,
  },
  headerSubtitle: {
    ...typography.captionBold,
    color: colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 1,
    fontSize: 11,
  },
  headerTitle: {
    ...typography.h2,
    fontSize: 26,
    lineHeight: 32,
    color: colors.textPrimary,
    fontWeight: '800',
    marginTop: 2,
    letterSpacing: -0.4,
  },
});
