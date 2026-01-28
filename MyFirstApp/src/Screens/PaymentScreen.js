import { useEffect, useState } from "react";
import { View, Text, StyleSheet, ActivityIndicator, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";

export default function PaymentScreen() {
  const navigation = useNavigation();
  const route = useRoute();

  const { amount = 0, method = "Unknown" } = route.params || {};
  const [status, setStatus] = useState("processing"); // processing | success | failed

  useEffect(() => {
    // simulate result after 3 sec
    const resultTimer = setTimeout(() => {
      const isSuccess = Math.random() < 0.7; // 70% success
      setStatus(isSuccess ? "success" : "failed");

      if (isSuccess) {
        // Auto move to Order Confirmed
        setTimeout(() => {
          navigation.replace("OrderConfirmedScreen", {
            amount,
            method,
          });
        }, 6000);
      }
    }, 3000);

    return () => clearTimeout(resultTimer);
  }, []);

  return (
    <View style={styles.container}>
      {/* <View style={styles.card}> */}
        
        {status === "processing" && (
          <>
            <Ionicons name="refresh-circle" size={80} color="#5a4280" />
            <Text style={styles.title}>Processing Payment…</Text>
            <ActivityIndicator size="large" color="#5a4280" style={{ marginTop: 20 }} />
          </>
        )}

        {status === "success" && (
          <>
            <Ionicons name="checkmark-circle" size={90} color="green" />
            <Text style={styles.title}>Payment Successful</Text>
          </>
        )}

        {status === "failed" && (
          <>
            <Ionicons name="close-circle" size={90} color="red" />
            <Text style={styles.title}>Payment Failed</Text>

            <TouchableOpacity
              style={styles.button}
              onPress={() => navigation.navigate("Bag")}
            >
              <Text style={styles.btnText}>Try Again</Text>
            </TouchableOpacity>
          </>
        )}

        <View style={styles.detailsBox}>
          <Text style={styles.detailHeading}>Payment Details</Text>

          <Text style={styles.detailText}>
            Method: <Text style={styles.bold}>{method}</Text>
          </Text>

          <Text style={styles.detailText}>
            Amount: <Text style={styles.bold}>₹{amount}</Text>
          </Text>

          <Text style={styles.detailText}>
            Transaction ID:{" "}
            <Text style={styles.bold}>
              TXN{Math.floor(100000 + Math.random() * 900000)}
            </Text>
          </Text>

          <Text style={styles.detailText}>
            Date: <Text style={styles.bold}>{new Date().toLocaleString()}</Text>
          </Text>
        </View>
      {/* </View> */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#ded5f8", justifyContent: "center", alignItems: "center" },
  card: { backgroundColor: "#ebe6fb", width: "100%", padding: 25, borderRadius: 18, alignItems: "center", elevation: 5 },
  title: { fontSize: 22, marginTop: 15, fontWeight: "700", color: "#5a4280" },
  detailsBox: { marginTop: 25, backgroundColor: "#fff", width: "80%", padding: 15, borderRadius: 12, borderWidth: 1, borderColor: "#d8d2f1" },
  detailHeading: { fontSize: 18, fontWeight: "700", marginBottom: 10 },
  detailText: { fontSize: 15, marginVertical: 3 },
  bold: { fontWeight: "700", color: "#5a4280" },
  button: { marginTop: 20, backgroundColor: "#5a4280", paddingVertical: 10, paddingHorizontal: 20, borderRadius: 8 },
  btnText: { color: "#fff", fontSize: 18, fontWeight: "700" }
});
