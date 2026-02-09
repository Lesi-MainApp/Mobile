import React from "react";
import { View, StyleSheet, SafeAreaView } from "react-native";
import BottomNavigationBar from "../components/BottomNavigationBar";
import TopBar from "../components/TopBar";

export default function SecondLayout({ children }) {
  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <TopBar />

        {/* ✅ Screen Content */}
        <View style={styles.content}>{children}</View>

        {/* ✅ Bottom bar (wrapper is transparent, screen bg shows through) */}
        <BottomNavigationBar />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#F8FAFC", // ✅ full screen color
  },

  container: {
    flex: 1,
    backgroundColor: "#F8FAFC", // ✅ full screen color
  },

  content: {
    flex: 1,
  },
});
