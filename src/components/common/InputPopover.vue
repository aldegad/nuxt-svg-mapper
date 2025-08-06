<script setup lang="ts">
import { ref, watch } from "vue";
import type {
  InputPopoverButton,
  InputPopoverChangeEvent,
  InputPopoverInput,
} from "~svg-mapper/schemas/components/common";
import Input from "./Input.vue";
import Popover from "./Popover.vue";

const props = defineProps<{
  visible: boolean;
  target: HTMLElement | null;
  position?: "top" | "right" | "bottom" | "left";
  inputs: InputPopoverInput[];
  buttons?: InputPopoverButton[];
}>();

const emits = defineEmits<{
  "close": [];
  "submit": [event: InputPopoverChangeEvent];
  "change": [event: InputPopoverChangeEvent];
}>();

const inputs = ref<InputPopoverInput[]>(props.inputs);

const handleClose = () => {
  emits("close");
};

const handleChange = (event: Event) => {
  emits("change", { originEvent: event, inputs: inputs.value });
};

const handleSubmit = (event: Event) => {
  emits("submit", { originEvent: event, inputs: inputs.value });
  handleClose();
};

watch(
  () => props.visible,
  (newVal) => {
    if (newVal) {
      inputs.value = props.inputs;
    }
  },
  { immediate: true },
);
</script>

<template>
  <Popover :visible="props.visible" :target="target" @close="handleClose">
    <form class="flex flex-col gap-1" @submit.prevent="handleSubmit($event)">
      <Input
        v-for="input in inputs"
        :key="input.name"
        v-model="input.value"
        :placeholder="input.placeholder"
        class="w-40"
        @input="handleChange"
      />
      <button v-for="button in props.buttons" :key="button.text" :type="button.type" @click="button.onClick">
        {{ button.text }}
      </button>
    </form>
  </Popover>
</template>
