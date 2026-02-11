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
  tag?: "green" | "orange" | "blue" | "yellow";
};

// 👉 Sample categories + dishes (change later from API/DB)
const DISHES: Dish[] = [
  { id: "1", name: "THAI KITCHEN", tag: "green" },
  { id: "2", name: "INDIAN KITCHEN", tag: "orange" },
  { id: "3", name: "WESTERN KITCHEN", tag: "yellow" },
  { id: "4", name: "DRINKS", tag: "orange" },
  { id: "5", name: "SOUTH INDIAN", tag: "blue" },

  { id: "6", name: "SOUP", tag: "green" },
  { id: "7", name: "Thai Veg", tag: "green" },
  { id: "8", name: "Dishes", tag: "green" },
  { id: "9", name: "Fishes", tag: "green" },
  { id: "10", name: "Omelette", tag: "green" },
  { id: "11", name: "Noodles", tag: "green" },

  { id: "12", name: "Steam Rice", tag: "green" },
  { id: "13", name: "Fried Rice", tag: "green" },

  { id: "14", name: "Tomyam Seafood (S)", tag: "orange" },
  { id: "15", name: "Tomyam Seafood (L)", tag: "green" },
  { id: "16", name: "Tomyam Chicken (S)", tag: "orange" },
  { id: "17", name: "Tomyam Chicken (L)", tag: "green" },
  { id: "18", name: "Tomyam Beef (S)", tag: "orange" },
  { id: "19", name: "Tomyam Beef (L)", tag: "green" },

  { id: "20", name: "Fish Soup (S)", tag: "orange" },
  { id: "21", name: "Fish Soup (L)", tag: "green" },
  { id: "22", name: "Chicken Soup (S)", tag: "orange" },
  { id: "23", name: "Chicken Soup (L)", tag: "green" },

  { id: "24", name: "MISC", tag: "blue" },
  { id: "25", name: "Free Delivery (NUS)", tag: "blue" },
  { id: "26", name: "Delivery Charges", tag: "blue" },
  { id: "27", name: "Prawn Crackers", tag: "green" },

  { id: "28", name: "Veg Soup (S)", tag: "green" },
  { id: "29", name: "Veg Soup (L)", tag: "green" },
  { id: "30", name: "Free Delivery 12pm - 2pm", tag: "blue" },
  { id: "31", name: "Tomyam Fish (S)", tag: "green" },
];

export default function Dishes() {
  const { width, height } = useWindowDimensions();
  const router = useRouter();

  const isLandscape = width > height;

  // 📱 Portrait (mobile/tab) -> 4
  // 🔁 Landscape (tab rotate) -> 6
  // 💻 Laptop/PC -> 8
  let numColumns = 4;
  if (isLandscape && width < 1000) numColumns = 6;
  if (width >= 1000) numColumns = 8;

  const GAP = 10;
  const SCREEN_PADDING = 16;

  const itemSize =
    (width - SCREEN_PADDING * 2 - GAP * (numColumns - 1)) / numColumns;

  const getColors = (tag?: Dish["tag"]) => {
    switch (tag) {
      case "orange":
        return { bg: "#f59e0b", text: "#1f1300" };
      case "blue":
        return { bg: "#38bdf8", text: "#001018" };
      case "yellow":
        return { bg: "#fde047", text: "#1a1400" };
      default:
        return { bg: "#22c55e", text: "#052b12" }; // green
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
