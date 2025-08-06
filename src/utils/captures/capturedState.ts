import type { ModelCapturedPolygon, ModelPolygon } from "~svg-mapper/schemas";

export const capturedState = (capturedItems: ModelCapturedPolygon[], item: ModelPolygon) => {
  const captured = capturedItems.find((capturedItem) => capturedItem.item.id === item.id);
  if (captured) {
    return captured.state;
  } else {
    return null;
  }
};
