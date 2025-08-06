<script setup lang="ts">
import { useStore } from "~svg-mapper/composables";
import MapToolbox from "./svg-editor/MapToolbox.vue";
import PolyToolbox from "./svg-editor/PolyToolbox.vue";
import Layers from "./svg-editor/layers/Layers.vue";
import LeftToolbox from "./svg-editor/left-toolbox/LeftToolbox.vue";
import SvgCanvas from "./svg-editor/canvas/SvgCanvas.vue";

const {
  currentStore: { currentCanvases, currentCanvas, loadCurrent, setCurrentCanvas },
  canvasStore: { addCanvas },
} = useStore();

const route = useRoute();
const id = route.params.id as string;


onMounted(async () => {
  await loadCurrent(id);
  if (!currentCanvases.value.length) {
    await addCanvas(id);
  }
  if (!currentCanvas.value) {
    setCurrentCanvas(currentCanvases.value[0].id);
  }
});
</script>

<template>
  <div aria-label="poly map" class="relative flex flex-1 bg-slate-100">
    <LeftToolbox class="z-2" />
    <SvgCanvas class="z-1 flex-1" />
    <MapToolbox class="z-2" />
    <PolyToolbox class="z-2" />
    <Layers class="z-2" />
  </div>
</template>
