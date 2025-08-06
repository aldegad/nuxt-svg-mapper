import { del, get, set } from "idb-keyval";
import { useCanvasStore } from "./canvasStore";
import { useCaptureStore } from "./captureStore";
import { useHistoryStore } from "./historyStore";
import { usePolygonStore } from "./polygonStore";
import { useProjectStore } from "./projectStore";
import type { ModelRect } from "../schemas/common";
import { cursorPointer } from "../schemas/cursor";
import { LayerType, StoreKey } from "../schemas/stores";
import type { ModelCanvas, ModelCurrent, ModelPolygon, ModelPolygonTree, ModelViewBox } from "../schemas/stores";
import type { ModelProject } from "../schemas/stores/projectStore";
import { ToolType } from "../schemas/tools";
import { makePolygonTree } from "../utils/polygon/makePolygonTree";

const id = "e4d0b2ba-4f2d-4cb7-b2fb-1a019b06c3e8"; // tempt id

export const useCurrentStore = defineStore("current", {
  state: () => ({
    current: {
      id,
      projectId: null,
      canvasId: null,
      tool: ToolType.POINTER,
      tempTool: null,
      cursor: `url("${cursorPointer.pointer}") 2 2, auto`,
      layer: "map" as "map" | "detail",
    } as ModelCurrent,
  }),
  getters: {
    // 현재 선택된 프로젝트
    currentProject(state): ModelProject | null {
      const projectStore = useProjectStore();
      return projectStore.projects.find((p) => p.id === state.current.projectId) || null;
    },
    // 현재 선택된 프로젝트의 캔버스 목록
    currentCanvases(state): ModelCanvas[] {
      const canvasStore = useCanvasStore();
      return canvasStore.canvases.filter((c) => c.projectId === state.current.projectId);
    },
    // 현재 선택 되어있는 캔버스
    currentCanvas(state): ModelCanvas | null {
      const canvasStore = useCanvasStore();
      return canvasStore.canvases.find((c) => c.id === state.current.canvasId) || null;
    },
    currentViewBox(state): ModelViewBox {
      const canvasStore = useCanvasStore();
      return (
        canvasStore.canvases.find((c) => c.id === state.current.canvasId)?.viewBox || {
          x: 0,
          y: 0,
          width: 1000,
          height: 1000,
        }
      );
    },
    currentViewBoxScale(state): number {
      const canvasStore = useCanvasStore();
      const viewBox = canvasStore.canvases.find((c) => c.id === state.current.canvasId)?.viewBox;
      if (!viewBox) return 1;
      return viewBox.width / 1000;
    },
    // 현재 선택 되어있는 툴
    currentTool(state) {
      return state.current.tempTool || state.current.tool || ToolType.POINTER;
    },
    currentCursor(): string {
      switch (this.currentTool) {
        case ToolType.DUPLICATE:
          return `url("${cursorPointer.duplicate}") 8 8, auto`;
        case ToolType.TRANSFORM:
          return `url("${cursorPointer.transform}") 8 8, auto`;
        case ToolType.PEN:
          return `url("${cursorPointer.pen}") 2 2, auto`;
        case ToolType.SQUARE:
          return `url("${cursorPointer.square}") 8 8, auto`;
        case ToolType.CIRCLE:
          return `url("${cursorPointer.circle}") 8 8, auto`;
        case ToolType.HAND:
          return `url("${cursorPointer.hand}") 8 8, auto`;
        case ToolType.ZOOM_IN:
          return `url("${cursorPointer.zoomIn}") 8 8, auto`;
        case ToolType.ZOOM_OUT:
          return `url("${cursorPointer.zoomOut}") 8 8, auto`;
        default:
          return `url("${cursorPointer.pointer}") 2 2, auto`;
      }
    },
    currentLayer(state): "map" | "detail" {
      return state.current.layer;
    },
    // 현재 선택 되어있는 캔버스의 폴리곤 목록
    currentPolygons(state): ModelPolygon[] {
      const polygonStore = usePolygonStore();
      if (!state.current.canvasId) return [];
      return polygonStore.polygons.filter((p) => p.canvasId === state.current.canvasId);
    },
    currentPolygonsByGroup(state): ModelPolygonTree[] | null {
      const polygonStore = usePolygonStore();
      if (!state.current.canvasId) return null;
      // 1. 현재 캔버스의 폴리곤만 추출
      const polygons = polygonStore.polygons.filter((p) => p.canvasId === state.current.canvasId);
      return makePolygonTree(polygons);
    },
  },
  actions: {
    async setCurrentCanvas(canvasId: string) {
      this.current.canvasId = canvasId;
      const { setCapturedItems } = useCaptureStore();
      const { reset } = useHistoryStore();
      reset();
      setCapturedItems([]);
      await set(StoreKey.CURRENT, toRaw(this.current));
    },

    async removeCurrentCanvas() {
      this.current.canvasId = null;
      await set(StoreKey.CURRENT, toRaw(this.current));
    },
    async setCurrentTool(tool: ToolType) {
      this.current.tool = tool;
      await set(StoreKey.CURRENT, toRaw(this.current));
    },
    async setTempTool(tool: ToolType) {
      this.current.tempTool = tool;
      await set(StoreKey.CURRENT, toRaw(this.current));
    },
    async clearTempTool() {
      this.current.tempTool = null;
      await set(StoreKey.CURRENT, toRaw(this.current));
    },
    async setCurrentViewBox(_viewBox: ModelRect) {
      const canvasStore = useCanvasStore();
      const canvas = canvasStore.canvases.find((c) => c.id === this.current.canvasId);
      const viewBox = {
        x: !isFinite(_viewBox.x) ? 0 : _viewBox.x,
        y: !isFinite(_viewBox.y) ? 0 : _viewBox.y,
        width: !isFinite(_viewBox.width) ? 1000 : _viewBox.width,
        height: !isFinite(_viewBox.height) ? 1000 : _viewBox.height,
      };
      if (canvas) {
        canvas.viewBox = viewBox;
      }
      canvasStore.setCanvasViewBox(this.current.canvasId!, viewBox);
      await set(StoreKey.CURRENT, toRaw(this.current));
    },
    async setCurrentLayer(layer: LayerType) {
      this.current.layer = layer;
      await set(StoreKey.CURRENT, toRaw(this.current));
    },
    async loadCurrent(projectId: string | null) {
      const loaded = await get(StoreKey.CURRENT);
      if (loaded && loaded.projectId === projectId) {
        this.current = loaded;
        return;
      }

      this.current = {
        id,
        projectId,
        canvasId: null,
        tool: ToolType.POINTER,
        tempTool: null,
        layer: LayerType.MAP,
      };
      await set(StoreKey.CURRENT, toRaw(this.current));
    },
    async clearCurrent() {
      this.current = {
        id,
        projectId: null,
        canvasId: null,
        tool: ToolType.POINTER,
        tempTool: null,
        layer: LayerType.MAP,
      };
      await del(StoreKey.CURRENT);
    },
  },
});
