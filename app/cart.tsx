import { useRouter } from "expo-router";
import React, { useMemo, useState } from "react";
import {
  Dimensions,
  FlatList,
  ImageBackground,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

import {
  addToCartGlobal,
  clearCart,
  getCart,
  removeFromCartGlobal,
} from "./cartStore";

export default function CartScreen() {
  const router = useRouter();
  const { width: SCREEN_W, height: SCREEN_H } = Dimensions.get("window");

  const [cart, setCart] = useState(getCart());
  const refreshCart = () => setCart([...getCart()]);

  const subtotal = useMemo(() => {
    return cart.reduce((sum, item) => {
      return sum + (item.price || 0) * item.qty;
    }, 0);
  }, [cart]);

  return (
    <View style={{ flex: 1 }}>
      <ImageBackground
        source={require("../assets/images/11.jpg")}
        style={{ width: SCREEN_W, height: SCREEN_H }}
        resizeMode="cover"
      >
        <View style={styles.overlay}>
          {/* TOP BAR */}
          <View style={styles.topBar}>
            <View style={styles.topRightGroup}>
              <Pressable style={styles.back} onPress={() => router.back()}>
                <Text style={styles.topBtnText}>Back</Text>
              </Pressable>

              <Pressable
                style={styles.clear}
                onPress={() => {
                  clearCart();
                  refreshCart();
                }}
              >
                <Text style={styles.topBtnText}>Clear Cart</Text>
              </Pressable>
            </View>
          </View>

          <Text style={styles.title}>YOUR CART</Text>

          {/* ITEMS */}
          <FlatList
            data={cart}
            keyExtractor={(i, index) => i.id + index}
            ListEmptyComponent={
              <Text style={styles.emptyText}>Cart Empty</Text>
            }
            renderItem={({ item }) => (
              <View style={styles.row}>
                {/* LEFT SIDE */}
                <View style={{ flex: 1 }}>
                  <Text style={styles.name}>{item.name}</Text>

                  {item.spicy && item.spicy !== "Medium" && (
                    <Text style={styles.sub}>Spicy: {item.spicy}</Text>
                  )}

                  {item.oil && item.oil !== "Normal" && (
                    <Text style={styles.sub}>Oil: {item.oil}</Text>
                  )}

                  {item.salt && item.salt !== "Normal" && (
                    <Text style={styles.sub}>Salt: {item.salt}</Text>
                  )}

                  {item.sugar && item.sugar !== "Normal" && (
                    <Text style={styles.sub}>Sugar: {item.sugar}</Text>
                  )}

                  {item.note && (
                    <Text style={styles.sub}>Note: {item.note}</Text>
                  )}

                  <Text style={styles.qty}>Qty: {item.qty}</Text>

                  <Text style={styles.price}>
                    $ {(item.price || 0).toFixed(2)}
                  </Text>
                </View>

                {/* RIGHT SIDE BUTTONS */}
                <View style={styles.actionRow}>
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

          <View style={styles.divider} />

          {/* SUBTOTAL */}
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Subtotal</Text>
            <Text style={styles.summaryValue}>$ {subtotal.toFixed(2)}</Text>
          </View>

          <View style={styles.divider} />

          {/* PROCEED BUTTON */}
          <Pressable
            style={styles.proceedBtn}
            onPress={() => console.log("Proceed clicked")}
          >
            <Text style={styles.proceedText}>Proceed to Payment</Text>
          </Pressable>
        </View>
      </ImageBackground>
    </View>
  );
}

/* ================= STYLES ================= */

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    padding: 20,
  },

  topBar: {
    flexDirection: "row",
    justifyContent: "flex-end",
  },

  topRightGroup: {
    flexDirection: "row",
    gap: 10,
  },

  back: {
    backgroundColor: "rgba(255,255,255,0.3)",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },

  clear: {
    backgroundColor: "#ef4444",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },

  topBtnText: {
    color: "#fff",
    fontWeight: "700",
  },

  title: {
    color: "#9ef01a",
    fontSize: 22,
    fontWeight: "bold",
    marginVertical: 15,
  },

  emptyText: {
    color: "#fff",
    textAlign: "center",
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.75)",
    padding: 15,
    marginBottom: 12,
    borderRadius: 12,
  },

  name: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },

  sub: {
    color: "#ccc",
    marginTop: 2,
  },

  qty: {
    color: "#9ef01a",
    marginTop: 6,
    fontWeight: "bold",
  },

  price: {
    color: "#fff",
    marginTop: 4,
    fontWeight: "700",
  },

  actionRow: {
    flexDirection: "row",
    gap: 10,
    alignItems: "center",
  },

  plus: {
    backgroundColor: "#22c55e",
    width: 45,
    height: 45,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },

  minus: {
    backgroundColor: "#ef4444",
    width: 45,
    height: 45,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },

  btnText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 18,
  },

  divider: {
    height: 1,
    backgroundColor: "rgba(255,255,255,0.2)",
    marginVertical: 15,
  },

  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  summaryLabel: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },

  summaryValue: {
    color: "#9ef01a",
    fontSize: 16,
    fontWeight: "900",
  },

  proceedBtn: {
    backgroundColor: "#22c55e",
    padding: 15,
    borderRadius: 12,
    alignItems: "center",
  },

  proceedText: {
    color: "#052b12",
    fontWeight: "900",
    fontSize: 16,
  },
});
