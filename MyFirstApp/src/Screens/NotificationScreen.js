import { View, Text, StyleSheet, FlatList } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function NotificationScreen() {
  const notifications = []; 

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Notifications</Text>

      {notifications.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons
            name="notifications-off-outline"
            size={70}
            color="#5a4280ff"
          />
          <Text style={styles.emptyText}>No Notifications Yet</Text>
          <Text style={styles.emptySubText}>
            We'll let you know when something arrives.
          </Text>
        </View>
      ) : (
        <FlatList
          data={notifications}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Ionicons
                name="notifications-outline"
                size={24}
                color="#5a4280ff"
              />
              <Text style={styles.cardText}>{item.message}</Text>
            </View>
          )}
          keyExtractor={(item, index) => index.toString()}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ded5f8ff",
    paddingTop: 60,
    paddingHorizontal: 20,
  },
  header: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#5a4280ff",
    marginBottom: 20,
    textAlign: "center",
  },
  emptyContainer: {
    flex: 1,
    alignItems: "center",
    marginTop: 50,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#5a4280ff",
    marginTop: 10,
  },
  emptySubText: {
    color: "#6e6e6e",
    marginTop: 5,
  },
  card: {
    backgroundColor: "#fff",
    padding: 15,
    marginVertical: 8,
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 8,
    elevation: 2, // small shadow
  },
  cardText: {
    marginLeft: 10,
    fontSize: 16,
    color: "#333",
  },
});
