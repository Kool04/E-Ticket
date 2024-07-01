import React, { useEffect, useState } from "react";
import { Text, Dimensions, View, StyleSheet, FlatList } from "react-native";
import {
  getFirestore,
  collection,
  getDocs,
  DocumentData,
} from "firebase/firestore";
import { firebaseConfig } from "../../firebase-config"; // Assurez-vous d'importer correctement votre configuration Firebase
import { initializeApp } from "firebase/app";
import { COLORS, SPACING } from "../theme/Theme";
import MovieCard from "../components/MovieCard";
import CategoryHeader from "../components/CategoryHeader";

// Initialisez Firebase avec votre configuration
const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);
const { width } = Dimensions.get("window"); // Obtenez l'instance de Firestore à partir de l'application initialisée

const HomeScreenConcert = () => {
  const [spectacle, setSpectacle] = useState<DocumentData[]>([]); // Définir le type pour spectacle

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const moviesCollection = collection(firestore, "spectacle");
        const querySnapshot = await getDocs(moviesCollection);
        const fetchedMovies: DocumentData[] = []; // Définir explicitement le type pour fetchedMovies

        querySnapshot.forEach((doc) => {
          fetchedMovies.push({ id: doc.id, ...doc.data() });
        });

        console.log(fetchedMovies); // Vérifiez les données récupérées depuis Firestore

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

  return (
    <View style={styles.container}>
      <FlatList
        data={spectacle}
        keyExtractor={(item) => item.id}
        bounces={false}
        showsVerticalScrollIndicator={false}
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
              cardWidth={width * 0.7}
              title={item.nom_spectacle}
              imagePath={imageUrl}
              vote_count={
                item.date ? item.date.toDate().toLocaleDateString() : ""
              }
              genre={item.genre || []} // Ensure genre is defined and is an array
            />
          );
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  itemContainer: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  text: {
    fontSize: 16,
    color: "#000",
  },
});

export default HomeScreenConcert;
