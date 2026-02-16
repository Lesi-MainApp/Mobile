import React, { useMemo, useState } from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import { useDispatch } from "react-redux";
import { LinearGradient } from "expo-linear-gradient";

import { setLanguage } from "../app/features/languageSelectionSlice";
import useT from "../app/i18n/useT";

const PRIMARY = "#214294";
const CARD = "#F1F5F9";

export default function LanguageSelect({ navigation }) {
  const dispatch = useDispatch();
  const { t, sinFont } = useT();

  const [selected, setSelected] = useState("si");

  const onPick = (lang) => {
    const v = lang === "en" ? "en" : "si";
    setSelected(v);
    dispatch(setLanguage(v));
  };

  const onContinue = () => {
    // ✅ no async storage, no backend required here
    navigation.replace("Sign");
  };

  const btnStyle = useMemo(
    () => (active) => [
      styles.langBtn,
      active ? styles.langBtnActive : styles.langBtnInactive,
    ],
    []
  );

  return (
    <View style={styles.page}>
      <Text style={[styles.title, sinFont("bold")]}>{t("selectLanguage")}</Text>

      <View style={styles.box}>
        <Pressable onPress={() => onPick("si")} style={btnStyle(selected === "si")}>
          <Text
            style={[
              styles.langText,
              selected === "si" && styles.langTextActive,
              sinFont("bold"),
            ]}
          >
            {t("sinhala")}
          </Text>
        </Pressable>

        <Pressable onPress={() => onPick("en")} style={btnStyle(selected === "en")}>
          <Text style={[styles.langText, selected === "en" && styles.langTextActive]}>
            {t("english")}
          </Text>
        </Pressable>
      </View>

      <Pressable onPress={onContinue} style={styles.gradientBtnOuter}>
        <LinearGradient
          colors={["#086DFF", "#5E9FFD", "#7DB1FC", "#62C4F6", "#48D7F0", "#C7F4F8"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.gradientBtn}
        >
          <Text style={[styles.gradientBtnText, sinFont("bold")]}>{t("continue")}</Text>
        </LinearGradient>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 22,
    fontWeight: "900",
    color: PRIMARY,
    marginBottom: 18,
  },
  box: {
    width: "100%",
    backgroundColor: CARD,
    borderRadius: 18,
    padding: 10,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    gap: 10,
  },
  langBtn: {
    height: 56,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  langBtnActive: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#BFDBFE",
  },
  langBtnInactive: { backgroundColor: "transparent" },
  langText: {
    fontSize: 16,
    fontWeight: "800",
    color: "#64748B",
  },
  langTextActive: { color: PRIMARY },
  gradientBtnOuter: {
    width: "100%",
    borderRadius: 16,
    overflow: "hidden",
    marginTop: 14,
  },
  gradientBtn: {
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 16,
  },
  gradientBtnText: { color: "#FFFFFF", fontSize: 15, fontWeight: "900" },
});
