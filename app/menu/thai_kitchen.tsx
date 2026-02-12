import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  useWindowDimensions,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";

/* =========================
   TYPES
========================= */
type Cuisine = {
  id: string;
  name: string;
};

type ThaiCategory = {
  id: string;
  name: string;
};

type ThaiFood = {
  id: string;
  name: string;
  category: string;
};

/* =========================
   DATA
========================= */

// Top cuisine row
const CUISINES: Cuisine[] = [
  { id: "1", name: "THAI KITCHEN" },
  { id: "2", name: "INDIAN KITCHEN" },
  { id: "3", name: "SOUTH INDIAN" },
  { id: "4", name: "WESTERN KITCHEN" },
  { id: "5", name: "DRINKS" },
];

// Thai category row
const THAI_CATEGORIES: ThaiCategory[] = [
  { id: "1", name: "SOUP" },
  { id: "2", name: "THAI VEG" },
  { id: "3", name: "DISHES" },
  { id: "4", name: "FISHES" },
  { id: "5", name: "OMELETTE" },
  { id: "6", name: "NOODLES" },
  { id: "7", name: "STEAM RICE" },
  { id: "8", name: "FRIED RICE" },
];

// Thai food grid
const THAI_FOODS: ThaiFood[] = [
  { id: "1", name: "Tomyam Seafood (S)", category: "SOUP" },
  { id: "2", name: "Tomyam Seafood (L)", category: "SOUP" },
  { id: "3", name: "Tomyam Chicken (S)", category: "SOUP" },
  { id: "4", name: "Tomyam Chicken (L)", category: "SOUP" },
  { id: "5", name: "Tomyam Beef (S)", category: "SOUP" },
  { id: "6", name: "Tomyam Beef (L)", category: "SOUP" },

  { id: "7", name: "OX Tail (S)", category: "DISHES" },
  { id: "8", name: "OX Tail (L)", category: "DISHES" },
  { id: "9", name: "Thai Fried Chicken", category: "DISHES" },

  { id: "10", name: "Fish Soup (S)", category: "SOUP" },
  { id: "11", name: "Fish Soup (L)", category: "SOUP" },

  { id: "12", name: "Steam Rice", category: "STEAM RICE" },
  { id: "13", name: "Fried Rice", category: "FRIED RICE" },

  { id: "14", name: "Tomyam Fish (S)", category: "FISHES" },
  { id: "15", name: "Tomyam Fish (L)", category: "FISHES" },
];

/* =========================
   SCREEN
========================= */

export default function ThaiKitchen() {
  const { activeCuisine } = useLocalSearchParams<{ activeCuisine?: string }>();
  const router = useRouter();
  const { width, height } = useWindowDimensions();

  const [selectedCategory, setSelectedCategory] = useState("SOUP");

  const isLandscape = width > height;

  let numColumns = 5;
  if (isLandscape && width < 1000) numColumns = 6;
  if (width >= 1000) numColumns = 8;

  const GAP = 10;
  const SCREEN_PADDING = 16;

  const itemSize =
    (width - SCREEN_PADDING * 2 - GAP * (numColumns - 1)) / numColumns;

  /* =========================
     RENDERS
  ========================= */

  const renderCuisine = ({ item }: { item: Cuisine }) => {
    const active = item.name === activeCuisine;

    return (
      <TouchableOpacity
style={[
  styles.tile,
  {
    width: itemSize * 0.7,
    height: itemSize * 0.7,
    backgroundColor: active ? "#f59e0b" : "#8fc221",
  },
]}

        onPress={() => {
          if (item.name !== "THAI KITCHEN") router.back();
        }}
      >
        <Text style={styles.tileText}>{item.name}</Text>
      </TouchableOpacity>
    );
  };

  const renderCategory = ({ item }: { item: ThaiCategory }) => {
    const active = selectedCategory === item.name;

    return (
      <TouchableOpacity
        style={[
          styles.tile,
          {
            width: itemSize * 0.9,
            height: itemSize * 0.6,
            backgroundColor: active ? "#f59e0b" : "#8fc221",
          },
        ]}
        onPress={() => setSelectedCategory(item.name)}
      >
        <Text style={styles.tileText}>{item.name}</Text>
      </TouchableOpacity>
    );
  };

  const renderFood = ({ item }: { item: ThaiFood }) => (
    <TouchableOpacity
      style={[
        styles.tile,
        {
          width: itemSize,
          height: itemSize,
          backgroundColor: "#fb923c",
        },
      ]}
    >
      <Text style={styles.tileText}>{item.name}</Text>
    </TouchableOpacity>
  );

  /* =========================
     UI
  ========================= */

  return (
    <View style={styles.screen}>
      {/* Header */}
      <View style={styles.headerBar}>
        <Text style={styles.headerTitle}>SMART CAFE • THAI KITCHEN</Text>
        <TouchableOpacity style={styles.backBtn} onPress={router.back}>
          <Text style={styles.backText}>Back</Text>
        </TouchableOpacity>
      </View>

      {/* Cuisine row */}
      <FlatList
        data={CUISINES}
        horizontal
        keyExtractor={(i) => i.id}
        contentContainerStyle={{ gap: GAP, padding: SCREEN_PADDING }}
        renderItem={renderCuisine}
      />

      {/* Thai category row */}
      <FlatList
        data={THAI_CATEGORIES}
        horizontal
        keyExtractor={(i) => i.id}
        contentContainerStyle={{ gap: GAP, paddingHorizontal: SCREEN_PADDING }}
        renderItem={renderCategory}
      />

      {/* Thai food grid */}
      <FlatList
        data={THAI_FOODS.filter(
          (f) => f.category === selectedCategory
        )}
        key={numColumns}
        numColumns={numColumns}
        keyExtractor={(i) => i.id}
        columnWrapperStyle={{ gap: GAP }}
        contentContainerStyle={{
          gap: GAP,
          padding: SCREEN_PADDING,
          paddingBottom: 30,
        }}
        renderItem={renderFood}
      />
    </View>
  );
}

/* =========================
   STYLES
========================= */

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
    color: "#fbbf24",
    fontSize: 18,
    fontWeight: "700",
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
  tile: {
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    elevation: 4,
  },
  tileText: {
    fontSize: 13,
    fontWeight: "800",
    color: "#052b12",
    textAlign: "center",
    paddingHorizontal: 6,
  },
});
