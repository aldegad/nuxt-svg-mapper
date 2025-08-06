<script setup lang="ts">
import { useStore } from "~svg-mapper/composables/useStore";
import type { Coords } from "~svg-mapper/schemas/coords";
import { ItemCaptureState } from "~svg-mapper/schemas/stores";
import { ToolType } from "~svg-mapper/schemas/tools";
import { getAABBAnchors } from "~svg-mapper/utils/calc/getAABBAnchors";
import PolyControllerItem from "./PolyControllerItem.vue";

const {
  currentStore: { currentTool },
  captureStore: { capturedItems },
} = useStore();

const transformRects = computed<Coords>(() => {
  const selectedItems = capturedItems.value.filter((item) => item.state === ItemCaptureState.SELECT);
  if (selectedItems.length === 0) return [];
  return getAABBAnchors(selectedItems.map((item) => item.item.coords).flat(), {
    dotCount: 8,
  });
});
</script>

<template>
  <template v-for="item in capturedItems" :key="item.item.id">
    <PolyControllerItem :captured-item="item" />
  </template>
  <g v-if="currentTool === ToolType.TRANSFORM">
    <polygon
      :points="transformRects.map((p) => `${p.x},${p.y}`).join(' ')"
      fill="none"
      stroke="var(--color-cyan-500)"
      stroke-width="2"
      stroke-dasharray="5,5"
    />
    <rect
      v-for="(pt, i) in transformRects"
      :key="i"
      :x="pt.x - 3"
      :y="pt.y - 3"
      :width="6"
      :height="6"
      fill="white"
      stroke="var(--color-cyan-500)"
    />
  </g>
</template>
