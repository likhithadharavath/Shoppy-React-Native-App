import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  StyleSheet,
} from "react-native";

export default function SearchScreen() {
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
