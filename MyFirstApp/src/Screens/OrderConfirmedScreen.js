import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function OrderConfirmedScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { product } = route.params || {};

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#ded5f8" }}>
      {/* MAIN CONTENT */}
      <View style={styles.container}>
        <Ionicons name="checkmark-circle" size={100} color="green" />

        <Text style={styles.title}>Order Confirmed!</Text>
        <Text style={styles.subtitle}>
          Your order has been placed successfully.
        </Text>

        <TouchableOpacity
          style={styles.button}
          onPress={() =>
            navigation.navigate("TrackOrderScreen", {
              orderId: "ORD12345",
              product: {
                name: product?.name,
                price: product?.price,
                image: product?.image,
              },
            })
          }
        >
          <Text style={styles.btnText}>Track Your Order</Text>
        </TouchableOpacity>
      </View>

      {/* BOTTOM NAV */}
      <View style={styles.bottomNavStyle}>
        <TouchableOpacity onPress={() => navigation.navigate("Home")}>
          <Ionicons name="home-outline" size={28} color="#5a4280ff" />
          <Text>Home</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate("Menu")}>
          <Ionicons name="grid-outline" size={28} color="#5a4280ff" />
          <Text>Menu</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate("Bag")}>
          <Ionicons name="bag-outline" size={28} color="#5a4280ff" />
          <Text>Bag</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate("Likes")}>
          <Ionicons name="heart-outline" size={28} color="#5a4280ff" />
          <Text>Like</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate("Profile")}>
          <Ionicons name="person-outline" size={28} color="#5a4280ff" />
          <Text>Profile</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    marginTop: 20,
    color: "#5a4280",
  },
  subtitle: {
    fontSize: 16,
    marginTop: 10,
    textAlign: "center",
    color: "#555",
  },
  button: {
    marginTop: 30,
    backgroundColor: "#5a4280",
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 10,
  },
  btnText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
  },
  bottomNavStyle: {
    height: 60,
    backgroundColor: "#ffffff",
    borderTopWidth: 1,
    borderColor: "#5a4280ff",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    paddingBottom:0,
    marginBottom:0,
  },
});
