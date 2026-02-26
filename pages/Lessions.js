// pages/Lessons.js
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

const cleanDisplayText = (value) => {
  const raw = String(value || "").trim();
  if (!raw) return "";
  return raw.replace(/\s+/g, " ").trim();
};

export default function Lessons({ route }) {
  const navigation = useNavigation();

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

  const timeWithDot = (v) =>
    String(v || "")
      .trim()
      .replace(/[：:ඃ]/g, ".")
      .replace(/\s+/g, "");

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
      

      {!classId ? (
        <Text style={styles.centerInfo}>Missing class</Text>
      ) : isLoading ? (
        <View style={styles.stateWrap}>
          <ActivityIndicator size="small" color="#2563EB" />
          <Text style={styles.infoText}>Loading lessons...</Text>
        </View>
      ) : isError ? (
        <View style={styles.stateWrap}>
          <Text style={styles.errTitle}>Failed to load lessons</Text>
          <Pressable onPress={() => refetch?.()} style={styles.retryBtn}>
            <Text style={styles.tryAgain}>Try again</Text>
          </Pressable>
        </View>
      ) : sortedLessons.length === 0 ? (
        <Text style={styles.centerInfo}>No lessons available.</Text>
      ) : (
        sortedLessons.map((lesson, idx) => {
          const lessonTitle =
            cleanDisplayText(lesson?.title) || `Lesson ${idx + 1}`;
          const lessonDescription =
            cleanDisplayText(lesson?.description) || "No description available.";

          return (
            <View style={styles.card} key={lesson?._id || String(idx)}>
              <View style={styles.headerRow}>
                <View style={styles.lessonBadge}>
                  <Text style={styles.lessonBadgeText}>Lesson {idx + 1}</Text>
                </View>

                <View style={styles.metaWrap}>
                  <View style={styles.metaBox}>
                    <Text style={styles.metaLabel}>Date</Text>
                    <Text style={styles.metaValue}>{lesson?.date || "-"}</Text>
                  </View>

                  <View style={styles.metaBox}>
                    <Text style={styles.metaLabel}>Time</Text>
                    <Text style={styles.metaValue}>
                      {timeWithDot(lesson?.time) || "-"}
                    </Text>
                  </View>
                </View>
              </View>

              <Text style={styles.lessonTitle}>{lessonTitle}</Text>

              <View style={styles.divider} />

              <View style={styles.descCard}>
                <Text style={styles.descLabel}>Description</Text>
                <Text style={styles.descText}>{lessonDescription}</Text>
              </View>

              <View style={styles.buttonRow}>
                <Pressable
                  style={({ pressed }) => [
                    styles.watchBtn,
                    pressed && styles.watchBtnPressed,
                  ]}
                  onPress={() => onWatchNow(lesson, idx)}
                >
                  <Text style={styles.watchText}>Watch Now</Text>
                </Pressable>
              </View>
            </View>
          );
        })
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#F1F5F9",
  },

  content: {
    paddingHorizontal: 14,
    paddingTop: 14,
    paddingBottom: 120,
  },

  pageTitle: {
    fontSize: 22,
    fontWeight: "800",
    color: "#0F172A",
    textAlign: "center",
    marginBottom: 16,
    letterSpacing: 0.2,
  },

  stateWrap: {
    paddingTop: 30,
    alignItems: "center",
  },

  infoText: {
    marginTop: 10,
    color: "#64748B",
    fontWeight: "600",
    fontSize: 13,
  },

  errTitle: {
    color: "#0F172A",
    fontWeight: "700",
    fontSize: 14,
  },

  retryBtn: {
    marginTop: 10,
  },

  tryAgain: {
    color: "#2563EB",
    fontWeight: "700",
    fontSize: 13,
  },

  centerInfo: {
    textAlign: "center",
    marginTop: 24,
    color: "#64748B",
    fontWeight: "600",
    fontSize: 14,
  },

  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 22,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },

  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: 10,
  },

  lessonBadge: {
    backgroundColor: "#DBEAFE",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
  },

  lessonBadgeText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#1D4ED8",
  },

  metaWrap: {
    flexDirection: "row",
    gap: 8,
  },

  metaBox: {
    minWidth: 84,
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: "#D9E2EC",
    borderRadius: 14,
    paddingVertical: 8,
    paddingHorizontal: 10,
    alignItems: "center",
  },

  metaLabel: {
    fontSize: 10,
    fontWeight: "600",
    color: "#64748B",
    marginBottom: 3,
  },

  metaValue: {
    fontSize: 13,
    fontWeight: "700",
    color: "#0F172A",
  },

  lessonTitle: {
    marginTop: 14,
    fontSize: 22,
    fontWeight: "600",
    color: "#0F172A",
    lineHeight: 28,
  },

  divider: {
    height: 1,
    backgroundColor: "#E2E8F0",
    marginTop: 14,
    marginBottom: 14,
  },

  descCard: {
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: "#D9E2EC",
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },

  descLabel: {
    fontSize: 13,
    fontWeight: "700",
    color: "#334155",
    marginBottom: 6,
  },

  descText: {
    fontSize: 15,
    fontWeight: "400",
    color: "#475569",
    lineHeight: 22,
  },

  buttonRow: {
    marginTop: 14,
    alignItems: "flex-end",
  },

  watchBtn: {
    backgroundColor: "#2563EB",
    paddingHorizontal: 20,
    paddingVertical: 11,
    borderRadius: 14,
    minWidth: 122,
    alignItems: "center",
    shadowColor: "#2563EB",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.22,
    shadowRadius: 10,
    elevation: 4,
  },

  watchBtnPressed: {
    opacity: 0.9,
  },

  watchText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "700",
  },
});