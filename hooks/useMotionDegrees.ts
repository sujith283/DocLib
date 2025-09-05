// hooks/useMotionDegrees.ts
import { useEffect, useRef, useState } from "react";
import { Accelerometer } from "expo-sensors";

/**
 * Returns 0 / 90 / 180 / -90 based on device tilt.
 * - Uses atan2(x, -y) so Portrait Up = 0°, Landscape Right = +90°, Portrait Down = 180°, Landscape Left = -90°.
 * - Has hysteresis: only switches after a short stability window to avoid jitter.
 * - If left/right look swapped on your device, call useMotionDegrees({ invertLandscape: true }).
 */
export default function useMotionDegrees(opts?: { invertLandscape?: boolean }) {
  const invert = opts?.invertLandscape ?? false;
  const [deg, setDeg] = useState(0);

  // tuning knobs
  const UPDATE_MS = 100;   // sensor poll interval
  const STABLE_MS = 180;   // must stay in a new bucket for this long to switch

  // internal refs for hysteresis
  const currentBucket = useRef<number>(0);
  const candidateBucket = useRef<number | null>(null);
  const candidateSince = useRef<number>(0);

  useEffect(() => {
    Accelerometer.setUpdateInterval(UPDATE_MS);

    const sub = Accelerometer.addListener(({ x, y }) => {
      // Map to angle in degrees: (-180, 180]
      let angle = (Math.atan2(x, -y) * 180) / Math.PI;
      while (angle > 180) angle -= 360;
      while (angle <= -180) angle += 360;

      // Quantize angle → bucket
      // Boundaries at ±45° and ±135° give nice dead-zones.
      let target = 0;
      if (angle >= 135 || angle < -135) {
        target = 180;
      } else if (angle >= 45) {
        target = invert ? -90 : 90;
      } else if (angle <= -45) {
        target = invert ? 90 : -90;
      } else {
        target = 0;
      }

      // Hysteresis: require STABLE_MS in the new bucket before switching
      const now = Date.now();
      if (target === currentBucket.current) {
        candidateBucket.current = null; // cancel any pending switch
        candidateSince.current = 0;
        // keep reporting the current bucket
        if (deg !== currentBucket.current) setDeg(currentBucket.current);
        return;
      }

      // new candidate
      if (candidateBucket.current !== target) {
        candidateBucket.current = target;
        candidateSince.current = now;
        return;
      }

      // same candidate — check stability window
      if (now - candidateSince.current >= STABLE_MS) {
        currentBucket.current = target;
        candidateBucket.current = null;
        candidateSince.current = 0;
        setDeg(target);
      }
    });

    return () => {
      try { sub && sub.remove(); } catch {}
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [invert]);

  return deg;
}
