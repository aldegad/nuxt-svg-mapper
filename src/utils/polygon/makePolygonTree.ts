import type { ModelPolygonTree } from "@/schemas/stores";
import type { ModelPolygon } from "@/schemas/stores/polygonStore";

export const makePolygonTree = (polygons: ModelPolygon[]): ModelPolygonTree[] => {
  // 2. id로 맵핑
  const idMap = new Map<string, ModelPolygonTree>();
  polygons.forEach((p) => {
    idMap.set(p.id, { ...p, children: [] });
  });
  // 3. 트리 구조 생성
  const roots: ModelPolygonTree[] = [];
  idMap.forEach((poly) => {
    if (poly.groupId && idMap.has(poly.groupId)) {
      idMap.get(poly.groupId)!.children.push(poly);
    } else {
      roots.push(poly);
    }
  });

  // order 기준 정렬
  const sortTree = (nodes: ModelPolygonTree[]) => {
    nodes.sort((a, b) => a.order - b.order);
    nodes.forEach((node, idx) => {
      node.order = idx;
      if (node.children && node.children.length > 0) {
        sortTree(node.children);
      }
    });
  };
  sortTree(roots);

  return roots;
};
