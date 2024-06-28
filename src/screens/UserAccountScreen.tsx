import * as React from 'react';
import { Text, View, StyleSheet } from 'react-native';

interface UserAccountScreenProps {}

const UserAccountScreen = (props: UserAccountScreenProps) => {
  return (
    <View style={styles.container}>
      <Text>UserAccountScreen</Text>
    </View>
  );
};

export default UserAccountScreen;

const styles = StyleSheet.create({
  container: {}
});
