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

const { height } = Dimensions.get("window");

// ✅ Set this to match your bottom navigation height
const TAB_BAR_HEIGHT = 90;

export default function Home() {
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
            {/* 🔹 TOP DASHBOARD (FIXED HEIGHT) */}
            <View style={styles.dashboard}>
              <View style={styles.leftCol}>
                <Islandrank />
              </View>

              <View style={styles.rightCol}>
                <Coins />
                <FinishedExam />
              </View>
            </View>

            {/* 🔹 PROGRESS */}
            <View style={styles.progressWrapper}>
              <ProgressBar progress={0.65} />
            </View>

            {/* 🔹 TITLE */}
            <Text style={styles.sectionTitle}>Paper Library</Text>

            {/* 🔹 GRID */}
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
  safe: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },

  // ✅ This prevents overlay by bottom navigation
  content: {
    paddingBottom: TAB_BAR_HEIGHT + 20,
  },

  screen: {
    backgroundColor: "#F8FAFC",
  },

  dashboard: {
    height: height * 0.3,
    flexDirection: "row",
    padding: 16,
  },

  leftCol: {
    flex: 1,
    marginRight: 12,
  },

  rightCol: {
    flex: 1,
    justifyContent: "space-between",
  },

  progressWrapper: {
    paddingHorizontal: 16,
    marginTop: 4,
  },

  sectionTitle: {
    marginTop: 12,
    marginLeft: 16,
    fontSize: 18,
    fontWeight: "700",
    color: "#0F172A",
  },

  gridWrapper: {
    paddingBottom: 8,
  },
});
