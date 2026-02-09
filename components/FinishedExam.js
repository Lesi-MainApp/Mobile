import React from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import exam from "../assets/exam.png";

export default function FinishedExam() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Total Finished Exams</Text>
      <Image source={exam} style={styles.image} />
      <Text style={styles.count}>50</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: "48%",
    backgroundColor: "#DDF0FF",
    borderRadius: 16,
    padding: 0,              // 🔥 remove padding
    justifyContent: "center",
    alignItems: "center",
  },

  title: {
    fontSize: 13,
    fontWeight: "800",
    color: "#214294",
    margin: 0,               // 🔥 remove all margins
  },

  image: {
    width: 50,
    height: 50,
    resizeMode: "contain",
    margin: 0,               // 🔥 remove gap
  },

  count: {
    fontSize: 20,
    marginTop: -5,            // 🔥 remove gap
    fontWeight: "800",
    color: "#214294",
    margin: 0,               // 🔥 remove gap
  },
});
