// src/pages/Live.js
import React, { useMemo } from "react";
import { View, Text, StyleSheet, Pressable, FlatList, Linking, ActivityIndicator } from "react-native";
import { useGetStudentLivesQuery } from "../app/liveApi";

const ONE_DAY_MS = 24 * 60 * 60 * 1000;

const formatDate = (iso) => {
  try {
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return "";
    return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, "0")}.${String(d.getDate()).padStart(2, "0")}`;
  } catch {
    return "";
  }
};

const formatTime = (iso) => {
  try {
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return "";
    let h = d.getHours();
    const m = String(d.getMinutes()).padStart(2, "0");
    const ampm = h >= 12 ? "p.m." : "a.m.";
    h = h % 12 || 12;
    return `${h}.${m} ${ampm}`;
  } catch {
    return "";
  }
};

export default function Live() {
  const { data, isLoading, isFetching, error, refetch } = useGetStudentLivesQuery();

  // backend returns: { count, lives: [...] }
  const lives = useMemo(() => {
    const list = data?.lives || [];
    const now = Date.now();

    // ✅ Hide if more than 24h passed since scheduledAt
    return list
      .filter((x) => {
        const t = new Date(x?.scheduledAt).getTime();
        if (!t || Number.isNaN(t)) return false;
        return now - t <= ONE_DAY_MS; // still valid
      })
      .sort((a, b) => new Date(b.scheduledAt).getTime() - new Date(a.scheduledAt).getTime());
  }, [data]);

  const onJoin = async (url) => {
    if (!url) return;
    const can = await Linking.canOpenURL(url);
    if (can) Linking.openURL(url);
  };

  if (isLoading) {
    return (
      <View style={[styles.screen, { justifyContent: "center", alignItems: "center" }]}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.screen}>
        <Text style={{ fontWeight: "800", color: "#0F172A" }}>Failed to load lives</Text>
        <Pressable onPress={refetch} style={{ marginTop: 10 }}>
          <Text style={{ color: "#1F5EEB", fontWeight: "800" }}>Retry</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      {isFetching ? (
        <View style={{ paddingBottom: 10 }}>
          <Text style={{ color: "#64748B", fontWeight: "700" }}>Refreshing...</Text>
        </View>
      ) : null}

      {lives.length === 0 ? (
        <Text style={{ color: "#64748B", fontWeight: "700" }}>
          No live classes right now.
        </Text>
      ) : null}

      <FlatList
        data={lives}
        keyExtractor={(item) => String(item?._id)}
        contentContainerStyle={{ paddingBottom: 40, gap: 12 }}
        renderItem={({ item }) => {
          const title = item?.title || "Live Class";
          const teacher = (item?.teacherNames?.[0] ? `- ${item.teacherNames[0]}` : "- Teacher");
          const dateText = formatDate(item?.scheduledAt);
          const timeText = formatTime(item?.scheduledAt);

          return (
            <View style={styles.card}>
              {/* Title + Teacher */}
              <View style={styles.topRow}>
                <Text style={styles.title}>{title}</Text>
                <Text style={styles.teacher}>{teacher}</Text>
              </View>

              {/* Date & Time */}
              <View style={styles.metaRow}>
                <Text style={styles.meta}>Date : {dateText || "-"}</Text>
                <Text style={styles.meta}>Time : {timeText || "-"}</Text>
              </View>

              {/* Button */}
              <Pressable style={styles.btn} onPress={() => onJoin(item?.zoomLink)}>
                <Text style={styles.btnText}>Join Now</Text>
              </Pressable>
            </View>
          );
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#F8FAFC",
    paddingHorizontal: 16,
    paddingTop: 16,
  },

  card: {
    width: "100%",
    height: 130,
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,

    elevation: 6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },

  topRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },

  title: {
    fontSize: 18,
    fontWeight: "800",
    color: "#0F172A",
  },

  teacher: {
    fontSize: 13,
    fontWeight: "700",
    color: "#475569",
  },

  metaRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 6,
  },

  meta: {
    fontSize: 12,
    fontWeight: "700",
    color: "#64748B",
  },

  btn: {
    alignSelf: "center",
    backgroundColor: "#1F5EEB",
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 12,
    marginTop: 15,
  },

  btnText: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "800",
  },
});
