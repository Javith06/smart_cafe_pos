import React from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  useWindowDimensions,
  ImageBackground,
} from "react-native";
import { BlurView } from "expo-blur";

type TableItem = {
  id: string;
  label: string;
  status?: "busy" | "active" | "free";
  time?: string;
  order?: string;
  amount?: string;
};

const TABLES: TableItem[] = [
  { id: "1", label: "36", status: "active", time: "17:24 PM", order: "#1725", amount: "$31.00" },
  { id: "2", label: "37" }, { id: "3", label: "38" }, { id: "4", label: "39" }, { id: "5", label: "40" },
  { id: "6", label: "41" }, { id: "7", label: "42" }, { id: "8", label: "43" }, { id: "9", label: "44" },
  { id: "10", label: "45" }, { id: "11", label: "PU1" }, { id: "12", label: "PU2" }, { id: "13", label: "PU3" },
  { id: "14", label: "PU4" }, { id: "15", label: "PU5" }, { id: "16", label: "PU6" }, { id: "17", label: "PU7" },
  { id: "18", label: "PU8" }, { id: "19", label: "PU9" }, { id: "20", label: "PU10" },
];

export default function Section2() {
  const { width, height } = useWindowDimensions();
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
        onPress={() => alert("Table " + item.label + " clicked")}
      >
        <BlurView
          intensity={isActive ? 45 : 35}
          tint="dark"
          style={styles.glassInner}
        >
          {item.status ? (
            <View style={styles.tableContent}>
              <Text
                style={[
                  styles.tableNumber,
                  {
                    fontSize: numberFont,
                    color: isActive ? "#d7ff9a" : "#ffffff",
                  },
                ]}
              >
                {item.label}
              </Text>

              {item.time && (
                <Text style={[styles.smallText, { fontSize: smallFont }]}>
                  {item.time}
                </Text>
              )}
              {item.order && (
                <Text style={[styles.smallText, { fontSize: smallFont }]}>
                  {item.order}
                </Text>
              )}
              {item.amount && (
                <Text style={[styles.smallText, { fontSize: smallFont }]}>
                  {item.amount}
                </Text>
              )}
            </View>
          ) : (
            <Text
              style={[
                styles.tableNumber,
                { fontSize: numberFont, color: "#ffffff" },
              ]}
            >
              {item.label}
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

      <Text style={styles.header}>SECTION 2 - TABLES</Text>

      <FlatList
        data={TABLES}
        key={numColumns}
        numColumns={numColumns}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        columnWrapperStyle={{ gap: GAP }}
        contentContainerStyle={{ gap: GAP, padding: SCREEN_PADDING, paddingBottom: 30 }}
      />
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: { flex: 1, width: "100%", height: "100%" },
  overlay: { ...StyleSheet.absoluteFillObject, backgroundColor: "rgba(0,0,0,0.45)" },

  header: {
    color: "#d7ff9a",
    fontSize: 24,
    fontWeight: "900",
    textAlign: "center",
    marginTop: 16,
    marginBottom: 8,
    letterSpacing: 0.6,
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
  tableContent: { alignItems: "center" },

  tableNumber: {
    fontWeight: "900",
    marginBottom: 2,
    textShadowColor: "rgba(0,0,0,0.7)",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
    letterSpacing: 0.3,
  },

  smallText: { lineHeight: 14, opacity: 0.95, fontWeight: "600", color: "#eaeaea" },
});
