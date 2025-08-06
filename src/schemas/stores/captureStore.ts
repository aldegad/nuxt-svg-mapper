import type { ModelPolygon } from "./polygonStore";
import type { ModelRect, ModelVector } from "../common";
import type { Coord } from "../coords";

export type CaptureStoreState = {
  capturedViewport: ModelCapturedViewport;
  exceptRefs: Element[];
  canvasSvgRef: SVGSVGElement | null;
  captureState: CaptureState;
  captureContext: CaptureContext;
  capturedMouse: ModelCapture;
  capturedItems: ModelCapturedPolygon[];
};

export enum CaptureState {
  IDLE = "idle",
  HOLD_DOWN = "hold-down",
  HOLD = "hold",
  HOLD_MOVE = "hold-move",
  HOLD_UP = "hold-up",
  WHEEL = "wheel",
}

export enum CaptureContextState {
  IDLE = "idle",
  TRANSFORM = "transform",
  DRAG = "drag",
  DUPLICATE = "duplicate",
}

export enum ItemCaptureState {
  HOVER = "hover",
  SELECT = "select",
  FOCUS = "focus",
}

export enum CaptureType {
  VIEWPORT = "viewport",
  CANVAS = "canvas",
  SVG = "svg",
}

export enum AnchorPosition {
  CENTER = "center",
  TOP_LEFT = "top-left",
  TOP_CENTER = "top-center",
  TOP_RIGHT = "top-right",
  MIDDLE_RIGHT = "middle-right",
  BOTTOM_RIGHT = "bottom-right",
  BOTTOM_CENTER = "bottom-center",
  BOTTOM_LEFT = "bottom-left",
  MIDDLE_LEFT = "middle-left",
}

export type CaptureContext = {
  state: CaptureContextState;
  snapshot?: {
    polygons: ModelPolygon[];
    coord: Coord;
  };
  transform?: {
    polygons: ModelPolygon[];
    position: AnchorPosition;
  };
  drag?: {
    rect: ModelRect;
  };
};

export type ModelCapturedPolygon = {
  state: ItemCaptureState;
  item: ModelPolygon;
};

export type ModelCapture = {
  x: number;
  y: number;
  deltaX: number;
  deltaY: number;
  canvasOffset: ModelVector;
  svgOffset: ModelVector;
};

export type ModelCapturedViewport = {
  x: number;
  y: number;
  width: number;
  height: number;
  center: {
    x: number;
    y: number;
  };
};
