import React, { useEffect, useMemo, useRef, useState } from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import PaperComponent from "../components/PaperComponent";

const BG = "#FFFFFF";
const TEXT_DARK = "#0F172A";

const FINISH_BLUE = "#2563EB";
const TIMER_BG = "#FFECEC";
const TIMER_TEXT = "#E11D48";

const NEXT_BG = "#0B1220";
const NEXT_TEXT = "#FFFFFF";

// ✅ Bottom bar background
const BOTTOM_BAR_BG = "#94A3B8";

function formatTime(seconds) {
  const safe = Math.max(0, Number(seconds || 0));
  const m = Math.floor(safe / 60);
  const s = safe % 60;
  const mm = String(m).padStart(2, "0");
  const ss = String(s).padStart(2, "0");
  return `${mm}:${ss}`;
}

export default function PaperPage({ navigation, route }) {
  const paperId = route?.params?.paperId || "paper1";
  const title = route?.params?.title || "Daily Quiz Paper";
  const timeMin = Number(route?.params?.timeMin || 10);
  const attemptNo = Number(route?.params?.attemptNo || 1);

  const intervalRef = useRef(null);
  const finishedRef = useRef(false); // ✅ prevent double finish

  // ✅ Your questions (replace with backend data later)
  const questions = useMemo(
    () => [
      {
        id: "q1",
        text: "Which part of the cell is known as the powerhouse?",
        options: ["Nucleus", "Ribosome", "Mitochondria", "Vacuole"],
        correctIndex: 2,
        explanationVideoUrl: "",
      },
      {
        id: "q2",
        text: "2 + 5 = ?",
        options: ["5", "6", "7", "8"],
        correctIndex: 2,
        explanationVideoUrl: "",
      },
    ],
    []
  );

  const total = questions.length;

  // answers: { [index]: optionIndex }
  const [answers, setAnswers] = useState({});
  const [qIndex, setQIndex] = useState(0);
  const [secondsLeft, setSecondsLeft] = useState(timeMin * 60);

  // ✅ timer
  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) return 0;
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  // ✅ Auto-finish when time is 0
  useEffect(() => {
    if (secondsLeft === 0) {
      onFinish(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [secondsLeft]);

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

  // ✅ Build review items for ReviewPage
  const buildReviewItems = () => {
    return questions.map((q, i) => {
      const userIndex = typeof answers[i] === "number" ? answers[i] : null;
      const correctIndex = q.correctIndex;

      const userAnswer =
        userIndex === null || userIndex === undefined
          ? ""
          : q.options?.[userIndex] ?? "";

      const correctAnswer = q.options?.[correctIndex] ?? "";

      return {
        _id: q.id || String(i),
        question: q.text || "",
        answers: q.options || [],
        correctAnswerIndex: correctIndex,
        userAnswerIndex: userIndex,
        userAnswer,
        correctAnswer,
        isCorrect: userIndex === correctIndex,
        explanationVideoUrl: q.explanationVideoUrl || "",
      };
    });
  };

  const onFinish = (autoFinish = false) => {
    if (finishedRef.current) return; // ✅ block double call
    finishedRef.current = true;

    if (intervalRef.current) clearInterval(intervalRef.current);

    const score = calculateScore();
    const scorePercent = total > 0 ? Math.round((score / total) * 100) : 0;

    // ✅ go to your new ReviewPage (same UI like screenshot)
    navigation.replace("ReviewPage", {
      paperId,
      title,
      attemptNo,
      total,
      score,
      scorePercent,
      autoFinish,
      items: buildReviewItems(),
    });

    // If you still want Result page sometimes, use:
    // navigation.navigate("Result", { paperId, title, attemptNo, total, score, autoFinish });
  };

  return (
    <View style={styles.screen}>
      <View style={styles.topBar}>
        <Pressable
          onPress={() => {
            if (intervalRef.current) clearInterval(intervalRef.current);
            navigation.goBack();
          }}
          hitSlop={10}
        >
          <Ionicons name="close" size={22} color={TEXT_DARK} />
        </Pressable>

        <View style={styles.timerPill}>
          <Text style={styles.timerText}>{formatTime(secondsLeft)}</Text>
        </View>

        <Pressable onPress={() => onFinish(false)} hitSlop={10}>
          <Text style={styles.finishText}>FINISH</Text>
        </Pressable>
      </View>

      <View style={styles.centerArea}>
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

      <View style={styles.bottomBar}>
        <Pressable onPress={goPrev} disabled={!canPrev}>
          <Text style={[styles.prevText, !canPrev && styles.disabledText]}>
            Previous
          </Text>
        </Pressable>

        <Pressable
          onPress={goNext}
          disabled={!canNext}
          style={[styles.nextBtn, !canNext && styles.nextDisabled]}
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
  screen: {
    flex: 1,
    backgroundColor: BG,
  },

  topBar: {
    paddingTop: 14,
    paddingBottom: 12,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  timerPill: {
    backgroundColor: TIMER_BG,
    borderRadius: 999,
    paddingHorizontal: 16,
    paddingVertical: 7,
  },

  timerText: {
    color: TIMER_TEXT,
    fontWeight: "800",
    fontSize: 12,
  },

  finishText: {
    color: FINISH_BLUE,
    fontWeight: "800",
    fontSize: 12,
  },

  centerArea: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 16,
  },

  centerBox: {
    width: "100%",
    maxWidth: 520,
    alignSelf: "center",
  },

  bottomBar: {
    backgroundColor: BOTTOM_BAR_BG,
    paddingHorizontal: 16,
    paddingVertical: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },

  prevText: {
    color: TEXT_DARK,
    fontWeight: "800",
    fontSize: 13,
  },

  disabledText: {
    color: "#E2E8F0",
    opacity: 0.7,
  },

  nextBtn: {
    backgroundColor: NEXT_BG,
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
    minWidth: 150,
  },

  nextText: {
    color: NEXT_TEXT,
    fontWeight: "900",
    fontSize: 13,
  },

  nextDisabled: {
    opacity: 0.6,
  },
});
