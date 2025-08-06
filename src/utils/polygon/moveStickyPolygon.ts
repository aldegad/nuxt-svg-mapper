import type { Coord } from "@/schemas/coords";
import type { ModelPolygon } from "@/schemas/stores/polygonStore";

export const moveStickyPolygon = (
  polygon: ModelPolygon,
  coords: Coord,
  snapshotPolygon: ModelPolygon,
  snapshotCoord: Coord,
): ModelPolygon => {
  const diffX = coords.x - snapshotCoord.x;
  const diffY = coords.y - snapshotCoord.y;

  if (Math.abs(diffX) > Math.abs(diffY)) {
    const newCoords = snapshotPolygon.coords.map((coord) => ({
      x: coord.x + diffX,
      y: coord.y,
    }));
    return {
      ...snapshotPolygon,
      coords: newCoords,
      image: snapshotPolygon.image
        ? {
            ...snapshotPolygon.image,
            x: snapshotPolygon.image.x + diffX,
            y: snapshotPolygon.image.y,
          }
        : null,
    };
  } else {
    const newCoords = snapshotPolygon.coords.map((coord) => ({
      x: coord.x,
      y: coord.y + diffY,
    }));
    return {
      ...snapshotPolygon,
      coords: newCoords,
      image: snapshotPolygon.image
        ? {
            ...snapshotPolygon.image,
            x: snapshotPolygon.image.x,
            y: snapshotPolygon.image.y + diffY,
          }
        : null,
    };
  }
};
