// pages/Live.js
import React, { useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  FlatList,
  Linking,
  ActivityIndicator,
} from "react-native";
import { useGetStudentLivesQuery } from "../app/liveApi";

const ONE_DAY_MS = 24 * 60 * 60 * 1000;

const formatDate = (iso) => {
  try {
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return "";
    return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, "0")}.${String(
      d.getDate()
    ).padStart(2, "0")}`;
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

  const lives = useMemo(() => {
    const list = data?.lives || [];
    const now = Date.now();

    return list
      .filter((x) => {
        const t = new Date(x?.scheduledAt).getTime();
        if (!t || Number.isNaN(t)) return false;
        return now - t <= ONE_DAY_MS;
      })
      .sort(
        (a, b) => new Date(b.scheduledAt).getTime() - new Date(a.scheduledAt).getTime()
      );
  }, [data]);

  const onJoin = async (url) => {
    if (!url) return;
    const can = await Linking.canOpenURL(url);
    if (can) Linking.openURL(url);
  };

  if (isLoading) {
    return (
      <View style={[styles.screen, styles.centerWrap]}>
        <ActivityIndicator size="large" color="#DC2626" />
        <Text style={styles.stateText}>Loading live classes...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.screen, styles.centerWrap]}>
        <View style={styles.stateCard}>
          <Text style={styles.errorTitle}>Failed to load live classes</Text>
          <Pressable onPress={refetch} style={styles.retryBtn}>
            <Text style={styles.retryBtnText}>Retry</Text>
          </Pressable>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <Text style={styles.pageTitle}>Live Classes</Text>

      {isFetching ? (
        <View style={styles.refreshWrap}>
          <Text style={styles.refreshText}>Refreshing...</Text>
        </View>
      ) : null}

      {lives.length === 0 ? (
        <View style={styles.emptyWrap}>
          <Text style={styles.emptyText}>No live classes right now.</Text>
        </View>
      ) : (
        <FlatList
          data={lives}
          keyExtractor={(item) => String(item?._id)}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
          renderItem={({ item }) => {
            const title = item?.title || "Live Class";
            const teacher = item?.teacherNames?.[0] || "Teacher";
            const dateText = formatDate(item?.scheduledAt);
            const timeText = formatTime(item?.scheduledAt);

            return (
              <View style={styles.card}>
                <View style={styles.headerRow}>
                  <View style={styles.headerLeft}>
                    <Text style={styles.title} numberOfLines={1}>
                      {title}
                    </Text>
                    <Text style={styles.teacher} numberOfLines={1}>
                      {teacher}
                    </Text>
                  </View>

                  <View style={styles.liveBadge}>
                    <View style={styles.liveDot} />
                    <Text style={styles.liveBadgeText}>LIVE</Text>
                  </View>
                </View>

                <View style={styles.infoRow}>
                  <View style={styles.infoItem}>
                    <Text style={styles.infoLabel}>Date</Text>
                    <Text style={styles.infoValue}>{dateText || "-"}</Text>
                  </View>

                  <View style={styles.infoDivider} />

                  <View style={styles.infoItem}>
                    <Text style={styles.infoLabel}>Time</Text>
                    <Text style={styles.infoValue}>{timeText || "-"}</Text>
                  </View>
                </View>

                <Pressable style={styles.joinBtn} onPress={() => onJoin(item?.zoomLink)}>
                  <Text style={styles.joinBtnText}>Join Class</Text>
                </Pressable>
              </View>
            );
          }}
        />
      )}
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

  centerWrap: {
    justifyContent: "center",
    alignItems: "center",
  },

  pageTitle: {
    textAlign: "center",
    fontSize: 18,
    fontWeight: "900",
    color: "#DC2626",
    marginBottom: 14,
  },

  refreshWrap: {
    alignItems: "center",
    marginBottom: 10,
  },

  refreshText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#64748B",
  },

  stateText: {
    marginTop: 12,
    fontSize: 13,
    fontWeight: "700",
    color: "#64748B",
  },

  stateCard: {
    width: "100%",
    maxWidth: 360,
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 18,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },

  errorTitle: {
    fontSize: 14,
    fontWeight: "800",
    color: "#0F172A",
    textAlign: "center",
  },

  retryBtn: {
    marginTop: 12,
    backgroundColor: "#DC2626",
    borderRadius: 12,
    paddingHorizontal: 18,
    paddingVertical: 10,
  },

  retryBtnText: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "800",
  },

  emptyWrap: {
    marginTop: 24,
    alignItems: "center",
  },

  emptyText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#64748B",
    textAlign: "center",
  },

  listContent: {
    paddingBottom: 120,
  },

  card: {
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
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: 10,
  },

  headerLeft: {
    flex: 1,
    paddingRight: 8,
  },

  title: {
    fontSize: 18,
    fontWeight: "900",
    color: "#0F172A",
  },

  teacher: {
    marginTop: 4,
    fontSize: 13,
    fontWeight: "700",
    color: "#64748B",
  },

  liveBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FEF2F2",
    borderWidth: 1,
    borderColor: "#FECACA",
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },

  liveDot: {
    width: 8,
    height: 8,
    borderRadius: 999,
    backgroundColor: "#DC2626",
    marginRight: 6,
  },

  liveBadgeText: {
    fontSize: 10,
    fontWeight: "900",
    color: "#DC2626",
    letterSpacing: 0.5,
  },

  infoRow: {
    marginTop: 16,
    marginBottom: 16,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 14,
    overflow: "hidden",
  },

  infoItem: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 14,
  },

  infoDivider: {
    width: 1,
    alignSelf: "stretch",
    backgroundColor: "#E2E8F0",
  },

  infoLabel: {
    fontSize: 11,
    fontWeight: "700",
    color: "#64748B",
    marginBottom: 4,
  },

  infoValue: {
    fontSize: 13,
    fontWeight: "800",
    color: "#0F172A",
  },

  joinBtn: {
    alignSelf: "center",
    minWidth: 150,
    backgroundColor: "#DC2626",
    borderRadius: 12,
    paddingHorizontal: 22,
    paddingVertical: 11,
    alignItems: "center",
    justifyContent: "center",
  },

  joinBtnText: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "900",
  },
});