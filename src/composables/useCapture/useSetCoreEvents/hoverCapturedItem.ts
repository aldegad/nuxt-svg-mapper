import { ItemCaptureState } from "~svg-mapper/schemas/stores";
import type { ModelCapture, ModelCapturedPolygon, ModelPolygon } from "~svg-mapper/schemas/stores";
import { findCapturedItem } from "./findCapturedItem";

interface HoverCapturedItemsProps {
  polygons: ModelPolygon[];
  capturedMouse: ModelCapture;
  capturedItems?: ModelCapturedPolygon[];
}

export const hoverCapturedItems = ({
  polygons,
  capturedMouse,
  capturedItems = [],
}: HoverCapturedItemsProps): ModelCapturedPolygon[] => {
  const selectedItems = capturedItems.filter((item) => item.state !== ItemCaptureState.HOVER);

  const hoveredCapturedItem = findCapturedItem({
    polygons,
    capturedMouse,
  });

  if (!hoveredCapturedItem) return selectedItems;

  // 기존 아이템과 hover아이템이 같은 아이디이면, hover아이템 무시
  if (selectedItems.some((item) => item.item.id === hoveredCapturedItem.item.id)) {
    return selectedItems;
  }

  // 기존 아이템에 hover아이템과 같은 아이디가 없다면, hover아이템 추가
  return [...selectedItems, hoveredCapturedItem];
};
