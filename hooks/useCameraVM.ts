import { useMemo, useRef, useState, useCallback } from "react";
import { CameraView } from "expo-camera";
import { router } from "expo-router";
import type { CaptureMode } from "../components/camera/ModeToggle";
import type { TorchMode } from "../components/camera";
import { setLatestCapture } from "../state/capture";

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

    // ✅ Save in in-mem cache
    setLatestCapture(uri);

    // ✅ Route WITHOUT params (no URL issues)
    if (mode === "img") {
        router.push("/camera/confirm-image");
    } else {
        router.push("/camera/confirm-pdf");
    }
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
