import { ScrollView, TextInput } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";
import { View, Image, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import React, { useState } from "react";

export default function ProfileScreen() {
  const navigation = useNavigation();

  // profile data states
  const [name, setName] = useState("Likhitha");
  const [phone, setPhone] = useState("+91 9491328950");
  const [age, setAge] = useState("21");

  const [editing, setEditing] = useState(false);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollAreaStyle}
        contentContainerStyle={styles.scrollContentStyle}
        showsVerticalScrollIndicator={false}
      >
        {/* HEADER */}
        <Text style={styles.header}>My Profile</Text>

        {/* USER CARD */}
        <View style={styles.profileCard}>
          <Image
            style={styles.avatar}
            source={{
              uri: "https://cdn-icons-png.flaticon.com/512/2922/2922561.png",
            }}
          />
          <View>
            <Text style={styles.userName}>{name}</Text>
            <Text style={styles.userPhone}>{phone}</Text>
            <Text style={styles.userPhone}>Age: {age}</Text>
          </View>
        </View>

        {/* EDIT PROFILE SECTION */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account Settings</Text>

          <TouchableOpacity
            style={styles.optionRow}
            onPress={() => setEditing(!editing)}
          >
            <Ionicons name="person-outline" size={24} color="#5a4280" />
            <Text style={styles.optionText}>Edit Profile</Text>
            <Ionicons name="chevron-forward" size={20} color="#5a4280" />
          </TouchableOpacity>

          {/* EDIT TAB */}
          {editing && (
            <View style={styles.editBox}>
              <Text style={styles.label}>Name</Text>
              <TextInput
                style={styles.input}
                value={name}
                onChangeText={setName}
                placeholder="Enter name"
              />

              <Text style={styles.label}>Phone Number</Text>
              <TextInput
                style={styles.input}
                value={phone}
                onChangeText={setPhone}
                placeholder="Enter phone"
                keyboardType="phone-pad"
              />

              <Text style={styles.label}>Age</Text>
              <TextInput
                style={styles.input}
                value={age}
                onChangeText={setAge}
                placeholder="Enter age"
                keyboardType="numeric"
              />

              <View style={styles.editButtons}>
                <TouchableOpacity
                  style={styles.saveBtn}
                  onPress={() => setEditing(false)}
                >
                  <Text style={styles.saveText}>Save</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.cancelBtn}
                  onPress={() => setEditing(false)}
                >
                  <Text style={styles.cancelText}>Cancel</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}

          <TouchableOpacity style={styles.optionRow} onPress={() => navigation.navigate("Addresses")}>
            <Ionicons name="location-outline" size={24} color="#5a4280" />
            <Text style={styles.optionText}>Address</Text>
            <Ionicons name="chevron-forward" size={20} color="#5a4280" />
          </TouchableOpacity>
        </View>

        {/* ORDERS */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>My Orders</Text>

          <TouchableOpacity style={styles.optionRow} onPress={() => navigation.navigate("Orders")}>
            <Ionicons name="cube-outline" size={24} color="#5a4280" />
            <Text style={styles.optionText}>View Orders</Text>
            <Ionicons name="chevron-forward" size={20} color="#5a4280" />
          </TouchableOpacity>
        </View>

        {/* SUPPORT SECTION */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Support</Text>

          <TouchableOpacity style={styles.optionRow}>
            <Ionicons name="help-circle-outline" size={24} color="#5a4280" />
            <Text style={styles.optionText}>Help & Support</Text>
            <Ionicons name="chevron-forward" size={20} color="#5a4280" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.optionRow}>
            <Ionicons name="document-text-outline" size={24} color="#5a4280" />
            <Text style={styles.optionText}>Terms & Conditions</Text>
            <Ionicons name="chevron-forward" size={20} color="#5a4280" />
          </TouchableOpacity>
        </View>

        {/* SIGN OUT */}
        <TouchableOpacity
          style={styles.signOutBtn}
          onPress={() => navigation.navigate("Welcome")}
        >
          <Ionicons name="log-out-outline" size={24} color="#fff" />
          <Text style={styles.signOutText}>Sign Out</Text>
        </TouchableOpacity>
      </ScrollView>

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

        <TouchableOpacity>
          <Ionicons name="person-outline" size={28} color="#5a4280" />
          <Text>Profile</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#ded5f8" },
  scrollAreaStyle: { flex: 1 },
  scrollContentStyle: { paddingBottom: 120, paddingHorizontal: 20 },
  header: { fontSize: 26, fontWeight: "bold", marginVertical: 15, color: "#5a4280" },

  profileCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f3ecff",
    padding: 15,
    borderRadius: 14,
    marginBottom: 20,
    elevation: 2,
  },

  avatar: { width: 70, height: 70, borderRadius: 50, marginRight: 15 },
  userName: { fontSize: 20, fontWeight: "700", color: "#5a4280" },
  userPhone: { fontSize: 14, color: "#555", marginTop: 4 },

  section: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 14,
    marginBottom: 20,
    elevation: 2,
  },

  sectionTitle: { fontSize: 16, fontWeight: "bold", color: "#5a4280", marginBottom: 12 },

  optionRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderColor: "#eee",
  },

  optionText: { flex: 1, marginLeft: 12, fontSize: 15, fontWeight: "500", color: "#333" },

  /** EDIT BOX */
  editBox: {
    backgroundColor: "#f8f2ff",
    padding: 12,
    borderRadius: 10,
    marginTop: 10,
  },

  label: {
    fontSize: 14,
    color: "#5a4280",
    marginTop: 10,
    fontWeight: "600",
  },

  input: {
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#d3c4f7",
    marginTop: 5,
  },

  editButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 15,
  },

  saveBtn: {
    backgroundColor: "#5a4280",
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 10,
  },

  saveText: { color: "#fff", fontWeight: "600" },

  cancelBtn: {
    backgroundColor: "#ddd",
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 10,
  },

  cancelText: { color: "#333", fontWeight: "600" },

  signOutBtn: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#5a4280",
    paddingVertical: 14,
    borderRadius: 12,
    marginTop: 10,
  },

  signOutText: { color: "#fff", fontSize: 16, marginLeft: 8, fontWeight: "600" },

  bottomNavStyle: {
    height: 60,
    backgroundColor: "#ffffff",
    borderTopWidth: 1,
    borderColor: "#aa88ff",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    position: "absolute",
    bottom: 0,
    width: "100%",
  },
});