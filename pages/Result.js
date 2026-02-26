// pages/Result.js
import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import coins from "../assets/coins.png";
import { useGetMyCompletedPapersQuery } from "../app/attemptApi";

export default function Result() {
  const { data, isLoading, isError } = useGetMyCompletedPapersQuery();
  const items = Array.isArray(data?.items) ? data.items : [];

  return (
    <View style={styles.screen}>
      <Text style={styles.pageTitle}>Result</Text>

      <ScrollView
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
      >
        {isLoading ? (
          <View style={styles.stateWrap}>
            <ActivityIndicator size="large" color="#214294" />
            <Text style={styles.infoText}>Loading results...</Text>
          </View>
        ) : isError ? (
          <View style={styles.stateCard}>
            <Text style={styles.errorText}>Failed to load results</Text>
          </View>
        ) : items.length === 0 ? (
          <View style={styles.stateCard}>
            <Text style={styles.emptyText}>No completed papers yet</Text>
          </View>
        ) : (
          items.map((paper) => {
            const r = {
              total: Number(paper.totalQuestions || 0),
              correct: Number(paper.correct || 0),
              percent: Number(paper.percentage || 0),
              subject: String(paper.subject || ""),
              coins: Number(paper.coins || 0),
            };

            return (
              <View key={paper.paperId} style={styles.paperCard}>
                {/* Header */}
                <View style={styles.headerRow}>
                  <View style={styles.headerLeft}>
                    <Text style={styles.paperTitle} numberOfLines={2}>
                      {paper.paperTitle}
                    </Text>
                    <Text style={styles.subjectText} numberOfLines={1}>
                      {r.subject || "Subject"}
                    </Text>
                  </View>

                  <View style={styles.coinBadge}>
                    <Image source={coins} style={styles.coinImg} />
                    <Text style={styles.coinCount}>{r.coins}</Text>
                  </View>
                </View>

                {/* Stats */}
                <View style={styles.statsBox}>
                  <View style={styles.statItem}>
                    <Text style={styles.statLabel}>Total</Text>
                    <Text style={styles.statValue}>{r.total}</Text>
                  </View>

                  <View style={styles.statDivider} />

                  <View style={styles.statItem}>
                    <Text style={styles.statLabel}>Correct</Text>
                    <Text style={styles.statValue}>{r.correct}</Text>
                  </View>

                  <View style={styles.statDivider} />

                  <View style={styles.statItem}>
                    <Text style={styles.statLabel}>Percentage</Text>
                    <Text style={styles.statValue}>{r.percent}%</Text>
                  </View>
                </View>

                {/* Bottom highlight */}
                <View style={styles.resultFooter}>
                  <Text style={styles.resultFooterText}>Best Completed Result</Text>
                </View>
              </View>
            );
          })
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#F8FAFC",
    paddingHorizontal: 16,
    paddingTop: 22,
  },

  pageTitle: {
    fontSize: 18,
    fontWeight: "900",
    color: "#214294",
    textAlign: "center",
    marginBottom: 14,
  },

  list: {
    paddingBottom: 120,
  },

  stateWrap: {
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 30,
  },

  infoText: {
    marginTop: 12,
    fontSize: 13,
    fontWeight: "700",
    color: "#64748B",
    textAlign: "center",
  },

  stateCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    padding: 18,
    alignItems: "center",
    justifyContent: "center",
  },

  errorText: {
    color: "#E11D48",
    fontWeight: "800",
    textAlign: "center",
    fontSize: 14,
  },

  emptyText: {
    color: "#64748B",
    fontWeight: "700",
    textAlign: "center",
    fontSize: 14,
  },

  paperCard: {
    width: "100%",
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 3,
  },

  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: 12,
  },

  headerLeft: {
    flex: 1,
    paddingRight: 6,
  },

  paperTitle: {
    fontSize: 16,
    fontWeight: "900",
    color: "#0F172A",
    lineHeight: 22,
  },

  subjectText: {
    marginTop: 5,
    fontSize: 12,
    fontWeight: "700",
    color: "#64748B",
  },

  coinBadge: {
    minWidth: 78,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFF7ED",
    borderWidth: 1,
    borderColor: "#FED7AA",
    borderRadius: 14,
    paddingVertical: 8,
    paddingHorizontal: 10,
  },

  coinImg: {
    width: 30,
    height: 30,
    resizeMode: "contain",
    marginBottom: 3,
  },

  coinCount: {
    fontSize: 13,
    fontWeight: "900",
    color: "#9A3412",
  },

  statsBox: {
    marginTop: 16,
    flexDirection: "row",
    alignItems: "stretch",
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 14,
    overflow: "hidden",
  },

  statItem: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: 8,
  },

  statDivider: {
    width: 1,
    backgroundColor: "#E2E8F0",
  },

  statLabel: {
    fontSize: 11,
    fontWeight: "700",
    color: "#64748B",
    marginBottom: 4,
  },

  statValue: {
    fontSize: 15,
    fontWeight: "900",
    color: "#0F172A",
  },

  resultFooter: {
    marginTop: 14,
    alignSelf: "center",
    backgroundColor: "#EFF6FF",
    borderWidth: 1,
    borderColor: "#BFDBFE",
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 7,
  },

  resultFooterText: {
    fontSize: 11,
    fontWeight: "800",
    color: "#1D4ED8",
    letterSpacing: 0.2,
  },
});