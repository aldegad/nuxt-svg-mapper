export const blobToBase64 = (blob: Blob) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      resolve(reader.result); // base64 문자열 (data URL 포함)
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
};
