import React, { useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useGetGradeDetailQuery } from "../app/gradeApi";

const PRIMARY = "#214294";
const BG = "#F3F4F6";

const numberToWord = (num) => {
  const map = {
    1: "One",
    2: "Two",
    3: "Three",
    4: "Four",
    5: "Five",
    6: "Six",
    7: "Seven",
    8: "Eight",
    9: "Nine",
    10: "Ten",
    11: "Eleven",
    12: "Twelve",
    13: "Thirteen",
  };
  return map[num] || String(num);
};

const gradeToWordLabel = (gradeLabel) => {
  if (!gradeLabel) return "";
  const match = String(gradeLabel).match(/\d+/);
  const num = match ? parseInt(match[0], 10) : null;
  return num ? `Grade ${numberToWord(num)}` : gradeLabel;
};

const parseGradeNumber = (gradeLabel) => {
  const match = String(gradeLabel || "").match(/\d+/);
  return match ? parseInt(match[0], 10) : null;
};

const getVariant = (index) => {
  const variants = [
    {
      shell: "#F8F7FF",
      bubble1: "#E9D5FF",
      bubble2: "#FCE7F3",
      iconBg: "#EEF2FF",
      icon: "calculator-variant-outline",
      iconType: "mci",
      iconColor: "#7C3AED",
    },
    {
      shell: "#F5FBFF",
      bubble1: "#DBEAFE",
      bubble2: "#CFFAFE",
      iconBg: "#E0F2FE",
      icon: "school-outline",
      iconType: "ion",
      iconColor: "#0284C7",
    },
    {
      shell: "#FFF9F3",
      bubble1: "#FDE68A",
      bubble2: "#FECACA",
      iconBg: "#FEF3C7",
      icon: "book-education-outline",
      iconType: "mci",
      iconColor: "#D97706",
    },
    {
      shell: "#F4FFF7",
      bubble1: "#BBF7D0",
      bubble2: "#DDD6FE",
      iconBg: "#DCFCE7",
      icon: "flask-outline",
      iconType: "ion",
      iconColor: "#16A34A",
    },
  ];

  return variants[index % variants.length];
};

const SubjectArt = ({ index }) => {
  const v = getVariant(index);

  return (
    <View style={[styles.artWrap, { backgroundColor: v.shell }]}>
      <View style={[styles.blobA, { backgroundColor: v.bubble1 }]} />
      <View style={[styles.blobB, { backgroundColor: v.bubble2 }]} />
      <View style={[styles.mainIconCircle, { backgroundColor: v.iconBg }]}>
        {v.iconType === "mci" ? (
          <MaterialCommunityIcons name={v.icon} size={24} color={v.iconColor} />
        ) : (
          <Ionicons name={v.icon} size={24} color={v.iconColor} />
        )}
      </View>
      <View style={styles.dotPurple} />
      <View style={styles.dotYellow} />
    </View>
  );
};

export default function Subjects({ route }) {
  const navigation = useNavigation();
  const gradeLabel = route?.params?.grade || "Grade 4";

  const gradeNumber = useMemo(() => parseGradeNumber(gradeLabel), [gradeLabel]);
  const gradeTitle = useMemo(() => gradeToWordLabel(gradeLabel), [gradeLabel]);

  const {
    data: gradeDoc,
    isLoading,
    isError,
    refetch,
  } = useGetGradeDetailQuery(gradeNumber, {
    skip: !gradeNumber,
  });

  const subjects = useMemo(() => {
    if (!gradeDoc) return [];

    if (gradeNumber >= 1 && gradeNumber <= 11) {
      const list = Array.isArray(gradeDoc?.subjects) ? gradeDoc.subjects : [];
      return list.map((s, index) => ({
        key: s?._id || `${s?.subject || "subject"}-${index}`,
        label: s?.subject || "—",
      }));
    }

    return [];
  }, [gradeDoc, gradeNumber]);

  if (isLoading) {
    return (
      <View style={styles.centerState}>
        <ActivityIndicator size="small" color={PRIMARY} />
        <Text style={styles.stateText}>Loading subjects...</Text>
      </View>
    );
  }

  if (isError) {
    return (
      <View style={styles.centerState}>
        <Ionicons name="alert-circle-outline" size={34} color="#DC2626" />
        <Text style={styles.stateTitle}>Failed to load subjects</Text>
        <Pressable onPress={refetch} style={styles.retryBtn}>
          <Text style={styles.retryText}>Try again</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={[
        styles.content,
        subjects.length <= 4 && styles.contentCentered,
      ]}
      showsVerticalScrollIndicator={false}
    >
      {subjects.map((item, index) => (
        <Pressable
          key={item.key}
          style={({ pressed }) => [
            styles.subjectCard,
            pressed && styles.subjectCardPressed,
          ]}
          onPress={() =>
            navigation.navigate("EnrollSubjects", {
              grade: gradeLabel,
              gradeNumber,
              subjectName: item.label,
            })
          }
        >
          <SubjectArt index={index} />

          <View style={styles.textSection}>
            <Text style={styles.gradeText}>{gradeTitle}</Text>
            <Text style={styles.subjectText}>Subject - {item.label}</Text>
          </View>

          <View style={styles.arrowWrap}>
            <Ionicons name="chevron-forward" size={22} color="#64748B" />
          </View>
        </Pressable>
      ))}

      {subjects.length === 0 && (
        <View style={styles.centerState}>
          <Ionicons name="folder-open-outline" size={34} color="#64748B" />
          <Text style={styles.stateTitle}>No subjects found</Text>
          <Text style={styles.stateText}>No subjects are available for this grade yet.</Text>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: BG,
  },

  content: {
    paddingHorizontal: 12,
    paddingVertical: 16,
    paddingBottom: 28,
  },

  contentCentered: {
    flexGrow: 1,
    justifyContent: "center",
  },

  subjectCard: {
    minHeight: 132,
    backgroundColor: "#fffefe",
    borderRadius: 26,
    marginBottom: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 3,
  },

  subjectCardPressed: {
    transform: [{ scale: 0.985 }],
    opacity: 0.96,
  },

  artWrap: {
    width: 96,
    height: 96,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 14,
    overflow: "hidden",
    position: "relative",
  },

  blobA: {
    position: "absolute",
    width: 54,
    height: 54,
    borderRadius: 18,
    top: 12,
    left: 10,
    opacity: 0.9,
  },

  blobB: {
    position: "absolute",
    width: 46,
    height: 46,
    borderRadius: 16,
    bottom: 12,
    right: 10,
    opacity: 0.9,
  },

  mainIconCircle: {
    width: 52,
    height: 52,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 2,
  },

  dotPurple: {
    position: "absolute",
    top: 16,
    right: 14,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#A855F7",
  },

  dotYellow: {
    position: "absolute",
    bottom: 16,
    left: 16,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#F59E0B",
  },

  textSection: {
    flex: 1,
    justifyContent: "center",
    paddingRight: 8,
  },

  gradeText: {
    fontSize: 18,
    fontWeight: "900",
    color: "#111111",
    marginBottom: 4,
  },

  subjectText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#111111",
    lineHeight: 20,
  },

  arrowWrap: {
    width: 34,
    alignItems: "center",
    justifyContent: "center",
  },

  centerState: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
    backgroundColor: BG,
  },

  stateTitle: {
    marginTop: 10,
    fontSize: 15,
    fontWeight: "800",
    color: "#0F172A",
    textAlign: "center",
  },

  stateText: {
    marginTop: 8,
    fontSize: 12,
    fontWeight: "600",
    color: "#64748B",
    textAlign: "center",
  },

  retryBtn: {
    marginTop: 14,
    backgroundColor: PRIMARY,
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 12,
  },

  retryText: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "800",
  },
});