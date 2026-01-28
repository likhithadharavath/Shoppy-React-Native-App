import { useState } from "react";
import { View, TextInput, FlatList, Text, TouchableOpacity,StyleSheet } from "react-native";

export default function App() {
  const categories = [
    "Beauty and Personal Care",
    "Books",
    "Baby Products",
    "Beverages",
    "Electronics",
    "Clothing",
    "Furniture",
    "Accessories",
    "Travel",
  ];

  const [query, setQuery] = useState("");

  const results = categories.filter(c =>
    c.toLowerCase().startsWith(query.toLowerCase())
  );

  return (
    <View style={{ padding:40 }}>
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