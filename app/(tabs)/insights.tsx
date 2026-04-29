import React, { useEffect } from "react";
import { Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { usePostHog } from "posthog-react-native";

const Insights = () => {
  const posthog = usePostHog();

  useEffect(() => {
    posthog.capture('insights_viewed');
  }, [posthog]);

  return (
    <SafeAreaView className="flex-1 bg-background p-5">
      <Text className="text-xl font-bold text-success">Insights</Text>
    </SafeAreaView>
  );
};

export default Insights;
