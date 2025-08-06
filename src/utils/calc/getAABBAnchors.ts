import type { Coords } from "~svg-mapper/schemas/coords";

interface GetAABBAnchorsProps {
  padding?: number;
  dotCount?: 4 | 8 | 9;
}

export const getAABBAnchors = (coords: Coords, options?: GetAABBAnchorsProps): Coords => {
  const minX = Math.min(...coords.map((c) => c.x));
  const maxX = Math.max(...coords.map((c) => c.x));
  const minY = Math.min(...coords.map((c) => c.y));
  const maxY = Math.max(...coords.map((c) => c.y));

  const padding = options?.padding ?? 0;
  const dotCount = options?.dotCount ?? 4;
  const left = minX - padding;
  const top = minY - padding;
  const width = maxX - minX + padding * 2;
  const height = maxY - minY + padding * 2;

  let groupCoords: Coords = [];
  switch (dotCount) {
    case 4:
      groupCoords = [
        { x: left, y: top }, // top-left
        { x: left + width, y: top }, // top-right
        { x: left + width, y: top + height }, // bottom-right
        { x: left, y: top + height }, // bottom-left
      ];
      break;
    case 8: {
      const cx = left + width / 2;
      const cy = top + height / 2;
      groupCoords = [
        { x: left, y: top }, // top-left
        { x: cx, y: top }, // top-center
        { x: left + width, y: top }, // top-right
        { x: left + width, y: cy }, // middle-right
        { x: left + width, y: top + height }, // bottom-right
        { x: cx, y: top + height }, // bottom-center
        { x: left, y: top + height }, // bottom-left
        { x: left, y: cy }, // middle-left
      ];
      break;
    }
    case 9: {
      const cx = left + width / 2;
      const cy = top + height / 2;
      groupCoords = [
        { x: cx, y: cy }, // center
        { x: left, y: top }, // top-left
        { x: cx, y: top }, // top-center
        { x: left + width, y: top }, // top-right
        { x: left + width, y: cy }, // middle-right
        { x: left + width, y: top + height }, // bottom-right
        { x: cx, y: top + height }, // bottom-center
        { x: left, y: top + height }, // bottom-left
        { x: left, y: cy }, // middle-left
      ];
      break;
    }
  }

  return groupCoords;
};
