import type { Coord, Coords } from "~svg-mapper/schemas/coords";
import { calcDistance } from "~svg-mapper/utils/calc";
import { get8AnchorPosition } from "./get8AnchorPosition";

export const findNearestTransformPoint = (points: Coords, targetPoint: Coord) => {
  let minDist = Infinity;
  let nearest: Coord | null = null;
  let nearestIndex = -1;

  points.forEach((point, idx) => {
    const dist = calcDistance(point, targetPoint);
    if (dist < minDist) {
      minDist = dist;
      nearest = point;
      nearestIndex = idx;
    }
  });

  const position = get8AnchorPosition(nearestIndex);

  return {
    point: nearest!,
    position,
  };
};
