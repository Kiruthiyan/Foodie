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
  const [successInfo, setSuccessInfo] = useState<string | null>(null);
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
      const res = await authService.register({
        firstName,
        lastName,
        username,
        email,
        password,
      });

      setIsLoading(false);
      setSuccessInfo(
        `Account for ${res.firstName} ${res.lastName} created successfully! (ID: ${res.id}). Note: DummyJSON provides simulated registration, so please sign in with a supported demo account (e.g., emilys / emilyspass).`
      );

      Alert.alert(
        'Simulated Registration Successful',
        'Your registration was processed by DummyJSON API. As per DummyJSON specifications, new accounts are not persisted on their server. Please use a supported demo account to sign in.',
        [
          {
            text: 'Go to Sign In',
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
        >
          {/* Header */}
          <View style={styles.headerRow}>
            <FoodieLogo size="large" />
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => navigation.goBack()}
              accessibilityRole="button"
              accessibilityLabel="Go back to login"
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <Feather name="arrow-left" size={20} color={colors.textPrimary} />
            </TouchableOpacity>
          </View>

          <View style={styles.titleSection}>
            <Text style={styles.title}>Create Account</Text>
            <Text style={styles.subtitle}>
              Register a profile to experience Foodie discovery.
            </Text>
          </View>

          {/* Simulated Registration Notice */}
          <View style={styles.simulationBanner}>
            <Feather name="info" size={18} color={colors.accentAmber} style={{ marginRight: 8, marginTop: 2 }} />
            <View style={{ flex: 1 }}>
              <Text style={styles.simulationTitle}>Simulated Registration Notice</Text>
              <Text style={styles.simulationBody}>
                {"DummyJSON provides a simulated registration endpoint (POST /users/add). Since newly registered users are not added to DummyJSON's mock database, use the demo accounts (e.g. emilys / emilyspass) to log in."}
              </Text>
            </View>
          </View>

          {successInfo && (
            <View style={styles.successBox}>
              <Feather name="check-circle" size={18} color={colors.success} style={{ marginRight: 8 }} />
              <Text style={styles.successText}>{successInfo}</Text>
            </View>
          )}

          {error && (
            <View style={styles.errorBox}>
              <Feather name="alert-circle" size={18} color={colors.error} style={{ marginRight: 8 }} />
              <Text style={styles.errorText}>{error}</Text>
            </View>
          )}

          {/* Form */}
          <View style={styles.form}>
            {/* First & Last Name */}
            <View style={styles.row}>
              <View style={[styles.inputGroup, { flex: 1 }]}>
                <Text style={styles.label}>First Name</Text>
                <View style={[styles.inputWrapper, !!firstNameError && styles.inputWrapperError]}>
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

              <View style={[styles.inputGroup, { flex: 1 }]}>
                <Text style={styles.label}>Last Name</Text>
                <View style={[styles.inputWrapper, !!lastNameError && styles.inputWrapperError]}>
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
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Username</Text>
              <View style={[styles.inputWrapper, !!usernameError && styles.inputWrapperError]}>
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
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Email Address</Text>
              <View style={[styles.inputWrapper, !!emailError && styles.inputWrapperError]}>
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
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Password</Text>
              <View style={[styles.inputWrapper, !!passwordError && styles.inputWrapperError]}>
                <Feather name="lock" size={18} color={colors.textMuted} style={styles.fieldIcon} />
                <TextInput
                  style={styles.input}
                  value={password}
                  onChangeText={setPassword}
                  placeholder="At least 4 characters"
                  placeholderTextColor={colors.textMuted}
                  secureTextEntry={!showPassword}
                  accessibilityLabel="Password"
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
              {passwordError ? <Text style={styles.fieldError}>{passwordError}</Text> : null}
            </View>

            {/* Submit */}
            <TouchableOpacity
              style={styles.submitButton}
              onPress={handleRegister}
              disabled={isLoading}
              activeOpacity={0.85}
              accessibilityRole="button"
              accessibilityLabel="Register Account"
            >
              {isLoading ? (
                <ActivityIndicator color={colors.textInverse} />
              ) : (
                <Text style={styles.submitButtonText}>Create Account</Text>
              )}
            </TouchableOpacity>

            {/* Back to Login */}
            <View style={styles.loginRow}>
              <Text style={styles.loginPrompt}>Already registered? </Text>
              <TouchableOpacity
                onPress={() => navigation.navigate('Login')}
                accessibilityRole="button"
                accessibilityLabel="Sign in"
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              >
                <Text style={styles.loginLink}>Sign In</Text>
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
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.lg,
  },
  backButton: {
    width: layout.minTouchTarget,
    height: layout.minTouchTarget,
    borderRadius: layout.minTouchTarget / 2,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.surfaceBorder,
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleSection: {
    marginBottom: spacing.lg,
  },
  title: {
    ...typography.h1,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  subtitle: {
    ...typography.body,
    color: colors.textSecondary,
  },
  simulationBanner: {
    flexDirection: 'row',
    backgroundColor: colors.accentAmberLight,
    borderWidth: 1,
    borderColor: colors.accentAmber,
    borderRadius: layout.borderRadiusMd,
    padding: spacing.md,
    marginBottom: spacing.lg,
  },
  simulationTitle: {
    ...typography.captionBold,
    color: colors.accentAmber,
    marginBottom: 2,
  },
  simulationBody: {
    ...typography.caption,
    color: colors.textPrimary,
    lineHeight: 18,
  },
  successBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.accentGreenLight,
    borderWidth: 1,
    borderColor: colors.accentGreenBorder,
    borderRadius: layout.borderRadiusMd,
    padding: spacing.md,
    marginBottom: spacing.lg,
  },
  successText: {
    ...typography.caption,
    color: colors.accentGreen,
    flex: 1,
  },
  errorBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.errorLight,
    borderWidth: 1,
    borderColor: colors.errorBorder,
    borderRadius: layout.borderRadiusMd,
    padding: spacing.md,
    marginBottom: spacing.lg,
  },
  errorText: {
    ...typography.body,
    color: colors.error,
    flex: 1,
  },
  form: {
    gap: spacing.md,
  },
  row: {
    flexDirection: 'row',
    gap: spacing.md,
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
  fieldError: {
    ...typography.caption,
    color: colors.error,
  },
  submitButton: {
    minHeight: layout.minTouchTarget,
    borderRadius: layout.borderRadiusMd,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: spacing.md,
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
  loginRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: spacing.md,
  },
  loginPrompt: {
    ...typography.body,
    color: colors.textSecondary,
  },
  loginLink: {
    ...typography.bodyBold,
    color: colors.primary,
  },
});
