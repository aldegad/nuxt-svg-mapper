import {
  type CaptureContext,
  CaptureContextState,
  CaptureState,
  type ModelCapture,
  type ModelCapturedPolygon,
  type ModelPolygon,
} from "~svg-mapper/schemas/stores";
import type { useCaptureStore } from "~svg-mapper/stores";
import { findDraggingCapturedItems } from "./findDraggingCapturedItems";

type CaptureDragEventsProps = {
  captureState: CaptureState;
  capturedMouse: ModelCapture;
  currentPolygons: ModelPolygon[];
  capturedItems: Ref<ModelCapturedPolygon[]>;
  captureContext: CaptureContext;
  setCaptureContext: ReturnType<typeof useCaptureStore>["setCaptureContext"];
};

export const captureDragEvents = ({
  captureState,
  capturedMouse,
  currentPolygons,
  capturedItems,
  captureContext,
  setCaptureContext,
}: CaptureDragEventsProps) => {
  if (captureState === CaptureState.HOLD_MOVE) {
    const dragRect = captureContext.drag!.rect;
    setCaptureContext({
      state: CaptureContextState.DRAG,
      drag: {
        rect: {
          x: dragRect.x,
          y: dragRect.y,
          width: dragRect.width + capturedMouse.svgOffset.deltaX,
          height: dragRect.height + capturedMouse.svgOffset.deltaY,
        },
      },
    });

    capturedItems.value = findDraggingCapturedItems(captureContext.drag!.rect, currentPolygons);
  }

  if (captureState === CaptureState.IDLE) {
    setCaptureContext({
      state: CaptureContextState.IDLE,
    });
  }
};
