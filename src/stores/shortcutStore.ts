import type { ShortcutState } from "~svg-mapper/schemas/shorcut";

export const useShortcutStore = defineStore("shortcut", {
  state: () => ({
    shift: false,
    shortcut: null as ShortcutState | null,
  }),
  actions: {
    setShift(isShift: boolean) {
      this.shift = isShift;
    },
    triggerShortcut(shortcut: ShortcutState) {
      this.shortcut = shortcut;
    },
    clearShortcut() {
      this.shortcut = null;
    },
  },
});
