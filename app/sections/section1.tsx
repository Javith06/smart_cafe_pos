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
  { id: "1", label: "1", status: "active", time: "17:24 PM", order: "#1725", amount: "$31.00" },
  { id: "2", label: "2" },
  { id: "3", label: "3" },
  { id: "4", label: "4" },
  { id: "5", label: "5" },
  { id: "6", label: "6" },
  { id: "7", label: "7" },
  { id: "8", label: "8" },
  { id: "9", label: "9" },
  { id: "10", label: "10" },
  { id: "11", label: "11" },
  { id: "12", label: "12" },
  { id: "13", label: "13" },
  { id: "14", label: "14" },
  { id: "15", label: "15" },
  { id: "16", label: "16" },
  { id: "17", label: "17" },
  { id: "18", label: "18" },
  { id: "19", label: "19" },
  { id: "20", label: "20" },
  { id: "21", label: "21" },
  { id: "22", label: "22" },
  { id: "23", label: "23" },
  { id: "24", label: "24" },
  { id: "25", label: "25" },
  { id: "26", label: "26" },
  { id: "27", label: "27" },
  { id: "28", label: "28" },
  { id: "29", label: "29" },
  { id: "30", label: "30" },
  { id: "31", label: "31" },
  { id: "32", label: "32" },
  { id: "33", label: "33" },
  { id: "34", label: "34" },
  { id: "35", label: "35" },
  { id: "36", label: "18-A" },
  { id: "37", label: "19-A" },
  { id: "38", label: "20-A" },
  { id: "39", label: "21-A" },
  { id: "40", label: "22-A" },
];

export default function Section1() {
  const { width, height } = useWindowDimensions();

  const isLandscape = width > height;

  // Portrait -> 5 columns, Landscape/PC -> 10 columns
  const numColumns = isLandscape ? 10 : 5;

  const GAP = 10;
  const SCREEN_PADDING = 20;

  // ✅ Use a centered container width (prevents side overflow on mobile)
  const containerWidth = Math.min(width - SCREEN_PADDING * 2, 900);

  const itemSize =
    (containerWidth - GAP * (numColumns - 1)) / numColumns;

  const numberFont = Math.max(12, Math.min(16, itemSize * 0.28));
  const smallFont = Math.max(9, Math.min(12, itemSize * 0.2));

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
            <Text style={[styles.tableNumber, { color: textColor, fontSize: numberFont }]}>
              {item.label}
            </Text>
            {item.time && <Text style={[styles.smallText, { color: textColor, fontSize: smallFont }]}>{item.time}</Text>}
            {item.order && <Text style={[styles.smallText, { color: textColor, fontSize: smallFont }]}>{item.order}</Text>}
            {item.amount && <Text style={[styles.smallText, { color: textColor, fontSize: smallFont }]}>{item.amount}</Text>}
          </View>
        ) : (
          <Text style={[styles.tableNumber, { color: textColor, fontSize: numberFont }]}>
            {item.label}
          </Text>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.screen}>
      <Text style={styles.header}>SECTION 1 - TABLES</Text>

      <View style={{ alignItems: "center" }}>
        <FlatList
          data={TABLES}
          key={numColumns}
          numColumns={numColumns}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          columnWrapperStyle={{ gap: GAP }}
          contentContainerStyle={{ gap: GAP, padding: SCREEN_PADDING }}
          showsHorizontalScrollIndicator={false}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#0b120b",
  },
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
  tableContent: {
    alignItems: "center",
  },
  tableNumber: {
    fontWeight: "700",
    marginBottom: 2,
  },
  smallText: {
    lineHeight: 14,
    opacity: 0.9,
  },
});
