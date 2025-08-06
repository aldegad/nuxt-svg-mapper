import { ItemCaptureState, type ModelCapturedPolygon } from "~svg-mapper/schemas/stores";

export const selectUpCapturedItems = (capturedItems: ModelCapturedPolygon[], shift: boolean) => {
  if (shift) {
    // 쉬프트 키를 누른 상태라면 모두 유지
    return capturedItems;
  }

  // 쉬프트 키를 누르지 않은 상태라면,

  // 포커스 상태인 아이템이 있다면, 해당 아이템만 셀렉트 상태로 변경
  const focusedItem = capturedItems.find((item) => item.state === ItemCaptureState.FOCUS);
  if (focusedItem) {
    // 아이템을 놓았을 때,
    // 해당 아이템만 셀렉트 상태로 변경
    focusedItem.state = ItemCaptureState.SELECT;
    return [focusedItem];
  }

  // 포커스 상태인 아이템이 없다면, 모두 유지
  return capturedItems;
};
