import type { ModelRect } from "~svg-mapper/schemas/common";
import { ItemCaptureState, type ModelCapturedPolygon, type ModelPolygon } from "~svg-mapper/schemas/stores";
import { isCapturedInRect } from "~svg-mapper/utils/calc";

export const findDraggingCapturedItems = (capturedRect: ModelRect, items: ModelPolygon[]): ModelCapturedPolygon[] => {
  const capturedItems = items
    .filter((item) => {
      return isCapturedInRect(capturedRect, item.coords);
    })
    .map((item) => {
      return {
        state: ItemCaptureState.SELECT,
        item,
      };
    });
  return capturedItems;
};
