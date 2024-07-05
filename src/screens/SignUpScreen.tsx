//////////////////SignUp///////////////////////
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Alert,
  TouchableOpacity,
  Image,
} from "react-native";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { getAuth } from "firebase/auth";
import { initializeApp } from "firebase/app";
import { firebaseConfig } from "../../firebase-config";
import { getFirestore, setDoc, doc } from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import * as ImagePicker from "expo-image-picker";
import {
  BORDERRADIUS,
  COLORS,
  FONTFAMILY,
  FONTSIZE,
  SPACING,
} from "../theme/Theme";
import { AntDesign } from "@expo/vector-icons";
import { Fontisto } from "@expo/vector-icons";
import { FontAwesome } from "@expo/vector-icons";

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const firestore = getFirestore(app);
const storage = getStorage(app);

const SignUpScreen = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [photo, setPhoto] = useState<string | null>(null);

  const handlePickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setPhoto(result.assets[0].uri);
    }
  };

  const uploadImage = async (uri: string) => {
    try {
      const response = await fetch(uri);
      const blob = await response.blob();
      const storageRef = ref(storage, `profilePictures/${email}`);
      await uploadBytes(storageRef, blob);
      const downloadURL = await getDownloadURL(storageRef);
      return downloadURL;
    } catch (error: any) {
      console.error("Image upload error:", error.code, error.message);
      throw error;
    }
  };

  const handleSignin = async () => {
    if (password !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match");
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;
      let photoURL = "";

      if (photo) {
        photoURL = await uploadImage(photo);
      }

      await setDoc(doc(firestore, "users", user.uid), {
        email: user.email,
        firstName: firstName,
        lastName: lastName,
        photoURL: photoURL || null,
      });

      console.log("Account created successfully");
      console.log(user);
      navigation.navigate("Login"); // Navigate to login screen after sign up
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error(error);
        Alert.alert("Sign Up Failed", error.message);
      } else {
        console.error("Unknown error", error);
      }
    }
  };

  return (
    <View style={styles.container}>
      <Image source={require("../assets/image/logo.png")} style={styles.logo} />
      <TextInput
        style={[styles.input, styles.inputText]}
        placeholder="First Name"
        placeholderTextColor={COLORS.WhiteRGBA50}
        value={firstName}
        onChangeText={setFirstName}
      />
      <TextInput
        style={[styles.input, styles.inputText]}
        placeholder="Last Name"
        placeholderTextColor={COLORS.WhiteRGBA50}
        value={lastName}
        onChangeText={setLastName}
      />
      <View>
        <TextInput
          style={[styles.input, styles.inputText]}
          placeholder="Email"
          placeholderTextColor={COLORS.WhiteRGBA50}
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
          placeholder="Password"
          placeholderTextColor={COLORS.WhiteRGBA50}
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
        <AntDesign name="eyeo" size={24} color="black" style={styles.icon} />
      </View>
      <View>
        <TextInput
          style={[styles.input, styles.inputText]}
          placeholder="Confirm Password"
          placeholderTextColor={COLORS.WhiteRGBA50}
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry
        />
        <AntDesign name="eyeo" size={24} color="black" style={styles.icon} />
      </View>
      <TouchableOpacity onPress={handlePickImage}>
        <Text style={styles.buttonSignUp}>Pick an image</Text>
        {/*<FontAwesome name="image" size={24} color="white" style={styles.imageIcon} />*/}
      </TouchableOpacity>
      {photo && <Text>Image Selected</Text>}
      <TouchableOpacity onPress={handleSignin}>
        <Text style={styles.buttonLogin}>Sign Up</Text>
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
  imageIcon: {
    marginRight: 8,
    color: COLORS.WhiteRGBA15,
  },
  icon: {
    position: "absolute",
    right: 10,
    bottom: 20,
    color: COLORS.WhiteRGBA75,
  },
  title: {
    fontSize: 24,
    marginBottom: 16,
    textAlign: "center",
    color: COLORS.White,
  },
  input: {
    height: 40,
    borderColor: COLORS.WhiteRGBA50,
    borderWidth: 1,
    marginBottom: 10,
    marginTop: SPACING.space_16,
    paddingHorizontal: 8,
    borderRadius: BORDERRADIUS.radius_25,
  },
  buttonSignUp: {
    borderRadius: BORDERRADIUS.radius_25,
    paddingHorizontal: SPACING.space_24,
    paddingVertical: SPACING.space_10,
    fontFamily: FONTFAMILY.poppins_semibold,
    fontSize: FONTSIZE.size_20,
    color: COLORS.White,
    backgroundColor: COLORS.Green2,
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

export default SignUpScreen;
