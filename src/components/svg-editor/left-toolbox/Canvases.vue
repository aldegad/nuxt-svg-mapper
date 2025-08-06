<script setup lang="ts">
import { Icon } from "@iconify/vue";
import { useStore } from "~svg-mapper/composables/useStore";
import CanvasItem from "./CanvasItem.vue";

const {
  currentStore: { currentProject, currentCanvases },
  canvasStore: { addCanvas },
} = useStore();

const handleAddMap = () => {
  if (!currentProject.value) return;
  addCanvas(currentProject.value.id);
};
</script>

<template>
  <div class="flex flex-col gap-1" aria-label="Toolbox Canvases">
    <div
      aria-label="map label"
      class="flex items-center justify-center rounded-md border border-slate-200 bg-slate-200 px-2 py-1 text-slate-500"
    >
      <span class="text-xs text-slate-500">캔버스</span>
    </div>
    <CanvasItem v-for="canvas of currentCanvases" :key="canvas.id" :canvas="canvas" />
    <button
      class="flex h-7 flex-col items-center justify-center rounded-md border border-dashed border-slate-200 bg-slate-100 px-2 hover:bg-slate-200"
      @click="handleAddMap"
    >
      <Icon icon="lucide:plus" class="text-slate-500" />
    </button>
  </div>
</template>
