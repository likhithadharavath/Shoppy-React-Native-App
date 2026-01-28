import React, { useContext, useMemo, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  FlatList,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { BagContext } from "../Context/BagContext";
import { SafeAreaView } from "react-native-safe-area-context";

export default function BagScreen({ navigation }) {
  const { bagItems, increaseQty, decreaseQty, removeFromBag, updateSize } =
    useContext(BagContext);

  const [openDropdownId, setOpenDropdownId] = useState(null);

  const deliveryCharge = useMemo(() => Math.floor(Math.random() * 100), []);

  // ---- PRICE ----
  const totalPrice = bagItems.reduce(
    (sum, item) => sum + item.qty * parseFloat(item.price.replace("₹", "")),
    0
  );

  const totalItems = bagItems.reduce((sum, item) => sum + item.qty, 0);

  const finalAmount = totalPrice + deliveryCharge;

  // ---- EMPTY BAG ----
  if (bagItems.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.emptyContainer}>
          <Ionicons name="bag-handle-outline" size={90} color="#5a4280" />
          <Text style={styles.emptyText}>Your Bag is Empty</Text>
        </View>

        {/* Bottom Navigation Always Visible */}
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

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={26} color="#5a4280" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Bag</Text>
      </View>
      <FlatList
        data={bagItems}
        keyExtractor={(item) => item.id.toString() + item.selectedSize}
        contentContainerStyle={{ paddingBottom: 360 }}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <View style={styles.card}>
            {/* MAIN ROW */}
            <View style={{ flexDirection: "row", flex: 1 }}>
              <TouchableOpacity
                style={{ flexDirection: "row", flex: 1 }}
                onPress={() =>
                  navigation.navigate("ProductDetails", {
                    item,
                    category: item.category,
                  })
                }
              >
                <Image source={item.image} style={styles.image} />

                <View style={{ flex: 1, marginLeft: 12 }}>
                  <Text style={styles.name}>{item.name}</Text>
                  <Text style={styles.price}>{item.price}</Text>

                  {/* SIZE BOX */}
                  <TouchableOpacity
                    style={styles.sizeBox}
                    onPress={() =>
                      setOpenDropdownId(
                        openDropdownId === item.id ? null : item.id
                      )
                    }
                  >
                    <Text style={styles.sizeBoxText}>{item.selectedSize}</Text>
                    <Ionicons name="chevron-down" size={18} color="#5a4280" />
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            </View>

            {/* SIZE DROPDOWN */}
            {openDropdownId === item.id && (
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={[styles.sizeScroll, { marginTop: 10 }]}
              >
                {["XS", "S", "M", "L", "XL", "XXL"].map((sz) => (
                  <TouchableOpacity
                    key={sz}
                    onPress={() => {
                      updateSize(item.id, item.selectedSize, sz);
                      setOpenDropdownId(null);
                    }}
                    style={[
                      styles.sizeOptionScroll,
                      item.selectedSize === sz && styles.sizeOptionSelected,
                    ]}
                  >
                    <Text
                      style={[
                        styles.sizeOptionScrollText,
                        item.selectedSize === sz && { color: "#fff" },
                      ]}
                    >
                      {sz}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            )}

            {/* QTY ROW */}
            <View style={styles.qtyRow}>
              <TouchableOpacity
                onPress={() => removeFromBag(item.id, item.selectedSize)}
                style={styles.deleteIconContainer}
              >
                <Ionicons name="trash-outline" size={22} color="red" />
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => decreaseQty(item.id, item.selectedSize)}
                style={styles.qtyBtn}
              >
                <Ionicons name="remove" size={18} color="#5a4280" />
              </TouchableOpacity>

              <Text style={styles.qtyText}>{item.qty}</Text>

              <TouchableOpacity
                onPress={() => increaseQty(item.id, item.selectedSize)}
                style={styles.qtyBtn}
              >
                <Ionicons name="add" size={18} color="#5a4280" />
              </TouchableOpacity>
            </View>
          </View>
        )}
      />

      {/* TOTAL SECTION */}
      <View style={styles.totalBox}>
        <Text style={styles.totalTitle}>Order Summary</Text>

        <View style={styles.row}>
          <Text style={styles.label}>Items ({totalItems})</Text>
          <Text style={styles.value}>₹{totalPrice}</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Delivery Charges</Text>
          <Text style={styles.value}>₹{deliveryCharge}</Text>
        </View>

        <View style={styles.divider} />

        <View style={styles.row}>
          <Text style={styles.totalLabel}>Total Payable</Text>
          <Text style={styles.totalValue}>₹{finalAmount}</Text>
        </View>

        <TouchableOpacity
          style={styles.checkoutBtn}
          onPress={() =>
            navigation.navigate("CheckOut", {
              totalPrice,
              totalItems,
              deliveryCharge,
            })
          }
        >
          <Text style={styles.checkoutText}>Place Order</Text>
        </TouchableOpacity>
      </View>

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

// -------------------- STYLES --------------------

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#ded5f8ff" },
  header: {
    height: 60,
    backgroundColor: "#fff",
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 1,
    borderColor: "#ddd",
    paddingHorizontal: 15,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#5a4280",
    textAlign: "center",
    flex: 1,
    marginRight: 26, // keeps title centered even with back icon present
  },
  emptyContainer: {
    flex: 1,
    backgroundColor: "#ded5f8ff",
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: { fontSize: 22, fontWeight: "bold", color: "#5a4280" },

  card: {
    flexDirection: "column",
    backgroundColor: "white",
    marginHorizontal: 15,
    marginTop: 15,
    borderRadius: 12,
    padding: 10,
    elevation: 2,
  },

  image: { width: 90, height: 110, borderRadius: 10 },

  name: { fontSize: 16, fontWeight: "bold", color: "black" },

  price: {
    color: "#5a4280",
    fontSize: 16,
    fontWeight: "bold",
    marginVertical: 5,
  },

  sizeBox: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 8,
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: "#5a4280",
    alignItems: "center",
    alignSelf: "flex-start",
    gap: 6,
  },

  sizeBoxText: { fontSize: 14, fontWeight: "600", color: "#5a4280" },

  sizeScroll: { marginTop: 8, paddingVertical: 5 },

  sizeOptionScroll: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    marginRight: 10,
    borderRadius: 8,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#5a4280",
  },

  sizeOptionSelected: {
    backgroundColor: "#5a4280",
    borderColor: "#5a4280",
  },

  sizeOptionScrollText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#5a4280",
  },

  qtyRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
  },

  deleteIconContainer: { marginRight: 12, padding: 6 },

  qtyBtn: {
    borderWidth: 1,
    borderColor: "#5a4280",
    padding: 4,
    borderRadius: 5,
  },

  qtyText: { marginHorizontal: 12, fontSize: 16, fontWeight: "bold" },

  totalBox: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    backgroundColor: "white",
    padding: 20,
    paddingTop: 8,
    borderTopWidth: 2,
    borderTopColor: "#5a4280",
  },

  totalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#5a4280",
    paddingTop: 10,
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 4,
  },

  label: { color: "#444" },
  value: { color: "#333" },

  totalLabel: { fontSize: 18, color: "#5a4280", fontWeight: "bold" },
  totalValue: { fontSize: 18, color: "#5a4280", fontWeight: "bold" },

  divider: { height: 1, backgroundColor: "#ccc", marginVertical: 10 },

  checkoutBtn: {
    backgroundColor: "#5a4280",
    paddingVertical: 12,
    borderRadius: 10,
    marginTop: 10,
    marginBottom: 52,
  },

  checkoutText: {
    color: "white",
    textAlign: "center",
    fontSize: 17,
    fontWeight: "bold",
  },
  bottomNavStyle: {
    height: 60,
    backgroundColor: "#ffffff",
    borderTopWidth: 1,
    borderColor: "#aaa",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    position: "absolute",
    bottom: 0,
    width: "100%",
    borderTopColor: "#5a4280ff",
  },
});
