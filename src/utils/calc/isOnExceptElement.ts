import { isCaptured } from "./isCaptured";
import { CaptureType, type ModelCapture } from "../../schemas/stores";
import { makeRectToCoords } from "../captures/makeRectToCoords";

export const isOnExceptElement = (capturedMouse: ModelCapture, exceptRefs: Element[]) => {
  // exceptRefs안의 element 위에서 HOLD이벤트가 발생했을 경우 무시
  const _isOnExceptElement = exceptRefs.some((ref) => {
    if (!ref) return false;
    const rect = ref.getBoundingClientRect();
    const coorids = makeRectToCoords(rect);
    // 전체화면 기준으로
    return isCaptured(capturedMouse, coorids, {
      captureType: CaptureType.VIEWPORT,
    });
  });

  return _isOnExceptElement;
};
