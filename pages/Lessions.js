// pages/Lessons.js
import React from "react";
import { View, Text, StyleSheet, ScrollView, Pressable, ActivityIndicator } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useFonts } from "expo-font";
import { useGetLessonsByClassIdQuery } from "../app/lessonApi";

export default function Lessons({ route }) {
  const [fontsLoaded] = useFonts({
    FMEmanee: require("../assets/fonts/FMEmaneex.ttf"),
  });

  const navigation = useNavigation();

  // coming from EnrollSubjects page
  const classId = route?.params?.classId || "";
  const className = route?.params?.className || "";
  const grade = route?.params?.grade || "";
  const subject = route?.params?.subject || "";
  const teacher = route?.params?.teacher || "";

  const {
    data: lessons = [],
    isLoading,
    isError,
    refetch,
  } = useGetLessonsByClassIdQuery(classId, { skip: !classId });

  const onWatchNow = (lesson, index) => {
    navigation.navigate("ViewLesson", {
      // keep your existing param names
      lessonId: lesson?._id,
      lessonNo: index + 1,

      title: lesson?.title || "",
      date: lesson?.date || "",
      time: lesson?.time || "",
      description: lesson?.description || "",
      youtubeUrl: lesson?.youtubeUrl || "",

      // keep these too
      classId,
      className,
      grade,
      subject,
      teacher,
    });
  };

  if (!fontsLoaded) return null;

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      {!!className && <Text style={styles.pageTitle}>{className}</Text>}
      {!!subject && <Text style={styles.pageSub}>{subject}</Text>}

      {!classId ? (
        <Text style={styles.centerInfo}>Missing classId</Text>
      ) : isLoading ? (
        <View style={{ paddingTop: 30, alignItems: "center" }}>
          <ActivityIndicator />
          <Text style={{ marginTop: 10, color: "#64748B", fontWeight: "700" }}>
            Loading lessons...
          </Text>
        </View>
      ) : isError ? (
        <View style={{ paddingTop: 30, alignItems: "center" }}>
          <Text style={{ color: "#0F172A", fontWeight: "900" }}>
            Failed to load lessons
          </Text>
          <Pressable onPress={refetch} style={{ marginTop: 10 }}>
            <Text style={{ color: "#214294", fontWeight: "900" }}>Try again</Text>
          </Pressable>
        </View>
      ) : lessons.length === 0 ? (
        <Text style={styles.centerInfo}>No lessons available.</Text>
      ) : (
        lessons.map((lesson, idx) => (
          <View style={styles.card} key={lesson?._id || String(idx)}>
            <Text style={styles.lessonNo}>Lesson {idx + 1}</Text>

            {/* ✅ Sinhala TITLE using FMEmanee (ONE LINE ONLY) */}
            <Text style={styles.titleFm} numberOfLines={1} ellipsizeMode="tail">
              {lesson?.title || ""}
            </Text>

            <View style={styles.metaRow}>
              <Text style={styles.metaText}>Date : {lesson?.date || "-"}</Text>
              <Text style={styles.metaText}>Time : {lesson?.time || "-"}</Text>
            </View>

            {/* ✅ Sinhala DESCRIPTION using FMEmanee */}
            <View style={styles.descWrap}>
              <Text style={styles.descLabel}>Description :</Text>
              <Text style={styles.descFm}>{lesson?.description || ""}</Text>
            </View>

            <View style={styles.bottomRow}>
              <Pressable style={styles.watchBtn} onPress={() => onWatchNow(lesson, idx)}>
                <Text style={styles.watchText}>Watch Now</Text>
              </Pressable>
            </View>
          </View>
        ))
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#F8FAFC" },
  content: { padding: 16, paddingBottom: 120 },

  pageTitle: {
    fontSize: 18,
    fontWeight: "900",
    color: "#214294",
    textAlign: "center",
    marginBottom: 4,
  },
  pageSub: {
    fontSize: 12,
    fontWeight: "800",
    color: "#64748B",
    textAlign: "center",
    marginBottom: 14,
  },
  centerInfo: {
    textAlign: "center",
    marginTop: 25,
    color: "#64748B",
    fontWeight: "800",
  },

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

  /* ✅ Sinhala title (one line) */
  titleFm: {
    fontFamily: "FMEmanee",
    fontSize: 17,
    color: "#0F172A",
    marginBottom: 8,
    lineHeight: 20,
    flexShrink: 1,
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
