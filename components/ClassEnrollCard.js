import React, { useMemo } from "react";
import { View, Text, StyleSheet, Image, Pressable } from "react-native";

export default function ClassEnrollCard({ item, onPressView, onPressEnroll, status }) {
  const teacherName = useMemo(() => {
    if (item?.teachers?.length > 0) return item.teachers[0]?.name || "Teacher";
    return item?.teacherCount ? `${item.teacherCount} Teacher(s)` : "No Teacher";
  }, [item]);

  const imgUrl = useMemo(() => {
    const u = String(item?.imageUrl || "").trim();
    return u.length > 0 ? u : "";
  }, [item]);

  const btnLabel =
    status === "approved" ? "View" : status === "pending" ? "Pending" : "Enroll Now";

  const disabled = status === "pending";

  const btnBg =
    status === "approved"
      ? "#16A34A"
      : status === "pending"
      ? "#94A3B8"
      : "#2563EB";

  return (
    <Pressable
      onPress={status === "approved" ? onPressView : onPressEnroll}
      disabled={disabled}
      style={({ pressed }) => [
        styles.card,
        pressed && !disabled && styles.pressed,
        disabled && styles.disabledCard,
      ]}
    >
      <View style={styles.imageWrap}>
        {imgUrl ? (
          <Image source={{ uri: imgUrl }} style={styles.image} resizeMode="cover" />
        ) : (
          <View style={styles.imageFallback} />
        )}
      </View>

      <View style={styles.info}>
        <Text style={styles.subject} numberOfLines={2}>
          {item?.subjectName || item?.subject || "Subject"}
        </Text>

        <Text style={styles.teacher} numberOfLines={1}>
          {teacherName}
        </Text>

        
      </View>

      <View style={styles.right}>
        <View style={[styles.btn, { backgroundColor: btnBg }]}>
          <Text style={styles.btnText}>{btnLabel}</Text>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    paddingVertical: 14,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 14,

    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 4,
  },

  pressed: {
    transform: [{ scale: 0.985 }],
  },

  disabledCard: {
    opacity: 0.9,
  },

  imageWrap: {
    width: 76,
    height: 76,
    borderRadius: 18,
    overflow: "hidden",
    backgroundColor: "#E5E7EB",
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },

  image: {
    width: "100%",
    height: "100%",
  },

  imageFallback: {
    width: "100%",
    height: "100%",
    backgroundColor: "#CBD5E1",
  },

  info: {
    flex: 1,
    marginLeft: 14,
    justifyContent: "center",
  },

  subject: {
    fontSize: 15,
    fontWeight: "900",
    color: "#0F172A",
    lineHeight: 20,
  },

  teacher: {
    marginTop: 5,
    fontSize: 12,
    fontWeight: "700",
    color: "#475569",
  },

  classBadge: {
    alignSelf: "flex-start",
    marginTop: 8,
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 999,
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },

  classBadgeText: {
    fontSize: 11,
    fontWeight: "800",
    color: "#475569",
  },

  right: {
    justifyContent: "center",
    marginLeft: 12,
  },

  btn: {
    minWidth: 94,
    paddingVertical: 9,
    paddingHorizontal: 14,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },

  btnText: {
    color: "#FFFFFF",
    fontSize: 11,
    fontWeight: "900",
    letterSpacing: 0.2,
  },
});