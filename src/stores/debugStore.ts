export const useDebugStore = defineStore("debug", {
  state: () => ({
    // isDebug: env.NODE_ENV === "development" || env.NODE_ENV === "test",
    isDebugStats: true,
    isDebugPolygonTree: false,
    isDebugCursor: true,
  }),
});
