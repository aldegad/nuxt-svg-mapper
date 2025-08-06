import type { ModelRect } from "../schemas/common";

type ScaleFromDeltaProps = {
  delta: number;
  base?: number;
  originViewBox: ModelRect;
  currentViewBox: ModelRect;
  minScale?: number;
  maxScale?: number;
};

export const scaleFromDelta = ({
  delta,
  base = 1.1,
  originViewBox,
  currentViewBox,
  minScale = 0.2,
  maxScale = 5,
}: ScaleFromDeltaProps) => {
  const scaleDelta = delta < 0 ? Math.pow(base, -delta / 100) : 1 / Math.pow(base, delta / 100);

  const currentScale = originViewBox.width / currentViewBox.width;
  const nextScale = currentScale * scaleDelta;

  const clampedScale = Math.min(Math.max(nextScale, minScale), maxScale);

  if (clampedScale >= maxScale || clampedScale <= minScale) {
    return 1;
  }

  // clamp 안 일어났으면 실제 변화량 반환
  return clampedScale / currentScale;
};
