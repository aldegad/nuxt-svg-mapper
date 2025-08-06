import { ItemCaptureState, type ModelCapture, type ModelCapturedPolygon } from "~svg-mapper/schemas/stores";
import { findCapturedItem } from "./findCapturedItem";

export const selectCapturedItems = (
  capturedMouse: ModelCapture,
  capturedItems: ModelCapturedPolygon[],
  shift: boolean,
) => {
  if (shift) {
    // 쉬프트 키를 누르면, 모든 아이템을 선택 상태로 변경
    return capturedItems.map((item) => {
      return {
        ...item,
        state: ItemCaptureState.SELECT,
      };
    });
  }

  // 쉬프트 키를 누르지 않고
  const capturedItem = findCapturedItem({
    polygons: capturedItems.map((item) => item.item),
    capturedMouse,
    capturedItems,
  });

  if (capturedItem) {
    // 아이템을 클릭하였을 때, 해당 아이템이 이미 셀렉트 된 아이템이 었다면,
    // 해당 아이템을 포커스 상태로 변경하고, 기존 다른 셀렉트되었던 아이템들을 모두 유지
    if (capturedItems.some((item) => item.item.id === capturedItem.item.id && item.state === ItemCaptureState.SELECT)) {
      return capturedItems.map((item) => {
        if (item.item.id === capturedItem.item.id) {
          return { ...item, state: ItemCaptureState.FOCUS };
        }
        return item;
      });
    }
    // 아이템을 클릭하였을 때, 해당 아이템이 셀렉트 되었던 아이템이 아니라면, 해당 아이템만 셀렉트 상태로 변경
    capturedItem.state = ItemCaptureState.SELECT;
    return [capturedItem];
  }

  // 쉬프트 키를 누르지 않고 빈 공간을 클릭하면 모든 캡쳐 해제
  return [];
};
