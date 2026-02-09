import React from "react";
import { View, Text, StyleSheet, Image, ScrollView } from "react-native";
import coins from "../assets/coins.png";

export default function Result() {
  const paper = {
    title: "Past Paper - 1",
    attempts: [
      {
        attempt: "1st Attempt",
        grade: 5,
        total: 20,
        correct: 10,
        percent: 50,
        subject: "Maths",
        coins: 10,
      },
    ],
  };

  return (
    <View style={styles.screen}>
      <Text style={styles.pageTitle}>Recently completed papers</Text>

      <ScrollView contentContainerStyle={styles.list}>
        <View style={styles.paperCard}>
          <Text style={styles.paperTitle}>{paper.title}</Text>

          {paper.attempts.map((r, idx) => (
            <View
              key={`${r.attempt}-${idx}`}
              style={[
                styles.attemptBlock,
                idx !== paper.attempts.length - 1 && styles.blockDivider,
              ]}
            >
              <Text style={styles.attemptTitle}>{r.attempt}</Text>

              <View style={styles.twoCols}>
                {/* Left */}
                <View style={styles.leftCol}>
                  <View style={styles.row}>
                    <Text style={styles.label}>Grade : </Text>
                    <Text style={styles.value}> {r.grade}</Text>
                  </View>

                  <View style={styles.row}>
                    <Text style={styles.label}>Total : </Text>
                    <Text style={styles.value}> {r.total}</Text>
                  </View>

                  <View style={styles.row}>
                    <Text style={styles.label}>Correct : </Text>
                    <Text style={styles.value}> {r.correct}</Text>
                  </View>

                  <View style={styles.row}>
                    <Text style={styles.label}>Percentage : </Text>
                    <Text style={styles.value}> {r.percent}%</Text>
                  </View>
                </View>

                {/* Right */}
                <View style={styles.rightCol}>
                  <Text style={styles.subjectText}>{r.subject}</Text>

                  <View style={styles.coinWrap}>
                    <Image source={coins} style={styles.coinImg} />
                    <Text style={styles.coinCount}>{r.coins}</Text>
                  </View>
                </View>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#F8FAFC" },

  pageTitle: {
    textAlign: "center",
    fontSize: 16,
    fontWeight: "700",
    color: "#0F172A",
    paddingTop: 16,
    paddingBottom: 8,
  },

  list: {
    alignItems: "center",
    paddingBottom: 16,
  },

  paperCard: {
    width: "92%",
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 10,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.07,
    shadowRadius: 8,
    elevation: 3,
  },

  paperTitle: {
    textAlign: "center",
    fontSize: 15,
    fontWeight: "700",
    color: "#0F172A",
    marginBottom: 6,
  },

  attemptBlock: {
    paddingTop: 4,
    paddingBottom: 6,
  },

  blockDivider: {
    borderBottomWidth: 1,
    borderBottomColor: "#E2E8F0",
  },

  attemptTitle: {
    fontSize: 12,
    fontWeight: "600",
    color: "#475569",
    marginBottom: 4,
  },

  twoCols: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  leftCol: {
    width: "62%",
  },

  rightCol: {
    width: "35%",
    alignItems: "center",
    justifyContent: "center",
  },

  // ✅ FIXED: no horizontal gap
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 2,
  },

  label: {
    fontSize: 12,
    fontWeight: "600",
    color: "#64748B",
  },

  value: {
    fontSize: 12,
    fontWeight: "700",
    color: "#0F172A",
  },

  subjectText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#0F172A",
    marginBottom: 4,
  },

  coinWrap: {
    alignItems: "center",
    justifyContent: "center",
  },

  coinImg: {
    width: 40,
    height: 40,
    resizeMode: "contain",
    marginBottom: 2,
  },

  coinCount: {
    fontSize: 14,
    fontWeight: "700",
    color: "#0F172A",
  },
});
