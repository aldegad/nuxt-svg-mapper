import type { Coord } from "~svg-mapper/schemas/coords";

export const drawingPolygonStart = (
  setCurrentPolygon: (points: Coord[]) => void,
  setDraggingPoint: (point: Coord) => void,
  setDraggingPointIndex: (index: number) => void,
  newPoint: Coord,
) => {
  setCurrentPolygon([newPoint]);
  setDraggingPoint(newPoint);
  setDraggingPointIndex(0);
};
