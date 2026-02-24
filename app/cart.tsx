import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Dimensions,
  FlatList,
  ImageBackground,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

/* =========================
   GLOBAL CART (SINGLE FILE)
========================= */
export type CartItem = {
  id: string;
  name: string;
  price: number;
  qty: number;
  spicy?: string;
  oil?: string;
  salt?: string;
  note?: string;
};

let cart: CartItem[] = [];

export const getCart = (): CartItem[] => {
  return cart;
};

export const addToCartGlobal = (item: {
  id: string;
  name: string;
  price: number;
  spicy?: string;
  oil?: string;
  salt?: string;
  note?: string;
}) => {
  const found = cart.find((p) => p.id === item.id);

  if (found) {
    cart = cart.map((p) =>
      p.id === item.id ? { ...p, qty: p.qty + 1 } : p
    );
  } else {
    cart.push({ ...item, qty: 1 });
  }
};

export const removeFromCartGlobal = (id: string) => {
  const found = cart.find((p) => p.id === id);
  if (!found) return;

  if (found.qty > 1) {
    cart = cart.map((p) =>
      p.id === id ? { ...p, qty: p.qty - 1 } : p
    );
  } else {
    cart = cart.filter((p) => p.id !== id);
  }
};

/* =========================
   CART SCREEN
========================= */
export default function CartScreen() {
  const router = useRouter();
  const { width: SCREEN_W, height: SCREEN_H } = Dimensions.get("window");

  const [cartState, setCartState] = useState<CartItem[]>(getCart());

  const refreshCart = () => setCartState([...getCart()]);

  return (
    <View style={{ flex: 1 }}>
      <ImageBackground
        source={require("../assets/images/11.jpg")}
        style={{ width: SCREEN_W, height: SCREEN_H }}
        resizeMode="cover"
      >
        <View style={styles.overlay}>
          <Text style={styles.title}>YOUR CART</Text>

          <FlatList
            data={cartState}
            keyExtractor={(i) => i.id}
            ListEmptyComponent={
              <Text style={{ color: "#fff", textAlign: "center", marginTop: 40 }}>
                Cart Empty
              </Text>
            }
            renderItem={({ item }) => (
              <View style={styles.row}>
                {/* Food Name */}
                <Text style={styles.name}>{item.name}</Text>

                {/* Customize small text */}
                {(item.spicy || item.oil || item.salt || item.note) && (
                  <Text style={{ color: "#aaa", fontSize: 11, marginTop: 2 }}>
                    {item.spicy && `Spicy: ${item.spicy} `}
                    {item.oil && `Oil: ${item.oil} `}
                    {item.salt && `Salt: ${item.salt} `}
                    {item.note && `Note: ${item.note}`}
                  </Text>
                )}

                {/* Qty + Price */}
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    marginTop: 8,
                  }}
                >
                  <Text style={{ color: "#fff", fontWeight: "700" }}>
                    Qty: {item.qty}
                  </Text>
                  <Text style={{ color: "#9ef01a", fontWeight: "700" }}>
                    Price: ₹ {item.price}
                  </Text>
                </View>

                {/* Total */}
                <View
                  style={{
                    borderTopWidth: 1,
                    borderTopColor: "#333",
                    marginTop: 6,
                    paddingTop: 6,
                  }}
                >
                  <Text
                    style={{
                      color: "#22c55e",
                      fontWeight: "900",
                      textAlign: "right",
                    }}
                  >
                    Total: ₹ {item.price * item.qty}
                  </Text>
                </View>

                {/* + / - Buttons */}
                <View style={{ flexDirection: "row", gap: 10, marginTop: 10 }}>
                  <Pressable
                    style={styles.plus}
                    onPress={() => {
                      addToCartGlobal(item);
                      refreshCart();
                    }}
                  >
                    <Text style={styles.btnText}>+</Text>
                  </Pressable>

                  <Pressable
                    style={styles.minus}
                    onPress={() => {
                      removeFromCartGlobal(item.id);
                      refreshCart();
                    }}
                  >
                    <Text style={styles.btnText}>−</Text>
                  </Pressable>
                </View>
              </View>
            )}
          />

          <Pressable style={styles.back} onPress={() => router.back()}>
            <Text style={{ color: "#fff", fontWeight: "800" }}>Back</Text>
          </Pressable>
        </View>
      </ImageBackground>
    </View>
  );
}

/* =========================
   STYLES
========================= */
const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.45)",
    padding: 20,
  },

  title: {
    color: "#9ef01a",
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },

  row: {
    backgroundColor: "rgba(0,0,0,0.6)",
    padding: 15,
    marginBottom: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
  },

  name: { color: "#fff", fontWeight: "bold", fontSize: 14 },

  plus: {
    backgroundColor: "#22c55e",
    padding: 10,
    borderRadius: 8,
  },

  minus: {
    backgroundColor: "#ef4444",
    padding: 10,
    borderRadius: 8,
  },

  btnText: { color: "#fff", fontWeight: "bold", fontSize: 16 },

  back: {
    marginTop: 20,
    backgroundColor: "rgba(255,255,255,0.2)",
    padding: 15,
    alignItems: "center",
    borderRadius: 10,
  },
});