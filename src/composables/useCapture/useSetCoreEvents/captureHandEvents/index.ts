import { CaptureState } from "~svg-mapper/schemas/stores";
import type { ModelCapture, ModelViewBox } from "~svg-mapper/schemas/stores";
import type { useCurrentStore } from "~svg-mapper/stores";

interface CaptureHandEventsProps {
  captureState: CaptureState;
  capturedMouse: ModelCapture;
  currentViewBox: ModelViewBox;
  setCurrentViewBox: ReturnType<typeof useCurrentStore>["setCurrentViewBox"];
}

export function captureHandEvents({
  captureState,
  capturedMouse,
  currentViewBox,
  setCurrentViewBox,
}: CaptureHandEventsProps) {
  if (captureState === CaptureState.HOLD) {
    console.log("captureHandEvents HOLD");
  }
  if (captureState === CaptureState.HOLD_MOVE) {
    setCurrentViewBox({
      x: currentViewBox.x - capturedMouse.svgOffset.deltaX,
      y: currentViewBox.y - capturedMouse.svgOffset.deltaY,
      width: currentViewBox.width,
      height: currentViewBox.height,
    });
  }
}
