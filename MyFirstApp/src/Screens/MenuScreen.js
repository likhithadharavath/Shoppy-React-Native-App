import React, { useState } from "react";
import { View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  TextInput,
  FlatList,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { baseCategories } from "../Data/categories";

export default function MenuScreen() {
  const navigation = useNavigation();

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
  // 1. Add "All" as the first main category
  const ALL_CATEGORY = {
    id: 0,
    title: "All",
    icon: null, // Ionicon will be used instead of image
  };

  const categories = [
    ALL_CATEGORY,
    { id: 1, title: "Ethnic", icon: require("../../assets/menu/ethnic.png") },
    { id: 2, title: "Western", icon: require("../../assets/menu/western.png") },
    {
      id: 3,
      title: "Footwear",
      icon: require("../../assets/menu/footwear.png"),
    },
    {
      id: 4,
      title: "Nightwear",
      icon: require("../../assets/menu/nightwear.png"),
    },
    // { id: 5, title: "Accessories", icon: require("../../assets/menu/accessories.png") },
    {
      id: 6,
      title: "Body Care",
      icon: require("../../assets/menu/bodycare.png"),
    },
    { id: 7, title: "Bags", icon: require("../../assets/menu/bags.png") },
    {
      id: 8,
      title: "Activewear",
      icon: require("../../assets/menu/activewear.png"),
    },
    { id: 9, title: "Makeup", icon: require("../../assets/menu/makeup.png") },
  ];
  // MERGE ALL SUBCATEGORIES INTO ONE LIST

  const subcategories = {
    1: [
      {
        name: "Long Kurtis",
        img: require("../../assets/sub/ethnic/longkurtis.png"),
      },
      {
        name: "Short Kurtis",
        img: require("../../assets/sub/ethnic/shortkurtis.png"),
      },
      {
        name: "Chudidars",
        img: require("../../assets/sub/ethnic/chudidars.png"),
      },
      { name: "Sarees", img: require("../../assets/sub/ethnic/sarees.png") },
      { name: "Co-ords", img: require("../../assets/sub/ethnic/coords.png") },
    ],
    2: [
      { name: "Shirts", img: require("../../assets/sub/western/shirts.png") },
      {
        name: "T-Shirts",
        img: require("../../assets/sub/western/tshirts.png"),
      },
      { name: "Dresses", img: require("../../assets/sub/western/dresses.png") },
      { name: "Jeans", img: require("../../assets/sub/western/jeans.png") },
      { name: "Coats", img: require("../../assets/sub/western/coats.png") },
    ],
    3: [
      {
        name: "Slippers",
        img: require("../../assets/sub/footwear/slippers.png"),
      },
      {
        name: "Flip Flops",
        img: require("../../assets/sub/footwear/flipflops.png"),
      },
      { name: "Flats", img: require("../../assets/sub/footwear/flats.png") },
      { name: "Heels", img: require("../../assets/sub/footwear/heels.png") },
      { name: "Shoes", img: require("../../assets/sub/footwear/shoes.png") },
    ],
    4: [
      {
        name: "Night Dresses",
        img: require("../../assets/sub/nightwear/nightdress.png"),
      },
      { name: "Shorts", img: require("../../assets/sub/nightwear/shorts.png") },
    ],
    // 5: [
    //     { name: "Chains", img: require("../../assets/sub/accessories/chains.png") },
    //     { name: "Earrings", img: require("../../assets/sub/accessories/earrings.png") },
    //     { name: "Bangles", img: require("../../assets/sub/accessories/bangles.png") },
    //     { name: "Rings", img: require("../../assets/sub/accessories/rings.png") },
    //     { name: "Anklets", img: require("../../assets/sub/accessories/anklets.png") },
    //     { name: "HairBands", img: require("../../assets/sub/accessories/hairband.png") },
    //     { name: "NoseRings", img: require("../../assets/sub/accessories/nosering.png") },
    //     { name: "Watches", img: require("../../assets/sub/accessories/watches.png") },
    // ],
    6: [
      { name: "Towels", img: require("../../assets/sub/bodycare/towels.png") },
      { name: "Socks", img: require("../../assets/sub/bodycare/socks.png") },
      {
        name: "Sweaters",
        img: require("../../assets/sub/bodycare/sweaters.png"),
      },
      { name: "Scarfs", img: require("../../assets/sub/bodycare/scarfs.png") },
    ],
    7: [
      { name: "Handbags", img: require("../../assets/sub/bags/handbags.png") },
      {
        name: "Slingbags",
        img: require("../../assets/sub/bags/slingbags.png"),
      },
      { name: "Purse", img: require("../../assets/sub/bags/purse.png") },
      { name: "Backpack", img: require("../../assets/sub/bags/backpack.png") },
    ],
    8: [
      {
        name: "Gym Wear",
        img: require("../../assets/sub/activewear/gymwear.png"),
      },
      {
        name: "Track Pants",
        img: require("../../assets/sub/activewear/trackpants.png"),
      },
      {
        name: "Tees",
        img: require("../../assets/sub/activewear/yogawear.png"),
      },
    ],
    9: [
      {
        name: "Lipstick",
        img: require("../../assets/sub/makeup/lipstick.png"),
      },
      {
        name: "Foundation",
        img: require("../../assets/sub/makeup/foundation.png"),
      },
      { name: "Kajal", img: require("../../assets/sub/makeup/kajal.png") },
    ],
  };
  
  const allSubCategories = Object.values(subcategories).flat();
  const [activeCategory, setActiveCategory] = useState(0);
  const [search, setSearch] = useState("");

  const filteredSubcategories =
    activeCategory === 0
      ? allSubCategories.filter((item) =>
          item.name.toLowerCase().includes(search.toLowerCase())
        )
      : subcategories[activeCategory].filter((item) =>
          item.name.toLowerCase().includes(search.toLowerCase())
        );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.row}>
        {/* LEFT MENU */}
        <View style={styles.leftMenu}>
          <Text style={styles.menuHeading}>CATEGORIES</Text>
          <ScrollView showsVerticalScrollIndicator={false}>
            {categories.map((cat) => (
              <TouchableOpacity
                key={cat.id}
                onPress={() => {
                  setActiveCategory(cat.id);
                  setSearch("");
                }}
                style={[
                  styles.menuItem,
                  activeCategory === cat.id && styles.menuItemActive,
                ]}
              >
                <View style={styles.iconCircle}>
                  {cat.id === 0 ? (
                    <Ionicons name="apps-outline" size={28} color="#5a4280" />
                  ) : (
                    <Image source={cat.icon} style={styles.menuIcon} />
                  )}
                </View>
                <Text
                  style={[
                    styles.menuText,
                    activeCategory === cat.id && styles.menuTextActive,
                  ]}
                >
                  {cat.title}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* RIGHT SIDE */}
        <View style={styles.rightArea}>
          {/* SEARCH BAR */}
          <View style={styles.searchBox}>
            <Ionicons name="search" size={20} color="#5a4280" />
            <TextInput
              placeholder="Search..."
              placeholderTextColor="#777"
              value={search}
              onChangeText={setSearch}
              style={styles.searchInput}
            />
          </View>

          <Text style={styles.sectionTitle}>
            {categories.find((c) => c.id === activeCategory)?.title}
          </Text>

          <FlatList
            data={filteredSubcategories}
            numColumns={3}
            showsVerticalScrollIndicator={false}
            keyExtractor={(item, index) => index.toString()}
            contentContainerStyle={{ paddingBottom: 80 }}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.subBox}
                onPress={() =>
                  navigation.navigate("ProductList", { category: item.name })
                }
              >
                <Image source={item.img} style={styles.subImage} />
                <Text style={styles.subText}>{item.name}</Text>
              </TouchableOpacity>
            )}
          />
        </View>
      </View>

      {/* BOTTOM NAV */}
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
  container: { flex: 1, backgroundColor: "#ded5f8" },

  row: { flexDirection: "row", flex: 1 },

  leftMenu: {
    width: 100,
    backgroundColor: "#f7f2ff",
    borderRightWidth: 1,
    borderRightColor: "#ddd",
    paddingTop: 10,
    paddingBottom: 60,
  },

  menuHeading: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#5a4280",
    textAlign: "center",
    marginBottom: 10,
  },

  menuItem: {
    alignItems: "center",
    paddingVertical: 15,
  },

  menuItemActive: {
    backgroundColor: "#e3d6ff",
    borderRadius: 10,
    marginHorizontal: 5,
  },

  iconCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 5,
    elevation: 3,
  },

  menuIcon: { width: 35, height: 35, resizeMode: "contain" },

  menuText: { fontSize: 12, color: "#333" },

  menuTextActive: { color: "#5a4280", fontWeight: "bold" },

  rightArea: {
    flex: 1,
    padding: 12,
    backgroundColor: "#ded5f8",
  },

  searchBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    paddingHorizontal: 12,
    borderRadius: 10,
    height: 40,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#baa5e0",
  },

  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 14,
    color: "#333",
  },

  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#5a4280",
    marginBottom: 15,
  },

  subBox: {
    width: "30%",
    backgroundColor: "#f3ecff",
    margin: "1.5%",
    borderRadius: 12,
    padding: 10,
    alignItems: "center",
  },

  subImage: {
    width: 70,
    height: 70,
    borderRadius: 10,
    marginBottom: 8,
    resizeMode: "contain",
  },

  subText: {
    fontSize: 12,
    textAlign: "center",
    color: "#333",
  },

  bottomNavStyle: {
    height: 60,
    backgroundColor: "#ffffff",
    borderTopWidth: 1,
    borderColor: "#5a4280",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    position: "absolute",
    bottom: 0,
    width: "100%",
  },
});
