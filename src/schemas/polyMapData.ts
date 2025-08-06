import type { ModelCanvas, ModelMapImage, ModelPolygon, ModelPolygonImage } from "./stores";

export type PolyMapData = {
  canvas: ModelCanvas;
  polygons: ModelPolygon[];
};

export type RawCanvas = Omit<ModelCanvas, "map"> & {
  map: RawMap | null;
};

export type RawMap = Omit<ModelMapImage, "blob"> & {
  blob: null;
  base64: string;
};

export type RawPolygon = Omit<ModelPolygon, "image"> & {
  image: RawPolygonImage | null;
  children: RawPolygon[];
};

export type RawPolygonImage = Omit<ModelPolygonImage, "blob"> & {
  blob: null;
  base64: string;
};

export type RawPolyMapData = {
  canvas: RawCanvas;
  polygons: RawPolygon[];
};
