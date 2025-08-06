<script setup lang="ts">
import { ref } from "vue";
import { Icon } from "@iconify/vue";

defineProps<{
  icon?: string;
  iconClass?: string;
}>();

const el = ref<HTMLButtonElement>();

const emit = defineEmits<{
  click: [];
}>();

const handleClick = () => {
  emit("click");
};

defineExpose({
  el,
});
</script>

<template>
  <button
    ref="el"
    class="relative flex h-8 w-8 items-center justify-center rounded-md border border-dashed border-slate-200 bg-slate-100 hover:bg-slate-200"
    @click="handleClick"
  >
    <Icon v-if="icon" :icon="icon" :class="['h-4 w-4 text-slate-500', iconClass]" />
    <slot v-else />
  </button>
</template>
