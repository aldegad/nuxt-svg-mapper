import { CaptureContextState, CaptureState } from "../schemas/stores";
import type {
  CaptureContext,
  CaptureStoreState,
  ModelCapture,
  ModelCapturedPolygon,
  ModelCapturedViewport,
} from "../schemas/stores";

export const useCaptureStore = defineStore("capture", {
  state: (): CaptureStoreState => ({
    capturedViewport: {
      x: 0,
      y: 0,
      width: window?.visualViewport?.width ?? 0,
      height: window?.visualViewport?.height ?? 0,
      center: { x: 0, y: 0 },
    },
    exceptRefs: [],
    canvasSvgRef: null,
    captureState: CaptureState.IDLE,
    captureContext: {
      state: CaptureContextState.IDLE,
    },
    capturedMouse: {
      x: 0,
      y: 0,
      deltaX: 0,
      deltaY: 0,
      canvasOffset: { x: 0, y: 0, deltaX: 0, deltaY: 0 },
      svgOffset: { x: 0, y: 0, deltaX: 0, deltaY: 0 },
    },
    capturedItems: [],
  }),
  actions: {
    setCanvasSvgRef(ref: SVGSVGElement | null) {
      this.canvasSvgRef = ref;
    },
    addExceptRef(ref: Element) {
      if (!this.exceptRefs.includes(ref)) {
        this.exceptRefs.push(ref);
      }
    },
    setCapturedItems(items: ModelCapturedPolygon[]) {
      this.capturedItems = items;
    },
    setCapturedViewport(viewport: ModelCapturedViewport) {
      this.capturedViewport = viewport;
    },
    setCaptureState(state: CaptureState) {
      this.captureState = state;
    },
    setCaptureContext(context: CaptureContext) {
      this.captureContext = context;
    },
    setCapturedMouse(mouse: ModelCapture) {
      this.capturedMouse = mouse;
    },
    replaceCapturedItem(item: ModelCapturedPolygon) {
      this.capturedItems = [item];
    },
    addCapturedItem(item: ModelCapturedPolygon) {
      if (this.capturedItems.some((i) => i.item.id === item.item.id)) return;
      this.capturedItems.push(item);
    },
  },
});
