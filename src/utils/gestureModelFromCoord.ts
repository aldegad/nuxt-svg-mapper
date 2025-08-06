import type { ModelRect } from "~svg-mapper/schemas/common";
import type { Coord } from "~svg-mapper/schemas/coords";
import { calcSvgOffset } from "./calc";
import type { GestureModel } from "../schemas/gesture";

type GestureModelFromCoordProps = {
  coord: Coord;
  delta?: Coord;
  svgRect: ModelRect;
  svgRef: SVGSVGElement;
};

export const gestureModelFromCoord = ({ coord, delta, svgRect, svgRef }: GestureModelFromCoordProps): GestureModel => {
  const { x, y } = coord;

  return {
    x,
    y,
    deltaX: delta?.x ?? 0,
    deltaY: delta?.y ?? 0,
    canvasVector: {
      x: x - svgRect.x,
      y: y - svgRect.y,
      deltaX: delta?.x ?? 0,
      deltaY: delta?.y ?? 0,
    },
    svgVector: calcSvgOffset({ x, y }, { x: delta?.x ?? 0, y: delta?.y ?? 0 }, svgRef),
  };
};
