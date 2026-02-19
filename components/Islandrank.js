import React from "react";
import { StyleSheet, Image, Text } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import cup from "../assets/cup.png";
import useT from "../app/i18n/useT";

export default function Islandrank() {
  const { t, sinFont } = useT();

  return (
    <LinearGradient
      colors={["#2CA2FF", "#1AA3F6", "#43AFF3", "#20D9E6"]}
      locations={[0.08, 0.23, 0.45, 0.6]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.container}
    >
      <Image source={cup} style={styles.cup} resizeMode="contain" />

      <Text style={[styles.title, sinFont("bold")]}>{t("islandRank")}</Text>

      <Text style={[styles.rank, sinFont("bold")]}>18</Text>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  cup: {
    width: 100,
    height: 100,
    marginBottom: 8,
  },
  title: {
    fontSize: 14,
    fontWeight: "700",
    color: "#FFFFFF",
    letterSpacing: 1,
  },
  rank: {
    marginTop: 4,
    fontSize: 26,
    fontWeight: "900",
    color: "#FFFFFF",
  },
});
