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

  // ✅ button status
  const btnLabel =
    status === "approved" ? "View" : status === "pending" ? "Pending" : "Enroll now";

  const disabled = status === "pending";

  const btnBg =
    status === "approved"
      ? "#16A34A" // green
      : status === "pending"
      ? "#94A3B8" // gray
      : "#2563EB"; // blue

  return (
    <Pressable
      onPress={status === "approved" ? onPressView : onPressEnroll}
      disabled={disabled}
      style={({ pressed }) => [
        styles.card,
        pressed && !disabled && styles.pressed,
        disabled && { opacity: 0.85 },
      ]}
    >
      {/* LEFT IMAGE (backend url only) */}
      <View style={styles.avatarWrap}>
        {imgUrl ? (
          <Image source={{ uri: imgUrl }} style={styles.avatar} resizeMode="cover" />
        ) : (
          <View style={styles.avatarFallback} />
        )}
      </View>

      {/* CENTER TEXT */}
      <View style={styles.info}>
        <Text style={styles.subject} numberOfLines={1}>
          {item?.subjectName || item?.subject || "Subject"}
        </Text>

        <Text style={styles.teacher} numberOfLines={1}>
          {teacherName}
        </Text>

        <Text style={styles.meta} numberOfLines={1}>
          {item?.gradeNumber
            ? `Grade ${item.gradeNumber}`
            : item?.grade
            ? `Grade ${item.grade}`
            : "Grade"}{" "}
          • {item?.className || "Class"}
        </Text>
      </View>

      {/* RIGHT BUTTON (same UI block, just dynamic) */}
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
    borderRadius: 22,
    padding: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    elevation: 4,
  },
  pressed: { transform: [{ scale: 0.985 }] },

  avatarWrap: {
    width: 58,
    height: 58,
    borderRadius: 16,
    overflow: "hidden",
    backgroundColor: "#E5E7EB",
  },
  avatar: { width: "100%", height: "100%" },

  // when backend has no imageUrl
  avatarFallback: { width: "100%", height: "100%", backgroundColor: "#CBD5E1" },

  info: { flex: 1, marginLeft: 12 },

  subject: {
    fontSize: 14,
    fontWeight: "900",
    color: "#0F172A",
  },
  teacher: {
    marginTop: 2,
    fontSize: 12,
    fontWeight: "800",
    color: "#334155",
  },
  meta: {
    marginTop: 4,
    fontSize: 11,
    fontWeight: "800",
    color: "#64748B",
  },

  right: { justifyContent: "center", marginLeft: 10 },

  btn: {
    paddingVertical: 7,
    paddingHorizontal: 12,
    borderRadius: 16,
  },
  btnText: {
    color: "#FFFFFF",
    fontSize: 11,
    fontWeight: "900",
  },
});
