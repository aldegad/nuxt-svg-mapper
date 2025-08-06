<script setup lang="ts">
import { useStore } from "~svg-mapper/composables/useStore";
// import BluePrints from "./BluePrints.vue";
import Canvases from "./Canvases.vue";
import Tools from "./Tools.vue";

const toolboxRef = ref<HTMLElement | null>(null);
const {
  captureStore: { addExceptRef },
} = useStore();

watch(
  toolboxRef,
  (ref) => {
    if (ref) {
      addExceptRef(ref);
    }
  },
  { immediate: true },
);
</script>

<template>
  <div
    ref="toolboxRef"
    aria-label="Toolbox"
    class="flex h-full cursor-default border-r border-slate-200 bg-slate-50 p-2"
  >
    <div class="flex flex-col gap-2">
      <Tools />
      <!-- <BluePrints /> -->
      <Canvases />
    </div>
  </div>
</template>
