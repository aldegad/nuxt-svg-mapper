import type { ModelPolygon } from "@/schemas/stores/polygonStore";

export const movePolygon = (polygon: ModelPolygon, deltaX: number, deltaY: number) => ({
  ...polygon,
  coords: polygon.coords.map((coord) => ({
    x: coord.x + deltaX,
    y: coord.y + deltaY,
  })),
  image: polygon.image
    ? {
        ...polygon.image,
        x: polygon.image.x + deltaX,
        y: polygon.image.y + deltaY,
      }
    : null,
});
