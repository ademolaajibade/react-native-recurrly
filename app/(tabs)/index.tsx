import "@/global.css";
import { Link } from "expo-router";
import { Text } from "react-native";


import { SafeAreaView } from "react-native-safe-area-context";  

export default function Index() {
  return (
    <SafeAreaView className="flex-1 bg-background p-5">
      <Text className="text-xl font-bold text-success">
        Welcome to Nativewind!
      </Text>
      <Link
        href="/Onboarding"
        className="mt-4 rounded bg-primary text-white p-4"
      >
        <Text>Go to onboarding</Text>
      </Link>
      <Link
        href="/(auth)/sign-in"
        className="mt-4 rounded bg-primary text-white p-4"
      >
        <Text>Go to Sign in </Text>
      </Link>
      <Link
        href="/(auth)/sign-up"
        className="mt-4 rounded bg-primary text-white p-4"
      >
        <Text>Go to sign up</Text>
      </Link>

      <Link href="/subscriptions/spotify" className="">
        <Text>Spotify Subscription</Text>
      </Link>
      <Link
        href={{
          pathname: "/subscriptions/claude",
          params: { id: "claude" },
        }}
        className=""
      >
        <Text>Claude Max Subscription</Text>
      </Link>
    </SafeAreaView>
  );
}
