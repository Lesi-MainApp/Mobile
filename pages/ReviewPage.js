import React, { useMemo, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  FlatList,
  SafeAreaView,
  Modal,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import ReviewQuestionCard from "../components/ReviewQuestionCard";
import YoutubePlayer from "react-native-youtube-iframe";

const BG = "#FFFFFF";
const TEXT_DARK = "#0F172A";
const MUTED = "#94A3B8";

const BLUE = "#2563EB";
const BLUE_DARK = "#0B1220";

function getYouTubeId(url = "") {
  try {
    const u = String(url);
    // watch?v=xxxx
    const m1 = u.match(/[?&]v=([^&]+)/);
    if (m1?.[1]) return m1[1];
    // youtu.be/xxxx
    const m2 = u.match(/youtu\.be\/([^?&]+)/);
    if (m2?.[1]) return m2[1];
    // embed/xxxx
    const m3 = u.match(/embed\/([^?&]+)/);
    if (m3?.[1]) return m3[1];
    return "";
  } catch {
    return "";
  }
}

export default function ReviewPage({ navigation, route }) {
  const { scorePercent = 0, items = [], paperId, title } = route?.params || {};

  const total = items.length || 0;
  const correctCount = useMemo(
    () => items.filter((x) => !!x?.isCorrect).length,
    [items]
  );

  // reveal per card
  const [expanded, setExpanded] = useState({});

  // modal
  const [videoOpen, setVideoOpen] = useState(false);
  const [logicOpen, setLogicOpen] = useState(false);
  const [activeVideoUrl, setActiveVideoUrl] = useState(
    "https://www.youtube.com/watch?v=JLptYsilm58"
  );
  const [activeLogicText, setActiveLogicText] = useState("");

  const toggleReveal = (key) => {
    setExpanded((p) => ({ ...p, [key]: !p?.[key] }));
  };

  const onRetry = () => navigation.navigate("PaperPage", { paperId, title });
  const onHome = () => navigation.navigate("Home");

  const openVideo = (item) => {
    const url =
      item?.explanationVideoUrl || "https://www.youtube.com/watch?v=JLptYsilm58";
    setActiveVideoUrl(url);
    setVideoOpen(true);
  };

  const openLogic = (item) => {
    const text =
      item?.explanationText ||
      item?.logic ||
      "No explanation added yet.";
    setActiveLogicText(String(text));
    setLogicOpen(true);
  };

  const renderItem = ({ item, index }) => {
    const key = String(item?._id || item?.id || index);
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

  const videoId = useMemo(() => getYouTubeId(activeVideoUrl), [activeVideoUrl]);

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        {/* Top performance card */}
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
            {correctCount}/{total} correct
          </Text>
        </View>

        <Text style={styles.sectionTitle}>Review Logic</Text>

        <FlatList
          data={items}
          keyExtractor={(item, idx) => String(item?._id || item?.id || idx)}
          renderItem={renderItem}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 120 }}
        />

        {/* Bottom more question */}
        <View style={styles.bottomCTA}>
          <Pressable
            style={styles.moreBtn}
            onPress={() => navigation.navigate("ModelPaperMenu")}
          >
            <Ionicons name="add" size={18} color="#fff" />
            <Text style={styles.moreBtnText}>more question</Text>
          </Pressable>
        </View>

        {/* ✅ VIDEO MODAL */}
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
                  <Text style={styles.modalBody}>
                    Invalid YouTube URL
                  </Text>
                )}
              </View>
            </View>
          </View>
        </Modal>

        {/* ✅ LOGIC MODAL */}
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
  container: {
    flex: 1,
    backgroundColor: BG,
    paddingHorizontal: 14,
    paddingTop: 8,
  },

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
  scoreSub: {
    fontSize: 10,
    fontWeight: "800",
    color: MUTED,
    marginTop: 2,
    letterSpacing: 1,
  },
  scoreBtns: { flexDirection: "row", gap: 10, marginTop: 12 },
  btnLight: {
    paddingHorizontal: 18,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  btnLightText: { fontWeight: "800", color: TEXT_DARK, fontSize: 12 },
  btnBlue: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: BLUE,
  },
  btnBlueText: { fontWeight: "900", color: "#FFFFFF", fontSize: 12 },
  scoreMeta: { marginTop: 10, fontSize: 12, color: MUTED, fontWeight: "700" },

  sectionTitle: {
    marginTop: 14,
    marginBottom: 8,
    color: MUTED,
    fontWeight: "800",
    fontSize: 12,
  },

  bottomCTA: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  moreBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: BLUE_DARK,
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 999,
  },
  moreBtnText: {
    color: "#fff",
    fontWeight: "900",
    fontSize: 12,
    textTransform: "lowercase",
  },

  // Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.45)",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 14,
  },
  modalCard: {
    width: "100%",
    maxWidth: 520,
    backgroundColor: "#fff",
    borderRadius: 18,
    padding: 14,
  },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  modalTitle: { fontWeight: "900", fontSize: 16, color: TEXT_DARK },
  modalBody: { color: TEXT_DARK, fontSize: 14, fontWeight: "700", lineHeight: 20 },

  videoBox: {
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 14,
    overflow: "hidden",
  },
});
