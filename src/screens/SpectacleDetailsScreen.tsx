import React, { useEffect, useState } from "react";
import {
  Text,
  View,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  ImageBackground,
  Image,
  FlatList,
  TouchableOpacity,
} from "react-native";
import {
  BORDERRADIUS,
  COLORS,
  FONTFAMILY,
  FONTSIZE,
  SPACING,
} from "../theme/Theme";
import AppHeader from "../components/AppHeader";
import { StatusBar } from "expo-status-bar";
import { LinearGradient } from "expo-linear-gradient";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import { FontAwesome } from "@expo/vector-icons";
import CategoryHeader from "../components/CategoryHeader";
import ArtistCard from "../components/ArtistCard";
import { getFirestore, doc, getDoc } from "firebase/firestore";

const getMovieDetails = async (movieid: string) => {
  const db = getFirestore();
  const docRef = doc(db, "spectacle", movieid); // Utiliser "spectacle" au lieu de "spectacles"
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    return docSnap.data();
  } else {
    console.error("No such document!");
    return null;
  }
};

const SpectacleDetailsScreen = ({ navigation, route }: any) => {
  const [movieData, setMovieData] = useState<any>(undefined);
  //const [movieCastData, setMovieCastData] = useState<any>(undefined);
  const [rating, setRating] = useState(0);
  const [voteCount, setVoteCount] = useState(0);

  useEffect(() => {
    console.log("Movie ID selected:", route.params.movieid);

    (async () => {
      const tempMovieData = await getMovieDetails(route.params.movieid);
      setMovieData(tempMovieData);
      console.log("Spectacle Data:", tempMovieData);
    })();

    const randomRating = (Math.random() * 9 + 1).toFixed(1);
    setRating(randomRating);

    const randomVoteCount =
      Math.floor(Math.random() * (50000 - 1000 + 1)) + 1000;
    setVoteCount(randomVoteCount);
  }, [route.params.movieid]);

  if (!movieData) {
    return (
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollViewContainer}
        bounces={false}
        showsVerticalScrollIndicator={false}
      >
        <View>
          <AppHeader
            name="closecircleo"
            header={" "}
            action={() => navigation.goBack()}
          />
        </View>
        <View>
          <ActivityIndicator size={"large"} color={COLORS.Green} />
        </View>
      </ScrollView>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      bounces={false}
      showsVerticalScrollIndicator={false}
    >
      <StatusBar hidden />
      <View>
        <ImageBackground
          source={{ uri: movieData.photo_couverture }}
          style={styles.imageBG}
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
        <View style={[styles.imageBG]}></View>
        <Image
          source={{ uri: movieData.photo_poster }}
          style={styles.cardImage}
        />
      </View>
      <View style={styles.timeContainer}>
        <FontAwesome5 name="map-pin" style={styles.mapIcon} />
        <Text style={styles.runtimeText}>{movieData.lieu}</Text>
        <FontAwesome5 name="clock" style={styles.clockIcon} />
        <Text style={styles.runtimeText}>{movieData.heure}</Text>
        <FontAwesome5 name="calendar" style={styles.calendarIcon} />
        <Text style={styles.runtimeText}>{movieData.date}</Text>
      </View>
      <View>
        {movieData.nom_spectacle && (
          <Text style={styles.title}>{movieData.nom_spectacle}</Text>
        )}
      </View>
      <View style={styles.genreContainer}>
        <View>
          <View style={styles.genreBox}>
            <Text style={styles.genreText}>{movieData.information1}</Text>
          </View>
        </View>
        <View>
          <View style={styles.genreBox}>
            <Text style={styles.genreText}>{movieData.information2}</Text>
          </View>
        </View>
        <View>
          <View style={styles.genreBox}>
            <Text style={styles.genreText}>{movieData.information3}</Text>
          </View>
        </View>
      </View>
      {movieData.description && (
        <Text style={styles.tagline}>{movieData.label}</Text>
      )}
      <View style={styles.infoContainer}>
        <View style={styles.rateContainer}>
          <FontAwesome name="star" style={styles.starIcon} />
          <Text style={styles.runtimeText}>
            {rating} ({voteCount})
          </Text>
        </View>
        {movieData.description && (
          <Text style={styles.descriptionText}>{movieData.description}</Text>
        )}
      </View>
      <View>
        <CategoryHeader title={"Images"} />
        <FlatList
          data={[movieData.photo1, movieData.photo2, movieData.photo3]}
          keyExtractor={(item, index) => index.toString()}
          horizontal
          contentContainerStyle={styles.containerGAP24}
          renderItem={({ item, index }) => (
            <ArtistCard
              cardWidth={160}
              imagePath={item}
              shouldMarginatedAtEnd={index === 2} // Indiquez ici l'index de l'élément final
              isFirst={index === 0}
              isLast={index === 2} // Assurez-vous que c'est l'index du dernier élément
            />
          )}
        />
      </View>

      <TouchableOpacity
        style={styles.buttonBG}
        onPress={() => {
          navigation.push("SeatBooking", {
            movieid: route.params.movieid,
          });
        }}
      >
        <Text style={styles.buttonText}>Réserver</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    display: "flex",
    flex: 1,
    backgroundColor: COLORS.Black,
  },
  loadingContainer: {
    flex: 1,
    alignSelf: "center",
    justifyContent: "center",
  },
  scrollViewContainer: {
    flex: 1,
  },
  appHeaderContainer: {
    marginHorizontal: SPACING.space_36,
    marginTop: SPACING.space_20 * 2,
  },
  imageBG: {
    width: "100%",
    aspectRatio: 3072 / 1727,
  },
  linearGradient: {
    height: "100%",
  },
  cardImage: {
    width: "60%",
    aspectRatio: 200 / 300,
    position: "absolute",
    bottom: 0,
    alignSelf: "center",
  },
  clockIcon: {
    fontSize: FONTSIZE.size_20,
    color: COLORS.WhiteRGBA50,
    //marginRight: SPACING.space_8,
    marginLeft: SPACING.space_8,
  },
  mapIcon: {
    fontSize: FONTSIZE.size_20,
    color: COLORS.Red,
    //marginRight: SPACING.space_8,
    marginLeft: SPACING.space_8,
  },
  calendarIcon: {
    fontSize: FONTSIZE.size_20,
    color: COLORS.White,
    marginLeft: SPACING.space_8,
  },
  timeContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingTop: SPACING.space_15,
  },

  runtimeText: {
    fontFamily: FONTFAMILY.poppins_medium,
    fontSize: FONTSIZE.size_14,
    color: COLORS.White,
    marginHorizontal: SPACING.space_8,
  },
  title: {
    fontFamily: FONTFAMILY.poppins_regular,
    fontSize: FONTSIZE.size_24,
    color: COLORS.White,
    marginHorizontal: SPACING.space_36,
    marginVertical: SPACING.space_15,
    textAlign: "center",
  },
  genreBox: {
    borderColor: COLORS.WhiteRGBA50,
    borderWidth: 1,
    paddingHorizontal: SPACING.space_10,
    paddingVertical: SPACING.space_4,
    borderRadius: BORDERRADIUS.radius_25,
  },
  genreText: {
    fontFamily: FONTFAMILY.poppins_regular,
    fontSize: FONTSIZE.size_10,
    color: COLORS.WhiteRGBA75,
  },
  genreContainer: {
    flex: 1,
    flexDirection: "row",
    gap: SPACING.space_20,
    flexWrap: "wrap",
    justifyContent: "center",
  },
  tagline: {
    fontFamily: FONTFAMILY.poppins_thin,
    fontSize: FONTSIZE.size_14,
    fontStyle: "italic",
    color: COLORS.White,
    marginHorizontal: SPACING.space_36,
    marginVertical: SPACING.space_15,
    textAlign: "center",
  },
  starIcon: {
    fontSize: FONTSIZE.size_20,
    color: COLORS.Yellow,
  },
  infoContainer: {
    marginHorizontal: SPACING.space_24,
  },
  rateContainer: {
    flexDirection: "row",
    gap: SPACING.space_10,
    alignItems: "center",
  },
  descriptionText: {
    fontFamily: FONTFAMILY.poppins_light,
    fontSize: FONTSIZE.size_14,
    color: COLORS.White,
  },
  containerGAP24: {
    gap: SPACING.space_24,
  },
  buttonBG: {
    alignItems: "center",
    marginVertical: SPACING.space_24,
  },
  buttonText: {
    borderRadius: BORDERRADIUS.radius_25 * 2,
    paddingHorizontal: SPACING.space_24,
    paddingVertical: SPACING.space_10,
    backgroundColor: COLORS.Green,
    fontFamily: FONTFAMILY.poppins_medium,
    fontSize: FONTSIZE.size_14,
    color: COLORS.White,
  },
});

export default SpectacleDetailsScreen;
