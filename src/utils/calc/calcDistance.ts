import type { Coord } from "@/schemas/coords";

export function calcDistance(a: Coord, b: Coord) {
  return Math.hypot(a.x - b.x, a.y - b.y);
}
