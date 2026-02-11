import { useRouter, useFocusEffect } from "expo-router";
import React, { useState, useCallback } from "react";
import {
  Alert,
  ImageBackground,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from "react-native";

export default function Index() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const router = useRouter();
  const { width } = useWindowDimensions();
  const containerWidth = Math.min(width - 40, 640);

  // ✅ Clear fields whenever this screen is focused (e.g., after logout)
  useFocusEffect(
    useCallback(() => {
      setEmail("");
      setPassword("");
    }, [])
  );

  const handleLogin = () => {
    const correctEmail = "unipro@gmail.com";
    const correctPassword = "786";

    if (!email || !password) {
      Alert.alert("Error", "Please enter email and password");
      return;
    }

    const isEmailCorrect = email === correctEmail;
    const isPasswordCorrect = password === correctPassword;

    if (isEmailCorrect && isPasswordCorrect) {
      // ✅ Clear before navigating
      setEmail("");
      setPassword("");

      router.replace("/(tabs)/category");
      return;
    }

    if (!isEmailCorrect && !isPasswordCorrect) {
      Alert.alert("Error", "Email and password are wrong");
      return;
    }

    if (!isEmailCorrect) {
      Alert.alert("Error", "Email is wrong");
      return;
    }

    if (!isPasswordCorrect) {
      Alert.alert("Error", "Password is wrong");
      return;
    }
  };

  return (
    <ImageBackground
      source={require("../../assets/images/1.avif")}
      style={styles.background}
      resizeMode="cover"
    >
      <StatusBar barStyle="light-content" />

      <SafeAreaView style={styles.container}>
        <View style={styles.overlay} />

        <View style={[styles.loginBox, { width: containerWidth }]}>
          <Text style={styles.title}>SMART CAFE</Text>
          <Text style={styles.subtitle}>Welcome Back</Text>

          <TextInput
            placeholder="Email"
            placeholderTextColor="#ccc"
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
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
    padding: 20,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "#0000008c",
  },
  loginBox: {
    backgroundColor: "#34432684",
    borderRadius: 20,
    padding: 20,
    maxWidth: 350,
    alignSelf: "center",
  },
  title: {
    color: "#97bc49",
    fontSize: 32,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 6,
  },
  subtitle: {
    color: "#fff",
    textAlign: "center",
    marginBottom: 24,
    fontSize: 16,
  },
  input: {
    backgroundColor: "rgba(255,255,255,0.15)",
    color: "#fff",
    paddingVertical: 14,
    paddingHorizontal: 12,
    borderRadius: 12,
    marginBottom: 16,
    fontSize: 16,
  },
  loginButton: {
    backgroundColor: "#97bc49",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 8,
  },
  loginText: {
    color: "#010101",
    fontWeight: "bold",
    fontSize: 18,
  },
});
