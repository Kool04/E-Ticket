import * as React from "react";
import { Text, View, StyleSheet } from "react-native";
import { COLORS, FONTFAMILY, FONTSIZE, SPACING } from "../theme/Theme";
import { FontAwesome } from "@expo/vector-icons";
import { FontAwesome5 } from "@expo/vector-icons";

const SettingComponent = (props: any) => {
  return (
    <View style={styles.container}>
      <View>
        <FontAwesome name={props.icon} style={styles.iconStyle} />
      </View>
      <View style={styles.settingContainer}>
        <Text style={styles.title}>{props.heading}</Text>
        <Text style={styles.subtitle}>{props.subheading}</Text>
        <Text style={styles.subtitle}>{props.subtitle}</Text>
      </View>
      <View style={styles.iconBG}>
        <FontAwesome5 name={"arrow-right"} style={styles.iconStyle} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    paddingVertical: SPACING.space_20,
  },
  settingContainer: {
    flex: 1,
  },
  iconStyle: {
    color: COLORS.White,
    fontSize: FONTSIZE.size_24,
    paddingHorizontal: SPACING.space_20,
  },
  title: {
    fontFamily: FONTFAMILY.poppins_medium,
    fontSize: FONTSIZE.size_18,
    color: COLORS.White,
  },
  subtitle: {
    fontFamily: FONTFAMILY.poppins_regular,
    fontSize: FONTSIZE.size_14,
    color: COLORS.WhiteRGBA15,
  },
  iconBG: {
    justifyContent: "center",
  },
});

export default SettingComponent;
