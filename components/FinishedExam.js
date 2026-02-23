import React from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import exam from "../assets/exam.png";
import useT from "../app/i18n/useT";
import { useGetMyStatsQuery } from "../app/attemptApi";

export default function FinishedExam() {
  const { t, sinFont } = useT();
  const { data } = useGetMyStatsQuery();

  const finishedCount = Number(data?.totalFinishedExams || 0);

  return (
    <View style={styles.container}>
      <Text style={[styles.title, sinFont("bold")]}>{t("totalFinishedExams")}</Text>
      <Image source={exam} style={styles.image} />
      <Text style={[styles.count, sinFont("bold")]}>{finishedCount}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: "48%",
    backgroundColor: "#DDF0FF",
    borderRadius: 16,
    padding: 0,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 13,
    fontWeight: "800",
    color: "#214294",
    margin: 0,
  },
  image: {
    width: 50,
    height: 50,
    resizeMode: "contain",
    margin: 0,
  },
  count: {
    fontSize: 20,
    marginTop: -5,
    fontWeight: "800",
    color: "#214294",
    margin: 0,
  },
});