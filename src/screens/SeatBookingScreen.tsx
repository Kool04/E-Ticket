import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState } from "react";
import {
  Text,
  View,
  StyleSheet,
  ScrollView,
  ImageBackground,
  TouchableOpacity,
  FlatList,
  ToastAndroid,
  ActivityIndicator,
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
import { getFirestore, doc, getDoc } from "firebase/firestore";
import { movieDetails } from "../api/apicalls";

type Zone = {
  name: string;
  price: number;
};

const getMovieDetails = async (movieid: string) => {
  try {
    const db = getFirestore();
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

const zones: Zone[] = [
  { name: "VIP", price: 10000 },
  { name: "Premium", price: 7000 },
  { name: "Lite", price: 5000 },
];

const SeatBookingScreen = ({ navigation, route }: any) => {
  const [movieData, setMovieData] = useState<any>({});

  const [selectedDateIndex, setSelectedDateIndex] = useState<number | null>(
    null
  );
  const [price, setPrice] = useState(0);
  const [selectedZone, setSelectedZone] = useState<Zone | null>(null);
  const [selectedTimeIndex, setSelectedTimeIndex] = useState<number | null>(
    null
  );

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
    setPrice(zone.price);
  };

  const BookTickets = async () => {
    if (
      selectedZone &&
      selectedTimeIndex !== null &&
      selectedDateIndex !== null
    ) {
      try {
        await SecureStore.setItemAsync(
          "ticket",
          JSON.stringify({
            zone: selectedZone.name,

            ticketImage: route.params.PosterImage,
            ticketBgImage: route.params.BgImage,
          })
        );
      } catch (error) {
        console.log("Il y a un problème dans la fonction BookTickets");
      }
      navigation.navigate("Ticket", {
        zone: selectedZone.name,

        ticketImage: route.params.PosterImage,
        ticketBgImage: route.params.BgImage,
      });
    } else {
      ToastAndroid.showWithGravity(
        "Please Select Zone, Date and Time of the Show",
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
        <Text style={styles.runtimeText}>{movieData.date}</Text>
        <FontAwesome5 name="map-pin" style={styles.clockIcon} />
        <Text style={styles.runtimeText}>{movieData.date}</Text>
        <FontAwesome5 name="calendar" style={styles.clockIcon} />
      </View>

      <View style={styles.zoneContainer}>
        {zones.map((zone, index) => (
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
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.buttonPriceContainer}>
        <View style={styles.priceContainer}>
          <Text style={styles.totalPriceText}>Total Price</Text>
          <Text style={styles.price}>Ar {price}.00</Text>
        </View>
        <TouchableOpacity onPress={BookTickets}>
          <Text style={styles.buttonText}>Buy Tickets</Text>
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
  dateContainer: {
    width: SPACING.space_10 * 7,
    height: SPACING.space_10 * 10,
    borderRadius: SPACING.space_10 * 10,
    backgroundColor: COLORS.DarkGrey,
    alignItems: "center",
    justifyContent: "center",
  },
  dateText: {
    fontFamily: FONTFAMILY.poppins_medium,
    fontSize: FONTSIZE.size_24,
    color: COLORS.White,
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
    borderColor: COLORS.WhiteRGBA50,
    paddingHorizontal: SPACING.space_20,
    borderRadius: BORDERRADIUS.radius_20,
    backgroundColor: COLORS.DarkGrey,
    //alignItems: "center",
    //justifyContent: "center",
    justifyContent: "space-around",
    flexDirection: "row",
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
    backgroundColor: COLORS.Orange,
  },
});

export default SeatBookingScreen;
