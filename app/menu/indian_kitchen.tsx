import { useFocusEffect, useRouter } from "expo-router";
import React, { useCallback, useMemo, useRef, useState } from "react";
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
  View
} from "react-native";
import { addToCartGlobal, getCart } from "../cartStore";
import { getOrderContext } from "../orderContextStore";

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

const ACTIVE_KITCHEN = "INDIAN KITCHEN";

/* ================= GROUPS ================= */
const GROUPS = [
  { id: "g1", name: "TanDoor" },
  { id: "g2", name: "Breads" },
  { id: "g3", name: "Basmathi_Rice" },
  { id: "g4", name: "Indian_Veg" },
  { id: "g5", name: "Chicken" },
  { id: "g6", name: "Mutton" },
  { id: "g7", name: "Seafood" },
];

/* ================= ITEMS ================= */
const ITEMS_BY_GROUP: Record<
  string,
  { id: string; name: string; price: number }[]
> = {
  TanDoor: [
    { id: "st1", name: "Tandoori Chicken(S)", price: 9.5 },
    { id: "st2", name: "Tandoori Chicken(M)", price: 9.5 },
    { id: "st3", name: "Tandoori Chicken(L)", price: 9.5 },
    { id: "st4", name: "Mix Chicken(S)", price: 9.5 },
    { id: "st5", name: "Mix Chicken(M)", price: 9.5 },
    { id: "st6", name: "Mix Chicken(L)", price: 9.5 },
    { id: "st7", name: "Chicken Hariyali(S)", price: 9.5 },
    { id: "st8", name: "Chicken Hariyali(M)", price: 9.5 },
    { id: "st9", name: "Chicken Hariyali(L)", price: 9.5 },
    { id: "st10", name: "Chicken Reshmi(S)", price: 9.5 },
    { id: "st11", name: "Chicken Reshmi(M)", price: 9.5 },
    { id: "st12", name: "Chicken Reshmi(L)", price: 9.5 },
    { id: "st13", name: "Chicken Iranian(S)", price: 9.5 },
    { id: "st14", name: "Chicken Iranian(M)", price: 9.5 },
    { id: "st15", name: "Chicken Iranian(L)", price: 9.5 },
    { id: "st16", name: "Seekh Kebab(S)", price: 9.5 },
    { id: "st17", name: "Seekh Kebab(M)", price: 9.5 },
    { id: "st18", name: "Seekh Kebab(L)", price: 9.5 },
    { id: "st19", name: "Paneer Tikka(S)", price: 9.5 },
    { id: "st20", name: "Paneer Tikka(M)", price: 9.5 },
    { id: "st21", name: "Paneer Tikka(L)", price: 9.5 },
    { id: "st22", name: "Fish Tikka(S)", price: 9.5 },
    { id: "st23", name: "Fish Tikka(M)", price: 9.5 },
    { id: "st24", name: "Fish Tikka(L)", price: 9.5 },
    { id: "st25", name: "Fish Hariyali(S)", price: 9.5 },
    { id: "st26", name: "Fish Hariyali(M)", price: 9.5 },
    { id: "st27", name: "Fish Hariyali(L)", price: 9.5 },
    { id: "st28", name: "Fish Reshmi(S)", price: 9.5 },
    { id: "st1", name: "Fish Reshmi(M)", price: 9.5 },
    { id: "st1", name: "Fish Reshmi(L)", price: 9.5 },
    { id: "st1", name: "Mix Fish (S)", price: 9.5 },
    { id: "st1", name: "Mix Fish (M)", price: 9.5 },
    { id: "st1", name: "Mix Fish (L)", price: 9.5 },
    { id: "st1", name: "Open Item)", price: 9.5 },
  ],

  Breads: [
    { id: "b1", name: "Naan", price: 2.5 },
    { id: "b1", name: "Butter Naan", price: 2.5 },
    { id: "b2", name: "Garlic Naan", price: 2.0 },
    { id: "b1", name: "Cheese Naan", price: 2.5 },
    { id: "b1", name: "Kashmiri Naan", price: 2.5 },
    { id: "b1", name: "Kheema Naan", price: 2.5 },
    { id: "b1", name: "Paneer Kulcha", price: 2.5 },
    { id: "b1", name: "Garlic Onion Gulcha", price: 2.5 },
    { id: "b1", name: "T.Rotti", price: 2.5 },
    { id: "b1", name: "B.Rotti", price: 2.5 },
    { id: "b1", name: "Aloo Pratha", price: 2.5 },
    { id: "b1", name: "Methi Pratha", price: 2.5 },
    { id: "b1", name: "Poodhina Pratha", price: 2.5 },
  ],

  Basmathi_Rice: [
    { id: "b1", name: "Chicken Biriyani", price: 2.5 },
    { id: "b1", name: "Fish Biriyani", price: 2.5 },
    { id: "b1", name: "Mutton Biriyani", price: 2.5 },
    { id: "b1", name: "Prawn Biriyani", price: 2.5 },
    { id: "b1", name: "Veg Biriyani", price: 2.5 },
    { id: "b1", name: "Peas Pilau", price: 2.5 },
    { id: "b1", name: "Jeera Rice", price: 2.5 },
    { id: "b1", name: "Kashmiri Pulav", price: 2.5 },
    { id: "b1", name: "Biriyani Rice", price: 2.5 },
    { id: "b1", name: "Basmathi Rice(Plain)", price: 2.5 },
    { id: "b1", name: "PapaDam Set", price: 2.5 },
  ],

  Indian_Veg: [
    { id: "b1", name: "Paneer Butter Masala", price: 2.5 },
    { id: "b1", name: "Bhindi Masala", price: 2.5 },
    { id: "b1", name: "Brinjal Masala", price: 2.5 },
    { id: "b4", name: "Palak Paneer", price: 2.5 },
    { id: "b1", name: "Navrattan Korma", price: 2.5 },
    { id: "b1", name: "Kadai Paneer", price: 2.5 },
    { id: "b1", name: "Malai Kofta", price: 2.5 },
    { id: "b1", name: "Shai Paneer", price: 2.5 },
    { id: "b1", name: "Paneer Tikka Masala", price: 2.5 },
    { id: "b1", name: "Brinjal Masala", price: 2.5 },
    { id: "b1", name: "Matter Paneer", price: 2.5 },
    { id: "b1", name: "Aloo Gobi", price: 2.5 },
    { id: "b1", name: "Aloo Matar Makani", price: 2.5 },
    { id: "b1", name: "Peas Mushroom", price: 2.5 },
    { id: "b1", name: "Channa Masala", price: 2.5 },
    { id: "b1", name: "Matter Paneer", price: 2.5 },
    { id: "b1", name: "Bitter Gourd", price: 2.5 },
    { id: "b1", name: "Yellow Dal", price: 2.5 },
    { id: "b1", name: "Mix Raitha", price: 2.5 },
    { id: "b1", name: "Dal Makani", price: 2.5 },
    { id: "b1", name: "Plain Yogurt", price: 2.5 },
    { id: "b1", name: "Dal Palak", price: 2.5 },
    { id: "b1", name: "Chilli Paneer", price: 2.5 },
    { id: "b1", name: "Aloo Palak", price: 2.5 },
    { id: "b1", name: "Gobi Manchurian", price: 2.5 },
    { id: "b1", name: "Veg Kofta Curry", price: 2.5 },
    { id: "b1", name: "Mix Veg Curry", price: 2.5 },
    { id: "b1", name: "Kadai Vegetable", price: 2.5 },
    { id: "b1", name: "Bhindi Jaipuri", price: 2.5 },
  ],

  Chicken: [
    { id: "b1", name: "Chicken Korma", price: 2.5 },
    { id: "b1", name: "Chicken Spinach", price: 2.5 },
    { id: "b1", name: "Chicken Masala", price: 2.5 },
    { id: "b1", name: "Chicken Vartha", price: 2.5 },
    { id: "b1", name: "Chicken Jalfrazi", price: 2.5 },
    { id: "b1", name: "Butter Chicken", price: 2.5 },
    { id: "b1", name: "Chicken Tikka Masala", price: 2.5 },
    { id: "b1", name: "Kadai Chicken", price: 2.5 },
    { id: "b1", name: "Chicken Vindaloo", price: 2.5 },
    { id: "b1", name: "Chicken Muglai", price: 2.5 },
    { id: "b1", name: "Chilli Chicken", price: 2.5 },
    { id: "b1", name: "Pepper Chicken", price: 2.5 },
    { id: "b1", name: "Chicken Dahiwala", price: 2.5 },
    { id: "b1", name: "Chicken Tawa Masala", price: 2.5 },
    { id: "b1", name: "Chicken Vindaloo", price: 2.5 },
    { id: "b1", name: "Chicken Vindaloo", price: 2.5 },
    { id: "b1", name: "Chicken Hydrabadi", price: 2.5 },
  ],

  Mutton: [
    { id: "b1", name: "Mutton Kurma", price: 2.5 },
    { id: "b1", name: "Mutton Masala", price: 2.5 },
    { id: "b1", name: "Mutton Do Piaza", price: 2.5 },
    { id: "b1", name: "Mutton Keema", price: 2.5 },
    { id: "b1", name: "Kadai Mutton", price: 2.5 },
    { id: "b1", name: "Mutton Rogan Josh", price: 2.5 },
    { id: "b1", name: "Mutton Jafrazi", price: 2.5 },
    { id: "b1", name: "Mutton Vindaloo", price: 2.5 },
    { id: "b1", name: "Mutton Muglai", price: 2.5 },
    { id: "b1", name: "Mutton Spinach", price: 2.5 },
    { id: "b1", name: "Chilli Mutton", price: 2.5 },
    { id: "b1", name: "Pepper Mutton", price: 2.5 },
  ],

  Seafood: [
    { id: "b1", name: "Kadai Fish", price: 2.5 },
    { id: "b1", name: "Fish Vindaloo", price: 2.5 },
    { id: "b1", name: "Madras Fish Curry", price: 2.5 },
    { id: "b1", name: "Fish Masala", price: 2.5 },
    { id: "b1", name: "Prawn Vindaloo", price: 2.5 },
    { id: "b1", name: "Kadai Prawn", price: 2.5 },
    { id: "b1", name: "Prawn Masala", price: 2.5 },
    { id: "b1", name: "Prawn Curry", price: 2.5 },
    { id: "b1", name: "Prawn Do Piaza", price: 2.5 },
    { id: "b1", name: "Prawn Jalfrazi", price: 2.5 },
    { id: "b1", name: "Prawn Malwani", price: 2.5 },
    { id: "b1", name: "Prawn Jhinga Tomato", price: 2.5 },
    { id: "b1", name: "Prawn Hydrabadi", price: 2.5 },
    { id: "b1", name: "Chilli Fish", price: 2.5 },
    { id: "b1", name: "Pepper Fish", price: 2.5 },
    { id: "b1", name: "Chilli Prawn", price: 2.5 },
    { id: "b1", name: "Pepper Prawn", price: 2.5 },
    { id: "b1", name: "Fish Head Curry", price: 2.5 },
  ],
};


interface FoodItem {
  id: string;
  name: string;
  price: number;
}

export default function IndianKitchen() {
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
  const [selectedGroup, setSelectedGroup] = useState("TanDoor");

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

        <Text style={styles.title}>INDIAN KITCHEN</Text>

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
