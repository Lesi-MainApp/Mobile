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

  const shouldCenterCards = Array.isArray(classes) && classes.length > 0 && classes.length <= 3;

  return (
    <View style={styles.screen}>
      {isLoading ? (
        <View style={styles.stateWrap}>
          <View style={styles.loaderBox}>
            <ActivityIndicator size="small" color="#214294" />
          </View>
          <Text style={styles.infoText}>Loading classes...</Text>
        </View>
      ) : isError ? (
        <View style={styles.stateWrap}>
          <Text style={styles.errTitle}>Failed to load classes</Text>
          <Pressable onPress={refetch} style={styles.retryWrap}>
            <Text style={styles.tryAgain}>Try again</Text>
          </Pressable>
        </View>
      ) : (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[
            styles.scrollContent,
            shouldCenterCards && styles.scrollCentered,
          ]}
        >
          {classes.map((c, index) => {
            const req = myReqMap[String(c._id)];
            const status = req?.status || "";

            return (
              <ClassEnrollCard
                key={c._id}
                item={c}
                index={index}
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
            <View style={styles.emptyCard}>
              <Text style={styles.emptyTitle}>No classes available</Text>
              <Text style={styles.centerInfo}>
                No classes available for this subject.
              </Text>
            </View>
          )}
        </ScrollView>
      )}

      <Modal visible={modalOpen} transparent animationType="fade">
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <View style={styles.modalBadge}>
              <Text style={styles.modalBadgeText}>Enroll</Text>
            </View>

            <Text style={styles.modalTitle}>Enroll Request</Text>

            <Text style={styles.modalText}>
              Send a request to join this class.
            </Text>

            {!!selectedClass?.className && (
              <Text style={styles.modalClassText}>
                {selectedClass.className}
              </Text>
            )}

            <TextInput
              value={studentName}
              onChangeText={setStudentName}
              placeholder="Student Name"
              placeholderTextColor="#94A3B8"
              style={styles.input}
            />

            <TextInput
              value={studentPhone}
              onChangeText={setStudentPhone}
              placeholder="Phone Number"
              placeholderTextColor="#94A3B8"
              keyboardType="phone-pad"
              style={styles.input}
            />

            <View style={styles.modalRow}>
              <TouchableOpacity
                onPress={() => setModalOpen(false)}
                style={[styles.modalBtn, styles.cancelBtn]}
                activeOpacity={0.9}
                disabled={submitting}
              >
                <Text style={styles.cancelBtnText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={submitEnroll}
                style={[styles.modalBtn, styles.submitBtn]}
                activeOpacity={0.9}
                disabled={submitting}
              >
                <Text style={styles.submitBtnText}>
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
  screen: {
    flex: 1,
    backgroundColor: "#F8FAFC",
    padding: 16,
    paddingTop: 22,
  },

  stateWrap: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingBottom: 40,
  },

  loaderBox: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    alignItems: "center",
    justifyContent: "center",
  },

  retryWrap: {
    marginTop: 12,
    backgroundColor: "#EAF1FF",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
  },

  scrollContent: {
    paddingBottom: 24,
  },

  scrollCentered: {
    flexGrow: 1,
    justifyContent: "center",
  },

  infoText: {
    marginTop: 12,
    color: "#64748B",
    fontWeight: "700",
    fontSize: 13,
  },

  errTitle: {
    color: "#0F172A",
    fontWeight: "800",
    fontSize: 15,
  },

  tryAgain: {
    color: "#214294",
    fontWeight: "800",
    fontSize: 13,
  },

  emptyCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 22,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    paddingVertical: 28,
    paddingHorizontal: 18,
    alignItems: "center",
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 2,
  },

  emptyTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#0F172A",
  },

  centerInfo: {
    textAlign: "center",
    color: "#64748B",
    fontWeight: "500",
    marginTop: 8,
    fontSize: 13,
    lineHeight: 20,
  },

  modalBackdrop: {
    flex: 1,
    backgroundColor: "rgba(15,23,42,0.38)",
    justifyContent: "center",
    alignItems: "center",
    padding: 18,
  },

  modalCard: {
    width: "100%",
    maxWidth: 370,
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    paddingHorizontal: 18,
    paddingVertical: 20,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 18,
    elevation: 4,
  },

  modalBadge: {
    alignSelf: "center",
    backgroundColor: "#EAF1FF",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    marginBottom: 10,
  },

  modalBadgeText: {
    color: "#214294",
    fontSize: 12,
    fontWeight: "600",
  },

  modalTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#0F172A",
    textAlign: "center",
  },

  modalText: {
    marginTop: 8,
    fontSize: 14,
    fontWeight: "400",
    color: "#475569",
    textAlign: "center",
    lineHeight: 21,
  },

  modalClassText: {
    marginTop: 8,
    fontSize: 14,
    fontWeight: "500",
    color: "#214294",
    textAlign: "center",
    lineHeight: 20,
  },

  input: {
    marginTop: 12,
    borderWidth: 1,
    borderColor: "#CBD5E1",
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontWeight: "400",
    fontSize: 14,
    color: "#0F172A",
    backgroundColor: "#F8FAFC",
  },

  modalRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 10,
    marginTop: 16,
  },

  modalBtn: {
    minWidth: 110,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },

  cancelBtn: {
    backgroundColor: "#F1F5F9",
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },

  submitBtn: {
    backgroundColor: "#16A34A",
  },

  cancelBtnText: {
    color: "#334155",
    fontWeight: "500",
    fontSize: 14,
  },

  submitBtnText: {
    color: "#FFFFFF",
    fontWeight: "600",
    fontSize: 14,
  },

  syncText: {
    marginTop: 12,
    color: "#64748B",
    fontWeight: "400",
    fontSize: 12,
    textAlign: "center",
  },
});