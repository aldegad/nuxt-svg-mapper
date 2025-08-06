import type { Coord, Coords } from "../../schemas/coords";

type IsCapturedInPolygonProps = {
  point: Coord;
  polygonCoords: Coords;
  scale?: number;
  inset?: number;
};

export function isCapturedInPolygon({ point, polygonCoords, scale, inset: __inset }: IsCapturedInPolygonProps) {
  const _inset = __inset ?? 0;
  const _scale = scale ?? 1;
  const inset = _inset * _scale;

  // 중심 포함 + 주변 8방향 점들
  let pointsToCheck: Coord[] = [point];
  if (inset) {
    pointsToCheck = [
      { x: point.x, y: point.y }, // 중심
      { x: point.x - inset, y: point.y },
      { x: point.x + inset, y: point.y },
      { x: point.x, y: point.y - inset },
      { x: point.x, y: point.y + inset },
      { x: point.x - inset, y: point.y - inset },
      { x: point.x + inset, y: point.y - inset },
      { x: point.x - inset, y: point.y + inset },
      { x: point.x + inset, y: point.y + inset },
    ];
  }

  return pointsToCheck.some((point) => pointInPolygon(point, polygonCoords));
}

const pointInPolygon = (point: Coord, coords: Coords) => {
  let crossCount = 0;
  for (let i = 0, j = coords.length - 1; i < coords.length; j = i++) {
    const x1 = coords[i].x,
      y1 = coords[i].y;
    const x2 = coords[j].x,
      y2 = coords[j].y;

    // 선분이 수직선이면 m 계산 못하니까 별도 처리
    let crossPointY: number | null = null;

    if (x1 === x2) {
      // x가 같으면 같은 직선의 방정식임
      if (point.x === x1) {
        crossPointY = Math.min(y1, y2);
      }
      // x가 다르면? 영원히 만날일 없음. null 임
    } else {
      const m = (y2 - y1) / (x2 - x1);
      const b = y1 - m * x1;
      crossPointY = m * point.x + b;
    }

    if (
      crossPointY !== null &&
      isBetween(coords[i], coords[j], {
        x: point.x,
        y: crossPointY,
      }) &&
      crossPointY > point.y
    ) {
      crossCount++;
    }
  }
  return crossCount % 2 === 1;
};

const isBetween = (c1: Coord, c2: Coord, c: Coord) => {
  const xInRange = c.x >= Math.min(c1.x, c2.x) && c.x <= Math.max(c1.x, c2.x);
  const yInRange = c.y >= Math.min(c1.y, c2.y) && c.y <= Math.max(c1.y, c2.y);

  return xInRange && yInRange;
};
