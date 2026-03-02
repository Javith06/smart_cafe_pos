import { useFocusEffect, useRouter } from "expo-router";
import React, { useCallback, useMemo, useRef, useState } from "react";
import { addToCartGlobal, getCart } from "../cartStore";
import { getOrderContext } from "../orderContextStore";

import {
  FlatList,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";

/* ================= KITCHENS ================= */
const KITCHENS = [
  { id: "k1", name: "THAI KITCHEN", route: "/menu/thai_kitchen", icon: "🍜" },
  {
    id: "k2",
    name: "INDIAN KITCHEN",
    route: "/menu/indian_kitchen",
    icon: "🍛",
  },
  { id: "k3", name: "SOUTH INDIAN", route: "/menu/south_indian", icon: "🥞" },
  {
    id: "k4",
    name: "WESTERN KITCHEN",
    route: "/menu/western_kitchen",
    icon: "🍔",
  },
  { id: "k5", name: "DRINKS", route: "/menu/drinks", icon: "🥤" },
];

const ACTIVE_KITCHEN = "DRINKS";

/* ================= GROUPS ================= */
const GROUPS = [
  { id: "g1", name: "Smoothies" },
  { id: "g2", name: "Local Favourite" },
  { id: "g3", name: "Lassi" },
  { id: "g4", name: "Milk Shake" },
  { id: "g5", name: "Hot Beverages" },
  { id: "g6", name: "Ice Cream" },
  { id: "g7", name: "Cold Beverages" },
  { id: "g8", name: "Fruit Juices" },
  { id: "g9", name: "Sodas" },
];

/* ================= ITEMS ================= */
const ITEMS_BY_GROUP: Record<string, DrinkItem[]> = {
  Smoothies: [
    { id: "sm_1", name: "Apple Smoothie", price: 160 },
    { id: "sm_2", name: "Pineapple Smoothie", price: 160 },
    { id: "sm_3", name: "Kiwi Smoothie", price: 160 },
    { id: "sm_4", name: "Orange Smoothie", price: 160 },
    { id: "sm_5", name: "Rambutan Smoothie", price: 160 },
    { id: "sm_6", name: "Lychee Smoothie", price: 160 },
    { id: "sm_7", name: "Longan Smoothie", price: 160 },
    { id: "sm_8", name: "Blue Lime Smoothie", price: 160 },
    { id: "sm_9", name: "Soursop Smoothie", price: 160 },
  ],

  "Local Favourite": [
    { id: "lf_1", name: "Milo Dinosaur", price: 180 },
    { id: "lf_2", name: "M.Godzilla", price: 200 },
    { id: "lf_3", name: "Root Beer Float", price: 180 },
    { id: "lf_4", name: "TO Ice Longan", price: 170 },
    { id: "lf_5", name: "TO Ice Lychee", price: 170 },
    { id: "lf_6", name: "Blueberry Ice Longan", price: 180 },
    { id: "lf_7", name: "Blueberry Ice Lychee", price: 180 },
    { id: "lf_8", name: "Syrup Ice Longan", price: 160 },
    { id: "lf_9", name: "Syrup Ice Lychee", price: 160 },
    { id: "lf_10", name: "Lime Sour Plum", price: 150 },
    { id: "lf_11", name: "Super Cooler", price: 190 },
    { id: "lf_12", name: "TOA Honey", price: 160 },
    { id: "lf_13", name: "Chendol", price: 170 },
    { id: "lf_14", name: "ABC", price: 170 },
    { id: "lf_15", name: "Air Kathira", price: 160 },
    { id: "lf_16", name: "Kathira @ $10 3 Bottles", price: 250 },
  ],

  Lassi: [
    { id: "ls_1", name: "Plain Lassi", price: 150 },
    { id: "ls_2", name: "Mango Lassi", price: 160 },
    { id: "ls_3", name: "Strawberry Lassi", price: 160 },
    { id: "ls_4", name: "Blackcurrant Lassi", price: 160 },
  ],

  "Milk Shake": [
    { id: "ms_1", name: "Banana Shake", price: 170 },
    { id: "ms_2", name: "Sweet Corn Shake", price: 170 },
    { id: "ms_3", name: "Strawberry Shake", price: 170 },
    { id: "ms_4", name: "Chocolate Shake", price: 170 },
    { id: "ms_5", name: "Vanilla Shake", price: 170 },
    { id: "ms_6", name: "Kiwi Shake", price: 170 },
    { id: "ms_7", name: "Apple Shake", price: 170 },
    { id: "ms_8", name: "Mango Shake", price: 170 },
    { id: "ms_9", name: "Orange Shake", price: 170 },
    { id: "ms_10", name: "Yam Shake", price: 180 },
    { id: "ms_11", name: "Mocha Shake", price: 180 },
    { id: "ms_12", name: "Latte Shake", price: 180 },
    { id: "ms_13", name: "Oreo Shake", price: 190 },
    { id: "ms_14", name: "Avocado Shake", price: 190 },
    { id: "ms_15", name: "Durian Shake", price: 200 },
    { id: "ms_16", name: "Cookie Shake", price: 180 },
    { id: "ms_17", name: "Dates Shake", price: 180 },
    { id: "ms_18", name: "Coconut Shake", price: 170 },
  ],

  "Hot Beverages": [
    { id: "hb_1", name: "Tea", price: 60 },
    { id: "hb_2", name: "Coffee", price: 70 },
    { id: "hb_3", name: "Nescafe", price: 80 },
    { id: "hb_4", name: "Milo", price: 90 },
    { id: "hb_5", name: "Horlicks", price: 90 },
    { id: "hb_6", name: "Hot Chocolate", price: 100 },
    { id: "hb_7", name: "Tea O", price: 60 },
    { id: "hb_8", name: "Coffee O", price: 70 },
    { id: "hb_9", name: "Ginger Tea", price: 70 },
    { id: "hb_10", name: "Green Lime", price: 70 },
    { id: "hb_11", name: "Tea O Lime", price: 75 },
    { id: "hb_12", name: "Halia O Panas", price: 75 },
    { id: "hb_13", name: "Susu Halia", price: 85 },
    { id: "hb_14", name: "Masala Tea", price: 90 },
    { id: "hb_15", name: "Tea Chino", price: 90 },
    { id: "hb_16", name: "Kopi Chino", price: 90 },
    { id: "hb_17", name: "TO Halia", price: 75 },
    { id: "hb_18", name: "Tea C", price: 70 },
    { id: "hb_19", name: "Rose Syrup Lime", price: 80 },
    { id: "hb_20", name: "Honey Lemon", price: 85 },
    { id: "hb_21", name: "Nes Lo Panas", price: 80 },
  ],

  "Ice Cream": [
    { id: "ic_1", name: "Banana Split", price: 180 },
    { id: "ic_2", name: "Mix Ice Cream", price: 160 },
    { id: "ic_3", name: "2 Scoop Ice Cream", price: 150 },
    { id: "ic_4", name: "Single Scoop Ice Cream", price: 90 },
    { id: "ic_5", name: "Malay Dessert", price: 170 },
  ],

  "Cold Beverages": [
    { id: "cb_1", name: "Tea Ice", price: 70 },
    { id: "cb_2", name: "Coffee Ice", price: 80 },
    { id: "cb_3", name: "Nescafe Ice", price: 85 },
    { id: "cb_4", name: "Milo Ice", price: 90 },
    { id: "cb_5", name: "Bandung Ice", price: 80 },
    { id: "cb_6", name: "Horlicks Ice", price: 90 },
    { id: "cb_7", name: "Chocolate Ice", price: 90 },
    { id: "cb_8", name: "Tea O Ice", price: 70 },
    { id: "cb_9", name: "Coffee O Ice", price: 80 },
    { id: "cb_10", name: "Tea O Lime Ice", price: 75 },
    { id: "cb_11", name: "Tea Chino Ice", price: 90 },
    { id: "cb_12", name: "Coffee Chino Ice", price: 90 },
    { id: "cb_13", name: "Soft Drinks", price: 60 },
    { id: "cb_14", name: "Mineral Water", price: 40 },
    { id: "cb_15", name: "Water", price: 20 },
    { id: "cb_16", name: "Syrup Lime Ice", price: 75 },
    { id: "cb_17", name: "Ginger Tea Ice", price: 75 },
    { id: "cb_18", name: "Nes Lo Ice", price: 80 },
    { id: "cb_19", name: "Limau Ice", price: 75 },
    { id: "cb_20", name: "Halia O Ice", price: 75 },
    { id: "cb_21", name: "Honey Lemon Ice", price: 85 },
    { id: "cb_22", name: "Syrup Ice", price: 70 },
    { id: "cb_23", name: "Blueberry Ice", price: 80 },
  ],

  "Fruit Juices": [
    { id: "fj_1", name: "Orange Juice", price: 120 },
    { id: "fj_2", name: "Apple Juice", price: 120 },
    { id: "fj_3", name: "Pineapple Juice", price: 120 },
    { id: "fj_4", name: "Watermelon Juice", price: 120 },
    { id: "fj_5", name: "Starfruit Juice", price: 130 },
    { id: "fj_6", name: "Honeydew Juice", price: 130 },
    { id: "fj_7", name: "Longan Juice", price: 130 },
    { id: "fj_8", name: "Lychee Juice", price: 130 },
    { id: "fj_9", name: "Rambutan Juice", price: 140 },
    { id: "fj_10", name: "Carrot Juice", price: 110 },
    { id: "fj_11", name: "Celery Juice", price: 110 },
    { id: "fj_12", name: "Lime Juice", price: 100 },
    { id: "fj_13", name: "Fresh Coconut", price: 100 },
    { id: "fj_14", name: "Mix Fruit Juice", price: 150 },
  ],

  Sodas: [
    { id: "sd_1", name: "Lemon Soda", price: 90 },
    { id: "sd_2", name: "Blackcurrant Soda", price: 95 },
    { id: "sd_3", name: "Strawberry Soda", price: 95 },
    { id: "sd_4", name: "Blueberry Soda", price: 95 },
    { id: "sd_5", name: "Kiwi Soda", price: 95 },
  ],
};

interface DrinkItem {
  id: string;
  name: string;
  price: number;
}

export default function Drinks() {
  const router = useRouter();
  const orderContext = getOrderContext();

  if (!orderContext) {
    router.replace("/(tabs)/category");
  }

  const { width } = useWindowDimensions();
  const listRef = useRef<FlatList>(null);

  const numColumns =
    width >= 1200 ? 6 : width >= 900 ? 5 : width >= 600 ? 4 : 2;
  const GAP = 12;
  const PAD = 12;
  const size = (width - PAD * 2 - GAP * (numColumns - 1)) / numColumns;

  const [cart, setCart] = useState(getCart());
  const [selectedGroup, setSelectedGroup] = useState("Smoothies");

  const [showCustomize, setShowCustomize] = useState(false);
  const [selectedItem, setSelectedItem] = useState<DrinkItem | null>(null);

  const [sugar, setSugar] = useState<"Less" | "Normal" | "No Sugar">("Normal");
  const [note, setNote] = useState("");

  const items = ITEMS_BY_GROUP[selectedGroup] || [];

  const totalItems = useMemo(
    () => cart.reduce((s, i) => s + (i.qty || 0), 0),
    [cart],
  );

  useFocusEffect(
    useCallback(() => {
      setCart([...getCart()]);
    }, []),
  );

  const openCustomize = (item: DrinkItem) => {
    setSelectedItem(item);
    setSugar("Normal");
    setNote("");
    setShowCustomize(true);
  };

  const confirmAdd = () => {
    if (!selectedItem) return;

    addToCartGlobal({
      id: selectedItem.id,
      name: selectedItem.name,
      price: selectedItem.price,
      ...(sugar !== "Normal" && { sugar }),
      ...(note.trim() !== "" && { note }),
    });

    setCart([...getCart()]);
    setShowCustomize(false);
  };

  const renderDrinkItem = ({ item }: { item: DrinkItem }) => {
    return (
      <TouchableOpacity
        style={[styles.foodCard, { width: size }]}
        onPress={() => openCustomize(item)}
      >
        <View style={styles.foodImageBox}>
          <Text style={{ fontSize: 40 }}>🥤</Text>
        </View>
        <View style={styles.foodInfo}>
          <Text style={styles.foodName} numberOfLines={2}>
            {item.name}
          </Text>
          <Text style={styles.foodPrice}>₹ {item.price.toFixed(2)}</Text>
          <View style={styles.addBtn}>
            <Text style={styles.addBtnText}>Select & Customize</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#0b0b0b" }}>
      {/* HEADER */}
      <View style={styles.header}>
        <Text style={styles.title}>DRINKS</Text>

        <View style={{ flexDirection: "row", gap: 8 }}>
          <Pressable onPress={() => router.back()} style={styles.backBtn}>
            <Text style={styles.backText}>Back</Text>
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

      {/* KITCHENS */}
      <View style={styles.kitchensContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.kitchensScroll}
        >
          {KITCHENS.map((k) => {
            const isActive = k.name === ACTIVE_KITCHEN;
            return (
              <TouchableOpacity
                key={k.id}
                style={[
                  styles.kitchenCard,
                  isActive
                    ? styles.kitchenCardActive
                    : styles.kitchenCardInactive,
                  { width: width < 600 ? 80 : 100 },
                ]}
                onPress={() => {
                  if (!isActive) router.push(k.route as any);
                }}
              >
                <View
                  style={[
                    styles.iconContainer,
                    {
                      backgroundColor: isActive
                        ? "rgba(255,255,255,0.2)"
                        : "rgba(0,0,0,0.3)",
                    },
                  ]}
                >
                  <Text style={styles.kitchenIcon}>{k.icon}</Text>
                </View>
                <Text
                  style={[
                    styles.kitchenName,
                    {
                      color: isActive ? "#052b12" : "#fff",
                      textAlign: "center",
                    },
                  ]}
                  numberOfLines={2}
                >
                  {k.name}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* GROUPS */}
      <View style={styles.row}>
        {GROUPS.map((g) => {
          const active = g.name === selectedGroup;
          return (
            <TouchableOpacity
              key={g.id}
              style={[styles.chip, active ? styles.active : styles.inactive]}
              onPress={() => {
                setSelectedGroup(g.name);
                listRef.current?.scrollToOffset({ offset: 0, animated: true });
              }}
            >
              <Text
                style={{
                  color: active ? "#052b12" : "#fff",
                  fontWeight: "800",
                }}
              >
                {g.name}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* ITEMS */}
      <FlatList
        ref={listRef}
        data={items}
        numColumns={numColumns}
        key={numColumns + selectedGroup}
        keyExtractor={(i) => i.id}
        columnWrapperStyle={{ gap: GAP }}
        contentContainerStyle={{ gap: GAP, padding: PAD, paddingBottom: 120 }}
        renderItem={renderDrinkItem}
        showsVerticalScrollIndicator
      />

      {/* MODAL */}
      <Modal visible={showCustomize} transparent animationType="slide">
        <View style={styles.modalBackdrop}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>{selectedItem?.name}</Text>

            <Text style={styles.modalLabel}>Sugar</Text>
            <View style={styles.optionRow}>
              {["Less", "Normal", "No Sugar"].map((v) => (
                <TouchableOpacity
                  key={v}
                  onPress={() => setSugar(v as any)}
                  style={[styles.optionBtn, sugar === v && styles.optionActive]}
                >
                  <Text
                    style={[
                      styles.optionText,
                      sugar === v && { color: "#052b12" },
                    ]}
                  >
                    {v}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <TextInput
              placeholder="Special instruction..."
              placeholderTextColor="#888"
              value={note}
              onChangeText={setNote}
              style={styles.noteInput}
              multiline
            />

            <View style={{ flexDirection: "row", gap: 10, marginTop: 20 }}>
              <TouchableOpacity
                onPress={() => setShowCustomize(false)}
                style={[styles.modalBtn, { backgroundColor: "#444" }]}
              >
                <Text
                  style={{
                    color: "#fff",
                    textAlign: "center",
                    fontWeight: "600",
                  }}
                >
                  Cancel
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={confirmAdd}
                style={[styles.modalBtn, { backgroundColor: "#22c55e" }]}
              >
                <Text
                  style={{
                    color: "#052b12",
                    textAlign: "center",
                    fontWeight: "900",
                  }}
                >
                  Add to Cart
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

/* ================= STYLES ================= */
const styles = StyleSheet.create({
  header: {
    height: 60,
    backgroundColor: "#111",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 12,
  },
  title: { color: "#9ef01a", fontWeight: "800", fontSize: 16 },

  backBtn: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: "#333",
  },
  backText: { color: "#fff", fontWeight: "700" },

  cartBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: "#22c55e",
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
  badgeText: { color: "#fff", fontSize: 12, fontWeight: "600" },

  kitchensContainer: { backgroundColor: "#111", paddingVertical: 12 },
  kitchensScroll: { paddingHorizontal: 8, gap: 8 },

  kitchenCard: {
    borderRadius: 16,
    padding: 12,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
  },
  kitchenCardActive: { backgroundColor: "#22c55e", borderColor: "#22c55e" },
  kitchenCardInactive: { backgroundColor: "#2a2a2a", borderColor: "#333" },

  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  kitchenIcon: { fontSize: 24 },
  kitchenName: { fontWeight: "800", fontSize: 11, textAlign: "center" },

  row: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    paddingHorizontal: 10,
    paddingTop: 10,
  },
  chip: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20 },
  active: { backgroundColor: "#22c55e" },
  inactive: { backgroundColor: "#333" },

  foodCard: {
    borderRadius: 16,
    overflow: "hidden",
    backgroundColor: "#111",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
  },
  foodImageBox: {
    width: "100%",
    aspectRatio: 1.2,
    backgroundColor: "#000",
    justifyContent: "center",
    alignItems: "center",
  },
  foodInfo: { padding: 10 },
  foodName: { color: "#fff", fontWeight: "700", fontSize: 13, marginBottom: 4 },
  foodPrice: {
    color: "#9ef01a",
    fontWeight: "800",
    fontSize: 13,
    marginBottom: 8,
  },

  addBtn: {
    backgroundColor: "#22c55e",
    paddingVertical: 8,
    borderRadius: 10,
    alignItems: "center",
  },
  addBtnText: { color: "#052b12", fontWeight: "900", fontSize: 12 },

  modalBackdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.8)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalBox: {
    width: "90%",
    backgroundColor: "#111",
    borderRadius: 20,
    padding: 20,
  },
  modalTitle: {
    color: "#9ef01a",
    fontWeight: "900",
    fontSize: 18,
    marginBottom: 10,
  },
  modalLabel: { color: "#fff", marginTop: 10, fontWeight: "700" },

  optionRow: { flexDirection: "row", gap: 8, marginTop: 6 },
  optionBtn: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 16,
    backgroundColor: "#333",
  },
  optionActive: { backgroundColor: "#22c55e" },
  optionText: { color: "#fff", fontWeight: "700" },

  noteInput: {
    borderWidth: 1,
    borderColor: "#444",
    borderRadius: 12,
    padding: 12,
    color: "#fff",
    marginTop: 12,
    minHeight: 80,
    backgroundColor: "#222",
  },

  modalBtn: { flex: 1, padding: 14, borderRadius: 12 },
});
