import { CaptureState, type ModelCapture, type ModelViewBox } from "~svg-mapper/schemas/stores";
import type { useCurrentStore } from "~svg-mapper/stores/currentStore";
import { scaleViewBox } from "~svg-mapper/utils/calc/scaleViewBox";

type CaptureScaleEventsProps = {
  captureState: CaptureState;
  scale: number;
  capturedMouse: ModelCapture;
  currentViewBox: ModelViewBox;
  setCanvasViewBox: ReturnType<typeof useCurrentStore>["setCurrentViewBox"];
};

export function captureScaleEvents({
  captureState,
  scale,
  capturedMouse,
  currentViewBox,
  setCanvasViewBox,
}: CaptureScaleEventsProps) {
  if (captureState === CaptureState.HOLD) {
    const newViewBox = scaleViewBox({
      viewBox: currentViewBox,
      center: capturedMouse.svgOffset,
      scale,
    });

    setCanvasViewBox(newViewBox);
  }
}
