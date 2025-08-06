<script setup lang="ts">
import { Icon } from "@iconify/vue";
import { useStore } from "~svg-mapper/composables/useStore";
import ProjectItem from "./ProjectItem.vue";

const {
  projectStore: { projects, addProject },
} = useStore();

const handleAddProject = () => {
  addProject();
};
</script>

<template>
  <main aria-label="main" class="flex flex-1 flex-col items-center">
    <div class="flex w-full max-w-7xl flex-wrap justify-center gap-4">
      <ProjectItem v-for="project in projects" :key="project.id" :project="project" />
      <div
        class="relative flex h-32 w-full max-w-64 cursor-pointer flex-col items-center justify-center gap-4 rounded-md border border-slate-200 bg-white p-6 hover:border-solid hover:bg-slate-50"
        @click="handleAddProject"
      >
        <Icon icon="lucide:plus" class="h-4 w-4 text-slate-500" />
      </div>
    </div>
  </main>
</template>
