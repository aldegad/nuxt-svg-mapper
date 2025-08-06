<script setup lang="ts">
import { Icon } from "@iconify/vue";
import MenuPopover from "~svg-mapper/components/common/MenuPopover.vue";
import RenamePopover from "~svg-mapper/components/common/RenamePopover.vue";
import { useStore } from "~svg-mapper/composables/useStore";
import { PolygonsMenuName, polygonsMenuModel } from "~svg-mapper/schemas/components/layers";
import { ItemCaptureState } from "~svg-mapper/schemas/stores";
import type { ModelPolygonTree } from "~svg-mapper/schemas/stores/polygonStore";
import { capturedState } from "~svg-mapper/utils/captures";

const props = withDefaults(
  defineProps<{
    polygon: ModelPolygonTree;
    index: number;
    level?: number;
  }>(),
  {
    level: 0,
  },
);

const {
  captureStore: { capturedItems, addCapturedItem, replaceCapturedItem },
  shortcutStore: { shift },
  polygonStore: { removePolygon, renamePolygon, ungroupPolygons },
} = useStore();

const menuButtonRef = ref<HTMLElement | null>(null);
const paddingLeft = computed(() => `${(props.level ?? 0) * 16}px`);
const menuModel = computed(() => {
  const model = [...polygonsMenuModel];
  if (!props.polygon.children?.length) {
    const groupMenuIndex = model.findIndex((item) => item.name === PolygonsMenuName.UNGROUP);
    model.splice(groupMenuIndex, 1);
  }
  return model;
});

const visible = ref(false);
const renameVisible = ref(false);

const handleClickPolygon = (polygon: ModelPolygonTree) => {
  if (shift.value) {
    addCapturedItem({
      state: ItemCaptureState.SELECT,
      item: polygon,
    });
  } else {
    replaceCapturedItem({
      state: ItemCaptureState.SELECT,
      item: polygon,
    });
  }
};

const handleOpenMenu = (event: MouseEvent) => {
  event.stopPropagation();
  visible.value = true;
};

const handleSubmitMenu = (_: MouseEvent, name: string) => {
  switch (name) {
    case PolygonsMenuName.RENAME:
      renameVisible.value = true;
      break;
    case PolygonsMenuName.UNGROUP:
      ungroupPolygons(props.polygon.id);
      break;
    case PolygonsMenuName.DELETE:
      removePolygon(props.polygon.id);
      break;
  }
};

const handleSubmitRename = (_: Event, name: string) => {
  renamePolygon(props.polygon.id, name);
};
</script>

<template>
  <div
    aria-label="polygon tree item"
    data-component="polygon-tree-item"
    class="flex flex-col rounded-md border border-dashed border-slate-200 bg-slate-100 hover:bg-slate-200"
    :class="{
      '!rounded-none !border-0 !border-t': level !== 0,
    }"
  >
    <div
      :style="{ paddingLeft }"
      class="group flex h-7 w-full flex-shrink-0 items-center justify-center pr-1"
      :class="{
        '!border-indigo-100 !bg-indigo-100': capturedState(capturedItems, polygon) === ItemCaptureState.HOVER,
        'border-solid !border-indigo-200 !bg-indigo-200':
          capturedState(capturedItems, polygon) === ItemCaptureState.SELECT,
      }"
      @click="handleClickPolygon(polygon)"
    >
      <span class="flex-1 overflow-hidden pr-1 pl-2 text-xs text-ellipsis whitespace-nowrap text-slate-500">
        {{ polygon.name }}
      </span>
      <button
        ref="menuButtonRef"
        class="hidden h-5 w-5 flex-col items-center justify-center rounded-md border border-slate-100 bg-slate-200 p-0 group-hover:flex hover:bg-slate-300"
        :class="{
          '!flex': visible || renameVisible,
        }"
        @click.stop="handleOpenMenu"
      >
        <Icon icon="lucide:ellipsis-vertical" class="h-3.5 w-3.5 text-slate-500" />
      </button>
    </div>
    <PolygonTreeItem
      v-for="(child, idx) in polygon.children"
      :key="child.id"
      :polygon="child"
      :index="idx"
      :level="level + 1"
    />
  </div>
  <MenuPopover
    :visible="visible"
    :target="menuButtonRef"
    :model="menuModel"
    @close="visible = false"
    @submit="handleSubmitMenu"
  />
  <RenamePopover
    :visible="renameVisible"
    :target="menuButtonRef"
    :placeholder="polygon.name"
    :value="polygon.name"
    @close="renameVisible = false"
    @submit="handleSubmitRename"
  />
</template>
