<script setup lang="ts">
import type { PivotDir } from "@aldegad/nuxt-core";
import { Overlay } from "@aldegad/nuxt-core";

withDefaults(
  defineProps<{
    visible: boolean;
    target: HTMLElement | null;
    padding?: {
      x: number;
      y: number;
    };
    position?: PivotDir;
  }>(),
  {
    padding: () => ({
      x: 4,
      y: 0,
    }),
  },
);

const emits = defineEmits<{
  "close": [];
}>();

const handleClose = () => {
  emits("close");
};
</script>

<template>
  <Overlay
    aria-label="Popover"
    :visible="visible"
    :target="target"
    class="fixed top-0 left-0 z-100 h-full w-full"
    :backdrop="true"
    backdrop-class="bg-transparent"
    @close="handleClose"
  >
    <template #default="{ pivot }">
      <div
        class="fixed z-2 rounded-md border border-slate-200 bg-slate-50 p-1 shadow-md/10 shadow-slate-500"
        :style="{
          left: `${pivot.left}px`,
          top: `${pivot.top}px`,
        }"
      >
        <slot />
      </div>
    </template>
  </Overlay>
</template>
