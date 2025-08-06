import type { Ref } from "vue";
import type { ModelRect } from "~svg-mapper/schemas/common";
import { animateViewBox } from "~svg-mapper/utils";

type UsePolySvgProps = {
  polyMapSvgRef: Ref<SVGSVGElement | null>;
};

export const usePolySvg = ({ polyMapSvgRef }: UsePolySvgProps) => {
  let resizeObserver: ResizeObserver | null = null;

  // client rect
  const svgRect = ref<ModelRect>({
    x: 0,
    y: 0,
    width: 0,
    height: 0,
  });

  const originSvgViewBox = ref<ModelRect>({
    x: 0,
    y: 0,
    width: 1000,
    height: 1000,
  });

  // view box
  const svgViewBox = ref<ModelRect>({
    x: 0,
    y: 0,
    width: 1000,
    height: 1000,
  });

  const updateSvgRect = () => {
    if (!polyMapSvgRef.value) return;
    const rect = polyMapSvgRef.value.getBoundingClientRect();
    svgRect.value = {
      x: rect.left,
      y: rect.top,
      width: rect.width,
      height: rect.height,
    };
  };

  const updateSvgViewBox = (_viewBox: ModelRect, duration = 0) => {
    const viewBox = {
      x: _viewBox.x,
      y: _viewBox.y,
      width: _viewBox.width,
      height: _viewBox.height,
    };
    if (duration > 0) {
      animateViewBox({
        from: svgViewBox.value,
        to: viewBox,
        duration,
        svgRef: polyMapSvgRef,
      }).then((newViewBox) => {
        svgViewBox.value = newViewBox;
      });
    } else {
      svgViewBox.value = {
        x: viewBox.x,
        y: viewBox.y,
        width: viewBox.width,
        height: viewBox.height,
      };
    }
  };

  const setInitialViewBox = (viewBox: ModelRect) => {
    originSvgViewBox.value = viewBox;
    updateSvgViewBox(viewBox);
  };

  const observeResize = (el: SVGSVGElement) => {
    resizeObserver?.disconnect(); // 이전 옵저버 제거

    resizeObserver = new ResizeObserver(() => {
      updateSvgRect();
    });

    resizeObserver.observe(el);
    updateSvgRect();
  };

  watch(polyMapSvgRef, (newSvgRef) => {
    if (newSvgRef) {
      observeResize(newSvgRef);
    }
  });

  onMounted(() => {
    if (polyMapSvgRef.value) {
      observeResize(polyMapSvgRef.value);
    }
  });

  onBeforeUnmount(() => {
    resizeObserver?.disconnect();
  });

  return {
    svgRect,
    originSvgViewBox,
    svgViewBox,
    setInitialViewBox,
    updateSvgViewBox,
  };
};
