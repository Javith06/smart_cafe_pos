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

  const containerWidth = Math.min(width - 40, 640); // 👈 PC la neat size
  const GAP = 20;
  const boxSize = (containerWidth - GAP) / 2; // 2x2 grid

  return (
    <View style={styles.screen}>
      <Text style={styles.title}>Choose Your Category</Text>

      <View style={[styles.gridContainer, { width: containerWidth }]}>
        <TouchableOpacity style={[styles.box, { width: boxSize, height: boxSize }]}>
          <Text style={styles.boxText}>Section 1</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.box, { width: boxSize, height: boxSize }]}>
          <Text style={styles.boxText}>Section 2</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.box, { width: boxSize, height: boxSize }]}>
          <Text style={styles.boxText}>Section 3</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.box, { width: boxSize, height: boxSize }]}>
          <Text style={styles.boxText}>Take Away</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#0f172a",
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 26,
    color: "#97bc49",
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 24,
  },
  gridContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  box: {
    backgroundColor: "#1e293b",
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  boxText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
});
