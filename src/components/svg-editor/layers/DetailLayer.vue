<script setup lang="ts">
import Input from "~svg-mapper/components/common/Input.vue";
import { useStore } from "~svg-mapper/composables/useStore";
import { ItemCaptureState } from "~svg-mapper/schemas/stores";

const {
  captureStore: { capturedItems },
  polygonStore: { setPolygonData, renamePolygon },
} = useStore();

const selectedItem = computed(() => {
  return capturedItems.value.find((item) => item.state === ItemCaptureState.SELECT);
});

const handleInput = (e: Event) => {
  const input = e.target as HTMLInputElement;
  const name = input.name;
  const value = input.value;
  if (selectedItem.value) {
    if (name === "polygon-name") {
      renamePolygon(selectedItem.value.item.id, value);
    } else {
      setPolygonData(selectedItem.value.item.id, {
        [name]: value,
      });
    }
  }
};
</script>

<template>
  <div data-component="detail-layer" class="flex flex-1 flex-col">
    <div class="flex flex-1 flex-col gap-1 rounded-b-lg border border-slate-200 bg-slate-50 p-2">
      <h3
        class="flex items-center justify-center rounded-md border border-slate-200 bg-slate-200 px-2 py-1 text-slate-500"
      >
        <span class="text-xs text-slate-500">존/유닛 정보</span>
      </h3>
      <div v-if="selectedItem" :key="selectedItem.item.id" class="flex flex-col gap-1">
        <div class="flex flex-col gap-0.5">
          <span class="text-xs text-slate-500">이름</span>
          <Input name="polygon-name" :value="selectedItem.item.name" class="w-full flex-1" @input="handleInput" />
        </div>
        <div v-for="(value, key) in selectedItem.item.data" :key="key" class="flex flex-col gap-0.5">
          <span class="text-xs text-slate-500">{{ key }}</span>
          <Input :name="key as string" :value="value" class="w-full flex-1" @input="handleInput" />
        </div>
      </div>
    </div>
  </div>
</template>
