import { safeRandomUUID } from "@aldegad/nuxt-core";
import {
  type CaptureContext,
  CaptureContextState,
  CaptureState,
  ItemCaptureState,
  type ModelCanvas,
  type ModelCapture,
  type ModelCapturedPolygon,
  type ModelPolygon,
} from "~svg-mapper/schemas/stores";
import type { useCaptureStore } from "~svg-mapper/stores/captureStore";
import type { useHistoryStore } from "~svg-mapper/stores/historyStore";
import type { usePolygonStore } from "~svg-mapper/stores/polygonStore";
import { makeCapturedItem } from "~svg-mapper/utils/captures/makeCaputuredItem";
import { moveStickyPolygons } from "~svg-mapper/utils/polygon/moveStickyPolygons";
import { hoverCapturedItems } from "../hoverCapturedItem";
import { selectCapturedItems } from "../selectCapturedItems";
import { selectUpCapturedItems } from "../selectUpCapturedItems";

type CaptureDuplicateEventsProps = {
  captureState: CaptureState;
  captureContext: CaptureContext;
  capturedMouse: ModelCapture;
  currentCanvas: ModelCanvas;
  currentPolygons: ModelPolygon[];
  capturedItems: Ref<ModelCapturedPolygon[]>;
  shift: boolean;
  snapshotItem: ReturnType<typeof useHistoryStore>["snapshotItem"];
  setCaptureState: ReturnType<typeof useCaptureStore>["setCaptureState"];
  addPolygons: ReturnType<typeof usePolygonStore>["addPolygons"];
  movePolygons: ReturnType<typeof usePolygonStore>["movePolygons"];
  setPolygons: ReturnType<typeof usePolygonStore>["setPolygons"];
  setCaptureContext: ReturnType<typeof useCaptureStore>["setCaptureContext"];
  snapshot: ReturnType<typeof useHistoryStore>["snapshot"];
  push: ReturnType<typeof useHistoryStore>["push"];
};

export const captureDuplicateEvents = ({
  captureState,
  captureContext,
  capturedMouse,
  currentCanvas,
  currentPolygons,
  capturedItems,
  shift,
  snapshotItem,
  addPolygons,
  movePolygons,
  setPolygons,
  setCaptureContext,
  snapshot,
  push,
}: CaptureDuplicateEventsProps) => {
  if (captureState === CaptureState.HOLD) {
    console.log("captureDuplicateEvents HOLD");
    capturedItems.value = selectCapturedItems(capturedMouse, capturedItems.value, shift);
  }

  if (captureState === CaptureState.HOLD_MOVE) {
    if (captureContext.state !== CaptureContextState.DUPLICATE) {
      if (!snapshotItem) {
        snapshot();
      }
      const selectedItems = capturedItems.value.filter((item) => item.state !== ItemCaptureState.HOVER);
      const duplicatedItems = selectedItems.map((item) => {
        return {
          ...item.item,
          id: safeRandomUUID(),
        };
      });
      addPolygons(currentCanvas.id, duplicatedItems);
      capturedItems.value = duplicatedItems.map((polygon) => makeCapturedItem(polygon));

      // snapshot for sticky movement
      setCaptureContext({
        state: CaptureContextState.DUPLICATE,
        snapshot: {
          polygons: capturedItems.value.map((item) => item.item),
          coord: {
            x: capturedMouse.svgOffset.x,
            y: capturedMouse.svgOffset.y,
          },
        },
      });
    }

    if (captureContext.state === CaptureContextState.DUPLICATE) {
      const movedItems = capturedItems.value.filter((item) => item.state === ItemCaptureState.SELECT);
      if (movedItems) {
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
  }

  if (captureState === CaptureState.HOLD_UP) {
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
    setCaptureContext({
      state: CaptureContextState.IDLE,
    });
  }
};
