import {
  type CaptureContext,
  CaptureContextState,
  CaptureState,
  ItemCaptureState,
  type ModelCapture,
  type ModelCapturedPolygon,
  type ModelPolygon,
} from "~svg-mapper/schemas/stores";
import type { useCaptureStore, useHistoryStore, usePolygonStore } from "~svg-mapper/stores";
import { getAABBAnchors, getAABBRect, isCaptured } from "~svg-mapper/utils/calc";
import { makeCapturedItem } from "~svg-mapper/utils/captures/makeCaputuredItem";
import { findNearestTransformPoint } from "./findNearestTransformPoint";
import { transformCoords } from "./transformCoords";
import { hoverCapturedItems } from "../hoverCapturedItem";
import { selectCapturedItems } from "../selectCapturedItems";
import { selectUpCapturedItems } from "../selectUpCapturedItems";

interface CaptureTransformEventsProps {
  captureState: CaptureState;
  captureContext: CaptureContext;
  currentPolygons: ModelPolygon[];
  capturedItems: Ref<ModelCapturedPolygon[]>;
  capturedMouse: ModelCapture;
  shift: boolean;
  currentViewBoxScale: number;
  snapshotItem: ReturnType<typeof useHistoryStore>["snapshotItem"];
  setPolygons: ReturnType<typeof usePolygonStore>["setPolygons"];
  setCaptureContext: ReturnType<typeof useCaptureStore>["setCaptureContext"];
  snapshot: ReturnType<typeof useHistoryStore>["snapshot"];
  push: ReturnType<typeof useHistoryStore>["push"];
}

export const captureTransformEvents = ({
  captureState,
  captureContext,
  currentPolygons,
  capturedItems,
  capturedMouse,
  shift,
  currentViewBoxScale,
  snapshotItem,
  setPolygons,
  setCaptureContext,
  snapshot,
  push,
}: CaptureTransformEventsProps) => {
  if (captureState === CaptureState.HOLD) {
    console.log("captureTransformEvents HOLD");

    // 기존에 select된 아이템이 있었는지 체크
    const selectedItems = capturedItems.value.filter((item) => item.state === ItemCaptureState.SELECT);

    const aabbCoords = getAABBAnchors(selectedItems.map((item) => item.item.coords).flat(), {
      dotCount: 8,
    });

    const isSelected = isCaptured(capturedMouse, aabbCoords, {
      scale: currentViewBoxScale,
      inset: 10,
    });

    if (!isSelected) {
      capturedItems.value = selectCapturedItems(capturedMouse, capturedItems.value, shift);
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
      return;
    }

    const { position } = findNearestTransformPoint(aabbCoords, capturedMouse.svgOffset);
    if (position) {
      setCaptureContext({
        state: CaptureContextState.TRANSFORM,
        transform: {
          polygons: selectedItems.map((item) => item.item),
          position,
        },
      });
    }
  }

  if (captureState === CaptureState.HOLD_MOVE) {
    console.log("captureTransformEvents HOLD_MOVE");
    const selectedItems = captureContext.transform?.polygons.map(
      (item) => capturedItems.value.find((capturedItem) => capturedItem.item.id === item.id)!,
    );

    if (selectedItems) {
      if (!snapshotItem) {
        snapshot();
      }
      // console.log("captureTransformEvents HOLD_MOVE", selectedItems);
      const aabbCoords = getAABBAnchors(selectedItems.map((item) => item.item.coords).flat(), {
        dotCount: 4,
      });

      const polygons = selectedItems.map((item) => {
        const coords = transformCoords(aabbCoords, item.item.coords, captureContext.transform!.position, {
          deltaX: capturedMouse.svgOffset.deltaX,
          deltaY: capturedMouse.svgOffset.deltaY,
        });
        const polygon: ModelPolygon = {
          ...item.item,
          coords,
          image: item.item.image
            ? {
                ...item.item.image,
                ...getAABBRect(coords),
              }
            : null,
        };
        return polygon;
      });

      setPolygons(polygons);
      capturedItems.value = polygons.map((polygon) => makeCapturedItem(polygon));
    }
  }

  if (captureState === CaptureState.HOLD_UP) {
    console.log("captureTransformEvents HOLD_UP");
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
