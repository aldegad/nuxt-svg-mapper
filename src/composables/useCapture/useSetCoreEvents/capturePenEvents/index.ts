import {
  CaptureState,
  ItemCaptureState,
  type ModelCanvas,
  type ModelCapture,
  type ModelCapturedPolygon,
} from "~svg-mapper/schemas/stores";
import type { usePolygonStore } from "~svg-mapper/stores";

interface CapturePenEventsProps {
  captureState: CaptureState;
  capturedMouse: ModelCapture;
  currentCanvas: ModelCanvas;
  capturedItems: Ref<ModelCapturedPolygon[]>;
  addPolygon: ReturnType<typeof usePolygonStore>["addPolygon"];
  setPointToPolygon: ReturnType<typeof usePolygonStore>["setPointToPolygon"];
}

export function capturePenEvents({
  captureState,
  capturedMouse,
  currentCanvas,
  capturedItems,
  addPolygon,
  setPointToPolygon,
}: CapturePenEventsProps) {
  if (captureState === CaptureState.HOLD) {
    console.log("capturePenEvents HOLD");

    const capturedPolygon = capturedItems.value[0];
    if (capturedPolygon) {
      setPointToPolygon(capturedPolygon.item.id, {
        x: capturedMouse.canvasOffset.x,
        y: capturedMouse.canvasOffset.y,
      });
      return;
    }

    const newPolygon = addPolygon(currentCanvas.id, [
      {
        x: capturedMouse.canvasOffset.x,
        y: capturedMouse.canvasOffset.y,
      },
    ]);

    capturedItems.value.push({
      state: ItemCaptureState.SELECT,
      item: newPolygon,
    });
  }
}
