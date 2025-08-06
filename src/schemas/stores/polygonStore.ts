import type { Coords } from "../coords";

export enum AlignType {
  TOP = "top",
  VERTICAL_CENTER = "vertical-center",
  BOTTOM = "bottom",
  HORIZONTAL_CENTER = "horizontal-center",
  LEFT = "left",
  RIGHT = "right",
  HORIZONTAL_DISTRIBUTE_CENTER = "horizontal-distribute-center",
  VERTICAL_DISTRIBUTE_CENTER = "vertical-distribute-center",
}

export type ModelPolygon = {
  id: string; // uuid
  canvasId: string; // uuid - foreign key to canvasStore.id
  groupId: string | null; // uuid - foreign key to polygonStore.id
  name: string;
  coords: Coords;
  fillColor: string | null;
  fillOpacity: number | null;
  strokeColor: string | null;
  strokeOpacity: number | null;
  strokeWidth: number | null;
  order: number;
  image: ModelPolygonImage | null;
  data: {
    [key: string]: string;
  };
};

export type ModelPolygonImage = {
  url: string;
  blob: Blob;
  x: number;
  y: number;
  width: number;
  height: number;
};

export type ModelPolygonTree = ModelPolygon & {
  children: ModelPolygonTree[];
};
