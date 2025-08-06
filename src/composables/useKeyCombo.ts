import { hangulQwertyMap } from "~svg-mapper/utils";

export const useKeyCombo = () => {
  const keyCombo = ref<string[]>([]);

  const currentKeyCombo = computed(() => {
    return keyCombo.value;
  });

  const normalizeKey = (e: KeyboardEvent): string => {
    // 특수 키 처리
    if (e.key.toLowerCase() === "control") return "Control";
    if (e.key.toLowerCase() === "meta") return "Meta";
    if (e.key.toLowerCase() === "alt") return "Alt";
    if (e.key.toLowerCase() === "shift") return "Shift";
    if (e.key.toLowerCase() === "backspace") return "Backspace";
    if (e.key.toLowerCase() === "escape") return "Escape";
    if (e.key.toLowerCase() === "tab") return "Tab";
    if (e.key === " ") return "Space";

    const lowerKey = e.key.toLowerCase();
    return hangulQwertyMap[lowerKey] || lowerKey;
  };

  const addKeyCombo = (e: KeyboardEvent) => {
    const key = normalizeKey(e);
    const uniqueKeys = Array.from(new Set([...keyCombo.value, key]));
    keyCombo.value = uniqueKeys;
  };

  const removeKeyCombo = (e: KeyboardEvent) => {
    const key = normalizeKey(e);
    keyCombo.value = keyCombo.value.filter((_key) => _key !== key);
    console.log("removeKeyCombo:key/remainKeys", key, toRaw(keyCombo.value));
  };

  const clearKeyCombo = () => {
    keyCombo.value = [];
  };

  return {
    currentKeyCombo,
    addKeyCombo,
    removeKeyCombo,
    clearKeyCombo,
  };
};
