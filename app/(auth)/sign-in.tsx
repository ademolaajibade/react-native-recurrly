import { useSignIn } from '@clerk/expo';
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

export default function SignIn() {
  const { signIn, errors, fetchStatus } = useSignIn();
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [localErrors, setLocalErrors] = useState<Record<string, string>>({});
  const [generalError, setGeneralError] = useState('');

  const isBusy = fetchStatus === 'fetching';

  function validate() {
    const errs: Record<string, string> = {};
    if (!email.trim()) errs.email = 'Email is required';
    else if (!EMAIL_REGEX.test(email)) errs.email = 'Enter a valid email address';
    if (!password) errs.password = 'Password is required';
    return errs;
  }

  async function handleSignIn() {
    setGeneralError('');
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setLocalErrors(errs);
      return;
    }
    setLocalErrors({});

    const { error } = await signIn.password({ emailAddress: email.trim(), password });

    if (error) {
      setGeneralError(error.message ?? 'Sign in failed. Please try again.');
      return;
    }

    if (signIn.status === 'complete') {
      await signIn.finalize({
        navigate: ({ session }) => {
          if (session?.currentTask) return;
          router.replace('/');
        },
      });
    }
  }

  const emailError = localErrors.email ?? errors?.fields?.identifier?.message ?? '';
  const passwordError = localErrors.password ?? errors?.fields?.password?.message ?? '';

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
            {/* Brand block */}
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
              <Text className="auth-title">Welcome back</Text>
              <Text className="auth-subtitle">
                Sign in to continue managing your subscriptions
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
                    placeholder="Enter your password"
                    placeholderTextColor="rgba(0,0,0,0.35)"
                    value={password}
                    onChangeText={(v) => {
                      setPassword(v);
                      setLocalErrors((e) => ({ ...e, password: '' }));
                      setGeneralError('');
                    }}
                    secureTextEntry
                    textContentType="password"
                    returnKeyType="done"
                    onSubmitEditing={handleSignIn}
                  />
                  {!!passwordError && <Text className="auth-error">{passwordError}</Text>}
                </View>

                {/* General API error */}
                {!!generalError && (
                  <Text className="auth-error text-center">{generalError}</Text>
                )}

                {/* Submit */}
                <Pressable
                  className={`auth-button${isBusy || !email || !password ? ' auth-button-disabled' : ''}`}
                  onPress={handleSignIn}
                  disabled={isBusy || !email || !password}
                >
                  <Text className="auth-button-text">
                    {isBusy ? 'Signing in…' : 'Sign in'}
                  </Text>
                </Pressable>
              </View>
            </View>

            {/* Sign-up link */}
            <View className="auth-link-row">
              <Text className="auth-link-copy">New to Recurly?</Text>
              <Link href={'/(auth)/sign-up' as Href} asChild>
                <Pressable>
                  <Text className="auth-link">Create an account</Text>
                </Pressable>
              </Link>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
