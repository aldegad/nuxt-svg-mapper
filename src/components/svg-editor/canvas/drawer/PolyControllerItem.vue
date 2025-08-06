<script setup lang="ts">
import { useStore } from "~svg-mapper/composables/useStore";
import { ItemCaptureState, type ModelCapturedPolygon } from "~svg-mapper/schemas/stores";
import { ToolType } from "~svg-mapper/schemas/tools";

defineProps<{
  capturedItem: ModelCapturedPolygon;
}>();

const {
  currentStore: { currentTool },
} = useStore();
</script>

<template>
  <polygon
    v-if="currentTool !== ToolType.TRANSFORM"
    :points="capturedItem.item.coords.map((p) => `${p.x},${p.y}`).join(' ')"
    fill="none"
    stroke="var(--color-cyan-500)"
    stroke-opacity="1"
    :stroke-width="capturedItem.state === ItemCaptureState.FOCUS ? 3 : 2"
    :stroke-dasharray="capturedItem.state === ItemCaptureState.FOCUS ? '' : '5,5'"
  />
  <polygon
    v-if="currentTool === ToolType.TRANSFORM"
    :points="capturedItem.item.coords.map((p) => `${p.x},${p.y}`).join(' ')"
    fill="none"
    stroke="var(--color-cyan-500)"
    stroke-opacity="1"
    stroke-width="1"
    stroke-dasharray="5,5"
  />
</template>
