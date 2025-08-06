<script setup lang="ts">
import type { ModelCanvas } from "../../schemas/stores";

defineProps<{
  canvas?: ModelCanvas;
}>();
</script>

<template>
  <g v-if="canvas" aria-label="MapBgPart">
    <rect x="0" y="0" :width="canvas.width" :height="canvas.height" fill="white" />
    <image
      v-if="canvas.map"
      :x="canvas.map?.x ?? 0"
      :y="canvas.map?.y ?? 0"
      :width="canvas.map?.width ?? 100"
      :height="canvas.map?.height ?? 100"
      :href="canvas.map?.url ?? ''"
      preserveAspectRatio="xMidYMid slice"
    />
  </g>
</template>
