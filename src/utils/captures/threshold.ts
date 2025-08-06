import type { Coord } from "~svg-mapper/schemas/coords";

export const thresholdDelta = (delta: Coord, threshold: number) => {
  const moved = Math.abs(delta.x) > threshold || Math.abs(delta.y) > threshold;
  if (!moved) {
    return { x: 0, y: 0 };
  }
  return {
    x: Math.abs(delta.x) > threshold ? (delta.x > 0 ? delta.x - threshold : delta.x + threshold) : 0,
    y: Math.abs(delta.y) > threshold ? (delta.y > 0 ? delta.y - threshold : delta.y + threshold) : 0,
  };
};
