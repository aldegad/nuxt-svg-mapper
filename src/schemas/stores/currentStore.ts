import type { _GettersTree } from "pinia";
import type { ToolType } from "../tools";

export enum LayerType {
  MAP = "map",
  DETAIL = "detail",
}

export interface ModelCurrent {
  id: string; // uuid
  projectId: string | null; // uuid - foreign key to projectStore.id
  canvasId: string | null; // uuid - foreign key to canvasStore.id
  tool: ToolType;
  tempTool: ToolType | null;
  layer: LayerType;
}
