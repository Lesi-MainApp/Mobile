import React, { useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Dimensions,
  Platform,
} from "react-native";

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
  const title = route?.params?.title ?? "uQ,sl .‚; l¾u";
  const youtubeUrl = route?.params?.youtubeUrl ?? "https://youtu.be/30cffBrABao";

  const description =
    route?.params?.description ??
    `f,ais biafldaf,a  hkq orejkaf.a wOHdmkh myiq" kùk iy úYajdiodhl f,i f.khkak ks¾udKh l<  wOHdmk fhÿuls'`;

  const videoId = useMemo(() => getYouTubeId(youtubeUrl), [youtubeUrl]);
  const playerHeight = Math.round((width - 32) * 0.56);

  const playerHtml = useMemo(() => {
    if (!videoId) return "";

    const src =
      `https://www.youtube-nocookie.com/embed/${videoId}` +
      `?playsinline=1&rel=0&modestbranding=1&controls=1`;

    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta name="viewport" content="width=device-width, initial-scale=1"/>
          <style>
            html, body { margin:0; padding:0; background:#0B1220; }
            iframe { width:100%; height:100%; border:0; }
          </style>
        </head>
        <body>
          <iframe src="${src}" allowfullscreen></iframe>
        </body>
      </html>
    `;
  }, [videoId]);

  return (
    <View style={styles.screen}>
      <ScrollView contentContainerStyle={styles.content}>
        {/* ✅ TITLE */}
        <Text style={styles.titleText} numberOfLines={1}>
          {title}
        </Text>

        {/* ✅ VIDEO */}
        <View style={styles.playerCard}>
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
        </View>

        {/* ✅ DESCRIPTION */}
        <Text style={styles.descText}>{description}</Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#F8FAFC" },
  content: { padding: 16, paddingBottom: 40 },

  /* ✅ Title like Live page style */
  titleText: {
    fontSize: 13,
    fontWeight: "900",
    color: "#0F172A",
    textAlign: "center",
    marginBottom: 10,
    lineHeight: 18,
  },

  /* ✅ Video */
  playerCard: { borderRadius: 18, marginBottom: 14 },
  playerBox: {
    width: "100%",
    borderRadius: 14,
    overflow: "hidden",
    backgroundColor: "#0B1220",
  },
  webview: { width: "100%", height: "100%" },

  playerFallback: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  fallbackText: {
    color: "#FFFFFF",
    fontWeight: "800",
  },

  /* ✅ Description like Live page style */
  descText: {
    fontSize: 10,
    fontWeight: "700",
    color: "#64748B",
    textAlign: "left",
    lineHeight: 16,
    marginTop: 6,
  },
});