import React from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";

const CARD_BG = "#D6E0E8";
const TEXT_DARK = "#0F172A";

export default function PaperComponent({
  index,
  total,
  question,
  selectedOption,
  onSelect,
}) {
  return (
    <View style={styles.wrap}>
      <Text style={styles.qNo}>
        Question {index + 1} / {total}
      </Text>

      <Text style={styles.question}>{question.text}</Text>

      <View style={styles.optionsWrap}>
        {question.options.map((opt, i) => {
          const isSelected = selectedOption === i;

          return (
            <Pressable
              key={i}
              onPress={() => onSelect(i)}
              style={({ pressed }) => [
                styles.optionCard,
                isSelected && styles.optionSelected,
                pressed && styles.pressed,
              ]}
            >
              <Text
                style={[
                  styles.optionText,
                  isSelected && styles.optionTextSelected,
                ]}
              >
                {opt}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    width: "100%",
    alignItems: "center",
  },

  qNo: {
    fontSize: 14,
    fontWeight: "900",
    color: TEXT_DARK,
    textAlign: "center",
    marginBottom: 12,
  },

  question: {
    width: "100%",
    fontSize: 16,
    fontWeight: "900",
    color: TEXT_DARK,
    textAlign: "center",
    lineHeight: 22,
    marginBottom: 14,
  },

  optionsWrap: {
    width: "100%",
    gap: 12,
  },

  optionCard: {
    width: "100%",
    borderRadius: 16,
    backgroundColor: CARD_BG,
    paddingVertical: 14,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: "#B7C6D1",
  },

  optionSelected: {
    borderColor: "#1F5EEB",
    borderWidth: 2,
    backgroundColor: "#E8F0FF",
  },

  optionText: {
    fontSize: 14,
    fontWeight: "800",
    color: "#233046",
    textAlign: "left",
  },

  optionTextSelected: {
    color: "#1F5EEB",
    fontWeight: "900",
  },

  pressed: {
    opacity: 0.92,
    transform: [{ scale: 0.99 }],
  },
});
