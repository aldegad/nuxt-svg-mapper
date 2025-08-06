<script setup lang="ts">
import type { ModelCanvas } from "../../schemas/stores";

defineProps<{
  canvas?: ModelCanvas;
}>();
</script>

<template>
  <rect
    v-if="canvas"
    aria-label="MapCoverPart"
    x="0"
    y="0"
    :width="canvas.width"
    :height="canvas.height"
    fill="none"
    stroke="var(--color-slate-400)"
    stroke-width="0.5"
  />
</template>
