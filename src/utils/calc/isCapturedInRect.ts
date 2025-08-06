import type { ModelRect } from "~svg-mapper/schemas/common";
import type { Coords } from "~svg-mapper/schemas/coords";
import { makeRectToCoords } from "~svg-mapper/utils/captures";

export const isCapturedInRect = (rect: ModelRect, coords: Coords) => {
  const rectCoords = makeRectToCoords(rect);
  let topY = Infinity;
  let leftX = Infinity;
  let bottomY = -Infinity;
  let rightX = -Infinity;

  rectCoords.find((coord) => {
    if (coord.y < topY) topY = coord.y;
    if (coord.y > bottomY) bottomY = coord.y;
    if (coord.x < leftX) leftX = coord.x;
    if (coord.x > rightX) rightX = coord.x;
  });

  const isCaptured = coords.some((coord) => {
    return coord.x >= leftX && coord.x <= rightX && coord.y >= topY && coord.y <= bottomY;
  });
  return isCaptured;
};
