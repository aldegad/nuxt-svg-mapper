<script setup lang="ts">
import type { Coords } from "~svg-mapper/schemas/coords";
import type { GestureModel } from "~svg-mapper/schemas/gesture";
import { useDebugStore } from "~svg-mapper/stores";
import { makeRectToCoords } from "~svg-mapper/utils/captures";

const props = defineProps<{
  gestureModel: GestureModel;
  viewBox: string;
}>();

const debugStore = useDebugStore();
const { isDebugCursor } = storeToRefs(debugStore);

const mouseRawSvgPoints = computed<Coords>(() =>
  makeRectToCoords({
    x: props.gestureModel.canvasVector.x,
    y: props.gestureModel.canvasVector.y,
    width: 1,
    height: 1,
  }),
);
const mouseSyncSvgPoints = computed<Coords>(() =>
  makeRectToCoords({
    x: props.gestureModel.svgVector.x,
    y: props.gestureModel.svgVector.y,
    width: 1,
    height: 1,
  }),
);
</script>

<template>
  <div v-if="isDebugCursor" class="pointer-events-none absolute top-0 left-0 z-2 h-full w-full">
    <svg aria-label="PolyDrawerGizmos" class="absolute top-0 left-0 h-full w-full" :viewBox="viewBox">
      <polygon
        aria-label="mouse raw svg tracker"
        :points="mouseRawSvgPoints.map((p) => `${p.x},${p.y}`).join(' ')"
        fill="#2563eb"
        stroke-width="10"
        stroke="#2563eb"
      />
      <text
        v-if="mouseRawSvgPoints.length"
        :x="mouseRawSvgPoints[0].x + 8"
        :y="mouseRawSvgPoints[0].y - 6"
        fill="#2563eb"
        font-size="10"
        text-anchor="start"
      >
        mouse raw svg tracker
      </text>
      <polygon
        aria-label="mouse sync svg tracker"
        :points="mouseSyncSvgPoints.map((p) => `${p.x},${p.y}`).join(' ')"
        fill="#22c55e"
        stroke-width="10"
        stroke="#22c55e"
      />
      <text
        v-if="mouseSyncSvgPoints.length"
        :x="mouseSyncSvgPoints[0].x - 8"
        :y="mouseSyncSvgPoints[0].y - 6"
        fill="#22c55e"
        font-size="10"
        text-anchor="end"
      >
        mouse sync svg tracker
      </text>
    </svg>
    <div
      aria-label="mouse raw tracker"
      class="absolute z-2 h-[7px] w-[7px] bg-red-400"
      :style="{
        left: gestureModel.canvasVector.x - 3 + 'px',
        top: gestureModel.canvasVector.y - 3 + 'px',
      }"
    >
      <p class="absolute bottom-[-3px] left-[-88px] text-right text-[10px] text-red-400">mouse raw tracker</p>
    </div>
  </div>
</template>
