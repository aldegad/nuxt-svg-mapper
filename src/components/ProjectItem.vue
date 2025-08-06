<script setup lang="ts">
import { Icon } from "@iconify/vue";
import { useStore } from "~svg-mapper/composables/useStore";
import { ProjectMenuName, projectMenuModel } from "~svg-mapper/schemas/components/projects";
import type { ModelProject } from "~svg-mapper/schemas/stores/projectStore";
import MenuPopover from "./common/MenuPopover.vue";
import RenamePopover from "./common/RenamePopover.vue";

const props = defineProps<{
  project: ModelProject;
}>();

const router = useRouter();

const {
  projectStore: { removeProject, renameProject },
} = useStore();

const menuButtonRef = ref<HTMLElement | null>(null);
const visible = ref(false);
const renameVisible = ref(false);

const handleSelectProject = (project: ModelProject) => {
  router.push(`/project/${project.id}`);
};

const handleOpenMenu = (event: MouseEvent) => {
  event.stopPropagation();
  visible.value = true;
};

const handleSubmitMenu = (_: MouseEvent, name: string) => {
  switch (name) {
    case ProjectMenuName.RENAME:
      renameVisible.value = true;
      break;
    case ProjectMenuName.DELETE:
      removeProject(props.project.id);
      break;
  }
};

const handleSubmitRename = (_: Event, name: string) => {
  renameProject(props.project.id, name);
};
</script>

<template>
  <div
    class="group relative flex h-32 w-full max-w-64 cursor-pointer flex-col items-center justify-center gap-4 rounded-md border border-slate-200 bg-white p-6 hover:border-solid hover:bg-slate-50"
    @click="handleSelectProject(project)"
  >
    <h2 class="w-full overflow-hidden text-sm text-ellipsis whitespace-nowrap text-slate-500">
      {{ project.name }}
    </h2>
    <p v-if="project.description" class="w-full overflow-hidden text-sm text-ellipsis whitespace-nowrap text-slate-500">
      {{ project.description }}
    </p>
    <button
      ref="menuButtonRef"
      class="absolute top-2 right-2 hidden h-6 w-6 cursor-pointer flex-col items-center justify-center rounded-md border border-slate-100 bg-slate-100 p-0 group-hover:flex hover:bg-slate-200"
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
    :model="projectMenuModel"
    @close="visible = false"
    @submit="handleSubmitMenu"
  />
  <RenamePopover
    :visible="renameVisible"
    :target="menuButtonRef"
    :placeholder="project.name"
    :value="project.name"
    @close="renameVisible = false"
    @submit="handleSubmitRename"
  />
</template>
