import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

const PRIMARY = "#214294";

const getImageSource = (item) => {
  const uri =
    item?.image ||
    item?.imageUrl ||
    item?.classImage ||
    item?.classImageUrl ||
    item?.thumbnail ||
    item?.thumbnailUrl ||
    item?.banner ||
    item?.bannerUrl ||
    "";

  if (uri) {
    return { uri: String(uri) };
  }

  return null;
};

const StatusBadge = ({ status }) => {
  if (status === "approved") {
    return (
      <View style={[styles.statusBadge, styles.statusApproved]}>
        <Text style={[styles.statusText, styles.statusApprovedText]}>Approved</Text>
      </View>
    );
  }

  if (status === "pending") {
    return (
      <View style={[styles.statusBadge, styles.statusPending]}>
        <Text style={[styles.statusText, styles.statusPendingText]}>Pending</Text>
      </View>
    );
  }

  return (
    <View style={[styles.statusBadge, styles.statusAvailable]}>
      <Text style={[styles.statusText, styles.statusAvailableText]}>Available</Text>
    </View>
  );
};

export default function ClassEnrollCard({
  item,
  status = "",
  onPressView,
  onPressEnroll,
}) {
  const canView = status === "approved";
  const isPending = status === "pending";

  const imageSource = getImageSource(item);
  const className = String(item?.className || "Class");
  const teacherName = String(item?.teacherName || item?.teacher || "").trim();

  const actionText = canView
    ? "View Lessons"
    : isPending
    ? "Request Pending"
    : "Enroll Now";

  return (
    <View style={styles.card}>
      <View style={styles.imageWrap}>
        {imageSource ? (
          <Image source={imageSource} style={styles.image} resizeMode="contain" />
        ) : (
          <View style={styles.imageFallback}>
            <View style={styles.fallbackCircle}>
              <Ionicons name="school-outline" size={40} color={PRIMARY} />
            </View>
            <View style={styles.fallbackDotOne} />
            <View style={styles.fallbackDotTwo} />
          </View>
        )}
      </View>

      <View style={styles.body}>
        <StatusBadge status={status} />

        <Text style={styles.className}>{className}</Text>

        {!!teacherName && (
          <Text style={styles.metaText}>Teacher: {teacherName}</Text>
        )}

        <View style={styles.buttonRow}>
          <Pressable
            onPress={canView ? onPressView : onPressEnroll}
            style={({ pressed }) => [
              styles.actionBtn,
              isPending && styles.pendingBtn,
              pressed && styles.actionPressed,
            ]}
          >
            <Text
              style={[
                styles.actionBtnText,
                isPending && styles.pendingBtnText,
              ]}
            >
              {actionText}
            </Text>

            <Ionicons
              name={
                canView
                  ? "play-circle-outline"
                  : isPending
                  ? "time-outline"
                  : "add-circle-outline"
              }
              size={18}
              color={isPending ? "#92400E" : "#FFFFFF"}
            />
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 26,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    marginBottom: 16,
    overflow: "hidden",
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.06,
    shadowRadius: 14,
    elevation: 3,
  },

  imageWrap: {
    width: "100%",
    height: 210,
    backgroundColor: "#EEF4FF",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 12,
    paddingVertical: 12,
  },

  // full image visible
  image: {
    width: "100%",
    height: "100%",
  },

  imageFallback: {
    flex: 1,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#EEF4FF",
  },

  fallbackCircle: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
  },

  fallbackDotOne: {
    position: "absolute",
    top: 34,
    right: 40,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: "#A855F7",
  },

  fallbackDotTwo: {
    position: "absolute",
    bottom: 36,
    left: 38,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: "#F59E0B",
  },

  body: {
    padding: 16,
  },

  statusBadge: {
    alignSelf: "flex-start",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 999,
    marginBottom: 10,
    borderWidth: 1,
  },

  statusText: {
    fontSize: 11,
    fontWeight: "700",
  },

  statusApproved: {
    backgroundColor: "#DCFCE7",
    borderColor: "#BBF7D0",
  },

  statusApprovedText: {
    color: "#166534",
  },

  statusPending: {
    backgroundColor: "#FEF3C7",
    borderColor: "#FDE68A",
  },

  statusPendingText: {
    color: "#92400E",
  },

  statusAvailable: {
    backgroundColor: "#EAF1FF",
    borderColor: "#BFDBFE",
  },

  statusAvailableText: {
    color: PRIMARY,
  },

  className: {
    fontSize: 20,
    fontWeight: "800",
    color: "#0F172A",
    lineHeight: 26,
  },

  metaText: {
    marginTop: 6,
    fontSize: 14,
    fontWeight: "500",
    color: "#64748B",
    lineHeight: 20,
  },

  buttonRow: {
    marginTop: 16,
    alignItems: "flex-end",
  },

  actionBtn: {
    minWidth: 148,
    height: 46,
    borderRadius: 14,
    paddingHorizontal: 16,
    backgroundColor: PRIMARY,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },

  pendingBtn: {
    backgroundColor: "#FEF3C7",
    borderWidth: 1,
    borderColor: "#FDE68A",
  },

  actionPressed: {
    opacity: 0.92,
  },

  actionBtnText: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "700",
  },

  pendingBtnText: {
    color: "#92400E",
  },
});