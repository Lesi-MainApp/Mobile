import React, { useMemo, useState } from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { useNavigation } from "@react-navigation/native";

const numberFromGrade = (gradeLabel) => {
  if (!gradeLabel) return null;
  const match = String(gradeLabel).match(/\d+/);
  return match ? parseInt(match[0], 10) : null;
};

export default function TopicWisePaper() {
  const navigation = useNavigation();
  const { user } = useUser();
  const [selectedSubject, setSelectedSubject] = useState("");

  const gradeNum = useMemo(() => numberFromGrade(user?.grade), [user?.grade]);
  const isAL = user?.level === "al";

  const grade1to5Subjects = ["පරිසරය", "සිංහල", "Maths", "English"];
  const grade6to11Subjects = ["සිංහල", "Maths", "Science", "History", "ICT"];

  const streams12to13 = [
    { key: "Science Stream", subjects: ["Biology", "Physics", "Chemistry"] },
    { key: "Maths Stream", subjects: ["Combined Maths", "Physics", "Chemistry", "ICT"] },
    { key: "Tech", subjects: ["BST", "ET", "SFT", "ICT"] },
    { key: "Art", subjects: ["සිංහල", "History", "Political"] },
    { key: "Commerce", subjects: ["Econ", "ICT", "Account", "BS"] },
  ];

  const subjectsToShow = useMemo(() => {
    if (!user?.level || !user?.grade) return [];
    if (user.level === "primary") return grade1to5Subjects;
    if (user.level === "ol") return grade6to11Subjects;

    const stream = streams12to13.find((s) => s.key === user?.stream);
    return stream ? stream.subjects : [];
  }, [user?.level, user?.grade, user?.stream]);

  const canStart = !!gradeNum && !!selectedSubject && (!isAL || !!user?.stream);

  const onContinue = () => {
    if (!canStart) return;

    navigation.navigate("TopicWiseMenu", {
      grade: user?.grade,
      level: user?.level,
      stream: user?.stream || null,
      subject: selectedSubject,
      mode: "topicwise",
    });
  };

  if (!user?.grade || (isAL && !user?.stream)) {
    return (
      <View style={styles.center}>
        <Text style={styles.title}>Grade / Stream not selected</Text>
        <Text style={styles.helperText}>
          Please select your grade (and stream for A/L) first.
        </Text>
        <Pressable
          style={styles.primaryBtn}
          onPress={() => navigation.navigate("MainSelectgrade")}
        >
          <Text style={styles.primaryBtnText}>Go to Grade Selection</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <View style={styles.card}>
        <Text style={styles.title}>Topic Wise Papers</Text>
        <Text style={styles.subTitle}>Select Subject</Text>

        <Text style={styles.infoRow}>
          Grade: <Text style={styles.bold}>{user.grade}</Text>
        </Text>

        {isAL && (
          <Text style={styles.infoRow}>
            Stream: <Text style={styles.bold}>{user.stream}</Text>
          </Text>
        )}

        <Text style={styles.label}>Subject</Text>
        <View style={styles.pickerWrap}>
          <Picker
            selectedValue={selectedSubject}
            onValueChange={(v) => setSelectedSubject(v)}
            style={styles.picker}
            dropdownIconColor="#2563EB"
          >
            <Picker.Item label="Select Subject" value="" />
            {subjectsToShow.map((sub) => (
              <Picker.Item key={sub} label={sub} value={sub} />
            ))}
          </Picker>
        </View>

        <Pressable
          onPress={onContinue}
          disabled={!canStart}
          style={({ pressed }) => [
            styles.startBtn,
            !canStart && styles.startBtnDisabled,
            pressed && canStart && styles.pressed,
          ]}
        >
          <Text style={styles.startBtnText}>Continue</Text>
        </Pressable>

        {!canStart && (
          <Text style={styles.helperText}>Please select a subject.</Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#F8FAFC", alignItems: "center", justifyContent: "center", padding: 16 },
  card: { width: "100%", maxWidth: 420, backgroundColor: "#FFFFFF", borderRadius: 18, padding: 16, borderWidth: 1, borderColor: "#E2E8F0", shadowColor: "#000", shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.08, shadowRadius: 12, elevation: 3 },
  title: { fontSize: 20, fontWeight: "900", color: "#0F172A", textAlign: "center" },
  subTitle: { fontSize: 13, color: "#334155", textAlign: "center", marginTop: 6, marginBottom: 14 },
  infoRow: { fontSize: 12, fontWeight: "700", color: "#334155", textAlign: "center", marginTop: 4 },
  bold: { fontWeight: "900", color: "#0F172A" },
  label: { fontSize: 12, fontWeight: "800", color: "#0F172A", marginBottom: 6, marginTop: 14 },
  pickerWrap: { borderWidth: 1, borderColor: "#CBD5E1", borderRadius: 14, overflow: "hidden", backgroundColor: "#F1F5F9" },
  picker: { width: "100%", color: "#0F172A" },
  startBtn: { height: 52, borderRadius: 14, alignItems: "center", justifyContent: "center", backgroundColor: "#2563EB", marginTop: 16 },
  startBtnDisabled: { backgroundColor: "#94A3B8" },
  startBtnText: { color: "#FFFFFF", fontSize: 15, fontWeight: "900" },
  pressed: { transform: [{ scale: 0.99 }], opacity: 0.92 },
  helperText: { marginTop: 10, textAlign: "center", color: "#64748B", fontSize: 12, fontWeight: "600" },
  center: { flex: 1, backgroundColor: "#F8FAFC", alignItems: "center", justifyContent: "center", padding: 16 },
  primaryBtn: { marginTop: 14, backgroundColor: "#2563EB", paddingHorizontal: 14, paddingVertical: 10, borderRadius: 12 },
  primaryBtnText: { color: "#FFFFFF", fontWeight: "900", fontSize: 12 },
});
