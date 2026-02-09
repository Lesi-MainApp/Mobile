import React, { useEffect, useState } from "react";
import { View, Text, Image, StyleSheet, ActivityIndicator } from "react-native";
import * as Font from "expo-font";

import lesiiskole_logo from "../assets/lesiiskole_logo.png";

export default function SplashScreen({ navigation }) {
  const [fontsLoaded, setFontsLoaded] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        await Font.loadAsync({
          FM_Derana: require("../assets/fonts/FM_Derana.ttf"),
        });
        setFontsLoaded(true);
      } catch (e) {
        console.log("Font load error:", e);
        setFontsLoaded(true); // fallback
      }
    })();
  }, []);

  // ✅ Navigate after 5 seconds (only after font loaded)
  useEffect(() => {
    if (!fontsLoaded) return;

    const timer = setTimeout(() => {
      navigation.replace("Sign"); // ✅ go to Sign screen
    }, 5000);

    return () => clearTimeout(timer);
  }, [fontsLoaded, navigation]);

  if (!fontsLoaded) {
    return (
      <View style={styles.loaderWrap}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

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
  loaderWrap: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
  },

  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
  },

  centerGroup: {
    alignItems: "center",
  },

  logo: {
    width: 190,
    height: 190,
    marginBottom: 0,
  },

  textWrap: {
    marginTop: -40,
    alignItems: "center",
  },

  textPrimary: {
    fontFamily: "FM_Derana",
    fontSize: 22,
    color: "#214294",
    textAlign: "center",
    marginRight: 10,
    lineHeight: 26,
    includeFontPadding: false,
  },

  textSecondary: {
    fontFamily: "FM_Derana",
    fontSize: 20,
    color: "#214294",
    textAlign: "center",
    marginRight: -70,
    lineHeight: 24,
    includeFontPadding: false,
  },
});
