import { useMemo, useRef, useState, useCallback } from "react";
import { CameraView } from "expo-camera";
import { router } from "expo-router";
import type { CaptureMode } from "../components/camera/ModeToggle";
import type { TorchMode } from "../components/camera";

export function useCameraVM() {
  const camRef = useRef<CameraView>(null);
  const [ready, setReady] = useState(false);
  const [torchMode, setTorchMode] = useState<TorchMode>("off");
  const [mode, setMode] = useState<CaptureMode>("img"); // default IMG

  const enableTorch = useMemo(() => torchMode === "on", [torchMode]);
  const flash = useMemo(() => (torchMode === "capture" ? "on" : "off"), [torchMode]);

  const toggleTorch = useCallback(() => {
    setTorchMode((m) => (m === "off" ? "capture" : m === "capture" ? "on" : "off"));
  }, []);

  const onCapture = useCallback(async () => {
    if (!ready || !camRef.current) return;
    const photo = await camRef.current.takePictureAsync({ quality: 1, skipProcessing: true });
    const uri = photo?.uri ?? "";
    console.log("[capture]", { mode, uri });

    // Route selection by mode
    router.push({
    pathname: mode === "img" ? "/camera/confirm-image" : "/camera/confirm-pdf",
    params: { uri: encodeURIComponent(uri) }, // ✅ encode
    });
  }, [mode, ready]);

  return {
    camRef,
    ready,
    setReady,
    torchMode,
    setTorchMode,
    enableTorch,
    flash,
    mode,
    setMode,
    toggleTorch,
    onCapture,
  };
}
