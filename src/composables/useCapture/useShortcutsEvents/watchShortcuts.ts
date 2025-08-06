import { useStore } from "~svg-mapper/composables/useStore";
import type { ShortcutState } from "~svg-mapper/schemas/shorcut";

export function watchShortcuts(callback: (shortcut: ShortcutState) => void) {
  const { shortcutStore } = useStore();
  const { shortcut } = storeToRefs(shortcutStore);

  watch(shortcut, (newShortcut) => {
    if (newShortcut) {
      console.log("shortcut", newShortcut);
      callback(newShortcut);
    }
  });
}
