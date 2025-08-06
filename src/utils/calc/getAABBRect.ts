import type { Coords } from "~svg-mapper/schemas/coords";

export function getAABBRect(points: Coords) {
  const minX = Math.min(...points.map((p) => p.x));
  const minY = Math.min(...points.map((p) => p.y));
  const maxX = Math.max(...points.map((p) => p.x));
  const maxY = Math.max(...points.map((p) => p.y));
  return { x: minX, y: minY, width: maxX - minX, height: maxY - minY };
}
