import { useEffect, useRef } from "react";
import { View,Text, Image, StyleSheet, Pressable, Animated, Easing,} from "react-native";

export default function WelcomeScreen({ navigation }) {
  const welcomeTranslate = useRef(new Animated.Value(-400)).current;
  const existingTranslate = useRef(new Animated.Value(-400)).current;
  const newTranslate = useRef(new Animated.Value(-400)).current;

  useEffect(() => {
    Animated.stagger(180, [
      Animated.timing(welcomeTranslate, {
        toValue: 0,
        duration: 800,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(existingTranslate, {
        toValue: 0,
        duration: 800,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(newTranslate, {
        toValue: 0,
        duration: 800,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start();
  }, [welcomeTranslate, existingTranslate, newTranslate]);

  return (
    <View style={styles.container}>
      <Image source={require("../../assets/ShoppyHeader.png")} />
      <Animated.Text
        style={[
          styles.welcomestyle,
          { transform: [{ translateX: welcomeTranslate }] },
        ]}
      >
        Welcome to Shoppy
      </Animated.Text>
      <Animated.Text
        style={[
          styles.textstyle,
          { transform: [{ translateX: existingTranslate }] },
        ]}
      >
        Existing User:
      </Animated.Text>
      <Pressable
        onPress={() => navigation.navigate("SignIn")}
        style={({ pressed }) => [
          styles.button,
          pressed && styles.buttonPressed,
        ]}
      >
        <Text style={styles.Buttontext}>Sign In</Text>
      </Pressable>
      <Animated.Text
        style={[
          styles.textstyle,
          { transform: [{ translateX: newTranslate }] },
        ]}
      >
        New User:
      </Animated.Text>
      <Pressable
        onPress={() => navigation.navigate("SignUp")}
        style={({ pressed }) => [
          styles.button,
          pressed && styles.buttonPressed,
        ]}
      >
        <Text style={styles.Buttontext}>Sign Up</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 45,
    alignItems: "center",
    paddingVertical: "240",
    backgroundColor: "#ded5f8ff",
  },
  welcomestyle: {
    fontSize: 35,
    justifyContent: "center",
    fontWeight: "bold",
    color: "#5a4280ff",
    marginHorizontal: 10,
    padding: 10,
  },
  textstyle: {
    fontSize: 18,
    fontWeight: "600",
    margin: 15,
    color: "black",
  },
  button: {
    width: 200,
    paddingVertical: 15,
    paddingHorizontal: 50,
    backgroundColor: "#8640a286",
    borderRadius: 25,
    alignItems: "center",
    marginBottom: 15,
    marginHorizontal: 35,
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
});
