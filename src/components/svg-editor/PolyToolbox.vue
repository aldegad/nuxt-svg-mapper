<script setup lang="ts">
import { Icon } from "@iconify/vue";
import { ColorPicker } from "@aldegad/nuxt-core";
import { Button, InputPopover } from "~svg-mapper/components";
import { useAlignPolygons, useStore } from "~svg-mapper/composables";
import type { InputPopoverChangeEvent } from "~svg-mapper/schemas";
import { AlignType, ItemCaptureState } from "~svg-mapper/schemas";
import { getImageFileInfo } from "~svg-mapper/utils";
import IconFillColor from "./images/IconFillColor.vue";
import IconStrokeColor from "./images/IconStrokeColor.vue";
import IconStrokeWidth from "./images/IconStrokeWidth.vue";

const {
  captureStore: { capturedItems, addExceptRef },
  polygonStore: { addImageToPolygons, removeImagesFromPolygons, setFillColors, setStrokeColors, setStrokeWidths },
  historyStore: { snapshot, push },
} = useStore();
const { alignPolygons } = useAlignPolygons();
const polyToolboxRef = useTemplateRef<HTMLDivElement>("polyToolboxRef");

const selectedCaptured = computed(() => {
  return capturedItems.value.filter((item) => item.state === ItemCaptureState.SELECT);
});

const strokeWidthPopoverVisible = ref(false);
const strokeWidthButtonRef = useTemplateRef<InstanceType<typeof Button>>("strokeWidthButtonRef");

const handleAlign = (alignType: AlignType) => {
  alignPolygons(alignType);
};

const handleFillColorChange = (payload: { color: string; opacity: number }) => {
  snapshot();
  push();
  setFillColors(
    selectedCaptured.value.map((item) => item.item.id),
    payload.color,
    payload.opacity,
  );
};

const handleStrokeColorChange = (payload: { color: string; opacity: number }) => {
  snapshot();
  push();
  setStrokeColors(
    selectedCaptured.value.map((item) => item.item.id),
    payload.color,
    payload.opacity,
  );
};

const handleStrokeWidthButtonClick = () => {
  strokeWidthPopoverVisible.value = true;
};

const handleStrokeWidthChange = (event: InputPopoverChangeEvent) => {
  snapshot();
  push();
  setStrokeWidths(
    selectedCaptured.value.map((item) => item.item.id),
    Number(event.inputs[0].value ?? 0),
  );
};

const handleImageUpload = async (event: Event) => {
  const file = (event.target as HTMLInputElement).files?.[0];
  if (file) {
    const image = await getImageFileInfo(file);
    addImageToPolygons(
      selectedCaptured.value.map((item) => item.item.id),
      {
        url: image.url,
        blob: image.blob,
        x: 0,
        y: 0,
        width: image.width,
        height: image.height,
      },
    );
  }
  (event.target as HTMLInputElement).value = "";
};

const handleImageRemove = () => {
  removeImagesFromPolygons(selectedCaptured.value.map((item) => item.item.id));
};

watch(
  polyToolboxRef,
  (ref) => {
    if (ref) {
      addExceptRef(ref);
    }
  },
  { immediate: true },
);
</script>

<template>
  <div
    ref="polyToolboxRef"
    aria-label="PolyToolbox"
    class="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-4 rounded-lg border border-slate-200 bg-white p-2 shadow-md shadow-slate-100 transition-opacity"
    :class="{
      'opacity-40': !selectedCaptured.length,
      'bg-slate-400': !selectedCaptured.length,
      'pointer-events-none': !selectedCaptured.length,
    }"
  >
    <div class="flex gap-1">
      <Button
        v-tooltip="{ contents: '상단 정렬' }"
        icon="lucide:align-start-horizontal"
        @click="handleAlign(AlignType.TOP)"
      />
      <Button
        v-tooltip="{ contents: '수평 중앙 정렬' }"
        icon="lucide:align-center-horizontal"
        @click="handleAlign(AlignType.HORIZONTAL_CENTER)"
      />
      <Button
        v-tooltip="{ contents: '하단 정렬' }"
        icon="lucide:align-end-horizontal"
        @click="handleAlign(AlignType.BOTTOM)"
      />
      <Button
        v-tooltip="{ contents: '좌측 정렬' }"
        icon="lucide:align-start-vertical"
        @click="handleAlign(AlignType.LEFT)"
      />
      <Button
        v-tooltip="{ contents: '수직 중앙 정렬' }"
        icon="lucide:align-center-vertical"
        @click="handleAlign(AlignType.VERTICAL_CENTER)"
      />
      <Button
        v-tooltip="{ contents: '우측 정렬' }"
        icon="lucide:align-end-vertical"
        @click="handleAlign(AlignType.RIGHT)"
      />
      <Button
        v-tooltip="{ contents: '가로 간격 균등 분배' }"
        icon="lucide:align-horizontal-distribute-center"
        @click="handleAlign(AlignType.HORIZONTAL_DISTRIBUTE_CENTER)"
      />
      <Button
        v-tooltip="{ contents: '세로 간격 균등 분배' }"
        icon="lucide:align-vertical-distribute-center"
        @click="handleAlign(AlignType.VERTICAL_DISTRIBUTE_CENTER)"
      />
    </div>
    <div class="flex gap-1">
      <Button v-tooltip="{ contents: '채우기 색상' }">
        <IconFillColor class="text-slate-500" />
        <ColorPicker
          :color="selectedCaptured[0]?.item.fillColor"
          :opacity="selectedCaptured[0]?.item.fillOpacity"
          @change="handleFillColorChange"
        />
      </Button>
      <Button v-tooltip="{ contents: '테두리 색상' }">
        <IconStrokeColor />
        <ColorPicker
          :color="selectedCaptured[0]?.item.strokeColor"
          :opacity="selectedCaptured[0]?.item.strokeOpacity"
          @change="handleStrokeColorChange"
        />
      </Button>
      <Button ref="strokeWidthButtonRef" v-tooltip="{ contents: '테두리 두께' }" @click="handleStrokeWidthButtonClick">
        <IconStrokeWidth class="text-slate-500" />
      </Button>
    </div>
    <div class="flex gap-1">
      <label
        v-tooltip="{ contents: '이미지 업로드' }"
        for="poly-image-upload"
        class="flex h-8 w-8 items-center justify-center rounded-md border border-dashed border-slate-200 bg-slate-100 hover:bg-slate-200"
      >
        <Icon icon="lucide:image-up" class="h-4 w-4 text-slate-500" />
        <input id="poly-image-upload" type="file" accept="image/*" class="hidden" @change="handleImageUpload" />
      </label>
      <button
        v-tooltip="{ contents: '이미지 제거' }"
        class="flex h-8 w-8 items-center justify-center rounded-md border border-dashed border-slate-200 bg-slate-100 hover:bg-slate-200"
        @click="handleImageRemove"
      >
        <Icon icon="lucide:image-off" class="h-4 w-4 text-slate-500" />
      </button>
    </div>
    <InputPopover
      :visible="strokeWidthPopoverVisible"
      :target="strokeWidthButtonRef?.el ?? null"
      position="top"
      :inputs="[
        {
          name: 'strokeWidth',
          placeholder: 'Stroke Width',
          value: selectedCaptured[0]?.item.strokeWidth ?? 1,
        },
      ]"
      @close="strokeWidthPopoverVisible = false"
      @change="handleStrokeWidthChange"
    />
  </div>
</template>
