export function isPolygonClosed(points: { x: number; y: number }[]): boolean {
  if (points.length < 3) return false;
  const first = points[0];
  const last = points[points.length - 1];
  // 좌표가 완전히 같거나, 오차 허용(예: 1px 이내)
  return Math.abs(first.x - last.x) < 1e-6 && Math.abs(first.y - last.y) < 1e-6;
}
