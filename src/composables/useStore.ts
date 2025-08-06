import {
  useCanvasStore,
  useCaptureStore,
  useCurrentStore,
  useDebugStore,
  useHistoryStore,
  usePolygonStore,
  useProjectStore,
  useShortcutStore,
} from "~svg-mapper/stores";

export const useStore = () => {
  const historyStore = useHistoryStore();
  const historyStoreRefs = storeToRefs(historyStore);
  const projectStore = useProjectStore();
  const projectStoreRefs = storeToRefs(projectStore);
  const canvasStore = useCanvasStore();
  const canvasStoreRefs = storeToRefs(canvasStore);
  const polygonStore = usePolygonStore();
  const polygonStoreRefs = storeToRefs(polygonStore);
  const currentStore = useCurrentStore();
  const currentStoreRefs = storeToRefs(currentStore);
  const shortcutStore = useShortcutStore();
  const shortcutStoreRefs = storeToRefs(shortcutStore);
  const captureStore = useCaptureStore();
  const captureStoreRefs = storeToRefs(captureStore);
  const debugStore = useDebugStore();
  const debugStoreRefs = storeToRefs(debugStore);

  return {
    historyStore: {
      ...historyStore,
      ...historyStoreRefs,
    },
    projectStore: {
      ...projectStore,
      ...projectStoreRefs,
    },
    canvasStore: {
      ...canvasStore,
      ...canvasStoreRefs,
    },
    polygonStore: {
      ...polygonStore,
      ...polygonStoreRefs,
    },
    currentStore: {
      ...currentStore,
      ...currentStoreRefs,
    },
    shortcutStore: {
      ...shortcutStore,
      ...shortcutStoreRefs,
    },
    captureStore: {
      ...captureStore,
      ...captureStoreRefs,
    },
    debugStore: {
      ...debugStore,
      ...debugStoreRefs,
    },
  };
};
