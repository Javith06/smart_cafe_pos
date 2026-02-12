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

  const numColumns = width >= 1000 ? 8 : width >= 600 ? 5 : 3;
  const GAP = 12;
  const PAD = 16;

  const size =
    (width - PAD * 2 - GAP * (numColumns - 1)) / numColumns;

  return (
    <View style={styles.screen}>
      {/* ===== Top Bar ===== */}
      <View style={styles.header}>
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
            activeOpacity={0.85}
          >
            <View style={styles.cardInner}>
              <Text style={styles.text}>{item.name}</Text>
              <Text style={styles.subText}>Tap to open</Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#0e0f13", // modern dark background
  },

  header: {
    height: 60,
    backgroundColor: "#14161c",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.08)",
  },

  title: {
    color: "#9ef01a",
    fontSize: 18,
    fontWeight: "800",
    letterSpacing: 0.5,
  },

  backBtn: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 10,
    backgroundColor: "rgba(255,255,255,0.1)",
  },

  backText: {
    color: "#ffffff",
    fontWeight: "700",
    fontSize: 14,
  },

  tile: {
    borderRadius: 16,
    backgroundColor: "#1b1f2a",
    overflow: "hidden",
    elevation: 6, // Android shadow
    shadowColor: "#000", // iOS shadow
    shadowOpacity: 0.3,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
  },

  cardInner: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 12,
    backgroundColor: "rgba(255,255,255,0.03)",
  },

  text: {
    fontWeight: "800",
    color: "#ffffff",
    textAlign: "center",
    fontSize: 14,
    letterSpacing: 0.5,
  },

  subText: {
    marginTop: 6,
    fontSize: 11,
    color: "#9ef01a",
    opacity: 0.9,
  },
});
