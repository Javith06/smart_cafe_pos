import React from "react";
import { useRouter } from "expo-router";

import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  useWindowDimensions,
  Platform,
} from "react-native";

export default function Category() {
  const { width } = useWindowDimensions();
  const router = useRouter();

  const isWeb = Platform.OS === "web";

  const containerWidth = Math.min(width - 80, isWeb ? 520 : width - 40);
  const GAP = 14;

  const boxWidth = (containerWidth - GAP) / 2;
  const boxHeight = boxWidth * (isWeb ? 0.75 : 1); // square on mobile

  const categories = ["Section 1", "Section 2", "Section 3", "Take Away"];

  const handlePress = (item: string) => {
    if (item === "Section 1") {
      router.push("/sections/section1"); // ✅ your path
    } 
    if (item === "Section 2") {
      router.push("/sections/section2");
    } 
  };

  return (
    <View
      style={[
        styles.screen,
        {
          justifyContent: isWeb ? "flex-start" : "center",
          paddingTop: isWeb ? 40 : 0,
        },
      ]}
    >
      <Text style={styles.title}>Choose Your Category</Text>

      <View style={[styles.gridContainer, { width: containerWidth }]}>
        {categories.map((item) => (
          <TouchableOpacity
            key={item}
            style={[styles.box, { width: boxWidth, height: boxHeight }]}
            activeOpacity={0.85}
            onPress={() => handlePress(item)}   // ✅ click handler
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
    alignItems: "center",
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
