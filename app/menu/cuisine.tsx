import React from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  useWindowDimensions,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";

/* =====================
   DATA
===================== */

const CUISINES = [
  { id: "1", name: "THAI KITCHEN", route: "/menu/thai_kitchen" },
  { id: "2", name: "INDIAN KITCHEN", route: "/menu/indian_kitchen" },
  { id: "3", name: "SOUTH INDIAN", route: "/menu/south_indian" },
  { id: "4", name: "WESTERN KITCHEN", route: "/menu/western_kitchen" },
  { id: "5", name: "DRINKS", route: "/menu/drinks" },
];

const FOOD_BY_CUISINE: Record<string, { id: string; name: string }[]> = {
  "THAI KITCHEN": [
    { id: "1", name: "Tomyam Seafood (S)" },
    { id: "2", name: "Tomyam Chicken (L)" },
    { id: "3", name: "OX Tail (S)" },
    { id: "4", name: "Thai Fried Chicken" },
  ],

  "INDIAN KITCHEN": [
    { id: "5", name: "Butter Chicken" },
    { id: "6", name: "Paneer Butter Masala" },
    { id: "7", name: "Dal Tadka" },
  ],

  "SOUTH INDIAN": [
    { id: "8", name: "Dosa" },
    { id: "9", name: "Idli" },
    { id: "10", name: "Vada" },
  ],

  "WESTERN KITCHEN": [
    { id: "11", name: "Burger" },
    { id: "12", name: "Pasta" },
    { id: "13", name: "Pizza" },
  ],

  DRINKS: [
    { id: "14", name: "Lime Juice" },
    { id: "15", name: "Cold Coffee" },
    { id: "16", name: "Milkshake" },
  ],
};

/* =====================
   SCREEN
===================== */

export default function CuisineScreen() {
  const { activeCuisine } = useLocalSearchParams<{ activeCuisine?: string }>();
  const router = useRouter();
  const { width } = useWindowDimensions();

  const cuisineName = activeCuisine ?? "THAI KITCHEN";
  const foods = FOOD_BY_CUISINE[cuisineName] ?? [];

  const numColumns = width >= 1000 ? 8 : 5;
  const GAP = 10;
  const PAD = 16;

  const size =
    (width - PAD * 2 - GAP * (numColumns - 1)) / numColumns;

  return (
    <View style={styles.screen}>
      {/* =====================
          CUISINE BAR
      ===================== */}
      <FlatList
        data={CUISINES}
        horizontal
        keyExtractor={(i) => i.id}
        contentContainerStyle={{ gap: GAP, padding: PAD }}
        renderItem={({ item }) => {
          const active = item.name === cuisineName;

          return (
            <TouchableOpacity
              style={[
                styles.tile,
                {
                  width: size * 0.7,
                  height: size * 0.7,
                  backgroundColor: active ? "#f59e0b" : "#8fc221",
                },
              ]}
              onPress={() => {
                if (!active) {
                  router.push(
                    (item.route +
                      "?activeCuisine=" +
                      encodeURIComponent(item.name)) as any
                  );
                }
              }}
            >
              <Text style={styles.tileText}>{item.name}</Text>
            </TouchableOpacity>
          );
        }}
      />

      {/* =====================
          FOOD GRID
      ===================== */}
      <FlatList
        data={foods}
        numColumns={numColumns}
        key={numColumns}
        keyExtractor={(i) => i.id}
        columnWrapperStyle={{ gap: GAP }}
        contentContainerStyle={{
          gap: GAP,
          padding: PAD,
          paddingBottom: 30,
        }}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[
              styles.tile,
              {
                width: size,
                height: size,
                backgroundColor: "#fb923c",
              },
            ]}
          >
            <Text style={styles.tileText}>{item.name}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

/* =====================
   STYLES
===================== */

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#0b120b",
  },
  tile: {
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    elevation: 4,
  },
  tileText: {
    fontSize: 12,
    fontWeight: "800",
    color: "#052b12",
    textAlign: "center",
    paddingHorizontal: 6,
  },
});
