import { StyleSheet } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import WelcomeScreen from "./src/Screens/WelcomeScreen";
import SignUpScreen from "./src/Screens/SignUpScreen";
import SignInScreen from "./src/Screens/SignInScreen";
import ForgotPasswordScreen from "./src/Screens/ForgotPasswordScreen";
import HomeScreen from "./src/Screens/HomeScreen";
import MenuScreen from "./src/Screens/MenuScreen";
import LikeScreen from "./src/Screens/LikeScreen";
import BagScreen from "./src/Screens/BagScreen";
import ProfileScreen from "./src/Screens/ProfileScreen";
import NotificationScreen from "./src/Screens/NotificationScreen";
import ProductDetailsScreen from "./src/Screens/ProductDetailsScreen";
import ProductList from "./src/Screens/ProductList";
import CheckOutScreen from  "./src/Screens/CheckOutScreen";
import UPIScreen from"./src/Screens/UPIScreen";
import CardScreen from "./src/Screens/CardScreen";
import PaymentScreen from "./src/Screens/PaymentScreen";
import OrderConfirmedScreen from "./src/Screens/OrderConfirmedScreen";
import TrackOrderScreen from "./src/Screens/TrackOrderscreen";
import AddressScreen from "./src/Screens/AddressScreen";
import OrdersScreen from "./src/Screens/OrderScreen";
import PaymentProcessingScreen from './src/Screens/PaymentProcessingScreen';

import  LikeProvider  from "./src/Context/LikeContext";
import { BagProvider } from "./src/Context/BagContext";

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <LikeProvider>
        <BagProvider>
          <NavigationContainer>
            <Stack.Navigator screenOptions={{ headerShown: false }}>
              <Stack.Screen name="Welcome" component={WelcomeScreen} />
              <Stack.Screen name="SignUp" component={SignUpScreen} />
              <Stack.Screen name="SignIn" component={SignInScreen} />
              <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
              <Stack.Screen name="Home" component={HomeScreen} />
              <Stack.Screen name="Menu" component={MenuScreen} />
              <Stack.Screen name="ProductList" component={ProductList} />
              <Stack.Screen name ="ProductDetails"component={ProductDetailsScreen}/>
              <Stack.Screen name="Likes" component={LikeScreen} />
              <Stack.Screen name="Bag" component={BagScreen} />
              <Stack.Screen name="Profile" component={ProfileScreen} />
              <Stack.Screen name="CheckOut" component={CheckOutScreen} />
              <Stack.Screen name="UPIScreen" component={UPIScreen} />
              <Stack.Screen name="CardScreen" component={CardScreen} />
              <Stack.Screen name="PaymentProcessingScreen" component={PaymentProcessingScreen} />
              <Stack.Screen name="PaymentScreen" component={PaymentScreen}/>
              <Stack.Screen name="OrderConfirmedScreen" component={OrderConfirmedScreen} />   
              <Stack.Screen name="TrackOrderScreen" component={TrackOrderScreen}/>
              <Stack.Screen name="Notification" component={NotificationScreen}/>
              <Stack.Screen name="Addresses" component={AddressScreen} />
              <Stack.Screen name="Orders" component={OrdersScreen} />
            </Stack.Navigator> 
          </NavigationContainer>
        </BagProvider>
      </LikeProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({});