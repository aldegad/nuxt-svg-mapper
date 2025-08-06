export enum CanvasesMenuName {
  RENAME = "rename",
  DELETE = "delete",
}

export const canvasesMenuModel = [
  {
    label: "Rename",
    icon: "lucide:pencil",
    name: CanvasesMenuName.RENAME,
  },
  {
    label: "Delete",
    icon: "lucide:trash",
    name: CanvasesMenuName.DELETE,
  },
];
