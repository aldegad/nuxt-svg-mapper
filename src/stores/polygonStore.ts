import { del, get, set } from "idb-keyval";
import { cloneDeep } from "lodash";
import { safeRandomUUID } from "@aldegad/nuxt-core";
import { StoreKey } from "~svg-mapper/schemas";
import type { AlignType, Coord, Coords, ModelPolygon, ModelPolygonImage } from "~svg-mapper/schemas";
import { toRawCoords } from "~svg-mapper/utils";
import { getAABBRect } from "~svg-mapper/utils/calc";
import { getAABBAnchors } from "~svg-mapper/utils/calc/getAABBAnchors";
import { alignPolygons } from "~svg-mapper/utils/polygon/alignPolygons";
import { movePolygons } from "~svg-mapper/utils/polygon/movePolygons";
import { reorderPolygons, reorderPolygonsInCanvas } from "~svg-mapper/utils/polygon/reorderPolygons";

export const usePolygonStore = defineStore("polygon", {
  state: () => ({
    polygons: [] as ModelPolygon[],
  }),
  actions: {
    addPolygon(canvasId: string, coords: Coords) {
      const rawCoords = toRawCoords(coords);
      const newPolygon: ModelPolygon = {
        id: safeRandomUUID(),
        name: "polygon",
        canvasId,
        groupId: null,
        fillColor: "#818cf8", // indigo-400
        fillOpacity: 0.3,
        strokeColor: "#818cf8", // indigo-400
        strokeOpacity: 1,
        strokeWidth: 1,
        coords: rawCoords,
        order: this.polygons.length,
        image: null,
        data: {
          "정보1": "",
          "정보2": "",
        },
      };
      this.polygons.push(newPolygon);
      this.polygons = reorderPolygonsInCanvas(this.polygons, canvasId);
      set(StoreKey.POLYGON, cloneDeep(this.polygons));
      return newPolygon;
    },
    addPolygons(canvasId: string, polygons: ModelPolygon[]) {
      this.polygons.push(...polygons.map((p) => ({ ...p, canvasId })));
      this.polygons = reorderPolygonsInCanvas(this.polygons, canvasId);
      set(StoreKey.POLYGON, cloneDeep(this.polygons));
    },
    async removePolygon(id: string) {
      const idx = this.polygons.findIndex((p) => p.id === id);
      if (idx !== -1) {
        const canvasId = this.polygons[idx].canvasId;
        const removedPolygon = this.polygons.splice(idx, 1)[0];
        this.polygons.forEach((p) => {
          if (p.groupId === id) {
            p.groupId = null;
            p.order = removedPolygon.order;
          }
        });
        this.polygons = reorderPolygonsInCanvas(this.polygons, canvasId);
      }
      await set(StoreKey.POLYGON, cloneDeep(this.polygons));
    },
    async loadPolygons() {
      const loaded = await get(StoreKey.POLYGON);
      if (loaded !== undefined) {
        const polygonsWithImageUrl: ModelPolygon[] = loaded.map((p: ModelPolygon) => ({
          ...p,
          image: p.image
            ? {
                ...p.image,
                url: URL.createObjectURL(p.image.blob),
              }
            : null,
        }));

        this.polygons = reorderPolygons(polygonsWithImageUrl);
      } else {
        this.polygons = [];
      }
    },
    async clearPolygons() {
      this.polygons = [];
      await del(StoreKey.POLYGON);
    },
    async setPointToPolygon(polygonId: string, coord: Coord) {
      const polygon = this.polygons.find((p) => p.id === polygonId);
      if (!polygon) return;
      polygon.coords.push(coord);
      await set(StoreKey.POLYGON, cloneDeep(this.polygons));
    },
    async renamePolygon(polygonId: string, name: string) {
      const polygon = this.polygons.find((p) => p.id === polygonId);
      if (!polygon) return;
      polygon.name = name;
      await set(StoreKey.POLYGON, cloneDeep(this.polygons));
    },
    movePolygon(polygonId: string, coords: Coords) {
      const polygon = this.polygons.find((p) => p.id === polygonId);
      if (!polygon) return;
      polygon.coords = coords;
      set(StoreKey.POLYGON, cloneDeep(this.polygons));
      return polygon;
    },
    movePolygons(polygonIds: string[], deltaX: number, deltaY: number) {
      const polygons = this.polygons.filter((p) => polygonIds.includes(p.id));
      const movedPolygons = movePolygons(polygons, deltaX, deltaY);
      this.polygons = this.polygons.map((p) => movedPolygons.find((mp) => mp.id === p.id) || p);
      set(StoreKey.POLYGON, cloneDeep(this.polygons));
      return movedPolygons;
    },
    setPolygons(polygons: ModelPolygon[]) {
      this.polygons = this.polygons.map((p) => polygons.find((mp) => mp.id === p.id) || p);
      set(StoreKey.POLYGON, cloneDeep(this.polygons));
    },
    replaceCanvasPolygons(canvasId: string, polygons: ModelPolygon[]) {
      const canvasPolygons = this.polygons.filter((p) => p.canvasId === canvasId);
      const newPolygons = polygons.filter((p) => !canvasPolygons.some((cp) => cp.id === p.id));
      this.polygons = this.polygons
        .map((p) => (p.canvasId === canvasId ? polygons.find((mp) => mp.id === p.id) || p : p))
        .filter((p) => {
          if (p.canvasId === canvasId) {
            return polygons.some((mp) => mp.id === p.id);
          } else {
            return true;
          }
        })
        .concat(newPolygons);
      set(StoreKey.POLYGON, cloneDeep(this.polygons));
    },
    alignPolygons(polygonIds: string[], alignType: AlignType) {
      const polygons = this.polygons.filter((p) => polygonIds.includes(p.id));
      const alignedPolygons = alignPolygons(polygons, alignType);
      this.polygons = this.polygons.map((p) => alignedPolygons.find((ap) => ap.id === p.id) || p);
      set(StoreKey.POLYGON, cloneDeep(this.polygons));
      return alignedPolygons;
    },
    async setFillColor(polygonId: string, fillColor: string, fillOpacity: number) {
      const polygon = this.polygons.find((p) => p.id === polygonId);
      if (!polygon) return;
      polygon.fillColor = fillColor;
      polygon.fillOpacity = fillOpacity;
      await set(StoreKey.POLYGON, cloneDeep(this.polygons));
    },
    async setFillColors(polygonIds: string[], fillColor: string, fillOpacity: number) {
      const polygons = this.polygons.filter((p) => polygonIds.includes(p.id));
      polygons.forEach((p) => {
        p.fillColor = fillColor;
        p.fillOpacity = fillOpacity;
      });
      await set(StoreKey.POLYGON, cloneDeep(this.polygons));
    },
    async setStrokeColor(polygonId: string, strokeColor: string, strokeOpacity: number) {
      const polygon = this.polygons.find((p) => p.id === polygonId);
      if (!polygon) return;
      polygon.strokeColor = strokeColor;
      polygon.strokeOpacity = strokeOpacity;
      await set(StoreKey.POLYGON, cloneDeep(this.polygons));
    },
    async setStrokeColors(polygonIds: string[], strokeColor: string, strokeOpacity: number) {
      const polygons = this.polygons.filter((p) => polygonIds.includes(p.id));
      polygons.forEach((p) => {
        p.strokeColor = strokeColor;
        p.strokeOpacity = strokeOpacity;
      });
      await set(StoreKey.POLYGON, cloneDeep(this.polygons));
    },
    async setStrokeWidths(polygonIds: string[], strokeWidth: number) {
      const polygons = this.polygons.filter((p) => polygonIds.includes(p.id));
      polygons.forEach((p) => {
        p.strokeWidth = strokeWidth;
      });
      await set(StoreKey.POLYGON, cloneDeep(this.polygons));
    },
    async addImageToPolygon(polygonId: string, image: ModelPolygonImage) {
      const polygon = this.polygons.find((p) => p.id === polygonId);
      if (!polygon) return;
      polygon.image = image;
      await set(StoreKey.POLYGON, cloneDeep(this.polygons));
    },
    async addImageToPolygons(polygonIds: string[], image: ModelPolygonImage) {
      const polygons = this.polygons.filter((p) => polygonIds.includes(p.id));
      polygons.forEach((p) => {
        const coverRect = getAABBRect(p.coords);
        p.image = {
          ...image,
          x: coverRect.x,
          y: coverRect.y,
          width: coverRect.width,
          height: coverRect.height,
        };
      });
      await set(StoreKey.POLYGON, cloneDeep(this.polygons));
    },
    async removeImageFromPolygon(polygonId: string) {
      const polygon = this.polygons.find((p) => p.id === polygonId);
      if (!polygon) return;
      polygon.image = null;
      await set(StoreKey.POLYGON, cloneDeep(this.polygons));
    },
    async removeImagesFromPolygons(polygonIds: string[]) {
      const polygons = this.polygons.filter((p) => polygonIds.includes(p.id));
      polygons.forEach((p) => {
        p.image = null;
      });
      await set(StoreKey.POLYGON, cloneDeep(this.polygons));
    },
    async groupPolygons(polygonIds: string[]) {
      const polygons = this.polygons.filter((p) => polygonIds.includes(p.id));
      if (polygons.length === 0) return;

      // 모든 좌표를 합쳐서 경계 계산
      const allCoords = polygons.flatMap((p) => p.coords);
      const groupCoords = getAABBAnchors(allCoords, {
        padding: 8,
        dotCount: 4,
      });

      // 그룹 폴리곤 생성
      const groupId = safeRandomUUID();
      const canvasId = polygons[0].canvasId;
      const newPolygon = {
        id: groupId,
        name: "group-polygon",
        canvasId,
        groupId: null,
        coords: groupCoords,
        fillColor: "#818cf8", // indigo-400
        fillOpacity: 0.3,
        strokeColor: "#818cf8", // indigo-400
        strokeOpacity: 1,
        strokeWidth: 2,
        order: this.polygons.length,
        image: null,
        data: {
          type: "type1",
          type2: "type2",
        },
      };
      this.polygons.push(newPolygon);

      // 기존 폴리곤들의 groupId를 새 그룹 폴리곤 id로 설정
      polygons.forEach((p) => {
        p.groupId = groupId;
      });

      this.polygons = reorderPolygonsInCanvas(this.polygons, canvasId);
      await set(StoreKey.POLYGON, cloneDeep(this.polygons));
    },
    async ungroupPolygons(polygonId: string) {
      const motherPolygon = this.polygons.find((p) => p.id === polygonId);
      if (!motherPolygon) return;

      this.polygons.forEach((p) => {
        if (p.groupId === motherPolygon.id) {
          p.groupId = null;
          p.order = motherPolygon.order;
        }
      });

      this.polygons = reorderPolygonsInCanvas(this.polygons, motherPolygon.canvasId);
      await set(StoreKey.POLYGON, cloneDeep(this.polygons));
    },
    async setPolygonData(polygonId: string, data: { type?: string; type2?: string }) {
      const polygon = this.polygons.find((p) => p.id === polygonId);
      if (!polygon) return;
      polygon.data = {
        type: data.type ?? polygon.data.type,
        type2: data.type2 ?? polygon.data.type2,
      };
      await set(StoreKey.POLYGON, cloneDeep(this.polygons));
    },
  },
});
