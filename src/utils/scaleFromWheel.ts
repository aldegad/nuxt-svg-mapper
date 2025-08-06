export const scaleFromWheel = (e: WheelEvent) => {
  const base = 1.1;

  let scale;

  if (e.deltaY < 0) {
    scale = Math.pow(base, -e.deltaY / 100);
  } else {
    scale = 1 / Math.pow(base, e.deltaY / 100);
  }

  return scale;
};
