import type { Coords } from "~svg-mapper/schemas/coords";
import type { AnchorPosition } from "~svg-mapper/schemas/stores";

export const transformCoords = (
  aabb: Coords,
  coords: Coords,
  position: AnchorPosition,
  delta: { deltaX: number; deltaY: number },
) => {
  const { deltaX, deltaY } = delta;
  // 기존 bounding box
  const xs = aabb.map((c) => c.x);
  const ys = aabb.map((c) => c.y);
  let minX = Math.min(...xs);
  let maxX = Math.max(...xs);
  let minY = Math.min(...ys);
  let maxY = Math.max(...ys);

  // position에 따라 min/max를 delta만큼 이동
  switch (position) {
    case "top-left":
      minX += deltaX;
      minY += deltaY;
      break;
    case "top-center":
      minY += deltaY;
      break;
    case "top-right":
      maxX += deltaX;
      minY += deltaY;
      break;
    case "middle-right":
      maxX += deltaX;
      break;
    case "bottom-right":
      maxX += deltaX;
      maxY += deltaY;
      break;
    case "bottom-center":
      maxY += deltaY;
      break;
    case "bottom-left":
      minX += deltaX;
      maxY += deltaY;
      break;
    case "middle-left":
      minX += deltaX;
      break;
    default:
      break;
  }

  const oldWidth = Math.max(1e-6, Math.abs(aabb[1].x - aabb[0].x));
  const oldHeight = Math.max(1e-6, Math.abs(aabb[3].y - aabb[0].y));
  const newWidth = Math.max(1e-6, Math.abs(maxX - minX));
  const newHeight = Math.max(1e-6, Math.abs(maxY - minY));

  // 각 점을 비율로 변환해서 새로운 bounding box에 맞게 이동
  const newCoords = coords.map((pt) => {
    const ratioX = (pt.x - aabb[0].x) / oldWidth;
    const ratioY = (pt.y - aabb[0].y) / oldHeight;
    return {
      x: minX + ratioX * newWidth,
      y: minY + ratioY * newHeight,
    };
  });
  return newCoords;
};
