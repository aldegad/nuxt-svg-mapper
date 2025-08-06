import type { Coords } from "@/schemas/coords";

export const findTopCoord = (coords: Coords) => {
  let edgeCoord = { x: Infinity, y: Infinity };
  coords.forEach((coord) => {
    if (coord.y < edgeCoord.y) {
      edgeCoord = coord;
    }
  });
  return edgeCoord;
};

export const findBottomCoord = (coords: Coords) => {
  let edgeCoord = { x: -Infinity, y: -Infinity };
  coords.forEach((coord) => {
    if (coord.y > edgeCoord.y) {
      edgeCoord = coord;
    }
  });
  return edgeCoord;
};

export const findLeftCoord = (coords: Coords) => {
  let edgeCoord = { x: Infinity, y: Infinity };
  coords.forEach((coord) => {
    if (coord.x < edgeCoord.x) {
      edgeCoord = coord;
    }
  });
  return edgeCoord;
};

export const findRightCoord = (coords: Coords) => {
  let edgeCoord = { x: -Infinity, y: -Infinity };
  coords.forEach((coord) => {
    if (coord.x > edgeCoord.x) {
      edgeCoord = coord;
    }
  });
  return edgeCoord;
};
