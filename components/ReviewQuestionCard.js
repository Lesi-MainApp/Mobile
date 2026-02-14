import React from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const TEXT = "#0F172A";
const MUTED = "#94A3B8";
const BLUE = "#2563EB";

const RED = "#EF4444";
const RED_SOFT = "#FFECEC";

const GREEN = "#22C55E";
const GREEN_SOFT = "#EFFFF3";

export default function ReviewQuestionCard({
  item,
  revealed,
  onToggleReveal,
  onExplainVideo,
  onExplainLogic,
}) {
  const isCorrect = !!item?.isCorrect;

  const borderColor = isCorrect ? GREEN : RED;
  const bgSoft = isCorrect ? GREEN_SOFT : RED_SOFT;

  const tagText = isCorrect ? "GOOD JOB" : "NEEDS IMPROVEMENT";

  const question = item?.question || "";
  const correctAnswer = item?.correctAnswer || "";
  const userAnswer = item?.userAnswer || "";

  const showAnswerBox = isCorrect || revealed;

  return (
    <View style={[styles.card, { borderColor, backgroundColor: bgSoft }]}>
      {/* Tag */}
      <View style={[styles.tag, { borderColor }]}>
        <Text style={[styles.tagText, { color: borderColor }]}>{tagText}</Text>
      </View>

      {/* Question */}
      <Text style={styles.qText}>{question}</Text>

      {/* ✅ If not revealed & wrong -> show only blue button */}
      {!showAnswerBox ? (
        <Pressable onPress={onToggleReveal} style={styles.revealBtnFull}>
          <Text style={styles.revealBtnText}>CLICK TO REVEAL ANSWERS</Text>
        </Pressable>
      ) : (
        <View style={styles.answerBox}>
          <Text style={styles.answerLabel}>CORRECT ANSWER</Text>
          <Text style={styles.answerValue}>{correctAnswer}</Text>

          {!!userAnswer ? (
            <Text style={styles.userPicked}>You picked: {userAnswer}</Text>
          ) : (
            <Text style={styles.userPicked}>You picked: (not answered)</Text>
          )}

          {/* optional hide button only for wrong answers */}
          {!isCorrect ? (
            <Pressable onPress={onToggleReveal} style={styles.hideBtn}>
              <Text style={styles.hideBtnText}>HIDE ANSWER</Text>
            </Pressable>
          ) : null}
        </View>
      )}

      {/* Buttons row */}
      <View style={styles.actions}>
        <Pressable onPress={onExplainLogic} style={styles.btnOutline}>
          <Ionicons name="bulb-outline" size={14} color={BLUE} />
          <Text style={styles.btnOutlineText}>EXPLAIN LOGIC</Text>
        </Pressable>

        <Pressable onPress={onExplainVideo} style={styles.btnSolid}>
          <Ionicons name="play" size={14} color="#fff" />
          <Text style={styles.btnSolidText}>EXPLAIN VIDEO</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderWidth: 3,
    borderRadius: 18,
    padding: 14,
    marginBottom: 14,
  },

  tag: {
    alignSelf: "flex-start",
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 999,
    borderWidth: 1.5,
    backgroundColor: "#fff",
    marginBottom: 10,
  },
  tagText: { fontWeight: "900", fontSize: 11 },

  qText: { color: TEXT, fontSize: 14, fontWeight: "900", marginBottom: 10 },

  // ✅ Full width reveal button (no box wrapper)
  revealBtnFull: {
    backgroundColor: BLUE,
    paddingVertical: 12,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  revealBtnText: { color: "#fff", fontWeight: "900", fontSize: 12 },

  answerBox: {
    backgroundColor: "#fff",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    padding: 12,
  },
  answerLabel: {
    color: MUTED,
    fontWeight: "900",
    fontSize: 10,
    letterSpacing: 0.8,
  },
  answerValue: { color: TEXT, fontWeight: "900", fontSize: 13, marginTop: 6 },
  userPicked: { marginTop: 8, color: MUTED, fontWeight: "800", fontSize: 11 },

  hideBtn: {
    marginTop: 10,
    borderWidth: 1.5,
    borderColor: "#CBD5E1",
    backgroundColor: "#F8FAFC",
    paddingVertical: 9,
    borderRadius: 999,
    alignItems: "center",
  },
  hideBtnText: { color: TEXT, fontWeight: "900", fontSize: 12 },

  actions: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 10,
    marginTop: 10,
  },
  btnOutline: {
    flex: 1,
    borderWidth: 1.5,
    borderColor: "#BFDBFE",
    backgroundColor: "#EFF6FF",
    borderRadius: 999,
    paddingVertical: 10,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 6,
  },
  btnOutlineText: { color: BLUE, fontWeight: "900", fontSize: 12 },

  btnSolid: {
    flex: 1,
    backgroundColor: BLUE,
    borderRadius: 999,
    paddingVertical: 10,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 6,
  },
  btnSolidText: { color: "#fff", fontWeight: "900", fontSize: 12 },
});
