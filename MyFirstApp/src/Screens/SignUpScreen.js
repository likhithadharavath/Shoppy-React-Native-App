import { Text,  TextInput,  View,  StyleSheet, Pressable,  TouchableOpacity,  Alert,} from "react-native";
import { useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";

export default function SignUpScreen() {
  const navigation = useNavigation();

  const [name, setName] = useState("");
  const [nameError, setNameError] = useState("");
  const [phone, setPhone] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // 🌟 Instant password validation
  const passwordError =
    password.length > 0 &&
    !/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*#?&]).{8,}$/.test(password)
      ? "Password must contain uppercase, lowercase, number & special character."
      : "";

  const confirmError =
    confirmPassword.length > 0 && password !== confirmPassword
      ? "Passwords do not match"
      : "";

  // 🌟 Validate inputs together before submitting
  const validate = () => {
    if (!name || !phone || !password || !confirmPassword) {
      Alert.alert("Error", "All fields are required");
      return;
    }
    if (nameError || phoneError || passwordError || confirmError) {
      Alert.alert("Error", "Please fix all errors before submitting.");
      return;
    }

    handleSignUp();
  };

  const handleSignUp = async () => {
    try {
      const response = await axios.post("http://192.168.1.98:5000/auth/signup", {
        name,
        phone,
        password,
      });

      Alert.alert("Success", response.data.message, [
        { text: "OK", onPress: () => navigation.navigate("SignIn") },
      ]);
    } catch (error) {
      Alert.alert("Error", error.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.textStyle}>Create Your Shoppy Account</Text>

      {/* NAME FIELD */}
      <TextInput
        style={styles.inputStyle}
        placeholder="Enter Your Name"
        value={name}
        onChangeText={(text) => {
          if (!/^[A-Za-z]*$/.test(text)) {
            setNameError("Only alphabets allowed. No spaces.");
            return;
          }
          setName(text);
          setNameError("");
        }}
      />
      {nameError ? (
        <Text style={styles.errorText}>{nameError}</Text>
      ) : null} 

      {/* PHONE FIELD */}
      <TextInput
        style={styles.inputStyle}
        placeholder="Enter Phone Number"
        keyboardType="number-pad"
        maxLength={10}
        value={phone}
        onChangeText={(text) => {
          let cleaned = text.replace(/[^0-9]/g, "");

          if (cleaned.length === 1 && !/^[6-9]/.test(cleaned)) {
            setPhoneError("Phone must start with 6–9.");
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

      {phoneError ? (
        <Text style={styles.errorText}>{phoneError}</Text>
      ) : null}

      {/* PASSWORD FIELD */}
      <View style={styles.inputWrapper}>
        <TextInput
          style={styles.passwordInput}
          placeholder="Enter Password"
          secureTextEntry={!showPassword}
          value={password}
          onChangeText={setPassword}
        />
        <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
          <Ionicons
            name={showPassword ? "eye-off" : "eye"}
            size={20}
            color="#555"
            style={{ marginRight: 10 }}
          />
        </TouchableOpacity>
      </View>

      {passwordError ? (
        <Text style={styles.errorText}>{passwordError}</Text>
      ) : null}

      {/* CONFIRM PASSWORD FIELD */}
      <View style={styles.inputWrapper}>
        <TextInput
          style={styles.passwordInput}
          placeholder="Re-enter Password"
          secureTextEntry={!showConfirmPassword}
          value={confirmPassword}
          onChangeText={setConfirmPassword}
        />
        <TouchableOpacity
          onPress={() => setShowConfirmPassword(!showConfirmPassword)}
        >
          <Ionicons
            name={showConfirmPassword ? "eye-off" : "eye"}
            size={20}
            color="#555"
            style={{ marginRight: 10 }}
          />
        </TouchableOpacity>
      </View>

      {confirmError ? (
        <Text style={styles.errorText}>{confirmError}</Text>
      ) : null}

      {/* SIGN UP BUTTON */}
      <Pressable
        style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]}
        onPress={validate}
      >
        <Text style={styles.Buttontext}>Sign Up</Text>
      </Pressable>

      {/* NAVIGATE TO SIGN IN */}
      <TouchableOpacity onPress={() => navigation.navigate("SignIn")}>
        <Text style={styles.signInText}>
          If existing user, Sign In
        </Text>
      </TouchableOpacity>
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
  textStyle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#5a4280ff",
    padding: 20,
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
    justifyContent: "space-between",
  },
  passwordInput: {
    flex: 1,
    height: "100%",
    paddingHorizontal: 10,
  },
  errorText: {
    color: "red",
    fontSize: 12,
    marginTop: -5,
    marginBottom: 5,
  },
  button: {
    width: 150,
    paddingVertical: 15,
    backgroundColor: "#8640a286",
    borderRadius: 25,
    alignItems: "center",
    margin: 15,
    borderWidth: 1,
  },
  buttonPressed: {
    backgroundColor: "#FFB7D5",
    transform: [{ scale: 0.96 }],
  },
  Buttontext: {
    color: "white",
    fontWeight: "bold",
  },
  signInText: {
    color: "#5a4280ff",
    fontSize: 14,
    fontWeight:"bold",
    textDecorationLine: "underline",
    marginTop: 5,
  },
});
