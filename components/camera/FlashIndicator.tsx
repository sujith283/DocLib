import React, { memo } from "react";
import { View, Text, TouchableOpacity, StyleSheet, StyleProp, ViewStyle } from "react-native";
import Rotating from "./Rotating";
import useMotionDegrees from "../../hooks/useMotionDegrees"; // fixed path
import { TorchMode } from "./types"; // moved type to types.ts

const BTN_SIDE = 56;

export default memo(function FlashIndicator({
  torchMode,
  onPress,
  style,
}: {
  torchMode: TorchMode;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
}) {
  const raw = useMotionDegrees();
  const degrees = raw === 180 || raw === -180 ? 0 : raw;

  const iconColor = torchMode === "off" ? "#7A7A7A" : "#FFC107";
  const sub = torchMode === "off" ? "OFF" : torchMode === "capture" ? "ON" : "A";

  return (
    <TouchableOpacity onPress={onPress} style={[styles.btn, style]} activeOpacity={0.8}>
      <Rotating degrees={degrees}>
        <View style={styles.spinBox}>
          <Text style={[styles.icon, { color: iconColor }]}>⚡</Text>
          <Text style={styles.sub}>{sub}</Text>
        </View>
      </Rotating>
    </TouchableOpacity>
  );
});

const styles = StyleSheet.create({
  btn: {
    width: BTN_SIDE,
    height: BTN_SIDE,
    alignItems: "center",
    justifyContent: "center",
  },
  spinBox: {
    width: BTN_SIDE,
    height: BTN_SIDE,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  icon: {
    width: BTN_SIDE,
    textAlign: "center",
    fontSize: 26,
    lineHeight: 26,
  },
  sub: {
    position: "absolute",
    bottom: 6,
    right: 12,
    fontSize: 10,
    fontWeight: "700",
    color: "white",
    letterSpacing: 0.4,
  },
});
