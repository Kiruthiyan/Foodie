import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { logoutUser } from '../auth/authSlice';
import { clearFavouritesState } from '../favourites/favouritesSlice';
import { FoodieHeader } from '../../components/FoodieHeader';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing, layout } from '../../theme/spacing';

export const ProfileScreen: React.FC = () => {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const favourites = useAppSelector((state) => state.favourites.items);

  const handleLogout = () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out of Foodie? Your saved recipes will stay safely synced to your account.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Sign Out',
          style: 'destructive',
          onPress: async () => {
            dispatch(clearFavouritesState());
            await dispatch(logoutUser());
          },
        },
      ]
    );
  };

  const initial = user?.firstName ? user.firstName.charAt(0).toUpperCase() : 'U';

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      {/* Branded Header */}
      <FoodieHeader
        subtitle="MY ACCOUNT"
        title="Chef Profile"
      />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* User Card */}
        <View style={styles.userCard}>
          <View style={styles.avatarWrapper}>
            {user?.image ? (
              <Image source={{ uri: user.image }} style={styles.avatar} />
            ) : (
              <View style={styles.avatarFallback}>
                <Text style={styles.avatarInitial}>{initial}</Text>
              </View>
            )}
            <View style={styles.onlineBadge}>
              <Feather name="check" size={10} color={colors.textInverse} />
            </View>
          </View>

          <Text style={styles.userName}>
            {user ? `${user.firstName} ${user.lastName}` : 'Foodie Member'}
          </Text>
          <Text style={styles.userHandle}>@{user?.username || 'foodie'}</Text>
          <Text style={styles.userEmail}>{user?.email || 'member@foodie.app'}</Text>
        </View>

        {/* Stats Row */}
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{favourites.length}</Text>
            <Text style={styles.statLabel}>Saved Recipes</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>14</Text>
            <Text style={styles.statLabel}>Cuisines</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>Pro</Text>
            <Text style={styles.statLabel}>Membership</Text>
          </View>
        </View>

        {/* Preferences Section */}
        <View style={styles.menuSection}>
          <Text style={styles.sectionHeading}>Preferences</Text>
          <View style={styles.menuCard}>
            <View style={styles.menuItem}>
              <View style={[styles.menuIconBox, { backgroundColor: colors.accentGreenLight }]}>
                <Feather name="sliders" size={18} color={colors.accentGreenDark} />
              </View>
              <View style={styles.menuItemText}>
                <Text style={styles.menuItemTitle}>Dietary Filter</Text>
                <Text style={styles.menuItemSubtitle}>All Cuisines & Flavors</Text>
              </View>
              <Feather name="chevron-right" size={18} color={colors.textMuted} />
            </View>

            <View style={styles.menuItemBorder} />

            <View style={styles.menuItem}>
              <View style={[styles.menuIconBox, { backgroundColor: colors.accentAmberLight }]}>
                <Feather name="bell" size={18} color={colors.accentAmber} />
              </View>
              <View style={styles.menuItemText}>
                <Text style={styles.menuItemTitle}>Notifications</Text>
                <Text style={styles.menuItemSubtitle}>Daily meal recommendations</Text>
              </View>
              <Feather name="chevron-right" size={18} color={colors.textMuted} />
            </View>
          </View>
        </View>

        {/* Storage & Privacy */}
        <View style={styles.menuSection}>
          <Text style={styles.sectionHeading}>Security & Sync</Text>
          <View style={styles.menuCard}>
            <View style={styles.menuItem}>
              <View style={[styles.menuIconBox, { backgroundColor: colors.primaryLight }]}>
                <Feather name="shield" size={18} color={colors.primary} />
              </View>
              <View style={styles.menuItemText}>
                <Text style={styles.menuItemTitle}>Encrypted Session</Text>
                <Text style={styles.menuItemSubtitle}>Protected with Expo SecureStore</Text>
              </View>
              <Feather name="check-circle" size={16} color={colors.accentGreen} />
            </View>

            <View style={styles.menuItemBorder} />

            <View style={styles.menuItem}>
              <View style={[styles.menuIconBox, { backgroundColor: colors.backgroundSecondary }]}>
                <Feather name="hard-drive" size={18} color={colors.textSecondary} />
              </View>
              <View style={styles.menuItemText}>
                <Text style={styles.menuItemTitle}>Per-User Cloud Persistence</Text>
                <Text style={styles.menuItemSubtitle}>Local and account-isolated</Text>
              </View>
              <Feather name="check-circle" size={16} color={colors.accentGreen} />
            </View>
          </View>
        </View>

        {/* Sign Out Button */}
        <TouchableOpacity
          style={styles.signOutButton}
          onPress={handleLogout}
          activeOpacity={0.85}
          accessibilityRole="button"
          accessibilityLabel="Sign out of Foodie"
        >
          <Feather name="log-out" size={18} color={colors.error} style={{ marginRight: 8 }} />
          <Text style={styles.signOutText}>Sign Out of Foodie</Text>
        </TouchableOpacity>

        <Text style={styles.versionText}>Foodie App • Version 1.0.0 (SDK 58)</Text>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.sm,
    paddingBottom: spacing.xxxl,
    gap: spacing.xl,
  },
  userCard: {
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: colors.surfaceBorder,
    paddingVertical: spacing.xxl,
    paddingHorizontal: spacing.lg,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 10,
    elevation: 2,
  },
  avatarWrapper: {
    position: 'relative',
    marginBottom: spacing.md,
  },
  avatar: {
    width: 88,
    height: 88,
    borderRadius: 44,
    borderWidth: 3,
    borderColor: colors.primaryLight,
  },
  avatarFallback: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: colors.primaryLight,
    borderWidth: 2,
    borderColor: colors.primaryBorder,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarInitial: {
    ...typography.h1,
    fontSize: 34,
    color: colors.primary,
  },
  onlineBadge: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: colors.accentGreen,
    borderWidth: 2,
    borderColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  userName: {
    ...typography.h2,
    color: colors.textPrimary,
    fontWeight: '700',
  },
  userHandle: {
    ...typography.captionBold,
    color: colors.primary,
    marginTop: 2,
  },
  userEmail: {
    ...typography.body,
    color: colors.textSecondary,
    marginTop: 4,
  },
  statsContainer: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.surfaceBorder,
    paddingVertical: spacing.lg,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 6,
    elevation: 1,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    ...typography.h2,
    color: colors.textPrimary,
    fontWeight: '800',
  },
  statLabel: {
    ...typography.caption,
    color: colors.textSecondary,
    marginTop: 2,
  },
  statDivider: {
    width: 1,
    height: 28,
    backgroundColor: colors.surfaceBorder,
  },
  menuSection: {
    gap: spacing.sm,
  },
  sectionHeading: {
    ...typography.captionBold,
    color: colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginLeft: spacing.xs,
  },
  menuCard: {
    backgroundColor: colors.surface,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.surfaceBorder,
    overflow: 'hidden',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    minHeight: layout.minTouchTarget,
  },
  menuIconBox: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  menuItemText: {
    flex: 1,
  },
  menuItemTitle: {
    ...typography.bodyBold,
    color: colors.textPrimary,
  },
  menuItemSubtitle: {
    ...typography.caption,
    color: colors.textSecondary,
    marginTop: 1,
  },
  menuItemBorder: {
    height: 1,
    backgroundColor: colors.surfaceBorder,
    marginLeft: 64,
  },
  signOutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 52,
    borderRadius: 16,
    backgroundColor: colors.errorLight,
    borderWidth: 1,
    borderColor: colors.errorBorder,
    marginTop: spacing.xs,
  },
  signOutText: {
    ...typography.button,
    color: colors.error,
    fontWeight: '700',
  },
  versionText: {
    ...typography.caption,
    color: colors.textMuted,
    textAlign: 'center',
    marginTop: -spacing.sm,
  },
});
