import React, { useEffect, useRef } from "react";
import { Animated, ViewStyle, StyleProp } from "react-native";

export default function Rotating({
  degrees,
  duration = 180,
  style,
  children,
}: {
  degrees: number;
  duration?: number;
  style?: StyleProp<ViewStyle>;
  children: React.ReactNode;
}) {
  const rot = useRef(new Animated.Value(degrees)).current;

  useEffect(() => {
    Animated.timing(rot, {
      toValue: degrees,
      duration,
      useNativeDriver: true,
    }).start();
  }, [degrees, duration, rot]);

  const rotate = rot.interpolate({
    inputRange: [-180, 180],
    outputRange: ["-180deg", "180deg"],
  });

  return <Animated.View style={[style, { transform: [{ rotate }] }]}>{children}</Animated.View>;
}
