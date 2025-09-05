import React from "react";
import FlashIndicator from "./FlashIndicator";
import { TorchMode } from "./types";

export default function FlashToggle({
  torchMode,
  onToggle,
}: {
  torchMode: TorchMode;
  onToggle: () => void;
}) {
  // Thin interactive wrapper around the display-only FlashIndicator
  return <FlashIndicator torchMode={torchMode} onPress={onToggle} />;
}
