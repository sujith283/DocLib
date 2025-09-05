import { useEffect, useState } from "react";
import * as ScreenOrientation from "expo-screen-orientation";

export default function useDeviceOrientation() {
  const [degrees, setDegrees] = useState(0);

  useEffect(() => {
    let sub: ScreenOrientation.Subscription | null = null;

    const map = (o: ScreenOrientation.Orientation) => {
      switch (o) {
        case ScreenOrientation.Orientation.PORTRAIT_UP: return 0;
        case ScreenOrientation.Orientation.LANDSCAPE_RIGHT: return 90;
        case ScreenOrientation.Orientation.PORTRAIT_DOWN: return 180;
        case ScreenOrientation.Orientation.LANDSCAPE_LEFT: return -90;
        default: return 0;
      }
    };

    const init = async () => {
      try {
        const current = await ScreenOrientation.getOrientationAsync();
        setDegrees(map(current));
        console.log("[orientation:init]", current, "→", map(current));

        sub = ScreenOrientation.addOrientationChangeListener(({ orientationInfo }) => {
          const next = map(orientationInfo.orientation);
          setDegrees(next);
          console.log("[orientation:change]", orientationInfo.orientation, "→", next);
        });
      } catch (e) {
        console.warn("useDeviceOrientation error:", e);
      }
    };

    init();
    return () => { if (sub) ScreenOrientation.removeOrientationChangeListener(sub); };
  }, []);

  return degrees;
}
