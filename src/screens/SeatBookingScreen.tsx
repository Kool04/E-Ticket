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
import * as SecureStore from "expo-secure-store";
import { movieDetails } from "../api/apicalls";

type Zone = {
  name: string;
  price: number;
};

type MovieDetails = {
  images?: { url: string }[];
};

const getMovieDetails = async (
  movieid: string
): Promise<MovieDetails | null> => {
  try {
    let response = await fetch(movieDetails(movieid));
    let json = await response.json();
    return json;
  } catch (error) {
    console.error("Il y a une erreur dans la fonction getMovieDetails", error);
    return null;
  }
};

const timeArray: string[] = [
  "10:30",
  "12:30",
  "14:30",
  "15:00",
  "19:30",
  "21:00",
];

const zones: Zone[] = [
  { name: "VIP", price: 10000 },
  { name: "Premium", price: 7000 },
  { name: "Lite", price: 5000 },
];

const generateDate = () => {
  const date = new Date();
  let weekday = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  let weekdays = [];
  for (let i = 0; i < 7; i++) {
    let tempDate = {
      date: new Date(date.getTime() + i * 24 * 60 * 60 * 1000).getDate(),
      day: weekday[new Date(date.getTime() + i * 24 * 60 * 60 * 1000).getDay()],
    };
    weekdays.push(tempDate);
  }
  return weekdays;
};

const SeatBookingScreen = ({ navigation, route }: any) => {
  const [movieData, setMovieData] = useState<MovieDetails | null>(null);
  const [dateArray, setDateArray] = useState(generateDate());
  const [selectedDateIndex, setSelectedDateIndex] = useState<number | null>(
    null
  );
  const [price, setPrice] = useState(0);
  const [selectedZone, setSelectedZone] = useState<Zone | null>(null);
  const [selectedTimeIndex, setSelectedTimeIndex] = useState<number | null>(
    null
  );

  useEffect(() => {
    const fetchMovieData = async () => {
      try {
        const tempMovieData = await getMovieDetails(route.params.movieid);
        setMovieData(tempMovieData);
      } catch (error) {
        console.error("Erreur lors du chargement des détails du film :", error);
      }
    };

    fetchMovieData();
  }, []);

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
            time: timeArray[selectedTimeIndex],
            date: dateArray[selectedDateIndex],
            ticketImage: route.params.PosterImage,
            ticketBgImage: route.params.BgImage,
          })
        );
      } catch (error) {
        console.log("Il y a un problème dans la fonction BookTickets");
      }
      navigation.navigate("Ticket", {
        zone: selectedZone.name,
        time: timeArray[selectedTimeIndex],
        date: dateArray[selectedDateIndex],
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
      <View>
        <ImageBackground
          source={
            movieData && movieData.images && movieData.images.length > 5
              ? { uri: movieData.images[5].url }
              : undefined
          }
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
        <Text style={styles.screenText}>Stage This Side</Text>
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

      <View>
        <FlatList
          data={dateArray}
          keyExtractor={(item) => item.date.toString()}
          horizontal
          bounces={false}
          contentContainerStyle={styles.containerGap24}
          renderItem={({ item, index }) => {
            return (
              <TouchableOpacity onPress={() => setSelectedDateIndex(index)}>
                <View
                  style={[
                    styles.dateContainer,
                    index == 0
                      ? { marginLeft: SPACING.space_24 }
                      : index == dateArray.length - 1
                      ? { marginRight: SPACING.space_24 }
                      : {},
                    index == selectedDateIndex
                      ? { backgroundColor: COLORS.Orange }
                      : {},
                  ]}
                >
                  <Text style={styles.dateText}>{item.date}</Text>
                  <Text style={styles.dayText}>{item.day}</Text>
                </View>
              </TouchableOpacity>
            );
          }}
        />
      </View>

      <View style={styles.OuterContainer}>
        <FlatList
          data={timeArray}
          keyExtractor={(item) => item}
          horizontal
          bounces={false}
          contentContainerStyle={styles.containerGap24}
          renderItem={({ item, index }) => {
            return (
              <TouchableOpacity onPress={() => setSelectedTimeIndex(index)}>
                <View
                  style={[
                    styles.timeContainer,
                    index == 0
                      ? { marginLeft: SPACING.space_24 }
                      : index == dateArray.length - 1
                      ? { marginRight: SPACING.space_24 }
                      : {},
                    index == selectedTimeIndex
                      ? { backgroundColor: COLORS.Orange }
                      : {},
                  ]}
                >
                  <Text style={styles.timeText}>{item}</Text>
                </View>
              </TouchableOpacity>
            );
          }}
        />
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
    alignItems: "center",
    justifyContent: "center",
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
