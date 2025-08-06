export enum PolygonsMenuName {
  RENAME = "rename",
  UNGROUP = "ungroup",
  DELETE = "delete",
}

export const polygonsMenuModel = [
  {
    label: "Rename",
    icon: "lucide:pencil",
    name: PolygonsMenuName.RENAME,
  },
  {
    label: "UnGroup",
    icon: "lucide:ungroup",
    name: PolygonsMenuName.UNGROUP,
  },
  {
    label: "Delete",
    icon: "lucide:trash",
    name: PolygonsMenuName.DELETE,
  },
];
