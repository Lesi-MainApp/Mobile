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

import useT from "../app/i18n/useT";

const BG_INPUT = "#F1F5F9";
const PLACEHOLDER = "#97A4B8";
const PRIMARY = "#214294";

export default function ForgotPassword({ navigation, route }) {
  const dispatch = useDispatch();
  const { t, sinFont } = useT();

  const step = route?.params?.step || "send";
  const identifierFromOtp = route?.params?.identifier || "";
  const codeFromOtp = route?.params?.code || "";

  const [identifier, setIdentifier] = useState(identifierFromOtp || "");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [loading, setLoading] = useState(false);

  const [forgotSendOtp] = useForgotSendOtpMutation();
  const [forgotReset] = useForgotResetMutation();
  const [signin] = useSigninMutation();

  useEffect(() => {
    if (identifierFromOtp) setIdentifier(identifierFromOtp);
  }, [identifierFromOtp]);

  const isResetStep = useMemo(() => step === "reset", [step]);

  const onSendOtp = async () => {
    try {
      const id = identifier.trim();
      if (!id) {
        Alert.alert("Forgot Password", "Please enter your phone number or email");
        return;
      }

      setLoading(true);

      await forgotSendOtp({ identifier: id }).unwrap();

      Alert.alert("OTP Sent", "We sent OTP to your WhatsApp + Email.");

      navigation.navigate("OTP", {
        phone: id,
        flow: "forgot",
      });
    } catch (e) {
      const msg = e?.data?.message || e?.message || "Failed to send OTP";
      Alert.alert("Error", msg);
    } finally {
      setLoading(false);
    }
  };

  const onReset = async () => {
    try {
      const id = identifier.trim();
      const code = String(codeFromOtp || "").trim();

      if (!id) {
        Alert.alert("Reset Password", "Missing phone number or email");
        return;
      }
      if (!code || code.length !== 6) {
        Alert.alert("Reset Password", "OTP is missing or invalid");
        navigation.replace("OTP", { phone: id, flow: "forgot" });
        return;
      }

      if (!newPassword || !confirmPassword) {
        Alert.alert("Reset Password", "Please enter and confirm your new password");
        return;
      }

      if (String(newPassword) !== String(confirmPassword)) {
        Alert.alert("Reset Password", "Passwords do not match");
        return;
      }

      setLoading(true);

      await forgotReset({
        identifier: id,
        code,
        newPassword,
        confirmPassword,
      }).unwrap();

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

      Alert.alert("Success", "Password reset successful. Please sign in.");
      navigation.replace("Sign", { mode: "signin", phone: "" });
    } catch (e) {
      const msg = e?.data?.message || e?.message || "Failed to reset password";
      Alert.alert("Error", msg);
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

        <Field
          placeholder={t("fpPlaceholderIdentifier")}
          placeholderFont={sinFont()}
          value={identifier}
          onChangeText={setIdentifier}
          autoCapitalize="none"
          editable={!isResetStep}
        />

        {isResetStep && (
          <>
            <Field
              placeholder={t("fpPlaceholderNewPassword")}
              placeholderFont={sinFont()}
              value={newPassword}
              onChangeText={setNewPassword}
              secureTextEntry
            />
            <Field
              placeholder={t("fpPlaceholderConfirmPassword")}
              placeholderFont={sinFont()}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry
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
           
          </Pressable>
        )}
      </View>
    </KeyboardAvoidingView>
  );
}

function Field({
  placeholder,
  placeholderFont,
  value,
  onChangeText,
  secureTextEntry,
  autoCapitalize,
  editable = true,
}) {
  const empty = !String(value || "").length;

  return (
    <View style={styles.inputWrap}>
      {empty ? (
        <Text
          pointerEvents="none"
          style={[styles.fakePlaceholder, placeholderFont]}
          numberOfLines={1}
        >
          {placeholder}
        </Text>
      ) : null}

      <TextInput
        placeholder=""
        placeholderTextColor="transparent"
        value={value}
        onChangeText={onChangeText}
        secureTextEntry={secureTextEntry}
        autoCapitalize={autoCapitalize}
        editable={editable}
        allowFontScaling={false}
        underlineColorAndroid="transparent"
        style={[styles.input, styles.realInputLayer]}
      />
    </View>
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

  inputWrap: {
    width: "100%",
    position: "relative",
    marginBottom: 12,
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
  },

  realInputLayer: {
    zIndex: 1,
    elevation: 1,
  },

  fakePlaceholder: {
    position: "absolute",
    left: 14,
    right: 14,
    top: Platform.OS === "ios" ? 15 : 0,
    height: 48,
    color: PLACEHOLDER,
    fontSize: 14,
    fontWeight: "400",
    textAlignVertical: "center",
    zIndex: 5,
    elevation: 5,
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