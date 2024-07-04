import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState, useRef } from "react";
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
  Animated,
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
import Swiper from "react-native-swiper";

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
      const data = docSnap.data();
      const prix_premium = data.prix_premium || 0;
      const prix_vip = data.prix_vip || 0;
      const prix_lite = data.prix_lite || 0;

      return {
        ...data,
        prix_premium,
        prix_vip,
        prix_lite,
      };
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
  const animation = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (route.params && route.params.movieid) {
      (async () => {
        const tempMovieData = await getMovieDetails(route.params.movieid);
        setMovieData(tempMovieData);
      })();
    } else {
      console.warn("Movie ID is not defined in route params.");
    }
  }, [route.params]);

  const zones: Zone[] = [
    { name: "VIP", price: movieData.prix_vip || 0 },
    { name: "Premium", price: movieData.prix_premium || 0 },
    { name: "Simple", price: movieData.prix_lite || 0 },
  ];

  const selectZone = (zone: Zone) => {
    setSelectedZone(zone);
    if (ticketCount !== null) {
      setPrice(zone.price * ticketCount);
    }
  };

  const addTicketToFirestore = async (data: {
    id_spectacle: any;
    id_users: string;
    nombre: number | null;
    prix: number;
    type: string;
  }) => {
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

  const animateButton = () => {
    Animated.sequence([
      Animated.timing(animation, {
        toValue: 1.1,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(animation, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start(() => {
      BookTickets();
    });
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
              <View style={styles.titleContainer}>
                <Text style={styles.titleText}>{movieData.nom_spectacle}</Text>
              </View>
            </LinearGradient>
          </ImageBackground>
        </View>
      ) : (
        <View>
          <ActivityIndicator size="large" color={COLORS.Green} />
        </View>
      )}

      <View style={styles.timeContainer}>
        <FontAwesome5 name="clock" style={styles.clockIcon} />
        <Text style={styles.runtimeText}>{movieData.heure}</Text>
        <FontAwesome5 name="map-pin" style={styles.mapIcon} />
        <Text style={styles.runtimeText}>{movieData.lieu}</Text>
        <FontAwesome5 name="calendar" style={styles.calendarIcon} />
        <Text style={styles.runtimeText}>{movieData.date}</Text>
      </View>
      <View style={styles.prixContainer}>
        <Text style={styles.runtimeText}>VIP: {movieData.prix_vip}Ar</Text>
        <Text style={styles.runtimeText}>
          Premium: {movieData.prix_premium} Ar
        </Text>
        <Text style={styles.runtimeText}>simple: {movieData.prix_lite} Ar</Text>
      </View>

      <View style={styles.zoneContainer}>
        {zones.map((zone, index) => (
          <TouchableOpacity
            key={index}
            onPress={() => selectZone(zone)}
            style={[
              styles.zone,
              selectedZone?.name === zone.name && {
                backgroundColor: COLORS.Green,
              },
            ]}
          >
            <Text style={styles.zoneText}>{zone.name}</Text>
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
              setTicketCount(count);
              if (selectedZone) {
                setPrice(selectedZone.price * count);
              }
            }
          }}
        />
      </View>

      <View style={styles.priceContainer}>
        <Text style={styles.label}>Prix total:</Text>
        <Text style={styles.price}>{price} Ar</Text>
      </View>

      <View style={styles.noticeContainer}>
        <Text style={styles.noticeText}>
          - Veuillez bien verifier avant de valider vos Tickets.
        </Text>
        <Text style={styles.noticeText}>
          - Souvenez vous bien de vos login ou vous avez valider le Tickets.
        </Text>
        <Text style={styles.noticeText}>
          -Une personne ne peut pas reserver plus de 8 Tickets par
          spectacle/concert.
        </Text>
        <Text style={styles.noticeText}>
          - Les tickets se supprimeront automatiquement apres la date du
          spectacle/concert.
        </Text>
      </View>
      <Animated.View style={{ transform: [{ scale: animation }] }}>
        <TouchableOpacity style={styles.btn} onPress={animateButton}>
          <Text style={styles.buttonText}>Valider</Text>
        </TouchableOpacity>
      </Animated.View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    display: "flex",
    flex: 1,
    backgroundColor: COLORS.Black,
  },
  priceText: {
    fontFamily: FONTFAMILY.poppins_regular,
    fontSize: FONTSIZE.size_12,
    color: COLORS.White,
    marginTop: SPACING.space_4,
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
  mapIcon: {
    fontSize: FONTSIZE.size_20,
    color: COLORS.Red,
    //marginRight: SPACING.space_8,
    marginLeft: SPACING.space_8,
  },
  titleContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    // padding: SPACING * 2,
  },
  titleText: {
    color: COLORS.White,
    fontSize: FONTSIZE.size_20,
    fontFamily: FONTFAMILY.poppins_regular,
    textAlign: "center",
  },
  calendarIcon: {
    fontSize: FONTSIZE.size_20,
    color: COLORS.White,
    marginLeft: SPACING.space_8,
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
  },
  noticeText: {
    color: COLORS.White,
    fontSize: FONTSIZE.size_10,
    fontFamily: FONTFAMILY.poppins_regular,
  },
  btn: {
    backgroundColor: COLORS.Green,
    //borderRadius: BORDERRADIUS.Large,
    justifyContent: "center",
    alignItems: "center",
  },
  zoneText: {
    fontFamily: FONTFAMILY.poppins_medium,
    fontSize: FONTSIZE.size_16,
    color: COLORS.White,
  },
  seatContainer: {
    marginVertical: SPACING.space_20,
  },
  containerGap20: {
    gap: SPACING.space_20,
  },
  seatRow: {
    flexDirection: "row",
    gap: SPACING.space_20,
    justifyContent: "center",
  },
  clockIcon: {
    fontSize: FONTSIZE.size_20,
    color: COLORS.WhiteRGBA50,
    marginRight: SPACING.space_8,
  },
  seatIcon: {
    fontSize: FONTSIZE.size_20,
    color: COLORS.White,
  },
  seatRadioContainer: {
    flexDirection: "row",
    marginTop: SPACING.space_36,
    marginBottom: SPACING.space_10,
    alignItems: "center",
    justifyContent: "space-evenly",
  },
  radioContainer: {
    flexDirection: "row",
    gap: SPACING.space_10,
    alignItems: "center",
  },
  radioIcon: {
    fontSize: FONTSIZE.size_20,
    color: COLORS.White,
  },
  radioText: {
    fontFamily: FONTFAMILY.poppins_medium,
    fontSize: FONTSIZE.size_12,
    color: COLORS.White,
  },
  containerGap24: {
    gap: SPACING.space_24,
  },

  dayText: {
    fontFamily: FONTFAMILY.poppins_regular,
    fontSize: FONTSIZE.size_12,
    color: COLORS.White,
  },
  OuterContainer: {
    marginVertical: SPACING.space_24,
  },
  timeContainer: {
    paddingVertical: SPACING.space_10,
    borderWidth: 1,
    // borderColor: COLORS.WhiteRGBA50,
    paddingHorizontal: SPACING.space_20,
    borderRadius: BORDERRADIUS.radius_20,
    backgroundColor: COLORS.DarkGrey,
    //alignItems: "center",
    //justifyContent: "center",
    justifyContent: "space-around",
    flexDirection: "row",
  },
  prixContainer: {
    paddingVertical: SPACING.space_10,
    borderWidth: 1,
    //borderColor: COLORS.WhiteRGBA50,
    paddingHorizontal: SPACING.space_20,
    borderRadius: BORDERRADIUS.radius_20,
    backgroundColor: COLORS.DarkGrey,
    //alignItems: "center",
    //justifyContent: "center",
    justifyContent: "space-around",
    flexDirection: "row",
  },
  noticeContainer: {
    paddingVertical: SPACING.space_10,
    borderWidth: 1,
    //borderColor: COLORS.WhiteRGBA50,
    paddingHorizontal: SPACING.space_20,
    borderRadius: BORDERRADIUS.radius_20,
    backgroundColor: COLORS.DarkGrey,
    //alignItems: "center",
    //justifyContent: "center",
    justifyContent: "space-around",
    // flexDirection: "row",
  },
  timeText: {
    fontFamily: FONTFAMILY.poppins_regular,
    fontSize: FONTSIZE.size_14,
    color: COLORS.White,
  },
  buttonPriceContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: SPACING.space_24,
    paddingBottom: SPACING.space_24,
  },
  priceContainer: {
    alignItems: "center",
  },
  totalPriceText: {
    fontFamily: FONTFAMILY.poppins_regular,
    fontSize: FONTSIZE.size_14,
    color: COLORS.Grey,
  },
  runtimeText: {
    fontFamily: FONTFAMILY.poppins_medium,
    fontSize: FONTSIZE.size_14,
    color: COLORS.White,
  },
  price: {
    fontFamily: FONTFAMILY.poppins_medium,
    fontSize: FONTSIZE.size_24,
    color: COLORS.White,
  },
  buttonText: {
    borderRadius: BORDERRADIUS.radius_25,
    paddingHorizontal: SPACING.space_24,
    paddingVertical: SPACING.space_10,
    fontFamily: FONTFAMILY.poppins_semibold,
    fontSize: FONTSIZE.size_16,
    color: COLORS.White,
    backgroundColor: COLORS.Green,
  },
  label: {
    // Style for label
    fontFamily: FONTFAMILY.poppins_medium,
    fontSize: FONTSIZE.size_16,
    color: COLORS.White,
  },
  input: {
    // Style for input
    borderWidth: 1,
    borderColor: COLORS.White,
    borderRadius: BORDERRADIUS.radius_10,
    padding: SPACING.space_10,
    fontFamily: FONTFAMILY.poppins_regular,
    fontSize: FONTSIZE.size_16,
    color: COLORS.White,
    textAlign: "center",
    width: 60,
  },
  ticketCountContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: SPACING.space_24,
    marginBottom: SPACING.space_24,
  },
});

export default SeatBookingScreen;
