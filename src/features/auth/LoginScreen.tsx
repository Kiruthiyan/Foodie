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

  const handleFillDemo = (demoUser: string, demoPass: string) => {
    setUsername(demoUser);
    setPassword(demoPass);
    dispatch(clearAuthError());
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
        >
          {/* Branded Foodie Header */}
          <View style={styles.header}>
            <FoodieLogo size="large" />
          </View>

          {/* Title Section */}
          <View style={styles.welcomeSection}>
            <Text style={styles.title}>Welcome back</Text>
            <Text style={styles.subtitle}>
              Sign in to explore recipes and keep your culinary favourites synced.
            </Text>
          </View>

          {/* Global API Error */}
          {error && (
            <View style={styles.globalErrorBox}>
              <Feather name="alert-circle" size={18} color={colors.error} style={{ marginRight: 8 }} />
              <Text style={styles.globalErrorText}>{error}</Text>
            </View>
          )}

          {/* Form Fields */}
          <View style={styles.form}>
            {/* Username */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Username</Text>
              <View style={[styles.inputWrapper, !!usernameError && styles.inputWrapperError]}>
                <Feather name="user" size={20} color={colors.textMuted} style={styles.fieldIcon} />
                <TextInput
                  style={styles.input}
                  value={username}
                  onChangeText={(text) => {
                    setUsername(text);
                    if (error) dispatch(clearAuthError());
                  }}
                  onBlur={() => setTouched((prev) => ({ ...prev, username: true }))}
                  placeholder="Enter your username"
                  placeholderTextColor={colors.textMuted}
                  autoCapitalize="none"
                  autoCorrect={false}
                  accessibilityLabel="Username input"
                />
              </View>
              {usernameError ? <Text style={styles.errorText}>{usernameError}</Text> : null}
            </View>

            {/* Password */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Password</Text>
              <View style={[styles.inputWrapper, !!passwordError && styles.inputWrapperError]}>
                <Feather name="lock" size={20} color={colors.textMuted} style={styles.fieldIcon} />
                <TextInput
                  style={styles.input}
                  value={password}
                  onChangeText={(text) => {
                    setPassword(text);
                    if (error) dispatch(clearAuthError());
                  }}
                  onBlur={() => setTouched((prev) => ({ ...prev, password: true }))}
                  placeholder="Enter your password"
                  placeholderTextColor={colors.textMuted}
                  secureTextEntry={!showPassword}
                  accessibilityLabel="Password input"
                />
                <TouchableOpacity
                  style={styles.eyeButton}
                  onPress={() => setShowPassword((prev) => !prev)}
                  accessibilityRole="button"
                  accessibilityLabel={showPassword ? 'Hide password' : 'Show password'}
                  hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
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

            {/* Sign In Button */}
            <TouchableOpacity
              style={styles.submitButton}
              onPress={handleLogin}
              disabled={isLoading}
              activeOpacity={0.85}
              accessibilityRole="button"
              accessibilityLabel="Sign in button"
            >
              {isLoading ? (
                <ActivityIndicator color={colors.textInverse} />
              ) : (
                <Text style={styles.submitButtonText}>Sign In</Text>
              )}
            </TouchableOpacity>

            {/* Reviewer / Demo Credentials Helper */}
            <View style={styles.demoBox}>
              <View style={styles.demoHeaderRow}>
                <Feather name="info" size={16} color={colors.accentGreen} style={{ marginRight: 6 }} />
                <Text style={styles.demoTitle}>Reviewer Demo Accounts (DummyJSON)</Text>
              </View>
              <Text style={styles.demoHint}>
                DummyJSON authentication accepts verified accounts:
              </Text>
              <View style={styles.demoChipsRow}>
                <TouchableOpacity
                  style={styles.demoChip}
                  onPress={() => handleFillDemo('emilys', 'emilyspass')}
                  accessibilityRole="button"
                  accessibilityLabel="Use Emily Johnson demo account"
                >
                  <Text style={styles.demoChipText}>emilys / emilyspass</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.demoChip}
                  onPress={() => handleFillDemo('michaelw', 'michaelwpass')}
                  accessibilityRole="button"
                  accessibilityLabel="Use Michael Williams demo account"
                >
                  <Text style={styles.demoChipText}>michaelw / michaelwpass</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Registration Link */}
            <View style={styles.registerRow}>
              <Text style={styles.registerPrompt}>{"Don't have an account? "}</Text>
              <TouchableOpacity
                onPress={() => navigation.navigate('Register')}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                accessibilityRole="button"
                accessibilityLabel="Navigate to registration"
              >
                <Text style={styles.registerLink}>Register</Text>
              </TouchableOpacity>
            </View>
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
    paddingTop: spacing.lg,
    paddingBottom: spacing.xxxl,
  },
  header: {
    marginBottom: spacing.xxl,
  },
  welcomeSection: {
    marginBottom: spacing.xl,
  },
  title: {
    ...typography.h1,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  subtitle: {
    ...typography.body,
    color: colors.textSecondary,
    lineHeight: 22,
  },
  globalErrorBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.errorLight,
    borderWidth: 1,
    borderColor: colors.errorBorder,
    borderRadius: layout.borderRadiusMd,
    padding: spacing.md,
    marginBottom: spacing.lg,
  },
  globalErrorText: {
    ...typography.body,
    color: colors.error,
    flex: 1,
  },
  form: {
    gap: spacing.lg,
  },
  inputGroup: {
    gap: spacing.xs,
  },
  label: {
    ...typography.captionBold,
    color: colors.textPrimary,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderWidth: 1.5,
    borderColor: colors.surfaceBorder,
    borderRadius: layout.borderRadiusMd,
    minHeight: layout.minTouchTarget,
    paddingHorizontal: spacing.md,
  },
  inputWrapperError: {
    borderColor: colors.error,
  },
  fieldIcon: {
    marginRight: spacing.sm,
  },
  input: {
    flex: 1,
    ...typography.bodyLarge,
    color: colors.textPrimary,
    minHeight: layout.minTouchTarget,
    paddingVertical: spacing.sm,
  },
  eyeButton: {
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
  submitButton: {
    minHeight: layout.minTouchTarget,
    borderRadius: layout.borderRadiusMd,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: spacing.sm,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 3,
  },
  submitButtonText: {
    ...typography.button,
    color: colors.textInverse,
  },
  demoBox: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.accentGreenBorder,
    borderRadius: layout.borderRadiusMd,
    padding: spacing.md,
    marginTop: spacing.sm,
  },
  demoHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  demoTitle: {
    ...typography.captionBold,
    color: colors.accentGreen,
  },
  demoHint: {
    ...typography.caption,
    color: colors.textSecondary,
    marginBottom: spacing.sm,
  },
  demoChipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  demoChip: {
    backgroundColor: colors.accentGreenLight,
    borderWidth: 1,
    borderColor: colors.accentGreenBorder,
    borderRadius: layout.borderRadiusSm,
    paddingHorizontal: spacing.md,
    minHeight: 36,
    justifyContent: 'center',
    alignItems: 'center',
  },
  demoChipText: {
    ...typography.captionBold,
    color: colors.accentGreen,
  },
  registerRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: spacing.md,
  },
  registerPrompt: {
    ...typography.body,
    color: colors.textSecondary,
  },
  registerLink: {
    ...typography.bodyBold,
    color: colors.primary,
  },
});
