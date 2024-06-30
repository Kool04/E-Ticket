import { useEffect, useState } from "react";
import { Text, View, StyleSheet, Image } from "react-native";
import { getAuth } from "firebase/auth";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import { COLORS, FONTFAMILY, FONTSIZE, SPACING } from "../theme/Theme";
import { StatusBar } from "expo-status-bar";
import AppHeader from "../components/AppHeader";
import SettingComponent from "../components/SettingComponent";
import { firebaseConfig } from "../../firebase-config";
import { initializeApp } from "firebase/app";

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const firestore = getFirestore(app);

const UserAccountScreen = ({ navigation }) => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  useEffect(() => {
    const fetchUserData = async () => {
      const user = auth.currentUser;
      if (user) {
        const docRef = doc(firestore, "users", user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const userData = docSnap.data();
          setFirstName(userData.firstName);
          setLastName(userData.lastName);
          setEmail(userData.email);
        } else {
          console.log("No such document!");
        }
      }
    };

    fetchUserData();
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar hidden />
      <View style={styles.appHeaderContainer}>
        <AppHeader
          name="closecircleo"
          header={"My Profile"}
          action={() => navigation.goBack()}
        />
      </View>

      <View style={styles.profileContainer}>
        <Image
          source={require("../assets/image/nilo.png")}
          style={styles.avatarImage}
        />
        <Text style={styles.avatarText}>
          {firstName} {lastName}
        </Text>
        <Text style={styles.avatarText}>{email}</Text>
      </View>

      <View style={styles.profileContainer}>
        <SettingComponent
          icon="user"
          heading="Account"
          subheading="Edit Profile"
          subtitle="Change Password"
        />
        <SettingComponent
          icon="Settings"
          heading="Setting"
          subheading="Theme"
          subtitle="Permission"
        />
        <SettingComponent
          icon="dollar"
          heading="Offers & Referrals"
          subheading="Offer"
          subtitle="Referrals"
        />
        <SettingComponent
          icon="info"
          heading="About"
          subheading="About Movies"
          subtitle="More"
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    display: "flex",
    flex: 1,
    backgroundColor: COLORS.Black,
  },
  appHeaderContainer: {
    marginHorizontal: SPACING.space_36,
    marginTop: SPACING.space_20 * 2,
  },
  profileContainer: {
    alignItems: "center",
    padding: SPACING.space_36,
  },
  avatarText: {
    fontFamily: FONTFAMILY.poppins_medium,
    fontSize: FONTSIZE.size_16,
    marginTop: SPACING.space_16,
    color: COLORS.White,
  },
  avatarImage: {
    height: 80,
    width: 80,
    borderRadius: 80,
  },
});

export default UserAccountScreen;
