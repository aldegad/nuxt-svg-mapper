<script setup lang="ts">
import { ScrollView } from "~svg-mapper/components";
import { useStore } from "~svg-mapper/composables";
import PolyDebugItem from "./PolyDebugItem.vue";

const {
  currentStore: { currentPolygonsByGroup },
  debugStore: { isDebugPolygonTree },
} = useStore();
</script>

<template>
  <ScrollView
    v-if="isDebugPolygonTree"
    class="!absolute top-16 right-18 z-999 h-200 bg-white/30 text-[10px] text-red-500"
  >
    <PolyDebugItem
      v-for="(polygon, index) in currentPolygonsByGroup"
      :key="polygon.id"
      :polygon="polygon"
      :index="index"
    />
  </ScrollView>
</template>
