import { BlurView } from "expo-blur";
import { useRouter } from "expo-router";
import React from "react";
import {
  FlatList,
  ImageBackground,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";
import { setOrderContext } from "../orderContextStore";

type TableItem = {
  id: string;
  label: string;
  status?: "busy" | "active" | "free";
  time?: string;
  order?: string;
  amount?: string;
};

const TABLES: TableItem[] = [
  {
    id: "1",
    label: "D21",
    status: "active",
    time: "17:24 PM",
    order: "#1725",
    amount: "$31.00",
  },
  { id: "2", label: "D22" },
  { id: "3", label: "D23" },
  { id: "4", label: "D24" },
  { id: "5", label: "D25" },
  { id: "6", label: "D26" },
  { id: "7", label: "D27" },
  { id: "8", label: "D28" },
  { id: "9", label: "D29" },
  { id: "10", label: "D30" },
  { id: "11", label: "D31" },
  { id: "12", label: "D32" },
  { id: "13", label: "D33" },
  { id: "14", label: "D34" },
  { id: "15", label: "D35" },
  { id: "16", label: "D36" },
  { id: "17", label: "D37" },
  { id: "18", label: "D38" },
  { id: "19", label: "D39" },
  { id: "20", label: "D40" },
];

export default function Section3() {
  const { width, height } = useWindowDimensions();
  const router = useRouter();

  const isLandscape = width > height;
  const numColumns = isLandscape ? 10 : 5;

  const GAP = 10;
  const SCREEN_PADDING = 20;

  const itemSize =
    (width - SCREEN_PADDING * 2 - GAP * (numColumns - 1)) / numColumns;

  const numberFont = Math.max(14, Math.min(18, itemSize * 0.28));
  const smallFont = Math.max(10, Math.min(13, itemSize * 0.2));

  const renderItem = ({ item }: { item: TableItem }) => {
    const isActive = item.status === "active";

    return (
      <TouchableOpacity
        style={[
          styles.tableBox,
          {
            width: itemSize,
            height: itemSize,
            borderColor: isActive
              ? "rgba(190,255,120,0.8)"
              : "rgba(255,255,255,0.35)",
          },
        ]}
        activeOpacity={0.85}
        onPress={() => {
          setOrderContext({
            orderType: "DINE_IN",
            section: "SECTION_3",
            tableNo: item.label,
          });

          router.push("/menu/thai_kitchen");
        }}
      >
        <BlurView
          intensity={isActive ? 45 : 35}
          tint="dark"
          style={styles.glassInner}
        >
          <Text
            style={[
              styles.tableNumber,
              { fontSize: numberFont, color: isActive ? "#d7ff9a" : "#ffffff" },
            ]}
          >
            {item.label}
          </Text>

          {item.status && item.time && (
            <Text style={[styles.smallText, { fontSize: smallFont }]}>
              {item.time}
            </Text>
          )}
        </BlurView>
      </TouchableOpacity>
    );
  };

  return (
    <ImageBackground
      source={require("../../assets/images/11.jpg")}
      style={styles.background}
      resizeMode="cover"
    >
      <View style={styles.overlay} />

      {/* ===== Top Bar ===== */}
      <View style={styles.topBar}>
        <View style={{ width: 60 }} />

        <Text style={styles.headerTitle}>SECTION 3</Text>

        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <Text style={styles.backText}>Back</Text>
        </Pressable>
      </View>

      <FlatList
        data={TABLES}
        key={numColumns}
        numColumns={numColumns}
        keyExtractor={(i) => i.id}
        renderItem={renderItem}
        columnWrapperStyle={{ gap: GAP }}
        contentContainerStyle={{
          gap: GAP,
          padding: SCREEN_PADDING,
          paddingBottom: 30,
        }}
      />
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: { flex: 1, width: "100%", height: "100%" },

  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.45)",
  },

  /* ===== Top Bar ===== */
  topBar: {
    height: 56,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    backgroundColor: "rgba(0,0,0,0.6)",
  },

  backBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: "rgba(255,255,255,0.15)",
  },

  backText: {
    color: "#ffffff",
    fontWeight: "700",
    fontSize: 14,
  },

  headerTitle: {
    color: "#d7ff9a",
    fontSize: 18,
    fontWeight: "800",
    letterSpacing: 0.5,
  },

  tableBox: {
    borderRadius: 14,
    overflow: "hidden",
    borderWidth: 1.2,
    shadowColor: "#00000000",
    shadowOpacity: 0.35,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
    backgroundColor: "rgba(255,255,255,0.08)",
  },

  glassInner: { flex: 1, justifyContent: "center", alignItems: "center" },

  tableNumber: {
    fontWeight: "900",
    textShadowColor: "rgba(0,0,0,0.7)",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
    letterSpacing: 0.3,
  },

  smallText: {
    lineHeight: 14,
    opacity: 0.95,
    fontWeight: "600",
    color: "#eaeaea",
  },
});
