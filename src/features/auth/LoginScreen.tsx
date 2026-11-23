import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { loginUser, clearAuthError } from './authSlice';
import { FoodieLogo } from '../../components/FoodieHeader';
import { validateUsername, validatePassword } from '../../utils/validation';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing, layout } from '../../theme/spacing';

interface LoginScreenProps {
  navigation: {
    navigate: (screen: string) => void;
  };
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ navigation }) => {
  const dispatch = useAppDispatch();
  const { isLoading, error } = useAppSelector((state) => state.auth);

  const [username, setUsername] = useState('emilys');
  const [password, setPassword] = useState('emilyspass');
  const [showPassword, setShowPassword] = useState(false);

  const [touched, setTouched] = useState({ username: false, password: false });
  const [submitted, setSubmitted] = useState(false);

  const usernameError = (touched.username || submitted) ? validateUsername(username) : undefined;
  const passwordError = (touched.password || submitted) ? validatePassword(password) : undefined;

  const handleLogin = async () => {
    setSubmitted(true);
    const uErr = validateUsername(username);
    const pErr = validatePassword(password);
    if (uErr || pErr) {
      return;
    }
    dispatch(clearAuthError());
    await dispatch(loginUser({ username, password }));
  };

  const handleQuickDemo = () => {
    setUsername('emilys');
    setPassword('emilyspass');
    dispatch(clearAuthError());
    dispatch(loginUser({ username: 'emilys', password: 'emilyspass' }));
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Top Brand Hero */}
          <View style={styles.heroSection}>
            <View style={styles.logoBadgeContainer}>
              <FoodieLogo size="large" />
            </View>
            <Text style={styles.welcomeTitle}>Welcome back</Text>
            <Text style={styles.welcomeSubtitle}>
              Sign in to discover chef recipes, smart flavors, and your saved collection.
            </Text>
          </View>

          {/* Form Card */}
          <View style={styles.card}>
            {error && (
              <View style={styles.errorBanner}>
                <Feather name="alert-circle" size={16} color={colors.error} style={{ marginRight: 8 }} />
                <Text style={styles.errorBannerText}>{error}</Text>
              </View>
            )}

            {/* Username Input */}
            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>Username</Text>
              <View style={[styles.inputBox, !!usernameError && styles.inputBoxError]}>
                <Feather name="user" size={18} color={colors.textMuted} style={styles.inputIcon} />
                <TextInput
                  style={styles.textInput}
                  value={username}
                  onChangeText={(text) => {
                    setUsername(text);
                    if (error) dispatch(clearAuthError());
                  }}
                  onBlur={() => setTouched((prev) => ({ ...prev, username: true }))}
                  placeholder="Enter username"
                  placeholderTextColor={colors.textMuted}
                  autoCapitalize="none"
                  autoCorrect={false}
                  accessibilityLabel="Username"
                />
              </View>
              {usernameError ? <Text style={styles.errorText}>{usernameError}</Text> : null}
            </View>

            {/* Password Input */}
            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>Password</Text>
              <View style={[styles.inputBox, !!passwordError && styles.inputBoxError]}>
                <Feather name="lock" size={18} color={colors.textMuted} style={styles.inputIcon} />
                <TextInput
                  style={styles.textInput}
                  value={password}
                  onChangeText={(text) => {
                    setPassword(text);
                    if (error) dispatch(clearAuthError());
                  }}
                  onBlur={() => setTouched((prev) => ({ ...prev, password: true }))}
                  placeholder="Enter password"
                  placeholderTextColor={colors.textMuted}
                  secureTextEntry={!showPassword}
                  accessibilityLabel="Password"
                />
                <TouchableOpacity
                  style={styles.eyeToggle}
                  onPress={() => setShowPassword((prev) => !prev)}
                  accessibilityRole="button"
                  accessibilityLabel={showPassword ? 'Hide password' : 'Show password'}
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                >
                  <Feather
                    name={showPassword ? 'eye-off' : 'eye'}
                    size={18}
                    color={colors.textMuted}
                  />
                </TouchableOpacity>
              </View>
              {passwordError ? <Text style={styles.errorText}>{passwordError}</Text> : null}
            </View>

            {/* Main Sign In Button */}
            <TouchableOpacity
              style={styles.signInButton}
              onPress={handleLogin}
              disabled={isLoading}
              activeOpacity={0.88}
              accessibilityRole="button"
              accessibilityLabel="Sign In"
            >
              {isLoading ? (
                <ActivityIndicator color={colors.textInverse} size="small" />
              ) : (
                <View style={styles.signInButtonContent}>
                  <Text style={styles.signInButtonText}>Sign In</Text>
                  <Feather name="arrow-right" size={18} color={colors.textInverse} style={{ marginLeft: 8 }} />
                </View>
              )}
            </TouchableOpacity>

            {/* Clean 1-Tap Demo Access */}
            <TouchableOpacity
              style={styles.quickDemoPill}
              onPress={handleQuickDemo}
              disabled={isLoading}
              activeOpacity={0.8}
              accessibilityRole="button"
              accessibilityLabel="Instant Demo Login as Emily"
            >
              <View style={styles.demoPillDot} />
              <Text style={styles.quickDemoText}>Instant Demo Access (Emily Johnson)</Text>
              <Feather name="zap" size={14} color={colors.accentGreen} style={{ marginLeft: 6 }} />
            </TouchableOpacity>
          </View>

          {/* Bottom Navigation Link */}
          <View style={styles.footerRow}>
            <Text style={styles.footerText}>New to Foodie? </Text>
            <TouchableOpacity
              onPress={() => navigation.navigate('Register')}
              accessibilityRole="button"
              accessibilityLabel="Create account"
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <Text style={styles.footerLink}>Create an account</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.xxl,
    paddingBottom: spacing.xxxl,
  },
  heroSection: {
    marginBottom: spacing.xxl,
    alignItems: 'flex-start',
  },
  logoBadgeContainer: {
    marginBottom: spacing.lg,
  },
  welcomeTitle: {
    ...typography.h1,
    fontSize: 32,
    lineHeight: 38,
    color: colors.textPrimary,
    letterSpacing: -0.6,
    marginBottom: spacing.xs,
  },
  welcomeSubtitle: {
    ...typography.bodyLarge,
    color: colors.textSecondary,
    lineHeight: 24,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.surfaceBorder,
    padding: spacing.xl,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 12,
    elevation: 3,
    gap: spacing.lg,
  },
  errorBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.errorLight,
    borderWidth: 1,
    borderColor: colors.errorBorder,
    borderRadius: layout.borderRadiusMd,
    padding: spacing.md,
  },
  errorBannerText: {
    ...typography.body,
    color: colors.error,
    flex: 1,
  },
  fieldGroup: {
    gap: 6,
  },
  fieldLabel: {
    ...typography.captionBold,
    color: colors.textPrimary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  inputBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surfaceSubtle,
    borderWidth: 1.5,
    borderColor: colors.surfaceBorder,
    borderRadius: layout.borderRadiusMd,
    minHeight: layout.minTouchTarget,
    paddingHorizontal: spacing.md,
  },
  inputBoxError: {
    borderColor: colors.error,
    backgroundColor: colors.errorLight,
  },
  inputIcon: {
    marginRight: spacing.sm,
  },
  textInput: {
    flex: 1,
    ...typography.bodyLarge,
    color: colors.textPrimary,
    minHeight: layout.minTouchTarget,
    paddingVertical: spacing.sm,
  },
  eyeToggle: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorText: {
    ...typography.caption,
    color: colors.error,
    marginTop: 2,
  },
  signInButton: {
    minHeight: 52,
    borderRadius: layout.borderRadiusMd,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: spacing.xs,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.28,
    shadowRadius: 10,
    elevation: 4,
  },
  signInButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  signInButtonText: {
    ...typography.button,
    color: colors.textInverse,
    fontSize: 16,
    fontWeight: '700',
  },
  quickDemoPill: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.accentGreenLight,
    borderWidth: 1,
    borderColor: colors.accentGreenBorder,
    borderRadius: layout.borderRadiusPill,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    minHeight: 40,
  },
  demoPillDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.accentGreen,
    marginRight: 8,
  },
  quickDemoText: {
    ...typography.captionBold,
    color: colors.accentGreenDark,
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: spacing.xl,
  },
  footerText: {
    ...typography.body,
    color: colors.textSecondary,
  },
  footerLink: {
    ...typography.bodyBold,
    color: colors.primary,
  },
});
