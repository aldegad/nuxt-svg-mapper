import type { ModelVector } from "./common";

export type Gesture = {
  state: GestureState;
  model: GestureModel;
};

export enum GestureState {
  IDLE = "IDLE",
  HOLD_DOWN = "HOLD_DOWN",
  HOLD = "HOLD",
  HOLD_MOVE = "HOLD_MOVE",
  HOLD_UP = "HOLD_UP",
  CLICK = "CLICK",
  WHEEL = "WHEEL",
}

export type GestureModel = {
  x: number;
  y: number;
  deltaX: number;
  deltaY: number;
  canvasVector: ModelVector;
  svgVector: ModelVector;
};
