import React, { useEffect, useMemo, useState } from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import PaperComponent from "../components/PaperComponent";

const BG = "#F8FAFC";
const PREV_TEXT = "#595757";
const NEXT_BG = "#1F5EEB";
const CARD_BG = "#D6E0E8";

// ✅ adjust this if your bottom bar is taller/shorter
const BOTTOM_BAR_SPACE = 92;

function formatTime(seconds) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  const mm = String(m).padStart(2, "0");
  const ss = String(s).padStart(2, "0");
  return `${mm}:${ss}`;
}

export default function PaperPage({ navigation, route }) {
  const paperId = route?.params?.paperId || "paper1";
  const title = route?.params?.title || "Daily Quiz Paper";
  const timeMin = route?.params?.timeMin || 10;
  const attemptNo = route?.params?.attemptNo || 1;

  const questions = useMemo(
    () => [
      {
        id: "q1",
        text: "What is the capital city of Sri Lanka?",
        options: ["Colombo", "Kandy", "Galle", "Jaffna"],
        correctIndex: 0,
      },
      {
        id: "q2",
        text: "2 + 5 = ?",
        options: ["5", "6", "7", "8"],
        correctIndex: 2,
      },
      {
        id: "q3",
        text: "Which one is a programming language?",
        options: ["HTML", "CSS", "JavaScript", "Figma"],
        correctIndex: 2,
      },
    ],
    []
  );

  const total = questions.length;
  const [answers, setAnswers] = useState({});
  const [qIndex, setQIndex] = useState(0);
  const [secondsLeft, setSecondsLeft] = useState(timeMin * 60);

  useEffect(() => {
    const t = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(t);
          onFinish(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const current = questions[qIndex];
  const selectedOption = answers[qIndex];

  const onSelect = (optIndex) => {
    setAnswers((prev) => ({ ...prev, [qIndex]: optIndex }));
  };

  const canNext = qIndex < total - 1;
  const canPrev = qIndex > 0;

  const goNext = () => canNext && setQIndex((p) => p + 1);
  const goPrev = () => canPrev && setQIndex((p) => p - 1);

  const calculateScore = () => {
    let score = 0;
    for (let i = 0; i < total; i++) {
      if (answers[i] === questions[i].correctIndex) score += 1;
    }
    return score;
  };

  const onFinish = (auto = false) => {
    const score = calculateScore();
    navigation.navigate("Result", {
      paperId,
      title,
      attemptNo,
      total,
      score,
      autoFinish: auto,
    });
  };

  return (
    <View style={styles.screen}>
      {/* ✅ TOP ROW (NO OVERLAY) */}
      <View style={styles.topRow}>
        <View style={styles.timerPill}>
          <Text style={styles.timerText}>{formatTime(secondsLeft)}</Text>
        </View>

        <Pressable
          onPress={() => onFinish(false)}
          style={({ pressed }) => [styles.finishBtn, pressed && styles.pressed]}
        >
          <Text style={styles.finishText}>Finish</Text>
        </Pressable>
      </View>

      {/* ✅ MIDDLE (CENTER) */}
      <View style={styles.mid}>
        <View style={styles.centerBox}>
          <PaperComponent
            index={qIndex}
            total={total}
            question={current}
            selectedOption={selectedOption}
            onSelect={onSelect}
          />
        </View>
      </View>

      {/* ✅ BOTTOM ROW (WITH SPACE FROM BOTTOM BAR) */}
      <View style={styles.bottomRow}>
        <Pressable
          onPress={goPrev}
          disabled={!canPrev}
          style={({ pressed }) => [
            styles.prevBtn,
            pressed && canPrev && styles.pressed,
            !canPrev && styles.disabled,
          ]}
        >
          <Text style={[styles.prevText, !canPrev && styles.disabledText]}>
            Previous
          </Text>
        </Pressable>

        <Pressable
          onPress={goNext}
          disabled={!canNext}
          style={({ pressed }) => [
            styles.nextBtn,
            pressed && canNext && styles.pressed,
            !canNext && styles.nextDisabled,
          ]}
        >
          <Text style={styles.nextText}>
            {canNext ? "Next Question" : "Last Question"}
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  // ✅ IMPORTANT: paddingBottom gives space for BottomNavigationBar so buttons won't hide/overlay
  screen: {
    flex: 1,
    backgroundColor: BG,
    paddingBottom: BOTTOM_BAR_SPACE,
  },

  topRow: {
  paddingHorizontal: 16,
  paddingTop: 14,
  paddingBottom: 12,
  marginTop: 50,        // ✅ ADD THIS (moves timer/finish down)
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "space-between",
  zIndex: 2,
},


  timerPill: {
    backgroundColor: CARD_BG,
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: "#B7C6D1",
  },
  timerText: { fontSize: 13, fontWeight: "900", color: "#0F172A" },

  finishBtn: {
    backgroundColor: "#FFFFFF",
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: "#CBD5E1",
  },
  finishText: { fontSize: 13, fontWeight: "900", color: "#0F172A" },

  // ✅ middle uses remaining space only (no overlay)
  mid: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 10,
  },

  centerBox: {
    width: "100%",
    maxWidth: 520,
    alignSelf: "center",
  },

  bottomRow: {
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: -10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    // ✅ add space from bottom bar
    marginBottom: -40,
  },

  prevBtn: {
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 12,
  },
  prevText: { color: PREV_TEXT, fontSize: 14, fontWeight: "900" },

  nextBtn: {
    backgroundColor: NEXT_BG,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  nextText: { color: "#FFFFFF", fontSize: 13, fontWeight: "900" },

  nextDisabled: { opacity: 0.7 },
  disabled: { opacity: 0.5 },
  disabledText: { color: "#9A9A9A" },

  pressed: { opacity: 0.92, transform: [{ scale: 0.99 }] },
});
