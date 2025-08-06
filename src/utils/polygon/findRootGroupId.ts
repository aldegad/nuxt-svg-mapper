import type { ModelPolygon } from "@/schemas/stores/polygonStore";

// 최상위 엄마(루트 그룹) id를 찾는 함수
export const findRootGroupId = (polygon: ModelPolygon, all: ModelPolygon[]): string => {
  let current = polygon;
  while (current.groupId) {
    const parent = all.find((p) => p.id === current.groupId);
    if (!parent) break;
    current = parent;
  }
  return current.id;
};
