import { movePolygon } from "./movePolygon";
import type { ModelPolygon } from "../../schemas/stores/polygonStore";
import { AlignType } from "../../schemas/stores/polygonStore";
import { findBottomCoord, findLeftCoord, findRightCoord, findTopCoord } from "../calc/findEdgeCoord";

export const alignPolygons = (polygons: ModelPolygon[], alignType: AlignType) => {
  switch (alignType) {
    case AlignType.TOP:
      return alignTop(polygons);
    case AlignType.VERTICAL_CENTER:
      return alignVerticalCenter(polygons);
    case AlignType.BOTTOM:
      return alignBottom(polygons);
    case AlignType.LEFT:
      return alignLeft(polygons);
    case AlignType.HORIZONTAL_CENTER:
      return alignHorizontalCenter(polygons);
    case AlignType.RIGHT:
      return alignRight(polygons);
    case AlignType.HORIZONTAL_DISTRIBUTE_CENTER:
      return alignHorizontalDistributeCenter(polygons);
    case AlignType.VERTICAL_DISTRIBUTE_CENTER:
      return alignVerticalDistributeCenter(polygons);
  }
};

const alignTop = (polygons: ModelPolygon[]) => {
  if (polygons.length < 2) return polygons;
  const topY = polygons.reduce((min, poly) => {
    const topCoord = findTopCoord(poly.coords);
    return Math.min(min, topCoord.y);
  }, Infinity);

  return polygons.map((polygon) => {
    const topCoord = findTopCoord(polygon.coords);
    const deltaY = topY - topCoord.y;
    return movePolygon(polygon, 0, deltaY);
  });
};

const alignBottom = (polygons: ModelPolygon[]) => {
  if (polygons.length < 2) return polygons;
  const bottomY = polygons.reduce((max, poly) => {
    const bottomCoord = findBottomCoord(poly.coords);
    return Math.max(max, bottomCoord.y);
  }, -Infinity);

  return polygons.map((polygon) => {
    const bottomCoord = findBottomCoord(polygon.coords);
    const deltaY = bottomY - bottomCoord.y;
    return movePolygon(polygon, 0, deltaY);
  });
};

const alignHorizontalCenter = (polygons: ModelPolygon[]) => {
  if (polygons.length < 2) return polygons;
  let length = 0;
  const sumY = polygons.reduce((_sumY, poly) => {
    const sum = poly.coords.reduce((_sum, coord) => _sum + coord.y, 0);
    length += poly.coords.length;
    return _sumY + sum;
  }, 0);
  const centerY = sumY / length;
  return polygons.map((polygon) => {
    const deltaY = centerY - polygon.coords.reduce((_sum, coord) => _sum + coord.y, 0) / polygon.coords.length;
    return movePolygon(polygon, 0, deltaY);
  });
};

const alignLeft = (polygons: ModelPolygon[]) => {
  if (polygons.length < 2) return polygons;
  const leftX = polygons.reduce((min, poly) => {
    const leftCoord = findLeftCoord(poly.coords);
    return Math.min(min, leftCoord.x);
  }, Infinity);

  return polygons.map((polygon) => {
    const leftCoord = findLeftCoord(polygon.coords);
    const deltaX = leftX - leftCoord.x;
    return movePolygon(polygon, deltaX, 0);
  });
};

const alignVerticalCenter = (polygons: ModelPolygon[]) => {
  if (polygons.length < 2) return polygons;
  let length = 0;
  const sumX = polygons.reduce((_sumX, poly) => {
    const sum = poly.coords.reduce((_sum, coord) => _sum + coord.x, 0);
    length += poly.coords.length;
    return _sumX + sum;
  }, 0);
  const centerX = sumX / length;
  return polygons.map((polygon) => {
    const deltaX = centerX - polygon.coords.reduce((_sum, coord) => _sum + coord.x, 0) / polygon.coords.length;
    return movePolygon(polygon, deltaX, 0);
  });
};

const alignRight = (polygons: ModelPolygon[]) => {
  if (polygons.length < 2) return polygons;
  const rightX = polygons.reduce((max, poly) => {
    const rightCoord = findRightCoord(poly.coords);
    return Math.max(max, rightCoord.x);
  }, -Infinity);

  return polygons.map((polygon) => {
    const rightCoord = findRightCoord(polygon.coords);
    const deltaX = rightX - rightCoord.x;
    return movePolygon(polygon, deltaX, 0);
  });
};

const alignHorizontalDistributeCenter = (polygons: ModelPolygon[]) => {
  if (polygons.length < 3) return polygons;
  let edgeLeftCenter = Infinity;
  let edgeRightCenter = -Infinity;
  // sort polygons by x + width / 2
  const sortedPolygons = polygons.sort((a, b) => {
    const leftCoordA = findLeftCoord(a.coords);
    const rightCoordA = findRightCoord(a.coords);
    const leftCoordB = findLeftCoord(b.coords);
    const rightCoordB = findRightCoord(b.coords);
    const aCenter = (leftCoordA.x + rightCoordA.x) / 2;
    const bCenter = (leftCoordB.x + rightCoordB.x) / 2;
    edgeLeftCenter = Math.min(edgeLeftCenter, aCenter, bCenter);
    edgeRightCenter = Math.max(edgeRightCenter, aCenter, bCenter);
    return aCenter - bCenter;
  });

  const totalWidth = edgeRightCenter - edgeLeftCenter;
  const segmentWidth = totalWidth / (polygons.length - 1);

  const movedPolygons = sortedPolygons.map((polygon, index) => {
    const leftCoord = findLeftCoord(polygon.coords);
    const rightCoord = findRightCoord(polygon.coords);
    const centerX = (leftCoord.x + rightCoord.x) / 2;
    const deltaX = edgeLeftCenter + index * segmentWidth - centerX;
    return movePolygon(polygon, deltaX, 0);
  });

  return movedPolygons;
};

const alignVerticalDistributeCenter = (polygons: ModelPolygon[]) => {
  if (polygons.length < 3) return polygons;
  let edgeTopCenter = Infinity;
  let edgeBottomCenter = -Infinity;
  // sort polygons by y + height / 2
  const sortedPolygons = polygons.sort((a, b) => {
    const topCoordA = findTopCoord(a.coords);
    const bottomCoordA = findBottomCoord(a.coords);
    const topCoordB = findTopCoord(b.coords);
    const bottomCoordB = findBottomCoord(b.coords);
    const aCenter = (topCoordA.y + bottomCoordA.y) / 2;
    const bCenter = (topCoordB.y + bottomCoordB.y) / 2;
    edgeTopCenter = Math.min(edgeTopCenter, aCenter, bCenter);
    edgeBottomCenter = Math.max(edgeBottomCenter, aCenter, bCenter);
    return aCenter - bCenter;
  });

  const totalHeight = edgeBottomCenter - edgeTopCenter;
  const segmentHeight = totalHeight / (polygons.length - 1);

  const movedPolygons = sortedPolygons.map((polygon, index) => {
    const topCoord = findTopCoord(polygon.coords);
    const bottomCoord = findBottomCoord(polygon.coords);
    const centerY = (topCoord.y + bottomCoord.y) / 2;
    const deltaY = edgeTopCenter + index * segmentHeight - centerY;
    return movePolygon(polygon, 0, deltaY);
  });

  return movedPolygons;
};
