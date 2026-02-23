import { useRouter } from "expo-router";
import React from "react";
import {
  FlatList,
  ImageBackground,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";

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

  const size = (width - PAD * 2 - GAP * (numColumns - 1)) / numColumns;

  return (
    <ImageBackground
      source={require("../../assets/images/11.jpg")}
      style={styles.bg}
      resizeMode="cover"
    >
      {/* Light transparent overlay */}
      <View style={styles.overlay}>
        {/* ===== Top Bar ===== */}
        <View style={styles.header}>
          <Text style={styles.title}>SMART CAFE • MENU</Text>

          <Pressable
            onPress={() => router.push("/(tabs)/category")}
            style={styles.backBtn}
          >
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
                    encodeURIComponent(item.name)) as any,
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
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  bg: {
    flex: 1,
  },

  // 🌫️ Very light overlay (almost transparent)
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0)",
  },

  header: {
    height: 60,
    backgroundColor: "rgba(0, 0, 0, 0.41)",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    borderBottomWidth: 1, 
    borderBottomColor: "rgba(255,255,255,0.2)",
  },

  title: {
    color: "#d7ff9a",
    fontSize: 18,
    fontWeight: "800",
    letterSpacing: 0.5,
  },

  backBtn: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 10,
    backgroundColor: "rgba(255,255,255,0.15)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.3)",
  },

  backText: {
    color: "#ffffff",
    fontWeight: "700",
    fontSize: 14,
  },

  tile: {
    borderRadius: 16,
    backgroundColor: "rgba(11, 10, 10, 0.62)",
    overflow: "hidden",
    elevation: 6,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.46)",
  },

  cardInner: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 12,
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
    color: "#d7ff9a",
    opacity: 0.9,
  },
});
