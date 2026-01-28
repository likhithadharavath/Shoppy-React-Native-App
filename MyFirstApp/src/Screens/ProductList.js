import { useContext, useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  Modal,
  ScrollView,
  TextInput,
  Pressable,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRoute, useNavigation } from "@react-navigation/native";
import { productsData } from "../../src/Data/Products";
import { Ionicons } from "@expo/vector-icons";
import { LikeContext } from "../Context/LikeContext";
import { baseCategories } from "../Data/categories";
import { BagContext } from "../Context/BagContext";

export default function ProductList() {
  const route = useRoute();
  const navigation = useNavigation();
  const { category } = route.params;
  const items = productsData[category] || [];
  const { bagItems, addToBag, increaseQty, decreaseQty } =
    useContext(BagContext);

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

  const handleSearch = () => {
    if (!search.trim()) return;

    const text = search.toLowerCase();

    // direct category match (even partial)
    const match = baseCategories.find((cat) =>
      cat.toLowerCase().includes(text)
    );

    if (match) {
      navigation.navigate("ProductsList", { category: match });
      setSearch("");
    } else {
      Alert.alert("No Category Found", "Try a valid category name.");
    }
  };

  // Search
  const [searchText, setSearchText] = useState("");
     
  // Modal & tabs (single modal with two tabs: 'sort' | 'filter')
  const [modalVisible, setModalVisible] = useState(false);
  const [activeTab, setActiveTab] = useState("sort"); // 'sort' or 'filter'

  // Sort state
  const [sortType, setSortType] = useState(null);

  // Filter selection state (multi-select using Sets)
  const priceOptions = [
    { id: "under500", label: "Under ₹500", min: 0, max: 499 },
    { id: "500-1000", label: "₹500 - ₹1000", min: 500, max: 1000 },
    { id: "1000-2000", label: "₹1000 - ₹2000", min: 1000, max: 2000 },
    { id: "2000plus", label: "₹2000 & above", min: 2000, max: Infinity },
  ];

  const ratingOptions = [
    { id: "4", label: "4★ & above", value: 4 },
    { id: "3", label: "3★ & above", value: 3 },
  ];

  const discountOptions = [
    { id: "50", label: "50% & above", min: 50 },
    { id: "30", label: "30% & above", min: 30 },
    { id: "10", label: "10% & above", min: 10 },
  ];

  const sizeOptions = ["XS", "S", "M", "L", "XL", "XXL"];

  const clothTypeOptions = [
    "Cotton",
    "Silk",
    "Chiffon",
    "Georgette",
    "Rayon",
    "Linen",
    "Polyester",
    "Crepe",
    "Velvet",
    "Denim",
    "Wool",
    "Satin",
  ];

  const { likedItems, toggleLike } = useContext(LikeContext);

  // selected filters
  const [selectedMainCats, setSelectedMainCats] = useState(new Set());
  const [selectedPriceIds, setSelectedPriceIds] = useState(new Set());
  const [selectedRatings, setSelectedRatings] = useState(new Set());
  const [selectedDiscounts, setSelectedDiscounts] = useState(new Set());
  const [selectedSizes, setSelectedSizes] = useState(new Set());
  const [selectedClothTypes, setSelectedClothTypes] = useState(new Set());

  // displayed data
  const [displayData, setDisplayData] = useState(items);

  // helpers
  const getNumericPrice = (price) =>
    Number(String(price).replace(/[^0-9]/g, "") || 0);

  const safeMainCategory = (it) =>
    it.mainCategory || it.main_category || it.main || it.main_cat || "";

  const toggleSet = (setter, value) =>
    setter((prev) => {
      const next = new Set(prev);
      if (next.has(value)) next.delete(value);
      else next.add(value);
      return next;
    });

  // compute filtered + searched + sorted data
  const computeFilteredData = () => {
    let data = [...items];

    // 1) apply main category filter (OR across selected)
    if (selectedMainCats.size > 0) {
      const sel = Array.from(selectedMainCats);
      data = data.filter((it) => {
        const mc = String(safeMainCategory(it)).toLowerCase();
        return sel.some((s) => mc === String(s).toLowerCase());
      });
    }

    // 2) price ranges (OR across selected ranges)
    if (selectedPriceIds.size > 0) {
      const ranges = priceOptions.filter((p) => selectedPriceIds.has(p.id));
      data = data.filter((it) => {
        const p = getNumericPrice(it.price);
        if (Number.isNaN(p)) return false;
        return ranges.some(
          (r) =>
            p >= r.min &&
            p <= (r.max === Infinity ? Number.MAX_SAFE_INTEGER : r.max)
        );
      });
    }

    // 3) rating filters (OR)
    if (selectedRatings.size > 0) {
      const mins = Array.from(selectedRatings).map(Number);
      data = data.filter((it) => {
        if (typeof it.rating !== "number") return false;
        return mins.some((min) => it.rating >= min);
      });
    }

    // 4) discount
    if (selectedDiscounts.size > 0) {
      const mins = Array.from(selectedDiscounts).map(Number);
      data = data.filter((it) => {
        const d = typeof it.discount === "number" ? it.discount : 0;
        return mins.some((min) => d >= min);
      });
    }

    // 5) sizes
    if (selectedSizes.size > 0) {
      const sel = Array.from(selectedSizes);
      data = data.filter((it) => {
        if (!it.size) return false;
        if (Array.isArray(it.size)) {
          return sel.some((s) => it.size.includes(s));
        } else {
          return sel.includes(String(it.size));
        }
      });
    }

    // 6) cloth types
    if (selectedClothTypes.size > 0) {
      const sel = Array.from(selectedClothTypes).map((s) => s.toLowerCase());
      data = data.filter((it) => {
        const val = (it.type || it.clothType || "").toString().toLowerCase();
        if (!val) return false;
        // if product type is comma-separated list, check any match
        return sel.some((t) => val.includes(t));
      });
    }

    // 7) search
    if (searchText && searchText.trim() !== "") {
      const lower = searchText.toLowerCase();
      data = data.filter((it) => it.name.toLowerCase().includes(lower));
    }

    // 8) sorting
    if (sortType) {
      if (sortType === "low-high") {
        data.sort(
          (a, b) => getNumericPrice(a.price) - getNumericPrice(b.price)
        );
      } else if (sortType === "high-low") {
        data.sort(
          (a, b) => getNumericPrice(b.price) - getNumericPrice(a.price)
        );
      } else if (sortType === "rating") {
        data.sort((a, b) => (b.rating || 0) - (a.rating || 0));
      } else if (sortType === "discount") {
        data.sort((a, b) => (b.discount || 0) - (a.discount || 0));
      } else if (sortType === "az") {
        data.sort((a, b) => a.name.localeCompare(b.name));
      } else if (sortType === "za") {
        data.sort((a, b) => b.name.localeCompare(a.name));
      }
    }

    setDisplayData(data);
  };

  // run whenever filters/search/sort/items change
  useEffect(() => {
    computeFilteredData();
  }, [
    items,
    Array.from(selectedMainCats).toString(),
    Array.from(selectedPriceIds).toString(),
    Array.from(selectedRatings).toString(),
    Array.from(selectedDiscounts).toString(),
    Array.from(selectedSizes).toString(),
    Array.from(selectedClothTypes).toString(),
    searchText,
    sortType,
  ]);

  // Clear all filters
  const clearFilters = () => {
    setSelectedMainCats(new Set());
    setSelectedPriceIds(new Set());
    setSelectedRatings(new Set());
    setSelectedDiscounts(new Set());
    setSelectedSizes(new Set());
    setSelectedClothTypes(new Set());
  };

  // render stars helper
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

  // UI
  return (
    <SafeAreaView style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>{category}</Text>

        {/* SEARCH */}
        <View style={styles.searchContainer}>
          <Ionicons
            name="search"
            size={20}
            color="#5a4280"
            style={{ marginRight: 8, paddingTop: 6 }}
          />
          <TextInput
            value={searchText}
            onChangeText={setSearchText}
            placeholder="Search products..."
            placeholderTextColor="#777"
            style={styles.searchInput}
          />
          {searchText.length > 0 && (
            <TouchableOpacity
              onPress={() => setSearchText("")}
              style={{ padding: 6 }}
            >
              <Ionicons name="close-circle" size={18} color="#999" />
            </TouchableOpacity>
          )}
        </View>

        {/* icons */}
        <View style={{ flexDirection: "row", gap: 12 }}>
          <TouchableOpacity
            onPress={() => {
              setActiveTab("sort");
              setModalVisible(true);
            }}
            style={{ paddingHorizontal: 6 }}
          >
            <Ionicons name="swap-vertical-outline" size={26} color="#5a4280" />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              setActiveTab("filter");
              setModalVisible(true);
            }}
            style={{ paddingHorizontal: 6 }}
          >
            <Ionicons name="options-outline" size={26} color="#5a4280" />
          </TouchableOpacity>
        </View>
      </View>
      {/* PRODUCT GRID */}
      <FlatList
        data={displayData}
        numColumns={2}
        keyExtractor={(item) => String(item._uid)}
        contentContainerStyle={{ paddingBottom: 110 }}
        renderItem={({ item }) => {
          const isLiked = likedItems.some((i) => i.id === item.id);
          return (
            <TouchableOpacity
              style={styles.productCard}
              onPress={() =>
                navigation.navigate("ProductDetails", { item, category })
              }
            >
              <Image source={item.image} style={styles.productImage} />
              <TouchableOpacity
                style={styles.likeIcon}
                onPress={() => toggleLike(item)}
              >
                <Ionicons
                  name={isLiked ? "heart" : "heart-outline"}
                  size={20}
                  color="#5a4280"
                />
              </TouchableOpacity>

              <Text style={styles.productName}>{item.name}</Text>
              <Text style={styles.productPrice}>
                ₹{getNumericPrice(item.price)}
              </Text>

              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  marginTop: 6,
                }}
              >
                {renderStars(item.rating)}
                <Text style={{ fontSize: 12, marginLeft: 6, color: "#333" }}>
                  {item.rating || "-"}
                </Text>
              </View>
              {/* ADD TO BAG / QTY UI */}
              {
                // check if this product (any size) in bag
                bagItems.some((b) => b.id === item.id) ? (
                  <View style={{ marginTop: 8 }}>
                    {/* Show qty row for each size present */}
                    {["XS", "S", "M", "L", "XL", "XXL"].map((size) => {
                      const qty = getQty(item.id, size);
                      if (qty === 0) return null;

                      return (
                        <View
                          key={size}
                          style={{
                            flexDirection: "row",
                            justifyContent: "space-between",
                            marginVertical: 4,
                          }}
                        >
                          <Text
                            style={{ fontWeight: "bold", color: "#5a4280" }}
                          >
                            {size}
                          </Text>

                          <View
                            style={{
                              flexDirection: "row",
                              alignItems: "center",
                            }}
                          >
                            <TouchableOpacity
                              style={styles.qtyBtn}
                              onPress={() => decreaseQty(item.id, size)}
                            >
                              <Text style={styles.qtyText}>-</Text>
                            </TouchableOpacity>

                            <Text
                              style={{ marginHorizontal: 10, fontSize: 16 }}
                            >
                              {qty}
                            </Text>

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

                    {/* Add another size */}
                    <TouchableOpacity onPress={() => openSizeModal(item)}>
                      <Text
                        style={{ color: "#5a4280", fontSize: 13, marginTop: 6 }}
                      >
                        + Add size
                      </Text>
                    </TouchableOpacity>
                  </View>
                ) : (
                  // If not in bag — show add button
                  <TouchableOpacity
                    onPress={() => openSizeModal(item)}
                    style={styles.addBtn}
                  >
                    <Ionicons name="bag-add-outline" size={18} color="#fff" />
                    <Text style={{ color: "#fff", marginLeft: 6 }}>Add</Text>
                  </TouchableOpacity>
                )
              }
            </TouchableOpacity>
          );
        }}
      />

      {/* SINGLE MODAL with tabs */}
      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            {/* tabs header */}
            <View style={styles.tabHeader}>
              <Pressable
                style={[
                  styles.tabBtn,
                  activeTab === "sort" && styles.tabBtnActive,
                ]}
                onPress={() => setActiveTab("sort")}
              >
                <Text
                  style={[
                    styles.tabText,
                    activeTab === "sort" && styles.tabTextActive,
                  ]}
                >
                  Sort
                </Text>
              </Pressable>
              <Pressable
                style={[
                  styles.tabBtn,
                  activeTab === "filter" && styles.tabBtnActive,
                ]}
                onPress={() => setActiveTab("filter")}
              >
                <Text
                  style={[
                    styles.tabText,
                    activeTab === "filter" && styles.tabTextActive,
                  ]}
                >
                  Filter
                </Text>
              </Pressable>

              <TouchableOpacity
                onPress={() => setModalVisible(false)}
                style={{ marginLeft: "auto", padding: 6 }}
              >
                <Ionicons name="close" size={22} color="#333" />
              </TouchableOpacity>
            </View>

            {/* Content */}
            {activeTab === "sort" ? (
              <View style={{ padding: 12 }}>
                <Text style={styles.modalSectionTitle}>Sort Options</Text>

                <TouchableOpacity
                  style={styles.optionRow}
                  onPress={() => {
                    setSortType("low-high");
                    setModalVisible(false);
                  }}
                >
                  <Text style={styles.optionText}>Price: Low → High</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.optionRow}
                  onPress={() => {
                    setSortType("high-low");
                    setModalVisible(false);
                  }}
                >
                  <Text style={styles.optionText}>Price: High → Low</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.optionRow}
                  onPress={() => {
                    setSortType("rating");
                    setModalVisible(false);
                  }}
                >
                  <Text style={styles.optionText}>Rating: High → Low</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.optionRow}
                  onPress={() => {
                    setSortType("discount");
                    setModalVisible(false);
                  }}
                >
                  <Text style={styles.optionText}>Discount: High → Low</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.optionRow}
                  onPress={() => {
                    setSortType("az");
                    setModalVisible(false);
                  }}
                >
                  <Text style={styles.optionText}>Name: A → Z</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.optionRow}
                  onPress={() => {
                    setSortType("za");
                    setModalVisible(false);
                  }}
                >
                  <Text style={styles.optionText}>Name: Z → A</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.actionBtn,
                    { marginTop: 12, backgroundColor: "#8640a286" },
                  ]}
                  onPress={() => {
                    setSortType(null);
                    setModalVisible(false);
                  }}
                >
                  <Text style={styles.actionBtnText}>Clear Sort</Text>
                </TouchableOpacity>
              </View>
            ) : (
              // FILTER TAB
              <View style={{ flexGrow: 1 }}>
                <ScrollView
                  style={{ paddingHorizontal: 12 }}
                  contentContainerStyle={{ paddingBottom: 40 }}
                  showsVerticalScrollIndicator={false}
                >
                  {/* Price */}
                  <Text style={styles.modalSectionTitle}>Price</Text>
                  <View style={styles.chipsRow}>
                    {priceOptions.map((p) => {
                      const active = selectedPriceIds.has(p.id);
                      return (
                        <TouchableOpacity
                          key={p.id}
                          style={[styles.chip, active && styles.chipActive]}
                          onPress={() => toggleSet(setSelectedPriceIds, p.id)}
                        >
                          <Text
                            style={[
                              styles.chipText,
                              active && styles.chipTextActive,
                            ]}
                          >
                            {p.label}
                          </Text>
                        </TouchableOpacity>
                      );
                    })}
                  </View>

                  {/* Rating */}
                  <Text style={styles.modalSectionTitle}>Rating</Text>
                  <View style={styles.chipsRow}>
                    {ratingOptions.map((r) => {
                      const active = selectedRatings.has(String(r.value));
                      return (
                        <TouchableOpacity
                          key={r.id}
                          style={[styles.chip, active && styles.chipActive]}
                          onPress={() =>
                            toggleSet(setSelectedRatings, String(r.value))
                          }
                        >
                          <Text
                            style={[
                              styles.chipText,
                              active && styles.chipTextActive,
                            ]}
                          >
                            {r.label}
                          </Text>
                        </TouchableOpacity>
                      );
                    })}
                  </View>

                  {/* Discount */}
                  <Text style={styles.modalSectionTitle}>Discount</Text>
                  <View style={styles.chipsRow}>
                    {discountOptions.map((d) => {
                      const active = selectedDiscounts.has(String(d.min));
                      return (
                        <TouchableOpacity
                          key={d.id}
                          style={[styles.chip, active && styles.chipActive]}
                          onPress={() =>
                            toggleSet(setSelectedDiscounts, String(d.min))
                          }
                        >
                          <Text
                            style={[
                              styles.chipText,
                              active && styles.chipTextActive,
                            ]}
                          >
                            {d.label}
                          </Text>
                        </TouchableOpacity>
                      );
                    })}
                  </View>

                  {/* Size */}
                  <Text style={styles.modalSectionTitle}>Size</Text>
                  <View style={styles.chipsRow}>
                    {sizeOptions.map((s) => {
                      const active = selectedSizes.has(s);
                      return (
                        <TouchableOpacity
                          key={s}
                          style={[styles.chip, active && styles.chipActive]}
                          onPress={() => toggleSet(setSelectedSizes, s)}
                        >
                          <Text
                            style={[
                              styles.chipText,
                              active && styles.chipTextActive,
                            ]}
                          >
                            {s}
                          </Text>
                        </TouchableOpacity>
                      );
                    })}
                  </View>

                  {/* Cloth Type */}
                  <Text style={styles.modalSectionTitle}>Cloth Type</Text>
                  <View style={styles.chipsRow}>
                    {clothTypeOptions.map((t) => {
                      const active = selectedClothTypes.has(t);
                      return (
                        <TouchableOpacity
                          key={t}
                          style={[styles.chip, active && styles.chipActive]}
                          onPress={() => toggleSet(setSelectedClothTypes, t)}
                        >
                          <Text
                            style={[
                              styles.chipText,
                              active && styles.chipTextActive,
                            ]}
                          >
                            {t}
                          </Text>
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                

                <View style={{ height: 28 }} />
                {/* Footer actions */}
                <View style={styles.filterFooter}>
                  <TouchableOpacity
                    style={styles.clearBtn}
                    onPress={clearFilters}
                  >
                    <Text style={styles.clearBtnText}>Clear Filters</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.applyBtn}
                    onPress={() => {
                      // computeFilteredData will run due to state changes
                      setModalVisible(false);
                    }}
                  >
                    <Text style={styles.applyBtnText}>Apply</Text>
                  </TouchableOpacity>
                </View>
                </ScrollView>
              </View>
            )}
          </View>
        </View>
      </Modal>
      <Modal visible={sizeModal} transparent animationType="fade">
        <View style={styles.sizeOverlay}>
          <View style={styles.sizeBox}>
            <Text style={styles.modalTitle}>Select Size</Text>

            <View
              style={{
                flexDirection: "row",
                flexWrap: "wrap",
                justifyContent: "center",
              }}
            >
              {["XS", "S", "M", "L", "XL", "XXL"].map((size) => (
                <TouchableOpacity
                  key={size}
                  onPress={() => setSelectedSize(size)}
                  style={[
                    styles.sizeBtn,
                    selectedSize === size && styles.sizeBtnActive,
                  ]}
                >
                  <Text
                    style={[
                      styles.sizeText,
                      selectedSize === size && styles.sizeTextActive,
                    ]}
                  >
                    {size}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <TouchableOpacity
              onPress={handleAddToBag}
              disabled={!selectedSize}
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

/* ---------------- STYLES (theme applied) ---------------- */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ded5f8ff",
  },
  header: {
    height: 60,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    justifyContent: "space-between",
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#5a4280ff",
  },
  searchContainer: {
    flex: 1,
    height: 44,
    marginHorizontal: 12,
    backgroundColor: "#fff",
    borderRadius: 22,
    borderWidth: 1,
    borderColor: "#5a4280ff",
    paddingHorizontal: 12,
    flexDirection: "row",
    alignItems: "center",
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: "#000000",
  },
  productCard: {
    width: "46%",
    backgroundColor: "#ffffff",
    margin: "2%",
    borderRadius: 12,
    padding: 10,
    elevation: 3,
    position: "relative",
  },
  productImage: {
    width: "100%",
    height: 165,
    borderRadius: 10,
  },
  likeIcon: {
    position: "absolute",
    top: 10,
    right: 10,
    backgroundColor: "#ffffffcc",
    padding: 6,
    borderRadius: 50,
  },
  productName: {
    marginTop: 8,
    fontSize: 14,
    fontWeight: "600",
    color: "#000000",
  },
  productPrice: {
    marginTop: 6,
    fontSize: 14,
    fontWeight: "700",
    color: "#5a4280ff",
  },

  /* Modal */
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.35)",
    justifyContent: "flex-end",
  },
  modalBox: {
    height: "70%", // ← ADD THIS (same height always)
    backgroundColor: "#fff",
    borderTopLeftRadius: 14,
    borderTopRightRadius: 14,
    paddingBottom: 8,
    overflow: "hidden",
  },
  tabHeader: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },

  tabBtn: {
    flex: 1, 
    alignItems: "center", 
    paddingVertical: 10,
    borderRadius: 20,
    marginRight: 8,
  },

  tabBtnActive: {
    backgroundColor: "#8640a286",
  },
  tabText: {
    color: "#5B4E72",
    fontWeight: "700",
  },
  tabTextActive: {
    color: "#ffffff",
  },

  modalSectionTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#5a4280ff",
    marginBottom: 8,
  },
  optionRow: {
    paddingVertical: 12,
    borderBottomColor: "#eee",
    borderBottomWidth: 1,
  },
  optionText: {
    color: "#333",
    fontSize: 15,
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

  qtyBtn: {
    backgroundColor: "#5a4280",
    width: 28,
    height: 28,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 5,
  },
  qtyText: { color: "#fff", fontSize: 16 },

  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#5a4280",
    textAlign: "center",
    marginBottom: 14,
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
    padding: 12,
    borderRadius: 10,
    marginTop: 16,
  },
  addToBagText: { color: "#fff", textAlign: "center", fontSize: 16 },

  cancelText: {
    marginTop: 12,
    textAlign: "center",
    color: "#5a4280",
    fontWeight: "bold",
    fontSize: 15,
  },
  sizeOverlay: {
  flex: 1,
  backgroundColor: "rgba(0,0,0,0.45)",
  justifyContent: "center",
  alignItems: "center",
},
sizeBox: {
  width: "80%",
  backgroundColor: "#fff",
  borderRadius: 16,
  padding: 20,
  elevation: 10,
  shadowColor: "#000",
  shadowOpacity: 0.25,
  shadowRadius: 6,
  alignItems: "center",
},
  /* chips */
  chipsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 10,
  },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#ddd",
    marginRight: 8,
    marginBottom: 8,
    backgroundColor: "#fff",
  },
  chipActive: {
    backgroundColor: "#8640a286",
    borderColor: "#8640a286",
  },
  chipText: {
    color: "#333",
    fontSize: 13,
    fontWeight: "600",
  },
  chipTextActive: {
    color: "#ffffff",
  },

  filterFooter: {
    flexDirection: "row",
    padding: 12,
    borderTopColor: "#eee",
    borderTopWidth: 1,
    backgroundColor: "#fff",
    paddingBottom:18,
  },
  clearBtn: {
    flex: 1,
    marginRight: 8,
    backgroundColor: "#fff",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ddd",
    paddingVertical: 12,
    alignItems: "center",
  },
  clearBtnText: {
    color: "#5B4E72",
    fontWeight: "700",
  },
  applyBtn: {
    flex: 1,
    backgroundColor: "#8640a286",
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: "center",
  },
  applyBtnText: {
    color: "#ffffff",
    fontWeight: "700",
  },

  actionBtn: {
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: "center",
  },
  actionBtnText: {
    color: "#fff",
    fontWeight: "700",
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
