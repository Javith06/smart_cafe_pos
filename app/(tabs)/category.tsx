import React from "react";
import { useRouter } from "expo-router";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from "react-native";

export default function Category() {
  const { width, height } = useWindowDimensions();
  const router = useRouter();

  const isLandscape = width > height;

  const MAX_WIDTH = 520;
  const containerWidth = Math.min(width - 40, MAX_WIDTH);

  const GAP = 14;
  const boxWidth = (containerWidth - GAP) / 2;
  const boxHeight = isLandscape ? boxWidth * 0.8 : boxWidth;

  const categories = ["Section 1", "Section 2", "Section 3", "Take Away"];

  const handlePress = (item: string) => {
    if (item === "Section 1") router.push("/sections/section1");
    if (item === "Section 2") router.push("/sections/section2");
    if (item === "Section 3") router.push("/sections/section3");
    if (item === "Take Away") router.push("/sections/takeaway");
  };

  const handleLogout = () => {
    router.replace("/");
  };

  return (
    <View style={styles.screen}>
      {/* 🔴 Logout Button - Top Right */}
      <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>

      <Text style={styles.title}>Choose Your Category</Text>

      <View style={[styles.gridContainer, { width: containerWidth }]}>
        {categories.map((item) => (
          <TouchableOpacity
            key={item}
            style={[styles.box, { width: boxWidth, height: boxHeight }]}
            activeOpacity={0.85}
            onPress={() => handlePress(item)}
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
    justifyContent: "center",
    padding: 20,
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
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 14,
    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  boxText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "600",
  },


 logoutBtn: {
  position: "absolute",
  top: 50,        
  right: 20,
  backgroundColor: "#dc2626", // RED
  paddingHorizontal: 14,
  paddingVertical: 8,
  borderRadius: 8,
  zIndex: 10,
},
  logoutText: {
    color: "#ffffff",
    fontWeight: "700",
    fontSize: 14,
  },
});
