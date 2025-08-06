import { ItemCaptureState } from "../../schemas/stores/captureStore";
import type { ModelCapturedPolygon } from "../../schemas/stores/captureStore";
import type { ModelPolygon } from "../../schemas/stores/polygonStore";

export const makeCapturedItem = (item: ModelPolygon): ModelCapturedPolygon => {
  return {
    item,
    state: ItemCaptureState.SELECT,
  };
};
