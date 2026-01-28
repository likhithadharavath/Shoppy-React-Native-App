import {  View, Text, TextInput, StyleSheet, ScrollView, TouchableOpacity, Image, Dimensions, } from "react-native";
import React, { useState, useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useNavigation } from "@react-navigation/native";
import * as Location from "expo-location";
import { baseCategories } from "../Data/categories";
import ProductList from "./ProductList";

export default function HomeScreen({ route }) {
  const [address, setAddress] = useState("Fetching location...");
  const [search, setSearch] = useState("");
  const navigation = useNavigation();
  const carouselRef = React.useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const handleScroll = (event) => {
    const width = event.nativeEvent.layoutMeasurement.width;
    const x = event.nativeEvent.contentOffset.x;
    const index = Math.round(x / width);
    setCurrentIndex(index);
  };
  React.useEffect(() => {
    const interval = setInterval(() => {
      let nextIndex = (currentIndex + 1) % 3;
      carouselRef.current?.scrollTo({
        x: nextIndex * carouselWidth,
        animated: true,
      });
    }, 5000);
    return () => clearInterval(interval);
  }, [currentIndex]);

  const carouselWidth = Dimensions.get("window").width * 0.9;

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setAddress("Location permission denied");
        return;
      }
      let location = await Location.getCurrentPositionAsync({});
      let geo = await Location.reverseGeocodeAsync({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });
      if (geo.length > 0) {
        const item = geo[0];
        const formatted = `${item.name || ""}, ${item.city || ""}`;
        setAddress(formatted);
      }
    })();
  }, []);

  const handleSearch = () => {
    if (!search.trim()) return;

    const text = search.toLowerCase();

    // direct category match (even partial)
    const match = baseCategories.find((cat) =>
      cat.toLowerCase().includes(text)
    );

    if (match) {
      navigation.navigate("ProductList", { category: match });
      setSearch("");
    } else {
      Alert.alert("No Category Found", "Try a valid category name.");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollAreaStyle} contentContainerStyle={styles.scrollContentStyle} showsVerticalScrollIndicator={false}>
        <View style={styles.locationRow}>
          <Ionicons name="location" size={20} color="purple" />
          <View style={{ marginLeft: 6 }}>
            <Text style={styles.deliveryText}>Deliver to</Text>
            <Text style={styles.addressText}>{address}</Text>
          </View>
        </View>

        <View style={styles.searchRow}>
          <View style={styles.searchContainerStyle}>
            <Ionicons
              name="search"
              size={20}
              color="#5a4280ff"
              style={styles.searchIconInside}
              onPress={handleSearch}
            />

            <TextInput
              placeholder="Search here"
              placeholderTextColor="#7a5ba4"
              style={styles.searchInputStyle}
              value={search}
              onChangeText={(text) => setSearch(text)}
              onSubmitEditing={handleSearch} // VERY IMPORTANT
            />
          </View>
          <TouchableOpacity style={styles.notifyButton}>
            <Ionicons
              name="notifications-outline"
              size={28}
              color="#5a4280ff"
              onPress={() => navigation.navigate("Notification")}
            />
          </TouchableOpacity>
        </View>

        <View style={styles.carouselWrapper}>
          <ScrollView
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            ref={carouselRef}
            onScroll={handleScroll}
            scrollEventThrottle={16}
          >
            <TouchableOpacity onPress={() => navigation.navigate("Offer1")}>
              <Image
                source={require("../../assets/couroselimage1.png")}
                style={styles.carouselImage}
              />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate("Offer2")}>
              <Image
                source={require("../../assets/couroselimage2.png")}
                style={styles.carouselImage}
              />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate("Offer3")}>
              <Image
                source={require("../../assets/couroselimage3.png")}
                style={styles.carouselImage}
              />
            </TouchableOpacity>
          </ScrollView>
        </View>

        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Seasonal Buys</Text>
          <View style={styles.seasonRow}>
            <TouchableOpacity
              style={styles.seasonBox}
              onPress={() =>
                navigation.navigate("ProductList", { category: "Sweaters" })
              }
            >
              <Image
                source={require("../../assets/seasonalimage1.png")}
                style={styles.seasonImage}
              />
              <Text style={styles.seasonText}>Sweaters</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.seasonBox}
              onPress={() =>
                navigation.navigate("ProductList", { category: "Coats" })
              }
            >
              <Image
                source={require("../../assets/seasonalimage2.png")}
                style={styles.seasonImage}
              />
              <Text style={styles.seasonText}>Coats</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.seasonBox}
              onPress={() =>
                navigation.navigate("ProductList", { category: "Scarfs" })
              }
            >
              <Image
                source={require("../../assets/seasonalimage3.png")}
                style={styles.seasonImage}
              />
              <Text style={styles.seasonText}>Scarfs</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.priceContainer}>
          <Text style={styles.sectionTitle}>Price Drop </Text>
          <View style={styles.priceRow}>
            <TouchableOpacity
              style={styles.priceBox}
              onPress={() =>
                navigation.navigate("ProductList", { category: "Under 499" })
              }
            >
              <Ionicons name="pricetag-outline" size={34} color="#fff" />
              <Text style={styles.priceText}>Under ₹499</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.priceBox}
              onPress={() =>
                navigation.navigate("ProductList", { category: "Under 999" })
              }
            >
              <Ionicons name="pricetag-outline" size={34} color="#fff" />
              <Text style={styles.priceText}>Under ₹999</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Top Categories</Text>
          <View style={styles.hotGrid}>
            <TouchableOpacity
              style={styles.hotBox}
              onPress={() =>
                navigation.navigate("ProductList", { category: "Chudidars" })
              }
            >
              <Image
                source={require("../../assets/Hotcat1.png")}
                style={styles.hotImage}
              />
              <Text style={styles.hotText}>Chudiar</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.hotBox}
              onPress={() =>
                navigation.navigate("ProductList", { category: "LongKurtis" })
              }
            >
              <Image
                source={require("../../assets/Hotcat2.png")}
                style={styles.hotImage}
              />
              <Text style={styles.hotText}>Kurthi</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.hotBox}
              onPress={() =>
                navigation.navigate("ProductList", { category: "Shirts" })
              }
            >
              <Image
                source={require("../../assets/Hotcat3.png")}
                style={styles.hotImage}
              />
              <Text style={styles.hotText}>Tops</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.hotBox}
              onPress={() =>
                navigation.navigate("ProductList", { category: "Jeans" })
              }
            >
              <Image
                source={require("../../assets/Hotcat4.png")}
                style={styles.hotImage}
              />
              <Text style={styles.hotText}>Jeans</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.hotBox}
              onPress={() =>
                navigation.navigate("ProductList", { category: "Sarees" })
              }
            >
              <Image
                source={require("../../assets/Hotcat5.png")}
                style={styles.hotImage}
              />
              <Text style={styles.hotText}>Sarees</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.hotBox}
              onPress={() =>
                navigation.navigate("ProductList", { category: "Dresses" })
              }
            >
              <Image
                source={require("../../assets/Hotcat6.png")}
                style={styles.hotImage}
              />
              <Text style={styles.hotText}>Dresses</Text>
            </TouchableOpacity>
          </View>
        </View>
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
  container: {
    flex: 1,
    backgroundColor: "#ded5f8ff",
  },
  scrollAreaStyle: {
    flex: 1,
  },
  scrollContentStyle: {
    paddingBottom: 120,
  },
  locationRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    paddingHorizontal: 20,
    paddingVertical: 8,
  },
  deliveryText: {
    fontSize: 12,
    color: "#222",
    fontWeight: "600",
  },
  addressText: {
    fontSize: 13,
    color: "#5a4280ff",
    fontWeight: "500",
  },
  searchRow: {
    flexDirection: "row",
    width: "90%",
    marginTop: 10,
    marginHorizontal: 18,
    justifyContent: "space-between",
  },
  searchContainerStyle: {
    flex: 1,
    height: 45,
    backgroundColor: "#fff",
    borderRadius: 25,
    borderWidth: 1,
    borderColor: "#5a4280ff",
    justifyContent: "center",
  },
  searchIconInside: {
    position: "absolute",
    left: 15,
    zIndex: 10,
  },
  searchInputStyle: {
    height: "100%",
    paddingLeft: 45,
    paddingRight: 10,
    color: "#5a4280ff",
  },
  notifyButton: {
    marginLeft: 12,
    backgroundColor: "#fff",
    height: 45,
    width: 45,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#5a4280ff",
  },
  carouselWrapper: {
    width: "90%",
    height: 200,
    marginTop: 15,
    alignSelf: "center",
    borderRadius: 12,
    overflow: "hidden",
  },
  carouselImage: {
    width: Dimensions.get("window").width * 0.9,
    height: 250,
    borderRadius: 12,
  },
  sectionContainer: {
    width: "95%",
    marginTop: 25,
    paddingLeft: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#5a4280ff",
    marginBottom: 15,
  },
  seasonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  seasonBox: {
    width: "30%",
    backgroundColor: "#ffffff",
    borderRadius: 18,
    height: 110,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#5a4280ff",
    elevation: 3,
  },
  seasonImage: {
    width: 60,
    height: 60,
    borderRadius: 12,
    resizeMode: "cover",
    marginBottom: 6,
  },
  seasonText: {
    marginTop: 8,
    fontSize: 14,
    color: "#5a4280ff",
    fontWeight: "600",
  },
  priceContainer: {
    width: "95%",
    marginTop: 25,
    paddingLeft: 20,
  },
  priceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  priceBox: {
    width: "45%",
    height: 120,
    backgroundColor: "#5a4280ff",
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    elevation: 3,
  },
  priceText: {
    marginTop: 8,
    fontSize: 16,
    fontWeight: "bold",
    color: "#fff",
  },
  hotGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    width: "100%",
  },
  hotBox: {
    width: "30%",
    backgroundColor: "#ffffff",
    borderRadius: 18,
    marginBottom: 20,
    paddingVertical: 10,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#5a4280ff",
    elevation: 3,
  },
  hotImage: {
    width: 80,
    height: 80,
    borderRadius: 12,
    resizeMode: "cover",
  },
  hotText: {
    marginTop: 8,
    fontSize: 14,
    color: "#5a4280ff",
    fontWeight: "600",
    textAlign: "center",
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
