import React, { useContext, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  FlatList,
  Modal,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LikeContext } from "../Context/LikeContext";
import { BagContext } from "../Context/BagContext";
import { useNavigation } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function LikeScreen() {
  const { likedItems, toggleLike } = useContext(LikeContext);
  const { bagItems, addToBag, increaseQty, decreaseQty } =
    useContext(BagContext);

  const navigation = useNavigation();

  // Modal states (same as ProductList)
  const [sizeModal, setSizeModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedSize, setSelectedSize] = useState("");

  const getQty = (id, size) => {
    const found = bagItems.find(
      (item) => item.id === id && item.selectedSize === size
    );
    return found ? found.qty : 0;
  };

  const openSizeModal = (product) => {
    setSelectedProduct(product);
    setSelectedSize("");
    setSizeModal(true);
  };

  const handleAddToBag = () => {
    if (!selectedSize || !selectedProduct) return;
    addToBag({ ...selectedProduct, selectedSize }, 1);
    setSizeModal(false);
  };

  const renderStars = (rating) => {
    const stars = [];
    const full = Math.floor(rating || 0);
    const half = (rating || 0) % 1 !== 0;
    const empty = 5 - full - (half ? 1 : 0);

    for (let i = 0; i < full; i++)
      stars.push(
        <Ionicons key={`f${i}`} name="star" size={12} color="#f5b50a" />
      );

    if (half)
      stars.push(
        <Ionicons key="h" name="star-half" size={12} color="#f5b50a" />
      );

    for (let i = 0; i < empty; i++)
      stars.push(
        <Ionicons key={`e${i}`} name="star-outline" size={12} color="#f5b50a" />
      );

    return <View style={{ flexDirection: "row" }}>{stars}</View>;
  };

  const renderProductCard = ({ item }) => {
    return (
      <TouchableOpacity
        style={styles.squareCard}
        onPress={() =>
          navigation.navigate("ProductDetails", {
            item,
            category: item.category ?? "Long Kurtis",
          })
        }
      >
        {/* IMAGE */}
        <Image source={item.image} style={styles.productImage} />

        {/* LIKE ICON */}
        <TouchableOpacity
          style={styles.heartIcon}
          onPress={() => toggleLike(item, item.category)}
        >
          <Ionicons name="heart" size={24} color="#5a4280" />
        </TouchableOpacity>

        {/* INFO */}
        <Text style={styles.productName}>{item.name}</Text>
        <Text style={styles.productPrice}>{item.price}</Text>
        <View
          style={{ flexDirection: "row", alignItems: "center", marginTop: 4 }}
        >
          {renderStars(item.rating)}
          <Text style={{ fontSize: 12, marginLeft: 6, color: "#333" }}>
            {item.rating || "-"}
          </Text>
        </View>

        {/* ADD TO BAG / QTY */}
        {bagItems.some((b) => b.id === item.id) ? (
          <View style={{ marginTop: 8 }}>
            {["XS", "S", "M", "L", "XL", "XXL"].map((size) => {
              const q = getQty(item.id, size);
              if (q === 0) return null;

              return (
                <View key={size} style={styles.qtyRow}>
                  <Text style={{ fontWeight: "bold", color: "#5a4280" }}>
                    {size}
                  </Text>

                  <View style={styles.qtyControls}>
                    <TouchableOpacity
                      style={styles.qtyBtn}
                      onPress={() => decreaseQty(item.id, size)}
                    >
                      <Text style={styles.qtyText}>-</Text>
                    </TouchableOpacity>

                    <Text style={styles.qtyNumber}>{q}</Text>

                    <TouchableOpacity
                      style={styles.qtyBtn}
                      onPress={() => increaseQty(item.id, size)}
                    >
                      <Text style={styles.qtyText}>+</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              );
            })}

            <TouchableOpacity onPress={() => openSizeModal(item)}>
              <Text style={styles.addMoreSize}>+ Add size</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity
            onPress={() => openSizeModal(item)}
            style={styles.addBtn}
          >
            <Ionicons name="bag-add-outline" size={18} color="#fff" />
            <Text style={styles.addBtnText}>Add</Text>
          </TouchableOpacity>
        )}
      </TouchableOpacity>
    );
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
      
        <Text style={styles.headerTitle}>Like</Text>
      </View>

      {/* LIST */}
      {likedItems.length === 0 ? (
        <View style={styles.emptyBox}>
          <Ionicons name="heart-outline" size={50} color="#5a4280" />
          <Text style={styles.emptyText}>No Liked Products</Text>
        </View>
      ) : (
        <FlatList
          data={likedItems}
          numColumns={2}
          contentContainerStyle={{ paddingBottom: 100 }}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderProductCard}
        />
      )}

      {/* SIZE MODAL */}
      <Modal visible={sizeModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>Select Size</Text>

            <View style={styles.sizeGrid}>
              {["XS", "S", "M", "L", "XL", "XXL"].map((s) => (
                <TouchableOpacity
                  key={s}
                  onPress={() => setSelectedSize(s)}
                  style={[
                    styles.sizeBtn,
                    selectedSize === s && styles.sizeBtnActive,
                  ]}
                >
                  <Text
                    style={[
                      styles.sizeText,
                      selectedSize === s && styles.sizeTextActive,
                    ]}
                  >
                    {s}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <TouchableOpacity
              onPress={handleAddToBag}
              style={[
                styles.addToBagBtn,
                !selectedSize && { backgroundColor: "#ccc" },
              ]}
            >
              <Text style={styles.addToBagText}>Add to Bag</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => setSizeModal(false)}>
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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

/* ------------ STYLES (same theme as ProductList) ------------- */
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
  squareCard: {
    width: "46%",
    backgroundColor: "#fff",
    margin: "2%",
    borderRadius: 14,
    padding: 10,
    elevation: 3,
  },

  productImage: {
    width: "100%",
    height: 160,
    borderRadius: 10,
  },

  productName: {
    marginTop: 8,
    fontSize: 14,
    fontWeight: "600",
    color: "#000",
  },

  productPrice: {
    fontSize: 14,
    fontWeight: "700",
    color: "#5a4280",
    marginTop: 4,
  },

  heartIcon: {
    position: "absolute",
    top: 10,
    right: 10,
    backgroundColor: "#ffffffcc",
    padding: 6,
    borderRadius: 20,
  },

  addBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#5a4280",
    paddingVertical: 6,
    justifyContent: "center",
    borderRadius: 8,
    marginTop: 8,
  },

  addBtnText: { color: "#fff", marginLeft: 6 },

  qtyRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 4,
  },

  qtyControls: { flexDirection: "row", alignItems: "center" },

  qtyBtn: {
    backgroundColor: "#5a4280",
    width: 28,
    height: 28,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 5,
  },

  qtyText: { color: "#fff", fontSize: 16 },

  qtyNumber: { marginHorizontal: 10, fontSize: 16 },

  addMoreSize: { color: "#5a4280", fontSize: 13, marginTop: 6 },

  emptyBox: { flex: 1, justifyContent: "center", alignItems: "center" },

  emptyText: { marginTop: 10, fontSize: 18, color: "#5a4280" },

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },

  modalBox: {
    width: "80%",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
  },

  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#5a4280",
    textAlign: "center",
    marginBottom: 10,
  },

  sizeGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
  },

  sizeBtn: {
    borderWidth: 1,
    borderColor: "#5a4280",
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 8,
    margin: 5,
  },

  sizeBtnActive: { backgroundColor: "#5a4280" },

  sizeText: { color: "#5a4280", fontSize: 16 },
  sizeTextActive: { color: "#fff" },

  addToBagBtn: {
    backgroundColor: "#5a4280",
    marginTop: 15,
    padding: 12,
    borderRadius: 10,
  },

  addToBagText: { color: "#fff", textAlign: "center", fontSize: 16 },

  cancelText: {
    marginTop: 12,
    textAlign: "center",
    color: "#5a4280",
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
