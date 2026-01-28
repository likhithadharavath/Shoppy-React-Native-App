import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

export default function AddressScreen({ navigation }) {
  const [addresses, setAddresses] = useState([]);
  const [showForm, setShowForm] = useState(false);

  const [line, setLine] = useState("");
  const [district, setDistrict] = useState("");
  const [state, setState] = useState("");
  const [pincode, setPincode] = useState("");

  const [errors, setErrors] = useState({});

  // --- STRICT VALIDATION FUNCTIONS ---

  // Address line → Must contain letters + numbers and min 10 chars
  const validateLine = (t) =>
    /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z0-9 ,./#-]{10,}$/.test(t);

  // District → Only alphabetic, each word min 2–3 characters
  const validateDistrict = (t) => /^[A-Za-z]{3,}(?: [A-Za-z]{2,})*$/.test(t);

  // State → Same as district
  const validateState = (t) => /^[A-Za-z]{3,}(?: [A-Za-z]{2,})*$/.test(t);

  // Pincode → strict Indian PIN, rejects all same digits
  const validatePincode = (t) => {
    const pinRegex = /^[1-9][0-9]{5}$/;
    const repeated = /^(\d)\1+$/; // 111111, 222222
    return pinRegex.test(t) && !repeated.test(t);
  };

  const validateAll = () => {
    setErrors({
      line: validateLine(line)
        ? ""
        : "Must contain letters & numbers, min 10 chars.",
      district: validateDistrict(district)
        ? ""
        : "Enter a valid district name (letters only).",
      state: validateState(state)
        ? ""
        : "Enter a valid state name (letters only).",
      pincode: validatePincode(pincode)
        ? ""
        : "Enter a valid 6-digit Indian pincode.",
    });
  };

  const isFormValid =
    validateLine(line) &&
    validateDistrict(district) &&
    validateState(state) &&
    validatePincode(pincode);

  const saveAddress = () => {
    if (!isFormValid) return Alert.alert("Error", "Fix errors first");

    if (addresses.length >= 3)
      return Alert.alert("Limit", "Only 3 addresses allowed");

    const newAddress = {
      id: Date.now(),
      line,
      district,
      state,
      pincode,
      isDefault: addresses.length === 0,
    };

    setAddresses([...addresses, newAddress]);

    setLine("");
    setDistrict("");
    setState("");
    setPincode("");
    setErrors({});
    setShowForm(false);
  };

  const deleteAddress = (id) => {
    const updated = addresses.filter((a) => a.id !== id);

    if (updated.length > 0 && !updated.some((a) => a.isDefault)) {
      updated[0].isDefault = true;
    }

    setAddresses(updated);
  };

  const setDefaultAddress = (id) => {
    setAddresses((prev) => prev.map((a) => ({ ...a, isDefault: a.id === id })));
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 120 }}
      >
        <View style={styles.header}>
  <TouchableOpacity
    style={styles.backBtn}
    onPress={() => navigation.goBack()}
  >
    <Ionicons name="arrow-back" size={26} color="#5a4280" />
  </TouchableOpacity>

  <Text style={styles.headerTitle}>Address</Text>
</View>

        {/* Add Button */}
        <TouchableOpacity
          style={styles.addBtn}
          onPress={() => setShowForm(!showForm)}
        >
          <Ionicons name="add-circle-outline" size={22} color="#fff" />
          <Text style={styles.addBtnText}>Add Address</Text>
        </TouchableOpacity>

        {/* Form */}
        {showForm && (
          <View style={styles.formBox}>
            <Text style={styles.label}>Address Line</Text>
            <TextInput
              value={line}
              onChangeText={(t) => {
                setLine(t);
                validateAll();
              }}
              placeholder="House No, Street..."
              style={styles.input}
            />
            {errors.line ? (
              <Text style={styles.error}>{errors.line}</Text>
            ) : null}

            <Text style={styles.label}>District</Text>
            <TextInput
              value={district}
              onChangeText={(t) => {
                setDistrict(t);
                validateAll();
              }}
              placeholder="District"
              style={styles.input}
            />
            {errors.district ? (
              <Text style={styles.error}>{errors.district}</Text>
            ) : null}

            <Text style={styles.label}>State</Text>
            <TextInput
              value={state}
              onChangeText={(t) => {
                setState(t);
                validateAll();
              }}
              placeholder="State"
              style={styles.input}
            />
            {errors.state ? (
              <Text style={styles.error}>{errors.state}</Text>
            ) : null}

            <Text style={styles.label}>Pincode</Text>
            <TextInput
              value={pincode}
              onChangeText={(t) => {
                setPincode(t);
                validateAll();
              }}
              keyboardType="number-pad"
              maxLength={6}
              placeholder="Pincode"
              style={styles.input}
            />
            {errors.pincode ? (
              <Text style={styles.error}>{errors.pincode}</Text>
            ) : null}

            <TouchableOpacity
              style={[styles.saveBtn, !isFormValid && { opacity: 0.5 }]}
              onPress={saveAddress}
              disabled={!isFormValid}
            >
              <Text style={styles.saveBtnText}>Save Address</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Saved Addresses */}
        {addresses.map((addr) => (
          <View
            key={addr.id}
            style={[styles.addressCard, addr.isDefault && styles.defaultCard]}
          >
            <View style={styles.rowSpace}>
              <Text style={styles.addressLine}>{addr.line}</Text>

              {addr.isDefault && (
                <View style={styles.defaultTag}>
                  <Text style={styles.defaultTagText}>Default</Text>
                </View>
              )}
            </View>

            <Text style={styles.addressText}>
              {addr.district}, {addr.state}
            </Text>
            <Text style={styles.addressText}>Pincode: {addr.pincode}</Text>

            <View style={styles.cardActions}>
              {!addr.isDefault && (
                <TouchableOpacity
                  style={styles.defaultBtn}
                  onPress={() => setDefaultAddress(addr.id)}
                >
                  <Text style={styles.defaultBtnText}>Set Default</Text>
                </TouchableOpacity>
              )}

              <TouchableOpacity
                style={styles.deleteBtn}
                onPress={() => deleteAddress(addr.id)}
              >
                <Text style={styles.deleteBtnText}>Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>

      {/* Bottom Navigation — FIXED */}
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

/* ------------------------ STYLES ------------------------ */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ded5f8",
  },
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

  addBtn: {
    backgroundColor: "#5a4280",
    padding: 12,
    marginTop:15,
    borderRadius: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 15,
    marginHorizontal: 15,
  },

  addBtnText: {
    color: "#fff",
    fontSize: 16,
    marginLeft: 8,
    fontWeight: "700",
  },

  formBox: {
    backgroundColor: "#f7efff",
    padding: 15,
    borderRadius: 12,
    marginHorizontal: 15,
    marginBottom: 20,
    elevation: 2,
  },

  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#5a4280",
    marginTop: 10,
  },

  input: {
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#d8c8ff",
    marginTop: 5,
  },

  error: {
    color: "red",
    fontSize: 12,
    marginTop: 4,
  },

  saveBtn: {
    backgroundColor: "#5a4280",
    paddingVertical: 12,
    borderRadius: 10,
    marginTop: 18,
    alignItems: "center",
  },

  saveBtnText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },

  addressCard: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 12,
    marginHorizontal: 15,
    marginBottom: 15,
    elevation: 2,
  },

  defaultCard: {
    borderWidth: 2,
    borderColor: "#5a4280",
  },

  addressLine: {
    fontSize: 15,
    fontWeight: "700",
    color: "#333",
    marginBottom: 4,
    width: "75%",
  },

  addressText: {
    fontSize: 14,
    color: "#555",
    marginTop: 2,
  },

  defaultTag: {
    backgroundColor: "#5a4280",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },

  defaultTagText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 12,
  },

  rowSpace: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  cardActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 12,
  },

  defaultBtn: {
    backgroundColor: "#ded5f8",
    padding: 10,
    borderRadius: 8,
  },

  defaultBtnText: {
    color: "#5a4280",
    fontWeight: "700",
  },

  deleteBtn: {
    backgroundColor: "#ffdddd",
    padding: 10,
    borderRadius: 8,
  },

  deleteBtnText: {
    color: "#d30000",
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
    zIndex: 20,
    elevation: 10,
  },
});
