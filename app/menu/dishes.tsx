import React from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  useWindowDimensions,
  Pressable,
} from "react-native";
import { useRouter } from "expo-router";

type Dish = {
  id: string;
  name: string;
  route: string;
};

const DISHES: Dish[] = [
  { id: "1", name: "THAI KITCHEN", route: "/menu/thai_kitchen" },
  { id: "2", name: "INDIAN KITCHEN", route: "/menu/indian_kitchen" },
  { id: "3", name: "SOUTH INDIAN", route: "/menu/south_indian" },
  { id: "4", name: "WESTERN KITCHEN", route: "/menu/western_kitchen" },
  { id: "5", name: "DRINKS", route: "/menu/drinks" },
];

export default function Dishes() {
  const router = useRouter();
  const { width } = useWindowDimensions();

  const numColumns = width >= 1000 ? 8 : 5;
  const GAP = 10;
  const PAD = 16;

  const size =
    (width - PAD * 2 - GAP * (numColumns - 1)) / numColumns;

  return (
    <View style={styles.screen}>
      {/* ===== Top Bar ===== */}
      <View style={styles.header}>
        <View style={{ width: 60 }} />

        <Text style={styles.title}>SMART CAFE • MENU</Text>

        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <Text style={styles.backText}>Back</Text>
        </Pressable>
      </View>

      <FlatList
        data={DISHES}
        numColumns={numColumns}
        key={numColumns}
        keyExtractor={(i) => i.id}
        columnWrapperStyle={{ gap: GAP }}
        contentContainerStyle={{ gap: GAP, padding: PAD }}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[styles.tile, { width: size, height: size }]}
            onPress={() =>
              router.push(
                (item.route +
                  "?activeCuisine=" +
                  encodeURIComponent(item.name)) as any
              )
            }
          >
            <Text style={styles.text}>{item.name}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#0b120b" },

  header: {
    height: 56,
    backgroundColor: "#1f2933",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
  },

  title: {
    color: "#97bc49",
    fontSize: 18,
    fontWeight: "700",
  },

  backBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: "rgba(255,255,255,0.15)",
  },

  backText: {
    color: "#ffffff",
    fontWeight: "700",
    fontSize: 14,
  },

  tile: {
    backgroundColor: "#8fc221",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    elevation: 4,
  },

  text: {
    fontWeight: "800",
    color: "#052b12",
    textAlign: "center",
  },
});
