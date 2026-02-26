// pages/Registersubject.js
import React, { useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  Pressable,
} from "react-native";

import { useGetMyCompletedPapersQuery } from "../app/attemptApi";

const pad2 = (n) => String(n).padStart(2, "0");

const formatDate = (iso) => {
  const d = new Date(iso);
  if (!Number.isFinite(d.getTime())) return "-";
  return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;
};

const formatTimeDot = (iso) => {
  const d = new Date(iso);
  if (!Number.isFinite(d.getTime())) return "-";
  return `${pad2(d.getHours())}.${pad2(d.getMinutes())}`;
};

export default function Registersubject() {
  const { data, isLoading, isError, refetch } = useGetMyCompletedPapersQuery();

  const list = useMemo(() => {
    const items = data?.items || [];
    return Array.isArray(items) ? items : [];
  }, [data]);

  return (
    <View style={styles.screen}>
      <Text style={styles.pageTitle}>Completed Papers</Text>

      {isLoading ? (
        <View style={styles.stateWrap}>
          <ActivityIndicator size="large" color="#214294" />
          <Text style={styles.infoText}>Loading completed papers...</Text>
        </View>
      ) : isError ? (
        <View style={styles.stateCard}>
          <Text style={styles.errTitle}>Failed to load completed papers</Text>
          <Pressable onPress={() => refetch?.()} style={styles.retryBtn}>
            <Text style={styles.tryAgain}>Try again</Text>
          </Pressable>
        </View>
      ) : list.length === 0 ? (
        <View style={styles.stateCard}>
          <Text style={styles.centerInfo}>No completed papers yet.</Text>
        </View>
      ) : (
        <ScrollView
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
        >
          {list.map((p, idx) => {
            const title = p?.paperTitle || "Paper";
            const paperType = p?.paperType || "-";
            const date = formatDate(p?.completedAt);
            const time = formatTimeDot(p?.completedAt);

            return (
              <View style={styles.card} key={p?.attemptId || String(idx)}>
                {/* Top Row */}
                <View style={styles.topRow}>
                  <View style={styles.titleWrap}>
                    <Text style={styles.paperTitle} numberOfLines={2}>
                      {title}
                    </Text>
                  </View>

                  <View style={styles.statusBadge}>
                    <Text style={styles.statusText}>Completed</Text>
                  </View>
                </View>

                {/* Paper Type Section */}
                <View style={styles.typeRow}>
                  <Text style={styles.typeLabel}>Paper Type</Text>
                  <View style={styles.typeBadge}>
                    <Text style={styles.typeBadgeText} numberOfLines={1}>
                      {paperType}
                    </Text>
                  </View>
                </View>

                {/* Divider */}
                <View style={styles.divider} />

                {/* Bottom Info */}
                <View style={styles.infoGrid}>
                  <View style={styles.infoCard}>
                    <Text style={styles.infoHeading}>Date</Text>
                    <Text style={styles.infoValue}>{date}</Text>
                  </View>

                  <View style={styles.infoCard}>
                    <Text style={styles.infoHeading}>Time</Text>
                    <Text style={styles.infoValue}>{time}</Text>
                  </View>
                </View>
              </View>
            );
          })}
        </ScrollView>
      )}
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
    fontSize: 19,
    fontWeight: "900",
    color: "#214294",
    textAlign: "center",
    marginBottom: 14,
    letterSpacing: 0.2,
  },

  list: {
    paddingBottom: 120,
  },

  stateWrap: {
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 34,
  },

  stateCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
  },

  infoText: {
    marginTop: 12,
    color: "#64748B",
    fontWeight: "700",
    fontSize: 13,
    textAlign: "center",
  },

  errTitle: {
    color: "#0F172A",
    fontWeight: "900",
    fontSize: 14,
    textAlign: "center",
  },

  retryBtn: {
    marginTop: 12,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 12,
    backgroundColor: "#EFF6FF",
    borderWidth: 1,
    borderColor: "#BFDBFE",
  },

  tryAgain: {
    color: "#214294",
    fontWeight: "900",
    fontSize: 13,
  },

  centerInfo: {
    textAlign: "center",
    color: "#64748B",
    fontWeight: "800",
    fontSize: 14,
  },

  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: "#E2E8F0",

    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 3,
  },

  topRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: 10,
  },

  titleWrap: {
    flex: 1,
    paddingRight: 4,
  },

  paperTitle: {
    fontSize: 16,
    fontWeight: "900",
    color: "#0F172A",
    lineHeight: 22,
  },

  statusBadge: {
    backgroundColor: "#ECFDF5",
    borderWidth: 1,
    borderColor: "#BBF7D0",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
  },

  statusText: {
    fontSize: 10,
    fontWeight: "900",
    color: "#15803D",
    textTransform: "uppercase",
    letterSpacing: 0.4,
  },

  typeRow: {
    marginTop: 6,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 10,
  },

  typeLabel: {
    fontSize: 12,
    fontWeight: "800",
    color: "#64748B",
  },

  typeBadge: {
    maxWidth: "68%",
    backgroundColor: "#EEF2FF",
    borderWidth: 1,
    borderColor: "#C7D2FE",
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 12,
  },

  typeBadgeText: {
    fontSize: 12,
    fontWeight: "900",
    color: "#3730A3",
  },

  divider: {
    height: 1,
    backgroundColor: "#E2E8F0",
    marginTop: 14,
    marginBottom: 14,
  },

  infoGrid: {
    flexDirection: "row",
    gap: 10,
  },

  infoCard: {
    flex: 1,
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 14,
    paddingVertical: 12,
    paddingHorizontal: 12,
    alignItems: "center",
    justifyContent: "center",
  },

  infoHeading: {
    fontSize: 11,
    fontWeight: "700",
    color: "#64748B",
    marginBottom: 4,
  },

  infoValue: {
    fontSize: 13,
    fontWeight: "900",
    color: "#0F172A",
  },
});