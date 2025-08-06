import cloneDeep from "lodash.clonedeep";
import { useStore } from "./useStore";
import { blobToBase64 } from "../utils/blobToBase64";

export const useDownload = () => {
  const {
    currentStore: { currentCanvas, currentPolygons },
  } = useStore();

  const handleDownload = async () => {
    // currentCanvas와 currentPolygons 데이터를 json 파일로 다운로드

    const data = {
      canvas: cloneDeep({
        ...currentCanvas.value,
        map: currentCanvas.value?.map
          ? {
              ...currentCanvas.value?.map,
              blob: null,
              base64: currentCanvas.value?.map?.blob ? await blobToBase64(currentCanvas.value.map.blob) : null,
            }
          : null,
      }),
      polygons: cloneDeep(
        await Promise.all(
          currentPolygons.value.map(async (polygon) => ({
            ...polygon,
            image: polygon.image
              ? {
                  ...polygon.image,
                  blob: null,
                  base64: polygon.image?.blob ? await blobToBase64(polygon.image.blob) : null,
                }
              : null,
          })),
        ),
      ),
    };
    const blob = new Blob([JSON.stringify(data)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "data.json";
    a.click();
  };

  return { handleDownload };
};
