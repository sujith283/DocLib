import React, { useMemo } from "react";
import { View, StyleSheet, StatusBar } from "react-native";
import { Image } from "expo-image";
import { getLatestCapture } from "../../state/capture";
import { useIsFocused } from "@react-navigation/native";

function normalizeUri(u?: string) {
  if (!u) return undefined;
  return u.startsWith("/") ? "file://" + u : u; // Android safety
}

export default function ConfirmImage() {
  const isFocused = useIsFocused();
  const raw = getLatestCapture();
  const imageUri = useMemo(() => normalizeUri(raw), [raw]);

  return (
    <View style={styles.root}>
      <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />
      {isFocused && imageUri ? (
        <Image
          source={{ uri: imageUri }}
          style={styles.media}
          contentFit="contain"
          recyclingKey={imageUri}
          // cachePolicy="none" // Uncomment if supported by your SDK
        />
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
