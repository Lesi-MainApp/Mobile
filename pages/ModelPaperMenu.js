// pages/ModelPaperMenu.js
import React, { useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";

import { useGetPublishedPapersQuery } from "../app/paperApi";

const PRIMARY = "#1153ec";
const LIGHT_BLUE = "#EFF6FF";
const LIGHT_BLUE_BORDER = "#BFDBFE";
const LIGHT_BLUE_TEXT = "#1D4ED8";

export default function ModelPaperMenu({ route }) {
  const navigation = useNavigation();

  const {
    gradeNumber,
    level,
    stream,
    subject,
    mode = "model",
  } = route?.params || {};

  const canFetch =
    !!gradeNumber && !!subject && (gradeNumber < 12 || !!stream);

  const {
    data: papersRaw = [],
    isLoading,
    isFetching,
    error,
  } = useGetPublishedPapersQuery(
    {
      gradeNumber,
      paperType: "Model paper",
      stream: gradeNumber >= 12 ? stream : null,
      subject,
    },
    { skip: !canFetch }
  );

  const PAPERS = useMemo(() => {
    return (Array.isArray(papersRaw) ? papersRaw : []).map((p) => ({
      id: String(p?._id),
      title: String(p?.paperTitle || "Model Paper"),
      mcqCount: Number(p?.questionCount || 0),
      timeMin: Number(p?.timeMinutes || 0),
      attempts: Number(p?.attempts || 1),
      payment: p?.payment,
      amount: Number(p?.amount || 0),
    }));
  }, [papersRaw]);

  // ✅ FIXED NAVIGATION HERE
  const onAttempt = (paper, attemptNo) => {
    navigation.navigate("PaperPage", {
      paperId: paper.id,
      title: paper.title,
      timeMin: paper.timeMin,
      attemptNo,
    });
  };

  const onAttemptNow = (paper) => onAttempt(paper, 1);

  return (
    <View style={styles.screen}>
      <Text style={styles.pageTitle}>Model Papers</Text>
      <Text style={styles.pageSub}>
        {subject
          ? `${subject} • ${gradeNumber || ""}`
          : "Choose a paper and start"}
      </Text>

      {!canFetch ? (
        <View style={styles.center}>
          <Text style={styles.infoText}>
            Grade / Stream / Subject not selected
          </Text>
        </View>
      ) : isLoading || isFetching ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={PRIMARY} />
          <Text style={styles.infoText}>Loading papers...</Text>
        </View>
      ) : error ? (
        <View style={styles.center}>
          <Text style={styles.infoText}>Papers not available</Text>
        </View>
      ) : !PAPERS.length ? (
        <View style={styles.center}>
          <Text style={styles.infoText}>No Model Papers Found</Text>
        </View>
      ) : (
        <ScrollView
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
        >
          {PAPERS.map((p) => (
            <View key={p.id} style={styles.card}>
              <Text style={styles.cardTitle}>{p.title}</Text>

              <View style={styles.metaRowCenter}>
                <View style={styles.metaItem}>
                  <Ionicons
                    name="help-circle-outline"
                    size={16}
                    color="#64748B"
                  />
                  <Text style={styles.metaText}>
                    {p.mcqCount} MCQs
                  </Text>
                </View>

                <View style={styles.metaItem}>
                  <Ionicons
                    name="time-outline"
                    size={16}
                    color="#64748B"
                  />
                  <Text style={styles.metaText}>
                    {p.timeMin} min
                  </Text>
                </View>
              </View>

              <View style={styles.attemptRow}>
                {[1, 2, 3]
                  .filter((a) => a <= (p.attempts || 1))
                  .map((a) => (
                    <Pressable
                      key={a}
                      onPress={() => onAttempt(p, a)}
                      style={({ pressed }) => [
                        styles.attemptPill,
                        pressed && styles.pillPressed,
                      ]}
                    >
                      <Text style={styles.attemptText}>
                        Attempt {a}
                      </Text>
                    </Pressable>
                  ))}
              </View>

              <Pressable
                onPress={() => onAttemptNow(p)}
                style={({ pressed }) => [
                  styles.btn,
                  pressed && styles.btnPressed,
                ]}
              >
                <Text style={styles.btnText}>Attempt Now</Text>
                <Ionicons
                  name="arrow-forward"
                  size={18}
                  color="#FFFFFF"
                />
              </Pressable>
            </View>
          ))}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#F8FAFC",
    padding: 16,
    paddingTop: 18,
  },
  pageTitle: {
    fontSize: 22,
    fontWeight: "900",
    color: PRIMARY,
    textAlign: "center",
  },
  pageSub: {
    marginTop: 6,
    marginBottom: 14,
    fontSize: 12,
    fontWeight: "700",
    color: "#64748B",
    textAlign: "center",
  },
  list: { paddingBottom: 24, gap: 12 },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 14,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    elevation: 3,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: "900",
    color: "#0F172A",
    textAlign: "center",
  },
  metaRowCenter: {
    marginTop: 10,
    flexDirection: "row",
    justifyContent: "center",
    gap: 10,
  },
  metaItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  metaText: {
    fontSize: 11,
    fontWeight: "800",
    color: "#475569",
  },
  attemptRow: {
    marginTop: 12,
    flexDirection: "row",
    justifyContent: "center",
    gap: 10,
  },
  attemptPill: {
    backgroundColor: LIGHT_BLUE,
    borderWidth: 1,
    borderColor: LIGHT_BLUE_BORDER,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 999,
  },
  pillPressed: { opacity: 0.9 },
  attemptText: {
    color: LIGHT_BLUE_TEXT,
    fontSize: 12,
    fontWeight: "900",
  },
  btn: {
    marginTop: 12,
    height: 44,
    borderRadius: 14,
    backgroundColor: PRIMARY,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 8,
  },
  btnPressed: { opacity: 0.9 },
  btnText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "900",
  },
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  infoText: {
    fontSize: 14,
    fontWeight: "900",
    color: "#0F172A",
    textAlign: "center",
  },
});
