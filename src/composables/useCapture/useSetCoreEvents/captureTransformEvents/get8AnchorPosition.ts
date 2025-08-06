import { AnchorPosition } from "~svg-mapper/schemas/stores";

export const get8AnchorPosition = (index: number) => {
  if (index === 0) {
    return AnchorPosition.TOP_LEFT;
  } else if (index === 1) {
    return AnchorPosition.TOP_CENTER;
  } else if (index === 2) {
    return AnchorPosition.TOP_RIGHT;
  } else if (index === 3) {
    return AnchorPosition.MIDDLE_RIGHT;
  } else if (index === 4) {
    return AnchorPosition.BOTTOM_RIGHT;
  } else if (index === 5) {
    return AnchorPosition.BOTTOM_CENTER;
  } else if (index === 6) {
    return AnchorPosition.BOTTOM_LEFT;
  } else if (index === 7) {
    return AnchorPosition.MIDDLE_LEFT;
  }
};
