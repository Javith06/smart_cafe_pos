import { useRouter } from "expo-router";
import React, { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  ImageBackground,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

import { clearCart, getCart } from "./cartStore";
import { clearOrderContext, getOrderContext } from "./orderContextStore";

export default function PaymentScreen() {
  const router = useRouter();
  const cart = getCart();
  const orderContext = getOrderContext();

  const { width: SCREEN_W, height: SCREEN_H } = Dimensions.get("window");

  /* ================= CALCULATIONS ================= */

  const subtotal = useMemo(
    () => cart.reduce((sum, item) => sum + (item.price || 0) * item.qty, 0),
    [cart],
  );

  const gst = subtotal * 0.09;
  const total = subtotal + gst;

  /* ================= STATE ================= */

  const [selectedMethod, setSelectedMethod] = useState<string | null>(null);

  const [cashInput, setCashInput] = useState<string>("");

  const [isProcessing, setIsProcessing] = useState(false);

  const [isSuccess, setIsSuccess] = useState(false);

  /* ================= GUARD ================= */

  useEffect(() => {
    if (!orderContext || cart.length === 0) {
      router.replace("/(tabs)/category" as any);
    }
  }, [orderContext, cart.length, router]);

  /* ================= CASH LOGIC ================= */

  const paidAmount = parseFloat(cashInput) || 0;

  const change = paidAmount >= total ? paidAmount - total : 0;

  const remaining = paidAmount < total ? total - paidAmount : 0;

  const isCashValid = selectedMethod !== "CASH" || paidAmount >= total;

  /* ================= TENDER SUGGESTIONS ================= */

  const tenderOptions = useMemo(() => {
    const notes = [10, 20, 50, 100, 200, 500, 1000];
    return notes.filter((note) => note >= total);
  }, [total]);

  /* ================= PAYMENT HANDLER ================= */

  const handleConfirm = () => {
    if (!selectedMethod) return;

    if (selectedMethod === "CASH" && paidAmount < total) return;

    setIsProcessing(true);

    setTimeout(() => {
      setIsProcessing(false);
      setIsSuccess(true);

      setTimeout(() => {
        clearCart();
        clearOrderContext();
        router.replace("/(tabs)/category" as any);
      }, 5000);
    }, 2500);
  };

  /* ================= RENDER ================= */

  return (
    <View style={{ flex: 1 }}>
      <ImageBackground
        source={require("../assets/images/11.jpg")}
        style={{ width: SCREEN_W, height: SCREEN_H }}
        resizeMode="cover"
      >
        <View style={styles.overlay}>
          {/* SUCCESS SCREEN */}
          {isSuccess && (
            <View style={styles.centerBox}>
              <Text style={styles.successText}>✅ PAYMENT SUCCESSFUL</Text>
              <Text style={styles.successSub}>Order Completed</Text>
            </View>
          )}

          {/* PROCESSING SCREEN */}
          {isProcessing && (
            <View style={styles.centerBox}>
              <ActivityIndicator size="large" color="#22c55e" />
              <Text style={styles.processingText}>Processing Payment...</Text>
            </View>
          )}

          {!isProcessing && !isSuccess && (
            <>
              {/* ORDER CONTEXT */}
              {orderContext?.orderType === "DINE_IN" && (
                <Text style={styles.contextText}>
                  DINE-IN | {orderContext.section} | Table{" "}
                  {orderContext.tableNo}
                </Text>
              )}

              {orderContext?.orderType === "TAKEAWAY" && (
                <Text style={styles.contextText}>
                  TAKEAWAY | Order {orderContext.takeawayNo}
                </Text>
              )}

              <Text style={styles.totalText}>
                Grand Total: SGD {total.toFixed(2)}
              </Text>

              {/* PAYMENT METHODS */}
              <View style={styles.methodRow}>
                {["CASH", "NETS", "PAYNOW", "CARD"].map((method) => (
                  <Pressable
                    key={method}
                    style={[
                      styles.methodBtn,
                      selectedMethod === method && styles.methodActive,
                    ]}
                    onPress={() => setSelectedMethod(method)}
                  >
                    <Text style={styles.methodText}>{method}</Text>
                  </Pressable>
                ))}
              </View>

              {/* CASH SECTION */}
              {selectedMethod === "CASH" && (
                <View style={styles.cashBox}>
                  <Text style={styles.label}>Customer Pays</Text>

                  <TextInput
                    keyboardType="decimal-pad"
                    value={cashInput}
                    onChangeText={setCashInput}
                    placeholder="0.00"
                    placeholderTextColor="#888"
                    style={styles.input}
                  />

                  {/* Tender Buttons */}
                  <View style={styles.tenderRow}>
                    {tenderOptions.map((amount) => (
                      <Pressable
                        key={amount}
                        style={styles.tenderBtn}
                        onPress={() => setCashInput(amount.toFixed(2))}
                      >
                        <Text style={styles.tenderText}>${amount}</Text>
                      </Pressable>
                    ))}
                  </View>

                  {/* Insufficient Warning */}
                  {paidAmount < total && paidAmount > 0 && (
                    <Text style={styles.errorText}>
                      ⚠ Insufficient Amount{"\n"}
                      Remaining: SGD {remaining.toFixed(2)}
                    </Text>
                  )}

                  {/* Change Display */}
                  {paidAmount >= total && (
                    <Text style={styles.changeText}>
                      Change: SGD {change.toFixed(2)}
                    </Text>
                  )}
                </View>
              )}

              {/* CONFIRM BUTTON */}
              <Pressable
                style={[
                  styles.confirmBtn,
                  (!selectedMethod || !isCashValid) && styles.disabledBtn,
                ]}
                onPress={handleConfirm}
              >
                <Text style={styles.confirmText}>Confirm Payment</Text>
              </Pressable>
            </>
          )}
        </View>
      </ImageBackground>
    </View>
  );
}

/* ================= STYLES ================= */

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    padding: 20,
  },

  contextText: {
    color: "#d7ff9a",
    fontWeight: "800",
    marginBottom: 10,
  },

  totalText: {
    color: "#22c55e",
    fontSize: 20,
    fontWeight: "900",
    marginBottom: 20,
  },

  methodRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginBottom: 20,
  },

  methodBtn: {
    padding: 12,
    backgroundColor: "#333",
    borderRadius: 10,
  },

  methodActive: {
    backgroundColor: "#22c55e",
  },

  methodText: {
    color: "#fff",
    fontWeight: "800",
  },

  cashBox: {
    marginBottom: 20,
  },

  label: {
    color: "#fff",
    marginBottom: 5,
  },

  input: {
    backgroundColor: "#222",
    color: "#fff",
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
  },

  tenderRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginBottom: 10,
  },

  tenderBtn: {
    backgroundColor: "#444",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
  },

  tenderText: {
    color: "#fff",
    fontWeight: "800",
  },

  errorText: {
    color: "#ef4444",
    fontWeight: "800",
  },

  changeText: {
    color: "#22c55e",
    fontWeight: "900",
  },

  confirmBtn: {
    backgroundColor: "#22c55e",
    padding: 15,
    borderRadius: 12,
    alignItems: "center",
  },

  disabledBtn: {
    backgroundColor: "#555",
  },

  confirmText: {
    color: "#052b12",
    fontWeight: "900",
  },

  centerBox: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  processingText: {
    marginTop: 10,
    color: "#fff",
    fontWeight: "700",
  },

  successText: {
    color: "#22c55e",
    fontSize: 22,
    fontWeight: "900",
  },

  successSub: {
    color: "#fff",
    marginTop: 10,
  },
});
