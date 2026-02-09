import React, { useMemo, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Modal,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { useGetClassesByGradeAndSubjectQuery } from "../app/classApi";

const numberFromGrade = (gradeLabel) => {
  if (!gradeLabel) return null;
  const match = String(gradeLabel).match(/\d+/);
  return match ? parseInt(match[0], 10) : null;
};

const gradeWord = (n) => {
  const map = {
    1: "One", 2: "Two", 3: "Three", 4: "Four", 5: "Five",
    6: "Six", 7: "Seven", 8: "Eight", 9: "Nine", 10: "Ten", 11: "Eleven",
  };
  return map[n] || String(n);
};

export default function EnrollSubjects({ route }) {
  const navigation = useNavigation();
  const [modalOpen, setModalOpen] = useState(false);

  const gradeLabel = route?.params?.grade || "Grade 4";
  const gradeNumberParam = route?.params?.gradeNumber;
  const subjectName = route?.params?.subjectName || "";

  const gradeNo = useMemo(() => {
    return Number(gradeNumberParam) || numberFromGrade(gradeLabel);
  }, [gradeNumberParam, gradeLabel]);

  const pageTitle = useMemo(() => {
    if (!gradeNo) return "Select Grade";
    return `Grade ${gradeWord(gradeNo)}`;
  }, [gradeNo]);

  const {
    data: classes = [],
    isLoading,
    isError,
    refetch,
  } = useGetClassesByGradeAndSubjectQuery(
    { gradeNumber: gradeNo, subjectName },
    { skip: !gradeNo || !subjectName }
  );

  const onPressClass = (cls) => {
    // ✅ you can change navigation target
    // example: open Lessons list OR SubjectWithTeachers
    navigation.navigate("Lessons", {
      classId: cls._id,
      className: cls.className,
      grade: gradeLabel,
      subject: subjectName,
    });
  };

  return (
    <View style={styles.screen}>
      <Text style={styles.pageTitle}>{pageTitle}</Text>
      <Text style={styles.pageSub}>{subjectName}</Text>

      {isLoading ? (
        <View style={{ paddingTop: 30, alignItems: "center" }}>
          <ActivityIndicator />
          <Text style={{ marginTop: 10, color: "#64748B", fontWeight: "700" }}>
            Loading classes...
          </Text>
        </View>
      ) : isError ? (
        <View style={{ paddingTop: 30, alignItems: "center" }}>
          <Text style={{ color: "#0F172A", fontWeight: "900" }}>
            Failed to load classes
          </Text>
          <Pressable onPress={refetch} style={{ marginTop: 10 }}>
            <Text style={{ color: "#214294", fontWeight: "900" }}>Try again</Text>
          </Pressable>
        </View>
      ) : (
        <>
          {classes.map((c) => (
            <Pressable
              key={c._id}
              onPress={() => onPressClass(c)}
              style={({ pressed }) => [styles.card, pressed && styles.pressed]}
            >
              <View style={styles.left}>
                <Text style={styles.cardTitle}>{c.className}</Text>
                <Text style={styles.cardSubOk}>
                  {c.teacherCount ? `${c.teacherCount} Teacher(s)` : "No Teachers"}
                </Text>
              </View>

              <View style={styles.right}>
                <Ionicons name="eye-outline" size={22} color="#214294" />
              </View>
            </Pressable>
          ))}

          {classes.length === 0 && (
            <Text style={{ textAlign: "center", color: "#64748B", fontWeight: "700", marginTop: 20 }}>
              No classes available for this subject.
            </Text>
          )}
        </>
      )}

      {/* Optional modal if you want */}
      <Modal visible={modalOpen} transparent animationType="fade">
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Not Available</Text>
            <Text style={styles.modalText}>This is locked right now.</Text>

            <TouchableOpacity
              onPress={() => setModalOpen(false)}
              style={styles.modalBtn}
              activeOpacity={0.9}
            >
              <Text style={styles.modalBtnText}>OK</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#F8FAFC", padding: 16, paddingTop: 22 },

  pageTitle: { fontSize: 22, fontWeight: "900", color: "#214294", textAlign: "center" },
  pageSub: {
    marginTop: 6,
    marginBottom: 16,
    fontSize: 12,
    fontWeight: "800",
    color: "#64748B",
    textAlign: "center",
  },

  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    paddingVertical: 14,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    elevation: 4,
  },
  pressed: { transform: [{ scale: 0.99 }] },

  left: { flex: 1 },

  cardTitle: { fontSize: 15, fontWeight: "900", color: "#0F172A" },

  cardSubOk: { marginTop: 4, fontSize: 11, fontWeight: "800", color: "#10B981" },

  right: { width: 40, alignItems: "flex-end" },

  modalBackdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.35)",
    justifyContent: "center",
    alignItems: "center",
    padding: 18,
  },
  modalCard: { width: "100%", maxWidth: 340, backgroundColor: "#FFFFFF", borderRadius: 18, padding: 16 },
  modalTitle: { fontSize: 16, fontWeight: "900", color: "#0F172A" },
  modalText: { marginTop: 6, fontSize: 12, fontWeight: "700", color: "#475569" },
  modalBtn: { marginTop: 14, backgroundColor: "#214294", paddingVertical: 10, borderRadius: 12, alignItems: "center" },
  modalBtnText: { color: "#FFFFFF", fontWeight: "900", fontSize: 12 },
});
