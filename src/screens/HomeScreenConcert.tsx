import React, { useEffect, useState } from "react";
import {
  Text,
  View,
  StyleSheet,
  ScrollView,
  ImageBackground,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import AppHeader from "../components/AppHeader";
import {
  BORDERRADIUS,
  COLORS,
  FONTFAMILY,
  FONTSIZE,
  SPACING,
} from "../theme/Theme";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
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

const TicketScreen = ({ navigation, route }: any) => {
  const [tickets, setTickets] = useState<any[]>([]);
  const user = auth.currentUser;

  useEffect(() => {
    if (user) {
      fetchTickets(user.uid);
    }
  }, [user]);

  const fetchTickets = async (userId: string) => {
    try {
      const q = query(
        collection(db, "ticket"),
        where("id_users", "==", userId)
      );
      const querySnapshot = await getDocs(q);
      const ticketsData = await Promise.all(
        querySnapshot.docs.map(async (doc) => {
          const ticket = doc.data();
          const spectacleDoc = await getDoc(
            doc(db, "spectacle", ticket.id_spectacle)
          );
          return {
            ...ticket,
            photo_couverture: spectacleDoc.exists()
              ? spectacleDoc.data().photo_couverture
              : null,
          };
        })
      );
      setTickets(ticketsData);
    } catch (error) {
      console.error("Error fetching tickets: ", error);
    }
  };

  return (
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
            <View key={index} style={styles.ticketContainer}>
              <ImageBackground
                source={{ uri: ticket.photo_couverture }}
                style={styles.ticketBGImage}
                imageStyle={styles.ticketBGImage}
              >
                <View style={styles.ticketInfo}>
                  <Text style={styles.ticketText}>
                    {ticket.type} - Ar {ticket.prix}
                  </Text>
                  <Text style={styles.ticketText}>Nombre: {ticket.nombre}</Text>
                </View>
              </ImageBackground>
            </View>
          ))
        ) : (
          <Text style={styles.noTicketsText}>No tickets reserved</Text>
        )}
      </View>
    </ScrollView>
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
  ticketListContainer: {
    marginHorizontal: SPACING.space_36,
    marginTop: SPACING.space_20,
  },
  ticketContainer: {
    marginBottom: SPACING.space_20,
    borderRadius: BORDERRADIUS.radius_25,
    overflow: "hidden",
  },
  ticketBGImage: {
    width: "100%",
    height: 200,
    justifyContent: "flex-end",
  },
  ticketInfo: {
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    padding: SPACING.space_20,
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
});

export default TicketScreen;
