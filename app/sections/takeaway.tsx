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
  { id: "1", label: "T1", status: "active", time: "17:24 PM", order: "#1725", amount: "$31.00" },
  { id: "2", label: "T2" },
  { id: "3", label: "T3" },
  { id: "4", label: "T4" },
  { id: "5", label: "T5" },
  { id: "6", label: "T6" },
  { id: "7", label: "T7" },
  { id: "8", label: "T8" },
  { id: "9", label: "T9" },
  { id: "10", label: "T10" },
  { id: "11", label: "T11" },
  { id: "12", label: "T12" },
  { id: "13", label: "T13" },
  { id: "14", label: "T14" },
  { id: "15", label: "T15" },
  { id: "16", label: "T16" },
  { id: "17", label: "T17" },
  { id: "18", label: "T18" },
  { id: "19", label: "T19" },
  { id: "20", label: "T20" },
  { id: "21", label: "D1" },
  { id: "22", label: "D2" },
  { id: "23", label: "D3" },
  { id: "24", label: "D4" },
  { id: "25", label: "D5" },
  { id: "26", label: "D6" },
  { id: "27", label: "D7" },
  { id: "28", label: "D8" },
  { id: "29", label: "D9" },
  { id: "30", label: "D10" },
  { id: "31", label: "D11" },
  { id: "32", label: "D12" },
  { id: "33", label: "D13" },
  { id: "34", label: "D14" },
  { id: "35", label: "D15" },
  { id: "36", label: "D16" },
  { id: "37", label: "D17" },
  { id: "38", label: "D18" },
  { id: "39", label: "D19" },
  { id: "40", label: "D20" },
];

export default function Takeaway() {
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
        onPress={() => alert("Order " + item.label + " clicked")}
      >
        {item.status ? (
          <View style={styles.tableContent}>
            <Text style={[styles.tableNumber, { color: textColor, fontSize: numberFont }]}>
              {item.label}
            </Text>
            {item.time && (
              <Text style={[styles.smallText, { color: textColor, fontSize: smallFont }]}>
                {item.time}
              </Text>
            )}
            {item.order && (
              <Text style={[styles.smallText, { color: textColor, fontSize: smallFont }]}>
                {item.order}
              </Text>
            )}
            {item.amount && (
              <Text style={[styles.smallText, { color: textColor, fontSize: smallFont }]}>
                {item.amount}
              </Text>
            )}
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
      <Text style={styles.header}>TAKEAWAY</Text>

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
