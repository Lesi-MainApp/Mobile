import React from "react";
import { View, Text, StyleSheet, Pressable, ScrollView } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";

const PRIMARY = "#1153ec";
const LIGHT_BLUE = "#EFF6FF";
const LIGHT_BLUE_BORDER = "#BFDBFE";
const LIGHT_BLUE_TEXT = "#1D4ED8";

const PAPERS = [
  { id: "paper1", title: "Past Paper - 1", mcqCount: 20, timeMin: 10 },
  { id: "paper2", title: "Past Paper - 2", mcqCount: 25, timeMin: 12 },
];

export default function PastpaperMenu({ route }) {
  const navigation = useNavigation();
  const { grade, level, stream, subject, mode = "past" } = route?.params || {};

  const onAttempt = (paper, attemptNo) => {
    navigation.navigate("DailyQuizPaper", {
      mode, // "past"
      grade,
      level,
      stream,
      subject,
      paperId: paper.id,
      title: paper.title,
      mcqCount: paper.mcqCount,
      timeMin: paper.timeMin,
      attemptNo,
    });
  };

  const onAttemptNow = (paper) => onAttempt(paper, 1);

  return (
    <View style={styles.screen}>
      <Text style={styles.pageTitle}>Past Papers</Text>
      <Text style={styles.pageSub}>
        {subject ? `${subject} • ${grade || ""}` : "Choose a paper and start"}
      </Text>

      <ScrollView contentContainerStyle={styles.list} showsVerticalScrollIndicator={false}>
        {PAPERS.map((p) => (
          <View key={p.id} style={styles.card}>
            <Text style={styles.cardTitle}>{p.title}</Text>

            <View style={styles.metaRowCenter}>
              <View style={styles.metaItem}>
                <Ionicons name="help-circle-outline" size={16} color="#64748B" />
                <Text style={styles.metaText}>{p.mcqCount} MCQs</Text>
              </View>

              <View style={styles.metaItem}>
                <Ionicons name="time-outline" size={16} color="#64748B" />
                <Text style={styles.metaText}>{p.timeMin} min</Text>
              </View>
            </View>

            <View style={styles.attemptRow}>
              {[1, 2, 3].map((a) => (
                <Pressable
                  key={a}
                  onPress={() => onAttempt(p, a)}
                  style={({ pressed }) => [styles.attemptPill, pressed && styles.pillPressed]}
                >
                  <Text style={styles.attemptText}>Attempt {a}</Text>
                </Pressable>
              ))}
            </View>

            <Pressable
              onPress={() => onAttemptNow(p)}
              style={({ pressed }) => [styles.btn, pressed && styles.btnPressed]}
            >
              <Text style={styles.btnText}>Attempt Now</Text>
              <Ionicons name="arrow-forward" size={18} color="#FFFFFF" />
            </Pressable>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#F8FAFC", padding: 16, paddingTop: 18 },
  pageTitle: { fontSize: 22, fontWeight: "900", color: PRIMARY, textAlign: "center" },
  pageSub: { marginTop: 6, marginBottom: 14, fontSize: 12, fontWeight: "700", color: "#64748B", textAlign: "center" },
  list: { paddingBottom: 24, gap: 12 },
  card: { backgroundColor: "#FFFFFF", borderRadius: 18, padding: 14, borderWidth: 1, borderColor: "#E5E7EB", elevation: 3 },
  cardTitle: { fontSize: 15, fontWeight: "900", color: "#0F172A", textAlign: "center" },

  metaRowCenter: { marginTop: 10, flexDirection: "row", justifyContent: "center", flexWrap: "wrap", gap: 10 },
  metaItem: { flexDirection: "row", alignItems: "center", gap: 6, backgroundColor: "#F8FAFC", borderWidth: 1, borderColor: "#E2E8F0", paddingHorizontal: 10, paddingVertical: 6, borderRadius: 999 },
  metaText: { fontSize: 11, fontWeight: "800", color: "#475569" },

  attemptRow: { marginTop: 12, flexDirection: "row", justifyContent: "center", gap: 10, flexWrap: "wrap" },
  attemptPill: { backgroundColor: LIGHT_BLUE, borderWidth: 1, borderColor: LIGHT_BLUE_BORDER, paddingHorizontal: 14, paddingVertical: 10, borderRadius: 999 },
  pillPressed: { opacity: 0.9, transform: [{ scale: 0.99 }] },
  attemptText: { color: LIGHT_BLUE_TEXT, fontSize: 12, fontWeight: "900" },

  btn: { marginTop: 12, height: 44, borderRadius: 14, backgroundColor: PRIMARY, alignItems: "center", justifyContent: "center", flexDirection: "row", gap: 8 },
  btnPressed: { opacity: 0.9, transform: [{ scale: 0.99 }] },
  btnText: { color: "#FFFFFF", fontSize: 12, fontWeight: "900" },
});
