import "@/global.css";
import { Link } from "expo-router";
import { Text } from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";

export default function Index() {
  return (
    <SafeAreaView className="flex-1 bg-background p-5">
      <Text className="text-7xl font-sans-extrabold ">Home</Text>
      <Link
        href="/Onboarding"
        className="mt-4 font-sans-bold rounded bg-primary text-white p-4"
      >
        <Text>Go to onboarding</Text>
      </Link>
      <Link
        href="/(auth)/sign-in"
        className="mt-4 font-sans-bold rounded bg-primary text-white p-4"
      >
        <Text>Go to Sign in </Text>
      </Link>
      <Link
        href="/(auth)/sign-up"
        className="mt-4 font-sans-bold rounded bg-primary text-white p-4"
      >
        <Text className="tabs-glyph">Go to sign up</Text>
      </Link>
    </SafeAreaView>
  );
}
