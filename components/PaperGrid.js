import React, { useRef, useState, useEffect } from "react";
import { View, Text, StyleSheet, Pressable, Animated, Image } from "react-native";
import { useNavigation } from "@react-navigation/native";

import topicwisepaper from "../assets/topicwisepaper.png";
import pastpapers from "../assets/pastpapers.png";
import modelpapers from "../assets/modelpapers.png";
import dailyquizz from "../assets/dailyquizz.png";

import useT from "../app/i18n/useT";

export default function PaperGrid() {
  const navigation = useNavigation();
  const { t, sinFont } = useT();

  const [active, setActive] = useState(null);
  const timeoutRef = useRef(null);

  const scales = [
    useRef(new Animated.Value(1)).current,
    useRef(new Animated.Value(1)).current,
    useRef(new Animated.Value(1)).current,
    useRef(new Animated.Value(1)).current,
  ];

  const papers = [
    { title: t("dailyQuiz"), img: dailyquizz, route: "DailyQuiz" },
    { title: t("topicWise"), img: topicwisepaper, route: "TopicWisePaper" },
    { title: t("modelPapers"), img: modelpapers, route: "ModelPaper" },
    { title: t("pastPapers"), img: pastpapers, route: "PastPapers" },
  ];

  useEffect(() => {
    return () => timeoutRef.current && clearTimeout(timeoutRef.current);
  }, []);

  const zoomOut = (index) => {
    Animated.spring(scales[index], {
      toValue: 1,
      useNativeDriver: true,
      friction: 6,
    }).start();
    setActive(null);
  };

  const onPressCard = (index) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    if (active !== null && active !== index) zoomOut(active);

    Animated.spring(scales[index], {
      toValue: 1.06,
      useNativeDriver: true,
      friction: 6,
    }).start();

    setActive(index);

    const selected = papers[index];
    timeoutRef.current = setTimeout(() => {
      zoomOut(index);
      if (selected?.route) navigation.navigate(selected.route);
    }, 180);
  };

  return (
    <View style={styles.grid}>
      {papers.map((item, idx) => (
        <Pressable key={`${idx}`} onPress={() => onPressCard(idx)} style={styles.cardWrap}>
          <Animated.View style={[styles.card, { transform: [{ scale: scales[idx] }] }]}>
            <Image source={item.img} style={styles.icon} />
            <Text style={[styles.text, sinFont("bold")]} numberOfLines={2}>
              {item.title}
            </Text>
          </Animated.View>
        </Pressable>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    marginTop: 12,
    paddingBottom: 16,
  },
  cardWrap: { width: "48%", height: 140, marginBottom: 12 },
  card: {
    flex: 1,
    backgroundColor: "#FDFEFF",
    borderRadius: 16,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    fontSize: 14,
    fontWeight: "700",
    color: "#0F172A",
    textAlign: "center",
    marginBottom: 8,
    paddingHorizontal: 8,
  },
  icon: { width: 80, height: 80, resizeMode: "contain" },
});
