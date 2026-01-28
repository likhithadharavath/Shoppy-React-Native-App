import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";

export default function CardScreen() {
  const navigation = useNavigation();
  const route = useRoute();

  const { totalPrice = 0, deliveryCharge = 0 } = route.params || {};
  const grandTotal = Number(totalPrice) + Number(deliveryCharge);

  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCVV] = useState("");
  const [name, setName] = useState("");

  const handlePayment = () => {
    if (!cardNumber || !expiry || !cvv || !name) {
      alert("Please fill all fields");
      return;
    }

    navigation.navigate("PaymentProcessingScreen", {
      amount: grandTotal,
      method: "Card Payment",
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
  <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
    <Ionicons name="arrow-back" size={28} color="#5a4280" />
  </TouchableOpacity>

  <Text style={styles.heading}>Card Payment</Text>
</View>


      <View style={styles.cardBox}>
        <Text style={styles.label}>Card Number</Text>
        <TextInput
          value={cardNumber}
          onChangeText={setCardNumber}
          placeholder="1234 5678 9012 3456"
          keyboardType="numeric"
          maxLength={16}
          style={styles.input}
        />

        <View style={styles.row}>
          <View style={{ flex: 1 }}>
            <Text style={styles.label}>Expiry</Text>
            <TextInput
              value={expiry}
              onChangeText={setExpiry}
              placeholder="MM/YY"
              maxLength={5}
              style={styles.input}
            />
          </View>

          <View style={{ width: 120, marginLeft: 10 }}>
            <Text style={styles.label}>CVV</Text>
            <TextInput
              value={cvv}
              onChangeText={setCVV}
              placeholder="***"
              maxLength={3}
              keyboardType="numeric"
              secureTextEntry
              style={styles.input}
            />
          </View>
        </View>

        <Text style={styles.label}>Card Holder Name</Text>
        <TextInput
          value={name}
          onChangeText={setName}
          placeholder="Full Name"
          style={styles.input}
        />

        <TouchableOpacity style={styles.payButton} onPress={handlePayment}>
          <Text style={styles.payText}>Pay ₹{grandTotal}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ded5f8",
    padding: 20,
    paddingTop: 30,
  },
headerRow: {
  flexDirection: "row",
  alignItems: "center",
  marginBottom: 25,
  marginTop: 10,
},

backBtn: {
  padding: 6,
  marginRight: 10,
  borderRadius: 10,
},

heading: {
  fontSize: 24,
  fontWeight: "700",
  color: "#5a4280",
},

  cardBox: {
    backgroundColor: "#ebe6fb",
    padding: 18,
    borderRadius: 14,
    elevation: 5,
  },
  label: { fontSize: 15, marginBottom: 6, color: "#000", fontWeight: "600" },
  input: {
    backgroundColor: "#fff",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#cfc9e6",
  },
  row: { flexDirection: "row", justifyContent: "space-between" },
  payButton: {
    backgroundColor: "#5a4280",
    paddingVertical: 14,
    borderRadius: 12,
    marginTop: 10,
    alignItems: "center",
  },
  payText: { color: "#fff", fontSize: 18, fontWeight: "700" },
});
