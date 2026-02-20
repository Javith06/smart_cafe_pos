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

type CartItem = { id: string; name: string; qty: number };

const FOODS = [
  { id: "1", name: "Burger" },
  { id: "2", name: "Pizza" },
  { id: "3", name: "Pasta" },
  { id: "4", name: "French Fries" },
];

export default function WesternKitchen() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const { width: SCREEN_W, height: SCREEN_H } = Dimensions.get("window");

  const numColumns = width >= 1000 ? 8 : width >= 600 ? 5 : 3;
  const GAP = 12;
  const PAD = 16;
  const size = (width - PAD * 2 - GAP * (numColumns - 1)) / numColumns;

  const [cart, setCart] = useState<CartItem[]>([]);
  const [showCart, setShowCart] = useState(false);
  const [flashIds, setFlashIds] = useState<Set<string>>(new Set());

  const addToCart = (item: { id: string; name: string }) => {
    setCart((prev) => {
      const found = prev.find((p) => p.id === item.id);
      if (found)
        return prev.map((p) =>
          p.id === item.id ? { ...p, qty: p.qty + 1 } : p,
        );
      return [...prev, { ...item, qty: 1 }];
    });

    setFlashIds((prev) => new Set(prev).add(item.id));
    setTimeout(() => {
      setFlashIds((prev) => {
        const n = new Set(prev);
        n.delete(item.id);
        return n;
      });
    }, 1000);
  };

  const removeFromCart = (id: string) => {
    setCart((prev) => {
      const found = prev.find((p) => p.id === id);
      if (!found) return prev;
      if (found.qty > 1)
        return prev.map((p) => (p.id === id ? { ...p, qty: p.qty - 1 } : p));
      return prev.filter((p) => p.id !== id);
    });
  };

  const totalItems = useMemo(() => cart.reduce((s, i) => s + i.qty, 0), [cart]);
  const isFlashing = (id: string) => flashIds.has(id);

  return (
    <View style={{ flex: 1 }}>
      <ImageBackground
        source={require("../../assets/images/11.jpg")}
        style={{ width: SCREEN_W, height: SCREEN_H }}
      >
        <View style={styles.overlay}>
          <View style={styles.header}>
            <Text style={styles.title}>
              {showCart ? "YOUR CART" : "WESTERN KITCHEN"}
            </Text>

            <View style={{ flexDirection: "row", gap: 8 }}>
              <Pressable
                onPress={() =>
                  showCart ? setShowCart(false) : router.replace("/menu/dishes")
                }
                style={styles.headerBtn}
              >
                <Text style={styles.headerBtnText}>Back</Text>
              </Pressable>

              <Pressable
                onPress={() => setShowCart((s) => !s)}
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

          {showCart ? (
            <FlatList
              data={cart}
              keyExtractor={(i) => i.id}
              contentContainerStyle={{ padding: PAD, gap: 10 }}
              ListEmptyComponent={
                <Text
                  style={{ color: "#eee", textAlign: "center", marginTop: 40 }}
                >
                  Cart is empty
                </Text>
              }
              renderItem={({ item }) => (
                <View style={styles.cartRow}>
                  <View>
                    <Text style={styles.cartItemText}>{item.name}</Text>
                    <Text style={{ color: "#9ef01a", fontWeight: "800" }}>
                      Qty: {item.qty}
                    </Text>
                  </View>

                  <View style={{ flexDirection: "row", gap: 8 }}>
                    <Pressable
                      onPress={() => addToCart(item)}
                      style={styles.qtyBtnPlus}
                    >
                      <Text style={styles.qtyText}>+</Text>
                    </Pressable>
                    <Pressable
                      onPress={() => removeFromCart(item.id)}
                      style={styles.qtyBtnMinus}
                    >
                      <Text style={styles.qtyText}>−</Text>
                    </Pressable>
                  </View>
                </View>
              )}
            />
          ) : (
            <FlatList
              data={FOODS}
              numColumns={numColumns}
              key={numColumns}
              keyExtractor={(i) => i.id}
              columnWrapperStyle={{ gap: GAP }}
              contentContainerStyle={{ gap: GAP, padding: PAD }}
              renderItem={({ item }) => {
                const flashing = isFlashing(item.id);
                return (
                  <TouchableOpacity
                    style={[
                      styles.foodTile,
                      {
                        width: size,
                        height: size,
                        backgroundColor: flashing
                          ? "rgba(34,197,94,0.9)"
                          : "rgba(0,0,0,0.7)",
                      },
                    ]}
                    onPress={() => addToCart(item)}
                  >
                    <Text style={styles.foodText}>{item.name}</Text>
                    <Text style={styles.addHint}>
                      {flashing ? "Added ✓" : "Tap to add"}
                    </Text>
                  </TouchableOpacity>
                );
              }}
            />
          )}
        </View>
      </ImageBackground>
    </View>
  );
}

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
  },
  foodText: {
    fontSize: 13,
    fontWeight: "800",
    color: "#fff",
    textAlign: "center",
  },
  addHint: { marginTop: 6, fontSize: 11, color: "#9ef01a" },
  cartRow: {
    backgroundColor: "rgba(0,0,0,0.5)",
    borderRadius: 12,
    padding: 12,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  cartItemText: { color: "#fff", fontWeight: "700" },
  qtyBtnPlus: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#22c55e",
    justifyContent: "center",
    alignItems: "center",
  },
  qtyBtnMinus: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#ef4444",
    justifyContent: "center",
    alignItems: "center",
  },
  qtyText: { color: "#fff", fontSize: 20, fontWeight: "900" },
});
