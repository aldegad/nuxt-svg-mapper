<script setup lang="ts">
import { Icon } from "@iconify/vue";
import { useStore } from "~svg-mapper/composables/useStore";
import { getImageFileInfo } from "~svg-mapper/utils";
import Button from "../common/Button.vue";
import Input from "../common/Input.vue";

const {
  captureStore: { addExceptRef },
  currentStore: { currentCanvas },
  canvasStore: { setCanvasSize, setCanvasMap, setCanvasMapSize, removeCanvasMap, setCanvasMapLocked, setCanvasViewBox },
} = useStore();

const mapToolboxRef = ref<HTMLElement | null>(null);

const mapSize = reactive({
  width: 1000,
  height: 1000,
});

const locked = computed(() => {
  return currentCanvas.value?.map?.locked ?? false;
});

const handleImageProportions = () => {
  if (!currentCanvas.value?.map) return;
  const image = currentCanvas.value.map;
  const area = 1000 * 1000;
  const aspectRatio = image.originalWidth / image.originalHeight;

  mapSize.width = Math.round(Math.sqrt(area * aspectRatio));
  mapSize.height = Math.round(Math.sqrt(area / aspectRatio));
  setCanvasMapSize(currentCanvas.value.id, {
    width: mapSize.width,
    height: mapSize.height,
  });
};

const handleImageUpload = async (event: Event) => {
  const file = (event.target as HTMLInputElement).files?.[0];
  if (file) {
    const image = await getImageFileInfo(file);
    setCanvasMap(currentCanvas.value?.id ?? "", {
      name: file.name.split(".")[0],
      url: image.url,
      blob: image.blob,
      originalWidth: image.width,
      originalHeight: image.height,
      x: 0,
      y: 0,
      width: currentCanvas.value?.width ?? image.width,
      height: currentCanvas.value?.height ?? image.height,
      locked: false,
    });
  }
  (event.target as HTMLInputElement).value = "";
};

const handleImageRemove = () => {
  if (!currentCanvas.value?.id) return;
  removeCanvasMap(currentCanvas.value.id);
};

const handleLock = () => {
  if (!currentCanvas.value?.id) return;
  setCanvasMapLocked(currentCanvas.value.id, !locked.value);
};

const handleResetViewport = () => {
  if (!currentCanvas.value?.id) return;
  setCanvasViewBox(currentCanvas.value.id, {
    x: 0,
    y: 0,
    width: 1000,
    height: 1000,
  });
};

watch(
  mapToolboxRef,
  (ref) => {
    if (ref) {
      addExceptRef(ref);
    }
  },
  { immediate: true },
);

watch([() => currentCanvas.value?.width, () => currentCanvas.value?.height], (newVal) => {
  mapSize.width = newVal[0] ?? 1000;
  mapSize.height = newVal[1] ?? 1000;
});

watch(
  mapSize,
  (newVal) => {
    if (!currentCanvas.value?.id) return;
    setCanvasSize(currentCanvas.value.id, {
      width: newVal.width,
      height: newVal.height,
    });
  },
  {
    deep: true,
  },
);
</script>

<template>
  <div ref="mapToolboxRef" aria-label="map toolbox" class="absolute top-2 left-1/2 flex -translate-x-1/2 gap-2">
    <div class="flex gap-2 rounded-lg border border-slate-200 bg-white p-2 shadow-md shadow-slate-100">
      <div class="flex items-center gap-1">
        <Input v-model="mapSize.width" type="text" class="!w-16 text-center" :disabled="locked" />
        <span class="text-xs text-slate-500">*</span>
        <Input v-model="mapSize.height" type="text" class="!w-16 text-center" :disabled="locked" />
        <button
          v-tooltip="{ contents: '비율 맞추기' }"
          class="flex h-8 w-8 items-center justify-center rounded-md border border-dashed border-slate-200 bg-slate-100 hover:bg-slate-200 disabled:pointer-events-none"
          :disabled="locked"
          @click="handleImageProportions"
        >
          <Icon icon="lucide:proportions" class="h-4 w-4 text-slate-500" />
        </button>
      </div>
      <div class="flex items-center gap-1">
        <label
          v-tooltip="{ contents: '도면 이미지 업로드' }"
          for="map-image-upload"
          class="flex h-8 w-8 items-center justify-center rounded-md border border-dashed border-slate-200 bg-slate-100 hover:bg-slate-200 disabled:pointer-events-none"
          :disabled="locked"
        >
          <Icon icon="lucide:image-up" class="h-4 w-4 text-slate-500" />
          <input id="map-image-upload" type="file" accept="image/*" class="hidden" @change="handleImageUpload" />
        </label>
        <button
          v-tooltip="{ contents: '도면 이미지 삭제' }"
          class="flex h-8 w-8 items-center justify-center rounded-md border border-dashed border-slate-200 bg-slate-100 hover:bg-slate-200 disabled:pointer-events-none"
          :disabled="locked"
          @click="handleImageRemove"
        >
          <Icon icon="lucide:image-off" class="h-4 w-4 text-slate-500" />
        </button>
      </div>
      <template v-if="locked">
        <button
          v-tooltip="{ contents: '도면 편집 잠금 해제' }"
          class="flex h-8 w-8 items-center justify-center rounded-md border border-indigo-300 bg-indigo-200 hover:bg-indigo-300"
          @click="handleLock"
        >
          <Icon icon="lucide:lock" class="h-4 w-4 text-indigo-500" />
        </button>
      </template>
      <template v-else>
        <button
          v-tooltip="{ contents: '도면 편집 잠금' }"
          class="flex h-8 w-8 items-center justify-center rounded-md border border-dashed border-slate-200 bg-slate-100 hover:bg-slate-200"
          @click="handleLock"
        >
          <Icon icon="lucide:lock-open" class="h-4 w-4 text-slate-500" />
        </button>
      </template>
    </div>
    <div
      v-tooltip="{ contents: '위치/배율 초기화' }"
      class="flex gap-2 rounded-lg border border-slate-200 bg-white p-2 shadow-md shadow-slate-100"
    >
      <Button icon="lucide:shrink" @click="handleResetViewport" />
    </div>
  </div>
</template>
