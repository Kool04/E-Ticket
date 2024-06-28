import * as React from 'react';
import { Text, View, StyleSheet } from 'react-native';

interface TicketScreenProps {}

const TicketScreen = (props: TicketScreenProps) => {
  return (
    <View style={styles.container}>
      <Text>TicketScreen</Text>
    </View>
  );
};

export default TicketScreen;

const styles = StyleSheet.create({
  container: {}
});
