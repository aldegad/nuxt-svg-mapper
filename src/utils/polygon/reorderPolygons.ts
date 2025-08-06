import { flattenPolygonTree } from "./flattenPolygonTree";
import { makePolygonTree } from "./makePolygonTree";
import type { ModelPolygon } from "@/schemas/stores/polygonStore";

export const reorderPolygons = (polygons: ModelPolygon[]) => {
  const sortedPolygons: ModelPolygon[] = [];
  // 1. canvasId별로 Map 그룹화
  const canvasMap = new Map<string, ModelPolygon[]>();
  polygons.forEach((p) => {
    if (!canvasMap.has(p.canvasId)) canvasMap.set(p.canvasId, []);
    canvasMap.get(p.canvasId)!.push(p);
  });

  // 2. 각 canvas별로 처리
  for (const canvasPolygons of canvasMap.values()) {
    const polygonTree = makePolygonTree(canvasPolygons);
    const flattenedPolygons = flattenPolygonTree(polygonTree);
    sortedPolygons.push(...flattenedPolygons);
  }
  return sortedPolygons;
};

export const reorderPolygonsInCanvas = (polygons: ModelPolygon[], canvasId: string) => {
  const sortedPolygons: ModelPolygon[] = [];
  const otherCanvasPolygons: ModelPolygon[] = polygons.filter((p) => p.canvasId !== canvasId);
  // 해당 canvasId의 폴리곤만 추출
  const canvasPolygons = polygons.filter((p) => p.canvasId === canvasId);

  const polygonTree = makePolygonTree(canvasPolygons);
  const flattenedPolygons = flattenPolygonTree(polygonTree);
  sortedPolygons.push(...flattenedPolygons);
  return [...otherCanvasPolygons, ...sortedPolygons];
};
