<script setup lang="ts">
import Button from "~svg-mapper/components/common/Button.vue";
import { useDownload } from "~svg-mapper/composables/useDownload";
import { useStore } from "~svg-mapper/composables/useStore";
import { LayerType } from "~svg-mapper/schemas/stores";
import DetailLayer from "./DetailLayer.vue";
import MapLayer from "./MapLayer.vue";
import PolygonLayer from "./PolygonLayer.vue";

const {
  currentStore: { currentLayer, setCurrentLayer },
  captureStore: { addExceptRef },
} = useStore();

const { handleDownload } = useDownload();

const layersRef = useTemplateRef("layersRef");

watch(
  layersRef,
  (ref) => {
    if (ref) {
      addExceptRef(ref);
    }
  },
  { immediate: true },
);
</script>

<template>
  <div data-component="layers" class="absolute top-0 right-0 z-3 flex h-full w-36 flex-col py-2 pr-2">
    <div aria-label="buttons" class="relative z-2">
      <div
        aria-label="button-inner"
        class="flex justify-between gap-1 rounded-t-lg border border-b-0 border-slate-200 bg-slate-100 p-1 pb-0"
      >
        <div class="relative top-[1px] flex gap-1 p-1">
          <Button
            v-tooltip="{ contents: '다운로드' }"
            class="border-solid bg-white"
            icon="lucide:file-down"
            @click="handleDownload"
          />
        </div>
        <div class="relative top-[1px] flex gap-1 rounded-t-lg border border-b-0 border-slate-200 bg-slate-50 p-1 pb-1">
          <Button
            v-tooltip="{ contents: '레이어 전환' }"
            class="border-solid bg-white"
            icon="lucide:send-to-back"
            @click="setCurrentLayer(currentLayer === LayerType.MAP ? LayerType.DETAIL : LayerType.MAP)"
          />
        </div>
      </div>
    </div>
    <div class="relative flex flex-1">
      <transition name="fade">
        <div
          v-if="currentLayer === 'map'"
          ref="layersRef"
          aria-label="map layers"
          class="absolute top-0 right-0 flex h-full w-full flex-1 flex-col gap-1"
        >
          <MapLayer />
          <PolygonLayer />
        </div>
        <div v-else class="absolute top-0 right-0 flex h-full w-full flex-1 flex-col">
          <DetailLayer />
        </div>
      </transition>
    </div>
  </div>
</template>
