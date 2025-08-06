<script setup lang="ts">
import { useStore } from "~svg-mapper/composables/useStore";

const {
  currentStore: { currentCanvas },
} = useStore();
</script>

<template>
  <div class="flex w-full flex-col gap-1 rounded-b-lg border border-slate-200 bg-slate-50 p-2">
    <h3
      class="flex items-center justify-center rounded-md border border-slate-200 bg-slate-200 px-2 py-1 text-slate-500"
    >
      <span class="text-xs text-slate-500">도면 레이어</span>
    </h3>
    <div class="flex min-h-4 flex-col gap-1">
      <div
        v-if="currentCanvas?.map"
        class="group flex h-7 items-center justify-center rounded-md border border-dashed border-slate-200 bg-slate-100 pr-1 hover:bg-slate-200"
      >
        <span class="flex-1 overflow-hidden pr-1 pl-2 text-xs text-ellipsis whitespace-nowrap text-slate-500">
          {{ currentCanvas.map.name }}
        </span>
        <!-- <button
          class="hidden h-5 w-5 flex-col items-center justify-center rounded-md border border-slate-100 bg-slate-200 p-0 group-hover:flex hover:bg-slate-300"
        >
          <Icon
            icon="lucide:ellipsis-vertical"
            class="h-3.5 w-3.5 text-slate-500"
          />
        </button> -->
      </div>
    </div>
  </div>
</template>
