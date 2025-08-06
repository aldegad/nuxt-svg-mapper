<script setup lang="ts">
import { OverlayScrollbarsComponent } from "overlayscrollbars-vue";

defineProps<{
  contentClass?: string;
}>();
</script>

<template>
  <OverlayScrollbarsComponent
    defer
    :options="{
      scrollbars: {
        autoHide: 'scroll',
      },
    }"
  >
    <div :class="contentClass">
      <slot />
    </div>
  </OverlayScrollbarsComponent>
</template>

<style>
.os-scrollbar {
  transition: opacity 0.3s ease;
}
.os-scrollbar-hidden {
  opacity: 0 !important;
}
.os-scrollbar-vertical.os-scrollbar {
  width: 8px !important; /* 스크롤바 전체 넓비 */
}
.os-scrollbar-vertical .os-scrollbar-handle {
  background-color: var(--color-slate-200) !important; /* 스크롤바 색상 */
  width: 4px !important; /* 스크롤바 넓이 */
  border-radius: var(--border-radius-base) !important;
}
.os-scrollbar-vertical .os-scrollbar-handle:hover {
  background-color: var(--color-slate-300) !important; /* 스크롤바 호버 색상 */
}

.os-scrollbar-horizontal.os-scrollbar {
  height: 8px !important; /* 스크롤바 전체 넓비 */
}
.os-scrollbar-horizontal .os-scrollbar-handle {
  background-color: var(--color-slate-200) !important; /* 스크롤바 색상 */
  height: 4px !important; /* 스크롤바 넓이 */
  border-radius: var(--border-radius-base) !important;
}
.os-scrollbar-horizontal .os-scrollbar-handle:hover {
  background-color: var(--color-slate-300) !important; /* 스크롤바 호버 색상 */
}
</style>
