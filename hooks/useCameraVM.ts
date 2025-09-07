import { useMemo, useRef, useState, useCallback } from "react";
import { CameraView } from "expo-camera";
import { router } from "expo-router";
import { setLatestCapture } from "../state/capture";

// If you already export these from your components barrel, feel free to import those types instead.
type TorchMode = "off" | "capture" | "on";
type CaptureMode = "img" | "pdf";

export function useCameraVM() {
  const camRef = useRef<CameraView>(null);

  const [ready, setReady] = useState(false);
  const [torchMode, setTorchMode] = useState<TorchMode>("off");
  const [mode, setMode] = useState<CaptureMode>("img"); // default IMG
  const [isNavigating, setIsNavigating] = useState(false);

  // Map torchMode to CameraView props
  const enableTorch = useMemo(() => torchMode === "on", [torchMode]);

  const flash = useMemo(() => {
    if (torchMode === "capture") return "on"; // one-shot flash
    return "off";                             // default off, torch handled separately
  }, [torchMode]);


  const toggleTorch = useCallback(() => {
    setTorchMode((m) => (m === "off" ? "capture" : m === "capture" ? "on" : "off"));
  }, []);

  const resetNavigating = useCallback(() => setIsNavigating(false), []);

  const onCapture = useCallback(async () => {
    // Guard: camera ready + ref set + not already navigating
    if (!ready || !camRef.current || isNavigating) return;
    setIsNavigating(true);

    try {
      // ✅ 1) CAPTURE FIRST (do NOT pause before capture)
      const photo = await camRef.current.takePictureAsync({
        quality: 1,        // lighter than 1.0 to reduce decoder stress
        imageType: "jpg",    // safe on most SDKs; remove if your SDK complains
        skipProcessing: true,
      });

      if (!photo?.uri) {
        setIsNavigating(false);
        return;
      }

      // Save for confirm screens
      setLatestCapture(photo.uri);

      // ✅ 2) NOW pause the preview to free camera pipeline before navigating
      //    (method availability varies by SDK; hence optional chaining)
      // ts-expect-error - API can vary across SDKs
      camRef.current.pausePreview?.();

      // Small yield helps some devices settle the pipeline
      await new Promise((r) => setTimeout(r, 20));

      // ✅ 3) Navigate
      if (mode === "img") {
        router.push("/camera/confirm-image");
      } else {
        router.push("/camera/confirm-pdf");
      }
    } catch (e: any) {
      // If you see "[Error: Failed to capture image]" it was likely caused by pausing before capture
      console.warn("[onCapture] error:", e?.message ?? e);
      setIsNavigating(false);
    }
    // Do not reset isNavigating here; we reset it when the screen blurs (in the camera screen effect)
  }, [ready, isNavigating, mode]);

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
    resetNavigating,
  };
}
