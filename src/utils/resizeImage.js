// Resizes an image file down to fit within maxDimension (keeping aspect
// ratio) and returns a compressed base64 JPEG data URL. Keeps avatar
// uploads small enough (~20-40KB) to store directly on the user document
// instead of needing a separate file-storage/CDN setup.
export const resizeImageToBase64 = (file, maxDimension = 300, quality = 0.85) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (event) => {
      const img = new Image();

      img.onload = () => {
        let { width, height } = img;

        if (width > height && width > maxDimension) {
          height = Math.round((height * maxDimension) / width);
          width = maxDimension;
        } else if (height > maxDimension) {
          width = Math.round((width * maxDimension) / height);
          height = maxDimension;
        }

        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        canvas.getContext("2d").drawImage(img, 0, 0, width, height);

        resolve(canvas.toDataURL("image/jpeg", quality));
      };

      img.onerror = () => reject(new Error("Could not read this image"));
      img.src = event.target.result;
    };

    reader.onerror = () => reject(new Error("Could not read this file"));
    reader.readAsDataURL(file);
  });

export default resizeImageToBase64;