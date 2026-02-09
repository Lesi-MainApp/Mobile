import React, { useMemo } from "react";
import { View, Text, StyleSheet, Pressable, ScrollView, ActivityIndicator } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useGetGradeDetailQuery } from "../app/gradeApi";

const numberToWord = (num) => {
  const map = {
    1: "One", 2: "Two", 3: "Three", 4: "Four", 5: "Five",
    6: "Six", 7: "Seven", 8: "Eight", 9: "Nine", 10: "Ten",
    11: "Eleven", 12: "Twelve", 13: "Thirteen",
  };
  return map[num] || String(num);
};

const gradeToWordLabel = (gradeLabel) => {
  if (!gradeLabel) return "";
  const match = String(gradeLabel).match(/\d+/);
  const num = match ? parseInt(match[0], 10) : null;
  return num ? `Grade ${numberToWord(num)}` : gradeLabel;
};

const parseGradeNumber = (gradeLabel) => {
  const match = String(gradeLabel || "").match(/\d+/);
  return match ? parseInt(match[0], 10) : null;
};

export default function Subjects({ route }) {
  const navigation = useNavigation();
  const gradeLabel = route?.params?.grade || "Grade 4";

  const gradeNumber = useMemo(() => parseGradeNumber(gradeLabel), [gradeLabel]);
  const gradeTitle = useMemo(() => gradeToWordLabel(gradeLabel), [gradeLabel]);

  const { data: gradeDoc, isLoading, isError, refetch } = useGetGradeDetailQuery(
    gradeNumber,
    { skip: !gradeNumber }
  );

  const subjects = useMemo(() => {
    if (!gradeDoc) return [];

    if (gradeNumber >= 1 && gradeNumber <= 11) {
      const list = Array.isArray(gradeDoc?.subjects) ? gradeDoc.subjects : [];
      return list.map((s) => ({
        key: s?._id || s?.subject || Math.random().toString(),
        label: s?.subject || "—",
      }));
    }
    return [];
  }, [gradeDoc, gradeNumber]);

  return (
    <View style={styles.screen}>
      <Text style={styles.pageTitle}>{gradeTitle}</Text>

      {isLoading ? (
        <View style={{ paddingTop: 30, alignItems: "center" }}>
          <ActivityIndicator />
          <Text style={{ marginTop: 10, color: "#64748B", fontWeight: "700" }}>
            Loading subjects...
          </Text>
        </View>
      ) : isError ? (
        <View style={{ paddingTop: 30, alignItems: "center" }}>
          <Text style={{ color: "#0F172A", fontWeight: "900" }}>
            Failed to load subjects
          </Text>
          <Pressable onPress={refetch} style={{ marginTop: 10 }}>
            <Text style={{ color: "#214294", fontWeight: "900" }}>Try again</Text>
          </Pressable>
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.list}>
          {subjects.map((item) => (
            <Pressable
              key={item.key}
              style={({ pressed }) => [styles.card, pressed && styles.pressed]}
              onPress={() =>
                navigation.navigate("EnrollSubjects", {
                  grade: gradeLabel,
                  gradeNumber,
                  subjectName: item.label,
                })
              }
            >
              <Text style={styles.subjectText}>{item.label}</Text>
              <Text style={styles.arrow}>›</Text>
            </Pressable>
          ))}

          {subjects.length === 0 && (
            <Text style={{ textAlign: "center", color: "#64748B", fontWeight: "700", marginTop: 20 }}>
              No subjects found for this grade.
            </Text>
          )}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#F8FAFC", paddingHorizontal: 16, paddingTop: 24 },
  pageTitle: { fontSize: 28, fontWeight: "900", color: "#214294", textAlign: "center", marginBottom: 20 },
  list: { paddingBottom: 30 },
  card: {
    height: 80,
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    marginBottom: 12,
    paddingHorizontal: 20,
    justifyContent: "center",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
  },
  pressed: { transform: [{ scale: 0.98 }], opacity: 0.95 },
  subjectText: { fontSize: 16, fontWeight: "800", color: "#0F172A", textAlign: "center" },
  arrow: { position: "absolute", right: 16, top: "50%", marginTop: -18, fontSize: 38, color: "#214294" },
});
