import { useLocalSearchParams } from "expo-router";
import React, { useMemo } from "react";
import { Image, View, StyleSheet, StatusBar } from "react-native";

function normalizeUri(raw: unknown): string | undefined {
  // Handle string | string[] | undefined and decode it
  const s = Array.isArray(raw) ? raw[0] : typeof raw === "string" ? raw : undefined;
  if (!s) return undefined;

  let decoded = s;
  try { decoded = decodeURIComponent(s); } catch (_) {}

  // Ensure file:// prefix if missing (Android needs this)
  if (decoded.startsWith("/")) return "file://" + decoded;
  return decoded;
}

export default function ConfirmImageOrPdf() {
  const params = useLocalSearchParams();
  const imageUri = useMemo(() => normalizeUri(params.uri), [params.uri]);

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
