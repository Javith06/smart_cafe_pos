import React from "react";
import { View, Text, StyleSheet, FlatList, TouchableOpacity, useWindowDimensions } from "react-native";

type TableItem = { id: string; label: string; status?: "busy" | "active" | "free"; time?: string; order?: string; amount?: string; };

const TABLES: TableItem[] = [
  { id: "1", label: "D21", status: "active", time: "17:24 PM", order: "#1725", amount: "$31.00" },
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
  const isLandscape = width > height;
  const numColumns = isLandscape ? 10 : 5;

  const GAP = 10;
  const SCREEN_PADDING = 20;
  const itemSize = (width - SCREEN_PADDING * 2 - GAP * (numColumns - 1)) / numColumns;

  const numberFont = Math.max(14, Math.min(18, itemSize * 0.28));
  const smallFont = Math.max(10, Math.min(13, itemSize * 0.2));

  const renderItem = ({ item }: { item: TableItem }) => {
    let bgColor = "#1f2a1f"; let borderColor = "#2f3d2f"; let textColor = "#e5f0e5";
    if (item.status === "active") { bgColor = "#97bc49"; borderColor = "#b6e06b"; textColor = "#0b1406"; }

    return (
      <TouchableOpacity style={[styles.tableBox,{ width: itemSize, height: itemSize, backgroundColor: bgColor, borderColor }]} activeOpacity={0.85}>
        <Text style={[styles.tableNumber,{ color: textColor, fontSize: numberFont }]}>{item.label}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.screen}>
      <Text style={styles.header}>SECTION 3 - TABLES</Text>
      <FlatList data={TABLES} key={numColumns} numColumns={numColumns} keyExtractor={(i)=>i.id} renderItem={renderItem}
        columnWrapperStyle={{ gap: GAP }} contentContainerStyle={{ gap: GAP, padding: SCREEN_PADDING }} />
    </View>
  );
}

const styles = StyleSheet.create({
  screen:{ flex:1, backgroundColor:"#0b120b" },
  header:{ color:"#97bc49", fontSize:24, fontWeight:"700", textAlign:"center", marginTop:16, marginBottom:8 },
  tableBox:{ borderRadius:12, justifyContent:"center", alignItems:"center", borderWidth:1.5, elevation:4 },
  tableNumber:{ fontWeight:"700" },
});
