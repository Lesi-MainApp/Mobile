import React from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";

const TEXT_DARK = "#0F172A";

// ✅ Light gray card like screenshot
const CARD_BG = "#F8FAFC";
const BORDER = "#E2E8F0";

const RADIO_BORDER = "#CBD5E1";
const RADIO_FILL = "#1D4ED8";

export default function PaperComponent({
  index,
  total,
  question,
  selectedOption,
  onSelect,
}) {
  const qNo = index + 1;

  return (
    <View style={styles.wrap}>
      <Text style={styles.smallTop}>{`QUESTION ${qNo} OF ${total}`}</Text>

      <Text style={styles.questionText}>{question?.text || ""}</Text>

      <View style={styles.optionsWrap}>
        {(question?.options || []).map((opt, i) => {
          const selected = selectedOption === i;

          return (
            <Pressable
              key={`${question?.id || "q"}_${i}`}
              onPress={() => onSelect?.(i)}
              style={({ pressed }) => [
                styles.optionCard,
                pressed && styles.pressed,
                selected && styles.optionSelected,
              ]}
            >
              <Text style={styles.optionText}>{opt}</Text>

              <View style={[styles.radioOuter, selected && styles.radioOuterOn]}>
                {selected ? <View style={styles.radioInner} /> : null}
              </View>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { paddingTop: 10 },

  smallTop: {
    color: "#8FA3BF",
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 2,
    marginBottom: 14,
  },

  questionText: {
    color: TEXT_DARK,
    fontSize: 28,
    lineHeight: 34,
    fontWeight: "800",
    marginBottom: 20,
  },

  optionsWrap: { gap: 14 },

  optionCard: {
    backgroundColor: CARD_BG,
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 24,
    paddingVertical: 18,
    paddingHorizontal: 18,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  optionSelected: {
    borderColor: "#C7D2FE",
  },

  optionText: {
    color: TEXT_DARK,
    fontSize: 15,
    fontWeight: "700",
  },

  radioOuter: {
    width: 22,
    height: 22,
    borderRadius: 999,
    borderWidth: 2,
    borderColor: RADIO_BORDER,
    alignItems: "center",
    justifyContent: "center",
  },
  radioOuterOn: { borderColor: RADIO_FILL },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 999,
    backgroundColor: RADIO_FILL,
  },

  pressed: { opacity: 0.92, transform: [{ scale: 0.995 }] },
});
