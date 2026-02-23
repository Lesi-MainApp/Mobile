// pages/Lessons.js  ✅ FULL CODE (English only UI) + ✅ remove "ganitha gatalu" + ✅ keep dot time + ✅ sort old->new
import React, { useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  ActivityIndicator,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useGetLessonsByClassIdQuery } from "../app/lessonApi";

const norm = (v) => String(v || "").trim().toLowerCase();

export default function Lessons({ route }) {
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

  // ✅ keep dot time always (15:28 -> 15.28) + avoid Sinhala "ඃ"
  const timeWithDot = (v) =>
    String(v || "")
      .trim()
      .replace(/[：:ඃ]/g, ".")
      .replace(/\s+/g, "");

  // ✅ REMOVE subject text if it is "Maths" / "math" / "ganitha gatalu"
  const subjectToShow = useMemo(() => {
    const s = String(subject || "").trim();
    const n = norm(s).replace(/\s+/g, " "); // normalize double spaces
    if (!s) return "";
    if (n === "maths" || n === "math" || n === "ganitha gatalu") return "";
    return s;
  }, [subject]);

  // ✅ order lessons: older date -> current date (ascending)
  const sortedLessons = useMemo(() => {
    const toMs = (d) => {
      const dt = new Date(String(d || "").trim());
      const ms = dt.getTime();
      return Number.isFinite(ms) ? ms : 0;
    };

    return [...(lessons || [])].sort((a, b) => {
      const da = toMs(a?.date);
      const db = toMs(b?.date);
      if (da !== db) return da - db;

      const ta = timeWithDot(a?.time);
      const tb = timeWithDot(b?.time);
      return ta.localeCompare(tb);
    });
  }, [lessons]);

  const onWatchNow = (lesson, index) => {
    navigation.navigate("ViewLesson", {
      lessonId: lesson?._id,
      lessonNo: index + 1,

      title: lesson?.title || "",
      date: lesson?.date || "",
      time: lesson?.time || "",
      description: lesson?.description || "",
      youtubeUrl: lesson?.youtubeUrl || "",

      classId,
      className,
      grade,
      subject,
      teacher,
    });
  };

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      {!!className && <Text style={styles.pageTitle}>{className}</Text>}
      {!!subjectToShow && <Text style={styles.pageSub}>{subjectToShow}</Text>}

      {!classId ? (
        <Text style={styles.centerInfo}>Missing classId</Text>
      ) : isLoading ? (
        <View style={{ paddingTop: 30, alignItems: "center" }}>
          <ActivityIndicator />
          <Text style={styles.infoText}>Loading lessons...</Text>
        </View>
      ) : isError ? (
        <View style={{ paddingTop: 30, alignItems: "center" }}>
          <Text style={styles.errTitle}>Failed to load lessons</Text>

          <Pressable onPress={() => refetch?.()} style={{ marginTop: 10 }}>
            <Text style={styles.tryAgain}>Try again</Text>
          </Pressable>
        </View>
      ) : sortedLessons.length === 0 ? (
        <Text style={styles.centerInfo}>No lessons available.</Text>
      ) : (
        sortedLessons.map((lesson, idx) => (
          <View style={styles.card} key={lesson?._id || String(idx)}>
            <Text style={styles.lessonNo}>Lesson {idx + 1}</Text>

            <Text style={styles.titleFm} numberOfLines={1} ellipsizeMode="tail">
              {lesson?.title || ""}
            </Text>

            <View style={styles.metaRow}>
              <Text style={styles.metaText}>Date {lesson?.date || "-"}</Text>
              <Text style={styles.metaText}>
                Time {timeWithDot(lesson?.time) || "-"}
              </Text>
            </View>

            <View style={styles.descWrap}>
              <Text style={styles.descLabel}>Description</Text>
              <Text style={styles.descFm}>{lesson?.description || ""}</Text>
            </View>

            <View style={styles.bottomRow}>
              <Pressable
                style={styles.watchBtn}
                onPress={() => onWatchNow(lesson, idx)}
              >
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

  infoText: { marginTop: 10, color: "#64748B", fontWeight: "700" },
  errTitle: { color: "#0F172A", fontWeight: "900" },
  tryAgain: { color: "#214294", fontWeight: "900" },

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

  titleFm: {
    fontSize: 17,
    color: "#0F172A",
    marginBottom: 8,
    lineHeight: 20,
    flexShrink: 1,
    fontWeight: "700",
  },

  metaRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 6,
    gap: 10,
  },

  metaText: {
    fontSize: 12,
    fontWeight: "800",
    color: "#475569",
    flexShrink: 1,
  },

  descWrap: { marginTop: 2 },

  descLabel: {
    fontSize: 13,
    fontWeight: "800",
    color: "#0F172A",
    marginBottom: 2,
  },

  descFm: {
    fontSize: 15,
    color: "#64748B",
    lineHeight: 18,
    fontWeight: "700",
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