import React, { useEffect, useState } from "react";
import { View, StyleSheet, Image } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import HomeScreen from "../screens/HomeScreen";
import SearchScreen from "../screens/SearchScreen";
import TicketScreen from "../screens/TicketScreen";
import HomeScreenConcert from "../screens/HomeScreenConcert";
import UserAccountScreen from "../screens/UserAccountScreen";
import { COLORS, FONTSIZE, SPACING } from "../theme/Theme";
import { Ionicons, Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { initializeApp } from "firebase/app";
import { firebaseConfig } from "../../firebase-config";

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth();

const Tab = createBottomTabNavigator();

const TabNavigator = () => {
  const [photoURL, setPhotoURL] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      const user = auth.currentUser;
      if (user) {
        const userDoc = doc(db, "users", user.uid);
        const userSnapshot = await getDoc(userDoc);
        if (userSnapshot.exists()) {
          const userData = userSnapshot.data();
          setPhotoURL(userData.photoURL || null);
        }
      }
    };

    fetchUserProfile();
  }, []);

  return (
    <Tab.Navigator
      screenOptions={{
        tabBarHideOnKeyboard: true,
        headerShown: false,
        tabBarStyle: {
          backgroundColor: COLORS.Black,
          borderTopWidth: 0,
          height: SPACING.space_10 * 10,
        },
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarShowLabel: false,
          tabBarIcon: ({ focused }) => (
            <View
              style={[
                styles.activeTabBackground,
                focused ? { backgroundColor: COLORS.Green } : {},
              ]}
            >
              <Ionicons
                name="home-sharp"
                size={FONTSIZE.size_30}
                color={COLORS.White}
              />
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="Search"
        component={SearchScreen}
        options={{
          tabBarShowLabel: false,
          tabBarIcon: ({ focused }) => (
            <View
              style={[
                styles.activeTabBackground,
                focused ? { backgroundColor: COLORS.Green } : {},
              ]}
            >
              <Feather
                name="search"
                size={FONTSIZE.size_30}
                color={COLORS.White}
              />
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="Ticket"
        component={TicketScreen}
        options={{
          tabBarShowLabel: false,
          tabBarIcon: ({ focused }) => (
            <View
              style={[
                styles.activeTabBackground,
                focused ? { backgroundColor: COLORS.Green } : {},
              ]}
            >
              <MaterialCommunityIcons
                name="ticket-confirmation-outline"
                size={FONTSIZE.size_30}
                color={COLORS.White}
              />
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="User"
        component={UserAccountScreen}
        options={{
          tabBarShowLabel: false,
          tabBarIcon: ({ focused }) => (
            <View
              style={[
                styles.activeTabBackground,
                focused ? { backgroundColor: COLORS.Green } : {},
              ]}
            >
              {photoURL ? (
                <Image source={{ uri: photoURL }} style={styles.userImage} />
              ) : (
                <Ionicons
                  name="person-circle"
                  size={FONTSIZE.size_30}
                  color={COLORS.White}
                />
              )}
            </View>
          ),
        }}
      />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  activeTabBackground: {
    backgroundColor: COLORS.Black,
    padding: SPACING.space_18,
    borderRadius: SPACING.space_18 * 10,
  },
  userImage: {
    width: FONTSIZE.size_30,
    height: FONTSIZE.size_30,
    borderRadius: FONTSIZE.size_16, // make it circular
  },
});

export default TabNavigator;
