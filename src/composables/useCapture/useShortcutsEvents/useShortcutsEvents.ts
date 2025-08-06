import { useStore } from "~svg-mapper/composables/useStore";
import { ShortcutState } from "~svg-mapper/schemas/shorcut";
import { ItemCaptureState, LayerType } from "~svg-mapper/schemas/stores";
import { ToolType } from "~svg-mapper/schemas/tools";
import { scaleFromWheel } from "~svg-mapper/utils";
import { scaleViewBox } from "~svg-mapper/utils/calc";
import { preventShortcuts } from "./preventShortcuts";
import { watchShortcuts } from "./watchShortcuts";
import { useKeyCombo } from "../../useKeyCombo";
import { useCopyPastEvents } from "../useCopyPastEvents";

export const useShortcutsEvents = () => {
  const {
    shortcutStore: { triggerShortcut, clearShortcut, setShift },
    captureStore: { capturedItems, capturedMouse },
    polygonStore: { removePolygon, groupPolygons },
    currentStore: {
      currentTool,
      currentLayer,
      currentViewBox,
      setCurrentTool,
      setTempTool,
      clearTempTool,
      setCurrentLayer,
      setCurrentViewBox,
    },
    historyStore: { undo, redo, snapshot, push },
  } = useStore();

  const { currentKeyCombo, addKeyCombo, removeKeyCombo, clearKeyCombo } = useKeyCombo();
  const { copyEvents, pasteEvents, duplicateEvents } = useCopyPastEvents();

  const handleKeyDown = (e: KeyboardEvent) => {
    if (preventShortcuts(e)) return;
    e.preventDefault();
    if (e.repeat) return;
    addKeyCombo(e);
    const keys = currentKeyCombo.value;
    console.log("keydown:e.key", e.key);
    console.log("keydown:currentKeyCombo", keys);

    if (keys.includes("Shift")) {
      setShift(true);
    }

    if (keys.includes("Meta") && keys.includes("Shift") && keys.includes("z")) {
      triggerShortcut(ShortcutState.REDO);
      return;
    }

    if (keys.includes("Meta") && keys.includes("z")) {
      triggerShortcut(ShortcutState.UNDO);
      return;
    }

    if (keys.includes("Escape") || keys.includes("Backspace")) {
      triggerShortcut(ShortcutState.REMOVE);
      return;
    }

    if (keys.includes("Meta") && keys.includes("c")) {
      triggerShortcut(ShortcutState.COPY);
      return;
    }

    if (keys.includes("Meta") && keys.includes("v")) {
      triggerShortcut(ShortcutState.PASTE);
      return;
    }

    if (keys.includes("Meta") && keys.includes("d")) {
      triggerShortcut(ShortcutState.COPY_PASTE);
      return;
    }

    if (keys.includes("Meta") && keys.includes("g")) {
      triggerShortcut(ShortcutState.GROUP);
      return;
    }

    if (keys.includes("Alt")) {
      if (currentTool.value === ToolType.POINTER) {
        triggerShortcut(ShortcutState.DUPLICATE);
      }
      return;
    }

    if (keys.includes("Tab")) {
      triggerShortcut(ShortcutState.LAYER_CHANGE);
      return;
    }

    if (keys.includes("v")) {
      triggerShortcut(ShortcutState.TOOL_POINTER);
      return;
    }
    if (keys.includes("t")) {
      triggerShortcut(ShortcutState.TOOL_TRANSFORM);
      return;
    }
    if (keys.includes("m")) {
      triggerShortcut(ShortcutState.TOOL_SQUARE);
      return;
    }
    if (keys.includes("c")) {
      triggerShortcut(ShortcutState.TOOL_CIRCLE);
      return;
    }
    if (keys.includes("Meta") && keys.includes("Space")) {
      triggerShortcut(ShortcutState.TOOL_ZOOM_OUT);
      return;
    }
    if (keys.includes("Control") && keys.includes("Space")) {
      triggerShortcut(ShortcutState.TOOL_ZOOM_IN);
      return;
    }
    if (keys.includes("Space")) {
      triggerShortcut(ShortcutState.TOOL_HAND);
      return;
    }
  };

  const handleKeyUp = (e: KeyboardEvent) => {
    console.log("keyup:e.key", e.key);
    e.preventDefault();
    removeKeyCombo(e);
    const keys = currentKeyCombo.value;

    if (!keys.includes("Shift")) {
      setShift(false);
    }

    if (keys.includes("Space") && keys.includes("Meta")) {
      triggerShortcut(ShortcutState.TOOL_ZOOM_OUT);
      return;
    }

    if (keys.includes("Space") && keys.includes("Control")) {
      triggerShortcut(ShortcutState.TOOL_ZOOM_IN);
      return;
    }

    if (keys.includes("Space")) {
      triggerShortcut(ShortcutState.TOOL_HAND);
      return;
    }

    if (keys.includes("Meta")) {
      return;
    }
    clearTempTool();
    clearShortcut();
    clearKeyCombo();
  };

  const handleWheel = (e: WheelEvent) => {
    const metaKey = currentKeyCombo.value.includes("Meta");
    if (metaKey) {
      e.preventDefault();

      const scale = scaleFromWheel(e);
      const newViewBox = scaleViewBox({
        viewBox: currentViewBox.value,
        center: capturedMouse.value.svgOffset,
        scale,
      });
      setCurrentViewBox(newViewBox);
    }
  };

  watchShortcuts((shortCut) => {
    switch (shortCut) {
      // meta 키가 눌린 상태에서 다른 키를 떼면, keyup 이벤트가 발생하지 않음.
      case ShortcutState.UNDO:
        undo();
        removeKeyCombo({ key: "z" } as KeyboardEvent);
        clearShortcut();
        break;
      case ShortcutState.REDO:
        redo();
        removeKeyCombo({ key: "z" } as KeyboardEvent);
        clearShortcut();
        break;
      case ShortcutState.COPY:
        copyEvents();
        removeKeyCombo({ key: "c" } as KeyboardEvent);
        clearShortcut();
        break;
      case ShortcutState.PASTE:
        pasteEvents();
        removeKeyCombo({ key: "v" } as KeyboardEvent);
        clearShortcut();
        break;
      case ShortcutState.COPY_PASTE:
        duplicateEvents();
        removeKeyCombo({ key: "d" } as KeyboardEvent);
        clearShortcut();
        break;
      case ShortcutState.GROUP:
        groupPolygons(capturedItems.value.map((item) => item.item.id));
        break;
      case ShortcutState.DUPLICATE:
        setTempTool(ToolType.DUPLICATE);
        break;
      case ShortcutState.REMOVE:
        snapshot();
        push();
        capturedItems.value = capturedItems.value.filter((item) => {
          return item.state === ItemCaptureState.SELECT;
        });
        capturedItems.value.forEach((item) => {
          removePolygon(item.item.id);
        });
        capturedItems.value = [];
        removeKeyCombo({ key: "Escape" } as KeyboardEvent);
        removeKeyCombo({ key: "Backspace" } as KeyboardEvent);
        break;
      case ShortcutState.LAYER_CHANGE:
        setCurrentLayer(currentLayer.value === LayerType.MAP ? LayerType.DETAIL : LayerType.MAP);
        break;
      case ShortcutState.TOOL_POINTER:
        setCurrentTool(ToolType.POINTER);
        break;
      case ShortcutState.TOOL_TRANSFORM:
        setCurrentTool(ToolType.TRANSFORM);
        break;
      case ShortcutState.TOOL_SQUARE:
        setCurrentTool(ToolType.SQUARE);
        break;
      case ShortcutState.TOOL_CIRCLE:
        setCurrentTool(ToolType.CIRCLE);
        break;
      case ShortcutState.TOOL_PEN:
        setCurrentTool(ToolType.PEN);
        break;
      case ShortcutState.TOOL_HAND:
        setTempTool(ToolType.HAND);
        break;
      case ShortcutState.TOOL_ZOOM_IN:
        setTempTool(ToolType.ZOOM_IN);
        break;
      case ShortcutState.TOOL_ZOOM_OUT:
        setTempTool(ToolType.ZOOM_OUT);
        break;
    }
  });

  const createShortcutEvents = (_el: HTMLElement) => {
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    _el.addEventListener("wheel", handleWheel, { passive: false });

    const removeShortcutEvents = () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
      _el.removeEventListener("wheel", handleWheel);
    };

    return removeShortcutEvents;
  };

  return {
    createShortcutEvents,
  };
};
