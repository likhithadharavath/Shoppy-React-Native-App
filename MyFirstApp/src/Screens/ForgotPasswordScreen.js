import {
  Text,
  TextInput,
  View,
  StyleSheet,
  Pressable,
  TouchableOpacity,
  Alert,
} from "react-native";
import React, { useState } from "react";
import axios from "axios";
import { Ionicons } from "@expo/vector-icons";

export default function ForgotPasswordScreen({ navigation }) {
  const [phone, setPhone] = useState("");
  const [phoneError, setPhoneError] = useState("");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPass, setShowPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);

  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");

  // -------------------
  // VALIDATION + SUBMIT
  // -------------------
  const handleSubmit = async () => {
    if (!phone || !password || !confirmPassword) {
      Alert.alert("Error", "All fields are required");
      return;
    }

    if (!/^[6-9][0-9]{9}$/.test(phone)) {
      Alert.alert("Error", "Enter a valid 10-digit phone number");
      return;
    }

    if (
      !/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*#?&]).{8,}$/.test(password)
    ) {
      Alert.alert(
        "Error",
        "Password must include 8 chars, Uppercase, Lowercase, Number, Special character."
      );
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match");
      return;
    }

    try {
      const response = await axios.post(
        "http://192.168.1.98:5000/auth/forgot-password",
        {
          phone,
          password,
        }
      );

      Alert.alert("Success", response.data.message, [
        { text: "OK", onPress: () => navigation.navigate("SignIn") },
      ]);
    } catch (error) {
      Alert.alert(
        "Error",
        error.response?.data?.message || "Something went wrong"
      );
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.textStyle}>Reset Your Password</Text>

      {/* PHONE INPUT */}
      <TextInput
        style={styles.inputStyle}
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
            setPhoneError("Phone must be 10 digits.");
          } else setPhoneError("");

          setPhone(cleaned);
        }}
      />

      {phoneError ? <Text style={styles.errorText}>{phoneError}</Text> : null}

      {/* NEW PASSWORD */}
      <View style={styles.inputWrapper}>
        <TextInput
          style={styles.passwordInput}
          placeholder="Enter New Password"
          secureTextEntry={!showPass}
          value={password}
          onChangeText={(text) => {
            setPassword(text);

            const rule =
              /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*#?&]).{8,}$/;

            if (text.length === 0) {
              setPasswordError("");
            } else if (!rule.test(text)) {
              setPasswordError(
                "Min 8 characters, include uppercase, lowercase, number & special char."
              );
            } else {
              setPasswordError("");
            }
          }}
        />

        <TouchableOpacity onPress={() => setShowPass(!showPass)}>
          <Ionicons
            name={showPass ? "eye-off" : "eye"}
            size={20}
            color="#555"
            style={{ marginRight: 10 }}
          />
        </TouchableOpacity>
      </View>

      {/* ERROR BELOW BOX */}
      {passwordError ? (
        <Text style={styles.errorText}>{passwordError}</Text>
      ) : null}

      {/* CONFIRM PASSWORD */}
      <View style={styles.inputWrapper}>
        <TextInput
          style={styles.passwordInput}
          placeholder="Confirm New Password"
          secureTextEntry={!showConfirmPass}
          value={confirmPassword}
          onChangeText={(text) => {
            setConfirmPassword(text);

            if (text.length === 0) {
              setConfirmPasswordError("");
            } else if (text !== password) {
              setConfirmPasswordError("Passwords do not match");
            } else {
              setConfirmPasswordError("");
            }
          }}
        />

        <TouchableOpacity onPress={() => setShowConfirmPass(!showConfirmPass)}>
          <Ionicons
            name={showConfirmPass ? "eye-off" : "eye"}
            size={20}
            color="#555"
            style={{ marginRight: 10 }}
          />
        </TouchableOpacity>
      </View>

      {/* ERROR BELOW BOX */}
      {confirmPasswordError ? (
        <Text style={styles.errorText}>{confirmPasswordError}</Text>
      ) : null}

        <Pressable
        style={({ pressed }) => [
          styles.button,
          pressed && styles.buttonPressed,
        ]}
        onPress={handleSubmit}
      >
        <Text style={styles.Buttontext}>Submit</Text>
      </Pressable>

      {/* Back to Sign In */}
      <TouchableOpacity onPress={() => navigation.navigate("SignIn")}>
        <Text style={styles.signinLink}>Back to Sign In</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#ded5f8ff",
  },
  textStyle: {
    fontSize: 22,
    marginTop: 40,
    marginBottom: 20,
    fontWeight: "bold",
    color: "#5a4280ff",
  },
  inputStyle: {
    borderWidth: 1,
    margin: 10,
    width: 200,
    height: 45,
    borderRadius: 5,
    backgroundColor: "#fff",
    paddingHorizontal: 10,
  },
  inputWrapper: {
    width: 200,
    height: 45,
    borderWidth: 1,
    borderRadius: 5,
    backgroundColor: "#fff",
    margin: 10,
    flexDirection: "row",
    alignItems: "center",
  },
  passwordInput: {
    flex: 1,
    paddingHorizontal: 10,
  },
  errorText: {
    color: "red",
    marginTop: -5,
    fontSize: 12,
  },
  button: {
    width: 150,
    paddingVertical: 15,
    backgroundColor: "#8640a286",
    borderColor: "#5a4280ff",
    borderWidth: 1,
    borderRadius: 25,
    alignItems: "center",
    marginTop: 10,
  },
  buttonPressed: {
    backgroundColor: "#FFB7D5",
    transform: [{ scale: 0.96 }],
  },
  Buttontext: {
    color: "white",
    fontWeight: "bold",
  },
  signinLink: {
    color: "#5a4280ff",
    marginTop: 10,
    fontSize: 14,
    fontWeight: "bold",
    marginTop: 10,
    textDecorationLine: "underline",
  },
});
