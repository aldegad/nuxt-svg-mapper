<script setup lang="ts">
import { DebugPolyTree, DebugStats } from "~svg-mapper/debug";
import OverlayProvider from "~svg-mapper/provider/OverlayProvider.vue";
</script>

<template>
  <ClientOnly>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
    <OverlayProvider />
    <DebugStats />
    <DebugPolyTree />
  </ClientOnly>
</template>
