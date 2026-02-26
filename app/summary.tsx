import { useRouter } from "expo-router";
import React, { useMemo } from "react";
import {
  Dimensions,
  FlatList,
  ImageBackground,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { getCart } from "./cartStore";
import { getOrderContext } from "./orderContextStore";

export default function SummaryScreen() {
  const router = useRouter();
  const orderContext = getOrderContext();
  const cart = getCart();

  const { width: SCREEN_W, height: SCREEN_H } = Dimensions.get("window");

  /* ================= CALCULATIONS ================= */

  const totalItems = useMemo(
    () => cart.reduce((sum, item) => sum + item.qty, 0),
    [cart],
  );

  const subtotal = useMemo(
    () => cart.reduce((sum, item) => sum + (item.price || 0) * item.qty, 0),
    [cart],
  );

  const GST_RATE = 0.09;
  const gst = subtotal * GST_RATE;
  const grandTotal = subtotal + gst;

  /* ================= GUARD ================= */

  if (!orderContext || cart.length === 0) {
    router.replace("/(tabs)/category" as any);
    return null;
  }

  /* ================= UI ================= */

  return (
    <View style={{ flex: 1 }}>
      <ImageBackground
        source={require("../assets/images/11.jpg")}
        style={{ width: SCREEN_W, height: SCREEN_H }}
        resizeMode="cover"
      >
        <View style={styles.overlay}>
          {/* Top Bar */}
          <View style={styles.topBar}>
            <Pressable style={styles.back} onPress={() => router.back()}>
              <Text style={styles.topBtnText}>Back</Text>
            </Pressable>
          </View>

          {/* Order Info */}
          {orderContext.orderType === "DINE_IN" && (
            <Text style={styles.contextText}>
              DINE-IN | {orderContext.section} | Table {orderContext.tableNo}
            </Text>
          )}

          {orderContext.orderType === "TAKEAWAY" && (
            <Text style={styles.contextText}>
              TAKEAWAY | Order {orderContext.takeawayNo}
            </Text>
          )}

          <Text style={styles.title}>ORDER SUMMARY</Text>

          {/* Items */}
          <FlatList
            data={cart}
            keyExtractor={(item, index) => item.id + index}
            renderItem={({ item }) => (
              <View style={styles.row}>
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
                </View>

                <Text style={styles.price}>
                  SGD {((item.price || 0) * item.qty).toFixed(2)}
                </Text>
              </View>
            )}
          />

          <View style={styles.divider} />

          {/* Totals */}
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Total Items</Text>
            <Text style={styles.summaryValue}>{totalItems}</Text>
          </View>

          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Subtotal</Text>
            <Text style={styles.summaryValue}>SGD {subtotal.toFixed(2)}</Text>
          </View>

          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>GST (9%)</Text>
            <Text style={styles.summaryValue}>SGD {gst.toFixed(2)}</Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.summaryRow}>
            <Text style={styles.grandLabel}>Grand Total</Text>
            <Text style={styles.grandValue}>SGD {grandTotal.toFixed(2)}</Text>
          </View>

          <View style={styles.divider} />

          {/* Proceed */}
          <Pressable
            style={styles.proceedBtn}
            onPress={() => router.push("/payment" as any)}
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
    justifyContent: "flex-start",
  },

  back: {
    backgroundColor: "rgba(255,255,255,0.3)",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },

  topBtnText: {
    color: "#fff",
    fontWeight: "700",
  },

  contextText: {
    color: "#d7ff9a",
    marginTop: 10,
    marginBottom: 8,
    fontWeight: "800",
  },

  title: {
    color: "#9ef01a",
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 15,
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "rgba(0,0,0,0.75)",
    padding: 12,
    borderRadius: 12,
    marginBottom: 10,
  },

  name: {
    color: "#fff",
    fontWeight: "bold",
  },

  sub: {
    color: "#ccc",
    fontSize: 12,
    marginTop: 2,
  },

  qty: {
    color: "#9ef01a",
    marginTop: 6,
    fontWeight: "bold",
  },

  price: {
    color: "#fff",
    fontWeight: "bold",
  },

  divider: {
    height: 1,
    backgroundColor: "rgba(255,255,255,0.2)",
    marginVertical: 15,
  },

  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },

  summaryLabel: {
    color: "#fff",
    fontWeight: "700",
  },

  summaryValue: {
    color: "#9ef01a",
    fontWeight: "900",
  },

  grandLabel: {
    color: "#fff",
    fontWeight: "900",
    fontSize: 18,
  },

  grandValue: {
    color: "#22c55e",
    fontWeight: "900",
    fontSize: 18,
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
