import { useFocusEffect, useRouter } from "expo-router";
import React, { useCallback, useMemo, useRef, useState } from "react";
import { addToCartGlobal, getCart } from "../cartStore";

import {
  FlatList,
  Image,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";

/* ================= KITCHENS ================= */
const KITCHENS = [
  { id: "k1", name: "INDIAN", route: "/menu/indian_kitchen" },
  { id: "k2", name: "SOUTH INDIAN", route: "/menu/south_indian" },
  { id: "k3", name: "WESTERN", route: "/menu/western_kitchen" },
  { id: "k4", name: "THAI", route: "/menu/thai_kitchen" },
  { id: "k5", name: "DRINKS", route: "/menu/drinks" },
];

const ACTIVE_KITCHEN = "THAI";

/* ================= GROUPS ================= */
const GROUPS = [
  { id: "g1", name: "Thai_Soup" },
  { id: "g2", name: "Dishes" },
  { id: "g3", name: "Fishes" },
  { id: "g4", name: "Fried_Rice" },
  { id: "g5", name: "Noodles" },
  { id: "g6", name: "Omellete" },
  { id: "g7", name: "Steam_Rice" },
  { id: "g8", name: "Thai_Veg" },
];

/* ================= DATA ================= */
const ITEMS_BY_GROUP: Record<
  string,
  { id: string; name: string; priceS: number; priceL?: number }[]
> = {
  Thai_Soup: [
    { id: "ts1", name: "Tomyam Seafood", priceS: 13.5, priceL: 15.0 },
    { id: "ts2", name: "Tomyam Chicken", priceS: 12.0, priceL: 14.0 },
    { id: "ts3", name: "Tomyam Beef", priceS: 13.0, priceL: 15.0 },
    { id: "ts4", name: "Fish Soup", priceS: 12.0, priceL: 14.0 },
      { id: "ts1", name: "Tomyam Seafood", priceS: 13.5, priceL: 15.0 },
    { id: "ts2", name: "Tomyam Chicken", priceS: 12.0, priceL: 14.0 },
    { id: "ts3", name: "Tomyam Beef", priceS: 13.0, priceL: 15.0 },
    { id: "ts4", name: "Fish Soup", priceS: 12.0, priceL: 14.0 },
      { id: "ts1", name: "Tomyam Seafood", priceS: 13.5, priceL: 15.0 },
    { id: "ts2", name: "Tomyam Chicken", priceS: 12.0, priceL: 14.0 },
    { id: "ts3", name: "Tomyam Beef", priceS: 13.0, priceL: 15.0 },
    { id: "ts4", name: "Fish Soup", priceS: 12.0, priceL: 14.0 },
  ],
  Dishes: [
    { id: "s1", name: "Tom Yum Soup", priceS: 8.5 },
    { id: "s2", name: "Tom Kha Soup", priceS: 9.0 },
  ],
  Fishes: [{ id: "n1", name: "Pad Thai", priceS: 12.5 }],
  Fried_Rice: [
    { id: "fr1", name: "Green Curry Fried Rice", priceS: 13.5 },
    { id: "fr2", name: "Red Curry Fried Rice", priceS: 13.0 },
  ],
  Noodles: [{ id: "n3", name: "Pad See Ew", priceS: 13.5 }],
  Omellete: [
    { id: "o1", name: "Thai Omelette", priceS: 11.5 },
    { id: "o2", name: "Crab Omelette", priceS: 14.0 },
  ],
  Steam_Rice: [
    { id: "r1", name: "Steamed Rice", priceS: 3.5 },
    { id: "r2", name: "Brown Rice", priceS: 4.0 },
  ],
  Thai_Veg: [
    { id: "v1", name: "Stir Fried Veg", priceS: 11.0 },
    { id: "v2", name: "Thai Veg Curry", priceS: 12.0 },
  ],
};

/* ================= IMAGES ================= */
const FOOD_IMAGES: Record<string, any> = {
  ts1: require("../../assets/images/THAI KItchen/fishes/1.jpg"),
  ts2: require("../../assets/images/THAI KItchen/fishes/2.jpg"),
  ts3: require("../../assets/images/THAI KItchen/fishes/3.jpg"),
  ts4: require("../../assets/images/THAI KItchen/fishes/4.jpg"),
  fr1: require("../../assets/images/THAI KItchen/fishes/5.jpg"),
};

const DEFAULT_IMAGE = require("../../assets/images/THAI KItchen/fishes/1.jpg");

interface FoodItem {
  id: string;
  name: string;
  priceS: number;
  priceL?: number;
}

export default function ThaiKitchen() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const listRef = useRef<FlatList>(null);

  const numColumns = width >= 1200 ? 6 : width >= 900 ? 5 : width >= 600 ? 4 : 2;
  const GAP = 12;
  const PAD = 12;
  const size = (width - PAD * 2 - GAP * (numColumns - 1)) / numColumns;

  const [cart, setCart] = useState(getCart());
  const [selectedGroup, setSelectedGroup] = useState("Thai_Soup");

  const [showCustomize, setShowCustomize] = useState(false);
  const [selectedItem, setSelectedItem] = useState<FoodItem | null>(null);
  const [sizeType, setSizeType] = useState<"S" | "L">("S");
  const [note, setNote] = useState("");

  const items = ITEMS_BY_GROUP[selectedGroup] || [];
  const totalItems = useMemo(
    () => cart.reduce((s, i) => s + (i.qty || 0), 0),
    [cart]
  );

  useFocusEffect(
    useCallback(() => {
      setCart([...getCart()]);
    }, [])
  );

  const openCustomize = (item: FoodItem) => {
    setSelectedItem(item);
    setSizeType("S");
    setNote("");
    setShowCustomize(true);
  };

  const confirmAdd = () => {
    if (!selectedItem) return;

    const price =
      sizeType === "L" && selectedItem.priceL
        ? selectedItem.priceL
        : selectedItem.priceS;

    addToCartGlobal({
      id: selectedItem.id + "_" + sizeType,
      name: `${selectedItem.name} (${sizeType})`,
      price,
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
          <Image
            source={FOOD_IMAGES[item.id] || DEFAULT_IMAGE}
            style={styles.foodImage}
            resizeMode="cover"
          />
        </View>
        <View style={styles.foodInfo}>
          <Text style={styles.foodName} numberOfLines={2}>
            {item.name}
          </Text>
          <Text style={styles.foodPrice}>From ₹ {item.priceS.toFixed(2)}</Text>
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
        <Text style={styles.title}>THAI KITCHEN</Text>
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
      <View style={styles.row}>
        {KITCHENS.map((k) => {
          const active = k.name === ACTIVE_KITCHEN;
          return (
            <TouchableOpacity
              key={k.id}
              style={[styles.chip, active ? styles.active : styles.inactive]}
              onPress={() => !active && router.push(k.route as any)}
            >
              <Text style={{ color: active ? "#052b12" : "#fff", fontWeight: "800" }}>
                {k.name}
              </Text>
            </TouchableOpacity>
          );
        })}
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
              <Text style={{ color: active ? "#052b12" : "#fff", fontWeight: "800" }}>
                {g.name.replace("_", " ")}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* ITEMS GRID (THIS SCROLLS) */}
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

            {selectedItem?.priceL && (
              <View style={{ flexDirection: "row", gap: 10, marginTop: 10 }}>
                {["S", "L"].map((v) => (
                  <TouchableOpacity
                    key={v}
                    onPress={() => setSizeType(v as "S" | "L")}
                    style={[
                      styles.sizeBtn,
                      sizeType === v && { backgroundColor: "#22c55e" },
                    ]}
                  >
                    <Text
                      style={{
                        color: sizeType === v ? "#052b12" : "#fff",
                        fontWeight: "800",
                      }}
                    >
                      {v}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}

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
                <Text style={{ color: "#fff", textAlign: "center", fontWeight: "600" }}>
                  Cancel
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={confirmAdd}
                style={[styles.modalBtn, { backgroundColor: "#22c55e" }]}
              >
                <Text
                  style={{ color: "#052b12", textAlign: "center", fontWeight: "900" }}
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
  foodImageBox: { width: "100%", aspectRatio: 1.2, backgroundColor: "#000" },
  foodImage: { width: "100%", height: "100%" },

  foodInfo: { padding: 10 },
  foodName: { color: "#fff", fontWeight: "700", fontSize: 13, marginBottom: 4 },
  foodPrice: { color: "#9ef01a", fontWeight: "800", fontSize: 13, marginBottom: 8 },

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
  modalBox: { width: "90%", backgroundColor: "#111", borderRadius: 20, padding: 20 },
  modalTitle: { color: "#9ef01a", fontWeight: "900", fontSize: 18, marginBottom: 10 },

  sizeBtn: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    backgroundColor: "#333",
  },

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