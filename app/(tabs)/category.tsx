import React from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from "react-native";

export default function Category() {
  const { width } = useWindowDimensions();

  // Web-friendly sizing
  const containerWidth = Math.min(width - 80, 520);
  const GAP = 14;

  const boxWidth = (containerWidth - GAP) / 2;
  const boxHeight = boxWidth * 0.75; // rectangle to avoid "filled" look

  const categories = ["Section 1", "Section 2", "Section 3", "Take Away"];

  return (
    <View style={styles.screen}>
      <Text style={styles.title}>Choose Your Category</Text>

      <View style={[styles.gridContainer, { width: containerWidth }]}>
        {categories.map((item) => (
          <TouchableOpacity
            key={item}
            style={[
              styles.box,
              { width: boxWidth, height: boxHeight },
            ]}
            activeOpacity={0.85}
          >
            <Text style={styles.boxText}>{item}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#0f172a",
    paddingTop: 40,          // push content upward
    alignItems: "center",    // ❌ no justifyContent center
  },
  title: {
    fontSize: 22,
    color: "#97bc49",
    fontWeight: "700",
    marginBottom: 20,
  },
  gridContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  box: {
    backgroundColor: "#1e293b",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 14,
  },
  boxText: {
    color: "#ffffff",
    fontSize: 15,
    fontWeight: "600",
  },
});
