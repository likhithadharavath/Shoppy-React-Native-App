import React, { useEffect } from "react";
import { View, Text, StyleSheet, ActivityIndicator, BackHandler } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";

export default function PaymentProcessingScreen() {
  const navigation = useNavigation();
  const route = useRoute();

  const { amount, method } = route.params;

  useEffect(() => {
    // Disable back button
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      () => true
    );

    // Disable gesture back
    const unsub = navigation.addListener("beforeRemove", (e) => {
      e.preventDefault();
    });

    // After 5 seconds → go to PaymentScreen
    const timer = setTimeout(() => {
      navigation.navigate("PaymentScreen", {
        amount,
        method,
      });}, 5000);

    return () => {
      backHandler.remove();
      unsub();
      clearTimeout(timer);
    };
  }, []);

  return (
    <View style={styles.container}>
      <Ionicons name="refresh-circle" size={90} color="#5a4280" />
      <Text style={styles.title}>Processing Payment…</Text>
      <Text style={styles.text}>Please wait while we confirm your payment.</Text>
      <ActivityIndicator size="large" color="#5a4280" style={{ marginTop: 20 }} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#ded5f8",
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "#5a4280",
    marginTop: 15,
  },
  text: {
    marginTop: 10,
    fontSize: 16,
    textAlign: "center",
    color: "#333",
  },
});
