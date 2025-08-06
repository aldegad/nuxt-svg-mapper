import type { ModelRect } from "~svg-mapper/schemas/common";
import type { Coord } from "~svg-mapper/schemas/coords";
import { GestureState } from "~svg-mapper/schemas/gesture";
import type { GestureModel } from "~svg-mapper/schemas/gesture";
import { gestureModelFromCoord } from "~svg-mapper/utils/captures";

type UseGestureContextProps = {
  svgRef: Ref<SVGSVGElement | null>;
  svgRect: Ref<ModelRect>;
};

export const useGestureContext = ({ svgRef, svgRect }: UseGestureContextProps) => {
  const gestureState = ref<GestureState>(GestureState.IDLE);
  const gestureModel = ref<GestureModel>({
    x: 0,
    y: 0,
    deltaX: 0,
    deltaY: 0,
    canvasVector: { x: 0, y: 0, deltaX: 0, deltaY: 0 },
    svgVector: { x: 0, y: 0, deltaX: 0, deltaY: 0 },
  });
  const gesture = reactive({
    state: gestureState,
    model: gestureModel,
  });

  const updateGestureState = (state: GestureState) => {
    gesture.state = state;
  };

  const updateGestureModel = (coord: Coord, delta?: Coord) => {
    if (!svgRef.value || !svgRect.value) return;
    const newGestureModel = gestureModelFromCoord({
      coord,
      delta,
      svgRect: svgRect.value,
      svgRef: svgRef.value,
    });
    gesture.model = newGestureModel;
  };

  return {
    gesture,
    updateGestureState,
    updateGestureModel,
  };
};
