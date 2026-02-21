// pages/ForgotPassword.js
import React, { useEffect, useMemo, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ActivityIndicator,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";

import {
  useForgotSendOtpMutation,
  useForgotResetMutation,
  useSigninMutation,
} from "../app/authApi";
import { useDispatch } from "react-redux";
import { setAuth } from "../app/features/authSlice";

// ✅ i18n
import useT from "../app/i18n/useT";

const BG_INPUT = "#F1F5F9";
const PLACEHOLDER = "#97A4B8";
const PRIMARY = "#214294";

export default function ForgotPassword({ navigation, route }) {
  const dispatch = useDispatch();
  const { t, sinFont } = useT();

  // ✅ step control via route params
  // send: default
  // reset: after OTP verified
  const step = route?.params?.step || "send"; // "send" | "reset"
  const identifierFromOtp = route?.params?.identifier || ""; // phone or email
  const codeFromOtp = route?.params?.code || ""; // 6 digit code

  // ✅ UI state
  const [identifier, setIdentifier] = useState(identifierFromOtp || "");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [loading, setLoading] = useState(false);

  const [forgotSendOtp] = useForgotSendOtpMutation();
  const [forgotReset] = useForgotResetMutation();
  const [signin] = useSigninMutation();

  // ✅ keep identifier in sync when coming back from OTP
  useEffect(() => {
    if (identifierFromOtp) setIdentifier(identifierFromOtp);
  }, [identifierFromOtp]);

  const isResetStep = useMemo(() => step === "reset", [step]);

  // ✅ SEND OTP
  const onSendOtp = async () => {
    try {
      const id = identifier.trim();
      if (!id) {
        Alert.alert(t("forgotPasswordTitle"), t("fpEnterIdentifier"));
        return;
      }

      setLoading(true);

      await forgotSendOtp({ identifier: id }).unwrap();

      Alert.alert(t("otpSentTitle"), t("fpOtpSentMsg"));

      // ✅ go OTP screen for forgot flow
      navigation.navigate("OTP", {
        phone: id, // can be phone or email
        flow: "forgot",
      });
    } catch (e) {
      const msg = e?.data?.message || e?.message || t("fpSendFailed");
      Alert.alert(t("errorTitle"), msg);
    } finally {
      setLoading(false);
    }
  };

  // ✅ RESET PASSWORD (same page)
  const onReset = async () => {
    try {
      const id = identifier.trim();
      const code = String(codeFromOtp || "").trim();

      if (!id) {
        Alert.alert(t("resetPasswordTitle"), t("rpMissingIdentifier"));
        return;
      }
      if (!code || code.length !== 6) {
        Alert.alert(t("resetPasswordTitle"), t("rpOtpMissing"));
        navigation.replace("OTP", { phone: id, flow: "forgot" });
        return;
      }

      if (!newPassword || !confirmPassword) {
        Alert.alert(t("resetPasswordTitle"), t("rpEnterPasswords"));
        return;
      }

      if (String(newPassword) !== String(confirmPassword)) {
        Alert.alert(t("resetPasswordTitle"), t("rpPasswordsMismatch"));
        return;
      }

      setLoading(true);

      // ✅ backend will verify OTP internally and reset password
      await forgotReset({
        identifier: id,
        code,
        newPassword,
        confirmPassword,
      }).unwrap();

      // ✅ Auto-login ONLY if identifier is phone (because signin uses phone)
      if (!String(id).includes("@")) {
        const loginRes = await signin({
          whatsappnumber: id,
          password: newPassword,
        }).unwrap();

        dispatch(
          setAuth({
            user: loginRes?.user || null,
            token: loginRes?.token || null,
          })
        );
        navigation.replace("Home");
        return;
      }

      // ✅ If identifier is email, ask them to sign in manually (no phone for signin)
      Alert.alert(t("successTitle"), t("rpSuccessManualSignin"));
      navigation.replace("Sign", { mode: "signin", phone: "" });
    } catch (e) {
      const msg = e?.data?.message || e?.message || t("rpResetFailed");
      Alert.alert(t("errorTitle"), msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.page}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <View style={styles.container}>
        <Text style={[styles.title, sinFont("bold")]}>
          {isResetStep ? t("resetPasswordTitle") : t("forgotPasswordTitle")}
        </Text>

        <Text style={[styles.subTitle, sinFont()]}>
          {isResetStep ? t("fpResetSubtitle") : t("fpSendSubtitle")}
        </Text>

        {/* ✅ Identifier always shown (same design) */}
        <TextInput
          placeholder={t("fpPlaceholderIdentifier")}
          placeholderTextColor={PLACEHOLDER}
          value={identifier}
          onChangeText={setIdentifier}
          autoCapitalize="none"
          style={styles.input}
          editable={!isResetStep} // ✅ lock on reset step
          allowFontScaling={false}
        />

        {/* ✅ RESET FIELDS only after OTP verify */}
        {isResetStep && (
          <>
            <TextInput
              placeholder={t("fpPlaceholderNewPassword")}
              placeholderTextColor={PLACEHOLDER}
              value={newPassword}
              onChangeText={setNewPassword}
              secureTextEntry
              style={styles.input}
              allowFontScaling={false}
            />
            <TextInput
              placeholder={t("fpPlaceholderConfirmPassword")}
              placeholderTextColor={PLACEHOLDER}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry
              style={styles.input}
              allowFontScaling={false}
            />
          </>
        )}

        <Pressable
          onPress={isResetStep ? onReset : onSendOtp}
          style={styles.gradientBtnOuter}
        >
          <LinearGradient
            colors={[
              "#086DFF",
              "#5E9FFD",
              "#7DB1FC",
              "#62C4F6",
              "#48D7F0",
              "#C7F4F8",
            ]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.gradientBtn}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={[styles.gradientBtnText, sinFont("bold")]}>
                {isResetStep ? t("resetPasswordTitle") : t("fpSendOtpBtn")}
              </Text>
            )}
          </LinearGradient>
        </Pressable>

        <Pressable onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={[styles.backText, sinFont("bold")]}>{t("back")}</Text>
        </Pressable>

        {/* ✅ If user wants to re-verify OTP from reset screen */}
        {isResetStep && (
          <Pressable
            onPress={() =>
              navigation.replace("OTP", {
                phone: identifier.trim(),
                flow: "forgot",
              })
            }
            style={{ marginTop: 10 }}
          >
            <Text style={[{ color: PRIMARY, fontSize: 12, fontWeight: "900" }, sinFont("bold")]}>
              {t("fpVerifyOtpAgain")}
            </Text>
          </Pressable>
        )}
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: "#FFFFFF" },
  container: {
    flex: 1,
    paddingHorizontal: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  title: { fontSize: 22, fontWeight: "800", color: PRIMARY },
  subTitle: {
    marginTop: 8,
    fontSize: 12,
    fontWeight: "600",
    color: "#64748B",
    textAlign: "center",
    marginBottom: 18,
    lineHeight: 18,
  },
  input: {
    width: "100%",
    height: 48,
    borderRadius: 14,
    backgroundColor: BG_INPUT,
    paddingHorizontal: 14,
    color: "#0F172A",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    marginBottom: 12,
  },
  gradientBtnOuter: {
    width: "100%",
    borderRadius: 16,
    overflow: "hidden",
    marginTop: 6,
  },
  gradientBtn: {
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 16,
  },
  gradientBtnText: { color: "#FFFFFF", fontSize: 15, fontWeight: "900" },

  backBtn: { marginTop: 14 },
  backText: { color: PRIMARY, fontSize: 12, fontWeight: "900" },
});