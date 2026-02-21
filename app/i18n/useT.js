// app/i18n/useT.js
import { useMemo } from "react";
import { useSelector } from "react-redux";
import { translations } from "./translations";
import { getSinhalaFont, getNavSinhalaFont } from "./font";

export default function useT() {
  const lang = useSelector((s) => s?.languageSelection?.language || "si");

  const dict = useMemo(() => translations[lang] || translations.si, [lang]);

  const t = (key) => dict?.[key] ?? translations.si?.[key] ?? key;

  const sinFont = (weight = "regular") => getSinhalaFont(lang, weight);
  const navFont = (weight = "regular") => getNavSinhalaFont(lang, weight);

  return { t, lang, sinFont, navFont };
}