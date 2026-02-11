import React from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  useWindowDimensions,
} from "react-native";

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
  { id: "2", label: "37" },
  { id: "3", label: "38" },
  { id: "4", label: "39" },
  { id: "5", label: "40" },
  { id: "6", label: "41" },
  { id: "7", label: "42" },
  { id: "8", label: "43" },
  { id: "9", label: "44" },
  { id: "10", label: "45" },
  { id: "11", label: "PU1" },
  { id: "12", label: "PU2" },
  { id: "13", label: "PU3" },
  { id: "14", label: "PU4" },
  { id: "15", label: "PU5" },
  { id: "16", label: "PU6" },
  { id: "17", label: "PU7" },
  { id: "18", label: "PU8" },
  { id: "19", label: "PU9" },
  { id: "20", label: "PU10" },
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
    let bgColor = "#1f2a1f";
    let borderColor = "#2f3d2f";
    let textColor = "#e5f0e5";

    if (item.status === "active") {
      bgColor = "#97bc49";
      borderColor = "#b6e06b";
      textColor = "#0b1406";
    }

    return (
      <TouchableOpacity
        style={[
          styles.tableBox,
          {
            width: itemSize,
            height: itemSize,
            backgroundColor: bgColor,
            borderColor: borderColor,
          },
        ]}
        activeOpacity={0.85}
        onPress={() => alert("Table " + item.label + " clicked")}
      >
        {item.status ? (
          <View style={styles.tableContent}>
            <Text style={[styles.tableNumber, { color: textColor, fontSize: numberFont }]}>{item.label}</Text>
            {item.time && <Text style={[styles.smallText, { color: textColor, fontSize: smallFont }]}>{item.time}</Text>}
            {item.order && <Text style={[styles.smallText, { color: textColor, fontSize: smallFont }]}>{item.order}</Text>}
            {item.amount && <Text style={[styles.smallText, { color: textColor, fontSize: smallFont }]}>{item.amount}</Text>}
          </View>
        ) : (
          <Text style={[styles.tableNumber, { color: textColor, fontSize: numberFont }]}>{item.label}</Text>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.screen}>
      <Text style={styles.header}>SECTION 2 - TABLES</Text>

      <FlatList
        data={TABLES}
        key={numColumns}
        numColumns={numColumns}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        columnWrapperStyle={{ gap: GAP }}
        contentContainerStyle={{ gap: GAP, padding: SCREEN_PADDING }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#0b120b" },
  header: {
    color: "#97bc49",
    fontSize: 24,
    fontWeight: "700",
    textAlign: "center",
    marginTop: 16,
    marginBottom: 8,
    letterSpacing: 0.5,
  },
  tableBox: {
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1.5,
    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 4,
  },
  tableContent: { alignItems: "center" },
  tableNumber: { fontWeight: "700", marginBottom: 2 },
  smallText: { lineHeight: 14, opacity: 0.9 },
});
