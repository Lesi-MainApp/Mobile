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
  return `${pad2(d.getHours())}.${pad2(d.getMinutes())}`; // ✅ 15.30
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
        <View style={{ paddingTop: 30, alignItems: "center" }}>
          <ActivityIndicator />
          <Text style={styles.infoText}>Loading completed papers...</Text>
        </View>
      ) : isError ? (
        <View style={{ paddingTop: 30, alignItems: "center" }}>
          <Text style={styles.errTitle}>Failed to load completed papers</Text>
          <Pressable onPress={() => refetch?.()} style={{ marginTop: 10 }}>
            <Text style={styles.tryAgain}>Try again</Text>
          </Pressable>
        </View>
      ) : list.length === 0 ? (
        <Text style={styles.centerInfo}>No completed papers yet.</Text>
      ) : (
        <ScrollView contentContainerStyle={{ paddingBottom: 120 }}>
          {list.map((p, idx) => (
            <View style={styles.card} key={p?.attemptId || String(idx)}>
              <Text style={styles.paperTitle} numberOfLines={2}>
                {p?.paperTitle || "Paper"}
              </Text>

              <Text style={styles.metaText}>
                Paper Type: {p?.paperType || "-"}
              </Text>

              <View style={styles.metaRow}>
                <Text style={styles.metaText}>
                  Date: {formatDate(p?.completedAt)}
                </Text>
                <Text style={styles.metaText}>
                  Time: {formatTimeDot(p?.completedAt)}
                </Text>
              </View>
            </View>
          ))}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#F8FAFC", padding: 16, paddingTop: 22 },

  pageTitle: {
    fontSize: 18,
    fontWeight: "900",
    color: "#214294",
    textAlign: "center",
    marginBottom: 14,
  },

  infoText: { marginTop: 10, color: "#64748B", fontWeight: "700" },

  errTitle: { color: "#0F172A", fontWeight: "900" },
  tryAgain: { color: "#214294", fontWeight: "900" },

  centerInfo: {
    textAlign: "center",
    marginTop: 25,
    color: "#64748B",
    fontWeight: "800",
  },

  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 16,
    marginBottom: 14,
    elevation: 6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },

  paperTitle: {
    fontSize: 16,
    fontWeight: "900",
    color: "#0F172A",
    marginBottom: 10,
  },

  metaRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 6,
    gap: 10,
  },

  metaText: {
    fontSize: 12,
    fontWeight: "800",
    color: "#475569",
    flexShrink: 1,
  },
});