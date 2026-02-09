import React, { useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Platform,
  ScrollView,
} from "react-native";
import { useFonts } from "expo-font";

import CrossWebView from "../components/CrossWebView";
import YoutubePlayerBox from "../components/YoutubePlayerBox";

const { width } = Dimensions.get("window");

function getYouTubeId(url = "") {
  if (!url) return "";

  const shortMatch = url.match(/youtu\.be\/([A-Za-z0-9_-]{6,})/);
  if (shortMatch?.[1]) return shortMatch[1];

  const watchMatch = url.match(/[?&]v=([A-Za-z0-9_-]{6,})/);
  if (watchMatch?.[1]) return watchMatch[1];

  const embedMatch = url.match(/youtube\.com\/embed\/([A-Za-z0-9_-]{6,})/);
  if (embedMatch?.[1]) return embedMatch[1];

  return "";
}

export default function ReviewComponent({ route }) {
  const [fontsLoaded] = useFonts({
    FMEmanee: require("../assets/fonts/FMEmanee x.ttf"),
  });

  // ✅ you can pass an array: route.params.reviews
  // If not, it will use 3 demo cards
  const reviews =
    route?.params?.reviews ?? [
      {
        youtubeUrl: route?.params?.youtubeUrl ?? "https://youtu.be/yj0XRIJRuDY",
        description:
          route?.params?.description ??
          `f,ais biafldaf,a  hkq orejkaf.a wOHdmkh myiq" kùk iy úYajdiodhl f,i f.khkak ks¾udKh l<  wOHdmk fhÿuls'`,
      },
      {
        youtubeUrl: "https://youtu.be/8k7b7_-FiWU",
        description: `fuu fhÿu YsIHhkag iy foudmshkag tlu fõÈldjla ;=<ska Wiia .=Kd;aul wOHdmk w;aoelSula ,nd§u wruqKq lr.ksñka ixj¾Okh lr we;'`,
      },
      {
        youtubeUrl: "https://youtu.be/ETQA_J5Ebzw",
        description: `wjia:dj ,ndfohs' fuu fhÿu foudmshkag ;u orejdf.a wOHdmk .uk úYajdifhka iy wdrlaIs;j ksÍlaIKh lsÍug WmldÍ jk w;r"`,
      },
    ];

  const CARD_GAP = 12;
  const CARD_W = Math.round(width * 0.88);
  const SIDE_PADDING = Math.round((width - CARD_W) / 2);

  if (!fontsLoaded) return null;

  return (
    <View style={styles.wrapper}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        decelerationRate="fast"
        snapToInterval={CARD_W + CARD_GAP}
        snapToAlignment="start"
        contentContainerStyle={{ paddingHorizontal: SIDE_PADDING }}
      >
        {reviews.map((item, index) => {
          const videoId = getYouTubeId(item.youtubeUrl);
          const playerHeight = Math.round((CARD_W - 28) * 0.56); // based on card padding

          const playerHtml = (() => {
            if (!videoId) return "";

            const src =
              `https://www.youtube-nocookie.com/embed/${videoId}` +
              `?playsinline=1&rel=0&modestbranding=1&iv_load_policy=3&fs=1&controls=1`;

            return `
              <!DOCTYPE html>
              <html>
                <head>
                  <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1"/>
                  <style>
                    html, body { margin:0; padding:0; width:100%; height:100%; background:#0B1220; overflow:hidden; }
                    iframe { width:100%; height:100%; border:0; display:block; background:#0B1220; }
                  </style>
                </head>
                <body>
                  <iframe
                    src="${src}"
                    allow="autoplay; encrypted-media; picture-in-picture"
                    allowfullscreen
                  ></iframe>
                </body>
              </html>
            `;
          })();

          return (
            <View
              key={`review-${index}`}
              style={[
                styles.card,
                { width: CARD_W, marginRight: index === reviews.length - 1 ? 0 : CARD_GAP },
              ]}
            >
              <View style={[styles.playerBox, { height: playerHeight }]}>
                {!videoId ? (
                  <View style={styles.playerFallback}>
                    <Text style={styles.fallbackText}>Invalid YouTube link</Text>
                  </View>
                ) : Platform.OS === "web" ? (
                  <CrossWebView source={{ html: playerHtml }} style={styles.webview} />
                ) : (
                  <YoutubePlayerBox videoId={videoId} height={playerHeight} />
                )}
              </View>

              <Text style={styles.desc}>{item.description}</Text>
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    width: "100%",
    marginTop: 10,
    marginBottom: 10,
  },

  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 14,

   
  },

  playerBox: {
    width: "100%",
    borderRadius: 14,
    overflow: "hidden",
    backgroundColor: "#0B1220",
    marginBottom: 12,
  },

  webview: { width: "100%", height: "100%", backgroundColor: "transparent" },

  playerFallback: { flex: 1, alignItems: "center", justifyContent: "center" },
  fallbackText: { color: "#FFFFFF", fontWeight: "800" },

  desc: {
    fontSize: 14,
    color: "#334155",
    lineHeight: 22,
    fontFamily: "FMEmanee",
  },
});
