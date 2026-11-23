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
  const favouritesCount = useAppSelector((state) => state.favourites.items.length);

  const handleLogout = () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out of Foodie? Your SecureStore session will be cleared.',
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
      {/* Header */}
      <FoodieHeader
        subtitle="ACCOUNT & SETTINGS"
        title="My Profile"
      />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* User Card */}
        <View style={styles.userCard}>
          {user?.image ? (
            <Image source={{ uri: user.image }} style={styles.avatar} />
          ) : (
            <View style={styles.avatarFallback}>
              <Text style={styles.avatarInitial}>{initial}</Text>
            </View>
          )}

          <Text style={styles.userName}>
            {user ? `${user.firstName} ${user.lastName}` : 'Guest User'}
          </Text>
          <Text style={styles.userEmail}>{user?.email || 'user@example.com'}</Text>
          <View style={styles.usernameTag}>
            <Text style={styles.usernameTagText}>@{user?.username || 'user'}</Text>
          </View>
        </View>

        {/* Stats Row */}
        <View style={styles.statsRow}>
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>{favouritesCount}</Text>
            <Text style={styles.statLabel}>Saved Favourites</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>14</Text>
            <Text style={styles.statLabel}>Categories</Text>
          </View>
        </View>

        {/* Session Security Details */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <Feather name="shield" size={18} color={colors.accentGreen} style={{ marginRight: 8 }} />
            <Text style={styles.sectionTitle}>Security & Session</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Token Storage</Text>
            <Text style={styles.infoValue}>Expo SecureStore (Encrypted)</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Auth Provider</Text>
            <Text style={styles.infoValue}>DummyJSON Auth API</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Persistence</Text>
            <Text style={styles.infoValue}>Per-User AsyncStorage</Text>
          </View>
        </View>

        {/* Reviewer / Assignment Notes */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <Feather name="award" size={18} color={colors.primary} style={{ marginRight: 8 }} />
            <Text style={styles.sectionTitle}>Assignment 2: Discovery App</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Index Number</Text>
            <Text style={styles.infoValue}>234110</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Assigned Domain</Text>
            <Text style={styles.infoValue}>Food & Recipes (TheMealDB)</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Assigned Twist</Text>
            <Text style={styles.infoValue}>Smart Search (Debounce + Filter)</Text>
          </View>
        </View>

        {/* Logout Action */}
        <TouchableOpacity
          style={styles.logoutButton}
          onPress={handleLogout}
          activeOpacity={0.8}
          accessibilityRole="button"
          accessibilityLabel="Sign out of Foodie"
        >
          <Feather name="log-out" size={20} color={colors.error} style={{ marginRight: 8 }} />
          <Text style={styles.logoutText}>Sign Out</Text>
        </TouchableOpacity>
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
    paddingTop: spacing.md,
    paddingBottom: spacing.xxxl,
    gap: spacing.lg,
  },
  userCard: {
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: layout.borderRadiusLg,
    borderWidth: 1,
    borderColor: colors.surfaceBorder,
    padding: spacing.xl,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 3,
    borderColor: colors.primaryLight,
    marginBottom: spacing.md,
  },
  avatarFallback: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.primaryLight,
    borderWidth: 2,
    borderColor: colors.primaryBorder,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  avatarInitial: {
    ...typography.h1,
    color: colors.primary,
  },
  userName: {
    ...typography.h2,
    color: colors.textPrimary,
  },
  userEmail: {
    ...typography.body,
    color: colors.textSecondary,
    marginTop: 2,
  },
  usernameTag: {
    backgroundColor: colors.backgroundSecondary,
    paddingHorizontal: spacing.md,
    paddingVertical: 3,
    borderRadius: layout.borderRadiusPill,
    marginTop: spacing.sm,
  },
  usernameTagText: {
    ...typography.captionBold,
    color: colors.primary,
  },
  statsRow: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  statBox: {
    flex: 1,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.surfaceBorder,
    borderRadius: layout.borderRadiusMd,
    padding: spacing.md,
    alignItems: 'center',
  },
  statNumber: {
    ...typography.h2,
    color: colors.primary,
  },
  statLabel: {
    ...typography.caption,
    color: colors.textSecondary,
    marginTop: 2,
  },
  sectionCard: {
    backgroundColor: colors.surface,
    borderRadius: layout.borderRadiusMd,
    borderWidth: 1,
    borderColor: colors.surfaceBorder,
    padding: spacing.lg,
    gap: spacing.sm,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  sectionTitle: {
    ...typography.bodyBold,
    color: colors.textPrimary,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  infoLabel: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  infoValue: {
    ...typography.captionBold,
    color: colors.textPrimary,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: layout.minTouchTarget,
    borderRadius: layout.borderRadiusMd,
    backgroundColor: colors.errorLight,
    borderWidth: 1.5,
    borderColor: colors.errorBorder,
    marginTop: spacing.sm,
  },
  logoutText: {
    ...typography.button,
    color: colors.error,
  },
});
