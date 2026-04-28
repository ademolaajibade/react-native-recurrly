import { useSignUp } from '@clerk/expo';
import { type Href, Link, useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function SignUp() {
  const { signUp, errors, fetchStatus } = useSignUp();
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [code, setCode] = useState('');
  const [localErrors, setLocalErrors] = useState<Record<string, string>>({});
  const [generalError, setGeneralError] = useState('');

  const isBusy = fetchStatus === 'fetching';
  const isVerifying =
    signUp.status === 'missing_requirements' &&
    signUp.unverifiedFields?.includes('email_address') &&
    signUp.missingFields?.length === 0;

  function validateCredentials() {
    const errs: Record<string, string> = {};
    if (!email.trim()) errs.email = 'Email is required';
    else if (!EMAIL_REGEX.test(email)) errs.email = 'Enter a valid email address';
    if (!password) errs.password = 'Password is required';
    else if (password.length < 8) errs.password = 'Password must be at least 8 characters';
    return errs;
  }

  async function handleCreateAccount() {
    setGeneralError('');
    const errs = validateCredentials();
    if (Object.keys(errs).length > 0) {
      setLocalErrors(errs);
      return;
    }
    setLocalErrors({});

    try {
      const { error } = await signUp.password({ emailAddress: email.trim(), password });

      if (error) {
        setGeneralError(error.message ?? 'Could not create account. Please try again.');
        return;
      }

      await signUp.verifications.sendEmailCode();
    } catch (err: any) {
      setGeneralError(err?.message ?? 'Could not create account. Please try again.');
    }
  }

  async function handleVerify() {
    setGeneralError('');
    if (!code.trim()) {
      setLocalErrors({ code: 'Verification code is required' });
      return;
    }
    setLocalErrors({});

    try {
      await signUp.verifications.verifyEmailCode({ code: code.trim() });

      if (signUp.status === 'complete') {
        await signUp.finalize({
          navigate: ({ session }) => {
            if (session?.currentTask) return;
            router.replace('/');
          },
        });
      } else {
        setGeneralError('Verification failed. Please check the code and try again.');
      }
    } catch (err: any) {
      setGeneralError(err?.message ?? 'Could not create account. Please try again.');
    }
  }

  const emailError = localErrors.email ?? errors?.fields?.emailAddress?.message ?? '';
  const passwordError = localErrors.password ?? errors?.fields?.password?.message ?? '';
  const codeError = localErrors.code ?? errors?.fields?.code?.message ?? '';

  const BrandBlock = () => (
    <View className="auth-brand-block">
      <View className="auth-logo-wrap">
        <View className="auth-logo-mark">
          <Text className="auth-logo-mark-text">R</Text>
        </View>
        <View>
          <Text className="auth-wordmark">Recurly</Text>
          <Text className="auth-wordmark-sub">Smart Billing</Text>
        </View>
      </View>
    </View>
  );

  if (isVerifying) {
    return (
      <SafeAreaView className="auth-safe-area">
        <KeyboardAvoidingView
          className="flex-1"
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          <ScrollView
            className="flex-1"
            contentContainerClassName="grow"
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <View className="auth-content">
              <BrandBlock />

              <View className="auth-brand-block">
                <Text className="auth-title">Check your email</Text>
                <Text className="auth-subtitle">
                  We sent a 6-digit code to {email}
                </Text>
              </View>

              <View className="auth-card">
                <View className="auth-form">
                  {/* Code field */}
                  <View className="auth-field">
                    <Text className="auth-label">Verification code</Text>
                    <TextInput
                      className={`auth-input${codeError ? ' auth-input-error' : ''}`}
                      placeholder="Enter 6-digit code"
                      placeholderTextColor="rgba(0,0,0,0.35)"
                      value={code}
                      onChangeText={(v) => {
                        setCode(v);
                        setLocalErrors((e) => ({ ...e, code: '' }));
                        setGeneralError('');
                      }}
                      keyboardType="numeric"
                      maxLength={6}
                      returnKeyType="done"
                      onSubmitEditing={handleVerify}
                    />
                    {!!codeError && <Text className="auth-error">{codeError}</Text>}
                  </View>

                  {!!generalError && (
                    <Text className="auth-error text-center">{generalError}</Text>
                  )}

                  {/* Verify button */}
                  <Pressable
                    className={`auth-button${isBusy || code.length < 6 ? ' auth-button-disabled' : ''}`}
                    onPress={handleVerify}
                    disabled={isBusy || code.length < 6}
                  >
                    <Text className="auth-button-text">
                      {isBusy ? 'Verifying…' : 'Verify email'}
                    </Text>
                  </Pressable>

                  {/* Resend code */}
                  <Pressable
                    className="auth-secondary-button"
                    onPress={async () => {
                      try {
                        await signUp.verifications.sendEmailCode();
                      } catch (err: any) {
                        setGeneralError(err?.message ?? 'Could not create account. Please try again.');
                      }
                    }}
                    disabled={isBusy}
                  >
                    <Text className="auth-secondary-button-text">Resend code</Text>
                  </Pressable>
                </View>
              </View>

              {/* Start over link */}
              <View className="auth-link-row">
                <Text className="auth-link-copy">Wrong email?</Text>
                <Pressable onPress={() => router.back()}>
                  <Text className="auth-link">Start over</Text>
                </Pressable>
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="auth-safe-area">
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          className="flex-1"
          contentContainerClassName="grow"
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View className="auth-content">
            <View className="auth-brand-block">
              <View className="auth-logo-wrap">
                <View className="auth-logo-mark">
                  <Text className="auth-logo-mark-text">R</Text>
                </View>
                <View>
                  <Text className="auth-wordmark">Recurly</Text>
                  <Text className="auth-wordmark-sub">Smart Billing</Text>
                </View>
              </View>
              <Text className="auth-title">Create your account</Text>
              <Text className="auth-subtitle">
                Start tracking your subscriptions in seconds
              </Text>
            </View>

            {/* Form card */}
            <View className="auth-card">
              <View className="auth-form">
                {/* Email field */}
                <View className="auth-field">
                  <Text className="auth-label">Email</Text>
                  <TextInput
                    className={`auth-input${emailError ? ' auth-input-error' : ''}`}
                    placeholder="Enter your email"
                    placeholderTextColor="rgba(0,0,0,0.35)"
                    value={email}
                    onChangeText={(v) => {
                      setEmail(v);
                      setLocalErrors((e) => ({ ...e, email: '' }));
                      setGeneralError('');
                    }}
                    autoCapitalize="none"
                    autoCorrect={false}
                    keyboardType="email-address"
                    textContentType="emailAddress"
                    returnKeyType="next"
                  />
                  {!!emailError && <Text className="auth-error">{emailError}</Text>}
                </View>

                {/* Password field */}
                <View className="auth-field">
                  <Text className="auth-label">Password</Text>
                  <TextInput
                    className={`auth-input${passwordError ? ' auth-input-error' : ''}`}
                    placeholder="At least 8 characters"
                    placeholderTextColor="rgba(0,0,0,0.35)"
                    value={password}
                    onChangeText={(v) => {
                      setPassword(v);
                      setLocalErrors((e) => ({ ...e, password: '' }));
                      setGeneralError('');
                    }}
                    secureTextEntry
                    textContentType="newPassword"
                    returnKeyType="done"
                    onSubmitEditing={handleCreateAccount}
                  />
                  {!!passwordError && <Text className="auth-error">{passwordError}</Text>}
                </View>

                {!!generalError && (
                  <Text className="auth-error text-center">{generalError}</Text>
                )}

                {/* Submit */}
                <Pressable
                  className={`auth-button${isBusy || !email || !password ? ' auth-button-disabled' : ''}`}
                  onPress={handleCreateAccount}
                  disabled={isBusy || !email || !password}
                >
                  <Text className="auth-button-text">
                    {isBusy ? 'Creating account…' : 'Create account'}
                  </Text>
                </Pressable>
              </View>
            </View>

            {/* Sign-in link */}
            <View className="auth-link-row">
              <Text className="auth-link-copy">Already have an account?</Text>
              <Link href={'/(auth)/sign-in' as Href} asChild>
                <Pressable>
                  <Text className="auth-link">Sign in</Text>
                </Pressable>
              </Link>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
