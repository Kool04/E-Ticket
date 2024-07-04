import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState } from "react";
import {
  Text,
  View,
  StyleSheet,
  ScrollView,
  ImageBackground,
  TouchableOpacity,
  ToastAndroid,
  ActivityIndicator,
  TextInput,
  Alert,
} from "react-native";
import {
  BORDERRADIUS,
  COLORS,
  FONTFAMILY,
  FONTSIZE,
  SPACING,
} from "../theme/Theme";
import { LinearGradient } from "expo-linear-gradient";
import AppHeader from "../components/AppHeader";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import * as SecureStore from "expo-secure-store";
import {
  getFirestore,
  doc,
  getDoc,
  collection,
  addDoc,
  Timestamp,
} from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { initializeApp } from "firebase/app";
import { firebaseConfig } from "../../firebase-config";

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth();

type Zone = {
  name: string;
  price: number;
};

const getMovieDetails = async (movieid: string) => {
  try {
    const docRef = doc(db, "spectacle", movieid);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return docSnap.data();
    } else {
      console.error("Document not found:", movieid);
      return null;
    }
  } catch (error) {
    console.error("Error fetching movie details:", error);
    return null;
  }
};

const SeatBookingScreen = ({ navigation, route }: any) => {
  const [movieData, setMovieData] = useState<any>({});

  const [price, setPrice] = useState(0);
  const [selectedZone, setSelectedZone] = useState<Zone | null>(null);
  const [ticketCount, setTicketCount] = useState<number | null>(null);

  useEffect(() => {
    if (route.params && route.params.movieid) {
      console.log("Movie ID selected:", route.params.movieid);

      (async () => {
        const tempMovieData = await getMovieDetails(route.params.movieid);
        setMovieData(tempMovieData);
        console.log("Spectacle Data:", tempMovieData);
      })();
    } else {
      console.warn("Movie ID is not defined in route params.");
    }
  }, [route.params]);

  const selectZone = (zone: Zone) => {
    setSelectedZone(zone);
    if (ticketCount !== null) {
      setPrice(zone.price * ticketCount); // Mise à jour du prix en fonction du nombre de billets
    }
  };

  const addTicketToFirestore = async (data) => {
    try {
      const docRef = await addDoc(collection(db, "ticket"), {
        ...data,
        date: Timestamp.now(),
      });
      console.log("Document written with ID: ", docRef.id);
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  };

  const BookTickets = async () => {
    if (selectedZone) {
      const user = auth.currentUser;

      if (user) {
        const ticketData = {
          id_spectacle: route.params.movieid,
          id_users: user.uid,
          nombre: ticketCount,
          prix: selectedZone.price * ticketCount,
          type: selectedZone.name,
        };

        try {
          await addTicketToFirestore(ticketData);

          await SecureStore.setItemAsync(
            "ticket",
            JSON.stringify({
              zone: selectedZone.name,
              ticketImage: route.params.photo_poster,
              ticketBgImage: route.params.photo_couverture,
            })
          );
          Alert.alert("Succes", "Ticket reserver avec succes");
          navigation.navigate("Ticket", {
            zone: selectedZone.name,
            ticketImage: route.params.photo_poster,
            ticketBgImage: route.params.photo_couverture,
          });
        } catch (error) {
          console.log("Il y a un problème dans la fonction BookTickets", error);
        }
      } else {
        ToastAndroid.showWithGravity(
          "Utilisateur non connecté",
          ToastAndroid.SHORT,
          ToastAndroid.BOTTOM
        );
      }
    } else {
      ToastAndroid.showWithGravity(
        "Veuillez sélectionner le prix du billet",
        ToastAndroid.SHORT,
        ToastAndroid.BOTTOM
      );
    }
  };

  return (
    <ScrollView
      style={styles.container}
      bounces={false}
      showsVerticalScrollIndicator={false}
    >
      <StatusBar hidden />
      {movieData ? (
        <View>
          <ImageBackground
            source={{ uri: movieData.photo_couverture }}
            style={styles.ImageBG}
          >
            <LinearGradient
              colors={[COLORS.BlackRGB10, COLORS.Black]}
              style={styles.linearGradient}
            >
              <View style={styles.appHeaderContainer}>
                <AppHeader
                  name="closecircleo"
                  header={" "}
                  action={() => navigation.goBack()}
                />
              </View>
            </LinearGradient>
          </ImageBackground>
        </View>
      ) : (
        <View>
          <ActivityIndicator size="large" color={COLORS.Orange} />
        </View>
      )}

      <View style={styles.timeContainer}>
        <Text style={styles.runtimeText}>{movieData.heure}</Text>
        <FontAwesome5 name="clock" style={styles.clockIcon} />
        <Text style={styles.runtimeText}>{movieData.lieu}</Text>
        <FontAwesome5 name="map-pin" style={styles.clockIcon} />
        <Text style={styles.runtimeText}>{movieData.date}</Text>
        <FontAwesome5 name="calendar" style={styles.clockIcon} />
      </View>

      <View style={styles.zoneContainer}>
        {movieData &&
          movieData.categories.map((zone: Zone, index: number) => (
            <TouchableOpacity
              key={index}
              onPress={() => selectZone(zone)}
              style={[
                styles.zone,
                selectedZone?.name === zone.name && {
                  backgroundColor: COLORS.Orange,
                },
              ]}
            >
              <Text style={styles.zoneText}>{zone.name}</Text>
              <Text style={styles.priceText}>Ar {zone.price}.00</Text>
            </TouchableOpacity>
          ))}
      </View>

      <View style={styles.ticketCountContainer}>
        <Text style={styles.label}>Nombre de billets:</Text>
        <TextInput
          style={styles.input}
          keyboardType="numeric"
          value={ticketCount !== null ? ticketCount.toString() : ""}
          onChangeText={(text) => {
            if (text === "") {
              setTicketCount(null); // Réinitialiser si le champ est vide
              setPrice(0); // Réinitialiser le prix à zéro
            } else {
              const count = parseInt(text, 10);
              if (!isNaN(count)) {
                if (count > 8) {
                  ToastAndroid.showWithGravity(
                    "une personne ne peut pas acheter plus de 8 Tickets",
                    ToastAndroid.SHORT,
                    ToastAndroid.BOTTOM
                  );
                } else {
                  setTicketCount(count);
                  if (selectedZone) {
                    setPrice(selectedZone.price * count); // Mise à jour du prix en fonction du nombre de billets
                  }
                }
              }
            }
          }}
        />
      </View>

      <View style={styles.buttonPriceContainer}>
        <View style={styles.priceContainer}>
          <Text style={styles.totalPriceText}>Prix total</Text>
          <Text style={styles.price}>Ar {price}.00</Text>
        </View>
        <TouchableOpacity onPress={BookTickets}>
          <Text style={styles.buttonText}>Acheter les billets</Text>
        </TouchableOpacity>
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
  ImageBG: {
    width: "100%",
    aspectRatio: 3072 / 1727,
  },
  linearGradient: {
    height: "100%",
  },
  appHeaderContainer: {
    marginHorizontal: SPACING.space_36,
    marginTop: SPACING.space_20 * 2,
  },
  screenText: {
    textAlign: "center",
    fontFamily: FONTFAMILY.poppins_regular,
    fontSize: FONTSIZE.size_10,
    color: COLORS.WhiteRGBA15,
  },
  zoneContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginVertical: SPACING.space_24,
  },
  zone: {
    paddingVertical: SPACING.space_10,
    paddingHorizontal: SPACING.space_20,
    borderRadius: BORDERRADIUS.radius_25,
    backgroundColor: COLORS.DarkGrey,
    alignItems: "center",
  },
  zoneText: {
    fontFamily: FONTFAMILY.poppins_medium,
    fontSize: FONTSIZE.size_16,
    color: COLORS.White,
  },
  priceText: {
    fontFamily: FONTFAMILY.poppins_regular,
