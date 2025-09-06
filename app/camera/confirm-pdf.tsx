import React, { useMemo } from "react";
import { Image, View, StyleSheet, StatusBar } from "react-native";
import { getLatestCapture } from "../../state/capture";

function normalizeUri(u?: string) {
  if (!u) return undefined;
  // Ensure Android-friendly file:// prefix if needed
  if (u.startsWith("/")) return "file://" + u;
  return u;
}

export default function ConfirmScreen() {
  const raw = getLatestCapture();
  const imageUri = useMemo(() => normalizeUri(raw), [raw]);

  console.log("[confirm] uri", imageUri);

  return (
    <View style={styles.root}>
      <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />
      {imageUri ? (
        <Image source={{ uri: imageUri }} style={styles.media} resizeMode="contain" />
      ) : (
        <View style={styles.placeholder} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "black" },
  media: { flex: 1, width: "100%", height: "100%" },
  placeholder: { flex: 1, backgroundColor: "black" },
});
