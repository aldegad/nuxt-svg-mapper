<script setup lang="ts">
import ScrollView from "~svg-mapper/components/common/ScrollView.vue";
import { useStore } from "~svg-mapper/composables/useStore";
import PolygonTreeItem from "./PolygonTreeItem.vue";

const {
  currentStore: { currentPolygonsByGroup },
} = useStore();
</script>

<template>
  <div class="flex w-full flex-1 flex-col gap-1 rounded-lg border border-slate-200 bg-slate-50 p-2">
    <h3
      class="flex items-center justify-center rounded-md border border-slate-200 bg-slate-200 px-2 py-1 text-slate-500"
    >
      <span class="text-xs text-slate-500">존/유닛 레이어</span>
    </h3>
    <ScrollView class="flex w-full flex-1" content-class="flex flex-col gap-0.5 w-full h-0">
      <PolygonTreeItem
        v-for="(polygon, index) in currentPolygonsByGroup"
        :key="polygon.id"
        :polygon="polygon"
        :index="index"
      />
    </ScrollView>
  </div>
</template>
