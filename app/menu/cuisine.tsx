import React, { useEffect, useMemo, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  useWindowDimensions,
  Pressable,
  ImageBackground,
  Dimensions,
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

type CartItem = { id: string; name: string; qty: number };

export default function CuisineScreen() {
  const params = useLocalSearchParams<{
    activeCuisine?: string;
    cart?: string;
  }>();
  const router = useRouter();
  const { width } = useWindowDimensions();
  const { width: SCREEN_W, height: SCREEN_H } = Dimensions.get("window");

  const cuisineName = params.activeCuisine ?? "THAI KITCHEN";
  const foods = FOOD_BY_CUISINE[cuisineName] ?? [];

  const numColumns = width >= 1000 ? 8 : width >= 600 ? 5 : 3;
  const GAP = 12;
  const PAD = 16;

  const size =
    (width - PAD * 2 - GAP * (numColumns - 1)) / numColumns;

  // ===== CART STATE (PERSIST FROM PARAMS) =====
  const [cart, setCart] = useState<CartItem[]>([]);
  const [showCart, setShowCart] = useState(false);

  // ===== FLASH STATE (1 sec highlight) =====
  const [flashIds, setFlashIds] = useState<Set<string>>(new Set());

  // Load cart from params when screen loads
  useEffect(() => {
    if (params.cart) {
      try {
        const parsed = JSON.parse(params.cart as string) as CartItem[];
        setCart(parsed);
      } catch {
        // ignore parse error
      }
    }
  }, [params.cart]);

  const addToCart = (item: { id: string; name: string }) => {
    setCart((prev) => {
      const found = prev.find((p) => p.id === item.id);
      if (found) {
        return prev.map((p) =>
          p.id === item.id ? { ...p, qty: p.qty + 1 } : p
        );
      }
      return [...prev, { ...item, qty: 1 }];
    });

    // 🔥 Flash effect for 1 second
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

      if (found.qty > 1) {
        return prev.map((p) =>
          p.id === id ? { ...p, qty: p.qty - 1 } : p
        );
      }
      return prev.filter((p) => p.id !== id);
    });
  };

  const totalItems = useMemo(
    () => cart.reduce((s, i) => s + i.qty, 0),
    [cart]
  );

  const isFlashing = (id: string) => flashIds.has(id);

  return (
    <View style={{ flex: 1 }}>
      <ImageBackground
        source={require("../../assets/images/11.jpg")}
        style={{ width: SCREEN_W, height: SCREEN_H }}
        resizeMode="cover"
      >
        <View style={styles.overlay}>
          {/* =====================
              TOP BAR
          ===================== */}
          <View style={styles.header}>
            <Text style={styles.title}>
              {showCart ? "YOUR CART" : cuisineName}
            </Text>

            <View style={{ flexDirection: "row", gap: 8 }}>
              <Pressable
                onPress={() => {
                  if (showCart) {
                    setShowCart(false);
                  } else {
                    // 🔁 Always go back to Dishes screen
                    router.replace("/menu/dishes");
                  }
                }}
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

          {/* =====================
              CART VIEW
          ===================== */}
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
            <>
              {/* =====================
                  CUISINE BAR
              ===================== */}
              <FlatList
                data={CUISINES}
                horizontal
                keyExtractor={(i) => i.id}
                contentContainerStyle={{ gap: GAP, padding: PAD }}
                showsHorizontalScrollIndicator={false}
                renderItem={({ item }) => {
                  const active = item.name === cuisineName;

                  return (
                    <TouchableOpacity
                      style={[
                        styles.cuisineTile,
                        {
                          width: size * 0.8,
                          height: size * 0.6,
                          backgroundColor: active
                            ? "rgba(34,197,94,0.7)"
                            : "rgba(50, 48, 48, 0.76)",
                        },
                      ]}
                      onPress={() => {
                        if (!active) {
                          router.push({
                            pathname: item.route,
                            params: {
                              activeCuisine: item.name,
                              cart: JSON.stringify(cart), // pass cart
                            },
                          } as any);
                        }
                      }}
                    >
                      <Text style={styles.cuisineText}>{item.name}</Text>
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
                  paddingBottom: 40,
                }}
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
                            : "rgba(0, 0, 0, 0.71)",
                        },
                      ]}
                      activeOpacity={0.85}
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
            </>
          )}
        </View>
      </ImageBackground>
    </View>
  );
}

/* =====================
   STYLES
===================== */

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.45)",
  },

  header: {
    height: 60,
    backgroundColor: "rgba(0,0,0,0.6)",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.2)",
  },

  title: {
    color: "#9ef01a",
    fontSize: 16,
    fontWeight: "800",
  },

  headerBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: "rgba(255, 255, 255, 0.64)",
  },

  headerBtnText: {
    color: "#fff",
    fontWeight: "700",
  },

  cartBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: "rgba(34,197,94,0.8)",
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },

  cartText: {
    color: "#052b12",
    fontWeight: "900",
  },

  badge: {
    minWidth: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: "#ef4444",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 5,
  },

  badgeText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "800",
  },

  cuisineTile: {
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
    elevation: 4,
    borderWidth: 1,
    borderColor: "rgba(23, 16, 16, 0.44)",
  },

  cuisineText: {
    fontSize: 12,
    fontWeight: "800",
    textAlign: "center",
    color: "#fff",
    paddingHorizontal: 6,
  },

  foodTile: {
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    elevation: 6,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.67)",
  },

  foodText: {
    fontSize: 13,
    fontWeight: "800",
    color: "#ffffff",
    textAlign: "center",
    paddingHorizontal: 8,
  },

  addHint: {
    marginTop: 6,
    fontSize: 11,
    color: "#9ef01a",
  },

  cartRow: {
    backgroundColor: "rgba(0,0,0,0.5)",
    borderRadius: 12,
    padding: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.25)",
  },

  cartItemText: {
    color: "#fff",
    fontWeight: "700",
  },

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

  qtyText: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "900",
  },
});
