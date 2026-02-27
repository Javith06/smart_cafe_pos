import { useFocusEffect, useRouter } from "expo-router";
import React, { useCallback, useMemo, useRef, useState } from "react";
import { addToCartGlobal, getCart } from "../cartStore";
import { getOrderContext } from "../orderContextStore";

import {
  FlatList,
  Image,
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
  { id: "k4", name: "THAI KITCHEN", route: "/menu/thai_kitchen", icon: "🍜" },
  { id: "k1", name: "INDIAN KITCHEN", route: "/menu/indian_kitchen", icon: "🍛" },
  { id: "k2", name: "SOUTH INDIAN", route: "/menu/south_indian", icon: "🥞" },
  { id: "k3", name: "WESTERN KITCHEN", route: "/menu/western_kitchen", icon: "🍔" },
  { id: "k5", name: "DRINKS", route: "/menu/drinks", icon: "🥤" },
];

const ACTIVE_KITCHEN = "THAI KITCHEN";

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
    { id: "ts1", name: "Tomyam Seafood (S)", priceS: 13.5, priceL: 15.0 },
    { id: "ts1", name: "Tomyam Seafood (L)", priceS: 18.5, priceL: 15.0 },
    { id: "ts2", name: "Tomyam Chicken (S)", priceS: 12.0, priceL: 14.0 },
    { id: "ts2", name: "Tomyam Chicken (L)", priceS: 12.0, priceL: 14.0 },
    { id: "ts3", name: "Tomyam Beef (S)", priceS: 13.0, priceL: 15.0 },
    { id: "ts3", name: "Tomyam Beef (L)", priceS: 13.0, priceL: 15.0 },
    { id: "ts4", name: "Tomyam Fish (S)", priceS: 13.0, priceL: 15.0 },
    { id: "ts4", name: "Tomyam Fish (L)", priceS: 13.0, priceL: 15.0 },
    { id: "ts5", name: "Fish Soup (S)", priceS: 12.0, priceL: 14.0 },
    { id: "ts5", name: "Fish Soup (L)", priceS: 12.0, priceL: 14.0 },
    { id: "ts6", name: "Chicken Soup (S)", priceS: 12.0, priceL: 14.0 },
    { id: "ts6", name: "Chicken Soup (L)", priceS: 12.0, priceL: 14.0 },
    { id: "ts7", name: "Beef Soup (S)", priceS: 12.0, priceL: 14.0 },
    { id: "ts7", name: "Beef Soup (L)", priceS: 12.0, priceL: 14.0 },
    { id: "ts8", name: "OX Tail (S)", priceS: 12.0, priceL: 14.0 },
    { id: "ts8", name: "OX Tail (L)", priceS: 12.0, priceL: 14.0 },
    { id: "ts9", name: "Veg Soup (S)", priceS: 12.0, priceL: 14.0 },
    { id: "ts9", name: "Veg Soup (L)", priceS: 12.0, priceL: 14.0 },
    { id: "ts10", name: "Prawn Crackers", priceS: 12.0, priceL: 14.0 },
    { id: "ts10", name: "Buka Puasa", priceS: 12.0, priceL: 14.0 },
  ],
  Dishes: [
    { id: "s1", name: "Tom Yum Soup", priceS: 8.5 },
    { id: "s2", name: "Tom Kha Soup", priceS: 9.0 },
  ],
  Fishes: [
    { id: "n1", name: "SEABASS", priceS: 12.5 },
    { id: "n2", name: "Crabs (1 Pcs)", priceS: 12.5 },
    { id: "n3", name: "Crab (2 Pcs)", priceS: 12.5 },
    { id: "n4", name: "Crab (3 Pcs)", priceS: 12.5 },
    { id: "n5", name: "String Ray $15", priceS: 12.5 },
    { id: "n6", name: "String Ray $18", priceS: 12.5 },
    { id: "n7", name: "String Ray $20", priceS: 12.5 },
    { id: "n8", name: "String Ray (L)", priceS: 12.5 },

  ],
  Fried_Rice: [
    { id: "fr1", name: "Chinese", priceS: 13.5 },
    { id: "fr2", name: "Thai", priceS: 13.0 },
    { id: "fr3", name: "IkanBilis", priceS: 13.0 },
    { id: "fr4", name: "Tomato", priceS: 13.0 },
    { id: "fr5", name: "Fried Chicken", priceS: 13.0 },
    { id: "fr6", name: "Salted Fish", priceS: 13.0 },
    { id: "fr7", name: "Cockles", priceS: 13.0 },
    { id: "fr8", name: "Pataya", priceS: 13.0 },
    { id: "fr9", name: "Kampong", priceS: 13.0 },
    { id: "fr10", name: "Hot & Spicy", priceS: 13.0 },
    { id: "fr11", name: "Black Soya Sauce", priceS: 13.0 },
    { id: "fr12", name: "Mushroom", priceS: 13.0 },
    { id: "fr13", name: "Sambal Mushroom", priceS: 13.0 },
    { id: "fr14", name: "Sambal Chicken", priceS: 13.0 },
    { id: "fr15", name: "Chicken Egg Sambal", priceS: 13.0 },
    { id: "fr16", name: "B.Pepper", priceS: 13.0 },
    { id: "fr17", name: "Pine Apple", priceS: 13.0 },
    { id: "fr18", name: "Sweet n Sour", priceS: 13.0 },
    { id: "fr19", name: "Ginger", priceS: 13.0 },
    { id: "fr20", name: "3 Taste", priceS: 13.0 },
    { id: "fr21", name: "Tumeric Chicken", priceS: 13.0 },
    { id: "fr22", name: "Singapura", priceS: 13.0 },
    { id: "fr23", name: "Telur Mata", priceS: 13.0 },
    

  ],
  Noodles: [{ id: "n3", name: "Pad See Ew", priceS: 13.5 }],
  Omellete: [
    { id: "o1", name: "Onion Chilli", priceS: 11.5 },
    { id: "o2", name: "Crab Stick", priceS: 14.0 },
    { id: "o3", name: "Sausage Cheese", priceS: 14.0 },
    { id: "o4", name: "Prawns", priceS: 14.0 },
    { id: "o5", name: "Egg Wrap Chicken", priceS: 14.0 },
    { id: "o6", name: "Egg Wrap Beef", priceS: 14.0 },
    { id: "o7", name: "Diced Chicken", priceS: 14.0 },
    { id: "o8", name: "Diced Beef", priceS: 14.0 },
    
    
  ],
  Steam_Rice: [
    { id: "r1", name: "Hot & Spicy", priceS: 3.5 },
    { id: "r2", name: "Soya Sauce", priceS: 4.0 },
    { id: "r3", name: "Sweet N Sour", priceS: 4.0 },
    { id: "r4", name: "Black Pepper", priceS: 4.0 },
    { id: "r5", name: "Ginger Sauce", priceS: 4.0 },
    { id: "r6", name: "MuiFun", priceS: 4.0 },
    { id: "r7", name: "NDM", priceS: 4.0 },
    { id: "r8", name: "Steam Rice (N.Putih)", priceS: 4.0 },
    { id: "r9", name: "Nasi Tambar", priceS: 4.0 },
    { id: "r10", name: "Rice Package", priceS: 4.0 },
    { id: "r11", name: "Package @$68.00", priceS: 4.0 },
    { id: "r12", name: "Package @$38.00", priceS: 4.0 },
  ],
  Thai_Veg: [
    { id: "v1", name: "Stir Fried Veg", priceS: 11.0 },
    { id: "v2", name: "Thai Veg Curry", priceS: 12.0 },
  ],
};

/* ================= IMAGES ================= */
const FOOD_IMAGES: Record<string, any> = {
  //soup//
  ts1: require("../../assets/images/THAI KItchen/thai soup/22.jpg"),
  ts2: require("../../assets/images/THAI KItchen/thai soup/13.jpg"),
  ts3: require("../../assets/images/THAI KItchen/thai soup/5.jpg"),
  ts4: require("../../assets/images/THAI KItchen/thai soup/11.jpg"),
  ts5: require("../../assets/images/THAI KItchen/thai soup/4.jpg"),
  ts6: require("../../assets/images/THAI KItchen/thai soup/12.jpg"),
  ts7: require("../../assets/images/THAI KItchen/thai soup/1.jpg"),
  ts8: require("../../assets/images/THAI KItchen/thai soup/19.jpg"),
  ts9: require("../../assets/images/THAI KItchen/thai soup/9.jpg"),
  ts10: require("../../assets/images/THAI KItchen/thai soup/24.jpg"),

  //fish//
    n1: require("../../assets/images/THAI KItchen/fishes/2.jpg"),
    n2: require("../../assets/images/THAI KItchen/fishes/5.jpg"),
    n3: require("../../assets/images/THAI KItchen/fishes/4.jpg"),
    n4: require("../../assets/images/THAI KItchen/fishes/4.jpg"),
    n5: require("../../assets/images/THAI KItchen/fishes/1.jpg"),
    n6: require("../../assets/images/THAI KItchen/fishes/1.jpg"),
    n7: require("../../assets/images/THAI KItchen/fishes/3.jpg"),
    n8: require("../../assets/images/THAI KItchen/fishes/3.jpg"),

  //Omellete//
  o1: require("../../assets/images/THAI KItchen/omellete/6.jpg"),
  o2: require("../../assets/images/THAI KItchen/omellete/7.jpg"),
  o3: require("../../assets/images/THAI KItchen/omellete/11.jpg"),
  o4: require("../../assets/images/THAI KItchen/omellete/8.jpg"),
  o5: require("../../assets/images/THAI KItchen/omellete/5.jpg"),
  o6: require("../../assets/images/THAI KItchen/omellete/2.jpg"),
  o7: require("../../assets/images/THAI KItchen/omellete/3.jpg"),
  o8: require("../../assets/images/THAI KItchen/omellete/12.jpg"),

  //Steam Rice //

  r1: require("../../assets/images/THAI KItchen/Steam Rice/4.jpg"),
  r2: require("../../assets/images/THAI KItchen/Steam Rice/1.jpg"),
  r3: require("../../assets/images/THAI KItchen/Steam Rice/6.jpg"),
  r4: require("../../assets/images/THAI KItchen/Steam Rice/2.jpg"),
  r5: require("../../assets/images/THAI KItchen/Steam Rice/9.jpg"),
  r6: require("../../assets/images/THAI KItchen/Steam Rice/7.jpg"),
  r7: require("../../assets/images/THAI KItchen/Steam Rice/4.jpg"),
  r8: require("../../assets/images/THAI KItchen/Steam Rice/5.jpg"),
  r9: require("../../assets/images/THAI KItchen/Steam Rice/10.jpg"),
  r10: require("../../assets/images/THAI KItchen/Steam Rice/8.jpg"),
  r11: require("../../assets/images/THAI KItchen/Steam Rice/8.jpg"),
  r12: require("../../assets/images/THAI KItchen/Steam Rice/8.jpg"),
  
  // Fried Rice //

  fr1: require("../../assets/images/THAI KItchen/fried rice/4.jpg"),
  fr2: require("../../assets/images/THAI KItchen/fried rice/7.jpg"),
  fr3: require("../../assets/images/THAI KItchen/fried rice/8.jpg"),
  fr4: require("../../assets/images/THAI KItchen/fried rice/5.jpg"),
  fr5: require("../../assets/images/THAI KItchen/fried rice/1.jpg"),
  fr6: require("../../assets/images/THAI KItchen/fried rice/16.jpg"),
  fr7: require("../../assets/images/THAI KItchen/fried rice/8.jpg"),
  fr8: require("../../assets/images/THAI KItchen/fried rice/9.jpg"),
  fr9: require("../../assets/images/THAI KItchen/fried rice/10.jpg"),
  fr10: require("../../assets/images/THAI KItchen/fried rice/3.jpg"),
  fr11: require("../../assets/images/THAI KItchen/fried rice/15.jpg"),
  fr12: require("../../assets/images/THAI KItchen/fried rice/11.jpg"),
  fr13: require("../../assets/images/THAI KItchen/fried rice/12.jpg"),
  fr14: require("../../assets/images/THAI KItchen/fried rice/18.jpg"),
  fr15: require("../../assets/images/THAI KItchen/fried rice/14.jpg"),
  fr16: require("../../assets/images/THAI KItchen/fried rice/20.jpg"),
  fr17: require("../../assets/images/THAI KItchen/fried rice/22.jpg"),
  fr18: require("../../assets/images/THAI KItchen/fried rice/21.jpg"),
  fr19: require("../../assets/images/THAI KItchen/fried rice/13.jpg"),
  fr20: require("../../assets/images/THAI KItchen/fried rice/1.jpg"),
  fr21: require("../../assets/images/THAI KItchen/fried rice/2.jpg"),
  fr22: require("../../assets/images/THAI KItchen/fried rice/23.jpg"),
  fr23: require("../../assets/images/THAI KItchen/fried rice/17.jpg"),
    
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
  const [selectedGroup, setSelectedGroup] = useState("Thai_Soup");

  const [showCustomize, setShowCustomize] = useState(false);
  const [selectedItem, setSelectedItem] = useState<FoodItem | null>(null);
  const [sizeType, setSizeType] = useState<"S" | "L">("S");
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

      {/* KITCHENS - UPDATED DESIGN */}
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
                  isActive ? styles.kitchenCardActive : styles.kitchenCardInactive,
                  { width: width < 600 ? 80 : 100 }
                ]}
                onPress={() => {
                  if (!isActive) router.push(k.route as any);
                }}
              >
                <View style={[
                  styles.iconContainer,
                  { backgroundColor: isActive ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.3)" }
                ]}>
                  <Text style={styles.kitchenIcon}>{k.icon}</Text>
                </View>
                                <Text 
                  style={[
                    styles.kitchenName,
                    { color: isActive ? "#052b12" : "#fff" },
                    { textAlign: "center" }  // ✅ MOVE IT HERE
                  ]}
                  numberOfLines={2}
                >
                  {k.name.replace("_", " ")}
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

  // --- KITCHEN STYLES ---
  kitchensContainer: {
    backgroundColor: "#111",
    paddingVertical: 12,
  },
  kitchensScroll: {
    paddingHorizontal: 8,
    gap: 8,
  },
  kitchenCard: {
    borderRadius: 16,
    padding: 12,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
  },
  kitchenCardActive: {
    backgroundColor: "#22c55e",
    borderColor: "#22c55e",
  },
  kitchenCardInactive: {
    backgroundColor: "#2a2a2a",
    borderColor: "#333",
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  kitchenIcon: {
    fontSize: 24,
  },
  kitchenName: {
    fontWeight: "800",
    fontSize: 11,
    textAlign: "center",
  },
  // ----------------------

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