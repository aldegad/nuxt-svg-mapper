import type { Ref } from "vue";
import type { PolyMapData } from "~svg-mapper/schemas/polyMapData";
import { useViewerTempStore } from "~svg-mapper/stores";
import { parsePolyMapData } from "~svg-mapper/utils/parsePolyMapData";

export const useSvgMapViewer = (): {
  polyMapData: Ref<PolyMapData | null>;
  handleMapUpload: (event: Event) => Promise<void>;
} => {
  const viewerTempStore = useViewerTempStore();
  const { tempData } = storeToRefs(viewerTempStore);
  const { setTempData, loadTempData, unloadTempData } = viewerTempStore;

  const polyMapData = ref<PolyMapData | null>(null);

  const handleMapUpload = async (event: Event) => {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      const json = JSON.parse(await file.text());
      setTempData(json);
    }
  };

  watch(tempData, (newData) => {
    polyMapData.value = newData ? parsePolyMapData(newData) : null;
  });

  onMounted(() => {
    loadTempData();
  });

  onBeforeUnmount(() => {
    unloadTempData();
  });

  return { polyMapData, handleMapUpload };
};
