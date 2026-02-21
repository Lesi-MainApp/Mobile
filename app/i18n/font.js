// app/i18n/font.js

// ✅ Other pages Sinhala mode = FMEmaneex
export const SIN_FONT_REGULAR = "FMEmaneex";
export const SIN_FONT_BOLD = "FMEmaneex";

export const getSinhalaFont = (lang, weight = "regular") => {
  if (lang !== "si") return {};
  return {
    fontFamily: weight === "bold" ? SIN_FONT_BOLD : SIN_FONT_REGULAR,
    fontWeight: "normal", // ✅ ANDROID FIX
    fontStyle: "normal",
  };
};

export const getNavSinhalaFont = (lang, weight = "regular") => {
  if (lang !== "si") return {};
  return {
    fontFamily: weight === "bold" ? SIN_FONT_BOLD : SIN_FONT_REGULAR,
    fontWeight: "normal", // ✅ ANDROID FIX
    fontStyle: "normal",
  };
};