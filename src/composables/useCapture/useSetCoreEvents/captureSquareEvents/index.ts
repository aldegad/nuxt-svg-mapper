import {
  CaptureState,
  ItemCaptureState,
  type ModelCanvas,
  type ModelCapture,
  type ModelCapturedPolygon,
} from "~svg-mapper/schemas/stores";
import type { useHistoryStore, usePolygonStore } from "~svg-mapper/stores";
import { calcDistance } from "~svg-mapper/utils/calc/calcDistance";
import { makeCapturedItem } from "~svg-mapper/utils/captures/makeCaputuredItem";
import { makeRectToCoords } from "~svg-mapper/utils/captures/makeRectToCoords";

interface CaptureSquareEventsProps {
  captureState: CaptureState;
  capturedMouse: ModelCapture;
  currentCanvas: ModelCanvas;
  capturedItems: Ref<ModelCapturedPolygon[]>;
  snapshotItem: ReturnType<typeof useHistoryStore>["snapshotItem"];
  addPolygon: ReturnType<typeof usePolygonStore>["addPolygon"];
  setPointToPolygon: ReturnType<typeof usePolygonStore>["setPointToPolygon"];
  movePolygon: ReturnType<typeof usePolygonStore>["movePolygon"];
  removePolygon: ReturnType<typeof usePolygonStore>["removePolygon"];
  snapshot: ReturnType<typeof useHistoryStore>["snapshot"];
  push: ReturnType<typeof useHistoryStore>["push"];
}

export const captureSquareEvents = ({
  captureState,
  capturedMouse,
  currentCanvas,
  capturedItems,
  snapshotItem,
  addPolygon,
  movePolygon,
  removePolygon,
  snapshot,
  push,
}: CaptureSquareEventsProps) => {
  if (captureState === CaptureState.HOLD) {
    const coords = makeRectToCoords({
      x: capturedMouse.svgOffset.x,
      y: capturedMouse.svgOffset.y,
      width: 0,
      height: 0,
    });

    const newPolygon = addPolygon(currentCanvas.id, coords);

    capturedItems.value = [
      {
        item: newPolygon,
        state: ItemCaptureState.SELECT,
      },
    ];
  }

  if (captureState === CaptureState.HOLD_MOVE) {
    if (!snapshotItem) {
      snapshot();
    }
    const capturedPolygon = capturedItems.value[0];
    if (capturedPolygon) {
      const startX = capturedPolygon.item.coords[0].x;
      const startY = capturedPolygon.item.coords[0].y;
      const coorids = makeRectToCoords({
        x: startX,
        y: startY,
        width: capturedMouse.svgOffset.x - startX,
        height: capturedMouse.svgOffset.y - startY,
      });
      const movedPolygon = movePolygon(capturedPolygon.item.id, coorids);
      capturedItems.value = [makeCapturedItem(movedPolygon!)];
    }
  }

  if (captureState === CaptureState.HOLD_UP) {
    if (snapshotItem) {
      push();
    }
    const capturedPolygon = capturedItems.value?.[0];

    if (capturedPolygon) {
      for (let i = 0, j = capturedPolygon.item.coords.length - 1; i < capturedPolygon.item.coords.length; j = i++) {
        if (calcDistance(capturedPolygon.item.coords[i], capturedPolygon.item.coords[j]) < 10) {
          console.log(capturedPolygon.item.coords, capturedPolygon.item.coords[i], capturedPolygon.item.coords[j]);
          removePolygon(capturedPolygon.item.id);
          break;
        }
      }
      capturedItems.value = [];
    }
  }

  if (captureState === CaptureState.IDLE) {
    // 캡쳐 아이템 초기화
    capturedItems.value = [];
  }
};
