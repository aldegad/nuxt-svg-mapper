import { useThresholdCoord } from "~svg-mapper/composables/useThresholdCoord";
import type { ModelRect } from "~svg-mapper/schemas/common";
import { GestureState } from "~svg-mapper/schemas/gesture";
import { coordFromEvent } from "~svg-mapper/utils/captures";
import { useGestureContext } from "./useGestureContext";

type UseGestureProps = {
  svgRef: Ref<SVGSVGElement | null>;
  svgRect: Ref<ModelRect>;
};

export const useGesture = ({ svgRef, svgRect }: UseGestureProps) => {
  let removeGestureEvents: (() => void) | null = null;

  const { gesture, updateGestureState, updateGestureModel } = useGestureContext({
    svgRef,
    svgRect,
  });
  const { thresholdCoord } = useThresholdCoord(3);

  // down / move / up
  const handleMouseDown = (e: MouseEvent) => {
    if (!svgRef.value) return;
    updateGestureState(GestureState.HOLD);
    updateGestureModel(coordFromEvent(e));
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!svgRef.value) return;
    const coord = coordFromEvent(e);

    const delta = {
      x: coord.x - gesture.model.x,
      y: coord.y - gesture.model.y,
    };

    const breakThreshold = gesture.state !== GestureState.HOLD;
    const { x: deltaX, y: deltaY, passed } = thresholdCoord(delta, breakThreshold);

    if (gesture.state === GestureState.HOLD && passed) {
      updateGestureState(GestureState.HOLD_MOVE);
    }

    if (gesture.state !== GestureState.HOLD && gesture.state !== GestureState.HOLD_MOVE) {
      updateGestureState(GestureState.IDLE);
    }

    updateGestureModel(coord, { x: deltaX, y: deltaY });
  };

  const handleMouseUp = async (e: MouseEvent) => {
    if (!svgRef.value) return;
    const prevState = gesture.state;
    updateGestureModel(coordFromEvent(e));
    updateGestureState(GestureState.HOLD_UP);

    if (prevState === GestureState.HOLD) {
      await nextTick();
      updateGestureState(GestureState.CLICK);
    }
    await nextTick();
    updateGestureState(GestureState.IDLE);
  };

  const handleMouseWheel = (e: WheelEvent) => {
    if (!svgRef.value) return;
    e.preventDefault();

    updateGestureState(GestureState.WHEEL);
    updateGestureModel(coordFromEvent(e), {
      x: e.deltaX,
      y: e.deltaY,
    });
  };

  // cleaned up events
  const handleMouseEnter = (e: MouseEvent) => {
    if (!svgRef.value) return;
    console.log("mouse enter");
    handleMouseIdle(e);
  };

  const handleMouseLeave = (e: MouseEvent) => {
    if (!svgRef.value) return;
    console.log("mouse leave");
    handleMouseIdle(e);
  };

  const handleMouseOut = (e: MouseEvent) => {
    if (!svgRef.value) return;
    console.log("mouse out");
    handleMouseIdle(e);
  };

  const handleMouseIdle = (e: MouseEvent) => {
    if (!svgRef.value) return;
    updateGestureState(GestureState.IDLE);
    updateGestureModel(coordFromEvent(e));
  };

  const createGestureEvents = (_el: SVGSVGElement) => {
    _el.addEventListener("mousedown", handleMouseDown);
    _el.addEventListener("mousemove", handleMouseMove);
    _el.addEventListener("mouseenter", handleMouseEnter);
    _el.addEventListener("mouseleave", handleMouseLeave);
    _el.addEventListener("mouseout", handleMouseOut);
    _el.addEventListener("mouseup", handleMouseUp);
    _el.addEventListener("wheel", handleMouseWheel, { passive: false });

    const removeCaptureEvents = () => {
      _el.removeEventListener("mousedown", handleMouseDown);
      _el.removeEventListener("mousemove", handleMouseMove);
      _el.removeEventListener("mouseenter", handleMouseEnter);
      _el.removeEventListener("mouseleave", handleMouseLeave);
      _el.removeEventListener("mouseout", handleMouseOut);
      _el.removeEventListener("mouseup", handleMouseUp);
      _el.removeEventListener("wheel", handleMouseWheel);
    };

    return removeCaptureEvents;
  };

  watch(svgRef, (newSvgRef) => {
    removeGestureEvents?.();
    if (newSvgRef) {
      removeGestureEvents = createGestureEvents(newSvgRef);
    }
  });
  onMounted(() => {
    if (svgRef.value) {
      removeGestureEvents = createGestureEvents(svgRef.value);
    }
  });
  onBeforeUnmount(() => {
    removeGestureEvents?.();
  });

  return {
    gesture,
  };
};
