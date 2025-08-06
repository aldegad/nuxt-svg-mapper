import type { Coords } from "~svg-mapper/schemas/coords";

export const getAABBCenter = (points: Coords) => {
  const xs = points.map((p) => p.x);
  const ys = points.map((p) => p.y);
  const minX = Math.min(...xs);
  const maxX = Math.max(...xs);
  const minY = Math.min(...ys);
  const maxY = Math.max(...ys);

  return [(minX + maxX) / 2, (minY + maxY) / 2];
};
