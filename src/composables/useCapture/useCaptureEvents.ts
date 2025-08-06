import { useStore } from "~svg-mapper/composables/useStore";
import type { ModelVector } from "~svg-mapper/schemas/common";
import { CaptureState } from "~svg-mapper/schemas/stores";
import { calcSvgOffset } from "~svg-mapper/utils/calc/calcSvgOffset";
import { coordFromEvent } from "~svg-mapper/utils/captures/coordFromEvent";
import { thresholdDelta } from "~svg-mapper/utils/captures/threshold";

export const useCaptureEvents = () => {
  const {
    captureStore: { captureState, capturedMouse, setCaptureState, setCapturedMouse, setCapturedViewport, canvasSvgRef },
  } = useStore();

  const el = ref<HTMLElement | null>(null);

  const canvasOffset = computed<ModelVector>(() => {
    const rect = el.value?.getBoundingClientRect();
    return {
      x: rect?.left ?? 0,
      y: rect?.top ?? 0,
      deltaX: 0,
      deltaY: 0,
    };
  });

  const handleMouseEnter = (e: MouseEvent) => {
    const { x, y } = coordFromEvent(e);

    setCaptureState(CaptureState.IDLE);
    setCapturedMouse({
      x,
      y,
      deltaX: 0,
      deltaY: 0,
      canvasOffset: {
        x: x - canvasOffset.value.x,
        y: y - canvasOffset.value.y,
        deltaX: 0,
        deltaY: 0,
      },
      svgOffset: calcSvgOffset({ x, y }, { x: 0, y: 0 }, canvasSvgRef.value),
    });
  };

  const handleMouseMove = (e: MouseEvent) => {
    const { x, y } = coordFromEvent(e);
    const delta = {
      x: x - capturedMouse.value.x,
      y: y - capturedMouse.value.y,
    };
    let deltaX = 0;
    let deltaY = 0;

    if (captureState.value === CaptureState.HOLD) {
      const { x: _deltaX, y: _deltaY } = thresholdDelta(delta, 3);
      if (_deltaX === 0 && _deltaY === 0) {
        return;
      }
      deltaX = _deltaX;
      deltaY = _deltaY;
    } else {
      deltaX = delta.x;
      deltaY = delta.y;
    }

    if (captureState.value === CaptureState.HOLD) {
      setCaptureState(CaptureState.HOLD_MOVE);
    }

    setCapturedMouse({
      x,
      y,
      deltaX,
      deltaY,
      canvasOffset: {
        x: x - canvasOffset.value.x,
        y: y - canvasOffset.value.y,
        deltaX,
        deltaY,
      },
      svgOffset: calcSvgOffset({ x, y }, { x: deltaX, y: deltaY }, canvasSvgRef.value),
    });
  };

  const handleMouseDown = (e: MouseEvent) => {
    if (e.button !== 0) return null;
    const { x, y } = coordFromEvent(e);
    setCaptureState(CaptureState.HOLD);
    setCapturedMouse({
      x,
      y,
      deltaX: 0,
      deltaY: 0,
      canvasOffset: {
        x: x - canvasOffset.value.x,
        y: y - canvasOffset.value.y,
        deltaX: 0,
        deltaY: 0,
      },
      svgOffset: calcSvgOffset({ x, y }, { x: 0, y: 0 }, canvasSvgRef.value),
    });
  };

  const handleMouseUp = async (e: MouseEvent) => {
    if (e.button !== 0) return null;
    const { x, y } = coordFromEvent(e);
    setCaptureState(CaptureState.HOLD_UP);
    setCapturedMouse({
      x,
      y,
      deltaX: 0,
      deltaY: 0,
      canvasOffset: {
        x: x - canvasOffset.value.x,
        y: y - canvasOffset.value.y,
        deltaX: 0,
        deltaY: 0,
      },
      svgOffset: calcSvgOffset({ x, y }, { x: 0, y: 0 }, canvasSvgRef.value),
    });
    await nextTick();
    handleMouseIdle(e);
  };

  const handleMouseIdle = (e: MouseEvent) => {
    setCaptureState(CaptureState.IDLE);
    const { x, y } = coordFromEvent(e);
    setCapturedMouse({
      x,
      y,
      deltaX: 0,
      deltaY: 0,
      canvasOffset: {
        x: x - canvasOffset.value.x,
        y: y - canvasOffset.value.y,
        deltaX: 0,
        deltaY: 0,
      },
      svgOffset: calcSvgOffset({ x, y }, { x: 0, y: 0 }, canvasSvgRef.value),
    });
  };

  const handleResize = () => {
    setCapturedViewport({
      x: 0,
      y: 0,
      width: window.visualViewport?.width ?? 0,
      height: window.visualViewport?.height ?? 0,
      center: {
        x: (window.visualViewport?.width ?? 0) / 2,
        y: (window.visualViewport?.height ?? 0) / 2,
      },
    });
  };

  const createCaptureEvents = (_el: HTMLElement) => {
    el.value = _el;
    _el.addEventListener("mousedown", handleMouseDown);
    _el.addEventListener("mousemove", handleMouseMove);
    _el.addEventListener("mouseenter", handleMouseEnter);
    _el.addEventListener("mouseleave", handleMouseIdle);
    _el.addEventListener("mouseout", handleMouseIdle);
    _el.addEventListener("mouseup", handleMouseUp);
    window.addEventListener("resize", handleResize);

    const removeCaptureEvents = () => {
      _el.removeEventListener("mousedown", handleMouseDown);
      _el.removeEventListener("mousemove", handleMouseMove);
      _el.removeEventListener("mouseenter", handleMouseEnter);
      _el.removeEventListener("mouseleave", handleMouseIdle);
      _el.removeEventListener("mouseout", handleMouseIdle);
      _el.removeEventListener("mouseup", handleMouseUp);
      window.removeEventListener("resize", handleResize);
    };

    return removeCaptureEvents;
  };

  handleResize();

  return {
    createCaptureEvents,
  };
};
