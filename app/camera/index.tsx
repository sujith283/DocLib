// index.tsx (CameraScreen) — portrait UI; only flash indicator rotates
import React, { useRef, useState, useMemo } from "react";
import { View, TouchableOpacity, StyleSheet, StatusBar, Text } from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";
import { useSafeAreaInsets } from "react-native-safe-area-context";

// If this file is two levels under project root, ../../ is correct.
// Adjust the path depth if your screen lives elsewhere.
import FlashIndicator, { TorchMode } from "../../components/FlashIndicator";

const BOTTOM_MIN = 120;
const BTN_SIDE = 56;

export default function CameraScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const [ready, setReady] = useState(false);
  const [torchMode, setTorchMode] = useState<TorchMode>("off");
  const camRef = useRef<CameraView>(null);
  const insets = useSafeAreaInsets();

  const enableTorch = useMemo(() => torchMode === "on", [torchMode]);
  const flash = useMemo(() => (torchMode === "capture" ? "on" : "off"), [torchMode]);

  if (!permission) return <View style={styles.root} />;
  if (!permission.granted) {
    requestPermission();
    return <View style={styles.root} />;
  }

  return (
    <View style={styles.root}>
      <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />

      <CameraView
        ref={camRef}
        style={StyleSheet.absoluteFillObject}
        onCameraReady={() => setReady(true)}
        facing="back"
        enableTorch={enableTorch}
        flash={flash as any}
      />

      <View
        style={[
          styles.bottomBar,
          { height: BOTTOM_MIN + insets.bottom, paddingBottom: insets.bottom },
        ]}
      >
        <FlashIndicator
          torchMode={torchMode}
          onPress={() =>
            setTorchMode((m) => (m === "off" ? "capture" : m === "capture" ? "on" : "off"))
          }
        />

        <TouchableOpacity
          onPress={async () => {
            if (!ready || !camRef.current) return;
            const photo = await camRef.current.takePictureAsync({ quality: 1, skipProcessing: true });
            console.log("[photo]", photo?.uri);
          }}
          style={styles.shutterOuter}
          activeOpacity={0.9}
        >
          <View style={styles.shutterInner} />
        </TouchableOpacity>

        <View style={styles.rightSpacer} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "black" },

  bottomBar: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "black",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 70,
  },

  rightSpacer: { width: BTN_SIDE, height: BTN_SIDE },

  shutterOuter: {
    width: 76,
    height: 76,
    borderRadius: 999,
    borderWidth: 4,
    borderColor: "white",
    alignItems: "center",
    justifyContent: "center",
  },

  shutterInner: {
    width: 60,
    height: 60,
    borderRadius: 999,
    backgroundColor: "red",
  },
});
