import { toRaw } from "vue";
import type { Coords } from "~svg-mapper/schemas/coords";

export const toRawCoords = (coords: Coords) => {
  return coords.map((c) => ({ x: toRaw(c.x), y: toRaw(c.y) }));
};
