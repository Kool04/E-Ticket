import React, { useEffect, useState } from "react";
import { Text, View, StyleSheet, ImageBackground, Image } from "react-native";
import * as SecureStore from "expo-secure-store";
import { StatusBar } from "expo-status-bar";
import AppHeader from "../components/AppHeader";
import {
  BORDERRADIUS,
  COLORS,
  FONTFAMILY,
  FONTSIZE,
  SPACING,
} from "../theme/Theme";
import { LinearGradient } from "expo-linear-gradient";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";

const TicketScreen = ({ navigation, route }: any) => {
  return (
    <View style={styles.container}>
      <StatusBar hidden />
      <View style={styles.appHeaderContainer}>
        <AppHeader
          name="closecircleo"
          header={"TICKET Liste"}
          action={() => navigation.goBack()}
        />
        <View style={styles.container}>
          <Text>Ticket</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    display: "flex",
    flex: 1,
    backgroundColor: COLORS.Black,
  },
  appHeaderContainer: {
    marginHorizontal: SPACING.space_36,
    marginTop: SPACING.space_20 * 2,
  },
  ticketContainer: {
    flex: 1,
    justifyContent: "center",
  },
  ticketBGImage: {
    alignSelf: "center",
    width: 300,
    aspectRatio: 200 / 300,
    borderTopLeftRadius: BORDERRADIUS.radius_25,
    borderTopRightRadius: BORDERRADIUS.radius_25,
    overflow: "hidden",
    justifyContent: "flex-end",
  },
  linearGradient: {
    height: "70%",
  },
  linear: {
    borderTopColor: COLORS.Black,
    borderTopWidth: 3,
    width: 300,
    alignSelf: "center",
    backgroundColor: COLORS.Orange,
    borderStyle: "dashed",
  },
  ticketFooter: {
    backgroundColor: COLORS.Orange,
    width: 300,
    alignItems: "center",
    paddingBottom: SPACING.space_36,
    alignSelf: "center",
    borderBottomLeftRadius: BORDERRADIUS.radius_25,
    borderBottomRightRadius: BORDERRADIUS.radius_25,
  },
  ticketDateContainer: {
    flexDirection: "row",
    gap: SPACING.space_36,
    alignItems: "center",
    marginVertical: SPACING.space_10,
  },
  dateTitle: {
    fontFamily: FONTFAMILY.poppins_medium,
    fontSize: FONTSIZE.size_24,
    color: COLORS.White,
  },
  subtitle: {
    fontFamily: FONTFAMILY.poppins_regular,
    fontSize: FONTSIZE.size_14,
    color: COLORS.White,
  },
  clockIcon: {
    fontSize: FONTSIZE.size_24,
    color: COLORS.White,
    paddingBottom: SPACING.space_10,
  },
  ticketSeatContainer: {
    flexDirection: "row",
    gap: SPACING.space_36,
    alignItems: "center",
    justifyContent: "center",
    marginVertical: SPACING.space_10,
  },
  subtitleContainer: {
    alignItems: "center",
  },
  subheading: {
    fontFamily: FONTFAMILY.poppins_medium,
    fontSize: FONTSIZE.size_18,
    color: COLORS.White,
  },
  barcodeImage: {
    height: 50,
    aspectRatio: 158 / 52,
  },
  blackCircle: {
    height: 80,
    width: 80,
    borderRadius: 80,
    backgroundColor: COLORS.Black,
  },
});

export default TicketScreen;
