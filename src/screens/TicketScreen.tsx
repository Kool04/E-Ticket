import React, { useEffect, useState } from "react";
import {
  Text,
  View,
  StyleSheet,
  ScrollView,
  ImageBackground,
  TouchableOpacity,
  ActivityIndicator,
  ToastAndroid,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { useFocusEffect } from "@react-navigation/native"; // Importer useFocusEffect depuis React Navigation
import AppHeader from "../components/AppHeader";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import {
  BORDERRADIUS,
  COLORS,
  FONTFAMILY,
  FONTSIZE,
  SPACING,
} from "../theme/Theme";
import {
  getFirestore,
  collection,
  query,
  where,
  getDocs,
  doc,
  getDoc,
} from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { initializeApp } from "firebase/app";
import { firebaseConfig } from "../../firebase-config";

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth();

const TicketScreen = ({ navigation }: any) => {
  const [tickets, setTickets] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true); // Ajout de l'état de chargement

  const fetchUserTickets = async () => {
    try {
      const user = auth.currentUser;
      if (!user) {
        setIsLoading(false);
        return;
      }

      const q = query(
        collection(db, "ticket"),
        where("id_users", "==", user.uid)
      );
      ToastAndroid.showWithGravity(
        "Les tickets se supprimeront automatique apres la date du spectacle",
        ToastAndroid.SHORT,
        ToastAndroid.BOTTOM
      );
      const querySnapshot = await getDocs(q);
      const ticketsData = await Promise.all(
        querySnapshot.docs.map(async (ticketDoc) => {
          const ticket = ticketDoc.data();
          const spectacleDoc = await getDoc(
            doc(db, "spectacle", ticket.id_spectacle)
          );
          return {
            id: ticketDoc.id,
            ...ticket,
            photo_couverture: spectacleDoc.exists()
              ? spectacleDoc.data().photo_couverture
              : null,
            nom_spectacle: spectacleDoc.exists()
              ? spectacleDoc.data().nom_spectacle
              : "Spectacle inconnu",
          };
        })
      );
      setTickets(ticketsData);
    } catch (error) {
      console.error("Error fetching tickets: ", error);
    } finally {
      setIsLoading(false); // Marquer la fin du chargement
    }
  };

  // Utilisation de useFocusEffect pour rafraîchir les données lorsque l'écran est à nouveau focus
  useFocusEffect(
    React.useCallback(() => {
      fetchUserTickets();
    }, [])
  );

  // Affichage conditionnel pendant le chargement
  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.Green} />
      </View>
    );
  }

  const formatDate = (timestamp) => {
    const dateObject = timestamp.toDate();
    const options = { year: "numeric", month: "long", day: "numeric" };
    return dateObject.toLocaleDateString("fr-FR", options);
  };

  const handleTicketPress = (ticketId: string) => {
    console.log("Navigating to TicketDetails with ticketId:", ticketId);
    navigation.push("TicketDetails", { ticketId });
  };

  return (
    <ImageBackground
      style={styles.container}
      source={require("../assets/image/fond.png")}
    >
      <ScrollView style={styles.container}>
        <StatusBar hidden />
        <View style={styles.appHeaderContainer}>
          <AppHeader
            name="closecircleo"
            header={"TICKET Liste"}
            action={() => navigation.goBack()}
          />
        </View>
        <View style={styles.ticketListContainer}>
          {tickets.length > 0 ? (
            tickets.map((ticket, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => handleTicketPress(ticket.id)}
                style={styles.ticketWrapper}
              >
                <View style={styles.ticketContainer}>
                  <ImageBackground
                    source={{ uri: ticket.photo_couverture }}
                    style={styles.ticketBGImage}
                    imageStyle={styles.ticketBGImage}
                  >
                    <View style={styles.ticketInfo}>
                      <Text style={styles.ticketText}>
                        "{ticket.nom_spectacle}"
                      </Text>
                      <Text style={styles.ticketText}>
                        <FontAwesome5 name="crown" style={styles.clockIcon} />{" "}
                        {ticket.type} - Ar {ticket.prix}
                      </Text>
                      <Text style={styles.ticketText}>
                        <FontAwesome5 name="users" style={styles.clockIcon} />{" "}
                        {ticket.nombre}
                      </Text>
                      <Text style={styles.ticketText}>
                        <FontAwesome5
                          name="calendar"
                          style={styles.clockIcon}
                        />{" "}
                        {formatDate(ticket.date)}
                      </Text>
                    </View>
                  </ImageBackground>
                </View>
              </TouchableOpacity>
            ))
          ) : (
            <Text style={styles.noTicketsText}>No tickets reserved</Text>
          )}
        </View>
      </ScrollView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.Black,
  },
  clockIcon: {
    fontSize: FONTSIZE.size_16,
    color: COLORS.White,
    paddingBottom: SPACING.space_10,
  },
  appHeaderContainer: {
    marginHorizontal: SPACING.space_36,
    marginTop: SPACING.space_20 * 2,
  },
  ticketListContainer: {
    marginHorizontal: SPACING.space_36,
    marginTop: SPACING.space_20,
  },
  ticketWrapper: {
    marginBottom: SPACING.space_10,
  },
  ticketContainer: {
    padding: SPACING.space_10,
    backgroundColor: COLORS.DarkGrey,
    borderRadius: BORDERRADIUS.radius_25,
    overflow: "hidden",
  },
  ticketBGImage: {
    width: "100%",
    height: 180,
    borderRadius: BORDERRADIUS.radius_25,
    overflow: "hidden",
    justifyContent: "flex-end",
  },
  ticketInfo: {
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    padding: SPACING.space_10,
  },
  ticketText: {
    fontFamily: FONTFAMILY.poppins_medium,
    fontSize: FONTSIZE.size_16,
    color: COLORS.White,
  },
  noTicketsText: {
    fontFamily: FONTFAMILY.poppins_regular,
    fontSize: FONTSIZE.size_16,
    color: COLORS.Grey,
    textAlign: "center",
    marginTop: SPACING.space_20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.Black,
  },
});

export default TicketScreen;
