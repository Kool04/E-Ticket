import React, { useEffect, useState } from "react";
import { Text, View, StyleSheet, ImageBackground, Image } from "react-native";
import { StatusBar } from "expo-status-bar";
import AppHeader from "../components/AppHeader";
import {
  BORDERRADIUS,
  COLORS,
  FONTFAMILY,
  FONTSIZE,
  SPACING,
} from "../theme/Theme";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import { initializeApp } from "firebase/app";
import { firebaseConfig } from "../../firebase-config";
import { LinearGradient } from "expo-linear-gradient";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import QRCode from "react-native-qrcode-svg";

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const getSpectacleDetails = async (ticketId: string) => {
  try {
    const ticketDocRef = doc(db, "ticket", ticketId);
    const ticketDocSnap = await getDoc(ticketDocRef);

    if (!ticketDocSnap.exists()) {
      console.error("No such ticket document!");
      return null;
    }

    const ticketData = ticketDocSnap.data();

    // Récupérer les données du spectacle
    const spectacleDocRef = doc(db, "spectacle", ticketData.id_spectacle);
    const spectacleDocSnap = await getDoc(spectacleDocRef);

    if (!spectacleDocSnap.exists()) {
      console.error("No such spectacle document!");
      return { ...ticketData, photo_couverture: null, userData: null };
    }

    let spectacleData = spectacleDocSnap.data();

    // Récupérer les données de l'utilisateur
    const userDataRef = doc(db, "users", ticketData.id_users);
    const userDataSnap = await getDoc(userDataRef);

    if (!userDataSnap.exists()) {
      console.error("No such user document!");
      return {
        ...ticketData,
        photo_couverture: spectacleData.photo_couverture,
        heure: spectacleData.heure,
        nom_spectacle: spectacleData.nom_spectacle,
        date: spectacleData.date,
        lieu: spectacleData.lieu,
        userData: null,
      };
    }

    const userData = userDataSnap.data();

    spectacleData = {
      ...spectacleData,
      userData: {
        nom: userData.firstName, // Correction: Utilisation de "nom" au lieu de "preneom"
        prenom: userData.lastName, // Correction: Utilisation de "prenom" au lieu de "preneom"
        email: userData.email,
      },
    };

    return {
      ...ticketData,
      photo_poster: spectacleData.photo_poster,
      photo_couverture: spectacleData.photo_couverture,
      heure: spectacleData.heure,
      nom_spectacle: spectacleData.nom_spectacle,
      date_spectacle: spectacleData.date,
      lieu: spectacleData.lieu,
      userData: spectacleData.userData,
    };
  } catch (error) {
    console.error("Error fetching details: ", error);
    return null;
  }
};

const TicketDetailsScreen = ({ navigation, route }: any) => {
  const [ticketData, setTicketData] = useState<any>(undefined);

  useEffect(() => {
    console.log("Route params:", route.params);
    console.log("TICKET ID:", route.params.ticketId);

    (async () => {
      const tempTicketData = await getSpectacleDetails(route.params.ticketId);
      setTicketData(tempTicketData);
      console.log("Ticket Data:", tempTicketData);
    })();
  }, [route.params.ticketId]);

  if (!ticketData) {
    return (
      <View style={styles.container}>
        <StatusBar hidden />
        <View style={styles.appHeaderContainer}>
          <AppHeader
            name="closecircleo"
            header={"Mon Ticket"}
            action={() => navigation.goBack()}
          />
        </View>
      </View>
    );
  }

  const qrCodeValue = JSON.stringify({
    ticketId: route.params.ticketId,
    dateReservation: ticketData.date,
    nom: ticketData.userData.nom,
    prenom: ticketData.userData.prenom,
    email: ticketData.userData.email,
  });

  return (
    <View style={styles.container}>
      <StatusBar hidden />
      <View style={styles.appHeaderContainer}>
        <AppHeader
          name="closecircleo"
          header={"Mon ticket"}
          action={() => navigation.goBack()}
        />
      </View>

      <View style={styles.ticketContainer}>
        <ImageBackground
          source={{ uri: ticketData.photo_poster }} // Utiliser une image par défaut si photo_couverture est null
          style={styles.ticketBGImage}
        >
          <LinearGradient
            colors={[COLORS.BlackRGB10, COLORS.Green]}
            style={styles.linearGradient}
          >
            <View
              style={[
                styles.blackCircle,
                { position: "absolute", bottom: -40, left: -40 },
              ]}
            ></View>
            <View
              style={[
                styles.blackCircle,
                { position: "absolute", bottom: -40, right: -40 },
              ]}
            ></View>
          </LinearGradient>
        </ImageBackground>
        <View style={styles.linear}></View>
        <View style={styles.ticketFooter}>
          <View
            style={[
              styles.blackCircle,
              { position: "absolute", top: -40, right: -40 },
            ]}
          ></View>
          <View
            style={[
              styles.blackCircle,
              { position: "absolute", top: -40, left: -40 },
            ]}
          ></View>
          <View style={styles.ticketDateContainer}>
            <View style={styles.subtitleContainer}>
              <Text style={styles.title}>"{ticketData.nom_spectacle}"</Text>
              <Text style={styles.subtitle}>
                Le {ticketData.date_spectacle}
              </Text>
              <Text style={styles.subtitle}>Au {ticketData.lieu}</Text>
            </View>
          </View>
          <View style={styles.ticketSeatContainer}>
            <View style={styles.subtitleContainer}>
              <FontAwesome5 name="clock" style={styles.clockIcon} />
              <Text style={styles.subtitle}>{ticketData.heure}</Text>
            </View>
            <View style={styles.subtitleContainer}>
              <FontAwesome5 name="crown" style={styles.clockIcon} />
              <Text style={styles.subtitle}>{ticketData.type}</Text>
            </View>
            <View style={styles.subtitleContainer}>
              <FontAwesome5 name="users" style={styles.clockIcon} />
              <Text style={styles.subtitle}>{ticketData.nombre}</Text>
            </View>
          </View>
          <QRCode value={qrCodeValue} size={60} />
        </View>
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
  ticketContainer: {
    flex: 1,
    justifyContent: "center",
  },
  ticketBGImage: {
    alignSelf: "center",
    width: 300,
    aspectRatio: 200 / 300,
    borderTopLeftRadius: BORDERRADIUS.radius_25,
    borderTopRightRadius: BORDERRADIUS.radius_25,
    overflow: "hidden",
    justifyContent: "flex-end",
  },
  linearGradient: {
    height: "70%",
  },
  linear: {
    borderTopColor: COLORS.Black,
    borderTopWidth: 3,
    width: 300,
    alignSelf: "center",
    backgroundColor: COLORS.Green,
    borderStyle: "dashed",
  },
  ticketFooter: {
    backgroundColor: COLORS.Green,
    width: 300,
    alignItems: "center",
    paddingBottom: SPACING.space_36,
    alignSelf: "center",
    borderBottomLeftRadius: BORDERRADIUS.radius_25,
    borderBottomRightRadius: BORDERRADIUS.radius_25,
  },
  ticketDateContainer: {
    flexDirection: "row",
    gap: SPACING.space_36,
    alignItems: "center",
    marginVertical: SPACING.space_10,
  },
  dateTitle: {
    fontFamily: FONTFAMILY.poppins_medium,
    fontSize: FONTSIZE.size_24,
    color: COLORS.White,
  },
  subtitle: {
    fontFamily: FONTFAMILY.poppins_regular,
    fontSize: FONTSIZE.size_14,
    color: COLORS.White,
  },
  title: {
    fontFamily: FONTFAMILY.poppins_regular,
    fontSize: FONTSIZE.size_20,
    color: COLORS.White,
  },
  clockIcon: {
    fontSize: FONTSIZE.size_24,
    color: COLORS.White,
    paddingBottom: SPACING.space_10,
  },
  ticketSeatContainer: {
    flexDirection: "row",
    gap: SPACING.space_36,
    alignItems: "center",
    justifyContent: "center",
    marginVertical: SPACING.space_10,
  },
  subtitleContainer: {
    alignItems: "center",
  },
  subheading: {
    fontFamily: FONTFAMILY.poppins_medium,
    fontSize: FONTSIZE.size_18,
    color: COLORS.White,
  },
  barcodeImage: {
    height: 50,
    aspectRatio: 158 / 52,
  },
  blackCircle: {
    height: 80,
    width: 80,
    borderRadius: 80,
    backgroundColor: COLORS.Black,
  },
});

export default TicketDetailsScreen;
