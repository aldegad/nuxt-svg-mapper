import { useStore } from "../composables/useStore";

export default defineNuxtPlugin(() => {
  const {
    // currentStore는 제외 - project 내부에서 따로 초기화
    projectStore: { loadProjects },
    canvasStore: { loadCanvases },
    polygonStore: { loadPolygons },
    historyStore: { reset },
  } = useStore();

  loadProjects();
  loadCanvases();
  loadPolygons();
  reset();
});
