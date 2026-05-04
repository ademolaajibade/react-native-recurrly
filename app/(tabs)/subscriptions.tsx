import SubscriptionCard from "@/components/SubscriptionCard";
import { useSubscriptions } from "@/context/SubscriptionsContext";
import React, { useMemo, useState } from "react";
import {
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const STATUS_FILTERS = ["All", "Active", "Paused", "Cancelled"] as const;
type StatusFilter = (typeof STATUS_FILTERS)[number];

const Subscriptions = () => {
  const { subscriptions } = useSubscriptions();
  const [query, setQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<StatusFilter>("All");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim();
    return subscriptions.filter((sub) => {
      const matchesSearch =
        !q ||
        sub.name.toLowerCase().includes(q) ||
        sub.category?.toLowerCase().includes(q) ||
        sub.plan?.toLowerCase().includes(q);

      const matchesStatus =
        activeFilter === "All" ||
        sub.status?.toLowerCase() === activeFilter.toLowerCase();

      return matchesSearch && matchesStatus;
    });
  }, [query, activeFilter]);

  return (
    <SafeAreaView className="flex-1 bg-background">
      <KeyboardAvoidingView
        className="flex-1 px-5 pt-5"
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={10}
      >
      <Text className="text-xl font-bold text-foreground mb-5">
        Subscriptions
      </Text>

      <View className="bg-card rounded-xl flex-row items-center px-4 mb-4 h-12">
        <Text className="text-muted-foreground mr-2">🔍</Text>
        <TextInput
          value={query}
          onChangeText={setQuery}
          placeholder="Search by name, category or plan..."
          placeholderTextColor="#9ca3af"
          className="flex-1 text-foreground text-sm"
          returnKeyType="search"
          clearButtonMode="while-editing"
        />
      </View>

      <View className="flex-row gap-2 mb-5">
        {STATUS_FILTERS.map((filter) => (
          <TouchableOpacity
            key={filter}
            onPress={() => {
              setActiveFilter(filter);
              setExpandedId(null);
            }}
            className={`px-4 py-2 rounded-full ${
              activeFilter === filter ? "bg-success" : "bg-card"
            }`}
          >
            <Text
              className={`text-xs font-semibold ${
                activeFilter === filter
                  ? "text-white"
                  : "text-muted-foreground"
              }`}
            >
              {filter}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <SubscriptionCard
            {...item}
            expanded={expandedId === item.id}
            onPress={() =>
              setExpandedId((prev) => (prev === item.id ? null : item.id))
            }
          />
        )}
        extraData={expandedId}
        ItemSeparatorComponent={() => <View className="h-4" />}
        showsVerticalScrollIndicator={false}
        contentContainerClassName="pb-30"
        ListEmptyComponent={
          <View className="items-center mt-16">
            <Text className="text-muted-foreground text-sm">
              No subscriptions found.
            </Text>
          </View>
        }
      />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default Subscriptions;
