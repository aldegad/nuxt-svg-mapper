<script setup lang="ts">
import Input from "./Input.vue";
import Popover from "./Popover.vue";

const props = defineProps<{
  visible: boolean;
  target: HTMLElement | null;
  placeholder: string;
  value: string;
}>();

const emits = defineEmits<{
  "close": [];
  "submit": [event: Event, value: string];
}>();

const input = ref("");

const handleClose = () => {
  emits("close");
};

const handleSubmit = (event: Event) => {
  emits("submit", event, input.value);
  handleClose();
};

watch(
  () => props.visible,
  (newVal) => {
    if (newVal) {
      input.value = props.value;
    }
  },
);
</script>

<template>
  <Popover :visible="props.visible" :target="target" @close="handleClose">
    <form class="flex flex-col gap-1" @submit.prevent="handleSubmit($event)">
      <Input v-model="input" :placeholder="props.placeholder" class="w-40" />
      <button type="submit">이름 변경</button>
    </form>
  </Popover>
</template>
