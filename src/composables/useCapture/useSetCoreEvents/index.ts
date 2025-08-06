import { useStore } from "~svg-mapper/composables/useStore";
import { CaptureContextState } from "~svg-mapper/schemas/stores";
import { ToolType } from "~svg-mapper/schemas/tools";
import { captureDragEvents } from "./captureDragEvents";
import { captureDuplicateEvents } from "./captureDuplicateEvents";
import { captureHandEvents } from "./captureHandEvents";
import { capturePenEvents } from "./capturePenEvents";
import { capturePointerEvents } from "./capturePointerEvents";
import { captureScaleEvents } from "./captureScaleEvents";
import { captureSquareEvents } from "./captureSquareEvents";
import { captureTransformEvents } from "./captureTransformEvents";

export function useSetCoreEvents() {
  const {
    currentStore: {
      currentTool,
      currentCanvas,
      currentViewBox,
      currentViewBoxScale,
      currentPolygons,
      setCurrentViewBox,
    },
    polygonStore: { addPolygon, addPolygons, setPointToPolygon, movePolygon, movePolygons, setPolygons, removePolygon },
    captureStore: { captureState, captureContext, capturedMouse, capturedItems, setCaptureState, setCaptureContext },
    shortcutStore: { shift },
    historyStore: { snapshotItem, snapshot, push },
  } = useStore();

  // mouse capture events
  watch(capturedMouse, () => {
    if (!currentCanvas.value) return;
    // if (isOnExceptElement(capturedMouse.value, exceptRefs.value)) return;

    switch (currentTool.value) {
      case ToolType.POINTER:
        if (captureContext.value.state === CaptureContextState.DRAG) {
          captureDragEvents({
            captureState: captureState.value,
            currentPolygons: currentPolygons.value,
            capturedItems,
            capturedMouse: capturedMouse.value,
            captureContext: captureContext.value,
            setCaptureContext,
          });
        } else {
          capturePointerEvents({
            captureState: captureState.value,
            capturedMouse: capturedMouse.value,
            currentPolygons: currentPolygons.value,
            capturedItems,
            captureContext: captureContext.value,
            shift: shift.value,
            snapshotItem: snapshotItem.value,
            setPolygons,
            movePolygons,
            setCaptureContext,
            snapshot,
            push,
          });
        }
        break;
      case ToolType.DUPLICATE:
        captureDuplicateEvents({
          captureState: captureState.value,
          capturedMouse: capturedMouse.value,
          shift: shift.value,
          currentCanvas: currentCanvas.value,
          currentPolygons: currentPolygons.value,
          capturedItems,
          captureContext: captureContext.value,
          snapshotItem: snapshotItem.value,
          setPolygons,
          setCaptureState,
          addPolygons,
          movePolygons,
          setCaptureContext,
          snapshot,
          push,
        });
        break;
      case ToolType.TRANSFORM:
        if (captureContext.value.state === CaptureContextState.DRAG) {
          captureDragEvents({
            captureState: captureState.value,
            currentPolygons: currentPolygons.value,
            capturedItems,
            capturedMouse: capturedMouse.value,
            captureContext: captureContext.value,
            setCaptureContext,
          });
        } else {
          captureTransformEvents({
            captureState: captureState.value,
            captureContext: captureContext.value,
            currentPolygons: currentPolygons.value,
            capturedItems,
            capturedMouse: capturedMouse.value,
            shift: shift.value,
            currentViewBoxScale: currentViewBoxScale.value,
            snapshotItem: snapshotItem.value,
            setPolygons,
            setCaptureContext,
            snapshot,
            push,
          });
        }
        break;
      case ToolType.PEN:
        // only capture polygon
        capturePenEvents({
          captureState: captureState.value,
          capturedMouse: capturedMouse.value,
          currentCanvas: currentCanvas.value,
          capturedItems,
          addPolygon,
          setPointToPolygon,
        });
        break;
      case ToolType.SQUARE:
        captureSquareEvents({
          captureState: captureState.value,
          capturedMouse: capturedMouse.value,
          currentCanvas: currentCanvas.value,
          capturedItems,
          snapshotItem: snapshotItem.value,
          addPolygon,
          setPointToPolygon,
          movePolygon,
          removePolygon,
          snapshot,
          push,
        });
        break;
      case ToolType.CIRCLE:
        break;
      case ToolType.HAND:
        captureHandEvents({
          captureState: captureState.value,
          capturedMouse: capturedMouse.value,
          currentViewBox: currentViewBox.value,
          setCurrentViewBox,
        });
        break;
      case ToolType.ZOOM_IN:
        captureScaleEvents({
          captureState: captureState.value,
          scale: 1.1,
          capturedMouse: capturedMouse.value,
          currentViewBox: currentViewBox.value,
          setCanvasViewBox: setCurrentViewBox,
        });
        break;
      case ToolType.ZOOM_OUT:
        captureScaleEvents({
          captureState: captureState.value,
          scale: 0.9,
          capturedMouse: capturedMouse.value,
          currentViewBox: currentViewBox.value,
          setCanvasViewBox: setCurrentViewBox,
        });
        break;
    }
  });
}
