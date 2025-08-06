import type { ModelPolygonTree } from "@/schemas/stores";

export const flattenPolygonTree = (nodes: ModelPolygonTree[]) => {
  const result: ModelPolygonTree[] = [];
  const traverse = (nodeList: ModelPolygonTree[]) => {
    nodeList.forEach((node) => {
      result.push(node);
      if (node.children && node.children.length > 0) {
        traverse(node.children);
      }
    });
  };
  traverse(nodes);
  return result;
};
