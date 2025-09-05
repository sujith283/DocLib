import { ConfigContext, ExpoConfig } from "expo/config";

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: "expo-docscanner",
  slug: "expo-docscanner",
  scheme: "docscanner",
  orientation: "portrait",
  ios: {
    supportsTablet: true,
    infoPlist: {
      NSCameraUsageDescription: "This app needs camera access to scan documents",
      NSMicrophoneUsageDescription: "This app may record audio with video"
    }
  },
  android: {
    permissions: ["CAMERA", "RECORD_AUDIO"]
  },
  experiments: {
    typedRoutes: true
  }
});

