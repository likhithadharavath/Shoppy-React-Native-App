import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Alert, } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { BackHandler } from "react-native";
import { useFocusEffect } from "@react-navigation/native";

export default function TrackOrderScreen({ route, navigation }) {
  const { orderId = "ORD987654", product } = route.params || {};

  const [statusIndex, setStatusIndex] = useState(0);

  const statuses = [
    { title: "Order Placed", desc: "Your order has been received", icon: "cart" },
    { title: "Packed", desc: "Your item is being packed", icon: "cube" },
    { title: "Shipped", desc: "Item left the warehouse", icon: "airplane" },
    { title: "Out for Delivery", desc: "Delivery partner is on the way", icon: "bicycle" },
    { title: "Delivered", desc: "Package delivered successfully", icon: "checkmark-circle" },
  ];

  useEffect(() => {
    let timer = setInterval(() => {
      setStatusIndex((prev) => (prev < statuses.length - 1 ? prev + 1 : prev));
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  const orderPlacedInfo = {
    orderDate: "25 Nov 2024",
    paymentMode: "UPI / GPay",
    address: "H.no 4-78, Hyderabad, Telangana",
  };

  return (
    <SafeAreaView style={styles.safeContainer}>
      <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 120 }}>
        <Text style={styles.heading}>Track Your Order</Text>

        {/* Product Info */}
        <View style={styles.productCard}>
          <Image source={{ uri: product?.image }} style={styles.productImage} />
          <View style={{ flex: 1 }}>
            <Text style={styles.productName}>{product?.name}</Text>
            <Text style={styles.productPrice}>₹{product?.price}</Text>
            <Text style={styles.deliveryDateText}>
              Expected Delivery: <Text style={styles.dateBold}>28 Nov 2024</Text>
            </Text>
          </View>
        </View>

        {/* Order Info */}
        <View style={styles.orderPlacedCard}>
          <Text style={styles.sectionTitle}>Order Details</Text>

          <Text style={styles.detailText}>
            Order Date: <Text style={styles.detailBold}>{orderPlacedInfo.orderDate}</Text>
          </Text>

          <Text style={styles.detailText}>
            Payment Mode: <Text style={styles.detailBold}>{orderPlacedInfo.paymentMode}</Text>
          </Text>

          <Text style={styles.detailText}>
            Delivery Address:{" "}
            <Text style={styles.detailBold}>{orderPlacedInfo.address}</Text>
          </Text>
        </View>

        {/* Tracking ID */}
        <View style={styles.orderCard}>
          <Text style={styles.orderText}>Tracking ID: {orderId}</Text>
        </View>

        {/* Timeline */}
        <View style={styles.timelineContainer}>
          {statuses.map((item, index) => {
            const active = index <= statusIndex;

            return (
              <View key={index} style={styles.timelineRow}>
                <View style={styles.timelineLeft}>
                  <Ionicons
                    name={item.icon}
                    size={28}
                    color={active ? "#5a4280" : "#aaa"}
                  />
                  {index < statuses.length - 1 && (
                    <View
                      style={[
                        styles.verticalLine,
                        { backgroundColor: active ? "#5a4280" : "#ccc" },
                      ]}
                    />
                  )}
                </View>

                <View style={styles.timelineRight}>
                  <Text style={[styles.statusTitle, active && styles.activeTitle]}>
                    {item.title}
                  </Text>
                  <Text style={[styles.statusDesc, active && { color: "#5a4280" }]}>
                    {item.desc}
                  </Text>
                </View>
              </View>
            );
          })}
        </View>

        {/* Action Buttons */}
        {statusIndex < 4 && (
          <View style={styles.actionCard}>
            <Text style={styles.sectionTitle}>Actions</Text>

            <TouchableOpacity
              style={styles.actionBtn}
              onPress={() => Alert.alert("Cancel Order", "Your order has been cancelled.")}
            >
              <MaterialIcons name="cancel" size={22} color="#fff" />
              <Text style={styles.actionText}>Cancel Order</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.actionBtn}
              onPress={() => Alert.alert("Refund Initiated", "Refund will be processed soon.")}
            >
              <MaterialIcons name="currency-rupee" size={22} color="#fff" />
              <Text style={styles.actionText}>Refund</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.actionBtn}
              onPress={() => Alert.alert("Exchange Started", "We will arrange the exchange.")}
            >
              <MaterialIcons name="swap-horiz" size={22} color="#fff" />
              <Text style={styles.actionText}>Exchange</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Contact */}
        <View style={styles.contactCard}>
          <TouchableOpacity style={styles.contactRow}>
            <Ionicons name="call" size={24} color="#5a4280" />
            <Text style={styles.contactText}>Call Delivery Partner</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.contactRow}>
            <Ionicons name="chatbubble-ellipses" size={24} color="#5a4280" />
            <Text style={styles.contactText}>Chat With Customer Support</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.contactRow}>
            <MaterialIcons name="support-agent" size={26} color="#5a4280" />
            <Text style={styles.contactText}>Customer Care: 1800-456-789</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* FIXED BOTTOM NAV */}
      <View style={styles.bottomNavStyle}>
        <TouchableOpacity onPress={() => navigation.navigate("Home")}>
          <Ionicons name="home-outline" size={28} color="#5a4280" />
          <Text>Home</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate("Menu")}>
          <Ionicons name="grid-outline" size={28} color="#5a4280" />
          <Text>Menu</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate("Bag")}>
          <Ionicons name="bag-outline" size={28} color="#5a4280" />
          <Text>Bag</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate("Likes")}>
          <Ionicons name="heart-outline" size={28} color="#5a4280" />
          <Text>Like</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate("Profile")}>
          <Ionicons name="person-outline" size={28} color="#5a4280" />
          <Text>Profile</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
    backgroundColor: "#ded5f8",
  },

  container: {
    flex: 1,
    padding: 10,
  },

  heading: {
    fontSize: 26,
    fontWeight: "700",
    color: "#5a4280",
    textAlign: "center",
    marginBottom: 10,
    paddingTop: 15,
  },

  productCard: {
    flexDirection: "row",
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 15,
    marginBottom: 20,
    elevation: 5,
  },

  productImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 15,
  },

  productName: {
    fontSize: 17,
    fontWeight: "700",
    color: "#333",
  },

  productPrice: {
    fontSize: 16,
    fontWeight: "600",
    color: "#5a4280",
    marginTop: 5,
  },

  deliveryDateText: {
    marginTop: 6,
    fontSize: 15,
    color: "#444",
  },

  dateBold: {
    color: "#5a4280",
    fontWeight: "700",
  },

  orderPlacedCard: {
    backgroundColor: "#fff",
    padding: 18,
    borderRadius: 15,
    elevation: 5,
    marginBottom: 20,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#5a4280",
    marginBottom: 10,
  },

  detailText: {
    fontSize: 15,
    color: "#444",
    marginBottom: 4,
  },

  detailBold: {
    fontWeight: "700",
    color: "#5a4280",
  },

  orderCard: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 12,
    elevation: 5,
    marginBottom: 20,
  },

  orderText: {
    fontSize: 17,
    fontWeight: "600",
    color: "#5a4280",
  },

  timelineContainer: {
    marginTop: 10,
  },

  timelineRow: {
    flexDirection: "row",
    marginBottom: 12,
  },

  timelineLeft: {
    alignItems: "center",
    width: 40,
    position: "relative",
  },

  verticalLine: {
    width: 3,
    height: 28,
    marginTop: 4,
  },

  timelineRight: {
    flex: 1,
    paddingLeft: 10,
  },

  statusTitle: {
    fontSize: 17,
    color: "#777",
    fontWeight: "600",
  },

  statusDesc: {
    fontSize: 14,
    marginTop: 3,
    color: "#999",
  },

  activeTitle: {
    color: "#5a4280",
  },

  actionCard: {
    backgroundColor: "#fff",
    padding: 18,
    borderRadius: 15,
    elevation: 5,
    marginBottom: 20,
  },

  actionBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#5a4280",
    padding: 12,
    borderRadius: 10,
    marginBottom: 12,
  },

  actionText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 10,
  },

  contactCard: {
    backgroundColor: "#fff",
    padding: 18,
    borderRadius: 15,
    elevation: 5,
    marginBottom: 20,
  },

  contactRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },

  contactText: {
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 12,
    color: "#5a4280",
  },

  bottomNavStyle: {
    height: 60,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderColor: "#aaa",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    position: "absolute",
    bottom: 0,
    width: "100%",
  },
});
