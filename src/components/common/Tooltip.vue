<script setup lang="ts">
import { Overlay } from "@aldegad/nuxt-core";

const props = withDefaults(
  defineProps<{
    visible: boolean;
    target: HTMLElement | null;
    contents: string | null | undefined;
    padding?: {
      x: number;
      y: number;
    };
    delay?: number;
  }>(),
  {
    padding: () => ({
      x: 4,
      y: 0,
    }),
    delay: 500,
  },
);

const open = ref(false);
const timer = ref<NodeJS.Timeout | null>(null);

const openTooltip = () => {
  console.log("openTooltip", props.delay);
  timer.value = setTimeout(() => {
    open.value = true;
  }, props.delay || 0);
};

const closeTooltip = () => {
  if (timer.value) {
    clearTimeout(timer.value);
    timer.value = null;
  }
  open.value = false;
};

watch(
  () => props.visible,
  (v) => {
    if (v) {
      openTooltip();
    } else {
      closeTooltip();
    }
  },
  { immediate: true },
);
</script>

<template>
  <Overlay aria-label="tooltip" data-component="ui-tooltip" :visible="open" :target="target">
    <template #default="{ pivot }">
      <div
        aria-label="Tooltip"
        class="pointer-events-none fixed z-100 rounded-md border border-slate-700 bg-slate-600 px-2 shadow-md shadow-slate-100"
        :style="{
          left: `${pivot.left}px`,
          top: `${pivot.top}px`,
        }"
      >
        <span class="text-xs text-slate-200">{{ contents }}</span>
      </div>
    </template>
  </Overlay>
</template>
