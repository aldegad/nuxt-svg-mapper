import { GestureState } from "~svg-mapper/schemas/gesture";
import type { Gesture } from "~svg-mapper/schemas/gesture";
import { PolyEvents } from "~svg-mapper/schemas/polyEvents";
import type { PolyMapData } from "~svg-mapper/schemas/polyMapData";
import { ShortcutState } from "~svg-mapper/schemas/shorcut";
import type { Shortcut } from "~svg-mapper/schemas/shorcut";

type UseEventDispatcherProps = {
  gesture: Gesture;
  shortcut: Shortcut;
  polyMapData: Ref<PolyMapData | null>;
};

export const useEventDispatcher = ({ gesture, shortcut }: UseEventDispatcherProps) => {
  const watchEvents = (callback: (e: PolyEvents) => void) => {
    watch([shortcut, gesture], () => {
      if (shortcut.state === ShortcutState.IDLE && gesture.state === GestureState.WHEEL) {
        callback(PolyEvents.VIEWPORT_ZOOM);
        return;
      }
      if (shortcut.state === ShortcutState.IDLE && gesture.state === GestureState.HOLD_MOVE) {
        callback(PolyEvents.VIEWPORT_MOVE);
        return;
      }
      if (shortcut.state === ShortcutState.IDLE && gesture.state === GestureState.IDLE) {
        callback(PolyEvents.POINTER_MOVE);
        return;
      }
      if (shortcut.state === ShortcutState.IDLE && gesture.state === GestureState.CLICK) {
        callback(PolyEvents.POINTER_SELECT);
        return;
      }
    });
  };

  return {
    watchEvents,
  };
};
