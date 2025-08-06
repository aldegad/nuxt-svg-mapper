import { promiseResolvers } from "./promiseResolvers";

export interface ImageInfo {
  name: string;
  blob: Blob;
  url: string;
  width: number;
  height: number;
  mime: string;
  extension: string;
}

const getImageSize = (file: File): Promise<{ width: number; height: number }> => {
  const { promise, resolve } = promiseResolvers<{
    width: number;
    height: number;
  }>();
  const img = new Image();
  img.onload = () => {
    resolve({ width: img.width, height: img.height });
  };
  img.src = URL.createObjectURL(file);
  return promise;
};

const getFileInfo = (
  file: File,
): Promise<{
  name: string;
  blob: Blob;
  url: string;
  mime: string;
  extension: string;
}> => {
  const { promise, resolve } = promiseResolvers<{
    name: string;
    blob: Blob;
    url: string;
    mime: string;
    extension: string;
  }>();
  const reader = new FileReader();
  reader.onload = (e) => {
    const base64 = e.target?.result as string;
    const arr = base64.split(",");
    const mime = arr[0].match(/:(.*?);/)?.[1] || "";
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    const blob = new Blob([u8arr], { type: mime });
    const url = URL.createObjectURL(blob);
    // 확장자 추출
    let name = file.name;
    let extension = "";
    if (file.name && file.name.includes(".")) {
      const nameParts = file.name.split(".");
      name = nameParts.slice(0, -1).join(".");
      extension = nameParts.pop()?.toLowerCase() || "";
    } else if (mime) {
      extension = mime.split("/").pop() || "";
    }
    resolve({ name, blob, url, mime, extension });
  };
  reader.readAsDataURL(file);
  return promise;
};

export const getImageFileInfo = async (file: File): Promise<ImageInfo> => {
  const { promise, resolve } = promiseResolvers<ImageInfo>();
  const [imageInfo, fileInfo] = await Promise.all([getImageSize(file), getFileInfo(file)]);
  resolve({
    name: fileInfo.name,
    blob: fileInfo.blob,
    url: fileInfo.url,
    width: imageInfo.width,
    height: imageInfo.height,
    mime: fileInfo.mime,
    extension: fileInfo.extension,
  });
  return promise;
};
