import type { Coord } from "~svg-mapper/schemas/coords";
import { coordFromEvent } from "~svg-mapper/utils/captures/coordFromEvent";

export const coordFromParent = (e: MouseEvent | TouchEvent): Coord => {
  const target = e.currentTarget as HTMLElement;
  const rect = target.getBoundingClientRect();

  const { x: clientX, y: clientY } = coordFromEvent(e);

  const x = clientX - rect.left;
  const y = clientY - rect.top;

  return { x, y };
};
