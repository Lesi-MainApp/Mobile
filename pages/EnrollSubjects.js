// pages/EnrollSubjects.js
import React, { useMemo, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Modal,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import { useNavigation } from "@react-navigation/native";

import { useGetClassesByGradeAndSubjectQuery } from "../app/classApi";
import {
  useGetMyEnrollRequestsQuery,
  useRequestEnrollMutation,
} from "../app/enrollApi";
import ClassEnrollCard from "../components/ClassEnrollCard";

const numberFromGrade = (gradeLabel) => {
  if (!gradeLabel) return null;
  const match = String(gradeLabel).match(/\d+/);
  return match ? parseInt(match[0], 10) : null;
};

export default function EnrollSubjects({ route }) {
  const navigation = useNavigation();

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedClass, setSelectedClass] = useState(null);
  const [studentName, setStudentName] = useState("");
  const [studentPhone, setStudentPhone] = useState("");

  const gradeLabel = route?.params?.grade || "Grade 4";
  const gradeNumberParam = route?.params?.gradeNumber;
  const subjectName = route?.params?.subjectName || "";

  const gradeNo = useMemo(
    () => Number(gradeNumberParam) || numberFromGrade(gradeLabel),
    [gradeNumberParam, gradeLabel]
  );

  const {
    data: classes = [],
    isLoading,
    isError,
    refetch,
  } = useGetClassesByGradeAndSubjectQuery(
    { gradeNumber: gradeNo, subjectName },
    { skip: !gradeNo || !subjectName }
  );

  const {
    data: myReqData,
    isLoading: myReqLoading,
    refetch: refetchMyReq,
  } = useGetMyEnrollRequestsQuery();

  const myReqMap = useMemo(() => {
    const map = {};
    const list = myReqData?.requests || [];
    for (const r of list) {
      const classId = String(r?.classId || r?.classDetails?.classId || "");
      if (classId) map[classId] = r;
    }
    return map;
  }, [myReqData]);

  const [requestEnroll, { isLoading: submitting }] = useRequestEnrollMutation();

  const openModal = (cls) => {
    setSelectedClass(cls);
    setStudentName("");
    setStudentPhone("");
    setModalOpen(true);
  };

  const submitEnroll = async () => {
    try {
      if (!selectedClass?._id) return;
      if (!studentName.trim()) return alert("Enter student name");
      if (!studentPhone.trim()) return alert("Enter phone number");

      await requestEnroll({
        classId: selectedClass._id,
        studentName: studentName.trim(),
        studentPhone: studentPhone.trim(),
      }).unwrap();

      setModalOpen(false);
      setSelectedClass(null);
      refetchMyReq?.();
      alert("Request sent!");
    } catch (e) {
      alert(String(e?.data?.message || e?.error || "Request failed"));
    }
  };

  const goLessons = (cls) => {
    navigation.navigate("Lessons", {
      classId: cls._id,
      className: cls.className,
      grade: gradeLabel,
      subject: subjectName,
    });
  };

  return (
    <View style={styles.screen}>
      {isLoading ? (
        <View style={{ paddingTop: 30, alignItems: "center" }}>
          <ActivityIndicator />
          <Text style={styles.infoText}>Loading classes...</Text>
        </View>
      ) : isError ? (
        <View style={{ paddingTop: 30, alignItems: "center" }}>
          <Text style={styles.errTitle}>Failed to load classes</Text>
          <Pressable onPress={refetch} style={{ marginTop: 10 }}>
            <Text style={styles.tryAgain}>Try again</Text>
          </Pressable>
        </View>
      ) : (
        <ScrollView contentContainerStyle={{ paddingBottom: 120 }}>
          {classes.map((c) => {
            const req = myReqMap[String(c._id)];
            const status = req?.status || ""; // pending | approved | rejected | ""

            return (
              <ClassEnrollCard
                key={c._id}
                item={c}
                status={
                  status === "approved"
                    ? "approved"
                    : status === "pending"
                    ? "pending"
                    : ""
                }
                onPressView={() => goLessons(c)}
                onPressEnroll={() => openModal(c)}
              />
            );
          })}

          {classes.length === 0 && (
            <Text style={styles.centerInfo}>
              No classes available for this subject.
            </Text>
          )}
        </ScrollView>
      )}

      {/* ✅ ENROLL MODAL */}
      <Modal visible={modalOpen} transparent animationType="fade">
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Enroll Request</Text>
            <Text style={styles.modalText}>
              {selectedClass?.className ? `Class: ${selectedClass.className}` : ""}
            </Text>

            <TextInput
              value={studentName}
              onChangeText={setStudentName}
              placeholder="Student Name"
              style={styles.input}
            />
            <TextInput
              value={studentPhone}
              onChangeText={setStudentPhone}
              placeholder="Phone Number"
              keyboardType="phone-pad"
              style={styles.input}
            />

            <View style={styles.modalRow}>
              <TouchableOpacity
                onPress={() => setModalOpen(false)}
                style={[styles.modalBtn, { backgroundColor: "#E2E8F0" }]}
                activeOpacity={0.9}
                disabled={submitting}
              >
                <Text style={[styles.modalBtnText, { color: "#0F172A" }]}>
                  Cancel
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={submitEnroll}
                style={[styles.modalBtn, { backgroundColor: "#16A34A" }]}
                activeOpacity={0.9}
                disabled={submitting}
              >
                <Text style={styles.modalBtnText}>
                  {submitting ? "Submitting..." : "Submit"}
                </Text>
              </TouchableOpacity>
            </View>

            {myReqLoading && (
              <Text style={styles.syncText}>Syncing status...</Text>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#F8FAFC", padding: 16, paddingTop: 22 },

  infoText: { marginTop: 10, color: "#64748B", fontWeight: "700" },
  errTitle: { color: "#0F172A", fontWeight: "900" },
  tryAgain: { color: "#214294", fontWeight: "900" },

  centerInfo: {
    textAlign: "center",
    color: "#64748B",
    fontWeight: "700",
    marginTop: 20,
  },

  modalBackdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.35)",
    justifyContent: "center",
    alignItems: "center",
    padding: 18,
  },
  modalCard: {
    width: "100%",
    maxWidth: 360,
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 16,
  },
  modalTitle: { fontSize: 16, fontWeight: "900", color: "#0F172A" },
  modalText: { marginTop: 6, fontSize: 12, fontWeight: "700", color: "#475569" },

  input: {
    marginTop: 10,
    borderWidth: 1,
    borderColor: "#CBD5E1",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontWeight: "800",
    color: "#0F172A",
    backgroundColor: "#F8FAFC",
  },

  modalRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 10,
    marginTop: 12,
  },

  modalBtn: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  modalBtnText: { color: "#FFFFFF", fontWeight: "900", fontSize: 12 },

  syncText: {
    marginTop: 10,
    color: "#64748B",
    fontWeight: "800",
    fontSize: 12,
  },
});