export type ModelCanvas = {
  id: string; // uuid
  projectId: string; // uuid - foreign key to projectStore.id
  name: string;
  width: number; // width of the canvas
  height: number; // height of the canvas
  viewBox: ModelViewBox;
  map: ModelMapImage | null;
};

export type ModelViewBox = {
  x: number;
  y: number;
  width: number;
  height: number;
};

export type ModelMapImage = {
  name: string;
  url: string;
  blob: Blob;
  originalWidth: number;
  originalHeight: number;
  x: number;
  y: number;
  width: number;
  height: number;
  locked: boolean;
};
