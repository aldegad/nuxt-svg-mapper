import { useCaptureEvents } from "./useCaptureEvents";
import { useSetCoreEvents } from "./useSetCoreEvents";
import { useShortcutsEvents } from "./useShortcutsEvents";

export const useCapture = () => {
  const { createCaptureEvents } = useCaptureEvents();
  const { createShortcutEvents } = useShortcutsEvents();
  useSetCoreEvents();

  const createCapture = (el: HTMLElement) => {
    const removeCaptureEvents = createCaptureEvents(el);
    const removeShortcutEvents = createShortcutEvents(el);
    return () => {
      removeCaptureEvents();
      removeShortcutEvents();
    };
  };

  return {
    createCapture,
  };
};
