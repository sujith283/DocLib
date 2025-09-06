// CameraScreen — portrait UI; flash indicator rotates with device
import React, { useRef, useState, useMemo } from "react";
import { View, StyleSheet, StatusBar } from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";
import { useSafeAreaInsets } from "react-native-safe-area-context";

// Use the barrel to import all camera UI pieces
import { BottomBar, Recent, TorchMode } from "../../components/camera";

const BOTTOM_MIN = 120;

export default function CameraScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const [ready, setReady] = useState(false);
  const [torchMode, setTorchMode] = useState<TorchMode>("off");
  const camRef = useRef<CameraView>(null);
  const insets = useSafeAreaInsets();

  // live torch (continuous): true only when torchMode === 'on'
  const enableTorch = useMemo(() => torchMode === "on", [torchMode]);
  // capture flash (one-shot): "on" only when torchMode === 'capture'
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
          styles.bottomBarWrap,
          { height: BOTTOM_MIN + insets.bottom, paddingBottom: insets.bottom },
        ]}
      >
        <BottomBar
          torchMode={torchMode}
          onToggleTorch={() =>
            setTorchMode((m) => (m === "off" ? "capture" : m === "capture" ? "on" : "off"))
          }
          onShutter={async () => {
            if (!ready || !camRef.current) return;
            const photo = await camRef.current.takePictureAsync({
              quality: 1,
              skipProcessing: true,
            });
            console.log("[photo]", photo?.uri);
          }}
          rightSlot={
            // No uri yet → shows the rounded square placeholder, rotates with device
            <Recent /* uri={latestUri} onPress={() => { navigate later }} */ />
          }
          gap={70}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "black" },
  bottomBarWrap: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "black",
    alignItems: "center",
    justifyContent: "center",
  },
});
