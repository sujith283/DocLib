import React from "react";
import { View, StyleSheet } from "react-native";
import FlashToggle from "./FlashToggle";
import ShutterButton from "./ShutterButton";
import { TorchMode } from "./types";

export default function BottomBar({
  torchMode,
  onToggleTorch,
  onShutter,
  rightSlot,
  gap = 70,
}: {
  torchMode: TorchMode;
  onToggleTorch: () => void;
  onShutter: () => void;
  rightSlot?: React.ReactNode; // e.g., gallery, spacer, etc.
  gap?: number;
}) {
  return (
    <View style={[styles.row, { columnGap: gap }]}>
      <FlashToggle torchMode={torchMode} onToggle={onToggleTorch} />
      <ShutterButton onPress={onShutter} />
      <View style={{ width: 56, height: 56 }}>{rightSlot}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    backgroundColor: "black",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
  },
});
