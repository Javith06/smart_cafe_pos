// React Native Login Screen (Expo Router)
// File: app/(tabs)/index.jsx

import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ImageBackground,
  StatusBar,
  SafeAreaView,
} from "react-native";

export default function Index() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    alert("Login pressed");
  };

  return (
    <ImageBackground
      // IMPORTANT:
      // Image location should be:
      // RestaurantApp/assets/login-bg.jpg
      // because this file is inside app/(tabs)/
      source={require("../../assets/images/1.avif")}
      style={styles.background}
      resizeMode="cover"
    >
      <StatusBar barStyle="light-content" />

      <SafeAreaView style={styles.container}>
        <View style={styles.overlay} />

        <View style={styles.loginBox}>
          <Text style={styles.title}>SMART CAFE</Text>
          <Text style={styles.subtitle}>Welcome Back</Text>

          <TextInput
            placeholder="Email"
            placeholderTextColor="#ccc"
            style={styles.input}
            value={email}
            onChangeText={setEmail}
          />

          <TextInput
            placeholder="Password"
            placeholderTextColor="#ccc"
            secureTextEntry
            style={styles.input}
            value={password}
            onChangeText={setPassword}
          />

          <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
            <Text style={styles.loginText}>LOGIN</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "#0000008c",
  },
  loginBox: {
  width: "75%",
  maxWidth: 350,
  alignSelf: "center",
  backgroundColor: "#34432684",
  borderRadius: 20,
  padding: 20,
},

  title: {
    color: "#97bc49",
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 5,
  },
  subtitle: {
    color: "#fff",
    textAlign: "center",
    marginBottom: 20,
  },
  input: {
    backgroundColor: "rgba(255,255,255,0.15)",
    color: "#fff",
    padding: 12,
    borderRadius: 10,
    marginBottom: 15,
  },
  loginButton: {
    backgroundColor: "#97bc49",
    padding: 14,
    borderRadius: 10,
    alignItems: "center",
  },
  loginText: {
    color: "#010101",
    fontWeight: "bold",
    fontSize: 16,
  },
});