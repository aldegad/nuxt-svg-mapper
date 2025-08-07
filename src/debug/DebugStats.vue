<script setup lang="ts">
import { PerformanceMonitor } from "@aldegad/nuxt-core";
import { useStore } from "~svg-mapper/composables";

const {
  debugStore: { isDebugStats },
} = useStore();
</script>

<template>
  <PerformanceMonitor v-if="isDebugStats" />
</template>
