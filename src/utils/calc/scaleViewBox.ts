import type { Coord } from "~svg-mapper/schemas/coords";
import type { ModelViewBox } from "~svg-mapper/schemas/stores";

type ScaleViewBoxProps = {
  viewBox: ModelViewBox;
  center: Coord;
  scale: number;
};

export const scaleViewBox = ({ viewBox, center, scale }: ScaleViewBoxProps) => {
  const startCoord = {
    x: viewBox.x,
    y: viewBox.y,
  };
  const endCoord = {
    x: viewBox.x + viewBox.width,
    y: viewBox.y + viewBox.height,
  };

  const total = {
    x: Math.abs(startCoord.x - center.x) + Math.abs(endCoord.x - center.x),
    y: Math.abs(startCoord.y - center.y) + Math.abs(endCoord.y - center.y),
  };

  const ratio = {
    x: (startCoord.x - center.x) / total.x,
    y: (startCoord.y - center.y) / total.y,
  };

  const newX = startCoord.x + ratio.x * (viewBox.width / scale - viewBox.width);
  const newY = startCoord.y + ratio.y * (viewBox.height / scale - viewBox.height);
  const newWidth = viewBox.width / scale;
  const newHeight = viewBox.height / scale;

  return {
    x: newX,
    y: newY,
    width: newWidth,
    height: newHeight,
  };
};
