import { toRaw } from "vue";
import type { ModelPolygon } from "@/schemas/stores/polygonStore";

export const toRawPolygons = (polygons: ModelPolygon[]): ModelPolygon[] => {
  return polygons.map((poly) => {
    const image = poly.image
      ? {
          url: toRaw(poly.image.url),
          blob: toRaw(poly.image.blob),
          x: toRaw(poly.image.x),
          y: toRaw(poly.image.y),
          width: toRaw(poly.image.width),
          height: toRaw(poly.image.height),
        }
      : null;
    return {
      ...poly,
      coords: poly.coords.map((p) => ({ x: p.x, y: p.y })),
      image,
    };
  });
};
