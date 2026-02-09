import React from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";

export default function Live() {
  return (
    <View style={styles.screen}>
      <View style={styles.card}>
        {/* Title + Teacher */}
        <View style={styles.topRow}>
          <Text style={styles.title}>Chakkre</Text>
          <Text style={styles.teacher}>- Charith Sir</Text>
        </View>

        {/* Date & Time */}
        <View style={styles.metaRow}>
          <Text style={styles.meta}>Date : 2023.10.23</Text>
          <Text style={styles.meta}>Time : 10.30 a.m.</Text>
        </View>

        {/* Button */}
        <Pressable style={styles.btn}>
          <Text style={styles.btnText}>Join Now</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#F8FAFC",
    paddingHorizontal: 16,
    paddingTop: 16,
  },

  card: {
    width: "100%",
    height: 130,
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,

    elevation: 6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },

  topRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },

  title: {
    fontSize: 18,
    fontWeight: "800",
    color: "#0F172A",
  },

  teacher: {
    fontSize: 13,
    fontWeight: "700",
    color: "#475569",
  },

  metaRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 6,
  },

  meta: {
    fontSize: 12,
    fontWeight: "700",
    color: "#64748B",
  },

  /* 🔼 Button moved up slightly */
  btn: {
    alignSelf: "center",
    backgroundColor: "#1F5EEB",
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 12,
    marginTop: 15,     // 👈 moved up (was 10)
  },

  btnText: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "800",
  },
});
