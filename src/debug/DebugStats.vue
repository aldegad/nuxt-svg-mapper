<script setup lang="ts">
import Stats from "stats.js";
import { useStore } from "~svg-mapper/composables/useStore";

const {
  debugStore: { isDebugStats },
} = useStore();

let stats1: Stats;
let stats2: Stats;

const createStats = () => {
  stats1 = new Stats();
  stats1.showPanel(0); // FPS
  stats1.dom.style.position = "fixed";
  stats1.dom.style.top = "0px";
  stats1.dom.style.left = "auto";
  stats1.dom.style.right = "80px";
  stats1.dom.style.zIndex = "9999";
  document.body.appendChild(stats1.dom);

  stats2 = new Stats();
  stats2.showPanel(2); // MB
  stats2.dom.style.position = "fixed";
  stats2.dom.style.top = "0px";
  stats2.dom.style.left = "auto";
  stats2.dom.style.right = "0px";
  stats2.dom.style.zIndex = "9999";
  document.body.appendChild(stats2.dom);

  const animate = () => {
    stats1.begin();
    stats1.end();
    stats2.begin();
    stats2.end();
    requestAnimationFrame(animate);
  };

  requestAnimationFrame(animate);
};

const destroyStats = () => {
  if (stats1?.dom?.parentNode) {
    stats1.dom.parentNode.removeChild(stats1.dom);
  }
  if (stats2?.dom?.parentNode) {
    stats2.dom.parentNode.removeChild(stats2.dom);
  }
};

watch(
  isDebugStats,
  (newVal) => {
    destroyStats();
    if (newVal) {
      createStats();
    }
  },
  {
    immediate: true,
  },
);
</script>

<template>
  <!-- nothing to render; stats.js DOM handles UI -->
  <slot />
</template>
