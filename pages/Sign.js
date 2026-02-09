import React, { useMemo, useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  Pressable,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
  ActivityIndicator,
  Modal,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";

import lesiiskole_logo from "../assets/lesiiskole_logo.png";

import { useDispatch, useSelector } from "react-redux";
import {
  setToken,
  setPendingIdentity,
  setSignupDistrict,
  clearGradeSelection,
} from "../app/features/authSlice";
import { setUser, updateUserFields } from "../app/features/userSlice";

import { useSignupMutation, useSigninMutation } from "../app/authApi";
import { useSaveStudentGradeSelectionMutation } from "../app/userApi";

const BG_INPUT = "#F1F5F9";
const PLACEHOLDER = "#97A4B8";
const PRIMARY = "#214294";

const SRI_LANKA_DISTRICTS = [
  "Ampara","Anuradhapura","Badulla","Batticaloa","Colombo","Galle","Gampaha",
  "Hambantota","Jaffna","Kalutara","Kandy","Kegalle","Kilinochchi","Kurunegala",
  "Mannar","Matale","Matara","Monaragala","Mullaitivu","Nuwara Eliya","Polonnaruwa",
  "Puttalam","Ratnapura","Trincomalee","Vavuniya",
];

const parseGradeNumber = (gradeLabel) => {
  const m = String(gradeLabel || "").match(/(\d{1,2})/);
  return m ? Number(m[1]) : null;
};

export default function Sign({ navigation, route }) {
  const dispatch = useDispatch();

  const [signup] = useSignupMutation();
  const [signin] = useSigninMutation();
  const [saveGradeSelection] = useSaveStudentGradeSelectionMutation();

  const selectedLevel = useSelector((s) => s?.auth?.selectedLevel);
  const selectedGrade = useSelector((s) => s?.auth?.selectedGrade);
  const selectedStream = useSelector((s) => s?.auth?.selectedStream);

  const [loading, setLoading] = useState(false);

  const [mode, setMode] = useState(route?.params?.mode || "signup");
  const isSignUp = mode === "signup";

  // Signup fields
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState(route?.params?.phone || "");
  const [district, setDistrict] = useState("");
  const [town, setTown] = useState("");
  const [address, setAddress] = useState("");
  const [passwordUp, setPasswordUp] = useState("");

  // Signin fields
  const [phoneIn, setPhoneIn] = useState(route?.params?.phone || "");
  const [passwordIn, setPasswordIn] = useState("");

  const [districtModal, setDistrictModal] = useState(false);

  const toggleBtnStyle = useMemo(
    () => (active) => [
      styles.toggleBtn,
      active ? styles.toggleBtnActive : styles.toggleBtnInactive,
    ],
    []
  );

  const toggleTextStyle = useMemo(
    () => (active) => [
      styles.toggleText,
      active ? styles.toggleTextActive : styles.toggleTextInactive,
    ],
    []
  );

  const trySaveSelectionOnce = async (userFromLogin) => {
    if (userFromLogin?.role !== "student") return;
    if (userFromLogin?.gradeSelectionLocked) return;

    const gNum = parseGradeNumber(selectedGrade);
    if (!selectedLevel || !gNum) return;

    try {
      const resp = await saveGradeSelection({
        level: selectedLevel,
        gradeNumber: gNum,
        stream: selectedLevel === "al" ? selectedStream : null,
      }).unwrap();

      if (resp?.user) dispatch(updateUserFields(resp.user));
      dispatch(clearGradeSelection());
    } catch (e) {
      const status = e?.status || e?.originalStatus;
      if (status === 409) return;
      console.log("save grade selection failed:", e);
    }
  };

  // ✅ frontend required validation (signup)
  const validateSignup = () => {
    const n = name.trim();
    const em = email.trim();
    const ph = phone.trim();
    const dis = district.trim();
    const tw = town.trim();
    const ad = address.trim();
    const pw = String(passwordUp || "");

    if (!n) return "Name is required";
    if (!em) return "Email is required";
    if (!ph) return "Phone number is required";
    if (!dis) return "District is required";
    if (!tw) return "Town is required";
    if (!ad) return "Address is required";
    if (!pw) return "Password is required";
    if (pw.length < 6) return "Password must be at least 6 characters";
    return null;
  };

  const onContinue = async () => {
    try {
      setLoading(true);

      if (isSignUp) {
        const err = validateSignup();
        if (err) {
          Alert.alert("Required", err);
          setLoading(false);
          return;
        }

        const payload = {
          name: name.trim(),
          email: email.trim(),
          whatsappnumber: phone.trim(),
          password: passwordUp,
          role: "student",

          district: district.trim(),
          town: town.trim(),
          address: address.trim(),
        };

        dispatch(setSignupDistrict(payload.district));

        await signup(payload).unwrap();

        dispatch(
          setPendingIdentity({
            phone: payload.whatsappnumber,
            email: payload.email,
          })
        );

        Alert.alert("OTP Sent", "We sent OTP to your WhatsApp + Email.");

        navigation.navigate("OTP", {
          phone: payload.whatsappnumber,
          flow: "signup",
        });
        return;
      }

      // ✅ Signin
      const loginPayload = {
        whatsappnumber: phoneIn.trim(),
        password: passwordIn,
      };

      const res = await signin(loginPayload).unwrap();

      dispatch(setToken(res?.token || null));
      dispatch(setUser(res?.user || null));

      await trySaveSelectionOnce(res?.user);

      navigation.replace("Home");
    } catch (e) {
      const msg = e?.data?.message || e?.message || "Something went wrong";
      Alert.alert("Error", msg);
    } finally {
      setLoading(false);
    }
  };

  const DistrictPicker = () => (
    <Modal visible={districtModal} transparent animationType="fade">
      <Pressable style={styles.modalOverlay} onPress={() => setDistrictModal(false)}>
        <Pressable style={styles.modalCard} onPress={() => {}}>
          <Text style={styles.modalTitle}>Select District</Text>

          <ScrollView style={{ maxHeight: 420 }} showsVerticalScrollIndicator={false}>
            {SRI_LANKA_DISTRICTS.map((d) => (
              <Pressable
                key={d}
                style={styles.modalItem}
                onPress={() => {
                  setDistrict(d);
                  setDistrictModal(false);
                }}
              >
                <Text style={styles.modalItemText}>{d}</Text>
              </Pressable>
            ))}
          </ScrollView>
        </Pressable>
      </Pressable>
    </Modal>
  );

  // ✅ SIGNIN
  if (!isSignUp) {
    return (
      <KeyboardAvoidingView
        style={styles.page}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <View style={styles.centerSignin}>
          <Image source={lesiiskole_logo} style={styles.logoSmall} resizeMode="contain" />
          <Text style={styles.welcome}>Welcome</Text>

          <View style={styles.toggleContainer}>
            <Pressable onPress={() => setMode("signup")} style={toggleBtnStyle(false)}>
              <Text style={toggleTextStyle(false)}>Sign Up</Text>
            </Pressable>

            <Pressable onPress={() => setMode("signin")} style={toggleBtnStyle(true)}>
              <Text style={toggleTextStyle(true)}>Sign In</Text>
            </Pressable>
          </View>

          <View style={styles.form}>
            <Field
              placeholder="Phone Number"
              value={phoneIn}
              onChangeText={setPhoneIn}
              keyboardType="phone-pad"
            />
            <Field
              placeholder="Password"
              value={passwordIn}
              onChangeText={setPasswordIn}
              secureTextEntry
            />

            <Pressable
              onPress={() => navigation.navigate("ForgotPassword")}
              style={styles.forgotWrap}
            >
              <Text style={styles.forgotText}>Forgot password?</Text>
            </Pressable>

            <Pressable onPress={onContinue} style={styles.gradientBtnOuter}>
              <LinearGradient
                colors={["#086DFF", "#5E9FFD", "#7DB1FC", "#62C4F6", "#48D7F0", "#C7F4F8"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.gradientBtn}
              >
                {loading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.gradientBtnText}>Continue</Text>
                )}
              </LinearGradient>
            </Pressable>
          </View>
        </View>
      </KeyboardAvoidingView>
    );
  }

  // ✅ SIGNUP
  return (
    <KeyboardAvoidingView
      style={styles.page}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <DistrictPicker />

      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <Image source={lesiiskole_logo} style={styles.logo} resizeMode="contain" />
        <Text style={styles.welcome}>Welcome</Text>

        <View style={styles.toggleContainer}>
          <Pressable onPress={() => setMode("signup")} style={toggleBtnStyle(true)}>
            <Text style={toggleTextStyle(true)}>Sign Up</Text>
          </Pressable>

          <Pressable onPress={() => setMode("signin")} style={toggleBtnStyle(false)}>
            <Text style={toggleTextStyle(false)}>Sign In</Text>
          </Pressable>
        </View>

        <View style={styles.form}>
          <Field placeholder="Name" value={name} onChangeText={setName} />
          <Field
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          <Field
            placeholder="Phone Number"
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
          />

          <Pressable
            onPress={() => setDistrictModal(true)}
            style={[styles.input, { justifyContent: "center" }]}
          >
            <Text style={{ color: district ? "#0F172A" : PLACEHOLDER, fontWeight: "700" }}>
              {district || "District"}
            </Text>
          </Pressable>

          <Field placeholder="Town" value={town} onChangeText={setTown} />
          <Field
            placeholder="Address"
            value={address}
            onChangeText={setAddress}
            multiline
            style={{ minHeight: 90, textAlignVertical: "top", paddingTop: 12 }}
          />
          <Field
            placeholder="Password"
            value={passwordUp}
            onChangeText={setPasswordUp}
            secureTextEntry
          />

          <Pressable onPress={onContinue} style={styles.gradientBtnOuter}>
            <LinearGradient
              colors={["#086DFF", "#5E9FFD", "#7DB1FC", "#62C4F6", "#48D7F0", "#C7F4F8"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.gradientBtn}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.gradientBtnText}>Continue</Text>
              )}
            </LinearGradient>
          </Pressable>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

function Field({
  placeholder,
  value,
  onChangeText,
  keyboardType,
  secureTextEntry,
  autoCapitalize,
  multiline,
  style,
}) {
  return (
    <TextInput
      placeholder={placeholder}
      placeholderTextColor={PLACEHOLDER}
      value={value}
      onChangeText={onChangeText}
      keyboardType={keyboardType}
      secureTextEntry={secureTextEntry}
      autoCapitalize={autoCapitalize}
      multiline={multiline}
      style={[styles.input, style]}
    />
  );
}

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: "#FFFFFF" },

  container: {
    paddingHorizontal: 18,
    paddingTop: 18,
    paddingBottom: 28,
    alignItems: "center",
  },

  logo: { width: 140, height: 140, marginBottom: 4 },
  logoSmall: { width: 120, height: 120, marginBottom: 20 },

  centerSignin: {
    flex: 1,
    paddingHorizontal: 18,
    alignItems: "center",
    justifyContent: "center",
  },

  welcome: {
    fontSize: 26,
    fontWeight: "700",
    color: PRIMARY,
    marginBottom: 12,
    marginTop: -25,
  },

  toggleContainer: {
    width: "100%",
    backgroundColor: BG_INPUT,
    borderRadius: 16,
    padding: 6,
    flexDirection: "row",
    gap: 6,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    marginBottom: 18,
  },

  toggleBtn: {
    flex: 1,
    height: 44,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  toggleBtnActive: { backgroundColor: "#FFFFFF" },
  toggleBtnInactive: { backgroundColor: "transparent" },

  toggleText: { fontSize: 14, fontWeight: "500" },
  toggleTextActive: { color: PRIMARY },
  toggleTextInactive: { color: "#64748B" },

  form: { width: "100%", gap: 10 },

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

  forgotWrap: { alignSelf: "flex-end", marginTop: 2, marginBottom: 6 },
  forgotText: { color: PRIMARY, fontSize: 12, fontWeight: "700" },

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

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(15, 23, 42, 0.45)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 18,
  },
  modalCard: {
    width: "100%",
    maxWidth: 420,
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 14,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: "#0F172A",
    marginBottom: 10,
  },
  modalItem: {
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderRadius: 12,
    backgroundColor: "#F8FAFC",
    marginBottom: 8,
  },
  modalItemText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#214294",
  },
});
