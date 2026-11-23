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
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { FoodieLogo } from '../../components/FoodieHeader';
import { authService } from './authService';
import { validateUsername, validatePassword, validateEmail, validateName } from '../../utils/validation';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing, layout } from '../../theme/spacing';

interface RegisterScreenProps {
  navigation: {
    navigate: (screen: string) => void;
    goBack: () => void;
  };
}

export const RegisterScreen: React.FC<RegisterScreenProps> = ({ navigation }) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const firstNameError = submitted ? validateName(firstName, 'First name') : undefined;
  const lastNameError = submitted ? validateName(lastName, 'Last name') : undefined;
  const usernameError = submitted ? validateUsername(username) : undefined;
  const emailError = submitted ? validateEmail(email) : undefined;
  const passwordError = submitted ? validatePassword(password) : undefined;

  const handleRegister = async () => {
    setSubmitted(true);
    setError(null);

    const fErr = validateName(firstName, 'First name');
    const lErr = validateName(lastName, 'Last name');
    const uErr = validateUsername(username);
    const eErr = validateEmail(email);
    const pErr = validatePassword(password);

    if (fErr || lErr || uErr || eErr || pErr) {
      return;
    }

    try {
      setIsLoading(true);
      await authService.register({
        firstName,
        lastName,
        username,
        email,
        password,
      });

      setIsLoading(false);
      Alert.alert(
        'Account Created',
        'Your profile was registered successfully! You can now log in using the demo credentials.',
        [
          {
            text: 'Proceed to Sign In',
            onPress: () => navigation.navigate('Login'),
          },
        ]
      );
    } catch (err: unknown) {
      setIsLoading(false);
      const msg = err instanceof Error ? err.message : 'Registration failed';
      setError(msg);
    }
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
          {/* Top Bar */}
          <View style={styles.topBar}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => navigation.goBack()}
              accessibilityRole="button"
              accessibilityLabel="Back to sign in"
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <Feather name="arrow-left" size={20} color={colors.textPrimary} />
            </TouchableOpacity>
            <FoodieLogo />
            <View style={{ width: 40 }} />
          </View>

          {/* Title */}
          <View style={styles.heroSection}>
            <Text style={styles.title}>Join Foodie</Text>
            <Text style={styles.subtitle}>
              Save your culinary journeys, explore trending recipes, and share your favorites.
            </Text>
          </View>

          {/* Form Card */}
          <View style={styles.card}>
            {error && (
              <View style={styles.errorBox}>
                <Feather name="alert-circle" size={16} color={colors.error} style={{ marginRight: 8 }} />
                <Text style={styles.errorText}>{error}</Text>
              </View>
            )}

            {/* Name Fields */}
            <View style={styles.nameRow}>
              <View style={[styles.fieldGroup, { flex: 1 }]}>
                <Text style={styles.label}>First Name</Text>
                <View style={[styles.inputBox, !!firstNameError && styles.inputBoxError]}>
                  <TextInput
                    style={styles.input}
                    value={firstName}
                    onChangeText={setFirstName}
                    placeholder="Emily"
                    placeholderTextColor={colors.textMuted}
                    accessibilityLabel="First Name"
                  />
                </View>
                {firstNameError ? <Text style={styles.fieldError}>{firstNameError}</Text> : null}
              </View>

              <View style={[styles.fieldGroup, { flex: 1 }]}>
                <Text style={styles.label}>Last Name</Text>
                <View style={[styles.inputBox, !!lastNameError && styles.inputBoxError]}>
                  <TextInput
                    style={styles.input}
                    value={lastName}
                    onChangeText={setLastName}
                    placeholder="Johnson"
                    placeholderTextColor={colors.textMuted}
                    accessibilityLabel="Last Name"
                  />
                </View>
                {lastNameError ? <Text style={styles.fieldError}>{lastNameError}</Text> : null}
              </View>
            </View>

            {/* Username */}
            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Username</Text>
              <View style={[styles.inputBox, !!usernameError && styles.inputBoxError]}>
                <Feather name="user" size={18} color={colors.textMuted} style={styles.fieldIcon} />
                <TextInput
                  style={styles.input}
                  value={username}
                  onChangeText={setUsername}
                  placeholder="Choose username"
                  placeholderTextColor={colors.textMuted}
                  autoCapitalize="none"
                  autoCorrect={false}
                  accessibilityLabel="Username"
                />
              </View>
              {usernameError ? <Text style={styles.fieldError}>{usernameError}</Text> : null}
            </View>

            {/* Email */}
            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Email Address</Text>
              <View style={[styles.inputBox, !!emailError && styles.inputBoxError]}>
                <Feather name="mail" size={18} color={colors.textMuted} style={styles.fieldIcon} />
                <TextInput
                  style={styles.input}
                  value={email}
                  onChangeText={setEmail}
                  placeholder="name@example.com"
                  placeholderTextColor={colors.textMuted}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  accessibilityLabel="Email Address"
                />
              </View>
              {emailError ? <Text style={styles.fieldError}>{emailError}</Text> : null}
            </View>

            {/* Password */}
            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Password</Text>
              <View style={[styles.inputBox, !!passwordError && styles.inputBoxError]}>
                <Feather name="lock" size={18} color={colors.textMuted} style={styles.fieldIcon} />
                <TextInput
                  style={styles.input}
                  value={password}
                  onChangeText={setPassword}
                  placeholder="Create a password"
                  placeholderTextColor={colors.textMuted}
                  secureTextEntry={!showPassword}
                  accessibilityLabel="Password"
                />
                <TouchableOpacity
                  style={styles.eyeToggle}
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
              {passwordError ? <Text style={styles.fieldError}>{passwordError}</Text> : null}
            </View>

            {/* Submit */}
            <TouchableOpacity
              style={styles.submitButton}
              onPress={handleRegister}
              disabled={isLoading}
              activeOpacity={0.88}
              accessibilityRole="button"
              accessibilityLabel="Create Account"
            >
              {isLoading ? (
                <ActivityIndicator color={colors.textInverse} size="small" />
              ) : (
                <Text style={styles.submitButtonText}>Create Account</Text>
              )}
            </TouchableOpacity>
          </View>

          {/* Footer Back Link */}
          <View style={styles.footerRow}>
            <Text style={styles.footerText}>Already have an account? </Text>
            <TouchableOpacity
              onPress={() => navigation.navigate('Login')}
              accessibilityRole="button"
              accessibilityLabel="Sign in"
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <Text style={styles.footerLink}>Sign In</Text>
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
    paddingTop: spacing.md,
    paddingBottom: spacing.xxxl,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.xl,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.surfaceBorder,
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroSection: {
    marginBottom: spacing.xl,
  },
  title: {
    ...typography.h1,
    fontSize: 30,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  subtitle: {
    ...typography.bodyLarge,
    color: colors.textSecondary,
    lineHeight: 22,
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
    gap: spacing.md,
  },
  errorBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.errorLight,
    borderWidth: 1,
    borderColor: colors.errorBorder,
    borderRadius: layout.borderRadiusMd,
    padding: spacing.md,
  },
  errorText: {
    ...typography.body,
    color: colors.error,
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  fieldGroup: {
    gap: 6,
  },
  label: {
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
  eyeToggle: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fieldError: {
    ...typography.caption,
    color: colors.error,
  },
  submitButton: {
    minHeight: 52,
    borderRadius: layout.borderRadiusMd,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: spacing.md,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.28,
    shadowRadius: 10,
    elevation: 4,
  },
  submitButtonText: {
    ...typography.button,
    color: colors.textInverse,
    fontSize: 16,
    fontWeight: '700',
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
