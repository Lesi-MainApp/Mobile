import React, { useMemo } from "react";
import { View, Text, StyleSheet, Image, Pressable } from "react-native";

export default function ClassEnrollCard({ item, onPress }) {
  const teacherName = useMemo(() => {
    if (item?.teachers?.length > 0) return item.teachers[0]?.name || "Teacher";
    return item?.teacherCount ? `${item.teacherCount} Teacher(s)` : "No Teacher";
  }, [item]);

  const imgUrl = useMemo(() => {
    const u = String(item?.imageUrl || "").trim();
    return u.length > 0 ? u : "";
  }, [item]);

  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.card, pressed && styles.pressed]}>
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
          {item?.subjectName || "Subject"}
        </Text>

        <Text style={styles.teacher} numberOfLines={1}>
          {teacherName}
        </Text>

        <Text style={styles.meta} numberOfLines={1}>
          {item?.gradeNumber ? `Grade ${item.gradeNumber}` : "Grade"} •{" "}
          {item?.className || "Class"}
        </Text>
      </View>

      {/* RIGHT BUTTON */}
      <View style={styles.right}>
        <View style={styles.btn}>
          <Text style={styles.btnText}>Enroll now</Text>
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

  // ✅ when backend has no imageUrl
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
    backgroundColor: "#2563EB",
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
