/////////////////////Login///////////////////
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Alert,
  TouchableOpacity,
  ImageBackground,
  Image,
} from "react-native";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { initializeApp } from "firebase/app";
import { firebaseConfig } from "../../firebase-config";
import {
  BORDERRADIUS,
  COLORS,
  FONTFAMILY,
  FONTSIZE,
  SPACING,
} from "../theme/Theme";
import { Fontisto } from "@expo/vector-icons";
import { AntDesign } from "@expo/vector-icons";

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigateToSignUp = () => {
    navigation.navigate("SignUp"); // Navigate to sign up screen
  };

  const handleLogin = () => {
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        console.log("Login successful");
        const user = userCredential.user;
        console.log(user);
        navigation.navigate("Tab");
      })
      .catch((error) => {
        console.error(error);
        Alert.alert("Login Failed", "Invalid email or password");
      });
  };

  return (
    <View style={styles.container}>
      <Image source={require("../assets/image/logo.png")} style={styles.logo} />
      <View>
        <TextInput
          style={[styles.input, styles.inputText]}
          placeholderTextColor={COLORS.WhiteRGBA50}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <Fontisto name="email" size={24} color="black" style={styles.icon} />
      </View>
      <View>
        <TextInput
          style={[styles.input, styles.inputText]}
          placeholderTextColor={COLORS.WhiteRGBA50}
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
        <AntDesign name="eyeo" size={24} color="black" style={styles.icon} />
      </View>
      <TouchableOpacity onPress={handleLogin}>
        <Text style={styles.buttonLogin}>Login</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={navigateToSignUp}>
        <Text style={styles.buttonSignUp}>Sign Up</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 16,
    backgroundColor: COLORS.Black,
  },
  logo: {
    width: "100%",
    height: 100,
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    marginBottom: 16,
    textAlign: "center",
    color: COLORS.White,
  },
  icon: {
    position: "absolute",
    right: 10,
    bottom: 20,
    color: COLORS.WhiteRGBA75,
  },
  input: {
    height: 40,
    borderColor: COLORS.WhiteRGBA50,
    borderWidth: 1,
    marginBottom: 12,
    marginTop: SPACING.space_16,
    paddingHorizontal: 8,
    paddingRight: 40,
    borderRadius: BORDERRADIUS.radius_25,
  },
  buttonSignUp: {
    borderRadius: BORDERRADIUS.radius_25,
    paddingHorizontal: SPACING.space_24,
    paddingVertical: SPACING.space_10,
    fontFamily: FONTFAMILY.poppins_semibold,
    fontSize: FONTSIZE.size_20,
    color: COLORS.White,
    backgroundColor: COLORS.Green,
    marginTop: SPACING.space_10,
    textAlign: "center",
  },
  buttonLogin: {
    borderRadius: BORDERRADIUS.radius_25,
    paddingHorizontal: SPACING.space_24,
    paddingVertical: SPACING.space_10,
    fontFamily: FONTFAMILY.poppins_semibold,
    fontSize: FONTSIZE.size_20,
    color: COLORS.White,
    backgroundColor: COLORS.Green,
    marginTop: SPACING.space_8,
    textAlign: "center",
  },
  inputText: {
    color: COLORS.WhiteRGBA75,
  },
});

export default LoginScreen;
