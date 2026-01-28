import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  FlatList,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { ScrollView } from "react-native-gesture-handler";

export default function OrdersScreen() {
  const navigation = useNavigation();

  // STATIC DEMO ORDERS
  const orders = [
    {
      id: "ORD1021",
      productName: "Floral Printed Long Kurti",
      price: "₹799",
      image: require("../../assets/productslist/ethnic/longkurtis/lk8.png"),
      status: "Delivered",
      date: "12 Nov 2025",
    },
    {
      id: "ORD1022",
      productName: "Soft Cotton Saree",
      price: "₹899",
      image: require("../../assets/productslist/ethnic/sarees/s8.png"),
      status: "Out for Delivery",
      date: "29 Nov 2025",
    },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case "Shipped":
        return "#3c8df0";
      case "Out for Delivery":
        return "#ef8d32";
      case "Delivered":
        return "#28a745";
      default:
        return "#6c57c8";
    }
  };

  return (
    <SafeAreaView style={styles.container}>
   
        {/* HEADER */}
        <View style={styles.header}>
  <TouchableOpacity
    style={styles.backBtn}
    onPress={() => navigation.goBack()}
  >
    <Ionicons name="arrow-back" size={26} color="#5a4280" />
  </TouchableOpacity>

  <Text style={styles.headerTitle}>My Orders</Text>
</View>


        {/* EMPTY */}
        {orders.length === 0 ? (
          <View style={styles.emptyBox}>
            <Ionicons name="cube-outline" size={50} color="#5a4280" />
            <Text style={styles.emptyText}>No Orders Yet</Text>
          </View>
        ) : (
          <FlatList
            data={orders}
            keyExtractor={(item) => item.id}
            contentContainerStyle={{ paddingBottom: 100 }}
            renderItem={({ item }) => (
              <View style={styles.card}>
                {/* Product Image */}
                <Image source={item.image} style={styles.orderImage} />

                {/* ORDER INFO */}
                <View style={{ flex: 1, marginLeft: 12 }}>
                  <Text style={styles.orderName}>{item.productName}</Text>

                  <Text style={styles.orderPrice}>{item.price}</Text>

                  <Text style={styles.orderDate}>Ordered On: {item.date}</Text>

                  {/* STATUS BADGE */}
                  <View
                    style={[
                      styles.statusBadge,
                      { backgroundColor: getStatusColor(item.status) },
                    ]}
                  >
                    <Text style={styles.statusText}>{item.status}</Text>
                  </View>

                  {/* TRACK ORDER BTN */}
                  <TouchableOpacity
                    style={styles.trackBtn}
                    onPress={() =>
                      navigation.navigate("TrackOrderScreen", { order: item })
                    }
                  >
                    <Text style={styles.trackBtnText}>Track Order</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          />
        )}
      
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

backBtn: {
  marginRight: 10,
},

headerTitle: {
  fontSize: 20,
  fontWeight: "700",
  color: "#5a4280",
  textAlign: "center",
  flex: 1,
  marginRight: 26, // keeps title centered even with back icon present
},


  emptyBox: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 200,
  },

  emptyText: {
    marginTop: 10,
    fontSize: 18,
    fontWeight: "600",
    color: "#5a4280",
  },

  card: {
    flexDirection: "row",
    backgroundColor: "#fff",
    margin: 10,
    padding: 12,
    borderRadius: 12,
    elevation: 3,
  },

  orderImage: {
    width: 90,
    height: 90,
    borderRadius: 10,
  },

  orderName: {
    fontSize: 15,
    fontWeight: "700",
    color: "#333",
  },

  orderPrice: {
    fontSize: 15,
    fontWeight: "700",
    color: "#5a4280",
    marginTop: 4,
  },

  orderDate: {
    fontSize: 12,
    color: "#777",
    marginTop: 6,
  },

  statusBadge: {
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 20,
    alignSelf: "flex-start",
    marginTop: 6,
  },

  statusText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 12,
  },

  trackBtn: {
    marginTop: 10,
    backgroundColor: "#5a4280",
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 8,
    alignSelf: "flex-start",
  },

  trackBtnText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 14,
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
