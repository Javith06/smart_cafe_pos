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
  Image,
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

const ACTIVE_KITCHEN = "SOUTH INDIAN";

/* ================= GROUPS ================= */
const GROUPS = [
  { id: "g1", name: "Prata" },
  { id: "g2", name: "Murtabak" },
  { id: "g3", name: "Roti John Menu" },
  { id: "g4", name: "Dosai" },
  { id: "g5", name: "Bites" },
  { id: "g6", name: "Prata Main Course" },
  { id: "g7", name: "Roti John Combo" },
];

/* ================= ITEMS ================= */
const ITEMS_BY_GROUP: Record<string, FoodItem[]> = {
  Prata: [
    { id: "prata_1", name: "Plain", price: 5.5 },
    { id: "prata_2", name: "Onion Plain", price: 4.0 },
    { id: "prata_3", name: "Egg Prata", price: 6.5 },
    { id: "prata_4", name: "Egg Onion", price: 6.5 },
    { id: "prata_5", name: "Plaster Prata", price: 6.5 },
    { id: "prata_6", name: "Bomb Prata", price: 6.5 },
    { id: "prata_7", name: "Tissue Classic Prata", price: 6.5 },
    { id: "prata_8", name: "Banana Prata", price: 6.5 },
    { id: "prata_9", name: "Cheese Prata", price: 6.5 },
    { id: "prata_10", name: "Cheese Mushroom Prata", price: 6.5 },
    { id: "prata_11", name: "Cheese Egg Prata", price: 6.5 },
    { id: "prata_12", name: "Tissue Prata", price: 6.5 },
    { id: "prata_13", name: "Cheese Sausage Prata", price: 6.5 },
    { id: "prata_14", name: "Open Item Prata", price: 6.5 },
    { id: "prata_15", name: "Bomb & Cheese Prata", price: 6.5 },
    { id: "prata_16", name: "Ice Cream Prata", price: 6.5 },
    { id: "prata_17", name: "Square Prata", price: 6.5 },
    { id: "prata_18", name: "Cheese Onion Prata", price: 6.5 },
    { id: "prata_19", name: "Prata Tsunami", price: 6.5 },
  ],

  Murtabak: [
    { id: "murta_1", name: "Murtabak Sardine", price: 9.5 },
    { id: "murta_2", name: "Murtabak Sardine (L)", price: 11.5 },
    { id: "murta_3", name: "Murtabak Corn Beef", price: 9.5 },
    { id: "murta_4", name: "Murtabak Corn Beef (L)", price: 11.5 },
    { id: "murta_5", name: "Murtabak Tuna", price: 9.5 },
    { id: "murta_6", name: "Murtabak Chicken", price: 9.5 },
    { id: "murta_7", name: "Murtabak Chicken (L)", price: 11.5 },
    { id: "murta_8", name: "Murtabak Mutton", price: 10.5 },
    { id: "murta_9", name: "Murtabak Mutton (L)", price: 12.5 },
    { id: "murta_10", name: "Murtabak Veggie", price: 8.5 },
    { id: "murta_11", name: "Murtabak Veggie (L)", price: 10.5 },
    { id: "murta_12", name: "Add-on Cheese", price: 1.5 },
    { id: "murta_13", name: "Murtabak Tuna in Mayonnaise (L)", price: 12.5 },
  ],

  "Roti John Menu": [
    { id: "rj_1", name: "RJ Classic", price: 2.5 },
    { id: "rj_2", name: "Chicken Sausage Cheese", price: 3.0 },
    { id: "rj_3", name: "Beef Ball Cheese", price: 3.5 },
    { id: "rj_4", name: "Teriyaki Chicken with Cheese", price: 3.5 },
  ],

  Dosai: [
    { id: "dosai_1", name: "Dosai", price: 2.5 },
    { id: "dosai_2", name: "Onion Dosai", price: 3.0 },
    { id: "dosai_3", name: "Egg Dosai", price: 3.5 },
    { id: "dosai_4", name: "Egg & Onion Dosai", price: 4.0 },
    { id: "dosai_5", name: "Paper Roast", price: 3.5 },
    { id: "dosai_6", name: "Masala Dosai", price: 4.5 },
    { id: "dosai_7", name: "Cheese Dosai", price: 4.5 },
    { id: "dosai_8", name: "Egg Masala Dosai", price: 5.0 },
    { id: "dosai_9", name: "2 Idli Vadai", price: 4.5 },
  ],

  Bites: [
    { id: "bite_1", name: "Laksa", price: 6.5 },
    { id: "bite_2", name: "Mee Siam", price: 6.0 },
    { id: "bite_3", name: "Mee Soto", price: 6.5 },
    { id: "bite_4", name: "Mee Rebus", price: 6.5 },
    { id: "bite_5", name: "Lontong", price: 6.0 },
    { id: "bite_6", name: "Nasi Lemak Ayam", price: 7.5 },
  ],

  "Prata Main Course": [
    { id: "pmc_1", name: "Chicken Masala (S)", price: 5.5 },
    { id: "pmc_2", name: "Mutton Masala (S)", price: 6.5 },
    { id: "pmc_3", name: "Fish Masala (S)", price: 6.0 },
  ],

  "Roti John Combo": [{ id: "combo_1", name: "Roti John Combo", price: 8.5 }],
};


/* ================= IMAGES ================= */
const FOOD_IMAGES: Record<string, any> = { 

  //--------------PRATA---------//

 prata_1: require("../../assets/images/south_indian/Prata/Plain Parotta.jpg"),
prata_2: require("../../assets/images/south_indian/Prata/onion prata.jpg"),
prata_3: require("../../assets/images/south_indian/Prata/Egg Paratha.jpg"),
prata_4: require("../../assets/images/south_indian/Prata/Egg Onion Prata.jpg"),
prata_5: require("../../assets/images/south_indian/Prata/plaster prata.jpg"),
prata_6: require("../../assets/images/south_indian/Prata/Bomb Prata.jpg"),
prata_7: require("../../assets/images/south_indian/Prata/Tissue Classic Prata.jpg"),
prata_8: require("../../assets/images/south_indian/Prata/Banana prata.jpg"),
prata_9: require("../../assets/images/south_indian/Prata/cheese prata.jpg"),
prata_10: require("../../assets/images/south_indian/Prata/cheese mush prata.jpg"),
prata_11: require("../../assets/images/south_indian/Prata/Cheese Egg Prata.jpg"),
prata_12: require("../../assets/images/south_indian/Prata/Tissue Prata.jpg"),
prata_13: require("../../assets/images/south_indian/Prata/cheese Sausage parota.jpg"),
prata_14: require("../../assets/images/south_indian/Prata/OPEN ITEM PRATA.jpg"),
prata_15: require("../../assets/images/south_indian/Prata/bomb & Cheese Parotta.jpg"),
prata_16: require("../../assets/images/south_indian/Prata/ice cream Parotta.jpg"),
prata_17: require("../../assets/images/south_indian/Prata/Square prata.jpg"),
prata_18: require("../../assets/images/south_indian/Prata/cheese onion parotta.jpg"),
prata_19: require("../../assets/images/south_indian/Prata/parotta tsunami.jpg"),

//---------MUTABAK------//

murta_1: require("../../assets/images/south_indian/Mutabak/murtabak sardine.jpg"),
murta_3: require("../../assets/images/south_indian/Mutabak/murtabak corn beef.jpg"),
murta_5: require("../../assets/images/south_indian/Mutabak/murtabak Tuna.jpg"),
murta_6: require("../../assets/images/south_indian/Mutabak/murtabak chicken.jpg"),
murta_8: require("../../assets/images/south_indian/Mutabak/murtabak mutton.jpg"),
murta_10: require("../../assets/images/south_indian/Mutabak/murtabak veggie.jpg"),
murta_12: require("../../assets/images/south_indian/Mutabak/ADD ON CHEESE.jpg"),
murta_13: require("../../assets/images/south_indian/Mutabak/murtabak Tuna.jpg"),

//----------BITES-------//

bite_1: require("../../assets/images/south_indian/Bites/laksa.jpg"),
bite_2: require("../../assets/images/south_indian/Bites/Mee Siam.jpg"),
bite_3: require("../../assets/images/south_indian/Bites/mee soto.jpg"),
bite_4: require("../../assets/images/south_indian/Bites/Mee Rebus.jpg"),
bite_5: require("../../assets/images/south_indian/Bites/Lontong.jpg"),
bite_6: require("../../assets/images/south_indian/Bites/Nasi Lemak Ayam.jpg"),

//----------DOSAI--------//

dosai_1: require("../../assets/images/south_indian/Dosi/dosai.jpg"),
dosai_2: require("../../assets/images/south_indian/Dosi/onion dosai.jpg"),
dosai_3: require("../../assets/images/south_indian/Dosi/Egg Dosa Recipe.jpg"),
dosai_4: require("../../assets/images/south_indian/Dosi/egg & onion dosai.jpg"),
dosai_5: require("../../assets/images/south_indian/Dosi/Paper Roast.jpg"),
dosai_6: require("../../assets/images/south_indian/Dosi/masala.jpg"),
dosai_7: require("../../assets/images/south_indian/Dosi/cheese dosa.jpg"),
dosai_8: require("../../assets/images/south_indian/Dosi/Egg Masala.jpg"),
dosai_9: require("../../assets/images/south_indian/Dosi/2 idili vadai.jpg"),

//---------PRATA MAIN COURSE-------//

pmc_1: require("../../assets/images/south_indian/Prata Main Course/chicken masala.jpg"),
pmc_2: require("../../assets/images/south_indian/Prata Main Course/mutton masala.jpg"),
pmc_3: require("../../assets/images/south_indian/Prata Main Course/fish masala.jpg"),

//--------ROTI JOHN MENU-------//

rj_1: require("../../assets/images/south_indian/Roti John Menu/roti john classic.jpg"),
rj_2: require("../../assets/images/south_indian/Roti John Menu/chicken Sausage cheese.jpg"),
rj_3: require("../../assets/images/south_indian/Roti John Menu/beefball cheese.jpg"),
rj_4: require("../../assets/images/south_indian/Roti John Menu/Teriyaki Chicken W Cheese.jpg"),

//---------ROTI JOHN COMBO--------//

combo_1: require("../../assets/images/south_indian/Roti John Combo/roti john combo.jpg"),



};
const DEFAULT_IMAGE = require("../../assets/images/indian/basmati_rice/Chicken Briyani.jpg");

interface FoodItem {
  id: string;
  name: string;
  price: number;
}

export default function SouthIndian() {
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
  const [selectedGroup, setSelectedGroup] = useState("Prata");

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

        <Text style={styles.title}>SOUTH INDIAN</Text>

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
  foodImage: {
  width: "100%",
  height: "100%",
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
