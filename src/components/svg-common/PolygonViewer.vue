<script setup lang="ts">
import type { ModelCapturedPolygon, ModelPolygon } from "~svg-mapper/schemas/stores";
import PolygonItem from "./PolygonItem.vue";

defineProps<{
  capturedPolygons?: ModelCapturedPolygon[];
  polygons?: ModelPolygon[];
}>();
</script>

<template>
  <PolygonItem v-for="polygon in polygons" :key="polygon.id" :polygon="polygon" :captured-polygons="capturedPolygons" />
</template>
