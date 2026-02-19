// components/ReviewQuestionCard.js
import React from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const TEXT_DARK = "#0F172A";
const MUTED = "#64748B";
const BORDER = "#E2E8F0";

const RED = "#E11D48";
const GREEN = "#16A34A";
const BLUE = "#2563EB";
const DARK = "#0B1220";

export default function ReviewQuestionCard({
  item,
  revealed,
  onToggleReveal,
  onExplainVideo,
  onExplainLogic,
}) {
  const isCorrect = !!item?.isCorrect;

  // ✅ support multi correct
  const correctAnswers =
    Array.isArray(item?.correctAnswers) && item.correctAnswers.length
      ? item.correctAnswers
      : item?.correctAnswer
      ? [item.correctAnswer]
      : [];

  const userAnswer = item?.selectedAnswer || "";

  return (
    <View style={styles.card}>
      <View style={styles.headRow}>
        <Text style={styles.qNo}>Q{item?.questionNumber}</Text>

        <View style={[styles.badge, isCorrect ? styles.badgeGreen : styles.badgeRed]}>
          <Ionicons
            name={isCorrect ? "checkmark-circle" : "close-circle"}
            size={14}
            color="#fff"
          />
          <Text style={styles.badgeText}>{isCorrect ? "Correct" : "Wrong"}</Text>
        </View>
      </View>

      <Text style={styles.qText}>{item?.question}</Text>

      <Pressable onPress={onToggleReveal} style={styles.revealBtn}>
        <Text style={styles.revealText}>{revealed ? "Hide Answer" : "Show Answer"}</Text>
        <Ionicons name={revealed ? "chevron-up" : "chevron-down"} size={18} color={DARK} />
      </Pressable>

      {revealed && (
        <View style={styles.revealBox}>
          <Text style={styles.line}>
            Your Answer:{" "}
            <Text style={[styles.bold, !isCorrect && { color: RED }]}>
              {userAnswer || "-"}
            </Text>
          </Text>

          {/* ✅ multi correct answers display */}
          {correctAnswers.length <= 1 ? (
            <Text style={styles.line}>
              Correct Answer:{" "}
              <Text style={[styles.bold, { color: GREEN }]}>
                {correctAnswers[0] || "-"}
              </Text>
            </Text>
          ) : (
            <Text style={styles.line}>
              Correct Answers:{" "}
              <Text style={[styles.bold, { color: GREEN }]}>
                {correctAnswers.join(", ")}
              </Text>
            </Text>
          )}

          <View style={styles.actions}>
            <Pressable onPress={onExplainLogic} style={styles.btnDark}>
              <Text style={styles.btnDarkText}>Explain Logic</Text>
            </Pressable>

            <Pressable onPress={onExplainVideo} style={styles.btnBlue}>
              <Text style={styles.btnBlueText}>Explain Video</Text>
            </Pressable>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    borderWidth: 1,
    borderColor: BORDER,
    padding: 14,
    marginBottom: 12,
  },
  headRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  qNo: { fontSize: 12, fontWeight: "900", color: MUTED },

  badge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
  },
  badgeGreen: { backgroundColor: GREEN },
  badgeRed: { backgroundColor: RED },
  badgeText: { color: "#fff", fontWeight: "900", fontSize: 11 },

  qText: { marginTop: 10, fontSize: 14, fontWeight: "900", color: TEXT_DARK, lineHeight: 20 },

  revealBtn: {
    marginTop: 12,
    backgroundColor: "#F1F5F9",
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 14,
    paddingVertical: 10,
    paddingHorizontal: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  revealText: { fontWeight: "900", color: DARK, fontSize: 12 },

  revealBox: {
    marginTop: 12,
    backgroundColor: "#F8FAFC",
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: BORDER,
  },
  line: { fontSize: 12, fontWeight: "700", color: TEXT_DARK, marginTop: 6 },
  bold: { fontWeight: "900" },

  actions: { marginTop: 12, flexDirection: "row", gap: 10, justifyContent: "space-between" },
  btnDark: { flex: 1, backgroundColor: DARK, paddingVertical: 10, borderRadius: 14, alignItems: "center" },
  btnDarkText: { color: "#fff", fontWeight: "900", fontSize: 12 },

  btnBlue: { flex: 1, backgroundColor: BLUE, paddingVertical: 10, borderRadius: 14, alignItems: "center" },
  btnBlueText: { color: "#fff", fontWeight: "900", fontSize: 12 },
});
