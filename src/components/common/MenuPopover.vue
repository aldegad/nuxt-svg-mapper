<script setup lang="ts">
import { Icon } from "@iconify/vue";
import type { MenuModelItem } from "~svg-mapper/schemas";
import Popover from "./Popover.vue";

defineProps<{
  visible: boolean;
  target: HTMLElement | null;
  model: MenuModelItem[];
}>();

const emits = defineEmits<{
  "close": [];
  "submit": [event: MouseEvent, name: string];
}>();

const handleClose = () => {
  emits("close");
};

const handleItemClick = (event: MouseEvent, item: MenuModelItem) => {
  emits("submit", event, item.name);
  handleClose();
};
</script>

<template>
  <Popover :visible="visible" :target="target" @close="handleClose">
    <div class="flex flex-col gap-1">
      <div v-for="item in model" :key="item.label" class="flex flex-col gap-1">
        <button
          class="flex h-6 items-center gap-2 border-0 bg-transparent p-2 hover:bg-slate-200"
          @click="handleItemClick($event, item)"
        >
          <Icon :icon="item.icon" class="h-4 w-4 text-slate-500" />
          <label class="flex flex-1 items-center text-xs text-slate-500">
            {{ item.label }}
          </label>
        </button>
      </div>
    </div>
  </Popover>
</template>
