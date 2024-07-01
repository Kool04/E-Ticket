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
} from "react-native";
import { COLORS, SPACING } from "../theme/Theme";

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

const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);

const { width } = Dimensions.get("window");

const HomeScreen = ({ navigation }: any) => {
  const [spectacle, setSpectacle] = useState<DocumentData[]>([]);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const moviesCollection = collection(firestore, "spectacle");
        const querySnapshot = await getDocs(moviesCollection);
        const fetchedMovies: DocumentData[] = [];

        querySnapshot.forEach((doc) => {
          fetchedMovies.push({
            id: doc.id, // Ajouter le Document ID ici
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

  const searchMoviesFunction = () => {
    navigation.navigate("Search");
  };

  return (
    <ScrollView
      style={styles.container}
      bounces={false}
      contentContainerStyle={styles.scrollViewContainer}
    >
      <StatusBar hidden />
      <View style={styles.InputHeaderContainer}>
        <InputHeader searchFunction={searchMoviesFunction} />
      </View>
      <CategoryHeader title={"Concert"} />

      <FlatList
        data={spectacle}
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
                console.log({ movieid: item.id }); // Utilisation de l'id
                navigation.push("SpectacleDetails", {
                  movieid: item.id, // Utilisation de l'id
                });
              }}
              cardWidth={width * 0.7}
              title={item.nom_spectacle}
              imagePath={imageUrl}
              vote_count={item.date}
              genre={item.genre || []} // Ensure genre is defined and is an array
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
  },
  contentContainer: {
    // Ajoutez ici le style pour le conteneur de contenu après le chargement
  },
  text: {
    color: COLORS.White,
  },
  containerGap36: {
    gap: SPACING.space_36,
  },
});

export default HomeScreen;
