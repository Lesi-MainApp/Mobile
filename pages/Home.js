import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  ScrollView,
  Platform,
  KeyboardAvoidingView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import Islandrank from "../components/Islandrank";
import Coins from "../components/Coins";
import FinishedExam from "../components/FinishedExam";
import ProgressBar from "../components/ProgressBar";
import PaperGrid from "../components/PaperGrid";

import useT from "../app/i18n/useT";

// ✅ NEW
import { useGetMyProgressQuery } from "../app/progressApi";

const { height } = Dimensions.get("window");
const TAB_BAR_HEIGHT = 90;

export default function Home() {
  const { t, sinFont } = useT();

  // ✅ time-to-time update (polling)
  const { data } = useGetMyProgressQuery(undefined, {
    pollingInterval: 20000, // every 20 seconds
    refetchOnFocus: true,
    refetchOnReconnect: true,
  });

  const progress = Number(data?.progress || 0); // 0..1

  return (
    <SafeAreaView style={styles.safe} edges={["left", "right"]}>
      <KeyboardAvoidingView
        style={styles.safe}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          style={styles.safe}
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
          bounces={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.screen}>
            <View style={styles.dashboard}>
              <View style={styles.leftCol}>
                <Islandrank />
              </View>
              <View style={styles.rightCol}>
                <Coins />
                <FinishedExam />
              </View>
            </View>

            <View style={styles.progressWrapper}>
              {/* ✅ same design, just pass backend progress */}
              <ProgressBar progress={progress} />
            </View>

            <Text style={[styles.sectionTitle, sinFont("bold")]}>
              {t("paperLibrary")}
            </Text>

            <View style={styles.gridWrapper}>
              <PaperGrid />
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#F8FAFC" },
  content: { paddingBottom: TAB_BAR_HEIGHT + 20 },
  screen: { backgroundColor: "#F8FAFC" },

  dashboard: {
    height: height * 0.3,
    flexDirection: "row",
    padding: 16,
  },
  leftCol: { flex: 1, marginRight: 12 },
  rightCol: { flex: 1, justifyContent: "space-between" },

  progressWrapper: { paddingHorizontal: 16, marginTop: 4 },

  sectionTitle: {
    marginTop: 12,
    marginLeft: 16,
    fontSize: 18,
    fontWeight: "700",
    color: "#0F172A",
  },

  gridWrapper: { paddingBottom: 8 },
});