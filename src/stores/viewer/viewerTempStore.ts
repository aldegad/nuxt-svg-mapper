import { del, get, set } from "idb-keyval";
import type { RawPolyMapData } from "~svg-mapper/schemas/polyMapData";
import { StoreKey } from "~svg-mapper/schemas/stores";

let latestRequestId = 0;

export const useViewerTempStore = defineStore("viewerTempStore", {
  state: () => ({
    tempData: null as RawPolyMapData | null,
  }),
  actions: {
    setTempData(data: RawPolyMapData) {
      this.tempData = data;
      set(StoreKey.VIEWER_TEMP, data);
    },
    async loadTempData() {
      const requestId = ++latestRequestId;
      const data = await get(StoreKey.VIEWER_TEMP);
      if (requestId !== latestRequestId) return;
      this.tempData = data ?? null;
    },
    async unloadTempData() {
      latestRequestId++;
      this.tempData = null;
    },
    async clearTempData() {
      await del(StoreKey.VIEWER_TEMP);
    },
  },
});
