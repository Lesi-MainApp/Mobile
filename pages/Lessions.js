import React from "react";
import { View, Text, StyleSheet, ScrollView, Pressable, ActivityIndicator } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useGetLessonsByClassIdQuery } from "../app/lessonApi";
import useT from "../app/i18n/useT";

export default function Lessons({ route }) {
  const navigation = useNavigation();
  const { t, sinFont } = useT();

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
      {!!className && (
        <Text style={[styles.pageTitle, sinFont("bold")]}>{className}</Text>
      )}
      {!!subject && (
        <Text style={[styles.pageSub, sinFont("regular")]}>{subject}</Text>
      )}

      {!classId ? (
        <Text style={[styles.centerInfo, sinFont("bold")]}>{t("missingClassId")}</Text>
      ) : isLoading ? (
        <View style={{ paddingTop: 30, alignItems: "center" }}>
          <ActivityIndicator />
          <Text style={[styles.infoText, sinFont("regular")]}>
            {t("loadingLessons")}
          </Text>
        </View>
      ) : isError ? (
        <View style={{ paddingTop: 30, alignItems: "center" }}>
          <Text style={[styles.errTitle, sinFont("bold")]}>
            {t("failedLoadLessons")}
          </Text>
          <Pressable onPress={refetch} style={{ marginTop: 10 }}>
            <Text style={[styles.tryAgain, sinFont("bold")]}>
              {t("tryAgain")}
            </Text>
          </Pressable>
        </View>
      ) : lessons.length === 0 ? (
        <Text style={[styles.centerInfo, sinFont("bold")]}>{t("noLessons")}</Text>
      ) : (
        lessons.map((lesson, idx) => (
          <View style={styles.card} key={lesson?._id || String(idx)}>
            <Text style={[styles.lessonNo, sinFont("bold")]}>
              {t("lesson")} {idx + 1}
            </Text>

            {/* Title (Sinhala font) */}
            <Text style={[styles.titleFm, sinFont("regular")]} numberOfLines={1} ellipsizeMode="tail">
              {lesson?.title || ""}
            </Text>

            <View style={styles.metaRow}>
              <Text style={[styles.metaText, sinFont("regular")]}>
                {t("date")} : {lesson?.date || "-"}
              </Text>
              <Text style={[styles.metaText, sinFont("regular")]}>
                {t("time")} : {lesson?.time || "-"}
              </Text>
            </View>

            <View style={styles.descWrap}>
              <Text style={[styles.descLabel, sinFont("bold")]}>
                {t("description")} :
              </Text>
              <Text style={[styles.descFm, sinFont("regular")]}>
                {lesson?.description || ""}
              </Text>
            </View>

            <View style={styles.bottomRow}>
              <Pressable style={styles.watchBtn} onPress={() => onWatchNow(lesson, idx)}>
                <Text style={[styles.watchText, sinFont("bold")]}>
                  {t("watchNow")}
                </Text>
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
