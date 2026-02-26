import { useFocusEffect, useRouter } from "expo-router";
import React, { useCallback, useMemo, useState } from "react";
import {
  Dimensions,
  FlatList,
  ImageBackground,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";
import { addToCartGlobal, getCart } from "../cartStore";
import { getOrderContext } from "../orderContextStore";
/* ================= CUISINES ================= */ const CUISINES = [
  { id: "1", name: "THAI KITCHEN", route: "/menu/thai_kitchen", emoji: "🍜" },
  {
    id: "2",
    name: "INDIAN KITCHEN",
    route: "/menu/indian_kitchen",
    emoji: "🍛",
  },
  { id: "3", name: "SOUTH INDIAN", route: "/menu/south_indian", emoji: "🥞" },
  {
    id: "4",
    name: "WESTERN KITCHEN",
    route: "/menu/western_kitchen",
    emoji: "🍔",
  },
  { id: "5", name: "DRINKS", route: "/menu/drinks", emoji: "🥤" },
];
const ACTIVE_CUISINE = "INDIAN KITCHEN";
/* ================= GROUPS ================= */ const GROUPS = [
  { id: "g1", name: "Starters" },
  { id: "g2", name: "Main Course" },
  { id: "g3", name: "Breads" },
];
/* ================= ITEMS ================= */ const ITEMS_BY_GROUP: Record<
  string,
  { id: string; name: string; price: number }[]
> = {
  Starters: [
    { id: "st1", name: "Paneer Tikka", price: 9.5 },
    { id: "st2", name: "Chicken 65", price: 10.5 },
  ],
  "Main Course": [
    { id: "mc1", name: "Butter Chicken", price: 13.5 },
    { id: "mc2", name: "Dal Tadka", price: 9.0 },
  ],
  Breads: [
    { id: "b1", name: "Butter Naan", price: 2.5 },
    { id: "b2", name: "Tandoori Roti", price: 2.0 },
  ],
};
export default function IndianKitchen() {
  const router = useRouter();
  const orderContext = getOrderContext();

  if (!orderContext) {
    router.replace("/(tabs)/category");
  }
  const { width } = useWindowDimensions();
  const { width: SCREEN_W, height: SCREEN_H } = Dimensions.get("window");
  const numColumns = width >= 1000 ? 5 : width >= 600 ? 4 : 2;
  const GAP = 12;
  const PAD = 16;
  const size = (width - PAD * 2 - GAP * (numColumns - 1)) / numColumns;
  /* CART */ const [cart, setCart] = useState(getCart());
  useFocusEffect(
    useCallback(() => {
      setCart([...getCart()]);
    }, []),
  );
  const totalItems = useMemo(() => cart.reduce((s, i) => s + i.qty, 0), [cart]);
  /* GROUP */ const [selectedGroup, setSelectedGroup] = useState("Starters");
  const items = ITEMS_BY_GROUP[selectedGroup] || [];
  /* CUSTOMIZE */ const [showCustomize, setShowCustomize] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [spicy, setSpicy] = useState("Medium");
  const [oil, setOil] = useState("Normal");
  const [salt, setSalt] = useState("Normal");
  const [note, setNote] = useState("");
  const openCustomize = (item: any) => {
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
  return (
    <View style={{ flex: 1 }}>
      {" "}
      <ImageBackground
        source={require("../../assets/images/11.jpg")}
        style={{ width: SCREEN_W, height: SCREEN_H }}
      >
        {" "}
        <View style={styles.overlay}>
          {" "}
          {/* HEADER */}{" "}
          <View style={styles.header}>
            {" "}
            <Text style={styles.title}>INDIAN KITCHEN</Text>{" "}
            <View style={{ flexDirection: "row", gap: 8 }}>
              {" "}
              <Pressable
                onPress={() => router.replace("/menu/dishes")}
                style={styles.headerBtn}
              >
                {" "}
                <Text style={styles.headerBtnText}>Back</Text>{" "}
              </Pressable>{" "}
              <Pressable
                onPress={() => router.push("/cart")}
                style={styles.cartBtn}
              >
                {" "}
                <Text style={styles.cartText}>Cart</Text>{" "}
                {totalItems > 0 && (
                  <View style={styles.badge}>
                    {" "}
                    <Text style={styles.badgeText}>{totalItems}</Text>{" "}
                  </View>
                )}{" "}
              </Pressable>{" "}
            </View>{" "}
          </View>{" "}
          {/* CUISINE BAR */}{" "}
          <FlatList
            data={CUISINES}
            horizontal
            keyExtractor={(i) => i.id}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ gap: 12, padding: 12 }}
            renderItem={({ item }) => {
              const active = item.name === ACTIVE_CUISINE;
              return (
                <TouchableOpacity
                  style={[
                    styles.cuisineCard,
                    active ? styles.cuisineActive : styles.cuisineInactive,
                  ]}
                  onPress={() => !active && router.push(item.route as any)}
                >
                  {" "}
                  <Text style={styles.cuisineEmoji}>{item.emoji}</Text>{" "}
                  <Text style={styles.cuisineText}>{item.name}</Text>{" "}
                </TouchableOpacity>
              );
            }}
          />{" "}
          {/* GROUP BAR */}{" "}
          <FlatList
            data={GROUPS}
            horizontal
            keyExtractor={(i) => i.id}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ gap: 10, paddingHorizontal: 12 }}
            renderItem={({ item }) => {
              const active = item.name === selectedGroup;
              return (
                <TouchableOpacity
                  style={[
                    styles.groupChip,
                    active ? styles.groupActive : styles.groupInactive,
                  ]}
                  onPress={() => setSelectedGroup(item.name)}
                >
                  {" "}
                  <Text
                    style={{
                      color: active ? "#052b12" : "#fff",
                      fontWeight: "800",
                    }}
                  >
                    {" "}
                    {item.name}{" "}
                  </Text>{" "}
                </TouchableOpacity>
              );
            }}
          />{" "}
          {/* ITEMS */}{" "}
          <FlatList
            data={items}
            numColumns={numColumns}
            key={numColumns + selectedGroup}
            keyExtractor={(i) => i.id}
            columnWrapperStyle={{ gap: GAP }}
            contentContainerStyle={{ gap: GAP, padding: PAD }}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[styles.foodCard, { width: size, height: size * 1.1 }]}
                onPress={() => openCustomize(item)}
              >
                {" "}
                <View style={styles.foodImageBox}>
                  {" "}
                  <Text style={{ fontSize: 28 }}>🍽️</Text>{" "}
                </View>{" "}
                <View style={styles.foodInfo}>
                  {" "}
                  <Text style={styles.foodName}>{item.name}</Text>{" "}
                  <Text style={styles.foodPrice}>
                    {" "}
                    $ {item.price.toFixed(2)}{" "}
                  </Text>{" "}
                  <View style={styles.addBtn}>
                    {" "}
                    <Text style={styles.addBtnText}>Customize</Text>{" "}
                  </View>{" "}
                </View>{" "}
              </TouchableOpacity>
            )}
          />{" "}
        </View>{" "}
        {/* MODAL */}{" "}
        <Modal visible={showCustomize} transparent animationType="slide">
          {" "}
          <View style={styles.modalBackdrop}>
            {" "}
            <View style={styles.modalBox}>
              {" "}
              <Text style={styles.modalTitle}>
                {" "}
                Customize: {selectedItem?.name}{" "}
              </Text>{" "}
              <Text style={styles.modalLabel}>Spicy</Text>{" "}
              <View style={styles.optionRow}>
                {" "}
                {["Less", "Medium", "Extra"].map((v) => (
                  <TouchableOpacity
                    key={v}
                    onPress={() => setSpicy(v)}
                    style={[
                      styles.optionBtn,
                      spicy === v && styles.optionActive,
                    ]}
                  >
                    {" "}
                    <Text style={styles.optionText}>{v}</Text>{" "}
                  </TouchableOpacity>
                ))}{" "}
              </View>{" "}
              <Text style={styles.modalLabel}>Oil</Text>{" "}
              <View style={styles.optionRow}>
                {" "}
                {["Less", "Normal"].map((v) => (
                  <TouchableOpacity
                    key={v}
                    onPress={() => setOil(v)}
                    style={[styles.optionBtn, oil === v && styles.optionActive]}
                  >
                    {" "}
                    <Text style={styles.optionText}>{v}</Text>{" "}
                  </TouchableOpacity>
                ))}{" "}
              </View>{" "}
              <Text style={styles.modalLabel}>Salt</Text>{" "}
              <View style={styles.optionRow}>
                {" "}
                {["Less", "Normal"].map((v) => (
                  <TouchableOpacity
                    key={v}
                    onPress={() => setSalt(v)}
                    style={[
                      styles.optionBtn,
                      salt === v && styles.optionActive,
                    ]}
                  >
                    {" "}
                    <Text style={styles.optionText}>{v}</Text>{" "}
                  </TouchableOpacity>
                ))}{" "}
              </View>{" "}
              <Text style={styles.modalLabel}>Special Note</Text>{" "}
              <TextInput
                placeholder="Special instruction..."
                placeholderTextColor="#888"
                value={note}
                onChangeText={setNote}
                style={styles.noteInput}
              />{" "}
              <View style={{ flexDirection: "row", gap: 10, marginTop: 16 }}>
                {" "}
                <TouchableOpacity
                  onPress={() => setShowCustomize(false)}
                  style={[styles.modalBtn, { backgroundColor: "#444" }]}
                >
                  {" "}
                  <Text style={{ color: "#fff", textAlign: "center" }}>
                    {" "}
                    Cancel{" "}
                  </Text>{" "}
                </TouchableOpacity>{" "}
                <TouchableOpacity
                  onPress={confirmAdd}
                  style={[styles.modalBtn, { backgroundColor: "#22c55e" }]}
                >
                  {" "}
                  <Text
                    style={{
                      color: "#052b12",
                      textAlign: "center",
                      fontWeight: "900",
                    }}
                  >
                    {" "}
                    Add to Cart{" "}
                  </Text>{" "}
                </TouchableOpacity>{" "}
              </View>{" "}
            </View>{" "}
          </View>{" "}
        </Modal>{" "}
      </ImageBackground>{" "}
    </View>
  );
}
/* ================= STYLES ================= */ const styles =
  StyleSheet.create({
    overlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.45)" },
    header: {
      height: 60,
      backgroundColor: "rgba(0,0,0,0.6)",
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingHorizontal: 12,
    },
    title: { color: "#9ef01a", fontWeight: "800" },
    headerBtn: {
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 8,
      backgroundColor: "rgba(255,255,255,0.3)",
    },
    headerBtnText: { color: "#fff" },
    cartBtn: {
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 8,
      backgroundColor: "rgba(34,197,94,0.8)",
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
    badgeText: { color: "#fff", fontSize: 12 },
    cuisineCard: {
      width: 120,
      height: 90,
      borderRadius: 18,
      justifyContent: "center",
      alignItems: "center",
      borderWidth: 1,
      padding: 8,
    },
    cuisineActive: { backgroundColor: "rgba(34,197,94,0.9)" },
    cuisineInactive: { backgroundColor: "rgba(20,20,20,0.7)" },
    cuisineEmoji: { fontSize: 26, marginBottom: 4 },
    cuisineText: {
      color: "#fff",
      fontWeight: "800",
      fontSize: 12,
      textAlign: "center",
    },
    groupChip: {
      paddingHorizontal: 14,
      paddingVertical: 8,
      borderRadius: 16,
      borderWidth: 1,
    },
    groupActive: { backgroundColor: "rgba(34,197,94,0.9)" },
    groupInactive: { backgroundColor: "rgba(0,0,0,0.6)" },
    foodCard: {
      borderRadius: 18,
      overflow: "hidden",
      backgroundColor: "rgba(0,0,0,0.75)",
    },
    foodImageBox: { flex: 1, justifyContent: "center", alignItems: "center" },
    foodInfo: { padding: 10 },
    foodName: { color: "#fff", fontWeight: "800" },
    foodPrice: { color: "#9ef01a", marginTop: 4 },
    addBtn: {
      marginTop: 8,
      backgroundColor: "#22c55e",
      paddingVertical: 6,
      borderRadius: 10,
      alignItems: "center",
    },
    addBtnText: { color: "#052b12", fontWeight: "900" },
    modalBackdrop: {
      flex: 1,
      backgroundColor: "rgba(0,0,0,0.6)",
      justifyContent: "center",
      alignItems: "center",
    },
    modalBox: {
      width: "90%",
      backgroundColor: "#111",
      borderRadius: 16,
      padding: 16,
    },
    modalTitle: { color: "#9ef01a", fontWeight: "900" },
    modalLabel: { color: "#fff", marginTop: 10 },
    optionRow: { flexDirection: "row", gap: 8, marginTop: 6 },
    optionBtn: { padding: 6, backgroundColor: "#333", borderRadius: 8 },
    optionActive: { backgroundColor: "#22c55e" },
    optionText: { color: "#fff" },
    noteInput: {
      borderWidth: 1,
      borderColor: "#444",
      borderRadius: 8,
      padding: 8,
      color: "#fff",
      marginTop: 6,
    },
    modalBtn: { flex: 1, padding: 10, borderRadius: 10 },
  });
