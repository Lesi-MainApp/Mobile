import React, { useMemo, useState } from "react";
import { View, Text, StyleSheet, Pressable, FlatList, SafeAreaView, Modal, ActivityIndicator } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import YoutubePlayer from "react-native-youtube-iframe";

import ReviewQuestionCard from "../components/ReviewQuestionCard";
import { useGetAttemptReviewQuery } from "../app/attemptApi";

const BG = "#FFFFFF";
const TEXT_DARK = "#0F172A";
const MUTED = "#94A3B8";
const BLUE = "#2563EB";
const BLUE_DARK = "#0B1220";

function getYouTubeId(url = "") {
  try {
    const u = String(url);
    const m1 = u.match(/[?&]v=([^&]+)/);
    if (m1?.[1]) return m1[1];
    const m2 = u.match(/youtu\.be\/([^?&]+)/);
    if (m2?.[1]) return m2[1];
    const m3 = u.match(/embed\/([^?&]+)/);
    if (m3?.[1]) return m3[1];
    return "";
  } catch {
    return "";
  }
}

export default function ReviewPage({ navigation, route }) {
  const attemptId = route?.params?.attemptId || "";
  const title = route?.params?.title || "Daily Quiz";

  const { data, isLoading, isFetching, error, refetch } = useGetAttemptReviewQuery(
    { attemptId },
    { skip: !attemptId }
  );

  const result = data?.result || {};
  const wrongFirst = Array.isArray(data?.wrongFirst) ? data.wrongFirst : [];
  const correctAfter = Array.isArray(data?.correctAfter) ? data.correctAfter : [];

  const total = Number(result?.totalQuestions || wrongFirst.length + correctAfter.length || 0);
  const correctCount = Number(result?.correctCount || correctAfter.length || 0);
  const scorePercent = Number(result?.percentage || 0);

  // reveal per card
  const [expanded, setExpanded] = useState({});
  const [videoOpen, setVideoOpen] = useState(false);
  const [logicOpen, setLogicOpen] = useState(false);
  const [activeVideoUrl, setActiveVideoUrl] = useState("");
  const [activeLogicText, setActiveLogicText] = useState("");

  const toggleReveal = (key) => setExpanded((p) => ({ ...p, [key]: !p?.[key] }));

  const openVideo = (item) => {
    const url = item?.explanationVideoUrl || "";
    setActiveVideoUrl(url);
    setVideoOpen(true);
  };

  const openLogic = (item) => {
    const text = item?.explanationText || "No explanation added yet.";
    setActiveLogicText(String(text));
    setLogicOpen(true);
  };

  const videoId = useMemo(() => getYouTubeId(activeVideoUrl), [activeVideoUrl]);

  const renderItem = ({ item, index }) => {
    const key = String(item?._id || index);
    const revealed = !!expanded[key];

    return (
      <ReviewQuestionCard
        item={item}
        revealed={revealed}
        onToggleReveal={() => toggleReveal(key)}
        onExplainVideo={() => openVideo(item)}
        onExplainLogic={() => openLogic(item)}
      />
    );
  };

  const onRetry = () => navigation.navigate("DailyQuizMenu"); // adjust if you want go back to menu
  const onHome = () => navigation.navigate("Home");

  if (isLoading || isFetching) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={BLUE} />
        <Text style={styles.helper}>Loading review...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text style={styles.helper}>Review not available</Text>
        <Pressable style={styles.retryBtn} onPress={refetch}>
          <Text style={styles.retryText}>Retry</Text>
        </Pressable>
      </View>
    );
  }

  const mergedList = [...wrongFirst, ...correctAfter];

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <View style={styles.scoreWrap}>
          <Text style={styles.scoreText}>{Math.round(scorePercent)}%</Text>
          <Text style={styles.scoreSub}>EXAM PERFORMANCE</Text>

          <View style={styles.scoreBtns}>
            <Pressable onPress={onHome} style={styles.btnLight}>
              <Text style={styles.btnLightText}>Home</Text>
            </Pressable>

            <Pressable onPress={onRetry} style={styles.btnBlue}>
              <Text style={styles.btnBlueText}>Retry</Text>
            </Pressable>
          </View>

          <Text style={styles.scoreMeta}>
            {correctCount}/{total} correct • {title}
          </Text>
        </View>

        {wrongFirst.length > 0 && (
          <Text style={styles.sectionTitle}>Wrong Answers (Review First)</Text>
        )}

        {wrongFirst.length === 0 && (
          <Text style={styles.sectionTitle}>No wrong answers 🎉</Text>
        )}

        <FlatList
          data={mergedList}
          keyExtractor={(item, idx) => String(item?._id || idx)}
          renderItem={renderItem}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 120 }}
          ListHeaderComponent={
            correctAfter.length ? (
              <View style={{ marginTop: 10 }}>
                <Text style={styles.sectionTitle}>Correct Answers (After)</Text>
              </View>
            ) : null
          }
        />

        {/* VIDEO MODAL */}
        <Modal visible={videoOpen} transparent animationType="fade">
          <View style={styles.modalOverlay}>
            <View style={styles.modalCard}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Explain Video</Text>
                <Pressable onPress={() => setVideoOpen(false)} hitSlop={10}>
                  <Ionicons name="close" size={22} color={TEXT_DARK} />
                </Pressable>
              </View>

              <View style={styles.videoBox}>
                {videoId ? (
                  <YoutubePlayer height={210} play={false} videoId={videoId} />
                ) : (
                  <Text style={styles.modalBody}>No/Invalid YouTube URL</Text>
                )}
              </View>
            </View>
          </View>
        </Modal>

        {/* LOGIC MODAL */}
        <Modal visible={logicOpen} transparent animationType="fade">
          <View style={styles.modalOverlay}>
            <View style={styles.modalCard}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Explain Logic</Text>
                <Pressable onPress={() => setLogicOpen(false)} hitSlop={10}>
                  <Ionicons name="close" size={22} color={TEXT_DARK} />
                </Pressable>
              </View>

              <Text style={styles.modalBody}>{activeLogicText}</Text>
            </View>
          </View>
        </Modal>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: BG },
  container: { flex: 1, backgroundColor: BG, paddingHorizontal: 14, paddingTop: 8 },

  scoreWrap: {
    alignSelf: "center",
    width: "85%",
    backgroundColor: "#F8FAFC",
    borderRadius: 14,
    paddingVertical: 16,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    alignItems: "center",
    marginTop: 4,
  },
  scoreText: { fontSize: 34, fontWeight: "900", color: BLUE },
  scoreSub: { fontSize: 10, fontWeight: "800", color: MUTED, marginTop: 2, letterSpacing: 1 },
  scoreBtns: { flexDirection: "row", gap: 10, marginTop: 12 },
  btnLight: { paddingHorizontal: 18, paddingVertical: 8, borderRadius: 999, backgroundColor: "#FFFFFF", borderWidth: 1, borderColor: "#E2E8F0" },
  btnLightText: { fontWeight: "800", color: TEXT_DARK, fontSize: 12 },
  btnBlue: { paddingHorizontal: 20, paddingVertical: 8, borderRadius: 999, backgroundColor: BLUE },
  btnBlueText: { fontWeight: "900", color: "#FFFFFF", fontSize: 12 },
  scoreMeta: { marginTop: 10, fontSize: 12, color: MUTED, fontWeight: "700", textAlign: "center" },

  sectionTitle: { marginTop: 14, marginBottom: 8, color: MUTED, fontWeight: "800", fontSize: 12 },

  modalOverlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.45)", alignItems: "center", justifyContent: "center", paddingHorizontal: 14 },
  modalCard: { width: "100%", maxWidth: 520, backgroundColor: "#fff", borderRadius: 18, padding: 14 },
  modalHeader: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 10 },
  modalTitle: { fontWeight: "900", fontSize: 16, color: TEXT_DARK },
  modalBody: { color: TEXT_DARK, fontSize: 14, fontWeight: "700", lineHeight: 20 },
  videoBox: { borderWidth: 1, borderColor: "#E2E8F0", borderRadius: 14, overflow: "hidden" },

  center: { flex: 1, alignItems: "center", justifyContent: "center", padding: 16 },
  helper: { marginTop: 10, textAlign: "center", color: "#64748B", fontSize: 12, fontWeight: "600" },
  retryBtn: { marginTop: 12, backgroundColor: "#2563EB", paddingHorizontal: 14, paddingVertical: 10, borderRadius: 12 },
  retryText: { color: "#fff", fontWeight: "900" },
});
