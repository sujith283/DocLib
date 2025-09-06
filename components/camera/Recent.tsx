import React, { memo } from "react";
import { TouchableOpacity, View, Image, StyleSheet, StyleProp, ViewStyle } from "react-native";
import Rotating from "./Rotating";
import useMotionDegrees from "../../hooks/useMotionDegrees";

type Props = {
  uri?: string;                // latest photo/document thumbnail uri
  size?: number;               // square side in px (defaults to 56)
  style?: StyleProp<ViewStyle>;
  onPress?: () => void;        // open gallery/document screen later
};

const DEFAULT_SIDE = 56;
const RADIUS = 12;

export default memo(function Recent({ uri, size = DEFAULT_SIDE, style, onPress }: Props) {
  const raw = useMotionDegrees();
  const degrees = raw === 180 || raw === -180 ? 0 : raw;

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.9}
      style={[{ width: size, height: size }, style]}
      accessibilityRole="button"
      accessibilityLabel="Open recent media"
    >
      <Rotating degrees={degrees} style={{ width: size, height: size }}>
        {uri ? (
          <Image
            source={{ uri }}
            style={[
              styles.thumb,
              { width: size, height: size, borderRadius: RADIUS },
            ]}
            resizeMode="cover"
          />
        ) : (
          <View
            style={[
              styles.placeholder,
              { width: size, height: size, borderRadius: RADIUS },
            ]}
          />
        )}
      </Rotating>
    </TouchableOpacity>
  );
});

const styles = StyleSheet.create({
  thumb: {
    borderWidth: 1,
    borderColor: "#2f2f2f",
  },
  placeholder: {
    backgroundColor: "#111",
    borderWidth: 1,
    borderColor: "#2f2f2f",
  },
});
