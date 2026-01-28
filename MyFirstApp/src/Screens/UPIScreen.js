import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Image,
  TouchableOpacity,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";

export default function UPIScreen() {
  const navigation = useNavigation();
  const route = useRoute();

  const { totalPrice = 0, deliveryCharge = 0 } = route.params || {};
  const grandTotal = Number(totalPrice) + Number(deliveryCharge);

  const [selectedApp, setSelectedApp] = useState(null);

  const handleSelect = (appName) => {
    setSelectedApp(appName);

    navigation.navigate("PaymentProcessingScreen", {
      amount: grandTotal,
      method: "UPI Payment",
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
  <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
    <Ionicons name="arrow-back" size={28} color="#5a4280" />
  </TouchableOpacity>

  <Text style={styles.heading}>UPI Payment</Text>
</View>
      <View style={styles.card}>
        <Text style={styles.amountLabel}>Total Amount</Text>
        <Text style={styles.amount}>₹{grandTotal}</Text>

        <Text style={styles.payInfo}>Select your UPI app:</Text>

        <View style={styles.appListContainer}>
          <TouchableOpacity
            style={[styles.appRow, selectedApp === "gpay" && styles.selectedRow]}
            onPress={() => handleSelect("gpay")}
          >
            <Image source={require("../../assets/upi/gpay.png")} style={styles.appIcon} />
            <Text style={styles.appName}>Google Pay</Text>
            <Ionicons
              name={selectedApp === "gpay" ? "radio-button-on" : "radio-button-off"}
              size={22}
              color="#5a4280"
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.appRow, selectedApp === "phonepe" && styles.selectedRow]}
            onPress={() => handleSelect("phonepe")}
          >
            <Image source={require("../../assets/upi/phonepe.png")} style={styles.appIcon} />
            <Text style={styles.appName}>PhonePe</Text>
            <Ionicons
              name={selectedApp === "phonepe" ? "radio-button-on" : "radio-button-off"}
              size={22}
              color="#5a4280"
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.appRow, selectedApp === "paytm" && styles.selectedRow]}
            onPress={() => handleSelect("paytm")}
          >
            <Image source={require("../../assets/upi/paytm.png")} style={styles.appIcon} />
            <Text style={styles.appName}>Paytm</Text>
            <Ionicons
              name={selectedApp === "paytm" ? "radio-button-on" : "radio-button-off"}
              size={22}
              color="#5a4280"
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.appRow, selectedApp === "bhim" && styles.selectedRow]}
            onPress={() => handleSelect("bhim")}
          >
            <Image source={require("../../assets/upi/bhim.png")} style={styles.appIcon} />
            <Text style={styles.appName}>BHIM UPI</Text>
            <Ionicons
              name={selectedApp === "bhim" ? "radio-button-on" : "radio-button-off"}
              size={22}
              color="#5a4280"
            />
          </TouchableOpacity>
        </View>

        <Text style={styles.note}>After selecting an app, complete payment externally and return.</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#ded5f8ff", padding: 20 },
  headerRow: {
  flexDirection: "row",
  alignItems: "center",
  marginBottom: 20,
  marginTop: 10,
},

backBtn: {
  padding: 6,
  marginRight: 10,
  borderRadius: 10,
},

  heading: {
    fontSize: 25,
    fontWeight: "700",
    marginBottom: 20,
    paddingTop: 10,
    color: "#5a4280",
  },
  card: {
    backgroundColor: "#ebe6fbff",
    borderRadius: 14,
    padding: 20,
    elevation: 5,
  },
  amountLabel: { fontSize: 16, color: "#000", textAlign: "center", fontWeight: "bold" },
  amount: {
    fontSize: 30,
    fontWeight: "800",
    color: "#5a4280",
    textAlign: "center",
    marginVertical: 10,
  },
  payInfo: { fontSize: 15, color: "#333", marginTop: 10, textAlign: "center" },
  appListContainer: { marginTop: 20, backgroundColor: "#fff", paddingVertical: 5, borderRadius: 12 },
  appRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderColor: "#eee",
  },
  selectedRow: { backgroundColor: "#f0e8ff" },
  appIcon: { width: 40, height: 40, marginRight: 15, borderRadius: 8 },
  appName: { fontSize: 16, color: "#5a4280", fontWeight: "600", flex: 1 },
  note: { marginTop: 15, fontSize: 13, textAlign: "center", color: "#444" },
});
