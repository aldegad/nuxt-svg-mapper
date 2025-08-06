<script setup lang="ts">
import { OverlayContextProvider } from "@aldegad/nuxt-core";
import { Tooltip } from "~svg-mapper/components";
</script>

<template>
  <OverlayContextProvider>
    <template #content="{ item }">
      <Tooltip v-if="item.type === 'TOOLTIP'" v-bind="item" />
    </template>
  </OverlayContextProvider>
</template>
