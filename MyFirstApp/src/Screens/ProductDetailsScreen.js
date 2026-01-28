import React, { useContext, useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  ScrollView,
  Alert,
  ToastAndroid,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import { LikeContext } from "../Context/LikeContext";
import { BagContext } from "../Context/BagContext";
import { productsData } from "../Data/Products";

export default function ProductDetailsScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { item, category } = route.params ?? {};

  const [selectedSize, setSelectedSize] = useState(null);
  const [randomRating, setRandomRating] = useState(1);
  const [sizes, setSizes] = useState([]);

  const { likedItems, toggleLike } = useContext(LikeContext);
  const { addToBag, bagItems } = useContext(BagContext);

  const isLiked = likedItems.some((p) => p.id === item.id);

  useEffect(() => {
    setRandomRating(Math.floor(Math.random() * 5) + 1);
    setSizes(["XS", "S", "M", "L", "XL", "XXL"]);
  }, []);

  const similarProducts =
    productsData[category]?.filter((p) => p.id !== item.id) || [];

  const getSizeCount = (size) => {
    return bagItems
      .filter((b) => b.id === item.id && b.selectedSize === size)
      .reduce((sum, b) => sum + b.qty, 0);
  };

  return (
    <SafeAreaView style={styles.container}>
      
        {/* HEADER */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={28} color="#5a4280" />
          </TouchableOpacity>

          <Text style={styles.title}>{item.name}</Text>

          <View style={{ flexDirection: "row", gap: 15 }}>
            <TouchableOpacity onPress={() => toggleLike(item, category)}>
              <Ionicons
                name={isLiked ? "heart" : "heart-outline"}
                size={28}
                color={isLiked ? "#5a4280" : "black"}
              />
            </TouchableOpacity>

            {/* Share Icon */}
            <TouchableOpacity>
              <Ionicons name="share-social-outline" size={28} color="#5a4280" />
            </TouchableOpacity>
          </View>
        </View>
      <ScrollView style={{paddingBottom:30,}}>
        {/* PRODUCT IMAGE */}
        <Image source={item.image} style={styles.mainImage} />

        {/* DETAILS */}
        <View style={styles.detailBox}>
          <Text style={styles.productName}>{item.name}</Text>
          <Text style={styles.price}>{item.price}</Text>

          {/* STARS */}
          <View style={styles.ratingRow}>
            {Array.from({ length: 5 }).map((_, i) => (
              <Ionicons
                key={i}
                name={i < randomRating ? "star" : "star-outline"}
                size={22}
                color="#ffb300"
              />
            ))}
          </View>

          {/* SIZES */}
          <Text style={styles.sectionSmallTitle}>Select Size</Text>

          <View style={styles.sizeRow}>
            {sizes.map((s) => {
              const count = getSizeCount(s);
              return (
                <View key={s} style={{ position: "relative" }}>
                  <TouchableOpacity
                    style={[
                      styles.sizeBox,
                      selectedSize === s && { backgroundColor: "#5a4280" },
                    ]}
                    onPress={() => setSelectedSize(s)}
                  >
                    <Text
                      style={[
                        styles.sizeText,
                        selectedSize === s && { color: "white" },
                      ]}
                    >
                      {s}
                    </Text>
                  </TouchableOpacity>

                  {/* COUNT BADGE */}
                  {count > 0 && (
                    <View style={styles.countBadge}>
                      <Text style={styles.countBadgeText}>{count}</Text>
                    </View>
                  )}
                </View>
              );
            })}
          </View>

          {/* DESCRIPTION */}
          <Text style={styles.description}>
            {item.description || "This is a premium quality product."}
          </Text>
        </View>
        {/* EXTRA PRODUCT INFO */}
        <View style={{ marginTop: 10 }}>
          <Text style={styles.infoText}>
            <Text style={styles.infoLabel}>Category: </Text>
            {item.mainCategory || "N/A"}
          </Text>

          <Text style={styles.infoText}>
            <Text style={styles.infoLabel}>Cloth Type: </Text>
            {item.clothType || "N/A"}
          </Text>

          <Text style={styles.infoText}>
            <Text style={styles.infoLabel}>Occasion: </Text>
            {item.occasion || "N/A"}
          </Text>

          <Text style={styles.infoText}>
            <Text style={styles.infoLabel}>Discount: </Text>
            {item.discount || "N/A"}
          </Text>

          <Text style={styles.infoText}>
            <Text style={styles.infoLabel}>Reviews: </Text>
            {item.reviewsCount || 0} reviews
          </Text>
        </View>
          {/* ADD TO BAG + VIEW BAG BAR */}
      <View style={styles.addToBagRow}>
        {/* ADD TO BAG BUTTON */}
        <TouchableOpacity
          style={styles.addBtn}
          onPress={() => {
            if (!selectedSize) {
              Alert.alert(
                "Select Size",
                "Please select a size before adding to bag."
              );
              return;
            }

            addToBag({ ...item, selectedSize, category }, 1);

            ToastAndroid.show("Item added to bag", ToastAndroid.SHORT);
          }}
        >
          <Text style={styles.addBtnText}>ADD TO BAG</Text>
        </TouchableOpacity>

        {/* VIEW BAG BUTTON */}
        <TouchableOpacity
          style={styles.viewBagBtn}
          onPress={() => navigation.navigate("Bag")}
        >
          <Text style={styles.viewBagBtnText}>VIEW BAG</Text>
        </TouchableOpacity>
      </View>
        {/* SIMILAR PRODUCTS */}
        <Text style={styles.sectionTitle}>Similar Products</Text>

        <FlatList
          data={similarProducts}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={(p) => p.id.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.similarCard}
              onPress={() =>
                navigation.push("ProductDetails", { item, category })
              }
            >
              <Image source={item.image} style={styles.similarImage} />
              <Text style={styles.similarName}>{item.name}</Text>
            </TouchableOpacity>
          )}
        />
      </ScrollView>

      
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
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 15,
    alignItems: "center",
  },

  title: { fontSize: 16, fontWeight: "bold", color: "#5a4280" },

  mainImage: {
    width: "100%",
    height: 350,
    resizeMode: "cover",
  },

  detailBox: { padding: 15 },

  productName: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
  },

  price: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#5a4280",
    marginVertical: 8,
  },

  ratingRow: { flexDirection: "row", marginVertical: 5 },

  sectionSmallTitle: {
    fontSize: 15,
    fontWeight: "bold",
    color: "#5a4280",
    marginTop: 10,
  },

  sizeRow: { flexDirection: "row", gap: 10, marginTop: 5 },

  sizeBox: {
    paddingVertical: 6,
    paddingHorizontal: 15,
    backgroundColor: "#fff",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#5a4280",
  },

  sizeText: { fontWeight: "bold", color: "#5a4280" },
  countBadge: {
    position: "absolute",
    top: -5,
    right: -5,
    backgroundColor: "#FFB7D5",
    width: 20,
    height: 20,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
  },
  countBadgeText: {
    color: "white",
    fontSize: 12,
    fontWeight: "bold",
  },
  description: { marginTop: 10, fontSize: 14, color: "#555" },

  sectionTitle: {
    marginTop: 25,
    marginLeft: 15,
    fontSize: 18,
    fontWeight: "bold",
    color: "#5a4280",
  },
  infoLabel: {
    fontWeight: "bold",
    color: "#5a4280",
  },

  infoText: {
    fontSize: 14,
    marginTop: 4,
    color: "#444",
    padding: 5,
    paddingLeft: 16,
  },

  similarCard: {
    marginLeft: 15,
    marginVertical: 15,
    width: 130,
  },

  similarImage: { width: "100%", height: 150, borderRadius: 10 },

  similarName: { marginTop: 5, fontSize: 13, color: "#333" },

  /* --- BOTTOM BAR ---- */

  addToBagRow: {
    flexDirection: "row",
    // backgroundColor: "white",
    padding: 10,
    justifyContent: "space-between",
    alignItems: "center",
  },
  addBtn: {
    flex: 1,
    backgroundColor: "#5a4280",
    paddingVertical: 12,
    borderRadius: 10,
    marginRight: 8,
  },

  addBtnText: {
    color: "white",
    textAlign: "center",
    fontSize: 16,
    fontWeight: "bold",
  },

  viewBagBtn: {
    flex: 1,
    backgroundColor: "#ffffff",
    paddingVertical: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#5a4280",
    marginLeft: 8,
  },

  viewBagBtnText: {
    textAlign: "center",
    fontSize: 16,
    fontWeight: "bold",
    color: "#5a4280",
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
