import { base64ToBlob } from "./base64Toblob";
import type { PolyMapData, RawMap, RawPolyMapData, RawPolygonImage } from "../schemas/polyMapData";
import type { ModelCanvas, ModelMapImage, ModelPolygon, ModelPolygonImage } from "../schemas/stores";

export const parsePolyMapData = (data: RawPolyMapData): PolyMapData => {
  const { canvas, polygons } = data;
  const newCanvas: ModelCanvas = {
    ...canvas,
    map: parseMap(canvas.map),
  };

  const newPolygons: ModelPolygon[] = polygons.map((polygon) => {
    return {
      ...polygon,
      image: parsePolygonImage(polygon.image),
    };
  });

  return {
    canvas: newCanvas,
    polygons: newPolygons,
  };
};

const parseMap = (map: RawMap | null): ModelMapImage | null => {
  if (!map) return null;
  const blob = base64ToBlob(map.base64);
  const url = URL.createObjectURL(blob);
  // eslint-disable-next-line
  const canvas: any = {
    ...map,
    blob,
    url,
  };
  delete canvas.base64;
  return canvas;
};

const parsePolygonImage = (image: RawPolygonImage | null): ModelPolygonImage | null => {
  if (!image) return null;
  const blob = base64ToBlob(image.base64);
  const url = URL.createObjectURL(blob);
  // eslint-disable-next-line
  const polygonImage: any = {
    ...image,
    blob,
    url,
  };
  delete polygonImage.base64;
  return polygonImage;
};
