import React from "react";
import { View, TouchableOpacity, StyleSheet } from "react-native";

export default function ShutterButton({
  onPress,
  disabled,
}: {
  onPress: () => void;
  disabled?: boolean;
}) {
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      style={[styles.shutterOuter, disabled && { opacity: 0.5 }]}
      activeOpacity={0.9}
    >
      <View style={styles.shutterInner} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
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
