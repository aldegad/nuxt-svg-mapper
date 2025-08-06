import { useStore } from "~svg-mapper/composables/useStore";
import { type AlignType, ItemCaptureState } from "~svg-mapper/schemas/stores";
import { makeCapturedItem } from "~svg-mapper/utils/captures";

export const useAlignPolygons = () => {
  const {
    captureStore: { capturedItems },
    polygonStore: { alignPolygons: _alignPolygons },
    historyStore: { snapshot, push },
  } = useStore();

  const selectedCaptured = computed(() => {
    return capturedItems.value.filter((item) => item.state === ItemCaptureState.SELECT);
  });

  const alignPolygons = (alignType: AlignType) => {
    snapshot();
    push();

    const alignedPolygons = _alignPolygons(
      selectedCaptured.value.map((captured) => captured.item.id),
      alignType,
    );
    capturedItems.value = alignedPolygons.map((polygon) => makeCapturedItem(polygon));
  };

  return {
    alignPolygons,
  };
};
