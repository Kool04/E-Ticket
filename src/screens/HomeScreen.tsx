import * as React from "react";
import { useState, useEffect } from "react";
import {
  Text,
  View,
  StyleSheet,
  Dimensions,
  ActivityIndicator,
  ScrollView,
  StatusBar,
  FlatList,
  TextInput,
} from "react-native";
import {
  COLORS,
  SPACING,
  FONTFAMILY,
  FONTSIZE,
  BORDERRADIUS,
} from "../theme/Theme";

import InputHeader from "../components/InputHeader";
import CategoryHeader from "../components/CategoryHeader";
import SubMovieCard from "../components/SubMovieCard";
import MovieCard from "../components/MovieCard";
import { firebaseConfig } from "../../firebase-config";
import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  getDocs,
  DocumentData,
} from "firebase/firestore";
import { Feather } from "@expo/vector-icons";

const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);

const { width } = Dimensions.get("window");

const HomeScreen = ({ navigation }: any) => {
  const [spectacle, setSpectacle] = useState<DocumentData[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const moviesCollection = collection(firestore, "spectacle");
        const querySnapshot = await getDocs(moviesCollection);
        const fetchedMovies: DocumentData[] = [];

        querySnapshot.forEach((doc) => {
          fetchedMovies.push({
            id: doc.id,
            ...doc.data(),
          });
        });

        setSpectacle(fetchedMovies);
      } catch (error) {
        console.error(
          "Erreur lors de la récupération des données Firestore:",
          error
        );
      }
    };

    fetchMovies();
  }, []);

  const filteredSpectacle = spectacle.filter((item) =>
    item.nom_spectacle.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const searchMoviesFunction = () => {
    navigation.navigate("Search", { searchTerm });
  };

  return (
    <ScrollView
      style={styles.container}
      bounces={false}
      contentContainerStyle={styles.scrollViewContainer}
    >
      <StatusBar hidden />
      <View style={styles.InputHeaderContainer}>
        <TextInput
          style={styles.textInput}
          placeholder="Rechercher un spectacle..."
          placeholderTextColor={COLORS.WhiteRGBA32}
          value={searchTerm}
          onChangeText={setSearchTerm}
        />

        <Feather name="search" size={FONTSIZE.size_20} color={COLORS.Green} />
      </View>

      <CategoryHeader title={"Concert"} />

      <FlatList
        data={filteredSpectacle.filter((item) => item.categories === "concert")}
        keyExtractor={(item) => item.id}
        bounces={false}
        showsVerticalScrollIndicator={false}
        snapToInterval={width * 0.7 + SPACING.space_36}
        contentContainerStyle={styles.containerGap36}
        horizontal
        renderItem={({ item }) => {
          if (!item || !item.nom_spectacle) {
            return (
              <View
                style={{
                  width: (width - (width * 0.7 + SPACING.space_36 * 2)) / 2,
                }}
              ></View>
            );
          }

          const imageUrl = item.photo_poster;

          return (
            <MovieCard
              shouldMarginatedAtEnd={true}
              cardFunction={() => {
                console.log({ movieid: item.id });
                navigation.push("SpectacleDetails", {
                  movieid: item.id,
                });
              }}
              cardWidth={width * 0.7}
              title={item.nom_spectacle}
              imagePath={imageUrl}
              vote_count={item.date}
              genre={item.genre || []}
            />
          );
        }}
      />

      <CategoryHeader title={"Spectacle"} />
      <FlatList
        data={filteredSpectacle.filter(
          (item) => item.categories === "spectacle"
        )}
        keyExtractor={(item) => item.id}
        bounces={false}
        showsVerticalScrollIndicator={false}
        snapToInterval={width * 0.7 + SPACING.space_36}
        contentContainerStyle={styles.containerGap36}
        horizontal
        renderItem={({ item }) => {
          if (!item || !item.nom_spectacle) {
            return (
              <View
                style={{
                  width: (width - (width * 0.7 + SPACING.space_36 * 2)) / 2,
                }}
              ></View>
            );
          }

          const imageUrl = item.photo_poster;

          return (
            <MovieCard
              shouldMarginatedAtEnd={true}
              cardFunction={() => {
                console.log({ movieid: item.id });
                navigation.push("SpectacleDetails", {
                  movieid: item.id,
                });
              }}
              cardWidth={width * 0.7}
              title={item.nom_spectacle}
              imagePath={imageUrl}
              vote_count={item.date}
              genre={item.genre || []}
            />
          );
        }}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.Black,
  },
  scrollViewContainer: {
    flexGrow: 1,
  },
  loadingContainer: {
    flex: 1,
    alignSelf: "center",
    justifyContent: "center",
  },
  InputHeaderContainer: {
    marginHorizontal: SPACING.space_36,
    marginTop: SPACING.space_28,
    display: "flex",
    paddingVertical: SPACING.space_8,
    paddingHorizontal: SPACING.space_24,
    borderWidth: 2,
    borderColor: COLORS.WhiteRGBA15,
    borderRadius: BORDERRADIUS.radius_25,
    flexDirection: "row",
  },

  textInput: {
    width: "90%",
    fontFamily: FONTFAMILY.poppins_regular,
    fontSize: FONTSIZE.size_14,
    color: COLORS.White,
  },
  containerGap36: {
    gap: SPACING.space_36,
  },
  text: {
    color: COLORS.White,
  },
});

export default HomeScreen;
