import React, { useEffect } from "react";
import { View, Text, Image, StyleSheet } from "react-native";

import lesiiskole_logo from "../assets/lesiiskole_logo.png";

export default function SplashScreen({ navigation }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.replace("LanguageSelect");
    }, 5000);
    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <View style={styles.container}>
      <View style={styles.centerGroup}>
        <Image source={lesiiskole_logo} style={styles.logo} resizeMode="contain" />
        <View style={styles.textWrap}>
          <Text style={styles.textPrimary}>f,aisfhka mdia fjkak</Text>
          <Text style={styles.textSecondary}>f,ais biafldaf,g tkak''''''</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
  },
  centerGroup: { alignItems: "center" },
  logo: { width: 190, height: 190, marginBottom: 0 },
  textWrap: { marginTop: -40, alignItems: "center" },

  textPrimary: {
    fontFamily: "FM_Derana",
    fontSize: 22,
    color: "#214294",
    textAlign: "center",
    marginRight: 10,
    lineHeight: 26,
    includeFontPadding: false,
    fontWeight: "normal",
  },
  textSecondary: {
    fontFamily: "FM_Derana",
    fontSize: 20,
    color: "#214294",
    textAlign: "center",
    marginRight: -70,
    lineHeight: 24,
    includeFontPadding: false,
    fontWeight: "normal",
  },
});
