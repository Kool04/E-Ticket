import * as React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import TabNavigator from "./src/navigator/TabNavigator";
import LoginScreen from "./src/screens/LoginScreen";
import SignUpScreen from "./src/screens/SignUpScreen";
import SpectacleDetailsScreen from "./src/screens/SpectacleDetailsScreen";
import SeatBookingScreen from "./src/screens/SeatBookingScreen";
import HomeScreen from "./src/screens/HomeScreen";
import TicketDetailsScreen from "./src/screens/TicketDetailsScreen";
import PlaceScreen from "./src/screens/PlaceScreen";
import * as Font from "expo-font";

const Stack = createNativeStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Login"
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{ animation: "default" }}
        />
        <Stack.Screen
          name="SignUp"
          component={SignUpScreen}
          options={{ animation: "default" }}
        />
        <Stack.Screen
          name="Tab"
          component={TabNavigator}
          options={{ animation: "default" }}
        />
        <Stack.Screen
          name="SpectacleDetails"
          component={SpectacleDetailsScreen}
          options={{ animation: "slide_from_right" }}
        />
        <Stack.Screen
          name="TicketDetails"
          component={TicketDetailsScreen}
          options={{ animation: "slide_from_right" }}
        />
        <Stack.Screen
          name="SeatBooking"
          component={SeatBookingScreen}
          options={{ animation: "slide_from_bottom" }}
        />
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ animation: "default" }}
        />
        {/*<Stack.Screen name="PlaceScreen" component={PlaceScreen} options={{animation: 'slide_from_bottom'}}/>*/}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
