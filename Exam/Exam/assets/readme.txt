//1-Keyboard//
import React, { useState } from "react";
import {  View,  Text,  TextInput,  TouchableOpacity,  StyleSheet,  KeyboardAvoidingView,  TouchableWithoutFeedback,  Keyboard,  Platform,} from "react-native";
export default function LoginScreen() {
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : "height"}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.container}>
          <Text style={styles.title}>Login</Text>

          <TextInput
            placeholder="Phone Number"
            keyboardType="phone-pad"
            value={phone}
            onChangeText={setPhone}
            style={styles.input}
          />

          <TextInput
            placeholder="Password"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
            style={styles.input}
          />

          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>Login</Text>
          </TouchableOpacity>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 30,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 12,
    marginBottom: 15,
  },
  button: {
    backgroundColor: "#007AFF",
    padding: 15,
    borderRadius: 8,
  },
  buttonText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "bold",
  },
});

//2-Pagination//
import React, { useState } from "react";
import { View, Text, FlatList, ActivityIndicator, StyleSheet, } from "react-native";
export default function PaginationScreen() {
  const PRODUCTS = Array.from({ length: 30 }, (_, i) => ({
    id: i + 1,
    name: `Product ${i + 1}`,}));

  const [visibleData, setVisibleData] = useState(PRODUCTS.slice(0, 10));
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);

  const loadMore = () => {
    if (loading) return;

    setLoading(true);

    setTimeout(() => {
      const nextPage = page + 1;
      const newData = PRODUCTS.slice(0, nextPage * 10);

      setVisibleData(newData);
      setPage(nextPage);
      setLoading(false);
    }, 1000); // fake loading delay
  };

  return (
    <FlatList
      data={visibleData}
      keyExtractor={(item) => item.id.toString()}
      renderItem={({ item }) => (
        <View style={styles.card}>
          <Text>{item.name}</Text>
        </View>
      )}
      onEndReached={loadMore}
      onEndReachedThreshold={0.5}
      ListFooterComponent={
        loading ? <ActivityIndicator size="small" /> : null
      }
    />
  );
}
const styles = StyleSheet.create({
  card: {
    padding: 15,
    borderBottomWidth: 1,
    borderColor: "#ddd",
  },
});

//3-tinder//
import React, { useRef } from 'react';
import { Text, StyleSheet, Dimensions, PanResponder,Animated,} from 'react-native';
const { width } = Dimensions.get('window');
export default function SwipeCard({ data, index, onSwipe }) {
  const translateX = useRef(new Animated.Value(0)).current;
 
  const panResponder = PanResponder.create({
    onMoveShouldSetPanResponder: () => index === 0,
 
    onPanResponderMove: (_, gesture) => {
      translateX.setValue(gesture.dx);
    },
 
    onPanResponderRelease: (_, gesture) => {
      if (Math.abs(gesture.dx) > 120) {
        Animated.timing(translateX, {
          toValue: gesture.dx > 0 ? width : -width,
          duration: 300,
          useNativeDriver: true,
        }).start(onSwipe);
      } else {
        Animated.spring(translateX, {
          toValue: 0,
          useNativeDriver: true,
        }).start();
      }
    },
  });
 
  return (
    <Animated.View
      {...panResponder.panHandlers}
      style={[
        styles.card,
        {
          transform: [
            { translateX },
            { scale: index === 0 ? 1 : 0.95 - index * 0.05 },
            { translateY: index * 10 },
          ],
        },
      ]}
    >
      <Text style={styles.text}>{data.title}</Text>
    </Animated.View>
  );
}
const styles = StyleSheet.create({
  card: {
    position: 'absolute',
    width: '90%',
    height: 200,
    backgroundColor: '#fff',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
  },
  text: {
    fontSize: 22,
    fontWeight: 'bold',
  },
});

import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import SwipeCard from "./src/SwipeCard";
export default function App() {
  const DATA = [
  { id: "1", title: "Card 1" },
  { id: "2", title: "Card 2" },
  { id: "3", title: "Card 3" }, ];
  const [cards, setCards] = useState(DATA);
  const handleSwipe = () => {
    setCards((prev) => prev.slice(1));
  };
  return (
    <View style={styles.container}>
      {cards
        .map((item, index) => (
          <SwipeCard
            key={item.id}
            data={item}
            index={index}
            onSwipe={handleSwipe}
          />
        ))
        .reverse()}
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#eee",
    justifyContent: "center",
    alignItems: "center",
  },
}); 

//7-Out of stock//
import React, { useEffect, useState } from "react";
import { View, Text, FlatList, TouchableOpacity, StyleSheet,} from "react-native";
export default function ProductScreen() {
  const [products, setProducts] = useState([]);
  useEffect(() => { fetchProducts();}, []);
  const fetchProducts = async () => {
    const response = [
      { id: 1, name: "Lipstick", stock: 5 },
      { id: 2, name: "Face Wash", stock: 0 },
      { id: 3, name: "Shampoo", stock: 12 },
    ];
    setProducts(response);
  };
  const renderItem = ({ item }) => {
    const isOutOfStock = item.stock === 0;
    return (
      <View style={styles.card}>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.stock}>Stock: {item.stock}</Text>

        <TouchableOpacity
          disabled={isOutOfStock}
          style={[
            styles.button,
            isOutOfStock && styles.disabledButton,
          ]}
        >
          <Text style={styles.buttonText}>
            {isOutOfStock ? "Out of Stock" : "Add to Cart"}
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <FlatList
      data={products}
      keyExtractor={(item) => item.id.toString()}
      renderItem={renderItem}
    />
  );
}
const styles = StyleSheet.create({
  card: {
    padding: 16,
    paddingTop:35,
    borderBottomWidth: 1,
    borderColor: "#eee",
  },
  name: {
    fontSize: 16,
    fontWeight: "bold",
  },
  stock: {
    marginVertical: 4,
    color: "gray",
  },
  button: {
    backgroundColor: "#2e86de",
    padding: 10,
    borderRadius: 6,
    alignItems: "center",
    marginTop: 6,
  },
  disabledButton: {
    backgroundColor: "#ccc",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
  },
});

//9-match search//
import React, { useState } from "react";
import {  View,  Text,  TextInput,  FlatList,  StyleSheet,} from "react-native";
export default function SearchScreen() {
  const [search, setSearch] = useState("");
  const fruits = [ "Apple","Apricot", "Banana","Amla","Blueberry", "Grapes","PineApple","Mango"];
  const filteredData = fruits.filter(item =>
    item.toLowerCase().startsWith(search.toLowerCase())
  );
  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Search fruits..."
        value={search}
        onChangeText={setSearch}
        style={styles.input}
      />
      <FlatList
        data={filteredData}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <Text style={styles.item}>{item}</Text>
        )}
      />
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    borderRadius: 6,
    marginBottom: 10,
  },
  item: {
    padding: 10,
    fontSize: 16,
    borderBottomWidth: 1,
    borderColor: "#eee",
  },
});

//10- category Search//
import React, { useState } from "react";
import { View, Text, TextInput, FlatList, StyleSheet, }from "react-native";
export default function App() {

  const [searchText, setSearchText] = useState("");

  const products = [
  { id: 1, name: "Lipstick", category: "Beauty and Cosmetics" },
  { id: 2, name: "Face Wash", category: "Beauty and Cosmetics" },
  { id: 3, name: "Milk", category: "Dairy" },
  { id: 4, name: "Apple", category: "Fruits" },
  { id: 5, name: "Shampoo", category: "Beauty and Cosmetics" },
    ];
  const filteredProducts = products.filter(item =>
    item.name.toLowerCase().includes(searchText.toLowerCase()) ||
    item.category.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Search product or category..."
        value={searchText}
        onChangeText={setSearchText}
        style={styles.searchInput}
      />
    <FlatList
        data={filteredProducts}
        keyExtractor={(item) => item.id.toString()}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No products found</Text>
        }
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.productName}>{item.name}</Text>
            <Text style={styles.category}>{item.category}</Text>
          </View>
        )}
      />
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 35,
    padding:15,
    backgroundColor: "#fff",
  },
  searchInput: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
  },
  card: {
    padding: 12,
    borderBottomWidth: 1,
    borderColor: "#eee",
  },
  productName: {
    fontSize: 16,
    fontWeight: "bold",
  },
  category: {
    fontSize: 14,
    color: "gray",
  },
  emptyText: {
    textAlign: "center",
    marginTop: 20,
    color: "gray",
  },
});


import React, { useState } from "react";
import { View, TextInput, FlatList, Text, TouchableOpacity } from "react-native";

export default function App() {
  const categories = [
    "Beauty and Personal Care",
    "Books",
    "Baby Products",
    "Beverages",
    "Electronics",
  ];

  const [query, setQuery] = useState("");

  const results = categories.filter(c =>
    c.toLowerCase().startsWith(query.toLowerCase())
  );

  return (
    <View style={{ padding: 20 }}>
      <TextInput
        value={query}
        onChangeText={setQuery}
        placeholder="Search category"
        style={{ borderWidth: 1, padding: 10 }}
      />

      <FlatList
        data={results}
        keyExtractor={(item) => item}
        renderItem={({ item }) => (
          <TouchableOpacity>
            <Text style={{ padding: 10 }}>{item}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f5f5f5",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 12,
    backgroundColor: "#fff",
    fontSize: 16,
    marginBottom: 10,
  },
  item: {
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
    elevation: 2,
  },
  text: {
    fontSize: 15,
    color: "#333",
  },
});