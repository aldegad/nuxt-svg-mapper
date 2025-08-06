<script setup lang="ts">
import { Icon } from "@iconify/vue";
import { useStore } from "~svg-mapper/composables/useStore";
import { tools } from "~svg-mapper/schemas/tools";
import type { ToolType } from "~svg-mapper/schemas/tools";

const {
  currentStore: { currentTool, setCurrentTool },
} = useStore();

const handleToolClick = (tool: ToolType) => {
  setCurrentTool(tool);
};
</script>

<template>
  <div class="flex flex-col gap-1">
    <div
      class="flex items-center justify-center rounded-md border border-slate-200 bg-slate-200 px-2 py-1 text-slate-500"
    >
      <span class="text-xs text-slate-500">도구</span>
    </div>
    <div class="grid grid-cols-3 gap-2 rounded-md border border-dashed border-slate-200 bg-slate-100 p-2">
      <template v-for="(tool, index) in tools" :key="index">
        <button
          v-if="tool?.name"
          :key="tool.icon"
          v-tooltip="{ contents: tool.name }"
          class="flex h-8 w-8 items-center justify-center rounded-md border-dashed bg-slate-200 hover:bg-slate-300"
          :class="{
            'bg-slate-300': tool.type === currentTool,
            'border-solid': tool.type === currentTool,
          }"
          @click="handleToolClick(tool.type)"
        >
          <Icon :icon="tool.icon" class="h-4 w-4 text-slate-800" />
        </button>
        <div v-else class="h-8 w-8"></div>
      </template>
    </div>
  </div>
</template>
