import { useKeyCombo } from "~svg-mapper/composables/useKeyCombo";
import { ShortcutState } from "~svg-mapper/schemas/shorcut";
import { preventShortcut } from "./preventShortcut";

export const useShortcut = () => {
  let removeShortcutEvents: () => void;
  const { currentKeyCombo, addKeyCombo, removeKeyCombo, clearKeyCombo } = useKeyCombo();
  const state = ref<ShortcutState>(ShortcutState.IDLE);

  const shortcut = reactive({
    keys: currentKeyCombo,
    state,
  });

  const handleKeyDown = (e: KeyboardEvent) => {
    if (preventShortcut(e)) return;
    e.preventDefault();
    if (e.repeat) return;
    addKeyCombo(e);
  };

  const handleKeyUp = (e: KeyboardEvent) => {
    e.preventDefault();
    removeKeyCombo(e);
    clearKeyCombo();
  };

  const createShortcutEvents = () => {
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    const removeShortcutEvents = () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };

    return removeShortcutEvents;
  };

  onMounted(() => {
    removeShortcutEvents = createShortcutEvents();
  });

  onBeforeUnmount(() => {
    removeShortcutEvents();
  });

  return {
    shortcut,
  };
};
