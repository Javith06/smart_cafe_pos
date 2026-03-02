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

const ACTIVE_KITCHEN = "WESTERN KITCHEN";

/* ================= GROUPS ================= */
const GROUPS = [
  { id: "g1", name: "Appetizer" },
  { id: "g3", name: "Pasta" },
  { id: "g1", name: "Burgers" },
  { id: "g2", name: "Pizza" },
  { id: "g2", name: "Baked Rice" },
  { id: "g2", name: "Salad" },
  { id: "g2", name: "Chicken" },
  { id: "g2", name: "Lamb" },
];

/* ================= ITEMS ================= */
const ITEMS_BY_GROUP: Record<
  string,
  { id: string; name: string; price: number }[]
> = {
  Appetizer: [
    { id: "app_1", name: "Soup Garlic Bread", price: 12.5 },
    { id: "app_2", name: "Fries", price: 12.5 },
    { id: "app_3", name: "Cheese Fries", price: 12.5 },
    { id: "app_4", name: "Wedges", price: 12.5 },
    { id: "app_5", name: "Cheese Wedges", price: 12.5 },
    { id: "app_6", name: "Mash CrabMeat", price: 12.5 },
    { id: "app_7", name: "Mash Potato", price: 12.5 },
    { id: "app_8", name: "Nuggets", price: 12.5 },
    { id: "app_9", name: "2 Wings N Fries", price: 12.5 },
    { id: "app_10", name: "3pcs Buffalo Wings n Fries", price: 12.5 },
    { id: "app_11", name: "Popcorn Chicken", price: 12.5 },
    { id: "app_12", name: "Coleslaw", price: 12.5 },
    { id: "app_13", name: "Calamari Rings", price: 12.5 },
    { id: "app_14", name: "Scallops", price: 12.5 },
    { id: "app_15", name: "Mix Tempura", price: 12.5 },
    { id: "app_16", name: "Prawn Fritters", price: 12.5 },
    { id: "app_17", name: "Spring Chicken", price: 12.5 },
    { id: "app_18", name: "Roasted Chicken", price: 12.5 },
    { id: "app_19", name: "Udang Merah & Bread", price: 12.5 },
    { id: "app_20", name: "Pisang Goreng 2pcs", price: 3.0 },
    { id: "app_21", name: "Curry Puff 2pcs", price: 2.0 },
    { id: "app_22", name: "Kueh Ramadan", price: 12.5 },
    { id: "app_23", name: "Kueh Ramadan 3 pcs", price: 5.0 },
  ],

  Pasta: [
    { id: "pasta_1", name: "Veg Pomodoro", price: 12.5 },
    { id: "pasta_2", name: "Creamy Mushroom", price: 12.5 },
    { id: "pasta_3", name: "Mush Aglio Olio", price: 12.5 },
    { id: "pasta_4", name: "Teriyaki Pasta", price: 12.5 },
    { id: "pasta_5", name: "SF Olio", price: 12.5 },
    { id: "pasta_6", name: "Beef Bolognese", price: 12.5 },
    { id: "pasta_7", name: "Spicy Corn Beef", price: 12.5 },
    { id: "pasta_8", name: "SeaFood Marinara", price: 12.5 },
    { id: "pasta_9", name: "Sausage Carbonara", price: 12.5 },
    { id: "pasta_10", name: "Beefball Redang", price: 12.5 },
  ],

  Burgers: [
    { id: "burger_1", name: "Lamb Rock", price: 12.5 },
    { id: "burger_2", name: "Chicken Burger", price: 12.5 },
    { id: "burger_3", name: "Home Made Beef", price: 12.5 },
    { id: "burger_4", name: "Mushroom Cheese", price: 12.5 },
    { id: "burger_5", name: "Bold Crunchy Fish", price: 12.5 },
    { id: "burger_6", name: "Chicken Sandwich", price: 12.5 },
    { id: "burger_7", name: "CornBeef Sandwich", price: 12.5 },
    { id: "burger_8", name: "Tuna Sandwich", price: 12.5 },
    { id: "burger_9", name: "Veg Sandwich Cheese", price: 12.5 },
  ],

  Pizza: [
    { id: "pizza_1", name: "Haiwan Chicken", price: 12.5 },
    { id: "pizza_2", name: "Pepperoni Beef", price: 12.5 },
    { id: "pizza_3", name: "BBQ Chicken", price: 12.5 },
    { id: "pizza_4", name: "Veggie Lovers", price: 12.5 },
  ],

  "Baked Rice": [
    { id: "baked_1", name: "Baked Mushroom Chicken", price: 12.5 },
    { id: "baked_2", name: "Arborio Beef", price: 12.5 },
    { id: "baked_3", name: "Risotto Veggie", price: 12.5 },
  ],

  Salad: [
    { id: "salad_1", name: "Healthy Fruit Salad", price: 12.5 },
    { id: "salad_2", name: "Chicken Salad", price: 12.5 },
    { id: "salad_3", name: "Prawn Salad", price: 12.5 },
  ],

  Chicken: [
    { id: "chicken_1", name: "Grill Pepper Chicken", price: 12.5 },
    { id: "chicken_2", name: "Breaded Chicken", price: 12.5 },
    { id: "chicken_3", name: "Chicken & Mushroom", price: 12.5 },
  ],

  Lamb: [
    { id: "lamb_1", name: "Pepper Lamb", price: 12.5 },
    { id: "lamb_2", name: "Mushroom Lamb", price: 12.5 },
    { id: "lamb_3", name: "BBQ Lamb Cheese", price: 12.5 },
  ],

  Ribeye: [
    { id: "Ribeye_1", name: "Ribeye B. Pepper", price: 12.5 },
    { id: "Ribeye_1", name: "Ribeye Mushroom", price: 12.5 },
    { id: "Ribeye_1", name: "Ribeye Cheese", price: 12.5 },
  ],

  Fish: [
    { id: "fish_1", name: "Fish N Chips", price: 12.5 },
    { id: "fish_2", name: "Green Fish Curry", price: 12.5 },
    { id: "fish_3", name: "Grilled Salmon", price: 12.5 },
  ],

  Dessert: [
    { id: "dessert_1", name: "Dark Lava Cake", price: 12.5 },
    { id: "dessert_2", name: "MixBerry Cheese Cake", price: 12.5 },
    { id: "dessert_3", name: "P Pannacotta", price: 12.5 },
    { id: "dessert_4", name: "Sticky Dates", price: 12.5 },
    { id: "dessert_23", name: "OPEN WESTERN", price: 12.5 },

    { id: "dessert_5", name: "Nasi Padang @ $5.00", price: 5.0 },
    { id: "dessert_6", name: "Nasi Padang @ $5.50", price: 5.5 },
    { id: "dessert_7", name: "Nasi Padang @ $6.00", price: 6.0 },
    { id: "dessert_8", name: "Nasi Padang @ $6.50", price: 6.5 },
    { id: "dessert_9", name: "Nasi Padang @ $7.00", price: 7.0 },
    { id: "dessert_10", name: "Nasi Padang @ $7.50", price: 7.5 },
    { id: "dessert_11", name: "Nasi Padang @ $8.00", price: 8.0 },
    { id: "dessert_12", name: "Nasi Padang @ $8.50", price: 8.5 },
    { id: "dessert_13", name: "Nasi Padang @ $9.00", price: 9.0 },
    { id: "dessert_14", name: "Nasi Padang @ $9.50", price: 9.5 },
    { id: "dessert_15", name: "Nasi Padang @ $10.00", price: 10.0 },
    { id: "dessert_16", name: "Nasi Padang @ $10.50", price: 10.5 },
    { id: "dessert_17", name: "Nasi Padang @ $11.00", price: 11.0 },
    { id: "dessert_18", name: "Nasi Padang @ $11.50", price: 11.5 },
    { id: "dessert_19", name: "Nasi Padang @ $12.00", price: 12.0 },
    { id: "dessert_20", name: "Nasi Padang @ $12.50", price: 12.5 },
    { id: "dessert_21", name: "Nasi Padang @ $15.00", price: 15.0 },
    { id: "dessert_22", name: "Nasi Minyak", price: 12.5 },
  ],
};

interface FoodItem {
  id: string;
  name: string;
  price: number;
}

export default function WesternKitchen() {
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
  const [selectedGroup, setSelectedGroup] = useState("Appetizer");

  const [showCustomize, setShowCustomize] = useState(false);
  const [selectedItem, setSelectedItem] = useState<FoodItem | null>(null);

  const [spicy, setSpicy] = useState("Medium");
  const [oil, setOil] = useState("Normal");
  const [salt, setSalt] = useState("Normal");
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

  const openCustomize = (item: FoodItem) => {
    setSelectedItem(item);
    setSpicy("Medium");
    setOil("Normal");
    setSalt("Normal");
    setNote("");
    setShowCustomize(true);
  };

  const confirmAdd = () => {
    if (!selectedItem) return;

    addToCartGlobal({
      id: selectedItem.id,
      name: selectedItem.name,
      price: selectedItem.price,
      spicy,
      oil,
      salt,
      note,
    });

    setCart([...getCart()]);
    setShowCustomize(false);
  };

  const renderFoodItem = ({ item }: { item: FoodItem }) => {
    return (
      <TouchableOpacity
        style={[styles.foodCard, { width: size }]}
        onPress={() => openCustomize(item)}
      >
        <View style={styles.foodImageBox}>
          <Text style={{ fontSize: 40 }}>🍽️</Text>
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
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <Text style={styles.backText}>← Back</Text>
        </Pressable>

        <Text style={styles.title}>WESTERN KITCHEN</Text>

        <Pressable onPress={() => router.push("/cart")} style={styles.cartBtn}>
          <Text style={styles.cartText}>Cart</Text>
          {totalItems > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{totalItems}</Text>
            </View>
          )}
        </Pressable>
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
        renderItem={renderFoodItem}
        showsVerticalScrollIndicator
      />

      {/* MODAL */}
      <Modal visible={showCustomize} transparent animationType="slide">
        <View style={styles.modalBackdrop}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>{selectedItem?.name}</Text>

            <Text style={styles.modalLabel}>Spicy</Text>
            <View style={styles.optionRow}>
              {["Less", "Medium", "Extra"].map((v) => (
                <TouchableOpacity
                  key={v}
                  onPress={() => setSpicy(v)}
                  style={[styles.optionBtn, spicy === v && styles.optionActive]}
                >
                  <Text style={styles.optionText}>{v}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.modalLabel}>Oil</Text>
            <View style={styles.optionRow}>
              {["Less", "Normal"].map((v) => (
                <TouchableOpacity
                  key={v}
                  onPress={() => setOil(v)}
                  style={[styles.optionBtn, oil === v && styles.optionActive]}
                >
                  <Text style={styles.optionText}>{v}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.modalLabel}>Salt</Text>
            <View style={styles.optionRow}>
              {["Less", "Normal"].map((v) => (
                <TouchableOpacity
                  key={v}
                  onPress={() => setSalt(v)}
                  style={[styles.optionBtn, salt === v && styles.optionActive]}
                >
                  <Text style={styles.optionText}>{v}</Text>
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
