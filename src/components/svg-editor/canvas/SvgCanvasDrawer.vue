<script setup lang="ts">
import MapBgPart from "~svg-mapper/components/svg-common/MapBgPart.vue";
import MapCoverPart from "~svg-mapper/components/svg-common/MapCoverPart.vue";
import PolygonViewer from "~svg-mapper/components/svg-common/PolygonViewer.vue";
import { useStore } from "~svg-mapper/composables/useStore";
import type { Coords } from "~svg-mapper/schemas/coords";
import { CaptureContextState } from "~svg-mapper/schemas/stores";
import { makeRectToCoords } from "~svg-mapper/utils/captures";
import PolyController from "./drawer/PolyController.vue";

const {
  captureStore: { setCanvasSvgRef, captureContext },
  currentStore: { currentViewBox, currentPolygons, currentCanvas },
} = useStore();

const polyDrawerSvgRef = ref<SVGSVGElement | null>(null);
const viewBox = computed(() => {
  return `${currentViewBox.value.x} ${currentViewBox.value.y} ${currentViewBox.value.width} ${currentViewBox.value.height}`;
});
const dragCoords = computed<Coords>(() => {
  return captureContext.value.drag?.rect ? makeRectToCoords(captureContext.value.drag.rect) : [];
});

onMounted(() => {
  setCanvasSvgRef(polyDrawerSvgRef.value);
});
</script>

<template>
  <svg
    ref="polyDrawerSvgRef"
    aria-label="PolyDrawer"
    class="pointer-events-none absolute z-1 h-full w-full"
    :viewBox="viewBox"
  >
    <MapBgPart :canvas="currentCanvas!" />
    <PolygonViewer :polygons="currentPolygons" />
    <PolyController />
    <polygon
      v-if="captureContext.state === CaptureContextState.DRAG"
      :points="dragCoords.map((p) => `${p.x},${p.y}`).join(' ')"
      fill="var(--color-indigo-400)"
      fill-opacity="0.2"
      stroke="var(--color-indigo-600)"
      stroke-width="1"
      stroke-dasharray="2"
    />
    <MapCoverPart :canvas="currentCanvas!" />
  </svg>
</template>
