import { movePolygon } from "./movePolygon";
import type { ModelPolygon } from "@/schemas/stores/polygonStore";

export const movePolygons = (polygons: ModelPolygon[], deltaX: number, deltaY: number) =>
  polygons.map((polygon) => movePolygon(polygon, deltaX, deltaY));
