import React, { memo, useEffect, useRef, useState, useCallback } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Animated, Easing, LayoutChangeEvent } from "react-native";

export type CaptureMode = "img" | "pdf";

type Props = {
  value: CaptureMode;
  onChange: (m: CaptureMode) => void;

  /** Scale the entire control (padding, font, radius) with one knob. Default 1. */
  scale?: number;

  /** Animation duration in ms (default 140). */
  duration?: number;

  /** Horizontal padding inside each segment (multiplied by scale). Default 12. */
  padX?: number;

  /** Control height (px). Default 40; multiplied by scale. */
  height?: number;
};

const ModeToggle = memo(({ value, onChange, scale = 1, duration = 140, padX = 12, height = 40 }: Props) => {
    // Derived dimensions
    const INDENT = 4 * scale;                            // outer inset (thumb margins)
    const H = height * scale;                             // overall height
    const R = H / 2;                                      // container radius
    const fontSize = 13 * scale;

    // Measure text widths so the toggle fits exactly
    const [imgTextW, setImgTextW] = useState<number>(0);
    const [pdfTextW, setPdfTextW] = useState<number>(0);

    const segW_img = imgTextW + padX * 2 * scale;
    const segW_pdf = pdfTextW + padX * 2 * scale;

    // Animated driver: 0 = IMG, 1 = PDF
    const x = useRef(new Animated.Value(value === "img" ? 0 : 1)).current;

    // Animate on value change (no bounce, no overshoot)
    useEffect(() => {
    Animated.timing(x, {
        toValue: value === "img" ? 0 : 1,
        duration,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true, // ✅ now we only animate transforms
    }).start();
    }, [value, duration]);

    // Horizontal position: from left indent to start of right segment
    const translateX = x.interpolate({
    inputRange: [0, 1],
    outputRange: [INDENT, INDENT + segW_img],
    extrapolate: "clamp",
    });

    // Thumb growth: scale from IMG width to PDF width (origin = left)
    const scaleX = x.interpolate({
    inputRange: [0, 1],
    outputRange: [1, segW_pdf / Math.max(segW_img, 1)], // prevent divide-by-zero
    extrapolate: "clamp",
    });

    // Container width = both segments + side indents
    const containerW = INDENT * 2 + segW_img + segW_pdf;

    return (
    <View
        style={[
        styles.wrap,
        {
            width: containerW || undefined,
            height: H,
            borderRadius: R,
            padding: INDENT,
        },
        ]}
    >
        {/* Thumb: fixed base width = segW_img; we scaleX to reach segW_pdf when on the right.
            overflow hidden keeps it inside the pill. */}
        <Animated.View
        style={[
            styles.thumb,
            {
            height: H - INDENT * 2,
            width: segW_img,                 // ✅ fixed width (no animated width anymore)
            borderRadius: (H - INDENT * 2) / 2,
            transform: [{ translateX }],
            overflow: "hidden",
            },
        ]}
        >
        <Animated.View
            style={{
            height: "100%",
            width: segW_img,                 // base content width
            backgroundColor: "#1f1f1f",
            transform: [{ scaleX }],        // ✅ animate transform instead of width
            }}
        />
        </Animated.View>

        {/* labels row (unchanged) */}
        <View style={styles.row} pointerEvents="none">
        <View style={[styles.seg, { width: segW_img, height: H - INDENT * 2 }]}>
            <Animated.Text
            onLayout={(e) => setImgTextW(Math.ceil(e.nativeEvent.layout.width))}
            style={[styles.label, { fontSize }, { transform: [{ scale: x.interpolate({
                inputRange: [0,1], outputRange: [1.05,1]
            }) }] }]}
            >
            IMG
            </Animated.Text>
        </View>
        <View style={[styles.seg, { width: segW_pdf, height: H - INDENT * 2 }]}>
            <Animated.Text
            onLayout={(e) => setPdfTextW(Math.ceil(e.nativeEvent.layout.width))}
            style={[styles.label, { fontSize }, { transform: [{ scale: x.interpolate({
                inputRange: [0,1], outputRange: [1,1.05]
            }) }] }]}
            >
            PDF
            </Animated.Text>
        </View>
        </View>

        {/* hit areas */}
        <View style={styles.hitRow} pointerEvents="box-none">
        <TouchableOpacity style={{ width: segW_img, height: H }} onPress={() => onChange("img")} />
        <TouchableOpacity style={{ width: segW_pdf, height: H }} onPress={() => onChange("pdf")} />
        </View>
    </View>
    );        
});

const styles = StyleSheet.create({
  wrap: {
    backgroundColor: "#121212",
    borderWidth: 1,
    borderColor: "#2a2a2a",
    position: "relative",
    overflow: "hidden", // prevents any bleed when animating
  },
  thumb: {
    position: "absolute",
    top: 4, // visually centered (pairs with INDENT in component)
    left: 0,
    backgroundColor: "#1f1f1f",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
  seg: {
    alignItems: "center",
    justifyContent: "center",
  },
  label: {
    color: "white",
    fontWeight: "700",
    letterSpacing: 0.6,
  },
  hitRow: {
    ...StyleSheet.absoluteFillObject,
    flexDirection: "row",
  },
});

export default ModeToggle;
