export type Shortcut = {
  keys: string[];
  state: ShortcutState | null;
};

export enum ShortcutState {
  IDLE = "IDLE",
  // polygon
  REMOVE = "REMOVE",
  COPY = "COPY",
  PASTE = "PASTE",
  COPY_PASTE = "COPY_PASTE",
  DUPLICATE = "DUPLICATE",
  GROUP = "GROUP",
  // tools
  TOOL_POINTER = "TOOL_POINTER",
  TOOL_TRANSFORM = "TOOL_TRANSFORM",
  TOOL_SQUARE = "TOOL_SQUARE",
  TOOL_CIRCLE = "TOOL_CIRCLE",
  TOOL_PEN = "TOOL_PEN",
  TOOL_HAND = "TOOL_HAND",
  TOOL_ZOOM_IN = "TOOL_ZOOM_IN",
  TOOL_ZOOM_OUT = "TOOL_ZOOM_OUT",
  // history
  UNDO = "UNDO",
  REDO = "REDO",
  // etc
  LAYER_CHANGE = "LAYER_CHANGE",
}
