import { useFocusEffect, useRouter } from "expo-router";
import React, { useCallback, useMemo, useRef, useState } from "react";
import { addToCartGlobal, getCart } from "../cartStore";

import {
  Dimensions,
  FlatList,
  Image,
  ImageBackground,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  useWindowDimensions,
  View,
  ScrollView,
} from "react-native";

/* ================= CONSTANTS ================= */
const CUISINES = [
  { id: "1", name: "THAI KITCHEN", route: "/menu/thai_kitchen", emoji: "🍜" },
  { id: "2", name: "INDIAN KITCHEN", route: "/menu/indian_kitchen", emoji: "🍛" },
  { id: "3", name: "SOUTH INDIAN", route: "/menu/south_indian", emoji: "🥞" },
  { id: "4", name: "WESTERN KITCHEN", route: "/menu/western_kitchen", emoji: "🍔" },
  { id: "5", name: "DRINKS", route: "/menu/drinks", emoji: "🥤" },
];

const ACTIVE_CUISINE = "THAI KITCHEN";

const GROUPS = [
  { id: "g1", name: "Dishes" },
  { id: "g2", name: "Fishes" },
  { id: "g3", name: "Fried_Rice" },
  { id: "g4", name: "Noodles" },
  { id: "g5", name: "Omellete" },
  { id: "g6", name: "Steam_Rice" },
  { id: "g7", name: "Thai_Soup" },
  { id: "g8", name: "Thai_Veg" },
];

/* ================= DATA ================= */
const ITEMS_BY_GROUP: Record<string, { id: string; name: string; price: number }[]> = {
  Dishes: [
    { id: "s1", name: "Tom Yum Soup", price: 8.5 },
    { id: "s2", name: "Tom Kha Soup", price: 9.0 },
  ],
  Fishes: [
    { id: "n1", name: "Pad Thai", price: 12.5 },
    { id: "n2", name: "Drunken Noodles", price: 12.0 },
  ],
  Fried_Rice: [
    { id: "fr1", name: "Green Curry Fried Rice", price: 13.5 },
    { id: "fr2", name: "Red Curry Fried Rice", price: 13.0 },
  ],
  Noodles: [
    { id: "n3", name: "Pad See Ew", price: 13.5 },
    { id: "n4", name: "Drunken Noodles", price: 13.0 },
  ],
  Omellete: [
    { id: "o1", name: "Thai Omelette", price: 13.5 },
    { id: "o2", name: "Crab Omelette", price: 13.0 },
  ],
  Steam_Rice: [
    { id: "r1", name: "Steamed Rice", price: 13.5 },
    { id: "r2", name: "Brown Rice", price: 13.0 },
  ],
  Thai_Soup: [
    { id: "ts1", name: "Tomyam Seafood (S)", price: 13.5 },
    { id: "ts2", name: "Tomyam Seafood (L)", price: 13.0 },
    { id: "ts3", name: "Tomyam Chicken (S)", price: 13.0 },
    { id: "ts4", name: "Tomyam Chicken (L)", price: 13.0 },
    { id: "ts5", name: "Tomyam Beef (S)", price: 13.0 },
    { id: "ts6", name: "Tomyam Beef (L)", price: 13.0 },
    { id: "ts7", name: "OX Tail (S)", price: 13.0 },
    { id: "ts8", name: "OX Tail (L)", price: 13.0 },
    { id: "ts9", name: "Fish Soup (S)", price: 13.0 },
    { id: "ts10", name: "Fish Soup (L)", price: 13.0 },
    { id: "ts11", name: "Chicken Soup (S)", price: 13.0 },
    { id: "ts12", name: "Chicken Soup (L)", price: 13.0 },
    { id: "ts13", name: "Beef Soup (S)", price: 13.0 },
    { id: "ts14", name: "Beef Soup (L)", price: 13.0 },
    { id: "ts15", name: "Veg Soup (S)", price: 13.0 },
    { id: "ts16", name: "Veg Soup (L)", price: 13.0 },
    { id: "ts17", name: "Buka Puasa", price: 13.0 },
    { id: "ts18", name: "Prawn Crackers", price: 13.0 },
    { id: "ts19", name: "Tomyam Fish (S)", price: 13.0 },
    { id: "ts20", name: "Tomyam Fish (L)", price: 13.0 },
  ],
  Thai_Veg: [
    { id: "v1", name: "Stir Fried Veg", price: 11.0 },
    { id: "v2", name: "Thai Veg Curry", price: 12.0 },
  ],
};

/* ================= IMAGES ================= */
const FOOD_IMAGES: Record<string, any> = {
  s1: require("../../assets/images/THAI KItchen/fishes/1.jpg"),
  s2: require("../../assets/images/THAI KItchen/fishes/2.jpg"),
  n1: require("../../assets/images/THAI KItchen/fishes/3.jpg"),
  n3: require("../../assets/images/THAI KItchen/fishes/4.jpg"),
  fr1: require("../../assets/images/THAI KItchen/fishes/5.jpg"),
  fr2: require("../../assets/images/THAI KItchen/fishes/5.jpg"),
};

const DEFAULT_IMAGE = require("../../assets/images/THAI KItchen/fishes/1.jpg");

/* ================= TYPES ================= */
interface FoodItem {
  id: string;
  name: string;
  price: number;
}

/* ================= MAIN COMPONENT ================= */
export default function ThaiKitchen() {
  const router = useRouter();
  const { width, height } = useWindowDimensions();
  const { width: SCREEN_W, height: SCREEN_H } = Dimensions.get("window");
  
  // Refs for scroll
  const groupListRef = useRef<FlatList>(null);
  const itemListRef = useRef<FlatList>(null);

  // Responsive grid calculation
  const numColumns = width >= 1000 ? 11 : width >= 700 ? 3 : 5;
  const GAP = 5;
  const PAD = 20;
  const size = (width - PAD * 2 - GAP * (numColumns - 1)) / numColumns;

  /* ================= STATE ================= */
  const [cart, setCart] = useState(getCart());
  const [selectedGroup, setSelectedGroup] = useState("Thai_Soup");
  const [showCustomize, setShowCustomize] = useState(false);
  const [selectedItem, setSelectedItem] = useState<FoodItem | null>(null);
  
  // Customization options
  const [spicy, setSpicy] = useState("Medium");
  const [oil, setOil] = useState("Normal");
  const [salt, setSalt] = useState("Normal");
  const [note, setNote] = useState("");

  /* ================= COMPUTED ================= */
  const items = ITEMS_BY_GROUP[selectedGroup] || [];
  const totalItems = useMemo(() => cart.reduce((s, i) => s + (i.qty || 0), 0), [cart]);

  /* ================= CART SYNC ================= */
  useFocusEffect(
    useCallback(() => {
      setCart([...getCart()]);
    }, [])
  );

  /* ================= HANDLERS ================= */
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
      ...selectedItem,
      spicy,
      oil,
      salt,
      note,
    });

    setCart([...getCart()]);
    setShowCustomize(false);
  };

  // Scroll to top when group changes
  const handleGroupChange = (groupName: string) => {
    setSelectedGroup(groupName);
    // Scroll to top of items
    if (itemListRef.current) {
      itemListRef.current.scrollToOffset({ offset: 0, animated: true });
    }
  };

  /* ================= RENDER HELPERS ================= */
  const getCardHeight = () => {
    // Dynamic height based on screen size
    if (width < 600) return size * 1.4; // Mobile
    if (width < 1000) return size * 1.35; // Tablet
    return size * 1.3; // Desktop
  };

  const getImageHeight = () => {
    return "52%"; // Fixed percentage for consistency
  };

 const renderFoodItem = ({ item, index }: { item: FoodItem; index: number }) => {
  const cardHeight = getCardHeight();

  return (
    <TouchableOpacity
      style={[styles.foodCard, { width: size, height: cardHeight }]}
      onPress={() => openCustomize(item)}
      activeOpacity={0.7}
    >
      <View style={styles.foodImageBox}> {/* StyleSheet la already percentage irukku */}
        <Image
          source={FOOD_IMAGES[item.id] || DEFAULT_IMAGE}
          style={styles.foodImage}
          resizeMode="cover"
        />
      </View>

      <View style={styles.foodInfo}>
        <View>
          <Text
            style={styles.foodName}
            numberOfLines={2}
            ellipsizeMode="tail"
          >
            {item.name}
          </Text>
          <Text style={styles.foodPrice}>$ {item.price.toFixed(2)}</Text>
        </View>

        <View style={styles.addBtn}>
          <Text style={styles.addBtnText}>Customize</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

// Remove getImageHeight function - not needed

  const renderCuisineItem = ({ item }: { item: typeof CUISINES[0] }) => {
    const active = item.name === ACTIVE_CUISINE;
    return (
      <TouchableOpacity
        style={[styles.cuisineCard, active ? styles.cuisineActive : styles.cuisineInactive]}
        onPress={() => !active && router.push(item.route as any)}
      >
        <Text style={styles.cuisineEmoji}>{item.emoji}</Text>
        <Text style={styles.cuisineText}>{item.name}</Text>
      </TouchableOpacity>
    );
  };

  const renderGroupItem = ({ item }: { item: typeof GROUPS[0] }) => {
    const active = item.name === selectedGroup;
    return (
      <TouchableOpacity
        style={[styles.groupChip, active ? styles.groupActive : styles.groupInactive]}
        onPress={() => handleGroupChange(item.name)}
      >
        <Text style={{ color: active ? "#052b12" : "#fff", fontWeight: "800" }}>
          {item.name.replace('_', ' ')}
        </Text>
      </TouchableOpacity>
    );
  };

  /* ================= MAIN RENDER ================= */
  return (
    <View style={{ flex: 1 }}>
      <ImageBackground
        source={require("../../assets/images/11.jpg")}
        style={{ width: SCREEN_W, height: SCREEN_H }}
      >
        <View style={styles.overlay}>
          {/* Header - Fixed */}
          <View style={styles.header}>
            <Text style={styles.title}>THAI KITCHEN</Text>

            <View style={{ flexDirection: "row", gap: 8 }}>
              <Pressable onPress={() => router.replace("/menu/dishes")} style={styles.headerBtn}>
                <Text style={styles.headerBtnText}>Back</Text>
              </Pressable>

              <Pressable onPress={() => router.push("/cart")} style={styles.cartBtn}>
                <Text style={styles.cartText}>Cart</Text>
                {totalItems > 0 && (
                  <View style={styles.badge}>
                    <Text style={styles.badgeText}>{totalItems}</Text>
                  </View>
                )}
              </Pressable>
            </View>
          </View>

          {/* Cuisine Bar - Fixed */}
          <FlatList
            data={CUISINES}
            horizontal
            keyExtractor={(i) => i.id}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ gap: 12, padding: 12 }}
            renderItem={renderCuisineItem}
            style={{ maxHeight: 110 }}
          />

          {/* Group Bar - Fixed */}
          <FlatList
            ref={groupListRef}
            data={GROUPS}
            horizontal
            keyExtractor={(i) => i.id}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ gap: 10, paddingHorizontal: 12 }}
            renderItem={renderGroupItem}
            style={{ maxHeight: 50 }}
          />

          {/* Items Grid - Scrollable */}
          <FlatList
            ref={itemListRef}
            data={items}
            numColumns={numColumns}
            key={numColumns + selectedGroup}
            keyExtractor={(i) => i.id}
            columnWrapperStyle={{ 
              gap: GAP, 
              justifyContent: "flex-start",
            }}
            contentContainerStyle={{ 
              gap: GAP, 
              padding: PAD,
              paddingBottom: 100,
            }}
            renderItem={renderFoodItem}
            showsVerticalScrollIndicator={true}
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>No items in this category</Text>
              </View>
            }
            // Performance props
            removeClippedSubviews={true}
            maxToRenderPerBatch={10}
            windowSize={5}
            initialNumToRender={8}
          />
        </View>

        {/* Customization Modal */}
        <Modal visible={showCustomize} transparent animationType="slide">
          <View style={styles.modalBackdrop}>
            <ScrollView contentContainerStyle={styles.modalScrollView}>
              <View style={styles.modalBox}>
                <Text style={styles.modalTitle}>Customize: {selectedItem?.name}</Text>

                {/* Spicy Options */}
                <Text style={styles.modalLabel}>Spicy Level</Text>
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

                {/* Oil Options */}
                <Text style={styles.modalLabel}>Oil</Text>
                <View style={styles.optionRow}>
                  {["Less", "Normal", "Extra"].map((v) => (
                    <TouchableOpacity
                      key={v}
                      onPress={() => setOil(v)}
                      style={[styles.optionBtn, oil === v && styles.optionActive]}
                    >
                      <Text style={styles.optionText}>{v}</Text>
                    </TouchableOpacity>
                  ))}
                </View>

                {/* Salt Options */}
                <Text style={styles.modalLabel}>Salt</Text>
                <View style={styles.optionRow}>
                  {["Less", "Normal", "Extra"].map((v) => (
                    <TouchableOpacity
                      key={v}
                      onPress={() => setSalt(v)}
                      style={[styles.optionBtn, salt === v && styles.optionActive]}
                    >
                      <Text style={styles.optionText}>{v}</Text>
                    </TouchableOpacity>
                  ))}
                </View>

                {/* Special Note */}
                <Text style={styles.modalLabel}>Special Note</Text>
                <TextInput
                  placeholder="Special instruction..."
                  placeholderTextColor="#888"
                  value={note}
                  onChangeText={setNote}
                  style={styles.noteInput}
                  multiline
                  numberOfLines={3}
                />

                {/* Modal Buttons */}
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
                    <Text style={{ color: "#052b12", textAlign: "center", fontWeight: "900" }}>
                      Add to Cart
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </ScrollView>
          </View>
        </Modal>
      </ImageBackground>
    </View>
  );
}

/* ================= STYLES ================= */
const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.45)",
  },

  header: {
    height: 60,
    backgroundColor: "rgba(0,0,0,0.6)",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 12,
  },

  title: {
    color: "#9ef01a",
    fontWeight: "800",
    fontSize: 16,
  },

  headerBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: "rgba(255,255,255,0.3)",
  },

  headerBtnText: {
    color: "#fff",
    fontWeight: "600",
  },

  cartBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: "rgba(34,197,94,0.8)",
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },

  cartText: {
    color: "#052b12",
    fontWeight: "900",
  },

  badge: {
    minWidth: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: "#ef4444",
    justifyContent: "center",
    alignItems: "center",
  },

  badgeText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "600",
  },

  cuisineCard: {
    width: 110,
    height: 85,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
    padding: 8,
  },

  cuisineActive: {
    backgroundColor: "rgba(34,197,94,0.9)",
  },

  cuisineInactive: {
    backgroundColor: "rgba(20,20,20,0.7)",
  },

  cuisineEmoji: {
    fontSize: 24,
    marginBottom: 4,
  },

  cuisineText: {
    color: "#fff",
    fontWeight: "800",
    fontSize: 11,
    textAlign: "center",
  },

  groupChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
  },

  groupActive: {
    backgroundColor: "rgba(34,197,94,0.9)",
  },

  groupInactive: {
    backgroundColor: "rgba(0,0,0,0.6)",
  },

  foodCard: {
    borderRadius: 18,
    overflow: "hidden",
    backgroundColor: "rgba(0,0,0,0.75)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
  },

  foodImageBox: {
    width: "100%",
    backgroundColor: "#000",
  },

  foodImage: {
    width: "100%",
    height: "100%",
  },

  foodInfo: {
    padding: 30,
    flex: 1,
    justifyContent: "space-between",
  },

  foodName: {
    color: "#fff",
    fontWeight: "800",
    fontSize: 13,
  },

  foodPrice: {
    color: "#9ef01a",
    marginTop: 4,
    fontWeight: "700",
    fontSize: 13,
  },

  addBtn: {
    marginTop: 6,
    backgroundColor: "#22c55e",
    paddingVertical: 6,
    borderRadius: 8,
    alignItems: "center",
    width: "100%",
  },

  addBtnText: {
    color: "#052b12",
    fontWeight: "900",
    fontSize: 11,
  },

  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 40,
    minHeight: 200,
  },

  emptyText: {
    color: "#fff",
    fontSize: 16,
    opacity: 0.7,
  },

  modalBackdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.8)",
    justifyContent: "center",
    alignItems: "center",
  },

  modalScrollView: {
    flexGrow: 1,
    justifyContent: "center",
    width: "100%",
    alignItems: "center",
    paddingVertical: 20,
  },

  modalBox: {
    width: "90%",
    backgroundColor: "#111",
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
  },

  modalTitle: {
    color: "#9ef01a",
    fontWeight: "900",
    fontSize: 18,
    marginBottom: 10,
  },

  modalLabel: {
    color: "#fff",
    marginTop: 15,
    fontWeight: "600",
    fontSize: 14,
  },

  optionRow: {
    flexDirection: "row",
    gap: 10,
    marginTop: 8,
    flexWrap: "wrap",
  },

  optionBtn: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: "#333",
    borderRadius: 20,
    minWidth: 70,
    alignItems: "center",
  },

  optionActive: {
    backgroundColor: "#22c55e",
  },

  optionText: {
    color: "#fff",
    fontWeight: "500",
  },

  noteInput: {
    borderWidth: 1,
    borderColor: "#444",
    borderRadius: 12,
    padding: 12,
    color: "#fff",
    marginTop: 8,
    textAlignVertical: "top",
    minHeight: 100,
    backgroundColor: "#222",
  },

  modalBtn: {
    flex: 1,
    padding: 14,
    borderRadius: 12,
  },
});