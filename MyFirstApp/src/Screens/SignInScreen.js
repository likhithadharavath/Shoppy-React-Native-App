import React, { useState } from "react";
import {View,Text,TextInput,Pressable,StyleSheet,TouchableOpacity,Alert,} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import axios from "axios";

export default function SignInScreen({ navigation }) {
  
  const [phone, setPhone] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [showPass, setShowPass] = useState(false);

  // 🟣 Validate before submit
  const validateAndSubmit = async () => {
    if (!phone || !password) {
      Alert.alert("Error", "All fields are required!");
      return;
    }

    if (phoneError || passwordError) {
      Alert.alert("Error", "Please fix all errors before submitting.");
      return;
    }

    handleSignIn();
  };

  // 🟣 Backend Sign In
  const handleSignIn = async () => {
    try {
      const response = await axios.post("http://192.168.1.98:5000/auth/signin", {
        phone,
        password,
      });

      Alert.alert("Success", response.data.message);
      navigation.navigate("Home");
    } catch (error) {
      Alert.alert(
        "Error",
        error.response?.data?.message || "Something went wrong"
      );
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sign In Into Your Shoppy Account</Text>

      {/* PHONE INPUT */}
      <TextInput
        style={styles.input}
        placeholder="Enter Phone Number"
        keyboardType="number-pad"
        maxLength={10}
        value={phone}
        onChangeText={(text) => {
          let cleaned = text.replace(/[^0-9]/g, "");

          if (cleaned.length === 1 && !/^[6-9]/.test(cleaned)) {
            setPhoneError("Phone must start with 6, 7, 8 or 9.");
            return;
          }

          if (cleaned.length < 10) {
            setPhoneError("Phone must be exactly 10 digits.");
          } else {
            setPhoneError("");
          }

          setPhone(cleaned);
        }}
      />

      {phoneError ? <Text style={styles.error}>{phoneError}</Text> : null}

      {/* PASSWORD INPUT */}
      <View style={styles.passwordWrapper}>
        <TextInput
          style={styles.passwordInput}
          placeholder="Enter Password"
          secureTextEntry={!showPass}
          value={password}
          onChangeText={(text) => {
            setPassword(text);

            if (text.length < 8) {
              setPasswordError("Password must be at least 8 characters.");
            } else {
              setPasswordError("");
            }
          }}
        />

        <TouchableOpacity onPress={() => setShowPass(!showPass)}>
          <Ionicons
            name={showPass ? "eye-off" : "eye"}
            size={20}
            color="grey"
            style={{ marginRight: 10 }}
          />
        </TouchableOpacity>
      </View>

      {passwordError ? <Text style={styles.error}>{passwordError}</Text> : null}

      {/* FORGOT PASSWORD */}
      <Text style={styles.forgotText} onPress={() => navigation.navigate("ForgotPassword")}>
        Forgot Password?
      </Text>

      {/* SIGN IN BUTTON */}
      <Pressable
        onPress={validateAndSubmit}
        style={({ pressed }) => [
          styles.button,
          pressed && styles.buttonPressed,
        ]}
      >
        <Text style={styles.buttonText}>Sign In</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent:"center",
    backgroundColor: "#ded5f8ff",
    paddingVertical: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#5a4280ff",
    marginVertical: 20,
  },
  input: {
    borderWidth: 1,
    width: 200,
    height: 45,
    borderRadius: 5,
    marginVertical: 10,
    backgroundColor: "#fff",
    paddingHorizontal: 10,
  },
  passwordWrapper: {
    width: 200,
    height: 45,
    borderWidth: 1,
    borderRadius: 5,
    marginVertical: 10,
    backgroundColor: "#fff",
    flexDirection: "row",
    alignItems: "center",
  },
  passwordInput: {
    flex: 1,
    height: "100%",
    paddingHorizontal: 10,
  },
  forgotText: {
    color: "#5a4280ff",
    marginBottom: 10,
    fontSize: 14,
    fontWeight:"bold",
    textDecorationLine: "underline",
  },
  button: {
    width: 150,
    paddingVertical: 15,
    backgroundColor: "#8640a286",
    borderRadius: 25,
    alignItems: "center",
    marginTop: 15,
    borderWidth: 1,
  },
  buttonPressed: {
    backgroundColor: "#FFB7D5",
    transform: [{ scale: 0.96 }],
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  error: {
    color: "red",
    fontSize: 12,
    marginTop: -5,
    marginBottom: 5,
  },
});
