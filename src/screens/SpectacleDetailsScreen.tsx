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
import { baseImagePath, movieCastDetails, movieDetails } from "../api/apicalls";
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
  const docRef = doc(db, "spectacles", movieid);
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
  const [movieCastData, setMovieCastData] = useState<any>(undefined);
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

    // Générer un nombre aléatoire de votes entre 1000 et 50000
    const randomVoteCount =
      Math.floor(Math.random() * (50000 - 1000 + 1)) + 1000;
    setVoteCount(randomVoteCount);
  }, []);

  if (!movieData) {
    return (
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollViewContainer}
        bounces={false}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.appHeaderContainer}>
          <AppHeader
            name="closecircleo"
            header={" "}
            action={() => navigation.goBack()}
          />
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size={"large"} color={COLORS.Orange} />
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
          source={{ uri: movieData.images[5].url }}
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
          source={{ uri: movieData.images[9].url }}
          style={styles.cardImage}
        />
      </View>
      <View style={styles.timeContainer}>
        <FontAwesome5 name="clock" style={styles.clockIcon} />
        <Text style={styles.runtimeText}>
          {new Date(movieData.dates.start.dateTime).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </Text>
      </View>
      <View>
        {movieData.name && <Text style={styles.title}>{movieData.name}</Text>}
      </View>
      <View style={styles.genreContainer}>
        {/* <View>
          {movieData?.promoters?.length > 0 &&
            movieData.promoters.map((item: any) => {
              return (
                <View style={styles.genreBox} key={item.id}>
                  <Text style={styles.genreText}>{item.name}</Text>
                </View>
              );
            })}
        </View>*/}
        <View>
          {movieData?.classifications?.length > 0 &&
            movieData.classifications.map((cls: any) => (
              <View style={styles.genreBox} key={cls.id}>
                <Text style={styles.genreText}>{cls.genre?.name}</Text>
              </View>
            ))}
        </View>
        <View>
          {movieData?.classifications?.length > 0 &&
            movieData.classifications.map((cls: any) => (
              <View style={styles.genreBox} key={cls.id}>
                <Text style={styles.genreText}>{cls.subGenre?.name}</Text>
              </View>
            ))}
        </View>
        <View>
          {movieData?.classifications?.length > 0 &&
            movieData.classifications.map((cls: any) => (
              <View style={styles.genreBox} key={cls.id}>
                <Text style={styles.genreText}>{cls.segment?.name}</Text>
              </View>
            ))}
        </View>
      </View>
      {movieData.promoter?.description && (
        <Text style={styles.tagline}>{movieData.promoter.description}</Text>
      )}

      <View style={styles.infoContainer}>
        <View style={styles.rateContainer}>
          <FontAwesome name="star" style={styles.starIcon} />
          <Text style={styles.runtimeText}>
            {rating} ({voteCount})
          </Text>
          <Text style={styles.runtimeText}>
            {new Date(movieData.dates.start.dateTime).toLocaleDateString(
              "fr-FR",
              {
                day: "numeric",
                month: "long",
                year: "numeric",
              }
            )}
          </Text>
        </View>
        {movieData.accessibility && movieData.accessibility.info && (
          <Text style={styles.descriptionText}>
            {movieData.accessibility.info}
          </Text>
        )}
      </View>
      <View>
        <CategoryHeader title="Images" />
        <FlatList
          data={movieData.images}
          keyExtractor={(item, index) => index.toString()}
          horizontal
          contentContainerStyle={styles.containerGAP24} // Assurez-vous de définir styles.containerGAP24 selon vos besoins
          renderItem={({ item, index }) => (
            <ArtistCard
              shouldMarginatedAtEnd={index === movieData.images.length - 1}
              cardWidth={80}
              isFirst={index === 0}
              isLast={index === movieData.images.length - 1}
              imagePath={item.url} // Utilisation directe de l'URL de l'image à partir de l'objet item
              //title={item.ratio} // Vous pouvez ajuster le titre en fonction de vos besoins
              // subtitle={`Size: ${item.width} x ${item.height}`} // Exemple de sous-titre avec les dimensions de l'image
            />
          )}
        />

        <View>
          <TouchableOpacity
            style={styles.buttonBG}
            onPress={() => {
              navigation.push("SeatBooking", { movieid: movieData.id });
            }}
          >
            <Text style={styles.buttonText}>Select Seats</Text>
          </TouchableOpacity>
        </View>
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
    marginRight: SPACING.space_8,
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
    backgroundColor: COLORS.Orange,
    fontFamily: FONTFAMILY.poppins_medium,
    fontSize: FONTSIZE.size_14,
    color: COLORS.White,
  },
});

export default SpectacleDetailsScreen;
