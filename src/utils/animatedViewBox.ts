import { easeOutCubic } from "./animation";
import { promiseResolvers } from "./promiseResolvers";
import type { ModelRect } from "../schemas/common";

type AnimateViewBoxProps = {
  from: ModelRect;
  to: ModelRect;
  duration?: number;
  svgRef: Ref<SVGSVGElement | null>;
};

export const animateViewBox = ({ from, to, duration = 300, svgRef }: AnimateViewBoxProps) => {
  const { promise, resolve } = promiseResolvers<ModelRect>();
  const start = performance.now();

  const frame = (now: number) => {
    const rawT = Math.min((now - start) / duration, 1);
    const t = easeOutCubic(rawT);
    const lerp = (a: number, b: number) => a + (b - a) * t;

    const next = {
      x: lerp(from.x, to.x),
      y: lerp(from.y, to.y),
      width: lerp(from.width, to.width),
      height: lerp(from.height, to.height),
    };

    svgRef.value?.setAttribute("viewBox", `${next.x} ${next.y} ${next.width} ${next.height}`);

    if (t < 1) {
      requestAnimationFrame(frame);
    } else {
      resolve(to);
    }
  };

  requestAnimationFrame(frame);
  return promise;
};
