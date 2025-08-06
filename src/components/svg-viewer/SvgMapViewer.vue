<script setup lang="ts">
import type { ClassNameValue } from "tailwind-merge";
import { tw } from "@aldegad/nuxt-core";
import { useCaptureViewer } from "~svg-mapper/composables";
import type { PolyMapData } from "~svg-mapper/schemas/polyMapData";
import Button from "../common/Button.vue";
import MapBgPart from "../svg-common/MapBgPart.vue";
import MapCoverPart from "../svg-common/MapCoverPart.vue";
import PolyDrawerGizmos from "../svg-common/PolyDrawerGizmos.vue";
import PolygonViewer from "../svg-common/PolygonViewer.vue";

const props = defineProps<{
  data?: PolyMapData | null;
}>();

const attrs = useAttrs();
const gestureSvgRef = ref<SVGSVGElement | null>(null);
const svgMapSvgRef = ref<SVGSVGElement | null>(null);
const polyMapData = ref<PolyMapData | null>(props.data ?? null);

const { svgViewBox, gesture, capturedPolygons, setInitialViewBox, updateSvgViewBox } = useCaptureViewer({
  svgMapSvgRef,
  gestureSvgRef,
  polyMapData,
});

const canvas = computed(() => polyMapData.value?.canvas);
const polygons = computed(() => polyMapData.value?.polygons);
const viewBox = computed(
  () => `${svgViewBox.value.x} ${svgViewBox.value.y} ${svgViewBox.value.width} ${svgViewBox.value.height}`,
);

watch(
  () => props.data,
  (newData) => {
    if (newData) {
      const originCanvas = polyMapData.value?.canvas;
      polyMapData.value = newData;
      if (originCanvas !== newData.canvas) {
        setInitialViewBox({
          x: 0,
          y: 0,
          width: newData.canvas.map!.width,
          height: newData.canvas.map!.height,
        });
      }
    } else {
      polyMapData.value = null;
    }
  },
);

const handleResetViewport = () => {
  if (!polyMapData.value?.canvas.map) return;
  updateSvgViewBox(
    {
      x: 0,
      y: 0,
      width: polyMapData.value.canvas.map.width,
      height: polyMapData.value.canvas.map.height,
    },
    300,
  );
};
</script>

<template>
  <div aria-label="poly map viewer" :class="tw('relative h-full w-full', attrs.class as ClassNameValue)">
    <svg ref="svgMapSvgRef" class="absolute top-0 left-0 h-full w-full" :viewBox="viewBox">
      <MapBgPart :canvas="canvas" />
      <PolygonViewer :polygons="polygons" :captured-polygons="capturedPolygons" />
      <MapCoverPart :canvas="canvas" />
    </svg>
    <PolyDrawerGizmos :gesture-model="gesture.model" :viewBox="viewBox" />
    <svg ref="gestureSvgRef" class="absolute top-0 left-0 z-4 h-full w-full" :viewBox="viewBox"></svg>
    <div class="absolute right-4 bottom-4 z-5 flex">
      <Button icon="lucide:shrink" class="border-solid bg-white" @click="handleResetViewport" />
    </div>
  </div>
</template>
