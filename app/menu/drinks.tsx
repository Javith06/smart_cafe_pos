import { useFocusEffect, useRouter } from "expo-router";
import React, { useCallback, useMemo, useState } from "react";

import { addToCartGlobal, getCart } from "../cartStore";

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
  { id: "1", name: "THAI KITCHEN", route: "/menu/thai_kitchen", emoji: "🍜" },
  { id: "2", name: "INDIAN KITCHEN", route: "/menu/indian_kitchen", emoji: "🍛" },
  { id: "3", name: "SOUTH INDIAN", route: "/menu/south_indian", emoji: "🥞" },
  { id: "4", name: "WESTERN KITCHEN", route: "/menu/western_kitchen", emoji: "🍔" },
  { id: "5", name: "DRINKS", route: "/menu/drinks", emoji: "🥤" },
];

const ACTIVE_CUISINE = "DRINKS";

/* ================= GROUPS ================= */
const GROUPS = [
  { id: "g1", name: "Cold" },
  { id: "g2", name: "Hot" },
  { id: "g3", name: "Shakes" },
];

/* ================= ITEMS BY GROUP ================= */
const ITEMS_BY_GROUP: Record<string, { id: string; name: string; price: number }[]> = {
  Cold: [
    { id: "c1", name: "Lime Juice", price: 60 },
    { id: "c2", name: "Soft Drink", price: 50 },
  ],
  Hot: [
    { id: "h1", name: "Tea", price: 25 },
    { id: "h2", name: "Coffee", price: 40 },
  ],
  Shakes: [
    { id: "s1", name: "Chocolate Milkshake", price: 120 },
    { id: "s2", name: "Strawberry Milkshake", price: 120 },
  ],
};

export default function Drinks() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const { width: SCREEN_W, height: SCREEN_H } = Dimensions.get("window");

  const numColumns = width >= 1000 ? 5 : width >= 600 ? 4 : 2;
  const GAP = 12;
  const PAD = 16;
  const size = (width - PAD * 2 - GAP * (numColumns - 1)) / numColumns;

  /* Cart */
  const [cart, setCart] = useState(getCart());
  useFocusEffect(
    useCallback(() => {
      setCart([...getCart()]);
    }, []),
  );

  const addToCart = (item: { id: string; name: string }) => {
    addToCartGlobal(item);
    setCart([...getCart()]);
  };

  const totalItems = useMemo(() => cart.reduce((s, i) => s + i.qty, 0), [cart]);

  /* Selected group */
  const [selectedGroup, setSelectedGroup] = useState<string>("Cold");
  const items = ITEMS_BY_GROUP[selectedGroup] || [];

  return (
    <View style={{ flex: 1 }}>
      <ImageBackground
        source={require("../../assets/images/11.jpg")}
        style={{ width: SCREEN_W, height: SCREEN_H }}
      >
        <View style={styles.overlay}>
          {/* ===== HEADER ===== */}
          <View style={styles.header}>
            <Text style={styles.title}>DRINKS</Text>

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
            contentContainerStyle={{ gap: 12, paddingHorizontal: 12, paddingVertical: 10 }}
            renderItem={({ item }) => {
              const active = item.name === ACTIVE_CUISINE;
              return (
                <TouchableOpacity
                  style={[
                    styles.cuisineCard,
                    active ? styles.cuisineActive : styles.cuisineInactive,
                  ]}
                  onPress={() => {
                    if (!active) router.push(item.route as any);
                  }}
                >
                  <Text style={styles.cuisineEmoji}>{item.emoji}</Text>
                  <Text
                    style={[
                      styles.cuisineText,
                      { color: active ? "#052b12" : "#ffffff" },
                    ]}
                    numberOfLines={2}
                  >
                    {item.name}
                  </Text>
                </TouchableOpacity>
              );
            }}
          />

          {/* ===== GROUP BAR ===== */}
          <FlatList
            data={GROUPS}
            horizontal
            keyExtractor={(i) => i.id}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ gap: 10, paddingHorizontal: 12, paddingBottom: 6 }}
            renderItem={({ item }) => {
              const active = item.name === selectedGroup;
              return (
                <TouchableOpacity
                  style={[
                    styles.groupChip,
                    active ? styles.groupActive : styles.groupInactive,
                  ]}
                  onPress={() => setSelectedGroup(item.name)}
                >
                  <Text style={{ color: active ? "#052b12" : "#fff", fontWeight: "800" }}>
                    {item.name}
                  </Text>
                </TouchableOpacity>
              );
            }}
          />

          {/* ===== ITEMS GRID ===== */}
          <FlatList
            data={items}
            numColumns={numColumns}
            key={numColumns + selectedGroup}
            keyExtractor={(i) => i.id}
            columnWrapperStyle={{ gap: GAP }}
            contentContainerStyle={{ gap: GAP, padding: PAD }}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[styles.foodCard, { width: size, height: size * 1.1 }]}
                onPress={() => addToCart(item)}
                activeOpacity={0.85}
              >
                <View style={styles.foodImageBox}>
                  <Text style={{ fontSize: 28 }}>🥤</Text>
                </View>
                <View style={styles.foodInfo}>
                  <Text style={styles.foodName} numberOfLines={2}>
                    {item.name}
                  </Text>
                  <Text style={styles.foodPrice}>₹ {item.price}</Text>
                  <View style={styles.addBtn}>
                    <Text style={styles.addBtnText}>+ Add</Text>
                  </View>
                </View>
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

  cuisineCard: {
    width: 120,
    height: 90,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    padding: 8,
  },

  cuisineActive: {
    backgroundColor: "rgba(34,197,94,0.9)",
    borderColor: "rgba(255,255,255,0.6)",
  },

  cuisineInactive: {
    backgroundColor: "rgba(20,20,20,0.7)",
    borderColor: "rgba(255,255,255,0.25)",
  },

  cuisineEmoji: { fontSize: 26, marginBottom: 4 },

  cuisineText: {
    fontWeight: "800",
    fontSize: 12,
    textAlign: "center",
  },

  groupChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 16,
    borderWidth: 1,
  },

  groupActive: {
    backgroundColor: "rgba(34,197,94,0.9)",
    borderColor: "rgba(255,255,255,0.6)",
  },

  groupInactive: {
    backgroundColor: "rgba(0,0,0,0.6)",
    borderColor: "rgba(255,255,255,0.25)",
  },

  foodCard: {
    borderRadius: 18,
    overflow: "hidden",
    backgroundColor: "rgba(0,0,0,0.75)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.25)",
  },

  foodImageBox: {
    flex: 1,
    backgroundColor: "rgba(255,255,255,0.08)",
    justifyContent: "center",
    alignItems: "center",
  },

  foodInfo: { padding: 10 },

  foodName: {
    color: "#fff",
    fontWeight: "800",
    fontSize: 13,
  },

  foodPrice: {
    color: "#9ef01a",
    fontWeight: "700",
    marginTop: 4,
    fontSize: 12,
  },

  addBtn: {
    marginTop: 8,
    backgroundColor: "rgba(34,197,94,0.9)",
    paddingVertical: 6,
    borderRadius: 10,
    alignItems: "center",
  },

  addBtnText: {
    color: "#052b12",
    fontWeight: "900",
    fontSize: 12,
  },
});