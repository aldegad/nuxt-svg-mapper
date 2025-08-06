<script setup lang="ts">
import type { ModelCapturedPolygon, ModelPolygon } from "~svg-mapper/schemas/stores";
import { getAABBCenter } from "~svg-mapper/utils/calc";

const props = defineProps<{
  capturedPolygons?: ModelCapturedPolygon[];
  polygon: ModelPolygon;
}>();

const transform = computed(() => {
  if (!props.capturedPolygons?.some((p) => p.item.id === props.polygon.id)) {
    return null;
  }
  const center = getAABBCenter(props.polygon.coords);
  return `translate(${center[0]}, ${center[1]}) scale(1.05) translate(-${center[0]}, -${center[1]})`;
});
</script>

<template>
  <g :transform="transform ?? undefined">
    <defs v-if="polygon.image">
      <clipPath :id="`clip-${polygon.id}`">
        <polygon :points="polygon.coords.map((p) => `${p.x},${p.y}`).join(' ')" />
      </clipPath>
    </defs>
    <image
      v-if="polygon.image"
      :href="polygon.image.url"
      :x="polygon.image.x"
      :y="polygon.image.y"
      :width="polygon.image.width"
      :height="polygon.image.height"
      preserveAspectRatio="xMidYMid slice"
      :clip-path="`url(#clip-${polygon.id})`"
    />
    <polygon
      :points="polygon.coords.map((p) => `${p.x},${p.y}`).join(' ')"
      :fill="polygon.fillColor ?? 'transparent'"
      :fill-opacity="polygon.fillOpacity ?? undefined"
      :stroke="polygon.strokeColor ?? undefined"
      :stroke-width="polygon.strokeWidth ?? undefined"
      :stroke-opacity="polygon.strokeOpacity ?? undefined"
    />
  </g>
</template>
