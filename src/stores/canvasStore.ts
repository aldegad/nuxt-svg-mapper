import { del, get, set } from "idb-keyval";
import { safeRandomUUID } from "@aldegad/nuxt-core";
import { StoreKey } from "~svg-mapper/schemas/stores";
import type { ModelCanvas, ModelMapImage } from "~svg-mapper/schemas/stores";

export const useCanvasStore = defineStore("canvas", {
  state: () => ({
    canvases: [] as ModelCanvas[],
  }),
  actions: {
    async addCanvas(projectId: string, canvas?: Omit<ModelCanvas, "id">) {
      if (canvas) {
        this.canvases.push({ ...canvas, id: safeRandomUUID() });
      } else {
        this.canvases.push({
          id: safeRandomUUID(),
          projectId,
          name: "new-canvas-" + safeRandomUUID(),
          width: 1000,
          height: 1000,
          viewBox: { x: 0, y: 0, width: 1000, height: 1000 },
          map: null,
        });
      }
      await set(StoreKey.CANVAS, toRaw(this.canvases));
    },
    async removeCanvas(id: string) {
      const idx = this.canvases.findIndex((c) => c.id === id);
      if (idx !== -1) {
        this.canvases.splice(idx, 1);
      }
      await set(StoreKey.CANVAS, toRaw(this.canvases));
    },
    async renameCanvas(id: string, name: string) {
      const canvas = this.canvases.find((c) => c.id === id);
      if (canvas) {
        canvas.name = name;
      }
      await set(StoreKey.CANVAS, toRaw(this.canvases));
    },
    async setCanvasViewBox(id: string, viewBox: { x: number; y: number; width: number; height: number }) {
      const canvas = this.canvases.find((c) => c.id === id);
      if (canvas) {
        canvas.viewBox = viewBox;
      }
      await set(StoreKey.CANVAS, toRaw(this.canvases));
    },
    async setCanvasSize(id: string, size: { width: number; height: number }) {
      const canvas = this.canvases.find((c) => c.id === id);
      if (canvas) {
        canvas.width = size.width;
        canvas.height = size.height;
      }
    },
    async setCanvasMap(id: string, map: ModelMapImage) {
      const canvas = this.canvases.find((c) => c.id === id);
      if (canvas) {
        canvas.map = toRaw(map);
      }
      await set(StoreKey.CANVAS, toRaw(this.canvases));
    },
    async setCanvasMapSize(id: string, size: { width: number; height: number }) {
      const canvas = this.canvases.find((c) => c.id === id);
      if (canvas?.map) {
        canvas.map.width = size.width;
        canvas.map.height = size.height;
      }
    },
    async removeCanvasMap(id: string) {
      const canvas = this.canvases.find((c) => c.id === id);
      if (canvas) {
        canvas.map = null;
      }
      await set(StoreKey.CANVAS, toRaw(this.canvases));
    },
    async setCanvasMapLocked(id: string, locked: boolean) {
      const canvas = this.canvases.find((c) => c.id === id);
      if (canvas?.map) {
        canvas.map.locked = locked;
      }
      await set(StoreKey.CANVAS, toRaw(this.canvases));
    },
    async loadCanvases() {
      const loaded = await get(StoreKey.CANVAS);
      if (loaded !== undefined) {
        this.canvases = loaded.map((c: ModelCanvas) => ({
          ...c,
          map: c.map
            ? {
                ...c.map,
                url: URL.createObjectURL(c.map.blob),
              }
            : null,
        }));
      } else {
        this.canvases = [];
      }
    },
    async clearCanvases() {
      this.canvases = [];
      await del(StoreKey.CANVAS);
    },
  },
});
