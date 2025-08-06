<script setup lang="ts">
import type { ModelPolygonTree } from "~svg-mapper/schemas/stores/polygonStore";

const props = withDefaults(
  defineProps<{
    polygon: ModelPolygonTree;
    index: number;
    level?: number;
  }>(),
  {
    level: 0,
  },
);

const paddingLeft = computed(() => {
  return props.level * 16 + "px";
});
</script>

<template>
  <div class="flex flex-col gap-0.5 whitespace-nowrap">
    <div class="flex flex-col items-start border-b border-slate-200" :style="{ paddingLeft }">
      <span class="text-xs text-slate-500">
        <span class="text-xs text-slate-500">{{ index }} - &nbsp;</span>
        <span class="text-xs text-red-500">{{ polygon.id }}</span>
        <span class="text-xs text-slate-500">&nbsp;- {{ polygon.order }}</span>
      </span>
      <span class="text-xs text-slate-500">{{ polygon.groupId || "null" }} - {{ level }}</span>
    </div>
    <PolyDebugItem
      v-for="child in polygon.children"
      :key="child.id"
      :polygon="child"
      :index="index"
      :level="level + 1"
    />
  </div>
</template>
