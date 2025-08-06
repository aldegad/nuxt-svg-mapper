import type { Ref } from "vue";
import { PolyEvents } from "~svg-mapper/schemas";
import type { PolyMapData } from "~svg-mapper/schemas/polyMapData";
import { ItemCaptureState } from "~svg-mapper/schemas/stores";
import type { ModelCapturedPolygon } from "~svg-mapper/schemas/stores";
import { scaleFromDelta } from "~svg-mapper/utils";
import { isCapturedInPolygon, scaleViewBox } from "~svg-mapper/utils/calc";
import { useEventDispatcher } from "./useEventDispatcher";
import { useGesture } from "./useGesture";
import { usePolySvg } from "./usePolySvg";
import { useShortcut } from "./useShortcut";

type UseCaptureProps = {
  svgMapSvgRef: Ref<SVGSVGElement | null>;
  gestureSvgRef: Ref<SVGSVGElement | null>;
  polyMapData: Ref<PolyMapData | null>;
};

export const useCaptureViewer = ({ svgMapSvgRef, gestureSvgRef, polyMapData }: UseCaptureProps) => {
  const { svgRect, originSvgViewBox, svgViewBox, updateSvgViewBox, setInitialViewBox } = usePolySvg({
    polyMapSvgRef: svgMapSvgRef,
  });
  const { gesture } = useGesture({
    svgRef: gestureSvgRef,
    svgRect,
  });
  const { shortcut } = useShortcut();
  const { watchEvents } = useEventDispatcher({
    gesture,
    shortcut,
    polyMapData,
  });

  const capturedPolygons = ref<ModelCapturedPolygon[]>([]);

  watchEvents((polyEvent) => {
    switch (polyEvent) {
      case PolyEvents.VIEWPORT_ZOOM: {
        const scale = scaleFromDelta({
          delta: gesture.model.svgVector.deltaY,
          originViewBox: originSvgViewBox.value,
          currentViewBox: svgViewBox.value,
        });
        // console.log(scale, originSvgViewBox.value, svgViewBox.value);
        const newViewBox = scaleViewBox({
          viewBox: svgViewBox.value,
          center: gesture.model.svgVector,
          scale,
        });
        updateSvgViewBox(newViewBox);
        break;
      }
      case PolyEvents.VIEWPORT_MOVE: {
        const newViewBox = {
          ...svgViewBox.value,
          x: svgViewBox.value.x - gesture.model.svgVector.deltaX,
          y: svgViewBox.value.y - gesture.model.svgVector.deltaY,
        };
        updateSvgViewBox(newViewBox);
        break;
      }
      case PolyEvents.POINTER_MOVE: {
        const rawCapturedPolygons = polyMapData.value?.polygons.filter((polygon) =>
          isCapturedInPolygon({
            point: gesture.model.svgVector,
            polygonCoords: polygon.coords,
          }),
        );
        if (rawCapturedPolygons?.length) {
          capturedPolygons.value = rawCapturedPolygons.map((polygon) => ({
            state: ItemCaptureState.HOVER,
            item: polygon,
          }));
        }
        break;
      }
      case PolyEvents.POINTER_SELECT: {
        break;
      }
    }
  });

  return {
    svgViewBox,
    gesture,
    capturedPolygons,
    setInitialViewBox,
    updateSvgViewBox,
  };
};
