import type { Coords } from "~svg-mapper/schemas/coords";
import { ItemCaptureState } from "~svg-mapper/schemas/stores";
import type { ModelCapture, ModelCapturedPolygon } from "~svg-mapper/schemas/stores";
import type { ModelPolygon } from "~svg-mapper/schemas/stores/polygonStore";
import { isCaptured } from "~svg-mapper/utils/calc";
import { findRootGroupId } from "~svg-mapper/utils/polygon/findRootGroupId";

interface FindCapturedItemProps {
  polygons: ModelPolygon[];
  capturedMouse: ModelCapture;
  capturedItems?: ModelCapturedPolygon[];
  remainCaptureStates?: ItemCaptureState[];
}

export const findCapturedItem = ({
  polygons,
  capturedMouse,
}: FindCapturedItemProps): ModelCapturedPolygon | undefined => {
  // 현재 마우스 위치에서 캡처된 폴리곤들
  const newCapturedPolygons = polygons.filter((polygon) => {
    let coordies: Coords = [];
    coordies = polygon.coords;
    return isCaptured(capturedMouse, coordies);
  });

  if (!newCapturedPolygons.length) {
    return undefined;
  }

  // 1. 캡처된 애들 중 그룹이 있는 애들은 최상위 엄마를 찾아옴
  const rootGroupMap: Record<string, ModelPolygon[]> = {};
  newCapturedPolygons.forEach((poly) => {
    const rootId = findRootGroupId(poly, polygons);
    if (!rootGroupMap[rootId]) rootGroupMap[rootId] = [];
    rootGroupMap[rootId].push(poly);
  });

  // 2. 최상위 엄마들끼리 order를 비교하여 가장 order가 높은 객체를 찾음
  const rootGroups = Object.keys(rootGroupMap)
    .map((id) => polygons.find((p) => p.id === id)!)
    .filter(Boolean)
    .sort((a, b) => b.order - a.order);
  const topRoot = rootGroups[0];
  if (!topRoot) return undefined;

  // 3. 해당 객체의 자식이 캡처가 되었는지 확인
  const capturedChildren = rootGroupMap[topRoot.id].filter((poly) => poly.groupId === topRoot.id);
  if (capturedChildren.length > 0) {
    // 3-1. 자식이 캡처되었다면, 그 중 order가 가장 높은 객체를 리턴
    const topChild = capturedChildren.sort((a, b) => b.order - a.order)[0];
    return {
      state: ItemCaptureState.HOVER,
      item: topChild,
    };
  } else {
    // 3-2. 자식이 캡처되지 않았다면, 해당 그룹(엄마) 객체를 리턴
    return {
      state: ItemCaptureState.HOVER,
      item: topRoot,
    };
  }
};
