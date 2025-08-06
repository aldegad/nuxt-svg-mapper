import { moveStickyPolygon } from "./moveStickyPolygon";
import type { Coord } from "@/schemas/coords";
import type { ModelPolygon } from "@/schemas/stores/polygonStore";

export const moveStickyPolygons = (
  polygons: ModelPolygon[],
  coords: Coord,
  snapshotPolygons: ModelPolygon[],
  snapshotCoord: Coord,
) => {
  return polygons.map((polygon) => {
    const snapshotPolygon = snapshotPolygons.find((p) => p.id === polygon.id);
    if (!snapshotPolygon) return polygon;
    return moveStickyPolygon(polygon, coords, snapshotPolygon, snapshotCoord);
  });
};
