import type { ModelRect } from "~svg-mapper/schemas/common";
import type { Coords } from "~svg-mapper/schemas/coords";

export function makeRectToCoords(rect: ModelRect): Coords {
  return [
    { x: rect.x, y: rect.y },
    { x: rect.x + rect.width, y: rect.y },
    { x: rect.x + rect.width, y: rect.y + rect.height },
    { x: rect.x, y: rect.y + rect.height },
  ];
}
