<script setup lang="ts">
import { Icon } from "@iconify/vue";
import MenuPopover from "~svg-mapper/components/common/MenuPopover.vue";
import RenamePopover from "~svg-mapper/components/common/RenamePopover.vue";
import { useStore } from "~svg-mapper/composables/useStore";
import { CanvasesMenuName, canvasesMenuModel } from "~svg-mapper/schemas/components/toolbox";
import type { ModelCanvas } from "~svg-mapper/schemas/stores";

const props = defineProps<{
  canvas: ModelCanvas;
}>();

const {
  currentStore: { currentCanvas, setCurrentCanvas },
  canvasStore: { removeCanvas, renameCanvas },
} = useStore();

const menuButtonRef = ref<HTMLElement | null>(null);
const visible = ref(false);
const renameVisible = ref(false);

const handleCanvasClick = (canvas: ModelCanvas) => {
  setCurrentCanvas(canvas.id);
};

const handleOpenMenu = (event: MouseEvent) => {
  event.stopPropagation();
  visible.value = true;
};

const handleSubmitMenu = (_: MouseEvent, name: string) => {
  switch (name) {
    case CanvasesMenuName.RENAME:
      renameVisible.value = true;
      break;
    case CanvasesMenuName.DELETE:
      removeCanvas(props.canvas.id);
      break;
  }
};

const handleSubmitRename = (_: Event, name: string) => {
  renameCanvas(props.canvas.id, name);
};
</script>

<template>
  <div
    :key="canvas.id"
    v-tooltip="{ contents: canvas.name }"
    aria-label="map item"
    aria-haspopup="true"
    class="group relative flex min-h-8 items-center justify-between gap-2 rounded-md border border-dashed border-slate-200 bg-slate-100 py-1 pr-1 pl-2 hover:bg-slate-200"
    :class="{
      'border-solid !border-indigo-200 !bg-indigo-100': currentCanvas?.id === canvas.id,
    }"
    @click="handleCanvasClick(canvas)"
  >
    <span
      class="w-0 flex-1 overflow-hidden text-xs text-ellipsis whitespace-nowrap text-slate-500"
      :class="{
        'text-slate-700': currentCanvas?.id === canvas.id,
      }"
    >
      {{ canvas.name }}
    </span>
    <button
      ref="menuButtonRef"
      class="hidden h-5 w-5 flex-col items-center justify-center rounded-md border border-slate-100 bg-slate-200 p-0 group-hover:flex hover:bg-slate-300"
      :class="{
        '!flex': visible || renameVisible,
      }"
      @click="handleOpenMenu"
    >
      <Icon icon="lucide:ellipsis-vertical" class="h-3.5 w-3.5 text-slate-500" />
    </button>
  </div>
  <MenuPopover
    :visible="visible"
    :target="menuButtonRef"
    :model="canvasesMenuModel"
    @close="visible = false"
    @submit="handleSubmitMenu"
  />
  <RenamePopover
    :visible="renameVisible"
    :target="menuButtonRef"
    :placeholder="canvas.name"
    :value="canvas.name"
    @close="renameVisible = false"
    @submit="handleSubmitRename"
  />
</template>
