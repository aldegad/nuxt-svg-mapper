import cloneDeep from "lodash.clonedeep";
import type { ModelCapturedPolygon, ModelPolygon } from "~svg-mapper/schemas/stores";
import { useCaptureStore } from "./captureStore";
import { useCurrentStore } from "./currentStore";
import { usePolygonStore } from "./polygonStore";

export const useHistoryStore = defineStore("history", {
  state: () => ({
    historyStack: [] as {
      capturedItems: ModelCapturedPolygon[];
      polygons: ModelPolygon[];
    }[],
    redoStack: [] as {
      capturedItems: ModelCapturedPolygon[];
      polygons: ModelPolygon[];
    }[],
    snapshotItem: null as {
      capturedItems: ModelCapturedPolygon[];
      polygons: ModelPolygon[];
    } | null,
  }),
  actions: {
    snapshot() {
      const { currentPolygons } = useCurrentStore();
      const { capturedItems } = useCaptureStore();
      this.snapshotItem = {
        capturedItems: cloneDeep(capturedItems),
        polygons: cloneDeep(currentPolygons),
      };
    },
    push() {
      if (this.snapshotItem) {
        this.historyStack.push(this.snapshotItem);
        // 최대 20개까지만 저장
        if (this.historyStack.length > 20) {
          this.historyStack.shift();
        }
        this.snapshotItem = null;
      }
      this.redoStack = [];
    },
    undo() {
      if (this.historyStack.length > 0) {
        const popped = this.historyStack.pop();
        const { currentCanvas, currentPolygons } = useCurrentStore();
        const { capturedItems, setCapturedItems } = useCaptureStore();
        const { replaceCanvasPolygons } = usePolygonStore();
        if (!currentCanvas) return;
        this.redoStack.push({
          capturedItems: cloneDeep(capturedItems),
          polygons: cloneDeep(currentPolygons),
        });
        setCapturedItems(popped!.capturedItems);
        replaceCanvasPolygons(currentCanvas.id, popped!.polygons);
      }
    },
    redo() {
      if (this.redoStack.length > 0) {
        const { currentCanvas, currentPolygons } = useCurrentStore();
        const { capturedItems, setCapturedItems } = useCaptureStore();
        const { replaceCanvasPolygons } = usePolygonStore();
        if (!currentCanvas) return;
        this.historyStack.push({
          capturedItems: cloneDeep(capturedItems),
          polygons: cloneDeep(currentPolygons),
        });

        const restored = this.redoStack.pop()!;
        console.log("redo", restored);

        setCapturedItems(restored.capturedItems);
        replaceCanvasPolygons(currentCanvas.id, restored.polygons);
      }
    },
    reset() {
      this.historyStack = [];
      this.redoStack = [];
      this.snapshotItem = null;
    },
  },
});
