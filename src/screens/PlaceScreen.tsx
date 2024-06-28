import * as React from 'react';
import { Text, View, StyleSheet } from 'react-native';

interface PlaceScreenProps {}

const PlaceScreen = (props: PlaceScreenProps) => {
  return (
    <View style={styles.container}>
      <Text>PlaceScreen</Text>
    </View>
  );
};

export default PlaceScreen;

const styles = StyleSheet.create({
  container: {}
});
