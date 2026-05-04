import { HOME_BALANCE, UPCOMING_SUBSCRIPTIONS } from "@/assets/constants/data";
import { icons } from "@/assets/constants/icons";
import images from "@/assets/constants/images";
import CreateSubscriptionModal from "@/components/CreateSubscriptionModal";
import ListHeading from "@/components/ListHeading";
import SubscriptionCard from "@/components/SubscriptionCard";
import UpcomingSubscriptionCard from "@/components/UpcomingSubscriptionCard";
import { useSubscriptions } from "@/context/SubscriptionsContext";
import { formatCurrency } from "@/lib/utils";
import { useUser } from "@clerk/expo";
import dayjs from "dayjs";
import { usePostHog } from "posthog-react-native";
import { useState } from "react";
import { FlatList, Image, Pressable, Text, View } from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";

export default function App() {
  const { user } = useUser();
  const posthog = usePostHog();
  const { subscriptions, addSubscription } = useSubscriptions();
  const [modalVisible, setModalVisible] = useState(false);
  const [expandedSubscriptionId, setExpandedSubscriptionId] = useState<
    string | null
  >(null);

  const displayName = user?.firstName ?? user?.fullName ?? "Welcome";
  const avatarSource = user?.imageUrl ? { uri: user.imageUrl } : images.avatar;

  return (
    <SafeAreaView className="flex-1 bg-background p-5">
      <FlatList
        ListHeaderComponent={() => (
          <>
            <View className="home-header">
              <View className="home-user">
                <Image source={avatarSource} className="home-avatar" />
                <Text className="home-user-name">{displayName}</Text>
              </View>
              <Pressable onPress={() => setModalVisible(true)}>
                <Image source={icons.add} className="home-add-icon" />
              </Pressable>
            </View>

            <View className="home-balance-card">
              <Text className="home-balance-label">Balance</Text>

              <View className="home-balance-row">
                <Text className="home-balance-amount">
                  {formatCurrency(HOME_BALANCE.amount)}
                </Text>
                <Text className="home-balance-date">
                  {dayjs(HOME_BALANCE.nextRenewalDate).format("MM/YY")}
                </Text>
              </View>
            </View>

            <View className="mb-5">
              <ListHeading title="Upcoming Subscriptions" />

              <FlatList
                data={UPCOMING_SUBSCRIPTIONS}
                renderItem={({ item }) => (
                  <UpcomingSubscriptionCard {...item} />
                )}
                keyExtractor={(item) => item.id}
                horizontal
                showsHorizontalScrollIndicator={false}
                ListEmptyComponent={
                  <Text className="home-empty">No upcoming renewals</Text>
                }
              />
            </View>

            <ListHeading title="All Subscriptions" />
          </>
        )}
        data={subscriptions}
        renderItem={({ item }) => (
          <SubscriptionCard
            {...item}
            onPress={() => {
              const isCurrentlyExpanded = expandedSubscriptionId === item.id;
              setExpandedSubscriptionId((currentId) =>
                currentId === item.id ? null : item.id,
              );
              if (isCurrentlyExpanded) {
                posthog.capture("subscription_collapsed", {
                  subscription_id: item.id,
                  subscription_name: item.name,
                });
              } else {
                posthog.capture("subscription_expanded", {
                  subscription_id: item.id,
                  subscription_name: item.name,
                });
              }
            }}
            expanded={expandedSubscriptionId === item.id}
          />
        )}
        keyExtractor={(item) => item.id}
        extraData={expandedSubscriptionId}
        ItemSeparatorComponent={() => <View className="h-4" />}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <Text className="home-empty-state">No subscription yet.</Text>
        }
        contentContainerClassName="pb-30"
      />
      <CreateSubscriptionModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onSubmit={addSubscription}
      />
    </SafeAreaView>
  );
}
