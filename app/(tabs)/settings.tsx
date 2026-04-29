import { useClerk, useUser } from '@clerk/expo';
import dayjs from 'dayjs';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Image, Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import images from '@/assets/constants/images';

type InfoRowProps = {
  label: string;
  value: string;
  last?: boolean;
};

const InfoRow = ({ label, value, last }: InfoRowProps) => (
  <View className={`sub-row py-3.5 ${!last ? 'border-b border-border' : ''}`}>
    <Text className="sub-label">{label}</Text>
    <Text className="sub-value text-right" numberOfLines={1} ellipsizeMode="middle">
      {value}
    </Text>
  </View>
);

export default function Settings() {
  const { user } = useUser();
  const { signOut } = useClerk();
  const router = useRouter();

  const displayName = user?.fullName ?? user?.firstName ?? 'User';
  const email = user?.primaryEmailAddress?.emailAddress ?? '—';
  const userId = user?.id ?? '—';
  const memberSince = user?.createdAt
    ? dayjs(user.createdAt).format('MMMM D, YYYY')
    : '—';
  const lastSignIn = user?.lastSignInAt
    ? dayjs(user.lastSignInAt).format('MMMM D, YYYY [at] h:mm A')
    : '—';
  const avatarSource = user?.imageUrl ? { uri: user.imageUrl } : images.avatar;

  const [isSigningOut, setIsSigningOut] = useState(false);
  const [signOutError, setSignOutError] = useState('');

  async function handleSignOut() {
    setSignOutError('');
    setIsSigningOut(true);
    try {
      await signOut();
      router.replace('/(auth)/sign-in');
    } catch (err: any) {
      setSignOutError(err?.message ?? 'Sign out failed. Please try again.');
    } finally {
      setIsSigningOut(false);
    }
  }

  return (
    <SafeAreaView className="flex-1 bg-background">
      <ScrollView
        className="flex-1"
        contentContainerClassName="p-5 gap-6 pb-10"
        showsVerticalScrollIndicator={false}
      >
        {/* Page title */}
        <Text className="list-title">Settings</Text>

        {/* Profile card */}
        <View className="rounded-3xl border border-border bg-card overflow-hidden">
          {/* Accent banner */}
          <View className="h-16 bg-accent" />

          {/* Avatar — overlaps the banner */}
          <View className="items-center -mt-10 pb-5 px-5">
            <Image
              source={avatarSource}
              className="size-20 rounded-full border-4 border-card"
            />
            <Text className="mt-3 text-xl font-sans-bold text-primary">
              {displayName}
            </Text>
            <Text className="mt-0.5 text-sm font-sans-medium text-muted-foreground">
              {email}
            </Text>
          </View>
        </View>

        {/* Account details section */}
        <View className="gap-3">
          <Text className="list-title text-lg">Account Details</Text>

          <View className="rounded-2xl border border-border bg-card px-4">
            <InfoRow label="User ID" value={userId} />
            <InfoRow label="Email" value={email} />
            <InfoRow label="Member since" value={memberSince} />
            <InfoRow label="Last sign in" value={lastSignIn} last />
          </View>
        </View>

        {/* Sign out */}
        {!!signOutError && (
          <Text className="text-center text-sm font-sans-medium text-destructive">
            {signOutError}
          </Text>
        )}
        <Pressable
          className={`items-center rounded-2xl bg-accent py-4 mt-2${isSigningOut ? ' opacity-50' : ''}`}
          onPress={handleSignOut}
          disabled={isSigningOut}
        >
          <Text className="text-base font-sans-bold text-white">
            {isSigningOut ? 'Signing out…' : 'Sign out'}
          </Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}
