import React, { useEffect } from "react";
import { View, StyleSheet, StatusBar } from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useIsFocused } from "@react-navigation/native";

import { BottomBar, Recent, TorchMode } from "../../components/camera";
import ModeToggle from "../../components/camera/ModeToggle";
import { useCameraVM } from "../../hooks/useCameraVM";

const BOTTOM_MIN = 85; // your preferred height

export default function CameraScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const insets = useSafeAreaInsets();

  const {
    camRef,
    ready,
    setReady,
    torchMode,
    toggleTorch,
    enableTorch,
    flash,
    mode,
    setMode,
    onCapture,
    resetNavigating, 
  } = useCameraVM();

  const isFocused = useIsFocused();

  useEffect(() => {
    if (!isFocused) {
      setReady(false);
      // @\ts-expect-error (API varies by SDK)
      camRef.current?.pausePreview?.();
      resetNavigating(); // ensure shutter re-enables on return
    } else {
      // @\ts-expect-error (API varies by SDK)
      camRef.current?.resumePreview?.();
    }
  }, [isFocused, setReady, camRef, resetNavigating]);

  if (!permission) return <View style={styles.root} />;
  if (!permission.granted) {
    requestPermission();
    return <View style={styles.root} />;
  }

  return (
    <View style={styles.root}>
      <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />

      {isFocused && (
        <CameraView
          ref={camRef}
          style={StyleSheet.absoluteFillObject}
          onCameraReady={() => setReady(true)}
          facing="back"
          enableTorch={enableTorch}
          flash={flash as any}
        />
      )}

      {/* Toggle above BottomBar */}
      <View
        style={[
          styles.bottomStack,
          { height: BOTTOM_MIN + insets.bottom, paddingBottom: insets.bottom },
        ]}
      >
        <View style={styles.toggleWrap}>
          <ModeToggle value={mode} onChange={setMode} scale={0.9} />
        </View>

        <BottomBar
          torchMode={torchMode as TorchMode}
          onToggleTorch={toggleTorch}
          onShutter={onCapture}
          rightSlot={<Recent /* uri={latestThumb} onPress={() => {/* navigate later }} */ />}
          gap={70}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "black" },
  bottomStack: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "black",
    alignItems: "center",
    justifyContent: "flex-end",
  },
  toggleWrap: {
    marginBottom: 14,
  },
});
