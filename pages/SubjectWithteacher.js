import React, { useMemo } from "react";
import { View, Text, StyleSheet, Image, Pressable } from "react-native";
import { useNavigation } from "@react-navigation/native";

import charithsir from "../assets/charirithsir.png";

/* ✅ Grade number -> word */
const numberToWord = (num) => {
  const map = {
    1: "One",
    2: "Two",
    3: "Three",
    4: "Four",
    5: "Five",
    6: "Six",
    7: "Seven",
    8: "Eight",
    9: "Nine",
    10: "Ten",
    11: "Eleven",
    12: "Twelve",
    13: "Thirteen",
  };
  return map[num] || String(num);
};

/* ✅ "Grade 8" -> "Grade Eight" */
const gradeToWordLabel = (gradeLabel) => {
  if (!gradeLabel) return "";
  const match = String(gradeLabel).match(/\d+/);
  const num = match ? parseInt(match[0], 10) : null;
  if (!num) return gradeLabel;
  return `Grade ${numberToWord(num)}`;
};

const normalizeSubject = (s) => String(s || "").trim().toLowerCase();

const isMathSubject = (s) => {
  const sub = normalizeSubject(s);
  return sub === "maths" || sub === "math" || sub === "mathematics";
};

export default function SubjectWithTeachers({ route }) {
  const navigation = useNavigation();

  const gradeRaw = route?.params?.grade || "Grade 1";
  const subjectRaw = route?.params?.subject || "Maths";

  const grade = useMemo(() => gradeToWordLabel(gradeRaw), [gradeRaw]);

  // ✅ NEW RULE:
  // Maths is available for ALL grades 1–11 (Primary + O/L)
  const available = useMemo(() => {
    const match = String(gradeRaw).match(/\d+/);
    const gNum = match ? parseInt(match[0], 10) : null;
    if (!gNum) return false;

    // allow only 1..11
    if (gNum < 1 || gNum > 11) return false;

    return isMathSubject(subjectRaw);
  }, [gradeRaw, subjectRaw]);

  // ✅ If not available, go back immediately (no modal)
  // But your request says: "dont show not available" for maths
  // Here we show a clean screen if user somehow enters wrong subject.
  if (!available) {
    return (
      <View style={styles.center}>
        <Text style={styles.centerTitle}>Not Available</Text>
        <Text style={styles.centerDesc}>
          This subject is not available right now.
        </Text>

        <Pressable style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Text style={styles.backBtnText}>Go Back</Text>
        </Pressable>
      </View>
    );
  }

  const goIndexNumber = () => {
    navigation.navigate("IndexNumber", {
      grade, // Grade One / Two / ...
      subject: "Maths",
      teacher: "Charith Sir",
    });
  };

  return (
    <View style={styles.screen}>
      <View style={styles.card}>
        <Image source={charithsir} style={styles.teacherImg} resizeMode="cover" />

        <View style={styles.content}>
          <Text style={styles.grade}>{grade}</Text>
          <Text style={styles.subject}>Subject - Maths</Text>
          <Text style={styles.teacher}>Teacher - Charith Sir</Text>

          <View style={styles.bottomRow}>
            <Pressable style={styles.enrollBtn} onPress={goIndexNumber}>
              <Text style={styles.enrollText}>Enroll now</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#F8FAFC",
    padding: 16,
  },

  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 12,
    flexDirection: "row",
    alignItems: "center",
    elevation: 6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },

  teacherImg: {
    width: 82,
    height: 95,
    borderRadius: 16,
    marginRight: 12,
    backgroundColor: "#EEF2FF",
  },

  content: { flex: 1 },

  grade: {
    fontSize: 15,
    fontWeight: "900",
    color: "#0F172A",
    marginBottom: 4,
  },

  subject: {
    fontSize: 14,
    fontWeight: "800",
    color: "#1F5EEB",
    marginBottom: 4,
  },

  teacher: {
    fontSize: 12,
    fontWeight: "700",
    color: "#475569",
  },

  bottomRow: {
    marginTop: 12,
    flexDirection: "row",
    justifyContent: "flex-end",
  },

  enrollBtn: {
    backgroundColor: "#1F5EEB",
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
  },

  enrollText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "900",
  },

  // fallback clean screen (only for wrong subject)
  center: {
    flex: 1,
    backgroundColor: "#F8FAFC",
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
  },
  centerTitle: { fontSize: 18, fontWeight: "900", color: "#0F172A" },
  centerDesc: {
    marginTop: 8,
    fontSize: 12,
    fontWeight: "700",
    color: "#64748B",
    textAlign: "center",
  },
  backBtn: {
    marginTop: 14,
    backgroundColor: "#214294",
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
  },
  backBtnText: { color: "#FFFFFF", fontWeight: "900", fontSize: 12 },
});
