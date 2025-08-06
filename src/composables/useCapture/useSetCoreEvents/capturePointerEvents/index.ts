import {
  type CaptureContext,
  CaptureContextState,
  CaptureState,
  type ModelCapture,
  type ModelCapturedPolygon,
  type ModelPolygon,
} from "~svg-mapper/schemas/stores";
import type { useCaptureStore, useHistoryStore, usePolygonStore } from "~svg-mapper/stores";
import { makeCapturedItem } from "~svg-mapper/utils/captures/makeCaputuredItem";
import { moveStickyPolygons } from "~svg-mapper/utils/polygon/moveStickyPolygons";
import { hoverCapturedItems } from "../hoverCapturedItem";
import { selectCapturedItems } from "../selectCapturedItems";
import { selectUpCapturedItems } from "../selectUpCapturedItems";

type CapturePointerEventsProps = {
  captureState: CaptureState;
  captureContext: CaptureContext;
  capturedMouse: ModelCapture;
  currentPolygons: ModelPolygon[];
  capturedItems: Ref<ModelCapturedPolygon[]>;
  shift: boolean;
  movePolygons: ReturnType<typeof usePolygonStore>["movePolygons"];
  setPolygons: ReturnType<typeof usePolygonStore>["setPolygons"];
  setCaptureContext: ReturnType<typeof useCaptureStore>["setCaptureContext"];
  snapshotItem: ReturnType<typeof useHistoryStore>["snapshotItem"];
  snapshot: ReturnType<typeof useHistoryStore>["snapshot"];
  push: ReturnType<typeof useHistoryStore>["push"];
};

export const capturePointerEvents = ({
  captureState,
  captureContext,
  capturedMouse,
  currentPolygons,
  capturedItems,
  shift,
  snapshotItem,
  movePolygons,
  setPolygons,
  setCaptureContext,
  snapshot,
  push,
}: CapturePointerEventsProps) => {
  if (captureState === CaptureState.HOLD) {
    console.log("capturePointerEvents HOLD");
    capturedItems.value = selectCapturedItems(capturedMouse, capturedItems.value, shift);

    // for sticky movement
    setCaptureContext({
      state: CaptureContextState.IDLE,
      snapshot: {
        polygons: capturedItems.value.map((item) => item.item),
        coord: {
          x: capturedMouse.svgOffset.x,
          y: capturedMouse.svgOffset.y,
        },
      },
    });

    if (!capturedItems.value.length) {
      // start drag
      setCaptureContext({
        state: CaptureContextState.DRAG,
        drag: {
          rect: {
            x: capturedMouse.svgOffset.x,
            y: capturedMouse.svgOffset.y,
            width: 0,
            height: 0,
          },
        },
      });
    }
  }

  if (captureState === CaptureState.HOLD_MOVE) {
    const movedItems = capturedItems.value;
    if (movedItems) {
      if (!snapshotItem) {
        snapshot();
      }
      if (shift) {
        const movedPolygons = moveStickyPolygons(
          movedItems.map((item) => item.item),
          capturedMouse.svgOffset,
          captureContext.snapshot!.polygons,
          captureContext.snapshot!.coord,
        );
        setPolygons(movedPolygons);
        capturedItems.value = movedPolygons.map((polygon) => makeCapturedItem(polygon));
      } else {
        const movedPolygons = movePolygons(
          movedItems.map((item) => item.item.id),
          capturedMouse.svgOffset.deltaX,
          capturedMouse.svgOffset.deltaY,
        );
        capturedItems.value = movedPolygons.map((polygon) => makeCapturedItem(polygon));
      }
    }
  }

  if (captureState === CaptureState.HOLD_UP) {
    console.log("capturePointerEvents HOLD_UP");
    capturedItems.value = selectUpCapturedItems(capturedItems.value, shift);
    if (snapshotItem) {
      push();
    }
  }

  if (captureState === CaptureState.IDLE) {
    capturedItems.value = hoverCapturedItems({
      polygons: currentPolygons,
      capturedMouse,
      capturedItems: capturedItems.value,
    });
  }
};
