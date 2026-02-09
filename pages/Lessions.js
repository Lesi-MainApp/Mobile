import React from "react";
import { View, Text, StyleSheet, ScrollView, Pressable } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useFonts } from "expo-font";

export default function Lessions({ route }) {
  const [fontsLoaded] = useFonts({
    FMEmanee: require("../assets/fonts/FMEmanee x.ttf"),
  });

  const navigation = useNavigation();

  // (optional: coming from IndexNumber page)
  const indexNumber = route?.params?.indexNumber || "";
  const grade = route?.params?.grade || "";
  const subject = route?.params?.subject || "";
  const teacher = route?.params?.teacher || "";

  // ✅ Demo lesson data
  const lesson = {
    lessonNo: 1,
    title: "uQ,sl .‚; l¾u", // Sinhala title
    date: "2025.8.12",
    time: "10.20 a.m",
    description: "fuu tAllh hgf;a j<dl=¿ mfya ixl,amh hgf;a f,aisfhka myiqfjka  uQ,sl .‚; l¾u W.ksuq'  ",
    youtubeUrl: "https://youtu.be/30cffBrABao?si=a-IlPYIdH09g2XZa",
  };

  const onWatchNow = () => {
    navigation.navigate("ViewLesson", {
      lessonNo: lesson.lessonNo,
      title: lesson.title,
      date: lesson.date,
      time: lesson.time,
      description: lesson.description,
      youtubeUrl: lesson.youtubeUrl,

      indexNumber,
      grade,
      subject,
      teacher,
    });
  };

  // ✅ Prevent render before font load
  if (!fontsLoaded) return null;

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <View style={styles.card}>
        <Text style={styles.lessonNo}>Lesson {lesson.lessonNo}</Text>

        {/* ✅ Sinhala TITLE using FMEmanee (ONE LINE ONLY) */}
        <Text
          style={styles.titleFm}
          numberOfLines={1}
          ellipsizeMode="tail"
        >
          {lesson.title}
        </Text>

        <View style={styles.metaRow}>
          <Text style={styles.metaText}>Date : {lesson.date}</Text>
          <Text style={styles.metaText}>Time : {lesson.time}</Text>
        </View>

        {/* ✅ Sinhala DESCRIPTION using FMEmanee */}
        <View style={styles.descWrap}>
          <Text style={styles.descLabel}>Description :</Text>
          <Text style={styles.descFm}>{lesson.description}</Text>
        </View>

        <View style={styles.bottomRow}>
          <Pressable style={styles.watchBtn} onPress={onWatchNow}>
            <Text style={styles.watchText}>Watch Now</Text>
          </Pressable>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#F8FAFC" },
  content: { padding: 16, paddingBottom: 120 },

  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 16,
    marginBottom: 14,
    elevation: 6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },

  lessonNo: {
    textAlign: "center",
    fontSize: 19,
    fontWeight: "900",
    color: "#1F5EEB",
    marginBottom: 8,
  },

  titleLabel: {
    fontSize: 13,
    fontWeight: "800",
    color: "#0F172A",
    marginBottom: 2,
  },

  /* ✅ Sinhala title (one line) */
  titleFm: {
    fontFamily: "FMEmanee",
    fontSize: 17,
    color: "#0F172A",
    marginBottom: 8,
    lineHeight: 20,
    flexShrink: 1, // ✅ helps prevent wrapping
  },

  metaRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 6,
  },

  metaText: {
    fontSize: 12,
    fontWeight: "800",
    color: "#475569",
  },

  descWrap: {
    marginTop: 2,
  },

  descLabel: {
    fontSize: 13,
    fontWeight: "800",
    color: "#0F172A",
    marginBottom: 2,
  },

  /* ✅ Sinhala description */
  descFm: {
    fontFamily: "FMEmanee",
    fontSize: 15,
    color: "#64748B",
    lineHeight: 18,
  },

  bottomRow: {
    marginTop: 10,
    flexDirection: "row",
    justifyContent: "flex-end",
  },

  watchBtn: {
    backgroundColor: "#1F5EEB",
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 12,
  },

  watchText: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "900",
  },
});
