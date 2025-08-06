<script setup lang="ts">
import { useCapture } from "~svg-mapper/composables/useCapture";
import { useStore } from "~svg-mapper/composables/useStore";

const {
  currentStore: { currentCursor },
} = useStore();

const captureRef = ref<HTMLElement | null>(null);
const { createCapture } = useCapture();
const removeMouseEvents = ref<() => void>();

watch(
  captureRef,
  (ref) => {
    if (ref) {
      removeMouseEvents.value = createCapture(ref);
    }
  },
  { immediate: true },
);

onUnmounted(() => {
  if (removeMouseEvents.value) {
    removeMouseEvents.value();
  }
});
</script>

<template>
  <div
    ref="captureRef"
    aria-label="PolyCanvasCapture"
    class="absolute top-0 right-0 bottom-0 left-0 z-3 h-full w-full"
    :style="{ cursor: currentCursor }"
  />
</template>
