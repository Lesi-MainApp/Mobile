import React from "react";
import { View, Text, StyleSheet } from "react-native";

export default function ProgressBar({ progress = 0.65 }) {
  const pct = Math.max(0, Math.min(1, progress)); // safe clamp 0-1

  return (
    <View style={styles.row}>
      <View style={styles.outer}>
        <View style={[styles.inner, { width: `${pct * 100}%` }]} />
      </View>

      <Text style={styles.text}>{Math.round(pct * 100)}%</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    marginTop: 5,
  },

  outer: {
    flex: 1,
    height: 14,
    backgroundColor: "#D9D9D9",
    borderRadius: 12,
    padding: 4,
    marginRight: 10,
  },

  inner: {
    height: "100%",
    backgroundColor: "#2CA2FF",
    borderRadius: 8,
  },

  text: {
    fontSize: 14,
    fontWeight: "700",
    color: "#214294",
    minWidth: 40,
    textAlign: "right",
  },
});
