export enum ToolType {
  POINTER = "pointer",
  TRANSFORM = "transform",
  SQUARE = "square",
  CIRCLE = "circle",
  PEN = "pen",
  HAND = "hand",
  ZOOM_IN = "zoom-in",
  ZOOM_OUT = "zoom-out",
  // only temp tool
  DUPLICATE = "duplicate",
}

export type Tool = {
  name: string;
  icon: string;
  type: ToolType;
};

export const tools: (Tool | null)[] = [
  {
    name: "포인터",
    icon: "lucide:mouse-pointer-2",
    type: ToolType.POINTER,
  },
  {
    name: "변형",
    icon: "lucide:square-dashed-mouse-pointer",
    type: ToolType.TRANSFORM,
  },
  null,
  {
    name: "사각형",
    icon: "lucide:square",
    type: ToolType.SQUARE,
  },
  {
    name: "원",
    icon: "lucide:circle",
    type: ToolType.CIRCLE,
  },
  {
    name: "펜",
    icon: "lucide:pen-tool",
    type: ToolType.PEN,
  },
  {
    name: "캔버스 이동",
    icon: "lucide:hand",
    type: ToolType.HAND,
  },
  {
    name: "확대",
    icon: "lucide:zoom-in",
    type: ToolType.ZOOM_IN,
  },
  {
    name: "축소",
    icon: "lucide:zoom-out",
    type: ToolType.ZOOM_OUT,
  },
];
