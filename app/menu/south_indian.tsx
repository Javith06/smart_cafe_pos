import { addToCartGlobal, getCart, removeFromCartGlobal } from "../cartStore";

import { useRouter } from "expo-router";
import React, { useMemo, useState } from "react";
import {
  Dimensions,
  FlatList,
  ImageBackground,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";

/* ================= CUISINES ================= */
const CUISINES = [
  { id: "1", name: "THAI KITCHEN", route: "/menu/thai_kitchen" },
  { id: "2", name: "INDIAN KITCHEN", route: "/menu/indian_kitchen" },
  { id: "3", name: "SOUTH INDIAN", route: "/menu/south_indian" },
  { id: "4", name: "WESTERN KITCHEN", route: "/menu/western_kitchen" },
  { id: "5", name: "DRINKS", route: "/menu/drinks" },
];

const ACTIVE_CUISINE = "SOUTH INDIAN";

/* ================= FOODS ================= */
const FOODS = [
  { id: "1", name: "Dosa" },
  { id: "2", name: "Idli" },
  { id: "3", name: "Vada" },
  { id: "4", name: "Pongal" },
];

export default function SouthIndian() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const { width: SCREEN_W, height: SCREEN_H } = Dimensions.get("window");

  const numColumns = width >= 1000 ? 8 : width >= 600 ? 5 : 3;
  const GAP = 12;
  const PAD = 16;
  const size = (width - PAD * 2 - GAP * (numColumns - 1)) / numColumns;

  /* ⭐ FIX 1 — cart stored in state */
  const [cart, setCart] = useState(getCart());

  /* ⭐ FIX 2 — update UI immediately */
  const addToCart = (item: { id: string; name: string }) => {
    addToCartGlobal(item);
    setCart([...getCart()]);
  };

  /* ⭐ FIX 3 — update UI after remove */
  const removeFromCart = (id: string) => {
    removeFromCartGlobal(id);
    setCart([...getCart()]);
  };

  const totalItems = useMemo(() => cart.reduce((s, i) => s + i.qty, 0), [cart]);

  return (
    <View style={{ flex: 1 }}>
      <ImageBackground
        source={require("../../assets/images/11.jpg")}
        style={{ width: SCREEN_W, height: SCREEN_H }}
      >
        <View style={styles.overlay}>
          {/* ===== HEADER ===== */}
          <View style={styles.header}>
            <Text style={styles.title}>SOUTH INDIAN</Text>

            <View style={{ flexDirection: "row", gap: 8 }}>
              <Pressable
                onPress={() => router.replace("/menu/dishes")}
                style={styles.headerBtn}
              >
                <Text style={styles.headerBtnText}>Back</Text>
              </Pressable>

              <Pressable
                onPress={() => router.push("/cart")}
                style={styles.cartBtn}
              >
                <Text style={styles.cartText}>Cart</Text>

                {totalItems > 0 && (
                  <View style={styles.badge}>
                    <Text style={styles.badgeText}>{totalItems}</Text>
                  </View>
                )}
              </Pressable>
            </View>
          </View>

          {/* ===== CUISINE BAR ===== */}
          <FlatList
            data={CUISINES}
            horizontal
            keyExtractor={(i) => i.id}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ gap: 12, padding: 16 }}
            renderItem={({ item }) => {
              const active = item.name === ACTIVE_CUISINE;

              return (
                <TouchableOpacity
                  style={[
                    styles.cuisineTile,
                    {
                      backgroundColor: active
                        ? "rgba(34,197,94,0.7)"
                        : "rgba(50,48,48,0.76)",
                    },
                  ]}
                  onPress={() => {
                    if (!active) router.push(item.route as any);
                  }}
                >
                  <Text style={styles.cuisineText}>{item.name}</Text>
                </TouchableOpacity>
              );
            }}
          />

          {/* ===== FOOD GRID ===== */}
          <FlatList
            data={FOODS}
            numColumns={numColumns}
            key={numColumns}
            keyExtractor={(i) => i.id}
            columnWrapperStyle={{ gap: GAP }}
            contentContainerStyle={{ gap: GAP, padding: PAD }}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[styles.foodTile, { width: size, height: size }]}
                onPress={() => addToCart(item)}
              >
                <Text style={styles.foodText}>{item.name}</Text>
                <Text style={styles.addHint}>Tap to add</Text>
              </TouchableOpacity>
            )}
          />
        </View>
      </ImageBackground>
    </View>
  );
}

/* ================= STYLES ================= */
const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.45)" },

  header: {
    height: 60,
    backgroundColor: "rgba(0,0,0,0.6)",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 12,
  },

  title: { color: "#9ef01a", fontSize: 16, fontWeight: "800" },

  headerBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: "rgba(255,255,255,0.3)",
  },

  headerBtnText: { color: "#fff", fontWeight: "700" },

  cartBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: "rgba(34,197,94,0.8)",
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },

  cartText: { color: "#052b12", fontWeight: "900" },

  badge: {
    minWidth: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: "#ef4444",
    justifyContent: "center",
    alignItems: "center",
  },

  badgeText: { color: "#fff", fontSize: 12, fontWeight: "800" },

  foodTile: {
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#fff",
    backgroundColor: "rgba(0,0,0,0.7)",
  },

  foodText: {
    fontSize: 13,
    fontWeight: "800",
    color: "#fff",
    textAlign: "center",
  },

  addHint: { marginTop: 6, fontSize: 11, color: "#9ef01a" },

  cuisineTile: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.3)",
  },

  cuisineText: {
    color: "#fff",
    fontWeight: "800",
    fontSize: 12,
  },
});
