import React from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import coins from "../assets/coins.png";

export default function Coins() {
  const coinCount = 1250;

  return (
    <View style={styles.container}>
      {/* Title */}
      <Text style={styles.title}>Coins</Text>

      {/* Coin Image */}
      <Image
        source={coins}
        style={styles.coinImage}
        resizeMode="contain"
      />

      {/* Coin Count */}
      <Text style={styles.count}>{coinCount}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: "48%",
    backgroundColor: "#EBEBEB",
    borderRadius: 16,
    padding: 10,
    alignItems: "center",          // ✅ center horizontally
    justifyContent: "center",      // ✅ center vertically
  },

  title: {
    fontSize: 14,
    fontWeight: "800",
    color: "#A89F9F",
  },

  coinImage: {
    width: 60,
    height: 60,
    marginTop:-10
  },

  count: {
    fontSize: 15,
    fontWeight: "900",
    color: "#B3A9A9",
    marginTop:-10
  },
});
