<script setup lang="ts">
const model = defineModel<string | number>();
const props = withDefaults(
  defineProps<{
    name?: string;
    type?: "number" | "text";
    min?: number;
    max?: number;
    step?: number;
  }>(),
  {
    type: "text",
  },
);
</script>

<template>
  <input
    :name="props.name"
    :type="props.type"
    class="h-8 rounded-md border border-slate-200 bg-white px-2 py-1 text-sm text-slate-500 placeholder:text-slate-400 focus:border-slate-400 focus:outline-none disabled:bg-slate-100 disabled:opacity-50"
    :value="model"
    :min="props.min"
    :max="props.max"
    :step="props.step"
    @input="
      model =
        props.type === 'number'
          ? Number(($event.target as HTMLInputElement).value)
          : ($event.target as HTMLInputElement).value
    "
  />
</template>
