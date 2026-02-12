import React from "react";
import { useRouter } from "expo-router";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  useWindowDimensions,
  ImageBackground,
} from "react-native";
import { BlurView } from "expo-blur";

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
    <ImageBackground
      source={require("../../assets/images/11.jpg")}
      style={styles.background}
      resizeMode="cover"
    >
      {/* 🔴 Logout Button (Glassy) */}
      <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
        <BlurView intensity={40} tint="dark" style={styles.glassBtnInner}>
          <Text style={styles.logoutText}>Logout</Text>
        </BlurView>
      </TouchableOpacity>

      {/* Content */}
      <View style={styles.contentWrapper}>
        {/* Glassy Title */}
        <BlurView intensity={50} tint="dark" style={styles.glassTitle}>
          <Text style={styles.titleText}>Choose Your Category</Text>
        </BlurView>

        <View style={[styles.gridContainer, { width: containerWidth }]}>
          {categories.map((item) => (
            <TouchableOpacity
              key={item}
              style={[styles.box, { width: boxWidth, height: boxHeight }]}
              activeOpacity={0.85}
              onPress={() => handlePress(item)}
            >
              <BlurView intensity={40} tint="dark" style={styles.glassBoxInner}>
                <Text style={styles.boxText}>{item}</Text>
              </BlurView>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: "100%",
    height: "100%",
  },

  contentWrapper: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
    backgroundColor: "rgba(0,0,0,0.25)", // slight dark overlay
  },

  /* ===== Title Glass ===== */
  glassTitle: {
    marginBottom: 20,
    borderRadius: 14,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.3)",
  },
  titleText: {
    fontSize: 22,
    color: "#e5ff9a",
    fontWeight: "800",
    paddingHorizontal: 16,
    paddingVertical: 10,
    textAlign: "center",
  },

  gridContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },

  /* ===== Glassy Box ===== */
  box: {
    borderRadius: 18,
    overflow: "hidden",
    marginBottom: 14,
    shadowColor: "#00000004",
    shadowOpacity: 0.3,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 5,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0)",
    backgroundColor: "rgba(255, 255, 255, 0)",
  },

  glassBoxInner: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  boxText: {
    color: "#ffffff",
    fontSize: 20,
    fontWeight: "800",
    textShadowColor: "rgba(0, 0, 0, 0)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },

  /* ===== Logout Glass Button ===== */
  logoutBtn: {
    position: "absolute",
    top: 50,
    right: 20,
    borderRadius: 12,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(20, 2, 2, 0.69)",
    zIndex: 10,
  },

  glassBtnInner: {
    paddingHorizontal: 16,
    paddingVertical: 10,
  },

  logoutText: {
    color: "#fffcfd",
    fontWeight: "800",
    fontSize: 14,
  },
});
