import cloneDeep from "lodash.clonedeep";
import { safeRandomUUID } from "@aldegad/nuxt-core";
import { useStore } from "~svg-mapper/composables/useStore";
import { ItemCaptureState, type ModelPolygon } from "~svg-mapper/schemas/stores";
import { makeCapturedItem } from "~svg-mapper/utils/captures";

export const useCopyPastEvents = () => {
  const {
    captureStore: { capturedItems },
    polygonStore: { addPolygons },
    currentStore: { currentCanvas },
    historyStore: { snapshot, push },
  } = useStore();

  const clipboard = ref<ModelPolygon[]>([]);

  const copyEvents = () => {
    console.log("copyEvents");
    clipboard.value = capturedItems.value
      .filter((item) => {
        return item.state === ItemCaptureState.SELECT;
      })
      .map((item) => {
        const { item: polygon } = item;
        return cloneDeep(polygon);
      });
  };

  const pasteEvents = (original?: ModelPolygon[]) => {
    console.log("pasteEvents");
    if (!currentCanvas.value) return;
    const originalPolygons = original ?? clipboard.value;
    const polygons = originalPolygons.map((polygon) => {
      return {
        ...polygon,
        order: polygon.order + 1,
        id: safeRandomUUID(),
        name: polygon.name + "-copy",
        coords: polygon.coords.map((p) => ({
          x: p.x + 10,
          y: p.y + 10,
        })),
        image: polygon.image
          ? {
              ...polygon.image,
              x: polygon.image.x + 10,
              y: polygon.image.y + 10,
            }
          : null,
      };
    });

    snapshot();
    push();

    addPolygons(currentCanvas.value.id, polygons);
    capturedItems.value = polygons.map((polygon) => makeCapturedItem(polygon));
    clipboard.value = cloneDeep(polygons);
  };

  const duplicateEvents = () => {
    console.log("duplicateEvents");
    if (!currentCanvas.value) return;
    const polygons = capturedItems.value
      .filter((item) => {
        return item.state === ItemCaptureState.SELECT;
      })
      .map((item) => {
        const { item: polygon } = item;
        return cloneDeep(polygon);
      });
    pasteEvents(polygons);
  };

  const clearClipboard = () => {
    clipboard.value = [];
  };

  return { copyEvents, pasteEvents, duplicateEvents, clearClipboard };
};
