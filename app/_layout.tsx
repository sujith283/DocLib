import { Stack } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import React, { useEffect } from "react";
import * as ScreenOrientation from "expo-screen-orientation";

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: "black" } }} />
    </SafeAreaProvider>
  );
}

