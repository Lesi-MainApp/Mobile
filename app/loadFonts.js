// app/loadAppFonts.js
import * as Font from "expo-font";

export async function loadAppFonts() {
  await Font.loadAsync({
    FM_Derana: require("../assets/fonts/FMEmaneex.ttf"),
  });
}
