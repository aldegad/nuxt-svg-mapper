export enum ProjectMenuName {
  RENAME = "rename",
  DELETE = "delete",
}

export const projectMenuModel = [
  {
    label: "Rename",
    icon: "lucide:pencil",
    name: ProjectMenuName.RENAME,
  },
  {
    label: "Delete",
    icon: "lucide:trash",
    name: ProjectMenuName.DELETE,
  },
];
