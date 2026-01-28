import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
} from "react-native";
import { Ionicons, MaterialIcons, Entypo } from "@expo/vector-icons";
import * as Location from "expo-location";
import { useNavigation, useRoute } from "@react-navigation/native";
import { Picker } from "@react-native-picker/picker";

export default function CheckOutScreen() {
  const navigation = useNavigation();
  const route = useRoute();

  // ERROR STATES
  const [addressError, setAddressError] = useState("");
  const [districtError, setDistrictError] = useState("");
  const [stateError, setStateError] = useState("");
  const [pincodeError, setPincodeError] = useState("");

  const { totalPrice, totalItems, deliveryCharge } = route.params;

  // MANUAL ADDRESS
  const [showForm, setShowForm] = useState(false);
  const [savedAddresses, setSavedAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);

  const [manualAddress, setManualAddress] = useState({
    addressLine: "",
    district: "",
    state: "",
    pincode: "",
  });

  // STATES LIST
  const indianStates = [
    "Andhra Pradesh",
    "Arunachal Pradesh",
    "Assam",
    "Bihar",
    "Chhattisgarh",
    "Goa",
    "Gujarat",
    "Haryana",
    "Himachal Pradesh",
    "Jharkhand",
    "Karnataka",
    "Kerala",
    "Madhya Pradesh",
    "Maharashtra",
    "Manipur",
    "Meghalaya",
    "Mizoram",
    "Nagaland",
    "Odisha",
    "Punjab",
    "Rajasthan",
    "Sikkim",
    "Tamil Nadu",
    "Telangana",
    "Tripura",
    "Uttar Pradesh",
    "Uttarakhand",
    "West Bengal",
    "Delhi",
    "Jammu & Kashmir",
    "Ladakh",
  ];

  // CURRENT LOCATION
  const handleCurrentLocation = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      alert("Permission denied");
      return;
    }

    let loc = await Location.getCurrentPositionAsync({});
    let address = {
      addressLine: `Lat: ${loc.coords.latitude.toFixed(
        4
      )}, Lon: ${loc.coords.longitude.toFixed(4)}`,
      district: "Current Location",
      state: "Auto",
      pincode: "000000",
    };

    setSavedAddresses([address]);
    setSelectedAddress(address);
    setShowForm(false);
  };

  // SAVE MANUAL ADDRESS
  const saveManualAddress = () => {
    if (
      !manualAddress.addressLine ||
      !manualAddress.district ||
      !manualAddress.state ||
      !manualAddress.pincode
    ) {
      alert("Please fill all fields");
      return;
    }

    if (addressError || districtError || stateError || pincodeError) {
      alert("Fix errors before submitting.");
      return;
    }

    setSavedAddresses([manualAddress]);
    setSelectedAddress(manualAddress);
    setShowForm(false);

    setManualAddress({
      addressLine: "",
      district: "",
      state: "",
      pincode: "",
    });
  };

  // COUPONS
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [showCouponBox, setShowCouponBox] = useState(false);

  const availableCoupons = [
    {
      code: "FIRSTBUY50",
      type: "percentage",
      value: 50,
      description: "50% OFF on your order",
    },
    {
      code: "SAVE50",
      type: "flat",
      value: 50,
      description: "Flat ₹50 OFF",
    },
    {
      code: "FIRST20",
      type: "percentage",
      value: 20,
      description: "20% OFF for first-time users",
    },
  ];

  const applyCoupon = (coupon) => {
    setAppliedCoupon(coupon);
    setShowCouponBox(false);
  };

  const removeCoupon = () => setAppliedCoupon(null);

  // GRAND TOTAL
  const grandTotal =
    appliedCoupon?.type === "percentage"
      ? Number(totalPrice) -
        (Number(totalPrice) * appliedCoupon.value) / 100 +
        Number(deliveryCharge)
      : appliedCoupon
      ? Number(totalPrice) - appliedCoupon.value + Number(deliveryCharge)
      : Number(totalPrice) + Number(deliveryCharge);

  // -------------------------
  // UI STARTS
  // -------------------------

  return (
    <ScrollView style={styles.container}>
       <View style={styles.headerRow}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={28} color="#5a4280" />
        </TouchableOpacity>
      
        <Text style={styles.heading}>CheckOut</Text>
      </View>

      {/* ADDRESS */}
      <View style={styles.section}>
        <Text style={styles.subHeading}>Delivery Address</Text>

        <TouchableOpacity
          style={styles.optionBtn}
          onPress={handleCurrentLocation}
        >
          <Ionicons name="location" size={24} color="#5a4280" />
          <Text style={styles.optionText}>Use My Current Location</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.optionBtn}
          onPress={() => setShowForm(true)}
        >
          <Entypo name="edit" size={22} color="#5a4280" />
          <Text style={styles.optionText}>Enter Address Manually</Text>
        </TouchableOpacity>

        {/* FORM */}
        {showForm && (
          <View style={styles.form}>
            {/* ADDRESS LINE */}
            <TextInput
              placeholder="Address Line"
              style={styles.input}
              value={manualAddress.addressLine}
              onChangeText={(txt) => {
                setManualAddress({ ...manualAddress, addressLine: txt });

                if (txt.length < 5) {
                  setAddressError("Address must be at least 5 characters.");
                } else if (!/^[A-Za-z0-9\s,\/\-]+$/.test(txt)) {
                  setAddressError("Only letters, numbers, spaces, '/', '-' allowed.");
                } else {
                  setAddressError("");
                }
              }}
            />
            {addressError ? <Text style={styles.errorText}>{addressError}</Text> : null}

            {/* DISTRICT */}
            <TextInput
              placeholder="City / District"
              style={styles.input}
              value={manualAddress.district}
              onChangeText={(txt) => {
                setManualAddress({ ...manualAddress, district: txt });

                if (txt.length < 3) {
                  setDistrictError("District must be at least 3 letters.");
                } else if (!/^[A-Za-z\s]+$/.test(txt)) {
                  setDistrictError("Only letters allowed.");
                } else {
                  setDistrictError("");
                }
              }}
            />
            {districtError ? <Text style={styles.errorText}>{districtError}</Text> : null}

            {/* STATE */}
            <View style={[styles.input, { padding: 0 }]}>
              <Picker
                selectedValue={manualAddress.state}
                onValueChange={(value) => {
                  setManualAddress({ ...manualAddress, state: value });
                  setStateError(value ? "" : "Please select a state.");
                }}
              >
                <Picker.Item label="Select State" value="" />
                {indianStates.map((st, i) => (
                  <Picker.Item key={i} label={st} value={st} />
                ))}
              </Picker>
            </View>
            {stateError ? <Text style={styles.errorText}>{stateError}</Text> : null}

            {/* PINCODE */}
            <TextInput
              placeholder="Pincode"
              style={styles.input}
              keyboardType="number-pad"
              maxLength={6}
              value={manualAddress.pincode}
              onChangeText={(txt) => {
                setManualAddress({ ...manualAddress, pincode: txt });

                if (!/^[1-9][0-9]{0,5}$/.test(txt)) {
                  setPincodeError("Pincode must start 1–9 & be 6 digits.");
                } else if (txt.length !== 6) {
                  setPincodeError("Pincode must be exactly 6 digits.");
                } else {
                  setPincodeError("");
                }
              }}
            />
            {pincodeError ? <Text style={styles.errorText}>{pincodeError}</Text> : null}

            {/* SAVE BUTTON */}
            <TouchableOpacity
              style={[
                styles.button,
                !!(
                  addressError ||
                  districtError ||
                  stateError ||
                  pincodeError
                ) && { backgroundColor: "#ccc" },
              ]}
              disabled={
                !!(
                  addressError ||
                  districtError ||
                  stateError ||
                  pincodeError
                )
              }
              onPress={saveManualAddress}
            >
              <Text style={styles.buttonText}>Save Address</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* SAVED ADDRESS */}
        {savedAddresses.length > 0 && (
          <View style={{ marginTop: 15 }}>
            <Text style={styles.savedTitle}>Saved Address</Text>

            {savedAddresses.map((addr, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.addressCard,
                  selectedAddress === addr && styles.selectedCard,
                ]}
                onPress={() => setSelectedAddress(addr)}
              >
                <MaterialIcons name="home" size={22} color="#5a4280" />
                <View style={{ marginLeft: 10 }}>
                  <Text style={styles.addrText}>{addr.addressLine}</Text>
                  <Text style={styles.addrSubText}>
                    {addr.district}, {addr.state} - {addr.pincode}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>

      {/* COUPONS */}
      <View style={styles.section}>
        <TouchableOpacity
          style={styles.couponToggle}
          onPress={() => setShowCouponBox(!showCouponBox)}
        >
          <Text style={styles.applyCouponText}>
            {appliedCoupon ? "Coupon Applied" : "Apply Coupon"}
          </Text>
          <Ionicons
            name={showCouponBox ? "chevron-up" : "chevron-down"}
            size={22}
            color="#5a4280"
          />
        </TouchableOpacity>

        {showCouponBox && (
          <View style={styles.couponDropdown}>
            {availableCoupons.map((c, index) => (
              <TouchableOpacity
                key={index}
                style={styles.couponCard}
                onPress={() => applyCoupon(c)}
              >
                <View>
                  <Text style={styles.couponCode}>{c.code}</Text>
                  <Text style={styles.couponDesc}>{c.description}</Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color="#5a4280" />
              </TouchableOpacity>
            ))}
          </View>
        )}

        {appliedCoupon && (
          <View style={styles.appliedRow}>
            <Text style={styles.appliedText}>
              Applied: {appliedCoupon.code}
            </Text>

            <TouchableOpacity style={styles.removeBtn} onPress={removeCoupon}>
              <Text style={styles.removeBtnText}>Remove</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* BILL SUMMARY */}
        <Text style={styles.subHeading}>Bill Summary</Text>

        <View style={styles.row}>
          <Text style={styles.text}>Items ({totalItems})</Text>
          <Text style={styles.text}>₹{totalPrice}</Text>
        </View>

        {appliedCoupon && (
          <View style={styles.row}>
            <Text style={styles.text}>Discount</Text>
            <Text style={[styles.text, { color: "green" }]}>
              -₹
              {appliedCoupon.type === "percentage"
                ? Math.floor((totalPrice * appliedCoupon.value) / 100)
                : appliedCoupon.value}
            </Text>
          </View>
        )}

        <View style={styles.row}>
          <Text style={styles.text}>Delivery Charge</Text>
          <Text style={styles.text}>₹{deliveryCharge}</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.totalText}>Grand Total</Text>
          <Text style={styles.totalText}>₹{grandTotal}</Text>
        </View>
      </View>

      {/* PAYMENT OPTIONS */}
      <View style={styles.paymentContainer}>
        <Text style={styles.subHeading}>Mode of Payment</Text>

        <TouchableOpacity style={styles.paymentOption} onPress={() => navigation.navigate("UPIScreen", { totalPrice, totalItems, deliveryCharge })}>
          <Ionicons name="logo-google" size={22} color="#444" />
          <Text style={styles.paymentText}>UPI</Text>
          <Ionicons name="chevron-forward" size={20} color="#5a4280" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.paymentOption} onPress={() => navigation.navigate("CardScreen", { totalPrice, totalItems, deliveryCharge })}>
          <Ionicons name="card-outline" size={22} color="#444" />
          <Text style={styles.paymentText}>Credit / Debit Card</Text>
          <Ionicons name="chevron-forward" size={20} color="#5a4280" />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.paymentOption}
          onPress={() =>
            navigation.navigate("OrderConfirmedScreen", {
              totalPrice,
              totalItems,
              deliveryCharge,
              grandTotal,
              address: selectedAddress,
              paymentMode: "Cash on Delivery",
            })
          }
        >
          <Ionicons name="cash-outline" size={22} color="green" />
          <Text style={styles.paymentText}>Cash On Delivery</Text>
          <Ionicons name="chevron-forward" size={20} color="#5a4280" />
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

// ---------------------------------------------------------
// STYLE SHEET
// ---------------------------------------------------------
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ded5f8",
    padding: 15,
  },
headerRow: {
  flexDirection: "row",
  alignItems: "center",
  // marginBottom: 5,
  marginTop: 15,
},

backBtn: {
  padding: 6,
  marginRight: 10,
  borderRadius: 10,
},

heading: {
  fontSize: 24,
  fontWeight: "700",
  color: "#5a4280",
},

  errorText: {
    color: "red",
    fontSize: 12,
    marginTop: -5,
    marginBottom: 5,
    marginLeft: 5,
  },
  section: {
    backgroundColor: "#fff",
    padding: 15,
    marginVertical: 10,
    borderRadius: 12,
    elevation: 3,
  },
  subHeading: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#5a4280",
    marginBottom: 5,
    marginTop: 8,
  },
  optionBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#8640a286",
    padding: 12,
    borderRadius: 10,
    marginVertical: 6,
  },
  optionText: {
    marginLeft: 10,
    color: "#fff",
    fontSize: 16,
  },
  form: {
    marginTop: 10,
    backgroundColor: "#eee",
    padding: 10,
    borderRadius: 12,
  },
  input: {
    backgroundColor: "#fff",
    padding: 10,
    borderWidth: 1,
    borderColor: "#5a4280",
    borderRadius: 10,
    marginVertical: 6,
  },
  button: {
    backgroundColor: "#5a4280",
    padding: 12,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 8,
  },
  buttonText: { color: "#fff", fontSize: 16 },
  savedTitle: { fontSize: 18, color: "#5a4280", marginBottom: 8 },
  addressCard: {
    flexDirection: "row",
    padding: 12,
    backgroundColor: "#eee",
    borderRadius: 10,
    marginVertical: 6,
    borderWidth: 1,
    borderColor: "transparent",
  },
  selectedCard: {
    borderColor: "#5a4280",
    backgroundColor: "#e8defc",
  },
  addrText: { fontSize: 16, color: "#000" },
  addrSubText: { fontSize: 14, color: "#5B4E72" },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 4,
  },
  text: { fontSize: 16, color: "#000" },
  totalText: { fontSize: 18, fontWeight: "bold", color: "#5a4280" },
  couponToggle: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  applyCouponText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#5a4280",
  },
  couponDropdown: {
    backgroundColor: "#f3ecff",
    padding: 10,
    borderRadius: 10,
    marginTop: 10,
    borderWidth: 1,
    borderColor: "#c7b4e3",
  },
  couponCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 12,
    backgroundColor: "#fff",
    marginVertical: 6,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#ccc",
  },
  couponCode: {
    fontWeight: "bold",
    fontSize: 16,
    color: "#5a4280",
  },
  couponDesc: { fontSize: 13, color: "#444" },
  appliedRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#e8defc",
    padding: 10,
    borderRadius: 10,
    marginTop: 10,
  },
  appliedText: {
    color: "green",
    fontWeight: "bold",
    fontSize: 15,
  },
  removeBtn: {
    paddingVertical: 6,
    paddingHorizontal: 14,
    backgroundColor: "#5a4280",
    borderRadius: 8,
  },
  removeBtnText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 14,
  },
  paymentContainer: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 12,
    marginVertical: 15,
    elevation: 2,
  },
  paymentOption: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  paymentText: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
    color: "#5a4280",
    fontWeight: "bold",
  },
});
