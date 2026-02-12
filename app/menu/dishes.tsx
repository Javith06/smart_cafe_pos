import React from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  useWindowDimensions,
  Platform,
} from "react-native";
import { useRouter } from "expo-router";

type Dish = {
  id: string;
  name: string;
  tag?: "red"|"green" | "orange" | "blue" | "yellow";
};

// 👉 Sample categories + dishes (change later from API/DB)
const DISHES: Dish[] = [
  { id: "1", name: "THAI KITCHEN", tag: "green" },
  { id: "2", name: "INDIAN KITCHEN", tag: "green" },
  { id: "3", name: "SOUTH INDIAN", tag: "green" },
  { id: "4", name: "WESTERN KITCHEN", tag: "green" },
  { id: "5", name: "DRINKS", tag: "green" },
  
];

export default function Dishes() {
  const { width, height } = useWindowDimensions();
  const router = useRouter();

  const isLandscape = width > height;

  let numColumns = 5;
  if (isLandscape && width < 1000) numColumns = 6;
  if (width >= 1000) numColumns = 8;

  const GAP = 10;
  const SCREEN_PADDING = 16;

  const itemSize =
    (width - SCREEN_PADDING * 2 - GAP * (numColumns - 1)) / numColumns;

  const getColors = (tag?: Dish["tag"]) => {
    switch (tag) {
      default:
        return { bg: "#8fc221", text: "#052b12" }; // green
    }
  };

  const renderItem = ({ item }: { item: Dish }) => {
    const { bg, text } = getColors(item.tag);

    return (
      <TouchableOpacity
        style={[
          styles.card,
          {
            width: itemSize,
            height: itemSize,
            backgroundColor: bg,
          },
        ]}
        activeOpacity={0.85}
        onPress={() => {
          // 👉 later: open item list / add to cart
          alert(item.name);
        }}
      >
        <Text style={[styles.cardText, { color: text }]} numberOfLines={2}>
          {item.name}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.screen}>
      {/* Header */}
      <View style={styles.headerBar}>
        <Text style={styles.headerTitle}>SMART CAFE • MENU</Text>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => router.back()}
        >
          <Text style={styles.backText}>Back</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={DISHES}
        key={numColumns}
        numColumns={numColumns}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        columnWrapperStyle={{ gap: GAP }}
        contentContainerStyle={{
          gap: GAP,
          padding: SCREEN_PADDING,
          paddingBottom: 24,
        }}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#0b120b",
  },
  headerBar: {
    height: 56,
    backgroundColor: "#1f2933",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
  },
  headerTitle: {
    color: "#97bc49",
    fontSize: 18,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
  backBtn: {
    backgroundColor: "#dc2626",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  backText: {
    color: "#fff",
    fontWeight: "700",
  },
  card: {
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",

    // premium shadow
    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 4,
  },
  cardText: {
    fontSize: 14,
    fontWeight: "700",
    textAlign: "center",
    paddingHorizontal: 6,
  },
});
