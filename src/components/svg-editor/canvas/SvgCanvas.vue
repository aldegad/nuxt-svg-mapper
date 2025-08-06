<script setup lang="ts">
import { useStore } from "~svg-mapper/composables/useStore";
import SvgCanvasCapture from "./SvgCanvasCapture.vue";
import SvgCanvasDrawer from "./SvgCanvasDrawer.vue";

const {
  currentStore: { currentCanvas },
} = useStore();
</script>

<template>
  <div aria-label="PolyCanvas" class="relative h-full w-full">
    <SvgCanvasDrawer v-if="currentCanvas" />
    <SvgCanvasCapture />
  </div>
</template>
