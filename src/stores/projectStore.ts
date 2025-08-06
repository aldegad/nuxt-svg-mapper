import { get, set } from "idb-keyval";
import { safeRandomUUID } from "@aldegad/nuxt-core";
import { StoreKey } from "~svg-mapper/schemas";
import type { ModelProject } from "~svg-mapper/schemas";

export const useProjectStore = defineStore("project", {
  state: () => ({
    projects: [] as ModelProject[],
  }),
  actions: {
    async loadProjects() {
      const loaded = await get(StoreKey.PROJECT);
      if (loaded !== undefined) {
        this.projects = loaded;
      } else {
        this.projects = [];
      }
    },
    async addProject(project?: Omit<ModelProject, "id">) {
      this.projects.push({
        id: safeRandomUUID(),
        name: project?.name || "new-project-" + safeRandomUUID(),
        description: project?.description || "",
      });
      await set(StoreKey.PROJECT, toRaw(this.projects));
    },
    async removeProject(id: string) {
      this.projects = this.projects.filter((p) => p.id !== id).map((p) => toRaw(p));
      await set(StoreKey.PROJECT, toRaw(this.projects));
    },
    async renameProject(id: string, name: string) {
      const project = this.projects.find((p) => p.id === id);
      if (project) {
        project.name = name;
      }
      await set(StoreKey.PROJECT, toRaw(this.projects));
    },
  },
});
