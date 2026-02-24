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

import { addToCartGlobal, getCart, removeFromCartGlobal } from "./cartStore";

export default function CartScreen() {
  const router = useRouter();
  const { width: SCREEN_W, height: SCREEN_H } = Dimensions.get("window");

  const [cart, setCart] = useState(getCart());

  const refreshCart = () => setCart([...getCart()]);

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
            data={cart}
            keyExtractor={(i, index) => i.id + index}
            ListEmptyComponent={
              <Text style={{ color: "#fff", textAlign: "center" }}>
                Cart Empty
              </Text>
            }
            renderItem={({ item }) => (
              <View style={styles.row}>
                <Text style={styles.name}>{item.name}</Text>

                {/* ⭐ CUSTOMIZATIONS */}
                {item.spicy && item.spicy !== "Medium" && (
                  <Text style={styles.sub}>Spicy: {item.spicy}</Text>
                )}

                {item.oil && item.oil !== "Normal" && (
                  <Text style={styles.sub}>Oil: {item.oil}</Text>
                )}

                {item.salt && item.salt !== "Normal" && (
                  <Text style={styles.sub}>Salt: {item.salt}</Text>
                )}

                {/* ⭐ FIXED — sugar display */}
                {item.sugar && item.sugar !== "Normal" && (
                  <Text style={styles.sub}>Sugar: {item.sugar}</Text>
                )}

                {item.note && <Text style={styles.sub}>Note: {item.note}</Text>}

                <Text style={styles.qty}>Qty: {item.qty}</Text>

                {/* + - buttons */}
                <View style={{ flexDirection: "row", gap: 10 }}>
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
            <Text style={{ color: "#fff" }}>Back</Text>
          </Pressable>
        </View>
      </ImageBackground>
    </View>
  );
}

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
    marginTop: 8,
    marginBottom: 8,
    fontWeight: "bold",
  },

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

  btnText: {
    color: "#fff",
    fontWeight: "bold",
  },

  back: {
    marginTop: 20,
    backgroundColor: "rgba(255,255,255,0.2)",
    padding: 15,
    alignItems: "center",
    borderRadius: 10,
  },
});
